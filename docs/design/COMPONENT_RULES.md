# Component Styling Rules - The Genuine Love Project

## Buttons

### Primary Button
```css
.btn-premium {
  background: linear-gradient(135deg, var(--glp-sage-deep), #3A6B6B);
  color: var(--glp-paper);
  border-radius: var(--glp-radius-2);
  padding: 12px 24px;
  font-weight: 600;
  transition: all var(--glp-motion-fast) var(--glp-ease);
}
.btn-premium:focus {
  outline: none;
  ring: 2px solid var(--glp-gold);
}
```

### Secondary Button
```css
.btn-secondary-premium {
  background: transparent;
  border: 2px solid var(--glp-sage-deep);
  color: var(--glp-sage-deep);
}
```

### Ghost Button
```css
.btn-ghost {
  background: transparent;
  color: var(--glp-text);
}
```

## Inputs

### Standard Input
```css
.input-premium {
  border: 1px solid var(--glp-border);
  border-radius: var(--glp-radius-1);
  padding: 12px 16px;
  background: var(--glp-surface);
}
.input-premium:focus {
  border-color: var(--glp-sage-deep);
  ring: 2px solid var(--glp-gold);
}
.input-premium:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

## Cards

### Standard Card
```css
.card {
  background: var(--glp-surface);
  border-radius: var(--glp-radius-2);
  padding: 24px;
}

.card-bordered {
  border: 1px solid var(--glp-border);
}

.card-shadow {
  box-shadow: var(--glp-shadow-1);
}
```

### Glass Card
```css
.glass-premium {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```

## Links

### Standard Link
- Color: `var(--glp-sage-deep)` (Deep Teal)
- Hover: Underline
- Focus: Gold ring (2px)

### Navigation Link
- Color: `var(--glp-text)`
- Active: `var(--glp-sage-deep)`
- Hover: `var(--glp-sage-deep)`

## Icons

### Container Styles
```css
.icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--glp-radius-1);
}

.icon-soft-sage { background: rgba(143, 191, 159, 0.15); }
.icon-soft-gold { background: rgba(234, 195, 59, 0.15); }
.icon-soft-teal { background: rgba(47, 93, 93, 0.15); }
.icon-soft-blush { background: rgba(244, 199, 195, 0.15); }
```

## Focus States
All interactive elements MUST have visible focus:
- Ring: `2px solid var(--glp-gold)`
- Offset: `2px`
