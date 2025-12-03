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

## Recent Changes (December 2, 2025)

### Crisis Resources Page
- Added comprehensive crisis resources page with 24/7 emergency hotlines (988 Suicide & Crisis Lifeline, Crisis Text Line, NAMI)
- Includes self-care tips and accessible navigation
- Linked from Dashboard and AI Chat pages for easy access

### AI Chat Improvements
- Chat history now persists to database (ai_messages table)
- Improved error handling with compassionate fallback messages when AI is unavailable
- Users can clear chat history from the UI

### API Validation & Security
- Centralized Zod validation schemas in server/validation/schemas.mjs
- All routes now validate request bodies before processing
- Added PUT endpoints for mood and journal updates

### Performance Optimizations
- Code-splitting with React.lazy() reduces initial bundle size from 537KB to 426KB (20% reduction)
- Protected pages load on-demand for faster initial page load

### Production Readiness
- Graceful shutdown handler for Replit Autoscale deployments
- Global error handler for uncaught exceptions
- Health check endpoint at /api/health

### Integration Testing Suite
- 35 comprehensive tests covering AI chat, mood, and journal CRUD operations
- Vitest configured with supertest for API testing
- Test helpers for authentication and user creation
- All tests pass with zero failures

### Schema Synchronization
- server/db/schema.mjs and shared/schema.mjs fully synchronized
- TEXT-based IDs, VARCHAR ratings match actual Neon database structure
- Fixed mood stats calculation to parse VARCHAR ratings as numbers for proper analytics

### Security Hardening (December 2, 2025)
- Enhanced rate limiting with per-route configurations (auth: 10 req/15min, AI: 20 req/min, API: 120 req/min)
- Content Security Policy (CSP) headers implemented
- Input sanitization middleware with recursive nested object/array support
- Security headers: X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy

### SEO Implementation
- Dynamic SEO component for page-specific meta tags
- Open Graph (og:title, og:description, og:image, og:type) and Twitter Card meta tags
- All main pages have unique titles and descriptions

### Observability Improvements
- Request ID middleware for correlation tracking
- Structured logging with correlation IDs (JSON in production, colorized in dev)
- Enhanced health check endpoint with memory/uptime metrics
- Readiness endpoint (/api/ready) for deployment probes
- Sentry SDK integration for server and client error tracking

### Account Lifecycle Features (December 2, 2025)
- Password reset flow with secure token-based system (tokens hashed at rest, 1-hour expiry)
- Account deletion with re-authentication and complete data purge
- GDPR-compliant data export endpoint (JSON download of all user data)
- Audit logging for security-sensitive operations

### AI Resilience
- OpenAI circuit breaker with configurable failure/success thresholds
- Request timeout (15s) and exponential backoff retry (up to 3 attempts)
- Graceful fallback responses when AI is unavailable
- /api/ai/status endpoint to monitor circuit breaker state

## Recent Changes (December 3, 2025)

### Schema Consolidation
- Unified shared/schema.mjs as single source of truth for all Drizzle models
- Schema now matches actual Neon PostgreSQL database structure:
  - users, moods, journals: UUID with gen_random_uuid()
  - ai_messages, password_reset_tokens, audit_log: TEXT (manually generated)
  - analytics: INTEGER serial
- Fixed duplicate errorHandler middleware in server/middleware/errorHandler.mjs

### Form Validation Enhancement
- Retrofitted Login and Register pages with react-hook-form and Zod validation
- Improved error handling with per-field validation messages
- Added ARIA attributes for accessibility (aria-invalid, aria-describedby)
- Proper focus management and keyboard navigation

### Password Reset Frontend
- Added ForgotPassword page with email input and success state
- Added ResetPassword page with token validation via wouter's useSearch hook
- Both pages integrated with existing backend password-reset endpoints
- Added "Forgot your password?" link to Login page

### CSP Security Updates
- Updated Content Security Policy to allow Sentry connections (*.ingest.sentry.io)
- Added worker-src directive for blob workers
- Fixed CSP blocking Sentry error tracking in development

### Build System Fixes
- Fixed client/main.jsx with dangling Route JSX element
- Updated client/postcss.config.js to use @tailwindcss/postcss
- All 35 integration tests passing

### Structured Logging Overhaul (December 3, 2025)
- Replaced 65+ console.log/error/warn statements with structured logger across all server files
- Unified logging through server/utils/logger.mjs and server/middleware/requestId.mjs
- All log entries now include structured metadata (requestId, error details, timestamps)
- Production logs output JSON format for log aggregation; development logs use colorized output
- Updated files: auth.mjs, mood.mjs, journal.mjs, ai.mjs, analytics.mjs, account.mjs, ui-dashboard.mjs, stripeWebhook.mjs, response.mjs, auth middleware, errorHandler.mjs, db/client.mjs, db/connection.mjs, sentry.mjs, stripe.mjs, email.mjs, aiService.mjs, aiHandler.mjs, index.mjs

### Code Cleanup
- Removed duplicate authentication stubs from auth.mjs (kept real JWT implementation only)
- Deleted unused server/routes/passwordReset.mjs stub file
- Fixed password reset frontend to use correct /api/account/password-reset/* endpoints
- Fixed missing randomUUID imports in mood.mjs and journal.mjs routes

### Database Schema & Performance Fixes (December 3, 2025)
- Created missing webhook_events table for Stripe idempotency
- Added 9 database indexes for query performance:
  - idx_moods_user_id, idx_moods_created_at
  - idx_journals_user_id, idx_journals_created_at
  - idx_ai_messages_user_id, idx_ai_messages_created_at
  - idx_password_reset_tokens_user_id
  - idx_audit_log_user_id, idx_audit_log_created_at
- Set APP_BASE_URL environment variable for production Stripe redirects
- All 8 database tables now synchronized with schema

## Database Tables Reference

| Table | ID Type | Description |
|-------|---------|-------------|
| users | UUID (gen_random_uuid) | User accounts |
| moods | UUID (gen_random_uuid) | Mood tracking entries |
| journals | UUID (gen_random_uuid) | Journal entries |
| ai_messages | TEXT (manually generated) | AI chat history |
| password_reset_tokens | TEXT (manually generated) | Password reset tokens |
| audit_log | TEXT (manually generated) | Security audit log |
| analytics | INTEGER (serial) | User analytics aggregates |
| webhook_events | TEXT (Stripe event ID) | Webhook idempotency tracking |

## Environment Variables

### Required for Production
- SESSION_SECRET: ✅ Set
- DATABASE_URL: ✅ Set
- OPENAI_API_KEY: ✅ Set (for AI chat)
- STRIPE_SECRET_KEY: ✅ Set (for billing)
- STRIPE_WEBHOOK_SECRET: ✅ Set (for billing)
- APP_BASE_URL: ✅ Set (for Stripe redirects)
- SENTRY_DSN: ✅ Set (for error tracking)

### Optional
- RESEND_API_KEY: Not set (for email delivery)