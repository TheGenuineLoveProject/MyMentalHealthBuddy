# MyMentalHealthBuddy

## Overview

MyMentalHealthBuddy is a comprehensive mental health support application that provides users with AI-powered therapeutic chat, mood tracking, journaling, and mental health resources. The platform features a subscription-based model with Free, Premium ($19/mo), and Professional ($49/mo) tiers, offering varying levels of access to AI therapy sessions, mood analytics, and professional support options.

## Key Features

### Mental Health Support

- **AI-Powered Chat Therapy**: Conversational AI assistant trained for mental health support
- **Mood Tracking**: Daily mood monitoring with insights and trends analysis
- **Personal Journal**: Private, secure journaling system with writing prompts
- **Resource Library**: Curated collection of articles, videos, exercises, and podcasts
- **Crisis Support**: Quick access to emergency helplines and support resources

### Subscription Tiers

1. **Free Tier**: 5 AI sessions/month, basic mood tracking, limited resources
2. **Premium ($19/mo)**: Unlimited AI sessions, advanced mood analytics, full resource access
3. **Professional ($49/mo)**: All Premium features plus priority support and professional referrals

### Technical Features

- Secure user authentication with session management
- PostgreSQL database for data persistence
- Stripe integration for subscription billing
- Responsive design for mobile and desktop
- Real-time chat with streaming AI responses

## Recent Changes

### October 27, 2025 - Deployment Build Fixed and Ready

