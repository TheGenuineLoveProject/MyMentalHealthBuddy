/**
 * Phase 15 — Gentle Companion Conversation Layer.
 * Standalone, opt-in module. Zero production wiring by default.
 *
 * Public surface only — internals (engine functions, copy bank, governance
 * rules) are reached by direct path imports from inside the module ONLY.
 * A boundary test in __tests/ enforces this in CI.
 */

export { MMHBCompanion } from "./components/MMHBCompanion";
export type { MMHBCompanionProps } from "./components/MMHBCompanion";

export { MMHBCompanionMessage } from "./components/MMHBCompanionMessage";
export type { MMHBCompanionMessageProps } from "./components/MMHBCompanionMessage";

export { MMHBCompanionInput } from "./components/MMHBCompanionInput";
export type { MMHBCompanionInputProps } from "./components/MMHBCompanionInput";

// Pure engine — safe to call from anywhere (no side effects).
export { generateResponse, MAX_MESSAGE_LENGTH } from "./engine/companionEngine";

// Governance probe — for opt-in callers that want to audit their own usage.
export {
  REQUIRE_CRISIS_OVERRIDE,
  REQUIRE_OPT_OUT_ON_EVERY_RESPONSE,
  auditResponse,
} from "./governance/companionRules";
export type {
  CompanionRule,
  RuleResult,
  RuleSeverity,
} from "./governance/companionRules";

export type {
  CompanionInput,
  CompanionResponse,
  EmotionCategory,
  OarsTechnique,
  ResponseIntent,
} from "./types/companionVoiceTypes";
