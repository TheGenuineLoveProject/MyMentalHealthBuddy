# Phase 14 — Calm Check-In Entry Flow — Verification Report

**Status:** Module complete, opt-in, ZERO production wiring.
**Locked:** 2026-05-13.

## File Manifest (12 files)

| Path | Purpose |
|---|---|
| `types/checkInFlowTypes.ts` | Flow types, mood/shift/phase enums |
| `copy/microCopy.ts` | OARS-infused copy + forbidden/required phrase lists |
| `state/useCheckInFlowStore.ts` | Zustand store + hard governance + selector |
| `governance/checkInFlowRules.ts` | 14 rules (6 blocking · 8 warning) + auditFlow() |
| `components/MMHBCheckInFlow.tsx` | Orchestrator |
| `components/FlowStepWelcome.tsx` | Greeting + 6 mood options |
| `components/FlowStepBreathing.tsx` | 4-7-8 × 4 cycles + reduced-motion fallback |
| `components/FlowStepCheckout.tsx` | Post-relief feeling check (4 shifts) |
| `components/FlowStepOffer.tsx` | Soft, guarded subscription invitation |
| `components/FlowStepComplete.tsx` | Branching terminal step (complete / declined) |
| `__tests/checkInFlowGovernance.test.ts` | 22 vitest assertions |
| `index.ts` | Barrel export |

## Trust-First Architecture

```
Welcome  →  Breathing  →  Checkout  →  Offer  →  Complete / Declined
  NO         NO            NO          YES         N/A
```

`subscriptionMentioned` is hard-locked `false` until **all** of:

1. `breathingCompleted === true`
2. A shift outcome was selected
3. The user explicitly transitioned via `goToOffer()`

Verified at 3 layers:

- **Reducer layer** — `goToOffer()` rejects with a console warning when breathing
  is incomplete; state never transitions.
- **Selector layer** — `isSubscriptionMessagingAllowed(state)` returns `false`
  unless all 3 conditions are met.
- **Render layer** — `FlowStepOffer` returns `null` if the selector is `false`
  (defense-in-depth — should be unreachable).

## 14 Governance Rules

| ID | Severity | Topic |
|---|---|---|
| CF-R001 | blocking | Subscription never appears before breathing completes |
| CF-R002 | warning | Welcome copy contains no subscription terms |
| CF-R003 | warning | Breathing copy contains no subscription terms |
| CF-R004 | warning | Early exit always allowed |
| CF-R005 | warning | Crisis routing referenced in welcome copy |
| CF-R006 | warning | No persuasive 'should/must' language |
| CF-R007 | warning | MI tone phrases present in offer copy |
| CF-R008 | blocking | No FOMO / scarcity tactics anywhere |
| CF-R009 | warning | All 6 mood reflections are non-trivial |
| CF-R010 | warning | All 4 shift responses are non-trivial |
| CF-R011 | blocking | Decline path is reachable |
| CF-R012 | blocking | No diagnosis / clinical-treatment language |
| CF-R013 | blocking | `/crisis` routing string preserved in welcome copy |
| CF-R014 | blocking | Pre-offer copy carries no payment/subscription language |

## Verification

- `tsc --noEmit` — see batch run
- `vite build` — see batch run
- `vitest run client/src/checkin-flow` — see batch run
- ZERO files outside `client/src/checkin-flow/` modified
- ZERO new dependencies installed (zustand already present from Phase 11)

## Integration

```ts
import { MMHBCheckInFlow } from "@/checkin-flow";

<MMHBCheckInFlow
  onClose={() => navigate("/")}
  onAcceptOffer={() => navigate("/onboarding")}
  onFinished={(outcome) => trackEvent("checkin_flow_done", { outcome })}
/>
```

## Out of Scope (deferred to Phase 15)

- Wiring into `/checkin` route or homepage hero
- Analytics pipeline integration
- A/B testing infrastructure (any variant must pass `auditFlow()` first)
- Persistent state (intentionally session-only — privacy contract)
