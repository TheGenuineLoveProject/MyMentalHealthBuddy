#!/usr/bin/env python3
"""Run proposed refresh-family SQL ONLY in a newly created private PostgreSQL cluster.
No MMHB source edits, live-database connections, dependency installations or deployment.
Requires explicit --test-local. Production connection variables are never read or forwarded.
"""
from __future__ import annotations
import argparse, datetime, hashlib, json, os, re, shutil, stat, subprocess, sys, tempfile, time
from pathlib import Path

ROOT=Path('/home/runner/workspace')
WORK=ROOT/'.local/mmhb-candidates/a4-63ff8372'
STORE=ROOT/'.git/mmhb-a4-backup-lcyKVK/recheck-7g_es8ex/restore.git'
COMMIT='cb2e164a8fc19e7fab3a539a9facb4b4b562eaca'
BASE='63ff8372d07368a5434c11ff58bdf87bb468449d'
EXPECTED={
'server/replit_integrations/auth/storage.mjs':'9eddeef15ea27bac5ecc38da25e61b4487b87b2f7e285e5d718e221a90fae7da',
'server/routes/auth.mjs':'32c9aa86bfe2704e7e6872e9ca2cb51de2f37136fd62eab921f40e451ad601a9',
'server/security/csrf.mjs':'e700c729408614c4a638365ef47a7b4a5c043112489b8be3f15b93d7178ce8bf',
'client/src/context/AuthContext.jsx':'b63819acaacde6767da9df8c4901e1958131ec9d82d4b073cd66f35dbddcd046',
'client/src/api/fetchWithAuth.js':'7dc437f7f008d48a3dbd4cb3b597821be67701de7d7d7b9b9505d5d0d8482660',
'client/src/api/authGeneration.js':'7a47bd16d66b2db4cbed1047d79a5a2a7f1001be365e7c4003512c04bb8754ef',
'server/services/refreshTokens.service.mjs':'5a9756caa3c772ac8c70f4a7860372dd42895e7df47c4e0956e42fa041528e8e',
}
GENERATOR_BLOB='d5991c8897b1ed61441c207b1ac852c98943b94a'
PROTOTYPE_SQL="-- MMHB refresh-family prototype v1. QUALIFICATION ONLY; not an approved live migration.\n-- The local test runner applies this only inside a newly initialized private cluster.\n-- No raw refresh token is stored. All functions use invoker rights.\nBEGIN;\nCREATE SCHEMA mmhb_refresh_v1;\nCREATE TABLE mmhb_refresh_v1.installation (\n  version integer PRIMARY KEY CHECK (version = 1),\n  installed_at timestamptz NOT NULL DEFAULT clock_timestamp()\n);\nCREATE TABLE mmhb_refresh_v1.families (\n  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),\n  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,\n  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),\n  expires_at timestamptz NOT NULL,\n  revoked_at timestamptz\n);\nCREATE INDEX refresh_family_user_idx ON mmhb_refresh_v1.families(user_id);\nCREATE INDEX refresh_family_expiry_idx ON mmhb_refresh_v1.families(expires_at);\nCREATE TABLE mmhb_refresh_v1.credentials (\n  token_hash text PRIMARY KEY CHECK (token_hash ~ '^[0-9a-f]{64}$'),\n  id uuid NOT NULL UNIQUE DEFAULT gen_random_uuid(),\n  family_id uuid NOT NULL REFERENCES mmhb_refresh_v1.families(id) ON DELETE CASCADE,\n  issued_at timestamptz NOT NULL DEFAULT clock_timestamp(),\n  expires_at timestamptz NOT NULL,\n  consumed_at timestamptz\n);\nCREATE UNIQUE INDEX one_unconsumed_credential_per_family\n  ON mmhb_refresh_v1.credentials(family_id) WHERE consumed_at IS NULL;\n\nCREATE FUNCTION mmhb_refresh_v1.require_ready() RETURNS void\nLANGUAGE plpgsql SET search_path = pg_catalog AS $$\nBEGIN\n  IF NOT EXISTS (SELECT 1 FROM mmhb_refresh_v1.installation WHERE version=1) THEN\n    RAISE EXCEPTION 'REFRESH_FAMILY_MIGRATION_REQUIRED' USING ERRCODE='55000';\n  END IF;\nEND $$;\n\nCREATE FUNCTION mmhb_refresh_v1.valid_hash(p_hash text) RETURNS boolean\nLANGUAGE sql IMMUTABLE SET search_path = pg_catalog AS $$\n  SELECT p_hash IS NOT NULL AND p_hash ~ '^[0-9a-f]{64}$'\n$$;\n\nCREATE FUNCTION mmhb_refresh_v1.reject_legacy_write() RETURNS trigger\nLANGUAGE plpgsql SET search_path = pg_catalog AS $$\nBEGIN\n  RAISE EXCEPTION 'LEGACY_REFRESH_WRITES_DISABLED' USING ERRCODE='55000';\nEND $$;\n\n-- Deliberate cutover operation. Requires ALL old application writers stopped.\n-- A statement-level trigger rejects even a DELETE that would match zero rows.\n-- Legacy timestamp values are interpreted as UTC; that assumption must be\n-- verified against the real deployment before considering a live migration.\nCREATE FUNCTION mmhb_refresh_v1.adopt_legacy() RETURNS integer\nLANGUAGE plpgsql SET search_path = pg_catalog AS $$\nDECLARE n integer;\nBEGIN\n  PERFORM pg_advisory_xact_lock(1835886690, 1);\n  IF EXISTS (SELECT 1 FROM mmhb_refresh_v1.installation WHERE version=1) THEN\n    RAISE EXCEPTION 'MIGRATION_ALREADY_APPLIED' USING ERRCODE='55000';\n  END IF;\n  LOCK TABLE public.refresh_tokens IN ACCESS EXCLUSIVE MODE;\n  IF current_setting('TimeZone') <> 'UTC' THEN\n    RAISE EXCEPTION 'MIGRATION_REQUIRES_UTC_SESSION' USING ERRCODE='55000';\n  END IF;\n  IF EXISTS (SELECT 1 FROM mmhb_refresh_v1.families) OR\n     EXISTS (SELECT 1 FROM mmhb_refresh_v1.credentials) THEN\n    RAISE EXCEPTION 'MIGRATION_TARGET_NOT_EMPTY' USING ERRCODE='55000';\n  END IF;\n  IF EXISTS (SELECT 1 FROM public.refresh_tokens GROUP BY token_hash HAVING count(*)>1) THEN\n    RAISE EXCEPTION 'LEGACY_DUPLICATE_HASHES' USING ERRCODE='23505';\n  END IF;\n  IF EXISTS (SELECT 1 FROM public.refresh_tokens r\n             WHERE NOT mmhb_refresh_v1.valid_hash(r.token_hash) OR r.expires_at IS NULL) THEN\n    RAISE EXCEPTION 'LEGACY_INVALID_CREDENTIAL_METADATA' USING ERRCODE='23514';\n  END IF;\n  -- Use the same user-before-family lock order as runtime security operations.\n  PERFORM u.id FROM public.users u\n    WHERE EXISTS (SELECT 1 FROM public.refresh_tokens r WHERE r.user_id=u.id)\n    ORDER BY u.id FOR UPDATE;\n  IF EXISTS (SELECT 1 FROM public.refresh_tokens r\n             WHERE NOT EXISTS (SELECT 1 FROM public.users u WHERE u.id=r.user_id)) THEN\n    RAISE EXCEPTION 'LEGACY_ORPHAN_CREDENTIALS' USING ERRCODE='23503';\n  END IF;\n  INSERT INTO mmhb_refresh_v1.families(id,user_id,created_at,expires_at)\n    SELECT id,user_id,coalesce(created_at AT TIME ZONE 'UTC',clock_timestamp()),\n           expires_at AT TIME ZONE 'UTC' FROM public.refresh_tokens;\n  INSERT INTO mmhb_refresh_v1.credentials(id,token_hash,family_id,issued_at,expires_at)\n    SELECT id,token_hash,id,coalesce(created_at AT TIME ZONE 'UTC',clock_timestamp()),\n           expires_at AT TIME ZONE 'UTC' FROM public.refresh_tokens;\n  GET DIAGNOSTICS n = ROW_COUNT;\n  EXECUTE 'CREATE TRIGGER mmhb_legacy_refresh_readonly BEFORE INSERT OR UPDATE OR DELETE OR TRUNCATE ON public.refresh_tokens FOR EACH STATEMENT EXECUTE FUNCTION mmhb_refresh_v1.reject_legacy_write()';\n  INSERT INTO mmhb_refresh_v1.installation(version) VALUES(1);\n  RETURN n;\nEND $$;\n\nCREATE FUNCTION mmhb_refresh_v1.issue(p_user uuid,p_hash text) RETURNS jsonb\nLANGUAGE plpgsql SET search_path = pg_catalog AS $$\nDECLARE f uuid; expiry timestamptz;\nBEGIN\n  PERFORM mmhb_refresh_v1.require_ready();\n  IF NOT mmhb_refresh_v1.valid_hash(p_hash) THEN\n    RAISE EXCEPTION 'INVALID_REFRESH_HASH' USING ERRCODE='22023';\n  END IF;\n  PERFORM id FROM public.users WHERE id=p_user FOR UPDATE;\n  IF NOT FOUND THEN RAISE EXCEPTION 'REFRESH_USER_NOT_FOUND' USING ERRCODE='23503'; END IF;\n  expiry := clock_timestamp()+interval '720 hours';\n  INSERT INTO mmhb_refresh_v1.families(user_id,expires_at) VALUES(p_user,expiry) RETURNING id INTO f;\n  INSERT INTO mmhb_refresh_v1.credentials(token_hash,family_id,expires_at) VALUES(p_hash,f,expiry);\n  RETURN jsonb_build_object('familyId',f,'tokenHash',p_hash,'expiresAt',expiry);\nEND $$;\n\nCREATE FUNCTION mmhb_refresh_v1.find_valid(p_hash text) RETURNS jsonb\nLANGUAGE plpgsql SET search_path = pg_catalog AS $$\nDECLARE result jsonb;\nBEGIN\n  PERFORM mmhb_refresh_v1.require_ready();\n  IF NOT mmhb_refresh_v1.valid_hash(p_hash) THEN RETURN NULL; END IF;\n  SELECT jsonb_build_object('id',c.id,'userId',f.user_id,'tokenHash',c.token_hash,\n                           'expiresAt',c.expires_at,'familyId',f.id)\n    INTO result\n    FROM mmhb_refresh_v1.credentials c JOIN mmhb_refresh_v1.families f ON f.id=c.family_id\n    WHERE c.token_hash=p_hash AND c.consumed_at IS NULL AND c.expires_at>clock_timestamp()\n      AND f.revoked_at IS NULL AND f.expires_at>clock_timestamp();\n  RETURN result;\nEND $$;\n\n-- Concurrent duplicate refresh returns NULL, preserving the existing 409 policy.\n-- This is NOT a claim of strict OAuth replay-triggered family revocation.\nCREATE FUNCTION mmhb_refresh_v1.rotate(p_old text,p_new text) RETURNS jsonb\nLANGUAGE plpgsql SET search_path = pg_catalog AS $$\nDECLARE uid uuid; fid uuid; family mmhb_refresh_v1.families%ROWTYPE;\n        credential mmhb_refresh_v1.credentials%ROWTYPE; now_at timestamptz; expiry timestamptz;\nBEGIN\n  PERFORM mmhb_refresh_v1.require_ready();\n  IF NOT mmhb_refresh_v1.valid_hash(p_old) OR NOT mmhb_refresh_v1.valid_hash(p_new) THEN RETURN NULL; END IF;\n  IF p_old=p_new THEN RAISE EXCEPTION 'REFRESH_REPLACEMENT_MUST_DIFFER' USING ERRCODE='22023'; END IF;\n  SELECT f.user_id,f.id INTO uid,fid FROM mmhb_refresh_v1.credentials c\n    JOIN mmhb_refresh_v1.families f ON f.id=c.family_id WHERE c.token_hash=p_old;\n  IF NOT FOUND THEN RETURN NULL; END IF;\n  PERFORM id FROM public.users WHERE id=uid FOR UPDATE;\n  IF NOT FOUND THEN RETURN NULL; END IF;\n  SELECT * INTO family FROM mmhb_refresh_v1.families WHERE id=fid FOR UPDATE;\n  IF NOT FOUND OR family.revoked_at IS NOT NULL THEN RETURN NULL; END IF;\n  SELECT * INTO credential FROM mmhb_refresh_v1.credentials\n    WHERE token_hash=p_old AND family_id=fid FOR UPDATE;\n  IF NOT FOUND THEN RETURN NULL; END IF;\n  now_at := clock_timestamp();\n  IF credential.consumed_at IS NOT NULL OR credential.expires_at<=now_at OR family.expires_at<=now_at THEN RETURN NULL; END IF;\n  expiry := now_at+interval '720 hours';\n  UPDATE mmhb_refresh_v1.credentials SET consumed_at=now_at WHERE token_hash=p_old;\n  INSERT INTO mmhb_refresh_v1.credentials(token_hash,family_id,issued_at,expires_at)\n    VALUES(p_new,fid,now_at,expiry);\n  UPDATE mmhb_refresh_v1.families SET expires_at=expiry WHERE id=fid;\n  RETURN jsonb_build_object('userId',uid,'familyId',fid,'tokenHash',p_new,'expiresAt',expiry);\nEND $$;\n\n-- A consumed predecessor still identifies its family for explicit logout.\nCREATE FUNCTION mmhb_refresh_v1.revoke(p_hash text,p_user uuid DEFAULT NULL) RETURNS jsonb\nLANGUAGE plpgsql SET search_path = pg_catalog AS $$\nDECLARE uid uuid; fid uuid; revoked timestamptz;\nBEGIN\n  PERFORM mmhb_refresh_v1.require_ready();\n  IF NOT mmhb_refresh_v1.valid_hash(p_hash) THEN\n    RETURN jsonb_build_object('revoked',false,'revokedCount',0);\n  END IF;\n  SELECT f.user_id,f.id INTO uid,fid FROM mmhb_refresh_v1.credentials c\n    JOIN mmhb_refresh_v1.families f ON f.id=c.family_id WHERE c.token_hash=p_hash;\n  IF NOT FOUND OR (p_user IS NOT NULL AND p_user<>uid) THEN\n    RETURN jsonb_build_object('revoked',false,'revokedCount',0);\n  END IF;\n  PERFORM id FROM public.users WHERE id=uid FOR UPDATE;\n  IF NOT FOUND THEN RETURN jsonb_build_object('revoked',false,'revokedCount',0); END IF;\n  SELECT revoked_at INTO revoked FROM mmhb_refresh_v1.families WHERE id=fid FOR UPDATE;\n  IF NOT FOUND OR revoked IS NOT NULL THEN RETURN jsonb_build_object('revoked',false,'revokedCount',0); END IF;\n  UPDATE mmhb_refresh_v1.families SET revoked_at=clock_timestamp() WHERE id=fid;\n  -- Count logical sign-ins, not historical credential rows (at most one).\n  RETURN jsonb_build_object('revoked',true,'revokedCount',1);\nEND $$;\n\nCREATE FUNCTION mmhb_refresh_v1.revoke_user(p_user uuid) RETURNS integer\nLANGUAGE plpgsql SET search_path = pg_catalog AS $$\nDECLARE n integer;\nBEGIN\n  PERFORM mmhb_refresh_v1.require_ready();\n  PERFORM id FROM public.users WHERE id=p_user FOR UPDATE;\n  IF NOT FOUND THEN RETURN 0; END IF;\n  UPDATE mmhb_refresh_v1.families SET revoked_at=clock_timestamp()\n    WHERE user_id=p_user AND revoked_at IS NULL;\n  GET DIAGNOSTICS n = ROW_COUNT;\n  RETURN n;\nEND $$;\n\n-- Bounded cleanup; never discard predecessor links from a live family.\nCREATE FUNCTION mmhb_refresh_v1.prune_expired(p_limit integer DEFAULT 100) RETURNS integer\nLANGUAGE plpgsql SET search_path = pg_catalog AS $$\nDECLARE n integer;\nBEGIN\n  PERFORM mmhb_refresh_v1.require_ready();\n  IF p_limit IS NULL OR p_limit<1 OR p_limit>1000 THEN\n    RAISE EXCEPTION 'INVALID_CLEANUP_LIMIT' USING ERRCODE='22023';\n  END IF;\n  WITH doomed AS (\n    SELECT id FROM mmhb_refresh_v1.families WHERE expires_at<=clock_timestamp()\n    ORDER BY expires_at,id LIMIT p_limit FOR UPDATE SKIP LOCKED\n  ) DELETE FROM mmhb_refresh_v1.families f USING doomed d WHERE f.id=d.id;\n  GET DIAGNOSTICS n = ROW_COUNT;\n  RETURN n;\nEND $$;\nREVOKE ALL ON SCHEMA mmhb_refresh_v1 FROM PUBLIC;\nREVOKE ALL ON ALL TABLES IN SCHEMA mmhb_refresh_v1 FROM PUBLIC;\nREVOKE ALL ON ALL FUNCTIONS IN SCHEMA mmhb_refresh_v1 FROM PUBLIC;\nCOMMIT;\n"
SQL_SHA='1feb46d6f7f142c34403032ca1a87e3f8a6f1e493e91a5b63cdf075624d4f340'
U1='11111111-1111-4111-8111-111111111111'
U2='22222222-2222-4222-8222-222222222222'
U3='33333333-3333-4333-8333-333333333333'
NIX_BIN='/nix/store/bgwr5i8jf8jpg75rr53rz3fqv5k8yrwp-postgresql-16.10/bin'

