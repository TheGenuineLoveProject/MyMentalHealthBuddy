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
The frontend features a Canva-inspired design with HSL color formatting, custom typography, enhanced gradients, and refined shadows. It supports light/dark themes, micro-interactions, and WCAG AA accessibility through a design token system. The landing page uses an NLP-informed emotional journey structure. CSS includes consciousness-expanding animations and an Enterprise Elite II Advanced Design System with scroll-triggered reveals and elite card designs, respecting `prefers-reduced-motion`. A dynamic Avatar SVG System provides a futuristic, multi-layered icon with embedded CSS animations. Branded elements emphasize an "Aurora Token System" for consistent visual effects, extending to scrollbars and input fields.

### Technical Implementations
The project is a monorepo with React 18 (TypeScript, Vite, Wouter, React Hook Form, Zod, Tailwind CSS, Lucide React) for the client and Node.js/Express (TypeScript) for the server, offering a RESTful API with security and session management. It features a trauma-informed NLP layer and a "Wellness Microcopy Library." A Dual-Engine AI Prompt Architecture separates user-facing (`healing/`) and administrative (`business/`) engines with strict data boundaries, supported by a self-evolving prompt registry. Core orchestration includes RBAC, crisis-first intent routing, PII redaction, structured event logging, and a Self-Tuning Fallback Library for offline scenarios. The system incorporates subtle-emotion inference, an adaptive response policy, and an intervention module router with eight evidence-backed modules and seven micro-exercises. Crisis detection is unified and short-circuits to appropriate responses.

The "Buddy Engine" is a separate visual companion layer that renders alongside the AI Chat orchestrator, with its own typed contract (`/api/buddy` v1.9) for visual output and DOM mirroring for accessibility and testing. The visual avatar (BuddyAvatar v1.12) uses a layered SVG design — a soft state-tinted ambient aura behind the whole figure, a state-tinted floor-glow pool beneath Buddy's feet for a gentle floating feel, radial-gradient head/body/face shells, a wide bridging neck collar plus body-to-head overlap that forms natural shoulders fusing head and body into one silhouette, a multi-halo heart with a top-left highlight, animated highlight specks in the eyes, soft cheek blush dots, an antenna with a base mount, double-stroke stem, and a softly pulsing glow tip, and rounded hand caps on the arms — all rendered within the same 200×240 viewBox and using only the three canonical CSS variables (`--buddy-eye-color`, `--buddy-heart-color`, `--buddy-heart-pulse`) so every accent shifts color naturally with the BuddyState. State-driven motion variants include a compassionate head-tilt for the encouraged state and CSS-only floating sparkle particles for the celebrate state (both fully gated by `prefers-reduced-motion`). The hero on `/start` renders Buddy at 180×180 to give the polish real presence. It manages placement rules for different UI surfaces and incorporates robust invariant scripts to ensure architectural contracts related to heading semantics, placement geometry, telemetry parity, DOM-mirror parity, crisis-color stability, strict-protected-file import boundary, and VISUAL_MAP exhaustiveness + state↔key consistency + free-text fallback coverage. These scripts act as pre-test gates (joined via `scripts/check-contract-routes.sh`) to enforce design, safety, and separation contracts; the import-boundary guard locks the architectural separation between Buddy Engine source files and the strict-protected `/api/ai/chat` handlers, the orchestrator/provider/memory/profile/summary/crisis logic in `server/ai/`, and the `/start` page internals; the VISUAL_MAP guard locks BUDDY_STATES↔VISUAL_MAP exhaustiveness, per-entry key↔state consistency, all 8 BuddyVisualOutput required fields with structurally-valid values, the crisis safety-routing flag (`safetyMode: "crisis_safe"` exclusive to the `crisis` state), and `resolveBuddyState` regex-fallback coverage for every non-default BuddyState.

### Feature Specifications
Core features include AI-powered Chat Therapy, Wellness Tools (State Tracker, Journal Prompts), and specialized APIs. The platform supports a four-tier subscription model and includes security features like rate limiting, CSP, and input sanitization. Engagement tools comprise gamification and a Content Studio. User features offer daily healing reminders, voice affirmations, and an AI companion. Admin tools provide dashboards, and content is organized via a Learning Hub.

### System Design Choices
Drizzle ORM is used with a Neon PostgreSQL database. Production security includes CORS allowlisting, JWT authentication, Helmet, and rate limiting. An observability layer provides health and system endpoints. A `Prompt-OS Execution Prompt Library` ensures canonical prompt modules validated against `promptspec.schema.json`. Production readiness features include a 503 readiness gate, health probes, telemetry parity, request tracing, and hardened administration access governed by a `CHANGE_GATE` protocol.

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