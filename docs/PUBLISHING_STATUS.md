# Publishing System Status

> Last verified: February 2026

## Canonical Content Model

| Component | Status | Location |
|-----------|--------|----------|
| `blog_posts` table | Active | `shared/schema.mjs` |
| `content_type` column | Active (blog_post, newsletter, reflection, essay, note) | `shared/schema.mjs` |
| `visibility` column | Active (public, private, draft) | `shared/schema.mjs` |
| Blog API (CRUD) | Functional | `server/routes/blog.mjs` |
| RSS feed | Functional | `GET /api/blog/rss` |
| Blog list page | Renders | `/blog` |
| Blog post page | Renders | `/blog/:slug` |
| Blog editor | Renders (protected) | `/write` |
| Content type filtering | Functional | `GET /api/blog?type=newsletter` |

## Access Control

- Public routes enforce `status=published` AND `visibility=public`
- Single-post route (`/:slug`) enforces both checks
- RSS feed enforces both checks
- Admin route (`/admin`) returns all posts regardless of status/visibility
- Draft management route (`/admin/drafts`) returns only `status=draft`

## Newsletter Readiness

| Component | Status | Location |
|-----------|--------|----------|
| `NewsletterSignup` component | Ready | `client/src/components/NewsletterSignup.jsx` |
| `/api/leads` endpoint | Functional | `server/routes/leads.mjs` |
| Consent checkbox | Required (explicit opt-in) | Component |
| Transactional emails (Resend) | Active | Separate from editorial |
| Editorial newsletter content | Stored as `content_type='newsletter'` | `blog_posts` table |
| Email blasting | NOT implemented (by design) | N/A |

## Social Content Admin

| Component | Status | Location |
|-----------|--------|----------|
| `socialPosts` table | Active | `shared/schema.mjs` |
| Social posts API | Functional (admin-only) | `server/routes/social-posts.mjs` |
| Social Studio Admin UI | Renders | `/admin/social-studio` |
| Status workflow | idea → drafted → approved → archived → published | Schema + API |
| Platform selection | 7 platforms supported | Admin UI |
| Automation | NONE (human-in-the-loop only) | By design |

## Pre-existing Parallel Systems (Not Modified)

These tables exist in the schema but were NOT created or modified during this pass:

- `contentDrafts` — separate draft storage (pre-existing)
- `postDrafts` — separate post draft system (pre-existing)
- `contentTemplates` — template storage (pre-existing)
- `calendarEntries` — calendar scheduling (pre-existing)

These are noted for awareness. No duplication conflicts detected with the canonical content model.

## Route Health

All publishing-related routes verified returning HTTP 200:
- `/blog` — Blog listing page
- `/blog/:slug` — Individual blog post
- `/write` — Blog editor (protected)
- `/admin/social-studio` — Social content admin
- `/admin/content-studio` — Content studio admin
- `/content-admin` — Content admin dashboard
- `/publishing` — Publishing overview

## What Was Fixed (Phases 7-12)

1. **RSS route order** — Moved `/rss` before `/:slug` to prevent slug catch-all from intercepting RSS requests
2. **Missing dev routes** — Added `/api/leads`, `/api/newsletter`, `/api/social-posts` to `server/dev.mjs`
3. **Blog API response** — Added `contentType` and `visibility` fields to blog list API response
4. **Visibility enforcement** — Single-post (`/:slug`) and RSS (`/rss`) routes now enforce `status=published` AND `visibility=public` (added in Phase 6 security fix, confirmed in Phase 7)

## Environment Parity

All three routes are mounted in both server entry points:
- `server/index.mjs` (production) — `/api/leads`, `/api/newsletter`, `/api/social-posts` already present
- `server/dev.mjs` (development) — Added during Phase 7 to match production

## Known Pre-existing Discrepancy

The Social Studio Admin UI (`SocialStudioAdmin.jsx`) uses localStorage-based statuses ("draft", "approved") while the `socialPosts` database table and API use a broader set ("idea", "drafted", "approved", "archived", "published"). This is pre-existing and does not affect functionality since the admin UI currently operates on localStorage, not the database API. When the UI integrates with the API, status mapping should be aligned.

## What Was Intentionally NOT Changed

- No files were deleted or reorganized
- No automation was added
- No new features were introduced
- Pre-existing parallel systems (contentDrafts, postDrafts) were left intact
- Social Studio Admin's localStorage-based drafts were not migrated to the database
- Newsletter signup was not added to any new pages (readiness only)
