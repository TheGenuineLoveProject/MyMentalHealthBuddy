# B4 — SLUG CANONICALIZATION CONTRACT

## Contract ID
SLUG_CANONICALIZATION_CONTRACT

## Domain
PLATFORM_DOMAIN

## Purpose
Define how slugs are generated, normalized, deduplicated, and preserved across content updates. Slugs are the primary URL-facing identifier for all publishable content.

## Generation Rules

1. Input: content title at time of first draft save
2. Transformation pipeline:
   - Convert to lowercase
   - Replace spaces with hyphens
   - Remove all characters except `a-z`, `0-9`, and `-`
   - Collapse consecutive hyphens into a single hyphen
   - Trim leading and trailing hyphens
   - Truncate to 100 characters maximum
3. Output: canonical slug string

## Normalization Rules

| Input | Output |
|-------|--------|
| `My First Blog Post` | `my-first-blog-post` |
| `Anxiety & Coping: A Guide` | `anxiety-coping-a-guide` |
| `  Spaces  Everywhere  ` | `spaces-everywhere` |
| `UPPERCASE-Title` | `uppercase-title` |
| `special!!!characters###here` | `specialcharactershere` |
| `multiple---hyphens` | `multiple-hyphens` |

## Uniqueness Rules

1. Slugs must be unique across all content regardless of status
2. If a generated slug already exists, append `-2`, `-3`, etc.
3. Deduplication sequence: `my-post`, `my-post-2`, `my-post-3`
4. Maximum deduplication attempts: 100 (fail if exceeded)

## Preservation Rules

1. Once a slug is assigned and content reaches `published` status, the slug is frozen
2. A frozen slug must never change, even if the title is updated
3. If a title change occurs before publish, the slug may be regenerated at author's request
4. If a slug is changed pre-publish, the old slug is released for reuse

## Redirect Rules

1. If content is archived, the slug's URL should return 410 Gone or redirect to a relevant replacement
2. If content is restored from archive, the original slug is reactivated
3. No two published content items may share the same slug at any point in time

## URL Pattern

Canonical URL is constructed as:
```
/{category}/{slug}
```

If no category is set:
```
/blog/{slug}
```

## Validation

- Pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$`
- Min length: 3 characters
- Max length: 100 characters
- Must not be a reserved path (`admin`, `api`, `auth`, `billing`, `command`, `crisis`, `health`, `login`, `register`, `settings`, `ws`)

## Dependencies
- B1 (CONTENT_MODEL_CONTRACT) — slug field definition
- B2 (SEO_METADATA_CONTRACT) — canonicalUrl generation
- B5 (SITEMAP_FEED_CONTRACT) — slug used in sitemap URLs

## Version
1.0.0

## Status
CANONICAL
