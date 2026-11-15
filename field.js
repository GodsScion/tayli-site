// Hero: a text-glyph swarm that breathes like the app's Swarm presence and leans toward the pointer.
// Plain DOM text, one <pre>; stills itself under prefers-reduced-motion and when the tab is hidden.
const field = document.getElementById("field");
const GLYPHS = " .·:+*oO@";
const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
let pointerX = 0;
let pointerY = 0;

function size() {
  return {
    cols: Math.ceil(field.clientWidth / 8.4),
    rows: Math.ceil(field.clientHeight / 14),
  };
}

function frame(t) {
  const { cols, rows } = size();
  const lines = [];
  for (let y = 0; y < rows; y++) {
    let line = "";
    for (let x = 0; x < cols; x++) {
      const dx = (x / cols - 0.5 - pointerX * 0.05) * 2;
      const dy = ((y / rows - 0.5 - pointerY * 0.05) * 2 * rows * 14) / (cols * 8.4);
      const r = Math.hypot(dx, dy);
      const wave = Math.sin(r * 14 - t * 0.0016 + Math.atan2(dy, dx) * 3);
      const shell = Math.max(0, 1 - Math.abs(r - 0.42 - 0.04 * Math.sin(t * 0.001)) * 4);
      const level = Math.floor(shell * (0.6 + 0.4 * wave) * (GLYPHS.length - 1));
      line += GLYPHS[Math.max(0, level)];
    }
    lines.push(line);
  }
  field.textContent = lines.join("\n");
}

function loop(t) {
  if (!document.hidden) {
    frame(t);
  }
  setTimeout(() => requestAnimationFrame(loop), 66);
}

addEventListener("pointermove", (e) => {
  pointerX = e.clientX / innerWidth - 0.5;
  pointerY = e.clientY / innerHeight - 0.5;
});

// The still frame is drawn whenever the field's size changes: drawn once at script time it came out empty
// when layout had not yet sized the field (WebKit, 1 in 10 loads).
if (still) {
  new ResizeObserver(() => frame(0)).observe(field);
} else {
  requestAnimationFrame(loop);
}
