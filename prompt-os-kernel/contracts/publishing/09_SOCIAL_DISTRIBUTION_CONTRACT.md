# B9 — SOCIAL DISTRIBUTION CONTRACT

## Contract ID
SOCIAL_DISTRIBUTION_CONTRACT

## Domain
BUSINESS_DOMAIN

## Purpose
Define how published content is adapted into social media posts while preserving brand voice, safety constraints, and message consistency. This contract governs content transformation for social channels without altering the source content.

## Social Eligibility

Content is eligible for social distribution if ALL conditions are met:
1. Status is `published`
2. Visibility is `public`
3. Content has passed all B7 QA checks
4. Author has not marked content as `social_exclude`

## Supported Channels

| Channel | Format | Max Length |
|---------|--------|-----------|
| Twitter/X | Short post + link | 280 characters |
| Instagram | Caption + image | 2,200 characters |
| LinkedIn | Professional post + link | 3,000 characters |
| Facebook | Post + link + image | 63,206 characters |
| Threads | Short post + link | 500 characters |

## Content Adaptation Rules

### General
1. Each social post must link back to the canonical content URL
2. Social copy must accurately represent the source content
3. No claims in social posts that do not appear in the source content
4. Preserve brand tone: calm, supportive, educational, trustworthy
5. Include relevant hashtags (max 5 per post)

### Per Channel
- **Twitter/X**: Lead with insight or question, include link, max 2 hashtags
- **Instagram**: Lead with value statement, include CTA in caption, image required
- **LinkedIn**: Professional framing, include key takeaway, link at end
- **Facebook**: Conversational tone, include image, link in post body
- **Threads**: Concise insight, link, max 1 hashtag

## Domain Safety Rules

1. HEALING_DOMAIN content social posts must not include pricing or conversion CTAs
2. No manipulative emotional hooks ("You won't believe...", "This changed everything...")
3. No clinical claims in social copy
4. No fabricated testimonials or authority
5. Mental health content social posts must include educational framing
6. No urgency-based engagement bait

## Brand Voice Rules

1. Tone: warm, grounded, honest, educational
2. No hype language or exaggeration
3. No negative comparisons with other services
4. Always attribute expertise appropriately
5. Use inclusive, non-judgmental language

## Distribution Metadata (B1 Reference)

The `distribution.social` object shape:
```
{
  "eligible": boolean,
  "channels": string[],
  "posts": [
    {
      "channel": string,
      "text": string,
      "imageUrl": string | null,
      "scheduledAt": ISO 8601 | null,
      "postedAt": ISO 8601 | null,
      "postUrl": string | null
    }
  ]
}
```

## Scheduling Rules

1. Social posts may be scheduled for future distribution
2. Suggested posting window: content publish date + 0 to 48 hours
3. Stagger posts across channels (not all at once)
4. No posting between 10pm–7am subscriber local time

## Dependencies
- B1 (CONTENT_MODEL_CONTRACT) — distribution field
- B3 (PUBLICATION_STATE_MACHINE_CONTRACT) — published status required
- B7 (CONTENT_QA_CHECKLIST_CONTRACT) — QA must pass before distribution
- B10 (PUBLISHING_AUDIT_CONTRACT) — distribution events logged

## Version
1.0.0

## Status
CANONICAL
