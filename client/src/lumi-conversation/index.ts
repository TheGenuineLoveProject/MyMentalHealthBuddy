/**
 * Phase 15 (spec-aligned) — Gentle Companion Conversation Layer.
 *
 * Standalone opt-in module. Coexists with v5.8.52 `companion-voice/`.
 * No production wiring is added by this module — host application chooses.
 *
 * Production import:
 *   import { LumiConversationPanel, runConversationRouter } from "@/lumi-conversation";
 */

export { LumiConversationPanel } from "./components/LumiConversationPanel";
export type { LumiConversationPanelProps } from "./components/LumiConversationPanel";

export { LumiMessageBubble } from "./components/LumiMessageBubble";
export type { LumiMessageBubbleProps } from "./components/LumiMessageBubble";

export { LumiInputBar } from "./components/LumiInputBar";
export type { LumiInputBarProps } from "./components/LumiInputBar";

export { LumiGroundingResponse } from "./components/LumiGroundingResponse";
export type { LumiGroundingResponseProps } from "./components/LumiGroundingResponse";

export { LumiReflectionCard } from "./components/LumiReflectionCard";
export type { LumiReflectionCardProps } from "./components/LumiReflectionCard";

// Public store access — read-only via selectors. Raw mutators are intentionally
// NOT exported from the barrel; hosts must use `submitUserTurn` (the only
// audited write path) or the public `reset()` action accessed via the store
// hook for clearing a sticky `critical` escalation.
export {
  useConversationStore,
  selectStep,
  selectShouldSuggestPause,
  selectIsCapped,
  MAX_DEPTH,
  PAUSE_SUGGESTION_DEPTH,
  MAX_HISTORY_RETAINED,
} from "./state/conversationState";
export type {
  ConversationStep,
  ConversationTurn,
  ConversationState,
  EmotionalTone,
  EscalationLevel,
} from "./state/conversationState";

// Router — `submitUserTurn` is the SINGLE hardened public write path.
// `runConversationRouter` is exposed for stateless inspection / advanced uses
// (e.g. dry-running an input before submitting); it does not mutate the store.
export { runConversationRouter, submitUserTurn } from "./runtime/conversationRouter";
export type { RouterInput, RouterDecision } from "./runtime/conversationRouter";

export { detectTone, ALL_TONES, TONE_COUNT } from "./runtime/emotionalToneDetector";
export type { ToneDetection } from "./runtime/emotionalToneDetector";

export {
  detectEscalation,
  CRISIS_RESOURCE_TEXT,
  ELEVATED_SUGGESTION_TEXT,
  CRITICAL_SIGNALS,
  ELEVATED_SIGNALS,
  CRITICAL_SIGNAL_COUNT,
  ELEVATED_SIGNAL_COUNT,
} from "./safety/escalationBoundaries";
export type { EscalationDetection } from "./safety/escalationBoundaries";

export {
  findForbiddenHits,
  isOutputSafe,
  detectPromptInjection,
  normalizeForMatch,
  FORBIDDEN_PHRASES,
  FORBIDDEN_REGEXES,
  FORBIDDEN_PHRASE_COUNT,
  FORBIDDEN_REGEX_COUNT,
} from "./safety/forbiddenPatterns";
export type { ForbiddenHit } from "./safety/forbiddenPatterns";

export {
  boundaryRules,
  auditBoundaries,
  BOUNDARY_RULE_COUNT,
  BOUNDARY_BLOCKING_COUNT,
  BOUNDARY_WARNING_COUNT,
  MAX_SENTENCES,
  MAX_RESPONSE_CHARS,
} from "./safety/emotionalBoundaryRules";
export type {
  BoundaryRule,
  BoundaryRuleSeverity,
  BoundaryAuditCtx,
  BoundaryAuditResult,
} from "./safety/emotionalBoundaryRules";

export {
  pickResponse,
  calmResponses,
  CALM_RESPONSE_COUNT,
} from "./content/calmResponses";
export type { CalmResponse } from "./content/calmResponses";

export {
  groundingPrompts,
  pickGroundingPrompt,
  GROUNDING_PROMPT_COUNT,
} from "./content/groundingPrompts";
export type { GroundingPrompt } from "./content/groundingPrompts";

export {
  reflectionPrompts,
  pickReflectionPrompt,
  REFLECTION_PROMPT_COUNT,
} from "./content/reflectionPrompts";
export type { ReflectionPrompt } from "./content/reflectionPrompts";

export {
  LUMI_SYSTEM_PROMPT,
  LUMI_SYSTEM_PROMPT_VERSION,
} from "./prompts/lumiSystemPrompt";

export { conversationMotion } from "./motion/calmCheckinMotion";
export type { ConversationMotionTokens } from "./motion/calmCheckinMotion";
