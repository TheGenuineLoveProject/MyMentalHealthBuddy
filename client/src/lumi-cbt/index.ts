/**
 * Phase 32 — lumi-cbt public barrel.
 *
 * Opt-in standalone module. No production wiring. No imports from
 * `@/lumi-registry` or any other lumi-* module — coupling stays one-way
 * via the host wiring layer (when one ships).
 */

export type {
  EmotionRating,
  ThoughtRecord,
  ValidationResult,
} from "./worksheets/thoughtRecord";
export {
  THOUGHT_RECORD_TEMPLATE,
  createThoughtRecord,
  validateThoughtRecord,
} from "./worksheets/thoughtRecord";

export type { Activity, ActivitySchedule, PleasureMasteryScores } from "./worksheets/behavioralActivation";
export {
  createActivitySchedule,
  addActivity,
  calculatePleasureMasteryScores,
  containsShould,
  ValuesBasedViolationError,
} from "./worksheets/behavioralActivation";

export type { DefusionExercise, DefusionExerciseType } from "./worksheets/cognitiveDefusion";
export { DEFUSION_EXERCISES, getDefusionExercise } from "./worksheets/cognitiveDefusion";

export type { CBTSession, CBTSessionStatus, CBTWorksheetType } from "./engine/CBTSessionEngine";
export { CBTSessionEngine } from "./engine/CBTSessionEngine";

export type { CBTSessionStats, UseCBTSessionApi } from "./engine/useCBTSession";
export { useCBTSession } from "./engine/useCBTSession";

export type { CbtSafetyRule } from "./governance/cbtSafetyRules";
export {
  CBT_SAFETY_RULES,
  CBT_NEVER_REPLACES_THERAPY_NOTICE,
  containsSelfHarmIndicator,
} from "./governance/cbtSafetyRules";
