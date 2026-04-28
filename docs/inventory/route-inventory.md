# MMHB Express Route Inventory
  > Generated as Week 1 / Task 1A of the Platform A → Z transformation roadmap (`content/strategy/platform-z-transformation.md`).
  > **Read-only inventory.** No code was modified. This document is the canonical map of every Express route mounted by `server/app.mjs` (the production entrypoint per `.replit`).

  ## Summary

  | Metric | Value |
  |---|---|
  | Route files in `server/routes/` | **141** |
  | Total endpoint definitions (router-level) | **895** |
  | Direct identifier mounts in `app.mjs` | 18 (some are middleware, not routers) |
  | Admin sub-routers (`ADMIN_SUB_ROUTERS` array) | 7 |
  | Extended routers (`EXTENDED_ROUTES` array) | 104 |
  | Routers intentionally **NOT mounted** (security/conflict review) | 14 |
  | Router files with passing test coverage | **4 of 141 (~3%)** |
  | Boot log marker | `[boot] extended routes mounted: 104/104` |

  ### Method
  - Mount points extracted from `server/app.mjs` via three sources: direct `app.use()` calls, the `ADMIN_SUB_ROUTERS` array, and the `EXTENDED_ROUTES` array.
  - Endpoints extracted from each route file by matching `router.<method>("...")` and `app.<method>("...")` patterns.
  - A route is **safety-critical** if it touches: auth/identity, admin governance, billing/revenue, AI chat (constitutional gate), crisis routing, awareness detection, biometrics (PHI-adjacent), webhooks signing, file uploads, or health probes.
  - Tests counted: files matching `server/tests/<router-base>.test.mjs`. Other test surfaces (E2E Playwright, scripts/) are not counted here.

  ---

  ## Critical Findings (BEFORE the inventory tables)

  ### Finding 1 — `server/index.mjs` is a parallel/legacy entrypoint (745 lines)
  The production entrypoint per `.replit` is `server/app.mjs`. `server/index.mjs` exists alongside it and imports many of the same route files independently. It is **not** booted by the deployment but represents a maintenance hazard: someone modifying it expecting effect in production will be surprised. Recommendation: either delete or clearly mark as deprecated. Not actioned in this task (read-only).

  ### Finding 2 — 13 router files in `server/routes/` are NEVER mounted
  These files are loaded by Node only if something imports them. Most are dead code; a few are intentionally disabled for security or conflict reasons. Full list under "Orphan Routers" section below.

  ### Finding 3 — Tests cover only 4 of 141 routers (~3%)
  Coverage: `ai`, `auth`, `journal`, `mood`. **All other routers — including all admin, billing, biometrics, awareness, protocols, and webhooks — have zero direct router-level tests.** This is the single largest reliability risk surfaced by this inventory. Per Phase 1 of the transformation roadmap, this is the right gap for the platform-engineering work to attack.

  ### Finding 4 — `/api/auth` is mounted by THREE sources (intentional, but should be documented)
  1. `authRoutes` (`./routes/auth.mjs`) handles `/register`, `/login`, `/me`, `/refresh`, `/logout`.
  2. `githubAuthRoutes` (`./routes/github-auth.mjs`) handles `/github` and `/github/callback`.
  3. `registerAuthRoutes(app)` (`./replit_integrations/auth/index.mjs`) registers `GET /user` (consumed by `AuthContext.jsx` to hydrate session on cold reload).

  These do not collide because Express resolves first-match-wins on disjoint sub-paths, but the three-source pattern is invisible without reading all three files. Recommend a comment block in app.mjs documenting the contract.

  ### Finding 5 — Two routers are intentionally **disabled** in production for security reasons
  - `./routes/canva-oauth.mjs` — its `/verify-token` endpoint decodes Canva JWTs without verifying signatures. Will accept forged tokens. Tracked as a SOP static check.
  - (Adjacent risk) `./routes/perplexity.mjs` is mounted but **gated to authenticated users only** because it proxies a paid external API (cost/abuse vector).

  These are explicitly noted in `app.mjs` comments. Good hygiene — the comments should not be removed.

  ### Finding 6 — Two routers exist in BOTH the legacy `index.mjs` and the orphan list
  `login.mjs` and `mfa.mjs` are wired in `server/index.mjs` (legacy) but explicitly NOT mounted in `server/app.mjs` (production) because they collide with `auth.mjs`'s endpoints. The `app.mjs` comment block calls out "the 4 conflict-suspect orphans (login, mfa, accountActions, system) are deliberately NOT in this list — they need separate review." That conflict review has not yet happened. **Recommend it as a Week 1 / Task 1B follow-up.**

  ---

  ## Inventory by Domain

  For each domain: full router file → mount path → every endpoint exposed.

  
### Auth & Identity
| Method | Full Path | Source File | Mount | Auth | Safety-Critical | Has Tests |
|---|---|---|---|---|---|---|
| POST | `/api/auth/register` | `server/routes/auth.mjs` | `/api/auth` (direct) | — | Y | Y |
| POST | `/api/auth/login` | `server/routes/auth.mjs` | `/api/auth` (direct) | — | Y | Y |
| GET | `/api/auth/me` | `server/routes/auth.mjs` | `/api/auth` (direct) | — | Y | Y |
| POST | `/api/auth/refresh` | `server/routes/auth.mjs` | `/api/auth` (direct) | — | Y | Y |
| POST | `/api/auth/logout` | `server/routes/auth.mjs` | `/api/auth` (direct) | — | Y | Y |
| GET | `/api/auth/github` | `server/routes/github-auth.mjs` | `/api/auth` (direct) | — | Y | N |
| GET | `/api/auth` | `server/routes/github-auth.mjs` | `/api/auth` (direct) | — | Y | N |
| POST | _(orphan — file not mounted)_ `/login` | `server/routes/login.mjs` | _(unmounted)_ | — | Y | N |
| GET | _(orphan — file not mounted)_ `/` | `server/routes/login.mjs` | _(unmounted)_ | — | Y | N |
| GET | _(orphan — file not mounted)_ `/status` | `server/routes/mfa.mjs` | _(unmounted)_ | — | Y | N |
| POST | _(orphan — file not mounted)_ `/setup` | `server/routes/mfa.mjs` | _(unmounted)_ | — | Y | N |
| POST | _(orphan — file not mounted)_ `/verify` | `server/routes/mfa.mjs` | _(unmounted)_ | — | Y | N |
| POST | _(orphan — file not mounted)_ `/disable` | `server/routes/mfa.mjs` | _(unmounted)_ | — | Y | N |
| GET | _(orphan — file not mounted)_ `/` | `server/routes/mfa.mjs` | _(unmounted)_ | — | Y | N |
| GET | _(orphan — file not mounted)_ `/sessions` | `server/routes/accountActions.mjs` | _(unmounted)_ | — | Y | N |
| DELETE | _(orphan — file not mounted)_ `/sessions/:sessionId` | `server/routes/accountActions.mjs` | _(unmounted)_ | — | Y | N |
| POST | _(orphan — file not mounted)_ `/delete-request` | `server/routes/accountActions.mjs` | _(unmounted)_ | — | Y | N |
| POST | _(orphan — file not mounted)_ `/cancel-delete-request` | `server/routes/accountActions.mjs` | _(unmounted)_ | — | Y | N |
| GET | _(orphan — file not mounted)_ `/` | `server/routes/accountActions.mjs` | _(unmounted)_ | — | Y | N |
| PUT | `/api/account/profile` | `server/routes/account.mjs` | `/api/account` (extended) | optional | Y | N |
| POST | `/api/account/onboarding` | `server/routes/account.mjs` | `/api/account` (extended) | optional | Y | N |
| POST | `/api/account/password-reset/request` | `server/routes/account.mjs` | `/api/account` (extended) | optional | Y | N |
| POST | `/api/account/password-reset/confirm` | `server/routes/account.mjs` | `/api/account` (extended) | optional | Y | N |
| DELETE | `/api/account` | `server/routes/account.mjs` | `/api/account` (extended) | optional | Y | N |
| GET | `/api/account/export` | `server/routes/account.mjs` | `/api/account` (extended) | optional | Y | N |
| GET | `/api/account/sessions` | `server/routes/account.mjs` | `/api/account` (extended) | optional | Y | N |
| DELETE | `/api/account/sessions/:sessionId` | `server/routes/account.mjs` | `/api/account` (extended) | optional | Y | N |
| POST | `/api/account/delete-request` | `server/routes/account.mjs` | `/api/account` (extended) | optional | Y | N |
| GET | `/api/account/security` | `server/routes/account.mjs` | `/api/account` (extended) | optional | Y | N |
| POST | `/api/account/password` | `server/routes/account.mjs` | `/api/account` (extended) | optional | Y | N |
| POST | `/api/account/2fa/setup` | `server/routes/account.mjs` | `/api/account` (extended) | optional | Y | N |
| POST | `/api/account/2fa/verify` | `server/routes/account.mjs` | `/api/account` (extended) | optional | Y | N |
| POST | `/api/account/2fa/disable` | `server/routes/account.mjs` | `/api/account` (extended) | optional | Y | N |
| GET | `/api/account` | `server/routes/account.mjs` | `/api/account` (extended) | optional | Y | N |
| GET | `/api/user/stats` | `server/routes/user.mjs` | `/api/user` (extended) | optional | Y | N |
| GET | `/api/user/activity` | `server/routes/user.mjs` | `/api/user` (extended) | optional | Y | N |
| GET | `/api/user/tasks` | `server/routes/user.mjs` | `/api/user` (extended) | optional | Y | N |
| POST | `/api/user/tasks/:taskId/complete` | `server/routes/user.mjs` | `/api/user` (extended) | optional | Y | N |
| GET | `/api/user/reflection/today` | `server/routes/user.mjs` | `/api/user` (extended) | optional | Y | N |
| GET | `/api/user/reflections` | `server/routes/user.mjs` | `/api/user` (extended) | optional | Y | N |
| POST | `/api/user/reflection` | `server/routes/user.mjs` | `/api/user` (extended) | optional | Y | N |
| GET | `/api/user` | `server/routes/user.mjs` | `/api/user` (extended) | optional | Y | N |
| GET | `/api/user-settings` | `server/routes/userSettings.mjs` | `/api/user-settings` (extended) | required | Y | N |
| PATCH | `/api/user-settings` | `server/routes/userSettings.mjs` | `/api/user-settings` (extended) | required | Y | N |
| GET | `/api/session-boundary/csrf-token` | `server/routes/session-boundary.mjs` | `/api/session-boundary` (direct) | — | Y | N |
| POST | `/api/session-boundary/upgrade-history` | `server/routes/session-boundary.mjs` | `/api/session-boundary` (direct) | — | Y | N |
| GET | `/api/invites` | `server/routes/invites.mjs` | `/api/invites` (extended) | required | Y | N |
| POST | `/api/invites` | `server/routes/invites.mjs` | `/api/invites` (extended) | required | Y | N |

