/**
 * Phase 36 — Agent governance contract.
 */

export interface AgentGovernanceRule {
  readonly id: string;
  readonly title: string;
  readonly detail: string;
  readonly enforcement: "blocking" | "advisory";
}

export const AGENT_GOVERNANCE_RULES: ReadonlyArray<AgentGovernanceRule> = Object.freeze([
  {
    id: "guardrails-before-display",
    title: "All responses filtered through safety guardrails before display",
    detail: "AgentRuntime.sendMessage runs evaluateGuardrails on both inbound user text and outbound model text.",
    enforcement: "blocking",
  },
  {
    id: "crisis-detection-every-message",
    title: "Crisis detection runs on every user message",
    detail: "Self-harm guardrail patterns evaluated synchronously before LLM call.",
    enforcement: "blocking",
  },
  {
    id: "no-server-storage-without-consent",
    title: "No conversation data stored server-side without opt-in",
    detail: "AgentRuntime keeps messages in-memory. Hosts that persist must obtain explicit consent.",
    enforcement: "blocking",
  },
  {
    id: "user-can-delete-history",
    title: "User can delete conversation history at any time",
    detail: "AgentRuntime.clear() and useLumiAgent.clear() expose one-call wipe.",
    enforcement: "blocking",
  },
  {
    id: "temperature-cap-0_7",
    title: "LLM temperature capped at 0.7",
    detail: "AgentRuntime constructor clamps temperature to ≤ 0.7.",
    enforcement: "blocking",
  },
  {
    id: "max-tokens-150",
    title: "Max tokens per response: 150",
    detail: "AgentRuntime constructor clamps maxTokens to ≤ 150.",
    enforcement: "blocking",
  },
  {
    id: "response-timeout-10s",
    title: "Response timeout: 10 seconds",
    detail: "AgentRuntime constructor clamps timeoutMs to ≤ 10_000 and aborts on expiry.",
    enforcement: "blocking",
  },
  {
    id: "fallback-on-failure",
    title: "Fallback message on failure",
    detail: "On chatFn throw, abort, or empty response: \"I'm having trouble responding. Please try again or reach out to 988 if you need immediate support.\"",
    enforcement: "blocking",
  },
]);

if (AGENT_GOVERNANCE_RULES.length < 8) {
  throw new Error(
    `[lumi-agent] AGENT_GOVERNANCE_RULES floor breached: expected ≥8, got ${AGENT_GOVERNANCE_RULES.length}`,
  );
}
