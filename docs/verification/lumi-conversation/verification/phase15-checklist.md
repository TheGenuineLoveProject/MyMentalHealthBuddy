# Phase 15 — Spec Alignment Checklist

This module (`client/src/lumi-conversation/`) is the **spec-aligned variant** of Phase 15. It coexists with v5.8.52's `client/src/companion-voice/` (which used a different file layout). Both modules are standalone, opt-in, and unwired in production.

## Spec → File Map

| Spec path | This module | Shipped? |
|---|---|---|
| `state/conversationState.ts` (Zustand, 6 states) | `state/conversationState.ts` | ✅ |
| `content/calmResponses.ts` (40 responses × 8 tones) | `content/calmResponses.ts` (5 × 8 = 40) | ✅ |
| `content/groundingPrompts.ts` (15 prompts) | `content/groundingPrompts.ts` (15) | ✅ |
| `content/reflectionPrompts.ts` (15 prompts) | `content/reflectionPrompts.ts` (15) | ✅ |
| `safety/forbiddenPatterns.ts` (60 phrases + 15 regex) | `safety/forbiddenPatterns.ts` (60 / 15) | ✅ |
| `safety/emotionalBoundaryRules.ts` (8 rules, 3 blocking) | `safety/emotionalBoundaryRules.ts` (8 / 3 blocking + 5 warning) | ✅ |
| `safety/escalationBoundaries.ts` | `safety/escalationBoundaries.ts` | ✅ |
| `prompts/lumiSystemPrompt.ts` | `prompts/lumiSystemPrompt.ts` | ✅ |
| `runtime/emotionalToneDetector.ts` (8-tone) | `runtime/emotionalToneDetector.ts` (8 tones) | ✅ |
| `runtime/conversationRouter.ts` (8-step pipeline) | `runtime/conversationRouter.ts` (8 steps) | ✅ |
| `motion/calmCheckinMotion.ts` | `motion/calmCheckinMotion.ts` | ✅ (filename matches spec) |
| `components/LumiConversationPanel.tsx` | `components/LumiConversationPanel.tsx` | ✅ |
| `components/LumiMessageBubble.tsx` | `components/LumiMessageBubble.tsx` | ✅ |
| `components/LumiInputBar.tsx` | `components/LumiInputBar.tsx` | ✅ |
| `components/LumiGroundingResponse.tsx` | `components/LumiGroundingResponse.tsx` | ✅ |
| `components/LumiReflectionCard.tsx` | `components/LumiReflectionCard.tsx` | ✅ |
| `tests/conversationSafety.test.ts` (28 assertions) | `tests/conversationSafety.test.ts` (28 / 6 suites) | ✅ |
| `verification/phase15-checklist.md` | this file | ✅ |
| `index.ts` (barrel) | `index.ts` | ✅ |

**File count:** 19 spec files + 1 isolated vitest config.

## Safety Architecture Layer Map

| Layer | Implementation |
|---|---|
| Input Safety | `runConversationRouter` step 1 (empty / non-string / 4000-char clamp) |
| Tone Detection | `emotionalToneDetector.detectTone` (8-tone keyword classifier, `ambivalent` wins ties) |
| Escalation Detection | `escalationBoundaries.detectEscalation` — 30+ critical signals, 22+ elevated signals, normalize-aware |
| Forbidden Patterns | `forbiddenPatterns.findForbiddenHits` — 60 phrases + 15 regex, normalize-aware |
| Boundary Rules (8) | `emotionalBoundaryRules.auditBoundaries` — BR-001..008, 3 blocking + 5 warning |
| Output Validation | router step 6 (`isOutputSafe`) + step 7 (`auditBoundaries` blocking-only) |
| Pause Suggestion | BR-008 + `selectShouldSuggestPause` |
| Crisis Override | router step 4 short-circuit BEFORE bank lookup, returns verbatim `CRISIS_RESOURCE_TEXT` |

## Lumi Identity (Enforced)

| Lumi IS | Lumi IS NOT |
|---|---|
| calm | human |
| brief (≤3 sentences, ≤320 chars) | therapist |
| supportive | doctor |
| grounding | savior |
| non-clinical | romantic partner |
| non-coercive | conscious |
| permission-first | authority figure |
| optional | dependency object |

## Test Result Distribution (must match spec)

| Suite | Tests |
|---|---:|
| Forbidden Patterns | 9 |
| Escalation | 6 |
| Tone Detection | 5 |
| Boundary Rules | 2 |
| Response Rotation | 1 |
| Conversation Router | 5 |
| **Total** | **28** |

## Runtime Contracts (Locked)

- BR-001 (blocking): response ≤3 sentences AND ≤320 characters.
- BR-002 (blocking): conversation depth ≤ `MAX_DEPTH` (15).
- BR-003 (blocking): no forbidden phrase or regex match in output.
- Crisis resource block (`CRISIS_RESOURCE_TEXT`) contains 988, 741741, 911, `/crisis` — verified by ESC-6.
- `runConversationRouter` runs escalation detection BEFORE bank lookup (immutable ordering).
- Reducer makes `escalation: "critical"` sticky — only `reset()` clears it.
- Conversation history capped at `MAX_HISTORY_RETAINED` (30) — no profile build.
- Reflection card text ephemeral (state-only, never persisted, helper says so).
- Opt-out language ("no streak to keep, no progress to lose") wired into the input bar helper + pause banner.

## Production Wiring

**None.** No production file outside `client/src/lumi-conversation/` was modified. Host application chooses whether to wire `LumiConversationPanel` into a route or surface in a future PR.

```ts
// Example future wiring (not done in this PR)
import { LumiConversationPanel } from "@/lumi-conversation";
```
