# MyMentalHealthBuddy by The Genuine Love Project

## Overview
MyMentalHealthBuddy (MMHB) is an AI-powered mental wellness platform by The Genuine Love Project. It aims to foster self-love, healing, and emotional growth through AI-assisted guidance, mood tracking, journaling, and crisis support. The platform integrates AI with trauma-informed psychological principles to provide ethical, accessible, and personalized mental health support, reducing stigma and empowering individuals globally.

## User Preferences
- Preferred communication style: Simple, everyday language
- Engineering standards: A→Z 360° complete solutions
- Mental health approach: Trauma-informed, supportive, non-clinical language
- UX philosophy: Gentle, compassionate, accessible
- DRY-RUN FIRST
- Non-destructive (never delete without permission)
- Educational only (no diagnosis, no treatment claims)
- Original writing only
- WCAG AA accessibility
- Calm, consent-based language
- Always include /crisis routing on wellness content
- Replit-safe execution only
- If unsure, ask ONE clarifying question. Never guess.

## System Architecture

### UI/UX Decisions
The frontend features a Canva-inspired design with HSL color formatting, custom typography, enhanced gradients, and refined shadows. It supports light/dark themes, micro-interactions, and WCAG AA accessibility through a design token system ("Aurora Token System"). The "Buddy Engine" visual companion renders alongside the AI Chat orchestrator, featuring a screen-face robot design with state-driven visual changes, maintaining existing CSS animation hooks and `prefers-reduced-motion` compliance. The landing page uses an NLP-informed emotional journey structure. A reusable `glp-pane` primitive is used for consistent UI element styling.

### Technical Implementations
The project uses a monorepo structure with React 18 (TypeScript, Vite) for the client and Node.js/Express (TypeScript) for the server, offering a RESTful API with security and session management. It features a trauma-informed NLP layer and a "Wellness Microcopy Library." A Dual-Engine AI Prompt Architecture separates user-facing and administrative engines with strict data boundaries, supported by a self-evolving prompt registry. Core orchestration includes RBAC, crisis-first intent routing, PII redaction, structured event logging, and a Self-Tuning Fallback Library for offline scenarios. The system incorporates subtle-emotion inference, an adaptive response policy, and an intervention module router with eight evidence-backed modules and seven micro-exercises. Crisis detection is unified and short-circuits to appropriate responses. The application bootstraps its database schema at boot. Authentication handles user registration and login, storing JWTs in local storage and ensuring CSRF exemption for specific auth endpoints. An Admin Command Center provides an operations console with strict authentication and authorization for administrative tasks.

### Feature Specifications
Core features include AI-powered Chat Therapy, Wellness Tools (State Tracker, Journal Prompts), and specialized APIs. The platform supports a four-tier subscription model and includes security features like rate limiting, CSP, and input sanitization. Engagement tools comprise gamification and a Content Studio. User features offer daily healing reminders, voice affirmations, and an AI companion. Admin tools provide dashboards, and content is organized via a Learning Hub. The `/growth` page serves as a "Metacognition Mirror," displaying user tenure, mirror stats, dominant feelings from journal data, metacognitive invitations, and dynamic milestone cards. The "Peace Scape" surface (`/peacescape`) provides a sanctuary environment. A `CustomizerPanel` allows authenticated users to save personalization choices, with guests able to preview locally. An `InteractiveBuddy` wrapper enables users to cycle through positive expressions.

### System Design Choices
Drizzle ORM is used with a Neon PostgreSQL database. Production security includes CORS allowlisting, JWT authentication, Helmet, and rate limiting. An observability layer provides health and system endpoints. A `Prompt-OS Execution Prompt Library` ensures canonical prompt modules validated against `promptspec.schema.json`. Production readiness features include a 503 readiness gate, health probes, telemetry parity, request tracing, and hardened administration access governed by a `CHANGE_GATE` protocol. The platform includes a layered self-healing stack for automated monitoring, diagnosis, and repair, accessible via admin endpoints and including AI-driven diagnosis.

