# The Genuine Love Project

## Overview
The Genuine Love Project is an AI-powered mental wellness platform designed to foster self-love, healing, and emotional growth. It provides a private, compassionate, and accessible environment through AI-assisted emotional guidance, mood tracking, journaling, crisis support, and evidence-based healing tools. The platform integrates AI with trauma-informed psychological principles to offer a comprehensive wellness toolkit, empowering users to "Live in Genuine Love" with advanced features available via subscription. The business vision is to provide a comprehensive, ethical, and accessible mental wellness solution, leveraging AI for personalized support and fostering emotional resilience for a broad user base.

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
The frontend features a premium, Canva-inspired visual design with HSL color formatting, custom typography, enhanced gradients, and refined shadows. It supports full light/dark themes, micro-interactions, and comprehensive accessibility features including ARIA, semantic HTML, keyboard navigation, and `prefers-reduced-motion` support. A comprehensive design token system is implemented for consistent styling across Default, Low-Stim, and Reading visual modes. All UI primitives include `data-testid` attributes, `focus-visible` rings, ARIA labels, `prefers-reduced-motion` support, and semantic HTML. A 3-Level Reading Mode System allows users to toggle between Beginner, Intermediate, and Advanced content levels. A "Sacred UI Component Library" provides reusable components for consistent design.

### Social Work-Informed Frameworks
The platform integrates evidence-based social work approaches such as Motivational Interviewing (MI) for language patterns, a Strengths-Based Approach for framing, and "The 12-Phase Self-Alignment Path™" as an educational transformation framework. Ethical NLP patterns are used with guardrails against coercive persuasion. An 18+ age gating mechanism ensures content suitability, and persistent disclaimers reinforce the educational, non-clinical nature of the platform, always including crisis support links.

### Technical Implementations
The project uses a monorepo structure with separate client (React 18 SPA with TypeScript, Vite, Wouter, React Hook Form, Zod, Tailwind CSS, Lucide React) and server (Node.js/Express with TypeScript) applications. The backend provides a RESTful API with middleware for CORS, security headers (Helmet), compression, logging (Morgan), and session management (Express Session). Shared TypeScript types ensure monorepo consistency. A trauma-informed NLP layer ensures supportive user-facing text, supported by a "Wellness Microcopy Library" and "Shared TypeScript Microcopy" system for deterministic, type-safe content.

