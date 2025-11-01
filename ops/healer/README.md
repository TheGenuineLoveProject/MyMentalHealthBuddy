# 360° Healer (Error-Scanning + Self-Repair)
- **Scan**: `cd ops/healer && npm ci && npm run scan`
- **Scan + Safe Fix + PR**: `cd ops/healer && npm ci && npm run heal`
- Outputs: `ops/healer/output/*`
- Configure repo/PR vars via env: `GH_TOKEN`, `GH_OWNER`, `GH_REPO`, `GH_BASE` (default `main`).
- **Safety**: Auto-merge is **disabled**. Risky areas require human review per `policies.json`.
