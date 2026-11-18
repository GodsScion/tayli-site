#!/bin/bash
# Regenerates public/og.png, poster.jpg and the icons from tools/og.html with headless Chrome. Needs `npm run dev` on 5173.
set -eu
cd "$(dirname "$0")/.."
chrome="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
shot() { "$chrome" --headless --hide-scrollbars --force-color-profile=srgb --blink-settings=preferredColorScheme=0 --virtual-time-budget=3000 --window-size="$2" --screenshot="$1" "http://localhost:5173/tools/og.html?$3" 2>/dev/null; }
shot public/og.png 1200,630 "w=1200&h=630"
shot poster.png 1280,720 "w=1280&h=720"
for n in 512 192 180 32; do shot "icon-$n.png" "$n,$n" "icon=$n"; done
mv icon-512.png icon-192.png public/; mv icon-180.png public/apple-touch-icon.png
sips -s format jpeg -s formatOptions 80 poster.png --out public/poster.jpg >/dev/null && rm poster.png
sips -s format ico icon-32.png --out public/favicon.ico >/dev/null 2>&1 || cp icon-32.png public/favicon.ico; rm icon-32.png
