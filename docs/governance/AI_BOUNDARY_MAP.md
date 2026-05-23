# MMHB AI Boundary Map

**Baseline:** 2026-05-23 (Phase 55)
**Mode:** descriptive map — no AI policy changes
**Authority:** MMHB v7.4 Governance Kernel + BHCE Primary Law

---

## 1. AI invocation surfaces (where LLM calls originate)

| # | Provider | Initiation point | Domain |
|---|---|---|---|
| 1 | Perplexity | server-side prompt runner | HEALING (research-style) |
| 2 | OpenAI | `server/replit_integrations/chat/routes.ts:5` (client init) | HEALING (chat) |
| 3 | Lumi agent (provider-abstracted) | `client/src/lumi-agent/runtime/AgentRuntime.ts` | HEALING |
| 4 | Generic prompt runner | `ai/core/promptRunner.ts:8` | shared |

All four pass through the **server-side safety pipeline** (`ai/core/redact.ts` + `ai/core/risk.ts`) before responses reach a user-facing component.

## 2. Prompt taxonomy

| Tree | Domain | Examples |
|---|---|---|
| `ai/healing/prompts/` | HEALING | `h01_*` through `h08_safety_check.md` |
| `ai/business/prompts/` | BUSINESS | `b01_*` through `b10_*` (do not mix with healing) |
| `client/src/lumi-agent/prompts/` | HEALING | `lumiSystemPrompt.ts`, `lumiSafetyGuardrails.ts` |
| `client/src/lumi-conversation/prompts/` | HEALING | conversational personas |

### 2.1 Domain isolation of prompt trees

The directory split (`ai/healing/` vs `ai/business/`) is a **first-line boundary**. A prompt file under `ai/business/` is never composed into a healing AI call, and vice versa, by directory convention. The audit did not find evidence of cross-tree composition.

## 3. Prompt-level safety prohibitions

### 3.1 Healing system prompts

| Rule | Source |
|---|---|
| "You do not diagnose, prescribe, treat, or evaluate." | `client/src/lumi-agent/prompts/lumiSystemPrompt.ts:13` |
| "NEVER ask 'why' or probe for details about the crisis." | `ai/healing/prompts/h08_safety_check.md:19` |
| "NEVER offer techniques… first." | `ai/healing/prompts/h08_safety_check.md:20` |
| "Every LLM-generated response MUST still pass through governance filters." | `client/src/lumi-conversation/prompts/lumiSystemPrompt.ts:9` |

### 3.2 Pattern-level guardrails

| File | What it blocks |
|---|---|
| `client/src/lumi-agent/prompts/lumiSafetyGuardrails.ts:54` | "diagnostic-language" pattern: phrases like "you have depression", "I diagnose you" |
| `client/src/lumi-rituals/governance/ritualSafetyRules.ts:71` | forbidden words: "subscribe", "upgrade" (BUSINESS contamination of HEALING) |
| `client/src/governance/interactions/HealingFlowProtectionRules.ts:26` | `vulnerability_pricing` — blocks pricing patterns near vulnerability signals |
| `client/src/governance/interactions/CrisisLanguagePattern.ts:2` | regex for crisis-keyword detection |

## 4. AI output sanitization pipeline

```
   ┌──────────────────────────────────────────────────────────┐
   │  LLM provider response (Perplexity / OpenAI / Lumi)      │
   └────────────────┬─────────────────────────────────────────┘
                    │
   ┌────────────────▼─────────────────────────────────────────┐
   │  Server-side sanitization                                │
   │  - ai/core/redact.ts     (PII / unsafe content scrub)    │
   │  - ai/core/risk.ts       (risk scoring + filter)         │
   └────────────────┬─────────────────────────────────────────┘
                    │
   ┌────────────────▼─────────────────────────────────────────┐
   │  Client-side governance gate                             │
   │  - client/src/lumi-agent/governance/agentGovernanceRules │
   │      .ts:58 — hardcoded resource-dump fallback if the    │
   │      response fails safety or the call throws            │
   │  - CrisisLanguagePattern regex → BHCE escalation         │
   └────────────────┬─────────────────────────────────────────┘
                    │
   ┌────────────────▼─────────────────────────────────────────┐
   │  Render surface                                          │
   │  - client/src/components/ChatWidget.tsx                  │
   │  - client/src/companion-voice/components/                │
   │      MMHBCompanionMessage.tsx                            │
   │  - lumi-conversation panels                              │
   └──────────────────────────────────────────────────────────┘
```

