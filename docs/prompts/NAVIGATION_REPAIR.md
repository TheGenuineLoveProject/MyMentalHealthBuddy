# Navigation Repair - Link Integrity & IA Enforcement

## Purpose
Ensures zero broken internal links and consistent navigation patterns across The Genuine Love Project platform.

## Hard Gates (Build-Blocking)

### Gate B — NAV
Validation must pass with:
- 0 broken internal links
- Correct Wouter routing patterns
- Accessible navigation (aria-current, keyboard, focus)
- Canonical IA documented
- 404 + redirect plan documented

## Navigation Architecture

### Primary Navigation Structure
```
/                     → Landing (public)
/login                → Authentication
/register             → User registration
/dashboard            → User home (protected)
/journal              → Mirror API journaling
/chat                 → AI companion
/wellness             → Wellness tools hub
/premium              → Premium features
/pricing              → Subscription plans
/settings             → User preferences
/admin                → Admin dashboard (admin only)
```

### Route Categories

| Category | Pattern | Auth Required |
|----------|---------|---------------|
| Public | `/`, `/pricing`, `/login`, `/register` | No |
| Protected | `/dashboard`, `/journal`, `/chat`, `/wellness` | Yes |
| Premium | `/premium/*` | Yes + Subscription |
| Admin | `/admin/*` | Yes + Admin Role |

## Audit Checkpoints

### 1. Link Validation
```bash
# Find all internal links
grep -rn 'href="/' client/src/
grep -rn "to='/" client/src/
grep -rn 'to="/' client/src/
```

**Validation Rules:**
- All `href="/"` patterns must point to existing routes
- All `<Link to="/">` must use Wouter Link component
- No hardcoded localhost or domain-specific URLs

### 2. Route Registration
```bash
# Verify routes in App.tsx
grep -n "Route" client/src/App.tsx
```

**Requirements:**
- Every navigable page registered in router
- Fallback 404 route present
- Protected routes wrapped in auth check

### 3. Accessibility Patterns

**Required Attributes:**
- `aria-current="page"` on active nav items
- `role="navigation"` on nav containers
- Skip link: `<a href="#main-content" class="sr-only focus:not-sr-only">`
- Focus visible on all interactive elements

### 4. 404 Page Requirements
- Location: `client/src/pages/NotFound.jsx`
- Calm, supportive messaging
- Recovery links to dashboard/home
- Search suggestion (if applicable)

## Validation Commands

### Full Navigation Audit
```bash
npm run nav:doctor
```

### Link Check Only
```bash
npm run nav:doctor --links-only
```

### Accessibility Check
```bash
npm run nav:doctor --a11y
```

## Common Issues & Fixes

### 1. Broken Link
```jsx
// BAD: Route doesn't exist
<Link to="/nonexistent">Click</Link>

// GOOD: Verified route
<Link to="/dashboard">Dashboard</Link>
```

### 2. Missing Wouter Import
```jsx
// BAD: Using anchor for internal nav
<a href="/dashboard">Dashboard</a>

// GOOD: Using Wouter Link
import { Link } from "wouter";
<Link to="/dashboard">Dashboard</Link>
```

### 3. Hardcoded Domain
```jsx
// BAD: Hardcoded domain
<a href="https://example.com/api/data">Data</a>

// GOOD: Relative path or env variable
<a href="/api/data">Data</a>
```

### 4. Missing aria-current
```jsx
// BAD: No active state indication
<Link to="/dashboard">Dashboard</Link>

// GOOD: With active indication
<Link to="/dashboard" aria-current={isActive ? "page" : undefined}>
  Dashboard
</Link>
```

## Redirect Plan

| Old Path | New Path | Reason |
|----------|----------|--------|
| (none currently) | - | - |

**Note:** Document all route changes here before implementation.

## Audit Log Format

```markdown
## Nav Doctor Audit - [DATE]

### Summary
- Routes Checked: [N]
- Links Validated: [N]
- Broken Links: [N]
- A11y Issues: [N]

### Broken Links
| File | Line | Link | Issue |
|------|------|------|-------|
| ... | ... | ... | ... |

### A11y Issues
| File | Line | Issue | Fix |
|------|------|-------|-----|
| ... | ... | ... | ... |
```

## Integration with CI/CD

```yaml
- name: Nav Doctor
  run: npm run nav:doctor --strict
  continue-on-error: false
```

---
Last Updated: January 2026
