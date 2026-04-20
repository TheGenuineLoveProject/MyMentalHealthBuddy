# CANONICAL FILE TREE

## Purpose
This file defines the one exact home for each platform concern.

## Locked contract runtime
- server/app.mjs
- server/routes/ai.mjs
- server/routes/auth.mjs
- server/routes/session-boundary.mjs
- server/security/csrf.mjs
- server/middleware/auth.mjs

## Canonical top-level structure

### server/
Runtime backend only.
- app.mjs = canonical Express bootstrap
- db.mjs = database connection/bootstrap
- routes/ = HTTP route families only
- middleware/ = reusable request middleware only
- security/ = csrf, auth hardening, headers, request protections
- services/ = business/runtime services
- validation/ = input schemas and guards
- utils/ = pure helpers with no route registration
- memory/ = scoped memory/session helpers
- intelligence/ = AI orchestration internals
- insights/ = analytics/read models
- premium/ = paid-tier backend logic
- billing/ = subscription/payment runtime logic
- replit_integrations/ = Replit-specific integrations only

### scripts/
Operator scripts only.
- verify.sh = full runtime verification
- check-contract-routes.sh = duplicate contract-path guard
- generate-route-manifest.mjs = route inventory generator
- system-evolve.sh = manual operator evolution script only

### docs/
Human-readable governance/docs only.
- ROUTE_MANIFEST.json = generated route inventory
- API_CONTRACT_LOCK.json = locked contract surface
- ROUTE_REGISTRY.md = route ownership notes
- CANONICAL_FILE_TREE.md = this file
- OWNERSHIP_MATRIX.md = single owner per folder/route family/content type

### tests/
Automated tests only.

### public/
Static public assets only.

### content/
Editorial/source content only.

### reports/
Generated reports only. No runtime imports.

### .archive/
Archived legacy files only. Never imported by runtime.

## Folder rules
1. One concern per folder.
2. Routes register endpoints only in server/routes/.
3. No backup files inside server/routes/.
4. No runtime imports from docs/, reports/, or .archive/.
5. No alternate server entrypoints outside server/app.mjs without explicit approval.
