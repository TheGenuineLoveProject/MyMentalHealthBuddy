# MyMentalHealthBuddy

## Overview
MyMentalHealthBuddy is an AI-powered mental health support platform designed to provide therapeutic chat, mood tracking, journaling, crisis resources, and professional content management. It features an advanced Content Studio with AI editing, a Social Calendar for scheduling, and a comprehensive Analytics dashboard. The platform supports a tiered subscription model (Free, Premium, Professional) and is built for production readiness with enterprise-grade optimization. The project aims for "360 degrees to 10000000000% perfection" and MIT-PhD level platform excellence.

## User Preferences
Preferred communication style: Simple, everyday language.
User requirement: "360 degrees to 10000000000% perfection" implementation.

## System Architecture

### UI/UX Decisions
The application uses `shadcn/ui` (built on `Radix UI`), `Tailwind CSS`, and `Lucide React` for a responsive and accessible design. Key features include a dashboard with real-time statistics, animated quick action cards, Dark Mode, skeleton loaders, a NotificationCenter, SEO optimization, bulk actions, advanced export options, a comprehensive animation system, accessible form elements, keyboard shortcuts, enhanced form validation, image optimization, progress trackers, activity feed, and an advanced DataTable. The platform also integrates a therapeutic design system with four distinct modes (Serenity, Empowerment, Focus, Recovery), a multi-sensory feedback controller with haptics and spatial audio, a micro-interaction library, and an atmospheric scenes system for emotional engagement. Standardized loading states are implemented across the application.

### Technical Implementations
-   **Frontend**: React 18, TypeScript, Vite, `TanStack Query` for server state management, `Wouter` for routing, `React Hook Form` with `Zod` for form validation.
-   **Backend**: Node.js with Express.js and TypeScript (ESM modules), featuring a RESTful API, centralized error handling, production-grade logging, and session middleware.
-   **Data Storage**: PostgreSQL database managed by Drizzle ORM (Neon Database), with Drizzle Kit for migrations and Drizzle-Zod for runtime type validation.
-   **Authentication**: Session-based authentication with hashed passwords, RBAC (`isAdmin` field, `requireAdmin` middleware), and CSRF protection.
-   **Core Features**: AI Chat Therapy (OpenAI), Mood Tracking & Analytics, Journal System, Crisis Resources, Content Studio (rich text editor with AI suggestions), Social Calendar, Analytics Dashboard, Performance Dashboard, and Productivity Hub.
-   **Advanced Search System**: Full-text search with TF-IDF-like relevance, fuzzy matching, autocomplete, and trending topics.
-   **Safe Patcher System**: Non-destructive diagnostic tools (`diagnose.mjs`, `heal.mjs`, `verify.mjs`) for health monitoring and issue resolution.
-   **Caching Strategy**: Centralized cache key factory, `useOptimizedQuery`/`useOptimizedMutation` hooks, and intelligent API response caching with ETags.
-   **Error Handling**: Advanced ErrorBoundary (page and section level), global tracking, and `useErrorHandler` hook.
-   **Form Validation**: `useFormValidation` hook with real-time validation, auto-save, and Zod schema support.
-   **Offline Support**: `offlineManager` with queuing, auto-sync, retry logic, and an enhanced service worker.
-   **Performance Optimization**: Enterprise-grade optimizations including font-display swap, layout containment, GPU-accelerated transforms, content-visibility auto, CLS prevention, code splitting, tree shaking, and gzip compression.
-   **Deployment**: Optimized for Replit Autoscale with dual-algorithm compression, pre-compressed assets, HTTP caching, code splitting, and production-grade health checks.
-   **Backend Security & Resilience**: Session-based authentication, CSRF, XSS, input sanitization, admin-only performance endpoints, backup ownership validation, path traversal prevention, rate limiting, and error recovery.
-   **Database Optimization**: Comprehensive index strategy, query optimization with caching, pagination helpers, connection pooling, and slow query logging.
-   **AI Content Generator**: Production-ready component with multi-format support, tone/length control, real-time generation, and OpenAI integration.
-   **Advanced Data Visualization**: Comprehensive chart library with trend calculation, customization, and responsiveness.
-   **Enterprise Backend Services**: Includes a BackupService, PerformanceMonitor, QueryOptimizer, Enhanced Rate Limiting, and an Error Recovery System.

### System Design Choices
The architecture emphasizes type safety, developer experience, and modern web practices within a monorepo. It ensures enterprise-grade security (XSS, CSRF, rate limiting, input sanitization, backup ownership enforcement, path traversal prevention). Robust error handling includes retry logic, circuit breaker patterns, timeout handling, and comprehensive observability. Runtime environment variable validation (Zod), React Context for global state, and optimized database connection pooling are implemented. Security headers and CORS hardening are also key design decisions.

## External Dependencies

### Database & Storage
-   **Neon Database**: Serverless PostgreSQL hosting.
-   **Drizzle ORM**: Type-safe ORM for PostgreSQL.
-   **connect-pg-simple**: PostgreSQL session store.

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
-   **Vite**: Build tool and development server.
-   **TypeScript**: Static type checking.

### Third-Party Services
-   **OpenAI**: AI-powered conversational therapy.
-   **Stripe**: Payment processing and subscription management.
-   **Canva Connect API**: Professional design tool integration.