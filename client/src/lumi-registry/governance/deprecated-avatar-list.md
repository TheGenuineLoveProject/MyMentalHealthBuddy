# Deprecated Avatar List

Anything not in `OFFICIAL_LUMI_REGISTRY` is deprecated. The 13 entries below are explicitly removed and **must not** be re-introduced.

| Variant | Status | Reason | Replacement |
|---|---|---|---|
| Green Hero Bear | REMOVED | Off-brand mascot from earliest mock; bear ≠ Lumi | `LUMI_SOFT_PRESENCE` |
| Bunny Ears | REMOVED | Cosmetic prop; no emotional role | `LUMI_CALM_FLOAT` |
| Sunglasses | REMOVED | Cosmetic prop; cool/casual tone wrong for trauma-informed product | `LUMI_CALM_FLOAT` |
| Party Hat | REMOVED | Celebration noise; no confetti, no party hats | `LUMI_HEART` (subtle glow only) |
| Crying | REMOVED | Mirroring distress harms trauma-informed users | `LUMI_HEART` |
| Angry | REMOVED | Judgmental expression; never acceptable | `LUMI_COMPANION` |
| Over-excited | REMOVED | High-energy tone violates calm baseline | `LUMI_CALM_FLOAT` |
| Waving | REMOVED | Active-attention-grabbing motion | `LUMI_SOFT_PRESENCE` |
| Dancing | REMOVED | Bounce/spring motion forbidden | `LUMI_CALM_FLOAT` |
| Confetti | REMOVED | Celebration-noise category; explicitly forbidden | `LUMI_HEART` (glow only) |
| Thumbs Up | REMOVED | Gamified validation cue | `LUMI_HEART` |
| Stars Around Head | REMOVED | Burst/sparkle effect forbidden | `LUMI_CALM_FLOAT` (subtle glow only) |
| Sleeping (Z's) | REMOVED | Z-character cliché; sleep cues handled via Sleep Space scene | `LUMI_CALM_FLOAT` (lavender glow) |

## Removal checklist (per deprecated variant)

1. Search the codebase for the variant name as a string and as an import path.
2. Search `attached_assets/`, `public/`, `client/src/assets/` for the variant's image asset.
3. Replace any production usage with the canonical replacement listed above.
4. If the variant was referenced in docs (e.g. `replit.md`, `docs/changelog.md`), add a note marking it deprecated.
5. Run `verifyImportPath()` from `lumiPagePlacementMap.ts` against any candidate import path during code review.
6. Confirm no test fixtures reference the deprecated variant.
7. Add the variant to the table above with status `REMOVED` and a one-line reason.

## Forbidden import-path tokens

`verifyImportPath()` rejects any import path containing: `mascot`, `buddy-old`, `avatar-legacy`, `hero-bear`, `green-bear`, or any direct `.png/.svg/.jpg/.webp` reference (Lumi must come through the registry component, never via raw image imports).
