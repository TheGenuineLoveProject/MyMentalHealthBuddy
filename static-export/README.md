# The Genuine Love Project - Static Export

Developer-ready responsive design system and content structure for TheGenuineLoveProject.com.

## Quick Start

```bash
# Open in browser
open index.html

# Or serve locally
npx serve .
```

## File Structure

```
static-export/
├── index.html              # Landing page (entry point)
├── onboarding.html         # User onboarding flow
├── home.html               # Homepage dashboard
├── crm.html                # CRM/Wellness dashboard
├── content.html            # Content library
├── qa.html                 # Questions & Answers
├── login.html              # Authentication
├── css/
│   ├── style.css           # Main stylesheet (1137 lines)
│   └── responsive.css      # Responsive breakpoints
├── js/
│   └── main.js             # Interactive components
├── images/                 # Static assets
├── seo-metadata.json       # SEO configuration
├── flowchart.svg           # UI/UX flow diagram
├── design-system.prompt    # AI regeneration prompt
└── README.md               # This file
```

## Navigation Flow

```
Landing → Onboarding → Homepage → CRM → Content → Q&A → Login
   │                                                    ↑
   └────────────────────────────────────────────────────┘
```

## Brand Palette

| Color     | Hex       | Usage                           |
|-----------|-----------|----------------------------------|
| Sage      | `#8fbf9f` | Primary accent, nature elements  |
| Rose      | `#f4c7c3` | Soft highlights, warmth          |
| Deep Teal | `#2f5d5d` | Headlines, CTAs, trust           |
| Cream     | `#faf9f7` | Backgrounds, clean spaces        |
| Charcoal  | `#3a3a3a` | Body text, subtle elements       |
| Gold      | `#eac33b` | Premium, achievements, focus     |

## Typography

- **Sans-serif:** Poppins (400, 500, 600, 700) - Body text, UI elements
- **Serif:** Playfair Display (600, 700) - Headlines, elegant sections

Fonts loaded via Google Fonts CDN.

## CSS Architecture

### Variables
```css
:root {
  --sage: #8fbf9f;
  --rose: #f4c7c3;
  --teal: #2f5d5d;
  --cream: #faf9f7;
  --charcoal: #3a3a3a;
  --gold: #eac33b;
  --font-sans: 'Poppins', system-ui, sans-serif;
  --font-serif: 'Playfair Display', Georgia, serif;
}
```

### Component Classes

| Component       | Class                | Description               |
|-----------------|----------------------|---------------------------|
| Header          | `.header`            | Sticky navigation bar     |
| Footer          | `.footer`            | Site footer               |
| Hero            | `.hero`              | Full-width hero section   |
| Button Primary  | `.btn--primary`      | Gold CTA button           |
| Button Secondary| `.btn--secondary`    | Outline button            |
| Card            | `.card`              | Content container         |
| Form Field      | `.form-group`        | Input with label          |
| Stats Grid      | `.stats-grid`        | Metric display            |
| FAQ Item        | `.faq-item`          | Accordion Q&A             |
| Widget          | `.widget`            | Dashboard widgets         |
| Progress        | `.progress`          | Progress bars             |
| Quote Block     | `.quote-block`       | Inspirational quotes      |

### Responsive Breakpoints

| Breakpoint | Screen Size | Target Device    |
|------------|-------------|------------------|
| Default    | 0 - 639px   | Mobile           |
| `sm`       | 640px+      | Large mobile     |
| `md`       | 768px+      | Tablet           |
| `lg`       | 1024px+     | Desktop          |
| `xl`       | 1280px+     | Large Desktop    |

## Accessibility Features

- Skip-to-content link on all pages
- ARIA labels on interactive elements
- Alt text on all images
- Focus-visible states with gold ring
- Semantic HTML5 structure
- Keyboard navigation support
- Reduced motion support (`prefers-reduced-motion`)
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
    <a href="#" class="btn btn--secondary">Secondary CTA</a>
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

### Form Field (`.form-group`)
```html
<div class="form-group">
  <label for="email" class="form-label">Email</label>
  <input type="email" id="email" class="form-input" 
         placeholder="you@example.com" required />
</div>
```

## Adding Pages

1. Copy an existing HTML file
2. Update the `<title>` and meta description
3. Set the active nav link with `.header__nav-link--active`
4. Add content inside `<main id="main-content">`

## Export Options

### ZIP Package
All files are ready for:
- Static hosting (Netlify, Vercel, GitHub Pages)
- CMS integration (WordPress, Webflow)
- Framework migration (React, Vue, Angular)

### Figma Export Notes
- Use brand colors as color styles
- Typography: Playfair Display (headings), Poppins (body)
- 8px spacing grid
- Border radius: 8px (sm), 16px (md), 24px (lg)

### Webflow Class Mapping
| CSS Class        | Webflow Component    |
|------------------|----------------------|
| `.btn--primary`  | Button Primary       |
| `.btn--secondary`| Button Secondary     |
| `.card`          | Card Component       |
| `.hero`          | Hero Section         |
| `.header`        | Navbar               |
| `.footer`        | Footer               |

## Regeneration

To regenerate or extend this design system:
1. Open `design-system.prompt`
2. Use with an AI assistant
3. Request specific pages or components

## Security Considerations

- No inline scripts
- External resources loaded via HTTPS
- Forms use semantic validation
- No sensitive data in frontend code

---

**The Genuine Love Project** - Live in Genuine Love
