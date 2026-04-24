# MyMentalHealthBuddy by The Genuine Love Project

## Overview
MyMentalHealthBuddy (MMHB) by The Genuine Love Project is an AI-powered mental wellness platform focused on fostering self-love, healing, and emotional growth. It provides AI-assisted guidance, mood tracking, journaling, and crisis support. The platform integrates AI with trauma-informed psychological principles to offer an ethical, accessible, and personalized mental wellness solution aimed at building emotional resilience.

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
The frontend features a Canva-inspired design with HSL color formatting, custom typography, enhanced gradients, and refined shadows. It supports light/dark themes, micro-interactions, and WCAG AA accessibility, utilizing a design token system for consistency across visual modes. The landing page uses an NLP-informed emotional journey structure. CSS includes consciousness-expanding animations and an Enterprise Elite II Advanced Design System with scroll-triggered reveals and elite card designs, all respecting `prefers-reduced-motion`. An Avatar SVG System provides a futuristic, multi-layered icon with embedded CSS animations: a 5.2s heart-core breath, 7s halo pulse, counter-rotating aurora rings (90s/120s), staggered particle twinkle (4.8s across 5 delay channels), and a rare 9s gentle blink — all gated by `prefers-reduced-motion: reduce`. Twinkles use a translate-then-scale `<g>` wrapper pattern (no `transform-box: fill-box` dependency) for cross-browser pivot reliability, including older Safari/iOS. The original static icon is preserved at `/brand/mmhb-icon-static.svg` as a fallback. Ambient `BrandGlow` background blobs drift on 18s/22s/26s cycles with staggered phase offsets, also gated by reduced-motion.

### Technical Implementations
The project is a monorepo with a React 18 (TypeScript, Vite, Wouter, React Hook Form, Zod, Tailwind CSS, Lucide React) client and a Node.js/Express (TypeScript) server. The backend provides a RESTful API with security and session management middleware. A trauma-informed NLP layer and "Wellness Microcopy Library" ensure supportive user interactions. A Dual-Engine AI Prompt Architecture separates `healing/` (user-facing) and `business/` (admin/staff) engines with strict data boundaries, each having a `registry.json` and modular prompts. Core orchestration handles RBAC, crisis-first intent routing, PII redaction, and structured event logging. A Self-Tuning Fallback Library provides keyword-driven replies for offline scenarios. Guest memory is handled ephemerally. A self-evolving prompt registry allows admins to hot-edit prompt files at runtime with atomic writes and audit logging. A per-user structured profile layer extracts six categories from chat history and injects them as a system message. A per-user in-process async mutex serializes memory and profile updates. A subtle-emotion inference layer scans user messages for indirect phrasing across five states, feeding into the adaptive response policy. An adaptive response policy layer converts user context into a style/intervention contract. An intervention module router selects from eight evidence-backed modules based on profile and input signals. The router includes an ambiguous-distress layer that splits "I don't know..." inputs into two intents: feeling-label ambiguity ("what's wrong", "why I feel [emotional]") routes to `emotional_processing`, while action paralysis ("what to do", "where to start") routes to `self_regulation`. The "why I'm" branch requires an emotional predicate (sad/anxious/upset/feeling/like this) to prevent false positives on practical uncertainty (e.g., "why I'm late"). A tool execution layer offers seven evidence-informed micro-exercises, selected based on active modules, profile, and input. Crisis paths short-circuit before tool selection. Profile schema is extended with core beliefs, behavior loops, and values, with priority-based rendering. A unified `server/engine/crisisDetection.mjs` facade detects crisis situations and short-circuits with appropriate responses. Hardened security middleware protects routes. A dedicated launch surface at `/start` provides entry to relief flows. A soft paywall is implemented server-side with usage tracking and telemetry.

### Feature Specifications
Core features include AI-powered Chat Therapy and Wellness Tools (State Tracker, Journal Prompts). The platform offers specialized APIs for various intelligence domains. Monetization is via a four-tier subscription model. Security features include rate limiting, CSP, and input sanitization. Engagement tools comprise gamification and a Content Studio. User features include daily healing reminders, voice affirmations, and an AI companion. Admin tools provide dashboards. Content is organized via a Learning Hub and a unified `blog_posts` table.

### System Design Choices
Drizzle ORM is used with a Neon PostgreSQL database. Production security includes CORS allowlisting, JWT authentication, Helmet, and rate limiting. An observability layer provides health, system, and kernel endpoints. A `Prompt-OS Execution Prompt Library` ensures canonical prompt modules, validated against `promptspec.schema.json`. Production readiness features include a 503 readiness gate, health probes, telemetry parity, request tracing, and hardened administration access, governed by a `CHANGE_GATE` protocol and `Component Registry`.

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