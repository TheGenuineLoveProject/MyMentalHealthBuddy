# Cookie Policy

## Overview

This document describes cookies used by The Genuine Love Project platform.

## Cookie Categories

### Essential Cookies (Required)

| Cookie | Purpose | Duration |
|--------|---------|----------|
| `session` | User authentication session | Session |
| `csrf_token` | CSRF protection | Session |

These cookies are required for the platform to function and cannot be disabled.

### Functional Cookies (Optional)

| Cookie | Purpose | Duration |
|--------|---------|----------|
| `theme` | Light/dark mode preference | 1 year |
| `contentTier` | User's preferred content tier | 1 year |
| `age_verified` | 18+ age consent status | 30 days |
| `reducedMotion` | Animation preference | 1 year |

### Analytics Cookies (Optional)

If Google Analytics is enabled:
| Cookie | Purpose | Duration |
|--------|---------|----------|
| `_ga` | Distinguishes users | 2 years |
| `_gid` | Distinguishes users | 24 hours |

Users can opt out via browser settings or the consent banner.

## Cookie Consent

- First-party essential cookies: No consent required
- Functional cookies: Implied consent via settings usage
- Analytics cookies: Explicit consent required

## User Controls

Users can:
1. Clear cookies via browser settings
2. Opt out of analytics via consent banner
3. Request data export (includes cookie data)

## Implementation

### Setting Cookies
```javascript
// Essential (no consent needed)
res.cookie('session', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
});

// Functional (check preference)
if (userPreferences.functional) {
  res.cookie('theme', 'dark', { maxAge: 365 * 24 * 60 * 60 * 1000 });
}
```

## GDPR Compliance

- Cookies documented in privacy policy
- Consent obtained before non-essential cookies
- Users can withdraw consent at any time
- Cookie data included in data export requests
