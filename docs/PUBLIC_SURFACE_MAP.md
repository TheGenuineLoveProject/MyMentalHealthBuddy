# Public Surface Map

**Date**: 2026-02-09  
**Purpose**: Inventory of every page reachable without login

---

## Primary Public Pages

| Route | Purpose | Primary CTA | Tone |
|-------|---------|-------------|------|
| `/` | Landing page — first impression, explains the platform | Try It Free / Get Started | Calm, invitational |
| `/about` | Mission and values | — | Informational |
| `/about/approach` | Methodology explanation (MI, strengths-based) | — | Educational |
| `/values` | Core values page | — | Reflective |
| `/pricing` | Free vs Pro comparison, checkout | Get Started Free / Subscribe to Pro | Calm, transparent |
| `/blog` | Blog index with articles | Read Latest / Newsletter CTA | Informational |
| `/blog/:slug` | Individual blog post | Newsletter CTA (bottom) | Educational |
| `/newsletter` | Newsletter signup page | Subscribe When You're Ready | Gentle, consent-first |
| `/crisis` | Crisis resources — 988, text lines, safety info | Call 988 | Safety-critical, direct |
| `/contact` | Contact form | — | Supportive |
| `/faq` | Frequently asked questions | — | Informational |
| `/learn` | Learning hub — guides, articles, courses | — | Educational |
| `/privacy` | Privacy policy | — | Legal, transparent |
| `/terms` | Terms of service | — | Legal |
| `/legal` | Legal overview | — | Legal |
| `/community-guidelines` | Community rules | — | Clear, respectful |
| `/safety` | Safety center | Crisis links | Safety-critical |
| `/press-kit` | Press/media info | — | Professional |
| `/roadmap` | Public product roadmap | — | Transparent |
| `/data-retention` | Data retention policy | — | Legal, transparent |
| `/hubs` | Topic hub index (wellness topics) | — | Invitational |
| `/challenge` | Self-guided challenge | — | Encouraging |
| `/features` | Platform features overview | — | Informational |
| `/testimonials` | User testimonials | — | Social proof, calm |
| `/healing` | Healing overview | — | Supportive |
| `/twelve-practices` | 12-Phase Self-Alignment Path | — | Educational |

## Auth Pages (Public Entry Points)

| Route | Purpose | CTA | Tone |
|-------|---------|-----|------|
| `/login` | Sign in | Sign In Securely | Calm |
| `/register` | Create account | Get Started Securely | Invitational |
| `/forgot-password` | Password recovery | — | Supportive |

## SEO Redirect Routes (510+)

Semantic word-based routes (e.g., `/anxiety`, `/grief`, `/self-love`, `/sleep`) redirect to appropriate wellness tools. These are not standalone pages but discoverability aids.

## Footer Navigation Surfaces

| Footer Component | Links Included | Crisis Link |
|-----------------|----------------|:-----------:|
| `Footer.jsx` (main) | Tools, Journal, Wisdom, Blog, Newsletter, Crisis, Privacy, Terms | Yes |
| `SacredFooter.jsx` (marketing) | Features, Pricing, About, Blog, Newsletter, FAQ, Crisis, Contact, Community, Privacy, Terms, Ethics, Disclaimer | Yes (in newsletter) |
| `ui/Footer.jsx` (minimal) | About, Privacy, Terms, Contact, 988 Crisis | Yes |
| `SafetyFooter.jsx` (tool pages) | Privacy, Crisis | Yes |
| `layout/Footer.tsx` (layout) | Crisis, FAQ, Privacy, Terms | Yes |

## Header Navigation (Landing Page)

| Nav Item | Destination | Public? |
|----------|-------------|:-------:|
| Home | `#home` (anchor) | Yes |
| About | `#about` (anchor) | Yes |
| Features | `#features` (anchor) | Yes |
| Blog | `/blog` | Yes |
| Community | `/community` | Requires login |
| Learn | `/learn` | Yes |
| Crisis Help | `/crisis` | Yes |
| Pricing | `/pricing` | Yes |
| Sign In | `/login` | Yes |
| Get Started | `/api/login` (Replit auth) | Yes |

## Social Media Links (Footer.jsx)

| Platform | URL | Status |
|----------|-----|--------|
| Instagram | https://instagram.com/thegenuineloveproject | Placeholder — verify before launch |
| YouTube | https://youtube.com/@GenuineLoveProject | Placeholder — verify before launch |
| TikTok | https://tiktok.com/@genuineloveproject | Placeholder — verify before launch |
| X/Twitter | https://x.com/GenuineLoveProj | Placeholder — verify before launch |

## RSS Feed

| URL | Format | Standards |
|-----|--------|-----------|
| `/api/blog/rss` | RSS 2.0 + Atom | guid, self-link, language, lastBuildDate |
