# Tier Policy

## Allowed Tier Values

The platform uses exactly three content tiers:

| Tier | Display Name | Description |
|------|--------------|-------------|
| `beginner` | Beginner | Foundational concepts, gentle language |
| `intermediate` | Intermediate | Standard depth, balanced complexity |
| `advanced` | Advanced | Deep exploration, nuanced content |

## Banned Terminology

The following terms are **BANNED** and must never appear in:
- UI labels
- API responses
- Documentation
- Seed data
- Code comments

### Banned Terms
- "reading level"
- "reading_level"
- "readingLevel"
- "grade level"
- "grade_level"
- "age level"

## Legacy Mapping

If the database uses a `reading_level` column:

1. **DO NOT** rename the column (breaking change)
2. **DO** map at the API boundary:

```javascript
function mapToTier(readingLevel) {
  const mapping = {
    'beginner': 'Beginner',
    'intermediate': 'Intermediate',
    'advanced': 'Advanced',
    '1': 'Beginner',
    '2': 'Intermediate',
    '3': 'Advanced'
  };
  return mapping[String(readingLevel).toLowerCase()] || 'Intermediate';
}
```

3. **UI NEVER shows** `reading_level` — only the mapped tier

## Verification

Run content compliance check:

```bash
npm run content-check
```

This will:
- Scan all source files for banned terms
- Verify tier values are valid
- Report any violations

## Enforcement

- Pre-commit hook: `npm run content-check`
- CI pipeline: Fails build on violations
- Code review: Reject PRs with banned terms
