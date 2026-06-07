---
name: Journal storage + API contract
description: How journaling persists and the split field contract every journal consumer depends on.
---

# Journal storage + API contract

Journaling is **DB-backed** via the `journals` table (Drizzle model in
`shared/schema.mjs`: id, userId, title, text, mood, createdAt, updatedAt).
All CRUD flows through `server/db/helpers.mjs` (`createJournalEntry`,
`getUserJournals`, `getJournalById`, `updateJournalEntry`, `deleteJournalEntry`,
`mapJournalEntry`) and the routes are thin wrappers.

**Why this exists:** there used to be two disconnected journal systems — the live
`/api/journal` route wrote to an in-memory Map (entries lost on restart) while the
DB `journals` table that dashboard/badges/analytics/stats read was never written.
The helpers that would have written it were dead + buggy (wrong drizzle keys
`user_id`/`created_at`, a non-existent `mood_ref_id` column). Unifying onto the DB
table fixed both the data-loss bug and the empty-stats bug.

## Two contracts that MUST be honored

- **Field split:** consumers are split on the body field name.
  `JournalPage`, `dashboard/Journal`, `JournalInsights` read `content`;
  `ShareReflection`, `useUserStats`, `dataExport` read `text`. The DB column is
  `text`. `mapJournalEntry` therefore emits BOTH `content` and `text` (same value)
  plus `mood`/`title`/`createdAt`/`updatedAt`/`id`/`userId`. Never drop either key.
- **Wrapper split:** `/api/journal` (singular) returns `{ ok, data }`;
  `/api/journals` (plural) returns a **BARE array**. Stats/insights/export/share
  consumers expect the bare array — point them at the plural route, not singular.

## Gotchas

- `getUserJournals` default is **unbounded** (no `.limit`). A default cap silently
  undercounts streaks/word-totals for active users — only cap when a caller asks.
- `:id` routes validate UUID format and return **400** (not 404, not a Postgres
  500) for malformed/non-existent ids — existing tests assert 400.
- All by-id helpers scope on `(id AND userId)` for ownership isolation.
- Journal mutations must invalidate BOTH `['/api/journal']` and `['/api/journals']`
  or insights/stats stay stale after create/update/delete.
- `mood` column was added via the canonical-SQL dual-edit pattern (see
  schema-provisioning-drift.md): CREATE block + idempotent ALTER.
