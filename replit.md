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
The frontend features a Canva-inspired design with HSL color formatting, custom typography, enhanced gradients, and refined shadows. It supports light/dark themes, micro-interactions, and WCAG AA accessibility through a design token system. The landing page uses an NLP-informed emotional journey structure. CSS includes consciousness-expanding animations and an Enterprise Elite II Advanced Design System with scroll-triggered reveals and elite card designs, respecting `prefers-reduced-motion`. A dynamic Avatar SVG System provides a futuristic, multi-layered icon with embedded CSS animations. Branded elements emphasize an "Aurora Token System" for consistent visual effects. The "Buddy Engine" visual companion renders alongside the AI Chat orchestrator, featuring a screen-face robot design with state-driven visual changes, maintaining existing CSS animation hooks and `prefers-reduced-motion` compliance.

### Technical Implementations
The project is a monorepo with React 18 (TypeScript, Vite) for the client and Node.js/Express (TypeScript) for the server, offering a RESTful API with security and session management. It features a trauma-informed NLP layer and a "Wellness Microcopy Library." A Dual-Engine AI Prompt Architecture separates user-facing and administrative engines with strict data boundaries, supported by a self-evolving prompt registry. Core orchestration includes RBAC, crisis-first intent routing, PII redaction, structured event logging, and a Self-Tuning Fallback Library for offline scenarios. The system incorporates subtle-emotion inference, an adaptive response policy, and an intervention module router with eight evidence-backed modules and seven micro-exercises. Crisis detection is unified and short-circuits to appropriate responses. The application bootstraps its database schema at boot via `ensureSchema.mjs`. Authentication handles user registration and login, storing JWTs in local storage and ensuring CSRF exemption for specific auth endpoints. An Admin Command Center provides an operations console with strict authentication and authorization for administrative tasks, supporting token-based admin sessions or authenticated users with an "admin" role.

### Feature Specifications
Core features include AI-powered Chat Therapy, Wellness Tools (State Tracker, Journal Prompts), and specialized APIs. The platform supports a four-tier subscription model and includes security features like rate limiting, CSP, and input sanitization. Engagement tools comprise gamification and a Content Studio. User features offer daily healing reminders, voice affirmations, and an AI companion. Admin tools provide dashboards, and content is organized via a Learning Hub. The `/growth` page serves as a "Metacognition Mirror," displaying user tenure, mirror stats, dominant feelings from journal data, metacognitive invitations, and dynamic milestone cards. The "Peace Scape" surface (`/peacescape`) provides a sanctuary environment with a ZenScape backdrop, displaying the user's sanctuary palette, accessory, theme, and computed evolution stage. A `CustomizerPanel` lets authenticated users save palette, accessory, and theme. Guests can preview choices locally with a soft "sign in to remember" notice. An `InteractiveBuddy` wrapper lets users tap the sanctuary Buddy to cycle through positive expressions. The `ZenScape` backdrop is palette/theme/accessory aware, driving a CSS-variable cascade. An optional accessory glyph floats above Buddy. ZenScape additionally accepts an optional `stage` prop (1–6) that emits a `data-zen-stage` attribute on the root, revealing progressively more visuals from Seed Garden to Inner Cathedral. All Layer 5 animations (sparkle twinkle, stage-6 aura) are gated by `prefers-reduced-motion`. The homepage final-CTA section ("Your Buddy Is Ready. Are You?") and "Three Steps" cards have undergone visual refinements and accessibility fixes, including contrast adjustments and proper text decoration handling. The `/crisis` page has undergone a WCAG AA contrast remediation pass across all text elements and CTA buttons.

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