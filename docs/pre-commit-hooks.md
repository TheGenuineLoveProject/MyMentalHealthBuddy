# Pre-Commit Hooks Setup (Optional)

## Overview

Pre-commit hooks help catch issues before code is committed. This is an optional enhancement.

## Quick Setup

```bash
# Install husky (if not already)
npm install --save-dev husky

# Initialize husky
npx husky init

# Add pre-commit hook
echo 'npm run content-check && npm run lint' > .husky/pre-commit
```

## Recommended Hooks

### Pre-Commit
```bash
#!/bin/sh
npm run content-check  # Tier compliance
npm run lint           # Code style
```

### Pre-Push
```bash
#!/bin/sh
npm run typecheck
npm run build
npm run test
```

## Manual Alternative

If you prefer not to use hooks, run before commits:
```bash
npm run verify
```

## CI Fallback

GitHub Actions runs all checks on push, providing a safety net even without local hooks.
