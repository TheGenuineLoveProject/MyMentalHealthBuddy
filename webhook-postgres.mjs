import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import vm from 'node:vm';
import {createRequire} from 'node:module';

// The real route, schema, mapping, ORM and PostgreSQL run here. External billing,
// email, metrics and alert services are fixtures. The full app is not started.
const cfg = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
assert.ok(['baseline','candidate'].includes(cfg.mode));
assert.ok(path.isAbsolute(cfg.socket) && cfg.socket.startsWith(cfg.directory + path.sep));
assert.ok(/^[a-f0-9]{64}$/.test(cfg.password));
const req = createRequire(path.join(cfg.root,'package.json'));
const express = req('express');
const StripeModule = req('stripe');
const Stripe = StripeModule.default || StripeModule.Stripe || StripeModule;
const {Pool} = req('pg');
const orm = req('drizzle-orm');
const pgcore = req('drizzle-orm/pg-core');
const {drizzle} = req('drizzle-orm/node-postgres');
const database = 'mmhb_' + cfg.mode;
const role = database + '_app';
const connection = {host:cfg.socket,port:6543,ssl:false,password:cfg.password,
  connectionTimeoutMillis:4000,idleTimeoutMillis:1000,statement_timeout:5000};
const bootstrap = new Pool({...connection,user:'mmhb_owner',database:'postgres',max:1});
let admin, appPool;
const checks = [], observations = [], findings = new Set();
const state = {emails:0,sqlstates:[],hook:null};
const email = 'synthetic@example.invalid';
const secret = 'whsec_MMHB_ISOLATED_SYNTHETIC_ONLY';
const fakeEnv = {STRIPE_SECRET_KEY:'sk_test_MMHB_ISOLATED_SYNTHETIC_ONLY',
  STRIPE_WEBHOOK_SECRET:secret,STRIPE_PRICE_PRO:'price_mmhh_fixture_pro'};
const sdk = new Stripe(fakeEnv.STRIPE_SECRET_KEY,{apiVersion:'2024-06-20'});
const context = vm.createContext({Buffer,process:{env:fakeEnv}});

function synthetic(exports,name) {
  return new vm.SyntheticModule(Object.keys(exports),function () {
    for (const [key,value] of Object.entries(exports)) this.setExport(key,value);
  },{context,identifier:name});
}
async function evaluate(filename,dependencies) {
  const mod = new vm.SourceTextModule(fs.readFileSync(filename,'utf8'),{context,identifier:filename});
  const cache = new Map();
  await mod.link(specifier => {
    assert.ok(Object.hasOwn(dependencies,specifier),'Unreviewed import: '+specifier);
    if (!cache.has(specifier)) cache.set(specifier,synthetic(dependencies[specifier],specifier));
    return cache.get(specifier);
  });
  await mod.evaluate({timeout:5000});
  return mod.namespace;
}

async function fixture(db,schema,mapping) {
  class OfflineStripe {
    constructor() {
      this.webhooks = {constructEvent(body,signature,suppliedSecret) {
        assert.ok(Buffer.isBuffer(body),'The real router must receive raw bytes');
        return sdk.webhooks.constructEvent(body,signature,suppliedSecret);
      }};
      this.checkout = {sessions:{async retrieve(id) {
        if (state.hook) await state.hook();
        return {id,line_items:{data:[{price:{id:fakeEnv.STRIPE_PRICE_PRO}}]}};
      }}};
    }
  }
  const route = await evaluate(cfg.route,{
    express:{Router:express.Router,default:express},stripe:{default:OfflineStripe},
    '../db/client.mjs':{db},'../../shared/schema.mjs':schema,'drizzle-orm':orm,
    '../utils/logger.mjs':{logger:{info(){},warn(){},error(){}}},
    '../utils/metrics.mjs':{increment(){}},
    '../services/email.mjs':{
      async sendUpgradeConfirmation(){state.emails++;},
      async sendCancellationAcknowledgment(){state.emails++;}},
    '../observability/safetyAlerts.mjs':{async alertWebhookSignatureFailure(){}},
    '../utils/planMapping.mjs':mapping,
  });
  const app = express();
  app.use('/api/webhooks',route.default);
  app.use(express.json());
  app.use((_error,_req,res,_next) => res.status(500).json({error:'Fixture middleware error'}));
  const server = http.createServer(app);
  server.requestTimeout = 5000;
  server.headersTimeout = 5000;
  try {
    await new Promise((resolve,reject) => {
      server.once('error',reject);
      server.listen(0,'127.0.0.1',resolve);
    });
  } catch (error) {server.close();throw error;}
  async function request(event,badSignature=false) {
    const body = Buffer.from(JSON.stringify(event));
    const signature = badSignature ? 'invalid' : sdk.webhooks.generateTestHeaderString({
      payload:body.toString(),secret,timestamp:Math.floor(Date.now()/1000)});
    return new Promise((resolve,reject) => {
      const request = http.request({hostname:'127.0.0.1',port:server.address().port,
        method:'POST',path:'/api/webhooks/stripe',agent:false,
        headers:{'content-type':'application/json','content-length':body.length,'stripe-signature':signature}},response => {
        const chunks=[];let bytes=0;
        response.on('data',part=>{bytes+=part.length;if(bytes>65536)response.destroy(new Error('Response too large'));else chunks.push(part);});
        response.once('error',reject);
        response.once('end',()=>{
          const text=Buffer.concat(chunks).toString();
          try {resolve({status:response.statusCode,body:/application\/json/.test(response.headers['content-type']||'')?JSON.parse(text):text});}
          catch(error){reject(error);}
        });
      });
      request.setTimeout(7000,()=>request.destroy(new Error('HTTP fixture timeout')));
      request.once('error',reject);request.end(body);
    });
  }
  return {request,close:()=>new Promise(resolve=>{server.close(resolve);server.closeAllConnections();})};
}

