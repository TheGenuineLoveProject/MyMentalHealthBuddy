(
set -eu
umask 077
cd /home/runner/workspace
node --input-type=commonjs <<'MMHB28_NODE'
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {spawnSync}=require('node:child_process');
const ROOT='/home/runner/workspace';
const PREVIOUS='/home/runner/mmhb-template-qualify.f47dPB';
const PG='/nix/store/bgwr5i8jf8jpg75rr53rz3fqv5k8yrwp-postgresql-16.10/bin';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const check=(ok,message)=>{if(!ok)throw Error(message);};
const env={PATH:process.env.PATH||'/usr/bin:/bin',LANG:'C.UTF-8',TZ:'UTC',CI:'true',NODE_ENV:'production',GIT_OPTIONAL_LOCKS:'0',GIT_TERMINAL_PROMPT:'0'};
let directory,data,before,started=false,stopped='NOT_STARTED',status='STOPPED',report,interrupted=false;
process.on('SIGINT',()=>{interrupted=true;});process.on('SIGTERM',()=>{interrupted=true;});
function git(...args){
  const r=spawnSync('git',['--no-pager','--no-optional-locks','-c','core.fsmonitor=false',
    '-c','core.quotePath=true',...args],{cwd:ROOT,env,encoding:'utf8',timeout:30000,maxBuffer:33554432});
  check(!r.error&&r.status===0,'Git inspection failed: '+args[0]);return r.stdout;
}
function bytes(p){check(fs.lstatSync(p).isFile(),'Expected regular file: '+p);return fs.readFileSync(p);}
function state(){return JSON.stringify({head:git('rev-parse','HEAD').trim(),branch:git('branch','--show-current').trim(),
  index:hash(bytes(path.resolve(ROOT,git('rev-parse','--git-path','index').trim()))),
  status:git('status','--porcelain=v1','--untracked-files=no','--ignore-submodules=none'),
  diff:hash(git('diff','--binary','--no-ext-diff','--no-textconv','HEAD')),
  untrackedNames:hash(git('ls-files','--others','--exclude-standard','-z')),
  package:hash(bytes(path.join(ROOT,'package.json'))),lock:hash(bytes(path.join(ROOT,'package-lock.json')))});}
function put(name,value){const p=path.join(directory,name);fs.writeFileSync(p,value,{flag:'wx',mode:0o600});return p;}
function run(label,command,args,timeout=45000,ok=[0]){
  console.log(label+'=RUNNING');
  const r=spawnSync(command,args,{cwd:directory,env,encoding:'utf8',timeout,killSignal:'SIGKILL',maxBuffer:4194304});
  put(label+'.log',(r.stdout||'')+(r.stderr||''));
  if(r.error||!ok.includes(r.status)){
    console.log('DIAGNOSTICS='+JSON.stringify(((r.stderr||'')+(r.error?.message||'')).slice(-2000)));
    throw Error(label+' failed; log retained');
  }
  return r;
}

async function qualifyPipeline() {
  const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),http=require('node:http');
  const crypto=require('node:crypto'),assert=require('node:assert/strict'),{createRequire}=require('node:module'),{pathToFileURL}=require('node:url');
  const {AsyncLocalStorage}=require('node:async_hooks'),cfg=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
  assert.ok(cfg.socket.startsWith(cfg.directory+path.sep));assert.match(cfg.password,/^[a-f0-9]{64}$/);
  const req=createRequire(path.join(cfg.root,'package.json')),{Pool}=req('pg'),{Resend}=req('resend'),express=req('express');
  const StripeImport=req('stripe'),Stripe=StripeImport.default||StripeImport.Stripe||StripeImport;
  const orm=req('drizzle-orm'),pgcore=req('drizzle-orm/pg-core'),{drizzle}=req('drizzle-orm/node-postgres');
  const {prepareDelivery,dispatchOne}=await import(pathToFileURL(cfg.delivery).href);
  const {connectBillingTransport}=await import(pathToFileURL(cfg.transport).href);
  const {renderBillingNotification}=await import(pathToFileURL(cfg.template).href);
  const connection={host:cfg.socket,port:6543,password:cfg.password,ssl:false,connectionTimeoutMillis:4000,idleTimeoutMillis:1000,statement_timeout:7000};
  const owner=new Pool({...connection,user:'mmhb_owner',database:'postgres',max:2});let hookPool,workerPool,active;
  const hookRole='mmhb_pipeline_hook',workerRole='mmhb_pipeline_worker',table='public.billing_notification_deliveries';
  const uid='11111111-1111-4111-8111-111111111111',recipient='fixture@example.invalid',name='<Guide & Friend>';
  const host='connector.example.invalid',connectorURL='https://'+host+'/api/v2/connection?include_secrets=true&connector_names=resend';
  const fakeEnv={STRIPE_SECRET_KEY:'sk_test_fixture_only',STRIPE_WEBHOOK_SECRET:'whsec_fixture_only',STRIPE_PRICE_PRO:'price_fixture_pro'};
  const sdk=new Stripe(fakeEnv.STRIPE_SECRET_KEY,{apiVersion:'2024-06-20'}),scope=new AsyncLocalStorage();
  const controls=[],checks=[],originalFetch=globalThis.fetch,hash=x=>crypto.createHash('sha256').update(x).digest('hex');
  const checkout=()=>({id:'evt_pipeline',type:'checkout.session.completed',data:{object:{id:'cs_fixture',customer:'cus_fixture',subscription:'sub_fixture',customer_details:{email:recipient,name:'Stripe Name'}}}});
  const cancellation=()=>({id:'evt_pipeline',type:'customer.subscription.deleted',data:{object:{id:'sub_fixture',customer:'cus_fixture',current_period_end:1800000000}}});
  const saved=async()=>(await owner.query('SELECT * FROM '+table)).rows[0];
  const snapshot=async()=>(await owner.query(`SELECT (SELECT count(*)::int FROM webhook_events) AS markers,
    (SELECT count(*)::int FROM billing_notification_intents) AS intents,(SELECT count(*)::int FROM ${table}) AS deliveries,
    (SELECT subscription_status FROM users LIMIT 1) AS plan`)).rows[0];
  const due=()=>owner.query('UPDATE '+table+" SET next_attempt_at=clock_timestamp()-interval '1 second',lease_until=CASE WHEN status='sending' THEN clock_timestamp()-interval '1 second' ELSE lease_until END");
  const connect=()=>connectBillingTransport({hostname:host,replIdentity:'fixture_identity',fetchImpl:globalThis.fetch,Resend});
  async function preparePending(transport){
    const item=(await workerPool.query(`SELECT i.event_id,i.kind,i.user_id,i.payload FROM billing_notification_intents i
      LEFT JOIN ${table} d USING(event_id,kind,user_id) WHERE d.event_id IS NULL ORDER BY i.event_id,i.kind,i.user_id LIMIT 1`)).rows[0];
    if(!item)return null;
    const body=renderBillingNotification({kind:item.kind,payload:item.payload},transport.fromEmail);
    return prepareDelivery(workerPool,{eventId:item.event_id,kind:item.kind,userId:item.user_id},body,transport.providerScope);
  }
  const dispatch=transport=>dispatchOne(workerPool,transport.send,transport.providerScope);
  async function reset(){
    await owner.query('DROP TRIGGER IF EXISTS fail_pipeline_commit ON billing_notification_intents; GRANT SELECT,INSERT,UPDATE ON '+table+' TO '+workerRole+'; TRUNCATE '+table+',billing_notification_intents,webhook_events,users');
    await owner.query('INSERT INTO users(id,email,name,stripe_customer_id)VALUES($1,$2,$3,$4)',[uid,recipient,name,'cus_fixture']);
    active={key:'re_fixture_pipeline',from:'MMHB Fixture <billing@example.invalid>',calls:[],faults:[],cache:new Map(),accepted:0,loseResponse:false,afterAccept:null,providerError:null,allowMissingKey:false};
  }
  globalThis.fetch=async(url,options={})=>{
    try{
      assert.ok(active,'No active pipeline fixture');const target=typeof url==='string'?url:url.url||String(url);
      if(target===connectorURL){assert.equal(options.method,'GET');assert.equal(options.redirect,'error');assert.equal(new Headers(options.headers).get('X_REPLIT_TOKEN'),'repl fixture_identity');
        return new Response(JSON.stringify({items:[{settings:{api_key:active.key,from_email:active.from}}]}),{status:200});}
      assert.equal(target,'https://api.resend.com/emails');assert.equal(options.method,'POST');assert.ok(options.signal instanceof AbortSignal);
      const headers=new Headers(options.headers),key=headers.get('Idempotency-Key'),raw=String(options.body),body=JSON.parse(raw),frozen=await saved();
      active.calls.push({key,raw});assert.ok(frozen,'Provider called before durable preparation');assert.equal(frozen.status,'sending');
      assert.deepEqual(body,JSON.parse(frozen.body_text));assert.equal(frozen.request_sha256,hash(frozen.body_text));assert.ok(frozen.first_attempt_at);assert.ok(frozen.lease_token);assert.ok(frozen.attempts>=1);
      assert.equal(headers.get('Authorization'),'Bearer '+active.key);if(active.allowMissingKey)assert.equal(key,null);else assert.equal(key,frozen.idempotency_key);
      assert.equal(body.from,active.from);assert.equal(body.to,recipient);assert.ok(body.html.includes('https://mymentalhealthbuddy.com/'));
      if(active.providerError)return new Response(JSON.stringify(active.providerError),{status:422,headers:{'content-type':'application/json'}});
      const cacheKey=key&&headers.get('Authorization')+'|'+key;let accepted=cacheKey&&active.cache.get(cacheKey);
      if(accepted)assert.equal(accepted.raw,raw,'Retry changed frozen wire payload');
      else{accepted={raw,id:'email_fixture_'+(++active.accepted)};if(cacheKey)active.cache.set(cacheKey,accepted);}
      if(active.afterAccept)await active.afterAccept();
      if(active.loseResponse){active.loseResponse=false;throw Object.assign(Error('Fixture lost provider response'),{fixtureNetwork:true});}
      return new Response(JSON.stringify({id:accepted.id}),{status:200,headers:{'content-type':'application/json'}});
    }catch(error){if(!error.fixtureNetwork)active?.faults.push(String(error.message).slice(0,400));throw error;}
  };
  async function routeFixture(){
    const state={retrievals:0,hook:null},context=vm.createContext({Buffer,process:{env:{...fakeEnv}}});
    async function load(file,deps){
      const module=new vm.SourceTextModule(fs.readFileSync(file,'utf8'),{context}),cache=new Map();
      await module.link(key=>{assert.ok(Object.hasOwn(deps,key),'Unexpected route import');if(!cache.has(key))cache.set(key,new vm.SyntheticModule(Object.keys(deps[key]),function(){for(const[k,v]of Object.entries(deps[key]))this.setExport(k,v);},{context}));return cache.get(key);});
      await module.evaluate();return module.namespace;
    }
    const schema=await load(cfg.schema,{'drizzle-orm':orm,'drizzle-orm/pg-core':pgcore}),mapping=await load(cfg.mapping,{});
    const component=await load(cfg.component,{'drizzle-orm':orm,'../../shared/schema.mjs':schema}),real=drizzle(hookPool,{schema});
    const db={select:real.select.bind(real),transaction:(body,options)=>real.transaction(tx=>scope.run(true,()=>body(tx)),options),
      update(){throw Error('Unscoped webhook update');},insert(){throw Error('Unscoped webhook insert');}};
    class OfflineStripe {constructor(){
      this.webhooks={constructEvent(body,signature,secret){assert.ok(Buffer.isBuffer(body));return sdk.webhooks.constructEvent(body,signature,secret);}};
      this.checkout={sessions:{retrieve:async()=>{assert.notEqual(scope.getStore(),true);state.retrievals++;if(state.hook)await state.hook();return{line_items:{data:[{price:{id:fakeEnv.STRIPE_PRICE_PRO}}]}};}}};
    }}
    const observation=()=>{if(scope.getStore()===true)active.faults.push('Webhook observation escaped before commit');assert.notEqual(scope.getStore(),true,'Webhook observation escaped before commit');};
    const router=await load(cfg.candidate,{express:{default:express,Router:express.Router},stripe:{default:OfflineStripe},'../db/client.mjs':{db},
      '../../shared/schema.mjs':schema,'drizzle-orm':orm,'../utils/logger.mjs':{logger:{info:observation,warn:observation,error:observation}},
      '../utils/metrics.mjs':{increment:observation},'../utils/planMapping.mjs':mapping,'../services/billingEventTransaction.mjs':component,
      '../observability/safetyAlerts.mjs':{async alertWebhookSignatureFailure(){}}});
    const app=express();app.use('/api/webhooks',router.default);app.use(express.json());app.use((_err,_req,res,_next)=>res.status(500).json({error:'Fixture failure'}));
    const server=http.createServer(app);server.requestTimeout=10000;server.headersTimeout=10000;
    await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
    const send=(event,badSignature=false)=>new Promise((resolve,reject)=>{
      const body=Buffer.from(JSON.stringify(event)),signature=badSignature?'invalid':sdk.webhooks.generateTestHeaderString({payload:body.toString(),secret:fakeEnv.STRIPE_WEBHOOK_SECRET});
      const request=http.request({hostname:'127.0.0.1',port:server.address().port,path:'/api/webhooks/stripe',method:'POST',agent:false,
        headers:{'content-type':'application/json','content-length':body.length,'stripe-signature':signature}},response=>{
        const chunks=[];let size=0;response.on('data',chunk=>{size+=chunk.length;if(size>65536)response.destroy(Error('Oversized fixture response'));else chunks.push(chunk);});
        response.once('error',reject);response.once('end',()=>{try{const text=Buffer.concat(chunks).toString();resolve({status:response.statusCode,body:/application\/json/.test(response.headers['content-type']||'')?JSON.parse(text):text});}catch(error){reject(error);}});
      });request.setTimeout(10000,()=>request.destroy(Error('HTTP fixture timeout')));request.once('error',reject);request.end(body);
    });
    return{state,send,close:()=>new Promise(resolve=>{server.close(resolve);server.closeAllConnections();})};
  }
  async function test(name,fn,control=false){let route;try{await reset();route=await routeFixture();await fn(route);assert.deepEqual(active.faults,[]);(control?controls:checks).push({name,pass:true});}
    catch(error){(control?controls:checks).push({name,pass:false,error:String(error.message).slice(0,700)});}finally{if(route)await route.close();}}
  async function concurrentWebhooks(route){
    let arrivals=0,release,rejectBarrier,timer;const barrier=new Promise((resolve,reject)=>{release=resolve;rejectBarrier=reject;});
    route.state.hook=async()=>{if(++arrivals===1)timer=setTimeout(()=>rejectBarrier(Error('Webhook barrier timeout')),3000);if(arrivals===2){clearTimeout(timer);release();}await barrier;};
    const requests=[route.send(checkout()),route.send(checkout())];
    try{const responses=await Promise.all(requests);assert.equal(arrivals,2);return responses;}
    finally{clearTimeout(timer);release();await Promise.allSettled(requests);route.state.hook=null;}
  }
  try{
    const identity=(await owner.query("SELECT current_setting('data_directory') AS data,current_setting('listen_addresses') AS listen,inet_server_addr() AS address,current_user AS owner")).rows[0];
    assert.equal(fs.realpathSync(identity.data),fs.realpathSync(cfg.data));assert.equal(identity.listen,'');assert.equal(identity.address,null);assert.equal(identity.owner,'mmhb_owner');
    await owner.query(`CREATE ROLE ${hookRole} LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE PASSWORD '${cfg.password}';
      CREATE ROLE ${workerRole} LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE PASSWORD '${cfg.password}';
      CREATE TABLE users(id uuid PRIMARY KEY,email varchar(255) NOT NULL UNIQUE,name varchar(255) NOT NULL,stripe_customer_id text,
        subscription_status text DEFAULT 'free',subscription_expires_at timestamp,updated_at timestamp NOT NULL DEFAULT now());
      CREATE TABLE webhook_events(id text PRIMARY KEY,event_type varchar(100) NOT NULL,status varchar(50) NOT NULL DEFAULT 'processed',processed_at timestamptz NOT NULL DEFAULT now());
      GRANT USAGE ON SCHEMA public TO ${hookRole},${workerRole}`);
    await owner.query(fs.readFileSync(cfg.intentsDDL,'utf8'));await owner.query(fs.readFileSync(cfg.deliveryDDL,'utf8'));
    await owner.query(`GRANT SELECT,UPDATE ON users TO ${hookRole};GRANT SELECT,INSERT ON webhook_events,billing_notification_intents TO ${hookRole};
      GRANT SELECT ON billing_notification_intents TO ${workerRole};GRANT SELECT,INSERT,UPDATE ON ${table} TO ${workerRole};
      CREATE FUNCTION reject_pipeline_commit() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'Fixture pipeline commit failure' USING ERRCODE='23514'; END $$`);
    hookPool=new Pool({...connection,user:hookRole,database:'postgres',max:4});workerPool=new Pool({...connection,user:workerRole,database:'postgres',max:4});
    for(const pool of [hookPool,workerPool])assert.equal((await pool.query('SELECT rolsuper FROM pg_roles WHERE rolname=current_user')).rows[0].rolsuper,false);
    await test('unkeyed_uncertain_delivery_repeats_acceptance',async route=>{
      assert.equal((await route.send(checkout())).status,200);const transport=await connect();await preparePending(transport);active.allowMissingKey=true;active.loseResponse=true;
      const client=new Resend(active.key,{baseUrl:'https://api.resend.com'}),badSend=async(body,_key,signal)=>{const r=await client.emails.send(body,{signal});return{id:r?.data?.id,error:r?.error};};
      assert.equal((await dispatchOne(workerPool,badSend,transport.providerScope)).status,'retry');await due();
      assert.equal((await dispatchOne(workerPool,badSend,transport.providerScope)).status,'accepted');assert.equal(active.accepted,2);assert.equal(active.calls.length,2);
    },true);
    assert.ok(controls.length===1&&controls[0].pass,'Baseline control differs');
    await test('checkout_to_frozen_mmhb_delivery',async route=>{
      assert.equal((await route.send(checkout())).status,200);assert.deepEqual(await snapshot(),{markers:1,intents:1,deliveries:0,plan:'pro'});
      const transport=await connect();assert.equal((await preparePending(transport)).created,true);assert.equal((await dispatch(transport)).status,'accepted');
      const row=await saved(),body=JSON.parse(row.body_text);assert.equal(row.accepted_message_id,'email_fixture_1');assert.ok(body.html.includes('&lt;Guide &amp; Friend&gt;'));
      assert.ok(body.text.includes(name));assert.equal(body.subject,'MyMentalHealthBuddy subscription update');assert.ok(!body.subject.includes(name));
      assert.ok(!/genuineloveproject|Welcome to Pro|unlimited/i.test(body.html));assert.equal(active.accepted,1);
    });
    await test('cancellation_to_neutral_delivery',async route=>{
      await owner.query("UPDATE users SET subscription_status='pro'");assert.equal((await route.send(cancellation())).status,200);
      const transport=await connect();await preparePending(transport);assert.equal((await dispatch(transport)).status,'accepted');
      assert.deepEqual(await snapshot(),{markers:1,intents:1,deliveries:1,plan:'free'});const body=JSON.parse((await saved()).body_text);
      assert.ok(body.text.includes('We recorded a cancellation update'));assert.ok(!/1800000000|until|forever|Pro features/.test(body.text));
    });
    await test('sequential_webhook_and_dispatch_replay',async route=>{
      assert.equal((await route.send(checkout())).status,200);assert.equal((await route.send(checkout())).body.duplicate,true);
      const transport=await connect();await preparePending(transport);assert.equal((await dispatch(transport)).status,'accepted');assert.equal(await preparePending(transport),null);
      assert.equal((await dispatch(transport)).status,'idle');assert.equal(active.calls.length,1);assert.equal(active.accepted,1);
    });
    await test('parallel_webhooks_and_dispatchers',async route=>{
      const responses=await concurrentWebhooks(route);assert.ok(responses.every(x=>x.status===200));assert.equal(responses.filter(x=>x.body.duplicate).length,1);
      const transport=await connect();await preparePending(transport);const results=await Promise.allSettled([dispatch(transport),dispatch(transport)]);
      assert.ok(results.every(x=>x.status==='fulfilled'));assert.deepEqual(results.map(x=>x.value.status).sort(),['accepted','idle']);assert.equal(active.accepted,1);assert.equal(active.calls.length,1);
    });
    await test('webhook_commit_failure_has_no_delivery',async route=>{
      await owner.query('CREATE CONSTRAINT TRIGGER fail_pipeline_commit AFTER INSERT ON billing_notification_intents DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION reject_pipeline_commit()');
      assert.equal((await route.send(checkout())).status,500);assert.deepEqual(await snapshot(),{markers:0,intents:0,deliveries:0,plan:'free'});
      const transport=await connect();assert.equal(await preparePending(transport),null);assert.equal((await dispatch(transport)).status,'idle');assert.equal(active.calls.length,0);
    });
    await test('freeze_failure_retries_without_lost_intent',async route=>{
      assert.equal((await route.send(checkout())).status,200);const transport=await connect();await owner.query('REVOKE INSERT ON '+table+' FROM '+workerRole);
      await assert.rejects(()=>preparePending(transport),{code:'42501'});assert.deepEqual(await snapshot(),{markers:1,intents:1,deliveries:0,plan:'pro'});assert.equal(active.calls.length,0);
      await owner.query('GRANT INSERT ON '+table+' TO '+workerRole);await preparePending(transport);assert.equal((await dispatch(transport)).status,'accepted');assert.equal(active.accepted,1);
    });
    await test('lost_response_restart_uses_frozen_request',async route=>{
      assert.equal((await route.send(checkout())).status,200);const first=await connect();await preparePending(first);active.loseResponse=true;
      assert.equal((await dispatch(first)).status,'retry');const frozen=await saved();assert.equal(active.accepted,1);
      await owner.query("UPDATE billing_notification_intents SET payload=jsonb_set(payload,'{name}','\"Changed After First Attempt\"'::jsonb)");
      const changed=(await workerPool.query('SELECT kind,payload FROM billing_notification_intents')).rows[0];assert.notEqual(renderBillingNotification(changed,first.fromEmail).html,JSON.parse(frozen.body_text).html);
      const restarted=await connect();assert.equal(restarted.providerScope,first.providerScope);assert.equal(await preparePending(restarted),null);await due();
      assert.equal((await dispatch(restarted)).status,'accepted');assert.equal((await saved()).body_text,frozen.body_text);assert.equal(active.accepted,1);
      assert.equal(active.calls.length,2);assert.equal(active.calls[0].raw,active.calls[1].raw);assert.equal(active.calls[0].key,active.calls[1].key);
    });
    await test('accepted_then_completion_failure_retries_same_key',async route=>{
      assert.equal((await route.send(checkout())).status,200);const transport=await connect();await preparePending(transport);
      active.afterAccept=()=>owner.query('REVOKE UPDATE ON '+table+' FROM '+workerRole);await assert.rejects(()=>dispatch(transport),{code:'42501'});
      assert.equal((await saved()).status,'sending');assert.equal(active.accepted,1);active.afterAccept=null;await owner.query('GRANT UPDATE ON '+table+' TO '+workerRole);await due();
      assert.equal((await dispatch(await connect())).status,'accepted');assert.equal(active.accepted,1);assert.equal(active.calls.length,2);assert.equal(active.calls[0].key,active.calls[1].key);
    });
    await test('rotated_credentials_cannot_claim_frozen_scope',async route=>{
      assert.equal((await route.send(checkout())).status,200);const first=await connect();await preparePending(first);const frozen=await saved();
      active.key='re_fixture_rotated';const rotated=await connect();assert.notEqual(rotated.providerScope,first.providerScope);
      assert.equal(await preparePending(rotated),null);assert.equal((await dispatch(rotated)).status,'idle');assert.equal(active.calls.length,0);
      assert.equal((await saved()).provider_scope,frozen.provider_scope);assert.equal((await saved()).body_text,frozen.body_text);assert.equal((await saved()).status,'pending');
    });
    await test('invalid_signature_has_no_pipeline_effects',async route=>{
      assert.equal((await route.send(checkout(),true)).status,400);assert.equal(route.state.retrievals,0);
      assert.deepEqual(await snapshot(),{markers:0,intents:0,deliveries:0,plan:'free'});const transport=await connect();assert.equal(await preparePending(transport),null);assert.equal((await dispatch(transport)).status,'idle');assert.equal(active.calls.length,0);
    });
    await test('provider_validation_becomes_manual_review',async route=>{
      assert.equal((await route.send(checkout())).status,200);const transport=await connect();await preparePending(transport);
      active.providerError={name:'validation_error',message:'Fixture rejected',statusCode:422};assert.equal((await dispatch(transport)).status,'manual');
      assert.equal((await saved()).accepted_message_id,null);assert.equal((await dispatch(transport)).status,'idle');assert.equal(active.calls.length,1);assert.equal(active.accepted,0);
    });
    await test('webhook_and_worker_roles_have_separate_writes',async route=>{
      await assert.rejects(()=>workerPool.query("UPDATE users SET subscription_status='pro'"),{code:'42501'});
      await assert.rejects(()=>workerPool.query("INSERT INTO webhook_events(id,event_type)VALUES('evt_forbidden','checkout.session.completed')"),{code:'42501'});
      await assert.rejects(()=>hookPool.query("UPDATE "+table+" SET status='manual'"),{code:'42501'});
      assert.equal((await route.send(checkout())).status,200);const transport=await connect();await preparePending(transport);assert.equal((await dispatch(transport)).status,'accepted');assert.equal(active.accepted,1);
    });
  }catch(error){checks.push({name:'setup_or_baseline_control',pass:false,error:String(error.message).slice(0,700)});}
  finally{
    globalThis.fetch=originalFetch;for(const pool of [workerPool,hookPool,owner])if(pool)await pool.end();
    const report={controls,tests:checks.length,pass:checks.filter(x=>x.pass).length,checks,
      scope:'ISOLATED_COMBINED_BILLING_PIPELINE_REAL_HTTP_POSTGRES_DRIZZLE_AND_SDKS',externalServices:'MOCKED_FETCH',
      productionWorkerImplemented:false,liveDatabaseConnections:0,realEmailsSent:0,releaseQualified:false};
    fs.writeFileSync(cfg.result,JSON.stringify(report,null,2),{flag:'wx',mode:0o600});console.log(JSON.stringify(report));
    process.exitCode=controls.length===1&&controls.every(x=>x.pass)&&checks.length===12&&checks.every(x=>x.pass)?0:1;
  }
}

