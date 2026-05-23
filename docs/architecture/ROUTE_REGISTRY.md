# MMHB Route Registry

**Baseline:** 2026-05-23 (Phase 55)
**Mode:** descriptive snapshot — no runtime changes
**Companion:** `docs/operations/PRODUCTION_CONTRACT_REGISTRY.md` (public HTTP contract for the 7 monitored endpoints)

---

## 1. Backend — Express routes actually mounted in `server/app.mjs`

| # | Method | Path prefix | Router source | Special |
|---|---|---|---|---|
| 1 | GET, HEAD | `/healthz` | inline (app.mjs:85-89) | fast-path; bypasses all middleware |
| 2 | USE | `/api/webhooks` | `server/routes/webhook.mjs` | raw body (bypasses JSON parser) |
| 3 | USE | `/api/session-boundary` | `server/routes/session-boundary.mjs` | CSRF-excluded |
| 4 | USE | `/api/health` | `server/routes/health.mjs` | CSRF-excluded |
| 5 | USE | `/api/ai` | `routes/ai.mjs` + `aiLimiter` mount | rate-limited |
| 6 | USE | `/api/ai/healing` | `routes/ai.healing.mjs` | |
| 7 | USE | `/api/auth` | `routes/auth.mjs` | |
| 8 | USE | `/api/admin` | `routes/admin.mjs` + `adminLimiter` mount | rate-limited |
| 9 | POST | `/api/buddy` | `routes/buddy.mjs` | |
| 10 | GET | `/ready` | inline (app.mjs:308) | JSON `{status,timestamp}` |
| 11 | GET | `/readyz` | inline (paired with /ready) | JSON, same shape |
| 12 | GET | `/metrics` | inline (app.mjs:318) | JSON uptime + memory |
| 13 | GET | `*` | SPA fallback | `client/dist/index.html` |

**~16 routers actively mounted.** Each router file under `server/routes/` may register multiple `app.{get,post,…}` handlers internally; this table enumerates only the **mount points** registered in `server/app.mjs`.

## 2. Backend — duplicate / overlapping mounts (informational)

| Path | Occurrences | Note |
|---|---|---|
| `/api/ai` | `app.use("/api/ai", aiLimiter)` (line ~180) **and** `app.use("/api/ai", aiRoutes)` (line ~248) | **intentional ordering** — limiter precedes router; not a bug |
| `/api/admin` | `app.use("/api/admin", adminLimiter)` (line ~245) **and** `app.use("/api/admin", adminRoutes)` (line ~254) | **intentional ordering** — same pattern |
| `/ready` + `/readyz` | Two endpoints with identical body | **intentional alias** — `/readyz` is the k8s-style alias added in Phase 47 |
| `/health` (legacy guard) + `/api/health` | Distinct surfaces, overlapping intent | observational; the `/health` guard at app.mjs:303 is a thin shim |

None of the above are runtime defects. They are documented here so future audits do not flag them again.

## 3. Backend — orphaned route files (NOT mounted)

`server/routes/**` contains **141 files** (per `git ls-files`). Approximately **125 files** in this directory are **not mounted** in `server/app.mjs`. Examples observed in the audit:

`dialectics.mjs`, `creativity.mjs`, `wisdom.mjs`, `mood.mjs`, `metricsSummary.mjs`, `social-posts.mjs`, `social-posting.mjs`, `adminBilling.mjs`, `healing.mjs`, `onboarding.mjs`, plus various `*.bak`.

### Interpretation

- Each unmounted route file is **dead weight at runtime** — adds no surface area, but adds repo size and bisect noise.
- The `/api/health.platform.totalRoutes` counter reports **127**, which matches the **count of files in `server/routes/`** (after deducting `.bak` and similar), not the **count of routers mounted**. This is a known reporting discrepancy and is on the carry-forward list (Phase 44 canary tolerance recalibration).
- The 127-vs-16 gap does not affect production behavior; only mounted routers serve traffic.

### Carried into next phase

The carry-forward "Phase 44 canary tolerance recalibration" item now expands to include a third sub-item: **align `totalRoutes` to either (a) actual mounted-router count or (b) keep it as file-count-in-routes-dir with a doc clarification.** Recommendation: (b) — preserve numeric stability for monitors, document the semantics.

## 4. Frontend — wouter route table summary (`client/src/App.jsx`)

| Metric | Value |
|---|---|
| `<Route path="…" />` entries (grep count) | **~1,036** |
| Lazy-loaded page imports | most pages, via `lazy()` |
| Admin guard | `<AdminGuard>` wrap |
| Auth guard | route-level checks |

