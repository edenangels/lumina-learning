# Maintaining ADEN Academy — the operating manual

_For Claude Code and for whoever maintains the academy. People start at `START-HERE.md` in this folder._

**The rename (24 Nov 2026).** EdenRise Academy is now **ADEN Academy**, same branding. Only the words people
read say ADEN. These stay `edenrise` on purpose; renaming any of them signs learners out or loses progress:
`BRAND.id`, `brands/edenrise/`, localStorage keys (`edenrise-state-v2`, `eden-auth-mode`), the Firebase
project `edenrise-academy`, `sw.js` VERSION prefix `edenrise-v`, worker/reel URLs (`*.edenrise.workers.dev`,
`edenrise-reels.pages.dev`), download file names. Certificates and the 40-h record name the **legal
employer**: `company: 'EdenRise'` in brand.js (and the Firestore company doc) — change only on João's word.
Older videos say "EdenRise" aloud; the tutor's `ethos` says ADEN was formerly EdenRise.

**Map**
| What | Where |
|---|---|
| Name, tagline, Firebase config, admins (`superadmins`), fonts, colours | `brands/edenrise/brand.js` |
| Courses (`CATALOG`: title, desc, outcomes, `modules` = lesson titles, `moduleMedia` = Vimeo ids, `_pt` twins), reels, PT copy | `brands/edenrise/content.js` |
| Every UI string, EN + PT (`t('key')`), departments/goals | `data.js` |
| App (router, player, checks, tutor, certificates) · sign-in & sync · styles | `core/app.js` · `core/auth.js` · `core/styles.css` |
| Lesson questions (`a` = correct index, `t0` = second that teaches it, `en`/`pt`) | `knowledge/quizzes/<course>.json` |
| Transcripts (per lesson, per language) | `media/transcripts/<course>/m<N>[.pt].json` |
| Search/brain (generated — never hand-edit) | `knowledge/index.json, search.json, tags.json, graph.json, vectors.bin` |
| Covers / hero art | `media/covers/` (posters with lettering: change the words, keep the look) |

**Recipes**
- *Wording:* edit `data.js` in BOTH the EN and PT blocks. European Portuguese only (equipa, ecrã, telemóvel,
  utilizador, contacto — never Brazilian forms).
- *New lesson video:* (1) uploaded to Vimeo, unlisted; the share link `vimeo.com/<id>/<hash>` gives id + hash.
  (2) `node scripts/wire-course.mjs <course> list.txt` (dry run), then `--apply` — one line per lesson
  `Title | id | h=hash | m:ss`. (3) `node scripts/ingest.mjs --course <course>` = transcript (Vimeo's own
  captions; `--whisper` only if captions are missing) → questions → blind gate → search index. Needs
  `~/.vimeo-token` and `~/.academy-build-key`. (4) **Read every new question**: the gate corrects keys but
  can be wrong; remove anything not grounded in the transcript. (5) `node scripts/build-tags.mjs && node
  scripts/build-graph.mjs` (and `build-vectors.mjs` if the build key is present). (6) Release.
- *Reels:* `REELS.md` (files live on `edenrise-reels.pages.dev`, never in git).
- *Course copy or picture:* `content.js` (+ `_pt`), image in `media/covers/` as .webp.

**Verify every change** (show the person, don't just claim it):
`node test/run.mjs` (≈350 pass) · `python3 test/e2e/smoke.py http://localhost:8080/ 390 en` and `… 1280 pt`
(PASS; screenshots land in `test/e2e/shots/`) · look at any page you touched at 390 px — no sideways scroll ·
no console errors.

**Release:** `scripts/deploy-pages.sh` (tests → bumps `?v=edrN` in index.html + `edenrise-vN` in sw.js →
build → Cloudflare `edenrise-academy` → curl check). Then commit and `git push origin main` (GitHub Pages
mirror). It works without João's SSD (temp folder, or `ACADEMY_WORK=/path`). Before editing, `git pull` and
`git log --oneline -3` — other sessions commit here too.

**Never without João:** domains/DNS · `firebase deploy` of rules · deleting learner data · messages to the
team · changing the legal company name · committing any key (this repo is PUBLIC).
