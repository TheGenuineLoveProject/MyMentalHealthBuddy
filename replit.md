# The Genuine Love Project

## Overview
The Genuine Love Project is an AI-powered mental wellness platform focused on self-love, healing, and emotional growth. It provides a private, compassionate, and accessible environment through AI-assisted emotional guidance, mood tracking, journaling, crisis support, and evidence-based healing tools. The platform integrates AI with trauma-informed psychological principles to offer a comprehensive wellness toolkit, aiming to empower users to "Live in Genuine Love" with advanced features available via subscription.

## User Preferences
- Preferred communication style: Simple, everyday language
- Engineering standards: A→Z 360° complete solutions
- Mental health approach: Trauma-informed, supportive, non-clinical language
- UX philosophy: Gentle, compassionate, accessible

## Recent Changes (January 2026)
- **SEO Enhancement**: JSON-LD WebPage schema, SITE_URL constant, route-based canonical URLs, OG tags, Twitter cards
- **SacredForm.jsx**: Non-coercive email capture component with consent checkbox, privacy link, no dark patterns
- **SocialShare.jsx**: Calm "copy link" button with no viral pressure language ("Share if it resonates")
- **GentleBenefitsSection**: Added legally safer "How it may help" sections to all 29 wellness routes with evidence-informed language (may help / some people notice), stop/pause messaging, and crisis line links
- **Sacred UI Component Library** (client/src/components/ui/): LayoutWrapper, Hero, SectionContainer (4 variants), Card/CardGrid, Button (4 variants, 3 sizes), Footer, SafetyNotice, EvidenceNote, Steps/StepsCompact, Callout (4 variants), Quote
- **Unified JS Design Tokens** (client/src/brand/tokens.ts): Colors, spacing, radii, shadows, zIndex, motion, typography, breakpoints matching CSS tokens
- **/design-system route**: Config-driven component catalog with 3-level content (beginner/intermediate/advanced)
- All UI primitives include: data-testid attributes, focus-visible rings, aria labels, prefers-reduced-motion support, semantic HTML
- Content Studio social media template generator with 4 formats (short post, carousel, thread, newsletter), 7 wellness topics, and 3 audience levels (beginner/intermediate/advanced)
- Trauma-informed content templates with safety disclaimers, crisis resources (988 lifeline), and evidence-based frameworks
- ContentLevelToggle component with localStorage persistence for content complexity preferences
- Navigation components (TglpNavbar.jsx, Header.jsx) fully tokenized using CSS variables
- Added opacity variants (--glp-sage-10/15/20/30, --glp-rose-15/20, --glp-gold-30) to brand-tokens.css
- Added gradient tokens (--glp-logo-gradient, --glp-gold-gradient) and shadow tokens
- Typography uses font-sacred utility class for brand headings
- No hard-coded hex/rgba values in navigation components

## System Architecture

### UI/UX Decisions
The frontend features a premium, Canva-inspired visual design with HSL color formatting, custom typography, enhanced gradients, and refined shadows. It supports full light/dark themes, micro-interactions, and comprehensive accessibility features including ARIA, semantic HTML, keyboard navigation, and `prefers-reduced-motion` support. Responsive typography and safe area insets ensure mobile adaptability. A comprehensive design token system is implemented for consistent styling across three visual modes: Default, Low-Stim, and Reading.

### Technical Implementations
The project uses a monorepo structure with separate client (React 18 SPA with TypeScript, Vite, Wouter, React Hook Form, Zod, Tailwind CSS, Lucide React) and server (Node.js/Express with TypeScript) applications. The backend provides a RESTful API with middleware for CORS, security headers (Helmet), compression, logging (Morgan), and session management (Express Session). Shared types ensure monorepo consistency, and all modules are ESM. Production optimization includes code splitting, environment variable configuration, health checks, rate limiting, and graceful shutdown.

### Feature Specifications
The platform offers:
- **AI-powered Chat Therapy**: Integrated with OpenAI API for trauma-informed responses and crisis intervention.
- **Wellness Tools**: State Tracker, Journal Prompts, Reflection, Wisdom, Advanced Intellectual, and Mastery tools.
- **Specialized APIs**: Covering areas such as Knowledge Synthesis, Philosophy, Metacognition, Creativity, Resilience, Foresight, Systems Compassion, Collective Intelligence, Wisdom Synthesis, Cognitive Lab, Contemplative, Ethical Reasoning, Existential, Embodiment, Narrative, Relational, Values, Neuro-Integration, Socio-Ecology, Praxis, Post-Trauma, Self-Mastery Intelligence, Universal Content, Trauma Healing Protocols, Spiritual Intelligence, Relationship Dynamics, Cognitive Enhancement, Emotional Resilience, Life Purpose, Mind-Body Integration, Social Intelligence, Peak Performance, Personal Growth, Psychological Safety, Consciousness Expansion, Human Potential, Wisdom Traditions, Life Design, and Healing Modalities.
- **Advanced Features**: Deep Learning API, Purpose Compass API, Emotional Mastery API, Holistic Healing API, Mastery Excellence API, Content Studio API, Consciousness Expansion API, Human Potential API, Wisdom Traditions API, Life Design API, and Healing Modalities API.
- **Navigation & Discovery**: Intellectual Atlas, Strategy Maps, Collaborative Intelligence Lab, Resilience Metrics, and Adaptive Companion.
- **Security**: Rate limiting (validation-before-rate-limit pattern), CSP, input sanitization, CSRF protection, and account lifecycle management. Login rate limit: 10/15min production, 100/15min test mode.
- **Gamification**: XP, levels, streaks, and daily quests.
- **Trauma-Informed NLP Layer**: Ensures supportive user-facing text and prompts.
- **Content Studio**: UI for content transformation with save/export.
- **Study Vault**: Evidence-based research summaries.
- **Admin Health Dashboard**: Monitors uptime, DB status, and system metrics.

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