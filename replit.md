# The Genuine Love Project

## Overview
The Genuine Love Project is an AI-powered mental wellness platform designed to foster self-love, healing, and emotional growth. It offers a private, compassionate, and accessible environment through AI-assisted emotional guidance, mood tracking, journaling, crisis support, and evidence-based healing tools. The platform aims to provide a comprehensive wellness toolkit, empowering users to "Live in Genuine Love" by integrating AI with trauma-informed psychological principles, with advanced features available via subscription.

## User Preferences
- Preferred communication style: Simple, everyday language
- Engineering standards: A→Z 360° complete solutions
- Mental health approach: Trauma-informed, supportive, non-clinical language
- UX philosophy: Gentle, compassionate, accessible

## System Architecture

### UI/UX Decisions
The frontend features a premium, Canva-inspired visual design with HSL color formatting, custom typography, enhanced gradients, and refined shadows. It supports full light/dark themes, micro-interactions, and comprehensive accessibility features including ARIA, semantic HTML, keyboard navigation, and `prefers-reduced-motion` support. Responsive typography and safe area insets ensure mobile adaptability. A comprehensive design token system is implemented for consistent styling.

### Technical Implementations
The project utilizes a monorepo structure with separate client and server applications. The frontend is a React 18 SPA with TypeScript, Vite, Wouter for routing, React Hook Form with Zod for validation, and Tailwind CSS with Lucide React for styling. The backend is a Node.js and Express application with TypeScript, providing a RESTful API. It incorporates middleware for CORS, security headers (Helmet), compression, logging (Morgan), and session management (Express Session). Shared types ensure monorepo consistency, and all modules are ESM. The application is production-optimized with code splitting, environment variable configuration, health checks, rate limiting, and graceful shutdown handlers.

### Feature Specifications
The platform offers:
- **AI-powered Chat Therapy**: Integrated with OpenAI API for trauma-informed responses and crisis intervention, including crisis detection for self-harm intent.
- **Wellness Tools**: A comprehensive suite including a State Tracker, Journal Prompts, Reflection, Wisdom, Advanced Intellectual, and Mastery tools.
- **Specialized APIs**: Covering areas like Knowledge Synthesis, Philosophy, Metacognition, Creativity, Resilience, Foresight, Systems Compassion, Collective Intelligence, Wisdom Synthesis, Cognitive Lab, Contemplative, Ethical Reasoning, Existential, Embodiment, Narrative, Relational, Values, Neuro-Integration, Socio-Ecology, Praxis, Post-Trauma, Self-Mastery Intelligence, Universal Content, Trauma Healing Protocols, Spiritual Intelligence, Relationship Dynamics, Cognitive Enhancement, Emotional Resilience, Life Purpose, Mind-Body Integration, Social Intelligence, Peak Performance, Personal Growth, Psychological Safety, Consciousness Expansion, Human Potential, Wisdom Traditions, Life Design, and Healing Modalities.
- **Advanced Features**: Deep Learning API, Purpose Compass API, Emotional Mastery API, Holistic Healing API, Mastery Excellence API, Content Studio API, Consciousness Expansion API, Human Potential API, Wisdom Traditions API, Life Design API, and Healing Modalities API.
- **Navigation & Discovery**: Intellectual Atlas, Strategy Maps, Collaborative Intelligence Lab, Resilience Metrics, and Adaptive Companion.
- **Security**: Rate limiting, CSP, input sanitization, CSRF protection, and account lifecycle management.
- **Gamification**: XP, levels, streaks, and daily quests.
- **Trauma-Informed NLP Layer**: Ensures all user-facing text and prompts are supportive.
- **Content Studio**: Full UI for content transformation with save/export.
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

## Design System

### Visual Doctor Tool
- **Script**: `npm run visual:doctor` - scans all components for raw hex colors
- **Report**: `docs/VISUAL_DOCTOR_REPORT.md` - auto-generated audit report
- **Enforcement**: Fails build if raw hex colors found outside token files

### Premium Visual System (January 2026)
- **Typography Tokens**: Font families, weights (300-800), letter spacing, line heights
- **Shadow System**: xs through 2xl, inner shadows, glow variants (sage, gold, teal)
- **Gradient Presets**: hero, card, glass, shimmer, sage, gold, premium
- **Animation Timing**: ease-in, ease-out, ease-in-out, bounce, elastic
- **Z-Index Scale**: base, dropdown, sticky, modal, popover, tooltip, toast

### Premium Component Classes
- **Cards**: `.card-premium`, `.card-shimmer`
- **Inputs**: `.input-premium`
- **Skeletons**: `.skeleton-premium`, `.skeleton-premium-card`
- **Icons**: `.icon-glow-sage/gold/teal`
- **Text**: `.text-gradient-premium`, `.text-gradient-gold`, `.text-glow`
- **Interactions**: `.hover-lift`, `.hover-scale`, `.hover-glow`
- **Animations**: `animate-pulse-ring`, `animate-float`, `animate-fade-in-up-delayed`

### Build Metrics
- **Build Time**: ~16 seconds
- **Visual Doctor**: 267 files clean, 0 hex violations
- **Navigation Audit**: 0 broken links