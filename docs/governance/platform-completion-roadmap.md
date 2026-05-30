# Platform Completion Roadmap — Phase Q0

> **Status:** Reality-only inventory + forward roadmap for MyMentalHealthBuddy (MMHB) by The Genuine Love Project, compiled 2026-05-30.
> **Primary Law:** Documentation and inventory only. This document changes no runtime behavior, routes, backend, frontend, dependencies, or config.
> **Companion sources of truth:** `docs/governance/runtime-topology.md`, `docs/governance/observability-inventory.md`, `docs/governance/MMHB_v7.4_ARCHIVAL_KERNEL.md`.
> **Legend:** **VERIFIED** = observed in code/runtime today · **PARTIAL** = exists but incomplete or inconsistently applied · **MISSING** = referenced or expected but absent · **FUTURE** = proposed, not yet built.

---

## 1. Hard Truth

MMHB is a **large, working, single-process Express + Vite SPA**, not a greenfield project and not a finished product. It boots from one canonical entrypoint (`server/app.mjs`), serves a client-rendered React app from `client/dist`, and has substantial governance scaffolding around it (route registries, observability core, crash handlers, CSRF, rate limiting, safety alerting).

The honest gaps are not "does it run" — it runs and deploys. The gaps are **maturity and consistency**:

- The frontend is a **pure client-side SPA** (`ReactDOM.createRoot(...).render(...)`); there is **no SSR** today. Any "SSR readiness" work is greenfield, not a fix.
- **localStorage is touched in 191 client files** with no single guarded wrapper — browser-storage access is widespread and inconsistently defended.
- The codebase carries **large surface area** (324 page files, 459 component files, 338 server files) with known duplicate/name-collision groups already catalogued. Breadth exceeds verified depth in several product areas.
- Several **declared npm scripts and the deployment server-bundle step reference files that are present for some, absent for others** (notably `scripts/build-server.mjs` is still missing while the deployment build references it).
- The platform's **strongest, most defensible asset is its ethical/safety architecture** (business↔healing separation, crisis routing, AI boundary map, safety alerting), not its feature completeness.

Nothing below proposes code. Everything below distinguishes what is real from what is aspirational.

---

## 2. Current Verified State

**Runtime (VERIFIED, per `runtime-topology.md`)**
- Single entrypoint `server/app.mjs`; single `app.listen` (port `5000`, host `0.0.0.0`); single `express.static(client/dist)`.
- Fast-path `GET/HEAD /healthz` mounted before all heavy middleware → synchronous `200 ok`, `Cache-Control: no-store`.
- Detailed `GET /api/health` (+ `/ready`, `/live`, `/metrics`, `/detailed`, `/repair`, `/git-status`, `/platform-integrity`) in `server/routes/health.mjs`.
- Middleware chain (verified order): CORS → `express.json` (raw-body capture for HMAC) → Helmet (CSP branches on env) → cookieParser → `requestId` → `observabilityContext` → session-boundary routes → health routes → **CSRF (global)** → AI rate limiter → feature routes → static → SPA fallback.
- Crash safety: `uncaughtException` + `unhandledRejection` handlers log + fire PagerDuty alert via dynamic import; neither exits the process. `SIGTERM`/`SIGINT` → graceful shutdown with 10s force-exit timer.
- Auth: canonical `server/middleware/auth.mjs` (`optionalAuth`, `requireAuth`, `requireAdmin`, `signUserToken`); refuses boot if `JWT_SECRET` < 32 chars. Adult-only gate `requireAdult.mjs`. CSRF in `server/security/csrf.mjs`.
- Rate limits: `/api/ai` 30/min; admin login 10/min IP-keyed; admin dashboard 200/min identity-keyed.

**Observability (VERIFIED, per `observability-inventory.md`)**
- OTel preload via `--import` in the dev workflow only (wrapped in try/catch; failures degrade to warning).
- Structured logger `server/utils/logger.mjs` (JSON in production, human-readable otherwise; metadata passed through `logRedaction.mjs`).
- `requestId` (uuid) stamped per request; AsyncLocalStorage context; Sentry scopes tagged with `requestId`.
- Safety-class alert wrappers: crisis pipeline, PHQ-9 escalation, webhook signature, biometric ingestion, constitutional violation, schema failure, uncaught.

