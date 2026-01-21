# Typography System - The Genuine Love Project

## Font Families

| Family | Usage | Stack |
|--------|-------|-------|
| **Playfair Display** | Display, headings | `font-display`, `font-serif` |
| **Inter** | Body, UI elements | `font-sans` |

## Type Scale (Canva-Style)

| Class | Size | Line Height | Usage |
|-------|------|-------------|-------|
| `text-tglp-title` | 56px | 1.15 | Hero headlines |
| `text-tglp-subtitle` | 36px | 1.2 | Section titles |
| `text-tglp-heading` | 32px | 1.25 | Page headings |
| `text-tglp-subheading` | 28px | 1.35 | Card headings |
| `text-tglp-section` | 24px | 1.35 | Section headers |
| `text-tglp-body` | 18px | 1.65 | Body text |
| `text-tglp-quote` | 20px | 1.6 | Quotes, pullouts |
| `text-tglp-caption` | 14px | 1.5 | Captions, meta |

## Semantic Classes

| Class | Application |
|-------|-------------|
| `text-display-xl` | 3.5rem display |
| `text-display-lg` | 2.25rem display |
| `text-heading-xl` | 2rem heading |
| `text-heading-lg` | 1.75rem heading |
| `text-heading-md` | 1.5rem heading |
| `text-heading-sm` | 1.25rem heading |
| `text-body-lg` | 1.125rem body |
| `text-body-md` | 1rem body |
| `text-body-sm` | 0.875rem body |

## Usage Rules

### Headings
```jsx
<h1 className="font-display text-tglp-title text-teal">Title</h1>
<h2 className="font-display text-tglp-heading text-teal">Heading</h2>
<h3 className="text-heading-md text-teal">Subheading</h3>
```

### Body Text
```jsx
<p className="text-body-lg text-[var(--glp-text)]">Body text</p>
<p className="text-body-sm text-[var(--glp-text-muted)]">Secondary</p>
```

### Max Reading Width
For long-form content, constrain width:
```jsx
<article className="max-w-prose mx-auto">
  {/* Content */}
</article>
```

## Color Rules
- Headings: Deep Teal (`text-teal`, `--glp-sage-deep`)
- Body: Charcoal (`--glp-text`, `--glp-ink`)
- Muted: Charcoal 72% (`--glp-text-muted`)
- Accent: Gold - ONLY for badges, links, underlines (never body)
