(
set -eu
umask 077
cd /home/runner/workspace
node --input-type=commonjs <<'MMHB29_NODE'
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {spawnSync}=require('node:child_process');
const ROOT='/home/runner/workspace';
const PREVIOUS='/home/runner/mmhb-pipeline-qualify.zVPMvv';
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

function workerFactory() {
  const fault=code=>Object.assign(Error('Billing worker: '+code),{code});
  const check=(ok,code)=>{if(!ok)throw fault(code);};
  function createBillingNotificationWorker({pool,connectTransport,renderNotification,prepareDelivery,dispatchOne,
    onReport=()=>{},intervalMs=15000,prepareLimit=10,dispatchLimit=5,schedule=setTimeout,cancel=clearTimeout}={}) {
    check(pool&&typeof pool.query==='function'&&typeof pool.connect==='function','invalid_pool');
    for(const fn of [connectTransport,renderNotification,prepareDelivery,dispatchOne,onReport,schedule,cancel])check(typeof fn==='function','missing_dependency');
    for(const [value,min,max]of [[intervalMs,100,300000],[prepareLimit,1,100],[dispatchLimit,1,100]])
      check(Number.isSafeInteger(value)&&value>=min&&value<=max,'invalid_bound');
    const table='public.billing_notification_deliveries',intents='public.billing_notification_intents';
    const missing=`NOT EXISTS(SELECT 1 FROM ${table} d WHERE d.event_id=i.event_id AND d.kind=i.kind AND d.user_id=i.user_id)`;
    const tuple=row=>[row.event_id,row.kind,row.user_id];
    let closed=false,running=false,timer=null,active=null,closing=null,connectorController=null,cursor=null,ceiling=null;
    const blank=()=>({status:'ok',stage:'complete',counts:{scanned:0,prepared:0,renderFailed:0,accepted:0,retry:0,manual:0,stale:0,idle:0},backlog:null});
    function publish(report) {
      Object.freeze(report.counts);if(report.backlog)Object.freeze(report.backlog);Object.freeze(report);
      try{Promise.resolve(onReport(report)).catch(()=>{});}catch{}
      return report;
    }
    async function cycle() {
      const report=blank();let transport;
      try {
        if(closed){report.status='stopped';return publish(report);}
        report.stage='transport';connectorController=new AbortController();
        let connected;
        try{connected=await connectTransport({signal:connectorController.signal});}
        finally{connectorController=null;}
        if(closed){report.status='stopped';return publish(report);}
        check(connected&&typeof connected.fromEmail==='string'&&connected.fromEmail.length>0&&
          typeof connected.providerScope==='string'&&/^[a-f0-9]{64}$/.test(connected.providerScope)&&typeof connected.send==='function','invalid_transport');
        transport=Object.freeze({fromEmail:connected.fromEmail,providerScope:connected.providerScope,send:connected.send});
        report.stage='scan';
        // Each sweep uses its initial upper tuple; new larger keys wait for the next sweep.
        if(!ceiling) {
          const top=await pool.query(`SELECT i.event_id,i.kind,i.user_id FROM ${intents} i WHERE ${missing}
            ORDER BY i.event_id DESC,i.kind DESC,i.user_id DESC LIMIT 1`);
          ceiling=top.rows.length?tuple(top.rows[0]):null;cursor=null;
        }
        if(closed){report.status='stopped';return publish(report);}
        if(ceiling) {
          const selected=await pool.query(`SELECT i.event_id,i.kind,i.user_id,i.payload FROM ${intents} i WHERE ${missing}
            AND ($1::text IS NULL OR (i.event_id,i.kind,i.user_id)>($1::text,$2::text,$3::uuid))
            AND (i.event_id,i.kind,i.user_id)<=($4::text,$5::text,$6::uuid)
            ORDER BY i.event_id,i.kind,i.user_id LIMIT $7`,[...(cursor||[null,null,null]),...ceiling,prepareLimit]);
          for(const row of selected.rows) {
            if(closed)break;
            cursor=tuple(row);report.counts.scanned++;report.stage='prepare';
            let body;
            try{body=renderNotification({kind:row.kind,payload:row.payload},transport.fromEmail);}
            catch{report.counts.renderFailed++;continue;}
            if(closed)break;
            const result=await prepareDelivery(pool,{eventId:row.event_id,kind:row.kind,userId:row.user_id},body,transport.providerScope);
            check(result&&typeof result.created==='boolean','invalid_preparation_result');
            if(result.created)report.counts.prepared++;
          }
          if(!closed&&selected.rows.length<prepareLimit){cursor=null;ceiling=null;}
        }
        for(let index=0;index<dispatchLimit&&!closed;index++) {
          report.stage='dispatch';
          const result=await dispatchOne(pool,transport.send,transport.providerScope);
          check(result&&['accepted','retry','manual','stale','idle'].includes(result.status),'invalid_dispatch_result');
          report.counts[result.status]++;if(result.status==='idle')break;
        }
        if(closed){report.status='stopped';return publish(report);}
        report.stage='backlog';
        const totals=(await pool.query(`SELECT (SELECT count(*) FROM ${intents} i WHERE ${missing}) AS unprepared,
          count(*) FILTER(WHERE status='pending') AS pending,count(*) FILTER(WHERE status='retry') AS retry,
          count(*) FILTER(WHERE status='sending') AS sending,count(*) FILTER(WHERE status='manual') AS manual,
          count(*) FILTER(WHERE status IN ('pending','retry','sending') AND provider_scope<>$1) AS scope_mismatch
          FROM ${table}`,[transport.providerScope])).rows[0];
        const backlog={};
        for(const [key,column]of [['unprepared','unprepared'],['pending','pending'],['retry','retry'],['sending','sending'],['manual','manual'],['scopeMismatch','scope_mismatch']]) {
          const value=Number(totals?.[column]);check(Number.isSafeInteger(value)&&value>=0,'invalid_backlog_count');backlog[key]=value;
        }
        report.backlog=backlog;report.stage='complete';report.status=closed?'stopped':report.counts.renderFailed?'partial':'ok';
      }catch{report.status=closed?'stopped':'error';}
      return publish(report);
    }
    function runOnce() {
      if(closed)return Promise.resolve(Object.freeze({...blank(),status:'stopped',counts:Object.freeze(blank().counts)}));
      if(!active)active=Promise.resolve().then(cycle).finally(()=>{active=null;});
      return active;
    }
    function arm(delay) {
      try{timer=schedule(()=>{
        timer=null;if(closed||!running)return;
        return runOnce().then(report=>{if(running&&!closed)arm(intervalMs);return report;},()=>{
          const report=publish({...blank(),status:'error',stage:'scheduler'});if(running&&!closed)arm(intervalMs);return report;
        });
      },delay);}catch{
        running=false;publish({...blank(),status:'error',stage:'scheduler'});
      }
    }
    function start() {
      check(!closed,'worker_stopped');if(running)return false;
      running=true;arm(0);return running;
    }
    function stop() {
      if(closing)return closing;
      closed=true;running=false;
      if(timer!==null){try{cancel(timer);}catch{}timer=null;}
      connectorController?.abort();
      // Do not abort an in-flight provider request: await its persisted outcome before shutdown.
      closing=Promise.resolve(active).then(()=>Object.freeze({status:'stopped'}));return closing;
    }
    return Object.freeze({runOnce,start,stop});
  }
  return {createBillingNotificationWorker};
}

async function qualifyWorker() {
  const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
  const {createRequire}=require('node:module'),{pathToFileURL}=require('node:url');
  const cfg=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
  assert.ok(cfg.socket.startsWith(cfg.directory+path.sep));assert.match(cfg.password,/^[a-f0-9]{64}$/);
  const req=createRequire(path.join(cfg.root,'package.json')),{Pool}=req('pg'),{Resend}=req('resend');
  const {prepareDelivery,dispatchOne}=await import(pathToFileURL(cfg.delivery).href);
  const {connectBillingTransport}=await import(pathToFileURL(cfg.transport).href);
  const {renderBillingNotification}=await import(pathToFileURL(cfg.template).href);
  const {createBillingNotificationWorker}=await import(pathToFileURL(cfg.worker).href);
  const connection={host:cfg.socket,port:6543,password:cfg.password,ssl:false,connectionTimeoutMillis:4000,idleTimeoutMillis:1000,statement_timeout:7000};
  const owner=new Pool({...connection,user:'mmhb_owner',database:'postgres',max:2});let workerPool,active;
  const role='mmhb_scheduler_worker',table='public.billing_notification_deliveries';
  const uid='11111111-1111-4111-8111-111111111111',recipient='fixture@example.invalid';
  const host='connector.example.invalid',connectorURL='https://'+host+'/api/v2/connection?include_secrets=true&connector_names=resend';
  const checks=[],controls=[],originalFetch=globalThis.fetch,workers=new Set(),hash=x=>crypto.createHash('sha256').update(x).digest('hex');
  const defer=()=>{let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b;});return{promise,resolve,reject};};
  async function reached(promise,cycle){let timer;try{return await Promise.race([promise,cycle.then(report=>{throw Error('Worker finished before send: '+JSON.stringify(report));}),new Promise((_resolve,reject)=>{timer=setTimeout(()=>reject(Error('Worker did not reach provider fixture')),5000);})]);}finally{clearTimeout(timer);}}
  const saved=async(event='evt_worker_01')=>(await owner.query('SELECT * FROM '+table+' WHERE event_id=$1',[event])).rows[0];
  const due=()=>owner.query('UPDATE '+table+" SET next_attempt_at=clock_timestamp()-interval '1 second',lease_until=CASE WHEN status='sending' THEN clock_timestamp()-interval '1 second' ELSE lease_until END WHERE status IN ('retry','sending')");
  async function seed(event='evt_worker_01',payload={version:1,recipient,name:'Private Fixture',periodEnd:null}){
    await owner.query("INSERT INTO webhook_events(id,event_type)VALUES($1,'checkout.session.completed')",[event]);
    await owner.query("INSERT INTO billing_notification_intents(event_id,kind,user_id,payload)VALUES($1,'upgrade',$2,$3)",[event,uid,payload]);
  }
  const connect=options=>connectBillingTransport({hostname:host,replIdentity:'fixture_identity',fetchImpl:globalThis.fetch,Resend,...options});
  async function prepareDirect(transport,event='evt_worker_01'){
    const intent=(await workerPool.query('SELECT kind,payload FROM billing_notification_intents WHERE event_id=$1',[event])).rows[0];
    return prepareDelivery(workerPool,{eventId:event,kind:intent.kind,userId:uid},renderBillingNotification(intent,transport.fromEmail),transport.providerScope);
  }
  function clock(){
    let serial=0;const queued=new Map();
    return{schedule(fn,delay){const id=++serial;queued.set(id,{fn,delay});return id;},cancel(id){queued.delete(id);},
      take(){assert.equal(queued.size,1,'Scheduler must have exactly one pending timer');const [id,value]=queued.entries().next().value;queued.delete(id);return value;},
      get size(){return queued.size;}};
  }
  function worker(options={}){
    const timer=clock(),reports=[];let renders=0,prepares=0;
    const instance=createBillingNotificationWorker({pool:workerPool,connectTransport:connect,
      renderNotification(...args){renders++;return renderBillingNotification(...args);},
      prepareDelivery(...args){prepares++;return prepareDelivery(...args);},dispatchOne,
      onReport(report){reports.push(report);},intervalMs:100,prepareLimit:2,dispatchLimit:2,
      schedule:timer.schedule,cancel:timer.cancel,...options});
    workers.add(instance);return{instance,timer,reports,get renders(){return renders;},get prepares(){return prepares;}};
  }
  async function scheduledCycle(item){const timer=item.timer.take(),cycle=timer.fn();assert.ok(cycle&&typeof cycle.then==='function','Scheduled callback must return its cycle');return{delay:timer.delay,result:await cycle};}
  async function stopAll(){if(active?.releaseSend)active.releaseSend.resolve();for(const item of workers)await item.stop();workers.clear();}
  async function reset(){
    await stopAll();await owner.query('TRUNCATE '+table+',billing_notification_intents,webhook_events');
    active={key:'re_fixture_worker',from:'MMHB Fixture <billing@example.invalid>',calls:[],faults:[],cache:new Map(),accepted:0,connectorCalls:0,
      loseResponse:false,holdSend:false,entered:defer(),releaseSend:defer()};
  }
  globalThis.fetch=async(url,options={})=>{
    try{
      assert.ok(active,'Missing worker fixture');const target=typeof url==='string'?url:url.url||String(url);
      if(target===connectorURL){active.connectorCalls++;assert.equal(options.method,'GET');assert.equal(options.redirect,'error');
        assert.equal(new Headers(options.headers).get('X_REPLIT_TOKEN'),'repl fixture_identity');assert.ok(options.signal instanceof AbortSignal);
        return new Response(JSON.stringify({items:[{settings:{api_key:active.key,from_email:active.from}}]}),{status:200});}
      assert.equal(target,'https://api.resend.com/emails');assert.equal(options.method,'POST');assert.ok(options.signal instanceof AbortSignal);
      const headers=new Headers(options.headers),key=headers.get('Idempotency-Key'),raw=String(options.body),body=JSON.parse(raw);
      const row=(await owner.query('SELECT * FROM '+table+' WHERE idempotency_key=$1',[key])).rows[0];
      active.calls.push({key,raw});assert.ok(row,'Send preceded durable preparation');assert.equal(row.status,'sending');
      assert.deepEqual(body,JSON.parse(row.body_text));assert.equal(hash(row.body_text),row.request_sha256);assert.ok(row.first_attempt_at);assert.ok(row.lease_token);
      assert.equal(headers.get('Authorization'),'Bearer '+active.key);assert.equal(body.from,active.from);assert.equal(body.to,recipient);
      const cacheKey=headers.get('Authorization')+'|'+key;let accepted=active.cache.get(cacheKey);
      if(accepted)assert.equal(accepted.raw,raw,'Retry changed frozen request');
      else{accepted={raw,id:'email_fixture_'+(++active.accepted)};active.cache.set(cacheKey,accepted);}
      if(active.holdSend){active.entered.resolve();await active.releaseSend.promise;assert.equal(options.signal.aborted,false,'Graceful stop aborted accepted send');}
      if(active.loseResponse){active.loseResponse=false;throw Object.assign(Error('Fixture lost provider response'),{fixtureNetwork:true});}
      return new Response(JSON.stringify({id:accepted.id}),{status:200,headers:{'content-type':'application/json'}});
    }catch(error){if(!error.fixtureNetwork)active?.faults.push(String(error.message).slice(0,400));throw error;}
  };
  async function test(name,fn,control=false){
    try{await reset();await fn();assert.deepEqual(active.faults,[]);(control?controls:checks).push({name,pass:true});}
    catch(error){(control?controls:checks).push({name,pass:false,error:String(error.message).slice(0,700)});}
    finally{await stopAll();}
  }
  try{
    const identity=(await owner.query("SELECT current_setting('data_directory') AS data,current_setting('listen_addresses') AS listen,inet_server_addr() AS address,current_user AS owner")).rows[0];
    assert.equal(fs.realpathSync(identity.data),fs.realpathSync(cfg.data));assert.equal(identity.listen,'');assert.equal(identity.address,null);assert.equal(identity.owner,'mmhb_owner');
    await owner.query(`CREATE ROLE ${role} LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE PASSWORD '${cfg.password}';
      CREATE TABLE webhook_events(id text PRIMARY KEY,event_type varchar(100) NOT NULL,status varchar(50) NOT NULL DEFAULT 'processed',processed_at timestamptz NOT NULL DEFAULT now());
      GRANT USAGE ON SCHEMA public TO ${role}`);
    await owner.query(fs.readFileSync(cfg.intentsDDL,'utf8'));await owner.query(fs.readFileSync(cfg.deliveryDDL,'utf8'));
    await owner.query(`GRANT SELECT ON billing_notification_intents TO ${role};GRANT SELECT,INSERT,UPDATE ON ${table} TO ${role}`);
    workerPool=new Pool({...connection,user:role,database:'postgres',max:4});
    assert.equal((await workerPool.query('SELECT rolsuper FROM pg_roles WHERE rolname=current_user')).rows[0].rolsuper,false);
    await test('naive_rerender_blocks_frozen_retry',async()=>{
      await seed();const transport=await connect();await prepareDirect(transport);active.loseResponse=true;
      assert.equal((await dispatchOne(workerPool,transport.send,transport.providerScope)).status,'retry');const first=await saved();
      await owner.query("UPDATE billing_notification_intents SET payload=jsonb_set(payload,'{name}','\"Changed Fixture\"'::jsonb)");
      await assert.rejects(()=>prepareDirect(transport),/Prepared delivery is immutable/);
      assert.equal((await saved()).body_text,first.body_text);assert.equal((await saved()).status,'retry');assert.equal(active.calls.length,1);assert.equal(active.accepted,1);
    },true);
    assert.ok(controls.length===1&&controls[0].pass,'Naive orchestration control differs');
    await test('scheduled_cycle_delivers_committed_intent',async()=>{
      await seed();const item=worker();assert.equal(item.timer.size,0);assert.equal(active.connectorCalls,0);assert.equal(await saved(),undefined);
      item.instance.start();const first=await scheduledCycle(item);assert.equal(first.delay,0);assert.equal(first.result.status,'ok');
      assert.equal((await saved()).status,'accepted');assert.equal(active.accepted,1);assert.equal(item.renders,1);assert.equal(item.prepares,1);
      const next=await scheduledCycle(item);assert.equal(next.delay,100);assert.equal(next.result.status,'ok');assert.equal(active.calls.length,1);assert.equal(item.renders,1);
      await item.instance.stop();assert.equal(item.timer.size,0);
    });
    await test('bounded_scan_advances_past_invalid_intent',async()=>{
      await seed('evt_worker_00',{version:0,recipient,name:'Invalid Fixture',periodEnd:null});await seed('evt_worker_01');await seed('evt_worker_02');
      await seed('evt_worker_ready');await prepareDirect(await connect(),'evt_worker_ready');
      const item=worker({prepareLimit:1,dispatchLimit:1});
      const first=await item.instance.runOnce();assert.equal(first.status,'partial');assert.equal(first.counts.scanned,1);assert.equal(first.counts.renderFailed,1);
      assert.equal((await saved('evt_worker_ready')).status,'accepted');assert.equal(active.calls.length,1);
      await item.instance.runOnce();assert.equal((await saved('evt_worker_01')).status,'accepted');assert.equal(await saved('evt_worker_02'),undefined);
      await seed('evt_worker_000');
      const third=await item.instance.runOnce();assert.equal((await saved('evt_worker_02')).status,'accepted');assert.equal(await saved('evt_worker_00'),undefined);
      assert.equal(active.accepted,3);assert.equal(item.prepares,2);assert.equal(item.renders,3);assert.equal(third.backlog.unprepared,2);
      await item.instance.runOnce();await item.instance.runOnce();await item.instance.runOnce();
      assert.equal((await saved('evt_worker_000')).status,'accepted');assert.equal(active.accepted,4);assert.equal(item.prepares,3);assert.equal(item.renders,5);
    });
    await test('overlapping_cycles_share_one_active_operation',async()=>{
      await seed();active.holdSend=true;const item=worker({prepareLimit:1,dispatchLimit:1});
      const first=item.instance.runOnce(),second=item.instance.runOnce();assert.equal(first,second);
      await reached(active.entered.promise,first);assert.equal(active.calls.length,1);assert.equal(active.connectorCalls,1);assert.equal((await saved()).status,'sending');
      active.releaseSend.resolve();await first;assert.equal((await saved()).status,'accepted');assert.equal(active.accepted,1);assert.equal(item.renders,1);
    });
    await test('restarted_worker_dispatches_saved_request_without_rerender',async()=>{
      await seed();active.loseResponse=true;const first=worker({prepareLimit:1,dispatchLimit:1});await first.instance.runOnce();const frozen=await saved();
      assert.equal(frozen.status,'retry');await first.instance.stop();await owner.query("UPDATE billing_notification_intents SET payload=jsonb_set(payload,'{name}','\"Changed Fixture\"'::jsonb)");await due();
      const second=worker({prepareLimit:1,dispatchLimit:1});await second.instance.runOnce();
      assert.equal(second.renders,0);assert.equal(second.prepares,0);assert.equal((await saved()).status,'accepted');assert.equal((await saved()).body_text,frozen.body_text);
      assert.equal(active.calls.length,2);assert.equal(active.calls[0].raw,active.calls[1].raw);assert.equal(active.calls[0].key,active.calls[1].key);assert.equal(active.accepted,1);
    });
    await test('credential_rotation_reports_outstanding_frozen_scope',async()=>{
      await seed();const transport=await connect();await prepareDirect(transport);const frozen=await saved();active.key='re_fixture_rotated';
      const item=worker({prepareLimit:1,dispatchLimit:1});const report=await item.instance.runOnce();
      assert.equal(active.calls.length,0);assert.equal(item.renders,0);assert.equal(item.prepares,0);assert.equal((await saved()).status,'pending');
      assert.equal((await saved()).provider_scope,frozen.provider_scope);assert.equal((await saved()).body_text,frozen.body_text);assert.equal(report.backlog.scopeMismatch,1);
      const text=JSON.stringify(report);for(const secret of [active.key,recipient,'Private Fixture',frozen.body_text,frozen.provider_scope])assert.equal(text.includes(secret),false,'Report disclosed payload or credentials');
    });
    await test('stop_drains_current_send_and_prevents_next_delivery',async()=>{
      await seed('evt_worker_01');await seed('evt_worker_02');active.holdSend=true;const item=worker({prepareLimit:2,dispatchLimit:2});
      item.instance.start();const timer=item.timer.take(),cycle=timer.fn();assert.ok(cycle&&typeof cycle.then==='function');await reached(active.entered.promise,cycle);
      let stopped=false;const stopping=item.instance.stop().then(()=>{stopped=true;});await Promise.resolve();assert.equal(stopped,false);
      assert.equal(item.timer.size,0);active.releaseSend.resolve();await cycle;await stopping;
      assert.equal((await saved('evt_worker_01')).status,'accepted');assert.equal((await saved('evt_worker_02')).status,'pending');assert.equal(active.calls.length,1);
      assert.equal((await item.instance.runOnce()).status,'stopped');assert.equal(active.calls.length,1);assert.equal(item.timer.size,0);
    });
  }catch(error){checks.push({name:'setup_or_negative_control',pass:false,error:String(error.message).slice(0,700)});}
  finally{
    await stopAll();globalThis.fetch=originalFetch;for(const pool of [workerPool,owner])if(pool)await pool.end();
    const report={controls,tests:checks.length,pass:checks.filter(x=>x.pass).length,checks,
      scope:'ISOLATED_WORKER_SCHEDULER_WITH_REAL_POSTGRES_AND_RESEND_SDK',scheduler:'DETERMINISTIC_TIMER_CALLBACKS',externalServices:'MOCKED_FETCH',
      workerActivated:false,liveDatabaseConnections:0,realEmailsSent:0,releaseQualified:false};
    fs.writeFileSync(cfg.result,JSON.stringify(report,null,2),{flag:'wx',mode:0o600});console.log(JSON.stringify(report));
    process.exitCode=controls.length===1&&controls.every(x=>x.pass)&&checks.length===6&&checks.every(x=>x.pass)?0:1;
  }
}