class Stop(RuntimeError): pass

def require(ok: bool, message: str):
    if not ok: raise Stop(message)

def sha(data: bytes)->str: return hashlib.sha256(data).hexdigest()
def h(label: str)->str: return sha(('MMHB_SYNTHETIC_TEST_ONLY:'+label).encode())

def read_plain(path: Path, limit: int=16*1024*1024)->bytes:
    for p in (path,*path.parents):
        require(not p.is_symlink(),'SYMLINK_REFUSED')
    fd=os.open(path,os.O_RDONLY|getattr(os,'O_NOFOLLOW',0))
    try:
        st=os.fstat(fd)
        require(stat.S_ISREG(st.st_mode) and st.st_size<=limit,'FILE_TYPE_OR_SIZE')
        with os.fdopen(fd,'rb',closefd=False) as f: value=f.read(limit+1)
        require(len(value)<=limit,'FILE_SIZE_LIMIT')
        return value
    finally: os.close(fd)

def git(args: list[str], store: Path=STORE, cwd: Path|None=None)->bytes:
    exe=shutil.which('git');require(bool(exe),'GIT_NOT_FOUND')
    env={'PATH':os.environ.get('PATH','/usr/bin:/bin'),'LANG':'C','LC_ALL':'C',
         'GIT_CONFIG_NOSYSTEM':'1','GIT_CONFIG_GLOBAL':os.devnull,'GIT_NO_LAZY_FETCH':'1',
         'GIT_OPTIONAL_LOCKS':'0','GIT_NO_REPLACE_OBJECTS':'1','GIT_TERMINAL_PROMPT':'0'}
    cmd=[exe,'--no-pager','--no-replace-objects','--no-optional-locks','-c','core.fsmonitor=false',
         '-c','core.hooksPath=/dev/null','--git-dir='+str(store),*args]
    p=subprocess.run(cmd,cwd=cwd or store,env=env,stdout=subprocess.PIPE,stderr=subprocess.PIPE,timeout=20)
    require(p.returncode==0,'GIT_INSPECTION_FAILED:'+args[0])
    return p.stdout

