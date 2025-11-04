# MyMentalHealthBuddy

## Overview
MyMentalHealthBuddy is an AI-powered mental health support platform offering therapeutic chat, mood tracking, journaling, crisis resources, and professional content management. It features an advanced Content Studio with AI-powered editing, a Social Calendar with visual scheduling, and a comprehensive Analytics dashboard. The platform supports a tiered subscription model (Free, Premium, Professional). The project aims for a production-grade, enterprise-ready solution with "360 degrees to 10000000000% perfection" in its implementation, focusing on modern Web Vitals, comprehensive SEO, offline support, enterprise-grade error handling, health monitoring, and audit logging.

## User Preferences
Preferred communication style: Simple, everyday language.
User requirement: "360 degrees to 10000000000% perfection" implementation.

## System Architecture

### UI/UX Decisions
The application uses `shadcn/ui` (built on `Radix UI`) with `Tailwind CSS` and `Lucide React` for iconography. It features a responsive design, a dashboard with real-time stats, and animated quick action cards. Key UX enhancements include comprehensive accessibility, a unified 360° navigation architecture with enhanced breadcrumbs and quick action shortcuts, a Dark Mode system, skeleton loaders for perceived performance, and a comprehensive NotificationCenter.

### Technical Implementations
-   **Frontend**: React 18, TypeScript, Vite, `TanStack Query` for server state, `Wouter` for routing, `React Hook Form` with `Zod` for forms.
-   **Backend**: Node.js with Express.js and TypeScript (ESM modules), featuring a RESTful API, centralized error handling, and custom logging.
-   **Data Storage**: PostgreSQL database managed by Drizzle ORM (Neon Database), with Drizzle Kit for migrations and Drizzle-Zod for runtime type validation.
-   **Authentication**: Session-based authentication with hashed passwords, including RBAC with `isAdmin` field and `requireAdmin` middleware. CSRF protection is implemented with session-backed token validation.
-   **Core Features**: AI Chat Therapy (OpenAI-powered), Mood Tracking & Analytics, Journal System, Crisis Resources, Content Studio (rich text editor with AI suggestions), Social Calendar (multi-platform scheduling), Analytics Dashboard (performance metrics, visualizations), Performance Dashboard (Core Web Vitals monitoring), and Productivity Hub (advanced export, bulk operations, AI content generation, automation rules, advanced search).
-   **Caching Strategy**: Centralized cache key factory, optimized cache configurations, and `useOptimizedQuery`/`useOptimizedMutation` hooks. Intelligent API response caching with ETags and stale-while-revalidate.
-   **Error Handling**: Advanced ErrorBoundary (page and section level), global error tracking, and `useErrorHandler` hook.
-   **Form Validation**: `useFormValidation` hook with real-time validation, auto-save, and Zod schema support.
-   **Offline Support**: `offlineManager` with automatic queuing, auto-sync, retry logic, and `OfflineIndicator`. Enhanced service worker with intelligent caching strategies (cache-first, stale-while-revalidate, network-first) and automatic cache cleanup.
-   **Web Vitals Monitoring**: Real-time Core Web Vitals tracking (LCP, INP, CLS, FCP, TTFB) with performance scoring and recommendations.
-   **Deployment**: Optimized for Replit Autoscale with dual-algorithm compression, pre-compressed assets, HTTP caching, code splitting, and production-grade health checks (`/api/health`, `/api/health/live`, `/api/health/ready`). Includes audit logging for various system events.

### System Design Choices
The architecture prioritizes type safety, developer experience, and modern web practices within a monorepo, ensuring clear separation of concerns. It includes security features like XSS protection, rate limiting, and input sanitization. Robust error handling, comprehensive observability (logging, health monitoring, Web Vitals, structured error tracking), and runtime environment variable validation (Zod) are implemented. React Context manages global state. Database connection pooling is optimized for Autoscale.

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