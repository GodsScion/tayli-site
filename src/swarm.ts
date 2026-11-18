// Tayli's presence, Swarm: copied from app/ui/src/swarm.ts (the app's default look). Site changes: the theme is read
// from prefers-color-scheme, and the app's loop helpers (frameInterval, settles) are dropped.

import type { Levels, PresenceState } from "./types";
import { BAND_COUNT, easeBands, voiceBands } from "./bands";

// At 2 device pixels per CSS pixel WebKit's GPU process spent 15.3% while she spoke; the points stay sharp at 1.5.
const MAX_SCALE = 1.5;
// A cross-fade passes through a new colour every frame: keep the cache small.
const CACHE_MAX = 64;

/** Device pixels per CSS pixel for the canvas: the screen's, at most MAX_SCALE. */
export function canvasScale(devicePixels: number): number {
  return Math.min(devicePixels || 1, MAX_SCALE);
}

const SATURATION: Record<PresenceState, number> = {
  ready: 1,
  listening: 1,
  thinking: 1,
  speaking: 1,
  hold: 0.08,
};
const SPEED: Record<PresenceState, number> = {
  ready: 1,
  listening: 1.2,
  thinking: 1,
  speaking: 1,
  hold: 0.25,
};
const GOLDEN = Math.PI * (3 - Math.sqrt(5));
const POINTS = 560;
const BUCKETS = 12;
// Each voice band (bands.ts) ripples the ring at its own harmonic and speed: body slow and wide, sibilance fast and fine.
const HARMONICS = [3, 5, 8, 13];
const RIPPLE_SPEED = [3, -4, 5, -6];
// Sibilance sprays points off the ring, and the spectrum's tilt (bright minus dull) turns the colour.
const SPRAY = 0.25;
const TILT_HUE = 0.15;

export type Rgb = [number, number, number];

// Light theme: her pale palette deepened (more saturated, then darker) so a look reads on white (Sai, 2026-11-11).
const LIGHT_SATURATE = 1.25;
const LIGHT_DARKEN = 0.62;

/** A palette colour as drawn on the light theme: saturated by LIGHT_SATURATE, then darkened by LIGHT_DARKEN, both
 * scaled by `amount` (the state's saturation, so the grey hold disc stays pale). */
export function deepen(c: Rgb, amount: number): Rgb {
  const l = 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2];
  const saturate = 1 + (LIGHT_SATURATE - 1) * amount;
  const darken = 1 + (LIGHT_DARKEN - 1) * amount;
  return c.map((v) =>
    Math.min(1, Math.max(0, (l + (v - l) * saturate) * darken)),
  ) as Rgb;
}

/** A CSS colour (the live, cross-fading --p0..2) as sRGB 0..1, read through a 1x1 canvas and cached by its text. */
export function rgbReader(): (css: string) => Rgb {
  const probe = document
    .createElement("canvas")
    .getContext("2d", { willReadFrequently: true });
  const cache = new Map<string, Rgb>();
  return (css) => {
    const known = cache.get(css);
    if (known || !probe) {
      return known ?? [0.5, 0.5, 0.5];
    }
    probe.clearRect(0, 0, 1, 1);
    probe.fillStyle = css;
    probe.fillRect(0, 0, 1, 1);
    const [r, g, b] = probe.getImageData(0, 0, 1, 1).data;
    const rgb: Rgb = [r / 255, g / 255, b / 255];
    if (cache.size >= CACHE_MAX) {
      cache.clear();
    }
    cache.set(css, rgb);
    return rgb;
  };
}

interface Point {
  x: number;
  y: number;
  z: number;
  seed: number;
  rate: number;
  i: number;
}