**Tooling (VERIFIED this cycle — reconciliation note)**
- `scripts/` is **populated today** (verify-all, route governance scans, duplicate audits, post-merge, generate-route-manifest, etc.). This **supersedes** the older `observability-inventory.md` note that called `scripts/` empty (that note was dated 2026-05-17).
- `npm run verify:all` runs: `build` → `audit:duplicates` → `scan:routes` → `governance/copyrightScanner.mjs`. Last observed result this session: **121 pass / 0 warn / 0 fail**, build green (~45–47s).

**Frontend (VERIFIED)**
- Vite SPA, client-rendered (`client/src/main.jsx` → `createRoot`). Aliases `@`, `@shared`, `@assets`. Manual vendor chunking.
- Canonical loaders: `client/src/components/ui/BrandSpinner.jsx` (inline) and `LotusLoader.jsx` (large-area). `LotusLoader` reduced-motion behavior was corrected this cycle.

**Config (VERIFIED)**
- `client/src/config/`: `featureAccess.js`, `leadMagnets.ts`, `seo.ts`, `social.ts`, `toolCategories.js`.

---

## 3. Remaining Hardening

### localStorage guards — **PARTIAL / MISSING**
- **Reality:** `localStorage` is referenced across **191 client files**. Some files defensively check `typeof window` / `typeof localStorage`; most do not. There is **no central safe-storage wrapper**.
- **Risk:** Direct access throws in private-mode / storage-disabled / SSR-prerender contexts; inconsistent try/catch means a single quota or access error can break a page.
- **Target:** Phase H2 (next queued).

### SSR readiness — **FUTURE (not present)**
- **Reality:** Pure client-side render; no `hydrateRoot`, no `renderToString`/`renderToPipeableStream` in app code. The unguarded `localStorage`/`window` access above is the primary blocker to any future SSR/prerender.
- **Target:** Out of near-term scope; depends on H2 completing first.

### Observability — **VERIFIED core, PARTIAL coverage**
- **VERIFIED:** OTel preload (dev only), Sentry request tagging, PagerDuty safety alerts, crash handlers, structured redacted logging.
- **PARTIAL/MISSING:** `requestLogger` middleware exists in `logger.mjs` but is **not mounted** → no per-request access log line. OTel does **not** initialize in the deployed build (production runs `dist/server.mjs` without `--import`). Bare `/health`, `/ready`, `/live`, `/metrics` return SPA HTML 200, not JSON (external monitors expecting JSON there pass silently).

### Logging — **VERIFIED with one gap**
- JSON-in-prod logger with redaction is real and widely consumed. Gap: no mounted request/access logger; slow-request warning path (`SLOW_REQUEST_THRESHOLD_MS`) exists in the logger but only fires where the logger is explicitly used.

### Monitoring — **PARTIAL**
- Health JSON contract is solid for liveness/readiness. **No Prometheus exposition format**; metrics are bespoke JSON. No pinned deployment liveness path in `.replit` (relies on platform port-open check).

### Analytics governance — **PARTIAL**
- GA gated by `VITE_GA_MEASUREMENT_ID` (currently a **MISSING secret**); `analytics.ts` warns when absent. Client analytics helpers exist (`lib/analytics.ts`, `lib/track.ts`, `hooks/useAnalytics.mjs`). **No explicit consent gate** observed before analytics initialization → consent/governance layer is a gap given the mental-health context.

---

## 4. Product Maturity

- **AI orchestration — PARTIAL.** Verified: domain-split routes (`ai.mjs`, `ai.healing.mjs`, `ai.business.mjs`), AI rate limiting, `AI_BOUNDARY_MAP.md`, prompt-shield middleware, `aiClient.isConfigured()`. AI must remain non-clinical, bounded, human-supervised (kernel law). Orchestration across engines is functional but not yet a unified, observable pipeline.
- **Emotional UX refinement — PARTIAL.** Verified governance: `EMOTIONAL_STATE_ENGINE_GOVERNANCE.md`, emotional-continuity governance, reduced-motion correctness improving. Consistency across 324 pages is unproven.
- **Avatar systems — PARTIAL / FUTURE.** `AVATAR_V4.2_EXECUTION_PLAN.md` exists; runtime maturity unverified here.
- **Onboarding flows — PARTIAL.** `Onboarding.tsx` and guided-journey governance exist; completion depth unverified.
- **Accessibility completion — PARTIAL.** WCAG AA is a stated standard; reduced-motion just hardened in `LotusLoader`. No full automated a11y gate verified. **FUTURE:** reduced-motion regression test for loaders.
- **Mobile optimization — PARTIAL.** Mobile-safe UX governance exists (`MOBILE_NERVOUS_SYSTEM_SAFE_UX_GOVERNANCE.md`); device-matrix verification not evidenced.
- **Auth maturity — PARTIAL.** Verified: JWT access tokens, admin gating, CSRF, adult gate. **MISSING:** no active opaque refresh-token issuance (refresh re-signs access JWT). Replit integration auth registered.
- **Billing maturity — PARTIAL.** Admin billing routes + Stripe service presence verified; end-to-end billing completeness unverified and **must stay isolated from healing flows** (kernel Primary Law).