def repository_snapshot(root: Path=ROOT, work: Path=WORK, store: Path=STORE,
                        commit: str=COMMIT, baseline: str=BASE)->dict:
    require(root.is_dir() and work.is_dir() and store.is_dir(),'RECORDED_PATH_MISSING')
    marker=read_plain(work/'.git').decode().strip()
    require(marker.startswith('gitdir: '),'INVALID_WORKTREE_MARKER')
    d=Path(marker[8:]); d=d if d.is_absolute() else work/d
    d=d.absolute()
    require(d.parent==store/'worktrees','WRONG_WORKTREE_STORE')
    require(read_plain(d/'gitdir').decode().strip()==str(work/'.git'),'WRONG_WORKTREE_RECORD')
    require(read_plain(d/'HEAD').decode().strip()==baseline,'CANDIDATE_HEAD_CHANGED')
    require(git(['rev-parse','--verify',commit+'^{commit}'],store).decode().strip()==commit,'CHECKPOINT_MISSING')
    result={'head':sha(read_plain(d/'HEAD')),'index':sha(read_plain(d/'index',128*1024*1024)),
            'marker':sha(read_plain(work/'.git')),'config':sha(read_plain(store/'config')),
            'refs':sha(git(['for-each-ref','--format=%(refname) %(objectname)'],store)),'sources':{}}
    for name,wanted in EXPECTED.items():
        raw=read_plain(work/name,2*1024*1024)
        require(sha(raw)==wanted,'SOURCE_HASH_DIFFERS:'+name)
        require(raw==git(['cat-file','blob',commit+':'+name],store),'SOURCE_AND_CHECKPOINT_DIFFER:'+name)
        result['sources'][name]=sha(raw)
    generator=read_plain(work/'scripts/generate-canonical-schema.mjs')
    oid=git(['rev-parse','--verify',commit+':scripts/generate-canonical-schema.mjs'],store).decode().strip()
    require(oid==GENERATOR_BLOB,'GENERATOR_CHECKPOINT_CHANGED')
    require(generator==git(['cat-file','blob',commit+':scripts/generate-canonical-schema.mjs'],store),'GENERATOR_WORKING_COPY_CHANGED')
    result['generator']=sha(generator)
    return result