### Admin & Operations
| Method | Full Path | Source File | Mount | Auth | Safety-Critical | Has Tests |
|---|---|---|---|---|---|---|
| POST | `/api/admin/verify-token` | `server/routes/admin.mjs` | `/api/admin` (direct) | — | Y | N |
| GET | `/api/admin/verify-session` | `server/routes/admin.mjs` | `/api/admin` (direct) | — | Y | N |
| GET | `/api/admin/stats` | `server/routes/admin.mjs` | `/api/admin` (direct) | — | Y | N |
| GET | `/api/admin/health` | `server/routes/admin.mjs` | `/api/admin` (direct) | — | Y | N |
| GET | `/api/admin/health-deep` | `server/routes/admin.mjs` | `/api/admin` (direct) | — | Y | N |
| POST | `/api/admin/health-deep/run` | `server/routes/admin.mjs` | `/api/admin` (direct) | — | Y | N |
| POST | `/api/admin/health-deep/self-heal` | `server/routes/admin.mjs` | `/api/admin` (direct) | — | Y | N |
| POST | `/api/admin/health-deep/ai-analyze` | `server/routes/admin.mjs` | `/api/admin` (direct) | — | Y | N |
| POST | `/api/admin/health-deep/scheduler/resume` | `server/routes/admin.mjs` | `/api/admin` (direct) | — | Y | N |
| POST | `/api/admin/health-deep/scheduler/pause` | `server/routes/admin.mjs` | `/api/admin` (direct) | — | Y | N |
| GET | `/api/admin/health-deep/metrics` | `server/routes/admin.mjs` | `/api/admin` (direct) | — | Y | N |
| GET | `/api/admin/health-deep/alerts` | `server/routes/admin.mjs` | `/api/admin` (direct) | — | Y | N |
| GET | `/api/admin/health-deep/export` | `server/routes/admin.mjs` | `/api/admin` (direct) | — | Y | N |
| GET | `/api/admin/diagnostics` | `server/routes/admin.mjs` | `/api/admin` (direct) | — | Y | N |
| GET | `/api/admin` | `server/routes/admin.mjs` | `/api/admin` (direct) | — | Y | N |
| GET | `/api/admin/dashboard` | `server/routes/admin.mjs` | `/api/admin` (direct) | — | Y | N |
| GET | `/api/admin/billing/overview` | `server/routes/adminBilling.mjs` | `/api/admin/billing` (direct) | — | Y | N |
| GET | `/api/admin/billing/subscriptions` | `server/routes/adminBilling.mjs` | `/api/admin/billing` (direct) | — | Y | N |
| GET | `/api/admin/billing/plan-distribution` | `server/routes/adminBilling.mjs` | `/api/admin/billing` (direct) | — | Y | N |
| GET | `/api/admin/billing` | `server/routes/adminBilling.mjs` | `/api/admin/billing` (direct) | — | Y | N |
| GET | `/api/admin/publishing/registry` | `server/routes/admin-publishing.mjs` | `/api/admin/publishing` (direct) | — | Y | N |
| POST | `/api/admin/publishing/registry` | `server/routes/admin-publishing.mjs` | `/api/admin/publishing` (direct) | — | Y | N |
| PATCH | `/api/admin/publishing/registry/:id` | `server/routes/admin-publishing.mjs` | `/api/admin/publishing` (direct) | — | Y | N |
| GET | `/api/admin/publishing/calendar` | `server/routes/admin-publishing.mjs` | `/api/admin/publishing` (direct) | — | Y | N |
| GET | `/api/admin/publishing/pillars` | `server/routes/admin-publishing.mjs` | `/api/admin/publishing` (direct) | — | Y | N |
| GET | `/api/admin/publishing/drafts` | `server/routes/admin-publishing.mjs` | `/api/admin/publishing` (direct) | — | Y | N |
| GET | `/api/admin/publishing/draft-packs` | `server/routes/admin-publishing.mjs` | `/api/admin/publishing` (direct) | — | Y | N |
| GET | `/api/admin/publishing/draft-packs/:id` | `server/routes/admin-publishing.mjs` | `/api/admin/publishing` (direct) | — | Y | N |
| GET | `/api/admin/publishing/featured` | `server/routes/admin-publishing.mjs` | `/api/admin/publishing` (direct) | — | Y | N |
| POST | `/api/admin/publishing/featured` | `server/routes/admin-publishing.mjs` | `/api/admin/publishing` (direct) | — | Y | N |
| POST | `/api/admin/publishing/mark-posted/:id` | `server/routes/admin-publishing.mjs` | `/api/admin/publishing` (direct) | — | Y | N |
| GET | `/api/admin/publishing/status` | `server/routes/admin-publishing.mjs` | `/api/admin/publishing` (direct) | — | Y | N |
| POST | `/api/admin/publishing/status` | `server/routes/admin-publishing.mjs` | `/api/admin/publishing` (direct) | — | Y | N |
| GET | `/api/admin/publishing/signals/summary` | `server/routes/admin-publishing.mjs` | `/api/admin/publishing` (direct) | — | Y | N |
| GET | `/api/admin/publishing/recommendations` | `server/routes/admin-publishing.mjs` | `/api/admin/publishing` (direct) | — | Y | N |
| GET | `/api/admin/publishing` | `server/routes/admin-publishing.mjs` | `/api/admin/publishing` (direct) | — | Y | N |
| GET | `/api/admin/security/rate-limits` | `server/routes/admin-security.mjs` | `/api/admin/security` (admin-sub) | admin | Y | N |
| GET | `/api/admin/security/rate-limits/stats` | `server/routes/admin-security.mjs` | `/api/admin/security` (admin-sub) | admin | Y | N |
| DELETE | `/api/admin/security/rate-limits/logs` | `server/routes/admin-security.mjs` | `/api/admin/security` (admin-sub) | admin | Y | N |
| GET | `/api/admin/security/csrf/stats` | `server/routes/admin-security.mjs` | `/api/admin/security` (admin-sub) | admin | Y | N |
| GET | `/api/admin/security/websocket/stats` | `server/routes/admin-security.mjs` | `/api/admin/security` (admin-sub) | admin | Y | N |
| GET | `/api/admin/security/overview` | `server/routes/admin-security.mjs` | `/api/admin/security` (admin-sub) | admin | Y | N |
| GET | `/api/admin/security` | `server/routes/admin-security.mjs` | `/api/admin/security` (admin-sub) | admin | Y | N |
| GET | `/api/admin/social/drafts` | `server/routes/admin-social-studio.mjs` | `/api/admin/social` (admin-sub) | admin | Y | N |
| GET | `/api/admin/social/drafts/:id` | `server/routes/admin-social-studio.mjs` | `/api/admin/social` (admin-sub) | admin | Y | N |
| POST | `/api/admin/social/drafts` | `server/routes/admin-social-studio.mjs` | `/api/admin/social` (admin-sub) | admin | Y | N |
| PATCH | `/api/admin/social/drafts/:id` | `server/routes/admin-social-studio.mjs` | `/api/admin/social` (admin-sub) | admin | Y | N |
| DELETE | `/api/admin/social/drafts/:id` | `server/routes/admin-social-studio.mjs` | `/api/admin/social` (admin-sub) | admin | Y | N |
| POST | `/api/admin/social/drafts/:id/approve` | `server/routes/admin-social-studio.mjs` | `/api/admin/social` (admin-sub) | admin | Y | N |
| GET | `/api/admin/social/templates` | `server/routes/admin-social-studio.mjs` | `/api/admin/social` (admin-sub) | admin | Y | N |
| POST | `/api/admin/social/templates` | `server/routes/admin-social-studio.mjs` | `/api/admin/social` (admin-sub) | admin | Y | N |
| DELETE | `/api/admin/social/templates/:id` | `server/routes/admin-social-studio.mjs` | `/api/admin/social` (admin-sub) | admin | Y | N |
| POST | `/api/admin/social/templates/seed` | `server/routes/admin-social-studio.mjs` | `/api/admin/social` (admin-sub) | admin | Y | N |
| GET | `/api/admin/social/templates/presets` | `server/routes/admin-social-studio.mjs` | `/api/admin/social` (admin-sub) | admin | Y | N |
| GET | `/api/admin/social/calendar` | `server/routes/admin-social-studio.mjs` | `/api/admin/social` (admin-sub) | admin | Y | N |
| POST | `/api/admin/social/calendar` | `server/routes/admin-social-studio.mjs` | `/api/admin/social` (admin-sub) | admin | Y | N |
| DELETE | `/api/admin/social/calendar/:id` | `server/routes/admin-social-studio.mjs` | `/api/admin/social` (admin-sub) | admin | Y | N |
| POST | `/api/admin/social/export` | `server/routes/admin-social-studio.mjs` | `/api/admin/social` (admin-sub) | admin | Y | N |
| GET | `/api/admin/social/analytics` | `server/routes/admin-social-studio.mjs` | `/api/admin/social` (admin-sub) | admin | Y | N |
| GET | `/api/admin/social/analytics/content-calendar` | `server/routes/admin-social-studio.mjs` | `/api/admin/social` (admin-sub) | admin | Y | N |
| POST | `/api/admin/social/generate` | `server/routes/admin-social-studio.mjs` | `/api/admin/social` (admin-sub) | admin | Y | N |
| POST | `/api/admin/social/generate/repurpose` | `server/routes/admin-social-studio.mjs` | `/api/admin/social` (admin-sub) | admin | Y | N |
| POST | `/api/admin/social/compliance/check` | `server/routes/admin-social-studio.mjs` | `/api/admin/social` (admin-sub) | admin | Y | N |
| POST | `/api/admin/social/compliance/rewrite` | `server/routes/admin-social-studio.mjs` | `/api/admin/social` (admin-sub) | admin | Y | N |
| POST | `/api/admin/social/generate/image` | `server/routes/admin-social-studio.mjs` | `/api/admin/social` (admin-sub) | admin | Y | N |
| POST | `/api/admin/social/generate/batch` | `server/routes/admin-social-studio.mjs` | `/api/admin/social` (admin-sub) | admin | Y | N |
| POST | `/api/admin/social/enhance` | `server/routes/admin-social-studio.mjs` | `/api/admin/social` (admin-sub) | admin | Y | N |
| GET | `/api/admin/social/platforms/specs` | `server/routes/admin-social-studio.mjs` | `/api/admin/social` (admin-sub) | admin | Y | N |
| POST | `/api/admin/social/drafts/bulk/approve` | `server/routes/admin-social-studio.mjs` | `/api/admin/social` (admin-sub) | admin | Y | N |
| POST | `/api/admin/social/drafts/bulk/delete` | `server/routes/admin-social-studio.mjs` | `/api/admin/social` (admin-sub) | admin | Y | N |
| POST | `/api/admin/social/publish/batch` | `server/routes/admin-social-studio.mjs` | `/api/admin/social` (admin-sub) | admin | Y | N |
| GET | `/api/admin/social/publish/platforms` | `server/routes/admin-social-studio.mjs` | `/api/admin/social` (admin-sub) | admin | Y | N |
| GET | `/api/admin/social` | `server/routes/admin-social-studio.mjs` | `/api/admin/social` (admin-sub) | admin | Y | N |
| GET | `/api/admin/audit-logs` | `server/routes/audit-logs.mjs` | `/api/admin/audit-logs` (admin-sub) | admin | Y | N |
| GET | `/api/admin/audit-logs/actions` | `server/routes/audit-logs.mjs` | `/api/admin/audit-logs` (admin-sub) | admin | Y | N |
| GET | `/api/admin/audit-logs/export` | `server/routes/audit-logs.mjs` | `/api/admin/audit-logs` (admin-sub) | admin | Y | N |
| GET | `/api/admin/audit-logs/stats` | `server/routes/audit-logs.mjs` | `/api/admin/audit-logs` (admin-sub) | admin | Y | N |
| GET | `/api/admin/soft-launch-metrics` | `server/routes/soft-launch-metrics.mjs` | `/api/admin/soft-launch-metrics` (admin-sub) | admin | N | N |
| POST | `/api/admin/soft-launch-metrics/funnel` | `server/routes/soft-launch-metrics.mjs` | `/api/admin/soft-launch-metrics` (admin-sub) | admin | N | N |
| POST | `/api/admin/sop/refresh` | `server/routes/sop.mjs` | `/api/admin/sop` (admin-sub) | admin | Y | N |
| POST | `/api/admin/sop/logout` | `server/routes/sop.mjs` | `/api/admin/sop` (admin-sub) | admin | Y | N |
| GET | `/api/admin/sop/trust proxy` | `server/routes/sop.mjs` | `/api/admin/sop` (admin-sub) | admin | Y | N |
| GET | `/api/admin/sop/trust proxy` | `server/routes/sop.mjs` | `/api/admin/sop` (admin-sub) | admin | Y | N |
| GET | `/api/admin/sop/trust proxy` | `server/routes/sop.mjs` | `/api/admin/sop` (admin-sub) | admin | Y | N |
| GET | `/api/admin/sop/trust proxy` | `server/routes/sop.mjs` | `/api/admin/sop` (admin-sub) | admin | Y | N |
| GET | `/api/admin/sop/status` | `server/routes/sop.mjs` | `/api/admin/sop` (admin-sub) | admin | Y | N |
| GET | `/api/admin/sop/checks` | `server/routes/sop.mjs` | `/api/admin/sop` (admin-sub) | admin | Y | N |
| GET | `/api/admin/consciousness/health` | `server/routes/consciousness.mjs` | `/api/admin/consciousness` (admin-sub) | admin | Y | N |
| GET | `/api/admin/consciousness/agents` | `server/routes/consciousness.mjs` | `/api/admin/consciousness` (admin-sub) | admin | Y | N |
| POST | `/api/admin/consciousness/agents` | `server/routes/consciousness.mjs` | `/api/admin/consciousness` (admin-sub) | admin | Y | N |
| PATCH | `/api/admin/consciousness/agents/:id` | `server/routes/consciousness.mjs` | `/api/admin/consciousness` (admin-sub) | admin | Y | N |
| GET | `/api/admin/consciousness/decisions` | `server/routes/consciousness.mjs` | `/api/admin/consciousness` (admin-sub) | admin | Y | N |
| POST | `/api/admin/consciousness/decisions` | `server/routes/consciousness.mjs` | `/api/admin/consciousness` (admin-sub) | admin | Y | N |
| GET | `/api/admin/consciousness/scores` | `server/routes/consciousness.mjs` | `/api/admin/consciousness` (admin-sub) | admin | Y | N |
| POST | `/api/admin/consciousness/scores` | `server/routes/consciousness.mjs` | `/api/admin/consciousness` (admin-sub) | admin | Y | N |
| GET | `/api/admin/consciousness/summary` | `server/routes/consciousness.mjs` | `/api/admin/consciousness` (admin-sub) | admin | Y | N |
| POST | `/api/admin/consciousness/orchestrator/invoke` | `server/routes/consciousness.mjs` | `/api/admin/consciousness` (admin-sub) | admin | Y | N |
| GET | `/api/admin/consciousness/orchestrator/memory` | `server/routes/consciousness.mjs` | `/api/admin/consciousness` (admin-sub) | admin | Y | N |
| GET | `/api/admin/consciousness/orchestrator/memory/:agentId` | `server/routes/consciousness.mjs` | `/api/admin/consciousness` (admin-sub) | admin | Y | N |
| GET | `/api/admin/consciousness/orchestrator/state` | `server/routes/consciousness.mjs` | `/api/admin/consciousness` (admin-sub) | admin | Y | N |
| GET | `/api/admin/consciousness/orchestrator/state/:agentId` | `server/routes/consciousness.mjs` | `/api/admin/consciousness` (admin-sub) | admin | Y | N |
| GET | `/api/admin/consciousness/orchestrator/escalation/config` | `server/routes/consciousness.mjs` | `/api/admin/consciousness` (admin-sub) | admin | Y | N |
| GET | `/api/admin/consciousness/orchestrator/constitutional/rules` | `server/routes/consciousness.mjs` | `/api/admin/consciousness` (admin-sub) | admin | Y | N |
| POST | `/api/admin/consciousness/orchestrator/constitutional/check` | `server/routes/consciousness.mjs` | `/api/admin/consciousness` (admin-sub) | admin | Y | N |
| GET | `/api/admin/consciousness/orchestrator/working-memory/status` | `server/routes/consciousness.mjs` | `/api/admin/consciousness` (admin-sub) | admin | Y | N |
| GET | `/api/admin/social/enterprise/posts` | `server/routes/social-enterprise.mjs` | `/api/admin/social/enterprise` (admin-sub) | admin | Y | N |
| GET | `/api/admin/social/enterprise/post/:id` | `server/routes/social-enterprise.mjs` | `/api/admin/social/enterprise` (admin-sub) | admin | Y | N |
| POST | `/api/admin/social/enterprise/post` | `server/routes/social-enterprise.mjs` | `/api/admin/social/enterprise` (admin-sub) | admin | Y | N |
| PUT | `/api/admin/social/enterprise/post/:id` | `server/routes/social-enterprise.mjs` | `/api/admin/social/enterprise` (admin-sub) | admin | Y | N |
| POST | `/api/admin/social/enterprise/post/:id/submit` | `server/routes/social-enterprise.mjs` | `/api/admin/social/enterprise` (admin-sub) | admin | Y | N |
| POST | `/api/admin/social/enterprise/post/:id/approve` | `server/routes/social-enterprise.mjs` | `/api/admin/social/enterprise` (admin-sub) | admin | Y | N |
| POST | `/api/admin/social/enterprise/post/:id/mark-posted` | `server/routes/social-enterprise.mjs` | `/api/admin/social/enterprise` (admin-sub) | admin | Y | N |
| GET | `/api/admin/social/enterprise/signals` | `server/routes/social-enterprise.mjs` | `/api/admin/social/enterprise` (admin-sub) | admin | Y | N |
| GET | `/api/admin/social/enterprise/audit` | `server/routes/social-enterprise.mjs` | `/api/admin/social/enterprise` (admin-sub) | admin | Y | N |
| GET | `/api/admin/social/enterprise/themes` | `server/routes/social-enterprise.mjs` | `/api/admin/social/enterprise` (admin-sub) | admin | Y | N |
| GET | `/api/admin/social/enterprise/platforms` | `server/routes/social-enterprise.mjs` | `/api/admin/social/enterprise` (admin-sub) | admin | Y | N |
| GET | `/api/admin/social/enterprise/campaigns` | `server/routes/social-enterprise.mjs` | `/api/admin/social/enterprise` (admin-sub) | admin | Y | N |
| POST | `/api/admin/social/enterprise/campaigns` | `server/routes/social-enterprise.mjs` | `/api/admin/social/enterprise` (admin-sub) | admin | Y | N |
| PUT | `/api/admin/social/enterprise/campaigns/:id` | `server/routes/social-enterprise.mjs` | `/api/admin/social/enterprise` (admin-sub) | admin | Y | N |
| POST | `/api/admin/social/enterprise/post/:id/schedule` | `server/routes/social-enterprise.mjs` | `/api/admin/social/enterprise` (admin-sub) | admin | Y | N |
| POST | `/api/admin/social/enterprise/build-utm` | `server/routes/social-enterprise.mjs` | `/api/admin/social/enterprise` (admin-sub) | admin | Y | N |
| GET | `/api/admin/social/enterprise/weekly-queue` | `server/routes/social-enterprise.mjs` | `/api/admin/social/enterprise` (admin-sub) | admin | Y | N |
| POST | `/api/admin/social/enterprise/generate-from-blog` | `server/routes/social-enterprise.mjs` | `/api/admin/social/enterprise` (admin-sub) | admin | Y | N |
| GET | `/api/admin/social/enterprise/click-stats` | `server/routes/social-enterprise.mjs` | `/api/admin/social/enterprise` (admin-sub) | admin | Y | N |
| GET | `/api/admin/social/enterprise` | `server/routes/social-enterprise.mjs` | `/api/admin/social/enterprise` (admin-sub) | admin | Y | N |
| GET | `/api/deployment-readiness/check` | `server/routes/deploymentReadiness.mjs` | `/api/deployment-readiness` (extended) | admin | Y | N |
| GET | `/api/deployment-readiness` | `server/routes/deploymentReadiness.mjs` | `/api/deployment-readiness` (extended) | admin | Y | N |
| GET | `/api/kernel/version` | `server/routes/kernel.mjs` | `/api/kernel` (extended) | admin | Y | N |
| GET | `/api/kernel/health` | `server/routes/kernel.mjs` | `/api/kernel` (extended) | admin | Y | N |
| POST | `/api/kernel/validate` | `server/routes/kernel.mjs` | `/api/kernel` (extended) | admin | Y | N |
| GET | `/api/kernel/schema` | `server/routes/kernel.mjs` | `/api/kernel` (extended) | admin | Y | N |
| GET | `/api/figma/status` | `server/routes/figma.mjs` | `/api/figma` (extended) | admin | Y | N |
| GET | `/api/figma` | `server/routes/figma.mjs` | `/api/figma` (extended) | admin | Y | N |
| GET | _(orphan — file not mounted)_ `/` | `server/routes/integrationHealth.mjs` | _(unmounted)_ | — | N | N |
| GET | _(orphan — file not mounted)_ `/database` | `server/routes/integrationHealth.mjs` | _(unmounted)_ | — | N | N |
| GET | _(orphan — file not mounted)_ `/openai` | `server/routes/integrationHealth.mjs` | _(unmounted)_ | — | N | N |
| GET | _(orphan — file not mounted)_ `/stripe` | `server/routes/integrationHealth.mjs` | _(unmounted)_ | — | N | N |
| GET | _(orphan — file not mounted)_ `/` | `server/routes/system.mjs` | _(unmounted)_ | — | N | N |
| GET | _(orphan — file not mounted)_ `/history` | `server/routes/system.mjs` | _(unmounted)_ | — | N | N |
| GET | _(orphan — file not mounted)_ `/health` | `server/routes/redirects.mjs` | _(unmounted)_ | — | N | N |
| GET | _(orphan — file not mounted)_ `/list` | `server/routes/redirects.mjs` | _(unmounted)_ | — | N | N |
| POST | _(orphan — file not mounted)_ `/create` | `server/routes/redirects.mjs` | _(unmounted)_ | — | N | N |
| DELETE | _(orphan — file not mounted)_ `/remove/:id` | `server/routes/redirects.mjs` | _(unmounted)_ | — | N | N |
| GET | _(orphan — file not mounted)_ `/:slug` | `server/routes/redirects.mjs` | _(unmounted)_ | — | N | N |

### AI Chat & Orchestration (LOCKED)
| Method | Full Path | Source File | Mount | Auth | Safety-Critical | Has Tests |
|---|---|---|---|---|---|---|
| GET | `/api/ai/chat` | `server/routes/ai.mjs` | `/api/ai` (direct) | — | Y | Y |
| POST | `/api/ai/chat` | `server/routes/ai.mjs` | `/api/ai` (direct) | — | Y | Y |
| GET | `/api/ai/history` | `server/routes/ai.mjs` | `/api/ai` (direct) | — | Y | Y |
| DELETE | `/api/ai/history` | `server/routes/ai.mjs` | `/api/ai` (direct) | — | Y | Y |
| POST | `/api/ai/journal-summary` | `server/routes/ai.mjs` | `/api/ai` (direct) | — | Y | Y |
| POST | `/api/ai/coping-plan` | `server/routes/ai.mjs` | `/api/ai` (direct) | — | Y | Y |
| GET | `/api/ai/insights` | `server/routes/ai.mjs` | `/api/ai` (direct) | — | Y | Y |
| GET | `/api/ai/healing/registry` | `server/routes/ai.healing.mjs` | `/api/ai/healing` (direct) | — | Y | N |
| GET | `/api/ai/healing/admin/prompts` | `server/routes/ai.healing.mjs` | `/api/ai/healing` (direct) | — | Y | N |
| GET | `/api/ai/healing/admin/prompts/:id` | `server/routes/ai.healing.mjs` | `/api/ai/healing` (direct) | — | Y | N |
| PUT | `/api/ai/healing/admin/prompts/:id` | `server/routes/ai.healing.mjs` | `/api/ai/healing` (direct) | — | Y | N |
| GET | `/api/ai/healing/admin/audit` | `server/routes/ai.healing.mjs` | `/api/ai/healing` (direct) | — | Y | N |
| GET | `/api/ai/business/registry` | `server/routes/ai.business.mjs` | `/api/ai/business` (direct) | — | Y | N |
| GET | `/api/ai/business/admin/prompts` | `server/routes/ai.business.mjs` | `/api/ai/business` (direct) | — | Y | N |
| GET | `/api/ai/business/admin/prompts/:id` | `server/routes/ai.business.mjs` | `/api/ai/business` (direct) | — | Y | N |
| PUT | `/api/ai/business/admin/prompts/:id` | `server/routes/ai.business.mjs` | `/api/ai/business` (direct) | — | Y | N |
| GET | `/api/ai/business/admin/audit` | `server/routes/ai.business.mjs` | `/api/ai/business` (direct) | — | Y | N |
| POST | `/api/buddy` | `server/routes/buddy.mjs` | `/api` (direct) | — | Y | N |
| POST | `/api/telemetry/event` | `server/routes/telemetry.mjs` | `/api/telemetry` (direct) | — | N | N |
| GET | `/api/ai-dashboard` | `server/routes/ai-dashboard.mjs` | `/api/ai-dashboard` (extended) | required | N | N |
| GET | `/api/ai-dashboard/mood-chart` | `server/routes/ai-dashboard.mjs` | `/api/ai-dashboard` (extended) | required | N | N |
| GET | `/api/ai-dashboard/wellness-score` | `server/routes/ai-dashboard.mjs` | `/api/ai-dashboard` (extended) | required | N | N |
| POST | `/api/perplexity/ask` | `server/routes/perplexity.mjs` | `/api/perplexity` (extended) | required | Y | N |
| POST | `/api/perplexity/research` | `server/routes/perplexity.mjs` | `/api/perplexity` (extended) | required | Y | N |
| GET | `/api/perplexity/health` | `server/routes/perplexity.mjs` | `/api/perplexity` (extended) | required | Y | N |
| GET | `/api/perplexity` | `server/routes/perplexity.mjs` | `/api/perplexity` (extended) | required | Y | N |

