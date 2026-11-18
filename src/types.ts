// The presence's inputs, as in app/ui/src/activity.ts: which state she is in and how loud each voice is.
export type PresenceState =
  "ready" | "listening" | "thinking" | "speaking" | "hold";
export interface Levels {
  user: number;
  bot: number;
  userBands?: Float32Array;
  botBands?: Float32Array;
}
