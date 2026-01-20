# The Genuine Love Project - Color System

## Overview
This document defines the complete color system for The Genuine Love Project platform, ensuring visual consistency and emotional alignment with our brand values.

---

## Brand Palette

### Primary Colors

#### Sage (Primary Brand)
| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `sage-50` | #F4F9F6 | 244, 249, 246 | Subtle backgrounds |
| `sage-100` | #E8F3ED | 232, 243, 237 | Light backgrounds |
| `sage-200` | #C9E2D4 | 201, 226, 212 | Borders, dividers |
| `sage-300` | #A8CFBA | 168, 207, 186 | Muted elements |
| `sage-400` | #8FBF9F | 143, 191, 159 | Secondary actions |
| `sage-500` | #5A8A6E | 90, 138, 110 | Primary brand |
| `sage-600` | #4A7A5E | 74, 122, 94 | Hover states |
| `sage-700` | #3A6A4E | 58, 106, 78 | Active states |

#### Teal (Headings & Emphasis)
| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `teal-500` | #2C5F5D | 44, 95, 93 | Primary headings |
| `teal-600` | #1E4F4D | 30, 79, 77 | Emphasis text |
| `teal-700` | #163F3D | 22, 63, 61 | Strong emphasis |

#### Gold (Accents & Badges)
| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `gold-50` | #FDF9F0 | 253, 249, 240 | Subtle warmth |
| `gold-100` | #FAF0DC | 250, 240, 220 | Light accents |
| `gold-200` | #F5E3C0 | 245, 227, 192 | Borders |
| `gold-500` | #D4A84B | 212, 168, 75 | Primary accent |
| `gold-600` | #C49A3D | 196, 154, 61 | Hover |

#### Blush (Warmth & Hearts)
| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `blush-50` | #FDF6F6 | 253, 246, 246 | Subtle warmth |
| `blush-100` | #FCECED | 252, 236, 237 | Light backgrounds |
| `blush-500` | #E8B4B8 | 232, 180, 184 | Hearts, love |
| `blush-600` | #D9A0A4 | 217, 160, 164 | Hover |

---

## Semantic Colors

### Background & Surface
| Token | Light Mode | Usage |
|-------|------------|-------|
| `background` | #FDFCF9 | Page background (warm cream) |
| `surface-1` | #FFFFFF | Primary cards, inputs |
| `surface-2` | #F9F7F4 | Secondary surfaces |
| `surface-3` | #F3F1ED | Tertiary, muted areas |

### Text Hierarchy
| Token | Value | Contrast | Usage |
|-------|-------|----------|-------|
| `text-primary` | #2C5F5D | 7.5:1 | Headings |
| `text-secondary` | #4A5D52 | 5.2:1 | Body text |
| `text-muted` | #6B8A7A | 3.8:1 | Captions (large only) |
| `text-hint` | #A3B5A8 | 2.5:1 | Decorative only |

### Functional States
| Token | Value | Usage |
|-------|-------|-------|
| `success` | #4CAF50 | Success messages, confirmations |
| `warning` | #FF9800 | Warnings, cautions |
| `danger` | #F44336 | Errors, crisis indicators |
| `info` | #2196F3 | Informational notices |

---

## Usage Rules

### Primary Color (Sage)
- CTAs and key highlights only
- Navigation active states
- Primary buttons
- Progress indicators

### Accent Color (Gold)
- Badges and awards
- Premium features
- Celebratory moments
- Subtle warmth accents

### Warning/Danger
- Only for true warnings, errors, or moderation
- Never decorative
- Always with supportive copy

### Focus Ring
- Visible in all modes
- Uses `--sage-500` with offset
- 2px solid with 2px offset

---

## Contrast Requirements

| Combination | Minimum Ratio | Status |
|-------------|---------------|--------|
| Text on background | 4.5:1 | Required |
| Large text on background | 3:1 | Required |
| Interactive elements | 3:1 | Required |
| Non-text elements | 3:1 | Required |

---

## Gradient Definitions

### Hero Gradient
```css
.hero-gradient {
  background: linear-gradient(
    135deg,
    #FDFCF9 0%,
    #F4F9F6 25%,
    #FDF6F6 50%,
    #FDF9F0 75%,
    #FDFCF9 100%
  );
}
```

### Icon Gradient (Sage)
```css
.icon-gradient-sage {
  background: linear-gradient(135deg, #8FBF9F 0%, #5A8A6E 100%);
}
```

### Icon Gradient (Gold)
```css
.icon-gradient-gold {
  background: linear-gradient(135deg, #F5E3C0 0%, #D4A84B 100%);
}
```

---

## Decorative Orbs

### Sage Orb
- Color: `rgba(143, 191, 159, 0.15)`
- Blur: 80px
- Usage: Top-left decorative

### Gold Orb
- Color: `rgba(212, 168, 75, 0.12)`
- Blur: 80px
- Usage: Top-right decorative

### Blush Orb
- Color: `rgba(232, 180, 184, 0.1)`
- Blur: 60px
- Usage: Accent decorative

---

## Theme Variations

### Low-Stimulation Mode
- Saturation reduced to 85%
- Decorative orbs hidden
- Gradients simplified to flat colors
- Gold accent muted

### Reading Mode
- Background: pure white (#FFFFFF)
- Reduced color variety
- Focus on text contrast only

---

## Last Updated
January 2026
