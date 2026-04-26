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
The frontend features a Canva-inspired design with HSL color formatting, custom typography, enhanced gradients, and refined shadows. It supports light/dark themes, micro-interactions, and WCAG AA accessibility through a design token system ("Aurora Token System"). The "Buddy Engine" visual companion renders alongside the AI Chat orchestrator, featuring a screen-face robot design with state-driven visual changes, maintaining existing CSS animation hooks and `prefers-reduced-motion` compliance. The landing page uses an NLP-informed emotional journey structure. A reusable `glp-pane` primitive ensures consistent UI element styling.

### Technical Implementations
The project uses a monorepo structure with React 18 (TypeScript, Vite) for the client and Node.js/Express (TypeScript) for the server, offering a RESTful API with security and session management. It features a trauma-informed NLP layer and a "Wellness Microcopy Library." A Dual-Engine AI Prompt Architecture separates user-facing and administrative engines with strict data boundaries, supported by a self-evolving prompt registry. Core orchestration includes RBAC, crisis-first intent routing, PII redaction, structured event logging, and a Self-Tuning Fallback Library for offline scenarios. The system incorporates subtle-emotion inference, an adaptive response policy (Phase 4 v1.20: 4–8 word validation-line cap, ONE-step-per-turn cap, 2–3 sentence reply cap when not mid-exercise, ban on generic reassurance phrases like "I'm here for you" with the phrase "you are not alone" allow-listed for crisis routing only, every reply must contain a concrete action OR a clear reframe, and 5 sharpened state-tone strings carrying directive cues — `server/ai/responsePolicy.mjs` only; crisis high-risk branch verified byte-identical), an intervention module router with eight evidence-backed modules and seven micro-exercises, and (Phase 4.5 v1.21) a lightweight `user_feedback` signal-capture loop — a single `FeedbackPrompt` widget (`client/src/components/FeedbackPrompt.tsx`) wired into `/start` (after the AI reply panel) and `/ai-chat` (on the most recent assistant message only) that posts `{type: "user_feedback", metadata: {surface, helpful, toolId, buddyState, turnId}}` to the existing `/api/telemetry/event` sink (added to the `aiTelemetry.mjs` allowlist; lands in `logs/events.jsonl`); fires only on explicit click (no impressions), zero AI behaviour change, trauma-informed wording ("Did this feel right?"), WCAG AA + prefers-reduced-motion safe. Phase 5 (v2.1 — Buddy Engine response-aligned reactions) adds a pure `mapResponseToBuddyState()` helper in `client/src/pages/Start.tsx` that interprets the emotional tone of the AI reply text and drives `buddyState` accordingly, slotted between the existing crisis/toolCompleted gates and the v1.5 tool/module mapping with priority order `crisis → responseState → toolState → baseline`; when the regex yields `calm` (no signal) the v1.5 `mapToBuddyState` fallback preserves prior tool attribution; emits a deduped `buddy_response_alignment` telemetry event (allowlisted in `aiTelemetry.mjs`) per unique reply text so the response-aligned states can be A/B-correlated against `user_feedback` thumbs in `logs/events.jsonl`; advisor's regex is implemented byte-exact (no word boundaries, original precedence) with known limitations documented inline (e.g. "breathe" doesn't substring-match "breathing"; "heavy" wins over "small step") for future Phase 5.1 tuning from real soft-launch data; `/api/ai/chat`, `responsePolicy.mjs`, orchestrator, memory, profile, and crisis logic are all untouched. Crisis detection is unified and short-circuits to appropriate responses. The application bootstraps its database schema at boot. Authentication handles user registration and login, storing JWTs in local storage and ensuring CSRF exemption for specific auth endpoints. An Admin Command Center provides an operations console with strict authentication and authorization for administrative tasks.

### Feature Specifications
Core features include AI-powered Chat Therapy, Wellness Tools (State Tracker, Journal Prompts), and specialized APIs. The platform supports a four-tier subscription model and includes security features like rate limiting, CSP, and input sanitization. Engagement tools comprise gamification and a Content Studio. User features offer daily healing reminders, voice affirmations, and an AI companion. Admin tools provide dashboards, and content is organized via a Learning Hub. The `/growth` page serves as a "Metacognition Mirror," displaying user tenure, mirror stats, dominant feelings from journal data, metacognitive invitations, and dynamic milestone cards. The "Peace Scape" surface (`/peacescape`) provides a sanctuary environment. A `CustomizerPanel` allows authenticated users to save personalization choices, with guests able to preview locally. An `InteractiveBuddy` wrapper enables users to cycle through positive expressions.

