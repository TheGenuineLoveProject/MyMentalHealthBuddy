#!/usr/bin/env python3
"""V2: exact-byte-pinned single-file MMHB storage hardening. Default: dry run; --apply: local only.
Uses Python stdlib, Git and Node builtins. No application imports, network calls,
package installation, database connections, builds, pushes or deployments.
"""
from __future__ import annotations
import argparse
import difflib
import fcntl
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import stat
import subprocess
import sys
import tempfile

ROOT = Path('/home/runner/workspace/.local/mmhb-candidates/a4-63ff8372')
REPORT = Path('/home/runner/workspace/MMHB_AUTH_INTEGRATION_SOURCE.txt')
EXPECTED = '63ff8372d07368a5434c11ff58bdf87bb468449d'
REPORT_SHA = 'fb64b3f51065d46c4b953ae4d5fe49c6c601df2c3b443d13045a0ceecda9ffb9'
RELATIVE = 'server/replit_integrations/auth/storage.mjs'
# Immutable GitHub baseline blob dc3ff519e39f3f0c33e9fbe42ffeff7656e7191e.
# The recovered candidate AND original report must contain these exact bytes.
REVIEWED_BEFORE_SHA = '2e7c6e0ec6fc269abc26bac6270e571e2ebdc4839e49b649c68a7806aaf38127'
REPLACEMENT = '      if (existingByEmail.length > 0) {\n        // Matching email is not proof of ownership of an existing account.\n        const error = new Error("Account linking requires explicit verification");\n        error.code = "AUTH_ACCOUNT_LINK_REQUIRED";\n        throw error;\n      }\n\n      // Public sign-in never grants administrator privileges.\n'
TEST_JS = '\'use strict\';\n// Actual supplied storage method bodies; Drizzle and the database are mocked.\nconst assert = require(\'node:assert/strict\');\nconst vm = require(\'node:vm\');\nconst fs = require(\'node:fs\');\nconst { before, after } = JSON.parse(fs.readFileSync(0, \'utf8\'));\nconst results = [];\nfunction load(source, rows = [], failSelect = false) {\n  const state = { rows: structuredClone(rows), writes: [], predicates: [] };\n  const users = Object.fromEntries([\'id\', \'replitId\', \'email\', \'role\'].map(x => [x, x]));\n  const eq = (field, value) => ({ field, value });\n  const db = {\n    select() { return { from() { return { async where(p) {\n      if (failSelect) throw Error(\'SIMULATED_DB_FAILURE\');\n      state.predicates.push(p);\n      return state.rows.filter(r => r[p.field] === p.value).map(r => ({...r}));\n    } }; } }; },\n    update() { return { set(values) { return { where(p) { return { async returning() {\n      state.writes.push({ kind: \'update\', values: {...values}, predicate: p });\n      const rows = state.rows.filter(r => r[p.field] === p.value);\n      rows.forEach(r => Object.assign(r, values)); return rows.map(r => ({...r}));\n    } }; } }; } }; },\n    insert() { return { values(values) { return { async returning() {\n      state.writes.push({ kind: \'insert\', values: {...values} });\n      const row = { id: \'generated-\' + state.rows.length, ...values };\n      state.rows.push(row); return [{...row}];\n    } }; } }; },\n  };\n  const imports = [\n    \'import { users } from "../../../shared/schema.mjs";\',\n    \'import db from "../../db/client.mjs";\',\n    \'import { eq } from "drizzle-orm";\',\n    \'import { logger } from "../../utils/logger.mjs";\',\n  ];\n  for (const item of imports) {\n    assert.equal(source.split(item).length, 2, \'Unexpected import baseline\');\n    source = source.replace(item, \'\');\n  }\n  const end = \'export const authStorage = new AuthStorage();\';\n  assert.equal(source.split(end).length, 2, \'Unexpected export baseline\');\n  source = source.replace(end, \'globalThis.subject = new AuthStorage();\');\n  const sandbox = { users, db, eq, logger: {info(){}, error(){}, warn(){}} };\n  const ctx = vm.createContext(sandbox);\n  new vm.Script(source).runInContext(ctx, { timeout: 1000 });\n  return { sut: ctx.subject, state };\n}\nconst input = { id: \'new-subject\', email: \'new@example.invalid\', firstName: \'New\', lastName: \'Person\' };\nconst admin = email => ({ id: \'admin-id\', replitId: \'admin-subject\', email, role: \'admin\', name: \'Owner\' });\nasync function newUserIsOrdinary(source, rows = [], extra = {}) {\n  const {sut,state} = load(source,rows);\n  const r = await sut.upsertUser({...input,...extra});\n  assert.equal(r.role, \'user\'); assert.equal(r.isNewUser,true);\n  assert.equal(state.writes.filter(x => x.kind===\'insert\').length,1);\n  assert.equal(state.predicates.some(x=>x.field===\'role\'),false);\n}\nasync function collisionBlocked(source, row, extra = {}) {\n  const {sut,state} = load(source,[row]);\n  const saved=JSON.stringify(state.rows);\n  await assert.rejects(sut.upsertUser({...input,email:row.email,...extra}), e=>e.code===\'AUTH_ACCOUNT_LINK_REQUIRED\');\n  assert.equal(state.writes.length,0); assert.equal(JSON.stringify(state.rows),saved);\n}\nasync function preserveRole(source, role) {\n  const row={id:\'known-id\',replitId:input.id,email:input.email,role,name:\'Previous\',profileImageUrl:\'old\'};\n  const {sut,state}=load(source,[row]);\n  const r=await sut.upsertUser({...input,role:role===\'admin\'?\'user\':\'admin\',profileImageUrl:\'new\'});\n  assert.equal(r.role,role); assert.equal(r.id,\'known-id\'); assert.equal(r.replitId,input.id);\n  assert.equal(r.name,\'New Person\'); assert.equal(r.profileImageUrl,\'new\');\n  assert.equal(state.writes.length,1); assert.equal(state.writes[0].kind,\'update\');\n  assert.equal(Object.hasOwn(state.writes[0].values,\'role\'),false);\n}\nasync function check(name,fn,kind=\'patched_behavior\') {\n  try { await fn();results.push({name,kind,pass:true}); }\n  catch(e) { results.push({name,kind,pass:false,reason:String(e.message).slice(0,180)}); }\n}\n(async()=>{\n  await check(\'Original: no administrator causes new account admin\',async()=>{\n    const {sut}=load(before); assert.equal((await sut.upsertUser(input)).role,\'admin\');\n  },\'baseline_unsafe_behavior_reproduced\');\n  await check(\'Original: test-named administrators allow another admin\',async()=>{\n    const {sut}=load(before,[admin(\'test-owner@example.invalid\')]);assert.equal((await sut.upsertUser(input)).role,\'admin\');\n  },\'baseline_unsafe_behavior_reproduced\');\n  await check(\'Original: same email overwrites a different linked subject\',async()=>{\n    const row=admin(input.email);const {sut,state}=load(before,[row]);\n    const r=await sut.upsertUser(input);assert.equal(r.id,row.id);assert.equal(r.role,\'admin\');\n    assert.equal(state.rows[0].replitId,input.id);\n  },\'baseline_unsafe_behavior_reproduced\');\n  for (const [name,rows] of [\n    [\'Empty account table\',[]],[\'No admin but ordinary users\',[{id:\'u\',role:\'user\'}]],\n    [\'Only test-named admin\',[admin(\'test-owner@example.invalid\')]],\n    [\'Only fixture-named admin\',[admin(\'fixture@example.invalid\')]],\n    [\'Normal existing admin\',[admin(\'owner@example.invalid\')]],\n    [\'Mixed admin emails\',[admin(\'test@example.invalid\'),{...admin(\'owner@example.invalid\'),id:\'other\'}]],\n    [\'Incidental substring in real-looking admin email\',[admin(\'contest@example.invalid\')]],\n  ]) await check(name+\': new account is ordinary\',()=>newUserIsOrdinary(after,rows));\n  await check(\'Input role cannot promote new account\',()=>newUserIsOrdinary(after,[],{role:\'admin\'}));\n  await check(\'Email omitted: legacy placeholder preserved, role ordinary\',async()=>{\n    const {sut}=load(after);const r=await sut.upsertUser({id:\'no-email\'});\n    assert.equal(r.email,\'user_no-email@replit.auth\');assert.equal(r.role,\'user\');\n  });\n  await check(\'Existing linked administrator retains role and identity\',()=>preserveRole(after,\'admin\'));\n  await check(\'Existing linked ordinary user cannot request promotion\',()=>preserveRole(after,\'user\'));\n  await check(\'Existing linked account keeps absent profile fields\',async()=>{\n    const {sut}=load(after,[{id:\'k\',replitId:\'s\',email:\'old@example.invalid\',role:\'admin\',name:\'Old\',profileImageUrl:\'old\'}]);\n    const r=await sut.upsertUser({id:\'s\'});assert.equal(r.name,\'Old\');assert.equal(r.email,\'old@example.invalid\');\n    assert.equal(r.profileImageUrl,\'old\');assert.equal(r.role,\'admin\');\n  });\n  await check(\'Unlinked matching email is not linked automatically\',()=>collisionBlocked(after,{id:\'u\',email:input.email,role:\'user\'}));\n  await check(\'Different subject on ordinary account is not replaced\',()=>collisionBlocked(after,{id:\'u\',replitId:\'other\',email:input.email,role:\'user\'}));\n  await check(\'Different subject on admin account is not replaced\',()=>collisionBlocked(after,admin(input.email)));\n  await check(\'Arbitrary verification/link flags cannot bypass explicit-link requirement\',()=>collisionBlocked(after,admin(input.email),{email_verified:true,linkApproved:true}));\n  await check(\'Multiple matching-email rows cause zero writes\',async()=>{\n    const {sut,state}=load(after,[admin(input.email),{id:\'u\',replitId:\'other\',email:input.email,role:\'user\'}]);\n    await assert.rejects(sut.upsertUser(input),e=>e.code===\'AUTH_ACCOUNT_LINK_REQUIRED\');assert.equal(state.writes.length,0);\n  });\n  await check(\'Database read failure propagates without writes\',async()=>{\n    const {sut,state}=load(after,[],true);await assert.rejects(sut.upsertUser(input),/SIMULATED_DB_FAILURE/);assert.equal(state.writes.length,0);\n  });\n  await check(\'Existing getters preserve return shape (privacy filtering not addressed)\',async()=>{\n    const {sut}=load(after,[{id:\'u\',replitId:\'s\',passwordHash:\'SYNTHETIC_NOT_SECRET\'}]);\n    assert.equal((await sut.getUser(\'u\')).passwordHash,\'SYNTHETIC_NOT_SECRET\');\n    assert.equal((await sut.getUserByReplitId(\'s\')).id,\'u\');\n  },\'unresolved_behavior_retained\');\n  const auto=after.replace("role: \'user\',", "role: \'admin\',");\n  await check(\'Mutation: automatic admin grant is detected\',()=>assert.rejects(newUserIsOrdinary(auto)), \'mutation_detection\');\n  const bstart=before.indexOf(\'      if (existingByEmail.length > 0) {\');\n  const bend=before.indexOf(\'      // Check if there are any existing admins\',bstart);\n  const astart=after.indexOf(\'      if (existingByEmail.length > 0) {\');\n  const aend=after.indexOf(\'      // Public sign-in never grants\',astart);\n  const link=after.slice(0,astart)+before.slice(bstart,bend)+after.slice(aend);\n  await check(\'Mutation: email-only linking is detected\',()=>assert.rejects(collisionBlocked(link,admin(input.email))), \'mutation_detection\');\n  const demote=after.replace(\'.set({\', ".set({\\n          role: \'user\',");\n  await check(\'Mutation: existing administrator demotion is detected\',()=>assert.rejects(preserveRole(demote,\'admin\')), \'mutation_detection\');\n  const summary={schema:\'MMHB_STORAGE_GUARD_TEST_V1\',runtime:process.version,\n    scope:\'Provided storage method bodies, mocked Drizzle API and database; no real SQL, OIDC, HTTP or browser\',\n    total:results.length,passed:results.filter(r=>r.pass).length,results};\n  console.log(JSON.stringify(summary,null,2));if(summary.passed!==summary.total)process.exitCode=1;\n})().catch(()=>{console.error(\'STORAGE_TEST_RUNNER_FAILED\');process.exitCode=1;});\n'
MAX = 2 * 1024 * 1024

