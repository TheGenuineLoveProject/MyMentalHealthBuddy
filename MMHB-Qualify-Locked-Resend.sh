#!/usr/bin/env bash
(
set -euo pipefail
umask 077
cd /home/runner/workspace
node --input-type=commonjs <<'MMHB47_NODE'
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {spawn,spawnSync}=require('node:child_process');
const ROOT='/home/runner/workspace',ID='MMHB-LOCKED-RESEND-QUALIFICATION-20260925-47';
const PACKAGE_PIN='e034489afed62c076902a2176193bbfb682de357d0c673a517b4026dded4aa7f';
const LOCK_PIN='6574eef640049a1acea6692899408b2d803bcd481fb9b9d3d59efe8d25b76fae';
const SDK_PIN='9d5aa4effe633a790e15007de8f466ae6bec455dce2d6409d310c124328aee6a';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const check=(ok,message)=>{if(!ok)throw Error(message);};
const env={PATH:process.env.PATH||'/usr/bin:/bin',LANG:'C.UTF-8',TZ:'UTC',CI:'true',
  GIT_OPTIONAL_LOCKS:'0',GIT_TERMINAL_PROMPT:'0',GIT_NO_LAZY_FETCH:'1'};
const observed=new Map(),absent=new Set();
let directory,stage,before,status='STOPPED',preserved=false,interrupted=false,active=null;
let npmInstalled=false,inventory,reference,locked,installCode=null;
function stopChild(){if(Number.isInteger(active?.pid)){try{process.kill(-active.pid,'SIGKILL');}catch(e){if(e.code!=='ESRCH')throw e;}}}
process.on('SIGINT',()=>{interrupted=true;stopChild();});
process.on('SIGTERM',()=>{interrupted=true;stopChild();});
function regular(file,max=8388608){
  const s=fs.lstatSync(file);check(s.isFile()&&s.size<=max&&fs.realpathSync(file)===file,'Unsafe or oversized input: '+file);
  return fs.readFileSync(file);
}
function read(file,optional=false){
  let b;try{b=regular(file);}catch(e){if(optional&&e.code==='ENOENT'){absent.add(file);return null;}throw e;}
  const h=hash(b);if(observed.has(file))check(observed.get(file)===h,'Observed input changed: '+file);else observed.set(file,h);return b;
}
function git(...args){
  const r=spawnSync('git',['--no-pager','--no-optional-locks','-c','core.fsmonitor=false','-c','core.quotePath=true',...args],
    {cwd:ROOT,env,encoding:'utf8',timeout:30000,maxBuffer:33554432});
  check(!r.error&&r.status===0,'Git inspection failed: '+args[0]);return r.stdout;
}
function snapshot(){
  const index=path.resolve(ROOT,git('rev-parse','--git-path','index').trim());
  return {head:git('rev-parse','HEAD').trim(),branch:git('branch','--show-current').trim(),
    index:hash(regular(index,33554432)),status:git('status','--porcelain=v1','--untracked-files=normal','--ignore-submodules=none'),
    diff:hash(git('diff','--binary','--no-ext-diff','--no-textconv','HEAD','--')),
    untrackedNames:hash(git('ls-files','--others','--exclude-standard','-z'))};
}
function privateDir(dir){const s=fs.lstatSync(dir);check(s.isDirectory()&&s.uid===process.getuid()&&(s.mode&0o077)===0&&fs.realpathSync(dir)===dir,'Expected private canonical directory');}
function put(rel,value){
  check(!path.isAbsolute(rel)&&!rel.split('/').includes('..'),'Invalid output path');
  const file=path.join(directory,rel);fs.mkdirSync(path.dirname(file),{recursive:true,mode:0o700});
  fs.writeFileSync(file,value,{flag:'wx',mode:0o600});return file;
}
function out(label,value){console.log(label+'='+JSON.stringify(value));}
function freeBytes(){const s=fs.statfsSync(directory,{bigint:true});return s.bavail*s.bsize;}
function npmTreeSettings(buffer){
  const settings={'legacy-peer-deps':'false','strict-peer-deps':'false','install-links':'false','install-strategy':'hoisted'};
  if(!buffer)return settings;
  for(const line of buffer.toString('utf8').split(/\r?\n/)){
    const match=line.trim().match(/^([a-z-]+)\s*=\s*(.*?)\s*$/i);if(!match||!Object.hasOwn(settings,match[1].toLowerCase()))continue;
    const key=match[1].toLowerCase(),value=match[2];
    check(key==='install-strategy'?value==='hoisted':/^(true|false)$/.test(value),'Unsupported project npm tree setting: '+key);
    settings[key]=value;
  }
  return settings;
}
function validateLock(pkg,lock){
  check(lock.lockfileVersion===3&&lock.packages&&typeof lock.packages==='object','Expected npm lockfile version 3');
  check(!pkg.workspaces,'Workspace installation requires its own reviewed source snapshot');
  check(pkg.dependencies?.resend==='^6.12.0'&&lock.packages['']?.dependencies?.resend==='^6.12.0','Resend declaration changed');
  check(lock.packages['node_modules/resend']?.version==='6.22.1','Root lock Resend version changed');
  let count=0;
  for(const [name,entry] of Object.entries(lock.packages)){
    if(!name)continue;
    check(++count<=10000,'Lock package count exceeds 10000');
    check(/^(?:node_modules\/(?:@[a-z0-9_.-]+\/)?[a-z0-9_.-]+)(?:\/node_modules\/(?:@[a-z0-9_.-]+\/)?[a-z0-9_.-]+)*$/i.test(name),'Unsupported lock package path');
    check(entry&&typeof entry==='object'&&!entry.link&&typeof entry.version==='string','Unsupported linked or incomplete lock package');
    if(entry.inBundle&&!entry.resolved)continue;
    let u;try{u=new URL(entry.resolved);}catch{throw Error('Lock entry is not a public registry tarball: '+name);}
    check(u.protocol==='https:'&&u.hostname==='registry.npmjs.org'&&!u.port&&!u.username&&!u.password&&!u.search&&!u.hash&&u.pathname.endsWith('.tgz'),'Non-public-registry lock entry: '+name);
    check(typeof entry.integrity==='string'&&/^(sha512|sha384|sha256|sha1)-[A-Za-z0-9+/=]+(?:\s+(?:sha512|sha384|sha256|sha1)-[A-Za-z0-9+/=]+)*$/.test(entry.integrity),'Missing or unsupported lock integrity: '+name);
  }
  return count;
}
function installedInventory(project,lock){
  const rows=[],seen=new Set();
  function scan(modules,depth=0){
    check(depth<=24,'Installed dependency nesting exceeds bound');
    const ms=fs.lstatSync(modules);check(ms.isDirectory()&&fs.realpathSync(modules)===modules,'Unsafe installed node_modules');
    for(const item of fs.readdirSync(modules,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))){
      if(item.name.startsWith('.'))continue;
      const file=path.join(modules,item.name);
      if(item.name.startsWith('@')){
        check(item.isDirectory()&&fs.realpathSync(file)===file,'Unsafe installed scope');
        for(const child of fs.readdirSync(file,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name)))visit(path.join(file,child.name),depth);
      }else visit(file,depth);
    }
  }
  function visit(folder,depth){
    check(rows.length<10000,'Installed package count exceeds bound');
    const st=fs.lstatSync(folder);check(st.isDirectory()&&fs.realpathSync(folder)===folder,'Linked installed package rejected');
    const rel=path.relative(project,folder).split(path.sep).join('/'),expected=lock.packages[rel];
    check(expected&&!expected.link,'Installed package absent from root lock: '+rel);
    const bytes=regular(path.join(folder,'package.json')),pkg=JSON.parse(bytes);
    check(pkg.version===expected.version,'Installed version differs from copied lock: '+rel);
    if(expected.name)check(pkg.name===expected.name,'Installed alias identity differs: '+rel);
    rows.push({path:rel,name:pkg.name,version:pkg.version,packageSha256:hash(bytes)});seen.add(rel);
    const nested=path.join(folder,'node_modules');
    try{fs.lstatSync(nested);}catch(e){if(e.code==='ENOENT')return;throw e;}scan(nested,depth+1);
  }
  scan(path.join(project,'node_modules'));
  const hidden=JSON.parse(regular(path.join(project,'node_modules/.package-lock.json')));
  for(const row of rows){
    const actual=hidden.packages?.[row.path],expected=lock.packages[row.path];
    check(actual&&actual.version===expected.version,'Installed-tree lock differs: '+row.path);
    if(expected.integrity)check(actual.integrity===expected.integrity,'Installed-tree integrity metadata differs: '+row.path);
    if(expected.resolved)check(actual.resolved===expected.resolved,'Installed-tree origin metadata differs: '+row.path);
  }
  const absentOptional=[];
  for(const [rel,entry]of Object.entries(lock.packages))if(rel&&!seen.has(rel)){
    check(entry.optional===true,'Required locked package was not installed: '+rel);absentOptional.push(rel);
  }
  return {packages:rows.sort((a,b)=>a.path.localeCompare(b.path)),absentOptional:absentOptional.sort()};
}
async function run(label,command,args,{cwd=directory,extra={},timeout=60000}={}){
  check(!interrupted,'Interrupted before '+label);console.log(label+'=RUNNING');
  const log=put('logs/'+label+'.log',''),fd=fs.openSync(log,'a');
  let child,problem=null,finished=false;
  try{
    child=spawn(command,args,{cwd,env:{...env,...extra},stdio:['ignore',fd,fd],detached:true});active=child;
    const fail=message=>{if(finished||problem)return;problem=message;stopChild();};
    const deadline=setTimeout(()=>fail('Timeout'),timeout);
    const pulse=setInterval(()=>{
      console.log(label+'=STILL_RUNNING;LOG='+log);
      try{if(fs.statSync(log).size>16777216)fail('Log exceeded 16 MiB');if(freeBytes()<268435456n)fail('Free disk below 256 MiB');}
      catch{fail('Progress monitor failed');}
    },20000);
    const result=await new Promise(resolve=>{
      child.once('error',error=>resolve({code:null,errorCode:error.code||'SPAWN_ERROR'}));
      child.once('close',(code,signal)=>resolve({code,signal}));
    });
    finished=true;clearTimeout(deadline);clearInterval(pulse);active=null;
    if(label==='LOCKED_NPM_CI')installCode=result.code;
    if(label==='LOCKED_NPM_CI'&&(problem||result.errorCode||result.code!==0)){
      const fdRead=fs.openSync(log,'r');try{
        const size=fs.fstatSync(fdRead).size,b=Buffer.alloc(Math.min(size,8192));fs.readSync(fdRead,b,0,b.length,Math.max(0,size-b.length));
        const diagnostic=b.toString().split(/\r?\n/).filter(line=>/^npm (error|warn|ERR!|WARN)/.test(line)).slice(-25).join('\n')
          .replace(/(https?:\/\/)[^\s/@]+:[^\s/@]+@/g,'$1[REDACTED]@');
        out('NPM_DIAGNOSTICS',diagnostic.slice(-4000));
      }finally{fs.closeSync(fdRead);}
    }
    check(!interrupted&&!problem&&!result.errorCode&&result.code===0,label+' failed ('+(problem||result.errorCode||result.signal||result.code)+'); private log retained');
    console.log(label+'=PASS');return result;
  }finally{if(!finished)stopChild();active=null;fs.closeSync(fd);}
}

