# The Genuine Love Project - AI Assistant Platform Perfection Prompt

## Purpose
This comprehensive prompt guides AI assistants in maintaining and enhancing The Genuine Love Project's visual design system, ensuring 360-degree consistency across all platform components.

---

## Platform Visual Identity

### Brand Philosophy
The Genuine Love Project is a trauma-informed mental wellness platform. All visual design must:
- Feel warm, safe, and welcoming
- Reduce cognitive load and visual stress
- Support emotional regulation through calm aesthetics
- Maintain professional credibility while being approachable
- Prioritize accessibility for all users

### Core Color Palette

**Primary Colors:**
- **Deep Teal** (`#2A5454`): Primary brand color, trust, stability
- **Gold** (`#D4AF37`): Accent, warmth, premium feel
- **Sage** (`#7FB39A`): Secondary, growth, healing
- **Blush** (`#E8A9A3`): Tertiary, compassion, softness
- **Ivory** (`#FAF9F6`): Background, calm, clean
- **Charcoal** (`#3B3B3B`): Text, grounding

**Color Usage Rules:**
1. Never use pure black (`#000`) or pure white (`#FFF`) - use Charcoal and Ivory instead
2. Teal is for primary actions, headings, and brand elements
3. Gold is for highlights, accents, and premium features
4. Sage is for positive feedback, success states, and nature themes
5. Blush is for gentle warnings and emotional content
6. Always provide sufficient contrast (WCAG AA minimum)

---

## Typography System

### Font Families
- **Playfair Display**: Headlines, display text, quotes
- **Inter**: Body text, UI elements, navigation

### Typography Hierarchy
```
.text-display-xl   - Hero headlines (clamp 2.5-4.5rem)
.text-display-lg   - Page titles (clamp 2-3.5rem)
.text-display-md   - Section headers (clamp 1.75-2.75rem)
.text-display-sm   - Subsection titles (clamp 1.5-2.25rem)
.text-heading-xl   - Large headings (clamp 1.5-2rem)
.text-heading-lg   - Medium headings (clamp 1.25-1.5rem)
.text-heading-md   - Small headings (1.125rem)
.text-heading-sm   - Mini headings (1rem)
.text-body-lg      - Lead paragraphs (1.125rem)
.text-body         - Standard body (1rem)
.text-body-sm      - Small body (0.875rem)
.text-caption      - Labels, captions (0.75rem, uppercase)
.text-small        - Fine print (0.8125rem)
.text-micro        - Tiny text (0.6875rem)
```

### Typography Rules
1. Never use more than 3 font sizes on a single screen
2. Maintain consistent line heights: headings (1.1-1.3), body (1.6-1.7)
3. Use negative letter-spacing for display text (-0.02em to -0.03em)
4. Prefer sentence case over ALL CAPS except for badges/labels
5. Ensure minimum 16px base size for mobile readability

---

## Alignment & Layout System

### Content Width Constraints
```
.content-max-xs  - 24rem (384px) - Narrow forms, modals
.content-max-sm  - 32rem (512px) - Cards, dialogs
.content-max-md  - 48rem (768px) - Articles, content
.content-max-lg  - 64rem (1024px) - Standard pages
.content-max-xl  - 80rem (1280px) - Wide layouts
.content-wrapper - 72rem with responsive padding
```

### Flex Utilities
```
.flex-center      - Center both axes
.flex-between     - Space between, vertically centered
.flex-start       - Align to start
.flex-end         - Align to end
.flex-col-center  - Column, centered
.flex-wrap-center - Wrap with center alignment
```

### Grid Utilities
```
.grid-center      - Place items center
.grid-cols-auto   - Auto-fit, min 280px
.grid-cols-cards  - Auto-fill, min 300px
.grid-features    - Auto-fit, min 240px
```

### Spacing Scale
```
.gap-2xs  - 0.25rem (4px)
.gap-xs   - 0.5rem (8px)
.gap-sm   - 0.75rem (12px)
.gap-md   - 1rem (16px)
.gap-lg   - 1.5rem (24px)
.gap-xl   - 2rem (32px)
.gap-2xl  - 3rem (48px)
.gap-3xl  - 4rem (64px)
```