### Safety: Awareness & Discernment
| Method | Full Path | Source File | Mount | Auth | Safety-Critical | Has Tests |
|---|---|---|---|---|---|---|
| GET | `/api/awareness/rules` | `server/routes/awareness.mjs` | `/api/awareness` (direct) | — | Y | N |
| POST | `/api/awareness/detect` | `server/routes/awareness.mjs` | `/api/awareness` (direct) | — | Y | N |
| POST | `/api/awareness/report` | `server/routes/awareness.mjs` | `/api/awareness` (direct) | — | Y | N |
| GET | `/api/awareness/progress/:userId` | `server/routes/awareness.mjs` | `/api/awareness` (direct) | — | Y | N |
| GET | `/api/discernment/belts` | `server/routes/discernment.mjs` | `/api/discernment` (direct) | — | Y | N |
| GET | `/api/discernment/lessons` | `server/routes/discernment.mjs` | `/api/discernment` (direct) | — | Y | N |
| GET | `/api/discernment/lessons/:id` | `server/routes/discernment.mjs` | `/api/discernment` (direct) | — | Y | N |
| GET | `/api/discernment/progress` | `server/routes/discernment.mjs` | `/api/discernment` (direct) | — | Y | N |
| POST | `/api/discernment/attempts` | `server/routes/discernment.mjs` | `/api/discernment` (direct) | — | Y | N |
| POST | `/api/discernment/real-world` | `server/routes/discernment.mjs` | `/api/discernment` (direct) | — | Y | N |
| GET | `/api/discernment/attempts/recent` | `server/routes/discernment.mjs` | `/api/discernment` (direct) | — | Y | N |

### Therapeutic Protocols
| Method | Full Path | Source File | Mount | Auth | Safety-Critical | Has Tests |
|---|---|---|---|---|---|---|
| GET | `/api/protocols` | `server/routes/protocols.mjs` | `/api/protocols` (direct) | — | Y | N |
| POST | `/api/protocols/start` | `server/routes/protocols.mjs` | `/api/protocols` (direct) | — | Y | N |
| GET | `/api/protocols/session/:id` | `server/routes/protocols.mjs` | `/api/protocols` (direct) | — | Y | N |
| POST | `/api/protocols/session/:id/respond` | `server/routes/protocols.mjs` | `/api/protocols` (direct) | — | Y | N |
| POST | `/api/protocols/session/:id/progress` | `server/routes/protocols.mjs` | `/api/protocols` (direct) | — | Y | N |
| POST | `/api/protocols/session/:id/pause` | `server/routes/protocols.mjs` | `/api/protocols` (direct) | — | Y | N |
| GET | `/api/protocols/meta` | `server/routes/protocols.mjs` | `/api/protocols` (direct) | — | Y | N |
| GET | `/api/therapy/crisis-resources` | `server/routes/therapy.mjs` | `/api/therapy` (extended) | adult | Y | N |
| POST | `/api/therapy/session` | `server/routes/therapy.mjs` | `/api/therapy` (extended) | adult | Y | N |
| POST | `/api/therapy/message` | `server/routes/therapy.mjs` | `/api/therapy` (extended) | adult | Y | N |
| GET | `/api/therapy/sessions` | `server/routes/therapy.mjs` | `/api/therapy` (extended) | adult | Y | N |
| GET | `/api/therapy/history` | `server/routes/therapy.mjs` | `/api/therapy` (extended) | adult | Y | N |
| GET | `/api/therapy` | `server/routes/therapy.mjs` | `/api/therapy` (extended) | adult | Y | N |
| GET | `/api/reflection/entries` | `server/routes/reflection.mjs` | `/api/reflection` (extended) | adult | N | N |
| POST | `/api/reflection/entries` | `server/routes/reflection.mjs` | `/api/reflection` (extended) | adult | N | N |
| POST | `/api/reflection/prompt` | `server/routes/reflection.mjs` | `/api/reflection` (extended) | adult | N | N |
| GET | `/api/reflection` | `server/routes/reflection.mjs` | `/api/reflection` (extended) | adult | N | N |
| GET | `/api/trauma-healing/grounding` | `server/routes/trauma-healing-protocols.mjs` | `/api/trauma-healing` (extended) | optional | Y | N |
| GET | `/api/trauma-healing/nervous-system` | `server/routes/trauma-healing-protocols.mjs` | `/api/trauma-healing` (extended) | optional | Y | N |
| GET | `/api/trauma-healing/parts-work` | `server/routes/trauma-healing-protocols.mjs` | `/api/trauma-healing` (extended) | optional | Y | N |
| GET | `/api/trauma-healing/somatic` | `server/routes/trauma-healing-protocols.mjs` | `/api/trauma-healing` (extended) | optional | Y | N |
| GET | `/api/trauma-healing/reparenting` | `server/routes/trauma-healing-protocols.mjs` | `/api/trauma-healing` (extended) | optional | Y | N |
| GET | `/api/trauma-healing/window-of-tolerance` | `server/routes/trauma-healing-protocols.mjs` | `/api/trauma-healing` (extended) | optional | Y | N |
| GET | `/api/trauma-healing/all` | `server/routes/trauma-healing-protocols.mjs` | `/api/trauma-healing` (extended) | optional | Y | N |
| GET | `/api/trauma-healing` | `server/routes/trauma-healing-protocols.mjs` | `/api/trauma-healing` (extended) | optional | Y | N |
| GET | `/api/post-trauma/growth-domains` | `server/routes/post-trauma.mjs` | `/api/post-trauma` (extended) | optional | Y | N |
| GET | `/api/post-trauma/modalities` | `server/routes/post-trauma.mjs` | `/api/post-trauma` (extended) | optional | Y | N |
| GET | `/api/post-trauma/daily` | `server/routes/post-trauma.mjs` | `/api/post-trauma` (extended) | optional | Y | N |
| GET | `/api/post-trauma` | `server/routes/post-trauma.mjs` | `/api/post-trauma` (extended) | optional | Y | N |
| GET | _(orphan — file not mounted)_ `/boundary-builder` | `server/routes/healing.mjs` | _(unmounted)_ | — | N | N |
| GET | _(orphan — file not mounted)_ `/repair-guide` | `server/routes/healing.mjs` | _(unmounted)_ | — | N | N |
| GET | _(orphan — file not mounted)_ `/wisdom-ladder` | `server/routes/healing.mjs` | _(unmounted)_ | — | N | N |
| GET | _(orphan — file not mounted)_ `/micro-courage` | `server/routes/healing.mjs` | _(unmounted)_ | — | N | N |
| POST | _(orphan — file not mounted)_ `/reflection-mirror` | `server/routes/healing.mjs` | _(unmounted)_ | — | N | N |
| GET | _(orphan — file not mounted)_ `/patterns/summary` | `server/routes/healing.mjs` | _(unmounted)_ | — | N | N |
| GET | _(orphan — file not mounted)_ `/values-compass` | `server/routes/healing.mjs` | _(unmounted)_ | — | N | N |
| GET | _(orphan — file not mounted)_ `/emotion-translator` | `server/routes/healing.mjs` | _(unmounted)_ | — | N | N |
| GET | _(orphan — file not mounted)_ `/` | `server/routes/healing.mjs` | _(unmounted)_ | — | N | N |
| GET | _(orphan — file not mounted)_ `/wisdom-ladder` | `server/routes/healing-tools.mjs` | _(unmounted)_ | — | N | N |
| GET | _(orphan — file not mounted)_ `/micro-courage` | `server/routes/healing-tools.mjs` | _(unmounted)_ | — | N | N |
| POST | _(orphan — file not mounted)_ `/reflection-mirror` | `server/routes/healing-tools.mjs` | _(unmounted)_ | — | N | N |
| GET | _(orphan — file not mounted)_ `/patterns` | `server/routes/healing-tools.mjs` | _(unmounted)_ | — | N | N |
| GET | _(orphan — file not mounted)_ `/patterns/summary` | `server/routes/healing-tools.mjs` | _(unmounted)_ | — | N | N |
| GET | _(orphan — file not mounted)_ `/values-compass` | `server/routes/healing-tools.mjs` | _(unmounted)_ | — | N | N |
| POST | _(orphan — file not mounted)_ `/values-compass/select` | `server/routes/healing-tools.mjs` | _(unmounted)_ | — | N | N |
| GET | _(orphan — file not mounted)_ `/emotion-translator` | `server/routes/healing-tools.mjs` | _(unmounted)_ | — | N | N |
| POST | _(orphan — file not mounted)_ `/emotion-translator/translate` | `server/routes/healing-tools.mjs` | _(unmounted)_ | — | N | N |
| GET | _(orphan — file not mounted)_ `/boundary-builder` | `server/routes/healing-tools.mjs` | _(unmounted)_ | — | N | N |
| GET | _(orphan — file not mounted)_ `/repair-guide` | `server/routes/healing-tools.mjs` | _(unmounted)_ | — | N | N |
| GET | _(orphan — file not mounted)_ `/` | `server/routes/healing-tools.mjs` | _(unmounted)_ | — | N | N |
| GET | `/api/healing-modalities/modalities` | `server/routes/healing-modalities.mjs` | `/api/healing-modalities` (extended) | optional | N | N |
| GET | `/api/healing-modalities/somatic` | `server/routes/healing-modalities.mjs` | `/api/healing-modalities` (extended) | optional | N | N |
| GET | `/api/healing-modalities/energy-healing` | `server/routes/healing-modalities.mjs` | `/api/healing-modalities` (extended) | optional | N | N |
| GET | `/api/healing-modalities/self-care` | `server/routes/healing-modalities.mjs` | `/api/healing-modalities` (extended) | optional | N | N |
| GET | `/api/healing-modalities/all` | `server/routes/healing-modalities.mjs` | `/api/healing-modalities` (extended) | optional | N | N |
| GET | `/api/healing-modalities` | `server/routes/healing-modalities.mjs` | `/api/healing-modalities` (extended) | optional | N | N |
| GET | `/api/healing-intelligence/modalities` | `server/routes/healing-intelligence.mjs` | `/api/healing-intelligence` (extended) | optional | N | N |
| GET | `/api/healing-intelligence/modalities/:id` | `server/routes/healing-intelligence.mjs` | `/api/healing-intelligence` (extended) | optional | N | N |
| GET | `/api/healing-intelligence/journeys` | `server/routes/healing-intelligence.mjs` | `/api/healing-intelligence` (extended) | optional | N | N |
| GET | `/api/healing-intelligence/journeys/:id` | `server/routes/healing-intelligence.mjs` | `/api/healing-intelligence` (extended) | optional | N | N |
| GET | `/api/healing-intelligence/categories` | `server/routes/healing-intelligence.mjs` | `/api/healing-intelligence` (extended) | optional | N | N |
| POST | `/api/healing-intelligence/recommend` | `server/routes/healing-intelligence.mjs` | `/api/healing-intelligence` (extended) | optional | N | N |
| GET | `/api/healing-intelligence` | `server/routes/healing-intelligence.mjs` | `/api/healing-intelligence` (extended) | optional | N | N |
| GET | `/api/holistic-healing/breathwork` | `server/routes/holistic-healing.mjs` | `/api/holistic-healing` (extended) | optional | N | N |
| GET | `/api/holistic-healing/breathwork/:id` | `server/routes/holistic-healing.mjs` | `/api/holistic-healing` (extended) | optional | N | N |
| GET | `/api/holistic-healing/nervous-system` | `server/routes/holistic-healing.mjs` | `/api/holistic-healing` (extended) | optional | N | N |
| GET | `/api/holistic-healing/inner-child` | `server/routes/holistic-healing.mjs` | `/api/holistic-healing` (extended) | optional | N | N |
| GET | `/api/holistic-healing/somatic` | `server/routes/holistic-healing.mjs` | `/api/holistic-healing` (extended) | optional | N | N |
| GET | `/api/holistic-healing/energy` | `server/routes/holistic-healing.mjs` | `/api/holistic-healing` (extended) | optional | N | N |
| GET | `/api/holistic-healing/journeys` | `server/routes/holistic-healing.mjs` | `/api/holistic-healing` (extended) | optional | N | N |
| GET | `/api/holistic-healing/all` | `server/routes/holistic-healing.mjs` | `/api/holistic-healing` (extended) | optional | N | N |
| GET | `/api/holistic-healing` | `server/routes/holistic-healing.mjs` | `/api/holistic-healing` (extended) | optional | N | N |

### Biometrics & Nervous System
| Method | Full Path | Source File | Mount | Auth | Safety-Critical | Has Tests |
|---|---|---|---|---|---|---|
| GET | `/api/biometrics/meta` | `server/routes/biometrics.mjs` | `/api/biometrics` (direct) | — | Y | N |
| GET | `/api/biometrics/connections` | `server/routes/biometrics.mjs` | `/api/biometrics` (direct) | — | Y | N |
| POST | `/api/biometrics/connect` | `server/routes/biometrics.mjs` | `/api/biometrics` (direct) | — | Y | N |
| GET | `/api/biometrics/callback/:source` | `server/routes/biometrics.mjs` | `/api/biometrics` (direct) | — | Y | N |
| POST | `/api/biometrics/sync/:source` | `server/routes/biometrics.mjs` | `/api/biometrics` (direct) | — | Y | N |
| POST | `/api/biometrics/upload` | `server/routes/biometrics.mjs` | `/api/biometrics` (direct) | — | Y | N |
| GET | `/api/biometrics/data` | `server/routes/biometrics.mjs` | `/api/biometrics` (direct) | — | Y | N |
| GET | `/api/biometrics/latest` | `server/routes/biometrics.mjs` | `/api/biometrics` (direct) | — | Y | N |
| GET | `/api/biometrics/state` | `server/routes/biometrics.mjs` | `/api/biometrics` (direct) | — | Y | N |
| POST | `/api/biometrics/state/compute` | `server/routes/biometrics.mjs` | `/api/biometrics` (direct) | — | Y | N |
| DELETE | `/api/biometrics/disconnect/:source` | `server/routes/biometrics.mjs` | `/api/biometrics` (direct) | — | Y | N |
| GET | `/api/embodiment/somatic` | `server/routes/embodiment.mjs` | `/api/embodiment` (extended) | optional | N | N |
| GET | `/api/embodiment/nervous-system` | `server/routes/embodiment.mjs` | `/api/embodiment` (extended) | optional | N | N |
| GET | `/api/embodiment/regulation` | `server/routes/embodiment.mjs` | `/api/embodiment` (extended) | optional | N | N |
| GET | `/api/embodiment/interoception` | `server/routes/embodiment.mjs` | `/api/embodiment` (extended) | optional | N | N |
| GET | `/api/embodiment/daily` | `server/routes/embodiment.mjs` | `/api/embodiment` (extended) | optional | N | N |
| GET | `/api/embodiment` | `server/routes/embodiment.mjs` | `/api/embodiment` (extended) | optional | N | N |
| GET | `/api/mind-body/breathwork` | `server/routes/mind-body-integration.mjs` | `/api/mind-body` (extended) | optional | N | N |
| GET | `/api/mind-body/somatic-practices` | `server/routes/mind-body-integration.mjs` | `/api/mind-body` (extended) | optional | N | N |
| GET | `/api/mind-body/movement-therapy` | `server/routes/mind-body-integration.mjs` | `/api/mind-body` (extended) | optional | N | N |
| GET | `/api/mind-body/nervous-system` | `server/routes/mind-body-integration.mjs` | `/api/mind-body` (extended) | optional | N | N |
| GET | `/api/mind-body/embodiment-exercises` | `server/routes/mind-body-integration.mjs` | `/api/mind-body` (extended) | optional | N | N |
| GET | `/api/mind-body/daily` | `server/routes/mind-body-integration.mjs` | `/api/mind-body` (extended) | optional | N | N |
| GET | `/api/mind-body` | `server/routes/mind-body-integration.mjs` | `/api/mind-body` (extended) | optional | N | N |
| GET | `/api/neuro-integration/affective-systems` | `server/routes/neuro-integration.mjs` | `/api/neuro-integration` (extended) | optional | N | N |
| GET | `/api/neuro-integration/brain-regions` | `server/routes/neuro-integration.mjs` | `/api/neuro-integration` (extended) | optional | N | N |
| GET | `/api/neuro-integration/neuroplasticity` | `server/routes/neuro-integration.mjs` | `/api/neuro-integration` (extended) | optional | N | N |
| GET | `/api/neuro-integration/mind-body` | `server/routes/neuro-integration.mjs` | `/api/neuro-integration` (extended) | optional | N | N |
| GET | `/api/neuro-integration/daily` | `server/routes/neuro-integration.mjs` | `/api/neuro-integration` (extended) | optional | N | N |
| GET | `/api/neuro-integration` | `server/routes/neuro-integration.mjs` | `/api/neuro-integration` (extended) | optional | N | N |

