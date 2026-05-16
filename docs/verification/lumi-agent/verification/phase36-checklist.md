# Phase 36 — lumi-agent Verification Checklist

## Files (8 + barrel)

| Path | Purpose |
|---|---|
| `prompts/lumiSystemPrompt.ts` | Frozen Lumi LLM system prompt |
| `prompts/lumiSafetyGuardrails.ts` | 6 guardrails + `evaluateGuardrails` |
| `runtime/AgentRuntime.ts` | Adapter-pattern runtime, hardened sendMessage |
| `runtime/useLumiAgent.ts` | React hook with crisis state |
| `feedback/feedbackLoop.ts` | In-memory feedback + stats |
| `governance/agentGovernanceRules.ts` | 8 rules + module-load floor |
| `verification/phase36-checklist.md` | This file |
| `index.ts` | Public barrel |

## Pass criteria

- [x] `LUMI_SYSTEM_PROMPT` includes all 6 sections (identity, OARS, tone, forbidden, boundaries, format)
- [x] `SAFETY_GUARDRAILS.length >= 6` (module-load throw on breach)
- [x] `AGENT_GOVERNANCE_RULES.length >= 8` (module-load throw on breach)
- [x] `AgentRuntime` clamps `temperature ≤ 0.7`, `maxTokens ≤ 150`, `timeoutMs ≤ 10_000`
- [x] `AgentRuntime.sendMessage` runs guardrails BEFORE chatFn invocation
- [x] `AgentRuntime.sendMessage` runs guardrails AFTER chatFn response
- [x] Self-harm match returns `crisisTriggered: true`
- [x] Empty/aborted/thrown chatFn returns the fallback message
- [x] `clear()` wipes message history (consent-revoke path)

## Trust boundaries

- **No LLM SDK imported** — runtime is provider-agnostic via the `chatFn` callback. Host passes API key + provider implementation; module never touches credentials.
- **Guardrails are the contract** — they run on both user input and model output. Removing the post-LLM scan would let an off-prompt model leak forbidden content.
- **Feedback store is in-memory** — hosts persisting must obtain explicit consent (governance Rule 3).
