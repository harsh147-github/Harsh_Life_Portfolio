#!/usr/bin/env bash
# Publish the production build (dist/) to the gh-pages branch for GitHub Pages.
# Usage: npm run deploy
set -euo pipefail

root="$(git rev-parse --show-toplevel)"
remote="$(git -C "$root" remote get-url origin)"
source_sha="$(git -C "$root" rev-parse --short HEAD)"
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT

cp -R "$root/dist/." "$work/"
touch "$work/.nojekyll"          # serve files as-is, no Jekyll processing
cp "$work/index.html" "$work/404.html"

cd "$work"
git init -q -b gh-pages
git add -A
git -c user.name="$(git -C "$root" config user.name || echo deploy)" \
    -c user.email="$(git -C "$root" config user.email || echo deploy@localhost)" \
    commit -q -m "Deploy ${source_sha}"
git push -q --force "$remote" gh-pages
echo "Deployed ${source_sha} to gh-pages"
