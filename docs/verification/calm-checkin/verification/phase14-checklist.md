# Phase 14 (spec-aligned) — Verification Checklist

This file documents conformance of `client/src/calm-checkin/` to the
official Phase 14 spec attached on 2026-05-13.

## Module shape

| # | Path | Purpose |
|---|---|---|
| 1 | `state/calmCheckinState.ts` | Zustand store — 6 states (idle, breathing, grounding, reflecting, complete, continue) |
| 2 | `content/calmCheckinContent.ts` | All copy + forbidden phrases + required tone phrases |
| 3 | `motion/calmCheckinMotion.ts` | Calm-only motion tokens — soft, slow, no bounce/dopamine |
| 4 | `accessibility/useReducedCalmMotion.ts` | SSR-safe `prefers-reduced-motion` hook |
| 5 | `governance/calmCheckinRules.ts` | 14 rules + `auditCalmFlow()` + `auditCalmContent()` |
| 6 | `components/CalmCheckinCard.tsx` | Soft card container with aura glow |
| 7 | `components/CalmBreathGuide.tsx` | ONE breath cycle (4-2-6), optional repeat |
| 8 | `components/CalmGroundingOption.tsx` | "Notice one thing around you that feels safe or familiar" |
| 9 | `components/CalmReflectionPrompt.tsx` | Optional reflection — no required answers, ephemeral |
| 10 | `components/CalmContinueOptions.tsx` | Continue calmly / Explore tools / Breathe again / Optional signup later |
| 11 | `components/CalmCheckinEntry.tsx` | Main orchestrator |
| 12 | `index.ts` | Public barrel |
| – | `__tests/calmCheckinGovernance.test.ts` | Vitest contract tests |
| – | `__tests/vitest.config.mjs` | Isolated vitest config |
| – | `verification/phase14-checklist.md` | This file |

## Spec contract conformance

| Spec contract | Where it's enforced | Verified by |
|---|---|---|
| Breathing timing **4s inhale / 2s hold / 6s exhale** | `CALM_CONTENT.breathing` constants + `CalmBreathGuide` setTimeout chain | CC-R006 + test "breathing timing is exactly 4s/2s/6s" |
| Exactly **ONE breath cycle initially** | `CalmBreathGuide` runs the chain once on mount; repeat is opt-in via `onRepeat` callback | render code review |
| **Three entry options** (Breath / Grounding / Reflection) | `CALM_CONTENT.idle.options` | CC-R007 + test "idle exposes exactly three exercise options" |
| **No progress bars/dots** | None rendered anywhere — only phase-text + soft aura circle | grep verification (no `progressbar`, no `data-testid="progress-*"`) |
| **No forbidden growth/conversion language** | `CALM_FORBIDDEN_PHRASES` (14 entries) audited at content layer | CC-R003 + test "auditCalmContent returns no hits" + injected-bad-content test |
| **Required tone phrases present** ("Continue gently" / "No pressure" / "You choose") | `CALM_REQUIRED_TONE_PHRASES` audit | CC-R004 + test "all three required tone phrases appear" |
| **Optional signup messaging is gated** | Three layers — reducer rejects illegal `goToContinue()`, selector `isOptionalSignupAllowed()` requires step+completed flag, render-layer `CalmContinueOptions` returns null on bypass | CC-R001 / CC-R002 / CC-R012 + test "isOptionalSignupAllowed becomes true only after continue+completed" |
| **Crisis line on every step** | `<CrisisLine />` rendered inside every step in `CalmCheckinEntry` | CC-R005 + test "crisis line includes /crisis" |
| **Calm-only motion** (no bounce, no confetti, no dopamine loops) | `calmMotion.easings` exposes only `soft` (ease-in-out) + `linearBreath`. Aura opacity range 0.08–0.22. | code review — no `cubic-bezier(.., > 1.0, ..)` overshoots, no spring/bounce libs |
| **Reduced-motion respected** | `useReducedCalmMotion()` swaps animated breath circle for text-only label; aura pulse drops to static `minOpacity` | code review of `CalmBreathGuide` + `CalmCheckinCard` |
| **Reflection text is ephemeral** | Stored only on Zustand state, capped at 600 chars, never serialized to localStorage / API | reducer code + helperHint copy ("This stays here with you. It isn't saved or shared.") |
| **Module boundary** | Internal paths blocked from external import | module-boundary scanner test |

## Verification commands

```bash
# Type check
npx tsc --noEmit

# Production build
npx vite build

# Isolated vitest run for the calm-checkin module
npx vitest run \
  --config "$PWD/client/src/calm-checkin/__tests/vitest.config.mjs" \
  --root "$PWD/client/src/calm-checkin"
```

## Production import (when wiring in)

```ts
import { CalmCheckinEntry } from "@/calm-checkin";

<CalmCheckinEntry
  onContinueOption={(id) => {
    if (id === "signup-later") router.push("/signup");
    if (id === "explore-tools") router.push("/tools");
  }}
  onReturnHome={() => router.push("/")}
/>
```

Note: this module ships fully opt-in. **No production wiring is added in this PR.**
