BEGIN;

SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '30s';

DO $$
BEGIN
  IF to_regclass('public.mfa_login_challenges') IS NULL THEN
    RAISE EXCEPTION
      'C7-B3 rollback precondition failed: table is absent';
  END IF;
END
$$;

DROP TABLE "mfa_login_challenges";

DO $$
BEGIN
  IF to_regclass('public.mfa_login_challenges') IS NOT NULL THEN
    RAISE EXCEPTION
      'C7-B3 rollback postcondition failed: table still exists';
  END IF;
END
$$;

COMMIT;
