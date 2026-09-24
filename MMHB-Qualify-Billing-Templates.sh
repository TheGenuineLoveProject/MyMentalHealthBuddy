(
set -eu
umask 077
cd /home/runner/workspace
node --input-type=commonjs <<'MMHB27_NODE'
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {spawnSync}=require('node:child_process');
const ROOT='/home/runner/workspace';
const PREVIOUS='/home/runner/mmhb-transport-qualify.k6d6J4';
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
function templateFactory() {
  const check=(ok,code)=>{if(!ok)throw Object.assign(Error('Billing template: '+code),{code});};
  const controls=/[\x00-\x1f\x7f]/,bidi=/[\u061c\u200e\u200f\u202a-\u202e\u2066-\u2069]/;
  const header=(value,max)=>typeof value==='string'&&value.length>0&&value.length<=max&&
    value.trim()===value&&!controls.test(value)&&!bidi.test(value);
  function recipient(value) {
    if(!header(value,255)||/[\s<>,;:"\\]/.test(value))return false;
    const parts=value.split('@');return parts.length===2&&parts.every(part=>part.length>0);
  }
  const escape=value=>value.replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  function renderBillingNotification(input,fromEmail) {
    check(input&&typeof input==='object'&&!Array.isArray(input),'invalid_notification');
    const {kind,payload}=input;
    check(['upgrade','cancellation'].includes(kind),'invalid_notification_kind');
    check(payload&&typeof payload==='object'&&!Array.isArray(payload)&&payload.version===1,'invalid_intent_payload');
    check(recipient(payload.recipient),'invalid_recipient');
    check(typeof payload.name==='string'&&payload.name.length<=1000,'invalid_recipient_name');
    check(payload.periodEnd===null||(Number.isSafeInteger(payload.periodEnd)&&payload.periodEnd>=0),'invalid_period_end');
    check(header(fromEmail,320),'invalid_sender');
    check(!/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(payload.name)&&!bidi.test(payload.name),'invalid_recipient_name');
    const name=payload.name.replace(/\s+/g,' ').trim()||'friend';
    const subject=kind==='upgrade'?'MyMentalHealthBuddy subscription update':'MyMentalHealthBuddy cancellation update';
    const greeting='Hello '+name+',';
    const message=kind==='upgrade'
      ?'We recorded a subscription update for your MyMentalHealthBuddy account.'
      :'We recorded a cancellation update for your MyMentalHealthBuddy subscription.';
    const instruction='Sign in to review your current plan and billing details.';
    const homepage='https://mymentalhealthbuddy.com/';
    const text=[subject,'',greeting,'',message,'',instruction,'','Open MyMentalHealthBuddy: '+homepage].join('\n');
    const html='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>'+
      '<body style="margin:0;padding:20px;background:#faf9f7;color:#202020;font-family:Arial,Helvetica,sans-serif;line-height:1.6;">'+
      '<main style="max-width:600px;margin:0 auto;width:100%;">'+
      '<h1 style="font-size:24px;line-height:1.3;margin:0 0 24px;">'+subject+'</h1>'+
      '<p>'+escape(greeting)+'</p><p>'+message+'</p><p>'+instruction+'</p>'+
      '<p><a href="'+homepage+'" style="color:#174f47;text-decoration:underline;">Open MyMentalHealthBuddy</a></p>'+
      '</main></body></html>';
    return Object.freeze({from:fromEmail,to:payload.recipient,subject,html,text});
  }
  return {renderBillingNotification};
}
async function qualifyTemplates() {
  const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
  const crypto=require('node:crypto'),{pathToFileURL}=require('node:url');
  const cfg=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
  const {renderBillingNotification:render}=await import(pathToFileURL(cfg.component).href);
  const {prepareDelivery}=await import(pathToFileURL(cfg.delivery).href);
  const sender='MyMentalHealthBuddy <billing@example.invalid>',recipient='fixture@example.invalid';
  const input=(kind='upgrade',changes={})=>({kind,payload:{version:1,recipient,name:'Fixture User',periodEnd:null,...changes}});
  const controls=[],checks=[];let network=0;const originalFetch=globalThis.fetch;
  globalThis.fetch=async()=>{network++;throw Error('Unexpected network request');};
  async function test(name,fn,control=false){try{await fn();assert.equal(network,0);(control?controls:checks).push({name,pass:true});}
    catch(e){(control?controls:checks).push({name,pass:false,error:String(e.message).slice(0,500)});}}
  try{
    const sent=[];class FixtureResend{constructor(){this.emails={send:async body=>{sent.push(body);return{data:{id:'fixture'},error:null};}};}}
    const context=vm.createContext({process:{env:{REPLIT_CONNECTORS_HOSTNAME:'connector.example.invalid',REPL_IDENTITY:'fixture_identity'}},AbortSignal,
      fetch:async url=>{assert.equal(url,'https://connector.example.invalid/api/v2/connection?include_secrets=true&connector_names=resend');
        return{json:async()=>({items:[{settings:{api_key:'re_fixture_only',from_email:sender}}]})};}});
    const legacy=new vm.SourceTextModule(fs.readFileSync(cfg.baseline,'utf8'),{context});
    await legacy.link(name=>{assert.ok(['resend','../utils/logger.mjs'].includes(name));const key=name==='resend'?'Resend':'logger';
      return new vm.SyntheticModule([key],function(){this.setExport(key,key==='Resend'?FixtureResend:{info(){},error(){}});},{context});});await legacy.evaluate();
    await test('legacy_brand_and_entitlement_claims',async()=>{
      sent.length=0;await legacy.namespace.sendUpgradeConfirmation(recipient,'Fixture');await legacy.namespace.sendCancellationAcknowledgment(recipient,'Fixture',1800000000);
      assert.equal(sent.length,2);for(const body of sent){assert.match(body.html,/The Genuine Love Project/);assert.match(body.html,/https:\/\/genuineloveproject\.com\/account\/billing/);}
      assert.match(sent[0].html,/all premium tools are unlocked/);assert.match(sent[1].html,/continue to have access to all Pro features/);
    },true);
    await test('legacy_name_is_raw_html',async()=>{
      sent.length=0;const name='<img src=x onerror="alert(1)">';
      await legacy.namespace.sendUpgradeConfirmation(recipient,name);await legacy.namespace.sendCancellationAcknowledgment(recipient,name,null);
      assert.equal(sent.length,2);for(const body of sent)assert.ok(body.html.includes(name));
    },true);
    await test('upgrade_uses_neutral_mmhb_copy',async()=>{
      const body=render(input(),sender);assert.equal(body.from,sender);assert.equal(body.to,recipient);
      assert.equal(body.subject,'MyMentalHealthBuddy subscription update');assert.ok(body.text.includes('We recorded a subscription update for your MyMentalHealthBuddy account.'));
      assert.doesNotMatch(body.html,/Genuine Love|genuineloveproject|premium tools|Unlimited AI|Welcome to Pro/);
    });
    await test('cancellation_has_no_access_or_retention_promise',async()=>{
      const body=render(input('cancellation',{periodEnd:1800000000}),sender);
      assert.equal(body.subject,'MyMentalHealthBuddy cancellation update');assert.ok(body.text.includes('We recorded a cancellation update for your MyMentalHealthBuddy subscription.'));
      assert.doesNotMatch(body.html,/Pro features|until|nothing gets deleted|always be free|1800000000/);
    });
    await test('name_is_text_not_html_markup',async()=>{
      const name='<img src=x onerror="alert(1)"> & \'friend\'',body=render(input('upgrade',{name}),sender);
      assert.ok(body.html.includes('&lt;img src=x onerror=&quot;alert(1)&quot;&gt; &amp; &#39;friend&#39;'));
      assert.ok(!body.html.includes('<img'));assert.ok(body.text.includes(name));
    });
    await test('unicode_and_blank_names_are_readable',async()=>{
      for(const name of ['María 李','أمل']){const body=render(input('upgrade',{name}),sender);assert.ok(body.html.includes(name));assert.ok(body.text.includes(name));}
      assert.ok(render(input('upgrade',{name:' \t\n'}),sender).text.includes('Hello friend,'));
      assert.ok(render(input('upgrade',{name:'A\r\n B'}),sender).text.includes('Hello A B,'));
    });
    await test('unsupported_kind_version_and_shape_fail',async()=>{
      for(const value of [null,[],{},input('welcome'),{kind:'upgrade',payload:null},input('upgrade',{version:2}),input('upgrade',{version:'1'})])assert.throws(()=>render(value,sender));
    });
    await test('recipient_header_and_list_injection_fail',async()=>{
      for(const value of ['',null,[], 'x@example.invalid\r\nBcc:y@example.invalid','x@example.invalid,y@example.invalid','<x@example.invalid>','x @example.invalid','x@@example.invalid','x@example.invalid;z@example.invalid','x'.repeat(256)])assert.throws(()=>render(input('upgrade',{recipient:value}),sender));
      assert.equal(render(input('upgrade',{recipient:'maria+tag@example.invalid'}),sender).to,'maria+tag@example.invalid');
      assert.equal(render(input('upgrade',{recipient:'δοκιμή@παράδειγμα.δοκιμή'}),sender).to,'δοκιμή@παράδειγμα.δοκιμή');
    });
    await test('sender_is_required_and_preserved',async()=>{
      for(const value of [undefined,null,'',' x@example.invalid','x\r\nBcc:y','x'.repeat(321)])assert.throws(()=>render(input(),value));
      assert.equal(render(input(),sender).from,sender);
    });
    await test('name_bounds_and_unsafe_controls_fail',async()=>{
      for(const name of [null,42,'x'.repeat(1001),'A\0B','A\u202eB'])assert.throws(()=>render(input('upgrade',{name}),sender));
      const body=render(input('upgrade',{name:'&'.repeat(1000)}),sender);assert.ok(Buffer.byteLength(JSON.stringify(body))<262144);
    });
    await test('period_end_is_validated_without_access_inference',async()=>{
      for(const periodEnd of [-1,1.5,'1800000000',undefined,Infinity])assert.throws(()=>render(input('cancellation',{periodEnd}),sender));
      const a=render(input('cancellation'),sender);for(const periodEnd of [0,1800000000,Number.MAX_SAFE_INTEGER])assert.deepEqual(render(input('cancellation',{periodEnd}),sender),a);
    });
    await test('frozen_output_and_unchanged_inputs',async()=>{
      const value=input(),before=JSON.stringify(value);Object.freeze(value.payload);Object.freeze(value);
      const a=render(value,sender),b=render(value,sender);assert.deepEqual(a,b);assert.equal(JSON.stringify(value),before);
      assert.ok(Object.isFrozen(a));assert.equal(Reflect.set(a,'subject','Changed'),false);
      assert.deepEqual(Object.keys(a),['from','to','subject','html','text']);assert.ok(Object.values(a).every(x=>typeof x==='string'));
    });
    await test('rendering_does_not_depend_on_timezone',async()=>{
      const previous=process.env.TZ;try{process.env.TZ='Pacific/Honolulu';const a=render(input('cancellation',{periodEnd:1800000000}),sender);
        process.env.TZ='Asia/Tokyo';assert.deepEqual(render(input('cancellation',{periodEnd:1800000000}),sender),a);
      }finally{if(previous===undefined)delete process.env.TZ;else process.env.TZ=previous;}
    });
    await test('both_bodies_satisfy_g25_freeze_contract',async()=>{
      for(const kind of ['upgrade','cancellation']){
        const value=input(kind),body=render(value,sender),trace=[];let saved,released=0;
        const identity={eventId:'evt_template',kind,userId:'11111111-1111-4111-8111-111111111111'},scope='a'.repeat(64);
        const client={async query(sql,params){if(['BEGIN','COMMIT','ROLLBACK'].includes(sql)){trace.push(sql);return{rows:[],rowCount:0};}
          if(sql.startsWith('SELECT payload FROM public.billing_notification_intents')){trace.push('SELECT');assert.deepEqual(params,[identity.eventId,kind,identity.userId]);return{rows:[{payload:value.payload}],rowCount:1};}
          if(sql.startsWith('INSERT INTO public.billing_notification_deliveries')){trace.push('INSERT');saved=params;return{rows:[{status:'pending'}],rowCount:1};}
          throw Error('Unexpected scripted database statement');},release(){released++;}};
        const result=await prepareDelivery({connect:async()=>client},identity,body,scope);
        assert.equal(result.created,true);assert.equal(result.status,'pending');assert.equal(saved[4],JSON.stringify(body));
        assert.equal(saved[5],crypto.createHash('sha256').update(saved[4]).digest('hex'));assert.equal(saved[3],scope);
        assert.deepEqual(trace,['BEGIN','SELECT','INSERT','COMMIT']);assert.equal(released,1);
      }
    });
    await test('fixed_mmhb_link_and_minimal_headers',async()=>{
      for(const kind of ['upgrade','cancellation']){
        const value=input(kind,{name:'Private Name',html:'<script>bad</script>',subject:'Override',url:'https://evil.invalid/'}),body=render(value,sender);
        assert.deepEqual([...body.html.matchAll(/href="([^"]+)"/g)].map(x=>x[1]),['https://mymentalhealthbuddy.com/']);
        assert.match(body.html,/<html lang="en">/);assert.match(body.html,/<h1[ >]/);assert.doesNotMatch(body.html,/<script|<iframe|<img|evil\.invalid/);
        assert.ok(body.text.includes('https://mymentalhealthbuddy.com/'));assert.ok(!body.subject.includes('Private Name'));assert.ok(!body.subject.includes(recipient));
        fs.writeFileSync(path.join(cfg.directory,kind+'.preview.html'),body.html,{flag:'wx',mode:0o600});
        fs.writeFileSync(path.join(cfg.directory,kind+'.preview.txt'),body.text,{flag:'wx',mode:0o600});
      }
    });
    const report={controls,tests:checks.length,pass:checks.filter(x=>x.pass).length,checks,networkCalls:network,
      database:'SCRIPTED_POOL_NO_CONNECTIONS',realEmailsSent:0,releaseQualified:false};
    fs.writeFileSync(cfg.result,JSON.stringify(report,null,2),{flag:'wx',mode:0o600});console.log(JSON.stringify(report));
    process.exitCode=controls.length===2&&controls.every(x=>x.pass)&&checks.length===13&&checks.every(x=>x.pass)?0:1;
  }finally{globalThis.fetch=originalFetch;}
}
try{
  console.log('COMMAND_ID=MMHB-TEMPLATE-QUALIFICATION-20260924-27');
  check(JSON.parse(bytes(path.join(ROOT,'package.json'))).name==='mymentalhealthbuddy','Wrong project');
  check(!process.env.REPL_ID||process.env.REPL_ID==='9d71c4b8-8fcd-4b22-aee2-5883d9cbe5a4','Wrong Replit identity');
  check(git('rev-parse','--show-toplevel').trim()===ROOT,'Wrong repository root');
  before=state();const current=JSON.parse(before);
  check(current.head==='b3ce0daf53f52cab918dd0c40954f038ac68da9b'&&current.branch==='integration','Branch or HEAD changed');
  check(current.status===' M server/routes/webhook.mjs\n M server/services/email.mjs\n','Unexpected tracked changes');
  check(fs.lstatSync(PREVIOUS).isDirectory(),'Expected G26 evidence directory');
  const prior=JSON.parse(bytes(path.join(PREVIOUS,'summary.json'))),priorResult=JSON.parse(bytes(path.join(PREVIOUS,'result.json')));
  check(prior.command==='MMHB-TRANSPORT-QUALIFICATION-20260924-26'&&prior.status==='CREDENTIAL_BOUND_TRANSPORT_QUALIFIED_IN_ISOLATION'&&
    prior.tests===20&&prior.pass===20,'G26 qualification differs');
  check(priorResult.tests===20&&priorResult.pass===20&&priorResult.checks?.length===20&&priorResult.checks.every(x=>x.pass===true)&&
    priorResult.controls?.length===2&&priorResult.controls.every(x=>x.pass===true),'G26 results differ');
  const priorState=JSON.parse(bytes(path.join(PREVIOUS,'state.after.json')));
  for(const key of ['head','branch','index','status','diff','package','lock'])check(current[key]===priorState[key],'Reviewed checkout changed: '+key);
  check(hash(bytes(path.join(PREVIOUS,'billingEmailTransport.mjs')))==='c4757e3c030600af8bf4bb6d7946fc85195541b38e5c0534b8ba5608ec1892d4','G26 transport changed');
  const email=bytes(path.join(ROOT,'server/services/email.mjs'));
  check(hash(email)==='815fba3d724995e1f809f861be476b32facbad298b99bae1284bb225804929df','Email source changed');
  check(hash(bytes(path.join(ROOT,'server/routes/webhook.mjs')))==='5f09d685e57e53a79e959e650b8e2b6a60abda89e1b089e07ad6a16672095ba7','Webhook source changed');
  const core=bytes('/home/runner/mmhb-delivery-classify.ipBScd/billingDelivery.mjs');
  check(hash(core)==='39cee16ceae83013e500f10cbc3ccc9ccbfca8bd9f9ceafbdb5d2065c3d68f25','G25 delivery component changed');
  directory=fs.mkdtempSync('/home/runner/mmhb-template-qualify.');console.log('EVIDENCE_DIRECTORY='+directory);
  put('state.before.json',before);const baseline=put('email.baseline.mjs',email),delivery=put('billingDelivery.mjs',core);
  const source='export const {renderBillingNotification}=('+templateFactory.toString()+')();\n';
  check(hash(source)==='cdb91217cea6ea6fb1bee2633a0f9b396d3d9a452acafd37a6d1491a37bd8e34','Template candidate hash differs');
  const component=put('billingNotificationTemplate.mjs',source);
  const harness=put('qualify.cjs','('+qualifyTemplates.toString()+')().catch(e=>{console.error(e.message);process.exitCode=2;});\n');
  run('COMPONENT_SYNTAX',['--check',component]);run('HARNESS_SYNTAX',['--check',harness]);
  console.log('CANDIDATE_SHA256='+hash(bytes(component))+'\nDEPENDENCIES=NODE_BUILTINS_ONLY');
  const result=path.join(directory,'result.json'),config=put('config.json',JSON.stringify({directory,component,baseline,delivery,result}));
  const execution=run('TEMPLATE_AND_FREEZE_TESTS',['--experimental-vm-modules',harness,config],20000,[0,1]);
  report=JSON.parse(bytes(result));
  console.log('BASELINE_CONTROLS='+JSON.stringify(report.controls));
  console.log('TEMPLATE_RESULT='+JSON.stringify({tests:report.tests,pass:report.pass,failed:report.checks?.filter(x=>!x.pass)}));
  check(execution.status===0&&report.controls?.length===2&&report.controls.every(x=>x.pass===true)&&report.networkCalls===0&&
    report.tests===13&&report.pass===13&&report.checks?.length===13&&report.checks.every(x=>x.pass===true),'Template qualification failed');
  for(const kind of ['upgrade','cancellation'])console.log('PREVIEW='+JSON.stringify({kind,text:bytes(path.join(directory,kind+'.preview.txt')).toString('utf8')}));
  status='MMHB_BILLING_TEMPLATES_QUALIFIED_IN_ISOLATION';
}catch(error){console.log('REASON='+error.message);process.exitCode=2;}
finally{
  if(before){try{const after=state();check(after===before,'Checkout changed during qualification');
    if(directory)put('state.after.json',after);console.log('TRACKED_SOURCE_AND_PACKAGE_FILES_PRESERVATION=PASS');
  }catch(error){status='STOPPED';process.exitCode=2;console.log('PRESERVATION_ERROR='+error.message);}}
  if(directory)put('summary.json',JSON.stringify({command:'MMHB-TEMPLATE-QUALIFICATION-20260924-27',status,
    tests:report?.tests,pass:report?.pass,sourceWrites:0,databaseConnections:0,realEmailsSent:0,releaseQualified:false},null,2));
  console.log('STATUS='+status+'\nSOURCE_WRITES_BY_COMMAND=0\nDATABASE_CONNECTIONS=0\nREAL_CONNECTOR_CALLS=0\nREAL_EMAILS_SENT=0');
  console.log('G25_AND_G26_COMPONENTS=PRESERVED\nCOMBINED_PIPELINE_QUALIFICATION=PENDING\nAPPLICATION_INTEGRATION=PENDING');
  console.log('FULL_APP_TESTS=NOT_RUN:ISOLATED_TEMPLATE_ONLY\nCOMMIT=NOT_RUN\nPUSH=NOT_RUN\nDEPLOY=NOT_RUN\nRELEASE_QUALIFIED=false');
  if(directory)console.log('EVIDENCE_DIRECTORY='+directory);
  console.log('NEXT_ACTION=RETURN_FULL_OUTPUT\nREPORT_END=MMHB-TEMPLATE-QUALIFICATION-20260924-27');
}
MMHB27_NODE
)
