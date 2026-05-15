# Canonical Lumi Asset Manifest

**Last updated:** 2026-05-15 (v5.8.84 — official sprout batch install + aggressive cleanup)
**Status:** Brand-approved canonical artwork from user-supplied IMG_4345-4351 batch (2026-05-15). All 8 variants now ship with current official PNGs. The 6-month `lumi-path.png` "hooded exception" flag is **CLOSED** — sprout walking-path render now in place.

## Provenance

| Canonical filename       | Variant ID            | Source                                             | Bytes      | Notes |
|--------------------------|-----------------------|----------------------------------------------------|------------|-------|
| `lumi-soft-presence.png` | `LUMI_SOFT_PRESENCE`  | `IMG_4351_1778823252522.png` (v5.8.84 install)     |    620,329 | Sprout seated meditating, breath wisps rising overhead. |
| `lumi-heart.png`         | `LUMI_HEART`          | `IMG_4346_1778823252522.png` (v5.8.84 install)     |    284,066 | Sprout standing, glowing heart held at chest. |
| `lumi-calm-float.png`    | `LUMI_CALM_FLOAT`     | `25F728DB-...png` (kept from v5.8.74)              |  1,485,903 | Sprout floating with sage belly patch + ambient glow. |
| `lumi-meditation.png`    | `LUMI_MEDITATION`     | `IMG_4347_1778823252522.png` (v5.8.84 install)     |    319,680 | Seated meditation with energy ring aura. **Note:** has bear-style ears (governance exception per user "use_bear" decision; deviates from sprout-only mandate but is brand-approved official artwork). |
| `lumi-companion.png`     | `LUMI_COMPANION`      | `IMG_4348_1778823252522.png` (v5.8.84 install)     |    707,790 | Sprout seated with halo overhead — "companionship" pose. |
| `lumi-path.png`          | `LUMI_PATH`           | `IMG_4349_1778823252522.png` (v5.8.84 install)     |    682,023 | **CLOSES 6-month gap.** Sprout walking on grass path with sunset background. Replaces prior hooded exception. |
| `lumi-emotion-orb.png`   | `LUMI_EMOTION_ORB`    | `IMG_4350_1778823252522.png` (v5.8.84 install)     |    724,784 | Sprout seated holding glowing orb with 4 emotion faces inside. |
| `lumi-float-idle.png`    | `LUMI_FLOAT_IDLE`     | `IMG_4345_1778823252522.png` (v5.8.84 install)     |    230,109 | Sprout floating, eyes closed, soft sparkles. |

## Brand rule (v5.8.84)

- **Primary mandate:** sprout-on-head designs canonical across the platform (7 of 8 variants).
- **Single approved exception:** `lumi-meditation.png` ships with bear-eared variant per user "use_bear" decision (2026-05-15) — IMG_4347 is brand-approved official artwork even though it deviates from sprout-only.
- **Hooded designs forbidden** — last hooded asset (prior `lumi-path.png`) replaced with sprout walking-path in this cycle.
- **Long-eared "bunny" designs forbidden per V26 governance** (never re-introduce).

## Reversal

Pre-v5.8.84 canonical PNGs backed up to `.local/backups/lumi-official-pre-v5.8.84/` — **7 PNGs + MANIFEST** (NOT 8). The 8th slot, `lumi-path.png`, did not exist pre-v5.8.84 because the v5.8.74 manifest pointed `LUMI_PATH.src` at `lumi-float-idle.png` as the documented hooded-exception fallback. To revert any of the 7 backed-up variants: `cp .local/backups/lumi-official-pre-v5.8.84/lumi-{variant}.png client/public/lumi/official/`. To revert `lumi-path.png` specifically: delete the file and revert `client/src/lumi-registry/registry/officialLumiRegistry.ts` L142 from `lumi-path.png` back to `lumi-float-idle.png` (this restores the v5.8.74 hooded-exception fallback). **Note:** `.local/backups/` is workspace-local (in `.gitignore`); for cross-environment rollback (CI/deploy/fresh clones) restore from a Replit checkpoint instead — checkpoint commit `023ae002` (v5.8.83) precedes this cycle.

## v5.8.84 cleanup record

Deleted from `attached_assets/` (33 files, verified zero codebase refs):
- All `avatar-{breathing,floating,heart}*.png` legacy duplicates
- All `IMG_{2367,2369,2370,2473}*.jpeg` reference shots
- All UUID-named PNG duplicates (`0205D190`, `25F728DB`, `57FC35F4`, `5BA94D4E`, `AFEC27DF`, `FA65B1F0`) — canonical copies preserved in `/lumi/official/` where applicable.

## Forward path

- All 8 canonical slots now filled with current official artwork. No outstanding commission gaps.
- Future avatar updates: drop new PNG into `client/public/lumi/official/lumi-{variant}.png` (overwrite). No code changes required — registry path constants stable since v5.8.74.
