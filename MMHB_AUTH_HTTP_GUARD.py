#!/usr/bin/env python3
"""MMHB narrow HTTP-auth correction, preserving the already applied storage guard.
Default: validated dry run. --apply: checkpoint then replace two candidate files.
No dependency installs, network operations, application start, pushes or deployment.
"""
from __future__ import annotations
import argparse,difflib,fcntl,hashlib,json,os,re,shutil,stat,subprocess,sys,tempfile
from pathlib import Path
ROOT=Path('/home/runner/workspace/.local/mmhb-candidates/a4-63ff8372')
REPORT=Path('/home/runner/workspace/MMHB_AUTH_INTEGRATION_SOURCE.txt')
EXPECTED='63ff8372d07368a5434c11ff58bdf87bb468449d'
STORAGE_COMMIT='d2c83727bbfbb6b43fbddcb8f219bfe10bf5db35'
STORAGE_REF='refs/mmhb-fixes/storage-guard-v2-9eddeef15ea27bac'
STORAGE='server/replit_integrations/auth/storage.mjs'
STORAGE_SHA='9eddeef15ea27bac5ecc38da25e61b4487b87b2f7e285e5d718e221a90fae7da'
AUTH='server/routes/auth.mjs'
CSRF='server/security/csrf.mjs'
REPORT_SHA='fb64b3f51065d46c4b953ae4d5fe49c6c601df2c3b443d13045a0ceecda9ffb9'
BEFORE_SHA={AUTH:'fd4d9d7cfc75e23fc60dde5df5139ffb1fc826a338acf3c9cc7c2faba4ce362c',CSRF:'648e21f3eb89933aeaaad1e967c59640cc52d2f8634002d3abbc6dafe358bce1'}
AFTER_SHA={AUTH:'32c9aa86bfe2704e7e6872e9ca2cb51de2f37136fd62eab921f40e451ad601a9',CSRF:'e700c729408614c4a638365ef47a7b4a5c043112489b8be3f15b93d7178ce8bf'}
OLD_LOGOUT=b'router.post("/logout", async (req, res) => {\n  res.set("Cache-Control", "no-store");\n\n  try {\n    await ensureUsersTable();\n\n    const refreshToken = req.cookies?.refresh_token;\n    if (refreshToken) {\n      const revocation = await revokeRefreshTokenByToken(refreshToken);\n\n      if (revocation.revokedCount > 1) {\n        console.warn(\n          "logout integrity warning: duplicate refresh-token hashes revoked"\n        );\n      }\n    }\n  } catch (err) {\n    console.warn("logout cleanup warning:", err?.message || err);\n  }\n\n  try {\n    clearRefreshCookie(res);\n    res.clearCookie("authToken");\n    res.clearCookie("refreshToken");\n  } catch {}\n\n  return res.json({\n    ok: true,\n    message: "You\'re signed out. Take care of yourself.",\n  });\n});\n'
NEW_LOGOUT=b'router.post("/logout", async (req, res) => {\n  res.set("Cache-Control", "no-store");\n\n  try {\n    await ensureUsersTable();\n\n    const refreshToken = req.cookies?.refresh_token;\n    if (refreshToken) {\n      const revocation = await revokeRefreshTokenByToken(refreshToken);\n\n      if (revocation.revokedCount > 1) {\n        console.warn(\n          "logout integrity warning: duplicate refresh-token hashes revoked"\n        );\n      }\n    }\n\n    // Confirm server-side revocation before discarding the retry credential.\n    clearRefreshCookie(res);\n    res.clearCookie("authToken");\n    res.clearCookie("refreshToken");\n\n    return res.json({\n      ok: true,\n      message: "You\'re signed out. Take care of yourself.",\n    });\n  } catch {\n    // Never report completed logout when revocation or cookie cleanup failed.\n    // Do not put database errors or credential values into the response/log.\n    console.warn("logout could not be confirmed");\n    return res.status(503).json({\n      ok: false,\n      code: "LOGOUT_INCOMPLETE",\n      error: "We couldn\'t confirm that sign-out completed. Please try again.",\n    });\n  }\n});\n'
OLD_CSRF=b'  if (!req.path.startsWith("/api/")) return next();'
NEW_CSRF=b'  // Match API prefix casing without rewriting routes or broadening exemptions.\n  if (!/^\\/api(?:\\/|$)/i.test(req.path)) return next();'
TEST_JS='\'use strict\';\nconst vm = require(\'node:vm\');\nconst crypto = require(\'node:crypto\');\nconst assert = require(\'node:assert/strict\');\nconst fs = require(\'node:fs\');\nconst input = JSON.parse(fs.readFileSync(0,\'utf8\'));\nconst results=[];\nasync function check(name, kind, fn) {\n  try { await fn(); results.push({name,kind,pass:true}); }\n  catch (e) { results.push({name,kind,pass:false,reason:String(e.message).slice(0,200)}); }\n}\nasync function load(source, options={}) {\n  const state={routes:[],events:[],dbCalls:0};\n  const router={get(path,...handlers){state.routes.push({method:\'GET\',path,handlers});},post(path,...handlers){state.routes.push({method:\'POST\',path,handlers});}};\n  const next=(_q,_s,n)=>n();\n  const refresh={\n    storeRefreshToken:async()=>{}, findValidRefreshToken:async()=>null,\n    revokeRefreshToken:async()=>{}, rotateRefreshToken:async()=>null,\n    revokeRefreshTokenByToken:async(token)=>{state.events.push(\'revoke:start\'); const r=options.revoke ? await options.revoke(token) : {revokedCount:1}; state.events.push(\'revoke:done\');return r;}\n  };\n  const defs={\n    express:{default:{Router:()=>router}}, bcrypt:{default:{hash:async()=> \'test-hash\',compare:async()=>true}},\n    \'drizzle-orm\':{sql:(parts,...values)=>({text:parts.join(\'?\'),values})},\n    \'../db/client.mjs\':{default:{execute:async(query)=>{state.dbCalls++;return {rows:options.rows||[]};}}},\n    \'../middleware/auth.mjs\':{signUserToken:()=> \'synthetic-token\',requireAuth:next},\n    \'../auth/tokens.mjs\':{newRefreshToken:()=> \'synthetic-refresh\',makeRefreshToken:()=> \'unused\'},\n    \'../middleware/rateLimit.mjs\':{loginRateLimit:next,authRateLimit:next},\n    \'../utils/cookies.mjs\':{getRefreshCookieOptions:()=>({httpOnly:true,secure:true,sameSite:\'lax\',path:\'/api/auth\',maxAge:12345})},\n    \'../services/refreshTokens.service.mjs\':refresh,\n    \'../auth/mfa.service.mjs\':Object.fromEntries([\'createMfaChallengeRecord\',\'verifyMfaChallenge\',\'decryptMfaSecret\',\'verifyTotpCode\'].map(n=>[n,()=>{throw Error(\'MFA_NOT_IN_TEST_SCOPE\');}])),\n    \'../services/mfaChallenges.service.mjs\':{storeMfaLoginChallenge:async()=>{},consumeMfaLoginChallenge:async()=>false},\n    \'../services/mfaRecoveryLogin.service.mjs\':{consumeMfaRecoveryLogin:async()=>null},\n    \'node:crypto\':{default:crypto}\n  };\n  const exported=[];\n  source=source.replace(/^import\\s+([\\s\\S]*?)\\s+from\\s+["\']([^"\']+)["\'];[ \\t]*\\n?/gm, (_all,binding,spec)=>{\n    if(!Object.hasOwn(defs,spec))throw Error(\'UNEXPECTED_IMPORT:\'+spec);\n    binding=binding.trim();\n    if(binding.startsWith(\'{\'))return \'const \'+binding+\'=__deps[\'+JSON.stringify(spec)+\'];\\n\';\n    assert.match(binding,/^[A-Za-z_$][\\w$]*$/);\n    return \'const \'+binding+\'=__deps[\'+JSON.stringify(spec)+\'].default;\\n\';\n  });\n  source=source.replace(/^export function (\\w+)/gm,(_a,name)=>{exported.push(name);return \'function \'+name;});\n  source=source.replace(\'export default router;\', \'globalThis.exports.default=router;\');\n  source+=\'\\n\'+exported.map(n=>\'globalThis.exports.\'+n+\'=\'+n+\';\').join(\'\\n\');\n  const context=vm.createContext({__deps:defs,exports:{},console:{warn:()=>state.events.push(\'warn\'),error:()=>state.events.push(\'error\')},process:{env:{NODE_ENV:\'test\'}},Buffer,URL});\n  new vm.Script(source).runInContext(context,{timeout:1000});\n  state.sut=context.exports;\n  state.handler=(method,path)=>{const rs=state.routes.filter(r=>r.method===method && r.path===path);assert.equal(rs.length,1);return rs[0].handlers.at(-1);};\n  return state;\n}\nfunction response(state, failAt=0) {\n  let calls=0;\n  return {statusCode:200,headers:{},body:undefined,cleared:[],\n    set(k,v){this.headers[k.toLowerCase()]=v;return this;},\n    status(n){this.statusCode=n;return this;},\n    json(x){this.body=x;state?.events.push(\'json\');return this;},\n    clearCookie(n,options){calls++;state?.events.push(\'clear:\'+n);if(calls===failAt)throw Error(\'SYNTHETIC_COOKIE_ERROR\');this.cleared.push({name:n,options});return this;}\n  };\n}\nasync function invokeLogout(source,{cookie=\'synthetic-refresh\',revoke,failAt=0}={}) {\n  const state=await load(source,{revoke});const res=response(state,failAt);\n  await state.handler(\'POST\',\'/logout\')({cookies:cookie===undefined?{}:{refresh_token:cookie}},res);\n  return {state,res};\n}\nasync function csrfDecision(source,path,{method=\'POST\',headers={},cookies={},protocol=\'http\'}={}) {\n  const state=await load(source);const req={path,method,headers,cookies,protocol};const res=response(state);let calls=0;\n  state.sut.csrfProtection(req,res,()=>calls++);assert.equal(req.path,path,\'Must not rewrite routing path\');\n  return {calls,status:res.statusCode,body:res.body};\n}\nfunction assertFailed(res){assert.equal(res.statusCode,503);assert.equal(res.body.ok,false);assert.equal(res.body.code,\'LOGOUT_INCOMPLETE\');assert.equal(res.headers[\'cache-control\'],\'no-store\');}\n(async()=>{\n  const A=input.authBefore, P=input.authAfter, C=input.csrfBefore, F=input.csrfAfter;\n  await check(\'Original logout reports success when revocation rejects\',\'baseline_defect_reproduced\',async()=>{\n    const {res}=await invokeLogout(A,{revoke:async()=>{throw Error(\'SIMULATED_DB_FAILURE\');}});assert.equal(res.statusCode,200);assert.equal(res.body.ok,true);\n  });\n  await check(\'Original generic uppercase API path skips token check\',\'baseline_defect_reproduced\',async()=>{\n    assert.equal((await csrfDecision(C,\'/API/private-probe\')).calls,1);\n  });\n  for(const path of [\'/api/private-probe\',\'/API/private-probe\',\'/Api/private-probe\',\'/aPi/private-probe\',\'/api\',\'/API\']){\n    await check(\'Missing token rejected for \'+path,\'patched_behavior\',async()=>{const r=await csrfDecision(F,path);assert.equal(r.calls,0);assert.equal(r.status,403);});\n  }\n  for(const method of [\'GET\',\'HEAD\',\'OPTIONS\']) await check(\'Safe method preserved: \'+method,\'preserved_behavior\',async()=>assert.equal((await csrfDecision(F,\'/API/private-probe\',{method})).calls,1));\n  for(const path of [\'/outside\',\'/apiary/private\',\'/apix/private\']) await check(\'Non-API path preserved: \'+path,\'preserved_behavior\',async()=>assert.equal((await csrfDecision(F,path)).calls,1));\n  await check(\'Valid generic token accepted without path rewrite\',\'preserved_behavior\',async()=>{\n    assert.equal((await csrfDecision(F,\'/API/private\',{cookies:{csrf_secret:\'same\'},headers:{\'x-csrf-token\':\'same\'}})).calls,1);\n  });\n  await check(\'Mismatched generic token rejected\',\'preserved_behavior\',async()=>{\n    assert.equal((await csrfDecision(F,\'/API/private\',{cookies:{csrf_secret:\'secret\'},headers:{\'x-csrf-token\':\'other\'}})).status,403);\n  });\n  for(const path of [\'/api/auth/logout\',\'/API/AUTH/logout\']){\n    await check(\'Auth foreign-origin rejects before bearer exemption: \'+path,\'preserved_behavior\',async()=>{\n      const r=await csrfDecision(F,path,{headers:{host:\'localhost:1234\',origin:\'https://other.invalid\',authorization:\'Bearer synthetic\'}});assert.equal(r.calls,0);assert.equal(r.status,403);\n    });\n    await check(\'Auth same-origin accepted: \'+path,\'preserved_behavior\',async()=>{\n      assert.equal((await csrfDecision(F,path,{headers:{host:\'localhost:1234\',origin:\'http://localhost:1234\'}})).calls,1);\n    });\n  }\n  await check(\'Existing lowercase public exemption unchanged\',\'preserved_behavior\',async()=>assert.equal((await csrfDecision(F,\'/api/contact\')).calls,1));\n  await check(\'No new uppercase public exemption introduced\',\'patched_behavior\',async()=>assert.equal((await csrfDecision(F,\'/API/contact\')).status,403));\n  await check(\'Existing bearer exception is unchanged, not newly validated\',\'unresolved_behavior_preserved\',async()=>assert.equal((await csrfDecision(F,\'/API/private\',{headers:{authorization:\'Bearer synthetic\'}})).calls,1));\n  for(const count of [0,1,2]) await check(\'Logout revocation count \'+count+\' remains idempotent\',\'patched_behavior\',async()=>{\n    const {res,state}=await invokeLogout(P,{revoke:async()=>({revokedCount:count})});assert.equal(res.statusCode,200);assert.equal(res.body.ok,true);assert.equal(res.cleared.length,3);assert.equal(res.headers[\'cache-control\'],\'no-store\');assert.ok(state.events.indexOf(\'revoke:done\')<state.events.indexOf(\'clear:refresh_token\'));\n  });\n  await check(\'Logout without refresh cookie remains successful\',\'preserved_behavior\',async()=>{\n    const {res,state}=await invokeLogout(P,{cookie:null});assert.equal(res.body.ok,true);assert.equal(state.events.includes(\'revoke:start\'),false);\n  });\n  await check(\'Revocation error returns incomplete, preserves retry cookie\',\'patched_behavior\',async()=>{\n    const {res}=await invokeLogout(P,{revoke:async()=>{throw Error(\'SIMULATED_DB_FAILURE\');}});assertFailed(res);assert.equal(res.cleared.length,0);\n  });\n  for(const failAt of [1,2,3]) await check(\'Cookie-clear failure \'+failAt+\' never returns success\',\'patched_behavior\',async()=>{const {res}=await invokeLogout(P,{failAt});assertFailed(res);});\n  await check(\'Null revocation result returns incomplete\',\'patched_behavior\',async()=>assertFailed((await invokeLogout(P,{revoke:async()=>null})).res));\n  await check(\'Pending revocation cannot produce premature success\',\'patched_behavior\',async()=>{\n    let done;const pending=new Promise(r=>{done=r;});const state=await load(P,{revoke:()=>pending});const res=response(state);\n    const task=state.handler(\'POST\',\'/logout\')({cookies:{refresh_token:\'synthetic\'}},res);\n    for(let i=0;i<20 && !state.events.includes(\'revoke:start\');i++) await Promise.resolve();\n    assert.ok(state.events.includes(\'revoke:start\'));assert.equal(res.body,undefined);assert.equal(res.cleared.length,0);\n    done({revokedCount:1});await task;assert.equal(res.body.ok,true);\n  });\n  for(const path of [\'/user\',\'/me\']) await check(\'Local public projection retained for \'+path,\'preserved_behavior\',async()=>{\n    const state=await load(P,{rows:[{id:\'test-id\',email:\'test@example.invalid\',name:\'Test\',password_hash:\'SECRET_TEST\',mfa_secret:\'SECRET_TEST\',role:\'user\'}]});const res=response(state);\n    await state.handler(\'GET\',path)({dbUserId:\'test-id\'},res);\n    const user=path===\'/me\'?res.body.user:res.body;assert.equal(user.id,\'test-id\');assert.equal(Object.hasOwn(user,\'password_hash\'),false);assert.equal(Object.hasOwn(user,\'mfa_secret\'),false);\n  });\n  await check(\'All code preceding local logout handler is byte-identical\',\'scope_check\',()=>{\n    const marker=\'router.post("/logout", async (req, res) => {\';assert.equal(A.split(marker)[0],P.split(marker)[0]);\n  });\n  await check(\'Mutation: restoring uppercase bypass is detected\',\'mutation_detection\',async()=>{\n    const r=await csrfDecision(C,\'/API/private-probe\');assert.throws(()=>assert.equal(r.calls,0));\n  });\n  await check(\'Mutation: swallowed revocation error is detected\',\'mutation_detection\',async()=>{\n    const {res}=await invokeLogout(A,{revoke:async()=>{throw Error(\'SIMULATED\');}});assert.throws(()=>assertFailed(res));\n  });\n  await check(\'Mutation: false success in error handler is detected\',\'mutation_detection\',async()=>{\n    const mutant=P.replace(\'return res.status(503).json({\\n      ok: false,\',\'return res.status(200).json({\\n      ok: true,\');assert.notEqual(mutant,P);\n    const {res}=await invokeLogout(mutant,{revoke:async()=>{throw Error(\'SIMULATED\');}});assert.throws(()=>assertFailed(res));\n  });\n  const output={schema:\'MMHB_HTTP_BOUNDARY_TESTS_V1\',scope:\'Actual module bodies; Node crypto real; Express request/response and all auth dependencies mocked. No application/network/database integration.\',runtime:process.version,total:results.length,passed:results.filter(x=>x.pass).length,results};\n  process.stdout.write(JSON.stringify(output,null,2)+\'\\n\');if(output.passed!==output.total)process.exitCode=1;\n})().catch(()=>{process.stdout.write(JSON.stringify({error:\'HARNESS_FAILED\'}));process.exitCode=1;});\n'