class Stop(RuntimeError): pass

def ensure(ok, why):
    if not ok: raise Stop(why)

def sha(data): return hashlib.sha256(data).hexdigest()

def read_regular(path, limit=MAX):
    path=Path(path).absolute()
    for item in (path,*path.parents):
        ensure(not item.is_symlink(),'SYMLINK_REFUSED')
    fd=os.open(path,os.O_RDONLY|getattr(os,'O_NOFOLLOW',0))
    try:
        st=os.fstat(fd)
        ensure(stat.S_ISREG(st.st_mode) and st.st_size<=limit,'FILE_TYPE_OR_SIZE')
        with os.fdopen(fd,'rb',closefd=False) as stream: data=stream.read(limit+1)
        ensure(len(data)<=limit,'FILE_SIZE_LIMIT')
        return data,st
    finally: os.close(fd)

def transform(before):
    text=before.decode('utf-8')
    if sha(before) != REVIEWED_BEFORE_SHA:
        print('EXPECTED_STORAGE_SHA256=' + REVIEWED_BEFORE_SHA)
        print('ACTUAL_STORAGE_SHA256=' + sha(before))
        raise Stop('UNREVIEWED_STORAGE_BYTES')
    start='      if (existingByEmail.length > 0) {'
    end='      const [user] = await db\n        .insert(users)'
    role="role: shouldBeAdmin ? 'admin' : 'user',"
    ensure(text.count(start)==1 and text.count(end)==1 and text.count(role)==1,'PATCH_ANCHOR_MISMATCH')
    a=text.index(start);b=text.index(end,a)
    new=(text[:a]+REPLACEMENT+text[b:]).replace(role,"role: 'user',")
    ensure('shouldBeAdmin' not in new and 'existingAdmins' not in new,'AUTOMATIC_ADMIN_REMAINS')
    return new.encode()

