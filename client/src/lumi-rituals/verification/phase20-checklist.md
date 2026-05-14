# Phase 20 — Guided Presence Rituals · Verification checklist

> Module path: `client/src/lumi-rituals/`
> Status: opt-in (zero production wiring), parallel to v5.8.51-56 modules.

## File inventory (13 spec files + tests + isolated vitest config = 15)

| # | Path | Purpose |
|---|------|---------|
| 1 | `presets/softArrival.ts` | "You're here. We can begin gently." |
| 2 | `presets/oneBreathReset.ts` | A single soft breath, then choice. |
| 3 | `presets/grounding54321.ts` | 5-4-3-2-1 somatic grounding. |
| 4 | `presets/gentleTransition.ts` | Threshold between contexts. |
| 5 | `presets/holdingSpace.ts` | Sit beside hard feelings without fixing. |
| 6 | `presets/sleepSoftener.ts` | Wind-down (longer exhales). |
| 7 | `presets/tinyHope.ts` | Very small noticing toward what's okay. |
| 8 | `runtime/RitualEngine.ts` | Pure types + reducer + initial state. |
| 9 | `runtime/useRitual.ts` | React hook + reduced-motion + soft timer. |
| 10 | `components/GuidedPresenceRitual.tsx` | Top-level surface (idle/active/paused/terminal). |
| 11 | `components/RitualStepCard.tsx` | One quiet step card. |
| 12 | `governance/ritualSafetyRules.ts` | Forbidden phrases, ceilings, audit. |
| 13 | `verification/phase20-checklist.md` | This file. |
| + | `runtime/ritualRegistry.ts` | Frozen registry + resolveRitual. |
| + | `index.ts` | Public barrel surface. |
| + | `tests/vitest.config.mjs` | Isolated vitest config. |
| + | `tests/ritualSafety.test.ts` | Contract tests. |

## Spec rules — runtime enforcement

| Rule | Where enforced |
|------|----------------|
| Preserve Lumi avatar identity | Components NEVER touch avatar DOM; engine has no avatar references |
| No therapy claims / diagnosis | `FORBIDDEN_PHRASES` blocks "diagnose", "fix yourself", "broken"; copy uses noticing/invitation language only |
| No dependency loops | Engine never persists state — each session is ephemeral; no streaks |
| No streaks / urgency / guilt / manipulation | `FORBIDDEN_PHRASES`: streak, level up, hurry, today only, must, depends on this |
| No paid upsell during ritual | `FORBIDDEN_PHRASES`: subscribe, upgrade now; component never renders CTA |
| Skippable | Every active/paused state exposes `Skip this step` + `Step away` |
| Optional | Idle state offers `Not now`; no "must complete" path through state machine |
| Reduced-motion safe | `useRitual` suppresses auto-advance timer; `RitualStepCard` shows breath as text |
| Mobile safe | All buttons inherit MMHBButton's 48px min touch target |
| Quiet UI only | No progress bars, no completion %, no countdown |

## Required gentle phrases (present in shipped copy)

- "Let's take one soft breath." → softArrival, oneBreathReset
- "Notice what feels steady." → softArrival
- "You can pause here." → softArrival, oneBreathReset, gentleTransition, holdingSpace, tinyHope
- "Nothing to prove." → softArrival, oneBreathReset, sleepSoftener, tinyHope
- "We can go slowly." → softArrival, grounding54321, sleepSoftener

## Forbidden copy (blocked by audit + module-load floor guard)

- "You must" / "You have to" / "You need to"
- "Fix yourself" / "broken"
- "Don't quit" / "must finish" / "complete this to progress"
- "Your healing depends on this"
- "streak" / "level up" / "unlock"
- "subscribe" / "upgrade now"
- "hurry" / "today only" / "limited time"

## Pass conditions (from spec)

- [x] Ritual presets compile (TS clean)
- [x] Ritual component renders (`GuidedPresenceRitual`)
- [x] User can start, pause, skip, and exit (state machine + UI)
- [x] Reduced-motion mode works (auto-advance suppressed; cadence shown as text)
- [x] No TypeScript errors (`tsc --noEmit` clean)
- [x] No avatar visual drift (engine has zero avatar references)
- [x] No subscription CTA inside ritual (FORBIDDEN_PHRASES blocks; component has no CTA)
- [x] Existing homepage remains intact (zero files outside `lumi-rituals/` modified)

## Test command

```bash
npx vitest run --config client/src/lumi-rituals/tests/vitest.config.mjs
```

## Production import

```ts
import {
  GuidedPresenceRitual,
  RitualStepCard,
  useRitual,
  resolveRitual,
  listRituals,
  RITUAL_REGISTRY,
  RITUAL_KEYS,
  auditPreset,
  containsForbiddenPhrase,
} from "@/lumi-rituals";
```