def binaries(explicit: str|None=None)->tuple[Path,str]:
    candidates=[]
    if explicit:
        require(Path(explicit).is_absolute(),'POSTGRES_BIN_DIRECTORY_MUST_BE_ABSOLUTE')
        candidates.append(Path(explicit))
    elif shutil.which('initdb'): candidates.append(Path(shutil.which('initdb')).resolve().parent)
    if not explicit: candidates.append(Path(NIX_BIN))
    for folder in candidates:
        if not all((folder/n).is_file() and os.access(folder/n,os.X_OK) for n in ('initdb','pg_ctl','psql','postgres')): continue
        versions=[]
        for name in ('initdb','pg_ctl','psql','postgres'):
            p=subprocess.run([str(folder/name),'--version'],capture_output=True,text=True,timeout=5,
                             env={'PATH':str(folder),'LANG':'C','LC_ALL':'C'})
            require(p.returncode==0,'POSTGRES_BINARY_FAILED')
            m=re.search(r'\(PostgreSQL\) (\d+)\.(\d+)',p.stdout)
            require(bool(m),'POSTGRES_VERSION_UNRECOGNIZED')
            versions.append(m.group(0))
        require(len(set(versions))==1,'POSTGRES_BINARY_VERSION_MISMATCH')
        major=int(re.search(r'\d+',versions[0]).group())
        require(15<=major<=18,'POSTGRES_VERSION_OUTSIDE_TEST_SCOPE')
        return folder,versions[0]
    raise Stop('POSTGRES_BINARIES_NOT_FOUND_NO_INSTALL_ATTEMPTED')

