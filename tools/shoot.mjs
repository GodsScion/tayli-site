// Screenshots at an exact viewport through the DevTools protocol (headless Chrome's window is at least 500 px wide).
// Usage: node tools/shoot.mjs <url> <width> <height> <light|dark> <out.png> [fullPage]
import { spawn } from "node:child_process";
import { writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const [url, w, h, scheme, out, full] = process.argv.slice(2);
const chrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const port = 9300 + Math.floor(Math.random() * 500);
const proc = spawn(chrome, [
  "--headless",
  "--hide-scrollbars",
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${mkdtempSync(join(tmpdir(), "shoot-"))}`,
  "about:blank",
]);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let targets;
for (let i = 0; i < 50 && !targets; i++) {
  await sleep(200);
  targets = await fetch(`http://127.0.0.1:${port}/json`)
    .then((r) => r.json())
    .catch(() => undefined);
}
const ws = new WebSocket(
  targets.find((t) => t.type === "page").webSocketDebuggerUrl,
);
await new Promise((r) => ws.addEventListener("open", r));
let id = 0;
const waiting = new Map();
const errors = [];
ws.addEventListener("message", (e) => {
  const m = JSON.parse(e.data);
  if (m.id && waiting.has(m.id)) {
    waiting.get(m.id)(m.result);
  }
  if (
    m.method === "Runtime.exceptionThrown" ||
    (m.method === "Runtime.consoleAPICalled" && m.params.type === "error")
  ) {
    errors.push(JSON.stringify(m.params).slice(0, 300));
  }
});
const send = (method, params = {}) =>
  new Promise((r) => {
    waiting.set(++id, r);
    ws.send(JSON.stringify({ id, method, params }));
  });
const mobile = Number(w) < 600;
await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride", {
  width: Number(w),
  height: Number(h),
  deviceScaleFactor: mobile ? 2 : 1,
  mobile,
});
await send("Emulation.setEmulatedMedia", {
  features: [{ name: "prefers-color-scheme", value: scheme }],
});
await send("Page.navigate", { url });
await sleep(2500);
const width = await send("Runtime.evaluate", {
  expression: process.env.PROBE || "document.documentElement.scrollWidth",
});
let clip;
if (full) {
  const sh = await send("Runtime.evaluate", {
    expression: "document.documentElement.scrollHeight",
  });
  clip = { x: 0, y: 0, width: Number(w), height: sh.result.value, scale: 1 };
}
const shot = await send("Page.captureScreenshot", {
  format: "png",
  captureBeyondViewport: Boolean(full),
  ...(clip ? { clip } : {}),
});
writeFileSync(out, Buffer.from(shot.data, "base64"));
console.log(
  `${out} scrollWidth=${width.result.value} errors=${errors.length}`,
  errors.join("\n"),
);
ws.close();
proc.kill();
