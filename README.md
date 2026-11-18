# tayli.org

The marketing site for Tayli, a local-first voice assistant for macOS. Plain HTML and CSS plus one small TypeScript
module, bundled by Vite into static files. No framework, server, analytics or third-party requests.

## Build

```bash
npm ci
npm run dev            # http://localhost:5173
npm run build          # type-check, then static files in dist/
npm run preview        # serve dist/ on http://localhost:4173
npm run lint && npm run format:check
```

## Deploy

Pushing to `main` runs `.github/workflows/pages.yml`: format check, lint, build, then deploy `dist/` to GitHub Pages.
`public/CNAME` points Pages at `tayli.org`. One-time setup in the repo's Settings > Pages: Source "GitHub Actions",
custom domain `tayli.org`, Enforce HTTPS; at the DNS host, the four GitHub Pages A records (and AAAA) for the apex.

## Images

`public/og.png`, `poster.jpg`, the icons and `favicon.ico` come from `tools/og.html` (the real Swarm drawing).
With `npm run dev` running, `tools/assets.sh` regenerates them. `node tools/shoot.mjs <url> <w> <h> <light|dark> <out>
[full]` takes screenshots at an exact viewport.

## Demo clip

Put the clip in `public/media/`, set `DEMO_CLIP` in `src/main.ts` to its path (Play demo then plays it and drives the
presence from its loudness), and add a `<source>` to the `<video>` in `index.html` where the comment says.
