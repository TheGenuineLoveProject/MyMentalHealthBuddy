# Newsletter Readiness — The Genuine Love Project

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

### Current Implementation
- **Component**: `client/src/components/NewsletterSignup.jsx`
- **API**: `POST /api/leads` (server/routes/leads.mjs)
- **Storage**: `leads` table with consent tracking and UTM attribution
- **Consent**: Explicit opt-in checkbox required before submission
- **Language**: "Wellness tips and new features delivered to your inbox. No spam, unsubscribe anytime."

### Consent-First Design
- Checkbox is required (not pre-checked)
- Language is non-coercive and transparent
- Unsubscribe messaging is upfront
- No urgency language, no countdown timers, no FOMO

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
