# B6 — INTERNAL LINKING CONTRACT

## Contract ID
INTERNAL_LINKING_CONTRACT

## Domain
BUSINESS_DOMAIN / PLATFORM_DOMAIN

## Purpose
Define allowed internal linking patterns between content types to support SEO topic clustering, user navigation, and content discoverability without violating domain separation rules.

## Linking Topology

### Allowed Link Directions

| Source Type | Target Type | Allowed |
|-------------|-------------|---------|
| Blog post | Blog post | yes |
| Blog post | Guide/how-to | yes |
| Blog post | Tool page | yes |
| Blog post | Hub/pillar page | yes |
| Guide/how-to | Blog post | yes |
| Guide/how-to | Tool page | yes |
| Hub/pillar page | Blog post | yes |
| Hub/pillar page | Guide/how-to | yes |
| Hub/pillar page | Tool page | yes |
| Tool page | Guide/how-to | yes |
| Tool page | Blog post | yes |
| Any content | Crisis page | yes (always) |

### Forbidden Link Patterns

| Pattern | Reason |
|---------|--------|
| Healing flow → Pricing page | No monetization inside healing |
| Healing flow → Checkout | No conversion pressure in healing |
| Blog post → Internal admin page | Admin pages are not public |
| Any content → Archived content | Dead links |

## Topic Cluster Rules

1. Every blog post should link to its parent hub/pillar page
2. Hub pages should link to all cluster pages within the topic
3. Cluster pages should cross-link to 2–4 sibling cluster pages
4. Every cluster should have exactly one hub page
5. Links must use descriptive anchor text, not "click here"

## Link Validation Rules

1. All internal links must point to content with status `published`
2. Links to `archived` content must be removed or redirected
3. Links must use relative paths (not absolute URLs with domain)
4. Maximum internal links per content item: 20
5. Minimum internal links per published blog post: 2

## Domain Safety Rules

1. HEALING_DOMAIN content may link to other healing content and crisis pages only
2. HEALING_DOMAIN content must not link to pricing, billing, checkout, or conversion pages
3. BUSINESS_DOMAIN content may link to any public content type
4. Cross-domain linking (healing → business) is forbidden except for educational resource links that do not contain conversion elements

## Anchor Text Rules

1. Anchor text must describe the target content
2. No generic anchors: "click here", "read more", "learn more" (without context)
3. No keyword-stuffed anchors
4. Anchor text should be 2–8 words
5. No duplicate anchor text pointing to different URLs within the same content

## Broken Link Protocol

1. Check internal links on every publish and update
2. Flag links to non-published content as warnings
3. Auto-remove links to deleted content
4. Log broken links in audit trail

## Dependencies
- B1 (CONTENT_MODEL_CONTRACT) — content structure
- B3 (PUBLICATION_STATE_MACHINE_CONTRACT) — published status
- B4 (SLUG_CANONICALIZATION_CONTRACT) — URL construction
- B7 (CONTENT_QA_CHECKLIST_CONTRACT) — link check is a QA item

## Version
1.0.0

## Status
CANONICAL
