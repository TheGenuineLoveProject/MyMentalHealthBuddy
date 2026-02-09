# Publishing Content — Canonical Paths

## Structure
- `content/publishing/blog/` — Canonical blog content (legacy: `content/blog/`)
- `content/publishing/newsletter/` — Newsletter drafts and sequences
- `content/publishing/templates/` — Reusable templates (weekly, welcome, crisis footer, style guide)
- `content/publishing/calendar/` — Editorial calendar
- `content/publishing/pillars.json` — 12 content pillars taxonomy
- `content/publishing/publishingRegistry.json` — Single source of truth for all publishing items

## Legacy Locations (DO NOT MOVE — loaders search both)
- `content/blog/index.json` + `content/blog/posts/` — Blog post source files
- `content/newsletter/` — Newsletter templates and drafts

## Rules
- One registry file only. No duplicates.
- All CTA links must point to allowed routes.
- All content must pass tone audit (no urgency, shame, medical claims).
- Manual-first: no auto-posting, no auto-sending.
