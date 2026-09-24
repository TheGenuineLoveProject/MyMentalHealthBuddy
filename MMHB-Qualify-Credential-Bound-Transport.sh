(
set -eu
umask 077
cd /home/runner/workspace
node --input-type=commonjs <<'MMHB26_NODE'
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {spawnSync}=require('node:child_process');
const ROOT='/home/runner/workspace';
const PREVIOUS='/home/runner/mmhb-delivery-classify.ipBScd';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const check=(ok,message)=>{if(!ok)throw Error(message);};
const env={PATH:process.env.PATH||'/usr/bin:/bin',LANG:'C.UTF-8',TZ:'UTC',CI:'true',NODE_ENV:'production',GIT_OPTIONAL_LOCKS:'0',GIT_TERMINAL_PROMPT:'0'};
let directory,before,status='STOPPED',report;
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
function run(label,args,timeout=45000,ok=[0]){
  console.log(label+'=RUNNING');
  const r=spawnSync(process.execPath,args,{cwd:directory,env,encoding:'utf8',timeout,killSignal:'SIGKILL',maxBuffer:4194304});
  put(label+'.log',(r.stdout||'')+(r.stderr||''));
  if(r.error||!ok.includes(r.status)){
    console.log('DIAGNOSTICS='+JSON.stringify(((r.stderr||'')+(r.error?.message||'')).slice(-2000)));
    throw Error(label+' failed; log retained');
  }
  return r;
}
function transportFactory(crypto) {
  const endpoint='https://api.resend.com';
  const fault=code=>Object.assign(Error('Billing transport: '+code),{code});
  const check=(ok,code)=>{if(!ok)throw fault(code);};
  const string=(value,max,spaces=false)=>typeof value==='string'&&value.length>0&&value.length<=max&&
    value.trim()===value&&!(spaces?/[\x00-\x1f\x7f]/:/[\x00-\x20\x7f]/).test(value);
  function signalCheck(signal) {
    check(signal===undefined||(signal&&typeof signal.aborted==='boolean'&&
      typeof signal.addEventListener==='function'&&typeof signal.removeEventListener==='function'),'invalid_abort_signal');
    if(signal?.aborted)throw fault('request_aborted');
  }
  async function bounded(start,signal) {
    signalCheck(signal);if(!signal)return start();
    let onAbort;const abort=new Promise((_resolve,reject)=>{
      onAbort=()=>reject(fault('request_aborted'));signal.addEventListener('abort',onAbort,{once:true});
    });
    try{return await Promise.race([Promise.resolve().then(()=>{signalCheck(signal);return start();}),abort]);}
    finally{signal.removeEventListener('abort',onAbort);}
  }
  async function connectBillingTransport({hostname,replIdentity,webReplRenewal,fetchImpl=globalThis.fetch,Resend,signal}={}) {
    signalCheck(signal);
    check(string(hostname,253)&&hostname.includes('.')&&hostname.split('.').every(label=>
      /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/.test(label)),'invalid_connector_hostname');
    check(typeof fetchImpl==='function'&&typeof Resend==='function','missing_transport_dependency');
    const token=replIdentity||webReplRenewal;
    check(string(token,16384),'missing_or_invalid_connector_identity');
    const connectorToken=(replIdentity?'repl ':'depl ')+token;
    const deadline=AbortSignal.timeout(10000),combined=signal?AbortSignal.any([signal,deadline]):deadline;
    let settings;
    try{
      settings=await bounded(async()=>{
        const response=await fetchImpl('https://'+hostname+'/api/v2/connection?include_secrets=true&connector_names=resend',{
          method:'GET',redirect:'error',headers:{Accept:'application/json',X_REPLIT_TOKEN:connectorToken},signal:combined
        });
        check(response&&response.ok===true&&response.redirected!==true&&typeof response.json==='function','connector_http_rejected');
        const payload=await response.json();
        check(payload&&Array.isArray(payload.items)&&payload.items.length===1,'invalid_connector_response');
        const record=payload.items[0];
        check(record&&record.settings&&typeof record.settings==='object'&&!Array.isArray(record.settings),'invalid_connector_settings');
        return record.settings;
      },combined);
    }catch(error){
      if(combined.aborted)throw fault('connector_request_aborted');
      if(typeof error?.code==='string'&&/^(connector_http_rejected|invalid_connector_response|invalid_connector_settings)$/.test(error.code))throw error;
      throw fault('connector_request_failed');
    }
    signalCheck(signal);
    const apiKey=settings.api_key,fromEmail=settings.from_email;
    check(string(apiKey,4096),'invalid_provider_credentials');
    check(string(fromEmail,320,true),'invalid_provider_sender');
    const providerScope=crypto.createHash('sha256').update(JSON.stringify(['mmhb-resend-scope-v1',endpoint,apiKey,fromEmail])).digest('hex');
    let client;try{client=new Resend(apiKey,{baseUrl:endpoint});}catch{throw fault('provider_client_unavailable');}
    check(client&&typeof client.emails?.send==='function','invalid_provider_client');
    const send=async(body,idempotencyKey,requestSignal)=>{
      signalCheck(requestSignal);
      check(body&&typeof body==='object'&&!Array.isArray(body)&&body.from===fromEmail,'frozen_sender_mismatch');
      check(typeof idempotencyKey==='string'&&/^mmhb\/billing\/v1\/[a-f0-9]{64}$/.test(idempotencyKey),'invalid_idempotency_key');
      let result;
      try{result=await bounded(()=>client.emails.send(body,{idempotencyKey,signal:requestSignal}),requestSignal);}
      catch{
        if(requestSignal?.aborted)throw fault('provider_request_aborted');
        return {id:null,error:{name:'application_error',statusCode:null,message:'Provider request failed'}};
      }
      if(result?.error!=null)return {id:null,error:result.error};
      const id=result?.data?.id;
      if(typeof id!=='string'||!id.trim()||id.length>255)return {
        id:null,error:{name:'application_error',statusCode:null,message:'Provider response omitted a valid message ID'}
      };
      return {id,error:null};
    };
    return Object.freeze({fromEmail,providerScope,send});
  }
  return {connectBillingTransport};
}
async function qualifyTransport() {
  const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
  const crypto=require('node:crypto'),{createRequire}=require('node:module'),{pathToFileURL}=require('node:url');
  const cfg=JSON.parse(fs.readFileSync(process.argv[2],'utf8')),req=createRequire(path.join(cfg.root,'package.json'));
  const {Resend}=req('resend'),{connectBillingTransport:connect}=await import(pathToFileURL(cfg.component).href);
  const key='re_fixture_A',sender='MMHB Fixture <billing@example.invalid>',host='connector.example.invalid';
  const url='https://'+host+'/api/v2/connection?include_secrets=true&connector_names=resend';
  const fixture=(apiKey=key,fromEmail=sender)=>({items:[{settings:{api_key:apiKey,from_email:fromEmail}}]});
  const makeBody=(from=sender)=>Object.freeze({from,to:'recipient@example.invalid',subject:'Fixture billing',html:'<p>Fixture</p>',text:'Fixture'});
  const keyId='mmhb/billing/v1/'+'a'.repeat(64),checks=[],controls=[],originalFetch=globalThis.fetch;
  let connector,provider,calls=[],faults=[];
  const options=()=>({hostname:host,replIdentity:'fixture_identity',Resend,fetchImpl:globalThis.fetch});
  const reset=()=>{calls=[];faults=[];connector=async()=>new Response(JSON.stringify(fixture()),{status:200});provider=async()=>new Response(JSON.stringify({id:'email_fixture'}),{status:200});};
  const count=kind=>calls.filter(x=>x.kind===kind).length;
  async function test(name,fn,control=false){reset();try{await fn();assert.deepEqual(faults,[]);(control?controls:checks).push({name,pass:true});}
    catch(e){(control?controls:checks).push({name,pass:false,error:String(e.message).slice(0,600)});}}
  globalThis.fetch=async(address,init={})=>{
    const target=typeof address==='string'?address:address.url||String(address);
    try{
      if(target===url){calls.push({kind:'connector',init});return await connector(init);}
      assert.equal(target,'https://api.resend.com/emails','Unexpected request destination');assert.equal(init.method,'POST');
      calls.push({kind:'provider',init});return await provider(init);
    }catch(e){if(!e.fixture)faults.push(String(e.message).slice(0,200));throw e;}
  };
  async function baseline(){
    const context=vm.createContext({process:{env:{REPLIT_CONNECTORS_HOSTNAME:host,REPL_IDENTITY:'fixture_identity'}},fetch:globalThis.fetch,AbortSignal});
    const module=new vm.SourceTextModule(fs.readFileSync(cfg.baseline,'utf8')+'\nexport { getResendClient };\n',{context});
    await module.link(name=>{assert.ok(['resend','../utils/logger.mjs'].includes(name));const key=name==='resend'?'Resend':'logger';
      return new vm.SyntheticModule([key],function(){this.setExport(key,key==='Resend'?Resend:{info(){},error(){}});},{context});});
    await module.evaluate();return module.namespace;
  }
  try{
    await test('baseline_cross_request_key_sender_mix',async()=>{
      let n=0;connector=async()=>{const i=++n;return{async json(){return fixture('re_fixture_'+i,'sender_'+i+'@example.invalid');}};};
      const api=await baseline(),clients=await Promise.all([api.getResendClient(),api.getResendClient()]);
      for(const c of clients)await c.client.emails.send(makeBody(c.fromEmail));
      const sent=calls.filter(x=>x.kind==='provider');assert.equal(sent.length,2);
      assert.equal(new Headers(sent[0].init.headers).get('Authorization'),'Bearer re_fixture_1');
      assert.equal(JSON.parse(sent[0].init.body).from,'sender_2@example.invalid');assert.equal(count('connector'),2);
    },true);
    await test('baseline_accepts_non_success_connector',async()=>{
      connector=async()=>new Response(JSON.stringify(fixture()),{status:503});
      assert.equal((await(await baseline()).testEmailConnection()).connected,true);assert.equal(count('provider'),0);
    },true);
    await test('valid_snapshot_and_identity_header',async()=>{
      const t=await connect(options());assert.equal(t.fromEmail,sender);assert.match(t.providerScope,/^[a-f0-9]{64}$/);assert.ok(Object.isFrozen(t));
      assert.equal(count('connector'),1);assert.equal(count('provider'),0);
      const init=calls[0].init;assert.equal(new Headers(init.headers).get('X_REPLIT_TOKEN'),'repl fixture_identity');assert.equal(init.redirect,'error');assert.ok(init.signal instanceof AbortSignal);
    });
    await test('deployment_identity_fallback',async()=>{
      await connect({...options(),replIdentity:undefined,webReplRenewal:'fixture_deployment'});
      assert.equal(new Headers(calls[0].init.headers).get('X_REPLIT_TOKEN'),'depl fixture_deployment');
    });
    await test('deterministic_credential_scope',async()=>{
      assert.equal((await connect(options())).providerScope,(await connect(options())).providerScope);
    });
    await test('concurrent_snapshots_do_not_mix',async()=>{
      let n=0;connector=async()=>{const i=++n;return{ok:true,redirected:false,async json(){return fixture('re_fixture_'+i,'sender_'+i+'@example.invalid');}};};
      const contexts=await Promise.all([connect(options()),connect(options())]);
      assert.notEqual(contexts[0].providerScope,contexts[1].providerScope);
      for(const c of contexts)await c.send(makeBody(c.fromEmail),keyId,new AbortController().signal);
      const sent=calls.filter(x=>x.kind==='provider');assert.equal(sent.length,2);
      for(let i=0;i<2;i++){assert.equal(new Headers(sent[i].init.headers).get('Authorization'),'Bearer re_fixture_'+(i+1));assert.equal(JSON.parse(sent[i].init.body).from,'sender_'+(i+1)+'@example.invalid');}
    });
    await test('credential_or_sender_rotation_changes_scope',async()=>{
      const a=await connect(options());connector=async()=>new Response(JSON.stringify(fixture('re_fixture_B')));
      const b=await connect(options());assert.notEqual(a.providerScope,b.providerScope);
      connector=async()=>new Response(JSON.stringify(fixture(key,'changed@example.invalid')));
      assert.notEqual(a.providerScope,(await connect(options())).providerScope);
    });
    await test('connector_http_failures_rejected',async()=>{
      for(const status of [401,429,503]){connector=async()=>new Response(JSON.stringify(fixture()),{status});await assert.rejects(()=>connect(options()));}assert.equal(count('provider'),0);
    });
    await test('invalid_connector_json_rejected',async()=>{
      connector=async()=>new Response('invalid JSON');await assert.rejects(()=>connect(options()));assert.equal(count('provider'),0);
    });
    await test('ambiguous_or_missing_connection_rejected',async()=>{
      for(const body of [{},{items:[]},{items:[{},{}]},null]){connector=async()=>new Response(JSON.stringify(body));await assert.rejects(()=>connect(options()));}assert.equal(count('provider'),0);
    });
    await test('invalid_credential_fields_rejected',async()=>{
      for(const settings of [null,{}, {api_key:key}, {api_key:'',from_email:sender},{api_key:'re_bad\r\n',from_email:sender},{api_key:key,from_email:'x\r\ny@example.invalid'}]){
        connector=async()=>new Response(JSON.stringify({items:[{settings}]}));await assert.rejects(()=>connect(options()));
      }assert.equal(count('provider'),0);
    });
    await test('invalid_hostname_rejected_before_fetch',async()=>{
      for(const hostname of ['https://evil.invalid','good.invalid@evil.invalid','good.invalid/path','good.invalid?x','good.invalid:443','good.invalid#x','', 'good.invalid\n'])await assert.rejects(()=>connect({...options(),hostname}));assert.equal(calls.length,0);
    });
    await test('invalid_identity_rejected_before_fetch',async()=>{
      for(const replIdentity of [undefined,'','bad\r\nidentity'])await assert.rejects(()=>connect({...options(),replIdentity}));assert.equal(calls.length,0);
    });
    await test('redirected_connector_response_rejected',async()=>{
      connector=async()=>({ok:true,redirected:true,json:async()=>fixture()});await assert.rejects(()=>connect(options()));assert.equal(count('provider'),0);
    });
    await test('retry_preserves_frozen_body_key_and_credentials',async()=>{
      const t=await connect(options()),body=makeBody(),signal=new AbortController().signal;
      assert.equal((await t.send(body,keyId,signal)).id,'email_fixture');
      connector=async()=>{throw Error('Unexpected credential refetch');};assert.equal((await t.send(body,keyId,signal)).id,'email_fixture');
      assert.equal(count('connector'),1);const sent=calls.filter(x=>x.kind==='provider');assert.equal(sent.length,2);
      for(const {init}of sent){assert.deepEqual(JSON.parse(init.body),body);assert.equal(new Headers(init.headers).get('Idempotency-Key'),keyId);assert.equal(new Headers(init.headers).get('Authorization'),'Bearer '+key);assert.equal(init.signal,signal);}
      assert.equal(sent[0].init.body,sent[1].init.body);assert.ok(Object.isFrozen(body));
    });
    await test('sender_and_key_mismatch_rejected_before_send',async()=>{
      const t=await connect(options()),signal=new AbortController().signal;
      await assert.rejects(()=>t.send(makeBody('other@example.invalid'),keyId,signal));
      for(const value of ['',undefined,'wrong-key','mmhb/billing/v1/'+'a'.repeat(63)])await assert.rejects(()=>t.send(makeBody(),value,signal));assert.equal(count('provider'),0);
    });
    await test('provider_error_shape_preserved',async()=>{
      const error={name:'validation_error',message:'Fixture rejection',statusCode:422};provider=async()=>new Response(JSON.stringify(error),{status:422});
      const t=await connect(options()),result=await t.send(makeBody(),keyId,new AbortController().signal);assert.equal(result.id,null);assert.deepEqual(result.error,error);
    });
    await test('malformed_acceptance_remains_ambiguous',async()=>{
      const t=await connect(options());for(const body of [{},{id:''},{id:' '},{id:42},null,{id:'x'.repeat(256)}]){
        provider=async()=>new Response(JSON.stringify(body));const result=await t.send(makeBody(),keyId,new AbortController().signal);
        assert.equal(result.id,null);assert.equal(result.error?.name,'application_error');
      }
    });
    await test('preaborted_connector_and_send_make_no_requests',async()=>{
      const controller=new AbortController();controller.abort();await assert.rejects(()=>connect({...options(),signal:controller.signal}));assert.equal(calls.length,0);
      const t=await connect(options());await assert.rejects(()=>t.send(makeBody(),keyId,controller.signal));assert.equal(count('provider'),0);
    });
    await test('inflight_sdk_abort_reaches_fetch',async()=>{
      const t=await connect(options()),controller=new AbortController();let seen;
      provider=async init=>{seen=init.signal;assert.equal(seen,controller.signal);return await new Promise((resolve,reject)=>{
        init.signal.addEventListener('abort',()=>reject(Object.assign(Error('Fixture aborted'),{fixture:true})),{once:true});queueMicrotask(()=>controller.abort());});};
      await assert.rejects(()=>t.send(makeBody(),keyId,controller.signal),{code:'provider_request_aborted'});assert.equal(seen,controller.signal);assert.ok(seen.aborted);assert.equal(count('provider'),1);
    });
    await test('connector_timeout_aborts_fetch',async()=>{
      let aborted=false;connector=async init=>await new Promise((resolve,reject)=>{init.signal.addEventListener('abort',()=>{aborted=true;reject(Object.assign(Error('Fixture timeout'),{fixture:true}));},{once:true});});
      const keepAlive=setTimeout(()=>{},15000);try{await assert.rejects(()=>connect(options()));assert.ok(aborted);}finally{clearTimeout(keepAlive);}assert.equal(count('provider'),0);
    });
    await test('sdk_endpoint_cannot_be_redirected_by_environment',async()=>{
      const previous=process.env.RESEND_BASE_URL;process.env.RESEND_BASE_URL='https://untrusted.example.invalid';
      try{const t=await connect(options());assert.equal((await t.send(makeBody(),keyId,new AbortController().signal)).id,'email_fixture');assert.equal(count('provider'),1);}
      finally{if(previous===undefined)delete process.env.RESEND_BASE_URL;else process.env.RESEND_BASE_URL=previous;}
    });
    const report={controls,tests:checks.length,pass:checks.filter(x=>x.pass).length,checks,transport:'MOCKED_FETCH',databaseConnections:0,realEmailsSent:0,releaseQualified:false};
    fs.writeFileSync(cfg.result,JSON.stringify(report,null,2),{flag:'wx',mode:0o600});console.log(JSON.stringify(report));
    process.exitCode=controls.length===2&&controls.every(x=>x.pass)&&checks.length===20&&checks.every(x=>x.pass)?0:1;
  }finally{globalThis.fetch=originalFetch;}
}
try{
  console.log('COMMAND_ID=MMHB-TRANSPORT-QUALIFICATION-20260924-26');
  check(JSON.parse(bytes(path.join(ROOT,'package.json'))).name==='mymentalhealthbuddy','Wrong project');
  check(!process.env.REPL_ID||process.env.REPL_ID==='9d71c4b8-8fcd-4b22-aee2-5883d9cbe5a4','Wrong Replit identity');
  check(git('rev-parse','--show-toplevel').trim()===ROOT,'Wrong repository root');
  before=state();const current=JSON.parse(before);
  check(current.head==='b3ce0daf53f52cab918dd0c40954f038ac68da9b'&&current.branch==='integration','Branch or HEAD changed');
  check(current.status===' M server/routes/webhook.mjs\n M server/services/email.mjs\n','Unexpected tracked changes');
  check(fs.lstatSync(PREVIOUS).isDirectory(),'Expected G25 evidence directory');
  const prior=JSON.parse(bytes(path.join(PREVIOUS,'summary.json')));
  check(prior.command==='MMHB-DELIVERY-CLASSIFICATION-20260924-25'&&prior.status==='DELIVERY_CLASSIFICATION_REPAIR_QUALIFIED_IN_ISOLATION'&&
    prior.tests===24&&prior.pass===24&&prior.disposableDatabaseStopped==='PASS','G25 qualification differs');
  const priorState=JSON.parse(bytes(path.join(PREVIOUS,'state.after.json')));
  for(const key of ['head','branch','index','status','diff','package','lock'])check(current[key]===priorState[key],'Reviewed checkout changed: '+key);
  check(hash(bytes(path.join(PREVIOUS,'billingDelivery.mjs')))==='39cee16ceae83013e500f10cbc3ccc9ccbfca8bd9f9ceafbdb5d2065c3d68f25','G25 component changed');
  const priorResult=JSON.parse(bytes(path.join(PREVIOUS,'result.json'))),sdk=JSON.parse(bytes(path.join(PREVIOUS,'sdk-probe.result.json')));
  check(priorResult.tests===24&&priorResult.pass===24&&priorResult.checks?.length===24&&priorResult.checks.every(x=>x.pass===true),'G25 delivery results differ');
  check(sdk.tests===6&&sdk.pass===6&&sdk.checks?.length===6&&sdk.checks.every(x=>x.pass===true),'G25 SDK results differ');
  const email=bytes(path.join(ROOT,'server/services/email.mjs'));
  check(hash(email)==='815fba3d724995e1f809f861be476b32facbad298b99bae1284bb225804929df','Email source changed');
  check(hash(bytes(path.join(ROOT,'server/routes/webhook.mjs')))==='5f09d685e57e53a79e959e650b8e2b6a60abda89e1b089e07ad6a16672095ba7','Webhook source changed');
  const req=require('node:module').createRequire(path.join(ROOT,'package.json'));
  check(JSON.parse(bytes(path.join(ROOT,'node_modules/resend/package.json'))).version==='6.24.0','Installed SDK changed');
  check(hash(bytes(req.resolve('resend')))===sdk.sdkEntrySha256,'SDK entry changed since G25');
  console.log('DEPENDENCIES='+JSON.stringify({node:process.version,resend:'6.24.0'}));
  directory=fs.mkdtempSync('/home/runner/mmhb-transport-qualify.');console.log('EVIDENCE_DIRECTORY='+directory);
  put('state.before.json',before);const baseline=put('email.baseline.mjs',email);
  const source="import * as crypto from 'node:crypto';\nexport const {connectBillingTransport}=("+transportFactory.toString()+")(crypto);\n";
  check(hash(source)==='c4757e3c030600af8bf4bb6d7946fc85195541b38e5c0534b8ba5608ec1892d4','Transport candidate hash differs');
  const component=put('billingEmailTransport.mjs',source);
  const harness=put('qualify.cjs','('+qualifyTransport.toString()+')().catch(e=>{console.error(e.message);process.exitCode=2;});\n');
  run('COMPONENT_SYNTAX',['--check',component]);run('HARNESS_SYNTAX',['--check',harness]);
  console.log('CANDIDATE_SHA256='+hash(bytes(component)));
  const result=path.join(directory,'result.json'),config=put('config.json',JSON.stringify({root:ROOT,component,baseline,result}));
  const execution=run('CONNECTOR_AND_SDK_TESTS',['--experimental-vm-modules',harness,config],45000,[0,1]);
  report=JSON.parse(bytes(result));
  console.log('BASELINE_CONTROLS='+JSON.stringify(report.controls));
  console.log('TRANSPORT_RESULT='+JSON.stringify({tests:report.tests,pass:report.pass,failed:report.checks?.filter(x=>!x.pass)}));
  check(execution.status===0&&report.controls?.length===2&&report.controls.every(x=>x.pass===true)&&
    report.tests===20&&report.pass===20&&report.checks?.length===20&&report.checks.every(x=>x.pass===true),'Transport qualification failed');
  status='CREDENTIAL_BOUND_TRANSPORT_QUALIFIED_IN_ISOLATION';
}catch(error){console.log('REASON='+error.message);process.exitCode=2;}
finally{
  if(before){try{const after=state();check(after===before,'Checkout changed during qualification');
    if(directory)put('state.after.json',after);console.log('TRACKED_SOURCE_AND_PACKAGE_FILES_PRESERVATION=PASS');
  }catch(error){status='STOPPED';process.exitCode=2;console.log('PRESERVATION_ERROR='+error.message);}}
  if(directory)put('summary.json',JSON.stringify({command:'MMHB-TRANSPORT-QUALIFICATION-20260924-26',status,
    tests:report?.tests,pass:report?.pass,sourceWrites:0,databaseConnections:0,realEmailsSent:0,releaseQualified:false},null,2));
  console.log('STATUS='+status+'\nSOURCE_WRITES_BY_COMMAND=0\nDATABASE_CONNECTIONS=0\nREAL_CONNECTOR_CALLS=0\nREAL_EMAILS_SENT=0');
  console.log('G25_DELIVERY_COMPONENT=PRESERVED\nAPPLICATION_INTEGRATION=PENDING\nMMHB_BILLING_TEMPLATES=PENDING');
  console.log('FULL_APP_TESTS=NOT_RUN:ISOLATED_TRANSPORT_ONLY\nCOMMIT=NOT_RUN\nPUSH=NOT_RUN\nDEPLOY=NOT_RUN\nRELEASE_QUALIFIED=false');
  if(directory)console.log('EVIDENCE_DIRECTORY='+directory);
  console.log('NEXT_ACTION=RETURN_FULL_OUTPUT\nREPORT_END=MMHB-TRANSPORT-QUALIFICATION-20260924-26');
}
MMHB26_NODE
)