### Alignment Rules
1. Always center hero content both horizontally and vertically
2. Use `content-wrapper` for all main content areas
3. Cards should have consistent internal padding (1.5rem standard)
4. Maintain 8px grid alignment (multiples of 0.5rem)
5. Section padding: small (2rem), default (3rem), large (4rem), xl (6rem)

---

## Icon System

### Icon Sizes
```
.icon-2xs  - 0.875rem (14px)
.icon-xs   - 1rem (16px)
.icon-sm   - 1.25rem (20px)
.icon-md   - 1.5rem (24px)
.icon-lg   - 1.75rem (28px)
.icon-xl   - 2rem (32px)
.icon-2xl  - 2.5rem (40px)
.icon-3xl  - 3rem (48px)
```

### Icon Container Variants
```
.icon-container          - Base flexbox container
.icon-gradient-sage      - Sage gradient background
.icon-gradient-teal      - Teal gradient background
.icon-gradient-gold      - Gold gradient background
.icon-gradient-blush     - Blush gradient background
.icon-soft-sage          - Subtle sage background
.icon-soft-teal          - Subtle teal background
.icon-soft-gold          - Subtle gold background
.icon-soft-blush         - Subtle blush background
```

### Icon Rules
1. Always use Lucide React icons for consistency
2. Match icon size to surrounding text (body: sm/md, headings: lg/xl)
3. Icon containers should have hover scale effects
4. Use gradient variants for primary actions
5. Use soft variants for secondary/informational content
6. Always include `aria-hidden="true"` for decorative icons

---

## Button System

### Button Variants
```
.btn-premium           - Primary gradient button (teal)
.btn-secondary-premium - White button with teal border
.btn-ghost             - Text-only transparent button
```

### Button Sizes
```
.btn-sm  - Compact (0.5rem 1rem padding)
.btn     - Standard (0.75rem 1.25rem padding)
.btn-lg  - Large (1rem 2rem padding)
```

### Button Rules
1. Primary actions use `.btn-premium`
2. Secondary actions use `.btn-secondary-premium`
3. Tertiary/navigation actions use `.btn-ghost`
4. Always include hover states with translateY(-2px)
5. Include focus ring for accessibility
6. Icons inside buttons should be 4-5px smaller than text

---

## Card System

### Card Variants
```
.card-elevated  - White with subtle shadow
.card-premium   - Gradient background with glow
.glass-card     - Frosted glass effect
.stat-card      - Statistics display
.quick-action   - Interactive action cards
```

### Card Rules
1. All cards have 1rem border-radius minimum
2. Cards should lift on hover (translateY(-4px))
3. Use subtle borders (rgba with 0.1-0.15 opacity)
4. Shadow intensity increases on hover
5. Internal padding: 1.5rem standard, 1.25rem compact

---

## Animation System

### Available Animations
```
.animate-fade-in-up     - Fade in from below
.animate-fade-in-scale  - Fade in with scale
.animate-glow-pulse     - Pulsing glow effect
.animate-bounce-subtle  - Gentle bounce
```

### Delays
```
.delay-100 through .delay-500 (100ms increments)
```

### Animation Rules
1. Use subtle animations - never jarring or fast
2. Duration: 0.2s-0.6s for most transitions
3. Always support `prefers-reduced-motion`
4. Stagger entrance animations with 100-200ms delays
5. Hover effects should be instant (0.2s max)

---

## Dark Mode Requirements

Every visual component must have explicit dark mode variants:

1. **Backgrounds**: Use rgba with low opacity over dark base
2. **Text**: Invert semantic colors (brand → teal-300, etc.)
3. **Borders**: Reduce opacity further in dark mode
4. **Shadows**: Increase opacity for dark backgrounds
5. **Cards**: Use semi-transparent dark backgrounds
6. **Icons**: Lighten color variants for visibility

### Dark Mode Tokens
```css
.dark .text-brand { color: var(--teal-300); }
.dark .text-accent { color: var(--gold-400); }
.dark .card-elevated { background: rgba(30, 42, 42, 0.95); }
.dark .glass-card { background: rgba(30, 42, 42, 0.8); }
```

---

## Accessibility Requirements

