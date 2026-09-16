import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

// No dependency installation or application boot. Every import in the supplied
// module is replaced with an explicitly declared test double. This is a
// source-handler test, NOT Express/Passport/PostgreSQL/browser verification.
const input = new URL('./replitAuth.from-numbered-upload.mjs', import.meta.url);
const source = fs.readFileSync(input, 'utf8');
const events = [];
const cases = [];
const mutations = [];

async function harness(text = source, options = {}) {
  const calls = [];
  const captured = { sessionConfig: null, pgConfig: null, discoveryCount: 0, endParams: null };
  const routes = new Map();
  const env = Object.freeze({ SESSION_SECRET: 'fixture-only-not-a-real-secret', DATABASE_URL: 'postgresql://fixture@127.0.0.1/mmhb_fixture', REPL_ID: 'fixture-only', COOKIE_SECURE: 'false' });
  const context = vm.createContext({ URL, process: Object.freeze({ env }) }, { codeGeneration: { strings: false, wasm: false } });
  const client = {
    discovery: async () => { captured.discoveryCount++; return { issuer: 'mock' }; },
    buildEndSessionUrl: (_cfg, params) => { calls.push('provider-url'); captured.endParams = params; if (options.providerError) throw Error('fixture-provider-error'); return { href: 'https://idp.example.invalid/end-session' }; },
    refreshTokenGrant: async () => { calls.push('refresh-grant'); if (!options.refreshOK) throw Error('fixture-refresh-error'); return { claims: () => ({sub: 'fixture-user', exp: 4102444800}), access_token: 'fixture-access', refresh_token: 'fixture-refresh' }; }
  };
  const session = config => { captured.sessionConfig = config; return () => {}; };
  const noop = () => {};
  const passport = {initialize: () => noop, session: () => noop, serializeUser: noop, deserializeUser: noop, use: noop, authenticate: () => noop};
  const imports = {
    'openid-client': client,
    'openid-client/passport': {Strategy: class {}},
    passport: {default: passport},
    'express-session': {default: session},
    memoizee: {default: fn => fn},
    'connect-pg-simple': {default: () => class { constructor(config) {captured.pgConfig = config;} }},
    './storage.mjs': {authStorage: { upsertUser: async () => ({isNewUser:false}), getUserByReplitId: async () => {calls.push('lookup-user'); if(options.lookupError) throw Error('fixture-lookup-error'); return options.lookupUser || null;} }},
    '../../services/email.mjs': {sendWelcomeEmail: async () => {calls.push('email-double');}},
    '../../utils/logger.mjs': {logger:{debug:noop,info:noop,warn:noop,error:noop}},
    '../../security/csrf.mjs': {isSameOriginAuthRequest: req => {calls.push('origin-guard'); return req.fixtureSameOrigin === true;}},
    '../../db/sslConfig.mjs': {getPostgresConnectionString: x => x, getPostgresSslConfig: () => ({rejectUnauthorized:true})}
  };
  const mod = new vm.SourceTextModule(text, {context, identifier:'uploaded-replitAuth.mjs'});
  await mod.link(spec => {
    if (!(spec in imports)) throw Error('UNEXPECTED_IMPORT:' + spec);
    const obj = imports[spec];
    return new vm.SyntheticModule(Object.keys(obj), function() {
      for (const [key,value] of Object.entries(obj)) this.setExport(key,value);
    }, {context});
  });
  await mod.evaluate({timeout:1000});
  const app = {set:noop, use:noop, get:(path,fn) => routes.set('GET '+path,fn), post:(path,fn) => routes.set('POST '+path,fn)};
  await mod.namespace.setupAuth(app);
  function response() {
    return {statusCode:200, headers:{}, sent:false, cookies:[], destination:null,
      set(k,v){this.headers[k.toLowerCase()]=v;return this;},
      status(n){this.statusCode=n;return this;},
      type(t){this.contentType=t;return this;},
      send(body){this.body=body;this.sent=true;return this;},
      json(body){this.body=body;this.sent=true;return this;},
      clearCookie(name,opts){calls.push('clear-cookie'); if(options.clearError) throw Error('fixture-clear-error'); this.cookies.push({name,...opts});return this;},
      redirect(n,url){calls.push('redirect'); this.statusCode=n;this.destination=url;this.sent=true;return this;}
    };
  }
  function request(extra={}) {
    return {fixtureSameOrigin:true,protocol:'https',hostname:'www.mymentalhealthbuddy.com',
      session:{destroy(cb){calls.push('destroy-session');cb(null);}},
      logout(cb){calls.push('passport-logout');cb(null);}, ...extra};
  }
  return {calls,captured,routes,mod,response,request};
}
async function test(name, fn) {try {await fn();cases.push({name,result:'PASS'});} catch(e){cases.push({name,result:'FAIL',reason:String(e.message)});}}
async function checkSuccess(text=source){
 const h=await harness(text);const r=h.response();h.routes.get('POST /api/logout')(h.request(),r);
 assert.equal(r.statusCode,303);assert.deepEqual(h.calls,['origin-guard','provider-url','passport-logout','destroy-session','clear-cookie','redirect']);
 assert.equal(r.cookies[0].name,'connect.sid');assert.equal(r.cookies[0].secure,true);
}
async function checkDenied(text=source){
 const h=await harness(text);const r=h.response();h.routes.get('POST /api/logout')(h.request({fixtureSameOrigin:false}),r);
 assert.equal(r.statusCode,403);assert.deepEqual(h.calls,['origin-guard']);assert.equal(r.cookies.length,0);assert.equal(r.destination,null);
}
async function checkDestroyError(text=source){
 const h=await harness(text);const r=h.response();h.routes.get('POST /api/logout')(h.request({session:{destroy(cb){h.calls.push('destroy-session');cb(Error('fixture-failure'));}}}),r);
 assert.equal(r.statusCode,500);assert.equal(r.cookies.length,0);assert.equal(r.destination,null);
}
await test('session_options_are_secure_and_ignore_COOKIE_SECURE_false',async()=>{const h=await harness();assert.equal(h.captured.sessionConfig.cookie.secure,true);assert.equal(h.captured.sessionConfig.cookie.httpOnly,true);assert.equal(h.captured.sessionConfig.cookie.sameSite,'none');assert.equal(h.captured.sessionConfig.resave,false);assert.equal(h.captured.sessionConfig.saveUninitialized,false);assert.equal(h.captured.pgConfig.tableName,'sessions');assert.equal(h.captured.pgConfig.createTableIfMissing,false);assert.equal(h.captured.pgConfig.ttl,604800);});
await test('setup_invokes_mocked_OIDC_discovery',async()=>{const h=await harness();assert.equal(h.captured.discoveryCount,1);});
await test('GET_confirmation_does_not_call_logout_or_destroy',async()=>{const h=await harness();const r=h.response();h.routes.get('GET /api/logout')(h.request(),r);assert.equal(r.statusCode,200);assert.match(r.body,/<form method="post" action="\/api\/logout">/);assert.equal(r.headers['cache-control'],'no-store');assert.deepEqual(h.calls,[]);});
await test('POST_rejected_when_guard_double_returns_false',checkDenied);
await test('POST_success_callback_order_and_cookie_options',checkSuccess);
await test('POST_waits_for_both_async_callbacks',async()=>{const h=await harness();const r=h.response();let logoutCb,destroyCb;h.routes.get('POST /api/logout')(h.request({logout(cb){logoutCb=cb;},session:{destroy(cb){destroyCb=cb;}}}),r);assert.equal(r.sent,false);assert.equal(destroyCb,undefined);logoutCb(null);assert.equal(r.sent,false);assert.equal(typeof destroyCb,'function');destroyCb(null);assert.equal(r.statusCode,303);});
await test('POST_destroys_session_that_exists_after_passport_logout',async()=>{const h=await harness();const r=h.response();const q=h.request();q.session={destroy(){throw Error('obsolete-session-used');}};q.logout=cb=>{q.session={destroy(done){h.calls.push('replacement-destroy');done(null);}};cb(null);};h.routes.get('POST /api/logout')(q,r);assert.equal(r.statusCode,303);assert.ok(h.calls.includes('replacement-destroy'));});
await test('POST_passport_error_does_not_redirect_success',async()=>{const h=await harness();const r=h.response();h.routes.get('POST /api/logout')(h.request({logout(cb){cb(Error('fixture'));}}),r);assert.equal(r.statusCode,500);assert.equal(r.destination,null);assert.equal(r.cookies.length,0);assert.ok(!h.calls.includes('destroy-session'));});
await test('POST_missing_session_returns_500',async()=>{const h=await harness();const r=h.response();h.routes.get('POST /api/logout')(h.request({session:undefined}),r);assert.equal(r.statusCode,500);assert.equal(r.destination,null);});
await test('POST_destroy_error_returns_500_without_cookie_clear',checkDestroyError);
await test('POST_provider_url_failure_happens_before_session_mutation',async()=>{const h=await harness(source,{providerError:true});const r=h.response();h.routes.get('POST /api/logout')(h.request(),r);assert.equal(r.statusCode,500);assert.deepEqual(h.calls,['origin-guard','provider-url']);});
await test('POST_cookie_clear_throw_returns_500',async()=>{const h=await harness(source,{clearError:true});const r=h.response();h.routes.get('POST /api/logout')(h.request(),r);assert.equal(r.statusCode,500);assert.equal(r.destination,null);});
await test('POST_logout_synchronous_throw_returns_500',async()=>{const h=await harness();const r=h.response();h.routes.get('POST /api/logout')(h.request({logout(){throw Error('fixture');}}),r);assert.equal(r.statusCode,500);});
await test('isAuthenticated_missing_user_returns_401',async()=>{const h=await harness();const r=h.response();let next=false;await h.mod.namespace.isAuthenticated({session:{}},r,()=>{next=true;});assert.equal(r.statusCode,401);assert.equal(next,false);});
await test('isAuthenticated_valid_cached_session_calls_next',async()=>{const h=await harness();const r=h.response();let next=false;await h.mod.namespace.isAuthenticated({user:{expires_at:4102444800,claims:{sub:'fixture'}},session:{dbUserId:'fixture-uuid'}},r,()=>{next=true;});assert.equal(next,true);assert.deepEqual(h.calls,[]);});
await test('isAuthenticated_backup_userData_path_calls_next',async()=>{const h=await harness();const r=h.response();let next=false;const user={expires_at:4102444800,claims:{sub:'fixture'}};const req={session:{userData:user,dbUserId:'fixture-uuid'}};await h.mod.namespace.isAuthenticated(req,r,()=>{next=true;});assert.equal(next,true);assert.equal(req.user,user);});
await test('isAuthenticated_unknown_db_identity_returns_401',async()=>{const h=await harness();const r=h.response();await h.mod.namespace.isAuthenticated({user:{expires_at:4102444800,claims:{sub:'fixture'}},session:{}},r,()=>assert.fail('unexpected-next'));assert.equal(r.statusCode,401);assert.deepEqual(h.calls,['lookup-user']);});
await test('isAuthenticated_expired_without_refresh_returns_401',async()=>{const h=await harness();const r=h.response();await h.mod.namespace.isAuthenticated({user:{expires_at:1,claims:{sub:'fixture'}},session:{dbUserId:'fixture-uuid'}},r,()=>assert.fail('unexpected-next'));assert.equal(r.statusCode,401);});
await test('isAuthenticated_failed_mock_refresh_returns_401',async()=>{const h=await harness();const r=h.response();await h.mod.namespace.isAuthenticated({user:{expires_at:1,refresh_token:'fixture',claims:{sub:'fixture'}},session:{dbUserId:'fixture-uuid'}},r,()=>assert.fail('unexpected-next'));assert.equal(r.statusCode,401);assert.deepEqual(h.calls,['refresh-grant']);});
await test('isAuthenticated_successful_mock_refresh_calls_next',async()=>{const h=await harness(source,{refreshOK:true});const r=h.response();let next=false;await h.mod.namespace.isAuthenticated({user:{expires_at:1,refresh_token:'fixture',claims:{sub:'fixture'}},session:{dbUserId:'fixture-uuid'}},r,()=>{next=true;});assert.equal(next,true);});

