/**
 * Phase 22 — Presence Scheduler & Circadian Calm
 *
 * Pure state machine for the circadian presence scheduler. Zero React.
 * Zero DOM. Zero Lumi avatar references. Sessions are ephemeral —
 * the engine never persists state to disk on its own.
 *
 * Locked contracts:
 *  - Scheduling is OFF by default. The user must intentionally `optIn()`.
 *  - Phase-change notifications are OFF by default (a separate flag from
 *    `enabled`). Even an opted-in user is not nudged on phase change
 *    unless they have *also* turned on phase-change announcements.
 *  - User can `optOut()` at any time, from any state. Opting out wipes
 *    pending nudges and resets daily counters.
 *  - No nudges during the sleep window (default 22:00–07:00 local).
 *  - At most 3 nudges per local day.
 *  - At least 5 minutes between nudges.
 *  - Every dispatched nudge is dismissable + skippable; the engine never
 *    rejects a `dismiss` / `skip` action.
 */

// ─── Phases ────────────────────────────────────────────────────────────────
export type CircadianPhase =
  | "morning"
  | "midday"
  | "afternoon"
  | "evening"
  | "sleep";

/** Default phase windows (local hours, 24h). The sleep phase wraps midnight. */
export const PHASE_WINDOWS: ReadonlyArray<
  Readonly<{ phase: CircadianPhase; startHour: number; endHour: number }>
> = Object.freeze([
  Object.freeze({ phase: "morning" as const, startHour: 7, endHour: 11 }),
  Object.freeze({ phase: "midday" as const, startHour: 11, endHour: 14 }),
  Object.freeze({ phase: "afternoon" as const, startHour: 14, endHour: 17 }),
  Object.freeze({ phase: "evening" as const, startHour: 17, endHour: 22 }),
  // sleep wraps midnight: 22:00 → 07:00 next day
  Object.freeze({ phase: "sleep" as const, startHour: 22, endHour: 7 }),
]);

/** Sleep window (locked). No nudges may dispatch in this hour range. */
export const SLEEP_WINDOW_START_HOUR = 22;
export const SLEEP_WINDOW_END_HOUR = 7;

/** Pure phase resolver — given a Date, return the local phase. */
export function resolvePhase(now: Date): CircadianPhase {
  const h = now.getHours();
  // Sleep window first because it wraps midnight.
  if (h >= SLEEP_WINDOW_START_HOUR || h < SLEEP_WINDOW_END_HOUR) return "sleep";
  if (h >= 7 && h < 11) return "morning";
  if (h >= 11 && h < 14) return "midday";
  if (h >= 14 && h < 17) return "afternoon";
  return "evening";
}

/** True if the supplied moment falls inside the locked sleep window. */
export function isSleepWindow(now: Date): boolean {
  return resolvePhase(now) === "sleep";
}

// ─── Scheduler limits (locked) ─────────────────────────────────────────────
export const MAX_NUDGES_PER_DAY = 3;
export const MIN_MS_BETWEEN_NUDGES = 5 * 60 * 1000; // 5 minutes

// ─── State + actions ───────────────────────────────────────────────────────
export type SchedulerStatus = "disabled" | "idle" | "nudge-pending";

export type PendingNudge = Readonly<{
  /** Stable id used for dedupe by the host UI. */
  id: string;
  /** Phase that produced this nudge. */
  phase: CircadianPhase;
  /** Gentle copy (already audited at preset-import time). */
  copy: string;
  /** Optional micro-helper line. */
  microCopy?: string;
  /** Local-time ms timestamp at which the nudge was dispatched. */
  dispatchedAt: number;
}>;

export type SchedulerState = Readonly<{
  status: SchedulerStatus;
  /** Current opt-in. Mirrors `status !== "disabled"`. */
  enabled: boolean;
  /** Phase-change announcements (separate from baseline opt-in). */
  phaseChangeAnnouncementsEnabled: boolean;
  /** Last observed phase, for change detection. */
  lastObservedPhase: CircadianPhase | null;
  /** Local-day key (YYYY-MM-DD) the daily counter applies to. */
  dayKey: string | null;
  /** Number of nudges dispatched today. */
  nudgesDispatchedToday: number;
  /** Local-time ms timestamp of the last dispatched nudge (any phase). */
  lastNudgeAt: number | null;
  /** Currently-pending nudge (if any). One at a time. */
  pendingNudge: PendingNudge | null;
}>;

