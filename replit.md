# MyMentalHealthBuddy by The Genuine Love Project

## Overview
MyMentalHealthBuddy (MMHB) is an AI-powered mental wellness platform by The Genuine Love Project. It aims to foster self-love, healing, and emotional growth through AI-assisted guidance, mood tracking, journaling, and crisis support. The platform integrates AI with trauma-informed psychological principles to provide ethical, accessible, and personalized mental health support globally, striving to reduce stigma and empower individuals. The business vision is to make mental wellness support accessible, ethical, and personalized, leveraging AI to foster self-love and emotional growth. The project ambition is to become a leading global platform for mental wellness, empowering individuals and reducing stigma around mental health.

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
The frontend uses a Canva-inspired design with HSL color formatting, custom typography, enhanced gradients, and refined shadows, supporting light/dark themes and WCAG AA accessibility via an "Aurora Token System." A "Buddy Engine" provides a visual companion, displaying state-driven visual changes. The landing page uses NLP-informed emotional journeys. A `glp-pane` primitive ensures UI consistency, and `CustomizerPanel` allows user personalization. An `InteractiveBuddy` wrapper enables positive expression cycles. The platform includes five additive React pages for Discernment, Protocols, Biometrics, and Admin, along with two marketing pages. A public tools directory at `/tools/all` lists every self-paced tool. Eight interactive, client-side wellness tools are provided for anxiety, mood, cognitive distortion, breath pacing, boundary building, manipulation detection, sleep quality, and nervous system state, each including a `/crisis` link, educational disclaimers, dark-mode classes, WCAG-AA radio fieldsets, and a SafetyFooter.

The Lumi Design System v2.0 is an additive visual system with new tokens, typography, and dark-mode mapping. The Lumi mascot, brand-logo lockup, and Genuine Love Project mandala are rendered from canonical PNG artwork. Components include 8 button variants, 9 link types (including `lumi-link-crisis`), `lumi-card` with hover lift, motion utilities (breathe, float, shimmer, scroll-reveal), and a11y helpers. A `useBuddyEmotion` hook maps context to emotion. A showcase route `/lumi-design-system` demonstrates all tokens, components, and mascot states, including a `/crisis` link. All motion respects `prefers-reduced-motion`.

### Technical Implementations
The project uses a monorepo architecture with React 18 (TypeScript, Vite) for the client and Node.js/Express (TypeScript) for the server, offering a RESTful API with security and session management. It features a trauma-informed NLP layer and a "Wellness Microcopy Library." A Dual-Engine AI Prompt Architecture separates user-facing and administrative engines, supported by a self-evolving prompt registry. Core orchestration includes RBAC, crisis-first intent routing, PII redaction, structured event logging, and a Self-Tuning Fallback Library. The system performs subtle-emotion inference, adaptive response policies, an intervention module router with eight evidence-backed modules and seven micro-exercises, and a `user_feedback` signal-capture loop. Unified crisis detection short-circuits to appropriate responses. Authentication uses JWTs. An Admin Command Center provides an operations console with an "SOP Monitor." Production hardening includes rate limiting and database schema consistency checks. PWA cache hygiene is managed by a versioned service worker.

An "Awareness Detection Pipeline" uses a three-layer ensemble (RuleMatcher, MLClassifier stub, LLMReasoner) for detecting manipulation, distortion, and fallacies, supporting `POST /detect` and `POST /report`. It integrates with `POST /api/ai/chat` via `scanLayer1Middleware`.

The "Agent Orchestrator" is a pure-JS deterministic state machine for AI agent invocation, with actions recorded in an `agent_decisions` audit log and a three-tier memory abstraction (Hot, Warm, Cold). It includes `agentState.mjs` for state management, `agentEscalation.mjs` for confidence-based promotion to approval, `constitutionalGate.mjs` for enforcing five inviolable rules, and `agentWorkingMemory.mjs` for Redis-backed scratchpad with fallback.

The "Consciousness OS Foundation Primitives" establish persistence and audit with Drizzle tables for `agent_registry`, `agent_decisions`, and `content_scores`.

A "Biometric Ingestion Pipeline" adds opt-in nervous-system telemetry, creating Drizzle tables for `biometric_connections`, `biometric_readings`, and `nervous_system_states`. Data is AES-256-GCM encrypted at rest. OAuth integrations for Oura, Google Fit, and Whoop are supported, along with Apple HealthKit via HMAC-signed iOS companion webhook, and manual self-report.

