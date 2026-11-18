// The hero's presence: the app's Swarm on one canvas, idling "listening", and the Play demo control that makes her
// speak on a synthetic voice envelope. The page's copy is pre-rendered HTML; this module only animates.
import { Swarm } from "./swarm";
import type { Levels, PresenceState } from "./types";

const DEMO_S = 15;
const THINK_S = 1.2;

// Hook for the demo clip: set this to the clip's URL (say "/media/demo.m4a") and the demo plays it, reading her
// voice level from it with an AnalyserNode instead of the synthetic envelope below.
const DEMO_CLIP: string | null = null;

/** A speech-like loudness at time t seconds: syllables at about 4 per second, grouped into phrases with short pauses. */
export function envelope(t: number): number {
  const phrase = Math.sin((2 * Math.PI * t) / 3.1) > -0.55 ? 1 : 0.05;
  const syllable =
    0.5 + 0.5 * Math.sin(2 * Math.PI * 4.1 * t + Math.sin(t * 1.7) * 2);
  const stress = 0.75 + 0.25 * Math.sin(2 * Math.PI * 0.9 * t);
  return Math.min(1, phrase * syllable * stress * 0.85);
}

/** His idle "listening" level: a faint breath so the ring is never frozen. */
function breath(t: number): number {
  return 0.04 + 0.03 * Math.sin(t * 1.3);
}

function clipLevel(audio: HTMLAudioElement): () => number {
  const context = new AudioContext();
  const analyser = context.createAnalyser();
  context.createMediaElementSource(audio).connect(analyser);
  analyser.connect(context.destination);
  const samples = new Float32Array(analyser.fftSize);
  return () => {
    analyser.getFloatTimeDomainData(samples);
    let sum = 0;
    for (const s of samples) {
      sum += s * s;
    }
    return Math.min(1, Math.sqrt(sum / samples.length) * 4);
  };
}

function start(canvas: HTMLCanvasElement, button: HTMLButtonElement): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  }
  const swarm = new Swarm(canvas, ctx);
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const levels: Levels = { user: 0, bot: 0 };
  let state: PresenceState = "listening";
  let demoFrom = -1;
  let demoLevel: (() => number) | null = null;
  let visible = true;
  let pending = 0;
  let last = performance.now();

  const stopDemo = () => {
    demoFrom = -1;
    state = "listening";
    button.setAttribute("aria-pressed", "false");
    button.textContent = "Play demo";
  };

  const tick = (now: number) => {
    pending = 0;
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    const t = now / 1000;
    levels.bot = 0;
    levels.user = breath(t);
    if (demoFrom >= 0) {
      const into = t - demoFrom;
      state = into < THINK_S ? "thinking" : "speaking";
      levels.bot = demoLevel ? demoLevel() : envelope(into - THINK_S);
      if (into > THINK_S + DEMO_S) {
        stopDemo();
      }
    }
    swarm.frame(dt, state, levels, motion.matches);
    if (visible && !document.hidden) {
      pending = requestAnimationFrame(tick);
    }
  };
  const resume = () => {
    if (!pending && visible && !document.hidden) {
      last = performance.now();
      pending = requestAnimationFrame(tick);
    }
  };

  button.addEventListener("click", () => {
    if (demoFrom >= 0) {
      stopDemo();
      return;
    }
    demoFrom = performance.now() / 1000;
    button.setAttribute("aria-pressed", "true");
    button.textContent = "Stop demo";
    if (DEMO_CLIP) {
      const audio = new Audio(DEMO_CLIP);
      demoLevel = clipLevel(audio);
      void audio.play();
      audio.addEventListener("ended", stopDemo);
    }
    resume();
  });
  // Off screen or in a hidden tab she does not draw at all.
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    resume();
  }).observe(canvas);
  document.addEventListener("visibilitychange", resume);
  resume();
}

const canvas = document.querySelector<HTMLCanvasElement>("#presence");
const button = document.querySelector<HTMLButtonElement>("#play-demo");
if (canvas && button) {
  start(canvas, button);
}
