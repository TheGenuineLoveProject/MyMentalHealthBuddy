-- A9F4R RESIDUAL CONVERGENCE
-- DESIGN ARTIFACT ONLY — DO NOT EXECUTE WITHOUT EXPLICIT RELEASE AUTHORIZATION.
--
-- Preconditions:
--   * backup/restore gate has passed;
--   * fresh R9-equivalent preflight has passed;
--   * maintenance/low-traffic window is active;
--   * application writes are controlled;
--   * exact canonical source has been qualified.
--
-- Purpose:
--   Remove four proven legacy columns,
--   remove five proven live-only redundant/obsolete indexes,
--   strengthen webhook_events.processed_at to NOT NULL.
--
-- This is NOT a historical migration reconstruction.
-- This is the first bounded forward convergence operation.

BEGIN;

SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '30s';
SET LOCAL idle_in_transaction_session_timeout = '60s';

-- Acquire all required table locks up front.
-- This makes the operation fail early instead of partially progressing.
LOCK TABLE
  "biometric_readings",
  "discernment_attempts"
IN SHARE UPDATE EXCLUSIVE MODE;

LOCK TABLE
  "journals",
  "user_achievements",
  "daily_quests",
  "discernment_lessons",
  "tool_sessions",
  "user_progress",
  "webhook_events"
IN ACCESS EXCLUSIVE MODE;

DO $mmhb_preflight$
DECLARE
  n bigint;
BEGIN
  -- Required legacy columns must still exist.
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema='public'
      AND table_name='journals'
      AND column_name='content'
  ) THEN
    RAISE EXCEPTION 'PRECONDITION_FAILED: journals.content missing';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema='public'
      AND table_name='user_achievements'
      AND column_name='user_id'
  ) THEN
    RAISE EXCEPTION 'PRECONDITION_FAILED: user_achievements.user_id missing';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema='public'
      AND table_name='user_achievements'
      AND column_name='achievement_id'
  ) THEN
    RAISE EXCEPTION 'PRECONDITION_FAILED: user_achievements.achievement_id missing';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema='public'
      AND table_name='user_achievements'
      AND column_name='earned_at'
  ) THEN
    RAISE EXCEPTION 'PRECONDITION_FAILED: user_achievements.earned_at missing';
  END IF;

  -- No historical journal content may be discarded.
  SELECT count(*)
  INTO n
  FROM journals
  WHERE content IS NOT NULL;

  IF n <> 0 THEN
    RAISE EXCEPTION
      'PRECONDITION_FAILED: journals.content has % non-null rows',
      n;
  END IF;

  -- user_achievements must remain empty because its historical
  -- columns represented a different, now-unowned model.
  SELECT count(*)
  INTO n
  FROM user_achievements;

  IF n <> 0 THEN
    RAISE EXCEPTION
      'PRECONDITION_FAILED: user_achievements contains % rows',
      n;
  END IF;

  -- No webhook row may violate the new NOT NULL invariant.
  SELECT count(*)
  INTO n
  FROM webhook_events
  WHERE processed_at IS NULL;

  IF n <> 0 THEN
    RAISE EXCEPTION
      'PRECONDITION_FAILED: webhook_events.processed_at has % NULL rows',
      n;
  END IF;

  -- All live-only retirement indexes must still exist.
  IF to_regclass('public.idx_daily_quests_user_id') IS NULL THEN
    RAISE EXCEPTION 'PRECONDITION_FAILED: idx_daily_quests_user_id missing';
  END IF;

  IF to_regclass('public.idx_discernment_lessons_belt') IS NULL THEN
    RAISE EXCEPTION 'PRECONDITION_FAILED: idx_discernment_lessons_belt missing';
  END IF;

  IF to_regclass('public.idx_tool_sessions_user_id') IS NULL THEN
    RAISE EXCEPTION 'PRECONDITION_FAILED: idx_tool_sessions_user_id missing';
  END IF;

  IF to_regclass('public.idx_user_achievements_user_id') IS NULL THEN
    RAISE EXCEPTION 'PRECONDITION_FAILED: idx_user_achievements_user_id missing';
  END IF;

  IF to_regclass('public.idx_user_progress_user_id') IS NULL THEN
    RAISE EXCEPTION 'PRECONDITION_FAILED: idx_user_progress_user_id missing';
  END IF;

  -- Replacement/canonical indexes must exist before redundant
  -- indexes are removed.
  IF to_regclass('public.idx_daily_quests_user_created') IS NULL THEN
    RAISE EXCEPTION 'PRECONDITION_FAILED: idx_daily_quests_user_created missing';
  END IF;

  IF to_regclass('public.idx_tool_sessions_user_completed') IS NULL THEN
    RAISE EXCEPTION 'PRECONDITION_FAILED: idx_tool_sessions_user_completed missing';
  END IF;

  IF to_regclass('public.uniq_discernment_lessons_belt_seq') IS NULL THEN
    RAISE EXCEPTION 'PRECONDITION_FAILED: uniq_discernment_lessons_belt_seq missing';
  END IF;

  IF to_regclass('public.uniq_user_progress_user_id') IS NULL THEN
    RAISE EXCEPTION 'PRECONDITION_FAILED: uniq_user_progress_user_id missing';
  END IF;

  -- Correctness invariants adopted into canonical ownership
  -- must remain present.
  IF to_regclass('public.uniq_biometric_readings_user_source_metric_time') IS NULL THEN
    RAISE EXCEPTION 'PRECONDITION_FAILED: biometric uniqueness invariant missing';
  END IF;

  IF to_regclass('public.uniq_discernment_first_correct') IS NULL THEN
    RAISE EXCEPTION 'PRECONDITION_FAILED: discernment uniqueness invariant missing';
  END IF;
