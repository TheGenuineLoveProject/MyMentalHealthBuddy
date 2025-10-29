# MyMentalHealthBuddy

## Overview
MyMentalHealthBuddy is an AI-powered mental health support platform offering therapeutic chat, mood tracking, journaling, crisis resources, and professional content management. It features an advanced Content Studio with AI-powered editing, a Social Calendar with visual scheduling, and a comprehensive Analytics dashboard. The platform supports a tiered subscription model (Free, Premium, Professional) to access varying levels of AI sessions, analytics, and content creation tools. The project aims for "360 degrees to 10000000000% perfection" in its implementation, focusing on a production-grade, enterprise-ready solution.

## User Preferences
Preferred communication style: Simple, everyday language.
User requirement: "360 degrees to 10000000000% perfection" implementation.

## System Architecture

### UI/UX Decisions
The application uses `shadcn/ui` (built on `Radix UI`) with `Tailwind CSS` and `Lucide React` for iconography. It features a responsive design for mobile and desktop, including a dashboard with real-time stats, animated quick action cards, and a recent activity feed. Key UX enhancements include:
-   **Accessibility**: Comprehensive accessibility library, Skip Navigation, Screen Reader Support, Focus Management, enhanced ARIA labels, and keyboard focus styles.
-   **Navigation**: Smart breadcrumb navigation, MobileNav with a bottom bar, and a global KeyboardShortcuts system.
-   **Theming**: Dark Mode system with Light/Dark/System modes and localStorage persistence.
-   **Loading States**: Comprehensive skeleton loaders (8 variants) for improved perceived performance.
-   **Notifications**: Comprehensive NotificationCenter with unread badges, filters, and history.

### Technical Implementations
-   **Frontend**: React 18, TypeScript, Vite, `TanStack Query` for server state, `Wouter` for routing, `React Hook Form` with `Zod` for forms.
-   **Backend**: Node.js with Express.js and TypeScript (ESM modules), featuring a RESTful API, centralized error handling, and custom logging.
-   **Data Storage**: PostgreSQL database managed by Drizzle ORM (Neon Database), with Drizzle Kit for migrations and Drizzle-Zod for runtime type validation.
-   **Authentication**: Session-based authentication with hashed passwords.
-   **Core Features**:
    -   **AI Chat Therapy**: OpenAI-powered conversational AI.
    -   **Mood Tracking & Analytics**: Records mood, activities, triggers; provides personalized insights and trend analysis.
    -   **Journal System**: Private journaling with export options (CSV, JSON).
    -   **Crisis Resources**: Access to emergency helplines.
    -   **Content Studio**: Rich text editor with AI suggestions, templates, advanced search/filtering, and workflow management.
    -   **Social Calendar**: Visual monthly calendar with timezone-safe handling, multi-platform scheduling, and engagement tracking.
    -   **Analytics Dashboard**: Comprehensive performance metrics, professional chart visualizations (PieChart, LineChart), audience insights, and export capabilities.
    -   **Performance Dashboard**: Core Web Vitals monitoring, load time analysis, bundle size breakdown, and optimization suggestions.
    -   **Productivity Hub**: Advanced Export (multi-format, templates, scheduled), Bulk Operations Manager (batch editing), AI Content Generator (multi-type, tone, length), Automation Rules Engine (triggers & actions), and Advanced Search System.
-   **Caching Strategy**: Centralized cache key factory, optimized cache configurations per data type (user, moods, analytics, etc.), `useOptimizedQuery` and `useOptimizedMutation` hooks with automatic invalidation patterns.
-   **Error Handling**: Advanced ErrorBoundary (page and section level) with recovery actions, global error tracking, and `useErrorHandler` hook. Fully integrated across all 15 routes.
-   **Form Validation**: `useFormValidation` hook with real-time validation, auto-save, and Zod schema support.
-   **Offline Support**: `offlineManager` with automatic queuing, auto-sync, retry logic, and `OfflineIndicator`.
-   **Deployment**: Optimized for Replit Autoscale with dual-algorithm compression, pre-compressed assets, HTTP caching, and code splitting.

### System Design Choices
The architecture prioritizes type safety, developer experience, and modern web practices within a monorepo. It ensures clear separation of concerns and includes security features like XSS protection, rate limiting, and input sanitization. Robust error handling, comprehensive observability (logging, health monitoring, Web Vitals, structured error tracking), and runtime environment variable validation (Zod) are implemented. React Context manages global state.

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
-   **ESBuild**: JavaScript bundler.
-   **PostCSS**: CSS processing.
-   **Replit Vite Plugins**: Integration for development environment, error reporting, etc.

### Third-Party Services
-   **OpenAI**: AI-powered conversational therapy.
-   **Stripe**: Payment processing and subscription management.
-   **Canva Connect API**: Professional design tool integration.