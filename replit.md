# MyMentalHealthBuddy

## Overview
MyMentalHealthBuddy is a production-grade AI-powered mental health support platform featuring therapeutic chat, mood tracking, journaling, crisis resources, and professional content management tools. The platform includes advanced Content Studio with AI-powered editing, Social Calendar with visual scheduling, and comprehensive Analytics dashboard. Built with a tiered subscription model (Free $29.99, Premium $49.99, Professional $69.99) offering varying access to AI sessions, analytics, and professional content creation tools.

## Recent Changes (October 29, 2025)

**PHASE 1: 360-Degree Platform Enhancement - Content & Analytics**
-   ✅ Added ContentEditor component with AI suggestions, rich text editing, and media support
-   ✅ Added CalendarView component with timezone-safe local date handling
-   ✅ Added AnalyticsDashboard component with engagement metrics and trend indicators
-   ✅ Added ContentTemplates library with 6 professional templates
-   ✅ Added SearchFilter component for advanced multi-faceted filtering
-   ✅ Created comprehensive AnalyticsPage with AI-powered insights
-   ✅ Enhanced StudioPage with integrated editor, templates, and search
-   ✅ Enhanced SocialCalendarPage with calendar/list views and proper date parsing
-   ✅ Fixed timezone bugs in calendar date handling (UTC → local time)

**PHASE 2: A-TO-Z ULTIMATE ENHANCEMENT - Charts, Performance, SEO & UX**
-   ✅ Created professional Charts library (Line, Bar, Pie, Area) with animations
-   ✅ Built global KeyboardShortcuts system (gd=Dashboard, gc=Chat, gs=Studio, etc.)
-   ✅ Added SEOOptimizer component with real-time content analysis and scoring
-   ✅ Implemented NotificationSystem with unread badges and action items
-   ✅ Created PerformanceDashboard with Core Web Vitals and bundle analysis
-   ✅ Enhanced AnalyticsPage with interactive PieChart and LineChart visualizations
-   ✅ Enhanced StudioPage with toggle-able SEO optimization tools
-   ✅ Added new PerformancePage (/performance) with complete monitoring
-   ✅ Integrated keyboard shortcuts globally across entire platform
-   ✅ Build optimized to 545KB with all pages lazy-loaded
-   ✅ All enhancements architect-approved for production readiness

**PHASE 3: ENTERPRISE PRODUCTIVITY HUB - Ultimate A-to-Z Enhancement**
-   ✅ Created AdvancedExport component with 4 formats (CSV, JSON, PDF, Excel) and templates
-   ✅ Built BulkOperations manager for batch editing with 6 bulk actions
-   ✅ Added AIContentGenerator with 4 content types, 4 tones, 3 lengths
-   ✅ Implemented AutomationRules engine with 5 triggers and 5 actions
-   ✅ Created AdvancedSearch system with filters, saved searches, trending topics
-   ✅ Built comprehensive ProductivityPage with 5 enterprise tools integrated
-   ✅ Added Productivity route (/productivity) with keyboard shortcut (gt)
-   ✅ Integrated Productivity into Navigation with Zap icon
-   ✅ Build optimized to ~620KB total (ProductivityPage: 31.19 KB / 8.03 KB gzipped)
-   ✅ All components include comprehensive data-testid attributes for QA automation
-   ✅ Deployment configured for Replit Autoscale production publishing
-   ✅ Complete enterprise-grade productivity platform ready for production

**PHASE 4: A-TO-Z PLATFORM PERFECTION - Accessibility, UX & Advanced Features** (IN PROGRESS)
-   ✅ **Accessibility Library (A)**: Created comprehensive accessibility.ts with ARIA helpers, keyboard navigation utilities, focus management, contrast checkers
-   ✅ **Skip Navigation**: Added SkipNavigation component for keyboard users to jump to main content
-   ✅ **Screen Reader Support**: Integrated AccessibilityAnnouncer with live regions for dynamic announcements
-   ✅ **Focus Management**: Created FocusTrap component for modal/dialog keyboard navigation
-   ✅ **Enhanced ARIA Labels**: Updated Navigation with role="navigation", aria-label, aria-current, aria-hidden attributes
-   ✅ **Keyboard Focus Styles**: Added focus-visible CSS with high-contrast mode support
-   ✅ **Breadcrumb Navigation (B)**: Smart breadcrumbs with auto-generated trails and home icon
-   ✅ **Dark Mode System (D)**: ThemeContext with Light/Dark/System modes, localStorage persistence, ThemeToggle component
-   ✅ **Help Tooltips (H)**: HelpTooltip component ready for contextual help throughout app
-   ✅ **Keyboard Shortcuts Menu (K)**: ShortcutsMenu with categorized shortcuts, visual guide (press ?)
-   ✅ **Enhanced Skeleton Loaders (L)**: Created EnhancedSkeleton library with 8 variants (Text, Circular, Card, List, Table, Stats, Chart, Page)
-   ✅ **Mobile Navigation (M)**: MobileNav with bottom bar, responsive menu, native app-like UX
-   ✅ **Notification Center (N)**: Comprehensive NotificationCenter with unread badges, filters, history, useNotifications hook
-   ✅ **PWA Support (P)**: manifest.json configured for installable app experience
-   ✅ **User Preferences (U)**: Theme preferences with localStorage persistence across sessions
-   ✅ **Zero-Config Deployment (Z)**: Replit Autoscale deployment ready
-   🔄 **10/26 A-to-Z Improvements Completed** - Continuing platform perfection journey

