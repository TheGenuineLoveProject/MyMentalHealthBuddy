# Runtime Verification — Route Governance Hardening

_Last verified-green run for the additive route-governance layer. Regenerate
this file whenever the registry or its guards change._

## Scope

Additive, non-breaking governance tooling for the route registry
(`client/src/content/routes.js` + per-category modules under
`client/src/content/routes/`). No routes were moved, renamed, reordered, or
deleted. No protected / healing / monetization / auth routes were modified. No
changes to `package.json`, `vite.config.ts`, `server/vite.ts`, or
`drizzle.config.ts`.

## Results

| Gate | Result |
| --- | --- |
| `npm run build` | PASS (`built in ~52s`) |
| `npm run verify:all` | PASS — `121 pass, 0 warn, 0 fail` (unchanged) |
| `npm run routes:manifest` | PASS — 145 routes, baseline locked 145 |
| `node scripts/audit-registry-routes.mjs` | PASS — registry integrity holds |

### Registry guard detail

| Guard | Result |
| --- | --- |
| Duplicate paths | PASS — 0 duplicates across `routes.js` + modules |
| Total parity | PASS — 145 == baseline 145 |
| Category parity | PASS — all 15 categories match `baseline.byCategory` |
| Sentinel invariants | PASS — all present + expected category + protected flag |
| Parser self-check | PASS — block-parse 145 == line-count 145 |

### HTTP 200 spot checks

`/about`, `/about/approach`, `/features`, `/testimonials`, `/`, `/healing`,
`/pricing` — all `200`.

### Negative tests (guards fire when they should)

- Sentinel validation reports missing / category-drift / lost-`protected`
  violations on a tampered route set.
- Category drift detects per-category count changes even when the total is
  unchanged (e.g. `core: 11 -> 10`, `wellness: 29 -> 30`).

## Baseline

`reports/route-manifest.baseline.json` — locked at 145 routes with per-category
counts. Intentional route changes require a reviewed baseline regeneration;
unintended drift is a stop-the-line regression.
