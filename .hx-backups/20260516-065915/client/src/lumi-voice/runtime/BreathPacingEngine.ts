/**
 * Phase 23 — BreathPacingEngine
 * FROZEN 7.1s breath cycle. Pure functions only. Zero React/DOM.
 *
 * Cycle (total 7100ms):
 *   inhale  0    – 2800   (2800ms)
 *   hold    2800 – 3200   ( 400ms)
 *   exhale  3200 – 6800   (3600ms)
 *   rest    6800 – 7100   ( 300ms)
 */

export const BREATH_CYCLE_MS = 7100 as const;
export const BREATH_INHALE_MS = 2800 as const;
export const BREATH_HOLD_MS = 400 as const;
export const BREATH_EXHALE_MS = 3600 as const;
export const BREATH_REST_MS = 300 as const;

if (
  BREATH_INHALE_MS + BREATH_HOLD_MS + BREATH_EXHALE_MS + BREATH_REST_MS !==
  BREATH_CYCLE_MS
) {
  throw new Error(
    "[lumi-voice] BreathPacingEngine: phase durations must sum to BREATH_CYCLE_MS (7100ms).",
  );
}

export type BreathPhase = "inhale" | "hold" | "exhale" | "rest";

export interface BreathState {
  readonly phase: BreathPhase;
  readonly phaseElapsedMs: number;
  readonly phaseProgress: number; // 0..1
  readonly cycleProgress: number; // 0..1
}

const PHASE_BOUNDS: ReadonlyArray<{
  readonly phase: BreathPhase;
  readonly start: number;
  readonly end: number;
}> = [
  { phase: "inhale", start: 0, end: BREATH_INHALE_MS },
  { phase: "hold", start: BREATH_INHALE_MS, end: BREATH_INHALE_MS + BREATH_HOLD_MS },
  {
    phase: "exhale",
    start: BREATH_INHALE_MS + BREATH_HOLD_MS,
    end: BREATH_INHALE_MS + BREATH_HOLD_MS + BREATH_EXHALE_MS,
  },
  {
    phase: "rest",
    start: BREATH_INHALE_MS + BREATH_HOLD_MS + BREATH_EXHALE_MS,
    end: BREATH_CYCLE_MS,
  },
];

export function getCurrentBreathPhase(elapsedMs: number): BreathState {
  const safeElapsed = Number.isFinite(elapsedMs) && elapsedMs >= 0 ? elapsedMs : 0;
  const t = safeElapsed % BREATH_CYCLE_MS;
  for (const window of PHASE_BOUNDS) {
    if (t >= window.start && t < window.end) {
      const span = window.end - window.start;
      const phaseElapsedMs = t - window.start;
      return {
        phase: window.phase,
        phaseElapsedMs,
        phaseProgress: span > 0 ? phaseElapsedMs / span : 0,
        cycleProgress: t / BREATH_CYCLE_MS,
      };
    }
  }
  // Fallback (should be unreachable due to floor at rest.end).
  return { phase: "rest", phaseElapsedMs: 0, phaseProgress: 0, cycleProgress: 0 };
}
