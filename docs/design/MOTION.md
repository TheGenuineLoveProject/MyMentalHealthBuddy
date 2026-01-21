# Motion & Animation - The Genuine Love Project

## Core Principles
1. **Gentle** - Subtle, non-distracting animations
2. **Purposeful** - Every animation serves UX function
3. **Accessible** - Respect `prefers-reduced-motion`
4. **Consistent** - Use tokenized timing values

## Duration Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--glp-motion-fast` | 140ms | Micro-interactions, hovers |
| `--glp-motion-med` | 220ms | Reveals, transitions |

## Easing
```css
--glp-ease: cubic-bezier(.2, .8, .2, 1);
```
Smooth, natural feel with slight overshoot.

## Keyframe Animations

### Fade In Up
```css
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fade-in-up 400ms var(--glp-ease) forwards;
}
```

### Fade In Scale
```css
@keyframes fade-in-scale {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
```

### Gentle Breathe (for decorative elements)
```css
@keyframes gentle-breathe {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.02); opacity: 0.8; }
}
```

## Hover Effects

| Class | Effect |
|-------|--------|
| `hover-lift` | translateY(-2px) on hover |
| `hover-glow-gold` | Gold box-shadow on hover |
| `hover-glow-sage` | Sage box-shadow on hover |

## Reduced Motion
All animations MUST respect user preferences:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Implementation Guidelines
1. Use `transition-all duration-fast ease-soft` for simple hovers
2. Use `animate-fade-in-up` for page/section entrances
3. Stagger animations with `animation-delay` for lists
4. Never animate layout properties (width, height) - use transform
