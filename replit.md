# The Genuine Love Project

## Overview
The Genuine Love Project is an AI-powered mental wellness platform offering self-love, healing, and emotional growth through AI-assisted guidance, mood tracking, journaling, crisis support, and evidence-based tools. It aims to provide an ethical, accessible, and personalized mental wellness solution, leveraging AI and trauma-informed psychological principles to foster emotional resilience.

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
The frontend features a premium, Canva-inspired design with HSL color formatting, custom typography, enhanced gradients, and refined shadows. It supports full light/dark themes, micro-interactions, and comprehensive accessibility features (ARIA, semantic HTML, keyboard navigation, `prefers-reduced-motion`). A design token system ensures consistent styling across Default, Low-Stim, and Reading visual modes. UI primitives include `data-testid` attributes, `focus-visible` rings, ARIA labels, and semantic HTML. A 3-Level Reading Mode System and a "Sacred UI Component Library" are provided.

### Social Work-Informed Frameworks
The platform integrates Motivational Interviewing (MI), a Strengths-Based Approach, and "The 12-Phase Self-Alignment Path™." It uses ethical NLP patterns with guardrails, implements 18+ age gating, and includes persistent disclaimers reinforcing its educational, non-clinical nature, always with crisis support links.

### Technical Implementations
The project uses a monorepo with a client (React 18 SPA with TypeScript, Vite, Wouter, React Hook Form, Zod, Tailwind CSS, Lucide React) and a server (Node.js/Express with TypeScript). The backend offers a RESTful API with middleware for CORS, security (Helmet), compression, logging (Morgan), and session management (Express Session). Shared TypeScript types ensure monorepo consistency. A trauma-informed NLP layer, supported by a "Wellness Microcopy Library" and "Shared TypeScript Microcopy" system, ensures supportive user-facing text.

### Feature Specifications
The platform provides:
- **Core Features**: AI-powered Chat Therapy, Wellness Tools (State Tracker, Journal Prompts, Reflection, Wisdom, Mastery, Perception Refinement, Permaculture Wellness, Self-Worth Reflection).
- **Specialized APIs**: A broad range of APIs for Knowledge Synthesis, Philosophy, Metacognition, Creativity, Resilience, Foresight, Systems Compassion, Collective Intelligence, Wisdom Synthesis, Cognitive Lab, Contemplative, Ethical Reasoning, Existential, Embodiment, Narrative, Relational, Values, Neuro-Integration, Socio-Ecology, Praxis, Post-Trauma, Self-Mastery Intelligence, Universal Content, Trauma Healing Protocols, Spiritual Intelligence, Relationship Dynamics, Cognitive Enhancement, Emotional Resilience, Life Purpose, Mind-Body Integration, Social Intelligence, Peak Performance, Personal Growth, Psychological Safety, Consciousness Expansion, Human Potential, Wisdom Traditions, Life Design, Healing Modalities.
- **Advanced API Suites**: Deep Learning API, Purpose Compass API, Emotional Mastery API, Holistic Healing API, Mastery Excellence API, Content Studio API, Consciousness Expansion API, Human Potential API, Wisdom Traditions API, Life Design API, Healing Modalities API.
- **Security**: Rate limiting, CSP, input sanitization, CSRF protection, and account lifecycle management.
- **Engagement**: Gamification, Content Studio, Study Vault.
- **Admin Tools**: Admin Health Dashboard, Admin Social Studio, Platform Tools Dashboard, Admin Command Center, Shared AdminQueryStates components.
- **User Features**: Resend Email Integration, Replit Auth Integration, Crisis Page Public Access, SEO Enhancement, Accessibility Toolbar, Daily Healing Reminders, Voice Affirmation Settings, Community Affirmation Wall, Journal Insights, AI Companion Animations, Floating Lotus Guide, Sacred Glow Utilities, Emotion-Linked Backgrounds.
- **Content Organization**: Learning Hub, Comprehensive Route Redirects.

### Monetization Architecture
A four-tier (Free/Starter/Pro/Elite) monetization model is managed via `client/src/config/featureAccess.js` with a `PLAN_HIERARCHY` array for access-level comparisons. Plans: Free ($0/forever), Starter ($9.99 one-time payment), Pro ($12.99/mo or $109/yr subscription), Elite ($29.99/mo or $249/yr subscription). Subscription status is stored in `users.subscription_status` and exposed via `AuthContext`. Features are gently gated with `PlanGate.jsx` (hierarchy-aware), and server-side enforcement for AI chat limits is in `server/routes/ai.mjs` (Free: 5/day, Starter: 25/day, Pro/Elite: unlimited). Stripe handles billing with webhooks (`server/routes/webhook.mjs`) for user status updates and email lifecycles via Resend. Backend billing routes (`server/routes/billing.mjs`) support `payment` mode for Starter one-time purchases and `subscription` mode for Pro/Elite.