def clean_env():
    return {'PATH':os.environ.get('PATH','/usr/bin:/bin'),'LANG':'C','LC_ALL':'C',
            'GIT_CONFIG_NOSYSTEM':'1','GIT_CONFIG_GLOBAL':os.devnull,
            'GIT_OPTIONAL_LOCKS':'0','GIT_NO_LAZY_FETCH':'1','GIT_NO_REPLACE_OBJECTS':'1','GIT_TERMINAL_PROMPT':'0',
            'GIT_PAGER':'cat','GIT_AUTHOR_NAME':'MMHB Local Checkpoint',
            'GIT_AUTHOR_EMAIL':'mmhb-checkpoint@example.invalid',
            'GIT_COMMITTER_NAME':'MMHB Local Checkpoint',
            'GIT_COMMITTER_EMAIL':'mmhb-checkpoint@example.invalid'}

class Repo:
    def __init__(self,root):
        self.root=Path(root).absolute();self.env=clean_env();self.exe=shutil.which('git')
        ensure(self.exe,'GIT_NOT_FOUND')
    def run(self,*args,data=None,extra=None,allowed=(0,)):
        p=subprocess.run([self.exe,'--no-optional-locks','-c','core.fsmonitor=false',
          '-c','core.hooksPath=/dev/null','-c','commit.gpgSign=false','-c','gc.auto=0',
          '-c','maintenance.auto=false','-C',str(self.root),*args],
          input=data,stdout=subprocess.PIPE,stderr=subprocess.PIPE,
          env={**self.env,**(extra or {})},timeout=30)
        ensure(p.returncode in allowed,'GIT_COMMAND_FAILED:'+args[0])
        ensure(len(p.stdout)<=MAX*8,'GIT_OUTPUT_LIMIT')
        return p.stdout
    def text(self,*a,**kw): return self.run(*a,**kw).decode().strip()
    def head(self): return self.text('rev-parse','--verify','HEAD')
    def index_bytes(self):
        p=self.text('rev-parse','--path-format=absolute','--git-path','index')
        return read_regular(Path(p),MAX*64)[0]

