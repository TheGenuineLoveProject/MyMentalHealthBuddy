# Canonical Lumi Asset Bridge Manifest

**Created:** 2026-05-15 (Iter 2c-bridge)
**Reason:** `client/src/lumi-registry/registry/officialLumiRegistry.ts` (v5.8.62, lines 70-196) hard-codes 8 canonical asset paths under `/lumi/official/*.png`, but the directory did not exist. This is a pre-existing canonical-asset gap surfaced by the first production `<OfficialLumi>` swap on `CanvaLanding.jsx` (header logo, L360).
**Method:** `cp` from real source files into `client/public/lumi/official/`. Symlinks were not used because some sources live in `attached_assets/` (outside Vite's served roots) and would not resolve.
**Status:** Functional placeholders. Brand-approved canonical artwork (1:1 to each variant's emotional role) should still be commissioned before any opt-in `lumi-*` flag flips from admin-only.

## Provenance

| Canonical filename       | Variant ID            | Source path                                                                          | Dimensions  | Bytes      | SHA-256 (first 16) | Notes |
|--------------------------|-----------------------|--------------------------------------------------------------------------------------|-------------|------------|--------------------|-------|
| `lumi-soft-presence.png` | `LUMI_SOFT_PRESENCE`  | `client/public/brand/v17/avatar-breathing.png`                                       | 1024×1024   | 1,485,903  | `5f1edaacf78ecf6c` | Closest match: ambient breath presence. |
| `lumi-heart.png`         | `LUMI_HEART`          | `client/public/brand/v17/avatar-heart.png`                                           |  512×512    |   284,066  | `876a9a670f470b06` | Direct semantic match. |
| `lumi-calm-float.png`    | `LUMI_CALM_FLOAT`     | `client/public/brand/v17/avatar-floating.png`                                        |  512×512    |   230,109  | `43a0f98ff163e5d3` | Direct semantic match. |
| `lumi-meditation.png`    | `LUMI_MEDITATION`     | `attached_assets/generated_images/lumi-hooded-meditating-aura.png`                   | 1408×768    |   563,782  | `ddd095bd4b6a5b2f` | Direct semantic match. |
| `lumi-companion.png`     | `LUMI_COMPANION`      | `attached_assets/generated_images/lumi-sprout-heart-glow.png`                        | 1024×1024   | 1,014,560  | `611748e00eaa6e29` | Approx — sprout-heart proxies companion warmth. |
| `lumi-path.png`          | `LUMI_PATH`           | `attached_assets/generated_images/lumi-hooded-walking-path.png`                      | 1408×768    |   866,537  | `0be1a12670d10587` | Direct semantic match. |
| `lumi-emotion-orb.png`   | `LUMI_EMOTION_ORB`    | `attached_assets/generated_images/lumi-hooded-emotion-orbs.png`                      | 1408×768    |   549,602  | `deb957417c58b98b` | Direct semantic match. |
| `lumi-float-idle.png`    | `LUMI_FLOAT_IDLE`     | `client/public/avatar-core/regions/MMHB_FLOAT_IDLE_UNIT_v1_region_sparkles.png`      | 1024×1024   | 1,352,086  | `e6dd0ecf185ea394` | **Identity-drift risk** — sourced from a region/sparkle artifact, not a full character render. Architect-flagged for replacement. `LUMI_FLOAT_IDLE` is currently runtime-only (whitelist), so user-visible blast radius is limited until that variant ships to a real surface. |

## Reversal

This bridge is fully non-destructive. To revert: `rm -rf client/public/lumi/official/` (the registry will return to its pre-Iter-2c 404 state and any `<OfficialLumi>` callers will render their graceful empty-container fallback).

## Forward path

1. Commission brand-approved canonical PNGs at the registered dimensions and emotional roles, especially for `LUMI_FLOAT_IDLE`.
2. Replace bridged files in place — no code change needed; `officialLumiRegistry.ts` paths stay constant.
3. Update this MANIFEST.md provenance rows when each placeholder is replaced.
4. Once all 8 are brand-approved, this file can be retitled to "Canonical Lumi Asset Manifest" (drop "Bridge").