### Route categories (estimated proportions)

| Category | Approx. count | Notes |
|---|---:|---|
| Canonical pages (one route → one page) | ~150 | the actual product surface |
| Redirect aliases (one route → `<Redirect to=…/>`) | ~800 | SEO + legacy URL preservation |
| Admin pages | 24-32 (incl. `_adminTools/`) | matches `adminPages: 27` |
| Auth pages | ~6 | `/login`, `/register`, `/forgot-password`, `/reset-password`, etc. |
| Tools / wellness / dashboard | ~50 | mood, journal, chat, breathing, meditation, etc. |
| Marketing / landing variants | ~20 | multiple landing variants for testing |
| Crisis route | 1 | `/crisis` → `client/src/pages/CrisisResources.jsx` |

The 1,036-route count is dominated by **redirect aliases** — these are intentional for URL preservation, not orphans.

## 5. Frontend — orphaned pages observed

Pages found in `client/src/pages/` that are **not registered** in `App.jsx`:

- `client/src/pages/ContentIndexPage.jsx`
- `client/src/pages/ControlDashboard.jsx`
- `client/src/pages/DesignSystem.jsx` (superseded by `DesignSystemV2.jsx`)
- `client/src/pages/WellnessHubPage.jsx` (superseded by specific hub pages)

These are doc-only findings; deletion is out of scope.

## 6. Frontend — route drift candidates

| Pair | Concern |
|---|---|
| `/breathing` → `BreathingTool.jsx` vs `/breath` → `BreathTool.jsx` | Two components for the same intent; both routed; user may land on either |
| `/pricing` → `PricingReal` vs `/pricing-page` → `PricingPage` | Two pricing surfaces; risk of user confusion |
| `LearnGuideDetail` vs `LearnArticleDetail` (both `LearnDetail.jsx`) | Same component, two import aliases |
| `Onboarding.tsx` + `OnboardingFlow.jsx` (both routed) | Two onboarding flows |
| `MoodTracker.jsx` + `MoodPage.jsx` (both routed) | Two mood surfaces |

These should be triaged in the next dedicated cleanup phase. **None are production-breaking**; all are user-experience cohesion concerns.

## 7. Crisis route — verified present at all layers

| Layer | Verified |
|---|---|
| Backend mount (SPA fallback serves it as part of `*`) | ✅ |
| Frontend route (`/crisis` in App.jsx ~line 479) | ✅ |
| Page component (`client/src/pages/CrisisResources.jsx`) | ✅ |
| F-33.6 literals in page source: `988` (line 12), `741741` (lines 22, 31), `911` (line 138), `Crisis Text Line` (line 19), `/crisis` | ✅ 5/5 |
| Live production probe (size 10,652 B, HTTP 200, all 5 literals present) | ✅ |
| Linked from `client/src/components/layout/Footer.tsx` (line 78) | ✅ |
| Linked from `client/src/checkin-flow/components/FlowStepCheckout.tsx` (line 133) | ✅ |
| Linked from `client/src/lumi-agent/prompts/lumiSystemPrompt.ts` (line 29 — AI instructed to surface) | ✅ |

**BHCE Primary Law gate holds end-to-end.**

## 8. Public HTTP surface summary

The **7 endpoints in the production contract registry** are the entire public HTTP surface that monitoring asserts:

| # | Endpoint | Source | Live status (2026-05-23 19:58 UTC) |
|---|---|---|---|
| 1 | `GET /` | SPA fallback | ✅ 200, 10,652 B |
| 2 | `GET /crisis` | SPA fallback (renders CrisisResources page) | ✅ 200, 10,652 B, F-33.6 5/5 |
| 3 | `GET /healthz` | inline app.mjs:85 | ✅ 200, 2 B `ok` |
| 4 | `GET /ready` | inline app.mjs:308 | ✅ 200, 57 B JSON |
| 5 | `GET /readyz` | inline (Phase 47 add) | ✅ 200, 57 B JSON |
| 6 | `GET /api/health` | `routes/health.mjs` | ✅ 200, 429 B, 17/17 invariants pass |
| 7 | `GET /metrics` | inline app.mjs:318 | ✅ 200, ~163 B JSON |

Everything else (auth, AI, admin, billing webhook, etc.) is **internal-by-design** — exercised by the SPA but not part of the public uptime contract.

---

*This route registry is descriptive. The orphaned route files and frontend orphaned pages are findings to be addressed in a future planned cleanup phase, not in this audit. The `totalRoutes: 127` reporter remains the operational source of truth for `/api/health` until the carry-forward recalibration phase explicitly changes it.*
