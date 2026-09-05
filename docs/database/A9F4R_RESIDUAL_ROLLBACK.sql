-- A9F4R STRUCTURAL ROLLBACK
-- DESIGN ARTIFACT ONLY — DO NOT EXECUTE WITHOUT EXPLICIT AUTHORIZATION.
--
-- This restores the pre-convergence database STRUCTURE.
-- It cannot restore data that would have been deleted from dropped
-- columns; therefore the forward migration is permitted only while
-- those columns satisfy its zero-data preconditions.
--
-- Rollback should be used only immediately after the bounded migration,
-- before incompatible new writes occur.

BEGIN;

SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '30s';
SET LOCAL idle_in_transaction_session_timeout = '60s';

LOCK TABLE
  "journals",
  "user_achievements",
  "daily_quests",
  "discernment_lessons",
  "tool_sessions",
  "user_progress",
  "webhook_events"
IN ACCESS EXCLUSIVE MODE;

DO $mmhb_rollback_preflight$
DECLARE
  n bigint;
BEGIN
  SELECT count(*)
  INTO n
  FROM user_achievements;

  IF n <> 0 THEN
    RAISE EXCEPTION
      'ROLLBACK_PRECONDITION_FAILED: user_achievements contains % rows',
      n;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema='public'
      AND table_name='journals'
      AND column_name='content'
  ) THEN
    RAISE EXCEPTION 'ROLLBACK_PRECONDITION_FAILED: journals.content already exists';
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
    RAISE EXCEPTION 'ROLLBACK_PRECONDITION_FAILED: legacy user_achievements column already exists';
  END IF;
END
$mmhb_rollback_preflight$;

ALTER TABLE "public"."journals"
  ADD COLUMN "content" text;

ALTER TABLE "public"."user_achievements"
  ADD COLUMN "user_id" uuid NOT NULL;

ALTER TABLE "public"."user_achievements"
  ADD COLUMN "achievement_id" uuid;

ALTER TABLE "public"."user_achievements"
  ADD COLUMN "earned_at"
    timestamp without time zone
    DEFAULT now()
    NOT NULL;

CREATE INDEX "idx_user_achievements_user_id"
  ON "public"."user_achievements"
  USING btree ("user_id");

CREATE INDEX "idx_daily_quests_user_id"
  ON "public"."daily_quests"
  USING btree ("user_id");

CREATE INDEX "idx_discernment_lessons_belt"
  ON "public"."discernment_lessons"
  USING btree ("belt");

CREATE INDEX "idx_tool_sessions_user_id"
  ON "public"."tool_sessions"
  USING btree ("user_id");

CREATE INDEX "idx_user_progress_user_id"
  ON "public"."user_progress"
  USING btree ("user_id");

ALTER TABLE "public"."webhook_events"
  ALTER COLUMN "processed_at"
  DROP NOT NULL;

COMMIT;
