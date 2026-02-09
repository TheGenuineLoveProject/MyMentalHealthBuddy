# Duplication & Drift Prevention Scan

**Date**: 2026-02-09
**Status**: PASS — No conflicting duplicates, parallel systems documented

## Newsletter / Email Collection

### Canonical Path
- **Component**: `NewsletterSignup.jsx` → `POST /api/leads` → `leads` table
- **Used in**: `SacredFooter.jsx`, `sacred/SacredFooter.jsx`

### Parallel (Inactive)
| Component | Path | Status |
|-----------|------|--------|
| `EmailCapture.jsx` | `POST /api/newsletter/subscribe` | Orphan — not imported anywhere |
| `newsletter.mjs` route | `POST /api/newsletter/subscribe` | Receives POSTs but has no active consumer |

**Risk**: None — canonical path is the only active one. Parallel components exist but are unused.

## Blog / Publishing

### Canonical Path
- **API**: `server/routes/blog.mjs` → `blogPosts` table
- **Single source**: Only one route file handles blog CRUD
- **No filesystem posts**: All content is DB-backed

### No Duplicates Found
- No `/posts` API endpoint (redirect to `/blog` only)
- No `/articles` blog API (separate learn system)
- No markdown file-based blog system

## Social Media Admin

### Canonical Path
- **Primary UI**: `SocialStudioAdmin.jsx` at `/admin/social-studio`
- **Storage**: localStorage (`social_drafts_v2`)

### Related Admin Pages (Not Duplicates)
| Page | Route | Purpose | Conflict? |
|------|-------|---------|-----------|
| SocialDashboard | `/admin/social` | Overview | No — complementary |
| SocialGenerator | `/admin/social/generate` | AI content generation | No — complementary |
| SocialLibrary | `/admin/social/library` | Content library | No — complementary |
| SocialCalendar | `/admin/social/calendar` | Calendar view | No — complementary |
| SocialAnalytics | `/admin/social/analytics` | Analytics | No — complementary |

### Pre-existing Parallel System
- **DB API**: `server/routes/social-posts.mjs` → `socialPosts` table
- **Service files**: `server/services/social-platforms.mjs`, `server/services/social-posting.mjs`
- **Status**: DB API exists but UI does not use it yet
- **Risk**: Low — localStorage UI and DB API can be integrated later without conflict

## Content Systems

### No Content System Duplication Found
- `contentDrafts` — Not found in active codebase
- `postDrafts` — Not found in active codebase
- `contentTemplates` — Not found in active codebase
- Content routes (`content.mjs`, `content-generator.mjs`, `content-intelligence.mjs`) serve different purposes (content transformation, AI generation, intelligence) — not blog duplicates

## Route Aliases (Intentional)
| Source | Target | Type |
|--------|--------|------|
| `/posts` | `/blog` | Redirect |
| `/article` | `/articles` | Redirect |
| `/newsletter` | `/contact` | Config route |

These are intentional redirects for SEO and discoverability, not duplicate systems.

## Configuration File Duplicates
- No redundant config files found
- `client/src/config/social.ts` and `client/src/content/social/socialTemplates.ts` serve different purposes (config vs content)

## Recommendations
1. When ready, integrate `SocialStudioAdmin` with the DB API (`/api/social-posts`) to persist drafts beyond localStorage
2. Consider removing orphan `EmailCapture.jsx` in a future cleanup pass (not deleted per safe evolution rules)
3. The `/api/newsletter/subscribe` endpoint can be deprecated once confirmed no external integrations depend on it
