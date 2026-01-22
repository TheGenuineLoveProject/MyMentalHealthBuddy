# The Genuine Love Project - Static HTML Export

## 📁 File Structure

```
static-export/
├── index.html          # Landing page (Homepage)
├── onboarding.html     # User onboarding flow
├── home.html           # Logged-in homepage/dashboard
├── crm.html            # Personal CRM dashboard
├── content.html        # Resource library
├── qa.html             # Community Q&A
├── login.html          # Authentication page
├── css/
│   ├── style.css       # Main stylesheet
│   └── responsive.css  # Responsive breakpoints
├── js/
│   └── main.js         # JavaScript interactions
├── images/
│   └── logo.svg        # Brand logo
└── README.md           # This file
```

## 🎨 Brand Colors

| Color      | Hex       | Usage                          |
|------------|-----------|--------------------------------|
| Sage       | `#8fbf9f` | Primary accent, success states |
| Rose       | `#f4c7c3` | Soft accents, warmth           |
| Teal       | `#2f5d5d` | Text, headers, deep accents    |
| Cream      | `#faf9f7` | Background                     |
| Charcoal   | `#3a3a3a` | Body text                      |
| Gold       | `#eac33b` | CTA buttons, highlights        |

## 🔤 Typography

- **Sans-serif:** Poppins (400, 500, 600, 700)
- **Serif:** Playfair Display (600, 700)

Fonts loaded via Google Fonts CDN.

## 📱 Responsive Breakpoints

| Breakpoint | Screen Size | Target Device    |
|------------|-------------|------------------|
| Default    | 0 - 767px   | Mobile           |
| `md`       | 768px+      | Tablet           |
| `lg`       | 992px+      | Desktop          |
| `xl`       | 1200px+     | Large Desktop    |

## ♿ Accessibility Features

- Skip-to-content link on all pages
- ARIA labels on interactive elements
- Semantic HTML5 structure
- Focus visible states with gold ring
- Reduced motion support
- High contrast mode support
- Screen reader friendly navigation
- `data-testid` attributes for testing

## 🔗 Page Flow

```
Landing (index.html)
    ↓
Onboarding (onboarding.html)
    ↓
Homepage (home.html)
    ↓
├── CRM Dashboard (crm.html)
├── Resources (content.html)
└── Community Q&A (qa.html)

Login (login.html) → Homepage (home.html)
```

## 🛠 Development Notes

### CSS Variables
All colors, shadows, and radii use CSS custom properties defined in `:root` for easy theming.

### Components
Reusable component classes:
- `.btn` - Buttons (variants: primary, secondary, outline)
- `.card` - Content cards
- `.widget` - Dashboard widgets
- `.form-input` - Form inputs
- `.progress` - Progress bars
- `.trust-badge` - Trust indicators
- `.quote-block` - Inspirational quotes

### Adding Pages
1. Copy an existing HTML file
2. Update the `<title>` and meta description
3. Set the active nav link with `.header__nav-link--active`
4. Add content inside `<main id="main-content">`

## 📦 Deployment

These static files can be deployed to any hosting platform:
- GitHub Pages
- Netlify
- Vercel
- AWS S3
- Traditional web hosting

Simply upload all files maintaining the directory structure.

## 🔒 Security Considerations

- No inline scripts
- External resources loaded via HTTPS
- Forms use semantic validation
- No sensitive data in frontend code

---

**The Genuine Love Project** - Live in Genuine Love 💚
