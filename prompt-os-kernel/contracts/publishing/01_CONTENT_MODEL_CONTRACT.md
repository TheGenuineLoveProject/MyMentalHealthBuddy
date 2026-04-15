# B1 — CONTENT MODEL CONTRACT

## Contract ID
CONTENT_MODEL_CONTRACT

## Domain
BUSINESS_DOMAIN / PLATFORM_DOMAIN

## Purpose
Define the canonical content entity shape used by all publishing, SEO, distribution, and audit contracts. Every content item in the system must conform to this model.

## Canonical Content Entity

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string (UUID) | yes | Unique content identifier |
| title | string | yes | Content title, max 200 characters |
| slug | string | yes | URL-safe identifier, unique, lowercase, hyphenated |
| summary | string | yes | Plain-text summary, max 300 characters |
| body | string | yes | Full content body (markdown or HTML) |
| status | enum | yes | Publication state: idea, draft, review, approved, scheduled, published, archived |
| author | string | yes | Author identifier (user ID or display name) |
| domain | enum | yes | Content domain: HEALING_DOMAIN, BUSINESS_DOMAIN, PLATFORM_DOMAIN, DESIGN_DOMAIN, RESEARCH_DOMAIN |
| tags | string[] | no | Content tags for classification, max 10 |
| category | string | no | Primary content category |
| seo | object | no | SEO metadata (defined in B2 SEO_METADATA_CONTRACT) |
| publishAt | ISO 8601 datetime | no | Scheduled publish date, null if immediate or not scheduled |
| updatedAt | ISO 8601 datetime | yes | Last modification timestamp, auto-set |
| canonicalUrl | string | no | Canonical URL for this content, auto-generated from slug if not set |
| visibility | enum | yes | Access level: public, subscribers, plan_gated, internal |
| distribution | object | no | Distribution metadata (defined in B8, B9) |
| audit | object | yes | Audit trail (defined in B10 PUBLISHING_AUDIT_CONTRACT) |

## Field Constraints

### id
- Format: UUID v4
- Generated at creation, immutable after

### title
- Min length: 5 characters
- Max length: 200 characters
- Must not be empty or whitespace-only

### slug
- Lowercase alphanumeric plus hyphens only
- Pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$`
- Max length: 100 characters
- Must be unique across all content
- Canonicalization rules defined in B4

### summary
- Plain text only, no HTML or markdown
- Min length: 20 characters
- Max length: 300 characters

### body
- Markdown or sanitized HTML
- Min length: 100 characters for publishable content
- No embedded scripts or unsafe tags

### status
Legal values and transitions defined in B3 (PUBLICATION_STATE_MACHINE_CONTRACT):
- `idea` — initial capture
- `draft` — in progress
- `review` — submitted for review
- `approved` — passed review
- `scheduled` — approved with future publish date
- `published` — live and visible
- `archived` — removed from active display

### author
- Must reference a valid user ID in the system
- Cannot be empty for any status beyond `idea`

### domain
- Must be one of: HEALING_DOMAIN, BUSINESS_DOMAIN, PLATFORM_DOMAIN, DESIGN_DOMAIN, RESEARCH_DOMAIN
- Determines which safety rules apply
- HEALING_DOMAIN content must not contain monetization, SEO pressure, or conversion logic

### tags
- Array of strings
- Max 10 tags per content item
- Each tag: lowercase, max 50 characters

### category
- Single primary category
- Must match a defined category in the content taxonomy

### seo
- Optional object conforming to B2 (SEO_METADATA_CONTRACT)
- Required before status can transition to `approved`

### publishAt
- ISO 8601 format
- Must be in the future if status is `scheduled`
- Null for immediate publish or non-scheduled content

### updatedAt
- Auto-set on every modification
- ISO 8601 format

### canonicalUrl
- Auto-generated as `/{category}/{slug}` if not explicitly set
- Must be a valid relative or absolute URL

### visibility
- `public` — accessible to all visitors
- `subscribers` — requires email subscription
- `plan_gated` — requires active paid plan
- `internal` — admin/author only

### distribution
- Optional object, shape defined in B8 and B9
- Contains newsletter and social distribution metadata

### audit
- Required object, shape defined in B10
- Tracks created_by, created_at, updated_by, updated_at, published_by, published_at, version

## Domain Safety Rules
1. Content with domain `HEALING_DOMAIN` must not contain monetization calls-to-action in body or summary
2. Content with domain `BUSINESS_DOMAIN` must not appear inside healing user flows
3. SEO metadata is allowed on all domains but must not use manipulative mental health claims
4. Tags and categories must not create false clinical authority

## Validation Rules
1. All required fields must be present and non-empty
2. Status transitions must follow B3 state machine
3. Slug must be unique and canonicalized per B4
4. SEO object must be valid per B2 before `approved` status
5. Audit object must be present and valid per B10

## Dependencies
- B2 (SEO_METADATA_CONTRACT) — seo field shape
- B3 (PUBLICATION_STATE_MACHINE_CONTRACT) — status transitions
- B4 (SLUG_CANONICALIZATION_CONTRACT) — slug rules
- B8 (NEWSLETTER_DISTRIBUTION_CONTRACT) — distribution.newsletter shape
- B9 (SOCIAL_DISTRIBUTION_CONTRACT) — distribution.social shape
- B10 (PUBLISHING_AUDIT_CONTRACT) — audit field shape

## Version
1.0.0

## Status
CANONICAL
