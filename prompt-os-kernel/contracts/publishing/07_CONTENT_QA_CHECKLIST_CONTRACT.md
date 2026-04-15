# B7 — CONTENT QA CHECKLIST CONTRACT

## Contract ID
CONTENT_QA_CHECKLIST_CONTRACT

## Domain
PLATFORM_DOMAIN

## Purpose
Define the minimum pre-publish validation checklist that every content item must pass before transitioning to `approved` or `published` status. This is a hard gate — no content may be published without passing all required checks.

## Required Checks

### Content Completeness
| Check | Rule | Severity |
|-------|------|----------|
| Title present | Non-empty, 5–200 characters | BLOCK |
| Slug valid | Matches canonicalization rules (B4) | BLOCK |
| Summary present | Non-empty, 20–300 characters | BLOCK |
| Body present | Non-empty, min 100 characters | BLOCK |
| Author set | Valid user ID | BLOCK |
| Domain classified | Valid domain enum | BLOCK |
| Category set | Non-empty for published content | WARN |

### SEO Completeness (B2)
| Check | Rule | Severity |
|-------|------|----------|
| SEO title | Present, 10–70 characters | BLOCK |
| Meta description | Present, 120–160 characters | BLOCK |
| Canonical URL | Valid and unique | BLOCK |
| OG title | Present, max 95 characters | BLOCK |
| OG description | Present, max 200 characters | BLOCK |
| OG image | Valid image URL | BLOCK |
| Schema type | Valid enum value | BLOCK |

### Link Integrity (B6)
| Check | Rule | Severity |
|-------|------|----------|
| Internal links valid | All point to published content | WARN |
| No broken links | Zero 404 targets | BLOCK |
| Min internal links | At least 2 for blog posts | WARN |
| No forbidden links | No healing → monetization links | BLOCK |

### Domain Safety
| Check | Rule | Severity |
|-------|------|----------|
| No clinical claims | Body does not contain diagnosis language | BLOCK |
| No therapy replacement | No "replaces therapy" or equivalent | BLOCK |
| Healing domain clean | No monetization CTAs in healing content | BLOCK |
| Crisis link present | Healing content includes crisis routing | WARN |
| Disclaimer present | Health content includes educational disclaimer | WARN |

### Technical
| Check | Rule | Severity |
|-------|------|----------|
| No unsafe HTML | No script tags, iframes, or event handlers in body | BLOCK |
| Image alt text | All images have alt attributes | WARN |
| Body formatting | Valid markdown or sanitized HTML | BLOCK |
| Slug uniqueness | No collision with existing slugs | BLOCK |

## Severity Levels

| Level | Effect |
|-------|--------|
| BLOCK | Content cannot advance to next state until resolved |
| WARN | Content can advance but issue is flagged for author attention |

## Execution Rules

1. QA checklist runs automatically on every transition to `review`, `approved`, and `published`
2. All BLOCK items must pass for the transition to succeed
3. WARN items are logged and surfaced to the author but do not block transitions
4. QA results are stored in the audit trail (B10)

## Override Rules

1. No override is allowed for BLOCK severity checks
2. WARN checks may be acknowledged by the author with a reason
3. Acknowledged warnings are logged in audit

## Dependencies
- B1 (CONTENT_MODEL_CONTRACT) — field definitions
- B2 (SEO_METADATA_CONTRACT) — SEO field validation
- B4 (SLUG_CANONICALIZATION_CONTRACT) — slug validation
- B6 (INTERNAL_LINKING_CONTRACT) — link validation
- B10 (PUBLISHING_AUDIT_CONTRACT) — QA results logging

## Version
1.0.0

## Status
CANONICAL
