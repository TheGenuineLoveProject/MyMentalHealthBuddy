# Tailwind Usage Guide - The Genuine Love Project

## Allowed Color Classes

### Semantic (Preferred)
```jsx
// Backgrounds
bg-bg          // Page background (Ivory)
bg-surface     // Card/modal (White)
bg-surface-2   // Alternate surface
bg-primary     // Deep Teal
bg-accent      // Gold (sparingly)

// Text
text-text      // Primary text (Charcoal)
text-text-muted // Secondary text
text-primary   // Deep Teal text
text-accent    // Gold (ONLY for accents, never body)

// Borders & Rings
border-border  // Standard border
ring-ring      // Focus ring (Gold)
```

### Palette (Legacy Support)
```jsx
// Teal scale
text-teal      // Primary teal
bg-teal-50     // Lightest teal
bg-teal-600    // Standard teal

// Sage scale
text-sage-600  // Sage text
bg-sage-100    // Light sage

// Gold (accent only)
text-gold-500  // Gold text (use sparingly)
bg-gold-100    // Light gold bg
```

## Typography Classes
```jsx
// Display
font-display text-tglp-title
font-display text-tglp-subtitle
font-display text-tglp-heading

// Body
font-sans text-tglp-body
font-sans text-body-lg

// Captions
text-tglp-caption
text-body-sm
```

## Component Classes
```jsx
// Cards
card card-bordered card-shadow
glass-premium

// Buttons
btn-premium
btn-secondary-premium
btn-ghost

// Icons
icon-container icon-md icon-soft-sage
icon-container icon-lg icon-gradient-sage

// Forms
input-premium
form-group form-label form-hint
```

## Layout Utilities
```jsx
// Content wrapper
content-wrapper  // max-width + padding

// Sections
section-y        // Vertical padding

// Hero background
hero-gradient    // Branded gradient
```

## Hover & Focus
```jsx
// Hovers
hover-lift       // Slight raise
hover-glow-gold  // Gold glow
hover-glow-sage  // Sage glow

// Focus (automatic with ring-ring)
focus:ring-2 focus:ring-ring
```

## Responsive
```jsx
// Standard breakpoints
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
```

## Forbidden Patterns
```jsx
// DO NOT use raw hex
bg-[#2F5D5D]  // ❌ Use bg-primary instead
text-[#EAC33B] // ❌ Use text-accent instead

// DO NOT use Gold for body text
<p className="text-gold-500">Body text</p> // ❌

// DO use semantic tokens
<p className="text-text">Body text</p> // ✅
```