### Wellness Tools & Daily Practice
| Method | Full Path | Source File | Mount | Auth | Safety-Critical | Has Tests |
|---|---|---|---|---|---|---|
| GET | `/api/wellness-tools/values` | `server/routes/wellness-tools.mjs` | `/api/wellness-tools` (extended) | optional | N | N |
| POST | `/api/wellness-tools/values` | `server/routes/wellness-tools.mjs` | `/api/wellness-tools` (extended) | optional | N | N |
| GET | `/api/wellness-tools/boundaries` | `server/routes/wellness-tools.mjs` | `/api/wellness-tools` (extended) | optional | N | N |
| POST | `/api/wellness-tools/boundaries` | `server/routes/wellness-tools.mjs` | `/api/wellness-tools` (extended) | optional | N | N |
| PATCH | `/api/wellness-tools/boundaries/:id` | `server/routes/wellness-tools.mjs` | `/api/wellness-tools` (extended) | optional | N | N |
| DELETE | `/api/wellness-tools/boundaries/:id` | `server/routes/wellness-tools.mjs` | `/api/wellness-tools` (extended) | optional | N | N |
| GET | `/api/wellness-tools/movement` | `server/routes/wellness-tools.mjs` | `/api/wellness-tools` (extended) | optional | N | N |
| POST | `/api/wellness-tools/movement` | `server/routes/wellness-tools.mjs` | `/api/wellness-tools` (extended) | optional | N | N |
| GET | `/api/wellness-tools/coherence` | `server/routes/wellness-tools.mjs` | `/api/wellness-tools` (extended) | optional | N | N |
| POST | `/api/wellness-tools/coherence` | `server/routes/wellness-tools.mjs` | `/api/wellness-tools` (extended) | optional | N | N |
| GET | `/api/wellness-tools/meaning-map` | `server/routes/wellness-tools.mjs` | `/api/wellness-tools` (extended) | optional | N | N |
| GET | `/api/wellness-tools/meaning-map/latest` | `server/routes/wellness-tools.mjs` | `/api/wellness-tools` (extended) | optional | N | N |
| POST | `/api/wellness-tools/meaning-map` | `server/routes/wellness-tools.mjs` | `/api/wellness-tools` (extended) | optional | N | N |
| GET | `/api/wellness-tools/grief-letter` | `server/routes/wellness-tools.mjs` | `/api/wellness-tools` (extended) | optional | N | N |
| POST | `/api/wellness-tools/grief-letter` | `server/routes/wellness-tools.mjs` | `/api/wellness-tools` (extended) | optional | N | N |
| DELETE | `/api/wellness-tools/grief-letter/:id` | `server/routes/wellness-tools.mjs` | `/api/wellness-tools` (extended) | optional | N | N |
| GET | `/api/wellness-tools/weekly-reflection` | `server/routes/wellness-tools.mjs` | `/api/wellness-tools` (extended) | optional | N | N |
| POST | `/api/wellness-tools/weekly-reflection` | `server/routes/wellness-tools.mjs` | `/api/wellness-tools` (extended) | optional | N | N |
| GET | `/api/wellness-tools/challenge-progress` | `server/routes/wellness-tools.mjs` | `/api/wellness-tools` (extended) | optional | N | N |
| POST | `/api/wellness-tools/challenge-progress` | `server/routes/wellness-tools.mjs` | `/api/wellness-tools` (extended) | optional | N | N |
| GET | `/api/wellness-tools` | `server/routes/wellness-tools.mjs` | `/api/wellness-tools` (extended) | optional | N | N |
| GET | `/api/mood/ping` | `server/routes/mood.mjs` | `/api/mood` (extended) | optional | Y | Y |
| GET | `/api/mood` | `server/routes/mood.mjs` | `/api/mood` (extended) | optional | Y | Y |
| POST | `/api/mood` | `server/routes/mood.mjs` | `/api/mood` (extended) | optional | Y | Y |
| GET | `/api/mood/stats` | `server/routes/mood.mjs` | `/api/mood` (extended) | optional | Y | Y |
| PUT | `/api/mood/:id` | `server/routes/mood.mjs` | `/api/mood` (extended) | optional | Y | Y |
| DELETE | `/api/mood/:id` | `server/routes/mood.mjs` | `/api/mood` (extended) | optional | Y | Y |
| GET | `/api/gratitude` | `server/routes/gratitude.mjs` | `/api/gratitude` (extended) | optional | N | N |
| GET | `/api/gratitude/today` | `server/routes/gratitude.mjs` | `/api/gratitude` (extended) | optional | N | N |
| POST | `/api/gratitude` | `server/routes/gratitude.mjs` | `/api/gratitude` (extended) | optional | N | N |
| GET | `/api/gratitude/weekly-summary` | `server/routes/gratitude.mjs` | `/api/gratitude` (extended) | optional | N | N |
| POST | `/api/journal` | `server/routes/journal.mjs` | `/api/journal` (extended) | adult | Y | Y |
| GET | `/api/journal` | `server/routes/journal.mjs` | `/api/journal` (extended) | adult | Y | Y |
| GET | `/api/journal/:id` | `server/routes/journal.mjs` | `/api/journal` (extended) | adult | Y | Y |
| PUT | `/api/journal/:id` | `server/routes/journal.mjs` | `/api/journal` (extended) | adult | Y | Y |
| DELETE | `/api/journal/:id` | `server/routes/journal.mjs` | `/api/journal` (extended) | adult | Y | Y |
| GET | `/api/states` | `server/routes/states.mjs` | `/api/states` (extended) | public | N | N |
| GET | `/api/states/dimensions` | `server/routes/states.mjs` | `/api/states` (extended) | public | N | N |
| POST | `/api/states` | `server/routes/states.mjs` | `/api/states` (extended) | public | N | N |
| GET | `/api/practices/contemplative` | `server/routes/practices.mjs` | `/api/practices` (extended) | public | N | N |
| GET | `/api/practices/contemplative/:id` | `server/routes/practices.mjs` | `/api/practices` (extended) | public | N | N |
| GET | `/api/practices/contemplative/difficulty/:level` | `server/routes/practices.mjs` | `/api/practices` (extended) | public | N | N |
| GET | `/api/practices/growth` | `server/routes/practices.mjs` | `/api/practices` (extended) | public | N | N |
| GET | `/api/practices/growth/:id` | `server/routes/practices.mjs` | `/api/practices` (extended) | public | N | N |
| GET | `/api/practices/rituals` | `server/routes/practices.mjs` | `/api/practices` (extended) | public | N | N |
| GET | `/api/practices/daily` | `server/routes/practices.mjs` | `/api/practices` (extended) | public | N | N |
| GET | `/api/practices/all` | `server/routes/practices.mjs` | `/api/practices` (extended) | public | N | N |
| GET | `/api/practices` | `server/routes/practices.mjs` | `/api/practices` (extended) | public | N | N |
| GET | `/api/streaks/me` | `server/routes/streaks.mjs` | `/api/streaks` (direct) | — | N | N |
| POST | `/api/streaks/checkin` | `server/routes/streaks.mjs` | `/api/streaks` (direct) | — | N | N |
| GET | `/api/progress/stats` | `server/routes/progress.mjs` | `/api/progress` (extended) | optional | N | N |
| GET | `/api/progress/achievements` | `server/routes/progress.mjs` | `/api/progress` (extended) | optional | N | N |
| GET | `/api/progress` | `server/routes/progress.mjs` | `/api/progress` (extended) | optional | N | N |
| GET | `/api/favorites` | `server/routes/favorites.mjs` | `/api/favorites` (extended) | optional | N | N |
| POST | `/api/favorites` | `server/routes/favorites.mjs` | `/api/favorites` (extended) | optional | N | N |
| DELETE | `/api/favorites/:id` | `server/routes/favorites.mjs` | `/api/favorites` (extended) | optional | N | N |
| PATCH | `/api/peacescape/state` | `server/routes/peacescape.mjs` | `/api/peacescape` (extended) | optional | N | N |
| GET | `/api/peacescape/state` | `server/routes/peacescape.mjs` | `/api/peacescape` (extended) | optional | N | N |
| GET | `/api/growth/journey` | `server/routes/growth-journey.mjs` | `/api/growth` (extended) | optional | N | N |
| POST | `/api/mirror` | `server/routes/mirror.mjs` | `/api/mirror` (extended) | optional | N | N |
| GET | `/api/mirror/frameworks` | `server/routes/mirror.mjs` | `/api/mirror` (extended) | optional | N | N |
| GET | `/api/mirror` | `server/routes/mirror.mjs` | `/api/mirror` (extended) | optional | N | N |

