# Canonical File Tree — Governance Document

**Status:** Governance-only. Non-runtime. Informational.
**Owner:** Platform contract.
**Last reviewed:** 2026-04-20
**Branch:** `fix/ci-contract-gate`

> This document is the single source of truth for **where things live** in the
> MyMentalHealthBuddy (MMHB) repository. It is **not imported by any runtime
> code**, **not consumed by any build step**, and **must not be referenced by
> CI**. It exists to prevent drift, accidental edits to locked files, and
> accidental re-introduction of quarantined code paths.
>
> If this document and reality disagree, **reality wins** — open a PR to
> reconcile this file. Do not mutate runtime to match this document.

---

## 1. Top-level layout

```
/                                        repo root
├── ai/                                  prompt registry (healing + business engines)
│   ├── healing/                         user-facing prompt modules
│   ├── business/                        admin/staff prompt modules
│   ├── core/                            cross-engine primitives
│   ├── optimization/                    self-tuning fallback library + metrics
│   └── tests/                           prompt-spec validation
│
├── client/                              React 18 + Vite frontend
│   ├── src/                             app source (pages, components, hooks)
│   ├── public/                          static assets served by Vite
│   └── index.html                       Vite entry HTML
│
├── server/                              Node.js + Express backend (.mjs)
│   ├── app.mjs                          🔒 LOCKED — main server entry
│   ├── routes/                          REST routers (mounted under /api/*)
│   ├── middleware/                      cross-cutting middleware
│   ├── security/                        🔒 PARTIALLY LOCKED — csrf, hardening
│   ├── engine/                          AI orchestration + crisisDetection facade
│   ├── memory/                          guest + auth chat memory stores
│   ├── intelligence/                    domain intelligence services
│   ├── lib/                             shared server utilities
│   ├── services/                        domain services (billing, content, etc.)
│   ├── db/                              drizzle connection + helpers
│   ├── utils/                           response helpers, logger
│   └── index.mjs                        secondary entry (delegates to app.mjs)
│
├── shared/                              code shared between client + server
│   ├── schema.mjs                       drizzle schema + zod insert schemas
│   ├── brand.mjs                        brand tokens
│   └── microcopy/                       wellness microcopy library
│
├── scripts/                             CLI tools, audits, governance scripts
├── docs/                                governance + reference docs
├── .github/workflows/                   CI pipelines (DO NOT TOUCH casually)
├── .archive/                            quarantined / retired runtime files
├── migrations/                          drizzle generated migrations
└── attached_assets/                     user-uploaded assets
```

---

## 2. Locked contract files (DO NOT EDIT without explicit governance approval)

These files form the contract surface that the `pretest` and `verify` gates
guarantee. Any edit to a locked file requires:
1. Explicit user approval in the change request, AND
2. A passing 11-step `npm run verify` after the edit, AND
3. A passing `npm run pretest` after the edit, AND
4. An updated `docs/ROUTE_MANIFEST.json` if route paths/methods change.

| Path | Reason locked |
|---|---|
| `server/app.mjs` | Main server entry; mount order, middleware order, CORS, helmet, body-parser, session-boundary, identity gate all sequenced here. |
| `server/routes/ai.mjs` | Live AI router; crisis facade short-circuit, dual-engine boundary, identity gate, guest-id flow. |
| `server/routes/auth.mjs` | JWT issuance, register/login/me; touches every authed route downstream. |
| `server/routes/session-boundary.mjs` | Guest→auth upgrade, csrf-token issuance, dual-gate enforcement. |
| `server/security/csrf.mjs` | CSRF cookie + header contract. |
| `server/middleware/auth.mjs` | `requireAuth`, `requireAdmin`, `optionalAuth`, `authGuard`. Universal dependency. |

### Locked file edit protocol

```
1. State the exact line(s) and reason in the change request.
2. Get explicit "I approve editing locked file X" from the user.
3. Make the smallest possible diff.
4. Run npm run pretest && npm run verify before checkpoint.
5. If route paths/methods changed, run npm run routes:manifest.
6. Document the edit in the PR description.
```

---

## 3. Quarantined / archived paths

