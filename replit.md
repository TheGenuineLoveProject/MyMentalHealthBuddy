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
The frontend features a Canva-inspired design with HSL color formatting, custom typography, enhanced gradients, and refined shadows. It supports light/dark themes, micro-interactions, and WCAG AA accessibility through a design token system ("Aurora Token System"). The "Buddy Engine" visual companion renders alongside the AI Chat orchestrator, featuring a screen-face robot design with state-driven visual changes. The landing page uses an NLP-informed emotional journey structure. A reusable `glp-pane` primitive ensures consistent UI element styling.

### Technical Implementations
The project uses a monorepo structure with React 18 (TypeScript, Vite) for the client and Node.js/Express (TypeScript) for the server, offering a RESTful API with security and session management. It features a trauma-informed NLP layer and a "Wellness Microcopy Library." A Dual-Engine AI Prompt Architecture separates user-facing and administrative engines with strict data boundaries, supported by a self-evolving prompt registry. Core orchestration includes RBAC, crisis-first intent routing, PII redaction, structured event logging, and a Self-Tuning Fallback Library for offline scenarios. The system incorporates subtle-emotion inference, an adaptive response policy, an intervention module router with eight evidence-backed modules and seven micro-exercises, and a lightweight `user_feedback` signal-capture loop. Crisis detection is unified and short-circuits to appropriate responses. The application bootstraps its database schema at boot. Authentication handles user registration and login, storing JWTs in local storage and ensuring CSRF exemption for specific auth endpoints. An Admin Command Center provides an operations console with strict authentication and authorization for administrative tasks.

### Feature Specifications
Core features include AI-powered Chat Therapy, Wellness Tools (State Tracker, Journal Prompts), and specialized APIs. The platform supports a four-tier subscription model and includes security features like rate limiting, CSP, and input sanitization. Engagement tools comprise gamification and a Content Studio. User features offer daily healing reminders, voice affirmations, and an AI companion. Admin tools provide dashboards, and content is organized via a Learning Hub. The `/growth` page serves as a "Metacognition Mirror," displaying user tenure, mirror stats, dominant feelings from journal data, metacognitive invitations, and dynamic milestone cards. The "Peace Scape" surface (`/peacescape`) provides a sanctuary environment. A `CustomizerPanel` allows authenticated users to save personalization choices, with guests able to preview locally. An `InteractiveBuddy` wrapper enables users to cycle through positive expressions. An additive admin panel, "SOP Monitor" (v1.1, Apr-26), proves every feature works entry→process→output→verify→evolve, with a single source of truth at `docs/SOP_FEATURE_MAP.md`. Read-only sub-router `server/routes/sop.mjs` mounted at `/api/admin/sop` (in `ADMIN_SUB_ROUTERS`, `adminLimiter → requireAuth → requireAdmin`); exposes `GET /status` (~17 parallel checks via dispatching runner — HTTP probes via `fetch` to `127.0.0.1:${PORT}` with 3s `AbortController` timeout, plus static in-process inspections — returns `{ok, totalChecks, passing, warning, failing, coveragePct, checks[], nextFix, meta}`) and `GET /checks` (cheap CHECKS list for skeleton render). Security guard: a `protected:true` route returning 2xx without auth is reported FAIL (regression test for accidental auth bypass). Frontend panel `client/src/components/admin/SOPMonitorPanel.jsx` (TanStack Query v5, dual-token fetch matching Admin.jsx) renders summary cards + grouped tables by domain + "What to fix next" callout + retry + opt-in 15s auto-refresh (`htmlFor`/`id` paired for click-target a11y). **v1.1 extension**: added `type:"static"` check kind for source/config invariants that aren't HTTP-probable. First static check `csrf-middleware-active` reads `server/app.mjs`, regex-detects `app.use(csrfProtection())` (fixed) vs `app.use(csrfProtection)` (buggy factory-as-middleware), reports WARN with full remediation hint and "advisor: do NOT fix yet" annotation — **tracked technical debt, intentionally surfaced but not actioned** until a planned release addresses it (CSRF cookies are still issued correctly on safe methods, so the visible client flow looks intact). To add another static check: append a `CHECKS` entry with `type:"static"` and async `staticCheck()` returning `{status, message, endpoint}`.

**Round 3 (Apr-26)** — full-feature mount + auth refresh/logout:
- **Orphan router mount**: 63 dormant `server/routes/*.mjs` files mounted via `EXTENDED_ROUTES` table in `server/app.mjs` (boot log: `extended routes mounted: 101/101`); each entry declares `{mount, file, auth: 'optional'|'required'|'admin'|'adult', limiter?}` and is wrapped with `optionalAuth | requireAuth | requireAuth+requireAdmin` accordingly. 4 conflict-suspect orphans (login, mfa, accountActions, system) and 11 dormant routers remain unmounted pending review.
- **SOP Monitor extended to 24 checks** (was 17): added 5 HTTP checks (`auth-refresh`, `auth-logout`, `auth-github`, `wellness-tools`, `ai-dashboard`) and 1 static check (`canva-oauth-deferred`). Static check reads `server/app.mjs` and confirms the canva-oauth route remains commented out — flips to FAIL if remounted prematurely.
- **Auth refresh + logout** (`server/routes/auth.mjs`): `POST /api/auth/refresh` issues a new 7-day JWT for an authenticated caller; hardened with `REFRESH_WINDOW_MS=24h` sliding-window guard that rejects calls when current token still has >24h remaining (anti-spam). `POST /api/auth/logout` returns trauma-informed acknowledgment (client clears local JWT — server is stateless). Both require `requireAuth`.
- **Security fixes from architect review** (committed Round 3):
  1. **IDOR closed** in `server/routes/wellness-tools.mjs`: `PATCH/DELETE /boundaries/:id` now use `and(eq(id), eq(userId))` so users cannot mutate other users' boundary scripts.
  2. **`/api/perplexity` gate hardened** from `optional` → `required` to prevent anonymous LLM cost burn.
  3. **Canva OAuth unmounted** in `server/app.mjs` (~line 343, commented out) because `/verify-token` decoded JWTs without signature verification (no JWKS). Tracked as the `canva-oauth-deferred` static SOP check; remount blocked until JWKS verifier is added.
- **Tracked debt (NOT release blockers)**: (a) `csrf-middleware-active` factory-as-middleware bug (CSRF cookies still issue correctly on safe methods); (b) `/api/auth/refresh` lacks absolute session lifetime cap — current 24h sliding-window guard slows but does not stop indefinite extension of a stolen valid token, follow-up to add `origIat`/session-start claim with 30-day max + opaque DB-backed rotation; (c) admin-* SOP probes occasionally trip `adminLimiter` (visible as 9 WARNs during /status), accepted as operational noise.

### System Design Choices
Drizzle ORM is used with a Neon PostgreSQL database. Production security includes CORS allowlisting, JWT authentication, Helmet, and rate limiting. An observability layer provides health and system endpoints. A `Prompt-OS Execution Prompt Library` ensures canonical prompt modules validated against `promptspec.schema.json`. Production readiness features include a 503 readiness gate, health probes, telemetry parity, request tracing, and hardened administration access governed by a `CHANGE_GATE` protocol. The platform includes a layered self-healing stack for automated monitoring, diagnosis, and repair, accessible via admin endpoints and including AI-driven diagnosis. Direct-routed public pages use the `PageLayout` wrapper for consistent navigation and safety footers.

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