MAX = 2 * 1024 * 1024
class Stop(RuntimeError):
    pass

def ensure(condition, code):
    if not condition:
        raise Stop(code)

def sha(data):
    return hashlib.sha256(data).hexdigest()

def regular(path, limit=MAX):
    path=Path(path)
    for p in (path,*path.parents):
        ensure(not p.is_symlink(),'SYMLINK_PATH_REFUSED')
    fd=os.open(path,os.O_RDONLY | getattr(os,'O_NOFOLLOW',0))
    try:
        st=os.fstat(fd)
        ensure(stat.S_ISREG(st.st_mode) and st.st_size<=limit,'FILE_TYPE_OR_SIZE')
        with os.fdopen(fd,'rb',closefd=False) as f: data=f.read(limit+1)
        ensure(len(data)<=limit,'FILE_READ_LIMIT')
        return data,st
    finally: os.close(fd)

def child_env():
    return {'PATH':os.environ.get('PATH','/usr/bin:/bin'),'LANG':'C','LC_ALL':'C',
        'GIT_CONFIG_NOSYSTEM':'1','GIT_CONFIG_GLOBAL':os.devnull,
        'GIT_OPTIONAL_LOCKS':'0','GIT_NO_LAZY_FETCH':'1','GIT_NO_REPLACE_OBJECTS':'1',
        'GIT_TERMINAL_PROMPT':'0','GIT_PAGER':'cat',
        'GIT_AUTHOR_NAME':'MMHB Local Checkpoint','GIT_AUTHOR_EMAIL':'mmhb-checkpoint@example.invalid',
        'GIT_COMMITTER_NAME':'MMHB Local Checkpoint','GIT_COMMITTER_EMAIL':'mmhb-checkpoint@example.invalid'}