class Cluster:
    def __init__(self, folder:Path):
        self.bin=folder; self.base=None; self.started=False; self.attempted=False; self.children=[]
    def start(self):
        require(os.geteuid()!=0,'REFUSE_ROOT_TEST_CLUSTER')
        require(shutil.disk_usage('/tmp').free>700*1024*1024,'INSUFFICIENT_TEMP_DISK')
        self.base=Path(tempfile.mkdtemp(prefix='mmhb-refresh-test-',dir='/tmp'))
        os.chmod(self.base,0o700)
        self.data=self.base/'pgdata';self.sock=self.base/'socket';self.sock.mkdir(mode=0o700)
        require(len(str(self.sock))<85,'SOCKET_PATH_TOO_LONG')
        self.env={'PATH':str(self.bin)+':/usr/bin:/bin','HOME':str(self.base),'LANG':'C','LC_ALL':'C','TZ':'UTC',
                  'PGHOST':str(self.sock),'PGPORT':'55471','PGUSER':'mmhb_test','PGDATABASE':'postgres',
                  'PGCONNECT_TIMEOUT':'5','PGSSLMODE':'disable','PGOPTIONS':'-c statement_timeout=10000 -c lock_timeout=5000'}
        p=subprocess.run([str(self.bin/'initdb'),'-D',str(self.data),'-U','mmhb_test','--auth=trust',
                          '--no-locale','-E','UTF8'],capture_output=True,env=self.env,timeout=40)
        (self.base/'initdb.log').write_bytes(p.stdout+p.stderr)
        require(p.returncode==0,'TEST_CLUSTER_INIT_FAILED')
        config="\nlisten_addresses = ''\nunix_socket_directories = '"+str(self.sock)+"'\nunix_socket_permissions = 0700\nport = 55471\nmax_connections = 12\nshared_buffers = '16MB'\nmax_wal_size = '128MB'\nmin_wal_size = '32MB'\nfsync = on\nfull_page_writes = on\ntimezone = 'UTC'\n"
        with (self.data/'postgresql.conf').open('a') as f:f.write(config)
        self.attempted=True
        p=subprocess.run([str(self.bin/'pg_ctl'),'-D',str(self.data),'-l',str(self.base/'postgres.log'),'-w','-t','20','start'],
                         capture_output=True,env=self.env,timeout=25)
        (self.base/'start.log').write_bytes(p.stdout+p.stderr)
        require(p.returncode==0,'TEST_CLUSTER_START_FAILED')
        self.started=True
        require(self.sql("SELECT current_setting('data_directory');")==str(self.data),'WRONG_TEST_CLUSTER')
        require(self.sql("SHOW listen_addresses;")=='','TCP_LISTENER_NOT_DISABLED')
        require(self.sql("SHOW unix_socket_directories;")==str(self.sock),'WRONG_TEST_SOCKET')
    def argv(self,db='postgres'):
        require(self.base is not None and self.started,'TEST_CLUSTER_NOT_STARTED')
        require(re.fullmatch(r'[a-z][a-z0-9_]{0,40}',db) is not None,'INVALID_TEST_DB_NAME')
        return [str(self.bin/'psql'),'-X','--no-password','-q','-A','-t','-v','ON_ERROR_STOP=1',
                '-h',str(self.sock),'-p','55471','-U','mmhb_test','-d',db]
    def result(self,sql,db='postgres'):
        return subprocess.run(self.argv(db),input=sql.encode(),stdout=subprocess.PIPE,stderr=subprocess.PIPE,
                              env=self.env,cwd=self.base,timeout=15)
    def sql(self,sql,db='postgres'):
        p=self.result(sql,db)
        if p.returncode:
            with (self.base/'sql-errors.log').open('ab') as f:f.write(p.stderr+b'\n')
            raise Stop('SQL_FAILED:'+p.stderr.decode(errors='replace').splitlines()[0][:180])
        return p.stdout.decode().strip()
    def error(self,sql,code,db='postgres'):
        p=self.result(sql,db)
        require(p.returncode!=0 and code in p.stderr.decode(errors='replace'),'EXPECTED_SQL_ERROR_MISSING:'+code)
    def value(self,expr,db='postgres'):
        return self.sql('SELECT '+expr+';',db)
    def obj(self,expr,db='postgres'):
        text=self.value(expr,db)
        return json.loads(text) if text else None
    def stop(self):
        for p in self.children:
            if p.poll() is None:
                p.terminate()
                try:p.communicate(timeout=5)
                except subprocess.TimeoutExpired:p.kill();p.communicate()
        if not self.attempted:return True
        p=subprocess.run([str(self.bin/'pg_ctl'),'-D',str(self.data),'-m','fast','-w','-t','20','stop'],
                         capture_output=True,env=self.env,timeout=25)
        (self.base/'stop.log').write_bytes(p.stdout+p.stderr)
        # pg_ctl status=3 is its documented no-server-running state.
        q=subprocess.run([str(self.bin/'pg_ctl'),'-D',str(self.data),'status'],capture_output=True,env=self.env,timeout=5)
        self.started=False
        return q.returncode==3
    def competing(self,first,second,label):
        app='mmhb_probe_'+label
        # Hold a completed operation's transaction open until the second operation queues.
        # The pg_stat_activity barrier avoids assuming which process ran first.
        command="BEGIN; SET LOCAL application_name='"+app+"'; SELECT "+first+"; SELECT pg_sleep(2); COMMIT;"
        p=subprocess.Popen(self.argv()+['-c',command],stdout=subprocess.PIPE,stderr=subprocess.PIPE,env=self.env,cwd=self.base)
        self.children.append(p)
        deadline=time.monotonic()+5
        while self.value("count(*) FROM pg_stat_activity WHERE application_name='"+app+"' AND wait_event='PgSleep'")!='1':
            require(p.poll() is None and time.monotonic()<deadline,'CONCURRENCY_BARRIER_FAILED')
            time.sleep(.03)
        # Launch the competitor and establish it actually waits on a lock.
        app2=app+'_second'
        q=subprocess.Popen(self.argv()+['-c',"SET application_name='"+app2+"'; SELECT "+second+';'],
                           stdout=subprocess.PIPE,stderr=subprocess.PIPE,env=self.env,cwd=self.base)
        self.children.append(q)
        blocked=False
        while p.poll() is None:
            if self.value("count(*) FROM pg_stat_activity WHERE application_name='"+app2+"' AND wait_event_type='Lock'")=='1':
                blocked=True;break
            time.sleep(.02)
        out,err=p.communicate(timeout=8);out2,err2=q.communicate(timeout=8)
        require(blocked,'COMPETITOR_LOCK_WAIT_NOT_OBSERVED')
        require(p.returncode==0 and q.returncode==0,'CONCURRENT_SQL_FAILED')
        one=[line for line in out.decode().splitlines() if line.strip()]
        two=[line for line in out2.decode().splitlines() if line.strip()]
        return (json.loads(one[0]) if one else None,json.loads(two[0]) if two else None)

