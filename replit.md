# MyMentalHealthBuddy

## Overview
MyMentalHealthBuddy is a mental health support platform offering AI-powered chat therapy, mood tracking, personal journaling, mental health resources, and crisis support. It provides 24/7 mental health assistance in a compassionate and non-judgmental environment, combining therapeutic AI conversations with self-care tools. The platform aims for scalability, robust performance, and a comprehensive self-improvement toolkit, empowering users with diverse tools for emotional well-being and personal growth.

## User Preferences
- Preferred communication style: Simple, everyday language
- Engineering standards: A→Z 360° complete solutions
- Mental health approach: Trauma-informed, supportive, non-clinical language
- UX philosophy: Gentle, compassionate, accessible

## Development Standards (ROGER v5.1)

### Replit Autoscale Compliance
- Single server entry point: `server/index.mjs`
- Port binding: `0.0.0.0` with `process.env.PORT || 5000`
- No multiple dev servers or rogue processes
- All automation scripts use `.mjs` extension
- Environment variables stored in Replit Secrets

### Code Quality Standards
- ESM modules throughout (`.mjs` files)
- Full-stack consistency (client + server + DB + AI)
- Safe, ethical, trauma-informed design
- Performance-optimized with lazy loading
- Code splitting for large component bundles

### Mental Health NLP Layer
- All user-facing text uses supportive, non-clinical language
- Crisis detection and appropriate resource routing
- Gentle reflection prompts (What/When/Where/Who/Why/How)
- Trauma-informed microcopy throughout UI
- Compassionate error messages and feedback

## System Architecture

### UI/UX Decisions
The frontend features a premium, Canva-inspired visual design with HSL color formatting, custom typography, enhanced gradients, and refined shadows. It includes full light/dark theme support, micro-interactions, and accessibility features like ARIA attributes, semantic HTML, keyboard navigation, visible focus rings, and proper touch targets. Responsive typography and safe area insets ensure mobile responsiveness, while prefers-reduced-motion and high contrast mode support cater to diverse user needs.

### Technical Implementations
The frontend is a React 18 SPA with TypeScript, built using Vite, Wouter for routing, React Hook Form with Zod for validation, and Tailwind CSS with Lucide React for styling. The backend is a Node.js and Express application with TypeScript, providing a RESTful API. It utilizes middleware for CORS, security headers (Helmet), compression, logging (Morgan), and session management (Express Session). The project maintains a monorepo structure with separate client and server applications and uses shared types for consistency.

### Feature Specifications
The platform offers:
- AI-powered chat therapy integrated with the OpenAI API, providing compassionate, trauma-informed responses and crisis intervention awareness.
- Mood tracking and personal journaling.
- Comprehensive crisis resources and support.
- Account lifecycle management (password reset, account deletion, GDPR data export).
- Robust security features (rate limiting, CSP, input sanitization, CSRF protection).
- Structured logging, health/readiness endpoints, and a comprehensive gamification system with XP, levels, streaks, and daily quests.
- A comprehensive wellness toolkit with over 54 tools across 6 categories (Mindfulness & Relaxation, Emotional Wellness, Tracking & Progress, Self-Care & Lifestyle, Personal Growth, Healing & Recovery).
- Premium features including HealingJourneys, ProgressAnalytics, WellnessGoalTracker, AIWellnessConcierge, DailyWellnessPlanner, WellnessTimer, MoodVisualizer, MindfulBreathing, and NotificationCenter, accessible via subscription tiers.

### System Design Choices
The application is designed for optimized production bundles with code splitting and environment variable configuration. It incorporates health checks, rate limiting, and graceful shutdown handlers for deployment. A unified `shared/schema.mjs` serves as the single source of truth for Drizzle ORM models, matching the Neon PostgreSQL database structure with UUIDs, TEXT-based IDs, serial integers, and foreign key constraints with performance-enhancing indexes.

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

## Recent Changes (December 4, 2025)

### AI Chat Integration Complete
- Full OpenAI integration with gpt-4o-mini model
- Trauma-informed system prompt with therapeutic principles
- Crisis keyword detection (14 keywords) with immediate resource response
- Circuit breaker pattern for resilience (5 failure threshold)
- Exponential backoff retry logic (3 retries, 1-10s delay)
- 15-second request timeout
- New `/api/ai/status` endpoint for health monitoring

### AI Dashboard with Real Analytics
- Real database analytics: mood scores, journal counts, tool usage stats
- Mood trend calculation (improving/stable/declining) based on 30-day data
- Wellness score breakdown: mood, engagement, and self-care metrics
- XP/level progress tracking with next-level calculation
- Active quests and top wellness tools display
- Personalized insights based on user activity patterns

### Stripe Subscription Persistence
- Stripe webhooks now persist data to `subscriptions` table
- Handles checkout.session.completed, subscription.created/updated/deleted
- User lookup by Stripe customerId or email fallback
- Stores tier, status, period dates, cancelAtPeriodEnd flags
- Idempotent event processing with webhookEvents table

### Canva OAuth Integration
- Full OAuth 2.0 flow with PKCE (S256 code challenge)
- Authorize, callback, refresh, and revoke endpoints
- State validation with 10-minute expiry
- Secure token exchange with code verifier
- Requires CANVA_CLIENT_SECRET to activate

### Bundle Optimization
- Code splitting via Vite manualChunks function
- Vendor chunks: react (420KB), sentry (259KB), validation (52KB), query (39KB)
- Main bundle reduced from 833KB to 106KB
- Build completes without size warnings

### Billing Integration
- Completed Stripe billing portal endpoint
- Added subscription-status endpoint
- Customer lookup by email for portal sessions
- Plan mapping: STRIPE_PRICE_BASIC/PREMIUM/PRO

## Deployment Checklist

### Required Environment Variables
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - JWT signing key
- `OPENAI_API_KEY` - OpenAI API access
- `STRIPE_SECRET_KEY` - Stripe API key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook verification
- `STRIPE_PRICE_BASIC` - Price ID for basic plan
- `STRIPE_PRICE_PREMIUM` - Price ID for premium plan  
- `STRIPE_PRICE_PRO` - Price ID for pro plan
- `RESEND_API_KEY` - Email service (optional)

### Pre-Deployment Actions
1. **CRITICAL**: Remove extra port mapping in `.replit` (lines 15-17 - 44715→3000)
2. Configure all Stripe price environment variables
3. Set up Stripe webhook endpoint for subscription events
4. Test AI chat integration in production mode