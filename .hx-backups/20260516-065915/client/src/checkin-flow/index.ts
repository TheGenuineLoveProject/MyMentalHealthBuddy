/**
 * Phase 14 — Calm Check-In Entry Flow.
 * Standalone, opt-in module. Zero production wiring by default.
 */

export { MMHBCheckInFlow } from "./components/MMHBCheckInFlow";
export type { MMHBCheckInFlowProps } from "./components/MMHBCheckInFlow";

// External consumers get controlled hooks ONLY — never the raw Zustand store
// (which would expose `.setState()` and allow governance bypass).
export {
  REQUIRE_BREATHING_BEFORE_OFFER,
  isSubscriptionMessagingAllowed,
  useCheckInFlowState,
  useCheckInFlowActions,
} from "./state/useCheckInFlowStore";

export {
  auditFlow,
  rules as checkInFlowRules,
  REQUIRE_BREATHING_BEFORE_OFFER_LOCKED,
} from "./governance/checkInFlowRules";
export type {
  CheckInFlowRule,
  RuleResult,
  RuleSeverity,
} from "./governance/checkInFlowRules";

export type {
  BreathingPhase,
  BreathingPhaseConfig,
  FlowActions,
  FlowState,
  FlowStep,
  IsSubscriptionMessagingAllowed,
  MoodId,
  MoodOption,
  ShiftId,
  ShiftOption,
} from "./types/checkInFlowTypes";

export {
  breathingCycle,
  breathingTotalSeconds,
  moods,
  offerCopy,
  shiftOptions,
  welcomeCopy,
} from "./copy/microCopy";
