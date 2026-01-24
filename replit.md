# The Genuine Love Project

## Overview
The Genuine Love Project is an AI-powered mental wellness platform dedicated to fostering self-love, healing, and emotional growth. It provides a private, compassionate, and accessible environment through AI-assisted emotional guidance, mood tracking, journaling, crisis support, and evidence-based healing tools. The platform integrates AI with trauma-informed psychological principles to offer a comprehensive wellness toolkit, aiming to empower users to "Live in Genuine Love" with advanced features available via subscription. The business vision is to provide a comprehensive, ethical, and accessible mental wellness solution, leveraging AI to offer personalized support and foster emotional resilience for a broad user base.

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
The frontend features a premium, Canva-inspired visual design with HSL color formatting, custom typography, enhanced gradients, and refined shadows. It supports full light/dark themes, micro-interactions, and comprehensive accessibility features including ARIA, semantic HTML, keyboard navigation, and `prefers-reduced-motion` support. Responsive typography and safe area insets ensure mobile adaptability. A comprehensive design token system is implemented for consistent styling across three visual modes: Default, Low-Stim, and Reading. All UI primitives include `data-testid` attributes, `focus-visible` rings, ARIA labels, `prefers-reduced-motion` support, and semantic HTML. A 3-Level Reading Mode System allows users to toggle between Beginner, Intermediate, and Advanced content levels, with features like `helperLine` consent cues and `card` meta for time/effort notes. A "Sacred UI Component Library" provides reusable components like `LayoutWrapper`, `Hero`, `SectionContainer`, `Card/CardGrid`, `Button`, `Footer`, `SafetyNotice`, `EvidenceNote`, `Steps/StepsCompact`, and `Callout`.

### Technical Implementations
The project uses a monorepo structure with separate client (React 18 SPA with TypeScript, Vite, Wouter, React Hook Form, Zod, Tailwind CSS, Lucide React) and server (Node.js/Express with TypeScript) applications. The backend provides a RESTful API with middleware for CORS, security headers (Helmet), compression, logging (Morgan), and session management (Express Session). Shared types ensure monorepo consistency, and all modules are ESM. Production optimization includes code splitting, environment variable configuration, health checks, rate limiting, and graceful shutdown. A trauma-informed NLP layer ensures supportive user-facing text and prompts. A "Wellness Microcopy Library" and a "Shared TypeScript Microcopy" system provide deterministic, type-safe microcopy selection and validation.

### Feature Specifications
The platform offers:
- **AI-powered Chat Therapy**: Integrated with OpenAI API for trauma-informed responses and crisis intervention.
- **Wellness Tools**: State Tracker, Journal Prompts, Reflection, Wisdom, Advanced Intellectual, Mastery tools, Perception Refinement (nervous system regulation), and Permaculture Wellness (ecological healing principles).
- **Specialized APIs**: Covering areas such as Knowledge Synthesis, Philosophy, Metacognition, Creativity, Resilience, Foresight, Systems Compassion, Collective Intelligence, Wisdom Synthesis, Cognitive Lab, Contemplative, Ethical Reasoning, Existential, Embodiment, Narrative, Relational, Values, Neuro-Integration, Socio-Ecology, Praxis, Post-Trauma, Self-Mastery Intelligence, Universal Content, Trauma Healing Protocols, Spiritual Intelligence, Relationship Dynamics, Cognitive Enhancement, Emotional Resilience, Life Purpose, Mind-Body Integration, Social Intelligence, Peak Performance, Personal Growth, Psychological Safety, Consciousness Expansion, Human Potential, Wisdom Traditions, Life Design, and Healing Modalities.
- **Advanced Features**: Deep Learning API, Purpose Compass API, Emotional Mastery API, Holistic Healing API, Mastery Excellence API, Content Studio API, Consciousness Expansion API, Human Potential API, Wisdom Traditions API, Life Design API, and Healing Modalities API.
- **Navigation & Discovery**: Intellectual Atlas, Strategy Maps, Collaborative Intelligence Lab, Resilience Metrics, and Adaptive Companion.
- **Security**: Rate limiting (validation-before-rate-limit pattern), CSP, input sanitization, CSRF protection, and account lifecycle management.
- **Gamification**: XP, levels, streaks, and daily quests.
- **Content Studio**: UI for content transformation with save/export, including social media template generation.
- **Study Vault**: Evidence-based research summaries.
- **Admin Health Dashboard**: Monitors uptime, DB status, and system metrics.
- **Admin Social Studio**: Multi-platform social media content management with automated posting integration.
- **Resend Email Integration**: Transactional email service for welcome emails, challenge reminders, and milestone notifications.
- **Replit Auth Integration**: OIDC authentication with sessions table.
- **Crisis Page Public Access**: The `/crisis` route is accessible without login for immediate support.
- **SEO Enhancement**: JSON-LD WebPage schema, SITE_URL constant, route-based canonical URLs, OG tags, Twitter cards.

### System Design Choices
A unified `shared/schema.mjs` defines Drizzle ORM models for the Neon PostgreSQL database, utilizing UUIDs, TEXT-based IDs, serial integers, and indexed foreign key constraints. Production security includes CORS allowlisting, JWT authentication, Helmet, and rate limiting.

## External Dependencies

- **OpenAI API**: AI chat therapy.
- **Vite**: Frontend build tool.
- **TypeScript**: Language.
- **React**: Frontend UI library.
- **Wouter**: Client-side routing.
- **React Hook Form**: Form management.
- **Zod**: Runtime type validation.
- **Tailwind CSS**: Styling framework.
- **Lucide React**: Icons.
- **Node.js**: Backend runtime.
- **Express**: Backend web framework.
- **Express Session**: Session management.
- **CORS**: Cross-Origin Resource Sharing middleware.
- **Helmet**: Security headers middleware.
- **Compression**: Response compression middleware.
- **Morgan**: HTTP request logger middleware.
- **Sentry**: Error tracking and performance monitoring.
- **Drizzle ORM**: Database interactions.
- **Neon PostgreSQL**: Primary database.
- **Stripe**: Billing and payment processing.
- **Replit Auth**: User authentication.
- **Resend**: Transactional email service.
- **Perplexity**: Factual AI (used in a similar vein to OpenAI for specific factual queries).