# Route Governance Reports

Generated + maintained artifacts that capture the verified state of the route
registry. Governed by `../ROUTE_GOVERNANCE_POLICY.md`.

## Files

| File | Producer | Purpose |
| --- | --- | --- |
| `route-manifest.json` | `npm run routes:manifest` | Current full snapshot of every route (path, category, source file, aliasOf, component, protected/auth flags). Regenerated each run. |
| `route-manifest.baseline.json` | `npm run routes:manifest` (first run) | **Locked** baseline route count + per-category counts. Parity is checked against this; drift fails the audit. Update only with explicit governance approval. |
| `route-integrity-report.md` | `npm run routes:manifest` | Human-readable integrity report: totals, per-category / per-source counts, duplicate findings, pass/fail. |
| `RUNTIME_VERIFICATION.md` | maintained manually after each verification cycle | Latest build / `verify:all` / registry-audit / HTTP-200 results. |

## How to refresh

```bash
npm run routes:manifest          # snapshot + integrity report + baseline compare
node scripts/audit-registry-routes.mjs   # registry duplicate / parity / sentinel audit
npm run build                    # production build gate
npm run verify:all               # build + duplicate + governance + copyright gate
```

All generators are **read-only** against source — they never move, rename, or
delete routes. A non-zero exit means a governance regression (duplicate path,
parity drift, or a missing protected sentinel); investigate before proceeding.
