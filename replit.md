# The Genuine Love Project

## Overview
The Genuine Love Project is an AI-powered mental wellness platform focused on self-love, healing, and emotional growth. It offers a private, compassionate, and accessible environment through AI-assisted emotional guidance, mood tracking, journaling, crisis support, and evidence-based healing tools. The platform integrates AI with trauma-informed psychological principles to provide a comprehensive wellness toolkit, aiming to empower users to "Live in Genuine Love." Its business vision is to deliver an ethical, accessible, and personalized mental wellness solution, leveraging AI to foster emotional resilience for a broad user base.

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
The frontend features a premium, Canva-inspired visual design with HSL color formatting, custom typography, enhanced gradients, and refined shadows. It supports full light/dark themes, micro-interactions, and comprehensive accessibility features including ARIA, semantic HTML, keyboard navigation, and `prefers-reduced-motion` support. A design token system ensures consistent styling across Default, Low-Stim, and Reading visual modes. All UI primitives include `data-testid` attributes, `focus-visible` rings, ARIA labels, `prefers-reduced-motion` support, and semantic HTML. A 3-Level Reading Mode System allows users to toggle content levels. A "Sacred UI Component Library" provides reusable components.

### Social Work-Informed Frameworks
The platform integrates evidence-based social work approaches, including Motivational Interviewing (MI) for language patterns, a Strengths-Based Approach for framing, and "The 12-Phase Self-Alignment Path™" as an educational framework. Ethical NLP patterns are used with guardrails, and an 18+ age gating mechanism is implemented. Persistent disclaimers reinforce the educational, non-clinical nature of the platform, always including crisis support links.

### Technical Implementations
The project uses a monorepo with separate client (React 18 SPA with TypeScript, Vite, Wouter, React Hook Form, Zod, Tailwind CSS, Lucide React) and server (Node.js/Express with TypeScript) applications. The backend provides a RESTful API with middleware for CORS, security headers (Helmet), compression, logging (Morgan), and session management (Express Session). Shared TypeScript types ensure monorepo consistency. A trauma-informed NLP layer, supported by a "Wellness Microcopy Library" and "Shared TypeScript Microcopy" system, ensures supportive user-facing text.

### Feature Specifications
The platform offers:
- **Core Features**: AI-powered Chat Therapy, Wellness Tools (State Tracker, Journal Prompts, Reflection, Wisdom, Mastery, Perception Refinement, Permaculture Wellness, Self-Worth Reflection).
- **Specialized APIs**: A broad range of APIs for Knowledge Synthesis, Philosophy, Metacognition, Creativity, Resilience, Foresight, Systems Compassion, Collective Intelligence, Wisdom Synthesis, Cognitive Lab, Contemplative, Ethical Reasoning, Existential, Embodiment, Narrative, Relational, Values, Neuro-Integration, Socio-Ecology, Praxis, Post-Trauma, Self-Mastery Intelligence, Universal Content, Trauma Healing Protocols, Spiritual Intelligence, Relationship Dynamics, Cognitive Enhancement, Emotional Resilience, Life Purpose, Mind-Body Integration, Social Intelligence, Peak Performance, Personal Growth, Psychological Safety, Consciousness Expansion, Human Potential, Wisdom Traditions, Life Design, Healing Modalities.
- **Advanced API Suites**: Deep Learning API, Purpose Compass API, Emotional Mastery API, Holistic Healing API, Mastery Excellence API, Content Studio API, Consciousness Expansion API, Human Potential API, Wisdom Traditions API, Life Design API, Healing Modalities API.
- **Navigation & Discovery**: Intellectual Atlas, Strategy Maps, Collaborative Intelligence Lab, Resilience Metrics, Adaptive Companion.
- **Security**: Rate limiting, CSP, input sanitization, CSRF protection, and account lifecycle management.
- **Engagement**: Gamification (XP, levels, streaks, daily quests), Content Studio (UI for content transformation and social media templates), Study Vault (evidence-based research summaries).
- **Admin Tools**: Admin Health Dashboard (monitors uptime, DB status, system metrics), Admin Social Studio (multi-platform social media content management).
- **User Features**: Resend Email Integration (transactional emails), Replit Auth Integration (OIDC authentication), Crisis Page Public Access (`/crisis` route), SEO Enhancement (JSON-LD, OG tags, Twitter cards), Accessibility Toolbar (high contrast, font size, reduce motion, dyslexia-friendly font), Daily Healing Reminders (customizable check-in times, tones, messages), Voice Affirmation Settings (voice tone, speed, pitch, volume controls), Community Affirmation Wall (anonymous affirmations, "Send Light" feature), Journal Insights (client-side sentiment analysis, emotional flow graph, suggested prompts), AI Companion Animations (pulsing heart orb, bouncing dots), Floating Lotus Guide (route-conditional wellness assistant), Sacred Glow Utilities (CSS utility classes), Emotion-Linked Backgrounds (gradient backgrounds with dark mode variants and animation option).
- **Content Organization**: Learning Hub (`/learn` page with guides, articles, courses), Comprehensive Route Redirects (510+ semantic redirects for improved discoverability).

### Monetization Architecture (Two-Tier: Free/Pro)
The platform implements a two-tier monetization model (Free/Pro) managed via `client/src/config/featureAccess.js`. User subscription status is canonicalized in `users.subscription_status` and exposed via `AuthContext`. Pro-only features are gently gated with `PlanGate.jsx`, offering blurred teasers and upgrade CTAs. Server-side enforcement for limits (e.g., AI Chat sessions) is implemented in `server/routes/ai.mjs`. Stripe handles billing, with webhooks (`server/routes/webhook.mjs`) updating user statuses and triggering email lifecycles via Resend.

### Soft Launch & Selective Visibility
A `SOFT_LAUNCH_MODE=true` environment flag activates a soft launch, displaying a dismissible banner and enabling a feedback widget for user input. Aggregate, privacy-first metrics track page views and funnel steps. Smoke tests validate critical routes, and a trauma-informed error recovery system is in place.

### Narrative Amplification System
A `docs/NARRATIVE_SPINE.md` defines the project's messaging and brand voice. Social media content drafts (`content/narrative/social_posts.json`) are provided for various platforms, adhering to ethical constraints. A `docs/CANVA_EXPORT_PACK.md` contains visual templates for consistent branding. An admin UI (`/admin/narrative`) facilitates the drafting, review, and approval workflow for narrative content.

### Publishing & Narrative Distribution Layer
The platform utilizes a unified `blog_posts` table for all publishable content types (blog, newsletter, reflection, essay, note), supporting CRUD operations, RSS feeds, and comment sections. Newsletter readiness includes subscriber collection and consent tracking via Resend for transactional emails. A `socialPosts` table and `SocialStudioAdmin.jsx` manage social content creation, emphasizing a human-in-the-loop approach. Admin tools for newsletters display subscriber statistics, and publishing observability tracks `view_count` on blog posts.

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
- **Perplexity**: Factual AI.