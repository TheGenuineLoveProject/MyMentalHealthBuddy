# Icon System - The Genuine Love Project

## Icon Library
**Primary:** lucide-react (MIT licensed, consistent outline style)

## Standard Specifications
| Property | Value |
|----------|-------|
| Style | Outline (stroke-based) |
| Stroke Width | 2px (default) |
| Caps | Round |
| Default Size | 24px |
| Color | Inherit from parent |

## Size Scale

| Class | Size | Usage |
|-------|------|-------|
| `icon-xs` | 12px | Inline badges |
| `icon-sm` | 16px | Compact UI |
| `icon-md` | 20px | Standard UI |
| `icon-lg` | 24px | Feature icons |
| `icon-xl` | 32px | Hero sections |

## Container Styles

### Soft Backgrounds
```jsx
<div className="icon-container icon-md icon-soft-sage">
  <Heart className="w-5 h-5" />
</div>
```

| Class | Background |
|-------|------------|
| `icon-soft-sage` | rgba(143, 191, 159, 0.15) |
| `icon-soft-teal` | rgba(47, 93, 93, 0.15) |
| `icon-soft-gold` | rgba(234, 195, 59, 0.15) |
| `icon-soft-blush` | rgba(244, 199, 195, 0.15) |

### Gradient Backgrounds
```jsx
<div className="icon-container icon-lg icon-gradient-sage">
  <Sparkles className="w-6 h-6 text-white" />
</div>
```

| Class | Gradient |
|-------|----------|
| `icon-gradient-sage` | Deep Teal gradient |
| `icon-gradient-gold` | Gold gradient |

## Color Usage
- **Default:** Inherit (usually charcoal)
- **Primary actions:** Deep Teal
- **Accent/Featured:** Gold (sparingly)
- **On dark backgrounds:** White

## Accessibility
- All icon buttons MUST have `aria-label`
- Decorative icons use `aria-hidden="true"`
- Interactive icons need focus states

## Example Usage
```jsx
import { Heart, Sparkles, Settings } from "lucide-react";

// Standard icon
<Heart className="w-5 h-5 text-teal" />

// Icon button
<button aria-label="Settings">
  <Settings className="w-5 h-5" />
</button>

// Featured icon with container
<div className="icon-container icon-lg icon-gradient-sage">
  <Sparkles className="w-6 h-6 text-white" aria-hidden="true" />
</div>
```

## Favicon & OG Images
- `/client/public/brand/favicon.svg` - Vector favicon
- `/client/public/brand/logo.png` - Logo
- OG image: 1200x630px recommended
