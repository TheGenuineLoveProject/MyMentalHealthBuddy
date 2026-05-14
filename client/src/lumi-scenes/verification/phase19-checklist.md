# Phase 19 — Emotional Scene Presets · Spec Checklist

Standalone opt-in module at `client/src/lumi-scenes/`. Same shipping
pattern as v5.8.51 / v5.8.52 / v5.8.53 / v5.8.54 / v5.8.55: zero production
wiring, isolated vitest config, design-system tokens only, single hardened
public API surface.

## Spec → file map

| Spec file                          | Implementation path                              |
| ---------------------------------- | ------------------------------------------------ |
| `presets/stillMeadow.ts`           | `presets/stillMeadow.ts`                         |
| `presets/gentleLantern.ts`         | `presets/gentleLantern.ts`                       |
| `presets/quietOrbit.ts`            | `presets/quietOrbit.ts`                          |
| `presets/cloudRest.ts`             | `presets/cloudRest.ts`                           |
| `presets/softHorizon.ts`           | `presets/softHorizon.ts`                         |
| `presets/tinyBloom.ts`             | `presets/tinyBloom.ts`                           |
| `presets/holdingSpace.ts`          | `presets/holdingSpace.ts`                        |
| `runtime/ScenePresetEngine.ts`     | `runtime/ScenePresetEngine.ts`                   |
| `runtime/useScenePreset.ts`        | `runtime/useScenePreset.ts`                      |
| `transitions/SceneTransitionController.tsx` | `transitions/SceneTransitionController.tsx` |
| `governance/presetSafetyRules.ts`  | `governance/presetSafetyRules.ts`                |
| `index.ts` (barrel)                | `index.ts`                                       |
| `verification/phase19-checklist.md`| `verification/phase19-checklist.md` (this file)  |

Plus: `tests/{sceneSafety.test.ts, vitest.config.mjs}` (test infrastructure).

## 7 named scenes

| Scene          | State       | Color signature                | Particles      | Audio descriptor (src=null) |
| -------------- | ----------- | ------------------------------ | -------------- | --------------------------- |
| Still Meadow   | calm        | sage + cream                   | 4 sparse       | none                        |
| Gentle Lantern | comforting  | blush warmth                   | 5 slow         | quiet hum                   |
| Quiet Orbit    | reflective  | lavender dusk (derived)        | 3 barely-there | soft piano                  |
| Cloud Rest     | sleepy      | deep forest                    | 2 minimal      | night crickets              |
| Soft Horizon   | grounding   | moss horizon (derived)         | 0              | soft rain                   |
| Tiny Bloom     | joySoft     | glow + cream                   | 6 tiny drift   | none                        |
| Holding Space  | concernSoft | muted warmth                   | 3 muted        | none                        |

Lavender and moss are rendered as decorative rgba derivations of palette
tokens (no new brand colors introduced). All other tints draw directly
from `palette.{warmCream, deepForest, eternalGold, softBlush, primarySage, mist}`.

## Numeric ceilings (locked)

| Limit             | Value     |
| ----------------- | --------- |
| MAX_LIGHTING      | 0.8       |
| MAX_PARTICLE_COUNT| 8         |
| MAX_PARTICLE_SPEED| 0.2       |
| MAX_FOG_OPACITY   | 0.15      |
| MAX_AUDIO_VOLUME  | 0.1       |
| MIN_TRANSITION_MS | 1500      |

## 14 forbidden effects (with module-load guard)

`confetti` · `burst` · `flash` · `strobe` · `dopamine-loop` · `achievement` ·
`streak` · `badge` · `level-up` · `popup` · `sparkle-burst` · `shake` ·
`vibrate` · `pulse-attention`.

`containsForbiddenEffect()` is case-insensitive substring; `auditPreset()`
checks both `internalName` and (if present) `audio.src`.

## Non-negotiables (all enforced)

- Soft crossfades, never teleport — `MIN_TRANSITION_MS = 1500ms` is the
  ceiling-floor (single locked value, not configurable).
- Avatar identity frozen — `SceneTransitionController` renders scene
  layers behind/around `children` (Lumi). Component never reads or
  modifies `children`. Lumi's body, face, and colors are untouched.
- Fog ≤ 15% opacity — verified per-preset by audit + per-render by the
  controller multiplying `opacity * preset.fog.opacity`.
- Scene names INTERNAL ONLY — `internalName` is documented as do-not-surface.
  No "select a mood" affordance is shipped.
- Scenes react to Lumi's state — `setSceneState(next: SceneState)` accepts
  only the 7 enum values; resolver throws on anything else.
- 14 forbidden effects blocked — module-load guard + per-preset audit +
  `containsForbiddenEffect()` helper for host-side checks.
- Reduced motion — hook drops the previous-preset crossfade layer
  immediately and skips the 1500ms timer when
  `prefers-reduced-motion: reduce` is set; new preset still becomes
  current (gentle informational change, no abrupt visual noise).

## Public API surface (barrel)

Components: `SceneTransitionController`.
Hook: `useScenePreset`.
Engine: `resolvePreset` · `listPresets` · `SCENE_STATES` · `SCENE_REGISTRY`.
Governance constants: `MAX_LIGHTING` · `MAX_PARTICLE_COUNT` ·
`MAX_PARTICLE_SPEED` · `MAX_FOG_OPACITY` · `MAX_AUDIO_VOLUME` ·
`MIN_TRANSITION_MS` · `FORBIDDEN_EFFECTS` · `auditPreset` ·
`assertPresetCompliant` · `containsForbiddenEffect`.
Types: `SceneState` · `ScenePreset` · `ParticleConfig` · `FogConfig` ·
`AudioConfig` · `UseScenePresetReturn` · `SceneTransitionControllerProps` ·
`AuditFinding`.

## Test distribution (25 / spec floor 20)

Registry shape 4 · Numeric ceilings 6 · Forbidden effects 4 ·
auditPreset 7 · resolvePreset 2 · Public barrel 1 · Misc covered above.