## User Preferences
Preferred communication style: Simple, everyday language.
User requirement: "360 degrees to 10000000000% perfection" implementation.

## System Architecture

### UI/UX Decisions
The application utilizes `shadcn/ui` built on `Radix UI` primitives, styled with `Tailwind CSS` and `Lucide React` for iconography. The design is responsive, supporting both mobile and desktop, and features a dashboard with real-time stats, animated quick action cards, and a recent activity feed.

### Technical Implementations
-   **Frontend**: React 18, TypeScript, Vite, `TanStack Query` for server state, `Wouter` for routing, and `React Hook Form` with `Zod` for forms.
-   **Backend**: Node.js with Express.js and TypeScript (ESM modules), featuring a RESTful API, centralized error handling, and custom logging.
-   **Data Storage**: PostgreSQL database managed by Drizzle ORM (Neon Database hosting), with Drizzle Kit for migrations and Drizzle-Zod for runtime type validation.
-   **Authentication**: Session-based authentication with hashed passwords, using `connect-pg-simple` for PostgreSQL session storage.
-   **Custom Hooks Library**: Professional React hooks including `useDebounce`, `useLocalStorage`, `useMediaQuery` (with responsive variants), and `useOnClickOutside` for enhanced UX.
-   **Professional Chart Components**: LineChart (animated with gradients), BarChart (horizontal/vertical), PieChart (donut with legend), AreaChart (gradient fills) - all interactive.
-   **Global Keyboard Shortcuts**: Power-user navigation (gd/gc/gm/gj/gs/ga/gp/gt), search (/), help (?), respects input fields.
-   **SEO Optimization Tools**: Real-time content analysis, title/description scoring, keyword tracking, readability analysis, actionable suggestions.
-   **Notification System**: Real-time alerts with unread badges, mark as read, action buttons, time-relative timestamps.
-   **Performance Monitoring**: Core Web Vitals tracking (FCP, LCP, CLS, FID, TTFB), bundle analysis, optimization suggestions, performance score.
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
    -   **Content Studio (360° Enhanced)**: 
        -   Rich text editor with AI-powered content suggestions
        -   Content templates library (6 templates: blog, video, podcast, infographic)
        -   Advanced search and filtering (by type, status, tags)
        -   Complete workflow management (Draft→QA→Approve→Schedule→Publish)
        -   Interactive workflow visualization
    -   **Social Calendar (360° Enhanced)**:
        -   Visual monthly calendar with timezone-safe date handling
        -   Multi-platform scheduling (Instagram, TikTok, Twitter, Facebook, LinkedIn)
        -   Calendar/List view toggle for flexible content management
        -   Real-time engagement tracking and analytics integration
        -   Best time recommendations powered by AI
    -   **Analytics Dashboard (NEW)**:
        -   Comprehensive performance metrics (views, engagement, shares, comments)
        -   Professional chart visualizations (PieChart, LineChart) with animations
        -   Audience insights with demographic breakdown
        -   Platform-specific traffic analysis
        -   AI-powered content recommendations
        -   Goals and achievements tracking
        -   Export capabilities (PDF, CSV, scheduled reports)
    -   **Performance Dashboard (NEW)**:
        -   Core Web Vitals monitoring (FCP, LCP, CLS, FID, TTFB)
        -   Load time trend analysis with LineChart
        -   Bundle size breakdown with BarChart
        -   Real-time metrics refresh
        -   Optimization suggestions and insights
        -   Overall performance score (0-100)
    -   **Productivity Hub (NEW - PHASE 3)**:
        -   **Advanced Export System**: Multi-format export (CSV, JSON, PDF, Excel), export templates (Standard, Executive, Detailed, Custom), data type selection, metadata options, scheduled exports, filter-based exports, recent export history
        -   **Bulk Operations Manager**: Batch editing across items, 6 bulk actions (Publish, Schedule, Tag, Duplicate, Archive, Delete), select all/deselect, visual feedback, operation stats
        -   **AI Content Generator**: Generate Headlines/Descriptions/Social Posts/Ideas, 4 tone options (Professional, Casual, Empathetic, Motivational), 3 length options, multiple variations, copy to clipboard, regenerate feature
        -   **Automation Rules Engine**: Workflow automation, 5 trigger types (Schedule, Content Created, Published, Engagement, Keywords), 5 action types (Publish, Tag, Notify, Archive, Duplicate), enable/disable rules, rule management
        -   **Advanced Search System**: Full-text search, advanced filters (Type, Status, Tags, Date), saved searches library, recent search history, trending topics, filter presets
        -   **Tabbed Interface**: Professional UI with color-coded tabs, stats overview dashboard, pro tips section, integrated keyboard shortcuts
    -   **Design System**: Comprehensive component showcase (/design-system) documenting all UI components, colors, typography, and best practices.
-   **Deployment**: Optimized for Replit Autoscale with dual-algorithm compression, pre-compressed asset serving, intelligent HTTP caching, code splitting, and production-ready deployment configuration.

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