### Content & Knowledge
| Method | Full Path | Source File | Mount | Auth | Safety-Critical | Has Tests |
|---|---|---|---|---|---|---|
| GET | `/api/blog/posts` | `server/routes/blog.mjs` | `/api/blog` (extended) | public | N | N |
| GET | `/api/blog` | `server/routes/blog.mjs` | `/api/blog` (extended) | public | N | N |
| GET | `/api/blog/admin` | `server/routes/blog.mjs` | `/api/blog` (extended) | public | N | N |
| GET | `/api/blog/admin/stats` | `server/routes/blog.mjs` | `/api/blog` (extended) | public | N | N |
| POST | `/api/blog/admin/test-send` | `server/routes/blog.mjs` | `/api/blog` (extended) | public | N | N |
| GET | `/api/blog/rss` | `server/routes/blog.mjs` | `/api/blog` (extended) | public | N | N |
| GET | `/api/blog/:slug` | `server/routes/blog.mjs` | `/api/blog` (extended) | public | N | N |
| POST | `/api/blog` | `server/routes/blog.mjs` | `/api/blog` (extended) | public | N | N |
| PUT | `/api/blog/:id` | `server/routes/blog.mjs` | `/api/blog` (extended) | public | N | N |
| DELETE | `/api/blog/:id` | `server/routes/blog.mjs` | `/api/blog` (extended) | public | N | N |
| POST | `/api/blog/:postId/comments` | `server/routes/blog.mjs` | `/api/blog` (extended) | public | N | N |
| DELETE | `/api/blog/comments/:commentId` | `server/routes/blog.mjs` | `/api/blog` (extended) | public | N | N |
| POST | `/api/blog/admin/create` | `server/routes/blog.mjs` | `/api/blog` (extended) | public | N | N |
| PUT | `/api/blog/admin/:id` | `server/routes/blog.mjs` | `/api/blog` (extended) | public | N | N |
| POST | `/api/blog/admin/:id/submit` | `server/routes/blog.mjs` | `/api/blog` (extended) | public | N | N |
| POST | `/api/blog/admin/:id/approve` | `server/routes/blog.mjs` | `/api/blog` (extended) | public | N | N |
| POST | `/api/blog/admin/:id/publish` | `server/routes/blog.mjs` | `/api/blog` (extended) | public | N | N |
| GET | `/api/blog/user/drafts` | `server/routes/blog.mjs` | `/api/blog` (extended) | public | N | N |
| GET | `/api/content/formats` | `server/routes/content.mjs` | `/api/content` (extended) | public | N | N |
| POST | `/api/content/generate` | `server/routes/content.mjs` | `/api/content` (extended) | public | N | N |
| POST | `/api/content/validate` | `server/routes/content.mjs` | `/api/content` (extended) | public | N | N |
| GET | `/api/content/health` | `server/routes/content.mjs` | `/api/content` (extended) | public | N | N |
| GET | `/api/content/items` | `server/routes/content.mjs` | `/api/content` (extended) | public | N | N |
| GET | `/api/content/items/:id` | `server/routes/content.mjs` | `/api/content` (extended) | public | N | N |
| POST | `/api/content/items` | `server/routes/content.mjs` | `/api/content` (extended) | public | N | N |
| PATCH | `/api/content/items/:id` | `server/routes/content.mjs` | `/api/content` (extended) | public | N | N |
| POST | `/api/content/seed-demo` | `server/routes/content.mjs` | `/api/content` (extended) | public | N | N |
| GET | `/api/content` | `server/routes/content.mjs` | `/api/content` (extended) | public | N | N |
| POST | `/api/content-studio/generate/podcast` | `server/routes/content-studio.mjs` | `/api/content-studio` (extended) | optional | N | N |
| POST | `/api/content-studio/generate/youtube` | `server/routes/content-studio.mjs` | `/api/content-studio` (extended) | optional | N | N |
| POST | `/api/content-studio/generate/book` | `server/routes/content-studio.mjs` | `/api/content-studio` (extended) | optional | N | N |
| POST | `/api/content-studio/generate/course` | `server/routes/content-studio.mjs` | `/api/content-studio` (extended) | optional | N | N |
| POST | `/api/content-studio/generate/presentation` | `server/routes/content-studio.mjs` | `/api/content-studio` (extended) | optional | N | N |
| GET | `/api/content-studio/templates/podcast` | `server/routes/content-studio.mjs` | `/api/content-studio` (extended) | optional | N | N |
| GET | `/api/content-studio/templates/youtube` | `server/routes/content-studio.mjs` | `/api/content-studio` (extended) | optional | N | N |
| GET | `/api/content-studio/templates/book` | `server/routes/content-studio.mjs` | `/api/content-studio` (extended) | optional | N | N |
| GET | `/api/content-studio/templates/course` | `server/routes/content-studio.mjs` | `/api/content-studio` (extended) | optional | N | N |
| GET | `/api/content-studio/templates/presentation` | `server/routes/content-studio.mjs` | `/api/content-studio` (extended) | optional | N | N |
| GET | `/api/content-studio/templates/all` | `server/routes/content-studio.mjs` | `/api/content-studio` (extended) | optional | N | N |
| GET | `/api/content-studio` | `server/routes/content-studio.mjs` | `/api/content-studio` (extended) | optional | N | N |
| POST | `/api/content-generator/generate` | `server/routes/content-generator.mjs` | `/api/content-generator` (extended) | optional | N | N |
| GET | `/api/content-generator/formats` | `server/routes/content-generator.mjs` | `/api/content-generator` (extended) | optional | N | N |
| GET | `/api/content-generator/drafts` | `server/routes/content-generator.mjs` | `/api/content-generator` (extended) | optional | N | N |
| POST | `/api/content-generator/drafts` | `server/routes/content-generator.mjs` | `/api/content-generator` (extended) | optional | N | N |
| GET | `/api/content-generator` | `server/routes/content-generator.mjs` | `/api/content-generator` (extended) | optional | N | N |
| GET | `/api/content-intelligence/frameworks` | `server/routes/content-intelligence.mjs` | `/api/content-intelligence` (extended) | optional | N | N |
| GET | `/api/content-intelligence/frameworks/:id` | `server/routes/content-intelligence.mjs` | `/api/content-intelligence` (extended) | optional | N | N |
| GET | `/api/content-intelligence/platforms` | `server/routes/content-intelligence.mjs` | `/api/content-intelligence` (extended) | optional | N | N |
| GET | `/api/content-intelligence/platforms/:id` | `server/routes/content-intelligence.mjs` | `/api/content-intelligence` (extended) | optional | N | N |
| GET | `/api/content-intelligence/voice-dimensions` | `server/routes/content-intelligence.mjs` | `/api/content-intelligence` (extended) | optional | N | N |
| GET | `/api/content-intelligence/content-strategy` | `server/routes/content-intelligence.mjs` | `/api/content-intelligence` (extended) | optional | N | N |
| GET | `/api/content-intelligence` | `server/routes/content-intelligence.mjs` | `/api/content-intelligence` (extended) | optional | N | N |
| GET | `/api/universal-content/frameworks` | `server/routes/universal-content.mjs` | `/api/universal-content` (extended) | optional | N | N |
| GET | `/api/universal-content/types` | `server/routes/universal-content.mjs` | `/api/universal-content` (extended) | optional | N | N |
| GET | `/api/universal-content/headlines` | `server/routes/universal-content.mjs` | `/api/universal-content` (extended) | optional | N | N |
| GET | `/api/universal-content/hooks` | `server/routes/universal-content.mjs` | `/api/universal-content` (extended) | optional | N | N |
| GET | `/api/universal-content/repurpose` | `server/routes/universal-content.mjs` | `/api/universal-content` (extended) | optional | N | N |
| GET | `/api/universal-content/ctas` | `server/routes/universal-content.mjs` | `/api/universal-content` (extended) | optional | N | N |
| GET | `/api/universal-content/all` | `server/routes/universal-content.mjs` | `/api/universal-content` (extended) | optional | N | N |
| GET | `/api/universal-content` | `server/routes/universal-content.mjs` | `/api/universal-content` (extended) | optional | N | N |
| GET | `/api/narrative/frameworks` | `server/routes/narrative.mjs` | `/api/narrative` (extended) | optional | N | N |
| GET | `/api/narrative/elements` | `server/routes/narrative.mjs` | `/api/narrative` (extended) | optional | N | N |
| GET | `/api/narrative/prompts` | `server/routes/narrative.mjs` | `/api/narrative` (extended) | optional | N | N |
| GET | `/api/narrative/archetypes` | `server/routes/narrative.mjs` | `/api/narrative` (extended) | optional | N | N |
| GET | `/api/narrative/daily` | `server/routes/narrative.mjs` | `/api/narrative` (extended) | optional | N | N |
| GET | `/api/narrative` | `server/routes/narrative.mjs` | `/api/narrative` (extended) | optional | N | N |
| GET | `/api/narrative-drafts` | `server/routes/narrative-drafts.mjs` | `/api/narrative-drafts` (extended) | required | Y | N |
| PATCH | `/api/narrative-drafts/:postId` | `server/routes/narrative-drafts.mjs` | `/api/narrative-drafts` (extended) | required | Y | N |
| GET | `/api/prompts/daily` | `server/routes/prompts.mjs` | `/api/prompts` (extended) | optional | N | N |
| GET | `/api/prompts/random` | `server/routes/prompts.mjs` | `/api/prompts` (extended) | optional | N | N |
| GET | `/api/prompts/all` | `server/routes/prompts.mjs` | `/api/prompts` (extended) | optional | N | N |
| GET | `/api/prompts` | `server/routes/prompts.mjs` | `/api/prompts` (extended) | optional | N | N |
| GET | `/api/knowledge/concepts` | `server/routes/knowledge.mjs` | `/api/knowledge` (extended) | public | N | N |
| GET | `/api/knowledge/concepts/:id` | `server/routes/knowledge.mjs` | `/api/knowledge` (extended) | public | N | N |
| GET | `/api/knowledge/learning` | `server/routes/knowledge.mjs` | `/api/knowledge` (extended) | public | N | N |
| GET | `/api/knowledge/learning/:id` | `server/routes/knowledge.mjs` | `/api/knowledge` (extended) | public | N | N |
| GET | `/api/knowledge/synthesis` | `server/routes/knowledge.mjs` | `/api/knowledge` (extended) | public | N | N |
| GET | `/api/knowledge/synthesis/:category` | `server/routes/knowledge.mjs` | `/api/knowledge` (extended) | public | N | N |
| GET | `/api/knowledge/synthesis/:category/random` | `server/routes/knowledge.mjs` | `/api/knowledge` (extended) | public | N | N |
| GET | `/api/knowledge/virtues` | `server/routes/knowledge.mjs` | `/api/knowledge` (extended) | public | N | N |
| GET | `/api/knowledge/daily` | `server/routes/knowledge.mjs` | `/api/knowledge` (extended) | public | N | N |
| GET | `/api/knowledge/all` | `server/routes/knowledge.mjs` | `/api/knowledge` (extended) | public | N | N |
| GET | `/api/knowledge` | `server/routes/knowledge.mjs` | `/api/knowledge` (extended) | public | N | N |
| GET | `/api/wisdom/daily` | `server/routes/wisdom.mjs` | `/api/wisdom` (extended) | public | N | N |
| GET | `/api/wisdom/all` | `server/routes/wisdom.mjs` | `/api/wisdom` (extended) | public | N | N |
| GET | `/api/wisdom/random` | `server/routes/wisdom.mjs` | `/api/wisdom` (extended) | public | N | N |
| GET | `/api/wisdom/models` | `server/routes/wisdom.mjs` | `/api/wisdom` (extended) | public | N | N |
| GET | `/api/wisdom/models/:id` | `server/routes/wisdom.mjs` | `/api/wisdom` (extended) | public | N | N |
| GET | `/api/wisdom/models/category/:category` | `server/routes/wisdom.mjs` | `/api/wisdom` (extended) | public | N | N |
| GET | `/api/wisdom/systems` | `server/routes/wisdom.mjs` | `/api/wisdom` (extended) | public | N | N |
| GET | `/api/wisdom/systems/:id` | `server/routes/wisdom.mjs` | `/api/wisdom` (extended) | public | N | N |
| GET | `/api/wisdom/learning` | `server/routes/wisdom.mjs` | `/api/wisdom` (extended) | public | N | N |
| GET | `/api/wisdom/synthesis` | `server/routes/wisdom.mjs` | `/api/wisdom` (extended) | public | N | N |
| GET | `/api/wisdom` | `server/routes/wisdom.mjs` | `/api/wisdom` (extended) | public | N | N |
| GET | `/api/wisdom-engine/patterns` | `server/routes/wisdom-engine.mjs` | `/api/wisdom-engine` (extended) | optional | N | N |
| GET | `/api/wisdom-engine/patterns/:id` | `server/routes/wisdom-engine.mjs` | `/api/wisdom-engine` (extended) | optional | N | N |
| GET | `/api/wisdom-engine/traditions` | `server/routes/wisdom-engine.mjs` | `/api/wisdom-engine` (extended) | optional | N | N |
| GET | `/api/wisdom-engine/traditions/:id` | `server/routes/wisdom-engine.mjs` | `/api/wisdom-engine` (extended) | optional | N | N |
| GET | `/api/wisdom-engine/themes` | `server/routes/wisdom-engine.mjs` | `/api/wisdom-engine` (extended) | optional | N | N |
| GET | `/api/wisdom-engine/daily` | `server/routes/wisdom-engine.mjs` | `/api/wisdom-engine` (extended) | optional | N | N |
| POST | `/api/wisdom-engine/synthesize` | `server/routes/wisdom-engine.mjs` | `/api/wisdom-engine` (extended) | optional | N | N |
| GET | `/api/wisdom-engine/cross-tradition/:theme` | `server/routes/wisdom-engine.mjs` | `/api/wisdom-engine` (extended) | optional | N | N |
| GET | `/api/wisdom-engine` | `server/routes/wisdom-engine.mjs` | `/api/wisdom-engine` (extended) | optional | N | N |
| GET | `/api/wisdom-synthesis/patterns` | `server/routes/wisdom-synthesis.mjs` | `/api/wisdom-synthesis` (extended) | optional | N | N |
| GET | `/api/wisdom-synthesis/extraction` | `server/routes/wisdom-synthesis.mjs` | `/api/wisdom-synthesis` (extended) | optional | N | N |
| GET | `/api/wisdom-synthesis/themes` | `server/routes/wisdom-synthesis.mjs` | `/api/wisdom-synthesis` (extended) | optional | N | N |
| GET | `/api/wisdom-synthesis/integration` | `server/routes/wisdom-synthesis.mjs` | `/api/wisdom-synthesis` (extended) | optional | N | N |
| GET | `/api/wisdom-synthesis/daily` | `server/routes/wisdom-synthesis.mjs` | `/api/wisdom-synthesis` (extended) | optional | N | N |
| GET | `/api/wisdom-synthesis` | `server/routes/wisdom-synthesis.mjs` | `/api/wisdom-synthesis` (extended) | optional | N | N |
| GET | `/api/wisdom-traditions/traditions` | `server/routes/wisdom-traditions.mjs` | `/api/wisdom-traditions` (extended) | optional | N | N |
| GET | `/api/wisdom-traditions/perennial-truths` | `server/routes/wisdom-traditions.mjs` | `/api/wisdom-traditions` (extended) | optional | N | N |
| GET | `/api/wisdom-traditions/meditation-lineages` | `server/routes/wisdom-traditions.mjs` | `/api/wisdom-traditions` (extended) | optional | N | N |
| GET | `/api/wisdom-traditions/archetypes` | `server/routes/wisdom-traditions.mjs` | `/api/wisdom-traditions` (extended) | optional | N | N |
| GET | `/api/wisdom-traditions/all` | `server/routes/wisdom-traditions.mjs` | `/api/wisdom-traditions` (extended) | optional | N | N |
| GET | `/api/wisdom-traditions` | `server/routes/wisdom-traditions.mjs` | `/api/wisdom-traditions` (extended) | optional | N | N |
| GET | `/api/philosophy/schools` | `server/routes/philosophy.mjs` | `/api/philosophy` (extended) | optional | N | N |
| GET | `/api/philosophy/schools/:id` | `server/routes/philosophy.mjs` | `/api/philosophy` (extended) | optional | N | N |
| GET | `/api/philosophy/schools/search/:name` | `server/routes/philosophy.mjs` | `/api/philosophy` (extended) | optional | N | N |
| GET | `/api/philosophy/virtues` | `server/routes/philosophy.mjs` | `/api/philosophy` (extended) | optional | N | N |
| GET | `/api/philosophy/virtues/cardinal` | `server/routes/philosophy.mjs` | `/api/philosophy` (extended) | optional | N | N |
| GET | `/api/philosophy/virtues/strengths` | `server/routes/philosophy.mjs` | `/api/philosophy` (extended) | optional | N | N |
| GET | `/api/philosophy/questions` | `server/routes/philosophy.mjs` | `/api/philosophy` (extended) | optional | N | N |
| GET | `/api/philosophy/questions/:category` | `server/routes/philosophy.mjs` | `/api/philosophy` (extended) | optional | N | N |
| GET | `/api/philosophy/questions/:category/random` | `server/routes/philosophy.mjs` | `/api/philosophy` (extended) | optional | N | N |
| GET | `/api/philosophy/daily` | `server/routes/philosophy.mjs` | `/api/philosophy` (extended) | optional | N | N |
| GET | `/api/philosophy/all` | `server/routes/philosophy.mjs` | `/api/philosophy` (extended) | optional | N | N |
| GET | `/api/philosophy` | `server/routes/philosophy.mjs` | `/api/philosophy` (extended) | optional | N | N |
| GET | _(orphan — file not mounted)_ `/` | `server/routes/rss.mjs` | _(unmounted)_ | — | N | N |
| GET | `/api/feed/feed.xml` | `server/routes/feed.mjs` | `/api/feed` (extended) | optional | N | N |
| GET | `/api/feed/sitemap.xml` | `server/routes/feed.mjs` | `/api/feed` (extended) | optional | N | N |
| GET | `/api/feed/robots.txt` | `server/routes/feed.mjs` | `/api/feed` (extended) | optional | N | N |

