# Information Architecture

## Purpose
Documents the complete navigation structure, user flows, and page templates for The Genuine Love Project platform.

---

## Sitemap

### Public Pages
```
/                     Landing Page
/pricing              Pricing & Plans
/login                User Login
/register             User Registration
```

### Protected Pages (Authenticated)
```
/dashboard            User Dashboard (Home)
/journal              Mirror API Journaling
/chat                 AI Companion
/wellness             Wellness Tools Hub
/premium              Premium Features
/settings             User Settings
/profile              User Profile
```

### Tool Pages
```
/tools/reflection     Reflection Tools
/tools/wisdom         Wisdom Tools
/tools/advanced       Advanced Intellectual Tools
/tools/mastery        Mastery Tools
/tools/elite          Elite Tools Dashboard
```

### Admin Pages (Admin Role Required)
```
/admin                Admin Dashboard
/admin/users          User Management
/admin/content        Content Management
/admin/analytics      Platform Analytics
```

### Error Pages
```
/404                  Not Found (fallback)
```

---

## Role-Based Navigation

### Public (Unauthenticated)
| Nav Item | Path | Visible |
|----------|------|---------|
| Home | / | Yes |
| Pricing | /pricing | Yes |
| Login | /login | Yes |
| Register | /register | Yes |

### Authenticated User
| Nav Item | Path | Visible |
|----------|------|---------|
| Dashboard | /dashboard | Yes |
| Journal | /journal | Yes |
| Chat | /chat | Yes |
| Wellness | /wellness | Yes |
| Premium | /premium | Yes |
| Settings | /settings | Yes |
| Logout | - | Yes |

### Premium User
All authenticated routes plus:
| Nav Item | Path | Visible |
|----------|------|---------|
| Elite Tools | /tools/elite | Yes |
| Advanced Tools | /tools/advanced | Yes |

### Admin
All authenticated routes plus:
| Nav Item | Path | Visible |
|----------|------|---------|
| Admin | /admin | Yes |

---

## User Flows

### 1. Onboarding Flow
```
Landing → Register → Dashboard
                   ↓
              Welcome Modal → First Journal Entry
```

### 2. Daily Engagement Flow
```
Dashboard → Wellness Tools → Complete Activity → XP Gained
         ↓
      Journal → AI Companion (if needed)
```

### 3. Premium Upgrade Flow
```
Free Feature → Premium Gate → Pricing → Checkout → Premium Dashboard
```

### 4. Crisis Support Flow
```
Any Page → Crisis Detected → Crisis Resources Modal → External Resources
```

---

## Page Templates

### Template: Marketing
**Used by:** Landing, Pricing
**Characteristics:**
- Hero section with gradient
- Feature cards
- Social proof
- CTA sections
- Full-width layout

### Template: Dashboard
**Used by:** Dashboard, Admin
**Characteristics:**
- Sidebar navigation
- Card-based content
- Quick actions
- Stats/metrics display

### Template: Tool
**Used by:** Wellness, Journal, Chat
**Characteristics:**
- Focused workspace
- Minimal distractions
- Progress indicators
- Save/export actions

### Template: Settings
**Used by:** Settings, Profile
**Characteristics:**
- Form-based layout
- Section groupings
- Save confirmations
- Toggle controls

### Template: Reading
**Used by:** Study Vault, Help articles
**Characteristics:**
- Constrained width (60-75ch)
- Enhanced typography
- Table of contents
- Reading progress indicator

---

## Navigation Components

### Primary Navigation (Desktop)
- Location: Header
- Type: Horizontal menu
- Items: Dashboard, Journal, Chat, Wellness, Premium

### Mobile Navigation
- Type: Bottom tab bar + hamburger menu
- Primary tabs: Dashboard, Journal, Chat, Wellness
- Secondary: Hamburger menu for all routes

### Footer Navigation
- Links: Home, Pricing, Privacy, Terms, Contact
- Social: Links to social profiles (if any)

---

## Accessibility Navigation

### Skip Links
```html
<a href="#main-content" class="sr-only focus:not-sr-only">
  Skip to main content
</a>
```

### Landmarks
- `<header role="banner">` - Site header
- `<nav role="navigation">` - Primary navigation
- `<main role="main" id="main-content">` - Main content
- `<footer role="contentinfo">` - Site footer

### Keyboard Navigation
- Tab order follows visual order
- Focus visible on all interactive elements
- Escape closes modals/dropdowns
- Arrow keys for menu navigation

---

## URL Conventions

### Patterns
- Lowercase, hyphen-separated: `/wellness-tools`
- No trailing slashes: `/dashboard` not `/dashboard/`
- Dynamic segments: `/journal/:entryId`

### Query Parameters
- Filters: `?category=mindfulness`
- Pagination: `?page=2&limit=10`
- Search: `?q=breathing`

---

## Redirect Rules

| Old Path | New Path | Type | Reason |
|----------|----------|------|--------|
| (none currently) | - | - | - |

---

## 404 Recovery Strategy

### Not Found Page
- Calm, supportive messaging
- Search suggestion
- Popular links:
  - Dashboard
  - Wellness Tools
  - Journal
  - Contact Support

---
Last Updated: January 2026
