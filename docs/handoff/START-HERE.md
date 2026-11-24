# ADEN Academy: start here (for Sajid)

Welcome. You're taking over day-to-day work on **ADEN Academy**, the team's learning
platform: short filmed lessons, two questions after each lesson, paths per department,
reels, certificates, and the yearly record of training hours. It's in English and European
Portuguese. ADEN is the new name of EdenRise Academy, with the same look.

You'll mostly work **with Claude Code**: describe the change, Claude makes it, you check
it, then you publish. This page gets you set up. `docs/handoff/MAINTAINING.md` is the detailed
manual Claude reads (the `CLAUDE.md` in your folder points Claude to it).

---

## 1. Where it lives

| | |
|---|---|
| **Live site** | https://edenrise-academy.pages.dev (Cloudflare Pages) |
| **Mirror** | https://edenangels.github.io/lumina-learning/ (GitHub Pages; updates when `main` is pushed) |
| **Code** | github.com/edenangels/lumina-learning, branch `main`. **The repo is public**: never put a key or password in it |
| **Videos** | ADEN/EdenRise Vimeo account (lessons). Reels are files on https://edenrise-reels.pages.dev |
| **Accounts & progress** | Firebase project `edenrise-academy` (sign-in and saved progress) |

`academy.edenrise.com` is not connected at the moment (404). Leave domains and DNS to João.

## 2. Access João gives you (ask for all of these on day one)

- [ ] **GitHub:** write access to `edenangels/lumina-learning`.
- [ ] **Cloudflare:** member of the account, with access to the Pages projects `edenrise-academy`
      and `edenrise-reels`. Used for publishing.
- [ ] **Vimeo:** access to the team account, to upload lessons, plus a **personal access token**
      (scopes: public, private, video_files). Save it on your Mac as `~/.vimeo-token`.
- [ ] **Academy build key:** for writing questions and summaries with the free AI gateway. Save
      it as `~/.academy-build-key`. João sends it through a password manager, never in chat or
      email.
- [ ] **Admin in the app:** your email added to `superadmins` in `brands/edenrise/brand.js`.
- [ ] Firebase console access **only if** you'll touch accounts or security rules. Rule
      changes are João's call.

## 3. Set up your Mac (30 minutes)

1. Install **Git**, **Node.js 20+**, **Python 3**, **Google Chrome** and **Claude Code**.
2. Install the test browser: `pip3 install playwright && python3 -m playwright install chromium`.
3. Get the code:
   - From the zip: unzip it and `cd aden-academy`. It is already a git repository connected to
     GitHub, so run `git pull` to get the latest.
   - Or clone it: `git clone https://github.com/edenangels/lumina-learning.git`.
4. Run it: `python3 -m http.server 8080`, then open http://localhost:8080 and choose
   **Continue as guest**.
5. Check everything works:
   - `node test/run.mjs` → about 350 passed;
   - `python3 test/e2e/smoke.py http://localhost:8080/` → PASS.

## 4. How a change goes (every time)

1. Run `git pull`.
2. Open Claude Code in the folder and describe the change in plain words.
3. Claude edits, then runs `node test/run.mjs` and the smoke test at **phone width (390)** and
   **desktop (1280)**, in **EN and PT**.
4. Look at it yourself in the browser, on a phone size too.
5. Publish (section 6). Then check the live site shows the new version.

## 5. The common jobs (just ask Claude; `MAINTAINING.md` has the exact steps)

- **Change wording or a button label:** in `data.js`, always in both languages.
- **Change a course's title, description or picture:** `brands/edenrise/content.js` and
  `media/covers/`.
- **Add a new lesson video:**
  1. Upload it to Vimeo.
  2. Paste the Vimeo link to Claude.
  3. Claude wires it in with `scripts/wire-course.mjs`.
  4. Claude gets the transcript from Vimeo's captions with `scripts/vimeo-transcribe.mjs`.
  5. Claude writes and checks the questions.
  6. Claude rebuilds the search.
  7. **You read the new questions before publishing.**
- **Add reels:** follow `REELS.md`.
- **Fix something that looks wrong:** send Claude a screenshot and say what you expected.

## 6. Publishing

- **Both hosts:** `scripts/deploy-pages.sh`. It runs the tests, bumps the version, builds and
  publishes to `edenrise-academy.pages.dev`. Then commit and `git push origin main`, which
  updates the GitHub mirror.
- Never publish with failing tests. If something breaks after publishing, tell João and
  redeploy the previous commit.
- After publishing, people may need to refresh twice to see the change. The version number
  handles this on its own.

## 7. House rules

1. **Two languages, always.** Portuguese is **European** Portuguese: equipa, ecrã,
   telemóvel, utilizador. Never Brazilian.
2. **Check at phone width.** Most of the team uses phones.
3. **No keys or passwords in the repo.** It is public.
4. **Don't rename the technical names.** The internal id `edenrise`, storage keys, Firebase
   project, file paths and the reels address stay as they are. Changing them signs everyone
   out or loses their progress. Only the words people read say ADEN.
5. **Certificates keep the legal employer name** (`company: 'EdenRise'` in brand.js) until
   João says otherwise.
6. **Ask João before** anything with domains/DNS, Firebase security rules, deleting
   learner data, or sending anything to the team.

## 8. Known open items (good first tasks)

- **Phone header:** on phones the logo doesn't show in the top bar and the search box runs off
  the right edge.
- **After a wrong answer, EdenRise shows the correct answer.** Belong Academy was changed to
  "review the moment, then answer again". Ask João whether ADEN should do the same.
- **Older videos still say "EdenRise" out loud.** That's expected. The AI tutor knows ADEN
  was formerly EdenRise.
- **Security-rules work on the Firebase project** is João's to schedule. Don't deploy rules.

## 9. Help

- **João:** product decisions, access, domains, anything legal.
- **Claude Code:** everything in the code. If Claude is unsure, it should say so, not guess.
