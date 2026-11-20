#!/bin/sh
# Copies the legal texts from the app repo (the source of truth) into legal/. Run after a legal merge on the app's main.
set -eu
here=$(cd "$(dirname "$0")/.." && pwd)
cp "$here/../app/docs/legal/terms.md" "$here/../app/docs/legal/privacy.md" "$here/legal/"
