# Log Redaction Policy

## Overview

All logs must be free of Personally Identifiable Information (PII) and sensitive data. This document defines the redaction policy and implementation.

## Sensitive Data Categories

### Always Redacted

| Category | Examples | Replacement |
|----------|----------|-------------|
| Email addresses | user@example.com | [EMAIL_REDACTED] |
| SSN | 123-45-6789 | [SSN_REDACTED] |
| Credit cards | 4111-1111-1111-1111 | [CARD_REDACTED] |
| Phone numbers | 555-123-4567 | [PHONE_REDACTED] |
| Passwords | any password value | [REDACTED] |
| API keys | sk_live_xxx | [REDACTED] |
| Tokens | jwt, session tokens | [REDACTED] |
| Authorization headers | Bearer xxx | [REDACTED] |

### Field-Level Redaction

These field names trigger automatic redaction:
- password
- token
- secret
- apiKey / api_key
- authorization
- cookie
- ssn
- creditCard / cardNumber

## Implementation

### Using the Redaction Utility

```javascript
import { createSafeLogData, redactString } from "./utils/logRedaction.mjs";

// Redact an object before logging
const safeData = createSafeLogData({
  email: "user@example.com",
  action: "login",
});
// Result: { email: "[EMAIL_REDACTED]", action: "login" }

// Redact a string
const safeString = redactString("User email is test@example.com");
// Result: "User email is [EMAIL_REDACTED]"
```

### Checking for PII

```javascript
import { hasPII } from "./utils/logRedaction.mjs";

if (hasPII(userInput)) {
  logger.warn("PII detected in input", { field: "bio" });
}
```

## Logging Guidelines

### DO

```javascript
// Log operation with safe identifiers
logger.info("Journal created", {
  requestId: req.requestId,
  userId: user.id, // ID is safe
  action: "create",
});
```

### DON'T

```javascript
// Never log full user objects
logger.info("User logged in", { user }); // BAD - may contain PII

// Never log request bodies with PII
logger.debug("Request received", { body: req.body }); // BAD
```

## Verification

Run PII detection tests:

```bash
npm run prompt-tests
```

The test suite includes PII detection checks that verify:
- Email patterns are detected
- SSN patterns are detected
- Credit card patterns are detected

## Audit Requirements

1. All production logs must pass redaction
2. Error reports (Sentry) must have PII filtered
3. Audit logs may contain user IDs but never PII
4. Database backups are encrypted separately

## Sentry Configuration

Sentry is configured to strip sensitive headers:

```javascript
beforeSend(event) {
  if (event.request?.headers) {
    delete event.request.headers.authorization;
    delete event.request.headers.cookie;
  }
  return event;
}
```

## Compliance

This policy supports:
- GDPR data minimization
- CCPA privacy requirements
- Platform security best practices