### Cognitive & Personal Growth
| Method | Full Path | Source File | Mount | Auth | Safety-Critical | Has Tests |
|---|---|---|---|---|---|---|
| GET | `/api/cognitive-enhancement/memory-techniques` | `server/routes/cognitive-enhancement.mjs` | `/api/cognitive-enhancement` (extended) | optional | N | N |
| GET | `/api/cognitive-enhancement/focus-strategies` | `server/routes/cognitive-enhancement.mjs` | `/api/cognitive-enhancement` (extended) | optional | N | N |
| GET | `/api/cognitive-enhancement/learning-acceleration` | `server/routes/cognitive-enhancement.mjs` | `/api/cognitive-enhancement` (extended) | optional | N | N |
| GET | `/api/cognitive-enhancement/cognitive-biases` | `server/routes/cognitive-enhancement.mjs` | `/api/cognitive-enhancement` (extended) | optional | N | N |
| GET | `/api/cognitive-enhancement/brain-health` | `server/routes/cognitive-enhancement.mjs` | `/api/cognitive-enhancement` (extended) | optional | N | N |
| GET | `/api/cognitive-enhancement` | `server/routes/cognitive-enhancement.mjs` | `/api/cognitive-enhancement` (extended) | optional | N | N |
| GET | `/api/cognitive-lab/models` | `server/routes/cognitive-lab.mjs` | `/api/cognitive-lab` (extended) | optional | N | N |
| GET | `/api/cognitive-lab/tools` | `server/routes/cognitive-lab.mjs` | `/api/cognitive-lab` (extended) | optional | N | N |
| GET | `/api/cognitive-lab/biases` | `server/routes/cognitive-lab.mjs` | `/api/cognitive-lab` (extended) | optional | N | N |
| GET | `/api/cognitive-lab/reasoning` | `server/routes/cognitive-lab.mjs` | `/api/cognitive-lab` (extended) | optional | N | N |
| GET | `/api/cognitive-lab/daily` | `server/routes/cognitive-lab.mjs` | `/api/cognitive-lab` (extended) | optional | N | N |
| GET | `/api/cognitive-lab` | `server/routes/cognitive-lab.mjs` | `/api/cognitive-lab` (extended) | optional | N | N |
| GET | `/api/cognitive-mastery/frameworks` | `server/routes/cognitive-mastery.mjs` | `/api/cognitive-mastery` (extended) | optional | N | N |
| GET | `/api/cognitive-mastery/frameworks/:id` | `server/routes/cognitive-mastery.mjs` | `/api/cognitive-mastery` (extended) | optional | N | N |
| GET | `/api/cognitive-mastery/biases` | `server/routes/cognitive-mastery.mjs` | `/api/cognitive-mastery` (extended) | optional | N | N |
| GET | `/api/cognitive-mastery/categories` | `server/routes/cognitive-mastery.mjs` | `/api/cognitive-mastery` (extended) | optional | N | N |
| POST | `/api/cognitive-mastery/practice-session` | `server/routes/cognitive-mastery.mjs` | `/api/cognitive-mastery` (extended) | optional | N | N |
| GET | `/api/cognitive-mastery` | `server/routes/cognitive-mastery.mjs` | `/api/cognitive-mastery` (extended) | optional | N | N |
| GET | `/api/deep-learning/strategies` | `server/routes/deep-learning.mjs` | `/api/deep-learning` (extended) | optional | N | N |
| GET | `/api/deep-learning/strategies/:id` | `server/routes/deep-learning.mjs` | `/api/deep-learning` (extended) | optional | N | N |
| GET | `/api/deep-learning/archetypes` | `server/routes/deep-learning.mjs` | `/api/deep-learning` (extended) | optional | N | N |
| GET | `/api/deep-learning/archetypes/:id` | `server/routes/deep-learning.mjs` | `/api/deep-learning` (extended) | optional | N | N |
| GET | `/api/deep-learning/cognitive-load` | `server/routes/deep-learning.mjs` | `/api/deep-learning` (extended) | optional | N | N |
| GET | `/api/deep-learning/daily-learning` | `server/routes/deep-learning.mjs` | `/api/deep-learning` (extended) | optional | N | N |
| GET | `/api/deep-learning` | `server/routes/deep-learning.mjs` | `/api/deep-learning` (extended) | optional | N | N |
| GET | `/api/creativity/techniques` | `server/routes/creativity.mjs` | `/api/creativity` (extended) | optional | N | N |
| GET | `/api/creativity/framing` | `server/routes/creativity.mjs` | `/api/creativity` (extended) | optional | N | N |
| GET | `/api/creativity/principles` | `server/routes/creativity.mjs` | `/api/creativity` (extended) | optional | N | N |
| GET | `/api/creativity/blocks` | `server/routes/creativity.mjs` | `/api/creativity` (extended) | optional | N | N |
| GET | `/api/creativity/daily` | `server/routes/creativity.mjs` | `/api/creativity` (extended) | optional | N | N |
| GET | `/api/creativity` | `server/routes/creativity.mjs` | `/api/creativity` (extended) | optional | N | N |
| GET | `/api/dialectics/methods` | `server/routes/dialectics.mjs` | `/api/dialectics` (extended) | optional | N | N |
| GET | `/api/dialectics/methods/:id` | `server/routes/dialectics.mjs` | `/api/dialectics` (extended) | optional | N | N |
| GET | `/api/dialectics/epistemology` | `server/routes/dialectics.mjs` | `/api/dialectics` (extended) | optional | N | N |
| GET | `/api/dialectics/epistemology/:id` | `server/routes/dialectics.mjs` | `/api/dialectics` (extended) | optional | N | N |
| GET | `/api/dialectics/decisions` | `server/routes/dialectics.mjs` | `/api/dialectics` (extended) | optional | N | N |
| GET | `/api/dialectics/decisions/:id` | `server/routes/dialectics.mjs` | `/api/dialectics` (extended) | optional | N | N |
| GET | `/api/dialectics/prompts` | `server/routes/dialectics.mjs` | `/api/dialectics` (extended) | optional | N | N |
| GET | `/api/dialectics/prompts/:category` | `server/routes/dialectics.mjs` | `/api/dialectics` (extended) | optional | N | N |
| GET | `/api/dialectics/prompts/:category/random` | `server/routes/dialectics.mjs` | `/api/dialectics` (extended) | optional | N | N |
| GET | `/api/dialectics/biases` | `server/routes/dialectics.mjs` | `/api/dialectics` (extended) | optional | N | N |
| GET | `/api/dialectics/daily` | `server/routes/dialectics.mjs` | `/api/dialectics` (extended) | optional | N | N |
| GET | `/api/dialectics/synthesis` | `server/routes/dialectics.mjs` | `/api/dialectics` (extended) | optional | N | N |
| GET | `/api/dialectics` | `server/routes/dialectics.mjs` | `/api/dialectics` (extended) | optional | N | N |
| GET | `/api/ethical-reasoning/frameworks` | `server/routes/ethical-reasoning.mjs` | `/api/ethical-reasoning` (extended) | optional | N | N |
| GET | `/api/ethical-reasoning/tools` | `server/routes/ethical-reasoning.mjs` | `/api/ethical-reasoning` (extended) | optional | N | N |
| GET | `/api/ethical-reasoning/dilemmas` | `server/routes/ethical-reasoning.mjs` | `/api/ethical-reasoning` (extended) | optional | N | N |
| GET | `/api/ethical-reasoning/process` | `server/routes/ethical-reasoning.mjs` | `/api/ethical-reasoning` (extended) | optional | N | N |
| GET | `/api/ethical-reasoning/daily` | `server/routes/ethical-reasoning.mjs` | `/api/ethical-reasoning` (extended) | optional | N | N |
| GET | `/api/ethical-reasoning` | `server/routes/ethical-reasoning.mjs` | `/api/ethical-reasoning` (extended) | optional | N | N |
| GET | `/api/existential/themes` | `server/routes/existential.mjs` | `/api/existential` (extended) | optional | N | N |
| GET | `/api/existential/philosophers` | `server/routes/existential.mjs` | `/api/existential` (extended) | optional | N | N |
| GET | `/api/existential/questions` | `server/routes/existential.mjs` | `/api/existential` (extended) | optional | N | N |
| GET | `/api/existential/meaning` | `server/routes/existential.mjs` | `/api/existential` (extended) | optional | N | N |
| GET | `/api/existential/daily` | `server/routes/existential.mjs` | `/api/existential` (extended) | optional | N | N |
| GET | `/api/existential` | `server/routes/existential.mjs` | `/api/existential` (extended) | optional | N | N |
| GET | `/api/contemplative/meditation` | `server/routes/contemplative.mjs` | `/api/contemplative` (extended) | optional | N | N |
| GET | `/api/contemplative/inquiry` | `server/routes/contemplative.mjs` | `/api/contemplative` (extended) | optional | N | N |
| GET | `/api/contemplative/mindfulness` | `server/routes/contemplative.mjs` | `/api/contemplative` (extended) | optional | N | N |
| GET | `/api/contemplative/traditions` | `server/routes/contemplative.mjs` | `/api/contemplative` (extended) | optional | N | N |
| GET | `/api/contemplative/daily` | `server/routes/contemplative.mjs` | `/api/contemplative` (extended) | optional | N | N |
| GET | `/api/contemplative` | `server/routes/contemplative.mjs` | `/api/contemplative` (extended) | optional | N | N |
| GET | `/api/praxis/resistance` | `server/routes/praxis.mjs` | `/api/praxis` (extended) | optional | N | N |
| GET | `/api/praxis/execution` | `server/routes/praxis.mjs` | `/api/praxis` (extended) | optional | N | N |
| GET | `/api/praxis/daily` | `server/routes/praxis.mjs` | `/api/praxis` (extended) | optional | N | N |
| GET | `/api/praxis` | `server/routes/praxis.mjs` | `/api/praxis` (extended) | optional | N | N |
| GET | `/api/resilience/factors` | `server/routes/resilience.mjs` | `/api/resilience` (extended) | optional | N | N |
| GET | `/api/resilience/coping` | `server/routes/resilience.mjs` | `/api/resilience` (extended) | optional | N | N |
| GET | `/api/resilience/growth` | `server/routes/resilience.mjs` | `/api/resilience` (extended) | optional | N | N |
| GET | `/api/resilience/inoculation` | `server/routes/resilience.mjs` | `/api/resilience` (extended) | optional | N | N |
| GET | `/api/resilience/flexibility` | `server/routes/resilience.mjs` | `/api/resilience` (extended) | optional | N | N |
| GET | `/api/resilience/daily` | `server/routes/resilience.mjs` | `/api/resilience` (extended) | optional | N | N |
| GET | `/api/resilience` | `server/routes/resilience.mjs` | `/api/resilience` (extended) | optional | N | N |
| GET | `/api/emotional-mastery/families` | `server/routes/emotional-mastery.mjs` | `/api/emotional-mastery` (extended) | optional | N | N |
| GET | `/api/emotional-mastery/families/:id` | `server/routes/emotional-mastery.mjs` | `/api/emotional-mastery` (extended) | optional | N | N |
| GET | `/api/emotional-mastery/competencies` | `server/routes/emotional-mastery.mjs` | `/api/emotional-mastery` (extended) | optional | N | N |
| GET | `/api/emotional-mastery/competencies/:id` | `server/routes/emotional-mastery.mjs` | `/api/emotional-mastery` (extended) | optional | N | N |
| GET | `/api/emotional-mastery/regulation` | `server/routes/emotional-mastery.mjs` | `/api/emotional-mastery` (extended) | optional | N | N |
| GET | `/api/emotional-mastery/daily-eq` | `server/routes/emotional-mastery.mjs` | `/api/emotional-mastery` (extended) | optional | N | N |
| GET | `/api/emotional-mastery` | `server/routes/emotional-mastery.mjs` | `/api/emotional-mastery` (extended) | optional | N | N |
| GET | `/api/emotional-resilience/stress-management` | `server/routes/emotional-resilience.mjs` | `/api/emotional-resilience` (extended) | optional | N | N |
| GET | `/api/emotional-resilience/emotional-agility` | `server/routes/emotional-resilience.mjs` | `/api/emotional-resilience` (extended) | optional | N | N |
| GET | `/api/emotional-resilience/inner-strength` | `server/routes/emotional-resilience.mjs` | `/api/emotional-resilience` (extended) | optional | N | N |
| GET | `/api/emotional-resilience/regulation-strategies` | `server/routes/emotional-resilience.mjs` | `/api/emotional-resilience` (extended) | optional | N | N |
| GET | `/api/emotional-resilience/resilience-quotient` | `server/routes/emotional-resilience.mjs` | `/api/emotional-resilience` (extended) | optional | N | N |
| GET | `/api/emotional-resilience` | `server/routes/emotional-resilience.mjs` | `/api/emotional-resilience` (extended) | optional | N | N |
| GET | `/api/human-potential/flow-triggers` | `server/routes/human-potential.mjs` | `/api/human-potential` (extended) | optional | N | N |
| GET | `/api/human-potential/peak-experiences` | `server/routes/human-potential.mjs` | `/api/human-potential` (extended) | optional | N | N |
| GET | `/api/human-potential/capacities` | `server/routes/human-potential.mjs` | `/api/human-potential` (extended) | optional | N | N |
| GET | `/api/human-potential/growth-mindset` | `server/routes/human-potential.mjs` | `/api/human-potential` (extended) | optional | N | N |
| GET | `/api/human-potential/self-actualization` | `server/routes/human-potential.mjs` | `/api/human-potential` (extended) | optional | N | N |
| GET | `/api/human-potential/all` | `server/routes/human-potential.mjs` | `/api/human-potential` (extended) | optional | N | N |
| GET | `/api/human-potential` | `server/routes/human-potential.mjs` | `/api/human-potential` (extended) | optional | N | N |
| GET | `/api/personal-growth/self-improvement` | `server/routes/personal-growth.mjs` | `/api/personal-growth` (extended) | optional | N | N |
| GET | `/api/personal-growth/character-development` | `server/routes/personal-growth.mjs` | `/api/personal-growth` (extended) | optional | N | N |
| GET | `/api/personal-growth/growth-mindset` | `server/routes/personal-growth.mjs` | `/api/personal-growth` (extended) | optional | N | N |
| GET | `/api/personal-growth/self-discipline` | `server/routes/personal-growth.mjs` | `/api/personal-growth` (extended) | optional | N | N |
| GET | `/api/personal-growth/life-stages` | `server/routes/personal-growth.mjs` | `/api/personal-growth` (extended) | optional | N | N |
| GET | `/api/personal-growth/daily` | `server/routes/personal-growth.mjs` | `/api/personal-growth` (extended) | optional | N | N |
| GET | `/api/personal-growth` | `server/routes/personal-growth.mjs` | `/api/personal-growth` (extended) | optional | N | N |
| GET | `/api/spiritual-intelligence/practices` | `server/routes/spiritual-intelligence.mjs` | `/api/spiritual-intelligence` (extended) | optional | N | N |
| GET | `/api/spiritual-intelligence/development` | `server/routes/spiritual-intelligence.mjs` | `/api/spiritual-intelligence` (extended) | optional | N | N |
| GET | `/api/spiritual-intelligence/wisdom` | `server/routes/spiritual-intelligence.mjs` | `/api/spiritual-intelligence` (extended) | optional | N | N |
| GET | `/api/spiritual-intelligence/domains` | `server/routes/spiritual-intelligence.mjs` | `/api/spiritual-intelligence` (extended) | optional | N | N |
| POST | `/api/spiritual-intelligence/practice-recommendation` | `server/routes/spiritual-intelligence.mjs` | `/api/spiritual-intelligence` (extended) | optional | N | N |
| GET | `/api/spiritual-intelligence/random-teaching` | `server/routes/spiritual-intelligence.mjs` | `/api/spiritual-intelligence` (extended) | optional | N | N |
| GET | `/api/spiritual-intelligence` | `server/routes/spiritual-intelligence.mjs` | `/api/spiritual-intelligence` (extended) | optional | N | N |
| GET | `/api/collective-intelligence/principles` | `server/routes/collective-intelligence.mjs` | `/api/collective-intelligence` (extended) | optional | N | N |
| GET | `/api/collective-intelligence/synthesis` | `server/routes/collective-intelligence.mjs` | `/api/collective-intelligence` (extended) | optional | N | N |
| GET | `/api/collective-intelligence/crowd-wisdom` | `server/routes/collective-intelligence.mjs` | `/api/collective-intelligence` (extended) | optional | N | N |
| GET | `/api/collective-intelligence/frameworks` | `server/routes/collective-intelligence.mjs` | `/api/collective-intelligence` (extended) | optional | N | N |
| GET | `/api/collective-intelligence/emergence` | `server/routes/collective-intelligence.mjs` | `/api/collective-intelligence` (extended) | optional | N | N |
| GET | `/api/collective-intelligence/daily` | `server/routes/collective-intelligence.mjs` | `/api/collective-intelligence` (extended) | optional | N | N |
| GET | `/api/collective-intelligence` | `server/routes/collective-intelligence.mjs` | `/api/collective-intelligence` (extended) | optional | N | N |
| GET | `/api/foresight/scenarios` | `server/routes/foresight.mjs` | `/api/foresight` (extended) | optional | N | N |
| GET | `/api/foresight/ethics` | `server/routes/foresight.mjs` | `/api/foresight` (extended) | optional | N | N |
| GET | `/api/foresight/wheel` | `server/routes/foresight.mjs` | `/api/foresight` (extended) | optional | N | N |
| GET | `/api/foresight/signals` | `server/routes/foresight.mjs` | `/api/foresight` (extended) | optional | N | N |
| GET | `/api/foresight/literacy` | `server/routes/foresight.mjs` | `/api/foresight` (extended) | optional | N | N |
| GET | `/api/foresight/daily` | `server/routes/foresight.mjs` | `/api/foresight` (extended) | optional | N | N |
| GET | `/api/foresight` | `server/routes/foresight.mjs` | `/api/foresight` (extended) | optional | N | N |
| GET | `/api/life-design/domains` | `server/routes/life-design.mjs` | `/api/life-design` (extended) | optional | N | N |
| GET | `/api/life-design/frameworks` | `server/routes/life-design.mjs` | `/api/life-design` (extended) | optional | N | N |
| GET | `/api/life-design/goal-systems` | `server/routes/life-design.mjs` | `/api/life-design` (extended) | optional | N | N |
| GET | `/api/life-design/decision-making` | `server/routes/life-design.mjs` | `/api/life-design` (extended) | optional | N | N |
| GET | `/api/life-design/all` | `server/routes/life-design.mjs` | `/api/life-design` (extended) | optional | N | N |
| GET | `/api/life-design` | `server/routes/life-design.mjs` | `/api/life-design` (extended) | optional | N | N |
| GET | `/api/life-purpose/ikigai` | `server/routes/life-purpose.mjs` | `/api/life-purpose` (extended) | optional | N | N |
| GET | `/api/life-purpose/values-discovery` | `server/routes/life-purpose.mjs` | `/api/life-purpose` (extended) | optional | N | N |
| GET | `/api/life-purpose/mission-crafting` | `server/routes/life-purpose.mjs` | `/api/life-purpose` (extended) | optional | N | N |
| GET | `/api/life-purpose/purpose-frameworks` | `server/routes/life-purpose.mjs` | `/api/life-purpose` (extended) | optional | N | N |
| GET | `/api/life-purpose/meaning-sources` | `server/routes/life-purpose.mjs` | `/api/life-purpose` (extended) | optional | N | N |
| GET | `/api/life-purpose/purpose-assessment` | `server/routes/life-purpose.mjs` | `/api/life-purpose` (extended) | optional | N | N |
| GET | `/api/life-purpose` | `server/routes/life-purpose.mjs` | `/api/life-purpose` (extended) | optional | N | N |
| GET | `/api/purpose-compass/frameworks` | `server/routes/purpose-compass.mjs` | `/api/purpose-compass` (extended) | optional | N | N |
| GET | `/api/purpose-compass/frameworks/:id` | `server/routes/purpose-compass.mjs` | `/api/purpose-compass` (extended) | optional | N | N |
| GET | `/api/purpose-compass/exercises` | `server/routes/purpose-compass.mjs` | `/api/purpose-compass` (extended) | optional | N | N |
| GET | `/api/purpose-compass/exercises/:id` | `server/routes/purpose-compass.mjs` | `/api/purpose-compass` (extended) | optional | N | N |
| GET | `/api/purpose-compass/meaning-dimensions` | `server/routes/purpose-compass.mjs` | `/api/purpose-compass` (extended) | optional | N | N |
| GET | `/api/purpose-compass/daily-purpose` | `server/routes/purpose-compass.mjs` | `/api/purpose-compass` (extended) | optional | N | N |
| GET | `/api/purpose-compass` | `server/routes/purpose-compass.mjs` | `/api/purpose-compass` (extended) | optional | N | N |
| GET | `/api/meaning/future-self/prompts` | `server/routes/meaning.mjs` | `/api/meaning` (extended) | optional | N | N |
| GET | `/api/meaning/life-chapters` | `server/routes/meaning.mjs` | `/api/meaning` (extended) | optional | N | N |
| GET | `/api/meaning/gratitude/daily` | `server/routes/meaning.mjs` | `/api/meaning` (extended) | optional | N | N |
| GET | `/api/meaning/contribution-map` | `server/routes/meaning.mjs` | `/api/meaning` (extended) | optional | N | N |
| GET | `/api/meaning/brave-action` | `server/routes/meaning.mjs` | `/api/meaning` (extended) | optional | N | N |
| GET | `/api/meaning` | `server/routes/meaning.mjs` | `/api/meaning` (extended) | optional | N | N |
| GET | _(orphan — file not mounted)_ `/future-self/prompts` | `server/routes/meaning-future.mjs` | _(unmounted)_ | — | N | N |
| POST | _(orphan — file not mounted)_ `/future-self/letter` | `server/routes/meaning-future.mjs` | _(unmounted)_ | — | N | N |
| GET | _(orphan — file not mounted)_ `/life-chapters` | `server/routes/meaning-future.mjs` | _(unmounted)_ | — | N | N |
| GET | _(orphan — file not mounted)_ `/life-chapters/:chapter` | `server/routes/meaning-future.mjs` | _(unmounted)_ | — | N | N |
| GET | _(orphan — file not mounted)_ `/gratitude` | `server/routes/meaning-future.mjs` | _(unmounted)_ | — | N | N |
| GET | _(orphan — file not mounted)_ `/gratitude/daily` | `server/routes/meaning-future.mjs` | _(unmounted)_ | — | N | N |
| GET | _(orphan — file not mounted)_ `/contribution-map` | `server/routes/meaning-future.mjs` | _(unmounted)_ | — | N | N |
| GET | _(orphan — file not mounted)_ `/brave-action` | `server/routes/meaning-future.mjs` | _(unmounted)_ | — | N | N |
| POST | _(orphan — file not mounted)_ `/brave-action/plan` | `server/routes/meaning-future.mjs` | _(unmounted)_ | — | N | N |
| GET | _(orphan — file not mounted)_ `/` | `server/routes/meaning-future.mjs` | _(unmounted)_ | — | N | N |
| GET | `/api/values/core` | `server/routes/values.mjs` | `/api/values` (extended) | optional | N | N |
| GET | `/api/values/exercises` | `server/routes/values.mjs` | `/api/values` (extended) | optional | N | N |
| GET | `/api/values/purpose` | `server/routes/values.mjs` | `/api/values` (extended) | optional | N | N |
| GET | `/api/values/meaning` | `server/routes/values.mjs` | `/api/values` (extended) | optional | N | N |
| GET | `/api/values/daily` | `server/routes/values.mjs` | `/api/values` (extended) | optional | N | N |
| GET | `/api/values` | `server/routes/values.mjs` | `/api/values` (extended) | optional | N | N |
| GET | `/api/metacognition/strategies` | `server/routes/metacognition.mjs` | `/api/metacognition` (extended) | optional | N | N |
| GET | `/api/metacognition/biases` | `server/routes/metacognition.mjs` | `/api/metacognition` (extended) | optional | N | N |
| GET | `/api/metacognition/reflection` | `server/routes/metacognition.mjs` | `/api/metacognition` (extended) | optional | N | N |
| GET | `/api/metacognition/self-awareness` | `server/routes/metacognition.mjs` | `/api/metacognition` (extended) | optional | N | N |
| GET | `/api/metacognition/daily` | `server/routes/metacognition.mjs` | `/api/metacognition` (extended) | optional | N | N |
| GET | `/api/metacognition` | `server/routes/metacognition.mjs` | `/api/metacognition` (extended) | optional | N | N |
| GET | `/api/self-mastery/disciplines` | `server/routes/self-mastery.mjs` | `/api/self-mastery` (extended) | optional | N | N |
| GET | `/api/self-mastery/disciplines/:id` | `server/routes/self-mastery.mjs` | `/api/self-mastery` (extended) | optional | N | N |
| GET | `/api/self-mastery/archetypes` | `server/routes/self-mastery.mjs` | `/api/self-mastery` (extended) | optional | N | N |
| GET | `/api/self-mastery/archetypes/:id` | `server/routes/self-mastery.mjs` | `/api/self-mastery` (extended) | optional | N | N |
| GET | `/api/self-mastery/principles` | `server/routes/self-mastery.mjs` | `/api/self-mastery` (extended) | optional | N | N |
| GET | `/api/self-mastery/daily-focus` | `server/routes/self-mastery.mjs` | `/api/self-mastery` (extended) | optional | N | N |
| GET | `/api/self-mastery` | `server/routes/self-mastery.mjs` | `/api/self-mastery` (extended) | optional | N | N |
| GET | `/api/self-mastery-intelligence/discipline` | `server/routes/self-mastery-intelligence.mjs` | `/api/self-mastery-intelligence` (extended) | optional | N | N |
| GET | `/api/self-mastery-intelligence/emotional-intelligence` | `server/routes/self-mastery-intelligence.mjs` | `/api/self-mastery-intelligence` (extended) | optional | N | N |
| GET | `/api/self-mastery-intelligence/mindset` | `server/routes/self-mastery-intelligence.mjs` | `/api/self-mastery-intelligence` (extended) | optional | N | N |
| GET | `/api/self-mastery-intelligence/personal-power` | `server/routes/self-mastery-intelligence.mjs` | `/api/self-mastery-intelligence` (extended) | optional | N | N |
| GET | `/api/self-mastery-intelligence/excellence` | `server/routes/self-mastery-intelligence.mjs` | `/api/self-mastery-intelligence` (extended) | optional | N | N |
| GET | `/api/self-mastery-intelligence/all` | `server/routes/self-mastery-intelligence.mjs` | `/api/self-mastery-intelligence` (extended) | optional | N | N |
| GET | `/api/self-mastery-intelligence` | `server/routes/self-mastery-intelligence.mjs` | `/api/self-mastery-intelligence` (extended) | optional | N | N |
| GET | `/api/mastery-excellence/peak-performance` | `server/routes/mastery-excellence.mjs` | `/api/mastery-excellence` (extended) | optional | N | N |
| GET | `/api/mastery-excellence/habit-mastery` | `server/routes/mastery-excellence.mjs` | `/api/mastery-excellence` (extended) | optional | N | N |
| GET | `/api/mastery-excellence/discipline` | `server/routes/mastery-excellence.mjs` | `/api/mastery-excellence` (extended) | optional | N | N |
| GET | `/api/mastery-excellence/mental-models` | `server/routes/mastery-excellence.mjs` | `/api/mastery-excellence` (extended) | optional | N | N |
| GET | `/api/mastery-excellence/focus` | `server/routes/mastery-excellence.mjs` | `/api/mastery-excellence` (extended) | optional | N | N |
| GET | `/api/mastery-excellence/all` | `server/routes/mastery-excellence.mjs` | `/api/mastery-excellence` (extended) | optional | N | N |
| GET | `/api/mastery-excellence` | `server/routes/mastery-excellence.mjs` | `/api/mastery-excellence` (extended) | optional | N | N |
| GET | `/api/peak-performance/flow-states` | `server/routes/peak-performance.mjs` | `/api/peak-performance` (extended) | optional | N | N |
| GET | `/api/peak-performance/mental-models` | `server/routes/peak-performance.mjs` | `/api/peak-performance` (extended) | optional | N | N |
| GET | `/api/peak-performance/goal-systems` | `server/routes/peak-performance.mjs` | `/api/peak-performance` (extended) | optional | N | N |
| GET | `/api/peak-performance/energy-management` | `server/routes/peak-performance.mjs` | `/api/peak-performance` (extended) | optional | N | N |
| GET | `/api/peak-performance/habits` | `server/routes/peak-performance.mjs` | `/api/peak-performance` (extended) | optional | N | N |
| GET | `/api/peak-performance/productivity` | `server/routes/peak-performance.mjs` | `/api/peak-performance` (extended) | optional | N | N |
| GET | `/api/peak-performance/daily` | `server/routes/peak-performance.mjs` | `/api/peak-performance` (extended) | optional | N | N |
| GET | `/api/peak-performance` | `server/routes/peak-performance.mjs` | `/api/peak-performance` (extended) | optional | N | N |
| GET | `/api/transformation/stages` | `server/routes/transformation-engine.mjs` | `/api/transformation` (extended) | optional | N | N |
| GET | `/api/transformation/stages/:id` | `server/routes/transformation-engine.mjs` | `/api/transformation` (extended) | optional | N | N |
| GET | `/api/transformation/modalities` | `server/routes/transformation-engine.mjs` | `/api/transformation` (extended) | optional | N | N |
| GET | `/api/transformation/modalities/:id` | `server/routes/transformation-engine.mjs` | `/api/transformation` (extended) | optional | N | N |
| GET | `/api/transformation/shadow-archetypes` | `server/routes/transformation-engine.mjs` | `/api/transformation` (extended) | optional | N | N |
| GET | `/api/transformation/shadow-archetypes/:id` | `server/routes/transformation-engine.mjs` | `/api/transformation` (extended) | optional | N | N |
| GET | `/api/transformation/daily-transformation` | `server/routes/transformation-engine.mjs` | `/api/transformation` (extended) | optional | N | N |
| GET | `/api/transformation` | `server/routes/transformation-engine.mjs` | `/api/transformation` (extended) | optional | N | N |
| GET | `/api/consciousness/brave-action` | `server/routes/consciousness-expansion.mjs` | `/api/consciousness` (extended) | optional | N | N |
| GET | `/api/consciousness/contribution-map` | `server/routes/consciousness-expansion.mjs` | `/api/consciousness` (extended) | optional | N | N |
| GET | `/api/consciousness/gratitude/daily` | `server/routes/consciousness-expansion.mjs` | `/api/consciousness` (extended) | optional | N | N |
| GET | `/api/consciousness/future-self/prompts` | `server/routes/consciousness-expansion.mjs` | `/api/consciousness` (extended) | optional | N | N |
| GET | `/api/consciousness/life-chapters` | `server/routes/consciousness-expansion.mjs` | `/api/consciousness` (extended) | optional | N | N |
| GET | `/api/consciousness` | `server/routes/consciousness-expansion.mjs` | `/api/consciousness` (extended) | optional | N | N |
| GET | `/api/wisdom/daily` | `server/routes/wisdom.mjs` | `/api/wisdom` (extended) | public | N | N |
| GET | `/api/wisdom/all` | `server/routes/wisdom.mjs` | `/api/wisdom` (extended) | public | N | N |
| GET | `/api/wisdom/random` | `server/routes/wisdom.mjs` | `/api/wisdom` (extended) | public | N | N |
| GET | `/api/wisdom/models` | `server/routes/wisdom.mjs` | `/api/wisdom` (extended) | public | N | N |
| GET | `/api/wisdom/models/:id` | `server/routes/wisdom.mjs` | `/api/wisdom` (extended) | public | N | N |
| GET | `/api/wisdom/models/category/:category` | `server/routes/wisdom.mjs` | `/api/wisdom` (extended) | public | N | N |
| GET | `/api/wisdom/systems` | `server/routes/wisdom.mjs` | `/api/wisdom` (extended) | public | N | N |
| GET | `/api/wisdom/systems/:id` | `server/routes/wisdom.mjs` | `/api/wisdom` (extended) | public | N | N |
| GET | `/api/wisdom/learning` | `server/routes/wisdom.mjs` | `/api/wisdom` (extended) | public | N | N |
| GET | `/api/wisdom/synthesis` | `server/routes/wisdom.mjs` | `/api/wisdom` (extended) | public | N | N |
| GET | `/api/wisdom` | `server/routes/wisdom.mjs` | `/api/wisdom` (extended) | public | N | N |
| GET | `/api/psychological-safety/inner-security` | `server/routes/psychological-safety.mjs` | `/api/psychological-safety` (extended) | optional | N | N |
| GET | `/api/psychological-safety/safety-signals` | `server/routes/psychological-safety.mjs` | `/api/psychological-safety` (extended) | optional | N | N |
| GET | `/api/psychological-safety/resilience-factors` | `server/routes/psychological-safety.mjs` | `/api/psychological-safety` (extended) | optional | N | N |
| GET | `/api/psychological-safety/trauma-informed-care` | `server/routes/psychological-safety.mjs` | `/api/psychological-safety` (extended) | optional | N | N |
| GET | `/api/psychological-safety/grounding-techniques` | `server/routes/psychological-safety.mjs` | `/api/psychological-safety` (extended) | optional | N | N |
| GET | `/api/psychological-safety/daily` | `server/routes/psychological-safety.mjs` | `/api/psychological-safety` (extended) | optional | N | N |
| GET | `/api/psychological-safety` | `server/routes/psychological-safety.mjs` | `/api/psychological-safety` (extended) | optional | N | N |
| GET | `/api/social-intelligence/emotional-literacy` | `server/routes/social-intelligence.mjs` | `/api/social-intelligence` (extended) | optional | N | N |
| GET | `/api/social-intelligence/empathy-development` | `server/routes/social-intelligence.mjs` | `/api/social-intelligence` (extended) | optional | N | N |
| GET | `/api/social-intelligence/communication-mastery` | `server/routes/social-intelligence.mjs` | `/api/social-intelligence` (extended) | optional | N | N |
| GET | `/api/social-intelligence/social-dynamics` | `server/routes/social-intelligence.mjs` | `/api/social-intelligence` (extended) | optional | N | N |
| GET | `/api/social-intelligence/conflict-resolution` | `server/routes/social-intelligence.mjs` | `/api/social-intelligence` (extended) | optional | N | N |
| GET | `/api/social-intelligence/boundary-setting` | `server/routes/social-intelligence.mjs` | `/api/social-intelligence` (extended) | optional | N | N |
| GET | `/api/social-intelligence/daily` | `server/routes/social-intelligence.mjs` | `/api/social-intelligence` (extended) | optional | N | N |
| GET | `/api/social-intelligence` | `server/routes/social-intelligence.mjs` | `/api/social-intelligence` (extended) | optional | N | N |
| GET | `/api/socio-ecology/daily` | `server/routes/socio-ecology.mjs` | `/api/socio-ecology` (extended) | optional | N | N |
| GET | `/api/socio-ecology/planetary-ethics` | `server/routes/socio-ecology.mjs` | `/api/socio-ecology` (extended) | optional | N | N |
| GET | `/api/socio-ecology/regenerative` | `server/routes/socio-ecology.mjs` | `/api/socio-ecology` (extended) | optional | N | N |
| GET | `/api/socio-ecology` | `server/routes/socio-ecology.mjs` | `/api/socio-ecology` (extended) | optional | N | N |
| GET | `/api/systems-compassion/frameworks` | `server/routes/systems-compassion.mjs` | `/api/systems-compassion` (extended) | optional | N | N |
| GET | `/api/systems-compassion/interventions` | `server/routes/systems-compassion.mjs` | `/api/systems-compassion` (extended) | optional | N | N |
| GET | `/api/systems-compassion/narratives` | `server/routes/systems-compassion.mjs` | `/api/systems-compassion` (extended) | optional | N | N |
| GET | `/api/systems-compassion/scales` | `server/routes/systems-compassion.mjs` | `/api/systems-compassion` (extended) | optional | N | N |
| GET | `/api/systems-compassion/practices` | `server/routes/systems-compassion.mjs` | `/api/systems-compassion` (extended) | optional | N | N |
| GET | `/api/systems-compassion/daily` | `server/routes/systems-compassion.mjs` | `/api/systems-compassion` (extended) | optional | N | N |
| GET | `/api/systems-compassion` | `server/routes/systems-compassion.mjs` | `/api/systems-compassion` (extended) | optional | N | N |
| GET | `/api/relational/attachment` | `server/routes/relational.mjs` | `/api/relational` (extended) | optional | N | N |
| GET | `/api/relational/communication` | `server/routes/relational.mjs` | `/api/relational` (extended) | optional | N | N |
| GET | `/api/relational/patterns` | `server/routes/relational.mjs` | `/api/relational` (extended) | optional | N | N |
| GET | `/api/relational/love-languages` | `server/routes/relational.mjs` | `/api/relational` (extended) | optional | N | N |
| GET | `/api/relational/daily` | `server/routes/relational.mjs` | `/api/relational` (extended) | optional | N | N |
| GET | `/api/relational` | `server/routes/relational.mjs` | `/api/relational` (extended) | optional | N | N |
| GET | `/api/relationship-dynamics/attachment-styles` | `server/routes/relationship-dynamics.mjs` | `/api/relationship-dynamics` (extended) | optional | N | N |
| GET | `/api/relationship-dynamics/love-languages` | `server/routes/relationship-dynamics.mjs` | `/api/relationship-dynamics` (extended) | optional | N | N |
| GET | `/api/relationship-dynamics/four-horsemen` | `server/routes/relationship-dynamics.mjs` | `/api/relationship-dynamics` (extended) | optional | N | N |
| GET | `/api/relationship-dynamics/healthy-patterns` | `server/routes/relationship-dynamics.mjs` | `/api/relationship-dynamics` (extended) | optional | N | N |
| GET | `/api/relationship-dynamics/conflict-styles` | `server/routes/relationship-dynamics.mjs` | `/api/relationship-dynamics` (extended) | optional | N | N |
| POST | `/api/relationship-dynamics/analyze-pattern` | `server/routes/relationship-dynamics.mjs` | `/api/relationship-dynamics` (extended) | optional | N | N |
| GET | `/api/relationship-dynamics/repair-strategies` | `server/routes/relationship-dynamics.mjs` | `/api/relationship-dynamics` (extended) | optional | N | N |
| GET | `/api/relationship-dynamics` | `server/routes/relationship-dynamics.mjs` | `/api/relationship-dynamics` (extended) | optional | N | N |

