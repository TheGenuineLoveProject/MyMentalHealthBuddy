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

**Landing Page Architecture** (CanvaLanding.jsx): The landing page uses an NLP-informed emotional journey structure with 9 sections: Hero → Stats → About → Philosophy → Features (8 cards, 4-col grid) → Steps → Testimonials → FAQ (8 questions) → Final CTA. The "Philosophy" section (`id="philosophy"`) introduces 4 pillars (Attunement Over Advice, Your Mind Is One of a Kind, Unconditional Friendship, Growth at Your Own Pace) with a manifesto quote in a consciousness-expanding visual container. All copy positions the AI buddy as coach, mentor, guide, confidence builder, self-worth builder, stress manager, and behavior modifier using NLP-informed language.

**Consciousness-Expanding CSS Layer** (canva-landing.css): Includes `aurora-drift` animated background, `awareness-pulse` ring animation, `gentle-breathe` scale animation, `text-shimmer` gold gradient text, `depth-shadow` multi-layer shadows, `.philosophy-card` with hover gradient border, `.manifesto-quote` with radial gradient overlays. All animations respect `prefers-reduced-motion`.

**Enterprise Elite II Advanced Design System** (canva-landing.css, bottom section): Scroll-triggered reveal system (`.section-reveal` + IntersectionObserver with `stagger-child` cascade delays), philosophical section flow gradients (`.section-flow-sage`, `.section-flow-warm`, `.section-flow-deep`), elite card depth systems (`.feature-card-elite` with accent-colored top border reveal, `.testimonial-card-elite`, `.step-card-elite`, `.stat-card-elite`, `.about-card-elite`), consciousness dividers (gold gradient line + glowing dot), hero depth layer (multi-gradient radial overlay), CTA enterprise ambient glow animation, `.section-breathe` responsive vertical padding, and `.gold-accent-line` section separator. IntersectionObserver has fallback for unsupported browsers. All elite hover transforms disabled under `prefers-reduced-motion`.

**Avatar SVG System**: The mmhb-icon.svg features a futuristic humanoid figure with sage-to-teal gradient background, tech orbital arcs, golden inner glow, crown glow, rose accent arcs, ambient particles (sage, gold, rose colors), and multiple blur/bloom filters for depth.

### Technical Implementations
The project is a monorepo comprising a client (React 18 SPA with TypeScript, Vite, Wouter, React Hook Form, Zod, Tailwind CSS, Lucide React) and a server (Node.js/Express with TypeScript). The backend provides a RESTful API with middleware for CORS, security (Helmet), compression, logging (Morgan), and session management (Express Session). Shared TypeScript types maintain consistency across the monorepo. A trauma-informed NLP layer, supported by a "Wellness Microcopy Library," ensures supportive user-facing text. The system integrates Social Work-Informed Frameworks like Motivational Interviewing (MI) and a Strengths-Based Approach, and features "The 12-Phase Self-Alignment Path™." Ethical NLP patterns with guardrails, 18+ age gating, and persistent disclaimers with crisis support links are integral.

**Dual-Engine AI Prompt Architecture** (`ai/` directory): Two separated AI engines with hard data boundaries — `healing/` (user-facing, anonymous/subscriber audiences only) and `business/` (admin/staff only). Each engine has a `registry.json` (prompt manifest), `system.md` (engine-wide system prompt), and `prompts/*.md` modules. Healing engine includes 8 trauma-informed modules (h01_intake, h02_journal_reflect, h03_cbt_reframe, h04_act_values, h05_breathing_grounding, h06_sleep_reset, h07_conflict_script, h08_safety_check). Business engine includes 10 ops modules (b01_offer_design through b10_ops_sops). Core orchestration in `ai/core/` (TypeScript): `policy.ts` (RBAC + data boundary enforcement, "user data" forbidden in business engine), `router.ts` (intent routing with crisis-first triage — `assessRisk(userText)` evaluated before intentHint), `risk.ts` (crisis pattern detection), `redact.ts` (PII redaction for telemetry), `telemetry.ts` (structured event logging), `promptRunner.ts` (OpenAI execution wrapper with regex + registry-allowlist path-traversal hardening). All healing prompts hard-route crisis signals to h08_safety_check, which surfaces 988/741741 in the first response.