try{
  console.log('COMMAND_ID=MMHB-WORKER-QUALIFICATION-20260924-29');
  check(JSON.parse(bytes(path.join(ROOT,'package.json'))).name==='mymentalhealthbuddy','Wrong project');
  check(!process.env.REPL_ID||process.env.REPL_ID==='9d71c4b8-8fcd-4b22-aee2-5883d9cbe5a4','Wrong Replit identity');
  check(git('rev-parse','--show-toplevel').trim()===ROOT,'Wrong repository root');
  before=state();const current=JSON.parse(before);
  check(current.head==='b3ce0daf53f52cab918dd0c40954f038ac68da9b'&&current.branch==='integration','Branch or HEAD changed');
  check(current.status===' M server/routes/webhook.mjs\n M server/services/email.mjs\n','Unexpected tracked changes');
  check(process.getuid()!==0,'Run as the regular Replit user');
  check(fs.lstatSync(PREVIOUS).isDirectory(),'Missing prior pipeline evidence');
  const prior=JSON.parse(bytes(path.join(PREVIOUS,'summary.json')));
  check(prior.command==='MMHB-PIPELINE-QUALIFICATION-20260924-28'&&
    prior.status==='COMBINED_BILLING_PIPELINE_QUALIFIED_IN_ISOLATION'&&prior.tests===12&&prior.pass===12&&
    prior.disposableDatabaseStopped==='PASS','Prior pipeline qualification differs');
  const priorState=JSON.parse(bytes(path.join(PREVIOUS,'state.after.json')));
  for(const key of ['head','branch','index','status','diff','package','lock'])check(current[key]===priorState[key],'Reviewed checkout changed: '+key);
  const pins={
    'server/routes/webhook.mjs':'5f09d685e57e53a79e959e650b8e2b6a60abda89e1b089e07ad6a16672095ba7',
    'server/services/email.mjs':'815fba3d724995e1f809f861be476b32facbad298b99bae1284bb225804929df',
    'shared/schema.mjs':'bcd740ef7e5ffcb76d41c375ad8018a1d620c9854a995e86cd3ee2236607efa9',
    'server/utils/planMapping.mjs':'a4990a99c8b8cd87c37a0348c5dcd5f61040c927c4db80c9bc76a3a8fda34f55'};
  for(const [rel,pin]of Object.entries(pins))check(hash(bytes(path.join(ROOT,rel)))===pin,'Source differs: '+rel);
  const versions={node:process.version};
  for(const [name,version]of [['pg','8.23.0'],['resend','6.24.0']]){
    versions[name]=JSON.parse(bytes(path.join(ROOT,'node_modules',name,'package.json'))).version;check(versions[name]===version,'Dependency changed: '+name);
  }
  console.log('DEPENDENCIES='+JSON.stringify(versions));
  for(const binary of ['initdb','pg_ctl','postgres'])fs.accessSync(path.join(PG,binary),fs.constants.X_OK);
  const space=fs.statfsSync('/home/runner');check(space.bavail*space.bsize>=536870912,'Need 512 MiB free for disposable database');
  const sources=[
    ['intentsDDL',PREVIOUS,'billing-notification-intents.sql','0abfb97fdb56428ceb0d7f02ecb951216c2eb61f356c8412b886f1fe1a27feea'],
    ['deliveryDDL',PREVIOUS,'billing-notification-deliveries.sql','49f51f3bcd963df35fa276b58d9e42ef04091976934b9a28a1bd119602551d9f'],
    ['delivery',PREVIOUS,'billingDelivery.mjs','39cee16ceae83013e500f10cbc3ccc9ccbfca8bd9f9ceafbdb5d2065c3d68f25'],
    ['transport',PREVIOUS,'billingEmailTransport.mjs','c4757e3c030600af8bf4bb6d7946fc85195541b38e5c0534b8ba5608ec1892d4'],
    ['template',PREVIOUS,'billingNotificationTemplate.mjs','cdb91217cea6ea6fb1bee2633a0f9b396d3d9a452acafd37a6d1491a37bd8e34']];
  const checked=sources.map(([key,parent,name,pin])=>{const b=bytes(path.join(parent,name));check(hash(b)===pin,'Qualified artifact changed: '+name);return{key,name,pin,b};});
  directory=fs.mkdtempSync('/home/runner/mmhb-worker-qualify.');console.log('EVIDENCE_DIRECTORY='+directory);put('state.before.json',before);
  const files={};for(const {key,name,pin,b}of checked){files[key]=put(name,b);check(hash(bytes(files[key]))===pin,'Copied artifact differs');}
  put('artifact-manifest.json',JSON.stringify(checked.map(({key,name,pin})=>({key,name,sha256:pin})),null,2));
  console.log('QUALIFIED_COMPONENT_COPIES=PASS_UNCHANGED');
  files.worker=put('billingNotificationWorker.mjs','export const {createBillingNotificationWorker}=('+workerFactory.toString()+')();\n');
  check(hash(bytes(files.worker))==='daac9fb0f94fa026a5567d22c3de74041cc1e3f793f44ce4edb0fe3476c2a940','Worker candidate differs');
  console.log('WORKER_SHA256='+hash(bytes(files.worker)));
  run('WORKER_SYNTAX',process.execPath,['--check',files.worker]);
  const harness=put('qualify.cjs','('+qualifyWorker.toString()+')().catch(e=>{console.error(e.message);process.exitCode=2;});\n');
  run('HARNESS_SYNTAX',process.execPath,['--check',harness]);
  data=path.join(directory,'data');const socket=path.join(directory,'socket');fs.mkdirSync(socket,{mode:0o700});
  const password=crypto.randomBytes(32).toString('hex'),pwfile=put('fixture-password',password+'\n');
  run('INITDB',path.join(PG,'initdb'),['-D',data,'-U','mmhb_owner','--auth-local=scram-sha-256',
    '--auth-host=reject','--pwfile='+pwfile,'--encoding=UTF8','--locale=C','--no-instructions']);
  fs.appendFileSync(path.join(data,'postgresql.conf'),`\nlisten_addresses = ''\nunix_socket_directories = '${socket}'\nunix_socket_permissions = 0700\nport = 6543\nmax_connections = 20\nshared_buffers = '16MB'\ntimezone = 'UTC'\nlog_statement = 'none'\n`);
  run('PG_START',path.join(PG,'pg_ctl'),['-D',data,'-l',path.join(directory,'postgres.log'),'-w','-t','20','start'],30000);
  started=true;stopped='PENDING';console.log('DATABASE_SCOPE=NEW_PRIVATE_UNIX_SOCKET_CLUSTER_WITH_SYNTHETIC_DATA');
  const result=path.join(directory,'result.json');
  const config=put('config.json',JSON.stringify({root:ROOT,directory,data,socket,password,...files,result}));
  const execution=run('WORKER_POSTGRES_TESTS',process.execPath,[harness,config],60000,[0,1]);
  report=JSON.parse(bytes(result));console.log('NEGATIVE_CONTROL='+JSON.stringify(report.controls));
  console.log('WORKER_RESULT='+JSON.stringify({tests:report.tests,pass:report.pass,failed:report.checks?.filter(x=>!x.pass)}));
  check(execution.status===0&&report.controls?.length===1&&report.controls.every(x=>x.pass===true)&&
    report.tests===6&&report.pass===6&&report.checks?.length===6&&report.checks.every(x=>x.pass===true),'Worker qualification failed');
  status='BILLING_WORKER_AND_SCHEDULER_QUALIFIED_IN_ISOLATION';
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
  if(directory)put('summary.json',JSON.stringify({command:'MMHB-WORKER-QUALIFICATION-20260924-29',status,
    tests:report?.tests,pass:report?.pass,disposableDatabaseStopped:stopped,sourceWrites:0,releaseQualified:false},null,2));
  console.log('STATUS='+status+'\nDISPOSABLE_DATABASE_STOPPED='+stopped+'\nSOURCE_WRITES_BY_COMMAND=0');
  console.log('LIVE_DATABASE_CONNECTIONS=0\nLIVE_DATABASE_MIGRATIONS=0\nREAL_CONNECTOR_CALLS=0\nREAL_EMAILS_SENT=0');
  console.log('WORKER_CANDIDATE='+(status==='BILLING_WORKER_AND_SCHEDULER_QUALIFIED_IN_ISOLATION'?'QUALIFIED_IN_ISOLATION':'NOT_QUALIFIED'));
  console.log('WORKER_ACTIVATION=NOT_RUN\nAPPLICATION_INTEGRATION=PENDING');
  console.log('FULL_APP_TESTS=NOT_RUN:ISOLATED_WORKER_ONLY\nCOMMIT=NOT_RUN\nPUSH=NOT_RUN\nDEPLOY=NOT_RUN\nRELEASE_QUALIFIED=false');
  if(directory)console.log('EVIDENCE_DIRECTORY='+directory);
  console.log('NEXT_ACTION=RETURN_FULL_OUTPUT\nREPORT_END=MMHB-WORKER-QUALIFICATION-20260924-29');
}
MMHB29_NODE
)