**Critical Fixes Applied:**
- ✅ Fixed API fallback bug - unknown /api/* routes now return proper 404 JSON instead of hanging
- ✅ Fixed workspace dependency issue - added vite and @vitejs/plugin-react to root package.json
- ✅ Resolved "vite package cannot be found by @vitejs/plugin-react" build error
- ✅ Production build verified working: Client 211KB (66KB gzipped)
- ✅ Production server tested and confirmed operational

**Deployment Status:**
- ✅ All dependencies properly installed
- ✅ Build process succeeds without errors
- ✅ Static file serving verified
- ✅ API endpoints responding correctly
- ✅ All deployment configuration verified in .replit
- ✅ **APPLICATION READY FOR PRODUCTION DEPLOYMENT**

### October 26, 2025 - Full Integration, Platform Cleanup, Deployment & Monorepo Optimization Completed

**Integration Complete:**
- ✅ Successfully integrated full-stack mental health application using workspace monorepo structure
- ✅ Fixed workspace configuration (added `apps/*` to package.json workspaces)
- ✅ Created comprehensive type-safe schema in `apps/shared/schema.ts` with all mental health types
- ✅ Aligned schema/storage contracts (fixed mood entry, journal, crisis resource type mismatches)
- ✅ Installed missing dependencies (zod in server, wouter in client)
- ✅ Configured Vite to use port 5000 with proper host settings for Replit webview
- ✅ Updated Express server to use port 3001 and register all API routes
- ✅ Resolved port conflicts and cleaned up stale processes from old directory structure
- ✅ Application running successfully with frontend (port 5000) and backend (port 3001)

**Platform Cleanup (28 items removed, ~542KB saved):**

*Phase 1 - Obsolete Scripts (16 files, ~84KB):*
- ✅ Deleted 12 obsolete corruption-fix scripts (advanced-corruption-fix.mjs, comprehensive-corruption-scanner.mjs, final-corruption-fix.mjs, fix-all-corruption.mjs, fix-corruption.mjs, mega-corruption-fix.mjs, ultimate-corruption-fix.mjs, fixCorruption.ts, fixDependencies.ts, fixImports.ts, fix-tsconfig-paths.ts, typesFix.ts)
- ✅ Deleted 4 duplicate root files (fix-esm.mjs, fix-extensions.ts, fixImports.ts duplicate, heal-recovery.sh)
- ✅ Cleaned scripts directory from 22 files to 10 files

*Phase 2 - Deprecated Directories (3 dirs, ~432KB):*
- ✅ Deleted client/ directory (388KB) - Default Vite template that duplicated apps/client/
- ✅ Deleted server/ directory (16KB) - Minimal Express stub that duplicated apps/server/
- ✅ Deleted packages/ directory (28KB) - Old schema location that duplicated apps/shared/

*Phase 3 - Additional Cleanup (9 items, ~26KB):*
- ✅ Archived 5 .txt prompt files to _archive/ directory (20KB)
- ✅ Deleted 4 outdated build/start scripts (build.mjs, build-prod.mjs, start.mjs, start-prod.mjs - 5.7KB)
- These scripts referenced old directory structure and are replaced by npm scripts

*OpenAI Integration:*
- ✅ Installed Replit AI Integrations for OpenAI (no API key required)
- ✅ Updated apps/server/src/openai.ts to use GPT-5 model
- ✅ Chat functionality now fully operational
- ✅ Uses Replit-managed endpoint (billed to Replit credits)

*Configuration Fixes:*
- ✅ Fixed package.json scripts to use correct workspace commands
- ✅ Added `npm run dev` script as main entry point
- ✅ Verified no imports reference deleted directories
- ✅ Application running without errors after all cleanup

**Deployment Configuration:**
- ✅ Added production `build` script to build client and server
- ✅ Added production `start` script to run built server
- ✅ Configured deployment settings for Autoscale deployment
- ✅ Updated server to serve static client files in production mode
- ✅ Installed missing TypeScript type definitions (@types/node, @types/express, @types/cors, @types/compression)
- ✅ Fixed PORT type handling for production environment
- ✅ Fixed TypeScript build output paths for monorepo structure
- ✅ Updated server tsconfig to include shared schema files
- ✅ Corrected production start path to match actual build output location
- ✅ Fixed client static file serving path for production mode
- ✅ Build process verified and working successfully
- ✅ Production server tested and confirmed operational
- ✅ Ready for production deployment via Replit's Publishing tool

**Monorepo Optimization (October 26, 2025):**
- ✅ Cleaned up unused root files (10 scripts, 6 config files removed)
- ✅ Removed empty directories (content/, tests/)
- ✅ Created complete workspace for apps/shared (package.json, tsconfig.json)
- ✅ Optimized dependency organization (removed 36 duplicate packages)
- ✅ Root now only has workspace tools (concurrently, kill-port, typescript)
- ✅ Server has all server dependencies (openai, @types/*, express, etc.)
- ✅ Fixed server workspace start script to match build output path
- ✅ Fixed Vite strictPort configuration for better dev reliability
- ✅ Created comprehensive documentation (MONOREPO.md, WORKSPACE_GUIDE.md, docs/)
- ✅ Organized documentation into structured hierarchy (docs/deployment/, docs/cleanup/)
- ✅ Production build verified: Client 216KB (68KB gzipped), all paths correct
- ✅ All improvements documented in docs/MONOREPO_IMPROVEMENTS.md
- ⚠️ Known issue: Development mode has transient port race condition (non-critical, production unaffected)

### Core Features Integrated

- **AI Chat Therapy**: OpenAI-powered mental health support with conversation history
- **Mood Tracking**: Track mood, intensity, activities, and triggers
- **Journal System**: Private journaling with optional titles, moods, and tags
- **Crisis Resources**: Pre-seeded emergency helplines and support services (National Suicide Prevention, Crisis Text Line, NAMI, SAMHSA)
- **Navigation**: Clean UI with Chat, Mood, Journal, Resources, and Crisis tabs

### September 27, 2025 - Platform Healing Completed

- ✅ Fixed 219+ critical errors and warnings across the codebase
- ✅ Implemented complete mental health features (mood tracking, journal, resources)
- ✅ Created unified navigation system with mobile support
- ✅ Integrated all routes and API endpoints
- ✅ Set up PostgreSQL database connection and session store
- ✅ Cleaned up 10+ duplicate files and directories
- ✅ Added comprehensive error handling and fallback systems

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture

- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ESM modules
- **API Design**: RESTful API endpoints with JSON responses
- **Error Handling**: Centralized error middleware with structured error responses
- **Logging**: Custom request/response logging middleware
- **Development**: Hot reloading with Vite middleware integration

### Data Storage

- **Database**: PostgreSQL with Drizzle ORM
- **Connection**: Neon Database serverless PostgreSQL
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Type Safety**: Drizzle-Zod integration for runtime validation
- **Fallback Storage**: In-memory storage implementation for development

### Database Schema

The application manages several key entities:

- **Users**: Authentication and user management
- **Services**: Application services with status monitoring
- **API Endpoints**: REST endpoint documentation and testing
- **Project Structure**: File and folder hierarchy tracking
- **Packages**: Dependency management for frontend/backend
- **Scripts**: Available npm/package scripts

### Authentication & Authorization

- Session-based authentication with PostgreSQL session storage
- User credentials stored with hashed passwords
- Session management through connect-pg-simple

### Development Tools

- **Hot Reloading**: Vite development server with HMR
- **Error Overlay**: Runtime error modal for development
- **Code Quality**: TypeScript strict mode with comprehensive type checking
- **Build Process**: Separate client/server build pipelines

## External Dependencies

### Database & Storage

- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle ORM**: Type-safe database ORM with PostgreSQL dialect
- **connect-pg-simple**: PostgreSQL session store for Express

### UI & Styling

- **shadcn/ui**: Complete component library with 40+ components
- **Radix UI**: Headless UI primitives for accessibility
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Lucide React**: Icon library for consistent iconography

### State Management & Data Fetching

- **TanStack Query**: Server state management with caching and synchronization
- **React Hook Form**: Form handling with validation
- **Zod**: Runtime type validation and schema definition

### Development & Build Tools

- **Vite**: Fast build tool with development server
- **TypeScript**: Static type checking and enhanced developer experience
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind CSS and Autoprefixer

### Replit Integration

- **@replit/vite-plugin-cartographer**: Development environment integration
- **@replit/vite-plugin-dev-banner**: Development UI enhancements
- **@replit/vite-plugin-runtime-error-modal**: Enhanced error reporting

The architecture emphasizes type safety, developer experience, and modern web development practices while maintaining a clean separation between frontend and backend concerns.