try{
  console.log('COMMAND_ID=MMHB-PIPELINE-QUALIFICATION-20260924-28');
  check(JSON.parse(bytes(path.join(ROOT,'package.json'))).name==='mymentalhealthbuddy','Wrong project');
  check(!process.env.REPL_ID||process.env.REPL_ID==='9d71c4b8-8fcd-4b22-aee2-5883d9cbe5a4','Wrong Replit identity');
  check(git('rev-parse','--show-toplevel').trim()===ROOT,'Wrong repository root');
  before=state();const current=JSON.parse(before);
  check(current.head==='b3ce0daf53f52cab918dd0c40954f038ac68da9b'&&current.branch==='integration','Branch or HEAD changed');
  check(current.status===' M server/routes/webhook.mjs\n M server/services/email.mjs\n','Unexpected tracked changes');
  check(process.getuid()!==0,'Run as the regular Replit user');
  const locations={route:'/home/runner/mmhb-webhook-transaction.9cBDdT',delivery:'/home/runner/mmhb-delivery-classify.ipBScd',
    transport:'/home/runner/mmhb-transport-qualify.k6d6J4',template:PREVIOUS};
  for(const [key,id,expected,count,db]of [
    ['route','MMHB-WEBHOOK-TRANSACTION-20260924-23','WEBHOOK_TRANSACTION_CANDIDATE_QUALIFIED_IN_ISOLATION',30,true],
    ['delivery','MMHB-DELIVERY-CLASSIFICATION-20260924-25','DELIVERY_CLASSIFICATION_REPAIR_QUALIFIED_IN_ISOLATION',24,true],
    ['transport','MMHB-TRANSPORT-QUALIFICATION-20260924-26','CREDENTIAL_BOUND_TRANSPORT_QUALIFIED_IN_ISOLATION',20,false],
    ['template','MMHB-TEMPLATE-QUALIFICATION-20260924-27','MMHB_BILLING_TEMPLATES_QUALIFIED_IN_ISOLATION',13,false]]){
    check(fs.lstatSync(locations[key]).isDirectory(),'Evidence directory differs: '+key);
    const prior=JSON.parse(bytes(path.join(locations[key],'summary.json')));
    check(prior.command===id&&prior.status===expected&&prior.tests===count&&prior.pass===count&&
      (!db||prior.disposableDatabaseStopped==='PASS'),'Prior qualification differs: '+key);
  }
  const priorState=JSON.parse(bytes(path.join(PREVIOUS,'state.after.json')));
  for(const key of ['head','branch','index','status','diff','package','lock'])check(current[key]===priorState[key],'Reviewed checkout changed: '+key);
  const pins={
    'server/routes/webhook.mjs':'5f09d685e57e53a79e959e650b8e2b6a60abda89e1b089e07ad6a16672095ba7',
    'server/services/email.mjs':'815fba3d724995e1f809f861be476b32facbad298b99bae1284bb225804929df',
    'shared/schema.mjs':'bcd740ef7e5ffcb76d41c375ad8018a1d620c9854a995e86cd3ee2236607efa9',
    'server/utils/planMapping.mjs':'a4990a99c8b8cd87c37a0348c5dcd5f61040c927c4db80c9bc76a3a8fda34f55'};
  for(const [rel,pin]of Object.entries(pins))check(hash(bytes(path.join(ROOT,rel)))===pin,'Source differs: '+rel);
  const versions={node:process.version};
  for(const [name,version]of [['pg','8.23.0'],['drizzle-orm','0.45.2'],['express','4.22.2'],['stripe','22.6.0'],['resend','6.24.0']]){
    versions[name]=JSON.parse(bytes(path.join(ROOT,'node_modules',name,'package.json'))).version;check(versions[name]===version,'Dependency changed: '+name);
  }
  console.log('DEPENDENCIES='+JSON.stringify(versions));
  for(const binary of ['initdb','pg_ctl','postgres'])fs.accessSync(path.join(PG,binary),fs.constants.X_OK);
  const space=fs.statfsSync('/home/runner');check(space.bavail*space.bsize>=536870912,'Need 512 MiB free for disposable database');
  const sources=[
    ['candidate',locations.route,'webhook.after.mjs','071a2dec33cb5b426e2616d0b017d21ea37f05849079bb091f095bb1712e6e08'],
    ['component',locations.route,'billingEventTransaction.mjs','f8a9fce70124b55d5197cdfed53be393cbd098b80cafb607b352c4a101f9db60'],
    ['schema',locations.route,'schema.mjs',pins['shared/schema.mjs']],
    ['mapping',locations.route,'planMapping.mjs',pins['server/utils/planMapping.mjs']],
    ['intentsDDL',locations.delivery,'billing-notification-intents.sql','0abfb97fdb56428ceb0d7f02ecb951216c2eb61f356c8412b886f1fe1a27feea'],
    ['deliveryDDL',locations.delivery,'billing-notification-deliveries.sql','49f51f3bcd963df35fa276b58d9e42ef04091976934b9a28a1bd119602551d9f'],
    ['delivery',locations.delivery,'billingDelivery.mjs','39cee16ceae83013e500f10cbc3ccc9ccbfca8bd9f9ceafbdb5d2065c3d68f25'],
    ['transport',locations.transport,'billingEmailTransport.mjs','c4757e3c030600af8bf4bb6d7946fc85195541b38e5c0534b8ba5608ec1892d4'],
    ['template',locations.template,'billingNotificationTemplate.mjs','cdb91217cea6ea6fb1bee2633a0f9b396d3d9a452acafd37a6d1491a37bd8e34']];
  const checked=sources.map(([key,parent,name,pin])=>{const b=bytes(path.join(parent,name));check(hash(b)===pin,'Qualified artifact changed: '+name);return{key,name,pin,b};});
  directory=fs.mkdtempSync('/home/runner/mmhb-pipeline-qualify.');console.log('EVIDENCE_DIRECTORY='+directory);put('state.before.json',before);
  const files={};for(const {key,name,pin,b}of checked){files[key]=put(name,b);check(hash(bytes(files[key]))===pin,'Copied artifact differs');}
  put('artifact-manifest.json',JSON.stringify(checked.map(({key,name,pin})=>({key,name,sha256:pin})),null,2));
  console.log('QUALIFIED_COMPONENT_COPIES=PASS_UNCHANGED');
  const worker=put('qualify.cjs','('+qualifyPipeline.toString()+')().catch(e=>{console.error(e.message);process.exitCode=2;});\n');
  run('HARNESS_SYNTAX',process.execPath,['--check',worker]);
  data=path.join(directory,'data');const socket=path.join(directory,'socket');fs.mkdirSync(socket,{mode:0o700});
  const password=crypto.randomBytes(32).toString('hex'),pwfile=put('fixture-password',password+'\n');
  run('INITDB',path.join(PG,'initdb'),['-D',data,'-U','mmhb_owner','--auth-local=scram-sha-256',
    '--auth-host=reject','--pwfile='+pwfile,'--encoding=UTF8','--locale=C','--no-instructions']);
  fs.appendFileSync(path.join(data,'postgresql.conf'),`\nlisten_addresses = ''\nunix_socket_directories = '${socket}'\nunix_socket_permissions = 0700\nport = 6543\nmax_connections = 20\nshared_buffers = '16MB'\ntimezone = 'UTC'\nlog_statement = 'none'\n`);
  run('PG_START',path.join(PG,'pg_ctl'),['-D',data,'-l',path.join(directory,'postgres.log'),'-w','-t','20','start'],30000);
  started=true;stopped='PENDING';console.log('DATABASE_SCOPE=NEW_PRIVATE_UNIX_SOCKET_CLUSTER_WITH_SYNTHETIC_DATA');
  const result=path.join(directory,'result.json');
  const config=put('config.json',JSON.stringify({root:ROOT,directory,data,socket,password,...files,result}));
  const execution=run('COMBINED_PIPELINE_TESTS',process.execPath,['--experimental-vm-modules',worker,config],60000,[0,1]);
  report=JSON.parse(bytes(result));console.log('NEGATIVE_CONTROL='+JSON.stringify(report.controls));
  console.log('PIPELINE_RESULT='+JSON.stringify({tests:report.tests,pass:report.pass,failed:report.checks?.filter(x=>!x.pass)}));
  check(execution.status===0&&report.controls?.length===1&&report.controls.every(x=>x.pass===true)&&
    report.tests===12&&report.pass===12&&report.checks?.length===12&&report.checks.every(x=>x.pass===true),'Combined pipeline qualification failed');
  status='COMBINED_BILLING_PIPELINE_QUALIFIED_IN_ISOLATION';
}catch(error){console.log('REASON='+error.message);process.exitCode=2;}
finally{
  if(data&&(started||fs.existsSync(path.join(data,'postmaster.pid')))){
    try{run('PG_STOP',path.join(PG,'pg_ctl'),['-D',data,'-m','fast','-w','-t','20','stop'],30000);
      run('PG_STOP_VERIFY',path.join(PG,'pg_ctl'),['-D',data,'status'],10000,[3]);stopped='PASS';
    }catch(error){stopped='FAILED';status='STOPPED';process.exitCode=2;console.log('CLEANUP_ERROR='+error.message+'\nCLEANUP_DATA_DIRECTORY='+data);}
  }
  if(before){try{const after=state();check(after===before,'Checkout changed during qualification');
    if(directory)put('state.after.json',after);console.log('TRACKED_SOURCE_AND_PACKAGE_FILES_PRESERVATION=PASS');
  }catch(error){status='STOPPED';process.exitCode=2;console.log('PRESERVATION_ERROR='+error.message);}}
  if(interrupted){status='STOPPED';process.exitCode=2;}
  if(directory)put('summary.json',JSON.stringify({command:'MMHB-PIPELINE-QUALIFICATION-20260924-28',status,
    tests:report?.tests,pass:report?.pass,disposableDatabaseStopped:stopped,sourceWrites:0,releaseQualified:false},null,2));
  console.log('STATUS='+status+'\nDISPOSABLE_DATABASE_STOPPED='+stopped+'\nSOURCE_WRITES_BY_COMMAND=0');
  console.log('LIVE_DATABASE_CONNECTIONS=0\nLIVE_DATABASE_MIGRATIONS=0\nREAL_CONNECTOR_CALLS=0\nREAL_EMAILS_SENT=0');
  console.log('ORCHESTRATION=TEST_HARNESS_ONLY\nPRODUCTION_WORKER_AND_SCHEDULER=PENDING\nAPPLICATION_INTEGRATION=PENDING');
  console.log('FULL_APP_TESTS=NOT_RUN:ISOLATED_PIPELINE_ONLY\nCOMMIT=NOT_RUN\nPUSH=NOT_RUN\nDEPLOY=NOT_RUN\nRELEASE_QUALIFIED=false');
  if(directory)console.log('EVIDENCE_DIRECTORY='+directory);
  console.log('NEXT_ACTION=RETURN_FULL_OUTPUT\nREPORT_END=MMHB-PIPELINE-QUALIFICATION-20260924-28');
}
MMHB28_NODE
)
