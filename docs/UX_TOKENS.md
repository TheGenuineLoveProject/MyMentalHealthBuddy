# The Genuine Love Project - UX Design Tokens

## Overview

This document defines the single source of truth for all visual design tokens. All components must use these tokens - **no raw hex values in components**.

---

## Color Palette

### Brand Colors
| Token | HSL | Usage |
|-------|-----|-------|
| `--sage-500` | `hsl(143, 25%, 65%)` | Primary action, success states |
| `--sage-600` | `hsl(143, 25%, 55%)` | Primary hover |
| `--sage-700` | `hsl(143, 25%, 45%)` | Primary active |
| `--blush-400` | `hsl(7, 70%, 85%)` | Accent, warmth |
| `--blush-500` | `hsl(7, 60%, 78%)` | Secondary accent |
| `--teal-600` | `hsl(175, 35%, 35%)` | Deep accent, headings |
| `--teal-700` | `hsl(175, 35%, 28%)` | Deep hover |
| `--gold-400` | `hsl(47, 82%, 57%)` | Highlights, premium |

### Semantic Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--glp-paper` | `#faf9f7` | Page background |
| `--glp-ink` | `#3a3a3a` | Primary text |
| `--glp-text-muted` | `#6b7280` | Secondary text |
| `--glp-border` | `#e5e7eb` | Borders, dividers |

### State Colors
| Token | Usage |
|-------|-------|
| `--success` | Positive feedback, confirmations |
| `--warning` | Caution states |
| `--error` | Error states, validation |
| `--info` | Informational messages |

---

## Typography

### Font Families
| Token | Value | Usage |
|-------|-------|-------|
| `--font-display` | `'Playfair Display', serif` | Headings, hero text |
| `--font-body` | `'Poppins', sans-serif` | Body text, UI |
| `--font-mono` | `'Fira Code', monospace` | Code, technical |

### Font Sizes
| Token | Size | Usage |
|-------|------|-------|
| `--text-xs` | `0.75rem` | Captions, labels |
| `--text-sm` | `0.875rem` | Small text |
| `--text-base` | `1rem` | Body text |
| `--text-lg` | `1.125rem` | Large body |
| `--text-xl` | `1.25rem` | Subheadings |
| `--text-2xl` | `1.5rem` | Section headings |
| `--text-3xl` | `1.875rem` | Page headings |
| `--text-4xl` | `2.25rem` | Hero headings |

### Font Weights
| Token | Value | Usage |
|-------|-------|-------|
| `--font-normal` | `400` | Body text |
| `--font-medium` | `500` | Emphasis |
| `--font-semibold` | `600` | Subheadings |
| `--font-bold` | `700` | Headings |

---

## Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | `0.25rem` | Tight spacing |
| `--space-2` | `0.5rem` | Small gaps |
| `--space-3` | `0.75rem` | Default gap |
| `--space-4` | `1rem` | Standard spacing |
| `--space-6` | `1.5rem` | Medium spacing |
| `--space-8` | `2rem` | Large spacing |
| `--space-12` | `3rem` | Section spacing |
| `--space-16` | `4rem` | Page sections |

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | `0.25rem` | Subtle rounding |
| `--radius-md` | `0.5rem` | Cards, inputs |
| `--radius-lg` | `0.75rem` | Buttons, dialogs |
| `--radius-xl` | `1rem` | Feature cards |
| `--radius-full` | `9999px` | Pills, avatars |

---

## Shadows

| Token | Usage |
|-------|-------|
| `--shadow-sm` | Subtle elevation |
| `--shadow-md` | Cards, dropdowns |
| `--shadow-lg` | Modals, popovers |
| `--shadow-xl` | Hero elements |

---

## Motion

### Durations
| Token | Value | Usage |
|-------|-------|-------|
| `--duration-fast` | `150ms` | Micro-interactions |
| `--duration-normal` | `200ms` | Standard transitions |
| `--duration-slow` | `300ms` | Complex animations |

### Easing
| Token | Value | Usage |
|-------|-------|-------|
| `--ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | Exit animations |
| `--ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Standard |

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Accessibility

### Focus States
All interactive elements must have visible focus:
```css
:focus-visible {
  outline: 2px solid var(--sage-500);
  outline-offset: 2px;
}
```

### Color Contrast
- Body text: minimum 4.5:1 ratio
- Large text: minimum 3:1 ratio
- Interactive elements: minimum 3:1 ratio

### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Focus order must be logical
- Skip links for main content

---

## Usage Rules

1. **No raw hex values** in component files
2. Use CSS variables: `var(--sage-500)`
3. Use Tailwind classes that map to tokens
4. Document any new tokens in this file
5. Test all color combinations for contrast
6. Include `:focus-visible` on all interactive elements
7. Respect `prefers-reduced-motion`
