# CANONICAL FILE TREE

## Rule

Every active platform concern, governance artifact, and content type must live in exactly one location. This file is the authoritative location map.

---

## Canonical top-level tree

```text
.
├── .archive/                     # retired non-runtime files only (never imported at runtime)
├── .github/
│   └── workflows/                # CI workflows (contract-check, etc.)
├── client/                       # frontend (React/Vite)
├── content/                      # editorial / source content systems
├── docs/                         # governance + canonical operational docs
│   ├── API_CONTRACT_LOCK.json
│   ├── CANONICAL_FILE_TREE.md
│   ├── OWNERSHIP_MATRIX.md
│   ├── ROUTE_MANIFEST.json
│   └── ROUTE_REGISTRY.md
├── public/                       # public-facing static assets
├── reports/                      # generated outputs only (never imported at runtime)
├── scripts/                      # operator scripts (verify, manifest, system-evolve, etc.)
├── shared/                       # cross-cutting shared types/schemas
├── tests/                        # automated tests only
├── package.json
└── server/
    ├── app.mjs                   # canonical Express bootstrap (LOCKED)
    ├── billing/                  # payment / subscription logic only
    ├── db/                       # database client / connection only
    ├── engine/                   # AI engine facades (e.g. crisisDetection.mjs)
    ├── middleware/               # reusable middleware only
    │                             # includes locked: auth.mjs
    ├── premium/                  # premium-tier logic only
    ├── routes/                   # ALL HTTP route registration
    │                             # includes locked: ai.mjs, auth.mjs, session-boundary.mjs
    ├── security/                 # security logic only (helmet, csrf, sanitization)
    │                             # includes locked: csrf.mjs
    ├── services/                 # internal orchestration only (no route registration)
    ├── utils/                    # pure helpers only
    └── validation/               # zod schemas / request guards only
```

---

## Locked contract files (do-not-modify-casually)

| Path | Purpose |
|---|---|
| `server/app.mjs` | Express bootstrap |
| `server/routes/ai.mjs` | AI chat contract |
| `server/routes/auth.mjs` | Auth contract |
| `server/routes/session-boundary.mjs` | Session boundary contract |
| `server/security/csrf.mjs` | CSRF implementation |
| `server/middleware/auth.mjs` | Auth middleware |

Modification protocol (mandatory, in order):

1. `npm run routes:manifest`
2. `npm run pretest`
3. `npm run verify`
4. `git status --short`
5. human review before commit

---

## Per-folder canonical purpose

### Runtime folders (under `server/`)

| Folder | Sole purpose |
|---|---|
| `server/app.mjs` | Canonical Express bootstrap — wires all middleware + routes |
| `server/routes/` | One canonical `*.mjs` per route family. No backups. No `.js` twins. |
| `server/middleware/` | Reusable middleware only. No route registration. |
| `server/security/` | Security logic only (csrf, helmet helpers, sanitization, rate-limit policy). No routes. |
| `server/validation/` | Zod schemas and request guards only. No business logic. |
| `server/services/` | Internal orchestration only. No route registration. No HTTP. |
| `server/utils/` | Pure helpers only. No I/O coupling. |
| `server/billing/` | Stripe / subscription logic only. |
| `server/premium/` | Tier-gated premium logic only. |
| `server/engine/` | AI engine facades (e.g. unified crisis detector). |
| `server/db/` | Database client and connection only. |

### Non-runtime folders (top-level)

| Folder | Sole purpose | Runtime imports? |
|---|---|---|
| `docs/` | Governance + canonical operational docs | No |
| `reports/` | Generated outputs only | **Forbidden** |
| `.archive/` | Retired non-runtime files only | **Forbidden** |
| `content/` | Editorial / source content system | No |
| `public/` | Public-facing static assets | Served as static, not imported |
| `tests/` | Automated tests only | No |
| `scripts/` | Operator scripts only | No |

---

## Hard rules (mirror of OWNERSHIP_MATRIX.md)

1. No runtime imports from `.archive/`
2. No runtime imports from `reports/`
3. No route registration outside `server/routes/`
4. No backup files inside `server/routes/` (`*.bak`, `*.old`, `*.backup`, `*-copy.mjs`)
5. No duplicate method+path inside locked contract surface
6. No alternate runtime twin for canonical locked route files (e.g. no `ai.js` next to `ai.mjs`)
7. Every route family has exactly one canonical runtime file
8. Every content type has one exact home
9. Every archived folder must contain a `README.md` explaining why

---

## Cross-references

- **Ownership tables:** `docs/OWNERSHIP_MATRIX.md`
- **Generated route inventory:** `docs/ROUTE_MANIFEST.json` (regenerated via `npm run routes:manifest`)
- **Contract lock:** `docs/API_CONTRACT_LOCK.json`
- **Human-readable route notes:** `docs/ROUTE_REGISTRY.md`

---

## Change procedure for this file

This file is governance-only. Edits to this file:
- MUST NOT change runtime behavior
- MUST be reviewed alongside any move/rename/archive operation
- SHOULD be paired with a corresponding update to `docs/OWNERSHIP_MATRIX.md` if ownership semantics shift