### System Design Choices
Drizzle ORM is used with a Neon PostgreSQL database. Production security includes CORS allowlisting, JWT authentication, Helmet, and rate limiting. An observability layer provides health and system endpoints. A `Prompt-OS Execution Prompt Library` ensures canonical prompt modules validated against `promptspec.schema.json`. Production readiness features include a 503 readiness gate, health probes, telemetry parity, request tracing, and hardened administration access governed by a `CHANGE_GATE` protocol. The platform includes a layered self-healing stack for automated monitoring, diagnosis, and repair, accessible via admin endpoints and including AI-driven diagnosis. Direct-routed public pages use the `PageLayout` wrapper for consistent navigation and safety footers.

### Deployment Hygiene
- **Service worker cache version**: `client/public/serviceWorker.js` defines `CACHE_VERSION` (currently `'2.1.0'`). **Bump this string on every meaningful frontend release** — the SW cache key is built from it, and the activate handler only deletes caches with *different* names. If you ship new code without bumping, every existing user keeps the old cached HTML/JS forever (the v2.0 → v2.1 deploy hit this exact bug). Match the version to the release tag (v2.1 → `'2.1.0'`, v2.2 → `'2.2.0'`, etc.).
- **Production server entrypoint is `server/app.mjs`** (per `package.json` `start` + `dev` scripts and `.replit` deployment run command). `server/index.mjs` and `server/dev.mjs` are NOT entrypoints — they exist as historical references with their own (overlapping but non-authoritative) route maps. **Any new admin or feature router must be wired into `server/app.mjs`** or it will silently 404 in production even if the file exists in `server/routes/`. The Apr-26 `Phase 5.1` admin-route audit found 5 admin sub-routers (`/api/admin/social`, `/social/enterprise`, `/security`, `/audit-logs`, `/soft-launch-metrics`) that lived only in the dead `index.mjs` route map; they are now safe-mounted in `app.mjs` (try/catch per-router, `adminLimiter → requireAuth → requireAdmin`, with `/social/enterprise` mounted *before* `/social` so Express's first-match routing resolves the more-specific path first). Boot logs print `[boot] admin sub-routers mounted: N/M` for ops visibility.
- **Admin rate-limiter IPv6 normalisation**: `server/middleware/admin-rate-limit.mjs` now uses `ipKeyGenerator` from `express-rate-limit` for the unauthenticated IP fallback path (collapses IPv6 to /64 prefix so a malicious client cannot rotate the last 64 bits to bypass per-IP limits — closes `ERR_ERL_KEY_GEN_IPV6` boot warnings). Authenticated admins are still keyed by `req.user.id` → `req.user.email` first; only when both are absent does it fall through to the IPv6-safe IP key.
- **Custom domain vs Replit deployment URL — ALWAYS verify both before debugging "changes not showing"**: The canonical Replit deployment URL is `https://thegenuineloveproject.replit.app` (auto-provisioned by Autoscale). The user-facing custom domain is `thegenuineloveproject.com` and lives at the user's domain registrar — Replit does NOT control its DNS. **An Apr-26 incident burned ~15 hours debugging "stale UI / Unable to load admin panels" before discovering `thegenuineloveproject.com` had silently de-routed from the Replit deployment** (it was returning a generic web-host 404 page for every `/health`, `/api/*`, and `/serviceWorker.js` request, while the real deployment at `*.replit.app` was perfectly healthy and serving the latest code). The cached browser HTML on the custom domain made it look like the app was "partially updating" when it was really just frozen. **Always run a quick parity check before assuming a code/cache bug**: `curl -sS -o /dev/null -w "%{http_code} %{content_type}\n" https://thegenuineloveproject.replit.app/health` should return `200 application/json` — if the same call against the custom domain returns `404 text/html` or `405`, the domain is not routed to the deployment and no code change will help. Reconnect it via Replit Workspace → Deployments → Settings → Custom Domains, then update the registrar's DNS records exactly as Replit specifies (CNAME or A records), removing any conflicting old records pointing elsewhere.

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