class Repo:
    def __init__(self,root):
        self.root=Path(root).absolute();self.exe=shutil.which('git');ensure(self.exe,'GIT_NOT_FOUND')
    def run(self,*args,data=None,extra=None,allowed=(0,)):
        p=subprocess.run([self.exe,'--no-optional-locks','-c','core.fsmonitor=false',
            '-c','core.hooksPath=/dev/null','-c','gc.auto=0','-c','maintenance.auto=false',
            '-c','commit.gpgSign=false','-C',str(self.root),*args],
            input=data,stdout=subprocess.PIPE,stderr=subprocess.PIPE,
            env={**child_env(),**(extra or {})},timeout=30)
        ensure(p.returncode in allowed,'GIT_FAILED:'+args[0]);ensure(len(p.stdout)<=MAX*16,'GIT_OUTPUT_LIMIT')
        return p.stdout
    def text(self,*a,**kw): return self.run(*a,**kw).decode().strip()
    def head(self): return self.text('rev-parse','--verify','HEAD')
    def index(self): return regular(self.text('rev-parse','--path-format=absolute','--git-path','index'),MAX*32)[0]
    def blob(self,rev,path):
        obj=rev+':'+path
        ensure(self.text('cat-file','-t',obj)=='blob','EXPECTED_SOURCE_BLOB')
        ensure(int(self.text('cat-file','-s',obj))<=MAX,'SOURCE_BLOB_LIMIT')
        return self.run('cat-file','blob',obj)
    def refs(self): return self.run('for-each-ref','--format=%(refname) %(objectname)')
    def config(self): return self.run('config','--local','--null','--list')

