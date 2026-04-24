# MyMentalHealthBuddy by The Genuine Love Project

## Overview
MyMentalHealthBuddy (MMHB) by The Genuine Love Project is an AI-powered mental wellness platform designed to foster self-love, healing, and emotional growth. It offers AI-assisted guidance, mood tracking, journaling, and crisis support. The platform integrates AI with trauma-informed psychological principles to provide an ethical, accessible, and personalized solution for building emotional resilience. Its vision is to deliver accessible mental health support, reducing the stigma around mental illness and empowering individuals globally.

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
The frontend employs a Canva-inspired design with HSL color formatting, custom typography, enhanced gradients, and refined shadows. It supports light/dark themes, micro-interactions, and WCAG AA accessibility, utilizing a design token system for consistency. The landing page uses an NLP-informed emotional journey structure. CSS includes consciousness-expanding animations and an Enterprise Elite II Advanced Design System with scroll-triggered reveals and elite card designs, all respecting `prefers-reduced-motion`. A dynamic Avatar SVG System provides a futuristic, multi-layered icon with embedded CSS animations and a `favicon.svg` with matching animation. Branded elements like CTAs, skeleton loaders, and text emphasize an "Aurora Token System" for consistent visual effects. The browser viewport scrollbar and input fields are also branded with aurora-themed styling.

### Technical Implementations
The project is a monorepo utilizing React 18 (TypeScript, Vite, Wouter, React Hook Form, Zod, Tailwind CSS, Lucide React) for the client and Node.js/Express (TypeScript) for the server, offering a RESTful API with security and session management. It features a trauma-informed NLP layer and a "Wellness Microcopy Library." A Dual-Engine AI Prompt Architecture separates user-facing (`healing/`) and administrative (`business/`) engines with strict data boundaries, supported by a self-evolving prompt registry. Core orchestration includes RBAC, crisis-first intent routing, PII redaction, and structured event logging. A Self-Tuning Fallback Library handles offline scenarios. The system includes subtle-emotion inference, an adaptive response policy, and an intervention module router selecting from eight evidence-backed modules and offering seven micro-exercises. Crisis detection is unified and short-circuits to appropriate responses.

### Buddy Engine (v2.2)
A separate, visual companion layer that renders alongside (never inside) the AI Chat orchestrator. The Buddy Engine has its own typed contract independent of `/api/ai/chat`:

- **`/api/buddy` v1.9 contract**: 8-field `BuddyVisualOutput` (`state`, `expression`, `safetyMode`, `eyeColor`, `heartColor`, `heartPulse`, `motion`, `label`) computed by `getBuddyVisualOutput()` in `client/src/lib/avatarState.ts`. Crisis state is hardcoded to `eyeColor=#6FE3B0` / `heartPulse=5800ms` for visual stability. Server↔client wire-aligned in `server/routes/buddy.mjs`.
- **DOM mirror contract (v1.9)**: `BuddyAvatar.tsx` exposes ALL 7 visual fields as `data-state`, `data-safety-mode`, `data-motion`, `data-expression`, `data-eye-color`, `data-heart-color`, `data-heart-pulse` attributes that mirror the corresponding `--buddy-*` CSS custom properties. This makes the contract observable by a11y tools, e2e tests, and external adapters without `getComputedStyle` introspection.
- **Placement (v2.0)**: `<BuddyPanel>` renders at 140px on `/start` (centerpiece) and 88px in calm baseline on `/journal` and `/state` (work surfaces). Tool pages are intentionally NOT instrumented (over-placement guardrail).
- **Typed telemetry (v2.1)**: `client/src/lib/buddyTelemetry.ts` exports `emitBuddyEvent<E>(type, metadata)` with a discriminated `BuddyEventMap` union covering `buddy_panel_viewed`, `buddy_share_shown`, `buddy_share_clicked`, `buddy_accessibility_ready`. Get-or-create guest ID ensures correlation for deep-link visitors. Server-side allowlist in `server/ai/aiTelemetry.mjs` `ALLOWED_EVENT_TYPES` gates persistence; new event types require dual-touch (BuddyEventMap + ALLOWED_EVENT_TYPES). `/start`'s local `track()` is grandfathered (strict-protected file) but emits byte-identical wire format.
- **Centralized companion copy (v2.2)**: `BUDDY_PANEL_COPY` export in `client/src/content/microcopy/wellnessMicrocopy.ts` is the single source of truth for `<BuddyPanel>` title/subtitle strings on calm work surfaces. Keys mirror the telemetry `surface` prop (`journal`, `mood`). `/start`'s contextual title is intentionally excluded (computed dynamically from return-user / first-touch state).
- **Strict-protected files (do not modify behavior)**: `/api/ai/chat`, the orchestrator/provider/memory/profile/summary/crisis logic, and `/start` page behavior. The Buddy Engine never imports from these surfaces or alters their responses.
- **Documentation**: `docs/architecture/BUDDY_ENGINE.md` is the canonical reference for the engine's contracts, dual-touch convention, and gap-fix history.

### Feature Specifications
Core features include AI-powered Chat Therapy, Wellness Tools (State Tracker, Journal Prompts), and specialized APIs. The platform supports a four-tier subscription model. Security features encompass rate limiting, CSP, and input sanitization. Engagement tools include gamification and a Content Studio. User features offer daily healing reminders, voice affirmations, and an AI companion. Admin tools provide dashboards, and content is organized via a Learning Hub.

### System Design Choices
Drizzle ORM is used with a Neon PostgreSQL database. Production security includes CORS allowlisting, JWT authentication, Helmet, and rate limiting. An observability layer provides health and system endpoints. A `Prompt-OS Execution Prompt Library` ensures canonical prompt modules validated against `promptspec.schema.json`. Production readiness includes a 503 readiness gate, health probes, telemetry parity, request tracing, and hardened administration access governed by a `CHANGE_GATE` protocol.

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