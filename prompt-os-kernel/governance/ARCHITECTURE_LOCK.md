# Architecture Lock — Prompt-OS v8.0

## Lock Status: ACTIVE
## Lock Date: 2026-04-14
## Lock Authority: Prompt-OS Canonical Kernel v8.0

---

## Frozen Routes (DO NOT MODIFY without kernel governance approval)

### Public Endpoints
- `GET /api/health` — Pure liveness probe
- `GET /api/system` — System telemetry (5xx/4xx/total)
- `GET /api/kernel/version` — Kernel version metadata

### Auth-Protected Endpoints
- `GET /api/system/history` — Telemetry snapshots (JWT + admin)
- `GET /api/kernel/health` — Kernel integrity checks (JWT + admin)
- `POST /api/kernel/validate` — PromptSpec validation (JWT + admin)
- `GET /api/kernel/schema` — PromptSpec schema (JWT + admin)

### Core Application Routes
- `POST /api/auth/register` — User registration
- `POST /api/auth/login` — JWT authentication
- `GET /api/admin/dashboard-stats` — Admin dashboard statistics
- `POST /api/billing/create-checkout` — Stripe checkout
- `POST /api/webhook` — Stripe webhook handler
- `POST /api/ai/chat` — AI chat therapy
- `GET /api/journal` — Journal entries
- `GET /api/mood` — Mood tracking
- `GET /api/progress` — Progress tracking

## Frozen Panels (Command Center)
- SystemHealthPanel — `/api/health` consumer
- KernelStatusPanel — `/api/kernel/version` consumer
- SystemTelemetryPanel — `/api/system` consumer
- RecentActivityPanel — `/api/admin/dashboard-stats` consumer
- DailyOpsChecklist — Static operational checklist
- ToolsStatusWidget — Tool availability grid
- AdminNavGrid — Navigation hub
- AIKnowledgeHub — AI tool reference

## Domain Separation
| Domain | Scope | Files |
|--------|-------|-------|
| ENGINEERING | Code, backend, frontend, DB | `server/`, `client/src/`, `shared/` |
| BUSINESS | Monetization, pricing, funnels | `server/routes/billing.mjs`, `client/src/pages/Pricing*` |
| CONTENT | Blog, SEO, social media | `server/routes/blog.mjs`, `server/routes/content-studio.mjs` |
| CLINICAL SAFETY | Evidence-based MH, disclaimers | `server/routes/ai.mjs`, crisis routing |
| GOVERNANCE | Kernel, quality gates | `prompt-os-kernel/`, `server/routes/kernel.mjs` |
| OBSERVABILITY | Health, telemetry, metrics | `server/routes/health.mjs`, `server/routes/system.mjs` |

## Quarantined Files
Files moved to `_quarantine/` directories are candidates for removal after 30 days if no regressions are reported.
- `client/src/components/_quarantine/orphans/` — Unused UI components
- `client/src/components/_quarantine/footers/` — Redundant footer variants

## Rules
1. No new route files without kernel governance approval
2. No feature additions during consolidation phase
3. Build must pass before any merge
4. Auth enforcement must cover all admin/system endpoints
5. Zero 5xx error rate required for phase progression
