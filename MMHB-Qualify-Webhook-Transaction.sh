(
set -eu
umask 077
cd /home/runner/workspace
node --input-type=commonjs <<'MMHB23_NODE'
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {spawnSync}=require('node:child_process');
const ROOT='/home/runner/workspace';
const PREVIOUS='/home/runner/mmhb-atomic-billing.w5yyxu';
const PG='/nix/store/bgwr5i8jf8jpg75rr53rz3fqv5k8yrwp-postgresql-16.10/bin';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const check=(ok,message)=>{if(!ok)throw Error(message);};
const env={PATH:process.env.PATH||'/usr/bin:/bin',LANG:'C.UTF-8',TZ:'UTC',CI:'true',GIT_OPTIONAL_LOCKS:'0',GIT_TERMINAL_PROMPT:'0'};
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
function buildCandidate(source) {
  if (typeof source !== 'string') throw new Error('Webhook source must be text');
  const once = (oldText, newText) => {
    if (source.split(oldText).length !== 2) throw new Error('Webhook patch anchor differs: '+oldText.slice(0,80));
    source = source.replace(oldText, newText);
  };
  const cut = (start, end) => {
    if (source.split(start).length !== 2 || source.split(end).length !== 2) throw new Error('Webhook slice anchors differ');
    const a = source.indexOf(start), b = source.indexOf(end,a);
    if (b <= a) throw new Error('Webhook slice order differs');
    return source.slice(a,b);
  };
  once('import { sendUpgradeConfirmation, sendCancellationAcknowledgment } from "../services/email.mjs";',
    'import { processBillingEvent } from "../services/billingEventTransaction.mjs";');
  once('async function isProcessed(eventId) {', 'async function isProcessed(event) {\n  const eventId = event.id;');
  once('    return rows.length > 0;', `    if (!rows.length) return false;
    if (rows[0].status !== "processed" || rows[0].eventType !== event.type) {
      throw new Error("Existing event is not confirmed complete with the same type");
    }
    return true;`);
  const marker = cut('/**\n * Mark event as processed (durable persistence)\n */', 'router.get("/", (_req, res) => {');
  once(marker, `// Observability failures cannot reverse or obscure a committed billing event.
function safelyObserve(observation) {
  try {
    const pending = observation();
    if (pending && typeof pending.catch === "function") pending.catch(() => {});
  } catch {}
}


`);
  once('if (await isProcessed(event.id)) {', 'if (await isProcessed(event)) {');
  once('        logger.info("Duplicate webhook event skipped", { eventId: event.id, type: event.type });',
    '        safelyObserve(() => logger.info("Duplicate webhook event skipped", { eventId: event.id, type: event.type }));');

  // Fetch authoritative Stripe data before opening any database transaction.
  const retrieve = cut('          // Re-fetch session with line items expanded', '          const checkoutPlan = resolvePlanFromCheckoutSession(authoritativeSession);');
  once(retrieve, '');
  once('      switch (event.type) {', `      let authoritativeSession;
      if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const customerEmail = session.customer_details?.email || session.customer_email;
        if (session.customer && session.subscription && customerEmail) {
          // Retrieve the authoritative session before applying the existing plan-mapping rules.
          // Network failure occurs before the transaction, leaving Stripe free to retry.
          try {
            authoritativeSession = await stripe.checkout.sessions.retrieve(session.id, {
              expand: ["line_items"],
            });
          } catch (expandErr) {
            safelyObserve(() => logger.error("checkout.session.completed: line_items retrieve FAILED — refusing entitlement, deferring to Stripe retry", {
              error: expandErr.message,
              sessionId: session.id,
            }));
            safelyObserve(() => increment("subscription_mapping_unknown", { source: "checkout_retrieve_failed" }));
            throw expandErr;
          }
        }
      }

      const afterCommit = [];
      const committedLogger = Object.fromEntries(["info", "warn", "error"].map(level =>
        [level, (...args) => afterCommit.push(() => logger[level](...args))]));
      const committedIncrement = (...args) => afterCommit.push(() => increment(...args));
      const result = await processBillingEvent(db, event, async (tx, enqueue) => {
      switch (event.type) {`);
  once('          const checkoutResult = await db', '          const checkoutResult = await tx');
  once(`            .where(eq(users.email, customerEmail));
          const checkoutRowsAffected = checkoutResult?.rowCount ?? checkoutResult?.changes ?? 0;`,
    `            .where(eq(users.email, customerEmail))
            .returning({ id: users.id, email: users.email, name: users.name });
          const checkoutRowsAffected = checkoutResult.length;`);
  once(`          sendUpgradeConfirmation(customerEmail, session.customer_details?.name || "").catch(err => {
            logger.warn("Failed to send upgrade email", { error: err.message });
          });`,
    `          for (const matchedUser of checkoutResult) {
            await enqueue({kind: "upgrade", userId: matchedUser.id,
              recipient: matchedUser.email, name: matchedUser.name || ""});
          }`);
  once('          const syncResult = await db', '          const syncResult = await tx');
  const preselect = cut('          const userRows = await db.select({ email: users.email, username: users.username })', '          const deleteResult = await db');
  once(preselect, '');
  once('          const deleteResult = await db', '          const deleteResult = await tx');
  once(`          const deleteRows = deleteResult?.rowCount ?? deleteResult?.changes ?? 0;`,
    '          const deleteRows = deleteResult.length;');
  // Scope the cancellation RETURNING addition to its unique update block.
  const deletion = cut('          const deleteResult = await tx', '          const deleteRows = deleteResult.length;');
  const deletionEnd = '            .where(eq(users.stripeCustomerId, subscription.customer));';
  if (deletion.split(deletionEnd).length !== 2) throw new Error('Cancellation update anchor differs');
  once(deletion, deletion.replace(deletionEnd, `            .where(eq(users.stripeCustomerId, subscription.customer))
            .returning({ id: users.id, email: users.email, name: users.name });`));
  const sendCancellation = cut('          const cancelledUser = userRows?.[0];', '          break;\n        }\n\n        case "invoice.paid": {');
  once(sendCancellation, `          for (const cancelledUser of deleteResult) {
            await enqueue({kind: "cancellation", userId: cancelledUser.id,
              recipient: cancelledUser.email, name: cancelledUser.name || "",
              periodEnd: subscription.current_period_end ?? null});
          }
`);
  once('          const paidResult = await db', '          const paidResult = await tx');
  once('          const failedResult = await db', '          const failedResult = await tx');
  once(`      // Mark as processed ONLY after successful handling
      await markProcessed(event);
      return res.json({ received: true });`,
    `      });
      if (result.duplicate) {
        safelyObserve(() => logger.info("Duplicate webhook event skipped", { eventId: event.id, type: event.type }));
        return res.json({ received: true, duplicate: true });
      }
      for (const observation of afterCommit) safelyObserve(observation);
      return res.json({ received: true });`);
  once('      logger.error("Webhook handler failed", { error: e.message, eventType: event.type });',
    '      safelyObserve(() => logger.error("Webhook handler failed", { error: e.message, eventType: event.type }));');
  once('      // Do NOT mark processed on failure; Stripe will retry.',
    '      // A failed transaction leaves no new billing effects; Stripe can retry.');

  // Queue every business observation so even warnings cannot escape before commit.
  const business = cut('      switch (event.type) {', '      });\n      if (result.duplicate) {');
  if ((business.match(/logger\./g) || []).length !== 20 ||
      (business.match(/increment\(/g) || []).length !== 5) {
    throw new Error('Business observation count differs');
  }
  if (/\bdb\s*[.\n]|sendUpgradeConfirmation|sendCancellationAcknowledgment|stripe\./.test(business)) {
    throw new Error('Unscoped database or network work remains inside transaction');
  }
  once(business, business.replaceAll('logger.', 'committedLogger.').replaceAll('increment(', 'committedIncrement('));
  if (/markProcessed|sendUpgradeConfirmation|sendCancellationAcknowledgment|users\.username/.test(source)) {
    throw new Error('Obsolete nontransactional billing path remains');
  }
  return source;
}
async function qualifyRoute() {
  const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),http=require('node:http');
  const assert=require('node:assert/strict'),{createRequire}=require('node:module');
  const {AsyncLocalStorage}=require('node:async_hooks');
  const cfg=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
  assert.ok(cfg.socket.startsWith(cfg.directory+path.sep));assert.match(cfg.password,/^[a-f0-9]{64}$/);
  const req=createRequire(path.join(cfg.root,'package.json'));
  const express=req('express'),StripeImport=req('stripe'),{Pool}=req('pg');
  const Stripe=StripeImport.default||StripeImport.Stripe||StripeImport;
  const orm=req('drizzle-orm'),pgcore=req('drizzle-orm/pg-core'),{drizzle}=req('drizzle-orm/node-postgres');
  const connection={host:cfg.socket,port:6543,password:cfg.password,ssl:false,
    connectionTimeoutMillis:4000,idleTimeoutMillis:1000,statement_timeout:7000};
  const owner=new Pool({...connection,user:'mmhb_owner',database:'postgres',max:2});
  let appPool;const controls=[],checks=[],scope=new AsyncLocalStorage();
  const role='mmhb_route_app',uid='11111111-1111-4111-8111-111111111111',email='fixture@example.invalid';
  const fakeEnv={STRIPE_SECRET_KEY:'sk_test_fixture_only',STRIPE_WEBHOOK_SECRET:'whsec_fixture_only',STRIPE_PRICE_PRO:'price_fixture_pro'};
  const sdk=new Stripe(fakeEnv.STRIPE_SECRET_KEY,{apiVersion:'2024-06-20'});
  const event=(id,type='checkout.session.completed',object)=>({id,type,data:{object:object||{
    id:'cs_fixture',customer:'cus_fixture',subscription:'sub_fixture',customer_details:{email,name:'Stripe Name'}}}});
  async function snapshot(){return(await owner.query(`SELECT
    (SELECT count(*)::int FROM webhook_events) AS markers,
    (SELECT count(*)::int FROM billing_notification_intents) AS intents,
    (SELECT subscription_status FROM users LIMIT 1) AS plan`)).rows[0];}
  async function reset(){
    await owner.query(`DROP TRIGGER IF EXISTS fail_route_commit ON billing_notification_intents;
      GRANT SELECT,INSERT ON webhook_events TO ${role};GRANT SELECT,UPDATE ON users TO ${role};
      GRANT SELECT,INSERT ON billing_notification_intents TO ${role};
      TRUNCATE billing_notification_intents,webhook_events,users`);
    await owner.query("INSERT INTO users(id,email,name,stripe_customer_id) VALUES($1,$2,'Database User','cus_fixture')",[uid,email]);
  }
  async function fixture(mode,options={}){
    const state={emails:0,retrievals:0,hook:null,session:null,throwRetrieve:false,observationInTransaction:false};
    const context=vm.createContext({Buffer,process:{env:{...fakeEnv,...(options.unconfigured?{STRIPE_SECRET_KEY:''}:{})}}});
    async function load(file,deps){
      const mod=new vm.SourceTextModule(fs.readFileSync(file,'utf8'),{context});const cache=new Map();
      await mod.link(key=>{
        assert.ok(Object.hasOwn(deps,key),'Unexpected import: '+key);
        if(!cache.has(key))cache.set(key,new vm.SyntheticModule(Object.keys(deps[key]),function(){
          for(const [k,v]of Object.entries(deps[key]))this.setExport(k,v);
        },{context}));return cache.get(key);
      });await mod.evaluate();return mod.namespace;
    }
    const schema=await load(cfg.schema,{'drizzle-orm':orm,'drizzle-orm/pg-core':pgcore});
    const mapping=await load(cfg.mapping,{}),component=await load(cfg.component,{'drizzle-orm':orm,'../../shared/schema.mjs':schema});
    const real=drizzle(appPool,{schema});
    const database=mode==='baseline'?real:{
      select:real.select.bind(real),
      transaction:(body,options)=>real.transaction(tx=>scope.run(true,()=>body(tx)),options),
      update(){throw Error('Nontransactional route update');},insert(){throw Error('Nontransactional route insert');}
    };
    class OfflineStripe{
      constructor(){
        this.webhooks={constructEvent(body,signature,secret){assert.ok(Buffer.isBuffer(body));return sdk.webhooks.constructEvent(body,signature,secret);}};
        this.checkout={sessions:{retrieve:async()=>{
          assert.notEqual(scope.getStore(),true,'Stripe retrieval occurred inside the transaction');
          state.retrievals++;if(state.hook)await state.hook();if(state.throwRetrieve)throw Error('Fixture retrieval outage');
          return state.session||{line_items:{data:[{price:{id:fakeEnv.STRIPE_PRICE_PRO}}]}};
        }}};
      }
    }
    const observation=()=>{if(scope.getStore()===true)state.observationInTransaction=true;if(options.throwObservation)throw Error('Fixture observation failure');};
    const router=await load(mode==='baseline'?cfg.baseline:cfg.candidate,{
      express:{default:express,Router:express.Router},stripe:{default:OfflineStripe},'../db/client.mjs':{db:database},
      '../../shared/schema.mjs':schema,'drizzle-orm':orm,'../utils/logger.mjs':{logger:{info:observation,warn:observation,error:observation}},
      '../utils/metrics.mjs':{increment:observation},'../utils/planMapping.mjs':mapping,
      '../observability/safetyAlerts.mjs':{async alertWebhookSignatureFailure(){}},
      '../services/billingEventTransaction.mjs':component,
      '../services/email.mjs':{async sendUpgradeConfirmation(){state.emails++;},async sendCancellationAcknowledgment(){state.emails++;}}
    });
    const app=express();app.use('/api/webhooks',router.default);app.use(express.json());
    app.use((_err,_req,res,_next)=>res.status(500).json({error:'Fixture middleware failure'}));
    const server=http.createServer(app);server.requestTimeout=10000;server.headersTimeout=10000;
    await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
    const send=(input,badSignature=false)=>new Promise((resolve,reject)=>{
      const body=Buffer.from(JSON.stringify(input));
      const signature=badSignature?'invalid':sdk.webhooks.generateTestHeaderString({payload:body.toString(),secret:fakeEnv.STRIPE_WEBHOOK_SECRET});
      const request=http.request({hostname:'127.0.0.1',port:server.address().port,method:'POST',path:'/api/webhooks/stripe',agent:false,
        headers:{'content-type':'application/json','content-length':body.length,'stripe-signature':signature}},response=>{
        const chunks=[];let length=0;
        response.on('data',chunk=>{length+=chunk.length;if(length>65536)response.destroy(Error('Oversized fixture response'));else chunks.push(chunk);});
        response.once('error',reject);response.once('end',()=>{
          const text=Buffer.concat(chunks).toString();try{resolve({status:response.statusCode,
            body:/application\/json/.test(response.headers['content-type']||'')?JSON.parse(text):text});}catch(e){reject(e);}
        });
      });request.setTimeout(10000,()=>request.destroy(Error('HTTP fixture timeout')));request.once('error',reject);request.end(body);
    });
    return{state,send,close:()=>new Promise(r=>{server.close(r);server.closeAllConnections();})};
  }
  async function test(name,body,options={},mode='candidate'){
    let f;const target=mode==='baseline'?controls:checks;
    try{await reset();f=await fixture(mode,options);await body(f);if(mode==='candidate'){assert.equal(f.state.emails,0,'Candidate directly invoked email');assert.equal(f.state.observationInTransaction,false,'Observation ran before commit');}target.push({name,pass:true});}
    catch(e){target.push({name,pass:false,error:String(e.message).slice(0,700)});}
    finally{if(f)await f.close();}
  }
  async function race(f){
    let arrivals=0,release,rejectBarrier,timer;const barrier=new Promise((resolve,reject)=>{release=resolve;rejectBarrier=reject;});
    f.state.hook=async()=>{
      if(++arrivals===1)timer=setTimeout(()=>rejectBarrier(Error('Retrieval barrier timeout')),3000);
      if(arrivals===2){clearTimeout(timer);release();}await barrier;
    };
    const requests=[f.send(event('evt_race')),f.send(event('evt_race'))];
    try{const results=await Promise.all(requests);assert.equal(arrivals,2);return results;}
    finally{clearTimeout(timer);release();await Promise.allSettled(requests);f.state.hook=null;}
  }
  try{
    const identity=(await owner.query("SELECT current_setting('data_directory') AS data,current_setting('listen_addresses') AS listen,inet_server_addr() AS address,current_user AS owner")).rows[0];
    assert.equal(fs.realpathSync(identity.data),fs.realpathSync(cfg.data));assert.equal(identity.listen,'');assert.equal(identity.address,null);assert.equal(identity.owner,'mmhb_owner');
    await owner.query(`CREATE ROLE ${role} LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE PASSWORD '${cfg.password}';
      CREATE TABLE users(id uuid PRIMARY KEY,email varchar(255) NOT NULL UNIQUE,name varchar(255) NOT NULL,
        stripe_customer_id text,subscription_status text DEFAULT 'free',subscription_expires_at timestamp,updated_at timestamp NOT NULL DEFAULT now());
      CREATE TABLE webhook_events(id text PRIMARY KEY,event_type varchar(100) NOT NULL,
        status varchar(50) NOT NULL DEFAULT 'processed',processed_at timestamptz NOT NULL DEFAULT now());GRANT USAGE ON SCHEMA public TO ${role}`);
    await owner.query(fs.readFileSync(cfg.ddl,'utf8'));
    appPool=new Pool({...connection,user:role,database:'postgres',max:4});
    assert.equal((await appPool.query('SELECT rolsuper FROM pg_roles WHERE rolname=current_user')).rows[0].rolsuper,false);
    const empty={markers:0,intents:0,plan:'free'},complete={markers:1,intents:1,plan:'pro'};
    await test('marker_failure_repeats_email',async f=>{
      await owner.query(`REVOKE INSERT ON webhook_events FROM ${role}`);
      assert.equal((await f.send(event('evt_failure'))).status,500);
      assert.deepEqual(await snapshot(),{markers:0,intents:0,plan:'pro'});assert.equal(f.state.emails,1);
      await owner.query(`GRANT INSERT ON webhook_events TO ${role}`);
      assert.equal((await f.send(event('evt_failure'))).status,200);assert.equal(f.state.emails,2);
    },{},'baseline');
    await test('concurrent_delivery_repeats_email',async f=>{
      const r=await race(f);assert.deepEqual(r.map(x=>x.status).sort(),[200,500]);
      assert.equal(f.state.emails,2);assert.deepEqual(await snapshot(),{markers:1,intents:0,plan:'pro'});
    },{},'baseline');
    assert.ok(controls.length===2&&controls.every(x=>x.pass),'Baseline blocker reproduction changed');
    await test('checkout_success',async f=>{
      assert.equal((await f.send(event('evt_success'))).status,200);assert.deepEqual(await snapshot(),complete);
      const row=(await owner.query('SELECT kind,user_id,payload FROM billing_notification_intents')).rows[0];
      assert.equal(row.user_id,uid);assert.equal(row.kind,'upgrade');assert.deepEqual(row.payload,{version:1,recipient:email,name:'Database User',periodEnd:null});
    });
    await test('sequential_duplicate',async f=>{
      assert.equal((await f.send(event('evt_duplicate'))).status,200);const r=await f.send(event('evt_duplicate'));
      assert.equal(r.status,200);assert.equal(r.body.duplicate,true);assert.equal(f.state.retrievals,1);assert.deepEqual(await snapshot(),complete);
    });
    await test('invalid_signature',async f=>{assert.equal((await f.send(event('evt_bad'),true)).status,400);assert.equal(f.state.retrievals,0);assert.deepEqual(await snapshot(),empty);});
    await test('stripe_unconfigured',async f=>{assert.equal((await f.send(event('evt_unconfigured'))).status,503);assert.deepEqual(await snapshot(),empty);},{unconfigured:true});
    for(const [label,table,privilege]of [['marker_read','webhook_events','SELECT'],['marker_insert','webhook_events','INSERT'],['user_update','users','UPDATE'],['intent_insert','billing_notification_intents','INSERT']]){
      await test(label+'_failure_and_retry',async f=>{
        await owner.query(`REVOKE ${privilege} ON ${table} FROM ${role}`);
        assert.equal((await f.send(event('evt_denied'))).status,500);assert.deepEqual(await snapshot(),empty);
        await owner.query(`GRANT ${privilege} ON ${table} TO ${role}`);
        assert.equal((await f.send(event('evt_denied'))).status,200);assert.deepEqual(await snapshot(),complete);
      });
    }
    await test('commit_failure_and_retry',async f=>{
      await owner.query(`CREATE FUNCTION reject_route_commit() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'fixture commit failure' USING ERRCODE='23514'; END $$;
        CREATE CONSTRAINT TRIGGER fail_route_commit AFTER INSERT ON billing_notification_intents DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION reject_route_commit()`);
      assert.equal((await f.send(event('evt_commit'))).status,500);assert.deepEqual(await snapshot(),empty);
      await owner.query('DROP TRIGGER fail_route_commit ON billing_notification_intents');
      assert.equal((await f.send(event('evt_commit'))).status,200);assert.deepEqual(await snapshot(),complete);
    });
    await test('stripe_retrieval_failure',async f=>{f.state.throwRetrieve=true;assert.equal((await f.send(event('evt_retrieve'))).status,500);assert.deepEqual(await snapshot(),empty);});
    for(const [label,session]of [['unknown_checkout_price',{line_items:{data:[{price:{id:'unknown'}}]}}],
      ['checkout_metadata_mismatch',{line_items:{data:[{price:{id:'price_fixture_pro'}}]},metadata:{plan:'elite'}}]]){
      await test(label,async f=>{f.state.session=session;assert.equal((await f.send(event('evt_mapping'))).status,200);assert.deepEqual(await snapshot(),{markers:1,intents:0,plan:'free'});});
    }
    await test('checkout_no_matching_user',async f=>{const e=event('evt_unmatched');e.data.object.customer_details.email='absent@example.invalid';assert.equal((await f.send(e)).status,200);assert.deepEqual(await snapshot(),{markers:1,intents:0,plan:'free'});});
    await test('historical_marker',async f=>{
      await owner.query("INSERT INTO webhook_events(id,event_type)VALUES('evt_history','checkout.session.completed')");
      const r=await f.send(event('evt_history'));assert.equal(r.status,200);assert.equal(r.body.duplicate,true);assert.equal(f.state.retrievals,0);assert.deepEqual(await snapshot(),{markers:1,intents:0,plan:'free'});
    });
    for(const [label,type,status]of [['wrong_type','invoice.paid','processed'],['wrong_status','checkout.session.completed','processing']]){
      await test('marker_'+label,async f=>{
        await owner.query('INSERT INTO webhook_events(id,event_type,status)VALUES($1,$2,$3)',['evt_conflict',type,status]);
        assert.equal((await f.send(event('evt_conflict'))).status,500);assert.equal(f.state.retrievals,0);assert.deepEqual(await snapshot(),{markers:1,intents:0,plan:'free'});
      });
    }
    await test('concurrent_duplicate',async f=>{const r=await race(f);assert.deepEqual(r.map(x=>x.status),[200,200]);assert.equal(r.filter(x=>x.body.duplicate===true).length,1);assert.deepEqual(await snapshot(),complete);});
    const cancellation=()=>event('evt_cancel','customer.subscription.deleted',{id:'sub_fixture',customer:'cus_fixture',current_period_end:1800000000});
    await test('cancellation_success_and_replay',async f=>{
      await owner.query("UPDATE users SET subscription_status='pro'");assert.equal((await f.send(cancellation())).status,200);
      const r=await f.send(cancellation());assert.equal(r.status,200);assert.equal(r.body.duplicate,true);assert.deepEqual(await snapshot(),{markers:1,intents:1,plan:'free'});
      const row=(await owner.query('SELECT kind,payload FROM billing_notification_intents')).rows[0];assert.equal(row.kind,'cancellation');assert.deepEqual(row.payload,{version:1,recipient:email,name:'Database User',periodEnd:1800000000});
    });
    await test('cancellation_failure_and_retry',async f=>{
      await owner.query(`UPDATE users SET subscription_status='pro';REVOKE INSERT ON billing_notification_intents FROM ${role}`);
      assert.equal((await f.send(cancellation())).status,500);assert.deepEqual(await snapshot(),{markers:0,intents:0,plan:'pro'});
      await owner.query(`GRANT INSERT ON billing_notification_intents TO ${role}`);assert.equal((await f.send(cancellation())).status,200);assert.deepEqual(await snapshot(),{markers:1,intents:1,plan:'free'});
    });
    await test('cancellation_no_matching_user',async f=>{const e=cancellation();e.data.object.customer='cus_absent';assert.equal((await f.send(e)).status,200);assert.deepEqual(await snapshot(),{markers:1,intents:0,plan:'free'});});
    for(const [label,type,object,initial,expected]of [
      ['subscription_created','customer.subscription.created',{customer:'cus_fixture',status:'active',items:{data:[{price:{id:'price_fixture_pro'}}]},current_period_end:1800000000},'free','pro'],
      ['subscription_inactive','customer.subscription.updated',{customer:'cus_fixture',status:'past_due'},'pro','free'],
      ['subscription_unknown_price','customer.subscription.updated',{customer:'cus_fixture',status:'active',items:{data:[{price:{id:'unknown'}}]}},'free','free'],
      ['invoice_paid','invoice.paid',{customer:'cus_fixture',lines:{data:[{price:{id:'price_fixture_pro'}}]}},'free','pro'],
      ['invoice_failed','invoice.payment_failed',{customer:'cus_fixture'},'pro','free'],
      ['invoice_unknown_price','invoice.paid',{customer:'cus_fixture',lines:{data:[{price:{id:'unknown'}}]}},'free','free']]){
      await test(label,async f=>{await owner.query('UPDATE users SET subscription_status=$1',[initial]);assert.equal((await f.send(event('evt_lifecycle',type,object))).status,200);assert.deepEqual(await snapshot(),{markers:1,intents:0,plan:expected});});
    }
    await test('postcommit_observation_failure',async f=>{assert.equal((await f.send(event('evt_observe'))).status,200);assert.deepEqual(await snapshot(),complete);},{throwObservation:true});
    for(const missing of ['customer','subscription','email'])await test('checkout_missing_'+missing,async f=>{
      const e=event('evt_missing');if(missing==='email')delete e.data.object.customer_details.email;else delete e.data.object[missing];
      assert.equal((await f.send(e)).status,200);assert.equal(f.state.retrievals,0);assert.deepEqual(await snapshot(),{markers:1,intents:0,plan:'free'});
    });
  }catch(e){checks.push({name:'setup_or_baseline_control',pass:false,error:String(e.message).slice(0,700)});}
  finally{
    for(const pool of [appPool,owner])if(pool)await pool.end();
    const report={controls,tests:checks.length,pass:checks.filter(x=>x.pass).length,checks,
      scope:'ISOLATED_HTTP_ROUTE_REAL_POSTGRES_DRIZZLE_SCHEMA_MAPPING_SIGNATURES',externalServices:'SIMULATED',releaseQualified:false};
    fs.writeFileSync(cfg.result,JSON.stringify(report,null,2),{flag:'wx',mode:0o600});console.log(JSON.stringify(report));
    process.exitCode=checks.some(x=>!x.pass)||controls.some(x=>!x.pass)?1:0;
  }
}
try{
  console.log('COMMAND_ID=MMHB-WEBHOOK-TRANSACTION-20260924-23');
  check(JSON.parse(bytes(path.join(ROOT,'package.json'))).name==='mymentalhealthbuddy','Wrong project');
  check(!process.env.REPL_ID||process.env.REPL_ID==='9d71c4b8-8fcd-4b22-aee2-5883d9cbe5a4','Wrong Replit identity');
  check(git('rev-parse','--show-toplevel').trim()===ROOT,'Wrong repository root');
  before=state();const current=JSON.parse(before);
  check(current.head==='b3ce0daf53f52cab918dd0c40954f038ac68da9b'&&current.branch==='integration','Branch or HEAD changed');
  check(current.status===' M server/routes/webhook.mjs\n M server/services/email.mjs\n','Unexpected tracked changes');
  check(process.getuid()!==0,'Run as the regular Replit user');
  check(fs.lstatSync(PREVIOUS).isDirectory(),'Expected prior evidence directory');
  const previous=JSON.parse(bytes(path.join(PREVIOUS,'summary.json')));
  check(previous.command==='MMHB-ATOMIC-BILLING-QUALIFICATION-20260924-22'&&
    previous.status==='TRANSACTION_COMPONENT_QUALIFIED_IN_ISOLATION'&&previous.tests===16&&previous.pass===16&&
    previous.disposableDatabaseStopped==='PASS','Prior transaction qualification differs');
  const priorState=JSON.parse(bytes(path.join(PREVIOUS,'state.after.json')));
  for(const key of ['head','branch','index','status','diff','package','lock'])check(current[key]===priorState[key],'Reviewed checkout changed: '+key);
  const pins={
    'server/routes/webhook.mjs':'5f09d685e57e53a79e959e650b8e2b6a60abda89e1b089e07ad6a16672095ba7',
    'server/services/email.mjs':'815fba3d724995e1f809f861be476b32facbad298b99bae1284bb225804929df',
    'shared/schema.mjs':'bcd740ef7e5ffcb76d41c375ad8018a1d620c9854a995e86cd3ee2236607efa9',
    'server/utils/planMapping.mjs':'a4990a99c8b8cd87c37a0348c5dcd5f61040c927c4db80c9bc76a3a8fda34f55'};
  for(const [rel,pin]of Object.entries(pins))check(hash(bytes(path.join(ROOT,rel)))===pin,'Source differs: '+rel);
  const versions={node:process.version};
  for(const name of ['pg','drizzle-orm','express','stripe'])versions[name]=JSON.parse(bytes(path.join(ROOT,'node_modules',name,'package.json'))).version;
  check(versions.pg==='8.23.0'&&versions['drizzle-orm']==='0.45.2'&&versions.express==='4.22.2'&&versions.stripe==='22.6.0','Database dependencies changed');
  console.log('DEPENDENCIES='+JSON.stringify(versions));
  for(const binary of ['initdb','pg_ctl','postgres'])fs.accessSync(path.join(PG,binary),fs.constants.X_OK);
  const space=fs.statfsSync('/home/runner');check(space.bavail*space.bsize>=536870912,'Need 512 MiB free for disposable database');
  directory=fs.mkdtempSync('/home/runner/mmhb-webhook-transaction.');
  console.log('EVIDENCE_DIRECTORY='+directory);put('state.before.json',before);
  const componentBytes=bytes(path.join(PREVIOUS,'billingEventTransaction.mjs'));
  const ddlBytes=bytes(path.join(PREVIOUS,'billing-notification-intents.sql'));
  check(hash(componentBytes)==='f8a9fce70124b55d5197cdfed53be393cbd098b80cafb607b352c4a101f9db60','Qualified component differs');
  check(hash(ddlBytes)==='0abfb97fdb56428ceb0d7f02ecb951216c2eb61f356c8412b886f1fe1a27feea','Qualified intent schema differs');
  const component=put('billingEventTransaction.mjs',componentBytes),ddl=put('billing-notification-intents.sql',ddlBytes);
  const baseline=put('webhook.before.mjs',bytes(path.join(ROOT,'server/routes/webhook.mjs')));
  const candidateSource=buildCandidate(bytes(baseline).toString('utf8'));
  check(hash(candidateSource)==='071a2dec33cb5b426e2616d0b017d21ea37f05849079bb091f095bb1712e6e08','Candidate hash differs');
  const candidate=put('webhook.after.mjs',candidateSource);
  const schema=put('schema.mjs',bytes(path.join(ROOT,'shared/schema.mjs')));
  const mapping=put('planMapping.mjs',bytes(path.join(ROOT,'server/utils/planMapping.mjs')));
  const worker=put('qualify.cjs','('+qualifyRoute.toString()+')().catch(e=>{console.error(e.message);process.exitCode=2;});\n');
  run('CANDIDATE_SYNTAX',process.execPath,['--check',candidate]);run('HARNESS_SYNTAX',process.execPath,['--check',worker]);
  run('CANDIDATE_DIFF','git',['--no-pager','diff','--no-index','--no-ext-diff','--no-textconv',baseline,candidate],10000,[0,1]);
  console.log('CANDIDATE_SHA256='+hash(bytes(candidate)));
  data=path.join(directory,'data');const socket=path.join(directory,'socket');fs.mkdirSync(socket,{mode:0o700});
  const password=crypto.randomBytes(32).toString('hex'),pwfile=put('fixture-password',password+'\n');
  run('INITDB',path.join(PG,'initdb'),['-D',data,'-U','mmhb_owner','--auth-local=scram-sha-256',
    '--auth-host=reject','--pwfile='+pwfile,'--encoding=UTF8','--locale=C','--no-instructions']);
  fs.appendFileSync(path.join(data,'postgresql.conf'),`\nlisten_addresses = ''\nunix_socket_directories = '${socket}'\nunix_socket_permissions = 0700\nport = 6543\nmax_connections = 16\nshared_buffers = '16MB'\ntimezone = 'UTC'\nlog_statement = 'none'\n`);
  run('PG_START',path.join(PG,'pg_ctl'),['-D',data,'-l',path.join(directory,'postgres.log'),'-w','-t','20','start'],30000);
  started=true;stopped='PENDING';
  console.log('DATABASE_SCOPE=NEW_PRIVATE_UNIX_SOCKET_CLUSTER_WITH_SYNTHETIC_DATA');
  const result=path.join(directory,'result.json');
  const cfg=put('config.json',JSON.stringify({root:ROOT,directory,data,socket,password,component,ddl,schema,mapping,baseline,candidate,result}));
  const execution=run('HTTP_POSTGRES_TESTS',process.execPath,['--experimental-vm-modules',worker,cfg],60000,[0,1]);
  report=JSON.parse(bytes(result));
  check(Array.isArray(report.checks)&&report.tests===report.checks.length&&
    report.pass===report.checks.filter(x=>x.pass).length,'Malformed qualification result');
  check(Array.isArray(report.controls),'Missing baseline controls');
  console.log('BASELINE_CONTROLS='+JSON.stringify(report.controls));
  console.log('HTTP_TRANSACTION_RESULT='+JSON.stringify({tests:report.tests,pass:report.pass,failed:report.checks.filter(x=>!x.pass)}));
  check(execution.status===0&&report.controls.length===2&&report.controls.every(x=>x.pass)&&report.tests===30&&report.pass===30,'HTTP transaction qualification failed');
  status='WEBHOOK_TRANSACTION_CANDIDATE_QUALIFIED_IN_ISOLATION';
}catch(error){console.log('REASON='+error.message);process.exitCode=2;}
finally{
  if(data&&(started||fs.existsSync(path.join(data,'postmaster.pid')))){
    try{
      run('PG_STOP',path.join(PG,'pg_ctl'),['-D',data,'-m','fast','-w','-t','20','stop'],30000);
      run('PG_STOP_VERIFY',path.join(PG,'pg_ctl'),['-D',data,'status'],10000,[3]);stopped='PASS';
    }catch(error){stopped='FAILED';status='STOPPED';process.exitCode=2;console.log('CLEANUP_ERROR='+error.message+'\nCLEANUP_DATA_DIRECTORY='+data);}
  }
  if(before){try{
    const after=state();check(after===before,'Checkout changed during qualification');
    if(directory)put('state.after.json',after);console.log('TRACKED_SOURCE_AND_PACKAGE_FILES_PRESERVATION=PASS');
  }catch(error){status='STOPPED';process.exitCode=2;console.log('PRESERVATION_ERROR='+error.message);}}
  if(interrupted){status='STOPPED';process.exitCode=2;}
  if(directory)put('summary.json',JSON.stringify({command:'MMHB-WEBHOOK-TRANSACTION-20260924-23',
    status,tests:report?.tests,pass:report?.pass,disposableDatabaseStopped:stopped,sourceWrites:0,
    candidateRouteTested:!!report?.tests,liveRouteChanged:false,dispatcherImplemented:false,releaseQualified:false},null,2));
  console.log('STATUS='+status+'\nDISPOSABLE_DATABASE_STOPPED='+stopped);
  console.log('SOURCE_WRITES_BY_COMMAND=0\nLIVE_DATABASE_CONNECTIONS=0\nLIVE_DATABASE_MIGRATIONS=0\nREAL_EMAILS_SENT=0');
  console.log('LIVE_WEBHOOK_REPLACEMENT=NOT_RUN\nDELIVERY_WORKER=PENDING\nFULL_APP_TESTS=NOT_RUN');
  console.log('COMMIT=NOT_RUN\nPUSH=NOT_RUN\nDEPLOY=NOT_RUN\nRELEASE_QUALIFIED=false');
  if(directory)console.log('EVIDENCE_DIRECTORY='+directory);
  console.log('NEXT_ACTION=RETURN_FULL_OUTPUT\nREPORT_END=MMHB-WEBHOOK-TRANSACTION-20260924-23');
}
MMHB23_NODE
)
