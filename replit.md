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
The frontend features a Canva-inspired design with HSL color formatting, custom typography, enhanced gradients, and refined shadows. It supports light/dark themes, micro-interactions, and WCAG AA accessibility through a design token system ("Aurora Token System"). The "Buddy Engine" visual companion renders alongside the AI Chat orchestrator, featuring a screen-face robot design with state-driven visual changes. The landing page uses an NLP-informed emotional journey structure. A reusable `glp-pane` primitive ensures consistent UI element styling. `CustomizerPanel` allows authenticated users to save personalization choices, with guests able to preview locally. An `InteractiveBuddy` wrapper enables users to cycle through positive expressions.

### Technical Implementations
The project uses a monorepo structure with React 18 (TypeScript, Vite) for the client and Node.js/Express (TypeScript) for the server, offering a RESTful API with security and session management. It features a trauma-informed NLP layer and a "Wellness Microcopy Library." A Dual-Engine AI Prompt Architecture separates user-facing and administrative engines with strict data boundaries, supported by a self-evolving prompt registry. Core orchestration includes RBAC, crisis-first intent routing, PII redaction, structured event logging, and a Self-Tuning Fallback Library for offline scenarios. The system incorporates subtle-emotion inference, an adaptive response policy, an intervention module router with eight evidence-backed modules and seven micro-exercises, and a lightweight `user_feedback` signal-capture loop. Crisis detection is unified and short-circuits to appropriate responses. The application bootstraps its database schema at boot. Authentication handles user registration and login, storing JWTs in local storage and ensuring CSRF exemption for specific auth endpoints. An Admin Command Center provides an operations console with strict authentication and authorization for administrative tasks, including an "SOP Monitor" to verify feature functionality and identify issues. Production hardening includes `app.set("trust proxy", 1)` for accurate rate limiting and `ensureSchema.mjs` for database schema consistency. PWA cache hygiene is managed by a versioned service worker (`service-worker.js`) that uses a dynamic `BUILD_ID` and network-first strategy for HTML to prevent stale content, along with cache-first for immutable assets.

### Recent UX Polish (Round 4.2)
Surgical operations-mode fixes addressing iPad screenshot defects: removed raw URL display from `RelatedLinksBlock` (replaced with arrow indicator); restored the rich `FAQPage.jsx` routing (file had a corrupted `FAQItem` wrapping accordion rows in `WellnessPageShell` plus a stray closing tag — repaired to clean accordion-row primitive, route `/faq` switched from `ConfigRoute` teaser to lazy-loaded `FAQPage`); added `id="faq-list"` anchor with `scroll-mt-24` for deep-link scroll; updated routes.js `Browse FAQ` href from `#faq` to `/faq#faq-list`; removed duplicate "Stay Connected" header from both `SacredFooter.jsx` variants (newsletter component is self-headed); upgraded Box Breathing step badges to gradient amber-300→500 with white text + ring + shadow; enriched Start.tsx `TOOL_BUTTONS` cards with description + duration metadata, redesigned card render with icon tile + duration pill + multi-line layout.

### Link/Button Audit (Round 4.3)
Performed full A→Z 360° link/button audit: scanned 113 unique frontend link targets (108 literal `href="/..."` from JSX + 33 path-style hrefs from `routes.js` content) against 976 registered routes in `App.jsx`. Found and fixed:
1. `/account/settings` was referenced 3× in `client/src/content/routes.js` (1 ConfigRoute definition + 2 "Back to Settings" secondary CTAs) but was never registered. Consolidated: ConfigRoute definition → `/account` (which redirects to canonical `/settings` hub); both "Back to Settings" hrefs → `/settings`.
2. `client/src/pages/CrisisResources.jsx` had "Back to Dashboard" → `/dashboard` — auth-protected route would bounce unauthenticated crisis-state visitors to `/login`. Critical UX/safety regression. Changed to "Back to Home" → `/` (mirrors the FAQ fix from Round 4.2). Architect rated this fix HIGH severity. False-positive audit residuals: `/api/logout` (valid backend endpoint in replitAuth.mjs) and `/blog/welcome-to-genuine-love` (matches registered `/blog/:slug` parameterized route).

