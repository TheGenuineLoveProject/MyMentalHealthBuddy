# OWNERSHIP MATRIX

## Rule
Every folder, route family, and content type has one exact home and one exact owner class.

## Runtime ownership

| Area | Exact Home | Owner | Notes |
|---|---|---|---|
| Express bootstrap | server/app.mjs | Runtime core | Canonical server entry |
| AI chat contract | server/routes/ai.mjs | Healing runtime | Locked contract file |
| Auth contract | server/routes/auth.mjs | Auth runtime | Locked contract file |
| Session boundary contract | server/routes/session-boundary.mjs | Session/security runtime | Locked contract file |
| CSRF implementation | server/security/csrf.mjs | Security runtime | Locked contract file |
| Auth middleware | server/middleware/auth.mjs | Security/auth runtime | Locked contract file |
| Other route families | server/routes/*.mjs | Route-family owner | One file per route family |
| Reusable middleware | server/middleware/*.mjs | Middleware owner | No route registration |
| Security helpers | server/security/*.mjs | Security owner | No duplicate route mounts |
| Billing logic | server/billing/* | Billing owner | Payment/subscription only |
| Premium features | server/premium/* | Premium owner | Tier-gated logic only |
| Validation | server/validation/* | Validation owner | Schemas/guards only |
| Services | server/services/* | Service owner | Internal orchestration only |
| Helpers/utils | server/utils/* | Utility owner | Pure helpers only |

## Governance ownership

| Artifact | Exact Home | Owner | Notes |
|---|---|---|---|
| Route manifest | docs/ROUTE_MANIFEST.json | Generated artifact | Generated only |
| Contract lock | docs/API_CONTRACT_LOCK.json | Governance | Manual lock file |
| Route registry | docs/ROUTE_REGISTRY.md | Governance | Human-readable notes |
| File tree | docs/CANONICAL_FILE_TREE.md | Governance | Canonical location map |
| Ownership matrix | docs/OWNERSHIP_MATRIX.md | Governance | This file |
| Reports | reports/* | Generated artifact | Never imported at runtime |
| Archives | .archive/* | Archive owner | Never imported at runtime |

## Content ownership

| Content Type | Exact Home | Notes |
|---|---|---|
| Public static assets | public/ | images, icons, public files |
| Editorial content | content/ | source copy/content systems |
| Generated exports | reports/ | generated outputs only |
| Tests | tests/ | automated tests only |

## Hard rules
1. No runtime imports from .archive/.
2. No runtime imports from reports/.
3. No route registration outside server/routes/.
4. No backup files inside server/routes/.
5. No duplicate method+path inside locked contract surface.

## Locked Contract Files

The following files are the canonical, contract-bound surface. Any modification requires the full 4-step verification protocol before being considered safe.

| Locked File | Contract Surface |
|---|---|
| server/routes/ai.mjs | AI chat contract |
| server/routes/auth.mjs | Auth contract |
| server/routes/session-boundary.mjs | Session boundary contract |
| server/security/csrf.mjs | CSRF implementation |
| server/app.mjs | Express bootstrap |
| server/middleware/auth.mjs | Auth middleware |

Modification protocol (mandatory, in order):
1. `npm run routes:manifest`
2. `npm run pretest`
3. `npm run verify`
4. `git status` review

Any change committed without all four steps passing is considered out-of-contract.

## Route Ownership Rule

Each route family must have exactly ONE canonical file.

Allowed:
- server/routes/ai.mjs (sole AI route file)
- server/routes/auth.mjs (sole auth route file)
- One canonical `*.mjs` file per route family inside server/routes/

NOT allowed:
- `.js` + `.mjs` shadow pairs (e.g. ai.js alongside ai.mjs)
- Duplicate handlers in multiple files registering the same method+path
- Backup files inside server/routes/ (e.g. `*.bak`, `*.old`, `*.backup`, `*-copy.mjs`)

On detection of duplication:
1. STOP — no improvisation
2. Apply the smallest-safe-diff fix only (typically: archive the shadow into .archive/, leave canonical untouched)
3. Re-run full verification: routes:manifest → pretest → verify → git status

## Archive Rules

`.archive/` is the ONLY allowed location for retired files.

Rules:
- No imports from `.archive/` anywhere in runtime code
- No active runtime usage of anything under `.archive/`
- Every archived folder must contain a `README.md` explaining the reason for archival

Forbidden:
- `.bak` / `.backup` / `.old` files anywhere under server/
- Duplicate runtime files outside archive (any shadow of a canonical file must live in `.archive/`, not beside it)
