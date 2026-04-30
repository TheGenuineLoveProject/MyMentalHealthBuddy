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
The frontend uses a Canva-inspired design with HSL color formatting, custom typography, enhanced gradients, and refined shadows, supporting light/dark themes and WCAG AA accessibility via an "Aurora Token System." A "Buddy Engine" provides a visual companion, displaying state-driven visual changes. The Lumi Design System v2.0 provides an additive visual system with new tokens, typography, and dark-mode mapping, including a Lumi mascot and brand assets. Components include various button and link types, cards, motion utilities, and accessibility helpers. The platform features five additive React pages for Discernment, Protocols, Biometrics, and Admin, along with two marketing pages, and a public tools directory. Eight interactive, client-side wellness tools are provided, each including crisis links and accessibility features. All motion respects `prefers-reduced-motion`.

### Technical Implementations
The project utilizes a monorepo architecture with React 18 (TypeScript, Vite) for the client and Node.js/Express (TypeScript) for the server, offering a RESTful API with security and session management. It features a trauma-informed NLP layer and a "Wellness Microcopy Library." A Dual-Engine AI Prompt Architecture separates user-facing and administrative engines. Core orchestration includes RBAC, crisis-first intent routing, PII redaction, structured event logging, and a Self-Tuning Fallback Library. The system performs subtle-emotion inference, adaptive response policies, an intervention module router with eight evidence-backed modules and seven micro-exercises, and a `user_feedback` signal-capture loop. Unified crisis detection short-circuits to appropriate responses.

An "Awareness Detection Pipeline" uses a three-layer ensemble (RuleMatcher, MLClassifier stub, LLMReasoner) for detecting manipulation, distortion, and fallacies, integrating with the AI chat. An "Agent Orchestrator" is a pure-JS deterministic state machine for AI agent invocation, with actions recorded in an audit log and a three-tier memory abstraction (Hot, Warm, Cold). "Consciousness OS Foundation Primitives" establish persistence and audit with Drizzle tables.

A "Biometric Ingestion Pipeline" adds opt-in nervous-system telemetry, encrypting data at rest and supporting OAuth integrations for Oura, Google Fit, Whoop, and Apple HealthKit. The "Discernment Tutor" is an awareness-training belt ladder layered over the awareness detection pipeline, using scenario-based lessons. The "Protocol Execution Engine" is a deterministic state-machine walker over therapeutic-protocol DAGs, seeded with ten evidence-informed protocols. An SEO content generation script drafts trauma-informed blog posts.

### Feature Specifications
Core features include AI-powered Chat Therapy, Wellness Tools (State Tracker, Journal Prompts), and specialized APIs. The platform supports a four-tier subscription model and includes security features like rate limiting, CSP, and input sanitization. Engagement tools comprise gamification and a Content Studio. User features offer daily healing reminders, voice affirmations, and an AI companion. Admin tools provide dashboards and an "Admin Command Center" with an "SOP Monitor." The `/growth` page serves as a "Metacognition Mirror," and the "Peace Scape" surface provides a sanctuary environment.

### System Design Choices
Drizzle ORM is used with a Neon PostgreSQL database. Production security includes CORS allowlisting, JWT authentication, Helmet, and rate limiting. An observability layer provides health and system endpoints, utilizing OpenTelemetry tracing and PagerDuty alerting. A `Prompt-OS Execution Prompt Library` ensures canonical prompt modules. Production readiness features include a 503 readiness gate, health probes, telemetry parity, request tracing, and hardened administration access governed by a `CHANGE_GATE` protocol. The platform includes a layered self-healing stack for automated monitoring, diagnosis, and repair. Autoscale deployment uses split build/run phases to optimize cold-start times. The system AI prompt is extended with governance sections for canonical domain classification, UX contract integration, tone guidelines, a reflection prompt library, a Therapeutic Framework Reference Library naming the ten internal stances (Motivational Interviewing, Active Listening, Validation Support, Rapport Building, Metacognition Prompts, Belief Exploration, Emotion Processing, Strength-Based Coaching, NLP-Informed Communication, Safety Boundaries) with an explicit hard rule against framework-name leakage to users, and crisis escalation protocols. Two surgical UX-polish patches contain stray safety/wellness messaging: (1) `client/src/components/wellness/WellnessPageShell.jsx` previously rendered three near-identical safety blocks at the bottom of every wellness page (a `<ConsentStrip />`, a standalone "Need urgent help? Visit crisis resources" anchor, and a `<SafetyFooterStrip />`); since `ConsentStrip` already includes the educational disclaimer (`SAFETY_DISCLAIMER_SHORT`), the pause/stop line (`PAUSE_STOP_LINE`), and a crisis-resource link, the standalone anchor and `SafetyFooterStrip` were pure visual duplication and have been removed from the shell — the canonical `ConsentStrip` survives and the "always include /crisis routing on wellness content" rule remains satisfied via that link plus the top quick-nav `Crisis` item; the `SafetyFooterStrip` component itself is preserved for any future single-use callers. (2) `client/src/components/GratitudePrompt.jsx` is mounted globally in `App.jsx` and previously rendered on every authenticated page, including `/crisis` next to the 988 hotline numbers and inside the AI chat surface and on the `/start` "Feel better in 60 seconds" triage page; the component now imports `useLocation` from wouter and early-returns `null` when the current path matches a conservative `GRATITUDE_BLOCKED_PATH_PREFIXES` denylist (`/crisis`, `/988`, `/chat`, `/ai-chat`, `/ai/companion`, `/onboarding`, `/pathways/onboarding`, `/start`, `/register`, `/login`, `/forgot-password`, `/reset-password`, `/admin`, `/admin-login`, `/checkout`), so a "What are you grateful for?" widget can never appear in a crisis, triage, mid-chat, sign-up/auth-recovery, or admin context, while continuing to mount on `/dashboard`, `/journal`, `/state` and other wellness surfaces. Note for future debuggers: every wellness route is wrapped by `AgeConsentGate`, which renders its own "Need immediate support? Access Crisis Resources" CTA (separate from `ConsentStrip`'s "Need urgent help? Visit crisis resources" link) for not-yet-consented users — this is the correct trauma-informed pattern and is intentional, not a duplicate of the dedupe-target footer block.

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