### Admin Live Metrics — Real Backend Wiring (v1.18)
Replaced the prior Math.random-walk realtime simulation in `client/src/pages/Admin.jsx::OverviewSection` with real backend data. New module-scope `fetchAdminMetric(url)` helper builds an ordered, deduped candidate-token list (`localStorage.mmhb_token` first, `sessionStorage.adminSessionToken` second) and tries each in turn, retrying with the next candidate ONLY on 401/403 — preserves AdminGuard's dual-proof model (admin role JWT OR verified admin session can both reach metrics) without leaking either token. Realtime state shape was rebuilt as `{uptimeMin, memoryMB, dbLatencyMs, errorRatePct}` (all nullable) plus a `metricsError` boolean. An 8s poller calls `Promise.all([GET /api/admin/health, GET /api/admin/health-deep?format=json])` and maps live values: `uptimeMin = floor(health.uptime.seconds/60)`, `memoryMB = round(health.memory.heapUsedMB)`, `dbLatencyMs = health.database.latencyMs`, `errorRatePct = (deep.totals.fail / (pass+warn+fail)) × 100`. The 4 `RealtimeMetric` tiles were renamed Uptime/Memory/DB Latency/Error Rate, render "Not available" when null (no fake data), and the Error Rate tile only flips to rose color when value > 5%. Two banners sit above the tile grid: a rose `Unable to load system metrics.` banner when `metricsError`, and a sage `Loading system metrics...` banner with `motion-reduce:animate-none` spin icon when all 4 fields are still null. `metricsError` is threaded explicitly into `OverviewSection({stats, realtimeData, metricsError = false})` via the parent call site so the banner JSX never throws ReferenceError. The engagement heatmap intentionally retains its decorative `Math.random` cell intensity but now carries an italic `text-heatmap-disclaimer` caption: *"This is a sample visualization (real-time hourly data not yet connected)."* — honest disclosure per the no-fake-metrics policy, without destroying the existing visual. The heatmap grid itself is now `aria-hidden="true"` since it carries no real semantic data. SystemSection's other hardcoded display strings (out of scope this turn) were not touched. All 8 Buddy contract gates continue to PASS; verified live: `/api/admin/health` returns real uptime/memory/dbLatency, `/api/admin/health-deep?format=json` returns real probe totals, no-token→401, admin-JWT→200, user-JWT→403.

### Admin Command Center — Operations Tab (v1.17)
Added a 7th "Operations" tab to `/admin` (Admin.jsx) backed by a new `client/src/components/admin/OperationsPanel.jsx` with four panels — AI Telemetry, Deployment Readiness, Health Checks, Self-Healing Controls — using the canonical `apiFetch` token-aware client. Shape contracts (verified against live curl output): **AI Telemetry** consumes `GET /api/admin/health-deep/metrics?format=json` (the `?format=json` query is critical — default is Prometheus text/plain) and surfaces `verdict`, `aiDiagnosesTotal`, `aiSafetyFilteredTotal`, `selfHealRunsTotal`, `mttrMs`, `aiPromptVersion`, `alerts.{firing,total,critical}`, `generatedAt`. **Health Checks** consumes `GET /api/admin/health-deep` and flattens `categories.<name>.checks[]` into a failing-first ordered list (FAIL→WARN→PASS rank), with totals summary tiles. **Deployment Readiness** uses public probes `/health/ready` (503 readiness gate) + `/health/detailed`. **Self-Healing Controls** wires the scheduler pause/resume and manual self-heal triggers to existing endpoints (`POST /api/admin/health-deep/self-heal`, `POST /api/admin/health-deep/scheduler/{pause,resume}`) with an inline two-step confirm UX before spawning the heal-self.mjs script. All panels share `PanelHeader` + `PanelBodyState` (loading/error/empty/retry) primitives and a `StatusDot` with sr-only text labels (not color-only) for accessibility. Mobile-responsive via `grid-cols-1 sm:grid-cols-3` summary tiles + `xl:grid-cols-2` outer panel layout. Surgical integration: only 3 lines added to Admin.jsx (import, NAV_ITEMS entry, tabpanel block); the existing 1272-line auth/verify-session flow + 6 prior tabs were not touched. server/routes/admin.mjs not modified. All 8 Buddy contract gates continue to PASS.