FIXTURE=f"""CREATE TABLE public.users(id uuid PRIMARY KEY);
INSERT INTO public.users VALUES('{U1}'),('{U2}'),('{U3}');
CREATE TABLE public.refresh_tokens(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),user_id uuid NOT NULL,
 token_hash text NOT NULL,expires_at timestamp NOT NULL,created_at timestamp DEFAULT now());
CREATE INDEX refresh_tokens_user_id_idx ON public.refresh_tokens(user_id);
CREATE INDEX refresh_tokens_token_hash_idx ON public.refresh_tokens(token_hash);
"""

def exercise(c:Cluster)->list[dict]:
    results=[]
    def check(name,fn):
        try:fn();results.append({'test':name,'pass':True});print('TEST='+name+' PASS',flush=True)
        except Exception as e:
            results.append({'test':name,'pass':False,'error':str(e)});print('TEST='+name+' FAIL',flush=True)
            raise
    def assert_(value,message='ASSERTION_FAILED'):require(bool(value),message)
    def issue(label,user=U1):return c.obj(f"mmhb_refresh_v1.issue('{user}','{h(label)}')")
    def valid(label):return c.obj(f"mmhb_refresh_v1.find_valid('{h(label)}')")
    def rotate(a,b):return c.obj(f"mmhb_refresh_v1.rotate('{h(a)}','{h(b)}')")
    def revoke(a):return c.obj(f"mmhb_refresh_v1.revoke('{h(a)}')")
    try:
        c.sql(FIXTURE)
        c.sql(f"INSERT INTO public.refresh_tokens(user_id,token_hash,expires_at) VALUES('{U1}','{h('legacy')}',now()+interval '4 days'),('{U2}','{h('expiredlegacy')}',now()-interval '1 day');")
        c.sql(PROTOTYPE_SQL)
        check('missing_migration_marker_blocks_issuance',lambda:c.error(f"SELECT mmhb_refresh_v1.issue('{U1}','{h('blocked')}');",'REFRESH_FAMILY_MIGRATION_REQUIRED'))
        check('migration_adopts_two_legacy_rows',lambda:assert_(c.value('mmhb_refresh_v1.adopt_legacy()')=='2'))
        check('legacy_source_rows_retained',lambda:assert_(c.value('count(*) FROM public.refresh_tokens')=='2'))
        check('migrated_valid_token_works',lambda:assert_(valid('legacy')['userId']==U1))
        check('migrated_expired_token_refused',lambda:assert_(valid('expiredlegacy') is None))
        check('legacy_noop_delete_is_blocked',lambda:c.error('DELETE FROM public.refresh_tokens WHERE false;','LEGACY_REFRESH_WRITES_DISABLED'))
        check('legacy_insert_is_blocked',lambda:c.error(f"INSERT INTO public.refresh_tokens(user_id,token_hash,expires_at) VALUES('{U1}','{h('legacywrite')}',now());",'LEGACY_REFRESH_WRITES_DISABLED'))
        check('repeat_migration_refuses_reimport',lambda:c.error('SELECT mmhb_refresh_v1.adopt_legacy();','MIGRATION_ALREADY_APPLIED'))
        def family():
            old=issue('A');new=rotate('A','B');assert_(new['familyId']==old['familyId']);assert_(valid('A') is None and valid('B') is not None)
            assert_(c.value(f"count(*) FROM mmhb_refresh_v1.credentials WHERE family_id='{old['familyId']}'")=='2')
        check('rotation_keeps_nonusable_predecessor_history',family)
        issue('otherdevice')
        check('predecessor_logout_revokes_successor',lambda:assert_(revoke('A')['revokedCount']==1 and valid('B') is None))
        check('other_device_of_same_user_survives',lambda:assert_(valid('otherdevice') is not None))
        check('logout_is_idempotent',lambda:assert_(revoke('B')['revokedCount']==0))
        def rollback_collision():
            issue('C');issue('D',U2)
            c.error(f"SELECT mmhb_refresh_v1.rotate('{h('C')}','{h('D')}');",'duplicate key')
            assert_(valid('C') is not None and valid('D') is not None)
        check('insertion_failure_rolls_back_consumption',rollback_collision)
        check('same_token_replacement_refused',lambda:c.error(f"SELECT mmhb_refresh_v1.rotate('{h('C')}','{h('C')}');",'REFRESH_REPLACEMENT_MUST_DIFFER'))
        check('duplicate_refresh_does_not_issue_again',lambda:assert_(rotate('A','unissued') is None and valid('unissued') is None))
        check('invalid_hash_refused',lambda:c.error(f"SELECT mmhb_refresh_v1.issue('{U1}','not-a-digest');",'INVALID_REFRESH_HASH'))
        check('wrong_account_cannot_revoke_family',lambda:assert_(c.obj(f"mmhb_refresh_v1.revoke('{h('C')}','{U2}')")['revokedCount']==0 and valid('C') is not None))
        def transaction_rollback():
            issue('rollback')
            c.sql(f"BEGIN;SELECT mmhb_refresh_v1.revoke('{h('rollback')}');ROLLBACK;")
            assert_(valid('rollback') is not None)
        check('outer_transaction_rollback_preserves_session',transaction_rollback)
        def account():
            c.value(f"mmhb_refresh_v1.revoke_user('{U1}')")
            assert_(valid('C') is None and valid('otherdevice') is None and valid('D') is not None)
        check('account_revocation_spares_other_users',account)
        def concurrency_rotation():
            issue('race0')
            x,y=c.competing(f"mmhb_refresh_v1.rotate('{h('race0')}','{h('race1')}')",f"mmhb_refresh_v1.rotate('{h('race0')}','{h('race2')}')",'rotations')
            assert_(x is not None and y is None and valid('race1') is not None and valid('race2') is None)
        check('concurrent_rotations_have_one_winner',concurrency_rotation)
        def concurrency_refresh_first():
            issue('rf0')
            x,y=c.competing(f"mmhb_refresh_v1.rotate('{h('rf0')}','{h('rf1')}')",f"mmhb_refresh_v1.revoke('{h('rf0')}')",'refresh_first')
            assert_(x is not None and y['revoked'] and valid('rf1') is None)
        check('concurrent_rotation_then_logout_revokes_successor',concurrency_refresh_first)
        def concurrency_logout_first():
            issue('lf0')
            x,y=c.competing(f"mmhb_refresh_v1.revoke('{h('lf0')}')",f"mmhb_refresh_v1.rotate('{h('lf0')}','{h('lf1')}')",'logout_first')
            assert_(x['revoked'] and y is None and valid('lf1') is None)
        check('concurrent_logout_then_rotation_blocks_successor',concurrency_logout_first)
        def expiry():
            f=issue('expiry');c.sql(f"UPDATE mmhb_refresh_v1.credentials SET expires_at=now()-interval '1 second' WHERE token_hash='{h('expiry')}';")
            assert_(rotate('expiry','expirednew') is None)
        check('expired_predecessor_cannot_rotate',expiry)
        def constraint():
            f=issue('unique')
            c.error(f"INSERT INTO mmhb_refresh_v1.credentials(token_hash,family_id,expires_at) VALUES('{h('illegal2')}','{f['familyId']}',now()+interval '1 day');",'one_unconsumed_credential_per_family')
        check('database_enforces_one_unconsumed_token',constraint)
        def cleanup():
            f=issue('hist0');rotate('hist0','hist1')
            c.sql(f"UPDATE mmhb_refresh_v1.credentials SET expires_at=now()-interval '1 day' WHERE token_hash='{h('hist0')}';")
            c.value('mmhb_refresh_v1.prune_expired(1000)')
            assert_(valid('hist1') is not None and revoke('hist0')['revoked'])
        check('cleanup_retains_live_family_predecessors',cleanup)
        def cascade():
            f=issue('deleteduser',U3);c.sql(f"DELETE FROM public.users WHERE id='{U3}';")
            assert_(valid('deleteduser') is None and c.value(f"count(*) FROM mmhb_refresh_v1.credentials WHERE family_id='{f['familyId']}'")=='0')
        check('user_delete_cascades_new_credential_history',cascade)
        check('functions_do_not_elevate_database_privileges',lambda:assert_(c.value("count(*) FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname='mmhb_refresh_v1' AND p.prosecdef")=='0'))
        check('cleanup_batch_size_is_bounded',lambda:c.error('SELECT mmhb_refresh_v1.prune_expired(1001);','INVALID_CLEANUP_LIMIT'))
        def rejected_adoption(name,extra,error):
            c.sql('CREATE DATABASE '+name+';');c.sql(FIXTURE+extra,name);c.sql(PROTOTYPE_SQL,name)
            before=c.value('count(*) FROM public.refresh_tokens',name)
            c.error('SELECT mmhb_refresh_v1.adopt_legacy();',error,name)
            assert_(c.value('count(*) FROM mmhb_refresh_v1.installation',name)=='0')
            assert_(c.value('count(*) FROM mmhb_refresh_v1.credentials',name)=='0')
            assert_(c.value('count(*) FROM public.refresh_tokens',name)==before)
        row=f"INSERT INTO public.refresh_tokens(user_id,token_hash,expires_at) VALUES('{U1}','{h('dup')}',now()+interval '1 day');"
        check('duplicate_legacy_hashes_stop_migration_without_deletion',lambda:rejected_adoption('mmhb_bad_duplicate',row+row,'LEGACY_DUPLICATE_HASHES'))
        row=f"INSERT INTO public.refresh_tokens(user_id,token_hash,expires_at) VALUES('44444444-4444-4444-8444-444444444444','{h('orphan')}',now()+interval '1 day');"
        check('orphan_legacy_rows_stop_migration_without_deletion',lambda:rejected_adoption('mmhb_bad_orphan',row,'LEGACY_ORPHAN_CREDENTIALS'))
        row=f"INSERT INTO public.refresh_tokens(user_id,token_hash,expires_at) VALUES('{U1}','bad-hash',now()+interval '1 day');"
        check('invalid_legacy_hashes_stop_migration_without_deletion',lambda:rejected_adoption('mmhb_bad_hash',row,'LEGACY_INVALID_CREDENTIAL_METADATA'))
        return results
    finally:
        (c.base/'test-results.json').write_text(json.dumps(results,indent=2)+'\n')