function event(id) {
  return {id,object:'event',type:'checkout.session.completed',data:{object:{
    id:'cs_mmhh_fixture',customer:'cus_mmhh_fixture',subscription:'sub_mmhh_fixture',
    customer_details:{email,name:'Synthetic User'}}}};
}
async function reset() {
  state.emails=0;state.sqlstates=[];state.hook=null;
  await admin.query(`GRANT SELECT, INSERT ON webhook_events TO ${role}; GRANT SELECT, UPDATE ON users TO ${role}; TRUNCATE webhook_events, users`);
  await admin.query('INSERT INTO users(id,email,name) VALUES ($1,$2,$3)',[
    '11111111-1111-4111-8111-111111111111',email,'Synthetic User']);
}
async function observe(label,response) {
  const {rows:[row]} = await admin.query("SELECT (SELECT count(*)::int FROM webhook_events) AS markers, (SELECT subscription_status FROM users LIMIT 1) AS plan");
  const value={label,status:response.status,...row,emails:state.emails,sqlstates:[...state.sqlstates]};
  observations.push(value);return value;
}
async function run(name,body,db,schema,mapping) {
  let f;
  try {
    await reset();f=await fixture(db,schema,mapping);
    await body(f);
    checks.push({name,pass:true});
  } catch(error) {
    checks.push({name,pass:false,error:String(error.message).slice(0,1000)});
  } finally {if(f)await f.close();}
}