## 5. BHCE escalation chain

Per the kernel, **any explicit self-harm signal** triggers the asymmetric-risk-dominant escalation:

| Trigger | Response |
|---|---|
| `CrisisLanguagePattern` regex matches user input | display 988 + 741741 + 911 + `/crisis` |
| `CrisisLanguagePattern` regex matches LLM output | refuse render; substitute hardcoded resource dump |
| LLM call throws / fails safety check | hardcoded resource dump (no AI output reaches user) |
| LLM response confidence below threshold | hardcoded resource dump |

The **hardcoded fallback path** at `client/src/lumi-agent/governance/agentGovernanceRules.ts:58` is the BHCE last line of defense. It does **not** depend on the LLM, the network, or any non-static state. **This is correct asymmetric-risk design.**

## 6. AI boundary violations observed (audit findings)

### 6.1 Live violations

**None.** No instance of a healing AI surfacing pricing copy, a business AI surfacing crisis advice, or raw LLM output reaching a user without governance pass.

### 6.2 Structural risks (no live violation, but boundary thin)

| Severity | Risk | Mitigation status |
|---|---|---|
| MED | `server/replit_integrations/chat/routes.ts:110` returns `JSON.stringify`-d error to client | depends on UI handling; if the chat UI surfaces raw JSON on error, that's a platform-debug leak into a healing surface |
| MED | The **four** chat surfaces (`AIChat.jsx`, `chat/AIChatPanel.tsx`, `lumi-conversation/LumiConversationPanel.tsx`, `AICompanion.jsx`) each have independent state and may have independent prompt paths | risk that one surface drifts from governance-filtered path while others stay enforced; consolidation recommended |
| LOW | `ai/business/prompts/` and `ai/healing/prompts/` are separated by directory, but no compile-time enforcement prevents accidental cross-import | convention-based, not type-system-based |

## 7. Crisis-keyword surface

The crisis keyword set is centralized in `client/src/governance/interactions/CrisisLanguagePattern.ts:2`. Verifying it includes the canonical literals required by F-33.6 is a **prerequisite to safe operation** of the AI chat surfaces and is implicitly verified by the live `/crisis` literal probe (5/5 in production).

The keyword regex itself is **not enumerated** in this audit doc to avoid creating a public bypass surface. The regex source-of-truth is the file above.

## 8. AI provider failover

| Layer | Behavior |
|---|---|
| Provider call fails | hardcoded resource-dump (no retry to a different LLM with the same input) |
| Provider returns degraded output | governance filter catches; fallback substitutes |
| All providers unavailable | static `/crisis` page remains reachable (SPA fallback, F-33.6 literals static) |

The static `/crisis` page is **the universal floor**. No AI surface can degrade below it because no AI surface is on the critical path to `/crisis`.

## 9. Audit verdict

| Dimension | Verdict |
|---|---|
| Prompt isolation by domain (directory) | ✅ enforced by convention |
| Prompt-level safety prohibitions | ✅ explicit and tested |
| Server-side sanitization pipeline | ✅ present and routed (`ai/core/redact.ts`, `ai/core/risk.ts`) |
| Client-side governance gate | ✅ present (`agentGovernanceRules.ts`) |
| BHCE hardcoded fallback | ✅ present and provider-independent |
| Crisis keyword centralization | ✅ single source of truth |
| Chat surface count | ⚠️ **4 surfaces** — risk that one drifts from the enforcement path |
| Error-path leak via `JSON.stringify` | ⚠️ requires UI-side verification |
| Cross-domain prompt composition | ✅ not observed |

**Net AI boundary posture: healthy with named structural risks.** The four-chat-surface concern is the principal risk because it weakens the assumption that "every AI response goes through the gate" — if one surface bypasses, the others' enforcement does not protect it.

---

*This AI boundary map is descriptive of the implementation as of 2026-05-23. No prompt, guardrail, or governance rule is being modified in this audit. The four-chat-surface consolidation (§6.2) is the principal AI-boundary-relevant subject for a future planned phase.*
