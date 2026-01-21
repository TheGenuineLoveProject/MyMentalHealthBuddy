# Design Tokens - The Genuine Love Project

## Primary Brand Pair
| Token | Value | Usage |
|-------|-------|-------|
| `--glp-sage-deep` | #2F5D5D | Primary (Deep Teal) - headings, buttons, links |
| `--glp-gold` | #EAC33B | Accent/Ring - focus states, badges, underlines |

## Supporting Palette
| Token | Value | Usage |
|-------|-------|-------|
| `--glp-paper` | #FAF9F7 | Background (Ivory) |
| `--glp-ink` | #3A3A3A | Body text (Charcoal) |
| `--glp-sage` | #8FBF9F | Secondary accents (sparingly) |
| `--glp-blush` | #F4C7C3 | Soft accents (sparingly) |

## Semantic Tokens
| Token | Maps To | Purpose |
|-------|---------|---------|
| `--glp-bg` | --glp-paper | Page background |
| `--glp-surface` | #FFFFFF | Card/modal surfaces |
| `--glp-surface-2` | #F6F4F1 | Alternate surfaces |
| `--glp-text` | --glp-ink | Primary text |
| `--glp-text-muted` | rgba(ink, 0.72) | Secondary text |
| `--glp-primary` | --glp-sage-deep | Primary actions |
| `--glp-primary-foreground` | --glp-paper | Text on primary |
| `--glp-accent` | --glp-gold | Accent elements |
| `--glp-border` | rgba(ink, 0.12) | Borders |
| `--glp-ring` | --glp-gold | Focus rings |

## Layout Tokens
| Token | Value | Purpose |
|-------|-------|---------|
| `--glp-radius-1` | 12px | Small elements |
| `--glp-radius-2` | 16px | Larger elements |
| `--glp-shadow-1` | 0 6px 20px... | Standard shadow |
| `--glp-shadow-2` | 0 10px 32px... | Elevated shadow |
| `--glp-motion-fast` | 140ms | Quick transitions |
| `--glp-motion-med` | 220ms | Standard transitions |
| `--glp-ease` | cubic-bezier(.2,.8,.2,1) | Easing curve |

## Usage Rules
1. **No raw hex in components** - always use `var(--glp-*)` or Tailwind mappings
2. **Gold is accent only** - never for body text
3. **Deep Teal for primary** - headings, CTAs, links
4. **Respect modes** - tokens adapt to low-stim/reading automatically