### Billing & Revenue
| Method | Full Path | Source File | Mount | Auth | Safety-Critical | Has Tests |
|---|---|---|---|---|---|---|
| GET | `/api/billing/plans` | `server/routes/billing.mjs` | `/api/billing` (extended) | optional | Y | N |
| POST | `/api/billing/pricing-view` | `server/routes/billing.mjs` | `/api/billing` (extended) | optional | Y | N |
| GET | `/api/billing` | `server/routes/billing.mjs` | `/api/billing` (extended) | optional | Y | N |
| POST | `/api/billing/checkout` | `server/routes/billing.mjs` | `/api/billing` (extended) | optional | Y | N |
| POST | `/api/billing/portal` | `server/routes/billing.mjs` | `/api/billing` (extended) | optional | Y | N |
| GET | `/api/billing/subscription-status` | `server/routes/billing.mjs` | `/api/billing` (extended) | optional | Y | N |
| GET | `/api/billing/current-plan` | `server/routes/billing.mjs` | `/api/billing` (extended) | optional | Y | N |
| GET | `/api/billing/invoices` | `server/routes/billing.mjs` | `/api/billing` (extended) | optional | Y | N |
| GET | `/api/revenue/summary` | `server/routes/revenue.mjs` | `/api/revenue` (extended) | required | Y | N |
| GET | `/api/revenue/intelligence` | `server/routes/revenue.mjs` | `/api/revenue` (extended) | required | Y | N |
| GET | `/api/revenue/recommendations` | `server/routes/revenue.mjs` | `/api/revenue` (extended) | required | Y | N |
| GET | `/api/pro-features/healing-journeys` | `server/routes/pro-features.mjs` | `/api/pro-features` (extended) | optional | Y | N |
| GET | `/api/pro-features/advanced-analytics` | `server/routes/pro-features.mjs` | `/api/pro-features` (extended) | optional | Y | N |
| GET | `/api/pro-features/ai-concierge` | `server/routes/pro-features.mjs` | `/api/pro-features` (extended) | optional | Y | N |
| GET | `/api/pro-features/check-access` | `server/routes/pro-features.mjs` | `/api/pro-features` (extended) | optional | Y | N |
| GET | `/api/pro-features` | `server/routes/pro-features.mjs` | `/api/pro-features` (extended) | optional | Y | N |
| GET | `/api/products` | `server/routes/products.mjs` | `/api/products` (extended) | optional | N | N |
| GET | `/api/products/public` | `server/routes/products.mjs` | `/api/products` (extended) | optional | N | N |
| GET | `/api/products/:id` | `server/routes/products.mjs` | `/api/products` (extended) | optional | N | N |
| GET | `/api/products/slug/:slug` | `server/routes/products.mjs` | `/api/products` (extended) | optional | N | N |
| POST | `/api/products` | `server/routes/products.mjs` | `/api/products` (extended) | optional | N | N |
| PATCH | `/api/products/:id` | `server/routes/products.mjs` | `/api/products` (extended) | optional | N | N |
| DELETE | `/api/products/:id` | `server/routes/products.mjs` | `/api/products` (extended) | optional | N | N |
| POST | `/api/products/:id/purchase` | `server/routes/products.mjs` | `/api/products` (extended) | optional | N | N |
| GET | `/api/products/:id/purchases` | `server/routes/products.mjs` | `/api/products` (extended) | optional | N | N |
| GET | `/api/webhook` | `server/routes/webhook.mjs` | `/api/webhook` (extended) | public | Y | N |

### Storage
| Method | Full Path | Source File | Mount | Auth | Safety-Critical | Has Tests |
|---|---|---|---|---|---|---|
| POST | `/api/uploads/request-url` | `server/routes/object-storage.mjs` | `/api/uploads` (extended) | required | Y | N |
| GET | `/api/uploads` | `server/routes/object-storage.mjs` | `/api/uploads` (extended) | required | Y | N |
| GET | _(orphan — file not mounted)_ `/health` | `server/routes/canva-oauth.mjs` | _(unmounted)_ | — | Y | N |
| GET | _(orphan — file not mounted)_ `/config` | `server/routes/canva-oauth.mjs` | _(unmounted)_ | — | Y | N |
| POST | _(orphan — file not mounted)_ `/verify-token` | `server/routes/canva-oauth.mjs` | _(unmounted)_ | — | Y | N |
| POST | _(orphan — file not mounted)_ `/webhook` | `server/routes/canva-oauth.mjs` | _(unmounted)_ | — | Y | N |
| GET | _(orphan — file not mounted)_ `/asset-proxy` | `server/routes/canva-oauth.mjs` | _(unmounted)_ | — | Y | N |
| GET | _(orphan — file not mounted)_ `/status` | `server/routes/canva-oauth.mjs` | _(unmounted)_ | — | Y | N |
| GET | _(orphan — file not mounted)_ `/` | `server/routes/canva-oauth.mjs` | _(unmounted)_ | — | Y | N |

