#!/usr/bin/env bash
# G40: bounded streaming snapshot retry of the unchanged G39 billing candidate.
(
set -eu
umask 077
cd /home/runner/workspace
node --input-type=commonjs <<'MMHB40_NODE'
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {spawnSync}=require('node:child_process');
const ROOT='/home/runner/workspace';
const RECOVERED=ROOT+'/.git/mmhb-review-evidence/billing-candidates-w7Q3B8';
const PREVIOUS=ROOT+'/.git/mmhb-review-evidence/billing-schema-j6qgnN';
const ID='MMHB-BILLING-APPLICATION-RETRY-20260925-40';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const check=(ok,why)=>{if(!ok)throw Error(why);};
const env={PATH:process.env.PATH||'/usr/bin:/bin',LANG:'C.UTF-8',TZ:'UTC',CI:'true',
  GIT_OPTIONAL_LOCKS:'0',GIT_TERMINAL_PROMPT:'0',GIT_NO_LAZY_FETCH:'1'};
const inputs=new Map(),snapshotInputs=new Map();
let directory,data,socket,PG,before,report,buildReport,started=false,interrupted=false;
let status='STOPPED',stopped='NOT_STARTED',preserved=false;
process.on('SIGINT',()=>{interrupted=true;});
process.on('SIGTERM',()=>{interrupted=true;});
function git(...args){
  const r=spawnSync('git',['--no-pager','--no-optional-locks','-c','core.fsmonitor=false',
    '-c','core.quotePath=true',...args],{cwd:ROOT,env,encoding:'utf8',timeout:30000,maxBuffer:33554432});
  check(!r.error&&r.status===0,'Git inspection failed: '+args[0]);return r.stdout;
}
function bytes(file){
  const s=fs.lstatSync(file);
  check(s.isFile()&&s.size<=4194304&&fs.realpathSync(file)===file,'Unsafe or oversized input: '+file);
  const b=fs.readFileSync(file),h=hash(b);
  if(inputs.has(file))check(inputs.get(file)===h,'Input changed: '+file);
  else inputs.set(file,h);
  return b;
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
function put(rel,value){
  check(!path.isAbsolute(rel)&&!rel.split('/').includes('..'),'Invalid output path');
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
function privateDirectory(dir){
  const s=fs.lstatSync(dir);
  check(s.isDirectory()&&s.uid===process.getuid()&&(s.mode&0o077)===0&&fs.realpathSync(dir)===dir,
    'Expected private owned directory: '+dir);
}

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

const pins={
  'server/utils/planMapping.mjs':'a4990a99c8b8cd87c37a0348c5dcd5f61040c927c4db80c9bc76a3a8fda34f55',
  'server/routes/webhook.mjs':'5f09d685e57e53a79e959e650b8e2b6a60abda89e1b089e07ad6a16672095ba7',
  'server/services/email.mjs':'815fba3d724995e1f809f861be476b32facbad298b99bae1284bb225804929df',
  'server/app.mjs':'ef9c243bce76fe646a14a5c6556711faf664d772dc00384b24b8e85003d0eca6',
  'server/db/client.mjs':'c536d3d0390b1c1caa49edc69c82ba5fd953baf6e2f649eec7cc0d004d3c2c07',
  'server/db/connection.mjs':'6baa2747e839ce79d623564b5ad64067e9a8ca90975dc262383185592e7500fc',
  'server/db/sslConfig.mjs':'5cd34b8606acc79303666990a55bcaa355f67b34a02e0973dacb0d6c534e62fa',
  'server/db/ensureSchema.mjs':'23343e14ace7796e1da29fb335a448f044982c3346b26a1b026bd7b711cfb7e0',
  'server/db/schema.canonical.sql':'e92e18c4d6bbfdf6faef7760e1116aa786b7b9dddc266db37c2f03998913e712',
  'scripts/generate-canonical-schema.mjs':'5b9d9b3e0f32a96caa6dc6963b890fdb2888616429a09dae1c129174adf42e45',
  '.replit':'eaf2ed1554aef18cfbc30319b6828c68c15088ddde6c418e94a2a4b45eef3358',
  'scripts/build-server.mjs':'9e046524ba1e77b5202c0bbe895b8a6a430e38b5188b1a2f2613525a183c4816',
  'database/schema/index.ts':'654486629dc63c9b3dabea9921cd2d9fa82d753ff46c61626f8ddfdb7939e673',
  'shared/schema.mjs':'bcd740ef7e5ffcb76d41c375ad8018a1d620c9854a995e86cd3ee2236607efa9',
  'server/db/schemaBridge.mjs':'9ff59d540cbd4d3065097f5985ba495c541c9b072eb8a9a5dfe8e5d2d03fbe49',
  'server/db/schema/refreshTokens.js':'bfdcd9c2b31c1de68eb3be1a350803d39ed9b15e3602eea251f4d9562dc83f85'
};

const newSources={"billingRuntime.mjs": "// Own the billing pipeline lifecycle. Schema installation is deliberately not\n// a runtime dependency; verifySchema must be the read-only readiness check.\nexport function createBillingRuntime({enabled=false,pool,verifySchema,createWorker,onState=()=>{}}={}) {\n  const fault=code=>Object.assign(Error('Billing runtime: '+code),{code});\n  const check=(ok,code)=>{if(!ok)throw fault(code);};\n  check(typeof enabled==='boolean'&&typeof onState==='function','invalid_configuration');\n  if(enabled)check(pool&&typeof pool.end==='function'&&typeof verifySchema==='function'&&\n    typeof createWorker==='function','missing_dependency');\n  if(pool)check(typeof pool.end==='function','invalid_pool');\n  let phase=enabled?'idle':'disabled',reason=null,starting=null,closing=null,worker=null,workerClosing=null;\n  const handlers=new Set();\n  const status=()=>Object.freeze({state:phase,ready:phase==='ready',activeHandlers:handlers.size,...(reason?{reason}:{})});\n  function publish() {\n    try{Promise.resolve(onState(status())).catch(()=>{});}catch{}\n  }\n  function stopWorker() {\n    if(!worker)return Promise.resolve();\n    if(!workerClosing)workerClosing=Promise.resolve().then(()=>worker.stop());\n    return workerClosing;\n  }\n  function start() {\n    if(phase==='draining'||phase==='stopped')return Promise.reject(fault('runtime_stopped'));\n    if(!enabled)return Promise.resolve(Object.freeze({ok:false,status:'disabled'}));\n    if(starting)return starting;\n    starting=Promise.resolve().then(async()=>{\n      if(phase!=='starting')return Object.freeze({ok:false,status:'stopped'});\n      let step='schema_not_ready';\n      try {\n        const result=await verifySchema();\n        check(result?.ok===true&&result.status==='ready','schema_not_ready');\n        if(phase!=='starting')return Object.freeze({ok:false,status:'stopped'});\n        step='worker_start_failed';\n        const candidate=createWorker();\n        check(candidate&&typeof candidate.start==='function'&&typeof candidate.stop==='function','invalid_worker');\n        worker=candidate;\n        check(worker.start()===true,'worker_start_failed');\n        phase='ready';publish();\n        return Object.freeze({ok:true,status:'ready'});\n      }catch{\n        // A partially started scheduler must also be drained. A cleanup failure\n        // is retained for stop(), which must not close the pool behind it.\n        if(worker&&typeof worker.stop==='function')try{await stopWorker();}catch{}\n        reason=step;\n        if(phase!=='draining'&&phase!=='stopped')phase='failed';\n        publish();throw fault(step);\n      }\n    });\n    phase='starting';publish();\n    return starting;\n  }\n  function handleWebhook(handler) {\n    check(typeof handler==='function','invalid_handler');\n    return function billingWebhook(req,res,next) {\n      if(phase!=='ready') {\n        res.set('Cache-Control','no-store');res.set('Retry-After','30');\n        return res.status(503).json({error:'Billing temporarily unavailable'});\n      }\n      // Add the promise before invoking application code. Response close/finish\n      // events do not prove that an asynchronous transaction has settled.\n      const operation=Promise.resolve().then(()=>handler(req,res,next)).catch(error=>next(error));\n      handlers.add(operation);\n      const done=()=>{handlers.delete(operation);};\n      operation.then(done,done);\n      return operation;\n    };\n  }\n  function stop() {\n    if(closing)return closing;\n    // Assign the idempotent promise before observer callbacks can re-enter.\n    closing=Promise.resolve().then(async()=>{\n      const workerStopped=stopWorker().then(()=>({ok:true}),error=>({ok:false,error}));\n      const admitted=Promise.allSettled([...handlers]);\n      // Startup may own a checked-out schema client. It cannot publish readiness\n      // or create a worker after the synchronous transition to draining.\n      if(starting)try{await starting;}catch{}\n      const [stopped]=await Promise.all([workerStopped,admitted]);\n      if(!stopped.ok)throw stopped.error;\n      await stopWorker();\n      if(pool)await pool.end();\n      phase='stopped';publish();\n      return Object.freeze({ok:true,status:'stopped'});\n    });\n    phase='draining';publish();\n    return closing;\n  }\n  return Object.freeze({start,handleWebhook,stop,status});\n}\n", "createApplication.mjs": "import pg from 'pg';\nimport {drizzle} from 'drizzle-orm/node-postgres';\nimport {Resend} from 'resend';\nimport * as schema from '../../shared/schema.mjs';\nimport {getPostgresConnectionString,getPostgresSslConfig} from '../db/sslConfig.mjs';\nimport {createBillingSchemaManager} from '../db/billingSchema.mjs';\nimport {billingSchemaContract,billingMigrationSQL} from '../db/billingSchemaContract.mjs';\nimport {createBillingNotificationWorker} from '../services/billingNotificationWorker.mjs';\nimport {connectBillingTransport} from '../services/billingEmailTransport.mjs';\nimport {renderBillingNotification} from '../services/billingNotificationTemplate.mjs';\nimport {prepareDelivery,dispatchOne} from '../services/billingDelivery.mjs';\nimport {createBillingRuntime} from './billingRuntime.mjs';\n\nconst fault=code=>Object.assign(Error('Billing application: '+code),{code});\nconst check=(ok,code)=>{if(!ok)throw fault(code);};\nconst stateReport=state=>console.info('[billing-runtime]',JSON.stringify(state));\nconst cycleReport=report=>console.info('[billing-worker]',JSON.stringify(report));\n\nexport function createBillingApplication({env=process.env,poolFactory=config=>new pg.Pool(config),\n  workerOptions={},onState=stateReport}={}) {\n  check(env&&typeof env==='object'&&typeof onState==='function','invalid_configuration');\n  const activation=env.MMHB_BILLING_PIPELINE_ENABLED;\n  check(activation===undefined||activation===''||activation==='false'||activation==='true','invalid_activation_flag');\n  if(activation!=='true')return Object.freeze({db:null,runtime:createBillingRuntime({enabled:false,onState})});\n  check(typeof poolFactory==='function'&&workerOptions&&typeof workerOptions==='object'&&\n    !Array.isArray(workerOptions),'invalid_dependencies');\n  check(Object.keys(workerOptions).every(key=>['intervalMs','prepareLimit','dispatchLimit','onReport'].includes(key)),\n    'invalid_worker_option');\n  const options={intervalMs:15000,prepareLimit:10,dispatchLimit:5,onReport:cycleReport,...workerOptions};\n  for(const [value,min,max]of [[options.intervalMs,100,300000],[options.prepareLimit,1,100],[options.dispatchLimit,1,100]])\n    check(Number.isSafeInteger(value)&&value>=min&&value<=max,'invalid_worker_bound');\n  check(typeof options.onReport==='function','invalid_worker_reporter');\n  let connection;\n  try{connection=new URL(getPostgresConnectionString(env.DATABASE_URL));}catch{throw fault('invalid_database_url');}\n  check(['postgres:','postgresql:'].includes(connection.protocol)&&connection.hostname.length>0,'invalid_database_url');\n  // node-postgres parses URL query parameters into its client configuration.\n  // They must not replace this pipeline's explicit TLS and operation bounds.\n  const reserved=new Set(['ssl','options','statement_timeout','query_timeout','idle_in_transaction_session_timeout',\n    'connectiontimeoutmillis','connect_timeout','application_name']);\n  for(const key of [...connection.searchParams.keys()])if(reserved.has(key.toLowerCase()))connection.searchParams.delete(key);\n  const config={connectionString:connection.toString(),ssl:getPostgresSslConfig(env),max:3,\n    connectionTimeoutMillis:3000,idleTimeoutMillis:30000,statement_timeout:5000,query_timeout:12000,\n    idle_in_transaction_session_timeout:15000,options:'-c search_path=public,pg_catalog',application_name:'mmhb-billing'};\n  const credentials=Object.freeze({hostname:env.REPLIT_CONNECTORS_HOSTNAME,replIdentity:env.REPL_IDENTITY,\n    webReplRenewal:env.WEB_REPL_RENEWAL});\n  const pool=poolFactory(config);\n  check(pool&&typeof pool.query==='function'&&typeof pool.connect==='function'&&typeof pool.end==='function'&&\n    typeof pool.on==='function','invalid_pool');\n  // Idle-client errors contain connection details; report only a fixed code.\n  pool.on('error',()=>console.error('[billing-runtime] database_pool_error'));\n  const manager=createBillingSchemaManager({pool,expected:billingSchemaContract,migrationSQL:billingMigrationSQL});\n  const db=drizzle(pool,{schema});\n  const runtime=createBillingRuntime({enabled:true,pool,onState,verifySchema:()=>manager.verify(),\n    createWorker:()=>createBillingNotificationWorker({...options,pool,\n      connectTransport:({signal})=>connectBillingTransport({...credentials,Resend,signal}),\n      renderNotification:renderBillingNotification,prepareDelivery,dispatchOne})});\n  return Object.freeze({db,runtime});\n}\n", "application.mjs": "import 'dotenv/config';\nimport {createBillingApplication} from './createApplication.mjs';\n\n// Constructing the enabled adapter allocates a lazy pool. Connections and the\n// scheduler begin only when app.mjs explicitly calls billingRuntime.start().\nconst application=createBillingApplication();\nexport const billingDb=application.db;\nexport const billingRuntime=application.runtime;\nexport {billingDb as db};\n", "billingShutdown.mjs": "// The caller owns process exit. This coordinator stops new billing work first,\n// drains accepted HTTP handlers and persisted worker outcomes, then reports.\nexport function drainBillingServer({server,runtime,deadlineMs=45000}={}) {\n  if(!server||typeof server.close!=='function'||!runtime||typeof runtime.stop!=='function')\n    throw new Error('Invalid billing shutdown dependencies');\n  if(!Number.isSafeInteger(deadlineMs)||deadlineMs<10||deadlineMs>120000)\n    throw new Error('Invalid billing shutdown deadline');\n  let stopped;\n  try{stopped=Promise.resolve(runtime.stop());}catch(error){stopped=Promise.reject(error);}\n  const closed=new Promise(resolve=>{\n    try{\n      server.close(error=>resolve(!error||error.code==='ERR_SERVER_NOT_RUNNING'));\n      server.closeIdleConnections?.();\n    }catch(error){resolve(error?.code==='ERR_SERVER_NOT_RUNNING');}\n  });\n  return new Promise(resolve=>{\n    let done=false;\n    const finish=result=>{if(done)return;done=true;clearTimeout(timer);resolve(Object.freeze(result));};\n    const timer=setTimeout(()=>{\n      try{server.closeAllConnections?.();}catch{}\n      finish({ok:false,reason:'deadline',forced:true});\n    },deadlineMs);\n    Promise.allSettled([closed,stopped]).then(([http,billing])=>{\n      const ok=http.status==='fulfilled'&&http.value===true&&billing.status==='fulfilled';\n      finish({ok,reason:ok?'drained':'drain_failed',forced:false});\n    });\n  });\n}\n"};
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
        'server/billing/billingShutdown.mjs','server/db/billingSchema.mjs','server/db/billingSchemaContract.mjs',
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

async function qualifyIntegration() {
  const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),http=require('node:http');
  const crypto=require('node:crypto'),assert=require('node:assert/strict');
  const {createRequire}=require('node:module'),{pathToFileURL}=require('node:url');
  const cfg=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
  const directory=fs.realpathSync(cfg.directory),socket=fs.realpathSync(cfg.socket);
  assert.match(socket,/^\/tmp\/mmhb-g39-[A-Za-z0-9]+$/);assert.equal(socket,cfg.socket);
  const stat=fs.lstatSync(socket);assert.ok(stat.isDirectory());assert.equal(stat.mode&0o077,0);assert.equal(stat.uid,process.getuid());
  assert.match(cfg.password,/^[a-f0-9]{64}$/);
  const req=createRequire(path.join(cfg.root,'package.json')),{Pool}=req('pg'),{Resend}=req('resend'),express=req('express');
  const StripeImport=req('stripe'),Stripe=StripeImport.default||StripeImport.Stripe||StripeImport;
  const orm=req('drizzle-orm'),pgcore=req('drizzle-orm/pg-core'),{drizzle}=req('drizzle-orm/node-postgres');
  const load=file=>import(pathToFileURL(file).href);
  const {createBillingRuntime}=await load(cfg.runtimeModule),{createBillingSchemaManager}=await load(cfg.schemaModule);
  const {createBillingNotificationWorker}=await load(cfg.worker),{prepareDelivery,dispatchOne}=await load(cfg.delivery);
  const {connectBillingTransport}=await load(cfg.transport),{renderBillingNotification}=await load(cfg.template);
  const expected=JSON.parse(fs.readFileSync(cfg.schemaContract,'utf8')),migrationSQL=fs.readFileSync(cfg.migrationSQL,'utf8');
  const connection={host:socket,port:6543,password:cfg.password,ssl:false,connectionTimeoutMillis:3000,
    idleTimeoutMillis:1000,statement_timeout:5000,query_timeout:12000,idle_in_transaction_session_timeout:15000,
    options:'-c search_path=public,pg_catalog'};
  const owner=new Pool({...connection,user:'mmhb_owner',database:'postgres',max:2}),role='mmhb_g39_runtime';
  const checks=[],controls=[],runtimes=new Set(),routes=new Set(),originalFetch=globalThis.fetch;
  const uid='11111111-1111-4111-8111-111111111111',recipient='fixture@example.invalid';
  const table='public.billing_notification_deliveries',host='connector.example.invalid';
  const connectorURL='https://'+host+'/api/v2/connection?include_secrets=true&connector_names=resend';
  const fakeEnv={STRIPE_SECRET_KEY:'sk_test_fixture_only',STRIPE_WEBHOOK_SECRET:'whsec_fixture_only',STRIPE_PRICE_PRO:'price_fixture_pro'};
  const sdk=new Stripe(fakeEnv.STRIPE_SECRET_KEY,{apiVersion:'2024-06-20'});
  let active;
  const hash=value=>crypto.createHash('sha256').update(value).digest('hex');
  const deferred=()=>{let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b;});return{promise,resolve,reject};};
  async function bounded(promise,message='Fixture timed out') {
    let timer;try{return await Promise.race([promise,new Promise((_resolve,reject)=>{timer=setTimeout(()=>reject(Error(message)),7000);})]);}
    finally{clearTimeout(timer);}
  }
  const markerCount=async()=>(await owner.query('SELECT count(*)::int AS n FROM public.webhook_events')).rows[0].n;
  const intentCount=async()=>(await owner.query('SELECT count(*)::int AS n FROM public.billing_notification_intents')).rows[0].n;
  const saved=async event=>(await owner.query('SELECT * FROM '+table+' WHERE event_id=$1',[event])).rows[0];
  const checkout=(id='evt_runtime_01')=>({id,type:'checkout.session.completed',data:{object:{id:'cs_fixture',customer:'cus_fixture',subscription:'sub_fixture',customer_details:{email:recipient}}}});
  function clock() {
    let serial=0;const queued=new Map();
    return{schedule(fn,delay){const id=++serial;queued.set(id,{fn,delay});return id;},cancel(id){queued.delete(id);},
      take(){assert.equal(queued.size,1,'Expected one worker timer');const [id,value]=queued.entries().next().value;queued.delete(id);return value;},get size(){return queued.size;}};
  }
  async function cleanup() {
    active?.releaseSend.resolve();active?.releaseRetrieve.resolve();active?.releaseVerify?.resolve();
    for(const item of runtimes)await bounded(item.runtime.stop(),'Runtime stop did not settle');runtimes.clear();
    for(const route of routes)await route.close();routes.clear();
  }
  async function reset(installed=true) {
    await cleanup();
    await owner.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public; GRANT USAGE ON SCHEMA public TO PUBLIC');
    await owner.query(`CREATE TABLE public.webhook_events(id text PRIMARY KEY,event_type varchar(100) NOT NULL,
      status varchar(50) NOT NULL DEFAULT 'processed',processed_at timestamptz NOT NULL DEFAULT now());
      CREATE TABLE public.users(id uuid PRIMARY KEY,email varchar(255) NOT NULL UNIQUE,name varchar(255) NOT NULL,
      stripe_customer_id text,subscription_status text DEFAULT 'free',subscription_expires_at timestamp,
      updated_at timestamp NOT NULL DEFAULT now());
      GRANT SELECT,INSERT ON public.webhook_events TO ${role};GRANT SELECT,UPDATE ON public.users TO ${role}`);
    if(installed){
      await createBillingSchemaManager({pool:owner,expected,migrationSQL}).install();
      await owner.query(`GRANT SELECT,INSERT ON public.billing_notification_intents TO ${role};
        GRANT SELECT,INSERT,UPDATE ON public.billing_notification_deliveries TO ${role}`);
    }
    await owner.query('INSERT INTO public.users(id,email,name,stripe_customer_id)VALUES($1,$2,$3,$4)',[uid,recipient,'Runtime Fixture','cus_fixture']);
    active={connectorCalls:0,providerCalls:0,accepted:0,faults:[],holdSend:false,holdRetrieve:false,
      sendEntered:deferred(),releaseSend:deferred(),retrieveEntered:deferred(),releaseRetrieve:deferred()};
  }
  globalThis.fetch=async(url,options={})=>{
    try {
      const target=typeof url==='string'?url:url.url||String(url);
      if(target===connectorURL){
        active.connectorCalls++;assert.equal(options.method,'GET');assert.equal(options.redirect,'error');
        return new Response(JSON.stringify({items:[{settings:{api_key:'re_fixture_runtime',from_email:'MyMentalHealthBuddy <billing@example.invalid>'}}]}),{status:200});
      }
      assert.equal(target,'https://api.resend.com/emails');assert.equal(options.method,'POST');
      const headers=new Headers(options.headers),key=headers.get('Idempotency-Key');
      const row=(await owner.query('SELECT * FROM '+table+' WHERE idempotency_key=$1',[key])).rows[0];
      assert.ok(row,'Provider request has no durable frozen row');assert.equal(row.status,'sending');
      const raw=String(options.body);assert.deepEqual(JSON.parse(raw),JSON.parse(row.body_text));
      assert.equal(hash(row.body_text),row.request_sha256);assert.ok(options.signal instanceof AbortSignal);
      active.providerCalls++;active.accepted++;active.sendEntered.resolve();
      if(active.holdSend){await active.releaseSend.promise;assert.equal(options.signal.aborted,false);}
      return new Response(JSON.stringify({id:'email_runtime_'+active.accepted}),{status:200,headers:{'content-type':'application/json'}});
    }catch(error){active?.faults.push(String(error.message).slice(0,400));throw error;}
  };
  function makeRuntime(options={}) {
    const pool=new Pool({...connection,user:role,database:'postgres',max:3});
    const end=pool.end.bind(pool),timer=clock(),reports=[],states=[];
    const item={pool,timer,reports,states,ends:0,verifies:0,workers:0,worker:null,runtime:null};
    pool.end=async()=>{item.ends++;return end();};
    const manager=createBillingSchemaManager({pool,expected,migrationSQL});
    item.runtime=createBillingRuntime({enabled:true,pool,
      async verifySchema(){item.verifies++;if(options.verifySchema)return options.verifySchema(manager);return manager.verify();},
      createWorker(){
        item.workers++;
        const worker=createBillingNotificationWorker({pool,
          connectTransport:({signal})=>connectBillingTransport({hostname:host,replIdentity:'fixture_identity',fetchImpl:globalThis.fetch,Resend,signal}),
          renderNotification:renderBillingNotification,prepareDelivery,dispatchOne,onReport:r=>reports.push(r),
          intervalMs:100,prepareLimit:2,dispatchLimit:2,schedule:timer.schedule,cancel:timer.cancel});
        item.worker=worker;return worker;
      },onState:s=>states.push(s)});
    runtimes.add(item);return item;
  }
  async function routeFixture(item) {
    const context=vm.createContext({Buffer,process:{env:{...fakeEnv}}});
    async function module(file,deps) {
      const m=new vm.SourceTextModule(fs.readFileSync(file,'utf8'),{context}),cache=new Map();
      await m.link(key=>{
        assert.ok(Object.hasOwn(deps,key),'Unexpected import '+key);
        if(!cache.has(key))cache.set(key,new vm.SyntheticModule(Object.keys(deps[key]),function(){for(const[k,v]of Object.entries(deps[key]))this.setExport(k,v);},{context}));
        return cache.get(key);
      });await m.evaluate();return m.namespace;
    }
    const schema=await module(cfg.schema,{'drizzle-orm':orm,'drizzle-orm/pg-core':pgcore});
    const mapping=await module(cfg.mapping,{}),component=await module(cfg.component,{'drizzle-orm':orm,'../../shared/schema.mjs':schema});
    const db=drizzle(item.pool,{schema});
    class OfflineStripe {
      constructor(_key,options){
        assert.equal(options.timeout,10000);assert.equal(options.maxNetworkRetries,0);
        this.webhooks={constructEvent(body,signature,secret){assert.ok(Buffer.isBuffer(body));return sdk.webhooks.constructEvent(body,signature,secret);}};
        this.checkout={sessions:{retrieve:async()=>{
          active.retrieveEntered.resolve();if(active.holdRetrieve)await active.releaseRetrieve.promise;
          return{line_items:{data:[{price:{id:fakeEnv.STRIPE_PRICE_PRO}}]}};
        }}};
      }
    }
    const router=await module(cfg.candidate,{express:{default:express,Router:express.Router},stripe:{default:OfflineStripe},
      '../billing/application.mjs':{billingDb:db,billingRuntime:item.runtime},'../../shared/schema.mjs':schema,
      'drizzle-orm':orm,'../services/billingEventTransaction.mjs':component,'../utils/planMapping.mjs':mapping,
      '../utils/logger.mjs':{logger:{info(){},warn(){},error(){}}},'../utils/metrics.mjs':{increment(){}},
      '../observability/safetyAlerts.mjs':{async alertWebhookSignatureFailure(){}}});
    const app=express();app.use('/api/webhooks',router.default);app.use(express.json());
    app.use((_err,_req,res,_next)=>res.status(500).json({error:'Fixture failure'}));
    const server=http.createServer(app);server.requestTimeout=10000;server.headersTimeout=10000;
    await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
    function begin(event,badSignature=false,{method='POST',pathname='/api/webhooks/stripe'}={}) {
      let request;
      const result=new Promise((resolve,reject)=>{
        const body=method==='POST'?Buffer.from(JSON.stringify(event)):Buffer.alloc(0);
        const signature=badSignature?'invalid':sdk.webhooks.generateTestHeaderString({payload:body.toString(),secret:fakeEnv.STRIPE_WEBHOOK_SECRET});
        request=http.request({hostname:'127.0.0.1',port:server.address().port,path:pathname,method,agent:false,
          headers:{'content-type':'application/json','content-length':body.length,'stripe-signature':signature}},response=>{
          const chunks=[];let size=0;response.on('data',chunk=>{size+=chunk.length;if(size>65536)response.destroy(Error('Oversized response'));else chunks.push(chunk);});
          response.once('error',reject);response.once('end',()=>{try{const text=Buffer.concat(chunks).toString();resolve({status:response.statusCode,headers:response.headers,
            body:/application\/json/.test(response.headers['content-type']||'')?JSON.parse(text):text});}catch(error){reject(error);}});
        });request.setTimeout(10000,()=>request.destroy(Error('Fixture HTTP timeout')));request.once('error',reject);request.end(body);
      });
      return{result,abort:()=>request.destroy(Error('Fixture disconnected'))};
    }
    const value={begin,send:(event,bad)=>begin(event,bad).result,
      health:(pathname='/api/webhooks/health')=>begin(null,false,{method:'GET',pathname}).result,
      close:()=>new Promise(resolve=>{server.close(resolve);server.closeAllConnections();})};routes.add(value);return value;
  }
  async function test(name,fn,{installed=true,control=false}={}) {
    try{await reset(installed);await fn();assert.deepEqual(active.faults,[]);(control?controls:checks).push({name,pass:true});}
    catch(error){(control?controls:checks).push({name,pass:false,error:String(error.message).slice(0,700)});}
    finally{await cleanup();}
  }
  try {
    const identity=(await owner.query("SELECT current_setting('data_directory') AS data,current_setting('listen_addresses') AS listen,inet_server_addr() AS address,current_user AS owner")).rows[0];
    assert.equal(fs.realpathSync(identity.data),fs.realpathSync(cfg.data));assert.equal(identity.listen,'');assert.equal(identity.address,null);assert.equal(identity.owner,'mmhb_owner');
    await owner.query(`CREATE ROLE ${role} LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE PASSWORD '${cfg.password}'`);
    await test('response_close_does_not_imply_handler_settlement',async()=>{
      const {EventEmitter}=require('node:events'),res=new EventEmitter(),release=deferred();
      let naiveActive=1,settled=false;res.once('close',()=>{naiveActive--;});
      const work=release.promise.then(()=>{settled=true;});res.emit('close');
      assert.equal(naiveActive,0);assert.equal(settled,false);release.resolve();await work;
    },{control:true});
    assert.ok(controls.length===1&&controls.every(x=>x.pass),'Negative control differs');
    await test('disabled_runtime_never_verifies_constructs_worker_or_admits_handler',async()=>{
      let invokes=0;const runtime=createBillingRuntime({enabled:false,verifySchema(){invokes++;},createWorker(){invokes++;}});
      await runtime.start();let status;
      await runtime.handleWebhook(async()=>{invokes++;})({}, {set(){return this;},status(n){status=n;return this;},json(){return this;}},()=>{});
      assert.equal(status,503);assert.equal(invokes,0);await runtime.stop();
    });
    await test('before_start_is_retryable_without_database_or_connector_work',async()=>{
      const item=makeRuntime(),route=await routeFixture(item);
      const denied=await route.send(checkout());assert.equal(denied.status,503);assert.equal(denied.headers['retry-after'],'30');
      assert.equal((await route.health()).status,503);assert.equal((await route.health('/api/webhooks/')).status,503);
      assert.equal(item.verifies,0);assert.equal(item.workers,0);
      assert.equal(item.pool.totalCount,0);assert.equal(await markerCount(),0);assert.equal(await intentCount(),0);assert.equal(active.connectorCalls,0);
    });
    await test('missing_schema_is_not_installed_and_blocks_webhook',async()=>{
      const item=makeRuntime(),route=await routeFixture(item);await assert.rejects(()=>item.runtime.start());
      assert.equal((await route.send(checkout())).status,503);assert.equal((await route.health()).status,503);assert.equal(item.workers,0);assert.equal(active.connectorCalls,0);
      assert.equal((await owner.query("SELECT to_regclass('public.billing_notification_intents') IS NULL AS absent")).rows[0].absent,true);
      assert.equal(await markerCount(),0);
    },{installed:false});
    await test('schema_drift_blocks_start_and_has_no_delivery_effects',async()=>{
      await owner.query('ALTER TABLE '+table+' DISABLE TRIGGER billing_delivery_immutable');
      const item=makeRuntime(),route=await routeFixture(item);await assert.rejects(()=>item.runtime.start());
      assert.equal((await route.send(checkout())).status,503);assert.equal((await route.health()).status,503);assert.equal(item.workers,0);assert.equal(await markerCount(),0);assert.equal(active.connectorCalls,0);
    });
    await test('missing_runtime_write_privilege_prevents_ready',async()=>{
      await owner.query('REVOKE UPDATE ON '+table+' FROM '+role);const item=makeRuntime();
      await assert.rejects(()=>item.runtime.start());assert.equal(item.workers,0);assert.equal(active.connectorCalls,0);
    });
    await test('verified_start_is_single_and_signed_webhook_reaches_persisted_delivery',async()=>{
      const item=makeRuntime(),route=await routeFixture(item);
      await Promise.all([item.runtime.start(),item.runtime.start()]);
      assert.equal(item.verifies,1);assert.equal(item.workers,1);assert.equal(item.timer.size,1);
      const health=await route.health();assert.equal(health.status,200);assert.equal(health.headers['cache-control'],'no-store');
      assert.equal((await route.health('/api/webhooks/')).status,200);
      assert.equal((await item.pool.query('SELECT rolsuper FROM pg_roles WHERE rolname=current_user')).rows[0].rolsuper,false);
      assert.equal((await route.send(checkout())).status,200);assert.equal(await markerCount(),1);assert.equal(await intentCount(),1);
      const cycle=item.timer.take().fn();await bounded(cycle);assert.equal((await saved('evt_runtime_01')).status,'accepted');assert.equal(active.providerCalls,1);
      await item.runtime.stop();await item.runtime.stop();assert.equal(item.ends,1);assert.equal(item.timer.size,0);
    });
    await test('ready_runtime_keeps_raw_signature_rejection_before_business_effects',async()=>{
      const item=makeRuntime(),route=await routeFixture(item);await item.runtime.start();
      assert.equal((await route.send(checkout(),true)).status,400);assert.equal(await markerCount(),0);assert.equal(await intentCount(),0);assert.equal(active.providerCalls,0);
    });
    await test('stop_during_readiness_never_starts_worker',async()=>{
      const entered=deferred(),release=deferred();active.releaseVerify=release;
      const item=makeRuntime({async verifySchema(manager){entered.resolve();await release.promise;return manager.verify();}});
      const starting=item.runtime.start();const startOutcome=starting.catch(error=>error);await bounded(entered.promise);
      const stopping=item.runtime.stop();assert.equal(item.ends,0);release.resolve();await startOutcome;await stopping;
      assert.equal(item.workers,0);assert.equal(item.timer.size,0);assert.equal(item.ends,1);assert.equal(active.connectorCalls,0);
    });
    await test('disconnected_webhook_handler_commits_before_owned_pool_closes',async()=>{
      const item=makeRuntime(),route=await routeFixture(item);await item.runtime.start();active.holdRetrieve=true;
      const request=route.begin(checkout()),outcome=request.result.catch(error=>({error}));await bounded(active.retrieveEntered.promise);
      request.abort();await outcome;let stopped=false;const stopping=item.runtime.stop().then(()=>{stopped=true;});
      await Promise.resolve();assert.equal(stopped,false);assert.equal(item.ends,0);
      assert.equal((await route.send(checkout('evt_rejected_during_stop'))).status,503);
      active.releaseRetrieve.resolve();await bounded(stopping);
      assert.equal(await markerCount(),1);assert.equal(await intentCount(),1);assert.equal(item.ends,1);assert.equal(active.providerCalls,0);
    });
    await test('stop_waits_for_accepted_send_persistence_before_pool_end',async()=>{
      const item=makeRuntime(),route=await routeFixture(item);await item.runtime.start();
      assert.equal((await route.send(checkout('evt_runtime_01'))).status,200);assert.equal((await route.send(checkout('evt_runtime_02'))).status,200);
      active.holdSend=true;const cycle=item.timer.take().fn();await bounded(active.sendEntered.promise);
      let stopped=false;const stopping=item.runtime.stop().then(()=>{stopped=true;});
      await Promise.resolve();assert.equal(stopped,false);assert.equal(item.ends,0);assert.equal(item.timer.size,0);
      assert.equal((await saved('evt_runtime_01')).status,'sending');active.releaseSend.resolve();await bounded(cycle);await bounded(stopping);
      assert.equal((await saved('evt_runtime_01')).status,'accepted');assert.equal((await saved('evt_runtime_02')).status,'pending');
      assert.equal(active.providerCalls,1);assert.equal(item.ends,1);assert.equal(item.timer.size,0);
    });
  }catch(error){checks.push({name:'setup_or_control',pass:false,error:String(error.message).slice(0,700)});}
  finally {
    try{await cleanup();}catch(error){checks.push({name:'runtime_cleanup',pass:false,error:String(error.message).slice(0,700)});}
    globalThis.fetch=originalFetch;await owner.end();
    const report={controls,tests:checks.length,pass:checks.filter(x=>x.pass).length,checks,
      scope:'STAGED_BILLING_RUNTIME_REAL_HTTP_POSTGRES_DRIZZLE_AND_SDKS',externalServices:'MOCKED_FETCH',
      applicationModulesExecuted:'STAGED_CANDIDATES_WITH_INJECTED_DATABASE_AND_NETWORK',liveDatabaseConnections:0,realEmailsSent:0,releaseQualified:false};
    fs.writeFileSync(cfg.result,JSON.stringify(report,null,2)+'\n',{flag:'wx',mode:0o600});console.log(JSON.stringify(report));
    process.exitCode=controls.length===1&&controls.every(x=>x.pass)&&checks.length===10&&checks.every(x=>x.pass)?0:1;
  }
}

