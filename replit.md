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