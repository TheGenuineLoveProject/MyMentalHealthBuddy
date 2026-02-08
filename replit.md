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
- **Feature Access Map**: `client/src/config/featureAccess.js` — single source of truth for feature → plan mapping
- **Canonical Status**: `users.subscription_status` column = "free" | "pro" only (never raw Stripe statuses)
- **AuthContext**: Exposes `subscriptionStatus` and `isPro` to all frontend components via `useAuth()`
- **PlanGate.jsx**: Wraps Pro-only features with gentle upgrade prompt (blurred teaser + upgrade CTA)
- **Soft Gating**: AI Chat has 5 free daily sessions; Pro gets unlimited. Core tools (mood, journal, reflection) always free.
- **Server Enforcement**: `server/routes/ai.mjs` enforces daily session limit server-side (counts user messages per day)
- **Pro Badge**: Gold crown badge appears in navbar (TglpNavbar.jsx) and dashboard greeting for Pro users
- **Billing Page**: `/account/billing` uses AuthContext as primary plan source, with Stripe API as fallback for details
- **Email Lifecycle**: Upgrade confirmation + cancellation acknowledgment emails via Resend (triggered from webhook.mjs)
- **Webhook**: `server/routes/webhook.mjs` handles all Stripe events, writes canonical statuses, sends lifecycle emails

### Publishing & Narrative Distribution Layer
- **Canonical Content Model**: `blog_posts` table extended with `content_type` (blog_post/newsletter/reflection/essay/note) and `visibility` (public/private/draft) columns. Single table serves all publishable content types. Documented in `docs/PUBLISHING_MODEL.md`.
- **Blog API**: Full CRUD at `/api/blog` with content_type filtering (`?type=newsletter`), visibility enforcement on public endpoints, RSS feed, draft management, and comments. `BlogPost.jsx` renders individual posts.
- **Newsletter Readiness**: Subscriber collection via `NewsletterSignup.jsx` → `/api/leads` with consent tracking. Transactional emails (Resend) separated from editorial newsletters. Documented in `docs/NEWSLETTER_READINESS.md`. No email blasting — readiness only.
- **Social Content Admin**: `socialPosts` table with creative workspace statuses (idea/drafted/approved/archived/published). CRUD API at `/api/social-posts` with status + platform filtering. `SocialStudioAdmin.jsx` provides the admin UI. Human-in-the-loop only — no automation, no API posting.

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