# CANONICAL FILE TREE
Last updated: 2026-04-20

## Primary rule
Every platform concern must have one exact home.
Do not create parallel implementations without explicit migration documentation.

---

## Top-level ownership

### /server
Canonical backend runtime home.

Allowed here:
- app boot
- route registration
- route handlers
- middleware
- security
- services
- db adapters
- contracts
- validation
- helpers used by runtime

Not allowed here:
- duplicate legacy entrypoints
- backup files in active runtime paths
- experimental alternates without quarantine/archive labeling

---

### /client or /src
Canonical frontend application home.

Allowed here:
- UI pages
- components
- hooks
- client services
- client state
- styles tied to frontend runtime

Not allowed here:
- backend logic
- server-only secrets
- duplicate page implementations without migration notes

---

### /docs
Canonical governance and documentation home.

Allowed here:
- architecture docs
- ownership docs
- route manifests
- runbooks
- audit summaries
- policies
- canonical maps

Not allowed here:
- executable runtime logic
- alternate production source files

---

### /scripts
Canonical automation and verification home.

Allowed here:
- verification scripts
- manifest generators
- maintenance scripts
- CI helper scripts
- route scanners
- non-runtime build utilities

Not allowed here:
- production route handlers
- long-lived business logic
- hidden alternate runtime flows

---

### /.archive
Canonical home for retired or quarantined legacy files.

Allowed here:
- deprecated entrypoints
- retired route files
- legacy snapshots that must be preserved
- readme explaining why file was archived

Not allowed here:
- active imports
- active runtime use
- files still referenced by canonical app boot

---

## Canonical backend subtree

### /server/app.mjs
Canonical backend entrypoint.

### /server/routes
Canonical route-family home.

Each route family should have one file home:
- ai.mjs
- auth.mjs
- session-boundary.mjs
- admin-social-studio.mjs
- analytics.mjs
- account.mjs
- etc.

Rule:
One route family = one canonical file.
If a route becomes too large, split by subdomain with explicit naming:
- admin-social-studio.mjs
- admin-publishing.mjs
- admin-security.mjs

Do not create:
- ai.js alongside ai.mjs
- hidden backups inside active route folders
- duplicate method+path handlers in same file

---

### /server/middleware
Canonical request pipeline home.

Examples:
- auth middleware
- rate limits
- request guards
- request normalization

---

### /server/security
Canonical security enforcement home.

Examples:
- csrf
- headers
- policy gates
- sanitization
- security helpers

---

### /server/services
Canonical reusable backend domain logic home.

Examples:
- ai orchestration
- analytics aggregation
- publishing services
- account services

Rule:
Services may support routes.
Services do not register Express endpoints directly.

---

### /server/contracts
Canonical request/response contract definitions.

Examples:
- payload schemas
- response expectations
- locked route contracts

---

### /server/validation
Canonical validation layer.

Examples:
- zod schemas
- request parsing
- shape validation

---

### /server/db
Canonical database integration layer.

Examples:
- adapters
- queries
- repositories
- DB composition

---

## Special locked contract files

These are currently protected and should not be casually edited:

- server/routes/ai.mjs
- server/routes/auth.mjs
- server/routes/session-boundary.mjs
- server/security/csrf.mjs
- server/app.mjs
- server/middleware/auth.mjs

Any change to these requires:
1. exact reason
2. smallest safe diff
3. re-run routes:manifest
4. re-run pretest
5. re-run verify
6. git status review

---

## Canonical content locations

### Content docs
- docs/
- content/ if present
- blog/ if present

### Generated route governance
- docs/ROUTE_MANIFEST.json
- scripts/generate-route-manifest.mjs
- scripts/check-contract-routes.sh
- scripts/verify.sh

### Archived legacy runtime files
- .archive/legacy-ai-entry/

---

## Forbidden patterns

- active `.bak` files inside runtime folders
- duplicate route handlers with same method+path in same file
- parallel `.js` and `.mjs` versions of the same live route family
- alternate entrypoints not documented in docs
- runtime logic hidden in docs/
- production routes hidden in scripts/

---

## Migration rule

Before moving any file:
1. identify current owner
2. identify future owner
3. verify imports
4. move one concern only
5. re-run verification
6. document the move in docs

No bulk moves without a written migration plan.