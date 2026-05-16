/**
 * Phase 36 — lumi-agent public barrel.
 *
 * Provider-agnostic. Hosts pass their own `chatFn` callback.
 */

export { LUMI_SYSTEM_PROMPT } from "./prompts/lumiSystemPrompt";

export type { GuardrailAction, SafetyGuardrail, GuardrailMatch } from "./prompts/lumiSafetyGuardrails";
export {
  SAFETY_GUARDRAILS,
  evaluateGuardrails,
  CRISIS_REDIRECT_MESSAGE,
  BOUNDARY_REDIRECT_MESSAGE,
  MEDICAL_REDIRECT_MESSAGE,
} from "./prompts/lumiSafetyGuardrails";

export type {
  AgentMessage,
  AgentMessageRole,
  AgentChatRequest,
  AgentChatFn,
  AgentSendResult,
  AgentRuntimeOptions,
} from "./runtime/AgentRuntime";
export { AgentRuntime, DEFAULT_FALLBACK_MESSAGE } from "./runtime/AgentRuntime";

export type { UseLumiAgentConfig, UseLumiAgentApi } from "./runtime/useLumiAgent";
export { useLumiAgent } from "./runtime/useLumiAgent";

export type { FeedbackEntry, FeedbackStats, FeedbackVote } from "./feedback/feedbackLoop";
export { submitFeedback, getFeedbackStats, clearFeedback } from "./feedback/feedbackLoop";

export type { AgentGovernanceRule } from "./governance/agentGovernanceRules";
export { AGENT_GOVERNANCE_RULES } from "./governance/agentGovernanceRules";
