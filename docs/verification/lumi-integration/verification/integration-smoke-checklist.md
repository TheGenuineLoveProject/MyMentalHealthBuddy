# Integration smoke test — verification checklist

Closes the HIGH-priority gap from the 360° platform analysis (Section 8.3 ·
"No integration smoke test").

## Module location
- `client/src/lumi-integration/tests/` — tests only, no production wiring.

## File inventory
- `tests/vitest.config.mjs` — isolated vitest config (same isolation pattern as the per-module configs).
- `tests/crossModule.test.ts` — contract assertions across avatar-life · lumi-scenes · lumi-rituals · lumi-voice · lumi-boundaries · lumi-consistency.
- `verification/integration-smoke-checklist.md` — this file.

## Coverage

### Type-surface alignment (7 tests)
- avatar `EMOTIONAL_STATES` has 8 entries.
- scene `SCENE_STATES` has 7 entries.
- `LUMI_EMOTIONAL_STATES` count matches avatar count.
- `LUMI_INTERACTION_PATTERNS` has 8 patterns.
- Every avatar `EmotionalState` maps to a valid `SceneState`.
- Every ritual key maps to a valid `SceneState`.
- Every ritual key maps to a valid avatar `EmotionalState`.

### Cross-module governance (7 tests)
- Every shipped ritual preset passes its own audit.
- Every shipped scene preset passes its own audit.
- No ritual `invitationText` / `closing` contains a voice forbidden phrase.
- No ritual step `copy` / `microCopy` contains a voice forbidden phrase.
- No ritual step `copy` trips the rituals' own forbidden phrase scanner.
- No boundary copy line contains a forbidden boundary phrase.
- voice `FORBIDDEN_PHRASES` list ≥ 23 (architect-driven floor from v5.8.60).

### lumi-consistency verification (4 tests)
- `runIdentityVerification` with truthful platform data passes 7/7 (`complianceScore === 100`).
- `runIdentityVerification` fails closed when identity name/role drift.
- `runEnforcementValidation` reports 0 critical failures with a clean report.
- `runEnforcementValidation` flags missing captions as a critical failure.

### End-to-end ritual flow (3 tests)
- Every ritual reaches a terminal status via `start + advance` sequence (with iteration cap).
- Terminal ritual maps to a resolvable scene preset for every key, and that preset passes audit.
- Terminal ritual maps to a valid avatar `EmotionalState` for every key, and the avatar state's scene equivalent passes audit.

## Cross-module mapping tables
The test file owns two test-only frozen tables:
- `AVATAR_TO_SCENE: Record<EmotionalState, SceneState>` — bridges the
  avatar union (`calmIdle`, `peacefulJoy`, `gentleConcern`, `welcoming`)
  to the scene union (`calm`, `joySoft`, `concernSoft`).
- `RITUAL_TO_SCENE: Record<RitualKey, SceneState>` and
  `RITUAL_TO_AVATAR: Record<RitualKey, EmotionalState>` — bridges the 7
  ritual presets to a recommended scene + avatar emotional state.

When the (currently empty) `client/src/lumi-bridge/` module is
implemented, these tables move out of the test file and into the
production module — the integration test then imports them from there.

## Run

```sh
npx vitest run --config client/src/lumi-integration/tests/vitest.config.mjs
```

## Production posture
- ZERO files outside `client/src/lumi-integration/` modified.
- ZERO new npm dependencies.
- ZERO production wiring.
