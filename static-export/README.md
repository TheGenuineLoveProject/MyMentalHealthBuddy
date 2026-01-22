# The Genuine Love Project — Static Export Toolkit

> A complete developer-ready static HTML/CSS design system for TheGenuineLoveProject.com

## Overview

This toolkit contains everything needed to build, extend, and deploy The Genuine Love Project platform. It includes 15 production-ready pages, 12 reusable components, PWA support, and export formats for Figma and Webflow.

## Quick Start

```bash
# Open in browser
open index.html

# Or serve locally
npx serve .

# Extract from archive
tar -xzvf tglp-static-export.tar.gz
```

## Brand Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Sage | `#8fbf9f` | Primary accent, success states |
| Rose | `#f4c7c3` | Secondary accent, soft highlights |
| Deep Teal | `#2f5d5d` | Headings, CTAs, primary buttons |
| Cream | `#faf9f7` | Backgrounds |
| Charcoal | `#3a3a3a` | Body text |
| Gold | `#eac33b` | Achievements, ratings |

## File Structure

```
static-export/
├── index.html              # Landing page
├── onboarding.html         # User onboarding flow
├── home.html               # Logged-in homepage
├── crm.html                # CRM dashboard
├── content.html            # Content hub
├── qa.html                 # Q&A / FAQ page
├── login.html              # Auth page
├── blog.html               # Blog listing
├── profile.html            # User profile
├── contact.html            # Contact form
├── terms.html              # Terms of service
├── privacy.html            # Privacy policy
├── help.html               # Help center
├── testimonials.html       # Testimonials page
├── settings.html           # User settings
├── offline.html            # PWA offline page
│
├── css/
│   ├── style.css           # Main stylesheet
│   └── responsive.css      # Media queries
│
├── js/
│   ├── main.js             # Core JavaScript
│   └── service-worker.js   # PWA service worker
│
├── assets/
│   └── icons/              # 12 wellness SVG icons
│       ├── heart.svg
│       ├── leaf.svg
│       ├── sun.svg
│       ├── lotus.svg
│       ├── sparkle.svg
│       ├── brain.svg
│       ├── journal.svg
│       ├── shield.svg
│       ├── compass.svg
│       ├── wave.svg
│       ├── moon.svg
│       └── star.svg
│
├── images/
│   └── logo.svg            # Brand logo
│
├── components/             # 12 reusable HTML modules
│   ├── nav.html            # Navigation bar
│   ├── footer.html         # Footer
│   ├── form.html           # Form elements
│   ├── modal.html          # Modal dialogs
│   ├── blog-card.html      # Blog article cards
│   ├── sidebar.html        # CRM sidebar
│   ├── quote.html          # Quote blocks
│   ├── testimonial.html    # Testimonial cards
│   ├── card.html           # Generic cards
│   ├── crm-dashboard.html  # Dashboard widgets
│   ├── faq-block.html      # Accordion FAQ
│   └── newsletter.html     # Newsletter signup
│
├── manifest.json           # PWA manifest
├── robots.txt              # SEO robots file
├── sitemap.xml             # XML sitemap
├── seo-metadata.json       # SEO config
├── figma-component-map.json # Figma mapping
├── webflow-export.json     # Webflow schema
├── flowchart.svg           # Navigation flow
└── the-genuine-love-project.prompt # AI regeneration
```

## Pages (15 Total)

| Page | File | Description |
|------|------|-------------|
| Landing | `index.html` | Public homepage with hero, features, CTA |
| Onboarding | `onboarding.html` | New user questionnaire |
| Homepage | `home.html` | Logged-in user dashboard |
| CRM | `crm.html` | Wellness tracking dashboard |
| Content | `content.html` | Articles, resources, tools |
| Q&A | `qa.html` | FAQ and help articles |
| Login | `login.html` | Sign in / Sign up |
| Blog | `blog.html` | Article listings |
| Profile | `profile.html` | User profile and stats |
| Contact | `contact.html` | Contact form |
| Terms | `terms.html` | Terms of service |
| Privacy | `privacy.html` | Privacy policy |
| Help | `help.html` | Help center |
| Testimonials | `testimonials.html` | User stories |
| Settings | `settings.html` | Account settings |

## Components (12 Modules)

Each component includes:
- Semantic HTML with ARIA labels
- CSS dependencies documented
- Figma layer naming
- Multiple variants

### Component Reference

1. **nav.html** - Responsive navigation with mobile menu
2. **footer.html** - Site footer with links and social
3. **form.html** - Input fields, buttons, validation states
4. **modal.html** - Login, subscribe, confirmation dialogs
5. **blog-card.html** - Article preview cards
6. **sidebar.html** - CRM navigation sidebar
7. **quote.html** - Wellness quotes with variants
8. **testimonial.html** - User testimonials and slider
9. **card.html** - Feature, stat, content, and link cards
10. **crm-dashboard.html** - Stats grid, progress, activity feed
11. **faq-block.html** - Accordion FAQ items
12. **newsletter.html** - Email signup forms

## Design Tokens

