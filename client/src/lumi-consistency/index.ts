/**
 * Phase 25 — Lumi Cross-Platform Consistency
 * Public barrel.
 */

export {
  LUMI_IDENTITY,
  LUMI_VISUAL_RGB,
  LUMI_VOICE_CAPS,
  LUMI_TIMING,
  LUMI_TONE_MARKERS,
  LUMI_ACCESSIBILITY,
  LUMI_EMOTIONAL_STATES,
  LUMI_INTERACTION_PATTERNS,
  LUMI_CONSISTENCY_TOKENS,
} from "./tokens/lumiConsistencyTokens";
export type {
  LumiEmotionalState,
  LumiInteractionPattern,
} from "./tokens/lumiConsistencyTokens";

export {
  COMPANION_PRINCIPLES,
  validateAllPrinciples,
} from "./identity/sharedCompanionPrinciples";
export type {
  CompanionPrinciple,
  PrincipleValidationResult,
} from "./identity/sharedCompanionPrinciples";

export {
  ENFORCEMENT_RULES,
  runEnforcementValidation,
} from "./governance/crossPlatformEnforcementRules";
export type {
  EnforcementSeverity,
  EnforcementRule,
  PlatformReport,
  RuleResult,
  EnforcementReport,
} from "./governance/crossPlatformEnforcementRules";

export {
  ADAPTATION_BOUNDARIES,
  SIZE_BOUNDARY,
  ANIMATION_BOUNDARY,
  VOICE_BOUNDARY,
  INPUT_BOUNDARY,
  DISPLAY_BOUNDARY,
  HAPTIC_BOUNDARY,
  BATTERY_BOUNDARY,
  getBoundary,
} from "./governance/crossPlatformAdaptationBoundaries";
export type { Platform, AdaptationBoundary } from "./governance/crossPlatformAdaptationBoundaries";

export {
  PRESERVED_PATTERNS,
  listPreservedPatterns,
  checkPatternTiming,
} from "./runtime/preservedInteractionPatterns";
export type {
  PreservedPatternSpec,
  PatternTiming,
  PatternStateTransition,
} from "./runtime/preservedInteractionPatterns";

export { runIdentityVerification } from "./runtime/identityVerificationSystem";
export type {
  IdentityVerificationData,
  IdentityVerificationReport,
  CheckResult,
} from "./runtime/identityVerificationSystem";

export { useConsistencyState } from "./runtime/useConsistencyState";
export type { UseConsistencyStateReturn } from "./runtime/useConsistencyState";
