# Newsletter Readiness — The Genuine Love Project

**Last Updated**: 2026-02-09
**Status**: PASS — Ready (No Automation)

## Current State

The platform has two distinct email paths. This document clarifies the boundary and prepares the editorial newsletter layer without introducing automation.

## Email Infrastructure Separation

### Transactional Emails (Active)
- **Service**: Resend (via `server/services/email.mjs`)
- **Purpose**: Account lifecycle events only
- **Templates**: Welcome, password reset, billing confirmation, cancellation
- **Trigger**: Automated by user actions (signup, purchase, etc.)
- **Status**: Fully operational

### Editorial Newsletters (Ready, Not Active)
- **Content Source**: `blog_posts` table with `content_type = 'newsletter'`
- **Purpose**: Wellness insights, reflections, curated content
- **Trigger**: Manual only — human reviews and approves each send
- **Sending**: Not yet implemented (requires future integration)
- **Status**: Content model ready, distribution not yet wired

## Subscriber Collection

### Canonical Component
- **File**: `client/src/components/NewsletterSignup.jsx`
- **API**: `POST /api/leads` (server/routes/leads.mjs)
- **Storage**: `leads` table with consent tracking and UTM attribution
- **Used in**: Both footer components (`SacredFooter.jsx`, `sacred/SacredFooter.jsx`)

### Consent Verification

| Requirement | Status | Evidence |
|-------------|--------|----------|
| Explicit consent checkbox | PASS | Unchecked by default, `aria-required="true"` |
| Clear expectation copy | PASS | "Wellness tips and new features delivered to your inbox" |
| No pre-checked boxes | PASS | `useState(false)` — user must actively check |
| Unsubscribe language | PASS | "No spam, unsubscribe anytime" |
| Consent required for submit | PASS | Validates `consent === true` both client and server |
| Privacy link accessible | PASS | Footer links to `/privacy` (returns 200) |

### Backend Handling

| Requirement | Status | Evidence |
|-------------|--------|----------|
| Email validation | PASS | Zod schema: `z.string().email()` |
| Duplicate handling | PASS | Checks existing, updates preferences if duplicate |
| Timestamp storage | PASS | `createdAt` auto-set on insert |
| Source tracking | PASS | `source` parameter logged (e.g., "sacred-footer") |
| UTM attribution | PASS | Stores utm_source/medium/campaign with 30-day expiry |
| Email list not public | PASS | `GET /api/leads` requires admin token |
| Export admin-only | PASS | `GET /api/leads/export` requires admin token |
| Error handling | PASS | Friendly messages, no silent failures |

## Newsletter Copy Source of Truth

All newsletter content is authored as `blog_posts` entries with:
- `content_type`: `"newsletter"`
- `visibility`: `"private"` during drafting, `"public"` when ready to share on-site
- `status`: `"draft"` while writing, `"published"` when approved

This means newsletter issues are:
1. Written in the same system as blog posts
2. Queryable via `GET /api/blog?type=newsletter`
3. Visible on the public blog only when explicitly set to `visibility: public`
4. Never automatically distributed — sending is a separate, future action

## What Is NOT Implemented (By Design)

- No email blasting or bulk send functionality
- No automation or drip sequences
- No growth funnels or upsell flows
- No A/B testing of subject lines
- No send scheduling
- No analytics dashboards for email

## Fixes Applied (2026-02-09)

1. `SacredFooter.jsx` (components/) — Replaced non-functional form (preventDefault only, no API call, no consent) with canonical `NewsletterSignup` component
2. `sacred/SacredFooter.jsx` — Replaced consent-less form (called API without consent checkbox) with canonical `NewsletterSignup` component
3. Social links in `SacredFooter.jsx` (components/) — Replaced dead `#` hrefs with internal routes (`/community`, `/contact`, `/affirmations`)

## Known Parallel Components (Not Active)

- `EmailCapture.jsx` — Orphan component (not imported anywhere), lacks consent checkbox, calls `/api/newsletter/subscribe`. Not deleted (safe evolution), not used.
- `/api/newsletter/subscribe` — Separate endpoint that only validates email format without consent requirement. Used by no active component after these fixes.

## Future Integration Path (When Ready)

When editorial newsletter sending is needed:
1. Admin selects a newsletter-type blog post
2. Admin reviews content and confirms send
3. System queries `leads` table for consented subscribers
4. Resend API delivers the email
5. No automation — every send is a conscious human decision

## Ethical Guidelines

- Never send without explicit prior consent
- Always include unsubscribe link
- Never use urgency, scarcity, or FOMO language
- Content should inform and support, not sell
- Frequency should respect attention — quality over quantity
