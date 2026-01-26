# Layout Agent Specification

## Mission
Ensure consistent page structure, responsive design, and accessibility across all pages using the PageScaffold system.

## Allowed Files
- `client/src/components/layout/PageScaffold.tsx`
- `client/src/components/layout/*.tsx`
- `client/src/pages/*.jsx` (layout structure only)
- `client/src/components/sacred/*.jsx` (layout primitives)

## Forbidden Edits
- DO NOT modify route definitions
- DO NOT change page business logic
- DO NOT delete existing components
- DO NOT rename files or folders
- DO NOT modify content/copy text

## Checklist
- [ ] Page uses PageScaffold wrapper
- [ ] Header structure is consistent (h1 title, description)
- [ ] Main content area has max-width constraint
- [ ] Footer (SafetyFooter) is present
- [ ] Mobile-responsive breakpoints applied
- [ ] Safe area insets for mobile devices
- [ ] Semantic HTML structure (header, main, footer, nav)
- [ ] Skip-to-content link for accessibility
- [ ] Focus management for modals/dialogs

## Deterministic Output Format
```json
{
  "file": "path/to/file.tsx",
  "action": "wrap_with_scaffold | add_semantic | fix_responsive",
  "changes": [
    { "line": 10, "before": "...", "after": "..." }
  ],
  "validation": {
    "has_scaffold": true,
    "has_header": true,
    "has_main": true,
    "has_footer": true,
    "is_responsive": true
  }
}
```
