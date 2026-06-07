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
3. `server/db/ensureSchema.mjs` — a `CREATE TABLE IF NOT EXISTS ...` boot
   "safety net" referenced in comments and `server/routes/sop.mjs` remediation
   text. **It is dead code: `ensureSchema()` is never imported or called
   anywhere.** Its `IF NOT EXISTS` DDL also historically drifted from
   `shared/schema.mjs` (it had the old analytics_events shape), so even if wired
   it would not fix an already-existing mis-shaped table.

**Why this matters:** a fresh DB, a disaster-recovery restore, or any table that
was created from an older definition will silently 500 on the first write that
touches a drifted column. There is no `npm run db:push` script either.

**How to apply / fix drift today:** identify the canonical shape in
`shared/schema.mjs`, check the live table with `information_schema.columns`, and
if it's empty, drop + recreate it directly with SQL matching the canonical shape
(or ALTER if it has data). Do NOT assume a boot bootstrap will heal it.

**Durable improvement (not yet done — needs user sign-off, larger scope):** make
provisioning deterministic — either wire `ensureSchema()` at boot AND keep its
DDL in lockstep with `shared/schema.mjs`, or repoint `drizzle.config.ts` at the
real runtime schema and generate proper migrations.
