# Publishing Model — The Genuine Love Project

## Overview

The platform uses a **single canonical content model** backed by the existing `blog_posts` database table. Rather than creating parallel content systems, all publishable content types share one table with a `content_type` discriminator.

## Content Types

| Type | `content_type` value | Description |
|------|---------------------|-------------|
| Blog Post | `blog_post` | Standard articles, guides, wellness insights |
| Newsletter Issue | `newsletter` | Editorial newsletter content (not transactional emails) |
| Reflection | `reflection` | Long-form personal or guided reflections |
| Essay | `essay` | Public essays on wellness, healing, growth |
| Note | `note` | Short-form public notes or thoughts |

## Schema Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Auto | Primary key |
| `title` | varchar(255) | Yes | Content title |
| `slug` | varchar(255) | Yes | URL-safe unique identifier |
| `content` | text | Yes | Full body content |
| `excerpt` | text | No | Short summary (auto-generated if omitted) |
| `authorId` | UUID | Yes | Reference to `users.id` |
| `status` | varchar(20) | Yes | Workflow state: `draft` or `published` |
| `contentType` | varchar(30) | Yes | Discriminator: `blog_post`, `newsletter`, `reflection`, `essay`, `note` |
| `visibility` | varchar(20) | Yes | Access level: `public`, `private`, or `draft` |
| `publishedAt` | timestamp | No | Set when status becomes `published` |
| `readingTimeMinutes` | integer | Auto | Calculated from word count |
| `tags` | text | No | Comma-separated tags for categorization |
| `featuredImage` | text | No | URL to header/cover image |
| `createdAt` | timestamp | Auto | Record creation time |
| `updatedAt` | timestamp | Auto | Last modification time |

## Visibility Rules

- **public**: Visible to all visitors on the public blog/content pages
- **private**: Visible only to the author or admin users
- **draft**: Not visible publicly; used during writing/review

## Status vs Visibility

These are intentionally separate concerns:

- `status` controls the **workflow** (draft → published)
- `visibility` controls the **audience** (public / private / draft)

A post can be `status: published` + `visibility: private` (published internally but not shown publicly).

## API Endpoints

All content types share the existing blog API:

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/blog` | List published public content |
| GET | `/api/blog/:slug` | Read single post by slug |
| POST | `/api/blog` | Create new content (any type) |
| PUT | `/api/blog/:id` | Update content |
| DELETE | `/api/blog/:id` | Delete content |
| GET | `/api/blog/user/drafts` | List user's drafts |
| GET | `/api/blog/admin` | Admin: list all content |
| GET | `/api/blog/rss` | RSS feed of published content |

## Content Type Filtering

The public listing endpoint (`GET /api/blog`) supports filtering by content type:

```
GET /api/blog?type=newsletter
GET /api/blog?type=reflection
```

## Design Decisions

1. **Single table, not multiple**: Avoids duplicate logic, duplicate admin UIs, and parallel content systems
2. **No external CMS**: Content is managed through the existing admin API and future admin UI
3. **No editor UI yet**: Content creation happens through API calls or a future admin editor
4. **No automation**: Publishing is always a manual, human-in-the-loop action
5. **Backward compatible**: Existing blog posts default to `content_type: blog_post` and `visibility: public`

## Email Separation

Newsletter content stored here is **editorial content only** — the actual article/issue text. Sending newsletters is a separate concern handled by the email infrastructure (Resend). See the newsletter readiness documentation for the separation between:

- **Transactional emails** (welcome, password reset, billing) → `server/services/email.mjs`
- **Editorial newsletters** (content distribution) → future, built on this model

## Next Steps (Not Yet Implemented)

- Admin content editor UI
- Newsletter distribution integration
- Content preview for drafts
- Scheduled publishing (human-approved only)
