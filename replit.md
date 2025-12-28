# The Genuine Love Project

**Tagline:** Live in Genuine Love

**Short Name:** Genuine Love

## Overview
An AI-powered mental wellness platform for self-love, healing, and emotional growth — private, compassionate, and available 24/7. The platform combines AI-assisted emotional guidance, mood tracking, journaling, crisis support, and evidence-based healing tools. It offers a comprehensive wellness toolkit and premium features through subscription tiers.

## Brand Guidelines
- **Full Brand Name:** The Genuine Love Project
- **Short Name/App Name:** Genuine Love  
- **Tagline:** Live in Genuine Love
- **Legacy Name (deprecated):** MyMentalHealthBuddy — DO NOT USE

## User Preferences
- Preferred communication style: Simple, everyday language
- Engineering standards: A→Z 360° complete solutions
- Mental health approach: Trauma-informed, supportive, non-clinical language
- UX philosophy: Gentle, compassionate, accessible

## System Architecture

### UI/UX Decisions
The frontend features a premium, Canva-inspired visual design with HSL color formatting, custom typography, enhanced gradients, and refined shadows. It includes full light/dark theme support, micro-interactions, and comprehensive accessibility features (ARIA, semantic HTML, keyboard navigation, visible focus rings, proper touch targets). Responsive typography and safe area insets ensure mobile responsiveness, while `prefers-reduced-motion` and high contrast mode support cater to diverse user needs.

### Technical Implementations
The frontend is a React 18 SPA with TypeScript, built using Vite, Wouter for routing, React Hook Form with Zod for validation, and Tailwind CSS with Lucide React for styling. The backend is a Node.js and Express application with TypeScript, providing a RESTful API. It utilizes middleware for CORS, security headers (Helmet), compression, logging (Morgan), and session management (Express Session). The project maintains a monorepo structure with separate client and server applications and uses shared types for consistency. All modules are ESM (`.mjs` files).

### Feature Specifications
The platform offers:
- **State Tracker**: 6-dimension neutral observation system (energy, clarity, openness, regulation, presence, pace) using non-judgmental language
- **Today's Insight**: 14 rotating philosophical insights grounded in psychology/systems thinking
- **Journal Prompts**: 24 intelligent prompts across 4 categories (Awareness, Agency, Relationships, Meaning)
- AI-powered chat therapy integrated with the OpenAI API, providing compassionate, trauma-informed responses and crisis intervention awareness
- Personal journaling with intelligent prompts
- Comprehensive crisis resources and support
- Account lifecycle management (password reset, account deletion, GDPR data export)
- Robust security features (rate limiting, CSP, input sanitization, CSRF protection)
- Structured logging, health/readiness endpoints, and gamification system (XP, levels, streaks, daily quests)
- Comprehensive wellness toolkit with over 54 tools across 6 categories
- Premium features accessible via subscription tiers

### State Tracker Dimensions
| Dimension | Options | Description |
|-----------|---------|-------------|
| Energy | Depleted → Low → Neutral → Steady → Wired | Physical and mental fuel available |
| Clarity | Foggy → Scattered → Mixed → Clear → Sharp | How thoughts are forming and connecting |
| Openness | Closed → Guarded → Selective → Receptive → Expansive | Willingness to take in new information |
| Regulation | Reactive → Unstable → Variable → Stable → Grounded | Nervous system management of stimuli |
| Presence | Distant → Distracted → Partial → Engaged → Absorbed | Connection to the current moment |
| Pace | Rushed → Hurried → Moderate → Unhurried → Still | Internal tempo experienced |

### Content Files
- `server/insights/daily.mjs` - 14 daily insights
- `server/routes/prompts.mjs` - 24 journal prompts API
- `shared/stateTracker.mjs` - State dimension definitions
- `docs/content/features-content.md` - Full content reference

### System Design Choices
The application is designed for optimized production bundles with code splitting and environment variable configuration. It incorporates health checks, rate limiting, and graceful shutdown handlers. A unified `shared/schema.mjs` serves as the single source of truth for Drizzle ORM models, matching the Neon PostgreSQL database structure with UUIDs, TEXT-based IDs, serial integers, and foreign key constraints with performance-enhancing indexes. The system implements a trauma-informed NLP layer for all user-facing text, crisis detection, and gentle reflection prompts.

## Scripts & Utilities

- **npm run dev**: Start development server
- **npm run start**: Start production server
- **npm run build**: Build client application
- **npm run bundle:gpt**: Create a safe bundle for ChatGPT debugging (excludes .env and node_modules)
- **npm run db:push**: Push schema changes to database

### Brand Assets Location
- `/public/brand/` - Logo, favicon, and OG images
- `/shared/brand.mjs` - Brand constants (colors, tagline)
- `/client/src/styles/brand.css` - CSS design tokens

### Brand Colors
| Token | Hex | Usage |
|-------|-----|-------|
| sage | var(--glp-sage) | Primary |
| clay | #C89A82 | Warm accent |
| gold | #D4B768 | Golden accent |
| forest | var(--glp-sage-deep) | Deep teal |
| heart | #B45B5B | Compassion |
| ink | var(--glp-ink) | Text |
| ivory | var(--glp-paper) | Background |
| sun | #EAC33B | Highlight |

### Crisis Detection
The AI routes include crisis detection that scans for 14 keywords indicating self-harm intent. When detected, the system returns a safe, compassionate response with crisis resources (988 Suicide Prevention Lifeline, Crisis Text Line) instead of continuing the conversation.

## External Dependencies

- **OpenAI API**: AI chat therapy.
- **Vite**: Frontend build tool.
- **TypeScript**: Static typing.
- **React**: Frontend UI.
- **Wouter**: Client-side routing.
- **React Hook Form**: Form management.
- **Zod**: Runtime type validation.
- **Tailwind CSS**: Styling.
- **Lucide React**: Icons.
- **Node.js**: Backend runtime.
- **Express**: Backend framework.
- **Express Session**: Session management.
- **CORS**: Cross-Origin Resource Sharing.
- **Helmet**: Security headers.
- **Compression**: Response compression.
- **Morgan**: HTTP request logging.
- **Sentry**: Error tracking and performance monitoring.
- **Drizzle ORM**: Database interactions.
- **Neon PostgreSQL**: Primary database.
- **Stripe**: Billing and payment processing.
- **Canva Apps SDK**: Integration for Canva apps.