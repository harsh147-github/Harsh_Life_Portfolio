#!/usr/bin/env bash
# The site now lives on Cloudflare (harshsonavane.com, deployed by Cloudflare Workers Builds on push).
# This publishes a small redirect page to the old GitHub Pages address so existing links still work.
# Usage: npm run deploy:gh-redirect
set -euo pipefail

root="$(git rev-parse --show-toplevel)"
remote="$(git -C "$root" remote get-url origin)"
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT

cp "$root"/scripts/gh-pages-redirect/*.html "$work/"
touch "$work/.nojekyll"

cd "$work"
git init -q -b gh-pages
git add -A
git -c user.name="$(git -C "$root" config user.name || echo deploy)" \
    -c user.email="$(git -C "$root" config user.email || echo deploy@localhost)" \
    commit -q -m "Redirect to harshsonavane.com"
git push -q --force "$remote" gh-pages
echo "Published GitHub Pages redirect to harshsonavane.com"
