# MyMentalHealthBuddy

## Overview

MyMentalHealthBuddy is a comprehensive mental health support platform featuring AI-powered chat therapy, mood tracking, personal journaling, mental health resources, and crisis support. The platform combines therapeutic AI conversations with self-care tools to provide 24/7 mental health support in a compassionate, non-judgmental environment.

## Recent Changes (November 25, 2025)

### Production Monitoring Enhancements
- **Request ID Tracking**: Cross-pod request correlation via X-Request-ID headers for autoscale debugging
- **Structured Logging**: JSON log output in production with timestamps, levels, and request context
- **Enhanced Error Handler**: Errors now include request ID for traceability across distributed pods
- **Health Check Logging**: Database connectivity failures logged with structured format

### Dashboard Enhancement
- **Gradient Stat Cards**: Visual mood stats with color-coded backgrounds and trend indicators
- **Time-of-Day Greeting**: Personalized welcome messages based on time (morning/afternoon/evening)
- **Daily Wellness Tips**: Rotating tips to encourage mental health practices
- **Quick Action Cards**: Gradient-styled cards for mood tracking, journaling, chat, and analytics
- **Loading States**: Skeleton loaders for data-fetching with proper accessibility

### Visual Enhancement Session
- **All Pages Polished**: Analytics, Journal, Settings, MoodPage, Login, Register now feature consistent gradient headers
- **Modern Styling**: Lucide icons throughout, smooth animations (fadeIn, slideUp), card-based layouts
- **Split-Screen Auth**: Login and Register pages now use elegant split-screen design with feature lists
- **Accessibility Enhanced**: ARIA labels, aria-invalid, aria-describedby, semantic form labels across all forms
- **Performance**: ErrorBoundary component, lazy loading with Suspense, PageSkeleton for loading states

### Security & Backend Enhancements
- **JWT Security**: Enforced SESSION_SECRET in production (exits if not configured)
- **Stripe Webhooks**: Complete event handlers with database-backed idempotency for autoscale
- **Rate Limiting**: Multi-tier rate limiters (general, auth, AI, strict, write)
- **Health Checks**: /api/health, /api/health/ready (with DB latency), /api/health/live endpoints
- **Graceful Shutdown**: SIGTERM and SIGINT handlers with 30s timeout

### Frontend & Visual Improvements
- **Visual Refresh**: Gradient hero sections, CSS animations, modern card designs
- **Dark Mode**: Full theme toggle with localStorage persistence and system preference detection
- **Theme Context**: Created ThemeProvider with React context API
- **Enhanced Pages**: Home page with testimonials, Dashboard with animated cards

### Infrastructure
- **Deployment**: Configured for Replit Autoscale with npm run build
- **Build Optimized**: Production bundle 71.91 kB gzipped
- **All Routes Mounted**: Auth, Mood, Journal, AI, Billing, Analytics all functional

### Previous Changes
- Component Enhancement: All React components enhanced with comprehensive data-testid attributes
- Accessibility: Added ARIA labels to Navbar, ProtectedRoute, FloatingButton, ChatWidget
- Error Handling: Centralized API client with proper error handling
- Bug Fixes: Fixed AI service model name from "gpt-4.1-mini" to "gpt-4o-mini"
- Cleanup: Removed duplicate/unused files

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- **React 18** with TypeScript for type-safe UI components
- **Vite** as the build tool and development server
- **Wouter** for lightweight client-side routing
- **React Hook Form** with **Zod** for form validation and schema definition
- **Tailwind CSS** for utility-first styling
- **Lucide React** for iconography

**Design Decisions:**
- Single-page application (SPA) architecture for seamless navigation
- Component-based architecture for reusability and maintainability
- Vite's fast refresh enables rapid development iteration
- Tailwind CSS provides consistent, responsive design without custom CSS overhead
- Form validation handled declaratively with Zod schemas for runtime type safety

**Development Server:**
- Runs on port 5173 (configurable)
- Configured with `0.0.0.0` host binding for Replit compatibility
- Allows Replit-specific domains (*.replit.dev, *.replit.app)

