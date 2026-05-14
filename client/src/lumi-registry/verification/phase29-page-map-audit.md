# Phase 29 — Page Placement Map · Verification Checklist

## File inventory (3 files in scope for Phase 29)

| Path | Purpose | Status |
|---|---|---|
| `registry/lumiPagePlacementMap.ts` | 17 page → variant placements + audit | ✅ |
| `index.ts` | Public barrel including page-map exports | ✅ |
| `verification/phase29-page-map-audit.md` | This file | ✅ |

## 17 page placements

| Page | Variant | Assignment | Position | Max width |
|---|---|---|---|---|
| home-hero | LUMI_SOFT_PRESENCE | required | hero | 320 |
| home-first-gentle-step | LUMI_PATH | required | inline | 140 |
| calm-check-in | LUMI_MEDITATION | required | hero | 280 |
| breath-space | LUMI_MEDITATION | required | hero | 300 |
| mood-space | LUMI_EMOTION_ORB | required | hero | 280 |
| journal-sanctuary | LUMI_COMPANION | required | hero | 260 |
| growth-journey | LUMI_PATH | required | inline | 160 |
| sleep-space | LUMI_CALM_FLOAT | required | hero | 280 |
| privacy-safety | LUMI_HEART | required | hero | 260 |
| research-evidence | LUMI_SOFT_PRESENCE | optional | background | 120 |
| crisis-support | **null** | **forbidden** | none | 0 |
| pricing-pro | LUMI_HEART | optional | inline | 120 |
| email-stay-connected | LUMI_SOFT_PRESENCE | optional | inline | 100 |
| empty-state | LUMI_CALM_FLOAT | required | hero | 220 |
| success-state | LUMI_HEART | required | inline | 140 |
| loading-state | LUMI_CALM_FLOAT | optional | inline | 90 |
| error-state | LUMI_HEART | optional | inline | 100 |

**Counts:** 9 required · 7 optional · 1 forbidden · 17 total.

## Variant coverage (every canonical variant used at least once)

| Variant | Pages |
|---|---|
| LUMI_CALM_FLOAT | sleep-space, empty-state, loading-state |
| LUMI_HEART | privacy-safety, pricing-pro, success-state, error-state |
| LUMI_MEDITATION | calm-check-in, breath-space |
| LUMI_COMPANION | journal-sanctuary |
| LUMI_PATH | home-first-gentle-step, growth-journey |
| LUMI_EMOTION_ORB | mood-space |
| LUMI_SOFT_PRESENCE | home-hero, research-evidence, email-stay-connected |

## Special rules summary

- **crisis-support** — `variant: null`, `assignment: "forbidden"`. ZERO Lumi anywhere on crisis pages. Crisis resources above the fold. NO animations.
- **pricing-pro** — default NO Lumi. Only present if no urgency language and no countdown timers. Max 120px if used.
- **email-stay-connected** — default NO Lumi. If present, `aria-hidden="true"` and never beside the input field.
- **success-state** — NO confetti. NO bouncing. NO "Congratulations!!!". Heart glow opacity 0.08–0.15.
- **growth-journey** — NO streak counters. NO percentage bars. Subtle heart glow only.
- **sleep-space** — Float speed at 50%. Lavender-tinted glow. NO blue light nearby.

## Import enforcement

Correct:
```ts
import { OfficialLumi, LumiSceneRenderer } from "@/lumi-registry";
```

Forbidden (caught by `verifyImportPath()`):
```ts
import mascot from "./assets/mascot.png";          // direct image import
import buddy from "./avatar-legacy/buddy-old.tsx"; // legacy reference
import bear from "./hero-bear.svg";                // deprecated bear
```

## `runPageMapAudit()` usage

```ts
import { runPageMapAudit } from "@/lumi-registry";

const audit = runPageMapAudit();
console.log(audit.totalPages);        // 17
console.log(audit.requiredCount);     // 9
console.log(audit.optionalCount);     // 7
console.log(audit.forbiddenCount);    // 1
console.log(audit.variantCoverage);   // every variant ≥ 1
console.log(audit.issues);            // []
```

## Pass criteria

| Criterion | Result |
|---|---|
| `totalPages === 17` | ✅ |
| All 7 variants used at least once | ✅ |
| No duplicate `pageId` | ✅ |
| `crisis-support.variant === null` | ✅ |
| `crisis-support.assignment === "forbidden"` | ✅ |
| `runPageMapAudit().issues.length === 0` | ✅ |

## Architecture verification

- [x] `PAGE_PLACEMENT_MAP.length === 17` enforced via module-load floor guard.
- [x] All entries `Object.freeze`d.
- [x] `verifyImportPath()` rejects 5 forbidden patterns + any direct image extension.
- [x] `runPageMapAudit()` is pure — no I/O, no React.
- [x] Zero changes to `App.tsx`, `main.tsx`, or any route.
- [x] Zero new npm dependencies.
- [x] `tsc --noEmit` clean, `vite build` clean.
