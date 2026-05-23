# MMHB System Map

**Baseline:** 2026-05-23 (Phase 55)
**Authority:** MMHB v7.4 Governance Kernel (`docs/governance/MMHB_v7.4_ARCHIVAL_KERNEL.md`)
**Mode:** descriptive snapshot — no runtime changes

---

## 1. Canonical entrypoint

| Layer | File | Confirmation |
|---|---|---|
| Production server | `server/app.mjs` | `.replit` `entrypoint = "server/app.mjs"`; `package.json` `"main": "server/app.mjs"`; workflow `args = "node --import ./server/observability/preload.mjs server/app.mjs"` |
| Observability preload | `server/observability/preload.mjs` | Loaded via Node `--import` flag in workflow |
| Frontend entry | `client/src/main.jsx` → `client/src/App.jsx` | Vite-bundled; served by Express SPA fallback at `*` |
| Frontend SPA index | `client/dist/index.html` (built) | Served at `*` by `express.static` |

## 2. Non-canonical / legacy / dormant entrypoints (observed, kept untouched)

| Path | Role | Status |
|---|---|---|
| `server/app.mjs.phase46.bak` | Pre-Phase-46 backup | dormant — not imported |
| `server/tests/app.mjs` | Test harness | non-production |
| `src/App.jsx` (top-level, slimmed) | Slimmer parallel App | shadow tree; not imported by the canonical Vite bundle |
| `static-export/js/main.js` + `ai-agent.js` | Static-export artifacts | dormant |
| Top-level `agents/`, `ai/`, `api/`, `app/`, `auth/`, `automation/`, `brand/`, `components/`, `database/`, `db/`, `content/`, `data/` | Mirror trees outside `client/`+`server/` | shadow tree; some files imported by canonical code, many not |

The shadow trees are the principal driver of the **duplication risk score** in §11 of the phase report. They're not deleted in this phase (doc-only audit) but should be inventoried before any future cleanup pass.

