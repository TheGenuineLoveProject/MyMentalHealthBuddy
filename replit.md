# MyMentalHealthBuddy by The Genuine Love Project

## Overview
MyMentalHealthBuddy (MMHB) is an AI-powered mental wellness platform developed by The Genuine Love Project. Its primary purpose is to promote self-love, healing, and emotional growth through AI-assisted guidance, mood tracking, journaling, and crisis support. The platform integrates AI with trauma-informed psychological principles to deliver ethical, accessible, and personalized mental health support globally, aiming to reduce stigma and empower individuals.

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
The frontend employs a Canva-inspired design featuring HSL color formatting, custom typography, enhanced gradients, and refined shadows. It supports light/dark themes, micro-interactions, and WCAG AA accessibility via an "Aurora Token System." A "Buddy Engine" visual companion renders alongside the AI Chat orchestrator, displaying state-driven visual changes. The landing page uses an NLP-informed emotional journey. A `glp-pane` primitive ensures consistent UI, and `CustomizerPanel` allows user personalization. An `InteractiveBuddy` wrapper enables positive expression cycles.

### Technical Implementations
The project utilizes a monorepo architecture with React 18 (TypeScript, Vite) for the client and Node.js/Express (TypeScript) for the server, providing a RESTful API with security and session management. Key features include a trauma-informed NLP layer and a "Wellness Microcopy Library." A Dual-Engine AI Prompt Architecture separates user-facing and administrative engines, supported by a self-evolving prompt registry. Core orchestration incorporates RBAC, crisis-first intent routing, PII redaction, structured event logging, and a Self-Tuning Fallback Library for offline scenarios. The system includes subtle-emotion inference, an adaptive response policy, an intervention module router with eight evidence-backed modules and seven micro-exercises, and a `user_feedback` signal-capture loop. Unified crisis detection short-circuits to appropriate responses. Authentication manages user registration and login using JWTs. An Admin Command Center provides an operations console with an "SOP Monitor" and strict authorization. Production hardening includes `app.set("trust proxy", 1)` for rate limiting and `ensureSchema.mjs` for database schema consistency. PWA cache hygiene is managed by a versioned service worker using a dynamic `BUILD_ID` and network-first strategy for HTML.

The system incorporates an "Awareness Detection Pipeline" with a three-layer ensemble (RuleMatcher, MLClassifier stub, LLMReasoner) and a fixed-weight ensemble scorer for detecting manipulation, distortion, and fallacies in text. It provides `POST /detect` for anonymous and authenticated detection, `POST /report` for user-owned reflection, and `GET /progress/:userId` for user progress.

The "Agent Orchestrator" is a pure-JS deterministic state machine with eight ordered steps for AI agent invocation, recording every action in an `agent_decisions` audit log. It features a three-tier memory abstraction (Hot, Warm, Cold). Safety modules for crisis detection and response policy are imported read-only. Admin-gated endpoints `/orchestrator/invoke`, `/orchestrator/memory`, and `/orchestrator/memory/:agentId` allow testing and monitoring of the orchestrator.

The "Consciousness OS Foundation Primitives" establish the persistence and audit foundation, adding Drizzle tables for `agent_registry`, `agent_decisions`, and `content_scores`. Admin-gated REST endpoints at `/api/admin/consciousness` manage agents, decisions, and scores, complemented by an admin panel for monitoring and control.

The "Protocol Execution Engine" (Prompt 3.3) is a deterministic state-machine walker over therapeutic-protocol DAGs. Three additive Drizzle tables (`protocol_registry`, `protocol_sessions`, `outcome_measures`) are created via `ensureSchema.mjs` and seeded with ten evidence-informed protocols on first boot (CBT-DEPRESSION-8W, DBT-DISTRESS-4W, ACT-ANXIETY-6W, IFS-PARTS-6W, SE-PENDULATION-3W, EMDR-ORIENTATION-1W [human-required, refused at runtime], MBSR-BODYSCAN-8W, CFT-SELFCOMPASSION-4W, BA-ACTIVATION-6W, POLYVAGAL-GROUNDING-2W). The `ProtocolExecutor` class handles eight node types (PSYCHOED, SKILL, EXPERIENTIAL, ASSESSMENT, GROUNDING, HOMEWORK, CRISIS_CHECK, BRANCH), administers PHQ-9/GAD-7 with standard severity bands, escalates immediately on PHQ-9 item 9 (self-harm ideation) regardless of total, and short-circuits any CRISIS_CHECK answer flagged by the locked `detectCrisis` to `ESCALATED` status with the locked `CRISIS_RESPONSE` payload and a `/crisis` link. BRANCH nodes auto-advance invisibly with an 8-hop cycle cap that escalates malformed protocols. Concurrent `/respond` calls use atomic JSONB array concatenation (`||`) so double-clicks never clobber prior entries. Public REST surface at `/api/protocols`: `GET /` (catalog, filterable by modality/symptom/evidence), `POST /start` (auth, refuses human-required protocols with 403), `GET /session/:id`, `POST /session/:id/respond`, `POST /session/:id/progress`, `POST /session/:id/pause`, and `GET /meta`. All session routes enforce ownership via `requireAuth` plus a userId match (admin override). Per-route 60/min IP limiter; error responses log server-side but return generic operation-tagged messages to the client.

### Feature Specifications
Core features include AI-powered Chat Therapy, Wellness Tools (State Tracker, Journal Prompts), and specialized APIs. The platform supports a four-tier subscription model and includes security features like rate limiting, CSP, and input sanitization. Engagement tools comprise gamification and a Content Studio. User features offer daily healing reminders, voice affirmations, and an AI companion. Admin tools provide dashboards, and content is organized via a Learning Hub. The `/growth` page serves as a "Metacognition Mirror" displaying user tenure, stats, feelings, invitations, and milestone cards. The "Peace Scape" surface (`/peacescape`) provides a sanctuary environment.

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