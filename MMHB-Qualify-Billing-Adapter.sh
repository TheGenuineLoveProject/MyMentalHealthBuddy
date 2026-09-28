#!/usr/bin/env bash
(
set -euo pipefail
umask 077
cd /home/runner/workspace
node --input-type=commonjs <<'MMHB43_NODE'
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {spawnSync}=require('node:child_process');
const ROOT='/home/runner/workspace';
const PRIOR=ROOT+'/.git/mmhb-review-evidence/billing-application-FXVusv';
const ID='MMHB-BILLING-ADAPTER-QUALIFICATION-20260925-43';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const check=(ok,why)=>{if(!ok)throw Error(why);};
const env={PATH:process.env.PATH||'/usr/bin:/bin',LANG:'C.UTF-8',TZ:'UTC',CI:'true',NODE_ENV:'test',DATABASE_SSL:'false',
  GIT_OPTIONAL_LOCKS:'0',GIT_TERMINAL_PROMPT:'0',GIT_NO_LAZY_FETCH:'1'};
let data,socket,PG,report,buildReport,started=false,stopped='NOT_STARTED';
let directory,before,status='STOPPED',preserved=false,interrupted=false;
const inputs=new Map(),observed=new Map(),candidateFiles=new Map(),baselineFiles=new Map();
process.on('SIGINT',()=>{interrupted=true;});process.on('SIGTERM',()=>{interrupted=true;});
function git(...args){
  const r=spawnSync('git',['--no-pager','--no-optional-locks','-c','core.fsmonitor=false','-c','core.quotePath=true',...args],
    {cwd:ROOT,env,encoding:'utf8',timeout:30000,maxBuffer:33554432});
  check(!r.error&&r.status===0,'Git inspection failed: '+args[0]);return r.stdout;
}
function bytes(file){
  const s=fs.lstatSync(file);check(s.isFile()&&s.size<=4194304&&fs.realpathSync(file)===file,'Unsafe or oversized bounded input: '+file);
  const value=fs.readFileSync(file),sha256=hash(value);
  if(inputs.has(file))check(inputs.get(file)===sha256,'Input changed: '+file);else inputs.set(file,sha256);
  return value;
}
function observe(file,maxBytes=268435456){
  const value=hashSnapshotInput(file,maxBytes),old=observed.get(file);
  if(old)check(value.sha256===old.sha256&&value.bytes===old.bytes,'Observed input changed: '+file);else observed.set(file,value);
  return value;
}
function snapshot(){
  const index=path.resolve(ROOT,git('rev-parse','--git-path','index').trim());
  check(fs.lstatSync(index).isFile(),'Unexpected Git index');
  return {head:git('rev-parse','HEAD').trim(),branch:git('branch','--show-current').trim(),
    index:hash(fs.readFileSync(index)),tracked:git('status','--porcelain=v1','--untracked-files=no','--ignore-submodules=none'),
    diff:hash(git('diff','--binary','--no-ext-diff','--no-textconv','HEAD','--')),
    untrackedNames:hash(git('ls-files','--others','--exclude-standard','-z')),
    package:hash(bytes(path.join(ROOT,'package.json'))),lock:hash(bytes(path.join(ROOT,'package-lock.json')))};
}
function privateDirectory(dir){
  const s=fs.lstatSync(dir);check(s.isDirectory()&&s.uid===process.getuid()&&(s.mode&0o077)===0&&fs.realpathSync(dir)===dir,'Expected private owned directory: '+dir);
}
function put(rel,value){
  check(!path.isAbsolute(rel)&&!rel.split('/').includes('..'),'Unsafe output path');
  const file=path.join(directory,rel);fs.mkdirSync(path.dirname(file),{recursive:true,mode:0o700});
  fs.writeFileSync(file,value,{flag:'wx',mode:0o600});return file;
}
function run(label,command,args,timeout=45000,ok=[0],cleanup=false){
  check(cleanup||!interrupted,'Interrupted before '+label);
  console.log(label+'=RUNNING');
  const r=spawnSync(command,args,{cwd:directory,env,encoding:'utf8',timeout,killSignal:'SIGKILL',maxBuffer:8388608});
  put('logs/'+label+'.log',(r.stdout||'')+(r.stderr||'')+(r.error?'\n'+r.error.message:''));
  check(!r.error&&ok.includes(r.status),label+' failed; private log retained');return r;
}

const candidatePins={"server/billing/billingRuntime.mjs": "11899c03bd21bf40ee473bb7e910fe0ee74ea09f420efd21b9ca488ee889f055", "server/billing/createApplication.mjs": "c673230f78b22aaa4d55640f0c72e0c5a434f62655cd7e914a407e63bcfbee97", "server/billing/application.mjs": "63ca099e749e1501000288cc28d6507a125dcde805accee64d5f8e1272a0ae2f", "server/billing/billingShutdown.mjs": "7a1118cab260659e475f6d58fd9acb4cf32661ddaef5dede716f1bd967178aeb", "server/services/billingEventTransaction.mjs": "f8a9fce70124b55d5197cdfed53be393cbd098b80cafb607b352c4a101f9db60", "server/services/billingDelivery.mjs": "39cee16ceae83013e500f10cbc3ccc9ccbfca8bd9f9ceafbdb5d2065c3d68f25", "server/services/billingEmailTransport.mjs": "c4757e3c030600af8bf4bb6d7946fc85195541b38e5c0534b8ba5608ec1892d4", "server/services/billingNotificationTemplate.mjs": "cdb91217cea6ea6fb1bee2633a0f9b396d3d9a452acafd37a6d1491a37bd8e34", "server/services/billingNotificationWorker.mjs": "daac9fb0f94fa026a5567d22c3de74041cc1e3f793f44ce4edb0fe3476c2a940", "server/db/billingSchema.mjs": "a76caf2a49a63b9f0fece48c81eefd43c352b0b541ca856cff184e045f47cd13"};
const expectedCandidateFiles=["server/billing/billingRuntime.mjs", "server/billing/createApplication.mjs", "server/billing/application.mjs", "server/billing/billingShutdown.mjs", "server/services/billingEventTransaction.mjs", "server/services/billingDelivery.mjs", "server/services/billingEmailTransport.mjs", "server/services/billingNotificationTemplate.mjs", "server/services/billingNotificationWorker.mjs", "server/db/billingSchema.mjs", "server/db/billingSchemaContract.mjs", "server/app.mjs", "server/routes/webhook.mjs"];

const EXPECTED_TESTS=12,EXPECTED_CONTROLS=2;
const newSources={"billingUsersReadiness.mjs": "// Readiness for the existing users columns touched by the Stripe webhook.\n// This inspects catalogs and effective privileges; it never reads user records\n// or installs/changes database objects.\nexport async function verifyBillingUsersReadiness(pool) {\n  const fault=code=>Object.assign(Error('Billing users readiness: '+code),{code});\n  const check=(ok,code)=>{if(!ok)throw fault(code);};\n  check(pool&&typeof pool.connect==='function','invalid_pool');\n  const types=new Map([\n    ['id','uuid'],['email','character varying(255)'],['name','character varying(255)'],\n    ['stripe_customer_id','text'],['subscription_status','text'],\n    ['subscription_expires_at','timestamp without time zone'],['updated_at','timestamp without time zone'],\n  ]);\n  const selected=new Set(['id','email','name','stripe_customer_id']);\n  const updated=new Set(['stripe_customer_id','subscription_status','subscription_expires_at','updated_at']);\n  const client=await pool.connect();let began=false,discard;\n  try {\n    await client.query('BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY');began=true;\n    await client.query('SET LOCAL search_path = pg_catalog');\n    await client.query(\"SET LOCAL lock_timeout = '3s'\");\n    await client.query(\"SET LOCAL statement_timeout = '5s'\");\n    await client.query(\"SET LOCAL idle_in_transaction_session_timeout = '15s'\");\n    const result=await client.query(`SELECT c.relkind,c.relpersistence,c.relrowsecurity,c.relforcerowsecurity,c.relispartition,\n      a.attname,pg_catalog.format_type(a.atttypid,a.atttypmod) AS type,a.attgenerated,\n      pg_catalog.has_schema_privilege(current_user,n.oid,'USAGE') AS schema_usage,\n      pg_catalog.has_column_privilege(current_user,c.oid,a.attnum,'SELECT') AS can_select,\n      pg_catalog.has_column_privilege(current_user,c.oid,a.attnum,'UPDATE') AS can_update\n      FROM pg_catalog.pg_class c JOIN pg_catalog.pg_namespace n ON n.oid=c.relnamespace\n      JOIN pg_catalog.pg_attribute a ON a.attrelid=c.oid AND a.attnum>0 AND NOT a.attisdropped\n      WHERE n.nspname='public' AND c.relname='users' AND a.attname=ANY($1::text[])\n      ORDER BY a.attname LIMIT 8`,[[...types.keys()]]);\n    check(Array.isArray(result.rows)&&result.rows.length===types.size,'billing_users_schema_mismatch');\n    const seen=new Set();\n    for(const row of result.rows) {\n      check(types.has(row.attname)&&!seen.has(row.attname)&&row.type===types.get(row.attname)&&\n        row.relkind==='r'&&row.relpersistence==='p'&&row.relrowsecurity===false&&\n        row.relforcerowsecurity===false&&row.relispartition===false&&\n        (!updated.has(row.attname)||row.attgenerated===''),'billing_users_schema_mismatch');\n      check(row.schema_usage===true&&(!selected.has(row.attname)||row.can_select===true)&&\n        (!updated.has(row.attname)||row.can_update===true),'billing_users_permissions_missing');\n      seen.add(row.attname);\n    }\n    await client.query('COMMIT');began=false;\n    return Object.freeze({ok:true,status:'ready'});\n  } catch(error) {\n    if(began)try{await client.query('ROLLBACK');}catch(rollbackError){discard=rollbackError;}\n    throw error;\n  } finally {client.release(discard);}\n}\n", "createApplication.mjs": "import pg from 'pg';\nimport {drizzle} from 'drizzle-orm/node-postgres';\nimport {Resend} from 'resend';\nimport * as schema from '../../shared/schema.mjs';\nimport {getPostgresConnectionString,getPostgresSslConfig} from '../db/sslConfig.mjs';\nimport {createBillingSchemaManager} from '../db/billingSchema.mjs';\nimport {billingSchemaContract,billingMigrationSQL} from '../db/billingSchemaContract.mjs';\nimport {createBillingNotificationWorker} from '../services/billingNotificationWorker.mjs';\nimport {connectBillingTransport} from '../services/billingEmailTransport.mjs';\nimport {renderBillingNotification} from '../services/billingNotificationTemplate.mjs';\nimport {prepareDelivery,dispatchOne} from '../services/billingDelivery.mjs';\nimport {createBillingRuntime} from './billingRuntime.mjs';\nimport {verifyBillingUsersReadiness} from '../db/billingUsersReadiness.mjs';\n\nconst fault=code=>Object.assign(Error('Billing application: '+code),{code});\nconst check=(ok,code)=>{if(!ok)throw fault(code);};\nconst stateReport=state=>console.info('[billing-runtime]',JSON.stringify(state));\nconst cycleReport=report=>console.info('[billing-worker]',JSON.stringify(report));\n\nexport function createBillingApplication({env=process.env,poolFactory=config=>new pg.Pool(config),\n  workerOptions={},onState=stateReport}={}) {\n  check(env&&typeof env==='object'&&typeof onState==='function','invalid_configuration');\n  const activation=env.MMHB_BILLING_PIPELINE_ENABLED;\n  check(activation===undefined||activation===''||activation==='false'||activation==='true','invalid_activation_flag');\n  if(activation!=='true')return Object.freeze({db:null,runtime:createBillingRuntime({enabled:false,onState})});\n  check(typeof poolFactory==='function'&&workerOptions&&typeof workerOptions==='object'&&\n    !Array.isArray(workerOptions),'invalid_dependencies');\n  check(Object.keys(workerOptions).every(key=>['intervalMs','prepareLimit','dispatchLimit','onReport'].includes(key)),\n    'invalid_worker_option');\n  const options={intervalMs:15000,prepareLimit:10,dispatchLimit:5,onReport:cycleReport,...workerOptions};\n  for(const [value,min,max]of [[options.intervalMs,100,300000],[options.prepareLimit,1,100],[options.dispatchLimit,1,100]])\n    check(Number.isSafeInteger(value)&&value>=min&&value<=max,'invalid_worker_bound');\n  check(typeof options.onReport==='function','invalid_worker_reporter');\n  let connection;\n  try{connection=new URL(getPostgresConnectionString(env.DATABASE_URL));}catch{throw fault('invalid_database_url');}\n  check(['postgres:','postgresql:'].includes(connection.protocol)&&connection.hostname.length>0,'invalid_database_url');\n  // node-postgres parses URL query parameters into its client configuration.\n  // They must not replace this pipeline's explicit TLS and operation bounds.\n  const reserved=new Set(['ssl','options','statement_timeout','query_timeout','idle_in_transaction_session_timeout',\n    'connectiontimeoutmillis','connect_timeout','application_name']);\n  for(const key of [...connection.searchParams.keys()])if(reserved.has(key.toLowerCase()))connection.searchParams.delete(key);\n  const config={connectionString:connection.toString(),ssl:getPostgresSslConfig(env),max:3,\n    connectionTimeoutMillis:3000,idleTimeoutMillis:30000,statement_timeout:5000,query_timeout:12000,\n    idle_in_transaction_session_timeout:15000,options:'-c search_path=public,pg_catalog',application_name:'mmhb-billing'};\n  const credentials=Object.freeze({hostname:env.REPLIT_CONNECTORS_HOSTNAME,replIdentity:env.REPL_IDENTITY,\n    webReplRenewal:env.WEB_REPL_RENEWAL});\n  const pool=poolFactory(config);\n  check(pool&&typeof pool.query==='function'&&typeof pool.connect==='function'&&typeof pool.end==='function'&&\n    typeof pool.on==='function','invalid_pool');\n  // Idle-client errors contain connection details; report only a fixed code.\n  pool.on('error',()=>console.error('[billing-runtime] database_pool_error'));\n  const manager=createBillingSchemaManager({pool,expected:billingSchemaContract,migrationSQL:billingMigrationSQL});\n  const db=drizzle(pool,{schema});\n  const runtime=createBillingRuntime({enabled:true,pool,onState,verifySchema:async()=>{\n    const result=await manager.verify();\n    await verifyBillingUsersReadiness(pool);\n    return result;\n  },\n    createWorker:()=>createBillingNotificationWorker({...options,pool,\n      connectTransport:({signal})=>connectBillingTransport({...credentials,Resend,signal}),\n      renderNotification:renderBillingNotification,prepareDelivery,dispatchOne})});\n  return Object.freeze({db,runtime});\n}\n"};

function snapshotInputIO(file,destinations,maxBytes) {
  const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
  let initial,canonicalMatch=null,sourceFd;
  const outputFds=[];
  const kind=s=>!s?'unavailable':s.isSymbolicLink()?'symlink':s.isDirectory()?'directory':s.isFile()?'regular':'other';
  function fail(code,extra={}) {
    const metadata={path:typeof file==='string'?file:'[invalid path]',type:kind(initial),
      bytes:initial?initial.size.toString():null,canonicalMatch,...extra};
    throw Object.assign(Error('Snapshot '+code+': '+JSON.stringify(metadata)),{code,metadata});
  }
  const same=(a,b)=>['dev','ino','size','mtimeNs','ctimeNs'].every(key=>a[key]===b[key]);
  function checkCurrent() {
    const opened=fs.fstatSync(sourceFd,{bigint:true});
    if(!opened.isFile()||!same(initial,opened))fail('source_changed');
    let current;
    try{current=fs.lstatSync(file,{bigint:true});}catch(e){fail('source_path_changed',{filesystemCode:e.code});}
    let canonical;
    try{canonical=fs.realpathSync(file)===file;}catch{canonical=false;}
    if(!current.isFile()||!same(initial,current)||!canonical)fail('source_path_changed',{currentType:kind(current),currentCanonicalMatch:canonical});
  }
  if(typeof file!=='string'||!path.isAbsolute(file)||path.resolve(file)!==file)fail('invalid_source_path');
  if(!Number.isSafeInteger(maxBytes)||maxBytes<0||maxBytes>268435456)fail('invalid_snapshot_bound');
  if(!Array.isArray(destinations)||destinations.length>2||new Set(destinations).size!==destinations.length)
    fail('invalid_destinations');
  try{initial=fs.lstatSync(file,{bigint:true});}catch(e){fail('source_unavailable',{filesystemCode:e.code});}
  try{canonicalMatch=fs.realpathSync(file)===file;}catch{canonicalMatch=false;}
  if(!initial.isFile())fail('source_not_regular');
  if(!canonicalMatch)fail('source_path_not_canonical');
  if(initial.size>BigInt(maxBytes))fail('source_exceeds_remaining_budget',{maxBytes});
  if(!Number.isInteger(fs.constants.O_NOFOLLOW)||!Number.isInteger(fs.constants.O_NONBLOCK))
    fail('required_open_flags_unavailable');
  for(const destination of destinations) {
    if(typeof destination!=='string'||!path.isAbsolute(destination)||path.resolve(destination)!==destination||destination===file)
      fail('invalid_destination');
    const parent=path.dirname(destination);
    let safe=false;
    try{safe=fs.lstatSync(parent).isDirectory()&&fs.realpathSync(parent)===parent;}catch{}
    if(!safe)fail('destination_parent_not_canonical',{destination});
  }
  try {
    try{sourceFd=fs.openSync(file,fs.constants.O_RDONLY|fs.constants.O_NOFOLLOW|fs.constants.O_NONBLOCK);}
    catch(e){fail('source_open_failed',{filesystemCode:e.code});}
    checkCurrent();
    // Only create output files after the source and every destination parent
    // have passed validation. Exclusive creation preserves existing work.
    for(const destination of destinations) {
      try{outputFds.push(fs.openSync(destination,fs.constants.O_WRONLY|fs.constants.O_CREAT|
        fs.constants.O_EXCL|fs.constants.O_NOFOLLOW,0o600));}
      catch(e){fail('destination_open_failed',{destination,filesystemCode:e.code});}
    }
    const buffer=Buffer.allocUnsafe(1048576),digest=crypto.createHash('sha256');
    let bytes=0;
    for(;;) {
      // One extra byte detects growth at the exact remaining-budget boundary.
      const length=Math.min(buffer.length,maxBytes-bytes+1);
      const count=fs.readSync(sourceFd,buffer,0,length,null);
      if(count===0)break;
      bytes+=count;
      if(bytes>maxBytes)fail('source_grew_beyond_budget',{maxBytes,observedBytes:bytes});
      if(BigInt(bytes)>initial.size)fail('source_changed',{observedBytes:bytes});
      const chunk=buffer.subarray(0,count);digest.update(chunk);
      for(const fd of outputFds) {
        let written=0;
        while(written<count) {
          const amount=fs.writeSync(fd,chunk,written,count-written,null);
          if(amount<=0)fail('destination_write_stalled');
          written+=amount;
        }
      }
    }
    if(BigInt(bytes)!==initial.size)fail('source_changed',{observedBytes:bytes});
    checkCurrent();
    const result={bytes,sha256:digest.digest('hex')};
    // Confirm both on-disk copies through the same bounded read path. This
    // also rejects output mutation or replacement before accepting a snapshot.
    for(const destination of destinations) {
      const copied=snapshotInputIO(destination,[],maxBytes);
      if(copied.bytes!==result.bytes||copied.sha256!==result.sha256)fail('destination_digest_mismatch',{destination});
    }
    checkCurrent();
    return result;
  } finally {
    let closeError;
    for(const fd of outputFds)try{fs.closeSync(fd);}catch(e){closeError??=e;}
    if(sourceFd!==undefined)try{fs.closeSync(sourceFd);}catch(e){closeError??=e;}
    if(closeError)fail('descriptor_close_failed',{filesystemCode:closeError.code});
  }
}
function copySnapshotInput(file,destinations,maxBytes) {
  if(!Array.isArray(destinations)||destinations.length<1)throw Error('Snapshot copy requires at least one destination');
  return snapshotInputIO(file,destinations,maxBytes);
}
function hashSnapshotInput(file,maxBytes) {
  return snapshotInputIO(file,[],maxBytes);
}

function makeIntegrationCandidates(app,webhook,shutdownSource,baselineApp) {
  const replace=(text,from,to,label)=>{
    if(text.split(from).length!==2)throw Error('Integration anchor changed: '+label);
    return text.replace(from,to);
  };
  if(app.includes('MMHB_BILLING_APPLICATION_V1'))throw Error('Application integration already present; inspect it');
  const appBefore=app;
  app=replace(app,'import webhookRoutes from "./routes/webhook.mjs";',
    'import webhookRoutes from "./routes/webhook.mjs";\n'+
    '// MMHB_BILLING_APPLICATION_V1\n'+
    'import { billingRuntime } from "./billing/application.mjs";\n'+
    'import { drainBillingServer } from "./billing/billingShutdown.mjs";','app imports');
  const start=app.indexOf('function shutdown(signal) {');
  const end=app.indexOf('\nprocess.on("SIGTERM", () => shutdown("SIGTERM"));',start);
  if(start<0||end<0||app.indexOf('function shutdown(signal) {',start+1)!==-1)throw Error('Shutdown boundary changed');
  const oldShutdown=app.slice(start,end);
  const knownStart=baselineApp.indexOf('function shutdown(signal) {');
  const knownEnd=baselineApp.indexOf('\nprocess.on("SIGTERM", () => shutdown("SIGTERM"));',knownStart);
  if(knownStart<0||knownEnd<0||oldShutdown!==baselineApp.slice(knownStart,knownEnd))
    throw Error('Reviewed shutdown implementation changed');
  if(!oldShutdown.includes('}, 5000).unref();')||!oldShutdown.includes('server?.closeAllConnections?.();')||
    !oldShutdown.includes('if (relistenTimer) clearTimeout(relistenTimer);'))throw Error('Shutdown implementation changed');
  const nextShutdown=`let billingShutdownPromise = null;
function shutdown(signal) {
  if (billingShutdownPromise) return billingShutdownPromise;
  console.log('[SERVER] shutdown requested', { signal });
  shuttingDown = true;
  if (relistenTimer) clearTimeout(relistenTimer);
  billingShutdownPromise = drainBillingServer({ server, runtime: billingRuntime, deadlineMs: 45000 })
    .then(result => {
      console.log('[SERVER] shutdown result', result);
      process.exit(result.ok ? 0 : 1);
    }, () => {
      console.error('[SERVER] shutdown failed');
      process.exit(1);
    });
  return billingShutdownPromise;
}
`;
  app=app.slice(0,start)+nextShutdown+app.slice(end);
  app=replace(app,'server.on("listening", () => {',
    'server.on("listening", () => {\n'+
    '  // Billing readiness is independent of the legacy best-effort bootstrap.\n'+
    '  void billingRuntime.start().catch(() => console.error("[BILLING] startup unavailable"));','listening');
  // A newly starting process must not kill the old process while its worker
  // persists an in-flight outcome. Exhausting bind retries exits this newcomer.
  const kill='    else if (listenRetries === 8) reclaimPortFromStaleDuplicates("SIGKILL");';
  app=replace(app,kill,'    // No forced peer kill: the old process owns its bounded drain.','peer SIGKILL');
  app=replace(app,'    // retry 8 (~3.2s), it\'s wedged — force it. Retries continue either way.',
    '    // later retries, let its own shutdown deadline govern termination.','peer comment');
  app=replace(app,'// instance releases the port immediately on shutdown (closeAllConnections), so\n// a retry typically succeeds within a few hundred ms. If the port is held by a',
    '// instance closes its listening socket while accepted work drains. If the port is held by a',
    'handoff comment');
  app=replace(app,'    // handlers that release the port instantly). If it STILL holds the port by',
    '    // handlers that stop accepting new requests). If it STILL holds the port on','reclaim comment');
  const mount='app.use("/api/webhooks", webhookRoutes);';
  if(app.split(mount).length!==2||app.indexOf(mount)>app.indexOf('app.use(express.json('))
    throw Error('Raw webhook mount order changed');
  webhook=replace(webhook,'import { db } from "../db/client.mjs";',
    'import { billingDb as db, billingRuntime } from "../billing/application.mjs";','webhook database');
  webhook=replace(webhook,'{ apiVersion: "2024-06-20" }',
    '{ apiVersion: "2024-06-20", timeout: 10000, maxNetworkRetries: 0 }','Stripe timeout');
  webhook=replace(webhook,'  async (req, res) => {','  billingRuntime.handleWebhook(async (req, res) => {','handler begin');
  webhook=replace(webhook,'  }\n);','  })\n);','handler end');
  const health=`function billingWebhookHealth(_req, res) {
  const state = billingRuntime.status();
  const ready = state.ready && Boolean(stripe);
  res.set('Cache-Control', 'no-store');
  return res.status(ready ? 200 : 503).json({
    ok: ready, module: 'stripeWebhook', status: state.state,
    stripeConfigured: Boolean(stripe), timestamp: new Date().toISOString()
  });
}
`;
  const hstart=webhook.indexOf('router.get("/", (_req, res) => {');
  const hend=webhook.indexOf('// IMPORTANT: raw body ONLY for stripe signature verification',hstart);
  if(hstart<0||hend<0||!webhook.slice(hstart,hend).includes('router.get("/health"'))throw Error('Webhook health anchor changed');
  webhook=webhook.slice(0,hstart)+health+'router.get("/", billingWebhookHealth);\nrouter.get("/health", billingWebhookHealth);\n\n'+webhook.slice(hend);
  const duplicate='// Health check endpoint for admin daily tools monitoring\nrouter.get("/", (req, res) => {\n  res.json({ ok: true, module: "webhook", status: "operational", timestamp: new Date().toISOString() });\n});';
  webhook=replace(webhook,duplicate,'// Billing health is registered once above the Stripe handler.','duplicate health');
  return {app,webhook,shutdownSource,appBefore,oldShutdown};
}

async function qualifyBuildGraph() {
  const fs=require('node:fs'),path=require('node:path'),{createRequire}=require('node:module');
  const cfg=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
  const {build}=createRequire(path.join(cfg.root,'package.json'))('esbuild');
  const results=[];
  for(const [mode,source]of [['baseline',cfg.baseline],['candidate',cfg.candidate]]) {
    try{
      const result=await build({entryPoints:[path.join(source,'server/app.mjs')],bundle:true,platform:'node',format:'esm',
        target:'node24',outfile:path.join(cfg.directory,'bundles',mode+'.mjs'),nodePaths:[path.join(cfg.root,'node_modules')],
        external:['pg-native','pg-cloudflare','bufferutil','utf-8-validate','bcrypt'],
        banner:{js:"import { createRequire as __createRequire } from 'node:module';\nconst require = __createRequire(import.meta.url);"},
        logLevel:'silent',metafile:true});
      const bundled=Object.keys(result.metafile.inputs).map(x=>path.resolve(x));
      const required=mode==='candidate'?[
        'server/billing/application.mjs','server/billing/createApplication.mjs','server/billing/billingRuntime.mjs',
        'server/db/billingUsersReadiness.mjs','server/billing/billingShutdown.mjs','server/db/billingSchema.mjs','server/db/billingSchemaContract.mjs',
        'server/services/billingEventTransaction.mjs','server/services/billingNotificationWorker.mjs',
        'server/services/billingDelivery.mjs','server/services/billingEmailTransport.mjs',
        'server/services/billingNotificationTemplate.mjs','server/routes/webhook.mjs']:[];
      for(const name of required)if(!bundled.includes(path.join(source,name)))throw Error('Missing candidate in bundle: '+name);
      fs.writeFileSync(path.join(cfg.directory,'bundles',mode+'.meta.json'),JSON.stringify(result.metafile),{flag:'wx',mode:0o600});
      results.push({mode,pass:true,inputCount:bundled.length,requiredCandidateModules:required.length});
    }catch(error){
      results.push({mode,pass:false,errors:(error.errors||[{text:error.message}]).map(x=>String(x.text).slice(0,600)).slice(0,10)});
    }
  }
  fs.writeFileSync(cfg.result,JSON.stringify({scope:'SERVER_BUNDLE_COMPILATION_ONLY',results},null,2),{flag:'wx',mode:0o600});
  process.exitCode=results.every(x=>x.pass)?0:1;
}

async function qualifyAdapter() {
  const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
  const {createRequire}=require('node:module'),{pathToFileURL}=require('node:url');
  const cfg=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
  const directory=fs.realpathSync(cfg.directory),socket=fs.realpathSync(cfg.socket);
  assert.equal(directory,cfg.directory);assert.equal(socket,cfg.socket);assert.match(socket,/^\/tmp\/mmhb-g43-[A-Za-z0-9]+$/);
  const socketStat=fs.lstatSync(socket);assert.ok(socketStat.isDirectory());assert.equal(socketStat.mode&0o077,0);assert.equal(socketStat.uid,process.getuid());
  assert.match(cfg.password,/^[a-f0-9]{64}$/);assert.equal(process.env.NODE_ENV,'test');assert.equal(process.env.DATABASE_SSL,'false');
  for(const tree of [cfg.candidateRoot,cfg.baselineRoot])assert.equal(fs.realpathSync(tree),tree);
  const requireFromRoot=createRequire(path.join(cfg.root,'package.json')),{Pool,Client}=requireFromRoot('pg');
  const {sql,eq}=requireFromRoot('drizzle-orm');
  const imported=rel=>import(pathToFileURL(path.join(cfg.candidateRoot,rel)).href);
  const {createBillingApplication}=await imported('server/billing/createApplication.mjs');
  const {createBillingApplication:createBaselineApplication}=await import(pathToFileURL(path.join(cfg.baselineRoot,'server/billing/createApplication.mjs')).href);
  const {createBillingSchemaManager}=await imported('server/db/billingSchema.mjs');
  const {billingSchemaContract,billingMigrationSQL}=await imported('server/db/billingSchemaContract.mjs');
  const {users}=await imported('shared/schema.mjs');
  const role='mmhb_g43_runtime',uid='11111111-1111-4111-8111-111111111111';
  const connection={host:socket,port:6543,user:'mmhb_owner',password:cfg.password,database:'postgres',ssl:false,
    max:2,connectionTimeoutMillis:3000,idleTimeoutMillis:1000,statement_timeout:8000,query_timeout:12000};
  const databaseURL=new URL('postgresql://localhost:6543/postgres');databaseURL.username=role;databaseURL.password=cfg.password;
  databaseURL.searchParams.set('host',socket);
  // The real node-postgres parser must select this private socket before any
  // adapter is allowed to connect; no poolFactory substitution is used.
  const parsed=new Client({connectionString:databaseURL.toString(),ssl:false}).connectionParameters;
  assert.equal(parsed.host,socket);assert.equal(parsed.port,6543);assert.equal(parsed.user,role);assert.equal(parsed.database,'postgres');
  const fixtureEnv=()=>({NODE_ENV:'test',DATABASE_SSL:'false',DATABASE_URL:databaseURL.toString(),
    MMHB_BILLING_PIPELINE_ENABLED:'true',REPLIT_CONNECTORS_HOSTNAME:'connector.example.invalid',REPL_IDENTITY:'fixture_identity'});
  const connectorURL='https://connector.example.invalid/api/v2/connection?include_secrets=true&connector_names=resend';
  const owner=new Pool(connection),apps=new Set(),checks=[],controls=[],originalFetch=globalThis.fetch;
  const envKeys=['NODE_ENV','DATABASE_SSL','DATABASE_URL','MMHB_BILLING_PIPELINE_ENABLED',
    'REPLIT_CONNECTORS_HOSTNAME','REPL_IDENTITY','WEB_REPL_RENEWAL','DOTENV_CONFIG_PATH'];
  const priorEnvironment=new Map(envKeys.map(key=>[key,process.env[key]]));
  let active;
  const deferred=()=>{let resolve;const promise=new Promise(r=>{resolve=r;});return{promise,resolve};};
  const hash=value=>crypto.createHash('sha256').update(value).digest('hex');
  async function bounded(promise,label,ms=10000) {
    let timer;try{return await Promise.race([promise,new Promise((_resolve,reject)=>{timer=setTimeout(()=>reject(Error(label+' timed out')),ms);})]);}
    finally{clearTimeout(timer);}
  }
  async function sessions() {
    return (await owner.query('SELECT count(*)::int AS n FROM pg_catalog.pg_stat_activity WHERE usename=$1',[role])).rows[0].n;
  }
  async function noSessions() {
    const deadline=Date.now()+4000;
    while(await sessions()) {assert.ok(Date.now()<deadline,'Runtime PostgreSQL sessions remained after stop');await new Promise(resolve=>setTimeout(resolve,20));}
  }
  async function stopAll() {
    active?.releaseProvider.resolve();
    for(const app of apps)await bounded(app.runtime.stop(),'Adapter stop',15000);
    apps.clear();await noSessions();
  }
  const table='public.billing_notification_deliveries';
  const saved=async id=>(await owner.query('SELECT * FROM '+table+' WHERE event_id=$1',[id])).rows[0];
  async function seed(id) {
    await owner.query("INSERT INTO public.webhook_events(id,event_type)VALUES($1,'checkout.session.completed')",[id]);
    await owner.query("INSERT INTO public.billing_notification_intents(event_id,kind,user_id,payload)VALUES($1,'upgrade',$2,$3)",
      [id,uid,{version:1,recipient:'fixture@example.invalid',name:'Adapter Fixture',periodEnd:null}]);
  }
  async function reset({withUsers=true,withOutbox=true}={}) {
    await stopAll();
    await owner.query('DROP SCHEMA public CASCADE;CREATE SCHEMA public;GRANT USAGE ON SCHEMA public TO PUBLIC');
    await owner.query(`CREATE TABLE public.webhook_events(id text PRIMARY KEY,event_type varchar(100) NOT NULL,
      status varchar(50) NOT NULL DEFAULT 'processed',processed_at timestamptz NOT NULL DEFAULT now());
      GRANT SELECT,INSERT ON public.webhook_events TO ${role}`);
    if(withOutbox){
      await createBillingSchemaManager({pool:owner,expected:billingSchemaContract,migrationSQL:billingMigrationSQL}).install();
      await owner.query(`GRANT SELECT,INSERT ON public.billing_notification_intents TO ${role};
        GRANT SELECT,INSERT,UPDATE ON public.billing_notification_deliveries TO ${role}`);
    }
    if(withUsers){
      await owner.query(`CREATE TABLE public.users(id uuid PRIMARY KEY,email varchar(255) NOT NULL UNIQUE,name varchar(255) NOT NULL,
        stripe_customer_id text,subscription_status text DEFAULT 'free',subscription_expires_at timestamp,
        updated_at timestamp NOT NULL DEFAULT now());GRANT SELECT,UPDATE ON public.users TO ${role}`);
      await owner.query('INSERT INTO public.users(id,email,name,stripe_customer_id)VALUES($1,$2,$3,$4)',
        [uid,'fixture@example.invalid','Adapter Fixture','cus_fixture']);
    }
    active={connectorCalls:0,providerCalls:0,faults:[],holdProvider:false,providerEntered:deferred(),releaseProvider:deferred()};
  }
  globalThis.fetch=async(url,options={})=>{
    try {
      const target=typeof url==='string'?url:url.url||String(url);
      assert.ok(active,'External fixture used outside an active case');
      if(target===connectorURL){
        active.connectorCalls++;assert.equal(options.method,'GET');assert.equal(options.redirect,'error');
        assert.equal(new Headers(options.headers).get('X_REPLIT_TOKEN'),'repl fixture_identity');
        assert.ok(options.signal instanceof AbortSignal);
        return new Response(JSON.stringify({items:[{settings:{api_key:'re_fixture_adapter',from_email:'MyMentalHealthBuddy <billing@example.invalid>'}}]}),
          {status:200,headers:{'content-type':'application/json'}});
      }
      assert.equal(target,'https://api.resend.com/emails','Unexpected external request');assert.equal(options.method,'POST');
      const headers=new Headers(options.headers),key=headers.get('Idempotency-Key');
      const row=(await owner.query('SELECT * FROM '+table+' WHERE idempotency_key=$1',[key])).rows[0];
      assert.ok(row,'Provider send preceded durable preparation');assert.equal(row.status,'sending');
      assert.equal(hash(row.body_text),row.request_sha256);assert.deepEqual(JSON.parse(String(options.body)),JSON.parse(row.body_text));
      assert.equal(headers.get('Authorization'),'Bearer re_fixture_adapter');assert.ok(options.signal instanceof AbortSignal);
      active.providerCalls++;active.providerEntered.resolve();
      if(active.holdProvider){await active.releaseProvider.promise;assert.equal(options.signal.aborted,false,'Stop aborted accepted provider request');}
      return new Response(JSON.stringify({id:'email_adapter_'+active.providerCalls}),{status:200,headers:{'content-type':'application/json'}});
    }catch(error){active?.faults.push(String(error.message).slice(0,400));throw error;}
  };
  function application({baseline=false,env=fixtureEnv()}={}) {
    const factory=baseline?createBaselineApplication:createBillingApplication;
    const app=factory({env,onState(){},workerOptions:{onReport(){}}});apps.add(app);return app;
  }
  async function rejectedStart(app) {
    await assert.rejects(()=>app.runtime.start(),error=>error?.code==='schema_not_ready');
    assert.equal(app.runtime.status().ready,false);assert.equal(active.connectorCalls,0);assert.equal(active.providerCalls,0);
  }
  function sqlstate(error) {
    for(let n=0;error&&n<6;n++,error=error.cause)if(typeof error.code==='string'&&/^[0-9A-Z]{5}$/.test(error.code))return error.code;
    return null;
  }
  async function rejectedSQL(operation,expected) {
    let captured;try{await operation();}catch(error){captured=error;}
    assert.ok(captured,'Expected database operation rejection');assert.equal(sqlstate(captured),expected);
  }
  async function test(name,work,{control=false,...setup}={}) {
    try{await reset(setup);await work();assert.deepEqual(active.faults,[]);(control?controls:checks).push({name,pass:true});}
    catch(error){(control?controls:checks).push({name,pass:false,error:String(error.message).slice(0,700)});}
    finally{await stopAll();}
  }
  try {
    const identity=(await owner.query("SELECT current_setting('data_directory') AS data,current_setting('listen_addresses') AS listen,inet_server_addr() AS address,current_user AS owner")).rows[0];
    assert.equal(fs.realpathSync(identity.data),fs.realpathSync(cfg.data));assert.equal(identity.listen,'');assert.equal(identity.address,null);assert.equal(identity.owner,'mmhb_owner');
    await owner.query(`CREATE ROLE ${role} LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE PASSWORD '${cfg.password}'`);
    await test('baseline_reports_ready_without_users_then_real_query_fails',async()=>{
      const app=application({baseline:true});assert.equal((await app.runtime.start()).ok,true);assert.equal(app.runtime.status().ready,true);
      await rejectedSQL(()=>app.db.select({id:users.id}).from(users).limit(1),'42P01');
    },{control:true,withUsers:false});
    await test('baseline_reports_ready_without_user_update_permission',async()=>{
      await owner.query('REVOKE UPDATE ON public.users FROM '+role);const app=application({baseline:true});
      assert.equal((await app.runtime.start()).ok,true);assert.equal(app.runtime.status().ready,true);
      await rejectedSQL(()=>app.db.update(users).set({subscriptionStatus:'pro'}).where(eq(users.id,uid)),'42501');
      assert.equal((await owner.query('SELECT subscription_status FROM public.users')).rows[0].subscription_status,'free');
    },{control:true});
    assert.ok(controls.length===2&&controls.every(x=>x.pass),'Baseline controls differ');
    await test('disabled_factory_does_not_construct_an_active_database',async()=>{
      const app=application({env:{MMHB_BILLING_PIPELINE_ENABLED:'false'}});assert.equal(app.db,null);
      assert.deepEqual(await app.runtime.start(),{ok:false,status:'disabled'});assert.equal(await sessions(),0);assert.equal(active.connectorCalls,0);
    });
    await test('enabled_factory_has_no_implicit_startup_or_connection',async()=>{
      const app=application();assert.ok(app.db);assert.equal(app.runtime.status().state,'idle');
      await new Promise(resolve=>setImmediate(resolve));assert.equal(await sessions(),0);assert.equal(active.connectorCalls,0);
    });
    await test('production_environment_refuses_disabled_tls',async()=>{
      assert.throws(()=>application({env:{...fixtureEnv(),NODE_ENV:'production'}}),/DATABASE_SSL=false is not permitted/);
      assert.equal(await sessions(),0);assert.equal(active.connectorCalls,0);
    });
    await test('missing_outbox_is_not_installed_by_startup',async()=>{
      await rejectedStart(application());
      assert.equal((await owner.query("SELECT to_regclass('public.billing_notification_intents') IS NULL AS absent")).rows[0].absent,true);
    },{withOutbox:false});
    await test('missing_users_table_blocks_readiness',async()=>{await rejectedStart(application());},{withUsers:false});
    await test('missing_required_users_column_blocks_readiness',async()=>{
      await owner.query('ALTER TABLE public.users DROP COLUMN subscription_status');await rejectedStart(application());
    });
    await test('missing_users_select_privilege_blocks_readiness',async()=>{
      await owner.query('REVOKE SELECT ON public.users FROM '+role);await rejectedStart(application());
    });
    await test('missing_users_update_privilege_blocks_readiness',async()=>{
      await owner.query('REVOKE UPDATE ON public.users FROM '+role);await rejectedStart(application());
    });
    await test('users_row_level_security_blocks_readiness',async()=>{
      await owner.query('ALTER TABLE public.users ENABLE ROW LEVEL SECURITY');await rejectedStart(application());
    });
    await test('incompatible_users_column_type_blocks_readiness',async()=>{
      await owner.query('ALTER TABLE public.users ALTER COLUMN updated_at DROP DEFAULT;ALTER TABLE public.users ALTER COLUMN updated_at TYPE text USING updated_at::text');
      await rejectedStart(application());
    });
    await test('actual_adapter_session_uses_private_socket_and_configured_bounds',async()=>{
      await owner.query(`REVOKE SELECT,UPDATE ON public.users FROM ${role};
        GRANT SELECT(id,email,name,stripe_customer_id) ON public.users TO ${role};
        GRANT UPDATE(stripe_customer_id,subscription_status,subscription_expires_at,updated_at) ON public.users TO ${role}`);
      const app=application();assert.equal((await app.runtime.start()).ok,true);
      const result=await app.db.execute(sql`SELECT current_user AS role,inet_server_addr() AS address,
        current_setting('application_name') AS application,current_setting('statement_timeout') AS statement_timeout,
        current_setting('idle_in_transaction_session_timeout') AS idle_timeout,current_setting('search_path') AS search_path,
        (SELECT rolsuper FROM pg_catalog.pg_roles WHERE rolname=current_user) AS superuser`);
      const row=result.rows[0],{search_path,...settings}=row;
      assert.deepEqual(settings,{role,address:null,application:'mmhb-billing',statement_timeout:'5s',idle_timeout:'15s',superuser:false});
      assert.deepEqual(search_path.split(',').map(value=>value.trim()),['public','pg_catalog']);
      const updated=await app.db.update(users).set({subscriptionStatus:'pro'}).where(eq(users.id,uid))
        .returning({id:users.id,email:users.email,name:users.name});
      assert.deepEqual(updated,[{id:uid,email:'fixture@example.invalid',name:'Adapter Fixture'}]);
      assert.equal((await owner.query('SELECT subscription_status FROM public.users')).rows[0].subscription_status,'pro');
    });
    await test('actual_singleton_worker_persists_acceptance_before_shutdown',async()=>{
      assert.equal(fs.existsSync(path.join(directory,'.env')),false);
      const env={...fixtureEnv(),DOTENV_CONFIG_PATH:path.join(directory,'fixture-env-not-present')};
      assert.equal(fs.existsSync(env.DOTENV_CONFIG_PATH),false);
      for(const key of envKeys){if(Object.hasOwn(env,key))process.env[key]=env[key];else delete process.env[key];}
      const singleton=await imported('server/billing/application.mjs');
      const app={db:singleton.billingDb,runtime:singleton.billingRuntime};apps.add(app);
      assert.ok(app.db);assert.equal(app.runtime.status().state,'idle');assert.equal(await sessions(),0);
      await seed('evt_adapter_01');await seed('evt_adapter_02');active.holdProvider=true;
      assert.equal((await app.runtime.start()).ok,true);await bounded(active.providerEntered.promise,'Actual worker provider dispatch',10000);
      assert.equal(active.connectorCalls,1);assert.equal(active.providerCalls,1);assert.equal((await saved('evt_adapter_01')).status,'sending');
      let completed=false;const stopping=app.runtime.stop().then(result=>{completed=true;return result;});
      await Promise.resolve();assert.equal(completed,false);assert.ok(await sessions()>0);
      active.releaseProvider.resolve();await bounded(stopping,'Actual singleton drain',10000);
      assert.equal((await saved('evt_adapter_01')).status,'accepted');assert.equal((await saved('evt_adapter_01')).accepted_message_id,'email_adapter_1');
      assert.equal((await saved('evt_adapter_02')).status,'pending');assert.equal(active.providerCalls,1);
      assert.equal(app.runtime.status().state,'stopped');await noSessions();
    });
  }catch(error){checks.push({name:'setup_or_baseline_controls',pass:false,error:String(error.message).slice(0,700)});}
  finally {
    try{await stopAll();}catch(error){checks.push({name:'adapter_cleanup',pass:false,error:String(error.message).slice(0,700)});}
    globalThis.fetch=originalFetch;
    for(const [key,value]of priorEnvironment){if(value===undefined)delete process.env[key];else process.env[key]=value;}
    await owner.end();
    const report={controls,tests:checks.length,pass:checks.filter(x=>x.pass).length,checks,
      scope:'ACTUAL_BILLING_ADAPTER_AND_SINGLETON_WITH_PRIVATE_POSTGRES',poolFactory:'PRODUCTION_DEFAULT',scheduler:'REAL_NODE_TIMERS',
      externalServices:'MOCKED_FETCH_ONLY',databaseTransport:'PRIVATE_UNIX_SOCKET_NODE_ENV_TEST',productionTLS:'NOT_QUALIFIED',
      fullApplicationBoot:false,liveDatabaseConnections:0,realEmailsSent:0,releaseQualified:false};
    fs.writeFileSync(cfg.result,JSON.stringify(report,null,2)+'\n',{flag:'wx',mode:0o600});console.log(JSON.stringify(report));
    process.exitCode=controls.length===2&&controls.every(x=>x.pass)&&checks.length===12&&checks.every(x=>x.pass)?0:1;
  }
}

try{
  console.log('COMMAND_ID='+ID);
  check(JSON.parse(bytes(ROOT+'/package.json')).name==='mymentalhealthbuddy','Project identity mismatch');
  check(!process.env.REPL_ID||process.env.REPL_ID==='9d71c4b8-8fcd-4b22-aee2-5883d9cbe5a4','Replit identity mismatch');
  check(git('rev-parse','--show-toplevel').trim()===ROOT,'Repository root mismatch');
  check(process.getuid()!==0,'Run as the regular Replit user');
  check(process.versions.node.split('.')[0]==='24','Expected Node 24');
  before=snapshot();console.log('CURRENT='+JSON.stringify({head:before.head,branch:before.branch}));
  check(before.branch==='integration'&&before.tracked==='','Unexpected branch or tracked changes; preserve work');
  privateDirectory(PRIOR);
  const previous=JSON.parse(bytes(PRIOR+'/summary.json'));
  check(previous.command==='MMHB-BILLING-APPLICATION-RETRY-20260925-40'&&previous.head==='0e6c2b2b8d0d484aca1ae3de18a49ed75c9dc681'&&
    previous.status==='BILLING_APPLICATION_CANDIDATE_QUALIFIED_IN_ISOLATION'&&previous.sourcePreserved===true&&
    previous.tests===10&&previous.pass===10&&previous.disposableDatabaseStopped==='PASS','G40 summary differs');
  const qualified=JSON.parse(bytes(PRIOR+'/result.json')),build=JSON.parse(bytes(PRIOR+'/build-result.json'));
  check(qualified.tests===10&&qualified.pass===10&&qualified.checks?.length===10&&qualified.checks.every(x=>x.pass===true)&&
    qualified.controls?.length===1&&qualified.controls[0].pass===true,'G40 tests differ');
  check(build.results?.length===2&&build.results.every(x=>x.pass===true),'G40 build comparison differs');
  git('merge-base','--is-ancestor',previous.head,before.head);
  const source=JSON.parse(bytes(PRIOR+'/source-manifest.json')),changes=JSON.parse(bytes(PRIOR+'/candidate-manifest.json'));
  check(Array.isArray(source)&&source.length===3581&&changes?.length===13,'G40 source manifests differ');
  const byPath=new Map(),changeMap=new Map();
  const validRel=rel=>typeof rel==='string'&&!path.isAbsolute(rel)&&!rel.split('/').some(x=>x==='..'||x==='.'||x===''||x==='.git'||x==='node_modules');
  for(const entry of source){check(validRel(entry.file)&&/^[a-f0-9]{64}$/.test(entry.sha256)&&!byPath.has(entry.file),'Invalid source manifest entry');byPath.set(entry.file,entry);}
  for(const entry of changes){check(validRel(entry.file)&&/^[a-f0-9]{64}$/.test(entry.after)&&!changeMap.has(entry.file),'Invalid candidate manifest entry');changeMap.set(entry.file,entry);}
  check(changes.every(x=>expectedCandidateFiles.includes(x.file))&&expectedCandidateFiles.every(x=>changeMap.has(x)),'Candidate scope differs');
  for(const [rel,pin]of Object.entries(candidatePins))check(changeMap.get(rel)?.after===pin,'Candidate pin differs: '+rel);
  const schemaEvidence=ROOT+'/.git/mmhb-review-evidence/billing-schema-j6qgnN';
  const contract=bytes(schemaEvidence+'/billing-schema-contract.json');
  check(hash(contract)==='9caba9be9d259d0607a027021749da642daacfcc21298d011742a15d038dfb10','Qualified schema contract changed');
  const intent=bytes(schemaEvidence+'/candidate/billing-notification-intents.sql'),delivery=bytes(schemaEvidence+'/candidate/billing-notification-deliveries.sql');
  check(hash(intent)==='0abfb97fdb56428ceb0d7f02ecb951216c2eb61f356c8412b886f1fe1a27feea'&&
    hash(delivery)==='49f51f3bcd963df35fa276b58d9e42ef04091976934b9a28a1bd119602551d9f','Qualified migration data changed');
  const schemaCode='export const billingSchemaContract='+JSON.stringify(JSON.parse(contract))+';\n'+
    'export const billingMigrationSQL='+JSON.stringify(intent.toString('utf8')+'\n'+delivery.toString('utf8'))+';\n';
  check(changeMap.get('server/db/billingSchemaContract.mjs').after===hash(schemaCode),'Candidate schema binding changed');
  const reviewedApp=bytes(ROOT+'/.git/mmhb-review-evidence/billing-candidates-w7Q3B8/baseline/server/app.mjs');
  check(hash(reviewedApp)==='ef9c243bce76fe646a14a5c6556711faf664d772dc00384b24b8e85003d0eca6','Reviewed app anchor changed');
  const transactionalWebhook=bytes(schemaEvidence+'/candidate/webhook.after.mjs');
  check(hash(transactionalWebhook)==='071a2dec33cb5b426e2616d0b017d21ea37f05849079bb091f095bb1712e6e08','Transactional webhook changed');
  const generated=makeIntegrationCandidates(bytes(PRIOR+'/baseline/server/app.mjs').toString('utf8'),transactionalWebhook.toString('utf8'),
    bytes(PRIOR+'/candidate/server/billing/billingShutdown.mjs').toString('utf8'),reviewedApp.toString('utf8'));
  check(changeMap.get('server/app.mjs').after===hash(generated.app)&&changeMap.get('server/routes/webhook.mjs').after===hash(generated.webhook),'Candidate application patch differs');
  const versions={node:process.version};
  for(const [name,version]of [['pg','8.23.0'],['drizzle-orm','0.45.2'],['resend','6.24.0'],['esbuild','0.28.2']]){
    versions[name]=JSON.parse(bytes(ROOT+'/node_modules/'+name+'/package.json')).version;
    check(versions[name]===version,'Installed dependency changed: '+name);
  }
  const known='/nix/store/bgwr5i8jf8jpg75rr53rz3fqv5k8yrwp-postgresql-16.10/bin';
  if(fs.existsSync(path.join(known,'postgres')))PG=known;
  else{
    const r=spawnSync('pg_config',['--bindir'],{env,encoding:'utf8',timeout:10000,maxBuffer:1048576});
    check(!r.error&&r.status===0,'PostgreSQL binaries unavailable; no installation attempted');PG=r.stdout.trim();
  }
  check(path.isAbsolute(PG),'Invalid PostgreSQL binary directory');
  for(const name of ['initdb','postgres','pg_ctl'])fs.accessSync(path.join(PG,name),fs.constants.X_OK);
  const pgVersion=spawnSync(path.join(PG,'postgres'),['--version'],{env,encoding:'utf8',timeout:10000,maxBuffer:1048576});
  check(!pgVersion.error&&pgVersion.status===0&&/PostgreSQL\) 16\.10\b/.test(pgVersion.stdout),'Expected PostgreSQL 16.10');
  versions.postgres=pgVersion.stdout.trim();console.log('DEPENDENCIES='+JSON.stringify(versions));
  const parent=path.join(path.resolve(ROOT,git('rev-parse','--absolute-git-dir').trim()),'mmhb-review-evidence');privateDirectory(parent);
  const free=fs.statfsSync(parent);check(free.bavail*free.bsize>=1073741824,'Need 1 GiB free for private fixture and source copies');
  directory=fs.mkdtempSync(path.join(parent,'billing-adapter-'));privateDirectory(directory);
  console.log('EVIDENCE_DIRECTORY='+directory);put('state.before.json',JSON.stringify(before,null,2));
  const baseline=path.join(directory,'baseline'),candidate=path.join(directory,'candidate');
  fs.mkdirSync(baseline,{mode:0o700});fs.mkdirSync(candidate,{mode:0o700});
  let sourceBytes=0;
  function stage(rel,from,expected){
    const original=observe(from);check(original.sha256===expected,'Qualified candidate changed: '+rel);
    sourceBytes+=original.bytes;check(sourceBytes<=268435456,'Candidate source exceeds bounded copy policy');
    const targets=[baseline,candidate].map(tree=>path.join(tree,rel));
    for(const target of targets)fs.mkdirSync(path.dirname(target),{recursive:true,mode:0o700});
    const copied=copySnapshotInput(from,targets,268435456);
    check(copied.sha256===expected,'Source changed during candidate copy: '+rel);
    candidateFiles.set(rel,expected);baselineFiles.set(rel,expected);
  }
  for(const entry of source){
    check(observe(ROOT+'/'+entry.file).sha256===entry.sha256,'Current application input differs from G40: '+entry.file);
    check(observe(PRIOR+'/baseline/'+entry.file).sha256===entry.sha256,'Qualified baseline changed: '+entry.file);
    const change=changeMap.get(entry.file);
    if(change)check(change.before===entry.sha256,'Candidate before hash differs: '+entry.file);
    stage(entry.file,PRIOR+'/candidate/'+entry.file,change?change.after:entry.sha256);
  }
  for(const change of changes.filter(x=>!byPath.has(x.file))){
    check(change.before===null,'New candidate has unexpected predecessor');
    let occupied=false;try{fs.lstatSync(ROOT+'/'+change.file);occupied=true;}catch(e){if(e.code!=='ENOENT')throw e;}
    check(!occupied,'Application target exists; preserve it: '+change.file);
    stage(change.file,PRIOR+'/candidate/'+change.file,change.after);
  }
  const helper='server/db/billingUsersReadiness.mjs',adapter='server/billing/createApplication.mjs';
  for(const tree of [ROOT,baseline,candidate]){
    let occupied=false;try{fs.lstatSync(tree+'/'+helper);occupied=true;}catch(e){if(e.code!=='ENOENT')throw e;}
    check(!occupied,'New readiness target already exists; preserve it');
  }
  for(const [rel,value]of [[helper,newSources['billingUsersReadiness.mjs']],[adapter,newSources['createApplication.mjs']]]){
    fs.mkdirSync(path.dirname(candidate+'/'+rel),{recursive:true,mode:0o700});
    fs.writeFileSync(candidate+'/'+rel,value,{flag:rel===helper?'wx':'w',mode:0o600});
    candidateFiles.set(rel,hash(value));
  }
  const repair=[{file:helper,before:null,after:hash(newSources['billingUsersReadiness.mjs'])},
    {file:adapter,before:candidatePins[adapter],after:hash(newSources['createApplication.mjs'])}];
  put('repair-manifest.json',JSON.stringify(repair,null,2));
  put('candidate-manifest.json',JSON.stringify([...candidateFiles].map(([file,sha256])=>({file,sha256})),null,2));
  console.log('CURRENT_APPLICATION_SNAPSHOT_MATCH=PASS');
  console.log('STAGED_REPAIR_SCOPE='+JSON.stringify(repair));
  for(const tree of [baseline,candidate])fs.symlinkSync(ROOT+'/node_modules',tree+'/node_modules','dir');
  for(const row of repair)run('SYNTAX_'+path.basename(row.file),process.execPath,['--check',candidate+'/'+row.file]);
  run('CANDIDATE_DIFF','git',['--no-pager','diff','--no-index','--no-ext-diff','--no-textconv','--',baseline,candidate],30000,[0,1]);
  const builder=put('build.cjs','('+qualifyBuildGraph.toString()+')().catch(e=>{console.error(e.message);process.exitCode=2;});\n');
  const buildResult=path.join(directory,'build-result.json');
  const buildConfig=put('build-config.json',JSON.stringify({root:ROOT,directory,baseline,candidate,result:buildResult}));
  run('SERVER_BUNDLE_GRAPH',process.execPath,[builder,buildConfig],120000,[0,1]);
  buildReport=JSON.parse(bytes(buildResult));console.log('SERVER_BUNDLE_RESULT='+JSON.stringify(buildReport));
  check(buildReport?.results?.length===2&&buildReport.results.every(x=>x.pass===true),'Server bundle compilation failed');
  const harness=put('qualify.cjs','('+qualifyAdapter.toString()+')().catch(e=>{console.error(e.code||e.message);process.exitCode=2;});\n');
  run('HARNESS_SYNTAX',process.execPath,['--check',harness]);
  data=path.join(directory,'data');socket=fs.mkdtempSync('/tmp/mmhb-g43-');privateDirectory(socket);
  const password=crypto.randomBytes(32).toString('hex'),pwfile=put('fixture-password',password+'\n');
  run('INITDB',path.join(PG,'initdb'),['-D',data,'-U','mmhb_owner','--auth-local=scram-sha-256',
    '--auth-host=reject','--pwfile='+pwfile,'--encoding=UTF8','--locale=C','--no-instructions']);
  fs.appendFileSync(path.join(data,'postgresql.conf'),`\nlisten_addresses = ''\nunix_socket_directories = '${socket}'\nunix_socket_permissions = 0700\nport = 6543\nmax_connections = 20\nshared_buffers = '16MB'\ntimezone = 'UTC'\nlog_statement = 'none'\n`);
  stopped='PENDING';run('PG_START',path.join(PG,'pg_ctl'),['-D',data,'-l',path.join(directory,'postgres.log'),'-w','-t','20','start'],30000);
  started=true;console.log('DATABASE_SCOPE=NEW_PRIVATE_UNIX_SOCKET_CLUSTER_WITH_SYNTHETIC_DATA');
  const result=path.join(directory,'result.json');
  const config=put('config.json',JSON.stringify({root:ROOT,directory,data,socket,password,result,baselineRoot:baseline,candidateRoot:candidate}));
  const execution=run('ACTUAL_ADAPTER_POSTGRES_TESTS',process.execPath,[harness,config],120000,[0,1,2]);
  report=JSON.parse(bytes(result));console.log('NEGATIVE_CONTROL='+JSON.stringify(report.controls));
  console.log('ADAPTER_RESULT='+JSON.stringify({tests:report.tests,pass:report.pass,failed:report.checks?.filter(x=>!x.pass)}));
  check(execution.status===0&&report.tests===EXPECTED_TESTS&&report.pass===EXPECTED_TESTS&&
    report.checks?.length===EXPECTED_TESTS&&report.checks.every(x=>x.pass===true)&&
    report.controls?.length===EXPECTED_CONTROLS&&report.controls.every(x=>x.pass===true),'Adapter qualification failed');
  status='BILLING_ADAPTER_AND_USERS_READINESS_QUALIFIED_IN_ISOLATION';
}catch(e){console.log('REASON='+JSON.stringify(e.message));process.exitCode=2;}
finally{
  if(data&&(started||fs.existsSync(path.join(data,'postmaster.pid')))){
    try{run('PG_STOP',path.join(PG,'pg_ctl'),['-D',data,'-m','fast','-w','-t','20','stop'],30000,[0],true);
      run('PG_STOP_VERIFY',path.join(PG,'pg_ctl'),['-D',data,'status'],10000,[3],true);stopped='PASS';
    }catch(e){stopped='FAILED';status='STOPPED';process.exitCode=2;console.log('CLEANUP_ERROR='+JSON.stringify(e.message));}
  }else if(stopped==='PENDING')stopped='NO_PID_AFTER_FAILED_START';
  if(socket&&stopped==='PASS'){try{fs.rmdirSync(socket);}catch(e){console.log('SOCKET_CLEANUP='+JSON.stringify(e.code));}}
  if(before){try{
    check(JSON.stringify(snapshot())===JSON.stringify(before),'Checkout changed during qualification');
    for(const file of inputs.keys())bytes(file);
    for(const [file,expected]of observed)check(hashSnapshotInput(file,expected.bytes).sha256===expected.sha256,'Input changed during qualification: '+file);
    if(directory)for(const [rel,pin]of candidateFiles)check(hashSnapshotInput(directory+'/candidate/'+rel,268435456).sha256===pin,'Staged candidate changed: '+rel);
    if(directory)for(const [rel,pin]of baselineFiles)check(hashSnapshotInput(directory+'/baseline/'+rel,268435456).sha256===pin,'Staged baseline changed: '+rel);
    preserved=true;console.log('OBSERVED_SOURCE_AND_INPUT_PRESERVATION=PASS');if(directory)put('state.after.json',JSON.stringify(snapshot(),null,2));
  }catch(e){status='STOPPED';process.exitCode=2;console.log('PRESERVATION_ERROR='+JSON.stringify(e.message));}}
  if(interrupted||!preserved||stopped!=='PASS'){status='STOPPED';process.exitCode=2;}
  if(directory){try{put('summary.json',JSON.stringify({command:ID,status,head:before?.head,sourcePreserved:preserved,
    tests:report?.tests,pass:report?.pass,controls:report?.controls,build:buildReport,disposableDatabaseStopped:stopped,
    sourceWrites:0,liveDatabaseConnections:0,applicationApplied:false,productionTLSQualified:false,releaseQualified:false},null,2));}
    catch(e){status='STOPPED';process.exitCode=2;console.log('REPORT_WRITE_ERROR='+JSON.stringify(e.message));}}
  console.log('STATUS='+status+'\nDISPOSABLE_DATABASE_STOPPED='+stopped);
  console.log('SOURCE_WRITES_BY_COMMAND=0\nLIVE_DATABASE_CONNECTIONS=0\nLIVE_DATABASE_MIGRATIONS=0\nREAL_EMAILS_SENT=0');
  console.log('APPLICATION_SOURCE_APPLY=NOT_RUN\nPRODUCTION_WORKER_ACTIVATION=NOT_RUN\nPRODUCTION_TLS=NOT_QUALIFIED');
  console.log('CLIENT_BUILD_FRESHNESS=NOT_QUALIFIED\nFULL_SERVER_BOOT=NOT_RUN\nFULL_APP_TESTS=NOT_RUN:ACTUAL_ADAPTER_SCOPE_ONLY');
  console.log('COMMIT_PUSH_DEPLOY=NOT_RUN\nRELEASE_QUALIFIED=false');
  if(directory)console.log('EVIDENCE_DIRECTORY='+directory);
  console.log('NEXT_ACTION=RETURN_FULL_OUTPUT\nREPORT_END='+ID);
}

MMHB43_NODE
)
