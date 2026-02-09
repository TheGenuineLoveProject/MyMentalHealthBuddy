# Publishing + Newsletter + Social — READY

**Date**: 2026-02-09  
**STATUS: PASS**

---

## WHAT EXISTS NOW

### Blog System

| Route | Description | Status |
|-------|-------------|--------|
| `/blog` | Blog index page | Working |
| `/blog/:slug` | Individual post page | Working |
| `GET /api/blog` | Public blog API (published only) | Working |
| `GET /api/blog/:slug` | Public single post API | Working |
| `GET /api/blog/rss` | RSS feed (XML) | Working |
| `GET /api/blog/admin` | Admin: all posts (requires auth+admin) | Working |
| `GET /api/blog/admin/stats` | Admin: views, signups, drafts (requires auth+admin) | Working |
| `POST /api/blog/admin/test-send` | Admin: test-send newsletter draft to self (requires auth+admin) | Working |

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

### Newsletter Draft (Not Sent)

| Slug | Title | Content Type | Status | Visibility |
|------|-------|-------------|--------|------------|
| `youre-not-behind-welcome` | You're Not Behind | newsletter | draft | draft |

### Newsletter System

| Component | File | Status |
|-----------|------|--------|
| Newsletter signup component | `client/src/components/NewsletterSignup.jsx` | Working (consent checkbox required) |
| Leads API (signup storage) | `server/routes/leads.mjs` | Working (validates email + consent) |
| Newsletter admin page | `client/src/pages/admin/NewsletterAdmin.jsx` | Working (admin-gated) |
| Newsletter admin route | `/admin/newsletter` | Working (AdminGuard) |
| Test-send API | `POST /api/blog/admin/test-send` | Working (sends only to admin's email) |
| Subscriber count display | Admin stats API | Working |
| Signups-by-day chart | Admin stats API (last 30 days) | Working |
| Draft list | Admin stats API | Working |

### Social Content Studio

| Route | Page | File | Admin-Gated |
|-------|------|------|:-----------:|
| `/admin/social-studio` | Main Studio | `SocialStudioAdmin.jsx` | Yes |
| `/admin/social` | Dashboard | `SocialDashboard.jsx` | Yes |
| `/admin/social-generator` | Draft Generator | `SocialGenerator.jsx` | Yes |
| `/admin/social-calendar` | Content Calendar | `SocialCalendar.jsx` | Yes |
| `/admin/social-analytics` | Analytics View | `SocialAnalytics.jsx` | Yes |
| `/admin/social-library` | Content Library | `SocialLibrary.jsx` | Yes |

### Social Studio Features

| Feature | Status |
|---------|--------|
| Content calendar (list/grid view) | Working |
| Draft generator (AI-assisted) | Working |
| Compliance checker (trauma-informed) | Working |
| Canva export copy blocks (IG post, IG caption, Reel/TikTok, YouTube Short, X/Twitter) | Working |
| Platform-specific formatting | Working |
| Hashtag sets (brand, mental health, growth, engagement) | Working |
| Newsletter admin link from studio | Working |

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

# Blog index (should return 9 published posts)
curl -s http://localhost:5000/api/blog | python3 -c "import json,sys; d=json.load(sys.stdin); print(f'{len(d[\"data\"])} posts')"

# Individual post
curl -s http://localhost:5000/api/blog/welcome-to-genuine-love | python3 -c "import json,sys; d=json.load(sys.stdin); print(d['data']['title'])"

# All 5 canonical posts
for slug in welcome-to-genuine-love how-to-use-this-platform-gently why-this-exists gentle-daily-practice privacy-safety-commitments; do
  code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/blog/$slug)
  echo "$slug: $code"
done

# Newsletter draft hidden from public
curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/blog/youre-not-behind-welcome
# Expected: 404

# RSS feed
curl -s http://localhost:5000/api/blog/rss | head -5

# Key routes (all should return 200)
for route in / /blog /crisis /learn /dashboard /tools /admin/social-studio /admin/social /admin/social-generator /admin/social-calendar /admin/social-analytics /admin/social-library /admin/newsletter; do
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

## NEXT SINGLE RECOMMENDED STEP

**Public Surface Alignment**: Ensure homepage, pricing page, blog, newsletter signup, and social links all tell one coherent story. This means reviewing the homepage copy, verifying the CTA flow from homepage → blog → newsletter → tools, and confirming all footer links reflect the current content map.

---

## STATUS: PASS
