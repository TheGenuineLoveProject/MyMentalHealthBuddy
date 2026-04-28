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
The frontend uses a Canva-inspired design with HSL color formatting, custom typography, enhanced gradients, and refined shadows, supporting light/dark themes and WCAG AA accessibility via an "Aurora Token System." A "Buddy Engine" provides a visual companion to the AI Chat orchestrator, displaying state-driven visual changes. The landing page uses an NLP-informed emotional journey. A `glp-pane` primitive ensures UI consistency, and `CustomizerPanel` allows user personalization. An `InteractiveBuddy` wrapper enables positive expression cycles. The platform includes five additive React pages for Discernment, Protocols, Biometrics, and Admin, along with two marketing pages. A public tools directory at `/tools/all` lists every self-paced tool with descriptions, categories, and time estimates, distinct from the gated `/tools` experience. Eight interactive, client-side wellness tools are provided for anxiety, mood, cognitive distortion, breath pacing, boundary building, manipulation detection, sleep quality, and nervous system state. Each tool includes a `/crisis` link, educational disclaimers, dark-mode classes, WCAG-AA radio fieldsets, and a SafetyFooter. Tool pages are integrated into the sitemap for SEO.

The Lumi Design System v2.0 is an additive visual system layered over existing components, including new tokens (sage/amber/stone scales, semantic emotion colors, gradients), typography, and dark-mode mapping. The Lumi mascot, brand-logo lockup, and Genuine Love Project mandala are rendered from canonical PNG artwork supplied by the brand owners (`mmhb_buddy_interactive_fullbody_*.png`, `mmhb_brand_logo_lockup_*.png`, `thegenuineloveproject_logo_v2_*.png`) imported via the `@assets` Vite alias. The previous hand-built SVG approximations have been replaced; component APIs (`emotion`, `size`, `variant`, etc.) are preserved so all consumers continue to work unchanged. Components include 8 button variants, 9 link types (including `lumi-link-crisis`), `lumi-card` with hover lift, motion utilities (breathe, float, shimmer, scroll-reveal), and a11y helpers. A `useBuddyEmotion` hook maps context to emotion (the `emotion` prop is preserved as a `data-emotion` attribute on the mascot wrapper for future per-emotion artwork swaps). A showcase route `/lumi-design-system` demonstrates all tokens, components, and mascot states, including a `/crisis` link. All motion respects `prefers-reduced-motion`.

### Technical Implementations
The project uses a monorepo architecture with React 18 (TypeScript, Vite) for the client and Node.js/Express (TypeScript) for the server, offering a RESTful API with security and session management. It features a trauma-informed NLP layer and a "Wellness Microcopy Library." A Dual-Engine AI Prompt Architecture separates user-facing and administrative engines, supported by a self-evolving prompt registry. Core orchestration includes RBAC, crisis-first intent routing, PII redaction, structured event logging, and a Self-Tuning Fallback Library. The system performs subtle-emotion inference, adaptive response policies, an intervention module router with eight evidence-backed modules and seven micro-exercises, and a `user_feedback` signal-capture loop. Unified crisis detection short-circuits to appropriate responses. Authentication uses JWTs. An Admin Command Center provides an operations console with an "SOP Monitor." Production hardening includes rate limiting and database schema consistency checks. PWA cache hygiene is managed by a versioned service worker.

An "Awareness Detection Pipeline" uses a three-layer ensemble (RuleMatcher, MLClassifier stub, LLMReasoner) for detecting manipulation, distortion, and fallacies, supporting `POST /detect` and `POST /report`. It integrates with `POST /api/ai/chat` via `scanLayer1Middleware` (read-only).

The "Agent Orchestrator" is a pure-JS deterministic state machine for AI agent invocation, with actions recorded in an `agent_decisions` audit log and a three-tier memory abstraction (Hot, Warm, Cold). It includes `agentState.mjs` for state management, `agentEscalation.mjs` for confidence-based promotion to approval, `constitutionalGate.mjs` for enforcing five inviolable rules (crisis routing, no diagnosis, no human impersonation, no payment requests, educational voice), and `agentWorkingMemory.mjs` for Redis-backed scratchpad with fallback.

The "Consciousness OS Foundation Primitives" establish persistence and audit with Drizzle tables for `agent_registry`, `agent_decisions`, and `content_scores`.

A "Biometric Ingestion Pipeline" adds opt-in nervous-system telemetry, creating Drizzle tables for `biometric_connections`, `biometric_readings`, and `nervous_system_states`. Data is AES-256-GCM encrypted at rest. OAuth integrations for Oura, Google Fit, and Whoop are supported, along with Apple HealthKit via HMAC-signed iOS companion webhook, and manual self-report.

