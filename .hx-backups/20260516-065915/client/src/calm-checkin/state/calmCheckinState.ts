/**
 * Phase 14 (spec-aligned) — Calm Check-In Entry Flow.
 *
 * Six states per spec:
 *   idle → (breathing | grounding | reflecting) → complete → continue
 *
 * Hard contracts (enforced at the reducer layer + governance + render):
 *   - The "continue" state is the ONLY place where signup messaging is allowed.
 *     Even there, the spec phrases it as "Optional signup later" — never CTAs
 *     like "Subscribe now" / "Unlock" / "Optimize".
 *   - You cannot reach "continue" without first completing one of the three
 *     calming exercises (breathing / grounding / reflecting).
 *   - "complete" is a terminal soft landing; transitioning to "continue" is an
 *     explicit, opt-in action.
 *
 * Built on Zustand (already in deps from v5.8.48).
 */

import { create } from "zustand";

export type CalmCheckinStep =
  | "idle"
  | "breathing"
  | "grounding"
  | "reflecting"
  | "complete"
  | "continue";

export type CalmExerciseKind = "breathing" | "grounding" | "reflecting";

export type CalmCheckinState = {
  step: CalmCheckinStep;
  /** Which exercise the user chose from idle. null until a choice is made. */
  exerciseChosen: CalmExerciseKind | null;
  /** Did the user actually complete the exercise (anti-skip guard for "continue")? */
  exerciseCompleted: boolean;
  /** Optional reflection text — never persisted, never required. */
  reflectionText: string;
  /** How many times the user repeated breathing. Spec says one is enough; repeat is optional. */
  breathingRepeats: number;
};

export type CalmCheckinActions = {
  chooseExercise: (kind: CalmExerciseKind) => void;
  markExerciseCompleted: () => void;
  repeatBreathing: () => void;
  setReflection: (text: string) => void;
  goToComplete: () => void;
  goToContinue: () => void;
  reset: () => void;
};

export const REQUIRE_EXERCISE_BEFORE_CONTINUE = true;

const initialState: CalmCheckinState = {
  step: "idle",
  exerciseChosen: null,
  exerciseCompleted: false,
  reflectionText: "",
  breathingRepeats: 0,
};

export const useCalmCheckinStore = create<CalmCheckinState & CalmCheckinActions>(
  (set, get) => ({
    ...initialState,

    chooseExercise: (kind) => {
      // Only valid from idle.
      if (get().step !== "idle") {
        if (typeof console !== "undefined") {
          console.warn(
            `[calm-checkin] chooseExercise(${kind}) ignored — not in idle (step=${get().step}).`,
          );
        }
        return;
      }
      set({ step: kind, exerciseChosen: kind, exerciseCompleted: false });
    },

    markExerciseCompleted: () => {
      const s = get().step;
      if (s !== "breathing" && s !== "grounding" && s !== "reflecting") {
        if (typeof console !== "undefined") {
          console.warn(
            `[calm-checkin] markExerciseCompleted ignored — not in an exercise (step=${s}).`,
          );
        }
        return;
      }
      set({ exerciseCompleted: true });
    },

    repeatBreathing: () => {
      if (get().step !== "breathing") return;
      set((s) => ({ breathingRepeats: s.breathingRepeats + 1, exerciseCompleted: false }));
    },

    setReflection: (text) => {
      if (get().step !== "reflecting") return;
      // Cap at a soft limit; reflection is optional and ephemeral.
      set({ reflectionText: (text ?? "").slice(0, 600) });
    },

    goToComplete: () => {
      const s = get().step;
      if (s !== "breathing" && s !== "grounding" && s !== "reflecting") return;
      if (!get().exerciseCompleted) {
        if (typeof console !== "undefined") {
          console.warn(
            "[calm-checkin] goToComplete ignored — exercise not marked completed.",
          );
        }
        return;
      }
      set({ step: "complete" });
    },

    goToContinue: () => {
      // HARD GATE: must be in complete AND have completed an exercise.
      if (get().step !== "complete") return;
      if (REQUIRE_EXERCISE_BEFORE_CONTINUE && !get().exerciseCompleted) {
        if (typeof console !== "undefined") {
          console.warn(
            "[calm-checkin] goToContinue blocked — exercise not completed.",
          );
        }
        return;
      }
      set({ step: "continue" });
    },

    reset: () => set({ ...initialState }),
  }),
);

// ── Selectors (public, read-only — barrel re-exports these instead of the store) ──

export function selectStep(s: CalmCheckinState): CalmCheckinStep {
  return s.step;
}

/**
 * The ONLY place where optional signup messaging may appear.
 * All three conditions required: step=continue, exercise actually completed,
 * and the module-level guard not lifted.
 */
export function isOptionalSignupAllowed(s: CalmCheckinState): boolean {
  if (!REQUIRE_EXERCISE_BEFORE_CONTINUE) return false;
  return s.step === "continue" && s.exerciseCompleted === true;
}