### Soft Launch & Selective Visibility
A `SOFT_LAUNCH_MODE=true` environment flag activates a soft launch with a dismissible banner and feedback widget. Aggregate, privacy-first metrics track page views. Smoke tests validate critical routes, and a trauma-informed error recovery system is in place.

### Narrative Amplification System
`docs/NARRATIVE_SPINE.md` defines messaging and brand voice. Social media content drafts (`content/narrative/social_posts.json`) are provided, and `docs/CANVA_EXPORT_PACK.md` contains visual templates. An admin UI (`/admin/narrative`) facilitates narrative content workflow.

### Publishing & Narrative Distribution Layer
A unified `blog_posts` table supports all publishable content types (blog, newsletter, reflection, essay, note) with CRUD operations, RSS feeds, and comments. Newsletter readiness includes subscriber collection via Resend. A `socialPosts` table and `SocialStudioAdmin.jsx` manage social content creation. Admin tools for newsletters display subscriber statistics, and publishing observability tracks `view_count`.

### Observability & Governance Layer
- `/api/health` — Pure liveness probe (DB, AI, memory, services). No dead counters.
- `/api/system` — Real-time system telemetry (5xx/4xx tracking, total requests, memory). Middleware tracks every response status code. Mounted in `dev.mjs`, `app.mjs`, AND `index.mjs` (production parity).
- `/api/system/history` — Auth-protected (JWT + admin). 60-second snapshots, 120-entry rolling window.
- `/api/kernel/version` — Public. Returns Prompt-OS v8.0.0 metadata (6 domains, 15 states, 9 gates, 11 failure types).
- `/api/kernel/health` — Auth-protected. Runs 51 kernel integrity checks against `prompt-os-kernel/` files.
- `/api/kernel/validate` — Auth-protected (POST). Validates PromptSpec module definitions against governance schema. Domains aligned with `promptspec.schema.json` enums (HEALING_DOMAIN, BUSINESS_DOMAIN, PLATFORM_DOMAIN, DESIGN_DOMAIN, RESEARCH_DOMAIN, CROSS_DOMAIN).
- `/api/kernel/schema` — Auth-protected. Returns the PromptSpec JSON Schema.
- Kernel bridge: `server/engine/prompt-os/kernel-bridge.mjs`. Kernel files: `prompt-os-kernel/`.
- Command Center (`/command`) renders KernelStatusPanel, SystemTelemetryPanel, SystemHealthPanel, RecentActivityPanel inline.
- Architecture Lock: `prompt-os-kernel/governance/ARCHITECTURE_LOCK.md` — frozen routes, panels, domain separation rules.
- Quarantine: `client/src/components/_quarantine/` — orphaned components (AchievementToast, BadgeDisplay, DailyCheckIn, SiteFooter) moved non-destructively. 30-day retention before deletion.

### Production Readiness
- **Readiness gate**: `server/index.mjs` returns 503 for all non-health requests until `serverReady=true` (prevents 401 race during async initialization).
- **Health probes**: `/__health` (readiness), `/healthz` (liveness), `/api/health` (deep probe with DB/AI/services), `/api/health-check` (simple liveness).
- **Telemetry parity**: Response status tracking middleware installed in `dev.mjs`, `app.mjs`, AND `index.mjs`.
- **Request tracing**: `x-request-id` header set on every response for correlation tracking.
- **Security hardened**: `requireAdminForRepair` no longer allows non-admin authenticated users to access maintenance endpoints.

### Phase 4: Controlled Expansion Engine
- **Change Gate**: `prompt-os-kernel/governance/CHANGE_GATE.md` — 5-gate protocol (domain classification, impact scope, risk check, verification steps, rollback plan). All changes must pass all gates.
- **Component Registry**: `client/src/_registry/components.json` — tracks active, quarantined, and frozen components with modification rules.
- **System Verification**: `node scripts/verify-system.mjs` — single-command truth check (build, endpoints, auth, telemetry, kernel, health). 13 automated checks.
- **Frozen Components**: Core routes, auth middleware, telemetry, kernel bridge, safety footer, wellness shell — no modification without proven failure.

### System Design Choices
`shared/schema.mjs` defines Drizzle ORM models for the Neon PostgreSQL database, utilizing UUIDs, TEXT-based IDs, serial integers, and indexed foreign key constraints. Production security includes CORS allowlisting, JWT authentication, Helmet, and rate limiting.

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