def report_source(path, expected, report_sha):
    raw,_=regular(path,MAX*6);ensure(sha(raw)==report_sha,'REPORT_HASH_DIFFERS')
    header=json.JSONDecoder().raw_decode(raw.decode())[0]
    ensure(header.get('schema')=='MMHB_AUTH_INTEGRATION_SOURCE_V1' and header.get('project')=='MyMentalHealthBuddy'
           and header.get('commit')==expected,'REPORT_IDENTITY')
    entries=[e for e in header.get('files',[]) if e.get('path')==AUTH]
    ensure(len(entries)==1,'REPORT_AUTH_ENTRY')
    e=entries[0];n=e['bytes'];ensure(isinstance(n,int) and 0<n<=MAX,'REPORT_AUTH_SIZE')
    marker=('\n--- '+AUTH+' ---\n').encode();ensure(raw.count(marker)==1,'REPORT_AUTH_MARKER')
    start=raw.index(marker)+len(marker);data=raw[start:start+n]
    ensure(sha(data)==e['sha256'],'REPORT_AUTH_CONTENT_HASH')
    return data

def changed(repo, parent, base):
    return {x.decode() for x in repo.run('diff-tree','--no-commit-id','--no-renames','-r','--name-only','-z',base,parent).split(b'\0') if x}

