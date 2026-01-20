# The Genuine Love Project - Design System

## Overview
This document defines the single source of truth for all visual design decisions across The Genuine Love Project platform.

## North Star Principles
- **Emotional tone**: Calm clarity + warmth + trust + safety
- **Cognitive load**: Predictable patterns, clear hierarchy, generous whitespace
- **Neurodivergent support**: Low-stimulation mode, reading focus mode, reduced motion support
- **Content alignment**: Copy + layout + visuals are consistent, non-shaming, non-clinical

---

## Token Architecture

### Layer 1: Core Palette Tokens
Located in: `client/src/styles/brand.css` and `client/src/index.css`

### Layer 2: Semantic Tokens

#### Background & Surface
| Token | Light Mode | Usage |
|-------|------------|-------|
| `--background` | #FDFCF9 (cream) | Page background |
| `--surface-1` | #FFFFFF | Primary cards |
| `--surface-2` | #F9F7F4 | Secondary surfaces |
| `--surface-3` | #F3F1ED | Tertiary/muted |

#### Text Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--text-primary` / `text-teal` | #2C5F5D | Headings, primary text |
| `--text-secondary` / `text-sage-600` | #6B8A7A | Body text, descriptions |
| `--text-muted` / `text-sage-400` | #A3B5A8 | Captions, hints |

#### Brand Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--sage-500` | #8FBF9F | Primary brand, CTAs |
| `--teal-500` | #2C5F5D | Headings, emphasis |
| `--gold-500` | #D4A84B | Accents, badges |
| `--blush-500` | #E8B4B8 | Warmth, hearts |

#### Functional Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--success` | #4CAF50 | Success states |
| `--warning` | #FF9800 | Warning states |
| `--danger` | #F44336 | Error states, crisis |

---

## Typography System

### Font Families
- **Primary**: Inter (system fallback: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif)
- **Display**: Playfair Display (optional accent for hero text)

### Type Scale
| Class | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| `.text-display-lg` | 2.25rem | 700 | 1.2 | Hero headings |
| `.text-display-md` | 1.875rem | 700 | 1.25 | Section headings |
| `.text-heading-lg` | 1.5rem | 600 | 1.3 | Card headings |
| `.text-heading-md` | 1.25rem | 600 | 1.35 | Subsections |
| `.text-heading-sm` | 1.125rem | 600 | 1.4 | Small headings |
| `.text-body-lg` | 1.125rem | 400 | 1.6 | Lead paragraphs |
| `.text-body` | 1rem | 400 | 1.6 | Body text |
| `.text-body-sm` | 0.875rem | 400 | 1.5 | Secondary text |
| `.text-caption` | 0.75rem | 400 | 1.4 | Captions, hints |
| `.text-lead` | 1.125rem | 400 | 1.6 | Intro paragraphs |

### Rules
- One H1 per page
- Reading surfaces: 60-75 character line length
- Body line-height: 1.55-1.75
- Headings use semantic tokens only

---

## Spacing System

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 0.25rem (4px) | Tight spacing |
| `space-2` | 0.5rem (8px) | Compact spacing |
| `space-3` | 0.75rem (12px) | Default padding |
| `space-4` | 1rem (16px) | Standard gap |
| `space-6` | 1.5rem (24px) | Section spacing |
| `space-8` | 2rem (32px) | Large spacing |

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | 0.375rem (6px) | Buttons, inputs |
| `radius-md` | 0.5rem (8px) | Cards |
| `radius-lg` | 0.75rem (12px) | Large cards |
| `radius-xl` | 1rem (16px) | Hero sections |
| `radius-full` | 9999px | Pills, avatars |

---

## Shadow System

| Token | Value | Usage |
|-------|-------|-------|
| `shadow-sm` | 0 1px 2px rgba(0,0,0,0.05) | Subtle elevation |
| `shadow-md` | 0 4px 6px rgba(0,0,0,0.07) | Cards |
| `shadow-lg` | 0 10px 15px rgba(0,0,0,0.1) | Modals, dropdowns |

---

## Theme Modes

### Default Mode
Standard warm, calming palette with full visual richness.

### Low-Stimulation Mode
- Reduced saturation (85% of default)
- Minimal decorative effects
- No animated orbs
- Simplified gradients

### Reading/Focus Mode
- Constrained content width (max 65ch)
- Higher line-height (1.75)
- Reduced peripheral elements
- Neutral background

---

## Component Classes

### Cards
- `.card-bordered` - Standard card with border
- `.card-elevated` - Card with shadow
- `.glass-premium` - Glassmorphism effect

### Icons
- `.icon-container` - Base icon wrapper
- `.icon-xs/sm/md/lg/xl` - Size variants
- `.icon-soft-sage/teal/gold/blush` - Soft background variants
- `.icon-gradient-sage/teal/gold/blush` - Gradient background variants

### Buttons
- `.btn-premium` - Primary CTA button
- `.btn-secondary` - Secondary action
- `.btn-ghost` - Minimal button

### Backgrounds
- `.hero-gradient` - Page hero background
- `.content-wrapper` - Content container with padding

---

## Accessibility Requirements

- Focus ring visible in all modes
- Color contrast ratio: 4.5:1 minimum for text
- All interactive elements have focus states
- `prefers-reduced-motion` support for all animations
- ARIA labels on icon-only buttons
- Semantic HTML structure

---

## Hard Bans (Build Fail Rules)

1. No raw hex colors outside token files
2. No non-scale font sizes/spacing in components
3. No ad-hoc shadows/blurs outside token set
4. No mixed icon systems (all Lucide React)

---

## Last Updated
January 2026
