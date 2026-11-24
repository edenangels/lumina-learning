#!/usr/bin/env node
/* ============================================================================
   vimeo-transcribe.mjs — transcribe a course straight from Vimeo, via the API.

     node scripts/vimeo-transcribe.mjs land-team-journey

   WHY THIS REPLACES THE OLD PATH
   transcribe-pipeline.py matched local SSD footage to modules by duration, and
   fell back to scraping the embed. Both were workarounds for having no Vimeo
   token. With a token the video files are addressable directly, which removes
   the guessing: the module's OWN id resolves to that module's OWN audio. No
   duration matching, no chance of transcribing the wrong lesson — which is the
   failure the old path could not fully rule out.

   AUDIO ONLY, STREAMED. ffmpeg reads the smallest rendition over HTTP and writes
   16 kHz mono — what Whisper wants anyway. A 4-minute lesson costs a few MB
   instead of the 93 MB the 1080p rendition would have.

   Whisper runs LOCALLY: transcription of internal training footage should not
   need to leave the machine, and it costs nothing per minute.
   ========================================================================= */
import { readFileSync, writeFileSync, existsSync, mkdirSync, rmSync } from 'fs';
import { execFileSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
// Heavy files never touch the Mac disk — the SSD is the workdir. Refuse loudly
// rather than falling back silently: a fallback is how the Mac hit 119 MB free.
/* Two ways to get a transcript:
   · default: Vimeo's own automatic captions (texttracks API). Nothing downloaded, no Whisper, no SSD.
   · --whisper: stream the audio and run local Whisper (needs ffmpeg + whisper and a work folder:
     the Ultra Touch SSD on João's Mac, or ACADEMY_WORK=/some/folder anywhere else). */
const WHISPER = process.argv.includes('--whisper');
const SSD_WORK = process.env.ACADEMY_WORK || '/Volumes/Ultra Touch/Academy-OS/work';
if (WHISPER && !process.env.ACADEMY_WORK && !existsSync('/Volumes/Ultra Touch')) { console.error('✗ --whisper needs a work folder: plug in the Ultra Touch SSD, or set ACADEMY_WORK=/path'); process.exit(2); }


const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const courseId = process.argv[2];
const LANG = (process.argv.includes('--lang') ? process.argv[process.argv.indexOf('--lang') + 1] : '') || '';
if (!courseId) { console.error('usage: vimeo-transcribe.mjs <courseId> [--lang pt]'); process.exit(1); }
const TOKEN = readFileSync(process.env.HOME + '/.vimeo-token', 'utf8').trim();
const OUT = join(ROOT, 'media', 'transcripts', courseId);
const TMP = join(SSD_WORK, 'vimeo-transcribe');
mkdirSync(OUT, { recursive: true }); if (WHISPER) mkdirSync(TMP, { recursive: true });

/* module ids straight from the catalogue — the app's own truth, so the
   transcript index can never drift from the module index */
/* the brand is a parameter: BRAND_DIR=brands/belong/ node scripts/vimeo-transcribe.mjs <course> */
const BRAND_DIR = (process.env.BRAND_DIR || (existsSync(join(ROOT, 'brands/belong/content.js')) ? 'brands/belong/' : 'brands/edenrise/')).replace(/\/?$/, '/');
const content = readFileSync(join(ROOT, BRAND_DIR + 'content.js'), 'utf8');
const at = content.indexOf(`id: '${courseId}'`);
const block = content.slice(at, content.indexOf('\n  },', at));
const titles = (block.match(/modules: \[([\s\S]*?)\]/)[1]
  .match(/'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"/g) || []).map(s => s.slice(1, -1).replace(/\\(.)/g, '$1'));
/* --lang pt transcribes the PORTUGUESE cut from moduleMedia_pt. A course can be
   recorded twice, and the two recordings do not say the same words in the same
   seconds — so each language needs its own Whisper pass. Machine-translating the
   English transcript would produce something that reads fine and is wrong about
   what the PT presenter actually said, including every timestamp. */
const arrayFor = key => {
  const m = block.match(new RegExp(key + ': \\[([\\s\\S]*?)\\n    \\]'));
  return m ? [...m[1].matchAll(/["']?id["']?\s*:\s*["'](\d{9,10})["']/g)].map(x => x[1]) : [];
};
const media = LANG ? arrayFor('moduleMedia_' + LANG) : arrayFor('moduleMedia');
if (!media.length) { console.error(`✗ no moduleMedia${LANG ? '_' + LANG : ''} for ${courseId}`); process.exit(1); }
if (!LANG && titles.length !== media.length) { console.error(`✗ ${titles.length} titles vs ${media.length} videos — fix content.js first`); process.exit(1); }
if (LANG && media.length < titles.length) {
  console.log(`note: ${LANG} has ${media.length} of ${titles.length} modules — the rest have no ${LANG} recording`);
  console.log(`      those are SKIPPED, not filled from another language: a transcript labelled`);
  console.log(`      ${LANG} must never contain another language's words.\n`);
}
const suffix = LANG ? '.' + LANG : '';
console.log(`${courseId}${LANG ? ' [' + LANG + ']' : ''}: ${media.length} videos\n`);

async function api(id) {
  const r = await fetch(`https://api.vimeo.com/videos/${id}?fields=name,duration,download`, {
    headers: { Authorization: 'Bearer ' + TOKEN }, signal: AbortSignal.timeout(30000) });
  const d = await r.json();
  if (d.error) throw new Error(d.error);
  const rends = (d.download || []).filter(x => x.link).sort((a, b) => (a.size || 0) - (b.size || 0));
  if (!rends.length) throw new Error('no download rendition — token needs the video_files scope');
  return { name: d.name, duration: d.duration, link: rends[0].link, mb: Math.round((rends[0].size || 0) / 1e6) };
}

/* Vimeo's automatic captions → [{t0,t1,text}]. Prefers the track in the wanted language
   (auto-generated tracks are named like 'en-x-autogen'); a human-made track wins over an automatic one. */
const toSec = ts => { const p = ts.trim().replace(',', '.').split(':').map(Number); return +(p.length === 3 ? p[0] * 3600 + p[1] * 60 + p[2] : p[0] * 60 + p[1]).toFixed(2); };
async function captions(id) {
  const H = { Authorization: 'Bearer ' + TOKEN };
  const meta = await (await fetch(`https://api.vimeo.com/videos/${id}?fields=name,duration,language`, { headers: H, signal: AbortSignal.timeout(30000) })).json();
  if (meta.error) throw new Error(meta.error);
  const tt = await (await fetch(`https://api.vimeo.com/videos/${id}/texttracks`, { headers: H, signal: AbortSignal.timeout(30000) })).json();
  const tracks = (tt.data || []).filter(t => t.link);
  if (!tracks.length) throw new Error('no captions on Vimeo yet (Vimeo makes them a few minutes after upload) — or run with --whisper');
  const want = LANG || (meta.language || 'en').slice(0, 2);
  const score = t => (String(t.language).startsWith(want) ? 2 : 0) + (/autogen/.test(t.language) ? 0 : 1);
  const t = tracks.sort((a, b) => score(b) - score(a))[0];
  const vtt = await (await fetch(t.link, { signal: AbortSignal.timeout(30000) })).text();
  const segments = [];
  for (const cue of vtt.replace(/\r/g, '').split(/\n\n+/)) {
    const lines = cue.split('\n'); const k = lines.findIndex(l => l.includes('-->'));
    if (k < 0) continue;
    const [a, b] = lines[k].split('-->');
    const text = lines.slice(k + 1).join(' ').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    if (text) segments.push({ t0: toSec(a), t1: toSec(b.trim().split(' ')[0]), text });
  }
  return { name: meta.name, duration: meta.duration, language: String(t.language).slice(0, 2), segments };
}

for (const [i, vid] of media.entries()) {
  const out = join(OUT, `m${i}${suffix}.json`);
  if (existsSync(out)) { console.log(`m${i} ${titles[i]} — transcript exists, skip`); continue; }
  process.stdout.write(`m${i} ${titles[i]} (${vid}) … `);
  try {
    if (!WHISPER) {
      const c = await captions(vid);
      writeFileSync(out, JSON.stringify({
        module: i, title: titles[i], vimeoId: vid, vimeoName: c.name,
        language: c.language, durationSec: c.duration,
        machineTranslated: false, native: true,
        source: 'vimeo-autogen-captions', generatedAt: Date.now(),
        segments: c.segments,
      }, null, 1));
      console.log(`✓ ${c.language} · ${c.segments.length} segments (Vimeo captions)`);
      continue;
    }
    const v = await api(vid);
    const wav = join(TMP, `${courseId}-m${i}${suffix}.wav`);
    /* audio only, 16k mono — streamed, never the full video file */
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', v.link,
      '-vn', '-ac', '1', '-ar', '16000', wav], { stdio: ['ignore', 'pipe', 'pipe'] });
    process.stdout.write('whisper … ');
    execFileSync('whisper', [wav, '--model', 'small', '--output_format', 'json',
      '--output_dir', TMP, '--verbose', 'False'], { stdio: ['ignore', 'pipe', 'pipe'] });
    const j = JSON.parse(readFileSync(wav.replace(/\.wav$/, '.json'), 'utf8'));
    writeFileSync(out, JSON.stringify({
      module: i, title: titles[i], vimeoId: vid, vimeoName: v.name,
      language: j.language || LANG || 'en', durationSec: v.duration,
      /* native, NOT a translation — the distinction matters downstream:
         translate-transcripts.mjs stamps machineTranslated:true, and a question
         must never be grounded in a machine rendering of what someone said. */
      machineTranslated: false, native: true,
      source: 'vimeo-api', generatedAt: Date.now(),
      segments: (j.segments || []).map(s => ({ t0: +s.start.toFixed(2), t1: +s.end.toFixed(2), text: s.text.trim() })),
    }, null, 1));
    rmSync(wav, { force: true });
    console.log(`✓ ${j.language} · ${(j.segments || []).length} segments`);
  } catch (e) { console.log(`FAILED: ${String(e.message).slice(0, 120)}`); }
}
if (WHISPER) try { rmSync(TMP, { recursive: true, force: true }); } catch (e) {}
console.log(`\ntranscripts in ${OUT}
Next:  node scripts/generate-quizzes.mjs --course ${courseId}${LANG ? ' --lang ' + LANG : ''}
       node scripts/verify-quizzes.mjs   --course ${courseId}     # the blind gate
       node scripts/build-knowledge.mjs`);