def transforms(auth,csrf):
    for label,path,raw in [('AUTH',AUTH,auth),('CSRF',CSRF,csrf)]:
        if sha(raw)!=BEFORE_SHA[path]:
            print('EXPECTED_'+label+'_SHA256='+BEFORE_SHA[path]);print('ACTUAL_'+label+'_SHA256='+sha(raw))
            raise Stop('UNREVIEWED_'+label+'_BYTES')
    ensure(auth.count(OLD_LOGOUT)==1,'LOGOUT_ANCHOR_MISMATCH')
    ensure(csrf.count(OLD_CSRF)==1,'CSRF_ANCHOR_MISMATCH')
    updated={AUTH:auth.replace(OLD_LOGOUT,NEW_LOGOUT),CSRF:csrf.replace(OLD_CSRF,NEW_CSRF)}
    for path,data in updated.items():ensure(sha(data)==AFTER_SHA[path],'PATCH_OUTPUT_HASH')
    return updated

def behavior(before, after):
    exe=shutil.which('node');ensure(exe,'NODE_NOT_FOUND')
    env={'PATH':os.environ.get('PATH','/usr/bin:/bin'),'LANG':'C','LC_ALL':'C'}
    for data in after.values():
        r=subprocess.run([exe,'--input-type=module','--check'],input=data,stdout=subprocess.PIPE,stderr=subprocess.PIPE,env=env,timeout=15)
        ensure(r.returncode==0,'PATCHED_SYNTAX_FAILED')
    data={'authBefore':before[AUTH].decode(),'authAfter':after[AUTH].decode(),
        'csrfBefore':before[CSRF].decode(),'csrfAfter':after[CSRF].decode()}
    r=subprocess.run([exe,'--input-type=commonjs','-e',TEST_JS],input=json.dumps(data).encode(),
        stdout=subprocess.PIPE,stderr=subprocess.PIPE,env=env,timeout=30)
    ensure(r.returncode==0,'BEHAVIOR_CHECK_FAILED')
    result=json.loads(r.stdout);ensure(result.get('total')==39 and result.get('passed')==39,'BEHAVIOR_RESULT')
    return result

