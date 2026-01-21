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

### Visual Modes (3 Modes)
Toggle modes by setting `document.documentElement.dataset.mode`:
- **Default**: Standard brand palette with Deep Teal primary + Gold accent
- **Low-Stim**: `data-mode="low-stim"` - Reduced shadows, softer gold, minimal decoration
- **Reading**: `data-mode="reading"` - Maximum legibility, white surfaces, darker text

Example: `document.documentElement.dataset.mode = "low-stim"`

### Design Token System
- **Source of Truth**: `client/src/styles/brand-tokens.css`
- **Core Palette**: `--glp-sage`, `--glp-blush`, `--glp-sage-deep` (Deep Teal), `--glp-paper` (Ivory), `--glp-ink` (Charcoal), `--glp-gold`
- **Semantic Tokens**: `--bg`, `--text-1`, `--text-2`, `--surface-1`, `--surface-2`, `--primary`, `--primary-contrast`, `--accent`, `--ring`, `--border`
- **RGB Helpers**: `--glp-ink-rgb`, `--glp-paper-rgb`, `--glp-sage-deep-rgb`, `--glp-gold-rgb`

### Visual Doctor Tool
- **Script**: `npm run visual:doctor` - scans all components for raw hex colors, font violations, and inline style issues
- **Report**: `docs/VISUAL_DOCTOR_REPORT.md` - auto-generated audit report
- **Enforcement**: Fails CI if violations found outside allowed token files

### Navigation Link Audit
- **Script**: `npm run nav:audit` - extracts routes from App.jsx and scans for broken links
- **Report**: `docs/NAV_LINK_AUDIT.md` - auto-generated audit report
- **Routes Doc**: `docs/ROUTES.md` - authoritative route list (57 routes)
- **Enforcement**: Fails CI if broken internal links found

### Combined Audit
- **Script**: `npm run audit` - runs both nav:audit and visual:doctor

### Premium Visual System (January 2026)
- **Typography Tokens**: Playfair Display for display, Inter for headings/body, fluid type scale (xs-6xl)
- **Type Classes**: `.text-display-xl/lg/md/sm`, `.text-heading-xl/lg/md/sm`, `.text-body-lg/base/sm`, `.text-caption`, `.text-label`
- **Shadow System**: xs through 2xl, inner shadows, glow variants (sage, gold, teal)
- **Gradient Presets**: hero, card, glass, shimmer, sage, gold, premium, teal
- **Animation Timing**: ease-in, ease-out, ease-in-out, bounce, elastic
- **Z-Index Scale**: base, dropdown, sticky, modal, popover, tooltip, toast
- **Safe Area Support**: `--glp-safe-top/bottom/left/right` for mobile notch support

### Premium Typography Classes
- **Display**: `.text-display-xl/lg/md/sm` (Playfair Display, large headlines)
- **Headings**: `.text-heading-xl/lg/md/sm` (Inter, section headers)
- **Body**: `.text-body-lg/base/sm` (Inter, paragraph text)
- **Semantic Colors**: `.text-primary/secondary/tertiary/disabled/inverse/brand/accent`
- **Gradients**: `.text-gradient-premium`, `.text-gradient-gold`, `.text-gradient-teal`
- **Effects**: `.text-glow`, `.text-glow-gold`

### Premium Icon System
- **Sizes**: `.icon-xs` (14px), `.icon-sm` (20px), `.icon-md` (24px), `.icon-lg` (28px), `.icon-xl` (40px), `.icon-2xl` (48px)
- **Colors**: `.icon-primary/secondary/accent/muted/success/warning/danger/info/inherit`
- **Glow Effects**: `.icon-glow-sage/gold/teal`
- **Containers**: `.icon-circle-sm/md/lg/xl`, `.icon-badge`, `.icon-badge-sage/teal/gold/soft`

### Layout & Alignment Utilities
- **Flex**: `.flex-center`, `.flex-between`, `.flex-start`, `.flex-end`, `.flex-col-center`
- **Stack**: `.stack-xs/sm/md/lg/xl` (vertical spacing)
- **Cluster**: `.cluster-xs/sm/md/lg` (horizontal gap)
- **Containers**: `.container-xs/sm/md/lg/xl`, `.px-responsive`
- **Safe Areas**: `.safe-padding`

### Premium Component Classes
- **Cards**: `.card-premium`, `.card-premium-gold`, `.card-premium-teal`, `.card-shimmer`, `.surface-card`, `.surface-card-elevated`, `.glass-premium`
- **Buttons**: `.btn-premium-teal`, `.btn-premium-gold`, `.btn-glass`, `.btn-ghost`
- **Inputs**: `.input-premium`
- **Skeletons**: `.skeleton-premium`, `.skeleton-premium-card`
- **Icons**: `.icon-premium-*` (xs through 2xl), `.icon-teal-gradient`, `.icon-gold-gradient`, `.icon-sage-gradient`, `.icon-teal-soft`, `.icon-gold-soft`, `.icon-sage-soft`
- **Badges**: `.badge-premium-teal`, `.badge-premium-gold`, `.badge-premium-sage`
- **Text**: `.text-hero`, `.text-section-title`, `.text-card-title`, `.text-card-body`, `.text-meta`, `.text-overline`, `.text-gradient-premium`, `.text-gradient-gold`
- **Shadows**: `.shadow-premium-sm/md/lg`, `.shadow-glow-teal/gold/sage`
- **Interactions**: `.hover-lift`, `.hover-scale`, `.hover-glow-sage/gold/teal`
- **Animations**: `animate-pulse-ring`, `animate-float`, `animate-fade-in-up-delayed`, `animate-fade-in-stagger`
- **Focus**: `.focus-ring`

### Dark Mode Support
All premium visual classes have comprehensive `.dark` variant overrides for backgrounds, borders, text colors, shadows, and glow effects. Dark mode automatically adjusts color variables for proper contrast.

### QA Mode (Development Only)
- **LocalStorage Key**: `glp-qa` - set to "1" to bypass authentication
- **Env Var**: `VITE_QA_BYPASS_AUTH=true` for automatic bypass
- **Login Button**: "Enable QA Mode (DEV)" visible only in development

### Build Metrics
- **Build Time**: ~15.6 seconds
- **Visual Doctor**: 282 files clean, 0 violations
- **Navigation Audit**: 57 routes, 0 broken links