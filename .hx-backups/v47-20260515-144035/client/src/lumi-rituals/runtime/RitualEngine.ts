/**
 * Phase 20 — Guided Presence Rituals · Engine
 *
 * Pure (no React, no DOM) state + reducer for a guided ritual session.
 * The hook layer (`useRitual`) wraps this engine and adds the soft timer.
 *
 * Identity contract:
 *  - Engine never references Lumi avatar shape, color, animation, or DOM.
 *  - Engine never persists state. Sessions are ephemeral by design — no
 *    streaks, no progress to lose.
 *
 * Skip / pause / exit are all first-class, available from any non-terminal
 * status. There is no "you must finish" path through the state machine.
 */

export type RitualKey =
  | "softArrival"
  | "oneBreathReset"
  | "grounding54321"
  | "gentleTransition"
  | "holdingSpace"
  | "sleepSoftener"
  | "tinyHope";

export const RITUAL_KEYS: readonly RitualKey[] = Object.freeze([
  "softArrival",
  "oneBreathReset",
  "grounding54321",
  "gentleTransition",
  "holdingSpace",
  "sleepSoftener",
  "tinyHope",
]);

/** Optional breath cadence advisory; the UI only renders text labels. */
export type BreathCadence = {
  inhale?: number; // seconds
  hold?: number; // seconds
  exhale?: number; // seconds
  /** Human-readable label, used when reduced-motion is on. */
  pattern?: string;
};

export type RitualStep = {
  id: string;
  /** Primary gentle line. ≤ MAX_STEP_COPY_CHARS. */
  copy: string;
  /** Optional smaller helper line ("nothing to prove" etc.). */
  microCopy?: string;
  /**
   * Soft advisory duration. The hook will auto-advance after this many ms
   * IF the user hasn't paused. Always skippable by user input. Never
   * enforces — leaving the screen idle past this duration is fine.
   */
  durationMs?: number;
  /** Optional breath cadence; UI shows text only (no enforced animation). */
  breath?: BreathCadence;
};

export type RitualPreset = {
  /** Internal identifier; never surfaced as a "pick your ritual" label. */
  internalName: string;
  /** Stable id, used for keys / telemetry. */
  id: string;
  /** Routing key — one of 7 spec-locked rituals. */
  ritualKey: RitualKey;
  /** Soft invitation shown before the first step ("We can begin gently"). */
  invitationText: string;
  /** Ordered steps. */
  steps: RitualStep[];
  /** Soft closing shown when the user reaches the last step. */
  closing: string;
  /** Total advisory duration; informational only. ≤ MAX_RITUAL_DURATION_MS. */
  totalSoftDurationMs: number;
};

/** Lifecycle status. */
export type RitualStatus =
  | "idle" // before start
  | "active" // running, current step visible
  | "paused" // user-requested pause; timer halted
  | "completed" // user reached the end naturally
  | "skipped" // user skipped the entire ritual
  | "exited"; // user closed the ritual mid-flow

export type RitualState = {
  status: RitualStatus;
  /** Index into preset.steps; valid only when status is "active" | "paused". */
  stepIndex: number;
  /** True once the user has interacted at all (used for telemetry only). */
  hasInteracted: boolean;
};

export const INITIAL_STATE: RitualState = Object.freeze({
  status: "idle",
  stepIndex: 0,
  hasInteracted: false,
});

export type RitualAction =
  | { type: "start" }
  | { type: "pause" }
  | { type: "resume" }
  | { type: "advance" } // soft timer fired or "Next" pressed
  | { type: "skipStep" } // skip just the current step
  | { type: "skipAll" } // skip the rest of the ritual
  | { type: "exit" } // user closed the surface entirely
  | { type: "reset" };

/** Pure reducer. Never mutates input. */
export function ritualReducer(
  state: RitualState,
  action: RitualAction,
  preset: RitualPreset,
): RitualState {
  switch (action.type) {
    case "start": {
      if (state.status !== "idle" && state.status !== "exited" && state.status !== "completed" && state.status !== "skipped") {
        return state;
      }
      return { status: "active", stepIndex: 0, hasInteracted: true };
    }
    case "pause": {
      if (state.status !== "active") return state;
      return { ...state, status: "paused", hasInteracted: true };
    }
    case "resume": {
      if (state.status !== "paused") return state;
      return { ...state, status: "active", hasInteracted: true };
    }
    case "advance": {
      if (state.status !== "active") return state;
      const next = state.stepIndex + 1;
      if (next >= preset.steps.length) {
        return { ...state, status: "completed", hasInteracted: true };
      }
      return { ...state, stepIndex: next, hasInteracted: true };
    }
    case "skipStep": {
      if (state.status !== "active" && state.status !== "paused") return state;
      const next = state.stepIndex + 1;
      if (next >= preset.steps.length) {
        return { status: "completed", stepIndex: state.stepIndex, hasInteracted: true };
      }
      return { status: "active", stepIndex: next, hasInteracted: true };
    }
    case "skipAll": {
      if (state.status === "completed" || state.status === "exited") return state;
      return { ...state, status: "skipped", hasInteracted: true };
    }
    case "exit": {
      if (state.status === "exited") return state;
      return { ...state, status: "exited", hasInteracted: true };
    }
    case "reset": {
      return { status: "idle", stepIndex: 0, hasInteracted: false };
    }
    default:
      return state;
  }
}

/** True when the ritual is in a terminal status (no further actions expected). */
export function isTerminalStatus(s: RitualStatus): boolean {
  return s === "completed" || s === "skipped" || s === "exited";
}

/**
 * Pure dedupe helper used by `GuidedPresenceRitual` to fire `onClose`
 * exactly once per terminal transition, even under React StrictMode +
 * parent re-renders.
 *
 * Contract:
 *  - Non-terminal status → no notify. If status is "idle" the dedupe
 *    guard is cleared (so a future terminal transition will fire again).
 *  - Terminal status equal to the last notified terminal status → no notify.
 *  - Terminal status different from the last notified status → notify
 *    once, advance the guard.
 *
 * Extracted from the component so it can be unit-tested without a
 * React renderer / DOM.
 */
export function shouldNotifyTerminal(
  currentStatus: RitualStatus,
  lastNotified: RitualStatus | null,
): { notify: boolean; nextLastNotified: RitualStatus | null } {
  if (!isTerminalStatus(currentStatus)) {
    return {
      notify: false,
      nextLastNotified: currentStatus === "idle" ? null : lastNotified,
    };
  }
  if (lastNotified === currentStatus) {
    return { notify: false, nextLastNotified: lastNotified };
  }
  return { notify: true, nextLastNotified: currentStatus };
}
