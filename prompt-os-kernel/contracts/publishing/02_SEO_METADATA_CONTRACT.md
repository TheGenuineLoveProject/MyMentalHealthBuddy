# B2 — SEO METADATA CONTRACT

## Contract ID
SEO_METADATA_CONTRACT

## Domain
BUSINESS_DOMAIN / PLATFORM_DOMAIN

## Purpose
Define the required SEO metadata fields, validation rules, and safety constraints for every publishable content entity. This contract specifies the shape of the `seo` object referenced in B1 (CONTENT_MODEL_CONTRACT).

## Canonical SEO Metadata Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | yes | SEO title, max 70 characters |
| metaDescription | string | yes | Meta description, 120–160 characters |
| canonicalUrl | string | yes | Canonical URL for deduplication |
| ogTitle | string | yes | Open Graph title for social sharing |
| ogDescription | string | yes | Open Graph description, max 200 characters |
| ogImage | string | yes | Open Graph image URL, absolute path |
| robots | string | no | Robots directive, defaults to "index, follow" |
| schemaType | enum | yes | Schema.org type for JSON-LD structured data |

## Field Constraints

### title
- Min length: 10 characters
- Max length: 70 characters
- Must not duplicate the content title verbatim unless under 60 characters
- Must contain primary keyword naturally
- No keyword stuffing

### metaDescription
- Min length: 120 characters
- Max length: 160 characters
- Must summarize the page content accurately
- Must not contain false clinical claims
- Must not use manipulative urgency language

### canonicalUrl
- Must be a valid absolute or root-relative URL
- Pattern: `^(https?://|/)[a-z0-9/_-]+$`
- Must match the content's actual published URL
- One canonical URL per content item, no duplicates across content

### ogTitle
- Max length: 95 characters
- May differ from SEO title for social optimization
- Must accurately represent the content

### ogDescription
- Max length: 200 characters
- Must not contain clickbait or emotional manipulation
- Must be factually accurate

### ogImage
- Must be an absolute URL pointing to a valid image
- Minimum dimensions: 1200x630 pixels recommended
- Supported formats: PNG, JPG, WebP
- Must not contain misleading imagery

### robots
- Default: `index, follow`
- Valid values: `index, follow` | `noindex, follow` | `index, nofollow` | `noindex, nofollow`
- Use `noindex` for internal, draft, or subscriber-only content not intended for search

### schemaType
- Must be one of the following Schema.org types:
  - `Article` — standard blog posts and essays
  - `BlogPosting` — blog-specific content
  - `WebPage` — general pages
  - `FAQPage` — FAQ content
  - `HowTo` — step-by-step guides
  - `MedicalWebPage` — health/wellness educational content (requires disclaimer)
  - `EducationalOccupationalProgram` — structured learning content

## Validation Rules

1. All required fields must be present and non-empty before content status can transition to `approved` (per B3)
2. Title must not exceed 70 characters
3. Meta description must be between 120 and 160 characters
4. Canonical URL must be unique across all published content
5. Open Graph image must resolve to a valid image URL
6. Schema type must be from the allowed enum list
7. Robots directive must use only valid directives

## Domain Safety Rules

1. HEALING_DOMAIN content using `MedicalWebPage` schema type must include an educational disclaimer in the page body
2. No SEO metadata may contain clinical diagnosis claims, therapy replacement language, or fabricated credentials
3. No keyword stuffing in title or meta description
4. No manipulative mental health claims for search ranking
5. BUSINESS_DOMAIN SEO metadata must not appear inside healing user flows

## JSON-LD Generation Rules

1. Every published content item must generate a valid JSON-LD block
2. The `@type` field must match the `schemaType` value
3. Required JSON-LD fields per schema type:
   - `Article` / `BlogPosting`: headline, description, author, datePublished, dateModified, image, publisher
   - `WebPage`: name, description, url
   - `FAQPage`: mainEntity (array of Question/Answer)
   - `HowTo`: name, description, step (array)
   - `MedicalWebPage`: name, description, lastReviewed, specialty (set to "Mental Health Education")
4. Publisher must reference TheGenuineLoveProject brand entity
5. Author must reference a valid system user

## Dependencies
- B1 (CONTENT_MODEL_CONTRACT) — this contract defines the `seo` field shape
- B4 (SLUG_CANONICALIZATION_CONTRACT) — canonical URL generation
- B7 (CONTENT_QA_CHECKLIST_CONTRACT) — SEO completeness is a pre-publish check

## Version
1.0.0

## Status
CANONICAL
