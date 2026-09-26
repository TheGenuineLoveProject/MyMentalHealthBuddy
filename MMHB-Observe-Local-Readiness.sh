#!/usr/bin/env bash
set -euo pipefail
umask 077
cd /home/runner/workspace
node --input-type=commonjs <<'MMHB57_NODE'
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {spawnSync}=require('node:child_process');
const ROOT='/home/runner/workspace';
const pins={
 'server/app.mjs':'b45e08aeac03fff78f4bb932b035ada905dad1566298e8b3537957ca553620d7',
 'server/startupReadiness.mjs':'22747454dfdbd1e04e1f82c6e6ae046206d2ef16e0a40c8ea26fec33403e60f3',
 'server/db/ensureSchema.mjs':'f8db060b03d1b85c632cc8a183d9843fe05701a73fdcd9e3a2c752fdafacf451'};
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const check=(ok,msg)=>{if(!ok)throw Error(msg);};
const env={PATH:process.env.PATH||'/usr/bin:/bin',LANG:'C.UTF-8',GIT_OPTIONAL_LOCKS:'0',GIT_NO_LAZY_FETCH:'1'};
function read(file){const s=fs.lstatSync(file);check(s.isFile()&&s.size<=4194304&&fs.realpathSync(file)===file,'Unsafe input');return fs.readFileSync(file);}
function git(...args){const r=spawnSync('git',['--no-pager','--no-optional-locks','-c','core.fsmonitor=false',...args],{cwd:ROOT,env,encoding:'utf8',timeout:15000,maxBuffer:33554432});check(!r.error&&r.status===0,'Git inspection failed');return r.stdout;}
function state(){return JSON.stringify({head:git('rev-parse','HEAD').trim(),branch:git('branch','--show-current').trim(),status:git('status','--porcelain=v1','--untracked-files=normal'),index:hash(read(path.resolve(ROOT,git('rev-parse','--git-path','index').trim()))),diff:hash(git('diff','--binary','--no-ext-diff','--no-textconv','HEAD')),package:hash(read(ROOT+'/package.json')),lock:hash(read(ROOT+'/package-lock.json')),files:Object.fromEntries(Object.keys(pins).map(p=>[p,hash(read(ROOT+'/'+p))]))});}
async function observe(origin,method,route){
 const start=Date.now();const row={method,route};
 try{
  const response=await fetch(origin+route,{method,redirect:'manual',signal:AbortSignal.timeout(5000),headers:{Accept:'application/json'}});
  row.httpStatus=response.status;
  row.noStore=(response.headers.get('cache-control')||'').split(',').some(s=>s.trim().toLowerCase()==='no-store');
  if(method==='GET'){
   const reader=response.body?.getReader();let bytes=0,chunks=[];
   if(reader)try{for(;;){const {done,value}=await reader.read();if(done)break;bytes+=value.length;if(bytes>4096){row.body='TOO_LARGE';await reader.cancel();break;}chunks.push(Buffer.from(value));}}finally{reader.releaseLock();}
   if(row.body!=='TOO_LARGE'){
    let data;try{data=JSON.parse(Buffer.concat(chunks).toString('utf8'));}catch{row.body='NON_JSON';}
    if(data&&typeof data==='object'&&!Array.isArray(data)){
     row.body='JSON';row.ok=typeof data.ok==='boolean'?data.ok:null;
     row.status=['ready','not_ready','healthy','ok','degraded','error'].includes(data.status)?data.status:null;
     row.readinessShape=Object.keys(data).sort().join(',')==='ok,status';
    }
   }
  }
 }catch(e){row.error=e.name==='TimeoutError'?'TIMEOUT':e.cause?.code==='ECONNREFUSED'?'CONNECTION_REFUSED':'REQUEST_FAILED';}
 row.elapsedMs=Date.now()-start;return row;
}
async function main(){let directory,status='STOPPED';
try{
 console.log('COMMAND_ID=MMHB-LOCAL-READINESS-OBSERVATION-20260925-57');
 check(JSON.parse(read(ROOT+'/package.json')).name==='mymentalhealthbuddy','Project identity mismatch');
 check(!process.env.REPL_ID||process.env.REPL_ID==='9d71c4b8-8fcd-4b22-aee2-5883d9cbe5a4','Replit identity mismatch');
 check(git('rev-parse','--show-toplevel').trim()===ROOT,'Repository root mismatch');
 const before=state(),current=JSON.parse(before);
 check(current.branch==='integration','Unexpected branch');
 for(const [p,h]of Object.entries(pins))check(current.files[p]===h,'Applied source changed: '+p);
 const raw=process.env.PORT||'5000';check(/^\d{1,5}$/.test(raw)&&Number(raw)>0&&Number(raw)<=65535,'Invalid local PORT');
 const origin='http://127.0.0.1:'+Number(raw);
 console.log('CURRENT='+JSON.stringify({head:current.head,branch:current.branch}));
 console.log('APPLIED_SOURCE_PINS=PASS\nTARGET='+origin+'\nTARGET_SELECTION=SHELL_PORT_OR_DEFAULT_5000');
 const rows=[];for(const [method,route]of [['GET','/healthz'],['GET','/ready'],['GET','/readyz'],['GET','/api/ready'],['GET','/api/readyz'],['HEAD','/readyz']]){
  const row=await observe(origin,method,route);rows.push(row);console.log('HTTP_OBSERVATION='+JSON.stringify(row));
 }
 check(state()===before,'Observed checkout changed during requests');
 const ready=rows.slice(1);
 status=rows.some(x=>x.error)?'LOCAL_HTTP_OBSERVATION_INCOMPLETE':
 ready.every(x=>x.httpStatus===200)&&ready.filter(x=>x.method==='GET').every(x=>x.ok===true&&x.status==='ready'&&x.readinessShape&&x.noStore)?'LOCAL_HTTP_REPORTS_READY_SOURCE_PROVENANCE_UNVERIFIED':
 ready.some(x=>x.httpStatus===503)?'LOCAL_HTTP_REPORTS_NOT_READY':'LOCAL_HTTP_RESPONSE_CONTRACT_DIFFERS';
 const parent=ROOT+'/.git/mmhb-review-evidence';check(fs.realpathSync(parent)===parent&&fs.lstatSync(parent).isDirectory(),'Unsafe evidence parent');
 directory=fs.mkdtempSync(parent+'/local-readiness-');fs.chmodSync(directory,0o700);
 fs.writeFileSync(directory+'/summary.json',JSON.stringify({status,head:current.head,target:origin,rows,sourcePreserved:true,runtimeSourceProvenance:'UNVERIFIED',releaseQualified:false},null,2),{flag:'wx',mode:0o600});
 console.log('OBSERVED_CHECKOUT_PRESERVATION=PASS');
}catch(e){console.log('REASON='+JSON.stringify(e.message));process.exitCode=2;}
console.log('STATUS='+status);
if(directory)console.log('EVIDENCE_DIRECTORY='+directory);
console.log('SERVER_START_RESTART_STOP_BY_COMMAND=NOT_RUN\nSOURCE_WRITES_BY_COMMAND=0');
console.log('DATABASE_CONNECTIONS_BY_COMMAND=0;EXISTING_SERVER_BEHAVIOR_NOT_INSTRUMENTED');
console.log('RUNTIME_SOURCE_PROVENANCE=UNVERIFIED\nFULL_APP_TESTS=NOT_RUN:LOCAL_HTTP_OBSERVATION_ONLY');
console.log('COMMIT_PUSH_DEPLOY=NOT_RUN\nRELEASE_QUALIFIED=false\nNEXT_ACTION=RETURN_FULL_OUTPUT');
console.log('REPORT_END=MMHB-LOCAL-READINESS-OBSERVATION-20260925-57');
}
main().catch(()=>{console.log('STATUS=STOPPED_UNEXPECTED_ERROR');process.exitCode=2;});
MMHB57_NODE
