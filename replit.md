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
- AI-powered chat therapy integrated with the OpenAI API, providing compassionate, trauma-informed responses and crisis intervention awareness.
- Mood tracking and personal journaling.
- Comprehensive crisis resources and support.
- Account lifecycle management (password reset, account deletion, GDPR data export).
- Robust security features (rate limiting, CSP, input sanitization, CSRF protection).
- Structured logging, health/readiness endpoints, and a comprehensive gamification system (XP, levels, streaks, daily quests).
- A comprehensive wellness toolkit with over 54 tools across 6 categories.
- Premium features including HealingJourneys, ProgressAnalytics, WellnessGoalTracker, AIWellnessConcierge, DailyWellnessPlanner, WellnessTimer, MoodVisualizer, MindfulBreathing, and NotificationCenter, accessible via subscription tiers.

### System Design Choices
The application is designed for optimized production bundles with code splitting and environment variable configuration. It incorporates health checks, rate limiting, and graceful shutdown handlers. A unified `shared/schema.mjs` serves as the single source of truth for Drizzle ORM models, matching the Neon PostgreSQL database structure with UUIDs, TEXT-based IDs, serial integers, and foreign key constraints with performance-enhancing indexes. The system implements a trauma-informed NLP layer for all user-facing text, crisis detection, and gentle reflection prompts.

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