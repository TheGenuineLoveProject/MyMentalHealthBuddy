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
The frontend features a Canva-inspired design with HSL color formatting, custom typography, enhanced gradients, and refined shadows. It supports light/dark themes, micro-interactions, and WCAG AA accessibility through a design token system. The landing page uses an NLP-informed emotional journey structure. CSS includes consciousness-expanding animations and an Enterprise Elite II Advanced Design System with scroll-triggered reveals and elite card designs, respecting `prefers-reduced-motion`. A dynamic Avatar SVG System provides a futuristic, multi-layered icon with embedded CSS animations. Branded elements emphasize an "Aurora Token System" for consistent visual effects. The "Buddy Engine" visual companion renders alongside the AI Chat orchestrator, featuring a screen-face robot design with state-driven visual changes, maintaining existing CSS animation hooks and `prefers-reduced-motion` compliance.

### Technical Implementations
The project is a monorepo with React 18 (TypeScript, Vite) for the client and Node.js/Express (TypeScript) for the server, offering a RESTful API with security and session management. It features a trauma-informed NLP layer and a "Wellness Microcopy Library." A Dual-Engine AI Prompt Architecture separates user-facing and administrative engines with strict data boundaries, supported by a self-evolving prompt registry. Core orchestration includes RBAC, crisis-first intent routing, PII redaction, structured event logging, and a Self-Tuning Fallback Library for offline scenarios. The system incorporates subtle-emotion inference, an adaptive response policy, and an intervention module router with eight evidence-backed modules and seven micro-exercises. Crisis detection is unified and short-circuits to appropriate responses. The application bootstraps its database schema at boot via `ensureSchema.mjs`. Authentication handles user registration and login, storing JWTs in local storage and ensuring CSRF exemption for specific auth endpoints. An Admin Command Center provides an operations console with strict authentication and authorization for administrative tasks, supporting two parallel proofs of admin identity, either of which grants entry: (1) a token-based admin session — `ADMIN_TOKEN` POSTed to `/api/admin/verify-token` returns a 4-hour JWT signed with `JWT_SECRET` (payload `{ role: "admin", timestamp }`) stored in `sessionStorage` as `adminVerified` + `adminSessionToken`; or (2) a regular authenticated user whose `role === "admin"`. `AdminGuard.jsx` validates the token-session first by re-calling `/api/admin/verify-session` (so an expired or revoked JWT cannot silently grant access), falls back to the role-check if no session token is present, clears stale `sessionStorage` on rejection to prevent loops, and on denial redirects to `/admin-login` (a dedicated token-entry page) — never to `/login`, which would dump token-only operators into the wrong auth surface. Critically, every admin route is wrapped in `<AdminGuard>` ONLY — never in `<ProtectedRoute>` outside `<AdminGuard>`. An earlier bug double-wrapped 9 admin sub-routes (`/admin/roles`, `/admin/feature-flags`, `/admin/alerts`, `/admin/feedback`, `/admin/narrative`, `/admin/engagement`, `/admin/analytics`, `/admin/users`, `/admin/tools`) as `<ProtectedRoute><AdminGuard>...</AdminGuard></ProtectedRoute>`, causing `ProtectedRoute` to fire first, see no regular logged-in user, and redirect token-based admins to `/login` before `AdminGuard` could check the admin session — silently breaking Command Center sub-page navigation. The outer `<ProtectedRoute>` has been removed from those 9 routes since `<AdminGuard>` already enforces both auth paths.

