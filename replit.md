# MyMentalHealthBuddy

## Overview
MyMentalHealthBuddy is an AI-powered mental health support application that provides therapeutic chat, mood tracking, journaling, and a resource library. It aims to offer accessible and comprehensive mental health tools through a tiered subscription model (Free, Premium, Professional) that provides various levels of access to AI sessions, analytics, and professional support.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### UI/UX Decisions
The application uses `shadcn/ui` components built on `Radix UI` primitives for a consistent and accessible user interface. `Tailwind CSS` with CSS variables is used for styling and theming, and `Lucide React` provides consistent iconography. The design is responsive, supporting both mobile and desktop. The dashboard includes real-time stats, quick action cards with animations, a recent activity feed, and motivational messages.

### Technical Implementations
-   **Frontend**: Built with React 18 and TypeScript, using Vite for bundling. `TanStack Query` manages server state, `Wouter` handles client-side routing, and `React Hook Form` with `Zod` provides form handling and validation.
-   **Backend**: Node.js with Express.js and TypeScript (ESM modules). It features a RESTful API with JSON responses, centralized error handling, and custom logging middleware.
-   **Data Storage**: PostgreSQL database, managed by Drizzle ORM and hosted on Neon Database. Drizzle Kit handles schema migrations, and Drizzle-Zod ensures runtime type validation.
-   **Authentication**: Session-based authentication with user credentials stored with hashed passwords, using `connect-pg-simple` for PostgreSQL session storage.
-   **Core Features**:
    -   **AI Chat Therapy**: OpenAI-powered conversational AI with retry logic and empathetic fallbacks.
    -   **Mood Tracking**: Records mood, intensity, activities, and triggers with real-time analytics.
    -   **Mood Analytics**: Advanced analytics dashboard with personalized insights, trend analysis, and mood distribution.
    -   **Data Export**: CSV and JSON export capabilities for journals and moods with proper download headers and rate limiting.
    -   **Journal System**: Private journaling with optional titles, moods, and tags.
    -   **Crisis Resources**: Provides access to emergency helplines.
-   **Deployment**: Advanced build system with dual-algorithm compression (gzip + brotli), pre-compressed asset serving, intelligent HTTP caching, and code splitting for optimized performance. The system includes a robust startup process with health checks and error recovery, configured for Replit Autoscale deployment.

### System Design Choices
The architecture emphasizes type safety, developer experience, and modern web development practices. It maintains a clean separation between frontend and backend concerns, utilizing a monorepo structure for organized development. Security features include XSS protection, rate limiting, and input sanitization. The system incorporates robust error handling with specific error classes, retry logic, and global error handlers for resilience. Observability is maintained through request logging, health monitoring, and structured error tracking.

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