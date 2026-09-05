# A9F4R Schema Baseline and Residual-Convergence Runbook

## Status

**Design only. No database migration is authorized by this document.**

This runbook establishes the governance boundary between the historical
schema-reconstruction program and future forward-only migration management.

## Baseline policy

The repository does not currently have a trustworthy historical migration
ledger that can be safely treated as an authoritative replay history.

Therefore:

- do not fabricate historical migrations;
- do not use `drizzle-kit push` to establish history;
- do not replay the complete canonical DDL against the already-provisioned DB;
- treat the R9-qualified live database as an observed starting state;
- use one bounded forward convergence operation;
- after convergence, require forward-only governed migrations.

## R9-qualified starting state

- canonical tables: 81
- live tables: 81
- missing tables: 0
- extra tables: 0
- canonical columns: 620
- live columns: 624
- canonical standalone indexes: 75
- live standalone indexes: 80
- missing canonical indexes: 0
- canonical index semantic mismatches: 0
- modeled runtime indexes adopted and matched: 6

Remaining governed drift:

1. `journals.content`
2. `user_achievements.user_id`
3. `user_achievements.achievement_id`
4. `user_achievements.earned_at`
5. `idx_daily_quests_user_id`
6. `idx_discernment_lessons_belt`
7. `idx_tool_sessions_user_id`
8. `idx_user_achievements_user_id`
9. `idx_user_progress_user_id`
10. `webhook_events.processed_at` nullability

## Mandatory gates before execution

The forward SQL MUST NOT be executed until all of the following have passed:

1. A fresh R9-equivalent live preflight.
2. Backup creation/availability verification.
3. Restore verification against a non-production recovery target or equivalent
   provider-supported recovery proof.
4. Exact checksum verification of the forward SQL.
5. Explicit migration authorization.
6. A bounded maintenance or low-traffic execution window.
7. Post-apply canonical-vs-live verification.
8. Application regression and authentication qualification.

## Transaction strategy

The migration is intentionally fail-closed.

It:

- uses one PostgreSQL transaction;
- sets low lock and statement timeouts;
- acquires required locks before destructive DDL;
- rechecks zero-data conditions at execution time;
- verifies replacement indexes before deleting redundant indexes;
- verifies correctness invariants before proceeding;
- runs transaction-local postconditions before commit.

Any failed assertion aborts the transaction.

## Expected post-convergence state

- tables: 81
- columns: 620
- standalone indexes: 75
- canonical missing tables: 0
- canonical missing columns: 0
- canonical missing indexes: 0
- extra modeled drift: 0
- `webhook_events.processed_at`: `timestamptz DEFAULT now() NOT NULL`

## Rollback

The rollback SQL restores the pre-convergence *structure* only.

The forward migration may execute only when its data-preservation assertions
pass. The rollback should only be considered immediately after migration and
before incompatible subsequent writes.

## Explicitly prohibited shortcuts

Do not:

- run `drizzle-kit push`;
- run a full canonical replay;
- invent prior migration history;
- bypass the backup/restore gate;
- weaken unique indexes that current runtime correctness depends upon;
- perform cleanup outside the exact qualified residual set.
