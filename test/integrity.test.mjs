/* ============================================================================
   integrity.test.mjs — invariants that hold across the shipped files.

   These are the cheapest tests in the suite and they catch the most damaging
   class of bug, because every one of them corresponds to something that has
   actually shipped broken:

     · a raw i18n key rendered at the user ("lang_fallback")
     · seven Portuguese entries on an eight-module course → "MÓDULO 8 de 8 ·
       undefined"
     · Portuguese modules left in the old order, so the title said one thing
       while the video played another
     · a Vimeo id deleted upstream, rendering a dead player that records no
       watch time and credits no compliance hour
     · a ?v= marker bumped in index.html but not in sw.js, stranding returning
       browsers on a half-updated app

   None of them are catchable by `node --check`, which is all CI ran before.
   ========================================================================= */
import { execFileSync } from 'child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';
import { ROOT, src, stripComments, stripRulesComments } from './harness.mjs';

/* Evaluate a pure-data file and hand back its top-level declarations. content.js
   and data.js are plain tables; if either ever starts touching `document` at load
   time this throws with a clear message rather than a mystery. */
function dataFile(rel, names) {
  const code = src(rel);
  try {
    return new Function(`${code}\n;return {${names.join(', ')}};`)();
  } catch (e) {
    throw new Error(`${rel} could not be evaluated as data (${e.message}). If it now needs the DOM, this test needs a stub.`);
  }
}

/* WHICH BRAND. Never hard-code one — the first version of this file said
   'brands/edenrise/…', the exact founding-tenant assumption the template exists
   to be free of, and it broke the moment the suite was copied into
   academy-template.

   Resolution order, and the reason for it:
     1 what index.html loads — the app's own truth, correct for a DEPLOYMENT
     2 whatever single brands/<id>/content.js is on disk — correct for the
       UN-STAMPED TEMPLATE, whose index.html still names the founding brand as a
       placeholder that bin/stamp.py rewrites at stamp time (it also moves
       brands/_template to brands/<id>, so the template repo is deliberately not
       runnable as-is)

   One code path that is right in both repos, which is what `copy` in the
   template contract requires: a file that needs hand-editing per deployment
   cannot be copied. */
const INDEX = src('index.html');
const brandDir = (() => {
  const named = INDEX.match(/["']([^"']*brands\/([^/"']+)\/)content\.js/);
  if (named && existsSync(join(ROOT, `${named[1]}content.js`))) return { path: named[1], id: named[2] };
  const dir = join(ROOT, 'brands');
  const found = existsSync(dir)
    ? readdirSync(dir).filter(d => existsSync(join(dir, d, 'content.js'))) : [];
  if (found.length === 1) return { path: `brands/${found[0]}/`, id: found[0] };
  throw new Error(named
    ? `integrity: index.html loads ${named[1]}content.js which is absent, and brands/ holds ${found.length} candidates (${found.join(', ') || 'none'})`
    : 'integrity: no brands/<id>/content.js in index.html and none on disk');
})();

const SHIPPED_JS = ['core/app.js', 'core/auth.js', 'core/brandkit.js', 'core/ots.js',
  'core/landflow.js', 'data.js', 'sw.js',
  `${brandDir.path}content.js`, `${brandDir.path}brand.js`];