try{
  console.log('COMMAND_ID='+ID);
  check(JSON.parse(bytes(path.join(ROOT,'package.json'))).name==='mymentalhealthbuddy','Project identity mismatch');
  check(!process.env.REPL_ID||process.env.REPL_ID==='9d71c4b8-8fcd-4b22-aee2-5883d9cbe5a4','Replit identity mismatch');
  check(git('rev-parse','--show-toplevel').trim()===ROOT,'Repository root mismatch');
  check(process.getuid()!==0,'Run as the regular Replit user');
  before=snapshot();console.log('CURRENT='+JSON.stringify({head:before.head,branch:before.branch}));
  check(before.branch==='integration'&&before.tracked==='','Unexpected branch or tracked changes; preserve work');
  privateDirectory(PREVIOUS);privateDirectory(RECOVERED);
  const prior=JSON.parse(bytes(path.join(PREVIOUS,'summary.json')));
  check(prior.command==='MMHB-BILLING-SCHEMA-QUALIFICATION-20260925-38'&&
    prior.status==='BILLING_SCHEMA_INSTALL_AND_READINESS_QUALIFIED_IN_ISOLATION'&&prior.sourcePreserved===true&&
    prior.tests===14&&prior.pass===14&&prior.disposableDatabaseStopped==='PASS','G38 qualification summary differs');
  const artifacts={
    'billingEventTransaction.mjs':'f8a9fce70124b55d5197cdfed53be393cbd098b80cafb607b352c4a101f9db60',
    'billingDelivery.mjs':'39cee16ceae83013e500f10cbc3ccc9ccbfca8bd9f9ceafbdb5d2065c3d68f25',
    'billingEmailTransport.mjs':'c4757e3c030600af8bf4bb6d7946fc85195541b38e5c0534b8ba5608ec1892d4',
    'billingNotificationTemplate.mjs':'cdb91217cea6ea6fb1bee2633a0f9b396d3d9a452acafd37a6d1491a37bd8e34',
    'billingNotificationWorker.mjs':'daac9fb0f94fa026a5567d22c3de74041cc1e3f793f44ce4edb0fe3476c2a940',
    'webhook.after.mjs':'071a2dec33cb5b426e2616d0b017d21ea37f05849079bb091f095bb1712e6e08',
    'billing-notification-intents.sql':'0abfb97fdb56428ceb0d7f02ecb951216c2eb61f356c8412b886f1fe1a27feea',
    'billing-notification-deliveries.sql':'49f51f3bcd963df35fa276b58d9e42ef04091976934b9a28a1bd119602551d9f'};
  const saved={};for(const [name,pin]of Object.entries(artifacts)){
    const b=bytes(path.join(PREVIOUS,'candidate',name));check(hash(b)===pin,'Restored candidate changed: '+name);saved[name]=b;
  }
  const schemaModule=bytes(path.join(PREVIOUS,'candidate/billingSchema.mjs'));
  check(hash(schemaModule)==='a76caf2a49a63b9f0fece48c81eefd43c352b0b541ca856cff184e045f47cd13','Qualified schema module changed');
  const schemaContract=bytes(path.join(PREVIOUS,'billing-schema-contract.json'));
  check(hash(schemaContract)==='9caba9be9d259d0607a027021749da642daacfcc21298d011742a15d038dfb10','Qualified schema contract changed');
  const migrationSQL=saved['billing-notification-intents.sql'].toString('utf8')+'\n'+saved['billing-notification-deliveries.sql'].toString('utf8');
  check(hash(bytes(path.join(PREVIOUS,'candidate/billing-schema-v1.sql')))===hash(migrationSQL),'Qualified migration differs');
  const knownApp=bytes(path.join(RECOVERED,'baseline/server/app.mjs'));
  check(hash(knownApp)===pins['server/app.mjs'],'Reviewed app baseline changed');
  for(const rel of ['server/routes/webhook.mjs','server/utils/planMapping.mjs','shared/schema.mjs','server/db/sslConfig.mjs',
    'server/db/ensureSchema.mjs','server/db/schema.canonical.sql','scripts/generate-canonical-schema.mjs',
    'scripts/build-server.mjs','database/schema/index.ts'])
    check(hash(bytes(path.join(ROOT,rel)))===pins[rel],'Relevant reviewed source changed: '+rel);
  console.log('G38_SCHEMA_AND_COMPONENT_PINS=PASS');
  const versions={node:process.version};
  for(const [name,version]of [['pg','8.23.0'],['drizzle-orm','0.45.2'],['express','4.22.2'],['stripe','22.6.0'],['resend','6.24.0'],['esbuild','0.28.2']]){
    versions[name]=JSON.parse(bytes(path.join(ROOT,'node_modules',name,'package.json'))).version;
    check(versions[name]===version,'Installed package version changed: '+name);
  }
  check(process.versions.node.split('.')[0]==='24','Expected Node 24');
  const known='/nix/store/bgwr5i8jf8jpg75rr53rz3fqv5k8yrwp-postgresql-16.10/bin';
  if(fs.existsSync(path.join(known,'postgres')))PG=known;
  else{
    const r=spawnSync('pg_config',['--bindir'],{env,encoding:'utf8',timeout:10000,maxBuffer:1048576});
    check(!r.error&&r.status===0,'PostgreSQL binaries unavailable; no installation attempted');PG=r.stdout.trim();
  }
  check(path.isAbsolute(PG),'Invalid PostgreSQL binary directory');
  for(const name of ['initdb','postgres','pg_ctl'])fs.accessSync(path.join(PG,name),fs.constants.X_OK);
  const pgVersion=spawnSync(path.join(PG,'postgres'),['--version'],{env,encoding:'utf8',timeout:10000});
  check(!pgVersion.error&&pgVersion.status===0&&/PostgreSQL\) 16\./.test(pgVersion.stdout),'Expected PostgreSQL 16');
  console.log('DEPENDENCIES='+JSON.stringify({...versions,postgres:pgVersion.stdout.trim()}));
  const parent=path.join(path.resolve(ROOT,git('rev-parse','--absolute-git-dir').trim()),'mmhb-review-evidence');
  privateDirectory(parent);
  const space=fs.statfsSync(parent);check(space.bavail*space.bsize>=1073741824,'Need 1 GiB free for staged builds and disposable database');
  directory=fs.mkdtempSync(path.join(parent,'billing-application-'));
  console.log('EVIDENCE_DIRECTORY='+directory);put('state.before.json',JSON.stringify(before,null,2));
  const baseline=path.join(directory,'baseline'),candidate=path.join(directory,'candidate');
  const tracked=git('ls-files','-z').split('\0').filter(Boolean),manifest=[];
  console.log('SNAPSHOT_COPY_POLICY=BOUNDED_STREAM;TOTAL_LIMIT_BYTES=268435456;SYMLINKS_REJECTED');
  let total=0;
  for(const rel of tracked){
    // Copy source/build inputs, not credential files or saved databases.
    if(!/\.(?:[cm]?[jt]sx?|json|sql|html|css)$/.test(rel)||/^(?:MMHB-|node_modules\/|dist\/)/.test(rel)||
      rel.split('/').some(p=>p.startsWith('.env')||p==='.git'))continue;
    check(!path.isAbsolute(rel)&&!rel.split('/').includes('..'),'Unsafe tracked path');
    const file=path.join(ROOT,rel),targets=[path.join(baseline,rel),path.join(candidate,rel)];
    for(const target of targets)fs.mkdirSync(path.dirname(target),{recursive:true,mode:0o700});
    const copied=copySnapshotInput(file,targets,268435456-total);
    total+=copied.bytes;snapshotInputs.set(file,copied);
    manifest.push({file:rel,bytes:copied.bytes,sha256:copied.sha256});
    if(copied.bytes>4194304)console.log('LARGE_SNAPSHOT_INPUT='+JSON.stringify({file:rel,...copied}));
  }
  check(manifest.some(x=>x.file==='server/app.mjs')&&manifest.some(x=>x.file==='package.json'),'Incomplete source snapshot');
  put('source-manifest.json',JSON.stringify(manifest,null,2));
  fs.symlinkSync(path.join(ROOT,'node_modules'),path.join(baseline,'node_modules'),'dir');
  fs.symlinkSync(path.join(ROOT,'node_modules'),path.join(candidate,'node_modules'),'dir');
  const changes=[];
  function overlay(rel,content){
    check(rel.startsWith('server/')&&!rel.split('/').includes('..'),'Invalid candidate overlay');
    const file=path.join(candidate,rel),priorFile=path.join(baseline,rel);
    if(!['server/app.mjs','server/routes/webhook.mjs'].includes(rel)){
      let exists=false;
      try{fs.lstatSync(path.join(ROOT,rel));exists=true;}catch(e){if(e.code!=='ENOENT')throw e;}
      check(!exists,'New application target already exists; preserve it: '+rel);
    }
    if(fs.existsSync(file))check(['server/app.mjs','server/routes/webhook.mjs'].includes(rel),'New module already exists; inspect: '+rel);
    fs.mkdirSync(path.dirname(file),{recursive:true,mode:0o700});fs.writeFileSync(file,content,{mode:0o600});
    changes.push({file:rel,before:fs.existsSync(priorFile)?hash(fs.readFileSync(priorFile)):null,after:hash(Buffer.from(content))});
  }
  for(const [name,content]of Object.entries(newSources))overlay('server/billing/'+name,content);
  for(const name of ['billingEventTransaction.mjs','billingDelivery.mjs','billingEmailTransport.mjs',
    'billingNotificationTemplate.mjs','billingNotificationWorker.mjs'])overlay('server/services/'+name,saved[name]);
  overlay('server/db/billingSchema.mjs',schemaModule);
  overlay('server/db/billingSchemaContract.mjs','export const billingSchemaContract='+JSON.stringify(JSON.parse(schemaContract))+';\n'+
    'export const billingMigrationSQL='+JSON.stringify(migrationSQL)+';\n');
  const currentApp=fs.readFileSync(path.join(baseline,'server/app.mjs'),'utf8');
  const patched=makeIntegrationCandidates(currentApp,saved['webhook.after.mjs'].toString('utf8'),newSources['billingShutdown.mjs'],knownApp.toString('utf8'));
  overlay('server/app.mjs',patched.app);overlay('server/routes/webhook.mjs',patched.webhook);
  put('candidate-manifest.json',JSON.stringify(changes,null,2));
  put('billing-schema-contract.json',schemaContract);const migrationSQLFile=put('billing-schema-v1.sql',migrationSQL);
  console.log('SOURCE_SNAPSHOT='+JSON.stringify({files:manifest.length,bytes:total}));
  console.log('CANDIDATE_SCOPE='+JSON.stringify(changes.map(x=>x.file)));
  console.log('APP_PATCH_POLICY=EXACT_REVIEWED_SHUTDOWN_AND_UNIQUE_ANCHORS;OTHER_CURRENT_SOURCE_RETAINED');
  for(const change of changes){
    run('SYNTAX_'+change.file.replaceAll('/','_'),process.execPath,['--check',path.join(candidate,change.file)],15000);
  }
  run('CANDIDATE_DIFF','git',['--no-pager','diff','--no-index','--no-ext-diff','--no-textconv','--',baseline,candidate],30000,[0,1]);
  const builder=put('build.cjs','('+qualifyBuildGraph.toString()+')().catch(e=>{console.error(e.message);process.exitCode=2;});\n');
  const buildResult=path.join(directory,'build-result.json');
  const buildConfig=put('build-config.json',JSON.stringify({root:ROOT,directory,baseline,candidate,result:buildResult}));
  run('SERVER_BUNDLE_GRAPH',process.execPath,[builder,buildConfig],120000,[0,1]);
  buildReport=JSON.parse(bytes(buildResult));console.log('SERVER_BUNDLE_RESULT='+JSON.stringify(buildReport));
  const harness=put('qualify.cjs','('+qualifyIntegration.toString()+')().catch(e=>{console.error(e.message);process.exitCode=2;});\n');
  run('HARNESS_SYNTAX',process.execPath,['--check',harness]);
  data=path.join(directory,'data');socket=fs.mkdtempSync('/tmp/mmhb-g39-');privateDirectory(socket);
  const password=crypto.randomBytes(32).toString('hex'),pwfile=put('fixture-password',password+'\n');
  run('INITDB',path.join(PG,'initdb'),['-D',data,'-U','mmhb_owner','--auth-local=scram-sha-256',
    '--auth-host=reject','--pwfile='+pwfile,'--encoding=UTF8','--locale=C','--no-instructions']);
  fs.appendFileSync(path.join(data,'postgresql.conf'),`\nlisten_addresses = ''\nunix_socket_directories = '${socket}'\nunix_socket_permissions = 0700\nport = 6543\nmax_connections = 20\nshared_buffers = '16MB'\ntimezone = 'UTC'\nlog_statement = 'none'\n`);
  stopped='PENDING';run('PG_START',path.join(PG,'pg_ctl'),['-D',data,'-l',path.join(directory,'postgres.log'),'-w','-t','20','start'],30000);
  started=true;console.log('DATABASE_SCOPE=NEW_PRIVATE_UNIX_SOCKET_CLUSTER_WITH_SYNTHETIC_DATA');
  const result=path.join(directory,'result.json'),at=rel=>path.join(candidate,rel);
  const config=put('config.json',JSON.stringify({root:ROOT,directory,data,socket,password,result,
    runtimeModule:at('server/billing/billingRuntime.mjs'),schemaModule:at('server/db/billingSchema.mjs'),
    schemaContract:path.join(directory,'billing-schema-contract.json'),migrationSQL:migrationSQLFile,
    candidate:at('server/routes/webhook.mjs'),component:at('server/services/billingEventTransaction.mjs'),
    schema:at('shared/schema.mjs'),mapping:at('server/utils/planMapping.mjs'),
    worker:at('server/services/billingNotificationWorker.mjs'),delivery:at('server/services/billingDelivery.mjs'),
    transport:at('server/services/billingEmailTransport.mjs'),template:at('server/services/billingNotificationTemplate.mjs')}));
  const execution=run('APPLICATION_HTTP_POSTGRES_TESTS',process.execPath,['--experimental-vm-modules',harness,config],120000,[0,1,2]);
  report=JSON.parse(bytes(result));console.log('NEGATIVE_CONTROL='+JSON.stringify(report.controls));
  console.log('APPLICATION_RESULT='+JSON.stringify({tests:report.tests,pass:report.pass,failed:report.checks?.filter(x=>!x.pass)}));
  check(execution.status===0&&report.controls?.length===1&&report.controls.every(x=>x.pass===true)&&report.tests===10&&
    report.pass===10&&report.checks?.length===10&&report.checks.every(x=>x.pass===true),'Application integration qualification failed');
  check(buildReport?.results?.length===2&&buildReport.results.every(x=>x.pass===true),'Server bundle compilation gate failed');
  for(const change of changes)check(hash(fs.readFileSync(at(change.file)))===change.after,'Candidate changed during qualification: '+change.file);
  status='BILLING_APPLICATION_CANDIDATE_QUALIFIED_IN_ISOLATION';
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
    for(const [file,expected]of snapshotInputs){
      const current=hashSnapshotInput(file,expected.bytes);
      check(current.bytes===expected.bytes&&current.sha256===expected.sha256,'Snapshot source changed: '+file);
    }
    if(directory)put('state.after.json',JSON.stringify(snapshot(),null,2));
    preserved=true;console.log('OBSERVED_SOURCE_AND_INPUT_PRESERVATION=PASS');
  }catch(e){status='STOPPED';process.exitCode=2;console.log('PRESERVATION_ERROR='+JSON.stringify(e.message));}}
  if(interrupted||!preserved||stopped!=='PASS'){status='STOPPED';process.exitCode=2;}
  if(directory){try{put('summary.json',JSON.stringify({command:ID,status,head:before?.head,sourcePreserved:preserved,
    tests:report?.tests,pass:report?.pass,build:buildReport,disposableDatabaseStopped:stopped,
    sourceWrites:0,liveDatabaseConnections:0,applicationApplied:false,releaseQualified:false},null,2));
  }catch(e){status='STOPPED';process.exitCode=2;console.log('REPORT_WRITE_ERROR='+JSON.stringify(e.message));}}
  console.log('STATUS='+status+'\nDISPOSABLE_DATABASE_STOPPED='+stopped);
  console.log('SOURCE_WRITES_BY_COMMAND=0\nLIVE_DATABASE_CONNECTIONS=0\nLIVE_DATABASE_MIGRATIONS=0\nREAL_EMAILS_SENT=0');
  console.log('APPLICATION_SOURCE_APPLY=NOT_RUN\nWORKER_ACTIVATION=NOT_RUN');
  console.log('FULL_APP_TESTS=NOT_RUN:STAGED_BILLING_INTEGRATION_ONLY\nFULL_SERVER_BOOT=NOT_RUN\nPRODUCTION_PACKAGING=NOT_VERIFIED');
  console.log('COMMIT_PUSH_DEPLOY=NOT_RUN\nRELEASE_QUALIFIED=false');
  if(directory)console.log('EVIDENCE_DIRECTORY='+directory);
  console.log('NEXT_ACTION=RETURN_FULL_OUTPUT\nREPORT_END='+ID);
}

MMHB40_NODE
)
