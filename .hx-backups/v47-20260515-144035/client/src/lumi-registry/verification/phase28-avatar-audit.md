# Phase 28 — Avatar Registry · Verification Checklist

## File inventory (10 files in scope)

| Path | Purpose | Status |
|---|---|---|
| `registry/officialLumiRegistry.ts` | 7 canonical variants + helpers | ✅ |
| `registry/lumiEmotionalRoles.ts` | 25 context → variant mappings | ✅ |
| `registry/lumiSceneAssignments.ts` | 18 scene → variant assignments | ✅ |
| `registry/lumiPlacementRules.ts` | Forbidden + required placement rules | ✅ |
| `registry/lumiUsageRules.ts` | Motion / a11y / emotional / cohesion / tone rules | ✅ |
| `components/OfficialLumi.tsx` | Canonical render component | ✅ |
| `components/LumiSceneRenderer.tsx` | Scene-driven auto-resolver | ✅ |
| `governance/phase28-avatar-governance.md` | Variant selection rules + enforcement | ✅ |
| `governance/deprecated-avatar-list.md` | 13 deprecated variants + removal checklist | ✅ |
| `verification/phase28-avatar-audit.md` | This file | ✅ |

## 7 canonical variants

| ID | Hero cap | Card cap | Inline cap | Glow color |
|---|---|---|---|---|
| `LUMI_CALM_FLOAT` | 280 | 140 | 90 | `rgba(168,184,154,0.15)` |
| `LUMI_HEART` | 260 | 130 | 85 | `rgba(246,201,184,0.18)` |
| `LUMI_MEDITATION` | 300 | 150 | 95 | `rgba(168,184,154,0.12)` |
| `LUMI_COMPANION` | 280 | 140 | 90 | `rgba(217,204,244,0.14)` |
| `LUMI_PATH` | 260 | 130 | 85 | `rgba(243,217,138,0.12)` |
| `LUMI_EMOTION_ORB` | 280 | 140 | 90 | `rgba(185,221,242,0.16)` |
| `LUMI_SOFT_PRESENCE` | 320 | 140 | 90 | `rgba(168,184,154,0.12)` |

## 18 scene assignments

| Scene | Variant | Position | Max size |
|---|---|---|---|
| homepage-hero | LUMI_SOFT_PRESENCE (fb LUMI_PATH) | hero | 320 |
| homepage-background | LUMI_CALM_FLOAT | background | 220 |
| onboarding-entry | LUMI_PATH | hero | 260 |
| onboarding-progress | LUMI_PATH | inline | 140 |
| check-in-entry | LUMI_EMOTION_ORB | hero | 280 |
| check-in-emotion-selection | LUMI_EMOTION_ORB | inline | 140 |
| journal-entry | LUMI_COMPANION | hero | 260 |
| journal-listening | LUMI_COMPANION | inline | 130 |
| ritual-breathing | LUMI_MEDITATION | hero | 300 |
| ritual-grounding | LUMI_MEDITATION | hero | 280 |
| ritual-mindfulness | LUMI_MEDITATION | hero | 300 |
| trust-page | LUMI_HEART | hero | 260 |
| privacy-page | LUMI_HEART | hero | 260 |
| boundaries-page | LUMI_HEART | hero | 260 |
| success-subtle | LUMI_HEART | inline | 140 |
| empty-state | LUMI_CALM_FLOAT | hero | 220 |
| loading-state | LUMI_CALM_FLOAT | inline | 90 |
| welcome-return | LUMI_HEART (fb LUMI_SOFT_PRESENCE) | hero | 260 |

## Placement rules enforced

- Forbidden: `no-heading-spam`, `no-repeat-per-section`, `no-decoration-spam`, `no-text-overlap`, `no-cta-crowd`, `no-dense-copy`, `no-oversized-hero` (7).
- Required: `breathing-space`, `one-anchor`, `secondary-focus`, `preserve-whitespace`, `emotionally-intentional` (5).

## Component features

- `OfficialLumi` — variant validation, scene placement validation, size clamping (min of requested / position cap / variant cap), dev warning overlay, never throws, renders SVG with sprout/body/belly/eyes/smile, role="img" + aria-hidden when decorative, supports onClick.
- `LumiSceneRenderer` — auto-resolves variant from `SCENE_ASSIGNMENTS`, supports `variantOverride` for fallback, fires `onValidationError`, renders inline error state for unassigned scenes (visible only in dev).

## Architecture verification

- [x] All frozen constants use `Object.freeze` + `as const`.
- [x] All exports re-exported from `index.ts` barrel.
- [x] Zero changes to `App.tsx`, `main.tsx`, or any route.
- [x] Zero new npm dependencies.
- [x] Components render via inline `style` props only — no Tailwind in registry components.
- [x] All dev warnings gated on `process.env.NODE_ENV === "development"`.
- [x] Floor guards: `ALL_VARIANT_IDS.length === 7`, `SCENE_ASSIGNMENTS.length === 18`.
- [x] `tsc --noEmit` clean.
- [x] `vite build` clean.