---

## 5. Ecosystem Expansion

- **SEO/content engine — PARTIAL.** `config/seo.ts`, per-page SEO components, blog pages verified. Programmatic SEO at scale = FUTURE.
- **Publishing systems — PARTIAL.** Admin publishing routes + pages verified (`admin-publishing.mjs`, publishing components). Maturity unverified.
- **Clinician/provider tooling — MISSING/FUTURE.** No verified provider-facing tooling. Any such tooling must preserve non-clinical, human-supervised boundaries.
- **Community systems — PARTIAL.** Community pages/features present (`features/community/`, community feed/hub/circle). Moderation/safety depth unverified.
- **Growth systems — PARTIAL.** Lead magnets config + newsletter invite verified; governed retention loop documented (`ETHICAL_RETENTION_LOOP_GOVERNANCE.md`). Must stay ethical/consent-based.
- **Recommendation systems — FUTURE.** Knowledge-graph + semantic-search governance seeds exist; live recommendation engine unverified.
- **Personalization governance — PARTIAL.** Reading-level context, emotional-state governance exist; unified personalization contract = FUTURE.

---

## 6. Content Depth Gap

- **PARTIAL.** Large page/route count, but `reports/incomplete-pages.md` and duplicate/collision catalogues indicate breadth ahead of finished depth. Content engine and blog exist; sustained original, trauma-informed, non-clinical content production is the gap (kernel: original writing only, educational only).

---

## 7. UX / Visual Polish Gap

- **PARTIAL.** Extensive polish history and scoped polish layers documented in `replit.md`. Active gaps: loader consolidation is mid-stream (one route migrated to `LotusLoader`); reduced-motion now correct in `LotusLoader` but no automated guard; visual consistency across the full page set is unproven.

---

## 8. AI Orchestration Gap

- **PARTIAL.** Domain separation (healing/business) and boundary map are real strengths. Gaps: no unified, fully observable multi-engine orchestration; AI tracing is dev-only (no OTel in production build); guardrail coverage (prompt-shield) present but not proven exhaustive. AI must remain bounded, non-diagnostic, human-supervised.

---

## 9. Ethical Emotional Architecture Advantage

This is MMHB's **clearest competitive moat** and is **VERIFIED in governance + runtime**:

- Hard **business ↔ healing separation** (kernel Primary Law) — healing flows never carry pricing/conversion/debugging; business flows never carry healing content.
- **Crisis routing always available** (`/crisis`, 988, Crisis Text 741741, 911) — governance-mandated on every wellness surface; crisis page is an always-200 contract.
- **AI boundary map + non-clinical bounding** — `AI_BOUNDARY_MAP.md`, prompt-shield, constitutional-violation alerting.
- **Safety alerting** — dedicated PagerDuty wrappers for crisis-pipeline and PHQ-9 escalation failures.
- **Trauma-informed, consent-based, reduced-motion-aware UX** as stated standards.

Preserving and deepening this architecture should be weighted above feature breadth in every future phase.

---

## 10. Risk Matrix

