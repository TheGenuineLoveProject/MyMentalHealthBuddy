# MyMentalHealthBuddy

## Overview
MyMentalHealthBuddy is an AI-powered mental health support application offering therapeutic chat, mood tracking, journaling, and a resource library. It aims to provide accessible, comprehensive mental health tools through a tiered subscription model (Free, Premium, Professional) with varying access to AI sessions, analytics, and professional support, targeting a broad market seeking digital mental wellness solutions.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### UI/UX Decisions
The application utilizes `shadcn/ui` built on `Radix UI` primitives, styled with `Tailwind CSS` and `Lucide React` for iconography. The design is responsive, supporting both mobile and desktop, and features a dashboard with real-time stats, animated quick action cards, and a recent activity feed.

### Technical Implementations
-   **Frontend**: React 18, TypeScript, Vite, `TanStack Query` for server state, `Wouter` for routing, and `React Hook Form` with `Zod` for forms.
-   **Backend**: Node.js with Express.js and TypeScript (ESM modules), featuring a RESTful API, centralized error handling, and custom logging.
-   **Data Storage**: PostgreSQL database managed by Drizzle ORM (Neon Database hosting), with Drizzle Kit for migrations and Drizzle-Zod for runtime type validation.
-   **Authentication**: Session-based authentication with hashed passwords, using `connect-pg-simple` for PostgreSQL session storage.
-   **Core Features**:
    -   **AI Chat Therapy**: OpenAI-powered conversational AI with retry logic.
    -   **Mood Tracking**: Records mood, intensity, activities, and triggers with analytics.
    -   **Mood Analytics**: Advanced dashboard with personalized insights and trend analysis.
    -   **Data Export**: CSV and JSON export for journals and moods.
    -   **Journal System**: Private journaling with optional titles, moods, and tags.
    -   **Crisis Resources**: Access to emergency helplines.
    -   **Stripe Billing System**: Subscription management and payment processing.
    -   **Canva Integration**: Design creation for social media, quotes, and mood visualizations.
-   **Deployment**: Optimized for Replit Autoscale with dual-algorithm compression, pre-compressed asset serving, intelligent HTTP caching, and code splitting.

### System Design Choices
The architecture emphasizes type safety, developer experience, and modern web practices within a monorepo structure. It maintains clear separation of concerns and incorporates security features like XSS protection, rate limiting, and input sanitization. Robust error handling includes specific error classes, retry logic, and global handlers. Observability is ensured through request logging, health monitoring, and structured error tracking. Environment variables are validated at runtime using Zod.

## External Dependencies

### Database & Storage
-   **Neon Database**: Serverless PostgreSQL hosting.
-   **Drizzle ORM**: Type-safe ORM for PostgreSQL.
-   **connect-pg-simple**: PostgreSQL session store for Express.

### UI & Styling
-   **shadcn/ui**: Component library.
-   **Radix UI**: Headless UI primitives.
-   **Tailwind CSS**: Utility-first CSS framework.
-   **Lucide React**: Icon library.

### State Management & Data Fetching
-   **TanStack Query**: Server state management.
-   **React Hook Form**: Form handling.
-   **Zod**: Runtime type validation and schema definition.

### Development & Build Tools
-   **Vite**: Fast build tool and development server.
-   **TypeScript**: Static type checking.
-   **ESBuild**: JavaScript bundler.
-   **PostCSS**: CSS processing.

### Replit Integration
-   **@replit/vite-plugin-cartographer**: Development environment integration.
-   **@replit/vite-plugin-dev-banner**: Development UI enhancements.
-   **@replit/vite-plugin-runtime-error-modal**: Enhanced error reporting.

### Third-Party Services
-   **OpenAI**: AI-powered conversational therapy.
-   **Stripe**: Payment processing and subscription management.
-   **Canva Connect API**: Professional design tool integration for visual content creation.