try {
  const {rows:[identity]}=await bootstrap.query("SELECT current_setting('data_directory') AS directory, current_setting('listen_addresses') AS listen, inet_server_addr() AS address, current_user AS owner");
  assert.equal(fs.realpathSync(identity.directory),fs.realpathSync(cfg.data));
  assert.equal(identity.listen,'');assert.equal(identity.address,null);assert.equal(identity.owner,'mmhb_owner');
  await bootstrap.query(`CREATE DATABASE ${database}`);
  await bootstrap.query(`CREATE ROLE ${role} LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE PASSWORD '${cfg.password}'`);
  admin=new Pool({...connection,user:'mmhb_owner',database,max:2});
  await admin.query(`
    CREATE TABLE users(id uuid PRIMARY KEY,email varchar(255) NOT NULL UNIQUE,name varchar(255) NOT NULL,
      stripe_customer_id text,subscription_status text DEFAULT 'free',subscription_expires_at timestamp,
      updated_at timestamp NOT NULL DEFAULT now());
    CREATE TABLE webhook_events(id text PRIMARY KEY,event_type varchar(100) NOT NULL,
      status varchar(50) NOT NULL DEFAULT 'processed',processed_at timestamptz NOT NULL DEFAULT now());
    GRANT CONNECT ON DATABASE ${database} TO ${role}; GRANT USAGE ON SCHEMA public TO ${role};
  `);
  appPool=new Pool({...connection,user:role,database,max:4});
  const rawQuery=appPool.query.bind(appPool);
  appPool.query=(...args)=>{
    const result=rawQuery(...args);
    return result?.catch ? result.catch(error=>{state.sqlstates.push(error.code||'UNKNOWN');throw error;}) : result;
  };
  const {rows:[appIdentity]}=await appPool.query('SELECT current_user AS name, rolsuper FROM pg_roles WHERE rolname=current_user');
  assert.equal(appIdentity.name,role);assert.equal(appIdentity.rolsuper,false);
  const schema=await evaluate(cfg.schema,{'drizzle-orm':orm,'drizzle-orm/pg-core':pgcore});
  const mapping=await evaluate(cfg.mapping,{});
  const db=drizzle(appPool,{schema});
  const test=(name,body)=>run(name,body,db,schema,mapping);

  await test('successful_delivery',async f=>{
    const r=await f.request(event('evt_success'));const s=await observe('success',r);
    assert.equal(r.status,200);assert.equal(s.markers,1);assert.equal(s.plan,'pro');assert.equal(s.emails,1);
  });
  await test('durable_duplicate',async f=>{
    assert.equal((await f.request(event('evt_duplicate'))).status,200);
    const r=await f.request(event('evt_duplicate'));const s=await observe('duplicate',r);
    assert.equal(r.status,200);assert.equal(r.body.duplicate,true);assert.equal(s.markers,1);assert.equal(s.emails,1);
  });
  await test('invalid_signature',async f=>{
    const r=await f.request(event('evt_signature'),true);const s=await observe('invalid_signature',r);
    assert.equal(r.status,400);assert.equal(s.markers,0);assert.equal(s.plan,'free');assert.equal(s.emails,0);
  });
  await test('durability_read_failure',async f=>{
    await admin.query(`REVOKE SELECT ON webhook_events FROM ${role}`);
    const r=await f.request(event('evt_read_failure'));const s=await observe('read_failure',r);
    assert.ok(s.sqlstates.includes('42501'),'PostgreSQL permission failure was not observed');
    assert.equal(r.status,500);assert.equal(r.body.error,'Webhook handler failed');
    assert.equal(s.markers,0);assert.equal(s.plan,'free');assert.equal(s.emails,0);
  });
  await test('durability_write_failure',async f=>{
    await admin.query(`REVOKE INSERT ON webhook_events FROM ${role}`);
    const r=await f.request(event('evt_write_failure'));const s=await observe('write_failure',r);
    assert.ok(s.sqlstates.includes('42501'));assert.equal(r.status,500);
    assert.equal(r.body.error,'Webhook handler failed');assert.equal(s.markers,0);
    await admin.query(`GRANT INSERT ON webhook_events TO ${role}`);
    const retry=await f.request(event('evt_write_failure'));const replay=await observe('write_failure_retry',retry);
    assert.equal(retry.status,200);assert.equal(replay.markers,1);
    if(replay.emails>1)findings.add('EMAIL_REPLAY_AFTER_MARKER_FAILURE');
  });
  await test('user_update_failure',async f=>{
    await admin.query(`REVOKE UPDATE ON users FROM ${role}`);
    const r=await f.request(event('evt_update_failure'));const s=await observe('update_failure',r);
    assert.ok(s.sqlstates.includes('42501'));assert.equal(r.status,500);assert.equal(s.markers,0);
    assert.equal(s.plan,'free');assert.equal(s.emails,0);
  });
  await test('marker_unique_conflict',async f=>{
    state.hook=async()=>{state.hook=null;await admin.query("INSERT INTO webhook_events(id,event_type) VALUES('evt_conflict','checkout.session.completed')");};
    const r=await f.request(event('evt_conflict'));const s=await observe('unique_conflict',r);
    assert.ok(s.sqlstates.includes('23505'));assert.equal(r.status,500);assert.equal(s.markers,1);
    const retry=await f.request(event('evt_conflict'));const after=await observe('unique_conflict_retry',retry);
    assert.equal(retry.status,200);assert.equal(retry.body.duplicate,true);assert.equal(after.emails,s.emails);
  });

  // Controlled concurrency experiment: both actual DB reads finish before the
  // synthetic Stripe retrievals are released. Do not count duplicate effects as
  // a passing idempotency guarantee. Record them as release-blocking findings.
  if(checks.every(x=>x.pass)) {
    let f,timer;
    try {
      await reset();f=await fixture(db,schema,mapping);
      let arrivals=0,release,rejectBarrier;
      const barrier=new Promise((resolve,reject)=>{release=resolve;rejectBarrier=reject;});
      state.hook=async()=>{
        arrivals++;
        if(arrivals===1)timer=setTimeout(()=>rejectBarrier(new Error('Concurrency barrier timeout')),2500);
        if(arrivals===2){clearTimeout(timer);release();}
        await barrier;
      };
      const replies=await Promise.all([f.request(event('evt_concurrent')),f.request(event('evt_concurrent'))]);
      const snapshot=await observe('concurrent_delivery',{status:replies.map(r=>r.status).sort()});
      assert.equal(arrivals,2);assert.equal(snapshot.markers,1);
      assert.deepEqual(snapshot.status,[200,500]);
      if(snapshot.emails>1)findings.add('CONCURRENT_DELIVERY_REPEATS_EMAIL');
    } catch(error){checks.push({name:'concurrency_experiment_integrity',pass:false,error:error.message});}
    finally{clearTimeout(timer);if(f)await f.close();}
  }
} catch(error) {
  checks.push({name:'harness_setup',pass:false,error:String(error.message).slice(0,1000)});
} finally {
  for(const pool of [appPool,admin,bootstrap])if(pool)await pool.end();
  const result={mode:cfg.mode,tests:checks.length,pass:checks.filter(x=>x.pass).length,
    fail:checks.filter(x=>!x.pass).length,failed:checks.filter(x=>!x.pass).map(x=>x.name),
    checks,observations,releaseBlockingFindings:[...findings],
    scope:'REAL_POSTGRES_ORM_SCHEMA_MAPPING_AND_ROUTE_WITH_SYNTHETIC_EXTERNAL_SERVICES'};
  fs.writeFileSync(cfg.result,JSON.stringify(result,null,2)+'\n',{flag:'wx',mode:0o600});
  console.log('POSTGRES_HTTP_RESULT='+JSON.stringify(result));
  process.exitCode=result.fail?1:0;
}