| Area | Likelihood | Impact | Reversibility | Notes |
|---|---|---|---|---|
| Unguarded `localStorage` (191 files) | High | Med–High | High (additive wrapper) | Throws in private/disabled-storage; blocks SSR. **H2 target.** |
| Missing `scripts/build-server.mjs` | Med | High | High | Deployment build references it; verify the live deploy path. |
| No production OTel / no mounted access log | Med | Med | High | Observability blind spots in deployed env. |
| Analytics without explicit consent gate | Med | Med–High | High | Sensitive mental-health context; consent governance gap. |
| No refresh-token rotation | Low–Med | Med | Med | Access-JWT re-sign only; session longevity/security tradeoff. |
| Content/page breadth > depth | High | Med | High | Duplicate/collision groups; incomplete pages catalogued. |
| Business/healing contamination | Low | Critical | Low if shipped | Kernel Primary Law; must never regress. |
| Crisis routing regression | Low | Critical | Low if shipped | Always-200 contract; guard in every cycle. |

---

## 11. Priority Model

Future phases ranked by **Impact × Risk Reduction × Dependency Order × Reversibility**.

- **Favor:** high-impact, high-risk-reduction, dependency-unblocking, fully reversible/additive work.
- **Defer:** low-reversibility or contamination-prone work until guarded.
- **Never auto-proceed** across phase boundaries (kernel execution discipline: one blocker at a time, verify gate before next).
- **Always preserve:** business/healing separation, crisis routing, non-clinical AI bounding.

Highest-priority near-term work is **additive hardening** (storage guards, observability completeness, consent governance) because it is fully reversible, dependency-unblocking (SSR depends on storage guards), and risk-reducing without touching product surfaces.

---

## 12. Next 10 Safe Phases

Ordered, each reversible/additive, each gated by build + verify + health checks:

1. **H2 — localStorage Guard Hardening** *(next queued)*: introduce/adopt a guarded safe-storage accessor; migrate highest-traffic files first. Additive.
2. **H3 — Access-Logging Activation**: mount the existing `requestLogger` (already in `logger.mjs`) behind a flag; no new dependency.
3. **H4 — Production Observability Parity**: ensure OTel/Sentry initialize in the deployed build path; reconcile `scripts/build-server.mjs`.
4. **H5 — Analytics Consent Governance**: gate analytics init behind explicit, documented consent; respect missing `VITE_GA_MEASUREMENT_ID`.
5. **H6 — Health/Monitor Contract Hardening**: decide canonical behavior for bare `/health|/ready|/live|/metrics` (JSON vs documented SPA fallthrough).
6. **H7 — Accessibility Guard**: automated reduced-motion + a11y regression checks for canonical loaders/components.
7. **H8 — Loader/Spinner Consolidation Continuation**: migrate remaining public, non-shared `animate-spin` loaders to canonical primitives, one route at a time.
8. **H9 — Content Depth Pass**: resolve `incomplete-pages.md` items and catalogued duplicate/collision groups (non-destructive).
9. **H10 — Auth Maturity Review**: evaluate refresh-token rotation as an explicit, governed decision (no silent change).
10. **H11 — AI Orchestration Observability**: unified, traced, bounded AI pipeline view; preserve healing/business split.

---

## 13. Phase H2 Recommendation

**Proceed to H2 — localStorage Guard Hardening** as the single next phase, because it scores highest on the priority model:

- **Impact:** High — touches resilience of 191 files.
- **Risk Reduction:** High — removes a whole class of private-mode/storage-disabled crashes.
- **Dependency Order:** Unblocks any future SSR/prerender work (Section 3).
- **Reversibility:** High — a guarded accessor is additive; call-site migration is incremental and revertible.

**H2 must be:** additive (introduce/adopt a guarded accessor, do not rip out working code), incremental (migrate by traffic priority), and non-contaminating (no healing/business/route/backend changes bundled in). Verify gate after each batch. **Do not auto-proceed past H2.**

---

## 14. Verification Commands

Documentation-only phase; commands below confirm the runtime was untouched by Q0.

```bash
# Syntax gate
node --check server/app.mjs            # → OK

# Frontend build
npm run build                          # → ✓ built

# Liveness fast-path
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5000/healthz     # → 200

# Full health JSON
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5000/api/health  # → 200
```

Observed results for this Q0 run are recorded in the return summary accompanying this document.

---

## 15. Stop Point

- **Q0 deliverable:** this single file (`docs/governance/platform-completion-roadmap.md`). No runtime, route, backend, frontend, dependency, or config changes.
- **Blast radius:** documentation only.
- **Next queued phase:** **Phase H2 — localStorage Guard Hardening.** No automatic execution. Await explicit authorization before H2 begins.
