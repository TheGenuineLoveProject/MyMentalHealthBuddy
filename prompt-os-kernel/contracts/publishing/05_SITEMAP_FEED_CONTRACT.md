# B5 — SITEMAP & FEED CONTRACT

## Contract ID
SITEMAP_FEED_CONTRACT

## Domain
BUSINESS_DOMAIN / PLATFORM_DOMAIN

## Purpose
Define which content is eligible for inclusion in sitemap.xml, RSS feeds, and other public discovery surfaces. Ensure only appropriate content is surfaced to search engines and feed readers.

## Sitemap Eligibility Rules

Content is eligible for sitemap.xml if ALL conditions are met:
1. Status is `published`
2. Visibility is `public`
3. Robots directive is `index, follow` or `index, nofollow`
4. Content has a valid canonicalUrl

Content is excluded from sitemap.xml if ANY condition is true:
1. Status is not `published`
2. Visibility is `subscribers`, `plan_gated`, or `internal`
3. Robots directive includes `noindex`
4. Domain is `HEALING_DOMAIN` and content is marked as private reflection

## Sitemap Entry Format

Each sitemap entry must include:
| Field | Source | Required |
|-------|--------|----------|
| loc | canonicalUrl (absolute) | yes |
| lastmod | updatedAt (ISO 8601 date) | yes |
| changefreq | derived from content age | no |
| priority | derived from content type | no |

### Priority Assignment
| Content Type | Priority |
|-------------|----------|
| Hub/pillar page | 0.8 |
| Blog post | 0.6 |
| Guide/how-to | 0.7 |
| Tool page | 0.5 |
| Archive page | 0.3 |

### Changefreq Assignment
| Condition | Changefreq |
|-----------|------------|
| Updated within 7 days | daily |
| Updated within 30 days | weekly |
| Updated within 90 days | monthly |
| Older than 90 days | yearly |

## RSS Feed Eligibility Rules

Content is eligible for RSS feed if ALL conditions are met:
1. Status is `published`
2. Visibility is `public`
3. Domain is not `internal`
4. Content type is `blog`, `essay`, or `newsletter` (public edition)

## RSS Entry Format

Each RSS entry must include:
| Field | Source |
|-------|--------|
| title | content title |
| link | canonicalUrl (absolute) |
| description | summary |
| pubDate | publishAt or published_at from audit |
| guid | content id |
| author | author display name |
| category | content category |

## Feed Limits
- RSS feed returns the 50 most recently published eligible items
- Sitemap has no item limit but must be valid XML under 50MB
- If sitemap exceeds 50,000 URLs, split into sitemap index

## Update Frequency
- Sitemap should be regenerated on every publish, archive, or restore action
- RSS feed is generated dynamically on request

## Dependencies
- B1 (CONTENT_MODEL_CONTRACT) — content fields
- B2 (SEO_METADATA_CONTRACT) — robots directive, canonicalUrl
- B3 (PUBLICATION_STATE_MACHINE_CONTRACT) — published status
- B4 (SLUG_CANONICALIZATION_CONTRACT) — URL construction

## Version
1.0.0

## Status
CANONICAL
