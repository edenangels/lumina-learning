#!/usr/bin/env bash
# deploy-pages.sh — deploy the Academy to Cloudflare Pages from this machine.
#   scripts/deploy-pages.sh            # tests, bump ?v= + sw VERSION, build, deploy, verify
#   scripts/deploy-pages.sh --no-bump  # redeploy the current version
# Why: on 2026-09-16 the GitHub account hosting five sites was suspended and every
# site went dark. Hosting now lives on Cloudflare Pages (unlimited bandwidth, no
# build minutes), deployed straight from the working tree; GitHub is a mirror.
set -euo pipefail
cd "$(dirname "$0")/.."
PROJECT=${PAGES_PROJECT:-edenrise-academy}
DIST="/Volumes/Ultra Touch/Academy-OS/work/academy-dist"
[ -d "/Volumes/Ultra Touch" ] || { echo "✗ Ultra Touch SSD not mounted — the build runs there, never on the Mac disk"; exit 2; }
node test/run.mjs >/dev/null || { echo "✗ tests failing — not deploying"; exit 1; }
if [ "${1:-}" != "--no-bump" ]; then
  V=$(grep -o "v=edr[0-9]*" index.html | sort -u | head -1 | grep -oE "[0-9]+"); N=$((V+1))
  sed -i '' "s/v=edr$V/v=edr$N/g" index.html; sed -i '' "s/edenrise-v$V/edenrise-v$N/" sw.js
  echo "· version edr$V → edr$N"
fi
rm -rf "$DIST"; mkdir -p "$DIST"
rsync -a --exclude .git --exclude node_modules --exclude .stale --exclude media/reels --exclude exports --exclude .tmp-audio --exclude test --exclude scripts --exclude '*.md' --exclude .github ./ "$DIST/"
( cd "$DIST"
  for f in brands/edenrise/brand.js brands/_example/brand.js core/brandkit.js core/app.js brands/edenrise/content.js data.js sw.js; do npx --yes esbuild@0.24.2 "$f" --minify --charset=utf8 --outfile="$f" --allow-overwrite --log-level=error; done
  npx --yes esbuild@0.24.2 core/auth.js --minify --charset=utf8 --format=esm --outfile=core/auth.js --allow-overwrite --log-level=error
  npx --yes esbuild@0.24.2 core/styles.css --minify --outfile=core/styles.css --allow-overwrite --log-level=error
  printf '/*\n  X-Content-Type-Options: nosniff\n/knowledge/*\n  Cache-Control: public, max-age=600\n/fonts/*\n  Cache-Control: public, max-age=31536000, immutable\n' > _headers
  npx wrangler pages deploy . --project-name "$PROJECT" --branch main --commit-dirty=true 2>&1 | grep -E "Deployment complete|Success|error|Error" )
sleep 6
LIVE=$(curl -sL "https://$PROJECT.pages.dev/?nc=$RANDOM" | grep -o "v=edr[0-9]*" | sort -u | head -1)
echo "· live on pages.dev: ${LIVE:-none}"
