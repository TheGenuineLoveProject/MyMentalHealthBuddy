# MyMentalHealthBuddy by The Genuine Love Project

## Overview
MyMentalHealthBuddy (MMHB) is an AI-powered mental wellness platform by The Genuine Love Project. It aims to foster self-love, healing, and emotional growth through AI-assisted guidance, mood tracking, journaling, and crisis support. The platform integrates AI with trauma-informed psychological principles to provide ethical, accessible, and personalized mental health support globally, striving to reduce stigma and empower individuals.

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
The frontend features a Canva-inspired design with HSL color formatting, custom typography, enhanced gradients, and refined shadows. It supports light/dark themes, micro-interactions, and WCAG AA accessibility via an "Aurora Token System." A "Buddy Engine" provides a visual companion to the AI Chat orchestrator, displaying state-driven visual changes. The landing page uses an NLP-informed emotional journey. A `glp-pane` primitive ensures UI consistency, and `CustomizerPanel` allows user personalization. An `InteractiveBuddy` wrapper enables positive expression cycles. Five additive React pages are integrated for Discernment, Protocols, Biometrics, and Admin. Two marketing pages (`/landing-v2`, `/wellness-tools-hub`) are also included. A public tools directory at `/tools/all` (canonical) lists every self-paced tool with descriptions, categories, and time estimates — distinct from the gated `/tools` experience. Eight interactive, client-side wellness tools are provided: GAD-7 anxiety check-in, PHQ-9 mood check-in, cognitive distortion checker, breath pacer, boundary builder, manipulation detector (8 tactics: gaslight / love-bomb / DARVO / guilt / silence / goalposts / isolation / future-fake), sleep quality self-check (7 PSQI-inspired questions with 4 result bands), and nervous system state check (5 polyvagal-informed questions mapping to ventral / sympathetic / dorsal / mixed states with grounding suggestions and a deep link to the breath pacer). Every tool ships with a `/crisis` link in the header, an inline `/crisis` link in the educational disclaimer, dark-mode classes, WCAG-AA radio fieldsets, and a SafetyFooter. Tool pages and the tools index are added to both `client/public/sitemap.xml` and `public/sitemap.xml` for SEO.

### Technical Implementations
The project uses a monorepo architecture with React 18 (TypeScript, Vite) for the client and Node.js/Express (TypeScript) for the server, offering a RESTful API with security and session management. It features a trauma-informed NLP layer and a "Wellness Microcopy Library." A Dual-Engine AI Prompt Architecture separates user-facing and administrative engines, supported by a self-evolving prompt registry. Core orchestration includes RBAC, crisis-first intent routing, PII redaction, structured event logging, and a Self-Tuning Fallback Library. The system performs subtle-emotion inference, adaptive response policies, an intervention module router with eight evidence-backed modules and seven micro-exercises, and a `user_feedback` signal-capture loop. Unified crisis detection short-circuits to appropriate responses. Authentication uses JWTs. An Admin Command Center provides an operations console with an "SOP Monitor." Production hardening includes rate limiting and database schema consistency checks. PWA cache hygiene is managed by a versioned service worker.

An "Awareness Detection Pipeline" uses a three-layer ensemble (RuleMatcher, MLClassifier stub, LLMReasoner) for detecting manipulation, distortion, and fallacies. It supports `POST /detect` and `POST /report`, with `GET /progress/:userId`. The 20-rule library is now persisted to `awareness_rules` (idempotent UPSERT seeder runs at boot; operator-set `active=false` is preserved across deploys). `RuleMatcher.refreshFromDb()` honors DB-driven enable/disable and confidence overrides while regex execution stays in code. Every detection event with any layer signal writes a row to `awareness_detections` (rule_key, tactic, category, severity, ensemble confidence x100, layer breakdown, latency) — independent of the content_scores PII gate, since detections store only rule attribution and numeric confidence. `scanLayer1Middleware` is wired into the live `POST /api/ai/chat` route (read-only — never blocks responses).

The "Agent Orchestrator" is a pure-JS deterministic state machine for AI agent invocation, with actions recorded in an `agent_decisions` audit log and a three-tier memory abstraction (Hot, Warm, Cold). Safety modules for crisis detection are imported read-only. Admin-gated endpoints exist for testing and monitoring. Four additive sibling modules extend the orchestrator without touching v1 locked files: `agentState.mjs` (explicit state machine over IDLE/ENGAGED/AWAITING_APPROVAL/ERROR/LEARNING with allowed-transition enforcement), `agentEscalation.mjs` (per-division confidence floors — safety:90, clinical:75, research:55, operations:65 — promotes to AWAITING_APPROVAL when triggered), `constitutionalGate.mjs` (five inviolable rules: crisis routing, no diagnosis, no human impersonation, no payment requests, educational voice), and `agentWorkingMemory.mjs` (Redis-backed scratchpad with graceful in-process fallback when REDIS_URL is unset). Each invocation now records state transitions, constitutional verdict, and escalation decision into `agent_decisions.outcome`, surfaced via admin-gated diagnostic endpoints under `/api/admin/consciousness/orchestrator/{state, escalation/config, constitutional/rules, working-memory/status}`.

The "Consciousness OS Foundation Primitives" establish persistence and audit with Drizzle tables for `agent_registry`, `agent_decisions`, and `content_scores`. Admin-gated REST endpoints manage these entities.

