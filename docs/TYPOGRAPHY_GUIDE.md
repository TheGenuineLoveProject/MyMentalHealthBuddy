# The Genuine Love Project - Typography Guide

## Overview
This document establishes typography standards to ensure readability, accessibility, and emotional warmth across all platform text.

---

## Font Families

### Primary: Inter
- **Usage**: All UI text, body copy, navigation
- **Weights**: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
- **Fallback**: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif

### Display: Playfair Display (Optional)
- **Usage**: Hero headlines, special emphasis (sparingly)
- **Weights**: 600, 700
- **Note**: Use only for display-lg headlines when extra warmth desired

---

## Type Scale

### Display Text
| Class | Size | Weight | Line Height | Letter Spacing |
|-------|------|--------|-------------|----------------|
| `.text-display-lg` | 2.25rem (36px) | 700 | 1.2 | -0.02em |
| `.text-display-md` | 1.875rem (30px) | 700 | 1.25 | -0.015em |
| `.text-display-sm` | 1.5rem (24px) | 700 | 1.3 | -0.01em |

### Heading Text
| Class | Size | Weight | Line Height | Letter Spacing |
|-------|------|--------|-------------|----------------|
| `.text-heading-lg` | 1.5rem (24px) | 600 | 1.3 | -0.01em |
| `.text-heading-md` | 1.25rem (20px) | 600 | 1.35 | -0.005em |
| `.text-heading-sm` | 1.125rem (18px) | 600 | 1.4 | 0 |

### Body Text
| Class | Size | Weight | Line Height | Letter Spacing |
|-------|------|--------|-------------|----------------|
| `.text-lead` | 1.125rem (18px) | 400 | 1.6 | 0 |
| `.text-body-lg` | 1.125rem (18px) | 400 | 1.6 | 0 |
| `.text-body` | 1rem (16px) | 400 | 1.6 | 0 |
| `.text-body-sm` | 0.875rem (14px) | 400 | 1.5 | 0 |

### Utility Text
| Class | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| `.text-caption` | 0.75rem (12px) | 400 | 1.4 | Timestamps, hints |
| `.form-label` | 0.875rem (14px) | 500 | 1.4 | Form labels |
| `.form-hint` | 0.75rem (12px) | 400 | 1.4 | Helper text |

---

## Typography Rules

### Semantic Structure
1. **One H1 per page** - Always the page title
2. **Heading hierarchy** - Never skip levels (H1 → H2 → H3)
3. **Semantic HTML** - Use `<h1>` through `<h6>`, never style-only

### Readability Standards
1. **Line length**: 60-75 characters for reading content
2. **Body line-height**: 1.55-1.75 (1.6 default)
3. **Paragraph spacing**: 1.5em between paragraphs
4. **Heading spacing**: 1.25em above, 0.5em below

### Color Usage
| Element | Color Token | Notes |
|---------|-------------|-------|
| Display headings | `text-teal` | Always #2C5F5D |
| Section headings | `text-teal` | Can use teal-600 for emphasis |
| Body text | `text-sage-600` | #4A5D52 for optimal contrast |
| Muted text | `text-sage-400` | Only for large text (captions 12px+) |
| Links | `text-teal-600` | With underline on hover |

---

## Reading Mode Typography

When users enable Reading/Focus mode:

| Property | Default | Reading Mode |
|----------|---------|--------------|
| Max width | 100% | 65ch |
| Line height | 1.6 | 1.75 |
| Font size (base) | 16px | 18px |
| Letter spacing | 0 | 0.01em |
| Background | cream | white |

---

## Responsive Typography

### Mobile (< 640px)
| Class | Desktop | Mobile |
|-------|---------|--------|
| `.text-display-lg` | 2.25rem | 1.875rem |
| `.text-display-md` | 1.875rem | 1.5rem |
| `.text-heading-lg` | 1.5rem | 1.25rem |

### Implementation
```css
.text-display-lg {
  font-size: clamp(1.875rem, 4vw, 2.25rem);
}
```

---

## Text Utilities

### Alignment
- `.text-left` / `.text-center` / `.text-right`
- Use center sparingly (hero sections, CTAs)

### Truncation
- `.line-clamp-1/2/3` for multi-line truncation
- `.truncate` for single-line truncation

### Weight Modifiers
- `.font-normal` (400)
- `.font-medium` (500)
- `.font-semibold` (600)
- `.font-bold` (700)

---

## Brand Voice in Typography

### Calm & Supportive
- Avoid all-caps except for tiny badges
- No aggressive punctuation (!!!)
- Generous whitespace
- Warm, inviting headlines

### Non-Clinical Language
- "Wellness" not "treatment"
- "Support" not "therapy"
- "Journey" not "program"
- "Tools" not "interventions"

---

## Accessibility Requirements

1. **Minimum font size**: 14px for body, 12px for captions
2. **Contrast ratio**: 4.5:1 for normal text, 3:1 for large text
3. **Line height**: Never below 1.4
4. **Font weight**: Minimum 400 for body text
5. **Resize support**: Content readable at 200% zoom

---

## Anti-Patterns (Avoid)

- Raw pixel values in components
- Inline font-size styles
- Font families not in the approved list
- Line heights below 1.4
- Text over busy backgrounds without overlay
- Decorative fonts for body text

---

## Last Updated
January 2026
