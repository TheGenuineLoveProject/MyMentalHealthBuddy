# Blog System Map

**Date**: 2026-02-09
**Decision**: Option A (preferred) — existing database-backed blog system is preserved

---

## Existing Blog Implementation

The blog system is a full database-backed CRUD system. No new routes or pages were added.

### Server
- **API Routes**: `server/routes/blog.mjs`
  - `GET /api/blog` — Public blog listing (search, tag, type filtering)
  - `GET /api/blog/:id` — Single post (public, increments view count)
  - `POST /api/blog` — Create post (auth required)
  - `PATCH /api/blog/:id` — Update post (auth required)
  - `DELETE /api/blog/:id` — Delete post (admin required)
  - `GET /api/blog/admin/stats` — Admin stats (admin required)
  - `GET /api/blog/rss` — RSS feed

### Frontend Pages
- **Blog Index**: `client/src/pages/BlogIndex.jsx` — Renders paginated list of published posts
- **Blog Post**: `client/src/pages/BlogPost.jsx` — Renders individual post with comments
- **Blog Editor**: `client/src/pages/BlogEditor.jsx` — Admin post creation/editing

### Route Registration
- Routes registered in `client/src/App.jsx`:
  - `/blog` → BlogIndex
  - `/blog/:slug` → BlogPost

### Database
- **Table**: `blog_posts` (defined in `shared/schema.mjs`)
  - Columns: id, title, slug, content, summary, content_type, visibility, status, tags, featured_image, author_id, author_name, reading_time_minutes, view_count, published_at, created_at, updated_at
  - Content types: blog_post, newsletter, reflection, essay, note
  - Visibility: public, private, draft

### Canonical Content Store
- **Source material**: `content/blog/posts/*.md` (9 markdown files with frontmatter)
- **Index**: `content/blog/index.json` (registry of all canonical posts)
- **Purpose**: These serve as editorial source material that can be published through the admin interface into the database-backed blog system

### Publishing Workflow
1. Write or edit markdown in `content/blog/posts/`
2. Register in `content/blog/index.json`
3. Run `node scripts/audit-publishing.mjs` — must PASS
4. Use the blog editor (`/blog/editor`) to create the post in the database
5. Set status to "published" and visibility to "public" when ready

### No Changes Made
- No routes were added, modified, or removed
- No pages were added, modified, or removed
- No database schema changes
- Existing blog system remains fully operational
