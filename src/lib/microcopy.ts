export type MicrocopyCategory =
  | "consent"
  | "encouragement"
  | "boundaries"
  | "progress"
  | "errors"
  | "cta";

export const MICROCOPY: Record<MicrocopyCategory, string[]> = {
  consent: [
    "You’re in charge here.",
    "Pause, skip, or stop anytime.",
    "Choose the gentlest option that still feels supportive.",
    "No pressure — small is valid.",
  ],
  encouragement: [
    "That makes sense.",
    "You’re not alone in this.",
    "One kind step is enough.",
    "Even one honest sentence counts.",
  ],
  boundaries: [
    "What would self-respect look like here?",
    "What’s a ‘good enough’ boundary for today?",
    "You can care and still say no.",
  ],
  progress: [
    "Consistency over intensity.",
    "Gentle momentum is still momentum.",
    "Skip days are allowed.",
  ],
  errors: [
    "Nothing is broken. Let’s try again.",
    "Not loaded yet — refresh or come back in a minute.",
    "No entries yet. Want a tiny start?",
  ],
  cta: [
    "Start gently",
    "Try a 60-second reset",
    "Take one small step",
    "Continue when you’re ready",
    "Save this for later",
  ],
};

// Deterministic-ish rotation so copy feels consistent but not repetitive.
// Seed can be route name + day-of-year, etc.
export function rotateMicrocopy(category: MicrocopyCategory, seed: number): string {
  const arr = MICROCOPY[category];
  if (!arr || arr.length === 0) return "";
  const idx = Math.abs(seed) % arr.length;
  return arr[idx];
}