(
set -eu
umask 077
cd /home/runner/workspace
node --input-type=commonjs <<'MMHB22_NODE'
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {spawnSync}=require('node:child_process');
const ROOT='/home/runner/workspace';
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

async function processBillingEvent(database, event, apply) {
  if (typeof event?.id !== 'string' || !event.id || typeof event.type !== 'string' || !event.type) {
    throw new Error('Invalid billing event identity');
  }
  return database.transaction(async tx => {
    const claim = await tx.insert(webhookEvents).values({
      id:event.id, eventType:event.type, status:'processed', processedAt:new Date(),
    }).onConflictDoNothing({target:webhookEvents.id}).returning({id:webhookEvents.id});
    if (!claim.length) {
      // A separate statement gets a fresh READ COMMITTED snapshot after waiting.
      const [saved] = await tx.select().from(webhookEvents).where(eq(webhookEvents.id,event.id));
      if (!saved || saved.status !== 'processed' || saved.eventType !== event.type) {
        throw new Error('Existing event is not confirmed complete with the same type');
      }
      return {duplicate:true,intents:0};
    }
    let intents = 0;
    // Callers must await enqueue and use tx for every associated database write.
    const enqueue = async ({kind,userId,recipient,name = '',periodEnd = null}) => {
      if (!['upgrade','cancellation'].includes(kind) || typeof userId !== 'string' || !userId ||
          typeof recipient !== 'string' || !recipient.trim() || recipient.length > 255 ||
          typeof name !== 'string' || name.length > 1000 ||
          (periodEnd !== null && (!Number.isSafeInteger(periodEnd) || periodEnd < 0))) {
        throw new Error('Invalid billing notification intent');
      }
      const payload = JSON.stringify({version:1,recipient,name,periodEnd});
      await tx.execute(sql`INSERT INTO public.billing_notification_intents
        (event_id,kind,user_id,payload) VALUES (${event.id},${kind},${userId}::uuid,${payload}::jsonb)`);
      intents++;
    };
    await apply(tx,enqueue);
    return {duplicate:false,intents};
  }, {isolationLevel:'read committed'});
}

async function qualify() {
  const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
  const assert = require('node:assert/strict'), {createRequire} = require('node:module');
  const cfg = JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
  assert.ok(cfg.socket.startsWith(cfg.directory+path.sep));
  assert.match(cfg.password,/^[a-f0-9]{64}$/);
  const req = createRequire(path.join(cfg.root,'package.json'));
  const {Pool} = req('pg'), orm = req('drizzle-orm'), pgcore = req('drizzle-orm/pg-core');
  const {drizzle} = req('drizzle-orm/node-postgres');
  const options = {host:cfg.socket,port:6543,password:cfg.password,ssl:false,
    connectionTimeoutMillis:4000,idleTimeoutMillis:1000,statement_timeout:7000};
  const owner = new Pool({...options,user:'mmhb_owner',database:'postgres',max:2});
  let appPool, checks = [], control;
  const role = 'mmhb_tx_app', uid = '11111111-1111-4111-8111-111111111111';
  const context = vm.createContext({Date});
  async function load(file,deps) {
    const mod = new vm.SourceTextModule(fs.readFileSync(file,'utf8'),{context});
    await mod.link(key => {
      assert.ok(Object.hasOwn(deps,key),'Unreviewed module import');
      return new vm.SyntheticModule(Object.keys(deps[key]),function(){
        for (const [k,v] of Object.entries(deps[key])) this.setExport(k,v);
      },{context});
    });
    await mod.evaluate(); return mod.namespace;
  }
  async function snapshot() {
    return (await owner.query(`SELECT
      (SELECT count(*)::int FROM webhook_events) AS markers,
      (SELECT count(*)::int FROM billing_notification_intents) AS intents,
      (SELECT subscription_status FROM users LIMIT 1) AS plan`)).rows[0];
  }
  async function reset() {
    await owner.query(`DROP TRIGGER IF EXISTS fail_intent_commit ON billing_notification_intents;
      GRANT SELECT, INSERT ON webhook_events TO ${role}; GRANT SELECT, UPDATE ON users TO ${role};
      GRANT SELECT, INSERT ON billing_notification_intents TO ${role};
      TRUNCATE billing_notification_intents,webhook_events,users`);
    await owner.query("INSERT INTO users(id,email,name) VALUES ($1,'fixture@example.invalid','Fixture User')",[uid]);
  }
  async function test(name,body) {
    try { await reset(); await body(); checks.push({name,pass:true}); }
    catch (error) { checks.push({name,pass:false,error:String(error.message).slice(0,500)}); }
  }
  function sqlstate(error) {
    for (let i = 0; error && i < 10; i++, error = error.cause) if (error.code) return error.code;
  }
  try {
    const identity = (await owner.query("SELECT current_setting('data_directory') AS data,current_setting('listen_addresses') AS listen,inet_server_addr() AS address,current_user AS owner")).rows[0];
    assert.equal(fs.realpathSync(identity.data),fs.realpathSync(cfg.data));
    assert.equal(identity.listen,''); assert.equal(identity.address,null); assert.equal(identity.owner,'mmhb_owner');
    await owner.query(`CREATE ROLE ${role} LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE PASSWORD '${cfg.password}';
      CREATE TABLE users(id uuid PRIMARY KEY,email varchar(255) NOT NULL UNIQUE,name varchar(255) NOT NULL,
        stripe_customer_id text,subscription_status text DEFAULT 'free',subscription_expires_at timestamp,
        updated_at timestamp NOT NULL DEFAULT now());
      CREATE TABLE webhook_events(id text PRIMARY KEY,event_type varchar(100) NOT NULL,
        status varchar(50) NOT NULL DEFAULT 'processed',processed_at timestamptz NOT NULL DEFAULT now());
      GRANT USAGE ON SCHEMA public TO ${role}`);
    await owner.query(fs.readFileSync(cfg.ddl,'utf8'));
    appPool = new Pool({...options,user:role,database:'postgres',max:4,application_name:'mmhb_tx_candidate'});
    assert.equal((await appPool.query('SELECT rolsuper FROM pg_roles WHERE rolname=current_user')).rows[0].rolsuper,false);
    const schema = await load(cfg.schema,{'drizzle-orm':orm,'drizzle-orm/pg-core':pgcore});
    const {processBillingEvent} = await load(cfg.component,{'drizzle-orm':orm,'../../shared/schema.mjs':schema});
    const db = drizzle(appPool,{schema});
    const event = id => ({id,type:'checkout.session.completed'});
    async function business(tx,enqueue) {
      const rows = await tx.update(schema.users).set({subscriptionStatus:'pro'})
        .where(orm.eq(schema.users.id,uid)).returning({id:schema.users.id,email:schema.users.email,name:schema.users.name});
      assert.equal(rows.length,1);
      await enqueue({kind:'upgrade',userId:rows[0].id,recipient:rows[0].email,name:rows[0].name});
    }
    const run = (id,apply = business) => processBillingEvent(db,event(id),apply);
    const empty = {markers:0,intents:0,plan:'free'}, complete = {markers:1,intents:1,plan:'pro'};
    // Negative control: demonstrate that autocommit leaves a partial user update.
    await reset(); await owner.query(`REVOKE INSERT ON billing_notification_intents FROM ${role}`);
    await appPool.query("UPDATE users SET subscription_status='pro' WHERE id=$1",[uid]);
    await assert.rejects(appPool.query("INSERT INTO billing_notification_intents(event_id,kind,user_id,payload) VALUES ('evt_control','upgrade',$1,'{}')",[uid]),e=>sqlstate(e)==='42501');
    assert.deepEqual(await snapshot(),{markers:0,intents:0,plan:'pro'});
    control = 'AUTOCOMMIT_PARTIAL_WRITE_REPRODUCED';
    await test('atomic_success',async()=>{
      const r = await run('evt_success'); assert.equal(r.duplicate,false); assert.equal(r.intents,1);
      assert.deepEqual(await snapshot(),complete);
      const payload = (await owner.query('SELECT payload FROM billing_notification_intents')).rows[0].payload;
      assert.deepEqual(payload,{version:1,recipient:'fixture@example.invalid',name:'Fixture User',periodEnd:null});
    });
    await test('sequential_replay',async()=>{
      await run('evt_replay'); const r = await run('evt_replay',()=>{throw Error('Duplicate invoked business callback');});
      assert.equal(r.duplicate,true); assert.deepEqual(await snapshot(),complete);
    });
    await test('independent_events',async()=>{
      await run('evt_one'); await run('evt_two'); assert.deepEqual(await snapshot(),{markers:2,intents:2,plan:'pro'});
    });
    await test('duplicate_intent_rolls_back',async()=>{
      await assert.rejects(run('evt_duplicate_intent',async(tx,enqueue)=>{
        await business(tx,enqueue);
        await enqueue({kind:'upgrade',userId:uid,recipient:'fixture@example.invalid',name:'Fixture User'});
      }),e=>sqlstate(e)==='23505');
      assert.deepEqual(await snapshot(),empty);
    });
    await test('cancellation_intent_payload',async()=>{
      const cancellation={id:'evt_cancel',type:'customer.subscription.deleted'};
      const r=await processBillingEvent(db,cancellation,async(tx,enqueue)=>{
        await tx.update(schema.users).set({subscriptionStatus:'free'}).where(orm.eq(schema.users.id,uid));
        await enqueue({kind:'cancellation',userId:uid,recipient:'fixture@example.invalid',name:'Fixture User',periodEnd:1800000000});
      });
      assert.equal(r.duplicate,false); assert.equal(r.intents,1);
      assert.deepEqual(await snapshot(),{markers:1,intents:1,plan:'free'});
      const row=(await owner.query('SELECT kind,payload FROM billing_notification_intents')).rows[0];
      assert.equal(row.kind,'cancellation');
      assert.deepEqual(row.payload,{version:1,recipient:'fixture@example.invalid',name:'Fixture User',periodEnd:1800000000});
    });
    for (const [label,table,privilege] of [['claim_insert','webhook_events','INSERT'],['claim_read','webhook_events','SELECT'],
      ['entitlement_update','users','UPDATE'],['intent_insert','billing_notification_intents','INSERT']]) {
      await test(label+'_failure_rolls_back',async()=>{
        await owner.query(`REVOKE ${privilege} ON ${table} FROM ${role}`);
        await assert.rejects(run('evt_denied'),e=>sqlstate(e)==='42501');
        assert.deepEqual(await snapshot(),empty);
      });
    }
    await test('callback_failure_rolls_back',async()=>{
      await assert.rejects(run('evt_callback',async(tx,enqueue)=>{await business(tx,enqueue);throw Error('fixture_abort');}),/fixture_abort/);
      assert.deepEqual(await snapshot(),empty);
    });
    await test('deferred_commit_failure_rolls_back',async()=>{
      await owner.query(`CREATE OR REPLACE FUNCTION reject_fixture_commit() RETURNS trigger LANGUAGE plpgsql AS $$
        BEGIN RAISE EXCEPTION 'fixture commit failure' USING ERRCODE='23514'; END $$;
        CREATE CONSTRAINT TRIGGER fail_intent_commit AFTER INSERT ON billing_notification_intents
        DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION reject_fixture_commit()`);
      await assert.rejects(run('evt_commit'),e=>sqlstate(e)==='23514');
      assert.deepEqual(await snapshot(),empty);
    });
    await test('historical_marker_does_not_create_intent',async()=>{
      await owner.query("INSERT INTO webhook_events(id,event_type) VALUES ('evt_history','checkout.session.completed')");
      const r = await run('evt_history',()=>{throw Error('Historical event was replayed');});
      assert.equal(r.duplicate,true); assert.deepEqual(await snapshot(),{markers:1,intents:0,plan:'free'});
    });
    for (const [label,type,status] of [['wrong_type','invoice.paid','processed'],['wrong_status','checkout.session.completed','processing']]) {
      await test('existing_marker_'+label,async()=>{
        await owner.query('INSERT INTO webhook_events(id,event_type,status) VALUES ($1,$2,$3)',['evt_conflict',type,status]);
        await assert.rejects(run('evt_conflict'),/not confirmed complete/);
        assert.deepEqual(await snapshot(),{markers:1,intents:0,plan:'free'});
      });
    }
    for (const rollback of [false,true]) {
      await test(rollback?'waiting_retry_after_winner_rollback':'concurrent_duplicate_after_winner_commit',async()=>{
        let release,entered,first,second;
        const hold = new Promise(r=>{release=r;}), ready = new Promise(r=>{entered=r;});
        const settle = p => p.then(value=>({value}),error=>({error}));
        try {
          first = settle(run('evt_race',async(tx,enqueue)=>{
            await business(tx,enqueue); entered(); await hold;
            if (rollback) throw Error('fixture_winner_rollback');
          }));
          let timer;
          try { await Promise.race([ready,new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('Winner did not reach barrier')),3000);})]); }
          finally { clearTimeout(timer); }
          second = settle(run('evt_race'));
          const deadline = Date.now()+3000; let waiting = false;
          while (Date.now()<deadline) {
            const count = (await owner.query("SELECT count(*)::int AS n FROM pg_stat_activity WHERE application_name='mmhb_tx_candidate' AND wait_event_type='Lock' AND cardinality(pg_blocking_pids(pid))>0")).rows[0].n;
            if (count) { waiting=true; break; }
            await new Promise(r=>setTimeout(r,25));
          }
          assert.ok(waiting,'Concurrent request was not observed waiting on the claim');
          assert.deepEqual(await snapshot(),empty,'Uncommitted changes escaped'); release();
          const [a,b] = await Promise.all([first,second]);
          if (rollback) { assert.match(a.error?.message || '',/fixture_winner_rollback/); assert.equal(b.value?.duplicate,false); }
          else { assert.equal(a.value?.duplicate,false); assert.equal(b.value?.duplicate,true); }
          assert.deepEqual(await snapshot(),complete);
        } finally { release(); await Promise.allSettled([first,second].filter(Boolean)); }
      });
    }
  } catch(error) { checks.push({name:'qualification_setup_or_control',pass:false,error:String(error.message).slice(0,500)}); }
  finally {
    for (const pool of [appPool,owner]) if (pool) await pool.end();
    const report = {control,tests:checks.length,pass:checks.filter(x=>x.pass).length,checks,
      scope:'ISOLATED_TRANSACTION_COMPONENT_WITH_REAL_POSTGRES_AND_DRIZZLE',routeIntegrated:false,releaseQualified:false};
    fs.writeFileSync(cfg.result,JSON.stringify(report,null,2),{flag:'wx',mode:0o600});
    console.log(JSON.stringify(report)); process.exitCode=checks.some(x=>!x.pass)?1:0;
  }
}

