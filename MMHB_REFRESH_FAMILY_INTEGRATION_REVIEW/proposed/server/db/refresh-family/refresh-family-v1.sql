-- MMHB refresh-family prototype v1. QUALIFICATION ONLY; not an approved live migration.
-- The local test runner applies this only inside a newly initialized private cluster.
-- No raw refresh token is stored. All functions use invoker rights.
BEGIN;
CREATE SCHEMA mmhb_refresh_v1;
CREATE TABLE mmhb_refresh_v1.installation (
  version integer PRIMARY KEY CHECK (version = 1),
  installed_at timestamptz NOT NULL DEFAULT clock_timestamp()
);
CREATE TABLE mmhb_refresh_v1.families (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  expires_at timestamptz NOT NULL,
  revoked_at timestamptz
);
CREATE INDEX refresh_family_user_idx ON mmhb_refresh_v1.families(user_id);
CREATE INDEX refresh_family_expiry_idx ON mmhb_refresh_v1.families(expires_at);
CREATE TABLE mmhb_refresh_v1.credentials (
  token_hash text PRIMARY KEY CHECK (token_hash ~ '^[0-9a-f]{64}$'),
  id uuid NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  family_id uuid NOT NULL REFERENCES mmhb_refresh_v1.families(id) ON DELETE CASCADE,
  issued_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  expires_at timestamptz NOT NULL,
  consumed_at timestamptz
);
CREATE UNIQUE INDEX one_unconsumed_credential_per_family
  ON mmhb_refresh_v1.credentials(family_id) WHERE consumed_at IS NULL;

CREATE FUNCTION mmhb_refresh_v1.require_ready() RETURNS void
LANGUAGE plpgsql SET search_path = pg_catalog AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM mmhb_refresh_v1.installation WHERE version=1) THEN
    RAISE EXCEPTION 'REFRESH_FAMILY_MIGRATION_REQUIRED' USING ERRCODE='55000';
  END IF;
END $$;

CREATE FUNCTION mmhb_refresh_v1.valid_hash(p_hash text) RETURNS boolean
LANGUAGE sql IMMUTABLE SET search_path = pg_catalog AS $$
  SELECT p_hash IS NOT NULL AND p_hash ~ '^[0-9a-f]{64}$'
$$;

CREATE FUNCTION mmhb_refresh_v1.reject_legacy_write() RETURNS trigger
LANGUAGE plpgsql SET search_path = pg_catalog AS $$
BEGIN
  RAISE EXCEPTION 'LEGACY_REFRESH_WRITES_DISABLED' USING ERRCODE='55000';
END $$;

-- Deliberate cutover operation. Requires ALL old application writers stopped.
-- A statement-level trigger rejects even a DELETE that would match zero rows.
-- Legacy timestamp values are interpreted as UTC; that assumption must be
-- verified against the real deployment before considering a live migration.
CREATE FUNCTION mmhb_refresh_v1.adopt_legacy() RETURNS integer
LANGUAGE plpgsql SET search_path = pg_catalog AS $$
DECLARE n integer;
BEGIN
  PERFORM pg_advisory_xact_lock(1835886690, 1);
  IF EXISTS (SELECT 1 FROM mmhb_refresh_v1.installation WHERE version=1) THEN
    RAISE EXCEPTION 'MIGRATION_ALREADY_APPLIED' USING ERRCODE='55000';
  END IF;
  LOCK TABLE public.refresh_tokens IN ACCESS EXCLUSIVE MODE;
  IF current_setting('TimeZone') <> 'UTC' THEN
    RAISE EXCEPTION 'MIGRATION_REQUIRES_UTC_SESSION' USING ERRCODE='55000';
  END IF;
  IF EXISTS (SELECT 1 FROM mmhb_refresh_v1.families) OR
     EXISTS (SELECT 1 FROM mmhb_refresh_v1.credentials) THEN
    RAISE EXCEPTION 'MIGRATION_TARGET_NOT_EMPTY' USING ERRCODE='55000';
  END IF;
  IF EXISTS (SELECT 1 FROM public.refresh_tokens GROUP BY token_hash HAVING count(*)>1) THEN
    RAISE EXCEPTION 'LEGACY_DUPLICATE_HASHES' USING ERRCODE='23505';
  END IF;
  IF EXISTS (SELECT 1 FROM public.refresh_tokens r
             WHERE NOT mmhb_refresh_v1.valid_hash(r.token_hash) OR r.expires_at IS NULL) THEN
    RAISE EXCEPTION 'LEGACY_INVALID_CREDENTIAL_METADATA' USING ERRCODE='23514';
  END IF;
  -- Use the same user-before-family lock order as runtime security operations.
  PERFORM u.id FROM public.users u
    WHERE EXISTS (SELECT 1 FROM public.refresh_tokens r WHERE r.user_id=u.id)
    ORDER BY u.id FOR UPDATE;
  IF EXISTS (SELECT 1 FROM public.refresh_tokens r
             WHERE NOT EXISTS (SELECT 1 FROM public.users u WHERE u.id=r.user_id)) THEN
    RAISE EXCEPTION 'LEGACY_ORPHAN_CREDENTIALS' USING ERRCODE='23503';
  END IF;
  INSERT INTO mmhb_refresh_v1.families(id,user_id,created_at,expires_at)
    SELECT id,user_id,coalesce(created_at AT TIME ZONE 'UTC',clock_timestamp()),
           expires_at AT TIME ZONE 'UTC' FROM public.refresh_tokens;
  INSERT INTO mmhb_refresh_v1.credentials(id,token_hash,family_id,issued_at,expires_at)
    SELECT id,token_hash,id,coalesce(created_at AT TIME ZONE 'UTC',clock_timestamp()),
           expires_at AT TIME ZONE 'UTC' FROM public.refresh_tokens;
  GET DIAGNOSTICS n = ROW_COUNT;
  EXECUTE 'CREATE TRIGGER mmhb_legacy_refresh_readonly BEFORE INSERT OR UPDATE OR DELETE OR TRUNCATE ON public.refresh_tokens FOR EACH STATEMENT EXECUTE FUNCTION mmhb_refresh_v1.reject_legacy_write()';
  INSERT INTO mmhb_refresh_v1.installation(version) VALUES(1);
  RETURN n;