### Feature Specifications
Core features include AI-powered Chat Therapy, Wellness Tools (State Tracker, Journal Prompts), and specialized APIs. The platform supports a four-tier subscription model and includes security features like rate limiting, CSP, and input sanitization. Engagement tools comprise gamification and a Content Studio. User features offer daily healing reminders, voice affirmations, and an AI companion. Admin tools provide dashboards, and content is organized via a Learning Hub. The `/growth` page serves as a "Metacognition Mirror," displaying user tenure, mirror stats, dominant feelings from journal data, metacognitive invitations, and dynamic milestone cards. The "Peace Scape" surface (`/peacescape`) provides a sanctuary environment with a ZenScape backdrop, displaying the user's sanctuary palette, accessory, theme, and computed evolution stage. A `CustomizerPanel` lets authenticated users save palette, accessory, and theme. Guests can preview choices locally with a soft "sign in to remember" notice. An `InteractiveBuddy` wrapper lets users tap the sanctuary Buddy to cycle through positive expressions. The `ZenScape` backdrop is palette/theme/accessory aware, driving a CSS-variable cascade. An optional accessory glyph floats above Buddy. ZenScape additionally accepts an optional `stage` prop (1–6) that emits a `data-zen-stage` attribute on the root, revealing progressively more visuals from Seed Garden to Inner Cathedral. All Layer 5 animations (sparkle twinkle, stage-6 aura) are gated by `prefers-reduced-motion`. The homepage final-CTA section ("Your Buddy Is Ready. Are You?") and "Three Steps" cards have undergone visual refinements and accessibility fixes, including contrast adjustments and proper text decoration handling. The `/crisis` page has undergone a WCAG AA contrast remediation pass across all text elements and CTA buttons.

### System Design Choices
Drizzle ORM is used with a Neon PostgreSQL database. Production security includes CORS allowlisting, JWT authentication, Helmet, and rate limiting. An observability layer provides health and system endpoints. A `Prompt-OS Execution Prompt Library` ensures canonical prompt modules validated against `promptspec.schema.json`. Production readiness features include a 503 readiness gate, health probes, telemetry parity, request tracing, and hardened administration access governed by a `CHANGE_GATE` protocol.

### Self-Healing Tooling (A→Z 360°)
The platform ships a unified, non-destructive self-repair sweep accessible via `bash scripts/heal-all.sh`. The orchestrator runs three stages and rolls them up to a single verdict (HEALTHY / DEGRADED / NEEDS_REPAIR with exit codes 0/1/2):
- **Stage 1 — `scripts/heal-360.mjs`**: Comprehensive 5-category probe that emits PASS/WARN/FAIL with actionable repair hints per check. Categories: (1) Filesystem & Build assets, (2) Critical Env Coverage (presence-only — never values), (3) Database & Schema (live `SELECT 1` + `information_schema` table presence for `users`, `journals`, `moods`, `therapy_sessions`), (4) Runtime API (HTTP probes of `/api/health`, `/ready`, `/healthz`), (5) Contract Gates (re-runs `scripts/check-contract-routes.sh` and aggregates the 8 locked Buddy + route invariants).
- **Stage 2 — `scripts/autoheal-core.mjs`**: Existing safe-mode `platformSnapshot()` for filesystem topology sanity.
- **Stage 3 — `scripts/check-contract-routes.sh`**: Independent re-verification of the 8 contract gates.

For *active* repair (not just probing), `scripts/heal-repair.mjs` reads `docs/health-check-result.json` and prescribes — or with `--apply`, executes — safe fixes for known WARN/FAIL signatures. DRY-RUN by default; safe fixes (e.g. `npm run build` for missing build output) require `--apply`; destructive fixes (e.g. `npm run db:push --force` for missing tables) additionally require `--apply-destructive`. Manual-only items (env secrets, server restarts) are surfaced with action hints but never auto-executed. Recipe registry is extensible; each recipe declares `matches(check)`, `destructive`, and `command`.

The unified report persists to `docs/health-check-result.json` in a backwards-compatible flat-checks format alongside new `categories` + `totals` blocks. All probes are read-only; secrets are never logged or persisted.

### Inner Wellness Surfaces — Sanctuary Depth
The shared `WellnessPageShell` (used by `/journal`, `/mood`, `/state`, `/chat`, `/ai-chat`) carries a `wellness-shell` root class that activates `client/src/styles/wellness-shell.css`. The stylesheet adds: a subtle gold/sage radial backdrop fixed behind the page (z-index −1), refined sanctuary depth on the main content section (gradient bg, animated tri-color top accent bar, hover lift), refined quicknav pill hover (sage tint + soft elevation), and a serif gradient on the page title. Effects are scoped to `.wellness-shell` (no leak to other surfaces) and fully gated by `prefers-reduced-motion`.

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