export function run(t) {
  /* ---------- 1. everything parses ---------- */
  t.group('syntax');
  for (const f of SHIPPED_JS) {
    if (!existsSync(join(ROOT, f))) { t.ok(`${f} exists`, false, 'missing'); continue; }
    let err = '';
    try { execFileSync(process.execPath, ['--check', join(ROOT, f)], { stdio: ['ignore', 'pipe', 'pipe'] }); }
    catch (e) { err = String(e.stderr || e.message).split('\n').slice(0, 2).join(' '); }
    t.ok(`${f} parses`, !err, err);
  }

  /* ---------- 2. cache markers move together ---------- */
  t.group('cache version');
  const idx = src('index.html'), sw = src('sw.js');
  /* the marker PREFIX is per-tenant (edr… for EdenRise); derive it rather than
     assume, or this check silently passes on every other deployment */
  const marks = [...new Set((idx.match(/\?v=[a-z]+\d+/g) || []).map(m => m.slice(3)))];
  t.ok('index.html uses exactly one ?v= marker', marks.length === 1,
    marks.length ? `found ${marks.join(', ')} — a partial bump serves a half-updated app` : 'no ?v= marker at all');
  const swV = (sw.match(/-v(\d+)['"`]/) || sw.match(/[a-z]+-v(\d+)/) || [])[1];
  const idxV = marks.length === 1 ? marks[0].replace(/^[a-z]+/, '') : null;
  t.ok('sw.js VERSION matches index.html marker', !!swV && swV === idxV,
    `sw=${swV} index=${idxV} — returning browsers keep the old shell until these agree`);

  /* every LOCAL asset carries the marker; a missed one is a permanently stale file */
  const unversioned = [...idx.matchAll(/(?:src|href)="(?!https?:|\/\/|#|mailto:)([^"]+)"/g)]
    .map(m => m[1])
    .filter(u => /\.(js|css)$/.test(u.split('?')[0]))
    .filter(u => !u.includes('?v='));
  t.ok('every local js/css in index.html is versioned', unversioned.length === 0, unversioned.join(', '));

  /* ---------- 3. i18n: core never calls a key the tenant has not defined ---- */
  t.group('i18n parity');
  const app = src('core/app.js');
  const dj = src('data.js');
  const called = [...new Set([...app.matchAll(/\bt\('([a-z][a-z0-9_]*)'\)/g)].map(m => m[1]))];
  /* the two language blocks, sliced by their own headers */
  const enAt = dj.indexOf('\n  en: {'), ptAt = dj.indexOf('\n  pt: {');
  t.ok('data.js has both en and pt blocks', enAt > -1 && ptAt > enAt);
  const keysIn = s => new Set([...s.matchAll(/[{,]\s*([a-zA-Z][a-zA-Z0-9_]*)\s*:\s*['"]/g)].map(m => m[1]));
  const en = keysIn(dj.slice(enAt, ptAt)), pt = keysIn(dj.slice(ptAt));
  const missEn = called.filter(k => !en.has(k)), missPt = called.filter(k => !pt.has(k));
  t.ok(`all ${called.length} keys core calls are defined in en`, !missEn.length, missEn.join(', '));
  t.ok(`all ${called.length} keys core calls are defined in pt`, !missPt.length, missPt.join(', '));

  /* ---------- 4. course content lines up with its media ---------- */
  t.group('course content');
  const C = dataFile(`${brandDir.path}content.js`,
    ['CATALOG', 'REELS', 'QUICKWINS', 'COURSE_PT', 'EDUCATORS']);
  const ids = C.CATALOG.map(c => c.id);
  t.ok('CATALOG has courses', C.CATALOG.length > 0);
  t.ok('course ids are unique', new Set(ids).size === ids.length);

  for (const c of C.CATALOG) {
    const n = (c.modules || []).length;
    if (c.moduleMedia) {
      t.ok(`${c.id}: moduleMedia count matches module titles`, c.moduleMedia.length === n,
        `${c.moduleMedia.length} media vs ${n} titles`);
    }
    if (c.moduleDurations) {
      t.ok(`${c.id}: moduleDurations count matches module titles`, c.moduleDurations.length === n,
        `${c.moduleDurations.length} durations vs ${n} titles`);
    }
    /* a per-language cut may be SHORTER (not yet recorded) but never longer, and
       never longer than the module list — that produced "MÓDULO 8 de 8 · undefined" */
    for (const k of Object.keys(c)) {
      const m = k.match(/^moduleMedia_([a-z]{2})$/);
      if (!m) continue;
      t.ok(`${c.id}: ${k} is not longer than the module list`, c[k].length <= n,
        `${c[k].length} > ${n}`);
      const dk = `moduleDurations_${m[1]}`;
      if (c[dk]) t.ok(`${c.id}: ${dk} matches ${k} length`, c[dk].length === c[k].length,
        `${c[dk].length} durations vs ${c[k].length} videos`);
    }
    /* a duplicated video id means two modules silently play the same lesson */
    const vids = [];
    for (const k of Object.keys(c)) {
      if (!/^moduleMedia(_[a-z]{2})?$/.test(k)) continue;
      for (const e of c[k]) if (e && e.id) vids.push(`${k}:${e.id}`);
    }
    const bare = vids.map(v => v.split(':')[1]);
    const dupes = [...new Set(bare.filter((v, i) => bare.indexOf(v) !== i))];
    t.ok(`${c.id}: no video id used twice`, !dupes.length, dupes.join(', '));
    /* ids are 9-10 digits: a truncated paste renders a dead player, silently */
    const badIds = bare.filter(v => !/^\d{9,10}$/.test(v));
    t.ok(`${c.id}: every video id is well-formed`, !badIds.length, badIds.join(', '));
  }

  /* the Portuguese module titles must describe the same lessons, in order */
  t.group('portuguese parity');
  for (const c of C.CATALOG) {
    const ptc = (C.COURSE_PT || {})[c.id];
    if (!ptc || !ptc.modules) continue;
    t.ok(`${c.id}: PT module count matches EN`, ptc.modules.length === c.modules.length,
      `pt ${ptc.modules.length} vs en ${c.modules.length} — a short list renders "undefined" for the tail`);
  }

  /* ---------- 5. reels ---------- */
  t.group('reels');
  const reels = C.REELS || [];
  t.ok('QUICKWINS is the same library as REELS (one curation state)', C.QUICKWINS === C.REELS);
  t.ok('reel ids are unique', new Set(reels.map(r => r.id)).size === reels.length);
  for (const r of reels) {
    for (const f of ['title', 'hook', 'line']) {
      t.ok(`${r.id}: ${f} has en+pt`, !!(r[f] && r[f].en && r[f].pt));
    }
    t.ok(`${r.id}: deeper points at a real course`, ids.includes(r.deeper), String(r.deeper));
    const q = r.check;
    if (!q) { t.ok(`${r.id}: has a check`, false, 'no check object'); continue; }
    for (const L of ['en', 'pt']) {
      const b = q[L];
      t.ok(`${r.id}: check.${L} is complete`,
        !!(b && b.q && b.q.trim() && Array.isArray(b.opts) && b.opts.length >= 2
           && b.opts.every(o => o && o.trim()) && b.why && b.why.trim()),
        b ? 'a field is blank' : `no ${L} block — a learner in ${L} would be asked another language's question`);
    }
    /* guard every access: a reel with only one language must FAIL these checks,
       not crash the run. The first English-only reels made this throw, which
       hid every check after it. */
    const optsOf = L => ((q[L] || {}).opts || []);
    t.ok(`${r.id}: answer index is in range`,
      Number.isInteger(q.a) && q.a >= 0 && q.a < optsOf('en').length, `a=${q.a}`);
    t.ok(`${r.id}: en and pt offer the same number of options`,
      optsOf('en').length === optsOf('pt').length,
      `en ${optsOf('en').length} vs pt ${optsOf('pt').length}`);
    /* a reel must never be able to credit a training hour */
    t.ok(`${r.id}: is not in CATALOG`, !ids.includes(r.id));
  }

  /* ---------- 6. quiz banks: shaped, and gated ---------- */
  t.group('quiz banks');
  const qdir = join(ROOT, 'knowledge', 'quizzes');
  const banks = existsSync(qdir) ? readdirSync(qdir).filter(f => f.endsWith('.json')) : [];
  /* Banks are the tenant's own content (neverSync), so a fresh template has
     none and that is correct. Demand them only once real videos are wired —
     a wired lesson with no banked question is a lesson that ends in nothing. */
  const wiredVideos = C.CATALOG.reduce((n, c) => n + Object.keys(c)
    .filter(k => /^moduleMedia(_[a-z]{2})?$/.test(k))
    .reduce((m, k) => m + c[k].filter(e => e && e.id).length, 0), 0);
  if (wiredVideos) t.ok(`quiz banks exist for ${wiredVideos} wired video(s)`, banks.length > 0);
  else t.ok('no videos wired yet, so no banks expected', banks.length === 0,
    `${banks.length} bank(s) with nothing wired to them`);
  for (const f of banks) {
    let b;
    try { b = JSON.parse(readFileSync(join(qdir, f), 'utf8')); }
    catch (e) { t.ok(`${f} is valid JSON`, false, e.message); continue; }
    const courseId = f.replace(/\.json$/, '').replace(/\.[a-z]{2}$/, '');
    const course = C.CATALOG.find(c => c.id === courseId);
    t.ok(`${f}: names a real course`, !!course, courseId);
    let total = 0, ungated = 0, malformed = 0, outOfRange = 0;
    for (const [modIdx, qs] of Object.entries(b.modules || {})) {
      if (course && +modIdx >= course.modules.length) outOfRange++;
      for (const q of qs || []) {
        total++;
        if (!q.verified && !q.corrected) ungated++;
        const L = q.en || q.pt;
        const okShape = L && typeof L.q === 'string' && L.q.trim()
          && Array.isArray(L.opts) && L.opts.length >= 2
          && L.opts.every(o => typeof o === 'string' && o.trim())
          && Number.isInteger(q.a) && q.a >= 0 && q.a < L.opts.length;
        if (!okShape) malformed++;
      }
    }
    t.ok(`${f}: ${total} questions, all well-formed`, !malformed, `${malformed} malformed`);
    t.ok(`${f}: every question passed the blind gate`, !ungated,
      `${ungated} of ${total} neither verified nor corrected — an ungated question must not reach a learner`);
    t.ok(`${f}: no module index beyond the course`, !outOfRange, `${outOfRange} orphaned`);
  }

  /* ---------- 6b. security invariants in firestore.rules ----------
     These are STATIC checks on the rules text. They cannot verify syntax — that
     needs the Firestore emulator, which needs a Java runtime this machine does
     not have; `firebase deploy` validates before applying, so a syntax error
     fails safe. What they DO protect is the two properties most likely to be
     lost in a careless edit, both of which are silent when broken. */
  t.group('rules invariants');
  const rules = existsSync(join(ROOT, 'core/firestore.rules')) ? stripRulesComments(src('core/firestore.rules')) : '';
  if (!rules) t.ok('core/firestore.rules exists', false, 'missing');
  else {
    /* R3-1c. token.email is not a reserved claim; sign_in_provider is. An admin
       predicate keyed on email alone is only as strong as whatever can mint a
       token for this project — and isSuper() gates the learner-event reads. */
    t.ok('realIdentity() keys on firebase.sign_in_provider',
      /function\s+realIdentity\s*\(\)[\s\S]{0,240}?firebase\.sign_in_provider/.test(rules));
    t.ok('realIdentity() excludes custom and anonymous tokens',
      !/sign_in_provider\s+in\s+\[[^\]]*(custom|anonymous)/.test(rules));
    for (const fn of ['isSuper', 'isCompanyAdminOf']) {
      const m = new RegExp(`function\\s+${fn}\\s*\\([^)]*\\)\\s*\\{([\\s\\S]*?)\\n    \\}`).exec(rules);
      t.ok(`${fn}() requires realIdentity()`, !!m && /realIdentity\(\)/.test(m[1]),
        m ? 'keys on token.email without proving the provider — forgeable by anything that can mint a token'
          : 'could not locate the function');
    }
    /* The append-only guarantee IS the product claim. If an `allow update` ever
       appears on these three paths, "tamper-evident" stops being true and nothing
       in the UI would show it. */
    for (const path of ['events', 'anchors', 'proofs']) {
      const m = new RegExp(`match /${path}/\\{[^}]+\\}\\s*\\{([\\s\\S]*?)\\n      \\}`).exec(rules);
      t.ok(`${path} stay create-only (update+delete refused)`,
        !!m && /allow\s+update,\s*delete:\s*if\s+false/.test(m[1]),
        m ? 'no explicit `allow update, delete: if false` — the append-only claim is unenforced'
          : 'could not locate the match block');
    }
  }

  /* ---------- 6c. the evidence sync's control flow ----------
     STRUCTURAL, NOT BEHAVIOURAL, and the difference is worth stating: syncLedger
     is an async method inside the window.EdenCloud object literal, so the harness
     (which lifts top-level declarations) cannot reach it. These regex checks
     therefore assert the SHAPE of the fix rather than running it.

     They exist because a mutation test proved the gap: deleting the anchor write
     entirely left all 183 other checks green. A weaker test that fails on the
     real regression beats a stronger one that does not exist — and the honest fix
     is Phase 2, where app.js and auth.js gain an export surface and this becomes
     a proper behavioural test. */
  t.group('evidence sync shape');
  /* comment-free: this file documents its own history, and syncLedger's comment
     quotes the very line that was removed */
  const authSrc = existsSync(join(ROOT, 'core/auth.js')) ? stripComments(src('core/auth.js')) : '';
  const sync = (authSrc.match(/async syncLedger\(\)[\s\S]*?\n  \},/) || [''])[0];
  t.ok('syncLedger() was located', !!sync);
  if (sync) {
    /* R3-1e: the cursor may guard the EVENTS loop only. Guarding the whole
       function skipped the anchor and — worse — the Bitcoin proof upgraded to
       confirmed days later, for exactly the learner who had finished. */
    t.ok('no whole-function cursor early-return',
      !/if\s*\(cursor\s*>=\s*L\.length\)\s*return/.test(sync),
      'the early return is back: a finished learner never gets an anchor or a confirmed proof mirrored');
    t.ok('the anchor write is gated on every event being mirrored',
      /cursor\s*>=\s*L\.length[\s\S]{0,200}anchors/.test(sync),
      'either the gate is gone (an anchor would overstate the record) or the anchor write is');
    t.ok('the anchor write exists at all', /'anchors'/.test(sync),
      'nothing pins the chain head to server time, so back-dating stops being detectable');
    t.ok('the proofs mirror exists at all', /'proofs'/.test(sync));
    /* R3-1d: no silent swallow on the writes that carry the claim */
    t.ok('the anchor write no longer swallows its error',
      !/'anchors'[^;]{0,400}\.catch\(\(\)\s*=>\s*\{\}\)/.test(sync),
      'a `.catch(() => {})` here is how the server tier went dark for three weeks');
    t.ok('every exit records status via __noteLedgerSync',
      /finally\s*\{[\s\S]{0,200}__noteLedgerSync/.test(sync),
      'a failure that is not recorded is a failure nobody learns about');
  }
  t.ok('ledgerSyncStatus() is exposed for the UI to read', /ledgerSyncStatus\(\)\s*\{/.test(authSrc));
  t.ok('a blocked mirror reaches an admin through the beacon',
    /EdenBeacon\(/.test(authSrc) && /window\.EdenBeacon\s*=/.test(stripComments(src('core/app.js'))),
    'the learner-facing copy claims an administrator can see this — it must be true');

  /* ---------- 6d. the knowledge manifest agrees with the catalogue ----------
     knowledge/index.json is what gets pushed to LandFlow, so anything wrong here
     is wrong in the agent that talks to the crew on WhatsApp.

     This exists because it shipped wrong: build-knowledge.mjs used to regex the
     module titles out of content.js accepting only single-quoted strings, so
     "Don't Assume, Clarify" — double-quoted BECAUSE of its apostrophe — broke the
     sequence. Module 3 became `t Assume, Clarify", `, modules 4-6 became `, `,
     and module 7 fell through to the "Module N" fallback. Those names sat in D1
     for months and are what a worker would have been read back. */
  t.group('knowledge manifest');
  const kPath = join(ROOT, 'knowledge', 'index.json');
  if (!existsSync(kPath)) t.ok('knowledge/index.json exists', false, 'run scripts/build-knowledge.mjs');
  else {
    const K = JSON.parse(readFileSync(kPath, 'utf8'));
    let checked = 0, wrong = [], fallback = [];
    for (const [cid, c] of Object.entries(K.courses || {})) {
      const course = C.CATALOG.find(x => x.id === cid);
      if (!course) { t.ok(`${cid}: is a real course`, false, 'in the manifest but not in CATALOG'); continue; }
      t.ok(`${cid}: course title matches the catalogue`, c.title === course.title,
        `manifest "${c.title}" vs catalogue "${course.title}"`);
      for (const m of c.modules || []) {
        const want = (course.modules || [])[m.mod];
        if (want == null) continue;
        checked++;
        if (m.title !== want) wrong.push(`${cid}/m${m.mod}: "${m.title}" ≠ "${want}"`);
        if (/^Module \d+$/.test(m.title)) fallback.push(`${cid}/m${m.mod}`);
      }
    }
    t.ok(`all ${checked} module titles match content.js exactly`, !wrong.length, wrong.slice(0, 4).join(' | '));
    t.ok('no module fell back to "Module N"', !fallback.length,
      `${fallback.join(', ')} — a real title exists for these, so the extractor lost sync`);
    /* THE MANIFEST STILL DESCRIBES THE TRANSCRIPTS ON DISK.
       The first version of this compared file mtimes — green locally, and
       permanently RED in CI, because git does not preserve mtimes: a fresh
       checkout stamps every file "now", so the committed generatedAt always
       looks stale. A gate that is always red is worse than no gate; people learn
       to ignore it.

       Comparing CONTENT instead is both CI-safe and stronger. Segment count
       alone would not be enough — the deleted Science of Gratitude cut and its
       replacement both had exactly 122 — so the manifest carries a character
       signature and this recomputes it from the files. */
    let stale = [];
    for (const [cid, c] of Object.entries(K.courses || {})) {
      for (const m of c.modules || []) {
        let segs = 0, chars = 0;
        for (const sfx of ['', '.en', '.pt']) {
          const fp = join(ROOT, 'media', 'transcripts', cid, `m${m.mod}${sfx}.json`);
          if (!existsSync(fp)) continue;
          const tr = JSON.parse(readFileSync(fp, 'utf8'));
          if (sfx === '') segs = tr.segments.length;
          for (const sg of tr.segments) chars += (sg.text || '').length;
        }
        if (m.segments !== segs || (m.chars != null && m.chars !== chars)) {
          stale.push(`${cid}/m${m.mod} (manifest ${m.segments}seg/${m.chars}ch vs disk ${segs}seg/${chars}ch)`);
        }
      }
    }
    t.ok('the manifest matches the transcripts on disk', !stale.length,
      `${stale.slice(0, 3).join(' | ')} — re-run build-knowledge.mjs, or LandFlow keeps serving the older cut`);
  }

  /* ---------- 6e. the knowledge graph ----------
     graph.json is what turns the library from a list into something that links.
     It is derived, so the checks are about derivation: every edge names real
     nodes, nothing that should be linked is stranded, and it was built from the
     CURRENT index (generatedAt on both — timestamps in the files, CI-safe). */
  t.group('knowledge graph');
  const gPath = join(ROOT, 'knowledge', 'graph.json');
  if (!existsSync(gPath)) t.ok('knowledge/graph.json exists', false, 'run scripts/build-graph.mjs');
  else {
    const G = JSON.parse(readFileSync(gPath, 'utf8'));
    const ids = new Set(G.nodes.map(n => n.id));
    const dangling = G.edges.filter(e => !ids.has(e.from) || !ids.has(e.to));
    t.ok(`every edge names real nodes (${G.edges.length} edges)`, !dangling.length,
      dangling.slice(0, 3).map(e => `${e.from}→${e.to}`).join(', '));
    t.ok('no course, module or reel is unlinked', !(G.orphans || []).length, (G.orphans || []).join(', '));
    const Kg = JSON.parse(readFileSync(kPath, 'utf8')).generatedAt || 0;
    t.ok('graph is not older than the index it derives from', (G.generatedAt || 0) >= Kg,
      'index.json was rebuilt after graph.json — run scripts/build-graph.mjs');
    const reelNodes = G.nodes.filter(n => n.kind === 'reel').length;
    t.ok(`every published reel is a node (${reelNodes})`, reelNodes === (C.REELS || []).filter(r => r.approved).length,
      `${reelNodes} nodes vs ${(C.REELS || []).filter(r => r.approved).length} published reels`);
  }

  /* ---------- 7. transcript provenance ----------
     TWO DIFFERENT CLAIMS, kept apart because conflating them cost me a run of
     39 alarming failures that were not what the message said.

     A CONTRADICTION — the transcript names a different video than the one wired
     — is a real defect: the questions were written against another cut. That is
     how the deleted `1218881643` was caught.

     A MISSING source id is weaker: it means provenance was never recorded, so
     the transcript cannot be traced either way. The courses below predate
     vimeo-transcribe.mjs; the old pipeline matched local SSD footage to modules
     by DURATION and stored no id. Re-ingesting them from the API is the fix and
     it is real work, so the debt is named here rather than papered over.

     The exemption is self-cleaning: if an exempt course turns out to record
     provenance after all, the test FAILS and tells you to delete the entry. An
     allowlist nobody is forced to shrink is just a way to hide a growing pile. */
  const LEGACY_UNSOURCED = {
  };

  t.group('transcript provenance');
  const tdir = join(ROOT, 'media', 'transcripts');
  const sourced = {}, unsourced = {};
  if (existsSync(tdir)) {
    for (const cdir of readdirSync(tdir)) {
      const course = C.CATALOG.find(c => c.id === cdir);
      if (!course) continue;
      for (const f of readdirSync(join(tdir, cdir)).filter(x => x.endsWith('.json'))) {
        const m = f.match(/^m(\d+)(?:\.([a-z]{2}))?\.json$/);
        if (!m) continue;
        const [, i, lang] = m;
        let tr;
        try { tr = JSON.parse(readFileSync(join(tdir, cdir, f), 'utf8')); } catch { continue; }
        (tr.vimeoId ? sourced : unsourced)[cdir] = ((tr.vimeoId ? sourced : unsourced)[cdir] || 0) + 1;
        const arr = lang ? course[`moduleMedia_${lang}`] : course.moduleMedia;
        if (!arr || !arr[+i] || !tr.vimeoId) continue;
        /* the load-bearing check: never disagree with what the learner is played */
        t.ok(`${cdir}/${f}: matches the wired video`, String(tr.vimeoId) === String(arr[+i].id),
          `transcript ${tr.vimeoId} vs wired ${arr[+i].id} — its questions describe a different cut`);
      }
    }
  }
  for (const cdir of Object.keys({ ...sourced, ...unsourced })) {
    const miss = unsourced[cdir] || 0;
    if (LEGACY_UNSOURCED[cdir]) {
      /* self-cleaning: the exemption must still be needed */
      t.ok(`${cdir}: exemption still applies`, miss > 0,
        `every transcript now records its source — remove "${cdir}" from LEGACY_UNSOURCED`);
    } else {
      t.ok(`${cdir}: every transcript records its source video`, miss === 0,
        `${miss} transcript(s) have no vimeoId, so they cannot be traced to a cut`);
    }
  }
  const debt = Object.keys(LEGACY_UNSOURCED).reduce((n, k) => n + (unsourced[k] || 0), 0);
  if (debt) console.log(`      (known debt: ${debt} legacy transcripts without provenance — re-ingest to clear)`);
}
