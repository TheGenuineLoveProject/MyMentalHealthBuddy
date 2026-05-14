# Phase 31 — Page Replacement Rollout · Verification Checklist

## Scope

Phase 31 is a **planning + tracking** surface, not a runtime renderer. The page-placement authority remains `lumiPagePlacementMap.ts` (17 pages, includes crisis-support / error-state / loading-state / etc.). The replacement map covers only the 11 legacy raw-PNG references that need migrating to `OfficialLumi`.

## File inventory

| Path | Purpose | Status |
|---|---|---|
| `registry/lumiPageReplacementMap.ts` | 11 replacement entries + audit/grep helpers | ✅ |
| `types/lumiTypes.ts` | `ReplacementEntry`, `ReplacementStatus` types | ✅ |
| `index.ts` | Phase 31 exports added to barrel | ✅ |
| `verification/phase31-replacement-audit.md` | This file | ✅ |

## 11 replacement entries

| # | Section | Old asset | New variant | Position | Max width |
|---|---|---|---|---|---|
| 1 | Home Hero | `old-hero-lumi.png` | LUMI_SOFT_PRESENCE | hero | 320 |
| 2 | Calm Check-In | `check-in-lumi.png` | LUMI_MEDITATION | inline | 200 |
| 3 | Breath Space | `breath-lumi.png` | LUMI_MEDITATION | hero | 280 |
| 4 | Mood Space | `mood-lumi.png` | LUMI_EMOTION_ORB | hero | 260 |
| 5 | Journal Sanctuary | `journal-lumi.png` | LUMI_COMPANION | inline | 180 |
| 6 | Growth Journey | `growth-lumi.png` | LUMI_PATH | inline | 160 |
| 7 | Sleep Space | `sleep-lumi.png` | LUMI_CALM_FLOAT | hero | 280 |
| 8 | Privacy / Safety | `privacy-lumi.png` | LUMI_HEART | hero | 260 |
| 9 | Pricing / Pro | `pricing-lumi.png` | LUMI_HEART | inline | 120 |
| 10 | Empty States | `empty-lumi.png` | LUMI_CALM_FLOAT | hero | 220 |
| 11 | Success States | `success-lumi.png` | LUMI_HEART | inline | 140 |

Floor-guarded `lumiPageReplacements.length === 11`.

## CSS rules (`styles/lumiMotion.css`)

- `.lumi-official` — `inline-flex`, centered, `pointer-events: none`, `position: relative`.
- `.lumi-motion-soft img` — `lumi-soft-breathe 7.1s ease-in-out infinite`.
- `.lumi-motion-reduced img` — `lumi-soft-breathe 10s ease-in-out infinite`.
- `.lumi-motion-none img` — `animation: none`.
- `@keyframes lumi-soft-breathe` — 0% rest → 39% lift to `translateY(-3px) scale(1.012)` → 45% hold → 96% return → 100% rest.
- `@media (prefers-reduced-motion: reduce)` — ALL motion classes get `animation: none !important; transform: none !important;`.
- `.hero-lumi` — `width: min(42vw, 340px); margin-inline: auto; filter: drop-shadow(0 18px 30px rgba(126, 144, 110, 0.16));`.

## Asset color tokens (used by SVG render mode)

| Token | Value | Use |
|---|---|---|
| Body | `#FFF5F0` | Lumi cream silhouette |
| Belly | `#B0D0B3` | Sage belly highlight |
| Sprout | `#81C784` | Sprout-on-head identity feature |
| Eye | `#5C6B5D` | Soft eye dot |
| Smile | `#5C6B5D` | Subtle smile arc |

## Grep commands

```sh
# Print the canonical command:
node -e 'console.log(require("./client/src/lumi-registry").getGrepCommand())'

# Or run directly:
rg -n --type ts --type tsx --type js --type jsx --type css --type html "old-hero-lumi|check-in-lumi|breath-lumi|mood-lumi|journal-lumi|growth-lumi|sleep-lumi|privacy-lumi|pricing-lumi|empty-lumi|success-lumi|mascot|buddy-old|avatar-legacy|hero-bear|green-bear" client/
```

## Audit function usage

```ts
import { runReplacementAudit, markReplacementDone } from "@/lumi-registry";

// Initial state — nothing migrated yet:
runReplacementAudit();
// => { total: 11, done: 0, pending: 11, blocked: 0, inProgress: 0, progress: "0/11", percent: 0, nextUp: "Home Hero" }

// Migrate one section:
markReplacementDone("Home Hero");
runReplacementAudit();
// => { total: 11, done: 1, pending: 10, ..., progress: "1/11", percent: 9, nextUp: "Calm Check-In" }
```

## Pass criteria

| Criterion | Result |
|---|---|
| `lumiPageReplacements.length === 11` | ✅ |
| Every entry uses a canonical `LumiVariantId` | ✅ |
| All entries start at `status: "pending"` | ✅ |
| `runReplacementAudit().total === 11` | ✅ |
| `getNextReplacement()` returns first pending | ✅ |
| `OLD_AVATAR_GREP_PATTERNS` includes 11 legacy filenames + 5 forbidden tokens (16 total) | ✅ |

## Architecture verification

- [x] Phase 31 file count == 1 production TS file + 1 verification md.
- [x] Floor guard `REPLACEMENT_ENTRIES.length === 11` throws on mismatch at module load.
- [x] All entries `Object.freeze`d.
- [x] Status tracking is in-memory only (sessions ephemeral; page-placement map remains the runtime authority).
- [x] Zero changes to `App.tsx`, `main.tsx`, or any route.
- [x] Zero new npm dependencies.
- [x] `tsc --noEmit` clean, `vite build` clean.

## Important non-Phase-31 surfaces preserved

The Phase 30 page-map shrinkage (17 → 11) called for in the original delta spec was **rejected** during planning. The 17-page authority in `lumiPagePlacementMap.ts` is unchanged — `crisis-support` (assignment: forbidden), `error-state`, `loading-state`, `email-stay-connected`, `research-evidence`, and `home-first-gentle-step` all remain. Crisis-support governance remains the runtime trust boundary via `canRenderLumi()`.
