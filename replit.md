# MyMentalHealthBuddy by The Genuine Love Project

## Overview
MyMentalHealthBuddy (MMHB) by The Genuine Love Project is an AI-powered mental wellness platform dedicated to fostering self-love, healing, and emotional growth. It offers AI-assisted guidance, mood tracking, journaling, crisis support, and evidence-based tools. The project's core mission is to provide an ethical, accessible, and personalized mental wellness solution by integrating AI with trauma-informed psychological principles to build emotional resilience.

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
The frontend features a Canva-inspired design with HSL color formatting, custom typography (Playfair Display, Inter), enhanced gradients, and refined shadows. It supports light/dark themes, micro-interactions, and WCAG AA accessibility. A design token system ensures consistent styling across visual modes (Default, Low-Stim, Reading). The landing page uses an NLP-informed emotional journey structure with nine sections, emphasizing the AI buddy as a coach and mentor. CSS includes consciousness-expanding animations and an Enterprise Elite II Advanced Design System with scroll-triggered reveals and elite card designs, all respecting `prefers-reduced-motion`. An Avatar SVG System provides a futuristic, multi-layered icon.

### Technical Implementations
The project is a monorepo with a React 18 (TypeScript, Vite, Wouter, React Hook Form, Zod, Tailwind CSS, Lucide React) client and a Node.js/Express (TypeScript) server. The backend provides a RESTful API with middleware for security and session management. A trauma-informed NLP layer and "Wellness Microcopy Library" ensure supportive user interactions, integrating Social Work-Informed Frameworks. A Dual-Engine AI Prompt Architecture separates `healing/` (user-facing) and `business/` (admin/staff) engines with strict data boundaries, each having a `registry.json` and modular prompts. Core orchestration handles RBAC, crisis-first intent routing, PII redaction, and structured event logging. Live HTTP routes manage access to these engines. A Self-Tuning Fallback Library provides keyword-driven replies for offline or error scenarios, recording metrics for insights. Guest memory is handled ephemerally with `x-guest-id` headers for unauthenticated users. A self-evolving prompt registry lets admins hot-edit healing prompt files at runtime via `GET/PUT /api/ai/healing/admin/prompts/:id` (gated `requireAdult` → `requireAuth` → `requireAdmin`); writes are atomic, capped at 50 KB, and append a JSONL audit entry (`ts, actor, promptId, prevSha, newSha, bytes, reason`) to `ai/healing/_audit.log.jsonl`, viewable via `GET /api/ai/healing/admin/audit`. Hardened security middleware protects routes with helmet, CORS, rate limiting, input sanitization, and security headers.

### Feature Specifications
Core features include AI-powered Chat Therapy and Wellness Tools (State Tracker, Journal Prompts). The platform offers specialized APIs for various intelligence domains (e.g., Knowledge Synthesis, Trauma Healing Protocols, Spiritual Intelligence). The brand color palette ("Enterprise Elite II") uses specific gold-sage gradient lines for section dividers. Monetization is via a four-tier subscription model using Stripe. Security features include rate limiting, CSP, and input sanitization. Engagement tools comprise gamification and a Content Studio. User features include daily healing reminders, voice affirmations, and an AI companion. Admin tools provide dashboards for health, social studio, and command center. Content is organized via a Learning Hub and a unified `blog_posts` table for all publishable content with CRUD operations and RSS feeds.

### System Design Choices
Drizzle ORM is used with a Neon PostgreSQL database, employing UUIDs and indexed foreign key constraints. Production security includes CORS allowlisting, JWT authentication, Helmet, and rate limiting. The system has an observability layer with health, system, and kernel endpoints for telemetry and integrity checks. A `Prompt-OS Execution Prompt Library` ensures canonical prompt modules, validated against `promptspec.schema.json`. Production readiness features include a 503 readiness gate, health probes, telemetry parity, request tracing, and hardened administration access, governed by a `CHANGE_GATE` protocol and `Component Registry`.

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