**Live HTTP Routes for Dual-Engine** (mounted in `server/dev.mjs` BEFORE the legacy `/api/ai` router so prefix-match order resolves correctly):
- `POST /api/ai/healing` and `GET /api/ai/healing/registry` — public + authed users; gated by `requireAdult` (18+ age cookie) → `promptshield` (injection filter) → handler. Routes through `server/lib/promptEngine.mjs` (.mjs adapter that reads `ai/healing/registry.json` + `prompts/*.md` from disk).
- `POST /api/ai/business` and `GET /api/ai/business/registry` — staff only; gated by `authGuard` → `requireAdmin` → `rbac` (engine access) → `promptshield` → handler. Reads `ai/business/registry.json`.
- Supporting middleware: `server/middleware/promptshield.mjs` (prompt injection detection), `server/middleware/rbac.mjs` (per-engine role gate). AI completions reuse existing `server/utils/aiClient.mjs` (`chatCompletion`, `isConfigured`).

**Self-Tuning Fallback Library + Insights** (`server/routes/ai.mjs`): The live `/api/ai/chat` route (mounted under `requireAdult` + `optionalAuth`, guests allowed) uses a 7-branch `buildSupportiveReply()` keyword router (overwhelmed, anxious, sad, angry, lonely, tired, generic) for both offline (`!isConfigured()`) and OpenAI-error fallback paths. Every chat call records to in-memory `metrics.mjs` counters: `ai_chat_message_count` (by `user`/`guest`), `ai_chat_reply_source` (`openai`/`fallback_offline`/`fallback_error`), `ai_fallback_branch` (which branch was hit), and `ai_crisis_detected` (volume of 988/741741 escalations). Crisis detection runs FIRST and short-circuits before any history fetch, OpenAI call, or DB write. DB inserts to `ai_messages` are gated inside `if (userId)`. New admin-only `GET /api/ai/insights` endpoint (gated by `requireAdult` → `requireAuth` → `requireAdmin`) returns the full insights summary so you can see which emotional branches users actually need most — feeding the self-tuning loop.
- Port note: `.env`'s `PORT` override removed so the app binds to default 5000, matching `.replit`'s `waitForPort = 5000` (resolved a workflow-restart timeout caused by the prior 5001 mismatch).

### Feature Specifications
The platform offers:
- **Core Features**: AI-powered Chat Therapy, Wellness Tools (State Tracker, Journal Prompts, Reflection, Wisdom, Mastery, Perception Refinement, Permaculture Wellness, Self-Worth Reflection).
- **Specialized APIs**: A broad range of APIs for Knowledge Synthesis, Philosophy, Metacognition, Creativity, Resilience, Foresight, Systems Compassion, Collective Intelligence, Wisdom Synthesis, Cognitive Lab, Contemplative, Ethical Reasoning, Existential, Embodiment, Narrative, Relational, Values, Neuro-Integration, Socio-Ecology, Praxis, Post-Trauma, Self-Mastery Intelligence, Universal Content, Trauma Healing Protocols, Spiritual Intelligence, Relationship Dynamics, Cognitive Enhancement, Emotional Resilience, Life Purpose, Mind-Body Integration, Social Intelligence, Peak Performance, Personal Growth, Psychological Safety, Consciousness Expansion, Human Potential, Wisdom Traditions, Life Design, Healing Modalities.
- **Brand Color Palette ("Enterprise Elite II")**: Luminous Sage #1ec890, Abyssal Wisdom #062a2a, Sacred Pearl #fcf6ea, Wisdom Ink #142626, Liquid Amber #be8622, Deep Amber #9e7018, Heart Rose #d08672, Consciousness Violet #6c58b8. Section dividers use a gold-sage gradient line between all major landing page sections. All colors have synced RGB helpers (sage=30,200,144; ink=20,38,38; gold=190,134,34; rose=208,134,114; violet=108,88,184; sage-deep=6,42,42; paper=252,246,234), rgba opacity variants, and extended palette scales (teal/gold/sage/blush spectrums) in brand-tokens.css. Semantic aliases use CSS variable references (e.g., rgba(var(--glp-ink-rgb), 0.72)) for future-proof single-source consistency.
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