```css
:root {
  /* Colors */
  --sage: #8fbf9f;
  --sage-light: rgba(143, 191, 159, 0.1);
  --rose: #f4c7c3;
  --teal: #2f5d5d;
  --cream: #faf9f7;
  --charcoal: #3a3a3a;
  --gold: #eac33b;
  
  /* Typography */
  --font-sans: 'Poppins', system-ui, sans-serif;
  --font-serif: 'Playfair Display', Georgia, serif;
  
  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  
  /* Radii */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(47, 93, 93, 0.05);
  --shadow-md: 0 2px 8px rgba(47, 93, 93, 0.08);
  --shadow-lg: 0 8px 24px rgba(47, 93, 93, 0.12);
}
```

## CSS Architecture

### Component Classes

| Component | Class | Description |
|-----------|-------|-------------|
| Header | `.header` | Sticky navigation bar |
| Footer | `.footer` | Site footer |
| Hero | `.hero` | Full-width hero section |
| Button Primary | `.btn--primary` | Gold CTA button |
| Button Secondary | `.btn--secondary` | Outline button |
| Card | `.card` | Content container |
| Form Field | `.form-group` | Input with label |
| Stats Grid | `.stats-grid` | Metric display |
| FAQ Item | `.faq-item` | Accordion Q&A |
| Widget | `.widget` | Dashboard widgets |
| Progress | `.progress-bar` | Progress bars |
| Quote Block | `.quote-block` | Inspirational quotes |

### Responsive Breakpoints

| Breakpoint | Screen Size | Target Device |
|------------|-------------|---------------|
| Default | 0 - 639px | Mobile |
| `sm` | 640px+ | Large mobile |
| `md` | 768px+ | Tablet |
| `lg` | 1024px+ | Desktop |
| `xl` | 1280px+ | Large Desktop |

## PWA Setup

1. Include the manifest in your HTML:
```html
<link rel="manifest" href="/manifest.json" />
```

2. Register the service worker:
```javascript
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/js/service-worker.js');
}
```

3. The `offline.html` page is served when users are offline.

## Smart Commands

Use these commands with an AI assistant to extend the toolkit:

| Command | Action |
|---------|--------|
| `Add page: X` | Create new page with SEO and structure |
| `Update component: X` | Regenerate specific module |
| `Continue` | Resume last interrupted build |
| `Export` | Package updated toolkit |
| `Rebuild flowchart` | Regenerate navigation SVG |
| `Scaffold components` | Generate all modules |
| `Start SEO` | Generate meta blocks |

## Export Formats

### Figma
Import `figma-component-map.json` for layer naming and component structure.

### Webflow
Use `webflow-export.json` as a reference for class naming and structure.

### Archive
`tglp-static-export.tar.gz` contains the complete toolkit (55 files, ~64KB).

## User Journey Flow

```
Landing → Onboarding → Homepage → CRM → Content → Q&A
                                    ↓
                              Blog → Profile → Settings
```

## Accessibility Features

- WCAG 2.1 AA compliant
- Skip-to-content link on all pages
- ARIA labels on interactive elements
- Alt text on all images
- Focus-visible states with gold ring
- Semantic HTML5 structure
- Keyboard navigation support
- `prefers-reduced-motion` support
- High contrast mode support
- Screen reader friendly navigation
- `data-testid` attributes for testing
- Color contrast 4.5:1+

## SEO Implementation

Each page includes:
- Unique `<title>` tag
- `<meta name="description">`
- Open Graph tags (`og:title`, `og:description`, `og:image`)
- Twitter Card tags
- JSON-LD structured data
- Canonical URL

See `seo-metadata.json` for complete SEO configuration.

## Component Annotations

### NavBar (`#navbar`)
```html
<header class="header" id="navbar" role="banner">
  <nav aria-label="Main navigation">
    <!-- Logo, nav links, auth buttons -->
  </nav>
</header>
```

### Hero Section (`#hero`)
```html
<section class="hero" id="hero" aria-labelledby="hero-title">
  <span class="hero__badge">Badge</span>
  <h1 id="hero-title">Headline</h1>
  <p class="hero__subtitle">Description</p>
  <div class="hero__actions">
    <a href="#" class="btn btn--primary">Primary CTA</a>
  </div>
</section>
```

### Card Component (`.card`)
```html
<article class="card" data-testid="card-feature">
  <div class="card__icon" aria-hidden="true">
    <svg><!-- Icon --></svg>
  </div>
  <h3 class="card__title">Feature Title</h3>
  <p class="card__description">Description text</p>
</article>
```

## Deployment

### Static Hosting
Upload all files to any static host (Netlify, Vercel, GitHub Pages).

### With Backend
Integrate with the React platform for full functionality.

## Regeneration

To regenerate or extend this design system:
1. Open `the-genuine-love-project.prompt`
2. Use with an AI assistant
3. Request specific pages or components

## Security Considerations

- No inline scripts
- External resources loaded via HTTPS
- Forms use semantic validation
- No sensitive data in frontend code

---

**The Genuine Love Project** — Live in Genuine Love