### Connection-Recovery + Admin Tools Wiring Audit (Round 4.4)
Two surgical, additive fixes addressing iPad screenshot defects:

1. **Start.tsx "Try again" recovery**: The /start surface's `runTool()` catch block displayed a generic "Connection problem" message with no recovery path when /api/ai/chat threw (transient network blip / OpenAI timeout / cold-start). Added `lastAttemptRef` (useRef) capturing `{id, message}` immediately before the fetch, and a "Try again" button inside the existing rose-bordered error alert that re-invokes `runTool()` with the captured args. Button shows `RefreshCw` icon, disables during loading, and switches label to "Trying again…" with a spin animation. All existing flows preserved (crisis short-circuit, telemetry events, tool-completed latch).

2. **Admin tools wiring audit + 4 new router mounts**: Probed all 124 admin tool endpoints in `client/src/pages/admin/AdminTools.jsx` against the live server. Found 19 returning 404. Root-caused each by inspecting `EXTENDED_ROUTES` in `server/app.mjs` and the actual router files. Categories:
   - **4 intentionally security-deferred** (account-actions, canva-oauth, login, mfa) — left untouched per existing architect comments in `app.mjs`. The SOP correctly flags them as offline.
   - **12 wrong sub-paths or typos** in `AdminTools.jsx` — fixed each entry to point to a real GET handler (e.g., `/api/wellness-tools/all` → `/api/wellness-tools`, `/api/moods` → `/api/mood`, `/api/social-posts` → `/api/social/posts`, `/api/trauma-healing` → `/api/trauma-healing/grounding`, `/api/mind-body/daily` → `/api/mind-body/breathwork`, `/api/transformation` → `/api/transformation/stages`, `/api/consciousness` → `/api/consciousness/brave-action`, `/api/emotional-resilience/daily` → `/api/emotional-resilience`, `/api/metrics/summary` → `/api/metrics`, `/api/feed` and `/rss.xml` → `/api/feed/feed.xml`).
   - **4 router files mounted in `EXTENDED_ROUTES`** (`consciousness-expansion.mjs`, `mind-body-integration.mjs`, `transformation-engine.mjs`, `trauma-healing-protocols.mjs`) — added under the existing safe-mount try/catch loop (no overlap with locked AI/admin contracts). Boot log confirms `extended routes mounted: 104/104` (was 100/100).
   - **3 referenced files don't exist** (`healing-core`, `meaning-core`, `integration-health`) — repointed to nearest valid endpoint (`healing-modalities`, `meaning`, `health`).

Architect-caught false-positive: initial fix used `/feed/rss` which returned 200 only because the SPA catch-all served `index.html` (text/html). Corrected to `/api/feed/feed.xml` which returns `application/rss+xml`. Final probe of 117 unique endpoints: 79 → 200, 30 → 401, 3 → 403, 1 → 302, 4 → 404 (only the 4 intentionally-deferred). 96.6% wired correctly.

### Feature Specifications
Core features include AI-powered Chat Therapy, Wellness Tools (State Tracker, Journal Prompts), and specialized APIs. The platform supports a four-tier subscription model and includes security features like rate limiting, CSP, and input sanitization. Engagement tools comprise gamification and a Content Studio. User features offer daily healing reminders, voice affirmations, and an AI companion. Admin tools provide dashboards, and content is organized via a Learning Hub. The `/growth` page serves as a "Metacognition Mirror," displaying user tenure, mirror stats, dominant feelings from journal data, metacognitive invitations, and dynamic milestone cards. The "Peace Scape" surface (`/peacescape`) provides a sanctuary environment.

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