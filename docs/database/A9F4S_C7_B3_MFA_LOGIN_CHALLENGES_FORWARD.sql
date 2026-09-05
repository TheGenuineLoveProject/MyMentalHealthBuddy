BEGIN;

SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '30s';

DO $$
BEGIN
  IF to_regclass('public.users') IS NULL THEN
    RAISE EXCEPTION
      'C7-B3 precondition failed: public.users is missing';
  END IF;

  IF to_regclass('public.mfa_login_challenges') IS NOT NULL THEN
    RAISE EXCEPTION
      'C7-B3 precondition failed: mfa_login_challenges already exists';
  END IF;
END
$$;

CREATE TABLE "mfa_login_challenges" (
  "jti_hash" varchar(64) PRIMARY KEY NOT NULL,
  "user_id" uuid NOT NULL,
  "expires_at" timestamptz NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL,

  CONSTRAINT "mfa_login_challenges_user_id_users_id_fk"
    FOREIGN KEY ("user_id")
    REFERENCES "users"("id")
    ON DELETE CASCADE
);

CREATE INDEX "idx_mfa_login_challenges_user"
  ON "mfa_login_challenges" ("user_id");

CREATE INDEX "idx_mfa_login_challenges_expires"
  ON "mfa_login_challenges" ("expires_at");

DO $$
DECLARE
  table_count integer;
  pk_count integer;
  fk_count integer;
  index_count integer;
BEGIN
  SELECT count(*)::int
  INTO table_count
  FROM information_schema.tables
  WHERE table_schema = 'public'
    AND table_name = 'mfa_login_challenges';

  SELECT count(*)::int
  INTO pk_count
  FROM pg_constraint c
  JOIN pg_class t
    ON t.oid = c.conrelid
  JOIN pg_namespace n
    ON n.oid = t.relnamespace
  WHERE n.nspname = 'public'
    AND t.relname = 'mfa_login_challenges'
    AND c.contype = 'p';

  SELECT count(*)::int
  INTO fk_count
  FROM pg_constraint c
  JOIN pg_class t
    ON t.oid = c.conrelid
  JOIN pg_namespace n
    ON n.oid = t.relnamespace
  WHERE n.nspname = 'public'
    AND t.relname = 'mfa_login_challenges'
    AND c.conname =
      'mfa_login_challenges_user_id_users_id_fk'
    AND c.contype = 'f';

  SELECT count(*)::int
  INTO index_count
  FROM pg_indexes
  WHERE schemaname = 'public'
    AND tablename = 'mfa_login_challenges'
    AND indexname IN (
      'idx_mfa_login_challenges_user',
      'idx_mfa_login_challenges_expires'
    );

  IF table_count <> 1
     OR pk_count <> 1
     OR fk_count <> 1
     OR index_count <> 2
  THEN
    RAISE EXCEPTION
      'C7-B3 postcondition failed: table=%, pk=%, fk=%, indexes=%',
      table_count,
      pk_count,
      fk_count,
      index_count;
  END IF;
END
$$;

COMMIT;