### Backend Architecture

**Technology Stack:**
- **Node.js** with **Express** framework
- **TypeScript** in ES Module mode for type safety
- **OpenAI API** for AI-powered therapeutic chat
- **CORS** middleware for cross-origin requests
- **Helmet** for security headers
- **Compression** middleware for response optimization
- **Morgan** for HTTP request logging
- **Express Session** for session management

**Design Decisions:**
- RESTful API design for clear endpoint semantics
- Express middleware chain for request processing (CORS → JSON parsing → routing)
- AI chat powered by OpenAI's GPT models with mental health-focused system prompts
- Session-based authentication for user state management
- Compression reduces bandwidth usage for faster responses
- Security headers (Helmet) protect against common web vulnerabilities

**Server Configuration:**
- Production server binds to `0.0.0.0` on port configurable via `PORT` environment variable
- Development mode uses `tsx` for TypeScript execution without compilation
- Production mode uses compiled JavaScript from `dist/` directory

### Mental Health System Prompt

The AI chat feature uses a specialized system prompt that ensures:
- Compassionate, non-judgmental responses
- Active listening and emotional validation
- Appropriate coping strategies when needed
- Clear boundaries (not a replacement for professional therapy)
- Crisis intervention awareness (directing to emergency resources when needed)
- Trauma-informed language and sensitivity to triggers

### Application Structure

**Monorepo Organization:**
```
client/          # Frontend React application
server/          # Backend Express server
shared/          # Shared types and schemas (referenced but not present)
scripts/         # Build and deployment scripts
archive_DO_NOT_DELETE/  # Historical documentation and configuration
```

**Key Design Choices:**
- Separation of client and server code for independent deployment
- Shared TypeScript paths configured via `tsconfig.json` for type reuse
- Archive directory preserves documentation and configuration history
- Scripts directory contains automation for diagnostics, healing, and verification

### Build and Deployment

**Build Process:**
- Client built with Vite (optimized production bundles with code splitting)
- Server compiled with TypeScript compiler (`tsc`)
- Concurrent development servers for client (5173) and server (configurable)

**Deployment Configuration:**
- Optimized for Replit deployment environment
- Environment variables managed via `.env` files
- Production-ready with compression, security headers, and session management
- Health check endpoints for monitoring

### Data Flow

1. **User Interaction** → Frontend React components
2. **API Request** → Client makes HTTP request to Express server
3. **Middleware Chain** → CORS → Session → JSON parsing → Routing
4. **AI Processing** → OpenAI API integration for therapeutic responses
5. **Response** → Server returns JSON with AI-generated reply
6. **UI Update** → React updates interface with response

### Security Considerations

- **CORS** configured to allow specific origins
- **Helmet** adds security headers (XSS protection, content security policy)
- **Session management** for user state persistence
- **Input sanitization** (implied through validation libraries)
- **Environment variables** protect API keys and secrets

## External Dependencies

### AI Services
- **OpenAI API** - Powers the AI chat therapy feature with GPT models
  - Requires `OPENAI_API_KEY` environment variable
  - Uses mental health-focused system prompts for therapeutic responses

### Development Tools
- **Vite** - Fast build tool and development server
- **TypeScript** - Static type checking across the codebase
- **tsx** - TypeScript execution for development mode
- **Concurrently** - Run multiple development servers simultaneously

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **React Hook Form** - Form state management
- **Wouter** - Lightweight routing library

### Backend Services
- **Express** - Web application framework
- **Express Session** - Session middleware
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security headers middleware
- **Compression** - Response compression
- **Morgan** - HTTP request logger
- **Zod** - Runtime type validation and schema definition

### Monitoring & Error Tracking
- **Sentry** (Browser and React) - Error tracking and performance monitoring
  - Configured for both client-side and server-side error capture
  - Profiling capabilities for Node.js performance analysis

### Development Dependencies
- **@types/** packages - TypeScript type definitions
- **@vitejs/plugin-react** - React integration for Vite
- **dotenv** - Environment variable management