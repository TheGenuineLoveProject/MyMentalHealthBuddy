# MyMentalHealthBuddy

## Overview
MyMentalHealthBuddy is an AI-powered mental health support platform offering therapeutic chat, mood tracking, journaling, crisis resources, and professional content management. It includes an advanced Content Studio with AI editing, a Social Calendar, and a comprehensive Analytics dashboard. The platform supports a tiered subscription model (Free, Premium, Professional) and is designed for production readiness with enterprise-grade optimization, aiming for MIT-PhD level platform excellence and a "888...^ perfection standard" across all components.

## User Preferences
Preferred communication style: Simple, everyday language.
User requirement: "888...^ perfection from A to Z 360 degrees" - Zero error tolerance, MIT-PhD academic level, continuous platform refinement until flawless operation across all components.

## System Architecture

### UI/UX Decisions
The application utilizes `shadcn/ui` (built on `Radix UI`), `Tailwind CSS`, and `Lucide React` for a responsive, accessible, and therapeutic design. Key features include a dashboard with real-time statistics, animated quick action cards, Dark Mode, skeleton loaders, a NotificationCenter, SEO optimization, bulk actions, advanced export, and an advanced DataTable. The platform integrates a therapeutic design system with four distinct modes (Serenity, Empowerment, Focus, Recovery), multi-sensory feedback (haptics, spatial audio), a micro-interaction library, and atmospheric scenes for emotional engagement.

### Technical Implementations
-   **Frontend**: React 18, TypeScript, Vite, `TanStack Query` for server state, `Wouter` for routing, `React Hook Form` with `Zod` for validation.
-   **Backend**: Node.js with Express.js and TypeScript (ESM), featuring a RESTful API, centralized error handling, production-grade logging, and session middleware.
-   **Data Storage**: PostgreSQL (Neon Database) managed by Drizzle ORM, with Drizzle Kit for migrations and Drizzle-Zod for runtime type validation.
-   **Authentication**: Session-based authentication with bcrypt-hashed passwords, RBAC (`isAdmin`), CSRF protection.
-   **Core Features**: AI Chat Therapy (OpenAI), Mood Tracking & Analytics, Journal System, Crisis Resources, Content Studio (rich text editor with AI suggestions), Social Calendar, Analytics Dashboard, Performance Dashboard, and Productivity Hub.
-   **Advanced Search System**: Full-text search with relevance, fuzzy matching, autocomplete, and trending topics.
-   **Safe Patcher System**: Non-destructive diagnostic tools (`diagnose.mjs`, `heal.mjs`, `verify.mjs`).
-   **Caching Strategy**: Centralized cache key factory, `useOptimizedQuery`/`useOptimizedMutation` hooks, and intelligent API response caching with ETags.
-   **Error Handling**: HttpError class with status/body properties, advanced ErrorBoundary (page and section level), global retry logic, and `useErrorHandler` hook.
-   **Form Validation**: `useFormValidation` hook with real-time validation, auto-save, and Zod schema support.
-   **Offline Support**: `offlineManager` with queuing, auto-sync, retry logic, and an enhanced service worker.
-   **Performance Optimization**: Enterprise-grade optimizations include font-display swap, preload hints, DNS prefetch, preconnect for external services, inline critical CSS, layout containment, GPU-accelerated transforms, content-visibility auto, CLS prevention, code splitting, tree shaking, and gzip compression. Build issues were resolved with `splitVendorChunkPlugin`, achieving significant TTFB and LCP improvements.
-   **Deployment**: Optimized for Replit Autoscale with warm instances, dual-algorithm compression, pre-compressed assets, HTTP caching, code splitting, production-grade health checks.
-   **Backend Security & Resilience**: Session-based authentication, CSRF, XSS, input sanitization, admin-only performance endpoints, backup ownership validation, path traversal prevention, rate limiting, and error recovery.
-   **Database Optimization**: Comprehensive index strategy, query optimization with caching, pagination helpers, connection pooling, and slow query logging.
-   **AI Content Generator**: Production-ready component with multi-format support, tone/length control, real-time generation, and OpenAI integration.
-   **Advanced Data Visualization**: Comprehensive chart library with trend calculation, customization, and responsiveness.
-   **Enterprise Backend Services**: Includes a BackupService, PerformanceMonitor, QueryOptimizer, Enhanced Rate Limiting, and an Error Recovery System.

