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
-   **Custom Hooks Library**: Professional React hooks including `useDebounce`, `useLocalStorage`, `useMediaQuery` (with responsive variants), and `useOnClickOutside` for enhanced UX.
-   **Error Handling**: Advanced ErrorBoundary component with graceful fallback UI, recovery actions, and production error tracking integration.
-   **Toast Notifications**: Global toast system with ToastContext provider supporting success, error, info, and warning notifications with auto-dismiss.
-   **Loading States**: Comprehensive skeleton loaders (7 variants: Card, List, Table, Stats, Chart, Page) for improved perceived performance.
-   **Performance Monitoring**: Web Vitals tracking (LCP, FID, CLS, FCP, TTFB) with custom metrics and analytics integration ready.
-   **Core Features**:
    -   **AI Chat Therapy**: OpenAI-powered conversational AI with retry logic.
    -   **Mood Tracking**: Records mood, intensity, activities, and triggers with analytics.
    -   **Mood Analytics**: Advanced dashboard with personalized insights and trend analysis.
    -   **Data Export**: CSV and JSON export for journals and moods.
    -   **Journal System**: Private journaling with optional titles, moods, and tags.
    -   **Crisis Resources**: Access to emergency helplines.
    -   **Stripe Billing System**: Subscription management and payment processing.
    -   **Canva Integration**: Design creation for social media, quotes, and mood visualizations.
    -   **Content Studio**: Complete workflow management system (Draft→QA→Approve→Schedule→Publish) for content creation.
    -   **Social Calendar**: Multi-platform scheduling (Instagram, TikTok, Twitter, Facebook, LinkedIn) with visual calendar interface.
    -   **Design System**: Comprehensive component showcase (/design-system) documenting all UI components, colors, typography, and best practices.
-   **Deployment**: Optimized for Replit Autoscale with dual-algorithm compression, pre-compressed asset serving, intelligent HTTP caching, and code splitting.

### System Design Choices
The architecture emphasizes type safety, developer experience, and modern web practices within a monorepo structure. It maintains clear separation of concerns and incorporates security features like XSS protection, rate limiting, and input sanitization. Robust error handling includes specific error classes, retry logic, global ErrorBoundary, and production error tracking. Observability is ensured through request logging, health monitoring, Web Vitals tracking, and structured error tracking. Environment variables are validated at runtime using Zod. The application uses React Context pattern for global state (Toast, Canva) and implements comprehensive loading states for optimal UX.

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
-   **Vite**: Fast build tool and development server with ES module support.
-   **TypeScript**: Static type checking.
-   **ESBuild**: JavaScript bundler.
-   **PostCSS**: CSS processing with ES module configuration.
-   **Build Optimization**: Code splitting, lazy loading, tree shaking, gzip + brotli compression, bundle visualization.

### Replit Integration
-   **@replit/vite-plugin-cartographer**: Development environment integration.
-   **@replit/vite-plugin-dev-banner**: Development UI enhancements.
-   **@replit/vite-plugin-runtime-error-modal**: Enhanced error reporting.

### Third-Party Services
-   **OpenAI**: AI-powered conversational therapy.
-   **Stripe**: Payment processing and subscription management.
-   **Canva Connect API**: Professional design tool integration for visual content creation.