import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
const ROOT=path.dirname(fileURLToPath(import.meta.url));
const manifest=JSON.parse(fs.readFileSync(path.join(ROOT,'source_manifest.json'),'utf8'));
const sources=new Map(manifest.map(m=>[m.file,fs.readFileSync(path.join(ROOT,'sources',m.file),'utf8')]));
for(const m of manifest) assert.equal(crypto.createHash('sha256').update(sources.get(m.file)).digest('hex'),m.sha256);
const results=[];
function response(){return {statusCode:200,headers:{},body:undefined,cookies:[],redirects:[],status(n){this.statusCode=n;return this},set(k,v){this.headers[k.toLowerCase()]=v;return this},type(x){this.contentType=x;return this},json(x){this.body=x;return this},send(x){this.body=x;return this},cookie(...x){this.cookies.push(x);return this},clearCookie(...x){this.cookies.push(x);return this},redirect(n,x){this.statusCode=typeof n==='number'?n:302;this.redirects.push(x??n);return this}}}
async function world(mutations={}){
 const calls={verify:[],refresh:0,lookup:0,next:0,destroy:0,logout:0,log:0};
 const state={claims:{id:'fixture-user',role:'user'},row:{id:'fixture-user',email:'test@example.invalid',passwordHash:'NOT_A_REAL_PASSWORD_HASH'},refreshResult:false,throwLookup:false};
 const env={JWT_SECRET:'offline-fixture-only-secret-not-for-deployment-0123456789',NODE_ENV:'test'};
 const ctx=vm.createContext({Buffer,URL,process:{env},console:{log(){},warn(){},error(){}}});
 const pass=()=>{};
 const stubs={
  'node:crypto':{default:crypto},
  'jsonwebtoken':{default:{verify(token,key,options){calls.verify.push({token,key,options});if(token!=='valid-fixture') throw Error('fixture invalid token');return structuredClone(state.claims)},sign(payload,key,opts){calls.sign={payload,key,opts};return 'fixture-signed-not-a-jwt'}}},
  'server/replit_integrations/auth/storage.mjs':{authStorage:{async getUserByReplitId(){calls.lookup++;if(state.throwLookup)throw Error('fixture store failure');return state.row},async getUser(){calls.lookup++;return state.row},async upsertUser(){throw Error('UNEXPECTED_ACCOUNT_WRITE')}}},
  'server/utils/logger.mjs':{logger:{error(){calls.log++},info(){},debug(){},warn(){}}},
  'server/config/secrets.mjs':{JWT_SECRET:env.JWT_SECRET},
  'server/services/email.mjs':{sendWelcomeEmail(){throw Error('UNEXPECTED_EMAIL_CALL')}},
  'server/db/sslConfig.mjs':{getPostgresConnectionString:x=>x,getPostgresSslConfig:()=>false},
  'openid-client':{async discovery(){calls.discovery=(calls.discovery||0)+1;return {}},async refreshTokenGrant(){calls.refresh++;if(!state.refreshResult)throw Error('fixture refresh refused');return {claims(){return {sub:'fixture-replit-user',exp:Math.floor(Date.now()/1000)+3600}},access_token:'fixture-access',refresh_token:'fixture-refresh'}},buildEndSessionUrl(){return new URL('https://idp.example.invalid/end')}},
  'openid-client/passport':{Strategy:class{}},
  'passport':{default:{initialize:()=>pass,session:()=>pass,serializeUser(){},deserializeUser(){},use(){},authenticate(){throw Error('UNEXPECTED_LOGIN_NETWORK_PATH')}}},
  'express-session':{default:opts=>{state.sessionOptions=opts;return pass}},
  'connect-pg-simple':{default:()=>class{constructor(opts){state.storeOptions=opts}}},
  'memoizee':{default:fn=>fn},
 };
 const cache=new Map();
 async function load(id){
   if(cache.has(id))return cache.get(id);
   let mod;
   if(sources.has(id)){mod=new vm.SourceTextModule(mutations[id]??sources.get(id),{context:ctx,identifier:id});cache.set(id,mod);await mod.link(async(spec,parent)=>{const key=spec.startsWith('.')?path.posix.normalize(path.posix.join(path.posix.dirname(parent.identifier),spec)):spec;return load(key)})}
   else {const obj=stubs[id];if(!obj)throw Error('UNAPPROVED_IMPORT:'+id);mod=new vm.SyntheticModule(Object.keys(obj),function(){for(const [k,v]of Object.entries(obj))this.setExport(k,v)},{context:ctx,identifier:id});cache.set(id,mod)}
   return mod;
 }
 for(const id of sources.keys()){const m=await load(id);if(m.status!=='evaluated')await m.evaluate({timeout:1000})}
 const namespaces=Object.fromEntries([...cache].filter(([k])=>sources.has(k)).map(([k,m])=>[k,m.namespace]));
 const routes=new Map();const app={set(){},use(){},get(p,h){routes.set('GET '+p,h)},post(p,h){routes.set('POST '+p,h)}};
 await namespaces['server/replit_integrations/auth/replitAuth.mjs'].setupAuth(app);
 namespaces['server/replit_integrations/auth/routes.mjs'].registerAuthRoutes(app);
 return {calls,state,env,origin:namespaces['server/security/csrf.mjs'].isSameOriginAuthRequest,csrf:namespaces['server/security/csrf.mjs'].csrfProtection,issue:namespaces['server/security/csrf.mjs'].issueCsrfToken,auth:namespaces['server/middleware/auth.mjs'],oidc:namespaces['server/replit_integrations/auth/replitAuth.mjs'],routes};
}
async function check(group,name,fn,classification='BEHAVIOR_ASSERTION'){
 try{const observed=await fn();results.push({group,name,classification,result:'PASS',observed:observed??null})}
 catch(e){results.push({group,name,classification,result:'FAIL',error:e.message});process.exitCode=1}
}
const originCases=[
 ['exact https origin',{host:'app.example.invalid',origin:'https://app.example.invalid'},'https',true],
 ['different scheme',{host:'app.example.invalid',origin:'http://app.example.invalid'},'https',false],
 ['foreign origin',{host:'app.example.invalid',origin:'https://foreign.example.invalid'},'https',false],
 ['local exact port',{host:'127.0.0.1:55001',origin:'http://127.0.0.1:55001'},'http',true],
 ['wrong port',{host:'127.0.0.1:55001',origin:'http://127.0.0.1:55002'},'http',false],
 ['opaque null origin',{host:'app.example.invalid',origin:'null'},'https',false],
 ['origin with path',{host:'app.example.invalid',origin:'https://app.example.invalid/path'},'https',false],
 ['origin trailing slash',{host:'app.example.invalid',origin:'https://app.example.invalid/'},'https',false],
 ['multiple origin values',{host:'app.example.invalid',origin:'https://app.example.invalid https://foreign.example.invalid'},'https',false],
 ['origin array',{host:'app.example.invalid',origin:['https://app.example.invalid']},'https',false],
 ['invalid origin does not fall back',{host:'app.example.invalid',origin:'null',referer:'https://app.example.invalid/form'},'https',false],
 ['referer fallback same origin',{host:'app.example.invalid',referer:'https://app.example.invalid/form?x=1'},'https',true],
 ['referer foreign origin',{host:'app.example.invalid',referer:'https://foreign.example.invalid/form'},'https',false],
 ['referer credentials rejected',{host:'app.example.invalid',referer:'https://user:pass@app.example.invalid/form'},'https',false],
 ['referer whitespace rejected',{host:'app.example.invalid',referer:' https://app.example.invalid/form'},'https',false],
 ['missing all signals',{host:'app.example.invalid'},'https',false],
 ['same origin fetch metadata',{host:'app.example.invalid','sec-fetch-site':'same-origin'},'https',true],
 ['cross site overrides matching origin',{host:'app.example.invalid','sec-fetch-site':'cross-site',origin:'https://app.example.invalid'},'https',false],
 ['same site rejected',{host:'app.example.invalid','sec-fetch-site':'same-site',origin:'https://app.example.invalid'},'https',false],
 ['none fetch site rejected',{host:'app.example.invalid','sec-fetch-site':'none',origin:'https://app.example.invalid'},'https',false],
 ['unknown fetch site rejected',{host:'app.example.invalid','sec-fetch-site':'future-value',origin:'https://app.example.invalid'},'https',false],
 ['host whitespace rejected',{host:'app.example.invalid ',origin:'https://app.example.invalid'},'https',false],
 ['host delimiter rejected',{host:'app.example.invalid/extra',origin:'https://app.example.invalid'},'https',false],
 ['invalid protocol',{host:'app.example.invalid',origin:'https://app.example.invalid'},'ftp',false],
 ['metadata early return before host validation',{'sec-fetch-site':'same-origin'},undefined,true],
 ['metadata early return ignores referer conflict',{'sec-fetch-site':'same-origin',host:'app.example.invalid',referer:'https://foreign.example.invalid/form'},'https',true],
 ['target is request derived',{host:'other.example.invalid',origin:'https://other.example.invalid'},'https',true],
];
const w=await world();
for(const [name,headers,protocol,expect]of originCases)await check('origin predicate',name,()=>{const actual=w.origin({headers,protocol});assert.equal(actual,expect);return actual},name.startsWith('metadata early')||name==='target is request derived'?'POLICY_BOUNDARY_OBSERVATION':'BEHAVIOR_ASSERTION');
function invokeCsrf(req){const res=response();let next=0;w.csrf({method:'POST',path:'/api/private-probe',headers:{},cookies:{},protocol:'https',...req},res,()=>next++);return {next,status:res.statusCode,body:res.body,headers:res.headers}}
const csrfCases=[
 ['lowercase api without token',{},0,403],
 ['uppercase API skips generic check',{path:'/API/private-probe'},1,200],
 ['mixed case Api skips generic check',{path:'/Api/private-probe'},1,200],
 ['missing slash api path skips generic check',{path:'/api'},1,200],
 ['matching csrf cookie header',{cookies:{csrf_secret:'x'.repeat(64)},headers:{'x-csrf-token':'x'.repeat(64)}},1,200],
 ['wrong csrf token',{cookies:{csrf_secret:'x'.repeat(64)},headers:{'x-csrf-token':'y'.repeat(64)}},0,403],
 ['missing csrf cookie',{headers:{'x-csrf-token':'x'.repeat(64)}},0,403],
 ['Bearer header alone skips csrf',{headers:{authorization:'Bearer deliberately-invalid-fixture'}},1,200],
 ['guest header alone skips csrf',{headers:{'x-guest-id':'unverified-fixture'}},1,200],
 ['auth route gets origin check before bearer exemption',{path:'/api/auth/logout',headers:{authorization:'Bearer deliberately-invalid-fixture'}},0,403],
 ['case varied auth still protected',{path:'/API/AUTH/logout',headers:{'x-guest-id':'fixture'}},0,403],
 ['auth same origin passes without double submit',{path:'/api/auth/logout',headers:{host:'app.example.invalid',origin:'https://app.example.invalid'}},1,200],
 ['GET safe method',{method:'GET'},1,200],
 ['explicit feedback exemption',{path:'/api/feedback'},1,200],
];
for(const [name,req,next,status]of csrfCases)await check('csrf middleware',name,()=>{const a=invokeCsrf(req);assert.equal(a.next,next);assert.equal(a.status,status);return a},/skips|exemption/.test(name)?'GUARD_SCOPE_OBSERVATION':'BEHAVIOR_ASSERTION');
await check('csrf issuance','creates 32-byte hex cookie',()=>{const res=response();const t=w.issue({cookies:{}},res);assert.match(t,/^[a-f0-9]{64}$/);assert.equal(res.cookies.length,1);assert.equal(res.cookies[0][2].httpOnly,true);return {token_length:t.length,httpOnly:true}});
await check('csrf issuance','production cookie secure',()=>{w.env.NODE_ENV='production';const res=response();w.issue({cookies:{}},res);assert.equal(res.cookies[0][2].secure,true);w.env.NODE_ENV='test';return true});
await check('csrf issuance','existing cookie reused',()=>{const res=response();const t=w.issue({cookies:{csrf_secret:'fixture'.repeat(10)}},res);assert.equal(t,'fixture'.repeat(10));assert.equal(res.cookies.length,0);return true});
// Compare the user-info endpoint with the dedicated OIDC middleware using mocked storage/refresh only.
for(const [name,expiry,has]of [['missing expiry',undefined,false],['zero expiry',0,true],['nonnumeric expiry','not-a-number',true],['future expiry',Math.floor(Date.now()/1000)+3600,true],['expired expiry',1,true]]){
 await check('OIDC identity handling',name,async()=>{
  const v=await world();const user={claims:{sub:'fixture-replit-user'}};if(has)user.expires_at=expiry;
  const req1={headers:{},session:{userData:structuredClone(user)}};const res1=response();
  await v.routes.get('GET /api/auth/user')(req1,res1);
  const req2={headers:{},session:{userData:structuredClone(user),dbUserId:'fixture-user'}};const res2=response();let n=0;
  await v.oidc.isAuthenticated(req2,res2,()=>n++);
  const expectedProfile=name==='expired expiry'?null:v.state.row;
  assert.equal(res1.body,expectedProfile);assert.equal(n,name==='future expiry'?1:0);
  return {profileReturned:res1.body!==null,protectedMiddlewareAllowed:n===1,profileHasPrivateFixtureField:res1.body?.passwordHash!==undefined};
 },name==='future expiry'||name==='expired expiry'?'BEHAVIOR_ASSERTION':'INCONSISTENT_IDENTITY_CHECK_CONFIRMED')
}
await check('profile output','returned storage row forwarded without projection',async()=>{const v=await world();const r=response();await v.routes.get('GET /api/auth/user')({headers:{authorization:'Bearer valid-fixture'}},r);assert.equal(r.body,v.state.row);assert.equal(r.body.passwordHash,'NOT_A_REAL_PASSWORD_HASH');return 'Mock sensitive field is forwarded if storage returns it; real storage content not supplied.'},'CONDITIONAL_DATA_EXPOSURE');
await check('profile output','storage failure and anonymous both produce json null',async()=>{const v=await world();v.state.throwLookup=true;const r=response();await v.routes.get('GET /api/auth/user')({headers:{},user:{claims:{sub:'fixture-user'},expires_at:9999999999}},r);assert.equal(r.body,null);assert.equal(r.statusCode,200);return true},'ERROR_CLASSIFICATION_OBSERVATION');
for(const fn of ['requireAuth','requireAuthStrict']){
 await check('bearer middleware',fn+' rejects session-only caller',()=>{const r=response();let n=0;w.auth[fn]({headers:{},user:{claims:{sub:'fixture-user'}},session:{userData:{claims:{sub:'fixture-user'}}}},r,()=>n++);assert.equal(r.statusCode,401);assert.equal(n,0);return {status:r.statusCode}});
 await check('bearer middleware',fn+' verifies but supplies no issuer audience constraints',()=>{const r=response();let n=0;w.auth[fn]({headers:{authorization:'Bearer valid-fixture'}},r,()=>n++);assert.equal(n,1);assert.equal(w.calls.verify.at(-1).options,undefined);return 'JWT verification is mocked; the exact middleware supplies no verify options.'},'VERIFIER_OPTIONS_OBSERVATION');
 await check('bearer middleware',fn+' does not require id in verified claims',()=>{w.state.claims={role:'user'};const r=response();let n=0;w.auth[fn]({headers:{authorization:'Bearer valid-fixture'}},r,()=>n++);assert.equal(n,1);w.state.claims={id:'fixture-user',role:'user'};return true},'CLAIM_SCHEMA_OBSERVATION');
}
await check('combined guards','guest csrf exemption alone does not pass requireAuth',()=>{const r=response();let n=0;const q={path:'/api/private-probe',method:'POST',headers:{'x-guest-id':'fixture'}};w.csrf(q,r,()=>w.auth.requireAuth(q,r,()=>n++));assert.equal(r.statusCode,401);assert.equal(n,0);return 401});
await check('combined guards','invalid bearer csrf exemption still fails requireAuth',()=>{const r=response();let n=0;const q={path:'/api/private-probe',method:'POST',headers:{authorization:'Bearer invalid-fixture'}};w.csrf(q,r,()=>w.auth.requireAuth(q,r,()=>n++));assert.equal(r.statusCode,401);assert.equal(n,0);return 401});
await check('bearer/session independence','removing cookie session does not enter JWT rejection path',()=>{let allowed=0;const q={headers:{authorization:'Bearer valid-fixture'},session:{userData:{id:'fixture-user'}}};w.auth.requireAuth(q,response(),()=>allowed++);delete q.session;w.auth.requireAuth(q,response(),()=>allowed++);assert.equal(allowed,2);return 'With the same mocked valid JWT verifier result, the middleware admits both requests; no session-store or revocation call exists here.'},'LOGOUT_SCOPE_OBSERVATION');
// Combine the actual origin predicate with the actual OIDC POST logout handler, mocking only external services/session callbacks.
for(const [name,headers,expected]of [['same-origin logout',{host:'app.example.invalid',origin:'https://app.example.invalid'},303],['foreign-origin logout',{host:'app.example.invalid',origin:'https://foreign.example.invalid'},403],['missing-origin logout',{host:'app.example.invalid'},403]]){
 await check('combined logout guard',name,async()=>{const v=await world();const r=response();const q={headers,protocol:'https',hostname:'app.example.invalid',logout(cb){v.calls.logout++;cb()},session:{destroy(cb){v.calls.destroy++;cb()}}};v.routes.get('POST /api/logout')(q,r);assert.equal(r.statusCode,expected);assert.equal(v.calls.destroy,expected===303?1:0);assert.equal(v.calls.logout,expected===303?1:0);return {status:r.statusCode,destroyCalls:v.calls.destroy,logoutCalls:v.calls.logout}})
}
// Mutations prove selected positive/security expectations are capable of detecting regressions.
const mutations=[
 ['origin all allowed','server/security/csrf.mjs',s=>s.replace('const headers = req.headers || {};','return true;\n const headers = req.headers || {};'),async v=>assert.equal(v.origin({headers:{host:'app.example.invalid',origin:'https://foreign.example.invalid'},protocol:'https'}),false)],
 ['auth route precedence removed','server/security/csrf.mjs',s=>s.replace('if (/^\\/api\\/auth(?:\\/|$)/i.test(req.path)) {','if (false) {'),async v=>{const r=response();let n=0;v.csrf({path:'/api/auth/logout',method:'POST',headers:{'x-guest-id':'fixture'},cookies:{}},r,()=>n++);assert.equal(n,0);assert.equal(r.statusCode,403)}],
 ['csrf mismatch accepted','server/security/csrf.mjs',s=>s.replace('if (!cookieSecret || !headerToken || !timingSafeEq(cookieSecret, headerToken)) {','if (false) {'),async v=>{const r=response();let n=0;v.csrf({path:'/api/private-probe',method:'POST',headers:{'x-csrf-token':'y'},cookies:{csrf_secret:'x'}},r,()=>n++);assert.equal(n,0)}],
 ['expired profile refresh ignored','server/replit_integrations/auth/routes.mjs',s=>s.replace('if (user.expires_at && now > user.expires_at) {','if (false) {'),async v=>{const r=response();await v.routes.get('GET /api/auth/user')({headers:{},user:{claims:{sub:'fixture-user'},expires_at:1}},r);assert.equal(r.body,null)}]
];
for(const [name,id,mut,expect]of mutations){await check('mutation detection',name,async()=>{const modified=mut(sources.get(id));assert.notEqual(modified,sources.get(id));const v=await world({[id]:modified});let detected=false;try{await expect(v)}catch(e){if(e.code==='ERR_ASSERTION')detected=true;else throw e}assert.equal(detected,true);return 'DETECTED'},'MUTATION_DETECTED')}
const report={schema:'MMHB_AUTH_BOUNDARY_REVIEW_V1',createdAt:new Date().toISOString(),reportedCandidateCommit:'63ff8372d07368a5434c11ff58bdf87bb468449d',nodeVersion:process.version,executionLocation:'ChatGPT container, not Replit',sourceDerivation:'Extracted contiguous numbered source lines from user-uploaded terminal transcripts; normalized line endings. No repository bytes or entire application available.',networkRequestsDuringTests:0,realDatabaseUsed:false,realJWTLibraryUsed:false,realExpressUsed:false,realPassportUsed:false,sourceManifest:manifest,summary:{checks:results.length,passed:results.filter(x=>x.result==='PASS').length,failed:results.filter(x=>x.result!=='PASS').length,mutationChecks:mutations.length},limits:['Behavior assertions include confirmation of review findings; PASS does not imply application safety.','JWT cryptography and claims validation are mocked, not independently certified.','Request/response objects, storage, provider discovery and refresh, Passport, and session store are mocked.','No production exploit, route reachability, browser behavior, revocation, or real session destruction proven.'],results};
fs.writeFileSync(path.join(ROOT,'results.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report.summary,null,2));for(const r of results.filter(x=>x.result==='FAIL'))console.log(r);