try{
  console.log('COMMAND_ID=MMHB-ATOMIC-BILLING-QUALIFICATION-20260924-22');
  check(JSON.parse(bytes(path.join(ROOT,'package.json'))).name==='mymentalhealthbuddy','Wrong project');
  check(!process.env.REPL_ID||process.env.REPL_ID==='9d71c4b8-8fcd-4b22-aee2-5883d9cbe5a4','Wrong Replit identity');
  check(git('rev-parse','--show-toplevel').trim()===ROOT,'Wrong repository root');
  before=state();const current=JSON.parse(before);
  check(current.head==='b3ce0daf53f52cab918dd0c40954f038ac68da9b'&&current.branch==='integration','Branch or HEAD changed');
  check(current.status===' M server/routes/webhook.mjs\n M server/services/email.mjs\n','Unexpected tracked changes');
  check(process.getuid()!==0,'Run as the regular Replit user');
  const pins={
    'server/routes/webhook.mjs':'5f09d685e57e53a79e959e650b8e2b6a60abda89e1b089e07ad6a16672095ba7',
    'server/services/email.mjs':'815fba3d724995e1f809f861be476b32facbad298b99bae1284bb225804929df',
    'shared/schema.mjs':'bcd740ef7e5ffcb76d41c375ad8018a1d620c9854a995e86cd3ee2236607efa9'};
  for(const [rel,pin]of Object.entries(pins))check(hash(bytes(path.join(ROOT,rel)))===pin,'Source differs: '+rel);
  const versions={node:process.version};
  for(const name of ['pg','drizzle-orm'])versions[name]=JSON.parse(bytes(path.join(ROOT,'node_modules',name,'package.json'))).version;
  check(versions.pg==='8.23.0'&&versions['drizzle-orm']==='0.45.2','Database dependencies changed');
  console.log('DEPENDENCIES='+JSON.stringify(versions));
  for(const binary of ['initdb','pg_ctl','postgres'])fs.accessSync(path.join(PG,binary),fs.constants.X_OK);
  const space=fs.statfsSync('/home/runner');check(space.bavail*space.bsize>=536870912,'Need 512 MiB free for disposable database');
  directory=fs.mkdtempSync('/home/runner/mmhb-atomic-billing.');
  console.log('EVIDENCE_DIRECTORY='+directory);put('state.before.json',before);
  const component=put('billingEventTransaction.mjs',
    'import {eq,sql} from "drizzle-orm";\nimport {webhookEvents} from "../../shared/schema.mjs";\nexport '+processBillingEvent.toString()+'\n');
  const ddl=put('billing-notification-intents.sql',`CREATE TABLE public.billing_notification_intents (
    event_id text NOT NULL REFERENCES public.webhook_events(id) ON DELETE RESTRICT,
    kind text NOT NULL CHECK(kind IN ('upgrade','cancellation')),
    user_id uuid NOT NULL,
    payload jsonb NOT NULL CHECK(jsonb_typeof(payload)='object'),
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY(event_id,kind,user_id)
  );\n`);
  const schema=put('schema.mjs',bytes(path.join(ROOT,'shared/schema.mjs')));
  const worker=put('qualify.cjs','('+qualify.toString()+')().catch(e=>{console.error(e.message);process.exitCode=2;});\n');
  run('COMPONENT_SYNTAX',process.execPath,['--check',component]);
  run('HARNESS_SYNTAX',process.execPath,['--check',worker]);
  console.log('COMPONENT_SHA256='+hash(bytes(component)));
  data=path.join(directory,'data');const socket=path.join(directory,'socket');fs.mkdirSync(socket,{mode:0o700});
  const password=crypto.randomBytes(32).toString('hex'),pwfile=put('fixture-password',password+'\n');
  run('INITDB',path.join(PG,'initdb'),['-D',data,'-U','mmhb_owner','--auth-local=scram-sha-256',
    '--auth-host=reject','--pwfile='+pwfile,'--encoding=UTF8','--locale=C','--no-instructions']);
  fs.appendFileSync(path.join(data,'postgresql.conf'),`\nlisten_addresses = ''\nunix_socket_directories = '${socket}'\nunix_socket_permissions = 0700\nport = 6543\nmax_connections = 16\nshared_buffers = '16MB'\ntimezone = 'UTC'\nlog_statement = 'none'\n`);
  run('PG_START',path.join(PG,'pg_ctl'),['-D',data,'-l',path.join(directory,'postgres.log'),'-w','-t','20','start'],30000);
  started=true;stopped='PENDING';
  console.log('DATABASE_SCOPE=NEW_PRIVATE_UNIX_SOCKET_CLUSTER_WITH_SYNTHETIC_DATA');
  const result=path.join(directory,'result.json');
  const cfg=put('config.json',JSON.stringify({root:ROOT,directory,data,socket,password,component,ddl,schema,result}));
  const execution=run('TRANSACTION_TESTS',process.execPath,['--experimental-vm-modules',worker,cfg],60000,[0,1]);
  report=JSON.parse(bytes(result));
  check(Array.isArray(report.checks)&&report.tests===report.checks.length&&
    report.pass===report.checks.filter(x=>x.pass).length,'Malformed qualification result');
  console.log('CONTROL='+report.control);
  console.log('TRANSACTION_RESULT='+JSON.stringify({tests:report.tests,pass:report.pass,failed:report.checks.filter(x=>!x.pass)}));
  check(execution.status===0&&report.control==='AUTOCOMMIT_PARTIAL_WRITE_REPRODUCED'&&report.tests===16&&report.pass===16,'Transaction qualification failed');
  status='TRANSACTION_COMPONENT_QUALIFIED_IN_ISOLATION';
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
  if(directory)put('summary.json',JSON.stringify({command:'MMHB-ATOMIC-BILLING-QUALIFICATION-20260924-22',
    status,tests:report?.tests,pass:report?.pass,disposableDatabaseStopped:stopped,sourceWrites:0,
    routeIntegrated:false,dispatcherImplemented:false,releaseQualified:false},null,2));
  console.log('STATUS='+status+'\nDISPOSABLE_DATABASE_STOPPED='+stopped);
  console.log('SOURCE_WRITES_BY_COMMAND=0\nLIVE_DATABASE_CONNECTIONS=0\nLIVE_DATABASE_MIGRATIONS=0\nREAL_EMAILS_SENT=0');
  console.log('WEBHOOK_INTEGRATION=PENDING\nDELIVERY_WORKER=PENDING\nFULL_APP_TESTS=NOT_RUN');
  console.log('COMMIT=NOT_RUN\nPUSH=NOT_RUN\nDEPLOY=NOT_RUN\nRELEASE_QUALIFIED=false');
  if(directory)console.log('EVIDENCE_DIRECTORY='+directory);
  console.log('NEXT_ACTION=RETURN_FULL_OUTPUT\nREPORT_END=MMHB-ATOMIC-BILLING-QUALIFICATION-20260924-22');
}
MMHB22_NODE
)