END $$;

CREATE FUNCTION mmhb_refresh_v1.issue(p_user uuid,p_hash text) RETURNS jsonb
LANGUAGE plpgsql SET search_path = pg_catalog AS $$
DECLARE f uuid; expiry timestamptz;
BEGIN
  PERFORM mmhb_refresh_v1.require_ready();
  IF NOT mmhb_refresh_v1.valid_hash(p_hash) THEN
    RAISE EXCEPTION 'INVALID_REFRESH_HASH' USING ERRCODE='22023';
  END IF;
  PERFORM id FROM public.users WHERE id=p_user FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'REFRESH_USER_NOT_FOUND' USING ERRCODE='23503'; END IF;
  expiry := clock_timestamp()+interval '720 hours';
  INSERT INTO mmhb_refresh_v1.families(user_id,expires_at) VALUES(p_user,expiry) RETURNING id INTO f;
  INSERT INTO mmhb_refresh_v1.credentials(token_hash,family_id,expires_at) VALUES(p_hash,f,expiry);
  RETURN jsonb_build_object('familyId',f,'tokenHash',p_hash,'expiresAt',expiry);
END $$;

CREATE FUNCTION mmhb_refresh_v1.find_valid(p_hash text) RETURNS jsonb
LANGUAGE plpgsql SET search_path = pg_catalog AS $$
DECLARE result jsonb;
BEGIN
  PERFORM mmhb_refresh_v1.require_ready();
  IF NOT mmhb_refresh_v1.valid_hash(p_hash) THEN RETURN NULL; END IF;
  SELECT jsonb_build_object('id',c.id,'userId',f.user_id,'tokenHash',c.token_hash,
                           'expiresAt',c.expires_at,'familyId',f.id)
    INTO result
    FROM mmhb_refresh_v1.credentials c JOIN mmhb_refresh_v1.families f ON f.id=c.family_id
    WHERE c.token_hash=p_hash AND c.consumed_at IS NULL AND c.expires_at>clock_timestamp()
      AND f.revoked_at IS NULL AND f.expires_at>clock_timestamp();
  RETURN result;
END $$;

-- Concurrent duplicate refresh returns NULL, preserving the existing 409 policy.
-- This is NOT a claim of strict OAuth replay-triggered family revocation.
CREATE FUNCTION mmhb_refresh_v1.rotate(p_old text,p_new text) RETURNS jsonb
LANGUAGE plpgsql SET search_path = pg_catalog AS $$
DECLARE uid uuid; fid uuid; family mmhb_refresh_v1.families%ROWTYPE;
        credential mmhb_refresh_v1.credentials%ROWTYPE; now_at timestamptz; expiry timestamptz;
