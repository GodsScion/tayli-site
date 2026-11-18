// The voice's spectrum as four log-spaced bands, for the Swarm and Ribbon (Fluid keeps its one level): body, vowels,
// consonants, sibilance. Each band is the mean dB of its FFT bins, mapped to 0..1 by its own floor and ceiling, because
// speech carries far less energy up high than down low; smoothing is quick to rise and slower to fall.
import type { Levels, PresenceState } from "./types";

// Copied from app/ui/src/bands.ts; the FFT readers (binRanges, bandLevels) are dropped, as the site has no microphone.
export const BAND_EDGES_HZ = [100, 300, 1000, 3000, 8000];
export const BAND_COUNT = BAND_EDGES_HZ.length - 1;
const RISE_PER_S = 30;
const FALL_PER_S = 8;
// With no spectrum to read (a test's Levels), the one level spreads over the bands at these weights.
const LEVEL_WEIGHTS = [1, 0.7, 0.5, 0.3];
const SILENT = new Float32Array(BAND_COUNT);

/** Moves `shown` toward `target` over `dt` seconds, quick up and slower down. In place. */
export function easeBands(
  shown: Float32Array,
  target: Float32Array,
  dt: number,
) {
  for (let k = 0; k < BAND_COUNT; k++) {
    const rate = target[k] > shown[k] ? RISE_PER_S : FALL_PER_S;
    shown[k] += (target[k] - shown[k]) * (1 - Math.exp(-dt * rate));
  }
}

/** The bands a look follows this frame: the speaker's measured spectrum, silent under reduced motion or off-voice
 * states; `scratch` takes the level spread over the bands when the Levels carry no spectrum. */
export function voiceBands(
  state: PresenceState,
  levels: Levels,
  reduced: boolean,
  scratch: Float32Array,
): Float32Array {
  const speaking = state === "speaking";
  if (reduced || (!speaking && state !== "listening")) {
    return SILENT;
  }
  const measured = speaking ? levels.botBands : levels.userBands;
  if (measured) {
    return measured;
  }
  const level = speaking ? levels.bot : levels.user;
  for (let k = 0; k < BAND_COUNT; k++) {
    scratch[k] = LEVEL_WEIGHTS[k] * level;
  }
  return scratch;
}