### Engagement & Gamification
| Method | Full Path | Source File | Mount | Auth | Safety-Critical | Has Tests |
|---|---|---|---|---|---|---|
| GET | `/api/gamification/progress` | `server/routes/gamification.mjs` | `/api/gamification` (extended) | optional | N | N |
| POST | `/api/gamification/record-session` | `server/routes/gamification.mjs` | `/api/gamification` (extended) | optional | N | N |
| GET | `/api/gamification/quests` | `server/routes/gamification.mjs` | `/api/gamification` (extended) | optional | N | N |
| POST | `/api/gamification/complete-quest` | `server/routes/gamification.mjs` | `/api/gamification` (extended) | optional | N | N |
| GET | `/api/gamification/leaderboard` | `server/routes/gamification.mjs` | `/api/gamification` (extended) | optional | N | N |
| GET | `/api/gamification` | `server/routes/gamification.mjs` | `/api/gamification` (extended) | optional | N | N |
| GET | `/api/badges` | `server/routes/badges.mjs` | `/api/badges` (extended) | optional | N | N |
| POST | `/api/badges/check` | `server/routes/badges.mjs` | `/api/badges` (extended) | optional | N | N |
| GET | `/api/onboarding/status` | `server/routes/onboarding.mjs` | `/api/onboarding` (extended) | optional | N | N |
| GET | `/api/onboarding/preferences` | `server/routes/onboarding.mjs` | `/api/onboarding` (extended) | optional | N | N |
| POST | `/api/onboarding/complete` | `server/routes/onboarding.mjs` | `/api/onboarding` (extended) | optional | N | N |
| PATCH | `/api/onboarding/preferences` | `server/routes/onboarding.mjs` | `/api/onboarding` (extended) | optional | N | N |
| GET | `/api/onboarding/goals-options` | `server/routes/onboarding.mjs` | `/api/onboarding` (extended) | optional | N | N |
| GET | `/api/onboarding` | `server/routes/onboarding.mjs` | `/api/onboarding` (extended) | optional | N | N |
| GET | `/api/insights/daily` | `server/routes/insights.mjs` | `/api/insights` (extended) | optional | N | N |
| GET | `/api/insights/mood` | `server/routes/insights.mjs` | `/api/insights` (extended) | optional | N | N |
| GET | `/api/insights` | `server/routes/insights.mjs` | `/api/insights` (extended) | optional | N | N |
| GET | `/api/dashboard` | `server/routes/ui-dashboard.mjs` | `/api/dashboard` (extended) | optional | N | N |
| GET | `/api/community/question` | `server/routes/community.mjs` | `/api/community` (extended) | optional | N | N |
| GET | `/api/community/reflections` | `server/routes/community.mjs` | `/api/community` (extended) | optional | N | N |
| POST | `/api/community/reflect` | `server/routes/community.mjs` | `/api/community` (extended) | optional | N | N |
| POST | `/api/community/reflections` | `server/routes/community.mjs` | `/api/community` (extended) | optional | N | N |
| POST | `/api/community/reflections/:id/heart` | `server/routes/community.mjs` | `/api/community` (extended) | optional | N | N |
| GET | `/api/community/completion-stats` | `server/routes/community.mjs` | `/api/community` (extended) | optional | N | N |
| GET | `/api/community/affirmations` | `server/routes/community.mjs` | `/api/community` (extended) | optional | N | N |
| POST | `/api/community/affirmations` | `server/routes/community.mjs` | `/api/community` (extended) | optional | N | N |
| POST | `/api/community/affirmations/:id/like` | `server/routes/community.mjs` | `/api/community` (extended) | optional | N | N |
| GET | `/api/community` | `server/routes/community.mjs` | `/api/community` (extended) | optional | N | N |

### Analytics & Metrics
| Method | Full Path | Source File | Mount | Auth | Safety-Critical | Has Tests |
|---|---|---|---|---|---|---|
| POST | `/api/analytics/event` | `server/routes/analytics.mjs` | `/api/analytics` (extended) | public | N | N |
| POST | `/api/analytics/pageview` | `server/routes/analytics.mjs` | `/api/analytics` (extended) | public | N | N |
| GET | `/api/analytics/admin/summary` | `server/routes/analytics.mjs` | `/api/analytics` (extended) | public | N | N |
| GET | `/api/analytics` | `server/routes/analytics.mjs` | `/api/analytics` (extended) | public | N | N |
| GET | `/api/analytics/summary` | `server/routes/analytics.mjs` | `/api/analytics` (extended) | public | N | N |
| GET | `/api/analytics/moods-last-7` | `server/routes/analytics.mjs` | `/api/analytics` (extended) | public | N | N |
| GET | `/api/analytics/journal-last-7` | `server/routes/analytics.mjs` | `/api/analytics` (extended) | public | N | N |
| POST | `/api/analytics-events/event` | `server/routes/analytics-events.mjs` | `/api/analytics-events` (extended) | optional | N | N |
| GET | `/api/analytics-events/admin/summary` | `server/routes/analytics-events.mjs` | `/api/analytics-events` (extended) | optional | N | N |
| GET | `/api/analytics-events` | `server/routes/analytics-events.mjs` | `/api/analytics-events` (extended) | optional | N | N |
| GET | `/api/metrics` | `server/routes/metrics.mjs` | `/api/metrics` (extended) | public | N | N |
| GET | `/api/metrics/json` | `server/routes/metrics.mjs` | `/api/metrics` (extended) | public | N | N |
| GET | _(orphan — file not mounted)_ `/summary` | `server/routes/metricsSummary.mjs` | _(unmounted)_ | — | N | N |
| GET | _(orphan — file not mounted)_ `/` | `server/routes/metricsSummary.mjs` | _(unmounted)_ | — | N | N |

### Communication & Outreach
| Method | Full Path | Source File | Mount | Auth | Safety-Critical | Has Tests |
|---|---|---|---|---|---|---|
| POST | `/api/contact` | `server/routes/contact.mjs` | `/api/contact` (extended) | public | N | N |
| GET | `/api/contact` | `server/routes/contact.mjs` | `/api/contact` (extended) | public | N | N |
| POST | `/api/leads` | `server/routes/leads.mjs` | `/api/leads` (extended) | public | N | N |
| GET | `/api/leads/export` | `server/routes/leads.mjs` | `/api/leads` (extended) | public | N | N |
| GET | `/api/leads` | `server/routes/leads.mjs` | `/api/leads` (extended) | public | N | N |
| POST | `/api/feedback` | `server/routes/feedback.mjs` | `/api/feedback` (extended) | public | N | N |
| GET | `/api/feedback` | `server/routes/feedback.mjs` | `/api/feedback` (extended) | public | N | N |
| POST | `/api/newsletter/subscribe` | `server/routes/newsletter.mjs` | `/api/newsletter` (extended) | public | N | N |
| POST | `/api/newsletter/unsubscribe` | `server/routes/newsletter.mjs` | `/api/newsletter` (extended) | public | N | N |
| GET | `/api/newsletter` | `server/routes/newsletter.mjs` | `/api/newsletter` (extended) | public | N | N |
| GET | `/api/email/health` | `server/routes/email.mjs` | `/api/email` (extended) | public | N | N |
| POST | `/api/email/welcome` | `server/routes/email.mjs` | `/api/email` (extended) | public | N | N |
| POST | `/api/email/challenge-reminder` | `server/routes/email.mjs` | `/api/email` (extended) | public | N | N |
| POST | `/api/email/milestone` | `server/routes/email.mjs` | `/api/email` (extended) | public | N | N |
| GET | `/api/email` | `server/routes/email.mjs` | `/api/email` (extended) | public | N | N |
| GET | `/api/social/posts` | `server/routes/social-posts.mjs` | `/api/social/posts` (extended) | public | N | N |
| GET | `/api/social/posts/:id` | `server/routes/social-posts.mjs` | `/api/social/posts` (extended) | public | N | N |
| POST | `/api/social/posts` | `server/routes/social-posts.mjs` | `/api/social/posts` (extended) | public | N | N |
| PATCH | `/api/social/posts/:id` | `server/routes/social-posts.mjs` | `/api/social/posts` (extended) | public | N | N |
| DELETE | `/api/social/posts/:id` | `server/routes/social-posts.mjs` | `/api/social/posts` (extended) | public | N | N |
| POST | `/api/social/posts/:id/publish` | `server/routes/social-posts.mjs` | `/api/social/posts` (extended) | public | N | N |
| GET | `/api/social-posting/channels` | `server/routes/social-posting.mjs` | `/api/social-posting` (extended) | optional | N | N |
| GET | `/api/social-posting/platforms/status` | `server/routes/social-posting.mjs` | `/api/social-posting` (extended) | optional | N | N |
| GET | `/api/social-posting/platforms` | `server/routes/social-posting.mjs` | `/api/social-posting` (extended) | optional | N | N |
| GET | `/api/social-posting/platforms/:platformId/status` | `server/routes/social-posting.mjs` | `/api/social-posting` (extended) | optional | N | N |
| POST | `/api/social-posting/post` | `server/routes/social-posting.mjs` | `/api/social-posting` (extended) | optional | N | N |
| POST | `/api/social-posting/schedule` | `server/routes/social-posting.mjs` | `/api/social-posting` (extended) | optional | N | N |
| GET | `/api/social-posting/scheduled` | `server/routes/social-posting.mjs` | `/api/social-posting` (extended) | optional | N | N |
| DELETE | `/api/social-posting/scheduled/:id` | `server/routes/social-posting.mjs` | `/api/social-posting` (extended) | optional | N | N |
| POST | `/api/social-posting/process-scheduled` | `server/routes/social-posting.mjs` | `/api/social-posting` (extended) | optional | N | N |
| POST | `/api/social-posting/drafts/:id/publish` | `server/routes/social-posting.mjs` | `/api/social-posting` (extended) | optional | N | N |
| GET | `/api/social-posting` | `server/routes/social-posting.mjs` | `/api/social-posting` (extended) | optional | N | N |

### Health & Diagnostics
| Method | Full Path | Source File | Mount | Auth | Safety-Critical | Has Tests |
|---|---|---|---|---|---|---|
| GET | `/api/health` | `server/routes/health.mjs` | `/api/health` (direct) | — | Y | N |
| GET | `/api/health/ready` | `server/routes/health.mjs` | `/api/health` (direct) | — | Y | N |
| GET | `/api/health/live` | `server/routes/health.mjs` | `/api/health` (direct) | — | Y | N |
| GET | `/api/health/detailed` | `server/routes/health.mjs` | `/api/health` (direct) | — | Y | N |
| GET | `/api/health/metrics` | `server/routes/health.mjs` | `/api/health` (direct) | — | Y | N |
| POST | `/api/health/repair` | `server/routes/health.mjs` | `/api/health` (direct) | — | Y | N |
| GET | `/api/health/git-status` | `server/routes/health.mjs` | `/api/health` (direct) | — | Y | N |
| GET | `/api/health/platform-integrity` | `server/routes/health.mjs` | `/api/health` (direct) | — | Y | N |
| GET | _(orphan — file not mounted)_ `/health` | `server/routes/api.mjs` | _(unmounted)_ | — | N | N |
| GET | _(orphan — file not mounted)_ `/` | `server/routes/api.mjs` | _(unmounted)_ | — | N | N |

---

## Orphan Routers (in `server/routes/` but NOT mounted in `server/app.mjs`)

These 13 files are dead code or intentionally disabled. **None of their endpoints are reachable in production.**

| File | Endpoints | Reason / Recommendation |
|---|---|---|
| `server/routes/accountActions.mjs` | 5 | Conflict-suspect (overlaps `account.mjs`). Flagged in app.mjs for separate review. |
| `server/routes/api.mjs` | 2 | Likely a meta-router stub. Check whether merge-into-other-router is intended. |
| `server/routes/canva-oauth.mjs` | 7 | **SECURITY** — disabled. /verify-token accepts unsigned Canva JWTs. Replace with JWKS verifier before mounting. |
| `server/routes/healing-tools.mjs` | 12 | Possible dead code. `wellness-tools.mjs` and `healing.mjs` overlap functionally. |
| `server/routes/healing.mjs` | 9 | Possible dead code. Many specific healing-* routers cover this surface. |
| `server/routes/integrationHealth.mjs` | 4 | Likely superseded by `health.mjs`. Verify before mount or removal. |
| `server/routes/login.mjs` | 2 | Conflict-suspect (overlaps `auth.mjs`). Flagged in app.mjs for separate review. |
| `server/routes/meaning-future.mjs` | 10 | Possible dead code (overlap with `meaning.mjs` and `life-purpose.mjs`). |
| `server/routes/metricsSummary.mjs` | 2 | Possible dead code (overlap with `metrics.mjs`). |
| `server/routes/mfa.mjs` | 5 | Conflict-suspect (overlaps `auth.mjs`). Flagged in app.mjs for separate review. |
| `server/routes/redirects.mjs` | 5 | Possible dead code. Cloudflare or app.mjs SPA fallback may already handle. |
| `server/routes/rss.mjs` | 1 | Likely intentional pending content strategy. Confirm whether to publish. |
| `server/routes/system.mjs` | 2 | Conflict-suspect (overlaps `health.mjs` / admin diagnostics). Flagged in app.mjs for separate review. |

---

## Duplicate Mount Paths

Same mount string mounted multiple times. **All currently observed duplicates are intentional** (different sub-paths under the same prefix), but documented here for awareness.

### `/api/auth`
- `auth.mjs` (direct)
- `github-auth.mjs` (direct)
Plus a third `registerAuthRoutes(app)` call in app.mjs from `./replit_integrations/auth/index.mjs` adding `GET /user` under the same prefix.

**Verdict:** intentional, disjoint sub-paths. Not a true duplicate.

---

## Intentionally Disabled (commented-out) Routers

| Mount | File | Reason |
|---|---|---|
| `/api/canva-oauth` | `./routes/canva-oauth.mjs` | Commented-out in EXTENDED_ROUTES — security review required (see app.mjs inline note). |

---

## Auth Posture Summary

From the EXTENDED_ROUTES `auth` flag (104 mounts):

| Auth Tag | Count | Meaning |
|---|---|---|
| **public** | 15 | No middleware applied — fully public. |
| **optional** | 76 | `optionalAuth` — request proceeds either way; req.user populated if a valid token is present. |
| **adult** | 3 | `requireAdult` — age verification gate. |
| **required** | 7 | `requireAuth` — 401 if not authenticated. |
| **admin** | 3 | `requireAuth + requireAdmin` — admin-only. |

Direct mounts in app.mjs additionally apply: `requireAdult` to `/api/ai/healing`; `requireAuth + requireAdmin + adminLimiter` to all `/api/admin/*`; `aiLimiter` (30 req/min) to all `/api/ai/*`; `adminLimiter` (10 req/min) to all `/api/admin/*`; CSRF protection globally except `/api/session-boundary`.

---

## Test Coverage Detail

Files in `server/tests/`:

| Test File | Covers Router | Notes |
|---|---|---|
| `server/tests/ai.test.mjs` | `ai.mjs` | LOCKED domain. Coverage scope unverified by this audit. |
| `server/tests/auth.test.mjs` | `auth.mjs` | Login/register/refresh/logout. |
| `server/tests/journal.test.mjs` | `journal.mjs` | Adult-gated journaling. |
| `server/tests/mood.test.mjs` | `mood.mjs` | Mood tracking. |

**Untested router count: 137 of 141.** Top priorities to add tests for (by safety-criticality):
1. `webhook.mjs` (Stripe webhook signature verification + entitlement application)
2. `billing.mjs` (subscription tier resolution, checkout session creation)
3. `admin.mjs` and all 7 admin sub-routers (production governance surface)
4. `awareness.mjs` (manipulation/distortion detection — wired into the live chat path)
5. `biometrics.mjs` (PHI-adjacent ingestion, AES-256-GCM at rest, OAuth callbacks)
6. `protocols.mjs` (PHQ-9 item-9 escalation, session state machine)
7. `discernment.mjs` (anti-farming + belt-advancement scoring)
8. `buddy.mjs` (visual companion to AI chat)
9. `object-storage.mjs` (file upload surface — abuse + size limits)
10. `session-boundary.mjs` (logout + CSRF token re-issue)

---

## Recommended Follow-Up Tasks (for Week 1 / Task 1B+)

1. **Resolve the 4 conflict-suspect orphans** (`login.mjs`, `mfa.mjs`, `accountActions.mjs`, `system.mjs`): either delete or merge into the canonical router for that domain.
2. **Decide the fate of `server/index.mjs`** (745-line legacy entrypoint): delete, merge into app.mjs, or mark deprecated with a banner.
3. **Fix `canva-oauth.mjs` JWT verification** before any future mount.
4. **Generate OpenAPI 3.1 spec from Zod** (per the Week-5 line in the transformation roadmap) — this inventory is the manual version of what should be auto-generated.
5. **Add router-level tests** for the 10 priority routers above.
6. **Document the three-source `/api/auth` mount contract** in an inline comment block in `app.mjs`.
7. **ADR-0002**: "Decompose 141-router monolith — keep modular monolith, extract Crisis + Billing + Biometrics first" (per the Strangler-Fig sequencing in the roadmap).

---

_Inventory generated 2026-04-28 as Week 1 / Task 1A. Read-only. No code changes. Source: `server/app.mjs` + 141 files under `server/routes/`._
