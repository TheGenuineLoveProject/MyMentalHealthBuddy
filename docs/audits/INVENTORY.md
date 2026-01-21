# Platform Inventory - The Genuine Love Project

**Generated:** January 21, 2026

## Project Structure

### Core Directories
- `client/` - React frontend (Vite + JSX)
- `server/` - Express.js backend (ESM)
- `shared/` - Shared types and schemas
- `docs/` - Documentation and audits
- `tools/` - Build and audit scripts

### Pages (50+ Components)
- **Auth**: Login, Register, ForgotPassword, ResetPassword
- **Core**: Home, Dashboard, Settings, Profile, Billing
- **Wellness**: Wellness, CrisisResources, MoodPage, JournalPage
- **AI**: AIChatPage, ChatConversation, ChatEmpty, ChatCrisis
- **Content**: Blog, BlogIndex, BlogPost, BlogEditor, ContentStudioPage
- **Advanced**: AtlasDashboard, CognitiveArchitecturePage, EliteToolsDashboard
- **Legal**: Terms, Privacy, Disclaimer, Ethics
- **Admin**: Admin, ControlDashboard, HealthPage

### Components
- Layout: Header, TglpNavbar, Footer
- UI: Cards, Buttons, Forms, Modals
- Features: GuardianHeartPanel, DailyAffirmations, WellnessScore
- Wellness Tools: 40+ lazy-loaded components

### Styles
- `client/src/styles/brand-tokens.css` - Design tokens (SINGLE SOURCE)
- `client/src/styles/tokens.css` - Utility classes
- `client/src/styles/brand.css` - Component styles
- `client/src/index.css` - Tailwind entry

### Icons
- **Library**: lucide-react (consistent outline style)
- **Usage**: 24px default, teal/charcoal primary, gold for accents

### Routes (60 Detected)
See `docs/NAV_LINK_AUDIT.md` for full route list

## API Routes
- 86 API route files
- 77 registered routers
- RESTful patterns with JWT authentication

## Assets
- `client/public/brand/` - Logo, favicon, OG images
- PWA manifest configured
