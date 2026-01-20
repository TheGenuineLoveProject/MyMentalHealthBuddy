# The Genuine Love Project - Navigation Map

## Overview
This document defines the complete navigation structure, user flows, and information architecture for The Genuine Love Project platform.

---

## Primary Navigation (Authenticated Users)

### Main Navbar
| Label | Route | Icon | Description |
|-------|-------|------|-------------|
| Dashboard | `/dashboard` | Home | User home, wellness overview |
| Wellness | `/wellness` | Heart | Wellness toolkit |
| Journal | `/journal` | Notebook | Journaling tools |
| Chat | `/chat` | MessageCircle | AI companion |
| Atlas | `/atlas` | Compass | Intellectual tools |
| Premium | `/premium` | Crown | Premium features |

### User Menu (Dropdown)
| Label | Route | Description |
|-------|-------|-------------|
| Settings | `/settings` | User preferences |
| Analytics | `/analytics` | Personal analytics |
| Billing | `/billing` | Subscription management |
| Logout | (action) | Sign out |

---

## Primary Navigation (Public Users)

### Public Navbar
| Label | Route | Description |
|-------|-------|-------------|
| Home | `/` | Landing page |
| Features | `/#features` | Feature showcase |
| Pricing | `/pricing` | Pricing plans |
| Blog | `/blog` | Wellness blog |
| Login | `/login` | Sign in |
| Get Started | `/register` | Sign up CTA |

---

## Footer Navigation

### Company
| Label | Route |
|-------|-------|
| About | `/about` |
| Blog | `/blog` |
| Careers | `/careers` |

### Legal
| Label | Route |
|-------|-------|
| Privacy Policy | `/privacy` |
| Terms of Service | `/terms` |
| Disclaimer | `/disclaimer` |
| Ethics | `/ethics` |

### Support
| Label | Route |
|-------|-------|
| Help Center | `/support` |
| Crisis Resources | `/crisis` |
| Contact | `/contact` |

---

## Secondary Navigation

### Dashboard Sidebar
| Label | Route | Icon |
|-------|-------|------|
| Overview | `/dashboard` | LayoutDashboard |
| Mood | `/mood` | Smile |
| Journal | `/journal` | Notebook |
| Analytics | `/analytics` | BarChart3 |
| Today | `/today` | Calendar |

### Atlas Navigation
| Label | Route | Category |
|-------|-------|----------|
| Atlas Home | `/atlas` | Hub |
| Strategy Maps | `/atlas/strategy-maps` | Planning |
| Systems Thinking | `/atlas/systems-thinking` | Analysis |
| Knowledge Synthesis | `/atlas/knowledge-synthesis` | Learning |
| Wisdom Practices | `/atlas/wisdom-practices` | Wisdom |
| Growth Analytics | `/growth-analytics` | Metrics |

### Wellness Tools Navigation
| Label | Route | Category |
|-------|-------|----------|
| Wellness Home | `/wellness` | Hub |
| Breathing | `/wellness#breathing` | Mindfulness |
| Meditation | `/wellness#meditation` | Mindfulness |
| Habit Tracker | `/wellness#habits` | Tracking |
| Sleep Tracker | `/wellness#sleep` | Tracking |

---

## Admin Navigation

### Admin Sidebar (Admin Role)
| Label | Route | Permission |
|-------|-------|------------|
| Admin Home | `/admin` | admin |
| Users | `/admin/users` | admin |
| Content | `/admin/content` | admin |
| Analytics | `/admin/analytics` | admin |
| System Health | `/admin/health` | admin |

---

## Role-Based Navigation

| Role | Primary Nav | Admin Access | Premium Features |
|------|-------------|--------------|------------------|
| Guest | Public nav | No | No |
| Free User | Dashboard nav | No | Limited |
| Premium User | Dashboard nav | No | Full |
| Admin | Dashboard + Admin | Yes | Full |

---

## User Flows

### Onboarding Flow
```
/ (Landing) → /register → /onboarding → /dashboard
```

### Authentication Flow
```
/login → /dashboard (success)
/login → /forgot-password → /reset-password → /login
```

### Wellness Flow
```
/dashboard → /wellness → [tool] → /dashboard
/dashboard → /mood → (log mood) → /dashboard
/dashboard → /journal → (write entry) → /dashboard
```

### Premium Upgrade Flow
```
/dashboard → /premium → /pricing → (checkout) → /premium (access)
```

### Crisis Flow
```
[any page] → /crisis (immediate access)
/chat → (crisis detection) → /crisis resources shown
```

---

## Navigation Accessibility

### Requirements
- All nav items keyboard accessible
- `aria-current="page"` on active items
- Focus visible on all items
- Skip navigation link at top
- Mobile hamburger menu with clear close button

### Mobile Navigation
- Hamburger icon trigger
- Full-screen overlay menu
- Clear close button (X)
- Same link structure as desktop
- Touch targets minimum 44x44px

---

## Breadcrumb Patterns

### Atlas Pages
```
Dashboard > Atlas > [Tool Name]
```

### Wellness Pages
```
Dashboard > Wellness > [Tool Name]
```

### Account Pages
```
Dashboard > Settings > [Section]
```

---

## Link Standards

### Internal Links
- Use `<Link>` component (wouter)
- Always include `data-testid`
- Descriptive link text (not "click here")

### External Links
- Use `<a>` with `rel="noopener noreferrer"`
- Open in new tab (`target="_blank"`)
- Indicate external with icon

---

## Last Updated
January 2026
