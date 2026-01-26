# End-to-End Testing Guide

## Overview

E2E tests verify critical user journeys through the full application stack.

## Tools

### Playwright (Recommended)

```bash
# Install
npm install -D @playwright/test

# Setup browsers
npx playwright install
```

## Test Structure

```
tests/
├── e2e/
│   ├── auth.spec.ts       # Authentication flows
│   ├── journal.spec.ts    # Journal CRUD
│   ├── billing.spec.ts    # Subscription flows
│   └── crisis.spec.ts     # Crisis page access
└── fixtures/
    └── test-data.ts       # Shared test data
```

## Critical Paths

### 1. Authentication Flow

```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test('user can sign up', async ({ page }) => {
  await page.goto('/signup');
  await page.fill('[data-testid="input-email"]', 'test@example.com');
  await page.fill('[data-testid="input-password"]', 'SecurePass123!');
  await page.click('[data-testid="button-signup"]');
  await expect(page).toHaveURL('/dashboard');
});

test('user can log in', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[data-testid="input-email"]', 'existing@example.com');
  await page.fill('[data-testid="input-password"]', 'password');
  await page.click('[data-testid="button-login"]');
  await expect(page).toHaveURL('/dashboard');
});
```

### 2. Crisis Page Access

```typescript
test('crisis page is accessible without login', async ({ page }) => {
  await page.goto('/crisis');
  await expect(page.locator('h1')).toContainText('Crisis');
  await expect(page.locator('[data-testid="crisis-hotline"]')).toBeVisible();
});
```

### 3. Journal Entry

```typescript
test('user can create journal entry', async ({ page }) => {
  await loginAsUser(page);
  await page.goto('/journal');
  await page.click('[data-testid="button-new-entry"]');
  await page.fill('[data-testid="input-content"]', 'Test journal entry');
  await page.click('[data-testid="button-save"]');
  await expect(page.locator('[data-testid="toast-success"]')).toBeVisible();
});
```

## Running Tests

```bash
# Run all E2E tests
npx playwright test

# Run specific test file
npx playwright test tests/e2e/auth.spec.ts

# Run in headed mode (see browser)
npx playwright test --headed

# Run with trace
npx playwright test --trace on
```

## Configuration

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30000,
  use: {
    baseURL: process.env.TEST_URL || 'http://localhost:5000',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'firefox', use: { browserName: 'firefox' } },
  ],
});
```

## Best Practices

1. **Use data-testid** for element selection (stable selectors)
2. **Isolate tests** - each test should be independent
3. **Clean up** - delete test data after tests
4. **Mock external services** when possible
5. **Run in CI** for consistent results