def verified_source(report,expected,report_sha):
    raw,_=read_regular(report,MAX*6)
    ensure(sha(raw)==report_sha,'REPORT_HASH_DIFFERS')
    header=json.JSONDecoder().raw_decode(raw.decode('utf-8'))[0]
    ensure(header.get('schema')=='MMHB_AUTH_INTEGRATION_SOURCE_V1' and
           header.get('project')=='MyMentalHealthBuddy' and header.get('commit')==expected,'REPORT_IDENTITY')
    entries=[e for e in header.get('files',[]) if e.get('path')==RELATIVE]
    ensure(len(entries)==1,'REPORT_STORAGE_ENTRY')
    entry=entries[0];size=entry['bytes']
    ensure(isinstance(size,int) and 0<size<=MAX,'REPORT_STORAGE_SIZE')
    marker=('\n--- '+RELATIVE+' ---\n').encode()
    ensure(raw.count(marker)==1,'REPORT_STORAGE_MARKER')
    begin=raw.index(marker)+len(marker);before=raw[begin:begin+size]
    ensure(len(before)==size and sha(before)==entry['sha256'],'REPORT_STORAGE_HASH')
    return before

def check_node(before,after):
    exe=shutil.which('node');ensure(exe,'NODE_NOT_FOUND')
    env={'PATH':os.environ.get('PATH','/usr/bin:/bin'),'LANG':'C','LC_ALL':'C'}
    p=subprocess.run([exe,'--input-type=module','--check'],input=after,
        stdout=subprocess.PIPE,stderr=subprocess.PIPE,env=env,timeout=15)
    ensure(p.returncode==0,'PATCHED_SYNTAX_FAILED')
    p=subprocess.run([exe,'--input-type=commonjs','-e',TEST_JS],
        input=json.dumps({'before':before.decode(),'after':after.decode()}).encode(),
        stdout=subprocess.PIPE,stderr=subprocess.PIPE,env=env,timeout=30)
    ensure(p.returncode==0,'STORAGE_BEHAVIOR_CHECKS_FAILED')
    data=json.loads(p.stdout)
    ensure(data.get('total')==25 and data.get('passed')==25,'STORAGE_BEHAVIOR_RESULT')
    return data

