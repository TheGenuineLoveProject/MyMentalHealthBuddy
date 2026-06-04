# Phase 103 — Bundle Budget Guardrail

## Purpose
Prevent future bundle bloat while preserving current runtime stability.

## Status
- Total built assets scanned: 426
- Warning-size assets: 7
- Failure-size assets: 3

## Budget Limits
| Type | Warn | Fail |
|---|---:|---:|
| JS | 180 KB | 350 KB |
| CSS | 80 KB | 160 KB |
| Other assets | 500 KB | 1500 KB |

## Largest Assets
| File | Type | Size KB | Status |
|---|---|---:|---|
| client/dist/assets/mmhb_brand_logo_lockup_1777538625498-Bg5tRRhq.png | asset | 2024.81 | FAIL |
| client/dist/assets/thegenuineloveproject_logo_v2_1777538625498-B2Z66psB.png | asset | 1570.77 | FAIL |
| client/dist/assets/index-VZ0CyR5M.css | css | 343.99 | FAIL |
| client/dist/assets/WellnessDashboard-D4Y2G-I9.js | js | 268.7 | WARN |
| client/dist/assets/_autopilot-CuE29eAG.js | js | 251.89 | WARN |
| client/dist/assets/AdvancedToolsPage-DzNeZFUu.js | js | 205.08 | WARN |
| client/dist/assets/index-6iTq10yq.js | js | 183.09 | WARN |
| client/dist/assets/vendor-react-CcWttEQd.js | js | 178.66 | OK |
| client/dist/assets/CanvaLanding-Cg2TqvDN.js | js | 126.83 | OK |
| client/dist/assets/routeMetaRegistry-De_sNDof.js | js | 126.27 | OK |
| client/dist/assets/vendor-motion-DnxLftd-.js | js | 122.22 | OK |
| client/dist/assets/SacredFooter-CYAJcEX9.js | js | 95.16 | OK |
| client/dist/assets/vendor-forms-UbwvMrj5.js | js | 94.7 | OK |
| client/dist/assets/CommandCenter-BPPt3W7X.js | js | 91.42 | OK |
| client/dist/assets/WisdomToolsPage-_cHOjHlA.js | js | 81.59 | OK |
| client/dist/assets/vendor-lucide-bnMo4Sd-.js | js | 64.85 | OK |
| client/dist/assets/_adminToolsShared-DEw3Z585.js | js | 62.68 | OK |
| client/dist/assets/ContentStudioPage-BSGWjxon.js | js | 53.7 | OK |
| client/dist/assets/CanvaLanding-Bi6MZ_aZ.css | css | 52.39 | OK |
| client/dist/assets/NarrativeOpsConsole-DpBkNc_s.js | js | 52.24 | OK |
| client/dist/assets/Admin-9Fnbm2v8.js | js | 51.34 | OK |
| client/dist/assets/PageTemplate-Ej9kDUrm.js | js | 49.45 | OK |
| client/dist/assets/AdminTools-DCQGDmls.js | js | 48.93 | OK |
| client/dist/assets/PageTemplate-DPX131m5.css | css | 47.77 | OK |
| client/dist/assets/AdminSocial-BJ0k6KmN.js | js | 47.39 | OK |

## Governance Rule
No new large user-facing bundle may be added without:
1. lazy-loading,
2. route ownership,
3. documented reason,
4. verified build,
5. production health check.

## Safety
No source files were modified by this audit.
