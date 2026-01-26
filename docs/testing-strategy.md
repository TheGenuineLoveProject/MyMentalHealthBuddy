# Testing Strategy

## Overview

This document outlines the testing approach for The Genuine Love Project platform. We use a multi-layered testing strategy to ensure reliability and quality.

## Test Pyramid

```
        ┌───────────┐
        │   E2E     │  <- Critical user journeys
        ├───────────┤
        │Integration│  <- API flows, DB operations
        ├───────────┤
        │   Unit    │  <- Utils, pure functions
        └───────────┘
```

## Test Categories

### Unit Tests (`tests/unit/`)

Test individual functions and utilities in isolation.

**Coverage Targets:**
- Utility functions: 100%
- Pure business logic: 90%
- Data transformations: 90%

**Examples:**
- `logRedaction.test.mjs` - PII redaction utilities
- `metrics.test.mjs` - Metrics recording functions

### Integration Tests (`tests/`)

Test API endpoints and database operations.

**Coverage Targets:**
- Auth flows: 100%
- CRUD operations: 90%
- Error handling: 80%

**Examples:**
- `auth.test.mjs` - Authentication flows
- `api.test.mjs` - API endpoint tests
- `journal.test.mjs` - Journal CRUD

### E2E Tests (Future)

Test critical user journeys through the full stack.

**Priority Journeys:**
1. User registration → onboarding → first journal
2. Login → journal entry → mood check-in
3. Subscription → payment → access gated content
4. Crisis detection → resource display

## Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm run test:auth

# Run unit tests only
vitest run tests/unit/

# Run with coverage
vitest run --coverage
```

## Database Test Strategy

Tests use transaction rollback for isolation:

```javascript
beforeEach(async () => {
  await db.execute("BEGIN");
});

afterEach(async () => {
  await db.execute("ROLLBACK");
});
```

## Contract Testing

API responses are validated against Zod schemas:

```javascript
const responseSchema = z.object({
  ok: z.boolean(),
  data: UserSchema,
});

expect(() => responseSchema.parse(response)).not.toThrow();
```

## Accessibility Testing

Use axe-core for automated a11y checks:

```javascript
import { axe } from "axe-core";

const results = await axe(document);
expect(results.violations).toHaveLength(0);
```

## Test Data Management

- Use factories for test data generation
- Never use production data in tests
- Clean up after each test suite

## CI Integration

Tests run in GitHub Actions:

```yaml
- name: Run tests
  run: npm test
  env:
    NODE_ENV: test
    DATABASE_URL: ${{ secrets.TEST_DATABASE_URL }}
```

## Coverage Targets

| Category | Target | Current |
|----------|--------|---------|
| Overall | 80% | TBD |
| Critical paths | 90% | TBD |
| Utils | 100% | TBD |

## Best Practices

1. **Isolation**: Each test should be independent
2. **Determinism**: No flaky tests allowed
3. **Speed**: Unit tests < 100ms, integration < 2s
4. **Clarity**: Test names describe behavior
5. **Maintenance**: Update tests with code changes