END
$mmhb_preflight$;

-- Remove obsolete/redundant indexes first.
DROP INDEX "public"."idx_user_achievements_user_id";
DROP INDEX "public"."idx_daily_quests_user_id";
DROP INDEX "public"."idx_discernment_lessons_belt";
DROP INDEX "public"."idx_tool_sessions_user_id";
DROP INDEX "public"."idx_user_progress_user_id";

-- Remove proven legacy columns.
ALTER TABLE "public"."journals"
  DROP COLUMN "content";

ALTER TABLE "public"."user_achievements"
  DROP COLUMN "achievement_id";

ALTER TABLE "public"."user_achievements"
  DROP COLUMN "earned_at";

ALTER TABLE "public"."user_achievements"
  DROP COLUMN "user_id";

-- Strengthen the modeled webhook invariant.
ALTER TABLE "public"."webhook_events"
  ALTER COLUMN "processed_at"
  SET NOT NULL;

-- Transaction-local postconditions.
DO $mmhb_postflight$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema='public'
      AND table_name='journals'
      AND column_name='content'
  ) THEN
    RAISE EXCEPTION 'POSTCONDITION_FAILED: journals.content still exists';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema='public'
      AND table_name='user_achievements'
      AND column_name = ANY(
        ARRAY[
          'user_id',
          'achievement_id',
          'earned_at'
        ]::text[]
      )
  ) THEN
    RAISE EXCEPTION 'POSTCONDITION_FAILED: legacy user_achievements columns remain';
  END IF;

  IF to_regclass('public.idx_daily_quests_user_id') IS NOT NULL
     OR to_regclass('public.idx_discernment_lessons_belt') IS NOT NULL
     OR to_regclass('public.idx_tool_sessions_user_id') IS NOT NULL
     OR to_regclass('public.idx_user_achievements_user_id') IS NOT NULL
     OR to_regclass('public.idx_user_progress_user_id') IS NOT NULL
  THEN
    RAISE EXCEPTION 'POSTCONDITION_FAILED: residual index remains';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_catalog.pg_attribute a
    JOIN pg_catalog.pg_class t
      ON t.oid = a.attrelid
    JOIN pg_catalog.pg_namespace n
      ON n.oid = t.relnamespace
    WHERE n.nspname='public'
      AND t.relname='webhook_events'
      AND a.attname='processed_at'
      AND a.attnum > 0
      AND NOT a.attisdropped
      AND a.attnotnull
  ) THEN
    RAISE EXCEPTION
      'POSTCONDITION_FAILED: webhook_events.processed_at not NOT NULL';
  END IF;
END
$mmhb_postflight$;

COMMIT;
