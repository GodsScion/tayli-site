# Architecture

## Files

| File            | What it is                                                                                                                                                                                                                                                                                                                      |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `index.html`    | The whole page, pre-rendered: every word is in the HTML, so it reads with JS off. Head holds SEO, Open Graph, Twitter, JSON-LD and icon tags.                                                                                                                                                                                   |
| `404.html`      | GitHub Pages' not-found page (second Vite input, `vite.config.ts`).                                                                                                                                                                                                                                                             |
| `src/style.css` | Tokens copied from `app/ui/src/page.css` (palette `--p0..2`, ground/ink/line), light by default and dark under `prefers-color-scheme`.                                                                                                                                                                                          |
| `src/main.ts`   | The hero loop: `start()` makes one `Swarm`, runs `requestAnimationFrame` only while the canvas is on screen and the tab visible, idles "listening" with a faint `breath()`, and on Play demo runs "thinking" 1.2 s then "speaking" 15 s on `envelope()`. `DEMO_CLIP` is the hook for a real clip (`clipLevel()` reads its RMS). |
| `src/swarm.ts`  | The app's Swarm look (`app/ui/src/swarm.ts`), unchanged except below.                                                                                                                                                                                                                                                           |
| `src/bands.ts`  | The app's voice bands (`app/ui/src/bands.ts`): `easeBands`, `voiceBands`.                                                                                                                                                                                                                                                       |
| `src/types.ts`  | `PresenceState` and `Levels`, as in `app/ui/src/activity.ts`.                                                                                                                                                                                                                                                                   |
| `public/`       | Static files copied as is: CNAME, robots, sitemap, manifest, icons, og image, poster, the Funnel Display wordmark font (OFL licence beside it).                                                                                                                                                                                 |
| `tools/`        | Not shipped: `og.html` + `assets.sh` make the images, `shoot.mjs` takes exact-viewport screenshots over the DevTools protocol.                                                                                                                                                                                                  |

## How the presence was adapted

The app's `Presence.tsx` is a React wrapper around per-look drawers plus loop rules for the app's window (focus,
battery saver, WebGL loss). The site needs only the default look, so only `Swarm` and what it imports were copied.
`Swarm.frame(dt, state, levels, reduced)` is the same API: the site feeds it synthetic levels instead of the call's
microphone and speaker. Changes to the copies: the light/dark test reads `prefers-color-scheme` (the app toggles a
`.dark` class); `frameInterval`, `settles`, `binRanges` and `bandLevels` were dropped as unused. Reduced motion is the
app's own rule: Swarm slows to 0.2x and ignores the voice. Fluid and Ribbon are not shipped; adding one means copying
its file and swapping the class in `main.ts`.

## Where time goes

LCP is the h1 text (system font, pre-rendered). The only blocking resources are one CSS file (2 KB gzipped) and the
preloaded wordmark font; the canvas has a fixed aspect-ratio box, so it never shifts layout. JS is 2.6 KB gzipped and
deferred (module script). Each frame draws 560 points in 12 path batches.