def write_new(path,data,mode=0o600):
    fd=os.open(path,os.O_WRONLY|os.O_CREAT|os.O_EXCL|getattr(os,'O_NOFOLLOW',0),mode)
    try:
        with os.fdopen(fd,'wb',closefd=False) as stream:
            stream.write(data);stream.flush();os.fsync(fd)
    finally: os.close(fd)

def checkpoint(repo,audit,expected,after,mode):
    extra={'GIT_INDEX_FILE':str(audit/'candidate.index')}
    repo.run('read-tree',expected,extra=extra)
    blob=repo.text('hash-object','-w','--stdin',data=after)
    repo.run('update-index','--add','--cacheinfo',f'{mode},{blob},{RELATIVE}',extra=extra)
    tree=repo.text('write-tree',extra=extra)
    ref='refs/mmhb-fixes/storage-guard-v2-'+sha(after)[:16]
    exists=repo.text('rev-parse','--verify','--quiet',ref,allowed=(0,1))
    if exists:
        ensure(repo.text('rev-parse',exists+'^{tree}')==tree and
               repo.text('rev-list','--parents','-n','1',exists)==exists+' '+expected,
               'EXISTING_CHECKPOINT_DIFFERS')
        return ref,exists
    msg=b'fix(auth): prohibit public admin bootstrap and implicit email linking\n\nLocal source checkpoint; integration qualification still pending.\n'
    commit=repo.text('commit-tree',tree,'-p',expected,data=msg)
    repo.run('update-ref','-m','MMHB storage guard local checkpoint',ref,commit,'0'*40)
    ensure(repo.run('cat-file','blob',commit+':'+RELATIVE)==after,'CHECKPOINT_SOURCE_MISMATCH')
    return ref,commit

