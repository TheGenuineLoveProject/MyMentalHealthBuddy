# The Genuine Love Project

## Overview
The Genuine Love Project is an AI-powered mental wellness platform focused on fostering self-love, healing, and emotional growth. It offers a private, compassionate, and accessible environment through AI-assisted emotional guidance, mood tracking, journaling, crisis support, and evidence-based healing tools. The platform aims to provide a comprehensive wellness toolkit, with advanced features available via subscription, empowering users to "Live in Genuine Love" by integrating AI with trauma-informed psychological principles.

## User Preferences
- Preferred communication style: Simple, everyday language
- Engineering standards: A→Z 360° complete solutions
- Mental health approach: Trauma-informed, supportive, non-clinical language
- UX philosophy: Gentle, compassionate, accessible

## System Architecture

### UI/UX Decisions
The frontend features a premium, Canva-inspired visual design with HSL color formatting, custom typography, enhanced gradients, and refined shadows. It supports full light/dark themes, micro-interactions, and comprehensive accessibility features including ARIA, semantic HTML, keyboard navigation, and `prefers-reduced-motion` support. Responsive typography and safe area insets ensure mobile adaptability.

### Technical Implementations
The project utilizes a monorepo structure with separate client and server applications. The frontend is a React 18 SPA with TypeScript, Vite, Wouter for routing, React Hook Form with Zod for validation, and Tailwind CSS with Lucide React for styling. The backend is a Node.js and Express application with TypeScript, providing a RESTful API. It incorporates middleware for CORS, security headers (Helmet), compression, logging (Morgan), and session management (Express Session). Shared types ensure monorepo consistency, and all modules are ESM.

### Feature Specifications
The platform offers:
- **AI-powered Chat Therapy**: Integrated with OpenAI API for trauma-informed responses and crisis intervention.
- **Wellness Tools**: A comprehensive suite including a State Tracker, Journal Prompts, and various Reflection, Wisdom, Advanced Intellectual, and Mastery tools.
- **Specialized APIs**: Extensive APIs covering areas like Knowledge Synthesis, Philosophy, Metacognition, Creativity, Resilience, Foresight, Systems Compassion, Collective Intelligence, Wisdom Synthesis, Cognitive Lab, Contemplative, Ethical Reasoning, Existential, Embodiment, Narrative, Relational, Values, Neuro-Integration, Socio-Ecology, Praxis, and Post-Trauma.
- **Advanced Features**: Deep Learning API, Purpose Compass API, Emotional Mastery API, Holistic Healing API, Mastery Excellence API, Content Studio API, Consciousness Expansion API, Human Potential API, Wisdom Traditions API, Life Design API, and Healing Modalities API.
- **Navigation & Discovery**: Intellectual Atlas, Strategy Maps, Collaborative Intelligence Lab, Resilience Metrics, and Adaptive Companion.
- **Security**: Rate limiting, CSP, input sanitization, CSRF protection, and account lifecycle management.
- **Gamification**: XP, levels, streaks, and daily quests.
- **Crisis Detection**: AI routes scan for self-harm intent keywords and provide resources.
- **Trauma-Informed NLP Layer**: Ensures all user-facing text and prompts are supportive.
- **Content Studio**: Full UI for 1→10 content transformation with save/export.
- **Study Vault**: Evidence-based research summaries.
- **Admin Health Dashboard**: Monitors uptime, DB status, and system metrics.

### System Design Choices
The application is production-optimized with code splitting, environment variable configuration, health checks, rate limiting, and graceful shutdown handlers. A unified `shared/schema.mjs` defines Drizzle ORM models for the Neon PostgreSQL database, utilizing UUIDs, TEXT-based IDs, serial integers, and indexed foreign key constraints. Production security includes CORS allowlisting, JWT authentication, Helmet, and rate limiting.

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

## Platform Metrics (as of December 2025)
- **86 API Route Files**: Comprehensive intellectual, wellness, and administrative APIs
- **77 Registered API Routers**: Production and development servers
- **109 Frontend Pages**: Full-featured UI components (including Content Studio, Study Vault)
- **152 Passing Tests**: Unit and integration coverage
- **1000+ Discrete Intellectual Instruments**: World-class toolkit for MIT-level users

## Recent API Additions