The "Discernment Tutor" is an awareness-training belt ladder layered over the awareness detection pipeline. It uses Drizzle tables for `discernment_lessons`, `discernment_user_progress`, and `discernment_attempts`, seeded with sixteen scenario-based lessons.

The "Protocol Execution Engine" is a deterministic state-machine walker over therapeutic-protocol DAGs. Drizzle tables for `protocol_registry`, `protocol_sessions`, and `outcome_measures` are seeded with ten evidence-informed protocols. The `ProtocolExecutor` class handles various node types, administers PHQ-9/GAD-7, and escalates immediately on PHQ-9 item 9.

An SEO content generation script (`scripts/generate-seo-content.mjs`) drafts trauma-informed blog posts to the `blog_posts` table as drafts.

### Feature Specifications
Core features include AI-powered Chat Therapy, Wellness Tools (State Tracker, Journal Prompts), and specialized APIs. The platform supports a four-tier subscription model and includes security features like rate limiting, CSP, and input sanitization. Engagement tools comprise gamification and a Content Studio. User features offer daily healing reminders, voice affirmations, and an AI companion. Admin tools provide dashboards. The `/growth` page serves as a "Metacognition Mirror." The "Peace Scape" surface (`/peacescape`) provides a sanctuary environment.

### System Design Choices
Drizzle ORM is used with a Neon PostgreSQL database. Production security includes CORS allowlisting, JWT authentication, Helmet, and rate limiting. An observability layer provides health and system endpoints. A `Prompt-OS Execution Prompt Library` ensures canonical prompt modules. Production readiness features include a 503 readiness gate, health probes, telemetry parity, request tracing, and hardened administration access governed by a `CHANGE_GATE` protocol. The platform includes a layered self-healing stack for automated monitoring, diagnosis, and repair, accessible via admin endpoints and including AI-driven diagnosis. Direct-routed public pages use the `PageLayout` wrapper for consistent navigation and safety footers.

Autoscale deployment uses split build/run phases to optimize cold-start times. Observability is handled by OpenTelemetry tracing and PagerDuty alerting. PagerDuty triggers are wired at critical failure points. Admin Command Center panels are wrapped in `<SafeBoundary>` for error isolation. The admin session token is securely attached for same-origin admin API calls. The global `ErrorBoundary` provides conditional technical details for development or admin users. The `LumiMascot` is implemented with PNG-targeted animations respecting `prefers-reduced-motion`.

Lumi mascot containers across `client/src/components/Header.jsx`, `client/src/pages/Home.jsx`, and `client/src/pages/CanvaLanding.jsx` (header logo + footer logo + hero) had `overflow:hidden` set on small fixed-size square wrappers (40–60px), which clipped the PNG's ears, heart-glow halo, and breathing-scale animation. Each wrapper was switched to `overflow:visible` and (where appropriate) bumped one size step so the mascot has breathing room without redrawing the badge. The CanvaLanding hero section (which is the actual `/` route) previously rendered text only — a prominent ~208px Lumi was added inside a sage radial-glow container with `data-testid="container-hero-mascot"` placed before the eyebrow badge, additively, without restructuring the existing hero text/CTA/stat-card layout. The admin Command Center's `OperationsPanel` referenced an undefined `RouteStatusPanel`, which was crashing the Operations tab; a real implementation was added in the same file that probes five known endpoints (`/api/health`, `/api/admin/health`, `/api/auth/me`, `/api/kernel/health`, `/api/email/health`) using raw `fetch` (so non-2xx status codes can be classified rather than thrown) but forwarding the same `Authorization: Bearer` header that `apiFetch` would attach, so admin-only probes do not false-warn with 401/403. The admin rate limiter in `server/app.mjs` was split into two: `adminLoginLimiter` (strict, IP-keyed, 10/min) is mounted only on the public `POST /api/admin/verify-token` entrypoint to keep brute-force surface tight, while `adminLimiter` (relaxed, identity-keyed via `user.id → user.email → ipKeyGenerator(req.ip)`, 120/min) is mounted on the authenticated admin dashboard sub-routers — which fan out to 8–12 panel queries on first paint and previously tripped 429s on every cold load — and runs after `requireAuth` so identity keying is reliable.

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
-   **Oura**: Biometric data integration.
-   **Google Fit**: Biometric data integration.
-   **Whoop**: Biometric data integration.
-   **Apple HealthKit**: Biometric data integration (via webhook).
-   **PagerDuty**: Alerting and incident management.
-   **Redis**: Agent working memory (optional).