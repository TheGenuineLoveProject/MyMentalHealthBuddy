# Phase 22 — Presence Scheduler & Circadian Calm · Spec checklist

| # | Requirement | Where it lives | Status |
|---|---|---|---|
| 1 | Scheduling OFF by default | `INITIAL_STATE.status === "disabled"` (`runtime/circadianStateMachine.ts`) | ✅ |
| 2 | User must intentionally enable | `optIn()` only flips status; only path is the explicit `OptInPrompt` button | ✅ |
| 3 | Phase-change notifications OFF by default | `INITIAL_STATE.phaseChangeAnnouncementsEnabled === false` | ✅ |
| 4 | No push notifications | Scheduler only emits in-app `pendingNudge` state — no `Notification` API, no service worker | ✅ |
| 5 | Quiet presence only | `QuietNudge` is a soft `MMHBCard`; no toast, no banner, no sound | ✅ |
| 6 | User can disable anytime | `optOut()` works from any status, wipes pending nudge | ✅ |
| 7 | No guilt / no "you missed" | 15 forbidden phrases include `you missed`, `you should have`, `where were you`, `you forgot`, `you haven't` (`governance/schedulerSafetyRules.ts`) | ✅ |
| 8 | No emotional manipulation | Forbidden phrases include `you must`, `you need to`, `must check in`, `have to log`, `required`, `mandatory` | ✅ |
| 9 | No urgency reminders | Forbidden phrases include `today only`, `act now`, `limited time`, `don't miss` | ✅ |
| 10 | No required responses | Acknowledge / skip / dismiss are equivalent in the reducer; nothing unlocks or gates on engagement | ✅ |
| 11 | No nudges 10pm–7am | `SLEEP_WINDOW_START_HOUR=22`, `SLEEP_WINDOW_END_HOUR=7`; `canDispatchNudge` returns `sleep-window-active` | ✅ |
| 12 | Max 3 nudges per day | `MAX_NUDGES_PER_DAY=3`; gate returns `daily-limit-reached`; counter resets on local day rollover | ✅ |
| 13 | Min 5 min between nudges | `MIN_MS_BETWEEN_NUDGES=300_000`; gate returns `min-spacing-not-elapsed` | ✅ |
| 14 | Skippable, dismissable | `QuietNudge` always renders Skip + Dismiss; reducer accepts both unconditionally | ✅ |
| 15 | Non-pressuring tone | `REQUIRED_TONE_MARKERS` includes `soft`, `gentle`, `no pressure`, `you choose`, `nothing owed`, `nothing to prove` | ✅ |
| 16 | 15 forbidden manipulation phrases | `FORBIDDEN_PHRASES.length === 15` with module-load floor guard | ✅ |
| 17 | Lumi avatar identity preserved | Components have ZERO Lumi imports / DOM references | ✅ |
| 18 | Reduced-motion safe | `useCircadianScheduler` reads `prefers-reduced-motion`; no animated background work; nudge UI has no motion | ✅ |
| 19 | Mobile safe | `MMHBButton` provides 48px+ touch targets; flex-wrap actions | ✅ |
| 20 | TypeScript clean | `tsc --noEmit` passes | ✅ |
| 21 | Compiles in dev | `vite build` clean; dev workflow runs on port 5000 | ✅ |
| 22 | Render sinks fail closed | `QuietNudge` re-audits at render via `useMemo`; throws on forbidden / oversized | ✅ |
| 23 | Frozen scene registry | `Object.freeze` on every preset + `CIRCADIAN_SCENES` container | ✅ |
| 24 | Single hardened public API | `client/src/lumi-circadian/index.ts` barrel; no internal mutators leaked | ✅ |

## Production import

```ts
import {
  OptInPrompt,
  QuietNudge,
  useCircadianScheduler,
  resolvePhase,
  isSleepWindow,
  canDispatchNudge,
  CIRCADIAN_SCENES,
  resolveScene,
  FORBIDDEN_PHRASES,
  auditScenePreset,
} from "@/lumi-circadian";
```

## Run tests

```bash
npx vitest run --config client/src/lumi-circadian/tests/vitest.config.mjs
```
