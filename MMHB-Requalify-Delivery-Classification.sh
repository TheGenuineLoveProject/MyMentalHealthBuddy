(
set -eu
umask 077
cd /home/runner/workspace
node --input-type=commonjs <<'MMHB25_NODE'
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {spawnSync}=require('node:child_process');
const ROOT='/home/runner/workspace';
const PREVIOUS='/home/runner/mmhb-delivery-qualify.fuvwXa';
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
async function sdkProbe() {
  const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
  const crypto=require('node:crypto'),{createRequire}=require('node:module'),{pathToFileURL}=require('node:url');
  const cfg=JSON.parse(fs.readFileSync(process.argv[2],'utf8')),req=createRequire(path.join(cfg.root,'package.json'));
  const entry=req.resolve('resend');let folder=path.dirname(entry),metadata;
  for(let i=0;i<8;i++,folder=path.dirname(folder)){
    const file=path.join(folder,'package.json');if(!fs.existsSync(file))continue;
    const p=JSON.parse(fs.readFileSync(file,'utf8'));if(p.name==='resend'){metadata=p;break;}
  }
  assert.equal(metadata?.version,'6.24.0','Installed Resend SDK changed');
  const fixtures=[
    {label:'adversarial_statusless_validation',http:422,body:{name:'validation_error',message:'Fixture rejection'},baseline:'retry',candidate:'manual'},
    {label:'validation_with_numeric_status',http:422,body:{name:'validation_error',message:'Fixture rejection',statusCode:422},baseline:'manual',candidate:'manual'},
    {label:'documented_required_field_422',http:422,body:{name:'missing_required_field',message:'Fixture rejection',statusCode:422},baseline:'manual',candidate:'manual'},
    {label:'documented_rate_limit_429',http:429,body:{name:'rate_limit_exceeded',message:'Fixture rate limit',statusCode:429},baseline:'retry',candidate:'retry'},
    {label:'documented_service_unavailable_503',http:503,body:{name:'service_unavailable',message:'Fixture outage',statusCode:503},baseline:'retry',candidate:'retry'},
    {label:'network_failure',http:null,network:true,baseline:'retry',candidate:'retry'}
  ];
  const body={from:'MMHB Fixture <billing@example.invalid>',to:'fixture@example.invalid',subject:'SDK shape probe',text:'Synthetic fixture'};
  const originalFetch=globalThis.fetch,records=[],checks=[],faults=[];let active,calls=0;
  const modules={baseline:await import(pathToFileURL(cfg.baseline).href),candidate:await import(pathToFileURL(cfg.candidate).href)};
  async function classify(module,error){
    const claim={eventId:'evt_sdk_probe',kind:'upgrade',userId:'11111111-1111-4111-8111-111111111111',providerScope:'a'.repeat(64),leaseToken:'22222222-2222-4222-8222-222222222222'};
    const trace=[];let saved,releaseCount=0;
    const client={async query(sql,params){
      if(['BEGIN','COMMIT','ROLLBACK'].includes(sql)){trace.push(sql);return{rows:[],rowCount:0};}
      if(sql.startsWith('SELECT *,lease_until>clock_timestamp() AS active,')){
        trace.push('SELECT');assert.deepEqual(params,[claim.eventId,claim.kind,claim.userId]);
        return{rows:[{status:'sending',lease_token:claim.leaseToken,provider_scope:claim.providerScope,active:true,expired:false,attempts:1}],rowCount:1};
      }
      if(sql.startsWith('UPDATE public.billing_notification_deliveries SET status=$4,')){
        trace.push('UPDATE');assert.deepEqual(params.slice(0,3),[claim.eventId,claim.kind,claim.userId]);saved={status:params[3],messageId:params[4]};return{rows:[],rowCount:1};
      }
      throw Error('Unexpected scripted database statement');
    },release(){releaseCount++;}};
    const result=await module.completeDelivery({async connect(){return client;}},claim,{error});
    assert.deepEqual(trace,['BEGIN','SELECT','UPDATE','COMMIT']);assert.equal(releaseCount,1);assert.equal(saved.messageId,null);assert.equal(result.status,saved.status);
    return result.status;
  }
  globalThis.fetch=async(url,options={})=>{
    try{
      assert.ok(active,'No active fixture');assert.equal(typeof url==='string'?url:url.url||String(url),'https://api.resend.com/emails');
      assert.equal(options.method,'POST');assert.equal(new Headers(options.headers).get('Authorization'),'Bearer re_fixture_not_a_key');
      assert.deepEqual(JSON.parse(options.body),body);calls++;
      if(active.network)throw Object.assign(Error('Fixture network outage'),{code:'MMHB_FIXTURE_NETWORK'});
      return new Response(JSON.stringify(active.body),{status:active.http,headers:{'content-type':'application/json'}});
    }catch(e){if(e.code!=='MMHB_FIXTURE_NETWORK')faults.push(String(e.message).slice(0,300));throw e;}
  };
  try{
    const {Resend}=req('resend'),sdk=new Resend('re_fixture_not_a_key');
    for(const fixture of fixtures){
      try{
        active=fixture;calls=0;const result=await sdk.emails.send(body,{idempotencyKey:'mmhb-sdk-probe-'+fixture.label});
        assert.deepEqual(faults,[],'SDK fixture failure');assert.equal(calls,1);assert.equal(result?.data,null);
        const error=result?.error;assert.ok(error&&typeof error==='object','SDK error envelope missing');
        const observed={label:fixture.label,inputHTTPStatus:fixture.http,inputBodyStatusPresent:!!fixture.body&&Object.hasOwn(fixture.body,'statusCode'),
          returnedErrorKeys:Object.keys(error).sort(),returnedName:typeof error.name==='string'?error.name:null,
          returnedStatusCodePresent:Object.hasOwn(error,'statusCode'),returnedStatusCode:typeof error.statusCode==='number'?error.statusCode:null,
          returnedStatusCodeType:typeof error.statusCode,returnedStatus:typeof error.status==='number'?error.status:null};
        records.push(observed);
        for(const [mode,module]of Object.entries(modules)){observed[mode]=await classify(module,error);assert.equal(observed[mode],fixture[mode],mode+' classification differs');}
        checks.push({name:fixture.label,pass:true});
      }catch(e){checks.push({name:fixture.label,pass:false,error:String(e.message).slice(0,500)});}
    }
    const statusless=records.find(x=>x.label==='adversarial_statusless_validation');
    const report={node:process.version,resend:metadata.version,sdkEntrySha256:crypto.createHash('sha256').update(fs.readFileSync(entry)).digest('hex'),
      tests:checks.length,pass:checks.filter(x=>x.pass).length,checks,observations:records,baselineStatus:statusless?.baseline,candidateStatus:statusless?.candidate,
      status:checks.length===6&&checks.every(x=>x.pass)?'SDK_CLASSIFICATION_PROBE_PASSED':'SDK_CLASSIFICATION_PROBE_FAILED',
      transport:'MOCKED_FETCH',database:'SCRIPTED_POOL_NO_CONNECTIONS',realEmailsSent:0,releaseQualified:false};
    fs.writeFileSync(cfg.result,JSON.stringify(report,null,2),{flag:'wx',mode:0o600});console.log(JSON.stringify(report));
    process.exitCode=checks.every(x=>x.pass)?0:1;
  }finally{active=null;globalThis.fetch=originalFetch;}
}
try{
  console.log('COMMAND_ID=MMHB-DELIVERY-CLASSIFICATION-20260924-25');
  check(JSON.parse(bytes(path.join(ROOT,'package.json'))).name==='mymentalhealthbuddy','Wrong project');
  check(!process.env.REPL_ID||process.env.REPL_ID==='9d71c4b8-8fcd-4b22-aee2-5883d9cbe5a4','Wrong Replit identity');
  check(git('rev-parse','--show-toplevel').trim()===ROOT,'Wrong repository root');
  before=state();const current=JSON.parse(before);
  check(current.head==='b3ce0daf53f52cab918dd0c40954f038ac68da9b'&&current.branch==='integration','Branch or HEAD changed');
  check(current.status===' M server/routes/webhook.mjs\n M server/services/email.mjs\n','Unexpected tracked changes');
  check(process.getuid()!==0,'Run as the regular Replit user');
  check(fs.lstatSync(PREVIOUS).isDirectory(),'Expected prior evidence directory');
  const previous=JSON.parse(bytes(path.join(PREVIOUS,'summary.json')));
  check(previous.command==='MMHB-DELIVERY-QUALIFICATION-20260924-24'&&
    previous.status==='STOPPED'&&previous.tests===24&&previous.pass===23&&
    previous.disposableDatabaseStopped==='PASS','Prior failed qualification differs');
  const priorResult=JSON.parse(bytes(path.join(PREVIOUS,'result.json')));
  check(priorResult.tests===24&&priorResult.pass===23&&priorResult.checks?.length===24&&
    priorResult.checks.filter(x=>x.pass===true).length===23&&
    priorResult.checks.filter(x=>x.pass===false).length===1&&
    priorResult.checks.find(x=>x.pass===false).name==='provider_422'&&
    priorResult.control==='UNKEYED_RETRY_DUPLICATES_REPRODUCED','Failure differs; inspect before repair');
  const priorState=JSON.parse(bytes(path.join(PREVIOUS,'state.after.json')));
  for(const key of ['head','branch','index','status','diff','package','lock'])check(current[key]===priorState[key],'Reviewed checkout changed: '+key);
  const pins={
    'server/routes/webhook.mjs':'5f09d685e57e53a79e959e650b8e2b6a60abda89e1b089e07ad6a16672095ba7',
    'server/services/email.mjs':'815fba3d724995e1f809f861be476b32facbad298b99bae1284bb225804929df',
    'shared/schema.mjs':'bcd740ef7e5ffcb76d41c375ad8018a1d620c9854a995e86cd3ee2236607efa9',
    'server/utils/planMapping.mjs':'a4990a99c8b8cd87c37a0348c5dcd5f61040c927c4db80c9bc76a3a8fda34f55'};
  for(const [rel,pin]of Object.entries(pins))check(hash(bytes(path.join(ROOT,rel)))===pin,'Source differs: '+rel);
  const versions={node:process.version};
  for(const name of ['pg','resend'])versions[name]=JSON.parse(bytes(path.join(ROOT,'node_modules',name,'package.json'))).version;
  check(versions.pg==='8.23.0'&&versions.resend==='6.24.0','Database dependencies changed');
  console.log('DEPENDENCIES='+JSON.stringify(versions));
  for(const binary of ['initdb','pg_ctl','postgres'])fs.accessSync(path.join(PG,binary),fs.constants.X_OK);
  const space=fs.statfsSync('/home/runner');check(space.bavail*space.bsize>=536870912,'Need 512 MiB free for disposable database');
  directory=fs.mkdtempSync('/home/runner/mmhb-delivery-classify.');
  console.log('EVIDENCE_DIRECTORY='+directory);put('state.before.json',before);
  const original=bytes(path.join(PREVIOUS,'billingDelivery.mjs'));
  const harness=bytes(path.join(PREVIOUS,'qualify.cjs'));
  const intents=bytes(path.join(PREVIOUS,'billing-notification-intents.sql'));
  const schema=bytes(path.join(PREVIOUS,'billing-notification-deliveries.sql'));
  check(hash(original)==='f57d672bebc870c6f3285e16525a7af64de16304fce6a63d5acc4b76dac30ef1','Baseline component differs');
  check(hash(harness)==='4c0a4bfb10e15aee3387862c03132226880d2fdc3ba86b9a374bd8724c103a3f','Original qualification harness differs');
  check(hash(intents)==='0abfb97fdb56428ceb0d7f02ecb951216c2eb61f356c8412b886f1fe1a27feea','Intent schema differs');
  check(hash(schema)==='49f51f3bcd963df35fa276b58d9e42ef04091976934b9a28a1bd119602551d9f','Delivery schema differs');
  const oldText="if(['invalid_idempotent_request','daily_quota_exceeded','monthly_quota_exceeded'].includes(name))";
  const newText="if(['validation_error','invalid_idempotent_request','daily_quota_exceeded','monthly_quota_exceeded'].includes(name))";
  const source=original.toString('utf8');check(source.split(oldText).length===2,'Classification anchor differs');
  const candidate=source.replace(oldText,newText);
  check(hash(candidate)==='39cee16ceae83013e500f10cbc3ccc9ccbfca8bd9f9ceafbdb5d2065c3d68f25','Candidate hash differs');
  const baseline=put('billingDelivery.before.mjs',original),component=put('billingDelivery.mjs',candidate);
  const worker=put('qualify.cjs',harness),intentsDDL=put('billing-notification-intents.sql',intents);
  const deliveryDDL=put('billing-notification-deliveries.sql',schema);
  run('CANDIDATE_SYNTAX',process.execPath,['--check',component]);
  run('CANDIDATE_DIFF','git',['--no-pager','diff','--no-index','--no-ext-diff','--no-textconv',baseline,component],10000,[0,1]);
  console.log('CANDIDATE_SHA256='+hash(bytes(component))+'\nORIGINAL_24_TEST_HARNESS=UNCHANGED');
  const probeFile=put('sdk-probe.cjs','('+sdkProbe.toString()+')().catch(e=>{console.error(e.message);process.exitCode=2;});\n');
  const probeResult=path.join(directory,'sdk-probe.result.json');
  const probeCfg=put('sdk-probe.config.json',JSON.stringify({root:ROOT,baseline,candidate:component,result:probeResult}));
  const probeExecution=run('SDK_CLASSIFICATION_PROBE',process.execPath,[probeFile,probeCfg],15000,[0,1]);
  const sdkReport=JSON.parse(bytes(probeResult));
  console.log('SDK_OBSERVATIONS='+JSON.stringify(sdkReport.observations));
  console.log('SDK_CLASSIFICATION_RESULT='+JSON.stringify({tests:sdkReport.tests,pass:sdkReport.pass,failed:sdkReport.checks?.filter(x=>!x.pass)}));
  check(probeExecution.status===0&&sdkReport.status==='SDK_CLASSIFICATION_PROBE_PASSED'&&
    sdkReport.tests===6&&sdkReport.pass===6&&sdkReport.checks?.length===6&&
    sdkReport.checks.every(x=>x.pass===true)&&sdkReport.baselineStatus==='retry'&&sdkReport.candidateStatus==='manual','SDK diagnosis differs; stop before database tests');
  data=path.join(directory,'data');const socket=path.join(directory,'socket');fs.mkdirSync(socket,{mode:0o700});
  const password=crypto.randomBytes(32).toString('hex'),pwfile=put('fixture-password',password+'\n');
  run('INITDB',path.join(PG,'initdb'),['-D',data,'-U','mmhb_owner','--auth-local=scram-sha-256',
    '--auth-host=reject','--pwfile='+pwfile,'--encoding=UTF8','--locale=C','--no-instructions']);
  fs.appendFileSync(path.join(data,'postgresql.conf'),`\nlisten_addresses = ''\nunix_socket_directories = '${socket}'\nunix_socket_permissions = 0700\nport = 6543\nmax_connections = 16\nshared_buffers = '16MB'\ntimezone = 'UTC'\nlog_statement = 'none'\n`);
  run('PG_START',path.join(PG,'pg_ctl'),['-D',data,'-l',path.join(directory,'postgres.log'),'-w','-t','20','start'],30000);
  started=true;stopped='PENDING';
  console.log('DATABASE_SCOPE=NEW_PRIVATE_UNIX_SOCKET_CLUSTER_WITH_SYNTHETIC_DATA');
  const result=path.join(directory,'result.json');
  const cfg=put('config.json',JSON.stringify({root:ROOT,directory,data,socket,password,component,intentsDDL,deliveryDDL,result}));
  const execution=run('DELIVERY_TESTS',process.execPath,[worker,cfg],60000,[0,1]);
  report=JSON.parse(bytes(result));
  check(Array.isArray(report.checks)&&report.tests===report.checks.length&&
    report.pass===report.checks.filter(x=>x.pass).length,'Malformed qualification result');
  console.log('BASELINE_CONTROL='+JSON.stringify(report.control));
  console.log('DELIVERY_RESULT='+JSON.stringify({tests:report.tests,pass:report.pass,failed:report.checks.filter(x=>!x.pass)}));
  check(execution.status===0&&report.control==='UNKEYED_RETRY_DUPLICATES_REPRODUCED'&&report.tests===24&&report.pass===24,'Delivery qualification failed');
  status='DELIVERY_CLASSIFICATION_REPAIR_QUALIFIED_IN_ISOLATION';
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
  if(directory)put('summary.json',JSON.stringify({command:'MMHB-DELIVERY-CLASSIFICATION-20260924-25',
    status,tests:report?.tests,pass:report?.pass,disposableDatabaseStopped:stopped,sourceWrites:0,
    deliveryComponentTested:!!report?.tests,liveWorkerActivated:false,releaseQualified:false},null,2));
  console.log('STATUS='+status+'\nDISPOSABLE_DATABASE_STOPPED='+stopped);
  console.log('SOURCE_WRITES_BY_COMMAND=0\nLIVE_DATABASE_CONNECTIONS=0\nLIVE_DATABASE_MIGRATIONS=0\nREAL_EMAILS_SENT=0');
  console.log('PREVIOUS_FAILED_EVIDENCE=PRESERVED');
  console.log('DELIVERY_WORKER_ACTIVATION=NOT_RUN\nTEMPLATE_AND_CONNECTOR_INTEGRATION=PENDING\nFULL_APP_TESTS=NOT_RUN');
  console.log('COMMIT=NOT_RUN\nPUSH=NOT_RUN\nDEPLOY=NOT_RUN\nRELEASE_QUALIFIED=false');
  if(directory)console.log('EVIDENCE_DIRECTORY='+directory);
  console.log('NEXT_ACTION=RETURN_FULL_OUTPUT\nREPORT_END=MMHB-DELIVERY-CLASSIFICATION-20260924-25');
}
MMHB25_NODE
)
