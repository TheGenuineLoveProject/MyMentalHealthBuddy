# Canonical Lumi Asset Manifest

**Last updated:** 2026-05-15 (v5.8.74 — sprout-only canonical replacement)
**Status:** Brand-approved sprout-on-head canonical artwork. All 8 variants now ship with user-supplied official sprout files. Hooded designs archived only — never rendered.

## Provenance

| Canonical filename       | Variant ID            | Source                                                                                | Bytes      | Notes |
|--------------------------|-----------------------|---------------------------------------------------------------------------------------|------------|-------|
| `lumi-soft-presence.png` | `LUMI_SOFT_PRESENCE`  | `attached_assets/57FC35F4-...png`                                                     | 2,235,294  | Sprout seated hugging green orb. Direct user-confirmed match for "soft presence" emotional role. |
| `lumi-heart.png`         | `LUMI_HEART`          | Cropped from 6-pose grid `attached_assets/2B638A20-...4015333.png` cell (1024,0,512,512) | 258,431  | Sprout standing, glowing heart in chest. |
| `lumi-calm-float.png`    | `LUMI_CALM_FLOAT`     | `attached_assets/25F728DB-...png`                                                     | 1,485,903  | Sprout floating with sage belly patch + ambient glow. |
| `lumi-meditation.png`    | `LUMI_MEDITATION`     | Cropped from 6-pose grid `attached_assets/2B638A20-...4015333.png` cell (0,512,512,512)  | 252,147  | Sprout seated meditating, eyes closed, hugging green orb. |
| `lumi-companion.png`     | `LUMI_COMPANION`      | Cropped from 6-pose grid `attached_assets/2B638A20-...4015333.png` cell (512,0,512,512)  | 261,462  | Sprout floating peaceful with sparkles. Per user direction (no sprout-halo standalone available, floating-peaceful chosen as closest sprout match for "companion presence"). |
| `lumi-path.png`          | `LUMI_PATH`           | `attached_assets/generated_images/lumi-hooded-walking-path.png` (UNCHANGED)            |   866,537  | **EXCEPTION — still hooded.** No sprout walking-path file in v5.8.74 user-supplied batch. Awaiting sprout walking-path commission. Until then, this slot remains the only hooded canonical asset. |
| `lumi-emotion-orb.png`   | `LUMI_EMOTION_ORB`    | `attached_assets/AFEC27DF-...png`                                                     | 2,285,613  | Sprout seated holding glowing emotion-orb sphere with 5 emoji faces. |
| `lumi-float-idle.png`    | `LUMI_FLOAT_IDLE`     | `attached_assets/FA65B1F0-...png`                                                     | 2,225,224  | Sprout standing full-body. **Resolves prior identity-drift flag** (was sourced from sparkles region artifact). |

## Brand rule (v5.8.74)

- **ONLY sprout-on-head designs render on the live platform.**
- Hooded designs are archived only (kept in `attached_assets/` for reference but not bridged here).
- Long-eared "bunny" designs are forbidden per V26 governance (never re-introduce).
- The single `LUMI_PATH` hooded exception is documented above and should be replaced with a sprout walking-path render when one is commissioned.

## Reversal

Each replaced canonical PNG has a sibling `*.placeholder-bak.png` containing the previous bridged file (from Iter 2c-bridge). To revert any single variant: `mv lumi-{variant}.placeholder-bak.png lumi-{variant}.png`.

## Forward path

1. Commission sprout walking-path render → drop into `client/public/lumi/official/lumi-path.png` (overwrite). Update this MANIFEST row. No code change needed.
2. Once `lumi-path.png` is sprout-converted, this file's "EXCEPTION" note can be removed.
3. Optional cleanup: after v5.8.74 ships clean and renders verified on all 7 enrolled pages, delete `*.placeholder-bak.png` files (they add ~6MB).
