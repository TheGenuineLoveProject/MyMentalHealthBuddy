# The Genuine Love Project - Iconography Guide

## Overview
This document establishes icon standards to ensure visual consistency across the platform.

---

## Icon Library

### Primary Library: Lucide React
- **Source**: `lucide-react`
- **Style**: Stroke (outline) icons only
- **Stroke Width**: 2px (default)
- **License**: ISC (open source)

### Why Lucide React
- Consistent stroke style
- Comprehensive set (1000+ icons)
- React-optimized
- Tree-shakeable
- Active maintenance

---

## Icon Sizes

| Token | Size | Usage |
|-------|------|-------|
| `icon-xs` | 12x12px | Inline text, badges |
| `icon-sm` | 16x16px | Buttons, compact UI |
| `icon-md` | 20x20px | Standard UI elements |
| `icon-lg` | 24x24px | Navigation, cards |
| `icon-xl` | 32x32px | Page headers, features |
| `icon-2xl` | 48x48px | Hero sections, empty states |

---

## Icon Containers

### Soft Backgrounds
```jsx
<div className="icon-container icon-md icon-soft-sage">
  <Heart className="h-5 w-5" />
</div>
```

| Class | Background | Text Color |
|-------|------------|------------|
| `icon-soft-sage` | sage-100 | sage-600 |
| `icon-soft-teal` | teal-100 | teal-600 |
| `icon-soft-gold` | gold-100 | gold-600 |
| `icon-soft-blush` | blush-100 | blush-600 |

### Gradient Backgrounds
```jsx
<div className="icon-container icon-xl icon-gradient-sage">
  <Heart className="h-7 w-7" />
</div>
```

| Class | Gradient |
|-------|----------|
| `icon-gradient-sage` | sage-400 → sage-600 |
| `icon-gradient-teal` | teal-400 → teal-600 |
| `icon-gradient-gold` | gold-300 → gold-500 |
| `icon-gradient-blush` | blush-400 → blush-500 |

---

## Icon Usage by Context

### Navigation
| Context | Size | Container |
|---------|------|-----------|
| Primary nav | lg (24px) | None |
| Mobile nav | lg (24px) | None |
| Dropdown menu | md (20px) | None |
| User menu | md (20px) | None |

### Cards & Features
| Context | Size | Container |
|---------|------|-----------|
| Feature card | xl (32px) | gradient |
| Tool card | lg (24px) | soft |
| Stat card | lg (24px) | soft |
| List item | md (20px) | None |

### Page Headers
| Context | Size | Container |
|---------|------|-----------|
| Page title | xl (32px) | gradient |
| Section title | lg (24px) | None |
| Subsection | md (20px) | None |

### Forms & Inputs
| Context | Size | Container |
|---------|------|-----------|
| Input prefix | sm (16px) | None |
| Button icon | sm (16px) | None |
| Validation | sm (16px) | None |

---

## Core Icon Set

### Navigation
| Icon | Import | Usage |
|------|--------|-------|
| Home | `Home` | Dashboard |
| Heart | `Heart` | Wellness |
| MessageCircle | `MessageCircle` | Chat |
| Notebook | `Notebook` | Journal |
| Compass | `Compass` | Atlas |
| Settings | `Settings` | Settings |
| LogOut | `LogOut` | Logout |

### Wellness
| Icon | Import | Usage |
|------|--------|-------|
| Wind | `Wind` | Breathing |
| Moon | `Moon` | Meditation |
| Smile | `Smile` | Mood |
| Brain | `Brain` | Cognitive |
| Sparkles | `Sparkles` | Affirmations |
| Zap | `Zap` | Energy |

### Actions
| Icon | Import | Usage |
|------|--------|-------|
| Plus | `Plus` | Add |
| X | `X` | Close |
| Check | `Check` | Confirm |
| ChevronRight | `ChevronRight` | Navigate |
| ArrowLeft | `ArrowLeft` | Back |
| Save | `Save` | Save |
| Send | `Send` | Submit |

### Status
| Icon | Import | Usage |
|------|--------|-------|
| AlertTriangle | `AlertTriangle` | Warning |
| AlertCircle | `AlertCircle` | Error |
| CheckCircle | `CheckCircle` | Success |
| Info | `Info` | Info |
| Loader2 | `Loader2` | Loading |

---

## Icon Accessibility

### Requirements
1. Decorative icons: `aria-hidden="true"`
2. Interactive icons: Include `aria-label`
3. Status icons: Pair with text
4. Button icons: Visible focus state

### Examples

**Decorative icon:**
```jsx
<Heart className="h-5 w-5" aria-hidden="true" />
```

**Button with icon only:**
```jsx
<button aria-label="Close dialog">
  <X className="h-5 w-5" />
</button>
```

**Icon with text:**
```jsx
<button>
  <Save className="h-4 w-4" aria-hidden="true" />
  <span>Save Entry</span>
</button>
```

---

## Anti-Patterns (Avoid)

1. **Mixed icon libraries** - Only use Lucide React
2. **Inconsistent sizes** - Use token sizes only
3. **Filled icons** - Keep stroke style consistent
4. **Custom stroke widths** - Keep default 2px
5. **Icon-only buttons without labels** - Always add aria-label
6. **Decorative icons without aria-hidden** - Hide from screen readers

---

## Company Logos

For company/brand logos (social media, partners), use:
- **react-icons/si** - Company logos only
- Keep separate from UI icons
- Use brand colors when appropriate

```jsx
import { SiTwitter, SiInstagram } from "react-icons/si";
```

---

## Last Updated
January 2026