def run_local(pg_bin=None):
    require(sha(PROTOTYPE_SQL.encode())==SQL_SHA,'EMBEDDED_SQL_HASH_MISMATCH')
    require(os.geteuid()!=0,'REFUSE_ROOT_TEST_CLUSTER')
    before=repository_snapshot()
    folder,version=binaries(pg_bin)
    print('CHECKPOINT='+COMMIT,flush=True)
    print('EXISTING_GUARDS_AND_GENERATOR=VERIFIED',flush=True)
    print('POSTGRES='+version,flush=True)
    c=Cluster(folder);results=[];error=None;stopped=False;unchanged=False
    try:
        c.start()
        print('TEST_DIRECTORY='+str(c.base),flush=True)
        print('TCP_LISTENERS=DISABLED\nDATABASE_TARGET=NEW_PRIVATE_CLUSTER\nLIVE_DATABASE_CONNECTIONS=NO',flush=True)
        (c.base/'prototype.sql').write_text(PROTOTYPE_SQL)
        results=exercise(c)
    except (Exception,KeyboardInterrupt) as e:
        error=type(e).__name__+':'+str(e)
        if c.base and (c.base/'test-results.json').exists():results=json.loads((c.base/'test-results.json').read_text())
    finally:
        try:stopped=c.stop()
        except Exception as e:error=(error or '')+';STOP_ERROR:'+type(e).__name__
        try:unchanged=repository_snapshot()==before
        except Exception as e:error=(error or '')+';POSTCHECK:'+str(e)
        if not stopped:error=(error or '')+';TEST_CLUSTER_STOP_NOT_CONFIRMED'
        if not unchanged:error=(error or '')+';REPOSITORY_STATE_CHANGED'
        report={'schema':'MMHB_REFRESH_FAMILY_POSTGRES_QUALIFICATION_V1','checkpoint':COMMIT,
          'postgres':version,'prototypeSqlSha256':SQL_SHA,'scope':'Proposed SQL functions and synthetic tables; not MMHB runtime integration',
          'total':len(results),'passed':sum(x['pass'] for x in results),'results':results,
          'testDirectory':str(c.base) if c.base else None,'testClusterStopped':stopped,
          'existingSourceAndCandidateMetadataUnchanged':unchanged,'applicationSourceEdits':0,
          'liveDatabaseConnections':0,'tcpListenersEnabled':False,'applicationIntegration':'NOT_APPLIED',
          'migrationApproval':'NOT_APPROVED_FOR_PRODUCTION','error':error}
        name='MMHB_REFRESH_FAMILY_RESULTS_'+datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%dT%H%M%S')+'_'+os.urandom(3).hex()+'.json'
        path=ROOT/name
        with path.open('x') as f:os.chmod(path,0o600);json.dump(report,f,indent=2);f.write('\n')
        print('RESULTS_FILE='+str(path),flush=True)
        print('TEST_CLUSTER_STOPPED='+('YES' if stopped else 'NO'),flush=True)
        print('EXISTING_SOURCE_AND_METADATA_UNCHANGED='+('YES' if unchanged else 'NO'),flush=True)
        print('APPLICATION_SOURCE_EDITS=NO\nMMHB_APPLICATION_START=NO\nINSTALL=NO\nMMHB_DATABASE_MIGRATION=NO\nPUSH=NO\nDEPLOY=NO',flush=True)
    if error:raise Stop(error)
    require(len(results)==31 and all(r['pass'] for r in results),'INCOMPLETE_TEST_SUITE')
    print('POSTGRES_ASSERTIONS=31_OF_31',flush=True)
    print('MMHB_RUNTIME_INTEGRATION=NOT_APPLIED',flush=True)
    print('STATUS=REFRESH_FAMILY_SQL_QUALIFIED_LOCALLY',flush=True)

if __name__=='__main__':
    os.umask(0o077)
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--test-local',action='store_true',help='Create a private disposable cluster, run synthetic SQL tests, and stop it.')
    parser.add_argument('--pg-bin',help='Optional absolute directory containing an existing matched PostgreSQL toolset. Never installed by this helper.')
    args=parser.parse_args()
    print('COMMAND=MMHB_REFRESH_FAMILY_QUALIFY',flush=True)
    if not args.test_local:
        print('ACTION_REQUIRED=--test-local\nAPPLICATION_SOURCE_EDITS=NO\nDATABASE_OPERATIONS=NO');sys.exit(0)
    try:run_local(args.pg_bin)
    except (Exception,KeyboardInterrupt) as exc:
        print('STOP='+str(exc),flush=True);print('STATUS=REFRESH_FAMILY_QUALIFICATION_STOPPED',flush=True);sys.exit(1)