### Feature Specifications
The platform offers:
- **AI-powered Chat Therapy**: Integrated with OpenAI API for trauma-informed responses and crisis intervention.
- **Wellness Tools**: State Tracker, Journal Prompts, Reflection, Wisdom, Mastery tools, Perception Refinement, Permaculture Wellness, and Self-Worth Reflection.
- **Specialized APIs**: Covering areas such as Knowledge Synthesis, Philosophy, Metacognition, Creativity, Resilience, Foresight, Systems Compassion, Collective Intelligence, Wisdom Synthesis, Cognitive Lab, Contemplative, Ethical Reasoning, Existential, Embodiment, Narrative, Relational, Values, Neuro-Integration, Socio-Ecology, Praxis, Post-Trauma, Self-Mastery Intelligence, Universal Content, Trauma Healing Protocols, Spiritual Intelligence, Relationship Dynamics, Cognitive Enhancement, Emotional Resilience, Life Purpose, Mind-Body Integration, Social Intelligence, Peak Performance, Personal Growth, Psychological Safety, Consciousness Expansion, Human Potential, Wisdom Traditions, Life Design, and Healing Modalities.
- **Advanced Features**: Deep Learning API, Purpose Compass API, Emotional Mastery API, Holistic Healing API, Mastery Excellence API, Content Studio API, Consciousness Expansion API, Human Potential API, Wisdom Traditions API, Life Design API, and Healing Modalities API.
- **Navigation & Discovery**: Intellectual Atlas, Strategy Maps, Collaborative Intelligence Lab, Resilience Metrics, and Adaptive Companion.
- **Security**: Rate limiting, CSP, input sanitization, CSRF protection, and account lifecycle management.
- **Gamification**: XP, levels, streaks, and daily quests.
- **Content Studio**: UI for content transformation with save/export, including social media template generation.
- **Study Vault**: Evidence-based research summaries.
- **Admin Health Dashboard**: Monitors uptime, DB status, and system metrics.
- **Admin Social Studio**: Multi-platform social media content management with automated posting integration.
- **Resend Email Integration**: Transactional email service for welcome emails, challenge reminders, and milestone notifications.
- **Replit Auth Integration**: OIDC authentication with sessions table.
- **Crisis Page Public Access**: The `/crisis` route is accessible without login for immediate support.
- **SEO Enhancement**: JSON-LD WebPage schema, SITE_URL constant, route-based canonical URLs, OG tags, Twitter cards.
- **Accessibility Toolbar**: Floating accessibility panel with high contrast toggle, font size options (small/medium/large/xlarge), reduce motion toggle, dyslexia-friendly font toggle. Settings persist to localStorage.
- **Daily Healing Reminders**: ReminderScheduler component with customizable check-in times, 6 reminder tones, custom messages, and notification scheduling via service worker.
- **Voice Affirmation Settings**: VoiceSettings component with voice tone selection, speed/pitch/volume controls, and Web Speech Synthesis API preview.
- **Community Affirmation Wall**: Anonymous community affirmations with "Send Light" (heart) feature, 5-280 character limit, uses sharedReflections table with emotion='affirmation' discriminator, rate-limited likes (10/min per IP).
- **Journal Insights**: Client-side sentiment analysis using keyword matching, keyword extraction, 7-day emotional flow graph, and mood-based suggested prompts.
- **AI Companion Animations**: Pulsing heart orb thinking animation with bouncing dots for emotion-aware responses.
- **Floating Lotus Guide**: Route-conditional wellness assistant showing on /journal, /dashboard, /chat, /mood, /insights, /progress with wellness tips, voice affirmations, and session-based dismissal.
- **Sacred Glow Utilities**: CSS utility classes (.glow-gold, .glow-sage, .glow-blossom, .glow-healing) for subtle ambient effects.
- **Emotion-Linked Backgrounds**: Gradient backgrounds (.bg-emotion-calm, .bg-emotion-joy, .bg-emotion-reflection, etc.) with dark mode variants and animated option with prefers-reduced-motion support.
- **Learning Hub**: Dedicated `/learn` page with guides, articles, and courses navigation. Links to `/learn/guides` and `/learn/articles` for educational content.
- **Comprehensive Route Redirects**: 230+ semantic redirects for improved discoverability including: /find→/explore/search, /search→/explore/search, /guidance→/support, /healing-tools→/practices, /worksheets→/practices, /my-journey→/dashboard, /coach→/dashboard, /coaching→/dashboard, /mentor→/dashboard, /mentoring→/dashboard, /media→/learn, /book→/learn, /downloads→/resources, /user→/profile, /apps→/tools, /appointment→/booking, /appointments→/booking, /test→/demo, /start→/onboarding, /begin→/onboarding, /join→/register, /meditations→/meditation, /members→/community, /member→/profile, /log-in→/login, /contact-us→/contact, /about-us→/about, /subscribe→/pricing, /faqs→/faq, /getting-started→/onboarding, /how-it-works→/features, /sitemap→/explore, /my-profile→/profile, /my-account→/profile, /my-settings→/settings, /preferences→/settings, /logout→/login, /signout→/login, /sign-out→/login, /log-out→/login, /products→/features, /index→/, /main→/, /intro→/onboarding, /checkin→/mood, /check-in→/mood, /workbooks→/practices, /templates→/practices, /notifications→/dashboard, /inbox→/dashboard, /messages→/chat, /alerts→/dashboard, /cart→/pricing, /treatment→/healing, /discussions→/community, /reports→/progress, /history→/journal, /favorites→/dashboard, /bookmarks→/dashboard, /saved→/dashboard, /collections→/learn, /feed→/community, /playlist→/meditation, /playlists→/meditation, /testimonial→/reviews, /review→/reviews, /creators→/about, /experts→/about, /tasks→/dashboard, /notes→/journal, /sponsor→/about, /transform→/growth, /improve→/growth, /change→/growth, /spirit→/spiritual, /sad→/sadness, /happy→/joy, /lonely→/loneliness, /stressed→/stress, /tired→/rest, /overwhelmed→/stress, /anxious→/anxiety, /nervous→/anxiety, /upset→/anger, /hurt→/healing, /frustrated→/anger, /depressed→/depression, /wellness-journey→/healing-journey, /my-healing→/healing-journey, /recovery→/healing-journey, /therapy→/support, /counseling→/support, /mental-health→/wellness.

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

## Platform Tracking (v22 Infinite Batch Engine)

### Process Engine (550/550 = 100%)
| Batch | Status |
|-------|--------|
| Batch-001 (P001-P050) | ✅ 50/50 |
| Batch-002 (P051-P100) | ✅ 50/50 |
| Batch-003 (P101-P150) | ✅ 50/50 |
| Batch-004 (P151-P200) | ✅ 50/50 |
| Batch-005 (P201-P250) | ✅ 50/50 |
| Batch-006 (P251-P300) | ✅ 50/50 |
| Batch-007 (P301-P350) | ✅ 50/50 |
| Batch-008 (P351-P400) | ✅ 50/50 |
| Batch-009 (P401-P450) | ✅ 50/50 |
| Batch-010 (P451-P500) | ✅ 50/50 |
| Batch-011 (P501-P550) | ✅ 50/50 |

### Integration Engine (200/200 = 100%)
| Batch | Status |
|-------|--------|
| Integration-001-050 | ✅ 50/50 (Core/Data/Auth/AI/Billing) |
| Integration-051-100 | ✅ 50/50 (Observability/Testing/Content/Perf/Ops) |
| Integration-101-150 | ✅ 50/50 (Security/Privacy/Backup/Admin/CMS) |
| Integration-151-200 | ✅ 50/50 (Enterprise/Multi-Tenant/SSO/Billing) |
| Integration-201-250 | ✅ 50/50 (Mobile/Voice/Community/Notifications) |

### Key Documentation
- `docs/process-engine/`: Process batches and tracking
- `docs/integrations.md`: Integration tracking
- `docs/registry/`: Feature map, endpoints, routes, schema
- `docs/duplicates/`: Duplicate scan and collision reports
- `docs/slos.md`: SLO definitions
- `docs/incident-response.md`: Incident playbook
- `docs/security-review.md`: Security checklist

### Scan Commands
- `npm run dup-scan`: Duplicate + collision detection
- `npm run arch-scan`: Architecture registry generation
- `npm run dedupe-plan`: Generate deduplication plan
- `npm run dedupe-safe`: Safe quarantine (no deletion)