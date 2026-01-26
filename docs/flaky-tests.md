# Flaky Test Quarantine Process

## Definition

A flaky test passes and fails intermittently without code changes. These reduce confidence in the test suite.

## Identification

A test is considered flaky if it:
1. Fails randomly in CI (>2 times in 10 runs)
2. Passes locally but fails in CI consistently
3. Has timing/race conditions

## Quarantine Process

### 1. Mark as Flaky
```javascript
describe.skip("Flaky: [Test Name] - [ISSUE-123]", () => {
  // Original test code
});
```

### 2. Create Issue
- Title: `[FLAKY] Test name`
- Label: `flaky-test`
- Include: failure logs, frequency, suspected cause

### 3. Fix or Remove
- Priority: High (fix within 2 sprints)
- Options: Fix root cause, rewrite test, or delete if redundant

## Common Causes

| Cause | Fix |
|-------|-----|
| Timing issues | Use explicit waits, increase timeouts |
| Shared state | Isolate tests, use beforeEach cleanup |
| External deps | Mock external services |
| Race conditions | Avoid parallel mutations |
| Date/time | Mock Date, use fixed timestamps |

## Quarantine Registry

| Test | Issue | Status |
|------|-------|--------|
| — | — | No flaky tests currently |

## Prevention

1. Avoid time-dependent assertions
2. Clean up after each test
3. Mock external services
4. Use deterministic test data