for(const [name,before,after,check] of [
 ['origin_guard_bypassed','if (!isSameOriginAuthRequest(req)) {','if (false) {',checkDenied],
 ['session_destroy_omitted','req.session.destroy((destroyErr) => {','((callback) => callback(null))((destroyErr) => {',checkSuccess],
 ['destroy_error_ignored','if (destroyErr) return failLogout();','if (false) return failLogout();',checkDestroyError],
 ['cookie_secure_disabled','path: "/", httpOnly: true, secure: true, sameSite: "none",','path: "/", httpOnly: true, secure: false, sameSite: "none",',checkSuccess]
]) {
 assert.equal(source.split(before).length-1,1,'mutation target uniqueness');
 let rejected=false;try {await check(source.replace(before,after));}catch{rejected=true;}
 mutations.push({name,result:rejected?'DETECTED':'MISSED'});
}

const report={
 schema:'MMHB_UPLOADED_AUTH_SOURCE_REVIEW_V1',
 source:'Source lines 1-309 reconstructed from Pasted text (4).txt; terminal numbering removed; line endings normalized. This is not a byte-attestation of the remote filesystem.',
 source_sha256:crypto.createHash('sha256').update(source).digest('hex'),
 runtime:process.version,
 scope:'Mocked source-handler tests in ChatGPT container. No real Express, Passport, PostgreSQL, OIDC, email, HTTP or browser integration.',
 mocks:['all imported dependencies','isSameOriginAuthRequest return value','request/response/session callbacks','OIDC discovery and token refresh'],
 application_source_edits_in_replit:0,
 app_started:false,
 actual_external_api_requests:0,
 result:cases.every(t=>t.result==='PASS')&&mutations.every(t=>t.result==='DETECTED')?'MOCKED_HANDLER_CHECKS_PASS':'FAILED',
 cases,mutations,
 not_proven:['Actual CSRF helper validation and proxy-origin behavior','Real session-store destruction or credential replay','Production cookies or browser acceptance','Deployed route ordering','Provider logout or token revocation','No source drift in Replit since upload']
};
fs.writeFileSync(new URL('../MMHB_AUTH_SOURCE_REVIEW_RESULTS.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({result:report.result,passed:cases.filter(x=>x.result==='PASS').length,total:cases.length,mutations_detected:mutations.filter(x=>x.result==='DETECTED').length,scope:report.scope},null,2));
for(const c of cases.filter(x=>x.result==='FAIL')) console.log(c);
if(report.result==='FAILED')process.exitCode=1;