def write_new(path,data):
    fd=os.open(path,os.O_WRONLY|os.O_CREAT|os.O_EXCL|getattr(os,'O_NOFOLLOW',0),0o600)
    try:
        with os.fdopen(fd,'wb',closefd=False) as f:f.write(data);f.flush();os.fsync(fd)
    finally:os.close(fd)

def preserve_checkpoint(repo,audit,parent,after):
    extra={'GIT_INDEX_FILE':str(audit/'patch.index')}
    repo.run('read-tree',parent,extra=extra)
    for path,raw in after.items():
        mode=repo.text('ls-tree',parent,'--',path).split()[0]
        ensure(mode in ('100644','100755'),'UNSUPPORTED_TRACKED_MODE')
        blob=repo.text('hash-object','-w','--stdin',data=raw)
        repo.run('update-index','--add','--cacheinfo',f'{mode},{blob},{path}',extra=extra)
    tree=repo.text('write-tree',extra=extra)
    ref='refs/mmhb-fixes/http-guard-v1-'+sha(after[AUTH]+after[CSRF])[:16]
    current=repo.text('rev-parse','--verify','--quiet',ref,allowed=(0,1))
    if current:
        ensure(repo.text('rev-parse',current+'^{tree}')==tree and repo.text('rev-list','--parents','-n','1',current)==current+' '+parent,'EXISTING_CHECKPOINT_DIFFERS')
        commit=current
    else:
        commit=repo.text('commit-tree',tree,'-p',parent,data=b'fix(auth): report logout failures and guard mixed-case API paths\n\nPreserves the applied storage guard. Local checkpoint; integration tests pending.\n')
        repo.run('update-ref','-m','MMHB HTTP auth correction',ref,commit,'0'*40)
    ensure(changed(repo,commit,parent)==set(after),'CHECKPOINT_SCOPE')
    ensure(sha(repo.blob(commit,STORAGE))==STORAGE_SHA,'CHECKPOINT_LOST_STORAGE_GUARD')
    for path,raw in after.items():ensure(repo.blob(commit,path)==raw,'CHECKPOINT_CONTENT_MISMATCH')
    return ref,commit

