# Privacy Signals — The Genuine Love Project

## What We Track

We collect minimal, aggregated product signals to improve the experience:

- **Page views**: Which routes are visited (e.g., "/tools", "/blog")
- **CTA clicks**: Which buttons are clicked (e.g., "pricing_click", "newsletter_click")
- **Conversion steps**: Anonymous funnel counts (pricing view → checkout start → success)
- **Newsletter signups**: Attempt and success counts (no email content stored in analytics)

## What We Do NOT Track

- **No PII**: We do not store names, emails, or personal details in analytics events
- **No fingerprinting**: We do not use browser fingerprinting or device identification
- **No session replay**: We do not record screen sessions or mouse movements
- **No keystroke capture**: We do not log what users type
- **No IP storage**: We do not store IP addresses in analytics events
- **No third-party trackers**: Analytics are first-party only
- **No cross-site tracking**: No tracking pixels or external analytics services

## Data Storage

- Events are stored in our database with minimal metadata
- Each event includes: event name, category, route path, and optional safe metadata
- User IDs are attached only for logged-in users (optional, for aggregate counts)
- Session IDs are random, short-lived tokens — not fingerprints

## Privacy Level

All events are tagged with `privacy_level: "minimal"` by default.

## How to Opt Out

Users can opt out of all client-side tracking by setting a localStorage flag:

```javascript
localStorage.setItem("analytics_opt_out", "true");
```

When opted out, no events are sent from the client. This is respected immediately.

## Admin Access

Analytics data is accessible only to admin users via `/admin/analytics`. The dashboard shows aggregated counts only — no individual user data is displayed by default.

## Ethical Commitment

This system follows our "Signals, Not Surveillance" principle:
- We observe aggregate patterns to improve the product
- We never profile individual users
- We never sell or share analytics data
- We design for transparency and user control