## 3. Layered architecture (canonical path)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                       Client / Browser                                  │
│  client/src/App.jsx  (wouter Switch, ~1,036 <Route /> entries)          │
│  ├─ pages/**     ─ 307 page files (many redirect aliases)               │
│  ├─ components/**─ 459 component files                                  │
│  ├─ lumi-* /**   ─ Lumi agent domain (conversation, crisis, memory,…)   │
│  └─ checkin-flow ─ Mood / journal flow                                  │
└──────────────────────────────────────┬──────────────────────────────────┘
                                       │ HTTP(S)
┌──────────────────────────────────────┴──────────────────────────────────┐
│  Express server (server/app.mjs)                                        │
│   1.  trust proxy                                                       │
│   2.  /healthz fast path (no middleware)                                │
│   3.  CORS                                                              │
│   4.  /api/webhooks (raw body)                                          │
│   5.  express.json() with raw-body verify                               │
│   6.  helmet                                                            │
│   7.  cookieParser                                                      │
│   8.  request-id + observability context + request logger               │
│   9.  CSRF (with /api/session-boundary + /api/health exclusions)        │
│  10.  rate limiters (aiLimiter, adminLimiter, adminLoginLimiter)        │
│  11.  router mounts (auth, ai, ai.healing, admin, buddy, health, …)     │
│  12.  /ready + /metrics inline                                          │
│  13.  express.static(client/dist)                                       │
│  14.  GET * SPA fallback                                                │
│  15.  errorHandler                                                      │
└──────────────────────────────────────┬──────────────────────────────────┘
                                       │
┌──────────────────────────────────────┴──────────────────────────────────┐
│  Server modules                                                         │
│  ├─ server/ai/**          ─ orchestrator, safety, prompts, tools        │
│  ├─ server/ai/v2/**       ─ next-gen agent (memory, escalation, gate)   │
│  ├─ server/awareness/**   ─ detection pipeline + tutor lessons          │
│  ├─ server/biometrics/**  ─ providers, normalizers, pipeline            │
│  ├─ server/billing/**     ─ Stripe + entitlements                       │
│  ├─ server/auth/**        ─ JWT, password, tokens, Stripe webhook       │
│  ├─ server/routes/**      ─ 141 files (only ~35 mounted; see §4)        │
│  └─ server/observability/** ─ preload + middleware                      │
└──────────────────────────────────────┬──────────────────────────────────┘
                                       │
┌──────────────────────────────────────┴──────────────────────────────────┐
│  External services / data                                               │
│  - PostgreSQL via Drizzle (DATABASE_URL)                                │
│  - Stripe (subscriptions, webhooks)                                     │
│  - Resend (transactional email)                                         │
│  - Perplexity (LLM calls)                                               │
│  - Sentry (error telemetry)                                             │
│  - OpenAI (legacy client init in server/replit_integrations/chat)       │
└─────────────────────────────────────────────────────────────────────────┘
```

## 4. Route mount summary (canonical `server/app.mjs`)

| Path prefix | Router file | Notes |
|---|---|---|
| `/healthz` | inline (line 85/89 GET+HEAD) | fast-path |
| `/api/webhooks` | `routes/webhook.mjs` | raw body |
| `/api/session-boundary` | `routes/session-boundary.mjs` | CSRF-excluded |
| `/api/health` | `routes/health.mjs` | CSRF-excluded |
| `/api/auth` | `routes/auth.mjs` | |
| `/api/ai` | `routes/ai.mjs` | preceded by `aiLimiter` mount |
| `/api/ai/healing` | `routes/ai.healing.mjs` | |
| `/api/admin` | `routes/admin.mjs` | preceded by `adminLimiter` mount |
| `/api/buddy` | `routes/buddy.mjs` | POST |
| `/ready`, `/readyz` | inline (line 308-class) | JSON `{status,timestamp}` |
| `/metrics` | inline (line 318) | JSON uptime/mem |
| `*` | SPA fallback (line 338) | `client/dist/index.html` |

**Approximately 16 routers actively mounted**; full enumeration in `docs/architecture/ROUTE_REGISTRY.md`.

## 5. Health endpoints — production contract

| Endpoint | Body shape | Audience |
|---|---|---|
| `/healthz` | `ok` (2 B text) | LB liveness |
| `/ready`, `/readyz` | `{"status":"ready","timestamp":"…"}` | readiness |
| `/api/health` | deep JSON: status, env, version, uptime, startedAt, database, softLaunch, platform{totalRoutes,totalTools,adminPages}, services{stripe,resend,perplexity,sentry}, memory, node | ops |
| `/metrics` | minimal JSON | ops |

Source of truth for expected values: `docs/operations/PRODUCTION_CONTRACT_REGISTRY.md`.

## 6. Frontend domain boundaries (Lumi modules)

| Module | Domain | Path |
|---|---|---|
| `lumi-agent` | HEALING (AI companion runtime) | `client/src/lumi-agent/**` |
| `lumi-conversation` | HEALING (chat UI) | `client/src/lumi-conversation/**` |
| `lumi-crisis` | HEALING (crisis resources) | `client/src/lumi-crisis/**` |
| `lumi-rituals` | HEALING | `client/src/lumi-rituals/**` |
| `lumi-cbt` | HEALING | `client/src/lumi-cbt/**` |
| `lumi-circadian` | HEALING | `client/src/lumi-circadian/**` |
| `lumi-memory` | HEALING (long-term agent memory) | `client/src/lumi-memory/**` |
| `lumi-tokens` | PLATFORM (design tokens — palette drift, see §5 of audit) | `client/src/lumi-tokens/**` |
| `lumi-tracker` | HEALING (mood/awareness signals) | `client/src/lumi-tracker/**` |
| `lumi-voice` | HEALING | `client/src/lumi-voice/**` |
| `lumi-scenes` | HEALING | `client/src/lumi-scenes/**` |
| `lumi-library`, `lumi-rituals`, `lumi-boundaries`, `lumi-consistency`, `lumi-integration` | HEALING | various |
| `checkin-flow` | HEALING (mood/journal) | `client/src/checkin-flow/**` |
| `companion-voice` | HEALING (TTS) | `client/src/companion-voice/**` |
| `pages/admin/**` | PLATFORM | 24-32 admin pages |
| `pages/(pricing\|checkout\|account/billing)` | BUSINESS | |
| `pages/(landing\|home\|marketing)` | BUSINESS | |
| `pages/(dashboard\|mood\|journal\|crisis\|chat\|today\|wellness*)` | HEALING | |

Domain mapping is enforced operationally by `client/src/governance/interactions/HealingFlowProtectionRules.ts` and `client/src/lumi-agent/governance/agentGovernanceRules.ts`; auditing those for completeness is the subject of `docs/audits/DOMAIN_SEPARATION_AUDIT.md`.

## 7. Build & runtime tooling

| Concern | Tool / config |
|---|---|
| Build | Vite (`vite.config.ts` — kernel-locked, do not edit) |
| Styling | Tailwind (`tailwind.config.js`) + occasional CSS-modules + raw CSS (see duplication scan) |
| Routing (client) | wouter |
| State (client) | Zustand + React Context + TanStack Query (3 systems coexist; see state dependency graph) |
| ORM | Drizzle (`drizzle.config.ts` — kernel-locked) |
| Auth | JWT (`server/auth/jwt.mjs`) + cookie sessions |
| Observability | preload (`server/observability/preload.mjs`) + request-id + Sentry |
| Process | single Express process bound to port 5000 |

## 8. Forbidden / kernel-locked files

| File | Reason |
|---|---|
| `.replit` | platform config |
| `vite.config.ts` | bundler contract |
| `drizzle.config.ts` | migration contract |
| `package.json` | dependency contract |
| `package-lock.json` | dep tree lock |
| `server/app.mjs` | mutated only via explicit phase with sign-off (current SHA `28356f33…` since Phase 46) |

## 9. Where this map is **incomplete by design**

- It does not enumerate every page (307 page files; see route registry).
- It does not enumerate every component (459 component files; see duplication scan).
- It does not enumerate every state hook or context provider (see state dependency graph).
- It treats the shadow trees (top-level `agents/`, `ai/`, etc.) as **observed and untouched**; classification of each as live vs dead is out of scope for this audit.

For each of these, see the named companion document.

---

*This system map is the descriptive snapshot of the canonical runtime as of 2026-05-23. The shadow trees and orphan route files are noted but not modified. Any future cleanup pass must be a separate, planned phase with the kernel's smallest-valid-engine rule applied per artifact.*