The "Discernment Tutor" is an awareness-training belt ladder layered over the awareness detection pipeline. It uses Drizzle tables for `discernment_lessons`, `discernment_user_progress`, and `discernment_attempts`, seeded with sixteen scenario-based lessons.

The "Protocol Execution Engine" is a deterministic state-machine walker over therapeutic-protocol DAGs. Drizzle tables for `protocol_registry`, `protocol_sessions`, and `outcome_measures` are seeded with ten evidence-informed protocols. The `ProtocolExecutor` class handles various node types, administers PHQ-9/GAD-7, and escalates immediately on PHQ-9 item 9.

An SEO content generation script (`scripts/generate-seo-content.mjs`) drafts trauma-informed blog posts to the `blog_posts` table as drafts.

### Feature Specifications
Core features include AI-powered Chat Therapy, Wellness Tools (State Tracker, Journal Prompts), and specialized APIs. The platform supports a four-tier subscription model and includes security features like rate limiting, CSP, and input sanitization. Engagement tools comprise gamification and a Content Studio. User features offer daily healing reminders, voice affirmations, and an AI companion. Admin tools provide dashboards. The `/growth` page serves as a "Metacognition Mirror" displaying user tenure, stats, feelings, invitations, and milestone cards. The "Peace Scape" surface (`/peacescape`) provides a sanctuary environment.

### System Design Choices
Drizzle ORM is used with a Neon PostgreSQL database. Production security includes CORS allowlisting, JWT authentication, Helmet, and rate limiting. An observability layer provides health and system endpoints. A `Prompt-OS Execution Prompt Library` ensures canonical prompt modules validated against `promptspec.schema.json`. Production readiness features include a 503 readiness gate, health probes, telemetry parity, request tracing, and hardened administration access governed by a `CHANGE_GATE` protocol. The platform includes a layered self-healing stack for automated monitoring, diagnosis, and repair, accessible via admin endpoints and including AI-driven diagnosis. Direct-routed public pages use the `PageLayout` wrapper for consistent navigation and safety footers.

### Deployment Configuration
Autoscale deployment uses split build/run phases to optimize cold-start times. The run command `NODE_ENV=production NODE_OPTIONS='--import ./server/observability/preload.mjs' node server/app.mjs` ensures OpenTelemetry SDK preload. Required assets are committed in both `client/public/icons/` and `public/icons/`.

Observability is handled by OpenTelemetry tracing and PagerDuty alerting, integrated as an additive, no-op-safe layer under `server/observability/`. Tracing is loaded via `NODE_OPTIONS='--import ./server/observability/preload.mjs'`. Health probes are filtered from HTTP spans. The PagerDuty alerter logs warnings, dedups locally, dry-runs in non-prod unless forced, and pages only when `PAGERDUTY_ROUTING_KEY` is set in production. Safety-critical call sites use typed wrappers from `server/observability/safetyAlerts.mjs`. Admin-gated diagnostics are available at `/api/admin/observability/`.

Custom OpenTelemetry spans wrap high-value call sites via `server/observability/spans.mjs` (`withSpan`, `withCriticalSpan`, `setObservabilityBaggage`): `mmhb.crisis.route_check` (safety.critical=true) on the coping-plan crisis check, `mmhb.agent.invoke` on the v2 orchestrator, `mmhb.awareness.detect` on the three-layer pipeline, and `mmhb.protocol.respond` on protocol session responses. The `requestId` and `observabilityContext` middleware mount globally after `cookieParser` to stamp `request.id` baggage and hashed `enduser.id` / `session.id` on the active span (salted by `JWT_SECRET`). The unified `errorHandler` middleware mounts after the SPA fallback to record exceptions on the active span and fire `alertUncaught({kind:"http-500"})`. PagerDuty triggers are wired at: `process.on('uncaughtException'|'unhandledRejection')` (server boot), `ensureSchema` boot catch (`alertSchemaFailure`), Stripe webhook signature verification catch (`alertWebhookSignatureFailure`), v2 agent orchestrator constitutional gate violations (`alertConstitutionalViolation`, capped at 3/decision), and protocol PHQ-9 item-9 escalation persistence failure (`alertPHQ9EscalationFailure`). The `.env.example` documents `OTEL_*`, `PAGERDUTY_ROUTING_KEY`, `ALERTS_ENABLED`, `ALERTS_FORCE`, `ALERTS_DEDUP_MS` for operators.

The legacy `BuddyAvatar` mascot has been replaced with `LumiMascot` from the v2.0 design system in the global Header and Home page (nav badge + hero); other surfaces continue to use `BuddyAvatar` until they are migrated, since both renderers coexist additively without conflict.

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