def replace_one(path,expected,raw,st):
    ensure(regular(path)[0]==expected,'SOURCE_CHANGED_BEFORE_REPLACE')
    fd,tmp=tempfile.mkstemp(prefix='.mmhb-http-',suffix='.tmp',dir=path.parent)
    try:
        with os.fdopen(fd,'wb') as f:f.write(raw);f.flush();os.fchmod(f.fileno(),stat.S_IMODE(st.st_mode));os.fsync(f.fileno())
        ensure(regular(path)[0]==expected,'SOURCE_CHANGED_DURING_REPLACE')
        os.replace(tmp,path)
        dfd=os.open(path.parent,os.O_RDONLY|getattr(os,'O_DIRECTORY',0))
        try:os.fsync(dfd)
        finally:os.close(dfd)
    finally:
        if os.path.exists(tmp):os.unlink(tmp)

def execute(root=ROOT, report=REPORT, expected=EXPECTED, parent=STORAGE_COMMIT, report_sha=REPORT_SHA, apply=False):
    root=Path(root).absolute();ensure(root.is_dir() and root.resolve()==root,'CANDIDATE_MISSING_OR_SYMLINKED')
    repo=Repo(root);ensure(repo.text('rev-parse','--show-toplevel')==str(root),'CANDIDATE_ROOT')
    ensure(repo.head()==expected,'CANDIDATE_HEAD_CHANGED')
    ensure(repo.text('rev-list','--parents','-n','1',parent)==parent+' '+expected,'STORAGE_PARENT_CHANGED')
    ensure(changed(repo,parent,expected)=={STORAGE},'STORAGE_CHECKPOINT_SCOPE')
    ensure(sha(repo.blob(parent,STORAGE))==STORAGE_SHA,'STORAGE_CHECKPOINT_CONTENT')
    ensure(repo.text('rev-parse','--verify',STORAGE_REF)==parent,'STORAGE_REF_CHANGED')
    repo.run('diff','--cached','--quiet',expected,'--')
    names={x.decode() for x in repo.run('diff','--name-only','-z','--no-ext-diff','--no-textconv','--').split(b'\0') if x}
    ensure(names <= {STORAGE,AUTH,CSRF},'UNRELATED_TRACKED_EDITS')
    storage,_=regular(root/STORAGE);ensure(sha(storage)==STORAGE_SHA,'APPLIED_STORAGE_FIX_MISSING_OR_CHANGED')
    before={AUTH:report_source(report,expected,report_sha),CSRF:repo.blob(expected,CSRF)}
    for path,raw in before.items():ensure(repo.blob(expected,path)==raw and repo.blob(parent,path)==raw,'BASELINE_SOURCE_DIFFERS')
    after=transforms(before[AUTH],before[CSRF]);disk={};stats={}
    for path in before:
        disk[path],stats[path]=regular(root/path)
        ensure(stats[path].st_nlink==1,'HARDLINKED_SOURCE_REFUSED')
        mode=repo.text('ls-tree',parent,'--',path).split()[0]
        ensure(mode in ('100644','100755') and bool(stats[path].st_mode & 0o111)==(mode=='100755'),'SOURCE_MODE_CHANGED')
        ensure(disk[path] in (before[path],after[path]),'WORKING_SOURCE_DIFFERS:'+path)
    index=repo.index();config=repo.config();tests=behavior(before,after)
    print('CANDIDATE_HEAD='+expected);print('STORAGE_FIX_PARENT='+parent)
    print('EXISTING_STORAGE_GUARD=VERIFIED');print('SOURCE_BASELINES=EXACT_MATCH')
    print('BEHAVIOR_ASSERTIONS=39_OF_39');print('TEST_SCOPE=SOURCE_LOGIC_WITH_MOCK_AUTH_DEPENDENCIES')
    if not apply:
        print('APPLICATION_SOURCE_WRITES=0');print('STATUS=HTTP_GUARD_DRY_RUN_READY');return
    common=Path(repo.text('rev-parse','--path-format=absolute','--git-common-dir'))
    ensure(common.resolve()==common and common.is_dir(),'GIT_DIRECTORY_INVALID')
    fd=os.open(common/'mmhb-http-guard.lock',os.O_RDWR|os.O_CREAT|getattr(os,'O_NOFOLLOW',0),0o600)
    try:
        fcntl.flock(fd,fcntl.LOCK_EX|fcntl.LOCK_NB)
        audit=Path(tempfile.mkdtemp(prefix='mmhb-http-guard-',dir=common));print('AUDIT_DIR='+str(audit))
        patch=''
        for n,path in enumerate(before):
            write_new(audit/f'{n}.before.mjs',before[path]);write_new(audit/f'{n}.after.mjs',after[path])
            patch+=''.join(difflib.unified_diff(before[path].decode().splitlines(True),after[path].decode().splitlines(True),fromfile='a/'+path,tofile='b/'+path))
        write_new(audit/'http-guard.patch',patch.encode());write_new(audit/'tests.json',json.dumps(tests,indent=2).encode())
        ensure(repo.head()==expected and repo.index()==index and repo.config()==config,'CANDIDATE_STATE_CHANGED')
        for path in disk:ensure(regular(root/path)[0]==disk[path],'SOURCE_CHANGED_DURING_CHECKS')
        ensure(regular(root/STORAGE)[0]==storage,'STORAGE_CHANGED_DURING_CHECKS')
        ref,commit=preserve_checkpoint(repo,audit,parent,after)
        write_new(audit/'checkpoint.txt',(ref+'\n'+commit+'\n').encode())
        print('LOCAL_FIX_REF='+ref);print('LOCAL_FIX_COMMIT='+commit);print('CHECKPOINT_INCLUDES_STORAGE_GUARD=YES')
        # Individual replacements are atomic; a process interruption between them is recoverable.
        # A repeated invocation accepts only the pinned before/after versions for each file.
        writes=0
        for path in before:
            if disk[path]==before[path]:replace_one(root/path,disk[path],after[path],stats[path]);writes+=1
        for path in after:ensure(regular(root/path)[0]==after[path],'POST_WRITE_MISMATCH')
        ensure(regular(root/STORAGE)[0]==storage,'STORAGE_FIX_CHANGED')
        ensure(repo.head()==expected and repo.index()==index and repo.config()==config,'CANDIDATE_HEAD_INDEX_CONFIG_CHANGED')
        repo.run('diff','--check','--',AUTH,CSRF)
        print('APPLICATION_SOURCE_WRITES='+str(writes));print('WORKING_AUTH_SHA256='+sha(after[AUTH]));print('WORKING_CSRF_SHA256='+sha(after[CSRF]))
        print('STORAGE_FIX_PRESERVED=YES');print('CANDIDATE_HEAD_INDEX_CONFIG=UNCHANGED')
        print('APPLICATION_START=NO');print('DATABASE_OPERATIONS=NO');print('NETWORK_REQUESTS=NO')
        print('INSTALL=NO');print('BUILD=NO');print('PUSH=NO');print('DEPLOY=NO')
        print('INTEGRATION_QUALIFICATION=PENDING');print('STATUS=HTTP_GUARD_APPLIED_WITH_LOCAL_CHECKPOINT')
    finally:os.close(fd)

if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--apply',action='store_true');args=parser.parse_args()
    print('COMMAND=MMHB_AUTH_HTTP_GUARD')
    try:execute(apply=args.apply)
    except (Stop,OSError,ValueError,KeyError,subprocess.TimeoutExpired) as exc:
        print('STOP='+(str(exc) if isinstance(exc,Stop) else type(exc).__name__))
        print('STATUS=HTTP_GUARD_STOPPED');sys.exit(1)
