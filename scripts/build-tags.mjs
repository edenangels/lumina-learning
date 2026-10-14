#!/usr/bin/env node
/* ============================================================================
   build-tags.mjs — concept tags AT TIMESTAMPS.
   The graph says a lesson is "about leadership". This says WHERE: the seconds
   in the video where the trainer actually says it. Deterministic — a tag is a
   literal mention in the transcript, never a model's guess — so a chip that
   says "leadership · 4:32" seeks to a place where the word is spoken.
   Reads knowledge/search.json (every segment, with timecode) and graph.json
   (concept nodes + "about" edges). Writes knowledge/tags.json:
     { lessons: { "<course>:<mod>" | "reel:<id>": [ {c, at:[sec…], n, linked} ] } }
   A concept the graph already links needs ONE mention to be tagged; an
   unlinked concept must recur (3+ separate minutes) — discovery needs
   repetition, or every lesson would be tagged with every word.
   ========================================================================= */
import { readFileSync, writeFileSync } from 'fs';
const S = JSON.parse(readFileSync('knowledge/search.json', 'utf8'));
const G = JSON.parse(readFileSync('knowledge/graph.json', 'utf8'));
const fold = x => String(x || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/* Frequency tags include words that are frequent because they are English,
   not because they are ideas. A chip that says "next · 0:17" teaches nothing. */
const GENERIC = new Set('every about real never those something years built everything things thing today always sometimes maybe really actually basically probably because course courses module modules lesson lessons video videos could would should might remember remembered stop stay understood excellent feeling feelings experience experiences learn learned learns feel feels felt someone everyone anyone every everybody nothing someone thing better best worse worst above below line lines side top bottom front inside outside some those these about work works working ultimately basically obviously definitely probably certainly exactly especially usually generally actually literally simply totally absolutely completely maybe perhaps person persons instead through help around grow anything everything nothing always never often sometimes already still again back away here there where whether while because before after during without within into onto upon over under between among across along another other others each every either neither both much many most more less least enough quite rather pretty almost even ever yet since until though although however whatever whenever wherever whoever able having being doing done gone went gets given give giving take taken taking put puts keep keeps kept let lets tell tells told ask asked asking find found feel felt felt seem seems seemed become became try tried trying use used using see seen saw seeing hear heard say saying call called happen happens happened okay yes yeah sure course number word words guys guy stuff sense idea ideas one ones lot lots little big small long short high low new old own same real true whole next people problem problems things thing time way day days going really good want need like know think make come look right little someone everyone something different first actually maybe question questions example point part lot bit life today years minutes week weeks talk talking said says start end kind sort great well mean means'.split(' '));
writeFileSync('knowledge/generic-words.json', JSON.stringify([...GENERIC]));
const concepts = G.nodes.filter(n => n.kind === 'concept' && !GENERIC.has(fold(n.title).trim())).map(n => {
  const f = fold(n.title).trim();
  const stem = f.replace(/ies$/, 'y').replace(/s$/, '');
  return { id: n.id, title: n.title, stem, re: new RegExp('\\b' + esc(stem) + '[a-z]*\\b') };
}).filter(c => c.stem.length >= 4);
const about = {};
for (const e of G.edges) if (e.rel === 'about') (about[e.from] ||= new Set()).add(e.to);
/* how many lessons share the concept — an idea that recurs across the library is a tag; a word that one lesson happens to repeat is not */
const degree = {};
for (const e of G.edges) if (e.rel === 'about') degree[e.to] = (degree[e.to] || 0) + 1;
const lessons = {}; let tagged = 0, mentions = 0;
for (const mod of S) {
  const isReel = mod.kind === 'reel';
  const key = isReel ? 'reel:' + mod.m : mod.c + ':' + mod.m;
  const node = isReel ? 'reel:' + mod.m : 'module:' + mod.c + ':' + mod.m;
  const linked = about[node] || new Set();
  const found = [];
  for (const c of concepts) {
    const at = []; let last = -999;
    for (const [t0, text] of mod.s) if (c.re.test(fold(text)) && t0 - last >= 45) { at.push(Math.round(t0)); last = t0; }
    if (!at.length) continue;
    const isLinked = linked.has(c.id);
    if (!isLinked && at.length < 4) continue;
    if (isLinked && (degree[c.id] || 0) < 2 && at.length < 3) continue;
    found.push({ c: c.title, at: at.slice(0, 12), n: at.length, linked: isLinked });
  }
  found.sort((a, b) => (b.linked - a.linked) || (b.n - a.n));
  /* one chip per idea: "mistake" and "mistakes" are the same concept */
  const seenStem = new Set();
  for (let i = found.length - 1; i >= 0; i--) { const st = fold(found[i].c).replace(/ies$/, 'y').replace(/s$/, ''); if (seenStem.has(st)) found.splice(i, 1); else seenStem.add(st); }
  if (found.length) { lessons[key] = found.slice(0, 8); tagged++; mentions += found.reduce((a, x) => a + x.n, 0); }
}
writeFileSync('knowledge/tags.json', JSON.stringify({ generatedAt: new Date().toISOString(), lessons }));
console.log(`tags.json: ${tagged}/${S.length} lessons tagged · ${Object.values(lessons).reduce((a, l) => a + l.length, 0)} tags · ${mentions} timestamped mentions`);
