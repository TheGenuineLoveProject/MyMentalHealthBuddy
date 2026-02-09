# Publishing + Newsletter + Social — READY

**Date**: 2026-02-09  
**STATUS: PASS**

---

## WHAT EXISTS NOW

### Blog System

| Route | Description | Status |
|-------|-------------|--------|
| `/blog` | Blog index page with search and newsletter CTA | Working |
| `/blog/:slug` | Individual post with formatted content, comments, newsletter CTA | Working |
| `GET /api/blog` | Public blog API (published only) | Working |
| `GET /api/blog/:slug` | Public single post API (increments view count) | Working |
| `GET /api/blog/rss` | RSS feed with guid, Atom self-link, language | Working |
| `GET /api/blog/admin` | Admin: all posts (requires auth+admin) | Working |
| `GET /api/blog/admin/stats` | Admin: views, signups, signupsByDay, drafts | Working |
| `POST /api/blog/admin/test-send` | Admin: test-send newsletter draft to self | Working |
| `POST /api/blog` | Create new blog post (requires auth) | Working |
| `PUT /api/blog/:id` | Update blog post (requires auth+owner) | Working |

### Published Blog Posts (9)

| # | Slug | Title | Crisis Link | Disclaimer |
|---|------|-------|:-----------:|:----------:|
| 1 | `welcome-to-genuine-love` | Welcome to The Genuine Love Project | Yes | Yes |
| 2 | `how-to-use-this-platform-gently` | How to Use This Platform Gently | Yes | Yes |
| 3 | `why-this-exists` | Why This Exists | Yes | Yes |
| 4 | `gentle-daily-practice` | A Gentle Daily Practice: 5 Minutes for You | Yes | Yes |
| 5 | `privacy-safety-commitments` | Privacy and Safety: Our Commitments to You | Yes | Yes |
| 6 | `breathing-exercises-for-anxiety` | 5 Gentle Breathing Exercises for Anxious Moments | Yes | Yes |
| 7 | `power-of-daily-gratitude` | The Power of Daily Gratitude: Starting Small | Yes | Yes |
| 8 | `mindful-mornings-intention` | The Art of Mindful Mornings | Yes | Yes |
| 9 | `understanding-self-care-beyond-bubble-baths` | Understanding Self-Care: Beyond Bubble Baths | Yes | Yes |

### Newsletter System

| Component | Route / File | Status |
|-----------|-------------|--------|
| Dedicated newsletter page | `/newsletter` (Newsletter.jsx) | Working |
| Newsletter signup component | `NewsletterSignup.jsx` | Working (consent checkbox required) |
| Leads API (signup storage) | `POST /api/leads` | Working (validates email + consent) |
| Newsletter admin page | `/admin/newsletter` (NewsletterAdmin.jsx) | Working (admin-gated) |
| Newsletter CTA on blog index | BlogIndex.jsx bottom section | Working |
| Newsletter CTA on blog posts | BlogPost.jsx after article content | Working |
| Test-send API | `POST /api/blog/admin/test-send` | Working (admin's email only) |

### Newsletter Draft (Not Sent)

| Slug | Title | Content Type | Status | Visibility |
|------|-------|-------------|--------|------------|
| `youre-not-behind-welcome` | You're Not Behind | newsletter | draft | draft |

### Social Content Studio

| Route | Page | Admin-Gated |
|-------|------|:-----------:|
| `/admin/social-studio` | Main Studio with newsletter link | Yes |
| `/admin/social` | Dashboard | Yes |
| `/admin/social-generator` | Draft Generator with Canva Export | Yes |
| `/admin/social-calendar` | Content Calendar | Yes |
| `/admin/social-analytics` | Analytics View | Yes |
| `/admin/social-library` | Content Library | Yes |

### Content Rendering

Blog posts now render with structured formatting:
- `## Heading` → `<h2>` styled headings
- `### Subheading` → `<h3>` styled subheadings
- `- Bullet items` → `<ul>` styled lists
- `1. Numbered items` → `<ol>` styled lists
- Double newlines → `<p>` paragraph breaks

### Navigation Integration

Newsletter and blog links appear in:
- Main navbar (Blog link)
- Footer.jsx (Blog + Newsletter links)
- SacredFooter.jsx (Blog + Newsletter in explore section)
- sacred/SacredFooter.jsx (Blog + Newsletter in explore section)
- Blog index page (newsletter CTA at bottom)
- Blog post pages (newsletter CTA after content)

### RSS Feed

- Valid RSS 2.0 with `xmlns:atom` namespace
- `<guid isPermaLink="true">` for each item
- `<atom:link rel="self">` for feed autodiscovery
- `<language>en-us</language>` language declaration
- `<lastBuildDate>` timestamp

### Passive Observability (Admin-Only)

| Signal | Implementation | Public? |
|--------|---------------|:-------:|
| `blog_views_by_slug` | `view_count` column, incremented on GET | No |
| `blog_views_total` | Sum of view_count across posts | No |
| `newsletter_signups_total` | Count of leads table | No |
| `newsletter_signups_by_day` | GROUP BY DATE(created_at), last 30 days | No |
| `drafts_list` | All posts with status=draft | No |

---

## HOW TO TEST

```bash
# Health check
curl -s http://localhost:5000/api/health | python3 -m json.tool

# Blog index (9 published posts)
curl -s http://localhost:5000/api/blog | python3 -c "import json,sys; d=json.load(sys.stdin); print(f'{len(d[\"data\"])} posts')"

# Individual post with content type and view count
curl -s http://localhost:5000/api/blog/welcome-to-genuine-love | python3 -c "import json,sys; d=json.load(sys.stdin)['data']; print(f'title: {d[\"title\"]}'); print(f'viewCount: {d[\"viewCount\"]}'); print(f'contentType: {d[\"contentType\"]}')"

# All 5 canonical posts
for slug in welcome-to-genuine-love how-to-use-this-platform-gently why-this-exists gentle-daily-practice privacy-safety-commitments; do
  code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/blog/$slug)
  echo "$slug: $code"
done

# Newsletter draft hidden from public (expect 404)
curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/blog/youre-not-behind-welcome

# RSS feed with guid elements
curl -s http://localhost:5000/api/blog/rss | head -15

# Newsletter signup test
curl -s -X POST http://localhost:5000/api/leads -H "Content-Type: application/json" -d '{"email":"test@example.com","consent":true}'

# All key routes
for route in / /blog /newsletter /crisis /learn /dashboard /tools /admin/social-studio /admin/newsletter; do
  code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000$route)
  echo "$route: $code"
done
```

---

## WHAT IS MANUAL ONLY (Explicitly)

| Action | How | Automated? |
|--------|-----|:----------:|
| Sending newsletter emails | Admin clicks "Test Send to Me" (admin email only) | No |
| Bulk sending to subscribers | Use Resend dashboard with exported subscriber list | No |
| Social media posting | Copy text from Canva Export blocks, paste into platform | No |
| Publishing blog posts | Create via admin API, set status to "published" | No |
| Content approval | Human reviews draft before publishing | No |

**No auto-emails are configured.**  
**No auto-social-posting is configured.**  
**No tracking pixels or fingerprinting are used.**  
**No bulk email sending is implemented.**

---

## STATUS: PASS
