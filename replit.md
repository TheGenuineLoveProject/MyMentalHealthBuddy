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
The frontend features a Canva-inspired design using HSL color formatting, custom typography, enhanced gradients, and refined shadows, with an "Aurora Token System" for light/dark themes and WCAG AA accessibility. A "Buddy Engine" provides a visual companion. The Lumi Design System v2.0 offers an additive visual system with new tokens, typography, dark-mode mapping, and brand assets including a mascot. The platform includes five additive React pages for Discernment, Protocols, Biometrics, and Admin, two marketing pages, and a public tools directory. Eight interactive, client-side wellness tools are provided, each with crisis links and accessibility features. Motion respects `prefers-reduced-motion`.

### Technical Implementations
The project uses a monorepo architecture with React 18 (TypeScript, Vite) for the client and Node.js/Express (TypeScript) for the server, offering a RESTful API with security and session management. It features a trauma-informed NLP layer and a "Wellness Microcopy Library." A Dual-Engine AI Prompt Architecture separates user-facing and administrative engines. Core orchestration includes RBAC, crisis-first intent routing, PII redaction, structured event logging, and a Self-Tuning Fallback Library. The system performs subtle-emotion inference, adaptive response policies, an intervention module router with eight evidence-backed modules and seven micro-exercises, and a `user_feedback` signal-capture loop. Unified crisis detection short-circuits to appropriate responses.

An "Awareness Detection Pipeline" uses a three-layer ensemble (RuleMatcher, MLClassifier stub, LLMReasoner) for detecting manipulation, distortion, and fallacies, integrating with the AI chat. An "Agent Orchestrator" is a pure-JS deterministic state machine for AI agent invocation, with actions recorded in an audit log and a three-tier memory abstraction (Hot, Warm, Cold). "Consciousness OS Foundation Primitives" establish persistence and audit with Drizzle tables.

A "Biometric Ingestion Pipeline" adds opt-in nervous-system telemetry, encrypting data at rest and supporting OAuth integrations. The "Discernment Tutor" is an awareness-training belt ladder over the awareness detection pipeline, using scenario-based lessons. The "Protocol Execution Engine" is a deterministic state-machine walker over therapeutic-protocol DAGs, seeded with ten evidence-informed protocols. An SEO content generation script drafts trauma-informed blog posts.

### Feature Specifications
Core features include AI-powered Chat Therapy, Wellness Tools (State Tracker, Journal Prompts), and specialized APIs. The platform supports a four-tier subscription model and includes security features like rate limiting, CSP, and input sanitization. Engagement tools comprise gamification and a Content Studio. User features offer daily healing reminders, voice affirmations, and an AI companion. Admin tools provide dashboards and an "Admin Command Center" with an "SOP Monitor." The `/growth` page serves as a "Metacognition Mirror," and the "Peace Scape" surface provides a sanctuary environment. Both chat surfaces (`AIChatPage.jsx`, `AIChatPanel.tsx`) display the canonical Lumi mascot avatar on assistant bubbles and typing indicators (with `lumi-breathe` motion and graceful `onError` fallback). The home footer surfaces Home, About, Tools, Wisdom, Blog, Newsletter, Disclaimer, Privacy, Terms, and Crisis routes through its 4-column block plus the `SafetyFooter` strip. The `FeedbackWidget` floating action supports a 7-day localStorage suppression (`mmhb-feedback-suppressed-until`) via the dedicated "7d" hide button **and** the X close button (both call `handleHideForWeek` and surface a "Hidden for 7 days" toast). The `BuddyAvatar.tsx` component (used on `/start`, `/onboarding`, `/journal`, `/mood`, etc.) now renders the canonical Lumi PNG (`mmhb_buddy_interactive_fullbody_1777538625498.png`) inside its preserved wrapper contract (8 `data-*` attrs + `buddy--<state>/<motion>/<expr>` class hooks), with `lumi-breathe` animation gated by `v.motion !== 'steady'` so crisis state stays still per the original safety contract. The `AIChatPanel.tsx` chat client reads the API response shape `data?.response?.reply || data?.reply || data?.message || data?.error` with a gentle `/crisis`-routing fallback so server-shape drift never surfaces "No response returned" to the user. Signup-intent CTAs ("Start Free", "Get Started Free", "Start Your Journey — Free") on `CanvaLanding.jsx` (header, mobile menu, hero, final block) and on `Pricing.jsx` (free-tier card) route to `/register`; "Sign In" buttons remain on `/login`. This separation prevents new visitors from landing on a sign-in form when they intended to create an account. The canonical Lumi mascot lockup uses a soft sage radial halo (`radial-gradient(circle at 50% 55%, var(--glp-sage-10/15) 0%, transparent 72%)` with `overflow: visible`) instead of the legacy hard square frame (`linear-gradient` + `boxShadow`); applied across `Header.jsx`, `Footer.jsx`, `CanvaLanding.jsx` (header & footer logos), `Login.jsx`, `Register.jsx`, `ForgotPassword.jsx`, and `ResetPassword.jsx` so the mascot reads as an organic companion, not a boxed-in icon. The `/chat` surface (`AIChatPanel.tsx`) renders a top breadcrumb nav (`data-testid="nav-chat-breadcrumbs"`) with **Back to Dashboard**, Home, Journal, Mood, and a right-aligned rose **Crisis Support** link so signed-in users always have an explicit escape path from the chat.

### System Design Choices
Drizzle ORM is used with a Neon PostgreSQL database. Production security includes CORS allowlisting, JWT authentication, Helmet, and rate limiting. An observability layer provides health and system endpoints, utilizing OpenTelemetry tracing and PagerDuty alerting. A `Prompt-OS Execution Prompt Library` ensures canonical prompt modules. Production readiness features include a 503 readiness gate, health probes, telemetry parity, request tracing, and hardened administration access governed by a `CHANGE_GATE` protocol. The platform includes a layered self-healing stack for automated monitoring, diagnosis, and repair. Autoscale deployment uses split build/run phases to optimize cold-start times. The system AI prompt is extended with governance sections for canonical domain classification, UX contract integration, tone guidelines, a reflection prompt library, a Therapeutic Framework Reference Library (Motivational Interviewing, Active Listening, Validation Support, Rapport Building, Metacognition Prompts, Belief Exploration, Emotion Processing, Strength-Based Coaching, NLP-Informed Communication, Safety Boundaries) with an explicit hard rule against framework-name leakage to users, and crisis escalation protocols. Admin panels are wrapped in `<SafeBoundary>` for error isolation.

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