'use strict';

// Requalifies only the previously tested SDK/transport/classification boundary.
// Run in its own clean child process. No application entry point is loaded.
async function qualifySdk() {
  const fs = require('node:fs'), path = require('node:path');
  const crypto = require('node:crypto'), assert = require('node:assert/strict');
  const {createRequire} = require('node:module'), {pathToFileURL} = require('node:url');
  const cfg = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
  const hash = b => crypto.createHash('sha256').update(b).digest('hex');
  const checks = [], controls = [], observations = [], faults = [];
  let metadata, entry, originalFetch = globalThis.fetch, calls = [], connector, provider;
  let loadedModules = [], loadedModuleConfinement = false, harnessError = null;
  let activeFixture = null;
  const key = 're_fixture_only_not_a_credential';
  const from = 'MMHB Fixture <billing@example.invalid>';
  const host = 'connector.example.invalid';
  const connectorUrl = 'https://' + host + '/api/v2/connection?include_secrets=true&connector_names=resend';
  const requestKey = 'mmhb/billing/v1/' + 'a'.repeat(64);
  function regular(file, max = 4194304) {
    const st = fs.lstatSync(file);
    assert.ok(st.isFile() && st.size <= max && fs.realpathSync(file) === path.resolve(file), 'Unsafe SDK fixture input');
    return fs.readFileSync(file);
  }
  const connectorBody = (apiKey = key, fromEmail = from) => ({items:[{settings:{api_key:apiKey, from_email:fromEmail}}]});
  const response = (body, status = 200) => new Response(JSON.stringify(body), {status, headers:{'content-type':'application/json'}});
  const expectedFault = message => Object.assign(Error(message), {fixture:true});
  function reset() {
    faults.length = 0; calls = []; activeFixture = null;
    connector = async () => response(connectorBody());
    provider = async () => response({id:'email_fixture'});
  }
  async function test(name, fn, control = false) {
    reset();
    try { await fn(); assert.deepEqual(faults, [], 'SDK fixture protocol failed'); (control ? controls : checks).push({name, pass:true}); }
    catch (e) { (control ? controls : checks).push({name, pass:false, error:String(e.message).slice(0,600)}); }
  }
  function captureFailure(error) { if (!error.fixture) faults.push(String(error.message).slice(0,200)); }
  globalThis.fetch = async (address, init = {}) => {
    try {
      const url = typeof address === 'string' ? address : address.url || String(address);
      if (url === connectorUrl) {
        assert.equal(init.method, 'GET');
        assert.equal(new Headers(init.headers).get('X_REPLIT_TOKEN'), 'repl fixture_identity');
        assert.equal(init.redirect, 'error');
        calls.push({kind:'connector', init});
        return await connector(init);
      }
      assert.equal(url, 'https://api.resend.com/emails', 'Unexpected SDK request destination');
      assert.equal(init.method, 'POST');
      assert.equal(typeof init.body, 'string');
      calls.push({kind:'provider', init});
      return await provider(init);
    } catch (e) { captureFailure(e); throw e; }
  };
  try {
    assert.ok(['6.22.1','6.24.0'].includes(cfg.version), 'Unreviewed SDK version');
    const root = fs.realpathSync(cfg.root), req = createRequire(path.join(root, 'package.json'));
    entry = req.resolve('resend');
    assert.ok(fs.realpathSync(entry).startsWith(path.join(root,'node_modules') + path.sep), 'SDK entry escapes isolated dependency root');
    metadata = JSON.parse(regular(path.join(root, 'node_modules/resend/package.json')));
    assert.equal(metadata.name, 'resend'); assert.equal(metadata.version, cfg.version);
    const pins = {
      delivery:'39cee16ceae83013e500f10cbc3ccc9ccbfca8bd9f9ceafbdb5d2065c3d68f25',
      transport:'c4757e3c030600af8bf4bb6d7946fc85195541b38e5c0534b8ba5608ec1892d4',
      template:'cdb91217cea6ea6fb1bee2633a0f9b396d3d9a452acafd37a6d1491a37bd8e34'
    };
    for (const [name,pin] of Object.entries(pins)) assert.equal(hash(regular(cfg[name])), pin, 'Qualified component differs: '+name);
    const cacheBeforeSdk = new Set(Object.keys(req.cache));
    const moduleRoot = path.join(root, 'node_modules') + path.sep;
    function captureLoadedModules() {
      const files = Object.keys(req.cache).filter(file => !cacheBeforeSdk.has(file)).sort();
      assert.ok(files.length > 0 && files.length <= 200, 'Unexpected SDK loaded-module count');
      assert.ok(files.includes(entry), 'SDK entry not present in loaded CJS module set');
      let total = 0;
      return files.map(file => {
        const canonical = fs.realpathSync(file);
        assert.ok(canonical === path.resolve(file) && canonical.startsWith(moduleRoot), 'SDK CJS module escapes dependency root');
        const size = fs.lstatSync(file).size;
        total += size;
        assert.ok(total <= 16777216, 'SDK loaded modules exceed 16 MiB limit');
        const bytes = regular(file, 16777216);
        assert.equal(bytes.length, size, 'SDK loaded module changed while reading');
        return {path:path.relative(root, file).split(path.sep).join('/'), bytes:bytes.length, sha256:hash(bytes)};
      });
    }
    const {Resend} = req('resend');
    const initiallyLoaded = captureLoadedModules();
    loadedModules = initiallyLoaded;
    const {completeDelivery} = await import(pathToFileURL(cfg.delivery).href);
    const {connectBillingTransport:connect} = await import(pathToFileURL(cfg.transport).href);
    const {renderBillingNotification:render} = await import(pathToFileURL(cfg.template).href);
    const options = () => ({hostname:host, replIdentity:'fixture_identity', Resend, fetchImpl:globalThis.fetch});
    const body = (kind = 'upgrade', sender = from) => render({kind,payload:{version:1, recipient:'recipient@example.invalid',name:'Synthetic <Name> & Friend',periodEnd:null}}, sender);
    const sent = () => calls.filter(x => x.kind === 'provider');
    function verifyRequest(init, payload, idempotency = requestKey, apiKey = key, signal) {
      assert.deepEqual(JSON.parse(init.body), payload);
      assert.equal(new Headers(init.headers).get('Authorization'), 'Bearer ' + apiKey);
      assert.equal(new Headers(init.headers).get('Idempotency-Key'), idempotency);
      if (signal) assert.equal(init.signal, signal);
    }
    async function complete(outcome, providerScope) {
      const claim = {eventId:'evt_sdk_requalification',kind:'upgrade',userId:'11111111-1111-4111-8111-111111111111',providerScope,leaseToken:'22222222-2222-4222-8222-222222222222'};
      const trace = []; let saved, releases = 0;
      const client = {async query(sql, params) {
        if (['BEGIN','COMMIT','ROLLBACK'].includes(sql)) { trace.push(sql); return {rows:[],rowCount:0}; }
        if (sql.startsWith('SELECT *,lease_until>clock_timestamp() AS active,')) {
          trace.push('SELECT'); assert.deepEqual(params,[claim.eventId,claim.kind,claim.userId]);
          return {rows:[{status:'sending',lease_token:claim.leaseToken,provider_scope:claim.providerScope,active:true,expired:false,attempts:1}],rowCount:1};
        }
        if (sql.startsWith('UPDATE public.billing_notification_deliveries SET status=$4,')) {
          trace.push('UPDATE'); assert.deepEqual(params.slice(0,3),[claim.eventId,claim.kind,claim.userId]);
          saved = {status:params[3],id:params[4],reason:params[5]}; return {rows:[],rowCount:1};
        }
        throw Error('Unexpected scripted database statement');
      }, release(){ releases++; }};
      const result = await completeDelivery({async connect(){return client;}},claim,outcome);
      assert.deepEqual(trace,['BEGIN','SELECT','UPDATE','COMMIT']); assert.equal(releases,1); assert.equal(result.status,saved.status);
      if (result.status === 'accepted') { assert.equal(saved.id,outcome.id); assert.equal(saved.reason,null); }
      else assert.equal(saved.id,null);
      return result;
    }
    await test('unkeyed_sdk_retry_repeats_acceptance', async () => {
      let acceptances = 0; const keyed = new Map();
      provider = async init => {
        const k = new Headers(init.headers).get('Idempotency-Key');
        if (k && keyed.has(k)) return response({id:keyed.get(k)});
        const id = 'email_fixture_' + (++acceptances); if(k) keyed.set(k,id); return response({id});
      };
      const sdk = new Resend(key, {baseUrl:'https://api.resend.com'}), payload = body();
      const a = await sdk.emails.send(payload), b = await sdk.emails.send(payload);
      assert.notEqual(a.data.id,b.data.id); assert.equal(acceptances,2);
      const c = await sdk.emails.send(payload,{idempotencyKey:requestKey});
      const d = await sdk.emails.send(payload,{idempotencyKey:requestKey});
      assert.equal(c.data.id,d.data.id); assert.equal(acceptances,3); assert.equal(sent().length,4);
    }, true);
    for (const kind of ['upgrade','cancellation']) await test(kind+'_acceptance_and_payload', async () => {
      const t = await connect(options()), payload = body(kind), signal = new AbortController().signal;
      const outcome = await t.send(payload,requestKey,signal);
      assert.deepEqual(outcome,{id:'email_fixture',error:null});
      assert.equal((await complete(outcome,t.providerScope)).status,'accepted');
      assert.equal(sent().length,1); verifyRequest(sent()[0].init,payload,requestKey,key,signal);
      assert.ok(Object.isFrozen(payload)); assert.ok(payload.html.includes('&lt;Name&gt; &amp; Friend'));
    });
    const fixtures = [
      {name:'statusless_validation_422',http:422,value:{name:'validation_error',message:'Fixture rejection'},expected:'manual'},
      {name:'numeric_validation_422',http:422,value:{name:'validation_error',message:'Fixture rejection',statusCode:422},expected:'manual'},
      {name:'required_field_422',http:422,value:{name:'missing_required_field',message:'Fixture rejection',statusCode:422},expected:'manual'},
      {name:'rate_limit_429',http:429,value:{name:'rate_limit_exceeded',message:'Fixture rate limit',statusCode:429},expected:'retry'},
      {name:'service_unavailable_503',http:503,value:{name:'service_unavailable',message:'Fixture outage',statusCode:503},expected:'retry'},
      {name:'network_failure',network:true,expected:'retry'}
    ];
    for (const fixture of fixtures) await test(fixture.name, async () => {
      activeFixture = fixture;
      provider = async () => { if (fixture.network) throw expectedFault('Synthetic network failure'); return response(fixture.value,fixture.http); };
      const t = await connect(options()), outcome = await t.send(body(),requestKey,new AbortController().signal);
      assert.equal(outcome.id,null); assert.ok(outcome.error && typeof outcome.error === 'object'); assert.equal(sent().length,1);
      if (fixture.value) assert.deepEqual(outcome.error,fixture.value,'SDK changed the provider error envelope');
      const result = await complete(outcome,t.providerScope); assert.equal(result.status,fixture.expected);
      observations.push({name:fixture.name,errorName:outcome.error.name,errorKeys:Object.keys(outcome.error).sort(),statusCode:typeof outcome.error.statusCode==='number'?outcome.error.statusCode:null,classification:result.status});
    });
    await test('malformed_acceptance_remains_retryable',async () => {
      const t = await connect(options());
      for (const value of [{},{id:''},{id:' '},{id:42},null,{id:'x'.repeat(256)}]) {
        provider = async () => response(value);
        const outcome = await t.send(body(),requestKey,new AbortController().signal);
        assert.equal(outcome.id,null); assert.equal(outcome.error.name,'application_error');
        assert.equal((await complete(outcome,t.providerScope)).status,'retry');
      }
      assert.equal(sent().length,6);
    });
    await test('frozen_retry_reuses_payload_key_credentials_and_signal', async () => {
      const t = await connect(options()), payload = body(), signal = new AbortController().signal;
      for(let i=0;i<2;i++) assert.equal((await t.send(payload,requestKey,signal)).id,'email_fixture');
      assert.equal(calls.filter(x=>x.kind==='connector').length,1); assert.equal(sent().length,2);
      for(const request of sent()) verifyRequest(request.init,payload,requestKey,key,signal);
      assert.equal(sent()[0].init.body,sent()[1].init.body); assert.ok(Object.isFrozen(payload));
    });
    await test('concurrent_connector_credentials_remain_bound', async () => {
      let n = 0;
      connector = async () => {const i=++n;return response(connectorBody('re_fixture_'+i,'sender_'+i+'@example.invalid'));};
      const transports = await Promise.all([connect(options()),connect(options())]);
      assert.notEqual(transports[0].providerScope,transports[1].providerScope);
      for(let i=0;i<2;i++) await transports[i].send(body('upgrade',transports[i].fromEmail),requestKey,new AbortController().signal);
      assert.equal(sent().length,2);
      for(let i=0;i<2;i++) verifyRequest(sent()[i].init,body('upgrade','sender_'+(i+1)+'@example.invalid'),requestKey,'re_fixture_'+(i+1));
    });
    await test('preaborted_requests_make_no_provider_calls',async () => {
      const controller = new AbortController(); controller.abort();
      await assert.rejects(()=>connect({...options(),signal:controller.signal})); assert.equal(calls.length,0);
      const t = await connect(options()); await assert.rejects(()=>t.send(body(),requestKey,controller.signal)); assert.equal(sent().length,0);
    });
    await test('inflight_abort_reaches_actual_sdk_fetch',async () => {
      const t = await connect(options()), controller = new AbortController(); let seen;
      provider = async init => { seen=init.signal; assert.equal(seen,controller.signal); return new Promise((_resolve,reject)=>{
        init.signal.addEventListener('abort',()=>reject(expectedFault('Synthetic aborted fetch')),{once:true}); queueMicrotask(()=>controller.abort());
      }); };
      await assert.rejects(()=>t.send(body(),requestKey,controller.signal),{code:'provider_request_aborted'});
      assert.equal(seen,controller.signal); assert.ok(seen.aborted); assert.equal(sent().length,1);
    });
    await test('environment_cannot_redirect_sdk_endpoint',async () => {
      const previous = process.env.RESEND_BASE_URL; process.env.RESEND_BASE_URL='https://untrusted.example.invalid';
      try { const t=await connect(options()); assert.equal((await t.send(body(),requestKey,new AbortController().signal)).id,'email_fixture'); assert.equal(sent().length,1); }
      finally { if(previous===undefined)delete process.env.RESEND_BASE_URL;else process.env.RESEND_BASE_URL=previous; }
    });
    loadedModules = captureLoadedModules();
    const finalByPath = new Map(loadedModules.map(row => [row.path,row]));
    for(const row of initiallyLoaded) assert.deepEqual(finalByPath.get(row.path),row,'Loaded SDK module changed during tests');
    loadedModuleConfinement = true;
  } catch (e) { harnessError=String(e.message).slice(0,600); }
  finally { activeFixture=null; globalThis.fetch=originalFetch; }
  const pass=checks.filter(x=>x.pass).length;
  const qualified=!harnessError && loadedModuleConfinement && checks.length===14 && pass===14 && controls.length===1 && controls.every(x=>x.pass);
  const report={scope:'SDK_TRANSPORT_CLASSIFICATION_REGRESSION_ONLY',node:process.version,resend:metadata?.version??null,
    sdkEntrySha256:entry&&fs.existsSync(entry)?hash(fs.readFileSync(entry)):null,tests:checks.length,pass,checks,controls,observations,
    loadedModuleConfinement,loadedModules,harnessError,
    transport:'MOCKED_FETCH',database:'SCRIPTED_POOL_NO_CONNECTIONS',databaseConnections:0,realEmailsSent:0,
    status:qualified?'SDK_REGRESSION_PASSED':'SDK_REGRESSION_FAILED',releaseQualified:false};
  fs.writeFileSync(cfg.result,JSON.stringify(report,null,2),{flag:'wx',mode:0o600}); console.log(JSON.stringify(report));
  process.exitCode=qualified?0:1;
}
async function main(){
  console.log('COMMAND_ID='+ID);
  try{
    check(process.platform==='linux'&&typeof process.getuid==='function','This runner requires the Replit Linux shell');
    const packageBytes=read(ROOT+'/package.json'),lockBytes=read(ROOT+'/package-lock.json');
    const pkg=JSON.parse(packageBytes),lock=JSON.parse(lockBytes);
    check(pkg.name==='mymentalhealthbuddy'&&(!process.env.REPL_ID||process.env.REPL_ID==='9d71c4b8-8fcd-4b22-aee2-5883d9cbe5a4'),'Project identity mismatch');
    check(git('rev-parse','--show-toplevel').trim()===ROOT,'Repository root mismatch');
    before=snapshot();out('CURRENT',{head:before.head,branch:before.branch});
    check(before.branch==='integration','Expected integration branch');
    check(hash(packageBytes)===PACKAGE_PIN&&hash(lockBytes)===LOCK_PIN,'Package or root lock differs from G46; preserve work and return output');
    check(read(ROOT+'/npm-shrinkwrap.json',true)===null,'npm-shrinkwrap changes dependency ownership');
    const treeSettings=npmTreeSettings(read(ROOT+'/.npmrc',true));
    read(ROOT+'/node_modules/.package-lock.json',true);
    const originalSdk=read(ROOT+'/node_modules/resend/package.json');
    check(hash(originalSdk)===SDK_PIN&&JSON.parse(originalSdk).version==='6.24.0','Installed Resend differs from G46');
    const count=validateLock(pkg,lock);
    out('DEPENDENCY_PLAN',{installedReference:'6.24.0',rootLockedCandidate:'6.22.1',lockEntries:count,packageSha256:PACKAGE_PIN,lockSha256:LOCK_PIN});
    out('NPM_TREE_SETTINGS',treeSettings);
    const components={
      delivery:['billingDelivery.mjs','39cee16ceae83013e500f10cbc3ccc9ccbfca8bd9f9ceafbdb5d2065c3d68f25'],
      transport:['billingEmailTransport.mjs','c4757e3c030600af8bf4bb6d7946fc85195541b38e5c0534b8ba5608ec1892d4'],
      template:['billingNotificationTemplate.mjs','cdb91217cea6ea6fb1bee2633a0f9b396d3d9a452acafd37a6d1491a37bd8e34']
    },copied={};
    const source=ROOT+'/.git/mmhb-review-evidence/billing-adapter-ca5T49/candidate/server/services/';
    for(const [key,[file,pin]]of Object.entries(components)){
      const bytes=read(source+file);check(hash(bytes)===pin,'Qualified billing component differs: '+file);copied[key]=bytes;
    }
    const parent=ROOT+'/.git/mmhb-review-evidence';
    privateDir(parent);
    directory=fs.mkdtempSync(parent+'/locked-resend-');privateDir(directory);console.log('EVIDENCE_DIRECTORY='+directory);
    check(freeBytes()>=3221225472n,'Need at least 3 GiB free for an isolated install and cache');
    stage=path.join(directory,'dependency-project');fs.mkdirSync(stage,{mode:0o700});privateDir(stage);
    put('dependency-project/package.json',packageBytes);put('dependency-project/package-lock.json',lockBytes);
    const emptyUser=put('npm-user.npmrc',''),emptyGlobal=put('npm-global.npmrc','');
    const cache=path.join(directory,'npm-cache');fs.mkdirSync(cache,{mode:0o700});
    const temporary=path.join(directory,'tmp');fs.mkdirSync(temporary,{mode:0o700});
    const harness=put('sdk-harness.cjs',"'use strict';\n"+qualifySdk.toString()+"\nqualifySdk().catch(e=>{console.error('SDK_HARNESS_FATAL='+String(e.message).slice(0,600));process.exitCode=2;});\n");
    const paths={};for(const [key,bytes]of Object.entries(copied))paths[key]=put('components/'+components[key][0],bytes);
    put('state.before.json',JSON.stringify(before,null,2));
    const commonArgs=['--prefix='+stage,'--userconfig='+emptyUser,'--globalconfig='+emptyGlobal,
      '--cache='+cache,'--registry=https://registry.npmjs.org','--update-notifier=false'];
    await run('NPM_VERSION','npm',['--version',...commonArgs],{cwd:stage,extra:{TMPDIR:temporary},timeout:15000});
    const npmVersion=regular(path.join(directory,'logs/NPM_VERSION.log')).toString().trim();
    check(/^\d+\.\d+\.\d+$/.test(npmVersion),'Could not identify npm version');out('RUNTIME',{node:process.version,npm:npmVersion});
    await run('SDK_HARNESS_SYNTAX',process.execPath,['--check',harness],{extra:{TMPDIR:temporary}});
    async function qualify(mode,root,version){
      const result=path.join(directory,mode+'.result.json');
      const cfg=put(mode+'.config.json',JSON.stringify({root,version,...paths,result}));
      // A failed assertion still writes its complete bounded result for review.
      let failure;try{await run(mode.toUpperCase()+'_SDK_TESTS',process.execPath,[harness,cfg],{extra:{TMPDIR:temporary},timeout:90000});}catch(e){failure=e;}
      let value;try{value=JSON.parse(regular(result));}catch{if(failure)throw failure;throw Error('SDK result missing or malformed');}
      out(mode.toUpperCase()+'_SDK_RESULT',{resend:value.resend,tests:value.tests,pass:value.pass,
        failed:value.checks?.filter(x=>!x.pass),controls:value.controls,loadedModuleConfinement:value.loadedModuleConfinement,harnessError:value.harnessError});
      if(failure)throw failure;
      check(value.status==='SDK_REGRESSION_PASSED'&&value.tests===14&&value.pass===14&&value.controls?.length===1&&value.controls.every(x=>x.pass)&&value.loadedModuleConfinement===true,'Incomplete SDK qualification');
      for(const row of value.loadedModules||[]){
        check(typeof row.path==='string'&&row.path.startsWith('node_modules/')&&!path.isAbsolute(row.path)&&!row.path.split('/').includes('..'),'Invalid loaded module path');
        const file=path.join(root,row.path);check(hash(read(file))===row.sha256,'Loaded SDK source changed during qualification');
      }
      return value;
    }
    reference=await qualify('reference',ROOT,'6.24.0');
    console.log('INSTALL_SCOPE=NEW_PRIVATE_DEPENDENCY_PROJECT_ONLY;PUBLIC_REGISTRY_DOWNLOADS;PACKAGE_SCRIPTS_DISABLED');
    console.log('INSTALL_WARNING=NO_AUTOMATIC_FORCE_OR_PEER_DEPENDENCY_BYPASS');
    const args=['ci','--ignore-scripts','--audit=false','--fund=false','--bin-links=false','--include=dev','--include=optional','--include=peer',
      '--fetch-retries=1','--fetch-timeout=60000','--progress=false',...commonArgs,
      ...Object.entries(treeSettings).map(([key,value])=>'--'+key+'='+value)];
    put('install-plan.json',JSON.stringify({command:'npm',args,cwd:stage,timeoutMs:900000,environmentKeys:Object.keys(env).concat('TMPDIR')},null,2));
    await run('LOCKED_NPM_CI','npm',args,{cwd:stage,extra:{TMPDIR:temporary},timeout:900000});npmInstalled=true;
    check(hash(regular(stage+'/package.json'))===PACKAGE_PIN&&hash(regular(stage+'/package-lock.json'))===LOCK_PIN,'Copied manifests changed during npm ci');
    inventory=installedInventory(stage,lock);put('installed-metadata.json',JSON.stringify(inventory,null,2));
    const lockedSdk=JSON.parse(regular(stage+'/node_modules/resend/package.json'));
    check(lockedSdk.name==='resend'&&lockedSdk.version==='6.22.1','npm ci did not materialize root-locked Resend');
    out('LOCKED_INSTALL',{packages:inventory.packages.length,absentOptional:inventory.absentOptional.length,resend:lockedSdk.version,manifestBytesUnchanged:true});
    locked=await qualify('locked',stage,'6.22.1');
    check(JSON.stringify(installedInventory(stage,lock))===JSON.stringify(inventory),'Staged dependency metadata changed during SDK qualification');
    check(hash(regular(stage+'/package.json'))===PACKAGE_PIN&&hash(regular(stage+'/package-lock.json'))===LOCK_PIN,'Staged manifests changed during SDK qualification');
    status='ROOT_LOCKED_RESEND_QUALIFIED_IN_ISOLATED_INSTALL';
  }catch(e){out('REASON',e.message);process.exitCode=2;}
  finally{
    try{
      for(const [file,pin]of observed)check(hash(regular(file))===pin,'Observed input changed: '+file);
      for(const file of absent){let exists=true;try{fs.lstatSync(file);}catch(e){if(e.code==='ENOENT')exists=false;else throw e;}check(!exists,'Previously absent metadata appeared');}
      if(before)check(JSON.stringify(snapshot())===JSON.stringify(before),'Checkout changed during qualification');
      preserved=!!before;console.log('OBSERVED_INPUT_AND_CHECKOUT_PRESERVATION='+(preserved?'PASS':'NOT_CAPTURED'));
    }catch(e){status='STOPPED';process.exitCode=2;out('PRESERVATION_ERROR',e.message);}
    if(interrupted){status='STOPPED';process.exitCode=2;}
    const summary={command:ID,status,head:before?.head||null,sourcePreserved:preserved,
      packageSha256:PACKAGE_PIN,lockSha256:LOCK_PIN,dependencyProject:stage||null,npmInstallCompleted:npmInstalled,npmInstallExitCode:installCode,
      installedPackages:inventory?.packages.length||0,referenceSdkPassed:reference?.status==='SDK_REGRESSION_PASSED',
      lockedSdkPassed:locked?.status==='SDK_REGRESSION_PASSED',projectDependencyRepairApplied:false,tlsTests:'NOT_RUN',
      fullAppTests:'NOT_RUN',releaseQualified:false};
    if(directory){try{put('summary.json',JSON.stringify(summary,null,2));}catch(e){status='STOPPED';process.exitCode=2;out('SUMMARY_ERROR',e.message);}}
    console.log('STATUS='+status+'\nSOURCE_WRITES_BY_COMMAND=0\nPROJECT_NODE_MODULES_WRITES_BY_COMMAND=0\nPROJECT_LOCK_WRITES_BY_COMMAND=0');
    console.log('DEPENDENCY_REPAIR=NOT_APPLIED\nAPPLICATION_ENTRYPOINTS_EXECUTED=0\nDATABASE_CONNECTIONS=0\nREAL_CONNECTOR_CALLS=0\nREAL_EMAILS_SENT=0');
    console.log('TLS_TESTS=NOT_RUN\nFULL_APP_TESTS=NOT_RUN:SDK_BOUNDARY_ONLY\nNATIVE_PACKAGE_READINESS=NOT_QUALIFIED:INSTALL_SCRIPTS_DISABLED');
    console.log('APPLICATION_SOURCE_APPLY=NOT_RUN\nWORKER_ACTIVATION=NOT_RUN\nCOMMIT_PUSH_DEPLOY=NOT_RUN\nRELEASE_QUALIFIED=false');
    if(directory)console.log('EVIDENCE_DIRECTORY='+directory+'\nDEPENDENCY_PROJECT='+stage+'\nSTORAGE=LOCAL_PROJECT_METADATA;NOT_AN_OFF_PROJECT_BACKUP');
    console.log('NEXT_ACTION=RETURN_FULL_OUTPUT\nREPORT_END='+ID);
  }
}
main().catch(e=>{console.error('RUNNER_ERROR='+String(e.message));process.exitCode=2;});

MMHB47_NODE
)
