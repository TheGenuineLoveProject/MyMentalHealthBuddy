# Phase 32 — lumi-cbt Verification Checklist

## Files (8 + barrel)

| Path | Purpose |
|---|---|
| `worksheets/thoughtRecord.ts` | Thought Record interface + creator + validator + template |
| `worksheets/behavioralActivation.ts` | Activity Schedule + `addActivity` (rejects "should") + scoring |
| `worksheets/cognitiveDefusion.ts` | 3 ACT-derived defusion exercises (text only, no gamification) |
| `engine/CBTSessionEngine.ts` | Lifecycle engine (start/submit/abandon, in-memory, hydratable) |
| `engine/useCBTSession.ts` | React hook with derived stats |
| `governance/cbtSafetyRules.ts` | 7 safety rules + self-harm phrase detector + module-load floor |
| `verification/phase32-checklist.md` | This file |
| `index.ts` | Public barrel |

## Pass criteria

- [x] `CBT_SAFETY_RULES.length >= 7` (module-load throw on breach)
- [x] `addActivity` throws `ValuesBasedViolationError` on `should`/`must`/`have to`/`ought to`/`supposed to`
- [x] `validateThoughtRecord` returns missing field list, including out-of-range emotion intensity
- [x] `CBTSessionEngine.transition` refuses to re-transition a non-in-progress session
- [x] No streak counters, no completion %, no DSM/ICD strings anywhere in module
- [x] Exit-path rule documented (UI host responsibility — enforced at composition time)
- [x] Self-harm phrase detector handles 7 phrases (kill myself / end it all / suicide / want to die / hurt myself / self-harm / no point living) — host wires to lumi-crisis CrisisPanel

## Trust boundaries

- All session data is **in-memory by default**. Persistence is host-controlled via `getSessionHistory()` + `replaceSessions()`. Engine never auto-persists.
- Session content never leaves the browser unless host explicitly transmits.
- `clear()` provides one-call wipe for consent-revoke flows.