### Phase 12 APIs
- **Self-Mastery Intelligence API**: Discipline systems (self-control, focus, habit architecture), emotional intelligence mastery (4 EQ domains, emotional agility), mindset mastery (growth, abundance, antifragile), personal power frameworks, and excellence models (Kaizen, deliberate practice, mastery path)
- **Universal Content API**: Content frameworks (Hero's Journey, PAS, AIDA, Storytelling Spine), content types (educational, promotional, social), headline formulas, hooks & openers, repurposing strategies, and calls to action
- **Trauma Healing Protocols API**: Grounding techniques (5-4-3-2-1, container exercise), nervous system regulation (polyvagal theory, physiological sigh, vagal toning), parts work (IFS-informed), somatic healing practices, reparenting protocols, and window of tolerance framework
- **Spiritual Intelligence API**: Meditation practices (Metta, Vipassana, TM, Centering Prayer, Zazen), contemplation methods (Lectio Divina, Koan, Atma Vichara), breathwork (Pranayama, Holotropic, Wim Hof), developmental stages (Wilber Integral, Fowler Faith), and SQ domains
- **Relationship Dynamics API**: Attachment styles (Bowlby/Ainsworth), love languages (Chapman), Gottman's Four Horsemen, conflict styles (Thomas-Kilmann), healthy relationship patterns, and repair strategies
- **Cognitive Enhancement API**: Memory techniques (Memory Palace, Spaced Repetition, Chunking), focus strategies (Pomodoro, Time Blocking, Ultradian Rhythms), learning acceleration (Feynman Technique, Deliberate Practice), cognitive biases and brain health
- **Emotional Resilience API**: Stress management (Physiological Sigh, Box Breathing, Cognitive Reframing), emotional agility framework (Susan David), inner strength builders (antifragility, post-traumatic growth, psychological flexibility), regulation strategies (RAIN, Name It to Tame It, Opposite Action)
- **Life Purpose API**: Ikigai framework, values discovery exercises, mission crafting templates, purpose frameworks (Eulogy Exercise, Odyssey Planning, Zone of Genius), meaning sources (Viktor Frankl's logotherapy)
- **Mind-Body Integration API**: Breathwork techniques (4-7-8, Coherent, Tummo, Nadi Shodhana), somatic practices (PMR, Body Scan, TRE), movement therapy (Yoga, Qigong, Tai Chi), polyvagal theory, embodiment exercises (Focusing, Pendulation, Containment)
- **Social Intelligence API**: Emotional literacy levels, empathy development (cognitive, affective, compassionate), communication mastery (NVC, DEAR MAN, GIVE), social dynamics, conflict resolution, boundary setting
- **Peak Performance API**: Flow states (Csikszentmihalyi), mental models (decision-making, systems thinking), goal systems (SMART, OKRs, 12-Week Year), energy management (Schwartz), habit frameworks (Duhigg, Clear, Fogg), productivity systems (GTD, Deep Work)
- **Personal Growth API**: Self-improvement pillars (physical, mental, emotional, spiritual, relational), character development (VIA strengths, virtues), growth mindset (Carol Dweck), self-discipline techniques, life stages (Erikson)
- **Psychological Safety API**: Inner security development, self-compassion (Kristin Neff), safety signals (polyvagal), resilience factors, trauma-informed care principles, grounding techniques, window of tolerance

### Phase 11 APIs
- **Consciousness Expansion API**: Awareness practices, consciousness states (Turiya, Turiyatita), perception exercises, integral developmental stages
- **Human Potential API**: Flow state triggers, peak experiences, self-actualization hierarchy
- **Wisdom Traditions API**: Major traditions (Stoicism, Buddhism, Taoism, Vedanta, Sufism, Kabbalah), perennial truths
- **Life Design API**: Life domains, design frameworks (Ikigai, Odyssey Planning), goal-setting systems
- **Healing Modalities API**: Therapeutic modalities (CBT, DBT, EMDR, IFS, Somatic Experiencing, ACT)

## Recent Visual Enhancements (January 2026)

### Comprehensive Design Token System
- **Single Source of Truth**: `brand-tokens.css` contains all color values
- **Core Palette**: Deep Teal (#2F5D5D), Gold (#EAC33B), Sage (#8FBF9F), Blush (#F4C7C3), Ivory (#FAF9F7), Charcoal (#3A3A3A)
- **Semantic Tokens**: `--glp-bg`, `--glp-surface`, `--glp-text`, `--glp-primary`, `--glp-accent`, `--glp-border`, `--glp-ring`
- **Layout Tokens**: `--glp-radius-1/2`, `--glp-shadow-1/2`, `--glp-motion-fast/med`, `--glp-ease`

### Visual Mode Toggle (Header)
- **Default Mode**: Full visual richness with shadows and gradients
- **Low-Stim Mode**: Removed shadows, quieter gold, minimal decoration
- **Reading Mode**: White surfaces, darker text for maximum legibility
- **Persistence**: Mode saved to localStorage, accessible via header dropdown

### Enhanced Typography Scale (Canva-style)
- `tglp-title`: 56px | `tglp-subtitle`: 36px | `tglp-heading`: 32px
- `tglp-subheading`: 28px | `tglp-section`: 24px | `tglp-body`: 18px
- `tglp-quote`: 20px | `tglp-caption`: 14px
- Display variants: `text-display-xl/lg/md`, Heading variants: `text-heading-xl/lg/md/sm`

### Icon System
- **Containers**: `icon-container-sm/md/lg/xl` with gradient fills
- **Soft Variants**: `icon-soft-sage/teal/gold/blush` for subtle backgrounds
- **Gradients**: `icon-gradient-sage`, `icon-gradient-gold`
- **Circle Styles**: `icon-circle`, `icon-circle-sm/lg`

### Component Utilities
- **Cards**: `card`, `card-sm/lg`, `card-shadow`, `card-border`, `card-hover`
- **Buttons**: `btn-premium`, `btn-secondary-premium`, `btn-ghost`
- **Glass Effects**: `glass`, `glass-premium` with backdrop-blur
- **Hover Effects**: `hover-lift`, `hover-glow-gold`, `hover-glow-sage`

### Navigation Link Audit
- **Script**: `npm run nav:audit` validates all internal links
- **Report**: `docs/NAV_LINK_AUDIT.md` with 0 broken links
- **CI Integration**: GitHub Actions workflow for automated checks

## Previous Visual Enhancements (December 2025)

### Premium Design System
- **Hero Gradient**: Multi-layer radial gradients with subtle paper texture overlay
- **Decorative Orbs**: Ambient sage, blush, and gold spheres with blur effects
- **Glassmorphism**: Premium glass cards with backdrop-blur and subtle borders
- **Animations**: 6 keyframe animations (fade-in-scale, gentle-breathe, subtle-pulse, float, shimmer)
- **Gold Accent System**: Micro-glow hover states, premium buttons, and gold gradient badges

### Enhanced Pages
- **Landing Page**: Immersive hero with decorative orbs, icon-enhanced pills, brand gradient text, premium feature cards with staggered animations, trust metrics section
- **Home Page**: Hero gradient background, premium CTAs, animated feature cards with icon containers
- **Pricing Page**: Glassmorphism pricing cards, "Most Popular" gold badge, tier-specific icons (Star, Zap, Crown)
- **Login Page**: Glass-premium form container, icon-prefixed inputs, loading spinner animation

### Accessibility
- Full `prefers-reduced-motion` support for all animations
- Enhanced focus states with box-shadow for keyboard navigation
- 338+ ARIA attributes across the platform
- Semantic HTML structure throughout

## Deployment Configuration (December 2025)

### Replit Autoscale
- **Target**: Autoscale (scales with traffic, cost-efficient)
- **Build**: `npm run build` (Vite production build ~18s)
- **Run**: `node server/index.mjs`
- **Health Endpoints**: `/healthz`, `/api/health-check`

### Production Security
- **Content Security Policy (CSP)**: Enabled via Helmet with whitelisted directives
- **Allowed Origins**: OpenAI API, Stripe, Google Fonts, WebSocket connections
- **Headers**: Strict security headers, frame protection, upgrade-insecure-requests
- **Rate Limiting**: API rate limiting enabled

### Build Metrics
- **Build Time**: ~18 seconds
- **Tests**: 152/152 passing
- **ESLint**: 0 errors (43 warnings - unused variables)
- **Bundle Size**: ~260KB gzipped total

### PWA Assets
- `apple-touch-icon.png`: 180x180 iOS home screen icon
- `favicon.png`: Browser tab icon
- `og-image.png`: Social media sharing preview (1200x630)
- `manifest.json`: PWA metadata with hex colors (#FDFCF9, #5A8A6E)