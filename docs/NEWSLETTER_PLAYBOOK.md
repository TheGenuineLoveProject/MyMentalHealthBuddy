# Newsletter Playbook — The Genuine Love Project

## Purpose
This document defines the manual-first newsletter workflow. No automation. Human approval required at every step.

## Principles
1. **Low frequency, high care.** Send when you have something meaningful — roughly once per week.
2. **No manipulation.** No urgency, no scarcity, no guilt-based CTAs.
3. **Privacy first.** Never reference private user data. Never sell subscriber lists.
4. **Crisis safety.** Every email includes the crisis-safe footer.
5. **Consent-based.** Double opt-in preferred. Easy unsubscribe always.

## Workflow

### 1. Draft
- Choose a draft from `content/publishing/newsletter/drafts.json` or write a new one.
- Each draft must align with one of the 12 content pillars (see `content/publishing/pillars.json`).
- Run tone audit: `node scripts/audit-tone.mjs`

### 2. Review
- Admin reviews draft in the Publishing Command Center (`/admin/publishing` → Drafts tab).
- Check: subject line, body copy, CTA, safety note, disclaimer.
- Copy the subject and body using the copy buttons.

### 3. Test Send
- Use the Newsletter Admin (`/admin/newsletter`) test send feature.
- Sends to admin email only. Verify formatting and links.

### 4. Approve
- Mark draft status as "approved" in the Publishing Command Center.

### 5. Send
- Manual send only. Use Resend dashboard or the newsletter admin send feature.
- Never batch-send without reviewing the subscriber list first.
- Maximum batch size: 50 per batch (rate limiting).

### 6. Record
- Update the publishing registry (`content/publishing/publishingRegistry.json`) to status "published".
- Note the send date.

## Templates
- Welcome email: `content/publishing/templates/welcome-template.md`
- Weekly digest: `content/publishing/templates/weekly-template.md`
- Crisis footer: `content/publishing/templates/crisis-safe-footer.md`

## Sequences
- Welcome 3-part: `content/newsletter/sequences/welcome_3part.json`
- Weekly digest template: `content/newsletter/sequences/weekly_digest_template.json`

## Style Guide
- See `content/publishing/templates/publishing-style-guide.md`

## Forbidden Language
- Urgency: "Don't miss," "Last chance," "Today only," "Act now," "Hurry"
- Shame: "What's wrong with you"
- Guilt: "You must," "Stop making excuses"
- Medical: "Cure," "Diagnose," "Prescribe," "Guaranteed healing"
- Dependency: "You need us," "You can't do this without"

## Metrics
- Track via ethical signals only (see `scripts/audit-signals.mjs`)
- Review weekly in `/admin/publishing` → Signals tab
- Generate weekly report: `node scripts/publishing-weekly-report.mjs`

## Emergency Procedures
- If a harmful email is sent, immediately send a correction email with apology.
- All crisis emails must link to `/crisis` and include 988 lifeline info.
- If subscriber data is compromised, notify affected users within 24 hours.
