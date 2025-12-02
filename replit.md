# MyMentalHealthBuddy

## Overview

MyMentalHealthBuddy is a comprehensive mental health support platform offering AI-powered chat therapy, mood tracking, personal journaling, mental health resources, and crisis support. It aims to provide 24/7 mental health assistance in a compassionate and non-judgmental environment, combining therapeutic AI conversations with self-care tools. The platform is designed for scalability and robust performance.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

The frontend is a Single-Page Application (SPA) built with **React 18** and **TypeScript**, using **Vite** for fast development and optimized builds. **Wouter** handles lightweight client-side routing, and **React Hook Form** with **Zod** manages form validation and schema definition. Styling is achieved with **Tailwind CSS** for a utility-first approach, ensuring consistent and responsive design, complemented by **Lucide React** for iconography. Accessibility is a core focus, incorporating ARIA attributes, semantic HTML, keyboard navigation (SkipLink), and visible focus rings. All interactive elements have proper focus management and screen reader support.

### Backend Architecture

The backend is developed with **Node.js** and **Express**, utilizing **TypeScript** in ES Module mode. It provides a RESTful API with middleware for CORS, security headers (Helmet), compression, and logging (Morgan). User sessions are managed with **Express Session**. The AI chat feature integrates with the **OpenAI API**, using specialized mental health-focused system prompts for compassionate and non-judgmental therapeutic responses, with a focus on crisis intervention awareness and trauma-informed language. The server handles static file serving for the client build and includes health check endpoints for monitoring.

### Monorepo Organization

The project follows a monorepo structure, separating the `client/` (React app) and `server/` (Express app) directories. Shared types and schemas are intended to be placed in a `shared/` directory to ensure consistency between client and server.

### Build and Deployment

The client is built using Vite for optimized production bundles with code splitting. The server is compiled with TypeScript. The entire application is optimized for deployment on environments like Replit Autoscale, utilizing environment variables for configuration and including health checks, rate limiting, and graceful shutdown handlers.

## External Dependencies

### AI Services
- **OpenAI API**: Powers the AI chat therapy feature.

### Development Tools
- **Vite**: Build tool and development server.
- **TypeScript**: Enables static type checking.
- **tsx**: Executes TypeScript directly in development.
- **Concurrently**: Runs multiple development processes.

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework.
- **Lucide React**: Icon library.
- **React Hook Form**: Manages form state.
- **Wouter**: Lightweight routing library.
- **Zod**: Runtime type validation and schema definition.

### Backend Services
- **Express**: Web application framework.
- **Express Session**: Session management.
- **CORS**: Cross-origin resource sharing.
- **Helmet**: Security headers middleware.
- **Compression**: Response compression.
- **Morgan**: HTTP request logger.

### Monitoring & Error Tracking
- **Sentry**: Comprehensive error tracking and performance monitoring for both client and server.