A "Biometric Ingestion Pipeline" adds opt-in nervous-system telemetry, creating Drizzle tables for `biometric_connections`, `biometric_readings`, and `nervous_system_states`. Data is AES-256-GCM encrypted at rest. Real OAuth integrations for Oura, Google Fit, and Whoop are supported. Apple HealthKit is supported via an HMAC-signed iOS companion webhook. Manual self-report is also available. Normalizers map provider-specific schemas to canonical metric types with range validation. The `BiometricIngestionService` performs idempotent upserts. Nervous-system inference uses a transparent z-score heuristic over baselines. An opt-in scheduler polls connected providers. Public REST surface for biometrics includes meta-data, connections, callbacks, sync, upload, HealthKit webhook, data retrieval, latest readings, and state management.

The "Discernment Tutor" is an awareness-training belt ladder layered over the awareness detection pipeline. It uses Drizzle tables for `discernment_lessons`, `discernment_user_progress`, and `discernment_attempts`, seeded with sixteen scenario-based lessons. The engine handles progress tracking, lesson management, attempt submission, and validation. Anti-farming measures prevent grinding. Belt advancement is based on total points and lessons passed. Public REST surface for discernment includes belts, lessons, progress, attempts, and real-world detections.

The "Protocol Execution Engine" is a deterministic state-machine walker over therapeutic-protocol DAGs. Drizzle tables for `protocol_registry`, `protocol_sessions`, and `outcome_measures` are seeded with ten evidence-informed protocols. The `ProtocolExecutor` class handles various node types (PSYCHOED, SKILL, EXPERIENTIAL, ASSESSMENT, GROUNDING, HOMEWORK, CRISIS_CHECK, BRANCH), administers PHQ-9/GAD-7, and escalates immediately on PHQ-9 item 9. Concurrent `/respond` calls use atomic JSONB array concatenation. Public REST surface for protocols includes catalog, session management, and meta-data.

An SEO content generation script (`scripts/generate-seo-content.mjs`) drafts trauma-informed blog posts to the `blog_posts` table as drafts, with idempotency and fallbacks.

### Feature Specifications
Core features include AI-powered Chat Therapy, Wellness Tools (State Tracker, Journal Prompts), and specialized APIs. The platform supports a four-tier subscription model and includes security features like rate limiting, CSP, and input sanitization. Engagement tools comprise gamification and a Content Studio. User features offer daily healing reminders, voice affirmations, and an AI companion. Admin tools provide dashboards. The `/growth` page serves as a "Metacognition Mirror" displaying user tenure, stats, feelings, invitations, and milestone cards. The "Peace Scape" surface (`/peacescape`) provides a sanctuary environment.

### Lumi Design System v2.0 (additive)
A purely additive visual system layered over the existing Aurora tokens, BuddyAvatar, and ThemeProvider — no existing surface is modified. Lives under `client/src/styles/lumi-*.css`, `client/src/components/lumi/*`, and `client/src/hooks/useScrollReveal.js` + `useBuddyEmotion.js`. Includes:
- **Tokens**: sage / amber / stone scales (50–950), six semantic emotion colors, six gradients, Fraunces + Crimson Pro display/quote families, fluid type, 8 px spacing, dark-mode mapping.
- **Lumi mascot**: pure-SVG character with breathing body, blinking eyes, cursor-tracking pupils, glowing heart, and ten emotion states (`neutral, listening, empathy, joy, concern, reflection, celebration, sleepy, surprise, comfort`). Click flashes the heart.
- **Components**: 8 button variants × 6 states, 9 link types (incl. `lumi-link-crisis`), `lumi-card` with hover lift, motion utilities (breathe, float, shimmer, scroll-reveal via IntersectionObserver), a11y helpers (skip link, focus ring, sr-only).
- **Brand**: `LumiBrandLogo` (horizontal / stacked / icon-only / wordmark-only) + `TGLPMandala` for the parent brand.
- **`useBuddyEmotion` hook**: pure context-to-emotion mapper with manual `setEmotion` and timed `celebrate()` overrides. Does not touch the existing `InteractiveBuddy` wrapper.
- **Showcase**: `/lumi-design-system` route demonstrates every token, component, and mascot state. Includes `/crisis` link in header and footer.
- **Strategy reference**: planning notes saved to `content/strategy/social-playbook.md` for later, non-automated use.
All motion respects `prefers-reduced-motion`. Nothing in the existing app imports from `lumi/` — adoption is opt-in, page by page.

### System Design Choices
Drizzle ORM is used with a Neon PostgreSQL database. Production security includes CORS allowlisting, JWT authentication, Helmet, and rate limiting. An observability layer provides health and system endpoints. A `Prompt-OS Execution Prompt Library` ensures canonical prompt modules validated against `promptspec.schema.json`. Production readiness features include a 503 readiness gate, health probes, telemetry parity, request tracing, and hardened administration access governed by a `CHANGE_GATE` protocol. The platform includes a layered self-healing stack for automated monitoring, diagnosis, and repair, accessible via admin endpoints and including AI-driven diagnosis. Direct-routed public pages use the `PageLayout` wrapper for consistent navigation and safety footers.

### Deployment Configuration
Autoscale deployment with split build/run phases: build runs `npm install && npm run build` once at deploy time; the run command is `NODE_ENV=production node server/app.mjs` only — no install/build at container start. This eliminates the previous ~30-second cold-start penalty on autoscale scale-ups (build no longer runs per-container). Required asset `client/public/icons/flower-of-life.svg` (sacred-geometry pattern referenced by the Footer background) is committed in both `client/public/icons/` and `public/icons/`, removing the build-time "didn't resolve" warning and runtime 404.

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