### WCAG Compliance
1. Minimum contrast ratio: 4.5:1 for body text, 3:1 for large text
2. All interactive elements must have visible focus states
3. Touch targets minimum 44x44px
4. Skip-to-content link on all pages
5. Proper heading hierarchy (no skipping levels)

### ARIA Patterns
```jsx
// Icons
<Icon aria-hidden="true" />

// Interactive elements
<button aria-label="Close modal" data-testid="button-close">

// Landmarks
<nav aria-label="Main navigation">
<main id="main-content">
<footer role="contentinfo">
```

### Focus Management
```css
.focus-ring {
  outline: 2px solid var(--gold-400);
  outline-offset: 2px;
}
```

---

## Test ID Conventions

All interactive and meaningful elements need `data-testid`:

### Pattern
```
Interactive: {action}-{target}
Display: {type}-{content}
Dynamic: {type}-{description}-{id}
```

### Examples
```jsx
data-testid="button-submit"
data-testid="link-home"
data-testid="input-email"
data-testid="text-username"
data-testid="card-feature-privacy"
data-testid="mood-entry-${index}"
```

---

## Component Checklist

When creating or modifying components, verify:

- [ ] Uses design token CSS variables (no hardcoded colors)
- [ ] Has responsive typography (clamp or fluid sizing)
- [ ] Includes hover/focus states
- [ ] Has dark mode variant
- [ ] Includes appropriate data-testid
- [ ] Icons have aria-hidden when decorative
- [ ] Interactive elements have aria-labels
- [ ] Follows 8px grid alignment
- [ ] Uses standard spacing scale
- [ ] Maintains consistent border-radius
- [ ] Has smooth transitions (0.2s ease)
- [ ] Supports prefers-reduced-motion

---

## File Structure

### Style Files
- `client/src/index.css` - Main styles and utilities
- `client/src/styles/brand-tokens.css` - CSS custom properties
- `client/src/styles/tokens.css` - Semantic tokens
- `client/src/styles/brand.css` - Brand-specific components

### Key Components
- `client/src/components/BrandShell.jsx` - Main layout wrapper
- `client/src/components/ui/IconBadge.jsx` - Icon container component
- `client/src/components/SEO.tsx` - Meta tag management

---

## Quality Assurance

### Visual Doctor Script
```bash
npm run visual:doctor
```
Scans for raw hex colors, font violations, and inline style issues.

### Navigation Audit Script
```bash
npm run nav:audit
```
Validates all internal links and routes.

### Combined Audit
```bash
npm run audit
```
Runs both visual doctor and navigation audit.

---

## January 2026 Enhancements

### Consolidated Design System
- All button classes consolidated in ENHANCED BUTTON SYSTEM section
- All card classes consolidated in ENHANCED CARD SYSTEM section
- All typography classes consolidated in ENHANCED TYPOGRAPHY SYSTEM section
- Duplicate definitions removed for cleaner, predictable styling

### Extended Color Palettes
New 50-900 shade variants for brand colors:
```
--sage-50 through --sage-900
--blush-50 through --blush-900
--teal-50 through --teal-900 (existing)
--gold-50 through --gold-900 (existing)
```

### Comprehensive Dark Mode
All enhanced components now have proper `.dark` variants:
- `.dark .card-elevated` - Dark card backgrounds with proper borders
- `.dark .btn-premium` - Adjusted shadows for dark mode
- `.dark .btn-secondary-premium` - Inverted colors for dark backgrounds
- `.dark .glass-card` - Semi-transparent dark glass effect
- `.dark .stat-card` - Dark statistics cards

---

## Summary

The Genuine Love Project's visual system prioritizes:

1. **Warmth** - Soft, healing color palette with extended shade ranges
2. **Clarity** - Clean typography hierarchy with responsive fluid sizing
3. **Consistency** - Systematic spacing, alignment, and consolidated class definitions
4. **Accessibility** - WCAG AA compliance with focus states and screen reader support
5. **Performance** - Efficient CSS utilities with single source of truth
6. **Maintainability** - Token-based design system with comprehensive dark mode support

Always design with empathy, remembering that users may be in vulnerable emotional states. The interface should feel like a safe, supportive space for reflection and growth.