| Path | Reason | Restore command |
|---|---|---|
| `.archive/legacy-ai-entry/index.js` | Ungoverned alternate server entry; bypassed contract surface. | `mv .archive/legacy-ai-entry/index.js server/index.js` |
| `.archive/legacy-ai-entry/ai.js` | Legacy AI router with substring-only crisis detection, shared `default-user` memory bucket, no `x-guest-id` enforcement. | `mv .archive/legacy-ai-entry/ai.js server/routes/ai.js` |
| `.archive/legacy-ai-entry/README.md` | Archive provenance + rollback notes. | (informational only) |

**Never re-import an archived module into the running server.**

The numerous `.backup_*/` directories at repo root are point-in-time
snapshots from past hardening rounds. They are **not** part of the runtime,
**not** scanned by the route manifest generator (`scripts/generate-route-manifest.mjs`
explicitly excludes `*.bak*` and `__backup/`), and may be pruned by future
governance tasks.

---

## 4. Governance scripts (lock-adjacent)

| Path | Purpose |
|---|---|
| `scripts/generate-route-manifest.mjs` | Walks `server/routes/**.mjs` (excluding `*.bak*`, `__backup/`, `.archive/`) and emits a deterministic, sorted route manifest. |
| `scripts/check-contract-routes.sh` | Pretest gate. Detects same-file duplicate `(file, method, path)` registrations. Run via `npm run pretest`. |
| `scripts/audit-all-routes.sh` | Full route-surface audit (read-only). |
| `scripts/system-evolve.sh` | Evolution scan: manifest → pretest → verify → duplicate analysis. |
| `scripts/verify.sh` | 11-step end-to-end verification. Run via `npm run verify`. |

| Path | Purpose |
|---|---|
| `docs/ROUTE_MANIFEST.json` | Generated artifact. Source of truth for the route surface. **Do not hand-edit.** Regenerate via `npm run routes:manifest`. |
| `docs/API_CONTRACT_LOCK.json` | Frozen subset of routes that pretest treats as the contract surface. Hand-edits require governance approval. |
| `docs/CANONICAL_FILE_TREE.md` | This document. |

---

## 5. CI surface

| Path | Purpose |
|---|---|
| `.github/workflows/contract-check.yml` | On PR/push: `routes:manifest` → `pretest` → `verify`. **Do not modify casually.** |

Modifying any file under `.github/workflows/` requires the same approval
protocol as a locked-file edit, because CI is what enforces the contract
that the locked files describe.

---

## 6. Hot zones (high-risk areas)

These directories are not locked, but edits here have outsized blast radius.
Apply the smallest-safe-diff rule and run `npm run verify` after every change.

| Path | Why high-risk |
|---|---|
| `server/routes/admin-*.mjs` | Admin endpoints. Tier-4 hardening applies (rate limiters, Zod validation, RBAC). |
| `server/engine/crisisDetection.mjs` | Single facade for the safety stack. Any change must be backwards-compatible with `/api/ai/chat`. |
| `server/memory/` | Guest + auth chat memory. Identity-bucket boundary lives here. |
| `shared/schema.mjs` | Drizzle schema. Use `npm run db:push --force` to sync. **Never** change a primary-key column type. |

---

## 7. Conventions

- **Server modules** use `.mjs` extension (ESM).
- **Routes** are mounted under `/api/*` from `server/app.mjs`.
- **Identity** is conveyed by `Authorization: Bearer <jwt>` (auth) or
  `x-guest-id: <opaque>` (guest). Never both. Never neither for stateful endpoints.
- **CSRF** is per-session via `GET /api/session-boundary/csrf-token` →
  `x-csrf-token` header on state-changing requests.
- **Crisis short-circuit** is the first thing `/api/ai/chat` does. The
  canonical 988 / 741741 response is the only allowed reply when triggered.
- **Locked files** are immutable except by explicit governance approval.

---

## 8. Change procedure (the short version)

```
1. Read this document.
2. Identify whether your change touches:
   - a locked file        → require approval
   - a hot zone           → smallest safe diff + verify
   - anything else        → smallest safe diff + verify
3. Make the change.
4. Run: npm run routes:manifest && npm run pretest && npm run verify
5. If green, commit with a descriptive message.
6. If red, roll back and re-plan.
```

---

*This file is governance-only. It does not affect runtime behavior. Edits
to this file do not require a verify pass, but should be reviewed for
accuracy against the actual repository state before merging.*
