# Visual Doctor - Automated Visual System Audit

## Purpose
Enforces zero-drift visual consistency across The Genuine Love Project platform.

## Hard Gates (Build-Blocking)

### Gate C — VISUAL
Validation must pass with:
- 0 raw colors outside design tokens
- 0 mixed icon styles (Lucide React only)
- Reduced motion policy present and enforced
- All semantic tokens used correctly

## Audit Checkpoints

### 1. Color Token Enforcement
```bash
# Scan for raw hex colors in component files
grep -rn "#[0-9A-Fa-f]\{3,6\}" client/src/pages/ --include="*.jsx" --include="*.tsx"
grep -rn "#[0-9A-Fa-f]\{3,6\}" client/src/components/ --include="*.jsx" --include="*.tsx"
```

**Allowed Exceptions:**
- SVG gradient stops in visualization components
- Canvas drawing colors (user-selected palettes)
- Dynamic color mapping utilities

**Required Token Usage:**
- `text-sage-*` for text colors
- `bg-sage-*` for backgrounds
- `border-sage-*` for borders
- CSS variables: `var(--sage-*)`, `var(--gold-*)`, `var(--blush-*)`, `var(--teal-*)`

### 2. Icon Style Consistency
```bash
# Verify only Lucide React icons in use
grep -rn "from 'react-icons" client/src/pages/
grep -rn 'from "react-icons' client/src/pages/
```

**Rules:**
- Primary: Lucide React (`lucide-react`)
- Exception: `react-icons/si` for brand logos only
- No mixing FontAwesome, Heroicons, or other icon libraries

### 3. Reduced Motion Support
```bash
# Verify prefers-reduced-motion support
grep -rn "prefers-reduced-motion" client/src/
```

**Requirements:**
- All animations must respect `prefers-reduced-motion: reduce`
- Decorative animations disabled in reduced motion mode
- Essential feedback animations simplified, not removed

### 4. Semantic Token Mapping

| Surface | Token |
|---------|-------|
| Page background | `hero-gradient`, `bg-cream-50` |
| Card surface | `bg-white`, `card-bordered` |
| Primary text | `text-sage-800` |
| Secondary text | `text-sage-600` |
| Muted text | `text-sage-400` |
| Primary accent | `text-teal`, `bg-teal` |
| Borders | `border-sage-200` |
| Focus rings | `ring-sage-500` |

## Validation Commands

### Full Visual Audit
```bash
npm run visual:doctor
```

### Report-Only Mode (First Baseline)
```bash
npm run visual:doctor --report-only
```

### Hard-Fail Mode (Production)
```bash
npm run visual:doctor --strict
```

## Drift Detection

Build fails automatically if:
1. Raw hex/rgb/hsl colors found outside token files
2. Non-scale spacing/typography in components
3. Mixed icon library sources detected
4. New pages bypass component library

## Remediation Steps

1. **Raw Color Found:**
   - Replace with semantic token from `COLOR_SYSTEM.md`
   - Update component to use Tailwind class or CSS variable

2. **Mixed Icon Style:**
   - Replace with Lucide React equivalent
   - Document if brand logo requires `react-icons/si`

3. **Missing Reduced Motion:**
   - Add `motion-safe:` prefix to animations
   - Wrap in `@media (prefers-reduced-motion: no-preference)`

## Audit Log Format

```markdown
## Visual Doctor Audit - [DATE]

### Summary
- Files Scanned: [N]
- Violations Found: [N]
- Exceptions Documented: [N]

### Violations
| File | Line | Type | Details |
|------|------|------|---------|
| ... | ... | ... | ... |

### Exceptions (Documented)
| File | Reason | Approved |
|------|--------|----------|
| ... | ... | Yes |
```

## Integration with CI/CD

Add to build pipeline:
```yaml
- name: Visual Doctor
  run: npm run visual:doctor --strict
  continue-on-error: false
```

---
Last Updated: January 2026
