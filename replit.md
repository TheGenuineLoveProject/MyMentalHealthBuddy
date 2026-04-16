# MyMentalHealthBuddy by The Genuine Love Project

## Overview
MyMentalHealthBuddy (MMHB) by The Genuine Love Project is an AI-powered mental wellness platform focused on self-love, healing, and emotional growth. It provides AI-assisted guidance, mood tracking, journaling, crisis support, and evidence-based tools. The project aims to deliver an ethical, accessible, and personalized mental wellness solution by combining AI with trauma-informed psychological principles to build emotional resilience.

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
The frontend employs a premium, Canva-inspired design with HSL color formatting, custom typography (**Playfair Display** for headings, **Inter** for body), enhanced gradients, and refined shadows. It fully supports light/dark themes, micro-interactions, and comprehensive accessibility (WCAG AA, ARIA, semantic HTML, keyboard navigation, `prefers-reduced-motion`). A design token system (`--glp-*` variables) ensures consistent styling across Default, Low-Stim, and Reading visual modes. A "Sacred UI Component Library" and a 3-Level Reading Mode System are provided, with all UI primitives including `data-testid` attributes and `focus-visible` rings.

### Technical Implementations
The project is a monorepo comprising a client (React 18 SPA with TypeScript, Vite, Wouter, React Hook Form, Zod, Tailwind CSS, Lucide React) and a server (Node.js/Express with TypeScript). The backend provides a RESTful API with middleware for CORS, security (Helmet), compression, logging (Morgan), and session management (Express Session). Shared TypeScript types maintain consistency across the monorepo. A trauma-informed NLP layer, supported by a "Wellness Microcopy Library," ensures supportive user-facing text. The system integrates Social Work-Informed Frameworks like Motivational Interviewing (MI) and a Strengths-Based Approach, and features "The 12-Phase Self-Alignment Path™." Ethical NLP patterns with guardrails, 18+ age gating, and persistent disclaimers with crisis support links are integral.

### Feature Specifications
The platform offers:
- **Core Features**: AI-powered Chat Therapy, Wellness Tools (State Tracker, Journal Prompts, Reflection, Wisdom, Mastery, Perception Refinement, Permaculture Wellness, Self-Worth Reflection).
- **Specialized APIs**: A broad range of APIs for Knowledge Synthesis, Philosophy, Metacognition, Creativity, Resilience, Foresight, Systems Compassion, Collective Intelligence, Wisdom Synthesis, Cognitive Lab, Contemplative, Ethical Reasoning, Existential, Embodiment, Narrative, Relational, Values, Neuro-Integration, Socio-Ecology, Praxis, Post-Trauma, Self-Mastery Intelligence, Universal Content, Trauma Healing Protocols, Spiritual Intelligence, Relationship Dynamics, Cognitive Enhancement, Emotional Resilience, Life Purpose, Mind-Body Integration, Social Intelligence, Peak Performance, Personal Growth, Psychological Safety, Consciousness Expansion, Human Potential, Wisdom Traditions, Life Design, Healing Modalities.
- **Monetization**: A four-tier (Free/Starter/Pro/Elite) model with subscription management via Stripe.
- **Security**: Rate limiting, CSP, input sanitization, CSRF protection, and account lifecycle management.
- **Engagement**: Gamification, Content Studio, Study Vault.
- **User Features**: Resend Email Integration, Replit Auth Integration, Crisis Page Public Access, SEO Enhancement, Accessibility Toolbar, Daily Healing Reminders, Voice Affirmation Settings, Community Affirmation Wall, Journal Insights, AI Companion Animations, Floating Lotus Guide, Sacred Glow Utilities, Emotion-Linked Backgrounds.
- **Admin Tools**: Admin Health Dashboard, Admin Social Studio, Platform Tools Dashboard, Admin Command Center.
- **Content Organization**: Learning Hub, Comprehensive Route Redirects, and a unified `blog_posts` table for all publishable content types (blog, newsletter, reflection, essay, note) with CRUD operations, RSS feeds, and comments.

### System Design Choices
Drizzle ORM defines models for a Neon PostgreSQL database, utilizing UUIDs, TEXT-based IDs, serial integers, and indexed foreign key constraints. Production security includes CORS allowlisting, JWT authentication, Helmet, and rate limiting. The system includes a robust observability layer with `/api/health`, `/api/system`, and `/api/kernel/*` endpoints for telemetry, integrity checks, and schema validation. A `Prompt-OS Execution Prompt Library` contains canonical prompt modules for various domains, validated against `promptspec.schema.json`. Production readiness includes a 503 readiness gate during async initialization, multiple health probes, telemetry parity across environments, request tracing, and hardened administration access. A `CHANGE_GATE` protocol and `Component Registry` govern component modifications.

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