### Frontend Session Persistence Fix (v1.16)
Discovered + fixed a session-persistence root cause: `npm run dev` runs `server/app.mjs` (not `server/index.mjs`), and `app.mjs` was not registering the Replit-integrations auth routes — so `GET /api/auth/user` returned a 404 HTML page. `client/src/context/AuthContext.jsx::fetchReplitUser()` polls this endpoint to hydrate `user` (including `role`) on every cold load; the 404 left AuthContext relying solely on the localStorage fallback (`mmhb_user`), which broke role-aware behavior on page refresh and contributed to admin redirect symptoms. Fix: imported `registerAuthRoutes` in `server/app.mjs` and called `registerAuthRoutes(app)` immediately after `app.use("/api/auth", authRoutes)` so the explicit `/api/auth/user` handler is registered. The handler (at `server/replit_integrations/auth/routes.mjs:13`) supports both Replit OIDC sessions and JWT Bearer tokens, looking up the canonical user via `authStorage.getUser(id)` so `role` is sourced from the database (not just the JWT claims). Verified: 404 → 200 with `null` body for unauth, 200 with user object for valid token. `client/src/lib/api.ts` was simultaneously upgraded from a 463-byte stub (anonymous `aiChat`/`aiHistory` calls) to a canonical token-aware client exporting `apiFetch`, `getAuthToken`, `setAuthToken`, `clearAuthToken` — all reading the same `mmhb_token` localStorage key as `queryClient.js` and `AuthContext.jsx`. The existing `aiChat` and `aiHistory` API surface is preserved but now routed through `apiFetch`, so authenticated AI calls finally carry user identity. `queryClient.js::apiRequest` already attached tokens correctly and was left untouched.

### Canonical Admin Auth Chain (v1.15)
The platform now exposes a curl-testable canonical auth chain at `GET /api/admin/dashboard` (server/routes/admin.mjs). It composes the platform's standard middleware: `requireAuth` (server/middleware/requireAuth.mjs — verifies Bearer JWT via `verifyAccessToken`, attaches `req.user`) → `requireAdmin` (server/middleware/requireAdmin.mjs — enforces `req.user.role === "admin"`). Verified behaviors: 401 on missing token, 401 on invalid token, 403 on authenticated-but-non-admin, 200 with `{ ok, message, user: { id, email, role }, timestamp }` on admin token. The pre-existing inline `requireAuth` function in admin.mjs is preserved (used by ~20 existing routes); the new endpoint is additive only. JWT payloads already embed `role` via both `signUserToken` (server/middleware/auth.mjs) and `issueAccessToken` (server/services/tokens.mjs). Other middleware (`requireRole.mjs`, `rbac.mjs`) are intentionally retained — `rbac.mjs` is consumed by `ai.healing.mjs` + `ai.business.mjs` for engine-audience routing and is NOT redundant. `Login.jsx` now performs role-aware post-login routing via a shared `landingPathFor(user)` helper: admin/staff land on `/admin`, everyone else on `/dashboard`. Applied to both the post-mount redirect (already-authenticated users) and the successful-login redirect.

### Layout Architecture (Phase 1 polish, v1.14)
Direct-routed public pages (those that bypass `PageTemplate` / `SacredLayout` / `WellnessPageShell`) use the canonical `PageLayout` wrapper at `client/src/components/layout/PageLayout.jsx`. It bundles `SacredNav` (top) + a centered max-width content region + `SafetyFooter` (bottom, with crisis link), so previously "orphan" surfaces (notably `/affirmations`) now share the same nav + safety footer as the rest of the platform. `PageLayout` intentionally uses a `<div>` (not a second `<main>`) because `App.jsx` already provides the semantic `<main id="main-content">`. `SacredNav` was simultaneously fixed for Wouter v3 (removed nested `<a>` inside `<Link>`, which was a latent hydration bug) and extended with two new public links — Blog and Pricing — alongside auth-only Journal/Dashboard items. BuddyAvatar's eye-blink animation (`buddyEyeBlink`, ~9s cycle) was gated to non-`motion=steady` states so the crisis presentation inherits a motionless, present gaze, preserving the "calm, unbroken presence" safety contract. All 8 Buddy contract gates continue to PASS post-change.

## External Dependencies

-   **OpenAI API**: AI chat therapy.
-   **Vite**: Frontend build tool.
-   **TypeScript**: Language.
-   **React**: Frontend UI library.
-   **Wouter**: Client-side routing.
-   **React Hook Form**: Form management.
-   **Zod**: Runtime type validation.
-   **Tailwind CSS**: Styling framework.
-   **Lucide React**: Icons.
-   **Node.js**: Backend runtime.
-   **Express**: Backend web framework.
-   **Express Session**: Session management.
-   **CORS**: Cross-Origin Resource Sharing middleware.
-   **Helmet**: Security headers middleware.
-   **Compression**: Response compression middleware.
-   **Morgan**: HTTP request logger middleware.
-   **Sentry**: Error tracking and performance monitoring.
-   **Drizzle ORM**: Database interactions.
-   **Neon PostgreSQL**: Primary database.
-   **Stripe**: Billing and payment processing.
-   **Replit Auth**: User authentication.
-   **Resend**: Transactional email service.
-   **Perplexity**: Factual AI.