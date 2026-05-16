# Phase 35 — lumi-library Verification Checklist

## Files (6 + barrel)

| Path | Purpose |
|---|---|
| `content/libraryCatalog.ts` | Frozen 12-item catalog + lookups |
| `content/libraryDownloads.ts` | Client-side download generation + disclaimer |
| `components/LibraryCard.tsx` | Card with no progress tracking |
| `governance/librarySafetyRules.ts` | 6 rules + module-load floor |
| `verification/phase35-checklist.md` | This file |
| `index.ts` | Public barrel |

## Pass criteria

- [x] `LIBRARY_CATALOG.length === 12` (module-load throw on breach)
- [x] All 12 items downloadable
- [x] `downloadItem` appends `PROFESSIONAL_CARE_DISCLAIMER` to every payload
- [x] `downloadItem` payload mimeType is `text/markdown;charset=utf-8`
- [x] `LibraryCard` has no `progress`/`percent`/`streak` props or DOM
- [x] `LIBRARY_SAFETY_RULES.length >= 6` (module-load throw on breach)

## Trust boundaries

- Download generation is fully client-side (no fetch, no server roundtrip).
- Catalog is frozen — adding/removing items requires a code change with content review.
- Disclaimer is centralised in `PROFESSIONAL_CARE_DISCLAIMER` so the legal/safety statement only lives in one place.