export const INITIAL_STATE: SchedulerState = Object.freeze({
  status: "disabled",
  enabled: false,
  phaseChangeAnnouncementsEnabled: false,
  lastObservedPhase: null,
  dayKey: null,
  nudgesDispatchedToday: 0,
  lastNudgeAt: null,
  pendingNudge: null,
});

export type SchedulerAction =
  | { type: "optIn" }
  | { type: "optOut" }
  | { type: "setPhaseChangeAnnouncements"; enabled: boolean }
  | {
      type: "dispatchNudge";
      now: Date;
      nudge: Omit<PendingNudge, "dispatchedAt">;
    }
  | { type: "acknowledge" }
  | { type: "skip" }
  | { type: "dismiss" }
  | { type: "observePhase"; now: Date };

// ─── Helpers ───────────────────────────────────────────────────────────────
/** YYYY-MM-DD using local time — drives daily counter rollover. */
export function localDayKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Pure gate: can a nudge dispatch RIGHT NOW under the locked scheduler
 * limits? Used by the reducer and by `useCircadianScheduler` before it
 * even attempts to construct a nudge — guarantees the rules can never
 * be bypassed by direct dispatch.
 */
export function canDispatchNudge(
  state: SchedulerState,
  now: Date,
): { allowed: true } | { allowed: false; reason: string } {
  if (!state.enabled) return { allowed: false, reason: "scheduler-disabled" };
  if (state.status === "nudge-pending")
    return { allowed: false, reason: "nudge-already-pending" };
  if (isSleepWindow(now))
    return { allowed: false, reason: "sleep-window-active" };

  const today = localDayKey(now);
  const counter =
    state.dayKey === today ? state.nudgesDispatchedToday : 0;
  if (counter >= MAX_NUDGES_PER_DAY)
    return { allowed: false, reason: "daily-limit-reached" };

  const lastAt = state.lastNudgeAt ?? 0;
  if (now.getTime() - lastAt < MIN_MS_BETWEEN_NUDGES)
    return { allowed: false, reason: "min-spacing-not-elapsed" };

  return { allowed: true };
}

// ─── Reducer ───────────────────────────────────────────────────────────────
export function schedulerReducer(
  state: SchedulerState,
  action: SchedulerAction,
): SchedulerState {
  switch (action.type) {
    case "optIn": {
      if (state.enabled) return state;
      return {
        ...state,
        status: "idle",
        enabled: true,
        // Opt-in does NOT auto-enable phase-change announcements.
        // That is a separate, also-off-by-default flag.
        pendingNudge: null,
      };
    }

    case "optOut": {
      // Wipe pending nudge + counters so a re-opt-in starts clean.
      return {
        ...INITIAL_STATE,
        // Preserve phase-change preference across opt-out so user doesn't
        // have to re-set it; but it stays inert while disabled.
        phaseChangeAnnouncementsEnabled:
          state.phaseChangeAnnouncementsEnabled,
      };
    }

    case "setPhaseChangeAnnouncements": {
      return { ...state, phaseChangeAnnouncementsEnabled: action.enabled };
    }

    case "dispatchNudge": {
      const gate = canDispatchNudge(state, action.now);
      if (!gate.allowed) return state; // fail-closed; never push past gate
      const today = localDayKey(action.now);
      const counter =
        state.dayKey === today ? state.nudgesDispatchedToday : 0;
      const dispatchedAt = action.now.getTime();
      const pending: PendingNudge = {
        ...action.nudge,
        dispatchedAt,
      };
      return {
        ...state,
        status: "nudge-pending",
        dayKey: today,
        nudgesDispatchedToday: counter + 1,
        lastNudgeAt: dispatchedAt,
        pendingNudge: pending,
      };
    }

    case "acknowledge":
    case "skip":
    case "dismiss": {
      // All three terminate the pending nudge identically — the engine
      // does not differentiate "user engaged" vs. "user skipped". This
      // is intentional: the contract says no required responses.
      if (state.status !== "nudge-pending") return state;
      return { ...state, status: "idle", pendingNudge: null };
    }

    case "observePhase": {
      const phase = resolvePhase(action.now);
      const today = localDayKey(action.now);
      // Day rollover — reset counter (preserve lastNudgeAt for spacing
      // across midnight if needed).
      const counter =
        state.dayKey === today ? state.nudgesDispatchedToday : 0;
      return {
        ...state,
        lastObservedPhase: phase,
        dayKey: today,
        nudgesDispatchedToday: counter,
      };
    }

    default:
      return state;
  }
}