BEGIN
  PERFORM mmhb_refresh_v1.require_ready();
  IF NOT mmhb_refresh_v1.valid_hash(p_old) OR NOT mmhb_refresh_v1.valid_hash(p_new) THEN RETURN NULL; END IF;
  IF p_old=p_new THEN RAISE EXCEPTION 'REFRESH_REPLACEMENT_MUST_DIFFER' USING ERRCODE='22023'; END IF;
  SELECT f.user_id,f.id INTO uid,fid FROM mmhb_refresh_v1.credentials c
    JOIN mmhb_refresh_v1.families f ON f.id=c.family_id WHERE c.token_hash=p_old;
  IF NOT FOUND THEN RETURN NULL; END IF;
  PERFORM id FROM public.users WHERE id=uid FOR UPDATE;
  IF NOT FOUND THEN RETURN NULL; END IF;
  SELECT * INTO family FROM mmhb_refresh_v1.families WHERE id=fid FOR UPDATE;
  IF NOT FOUND OR family.revoked_at IS NOT NULL THEN RETURN NULL; END IF;
  SELECT * INTO credential FROM mmhb_refresh_v1.credentials
    WHERE token_hash=p_old AND family_id=fid FOR UPDATE;
  IF NOT FOUND THEN RETURN NULL; END IF;
  now_at := clock_timestamp();
  IF credential.consumed_at IS NOT NULL OR credential.expires_at<=now_at OR family.expires_at<=now_at THEN RETURN NULL; END IF;
  expiry := now_at+interval '720 hours';
  UPDATE mmhb_refresh_v1.credentials SET consumed_at=now_at WHERE token_hash=p_old;
  INSERT INTO mmhb_refresh_v1.credentials(token_hash,family_id,issued_at,expires_at)
    VALUES(p_new,fid,now_at,expiry);
  UPDATE mmhb_refresh_v1.families SET expires_at=expiry WHERE id=fid;
  RETURN jsonb_build_object('userId',uid,'familyId',fid,'tokenHash',p_new,'expiresAt',expiry);
END $$;

-- A consumed predecessor still identifies its family for explicit logout.
CREATE FUNCTION mmhb_refresh_v1.revoke(p_hash text,p_user uuid DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql SET search_path = pg_catalog AS $$
DECLARE uid uuid; fid uuid; revoked timestamptz;
BEGIN
  PERFORM mmhb_refresh_v1.require_ready();
  IF NOT mmhb_refresh_v1.valid_hash(p_hash) THEN
    RETURN jsonb_build_object('revoked',false,'revokedCount',0);
  END IF;
  SELECT f.user_id,f.id INTO uid,fid FROM mmhb_refresh_v1.credentials c
    JOIN mmhb_refresh_v1.families f ON f.id=c.family_id WHERE c.token_hash=p_hash;
  IF NOT FOUND OR (p_user IS NOT NULL AND p_user<>uid) THEN
    RETURN jsonb_build_object('revoked',false,'revokedCount',0);
  END IF;
  PERFORM id FROM public.users WHERE id=uid FOR UPDATE;
  IF NOT FOUND THEN RETURN jsonb_build_object('revoked',false,'revokedCount',0); END IF;
  SELECT revoked_at INTO revoked FROM mmhb_refresh_v1.families WHERE id=fid FOR UPDATE;
  IF NOT FOUND OR revoked IS NOT NULL THEN RETURN jsonb_build_object('revoked',false,'revokedCount',0); END IF;
  UPDATE mmhb_refresh_v1.families SET revoked_at=clock_timestamp() WHERE id=fid;
  -- Count logical sign-ins, not historical credential rows (at most one).
  RETURN jsonb_build_object('revoked',true,'revokedCount',1);
END $$;

CREATE FUNCTION mmhb_refresh_v1.revoke_user(p_user uuid) RETURNS integer
LANGUAGE plpgsql SET search_path = pg_catalog AS $$
DECLARE n integer;
BEGIN
  PERFORM mmhb_refresh_v1.require_ready();
  PERFORM id FROM public.users WHERE id=p_user FOR UPDATE;
  IF NOT FOUND THEN RETURN 0; END IF;
  UPDATE mmhb_refresh_v1.families SET revoked_at=clock_timestamp()
    WHERE user_id=p_user AND revoked_at IS NULL;
  GET DIAGNOSTICS n = ROW_COUNT;
  RETURN n;
END $$;

-- Bounded cleanup; never discard predecessor links from a live family.
CREATE FUNCTION mmhb_refresh_v1.prune_expired(p_limit integer DEFAULT 100) RETURNS integer
LANGUAGE plpgsql SET search_path = pg_catalog AS $$
DECLARE n integer;
BEGIN
  PERFORM mmhb_refresh_v1.require_ready();
  IF p_limit IS NULL OR p_limit<1 OR p_limit>1000 THEN
    RAISE EXCEPTION 'INVALID_CLEANUP_LIMIT' USING ERRCODE='22023';
  END IF;
  WITH doomed AS (
    SELECT id FROM mmhb_refresh_v1.families WHERE expires_at<=clock_timestamp()
    ORDER BY expires_at,id LIMIT p_limit FOR UPDATE SKIP LOCKED
  ) DELETE FROM mmhb_refresh_v1.families f USING doomed d WHERE f.id=d.id;
  GET DIAGNOSTICS n = ROW_COUNT;
  RETURN n;
END $$;
REVOKE ALL ON SCHEMA mmhb_refresh_v1 FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA mmhb_refresh_v1 FROM PUBLIC;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA mmhb_refresh_v1 FROM PUBLIC;
COMMIT;
