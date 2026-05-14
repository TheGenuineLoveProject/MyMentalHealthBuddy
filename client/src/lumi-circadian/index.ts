/**
 * Phase 22 — Presence Scheduler & Circadian Calm
 * Public barrel. Single hardened import surface.
 */

// Components
export { OptInPrompt } from "./components/OptInPrompt";
export type { OptInPromptProps } from "./components/OptInPrompt";
export { QuietNudge } from "./components/QuietNudge";
export type { QuietNudgeProps } from "./components/QuietNudge";

// Runtime
export { useCircadianScheduler } from "./runtime/useCircadianScheduler";
export type { UseCircadianSchedulerReturn } from "./runtime/useCircadianScheduler";

// State machine — read-only surface only.
//
// Architect-driven hardening: `schedulerReducer` and `SchedulerAction` are
// intentionally NOT re-exported from the public barrel. The reducer trusts
// caller-supplied `action.now`, and a host calling it directly with a
// forged timestamp could bypass the sleep window and daily-limit gates.
// External code MUST go through `useCircadianScheduler`, which builds
// every dispatch from `new Date()` internally. Tests import the reducer
// from the runtime module path directly so contract coverage is preserved
// without expanding the trust boundary.
export {
  INITIAL_STATE,
  PHASE_WINDOWS,
  SLEEP_WINDOW_START_HOUR,
  SLEEP_WINDOW_END_HOUR,
  MAX_NUDGES_PER_DAY,
  MIN_MS_BETWEEN_NUDGES,
  resolvePhase,
  isSleepWindow,
  localDayKey,
  canDispatchNudge,
} from "./runtime/circadianStateMachine";
export type {
  CircadianPhase,
  SchedulerStatus,
  SchedulerState,
  PendingNudge,
} from "./runtime/circadianStateMachine";

// Presets
export {
  CIRCADIAN_SCENES,
  resolveScene,
  listScenes,
} from "./presets/circadianScenes";

// Governance (read-only)
export {
  FORBIDDEN_PHRASES,
  REQUIRED_TONE_MARKERS,
  MAX_NUDGE_COPY_CHARS,
  MAX_NUDGE_MICRO_CHARS,
  containsForbiddenPhrase,
  auditScenePreset,
  assertScenePresetCompliant,
} from "./governance/schedulerSafetyRules";
export type {
  CircadianScenePreset,
  SchedulerAuditFinding,
} from "./governance/schedulerSafetyRules";
