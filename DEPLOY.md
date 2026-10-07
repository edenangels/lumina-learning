# Deploy instruction — EdenRise Academy
> **Since 2026-10-07 the Academy has two hosts.** GitHub Pages is back, now under **edenangels/lumina-learning** (public): a push to `main` runs `.github/workflows/pages.yml` and serves https://edenangels.github.io/lumina-learning/. Cloudflare Pages (`scripts/deploy-pages.sh` → edenrise-academy.pages.dev) stays as the second host. Release = push to main AND run the script. The custom domain academy.edenrise.com is attached to whichever host João frees it for at GoDaddy (see ClickUp B0).
>
> **History:** 2026-09-16 the site was served by Cloudflare Pages only, not GitHub Pages. The GitHub account that
> hosted it (meridante-dev) was suspended and every site on it went dark. Deploy with
> `scripts/deploy-pages.sh` (tests → version bump → minified build on the SSD → `wrangler pages deploy`
> → curl-verify `edenrise-academy.pages.dev`). The custom domain `academy.edenrise.com` is a CNAME at
> GoDaddy → `edenrise-academy.pages.dev`. GitHub is a mirror (`backup` remote → edenangels/lumina-learning-backup);
> the old Actions workflow stays for the day the account returns. Uptime + app errors: https://academy-watch.edenrise.workers.dev


When the build work is done, deploy like this:

1. **Sanity-check before shipping:** `node --check app.js && node --check data.js` must pass, and the app must boot clean in the local preview (no new console errors, no horizontal overflow at 390px — or 320px if you touched layout — on any page you changed).

2. **Bump the cache version — read it fresh first.** Run `grep -o "v=edr[0-9]*" index.html | sort -u` to see the CURRENT number — do not assume it from memory; parallel sessions move it. Then bump every `?v=edrN` in index.html to N+1, and set the matching `const VERSION = 'edenrise-vN+1'` in sw.js. **Both must move together** or returning browsers serve stale files.

3. **Check for foreign commits, then commit and push:** `git log --oneline -3` and `git status` first — another session may have committed since you last looked; re-read any file right before editing it. Commit with a descriptive message and push to `main`. If the push 403s, run `gh auth switch --hostname github.com --user meridante-dev` (the Angel-Team7 account sometimes grabs the credential) and push again.

4. **Verify the deploy by curling the live site, not the workflow status.** The push triggers `.github/workflows/pages.yml` (checkout → esbuild minify → upload-pages-artifact → deploy-pages; local source stays unminified). Content often goes live before the run reports completed, so poll:
   ```
   curl -s "https://academy.edenrise.com/?nocache=$RANDOM" | grep -o "v=edr[0-9]*"
   ```
   until it shows your new number (typically 1–6 min). Also confirm `curl -s .../sw.js | grep edenrise-v` matches. Never use `/pages/builds/latest` — it reports "errored" forever on this repo.

5. **If deploy-pages fails instantly with "Deployment failed, try again later"** (site-level Pages status "errored", GitHub status all green — this repo's Pages backend has gotten stuck twice), reset the Pages site:
   ```
   gh api -X DELETE repos/meridante-dev/lumina-learning/pages
   gh api -X POST repos/meridante-dev/lumina-learning/pages -f build_type=workflow
   gh workflow run pages.yml
   ```

6. **Tell the user to hard-refresh** (Cmd+Shift+R; on iPhone: force-quit and reopen) — the service worker holds the old shell until its next update cycle otherwise.

## Security note (public repo)
- Never commit AI provider keys — the team Gemini key lives ONLY in Firestore `config/org` (written via Admin → Settings or the Firestore REST API).
- **Firestore rules cannot be compile-checked on this machine.** `firebase emulators:exec` needs a Java runtime that is not installed, so there is no local syntax check. `firebase deploy --only firestore:rules` validates before applying, which means a syntax error fails safe rather than shipping — but it also means the deploy command IS the first check. `node test/run.mjs` covers the *semantics* (both admin predicates requiring `realIdentity()`, and events/anchors/proofs staying create-only), not the syntax.
- The Firebase web config in auth.js is public by design; security lives in `firestore.rules` (deploy with `firebase deploy --only firestore:rules --project edenrise-academy` — the `--project` flag is required, a stale global alias points elsewhere).
- `MAIL.secret` in data.js is public by design (client-only app); the real wall is the **recipient allowlist inside the Apps Script** (`ALLOWED_DOMAINS`/`ALLOWED_EXTRA` in apps-script/nudge-mailer.gs) — keep it in place when redeploying the script.