def execute(root=ROOT,report=REPORT,expected=EXPECTED,report_sha=REPORT_SHA,apply=False):
    root=Path(root).absolute()
    ensure(root.is_dir() and root.resolve()==root,'CANDIDATE_MISSING_OR_SYMLINKED')
    repo=Repo(root)
    ensure(repo.text('rev-parse','--show-toplevel')==str(root),'WRONG_CANDIDATE_ROOT')
    ensure(repo.head()==expected,'CANDIDATE_COMMIT_CHANGED')
    repo.run('diff','--cached','--quiet',expected,'--')
    names=repo.run('diff','--name-only','-z','--').split(b'\0')
    ensure(all(x in (b'',RELATIVE.encode()) for x in names),'UNRELATED_TRACKED_EDITS')
    before=verified_source(report,expected,report_sha)
    ensure(repo.run('cat-file','blob',expected+':'+RELATIVE)==before,'REPORT_AND_COMMIT_DIFFER')
    after=transform(before)
    target=root/RELATIVE;disk,st=read_regular(target)
    ensure(disk in (before,after),'WORKING_STORAGE_DIFFERS')
    ensure(st.st_nlink==1,'HARD_LINKED_SOURCE_REFUSED')
    index_before=repo.index_bytes()
    tests=check_node(before,after)
    print('SOURCE_BASELINE=VERIFIED')
    print('REVIEWED_STORAGE_BYTES=EXACT_MATCH')
    print('PLACEHOLDER_DOMAIN_CASE=PRESERVED_LOWERCASE')
    print('STORAGE_BEHAVIOR_ASSERTIONS=25_OF_25')
    print('TEST_SCOPE=STORAGE_METHODS_WITH_MOCK_DATABASE')
    print('BEFORE_SHA256='+sha(before));print('AFTER_SHA256='+sha(after))
    if not apply:
        print('SOURCE_EDITS=NO');print('STATUS=STORAGE_GUARD_DRY_RUN_READY');return
    common=Path(repo.text('rev-parse','--path-format=absolute','--git-common-dir'))
    ensure(common.resolve()==common and common.is_dir(),'UNEXPECTED_GIT_DIRECTORY')
    lock=common/'mmhb-storage-guard.lock'
    fd=os.open(lock,os.O_RDWR|os.O_CREAT|getattr(os,'O_NOFOLLOW',0),0o600)
    try:
        fcntl.flock(fd,fcntl.LOCK_EX|fcntl.LOCK_NB)
        audit=Path(tempfile.mkdtemp(prefix='mmhb-storage-guard-',dir=common))
        print('AUDIT_DIR='+str(audit))
        write_new(audit/'storage.before.mjs',before)
        write_new(audit/'storage.after.mjs',after)
        patch=''.join(difflib.unified_diff(before.decode().splitlines(True),after.decode().splitlines(True),
              fromfile='a/'+RELATIVE,tofile='b/'+RELATIVE))
        write_new(audit/'storage.patch',patch.encode())
        write_new(audit/'tests.json',json.dumps(tests,indent=2).encode())
        mode=repo.text('ls-tree',expected,'--',RELATIVE).split()[0]
        ensure(mode in ('100644','100755'),'UNSUPPORTED_TRACKED_MODE')
        ensure(repo.head()==expected and repo.index_bytes()==index_before and
               read_regular(target)[0]==disk,'SOURCE_CHANGED_DURING_CHECKS')
        ref,commit=checkpoint(repo,audit,expected,after,mode)
        print('LOCAL_FIX_REF='+ref);print('LOCAL_FIX_COMMIT='+commit)
        write_new(audit/'checkpoint.txt',(ref+'\n'+commit+'\n').encode())
        ensure(repo.head()==expected and repo.index_bytes()==index_before and
               read_regular(target)[0]==disk,'SOURCE_CHANGED_BEFORE_REPLACE')
        if disk==before:
            tfd,temp=tempfile.mkstemp(prefix='.mmhb-storage-',suffix='.tmp',dir=target.parent)
            try:
                with os.fdopen(tfd,'wb') as stream:
                    stream.write(after);stream.flush();os.fchmod(stream.fileno(),stat.S_IMODE(st.st_mode));os.fsync(stream.fileno())
                ensure(read_regular(target)[0]==before,'SOURCE_CHANGED_BEFORE_ATOMIC_WRITE')
                os.replace(temp,target)
                dfd=os.open(target.parent,os.O_RDONLY|getattr(os,'O_DIRECTORY',0))
                try: os.fsync(dfd)
                finally: os.close(dfd)
            finally:
                if os.path.exists(temp): os.unlink(temp)
            print('PATCH_WRITE=APPLIED_ONE_FILE')
        else: print('PATCH_WRITE=ALREADY_IDENTICAL')
        ensure(read_regular(target)[0]==after,'WRITTEN_SOURCE_MISMATCH')
        ensure(repo.head()==expected and repo.index_bytes()==index_before,'HEAD_OR_INDEX_CHANGED')
        repo.run('diff','--check','--',RELATIVE)
        print('CANDIDATE_HEAD_AND_INDEX=UNCHANGED')
        print('CHECKPOINT_PRESERVES_PATCH=YES')
        print('APPLICATION_START=NO');print('DATABASE_OPERATIONS=NO')
        print('NETWORK_REQUESTS=NO');print('INSTALL=NO');print('BUILD=NO');print('PUSH=NO');print('DEPLOY=NO')
        print('INTEGRATION_QUALIFICATION=PENDING')
        print('STATUS=STORAGE_GUARD_APPLIED_WITH_LOCAL_CHECKPOINT')
    finally: os.close(fd)

if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--apply',action='store_true')
    args=parser.parse_args()
    print('COMMAND=MMHB_AUTH_STORAGE_GUARD_V2')
    try: execute(apply=args.apply)
    except (Stop,OSError,ValueError,KeyError,subprocess.TimeoutExpired) as exc:
        print('STOP='+ (str(exc) if isinstance(exc,Stop) else type(exc).__name__))
        print('STATUS=STORAGE_GUARD_STOPPED');sys.exit(1)