export class Swarm {
  private readonly points: Point[] = Array.from({ length: POINTS }, (_, i) => ({
    x: (Math.random() - 0.5) * 0.2,
    y: (Math.random() - 0.5) * 0.2,
    z: 0,
    seed: Math.random(),
    rate: 2.5 + Math.random() * 6,
    i,
  }));
  private readonly toRgb = rgbReader();
  private time = Math.random() * 30;
  private level = 0;
  private sat = 1;
  private readonly bands = new Float32Array(BAND_COUNT);
  private readonly scratch = new Float32Array(BAND_COUNT);

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly ctx: CanvasRenderingContext2D,
  ) {}

  /** One frame: ease the shape at 4/s and the voice level at 16/s; under reduced motion slow to 0.2x, no voice. */
  frame(dt: number, state: PresenceState, levels: Levels, reduced: boolean) {
    this.sat += (SATURATION[state] - this.sat) * (1 - Math.exp(-dt * 4));
    this.time += dt * (reduced ? 0.2 : SPEED[state]);
    const voice =
      reduced || (state !== "speaking" && state !== "listening")
        ? 0
        : state === "speaking"
          ? levels.bot
          : levels.user;
    this.level += (voice - this.level) * (1 - Math.exp(-dt * 16));
    easeBands(this.bands, voiceBands(state, levels, reduced, this.scratch), dt);
    this.draw(dt, state);
  }

  private target(
    q: Point,
    state: PresenceState,
  ): [number, number, number, number] {
    const t = this.time;
    const i = q.i;
    if (state === "thinking") {
      // Three comets chase each other; the lead pulls ahead and falls back.
      const c = i % 3;
      const j = Math.floor(i / 3) / (POINTS / 3);
      const a =
        t * 2.9 +
        (c * 2 * Math.PI) / 3 +
        0.45 * Math.sin(t * 1.5 + c * 2.1) -
        j * 1.9;
      const r = 0.38 + (q.seed - 0.5) * 0.06 * j;
      return [r * Math.cos(a), r * Math.sin(a), 1 - j, (c + j) / 3];
    }
    if (state === "speaking" || state === "listening") {
      // Speaking bursts into a radial spectrum; listening contracts with his voice.
      const a = i * GOLDEN;
      const base = 0.2 + 0.18 * Math.sqrt(q.seed);
      let w = 0;
      for (let k = 0; k < BAND_COUNT; k++) {
        w += this.bands[k] * Math.sin(HARMONICS[k] * a + t * RIPPLE_SPEED[k]);
      }
      const dir = state === "listening" ? -0.5 : 1;
      const spray = 1 + SPRAY * this.bands[3] * (q.seed * 2 - 1);
      const r = base * spray * (1 + dir * (this.level * 0.45 + w * 0.35));
      return [
        r * Math.cos(a),
        r * Math.sin(a),
        q.seed,
        (a / (2 * Math.PI) +
          t * 0.08 +
          TILT_HUE * (this.bands[3] - this.bands[0])) %
          1,
      ];
    }
    if (state === "hold") {
      const r = 0.13 * Math.sqrt((i + 0.5) / POINTS);
      const a = i * GOLDEN;
      return [r * Math.cos(a), r * Math.sin(a), 0.4, 0.5];
    }
    // Ready: a slowly turning globe of points with a drifting shimmer.
    const y = 1 - (2 * (i + 0.5)) / POINTS;
    const rr = Math.sqrt(1 - y * y);
    const phi = i * GOLDEN + t * 0.35;
    const x = rr * Math.cos(phi);
    const z = rr * Math.sin(phi);
    const tilt = 0.45;
    const yy = y * Math.cos(tilt) - z * Math.sin(tilt);
    const zz = y * Math.sin(tilt) + z * Math.cos(tilt);
    const R = 0.4 + 0.025 * Math.sin(t * 1.3 + q.seed * 6);
    return [R * x, R * yy, (zz + 1) / 2, (x + 1) / 4 + t * 0.06];
  }

  /** Palette colour i from the live CSS variable, desaturated on hold, deepened on the light theme. */
  private color(style: CSSStyleDeclaration, i: number, light: boolean): Rgb {
    const css = style.getPropertyValue(`--p${i}`);
    const c = this.toRgb(css.trim());
    const l = 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2];
    const shown = c.map((v) => l + (v - l) * this.sat) as Rgb;
    return light ? deepen(shown, this.sat) : shown;
  }

  private draw(dt: number, state: PresenceState) {
    const dpr = canvasScale(devicePixelRatio);
    const w = Math.max(1, Math.round(this.canvas.clientWidth * dpr));
    const h = Math.max(1, Math.round(this.canvas.clientHeight * dpr));
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
    }
    const ctx = this.ctx;
    ctx.clearRect(0, 0, w, h);
    const half = Math.min(w, h) / 2;
    const light = !matchMedia("(prefers-color-scheme: dark)").matches;
    ctx.globalCompositeOperation = light ? "source-over" : "lighter";
    const paths = Array.from({ length: BUCKETS }, () => new Path2D());
    const size = Math.max(0.9, (half / 150) * 1.6);
    for (const q of this.points) {
      const [tx, ty, depth, hue] = this.target(q, state);
      const k = 1 - Math.exp(-dt * q.rate);
      q.x += (tx - q.x) * k;
      q.y += (ty - q.y) * k;
      q.z += (depth - q.z) * k;
      const px = w / 2 + q.x * half;
      const py = h / 2 - q.y * half;
      const r = size * (0.55 + q.z * 0.9) * (1 + this.level * 0.5);
      const bucket = Math.floor((((hue % 1) + 1) % 1) * BUCKETS) % BUCKETS;
      paths[bucket].moveTo(px + r, py);
      paths[bucket].arc(px, py, r, 0, Math.PI * 2);
    }
    const style = getComputedStyle(this.canvas);
    const palette = [0, 1, 2].map((i) => this.color(style, i, light));
    for (let b = 0; b < BUCKETS; b++) {
      // Each hue bucket blends between two neighbouring palette colours round the wheel.
      const u = (b / BUCKETS) * 3;
      const from = Math.floor(u);
      const c0 = palette[from];
      const c1 = palette[(from + 1) % 3];
      const c = c0.map((v, i) => v + (c1[i] - v) * (u - from));
      ctx.fillStyle = `rgba(${c.map((v) => Math.round(v * 255)).join()},${light ? 0.95 : 0.75})`;
      ctx.fill(paths[b]);
    }
    ctx.globalCompositeOperation = "source-over";
  }
}
