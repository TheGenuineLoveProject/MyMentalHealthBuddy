# Wellness-Focused Icon Library

Calming, minimal SVG icons for The Genuine Love Project.

## Usage

```html
<!-- Inline SVG (recommended for color control) -->
<svg class="icon icon--sage" width="24" height="24">
  <use href="/assets/icons/heart.svg#icon"></use>
</svg>

<!-- As image -->
<img src="/assets/icons/heart.svg" alt="Heart icon" width="24" height="24" />

<!-- CSS background -->
.icon-heart { background-image: url('/assets/icons/heart.svg'); }
```

## CSS Styling

```css
.icon {
  width: 24px;
  height: 24px;
  stroke: currentColor;
  fill: none;
}

.icon--sage { color: #8fbf9f; }
.icon--teal { color: #2f5d5d; }
.icon--gold { color: #eac33b; }
.icon--rose { color: #f4c7c3; }
```

## Available Icons

| Icon | File | Use Case |
|------|------|----------|
| Heart | `heart.svg` | Love, compassion, self-care |
| Leaf | `leaf.svg` | Growth, nature, healing |
| Sun | `sun.svg` | Energy, positivity, new beginnings |
| Lotus | `lotus.svg` | Mindfulness, meditation, inner peace |
| Sparkle | `sparkle.svg` | Inspiration, magic, transformation |
| Brain | `brain.svg` | Mental wellness, cognition, therapy |
| Journal | `journal.svg` | Reflection, writing, self-discovery |
| Shield | `shield.svg` | Safety, protection, trust |
| Compass | `compass.svg` | Direction, purpose, guidance |
| Wave | `wave.svg` | Calm, flow, emotional balance |
| Moon | `moon.svg` | Rest, reflection, calm |
| Star | `star.svg` | Achievement, aspiration, hope |

## Design Specifications

- **Stroke width:** 1.5px
- **Viewbox:** 0 0 24 24
- **Style:** Outline (stroke-based)
- **Caps:** Round
- **Corners:** Round

## Accessibility

All icons should be used with:
- `aria-hidden="true"` for decorative icons
- Descriptive `alt` text for meaningful icons
- Sufficient color contrast (4.5:1 minimum)
