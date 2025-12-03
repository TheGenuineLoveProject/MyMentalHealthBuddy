# MyMentalHealthBuddy

## Overview
MyMentalHealthBuddy is a mental health support platform providing AI-powered chat therapy, mood tracking, personal journaling, mental health resources, and crisis support. It offers 24/7 mental health assistance in a compassionate and non-judgmental environment, combining therapeutic AI conversations with self-care tools. The platform emphasizes scalability, robust performance, and a comprehensive self-improvement toolkit.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### UI/UX Decisions
The frontend features a premium, Canva-inspired visual design with HSL color formatting, custom typography (Inter, Playfair Display), enhanced gradients, and refined shadows. It includes full light/dark theme support, micro-interactions, and accessibility features like ARIA attributes, semantic HTML, keyboard navigation (SkipLink), visible focus rings, and proper touch targets. Responsive typography and safe area insets ensure mobile responsiveness, while prefers-reduced-motion and high contrast mode support cater to diverse user needs. Key pages like Home, Dashboard, Mood, Journal, AI Chat, Login/Register, and Crisis Resources have been redesigned for a consistent premium aesthetic.

### Technical Implementations
The frontend is a Single-Page Application (SPA) built with React 18 and TypeScript, using Vite for development and optimized builds. Wouter handles client-side routing, and React Hook Form with Zod manages form validation. Tailwind CSS and Lucide React are used for styling and iconography. The backend is a Node.js and Express application with TypeScript, providing a RESTful API. It includes middleware for CORS, security headers (Helmet), compression, logging (Morgan), and session management (Express Session). The project uses a monorepo structure separating client and server, with shared types planned for consistency.

### Feature Specifications
The platform offers:
- AI-powered chat therapy with compassionate, trauma-informed responses and crisis intervention awareness, integrated with the OpenAI API.
- Mood tracking and personal journaling.
- Comprehensive crisis resources and support.
- Account lifecycle features including password reset, account deletion, and GDPR-compliant data export.
- A self-improvement toolkit including guided breathing exercises, a meditation timer, a habit tracker, daily affirmations, gratitude prompts, a self-care checklist, achievement badges, and a wellness score visualization.
- Robust security features like rate limiting, Content Security Policy (CSP), input sanitization, and CSRF protection.
- Structured logging and enhanced health/readiness endpoints for observability and monitoring.

### System Design Choices
The application is designed for optimized production bundles with code splitting, utilizing environment variables for configuration. It includes health checks, rate limiting, and graceful shutdown handlers for deployment on environments like Replit Autoscale. A unified `shared/schema.mjs` acts as the single source of truth for Drizzle models, matching the Neon PostgreSQL database structure with UUIDs, TEXT-based IDs, and serial integers, along with foreign key constraints for referential integrity and performance-enhancing indexes.

## External Dependencies

- **OpenAI API**: Powers the AI chat therapy feature.
- **Vite**: Frontend build tool and development server.
- **TypeScript**: Enables static type checking for both frontend and backend.
- **React**: Frontend UI library.
- **Wouter**: Lightweight client-side routing.
- **React Hook Form**: Manages form state and validation.
- **Zod**: Runtime type validation and schema definition.
- **Tailwind CSS**: Utility-first CSS framework.
- **Lucide React**: Icon library.
- **Node.js**: Backend runtime environment.
- **Express**: Backend web application framework.
- **Express Session**: Session management.
- **CORS**: Cross-Origin Resource Sharing middleware.
- **Helmet**: Security headers middleware.
- **Compression**: Response compression middleware.
- **Morgan**: HTTP request logger middleware.
- **Sentry**: Comprehensive error tracking and performance monitoring for client and server.
- **Drizzle ORM**: For database interactions.
- **Neon PostgreSQL**: Primary database solution.
- **Stripe**: For billing and payment processing (webhooks integrated).
- **tsx**: Executes TypeScript directly in development.
- **Concurrently**: Runs multiple development processes.
- **Vitest**: Testing framework.
- **Supertest**: For API testing.