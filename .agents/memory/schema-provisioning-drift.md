---
name: Schema provisioning has no live auto-sync
description: Why live Postgres table shapes drift from shared/schema.mjs and silently 500 inserts, and where the three competing schema definitions live.
---

# Schema provisioning / drift

The runtime has **no reliable path that makes the live DB match the code's schema**.
There are three competing schema definitions and none of them auto-reconciles the
live database:

1. `shared/schema.mjs` — the **canonical runtime source of truth**. Every route
   queries through these Drizzle models (`server/db/connection.mjs` builds `db`
   from it). If a live table's columns differ from here, the insert/select fails
   at query time with a generic 500 (the route only logs `err.message`, so the
   real Postgres "column ... does not exist" is easy to miss).
2. `drizzle.config.ts` → points at `./database/schema/index.ts`, which only
   defines a handful of legacy tables (users, sessions, subscriptions,
   journal_entries, ai_interactions, business_events) and is **missing most
   runtime tables** (e.g. analytics_events). So `drizzle-kit push` is NOT a safe
   blanket reconcile tool here — it doesn't know about most tables and could
   touch unrelated ones.
3. `server/db/ensureSchema.mjs` — the boot "safety net". It was historically
   **dead code** with hand-maintained DDL that drifted from `shared/schema.mjs`.
   It has since been rewritten (see below).

**Why this matters:** a fresh DB, a disaster-recovery restore, or any table that
was created from an older definition will silently 500 on the first write that
touches a drifted column. There is no `npm run db:push` script either.

**How to fix an already-drifted live table:** identify the canonical shape in
`shared/schema.mjs`, check the live table with `information_schema.columns`
(ALWAYS filter `table_schema='public'` — there is a separate `stripe` schema with
~29 Stripe-sync tables, several sharing names like `subscriptions`; an unfiltered
column count double-counts and lies), and if empty, drop + recreate with SQL
matching the canonical shape (ALTER if it has data). `IF NOT EXISTS` bootstrap
will NOT heal a table that already exists with the wrong columns.

**How to ADD a column reproducibly (no db:push exists):** do BOTH, in
`server/db/schema.canonical.sql`, so every env self-heals on next boot via
`ensureSchema()`: (1) add the column to the `CREATE TABLE IF NOT EXISTS` block
(covers fresh DBs), AND (2) add a standalone idempotent
`ALTER TABLE "x" ADD COLUMN IF NOT EXISTS "col" type;` statement delimited by its
own `--> statement-breakpoint` (covers existing/prod DBs — the CREATE block is a
no-op there). Also add it to `shared/schema.mjs` (runtime source of truth). A
manual one-off `ALTER` on the live dev DB only fixes that one DB; without the
canonical-SQL edit, prod/staging silently 500 on first write.
**Why:** `ensureSchema()` replays canonical SQL on EVERY boot (it is NOT dead
code — confirmed live, statement count ticks up by exactly the number of new
statements you add, e.g. 140→141). Each statement is wrapped in try/catch, so
idempotent `IF NOT EXISTS` statements are safe to leave in permanently.

## Durable auto-provisioning (DONE)

Fresh-DB / restore self-heal now exists and is wired:
- `server/db/schema.canonical.sql` — generated, idempotent (`IF NOT EXISTS`)
  snapshot of all public tables+indexes, generated FROM `shared/schema.mjs` via
  `node scripts/generate-canonical-schema.mjs` (wraps `drizzle-kit generate` +
  transforms to IF NOT EXISTS). Regenerate after any schema.mjs change.
- `ensureSchema()` reads that file and applies each statement; it is invoked
  **non-blocking inside `server.on("listening")` via `setImmediate`** in
  `server/app.mjs`, so it can never block port-open or crash boot (a past DB hang
  at boot caused a port-never-opened crash-loop). All failures are logged+swallowed.

**Why:** the generated SQL is the right bootstrap source (cleaner than `pg_dump`,
which carries functions + 147 split constraints), and public schema matches the
models except `user_achievements` (a model stub). NOTE several models ARE 1-col
stubs (`subscriptions`, `support_circles`, `wellness_goals/insights/streaks`,
`user_journey_progress`) — bootstrapping reproduces them faithfully; that
incompleteness is a pre-existing design gap, not something the bootstrap fixes.

**Splitter footgun:** `drizzle-kit generate` puts the `--> statement-breakpoint`
marker STANDALONE after `CREATE TABLE` but INLINE (`...);--> statement-breakpoint`)
after `CREATE INDEX`. Split on the marker anywhere (`/-->\s*statement-breakpoint/`),
NOT with a line-anchored `^...$/m` regex — anchoring silently merges every index
into its preceding chunk (140 statements collapse to 79). Keep the literal marker
out of the file's header comments or the split severs the first real statement.