### System Design Choices
The architecture emphasizes type safety, developer experience, and modern web practices within a monorepo. It ensures enterprise-grade security (XSS, CSRF, rate limiting, input sanitization, backup ownership enforcement, path traversal prevention). Robust error handling includes retry logic, circuit breaker patterns, timeout handling, and comprehensive observability. Runtime environment variable validation (Zod), React Context for global state, and optimized database connection pooling are implemented. Security headers and CORS hardening are also key design decisions. The system has achieved critical breakthroughs in performance, eliminating WebSocket errors, restoring performance to excellent levels (TTFB 44ms, FCP 516ms, LCP 516ms), and enhancing CSP security with zero console errors.

### Recent Changes (November 2025)

#### Build Optimization & Vendor Chunking
-   **Critical Fix**: Resolved ES6 module compliance issue where static imports were placed after executable code, causing SyntaxError and preventing app initialization
-   **Routing Bug Fixed**: Removed 20+ compiled .js/.jsx artifacts from src/ directories that shadowed TypeScript sources; updated all `/social` references to `/social-calendar`
-   **Gitignore Protection**: Added rules to prevent future compilation artifacts from being committed (`apps/**/src/**/*.js`, `apps/**/src/**/*.jsx`)
-   **Dynamic Import Warnings Eliminated**: Converted `webVitals.ts`, `performance.ts`, `performance-optimizer.ts` to static imports while maintaining post-render idle-callback initialization for non-blocking startup
-   **Vendor Bundle Optimization**: Reduced from 712kB monolithic chunk (warning!) to 4 optimized chunks under 600kB:
    -   `ui-icons`: 36kB (Lucide React)
    -   `data-query`: 40kB (TanStack Query)
    -   `monitoring`: 252kB (Sentry)
    -   `vendor`: 459kB (React + core libraries preserved together to avoid breaking internal dependencies)
-   **Vite Config Cleanup**: Removed invalid `https: false` option; clarified that `vite.config.js` takes precedence over `.ts`/`.mjs` variants
-   **Zero Build Warnings**: All build warnings eliminated through safe chunking strategy that preserves React's AsyncMode references

#### Advanced Code Splitting (Component-Level)
-   **Massive Bundle Reduction**: Implemented React.lazy() + Suspense boundaries for 3 heavy page bundles, achieving **68% reduction** (164kB → 52kB):
    -   **ProductivityPage**: 66kB → 11.14kB (83% reduction) - split into AdvancedSearch (10kB), AIContentGenerator (13kB), AutomationRules (14kB), BulkOperations (8kB), AdvancedExport (13kB)
    -   **StudioPage**: 51kB → 17.70kB (65% reduction) - split into ContentEditor (10kB), ContentTemplates (6kB), SearchFilter (8kB), SEOOptimizer (13kB)
    -   **AnalyticsPage**: 47kB → 23.29kB (50% reduction) - split into AnalyticsDashboard (8kB), Charts (10.5kB), DataStorytelling (19kB), NarrativeChart (2.8kB)
-   **On-Demand Loading**: Components lazy-load only when user interacts with features (tab switches, modal opens, scroll triggers)
-   **Smooth UX**: Skeleton loaders provide seamless loading experience with no visual disruption
-   **Zero Performance Regression**: TTFB/FCP/LCP metrics maintained at optimal levels after code splitting implementation

#### Performance Metrics (Current)
-   **TTFB**: 51-149ms (GOOD) - stable baseline
-   **FCP**: 421-652ms (GOOD) - maintained after code splitting
-   **LCP**: 652-1160ms (GOOD) - optimized with lazy loading
-   **CLS**: 0.286 (POOR) - user-accepted trade-off for atmospheric gradients/animations that enhance therapeutic design experience

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
-   **Sentry**: Error tracking and performance monitoring.