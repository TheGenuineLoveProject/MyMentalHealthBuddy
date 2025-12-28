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

### Reflection Tools (A→Z Enhancement)
The `/tools` route provides access to 6 privacy-focused reflection tools:
- **Belief Mapping**: Track patterns in personal beliefs across 4 categories (self, world, others, future)
- **Timed Writing**: Flow state writing sessions with configurable duration (5-30 minutes)
- **Silence Mode**: Private writing space with no AI output or analysis
- **Question Reflection**: Socratic self-inquiry with 20+ questions across 4 categories
- **Growth Timeline**: Personal evolution visualization without comparison metrics
- **Export Data**: Markdown/JSON export for full data sovereignty

All reflection data stored in browser localStorage (`glp_*` keys) for maximum privacy.

### Wisdom Tools (A→Z Intellectual Enhancement)
The `/wisdom` route provides advanced intellectual tools for deep thinkers:
- **Cognitive Frameworks Library**: 12 mental models across 6 categories (philosophy, psychology, systems, decision, creativity, metacognition) including First Principles, Inversion, Steel-Manning, Pre-Mortem, and Paradox Integration
- **Dialectical Inquiry**: Thesis→Antithesis→Synthesis→Integration flow for exploring truth through opposing perspectives across 6 domains (self, relationships, purpose, growth, fear, truth)
- **Temporal Reflection**: Past/Present/Future integration with The Witness, The Observer, and The Visionary lenses
- **Daily Wisdom**: Cross-tradition insights from philosophy, psychology, spirituality, and science

All wisdom data stored in browser localStorage (`glp_dialectical_sessions`, `glp_temporal_integrations`) for maximum privacy.

### Advanced Intellectual Tools (A→Z MIT-Level Enhancement)
The `/advanced` route provides 13 rigorous intellectual instruments organized into 4 categories:

**Reasoning & Logic**
- **Logic Lattice Lab**: Map arguments with claims, premises, evidence, counters, and inferences; includes 8 fallacy references
- **Decision Architecture**: Structure complex choices with options, pros/cons, reversibility assessment, and pre-mortem analysis
- **Thought Experiments Lab**: 8 classic philosophical puzzles (Trolley, Experience Machine, Ship of Theseus, etc.) with guided reflection

**Systems & Patterns**
- **Systems Resonance Simulator**: Model feedback loops with stocks, flows, variables, delays; detects reinforcing vs. balancing loops
- **Paradox Cartographer**: Navigate tensions on dual-axis maps without forcing resolution; includes 6 paradox templates
- **Synthesis Collider**: Combine artifacts through 10 creative lenses to generate novel insights

**Knowledge & Learning**
- **Knowledge Weave Map**: Connect concepts across 8 categories with 5 relationship types; includes cluster detection
- **Autodidact Forge**: Self-directed learning with 4 time horizons, experiment templates, momentum tracking
- **Semantic Mapping**: Explore personal word meanings, emotional valence, and semantic relationships

**Self-Awareness**
- **Metacognition Dashboard**: Track thinking patterns, mental states, cognitive areas, optimal conditions
- **Bias Blind Spots**: 12 cognitive biases with incident tracking and debiasing strategies
- **Epistemic Calibration**: Prediction tracking, belief auditing, Brier score calculation
- **Philosophical Stance Mapper**: 12 fundamental questions across 7 philosophical domains

All advanced tools data stored in browser localStorage (`glp_decision_frames`, `glp_epistemic_profile`, `glp_thought_sessions`, `glp_metacognitive_profile`, `glp_bias_profile`, `glp_semantic_maps`, `glp_philosophical_profile`) for maximum privacy.

### Content Files
- `server/insights/daily.mjs` - 14 daily insights
- `server/routes/prompts.mjs` - 24 journal prompts API
- `shared/stateTracker.mjs` - State dimension definitions
- `docs/content/features-content.md` - Full content reference
- `server/utils/aiGuardrails.mjs` - AI response safety enforcement

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

### AI Guardrails (MANDATORY)
The AI must:
- **Never instruct** — No directives, only observations and questions
- **Never diagnose** — No labeling or pathologizing experiences
- **Never promise healing** — We offer reflection space, not cures
- **Never imply deficiency** — Every state is observed neutrally
- **Always allow disagreement** — Users can reject any content

Reframed language:
- "Today's Insight" → "A thought you may want to sit with today"
- "Track your mood" → "Notice your state"
- Footer: "You know yourself best." / "Take what serves you."

See `docs/AI_GUARDRAILS.md` for complete guidelines.

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