#!/usr/bin/env bash
set -euo pipefail
umask 077
cd /home/runner/workspace
node --input-type=commonjs <<'MMHB52_NODE'
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {spawnSync}=require('node:child_process');
const ROOT='/home/runner/workspace';
const PRIOR=ROOT+'/.git/mmhb-review-evidence/billing-tls-LfviDA';
const ID='MMHB-BOOT-READINESS-SOURCE-20260925-52';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const check=(ok,msg)=>{if(!ok)throw Error(msg);};
const inputs=new Map();let before,directory,status='STOPPED';
const env={PATH:process.env.PATH||'/usr/bin:/bin',LANG:'C.UTF-8',GIT_OPTIONAL_LOCKS:'0',GIT_NO_LAZY_FETCH:'1'};
function git(...args){
 const r=spawnSync('git',['--no-pager','--no-optional-locks','-c','core.fsmonitor=false',
 '-c','core.quotePath=true',...args],{cwd:ROOT,env,encoding:'utf8',timeout:30000,maxBuffer:33554432});
 check(!r.error&&r.status===0,'Git inspection failed: '+args[0]);return r.stdout;
}
function read(file){
 const s=fs.lstatSync(file);
 check(s.isFile()&&s.size<=2097152&&fs.realpathSync(file)===file,'Unsafe or oversized input: '+file);
 const b=fs.readFileSync(file),h=sha(b);
 if(inputs.has(file))check(inputs.get(file)===h,'Input changed during inspection');
 else inputs.set(file,h);return b;
}
function state(){
 const index=path.resolve(ROOT,git('rev-parse','--git-path','index').trim());
 return JSON.stringify({head:git('rev-parse','HEAD').trim(),branch:git('branch','--show-current').trim(),
 index:sha(read(index)),status:git('status','--porcelain=v1','--untracked-files=normal'),
 diff:sha(git('diff','--binary','--no-ext-diff','--no-textconv','HEAD','--')),
 package:sha(read(ROOT+'/package.json')),lock:sha(read(ROOT+'/package-lock.json'))});
}
  function redact(value){return value
    .replace(/-----BEGIN [^-]*PRIVATE KEY-----[\s\S]*?-----END [^-]*PRIVATE KEY-----/g,'[REDACTED_PRIVATE_KEY]')
    .replace(/\b(?:postgres(?:ql)?|mysql|mongodb(?:\+srv)?):\/\/[^\s'"`<>]+/gi,'[REDACTED_DATABASE_URL]')
    .replace(/(https?:\/\/)[^\s/@'"`]+:[^\s/@'"`]+@/gi,'$1[REDACTED_USERINFO]@')
    .replace(/([?&](?:api[_-]?key|(?:access|refresh|auth)[_-]?token|token|secret|password|signature|authorization)=)[^&\s'"`]+/gi,'$1[REDACTED]')
    .replace(/\b(?:sk|rk)_(?:live|test)_[A-Za-z0-9_-]+\b|\bre_[A-Za-z0-9_-]{12,}\b|\bgh[pousr]_[A-Za-z0-9_]+\b/g,'[REDACTED_API_KEY]')
    .replace(/\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g,'[REDACTED_JWT]')
    .replace(/(Bearer\s+)[A-Za-z0-9._~-]{12,}/gi,'$1[REDACTED]')
    .replace(/([\w$]*(?:password|secret|token|api_?key|private_?key)[\w$]*["']?\s*[:=]\s*)(["'`])((?:\\[\s\S]|(?!\2)[\s\S])*)\2/gi,'$1$2[REDACTED]$2')
    .replace(/\b([A-Z0-9_]*(?:KEY|TOKEN|SECRET|PASSWORD)[A-Z0-9_]*=)([^\s"'`;$]+)/g,'$1[REDACTED]');}

try{
 console.log('COMMAND_ID='+ID);
 check(JSON.parse(read(ROOT+'/package.json')).name==='mymentalhealthbuddy','Project identity mismatch');
 check(!process.env.REPL_ID||process.env.REPL_ID==='9d71c4b8-8fcd-4b22-aee2-5883d9cbe5a4','Replit identity mismatch');
 check(git('rev-parse','--show-toplevel').trim()===ROOT,'Repository root mismatch');
 before=state();const current=JSON.parse(before);
 check(current.branch==='integration','Unexpected branch');
 const summary=JSON.parse(read(PRIOR+'/summary.json'));
 check(summary.command==='MMHB-TLS-IDENTITY-PROJECTION-QUALIFICATION-20260925-51'&&
 summary.status==='BILLING_PRODUCTION_MODE_TLS_QUALIFIED_WITH_LOCAL_FIXTURE'&&
 summary.tests===8&&summary.pass===8&&summary.sourcePreserved===true&&
 summary.baselineIdentityReproduced===true&&summary.disposableDatabaseStopped==='PASS'&&
 summary.runtimeModuleConfinement===true,'G51 successful summary required');
 const result=JSON.parse(read(PRIOR+'/candidate.tls.result.json'));
 check(result.tests===8&&result.pass===8&&result.checks?.length===8&&result.checks.every(x=>x.pass===true)&&
 result.controls?.length===1&&result.controls[0].pass===true&&result.externalCalls===0&&
 result.runtimeModuleConfinement===true&&!result.preflightError&&!result.cleanupError,'G51 results differ');
 const rows=JSON.parse(read(PRIOR+'/candidate-manifest.json'));
 check(Array.isArray(rows)&&rows.length<=20000,'Invalid candidate manifest');
 const pins=new Map();for(const row of rows){
 check(typeof row.file==='string'&&/^[a-f0-9]{64}$/.test(row.sha256)&&!pins.has(row.file),'Invalid manifest row');
 pins.set(row.file,row.sha256);
 }
 const files=['server/app.mjs','server/db/ensureSchema.mjs','server/db/client.mjs',
 'server/db/connection.mjs','server/billing/application.mjs','server/billing/billingRuntime.mjs',
 'server/billing/billingShutdown.mjs','server/routes/health.mjs'];
 const report=['COMMAND_ID='+ID,'CURRENT='+JSON.stringify({head:current.head,branch:current.branch}),
 'G51_HEAD_MATCH='+String(current.head===summary.head),
 'SCOPE=PINNED_STAGED_BOOT_SOURCE;NOT_RUNTIME_QUALIFICATION',
 'REDACTION=BEST_EFFORT;REVIEW_BEFORE_SHARING'];
 let total=0;
 for(const rel of files){
  check(pins.has(rel),'Required candidate input missing: '+rel);
  const b=read(PRIOR+'/candidate/'+rel);check(sha(b)===pins.get(rel),'Candidate hash differs: '+rel);
  total+=b.length;check(total<=262144,'Boot source capture exceeds 256 KiB');
  let live='MISSING';try{live=sha(read(ROOT+'/'+rel));}catch(e){if(e.code!=='ENOENT')throw e;}
  const text=redact(b.toString('utf8'));
  report.push('SOURCE='+JSON.stringify({file:rel,sha256:sha(b),bytes:b.length,liveSha256:live,
   matchesLive:live===sha(b),redacted:text!==b.toString('utf8')}));
  report.push(text.split('\n').map((line,i)=>(i+1)+'|'+line).join('\n'));
 }
 const pkg=JSON.parse(read(ROOT+'/package.json'));
 report.push('PACKAGE_SCRIPTS='+redact(JSON.stringify(pkg.scripts||{})));
 for(const [file,pin]of inputs)check(sha(fs.readFileSync(file))===pin,'Input changed: '+file);
 check(state()===before,'Checkout changed during inspection');
 const parent=ROOT+'/.git/mmhb-review-evidence';
 check(fs.realpathSync(parent)===parent&&fs.lstatSync(parent).isDirectory(),'Unexpected evidence parent');
 directory=fs.mkdtempSync(parent+'/boot-readiness-');fs.chmodSync(directory,0o700);
 fs.writeFileSync(directory+'/review.txt',report.join('\n')+'\n',{flag:'wx',mode:0o600});
 status='BOOT_READINESS_SOURCE_CAPTURED';
 console.log(report.join('\n'));
 console.log('OBSERVED_INPUT_AND_CHECKOUT_PRESERVATION=PASS');
 console.log('REVIEW_FILE='+directory+'/review.txt');
}catch(e){console.log('REASON='+JSON.stringify(e.message));process.exitCode=2;}
console.log('STATUS='+status);
console.log('SOURCE_WRITES_BY_COMMAND=0\nAPPLICATION_MODULES_EXECUTED=0\nDATABASE_CONNECTIONS=0');
console.log('TESTS_STARTED=0\nWORKER_ACTIVATION=NOT_RUN\nCOMMIT_PUSH_DEPLOY=NOT_RUN');
console.log('FULL_SERVER_BOOT=NOT_RUN:SOURCE_REVIEW_ONLY\nRELEASE_QUALIFIED=false');
console.log('NEXT_ACTION=RETURN_FULL_OUTPUT\nREPORT_END='+ID);
MMHB52_NODE
