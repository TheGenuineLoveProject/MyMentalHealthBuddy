#!/usr/bin/env bash
set -euo pipefail
umask 077
cd /home/runner/workspace
node --input-type=commonjs <<'MMHB54_NODE'
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{spawnSync}=require('node:child_process');
const ROOT='/home/runner/workspace',REL='server/db/ensureSchema.mjs';
const PRIOR=ROOT+'/.git/mmhb-review-evidence/schema-failure-cache-HdbbRy';
const HEAD='0e6c2b2b8d0d484aca1ae3de18a49ed75c9dc681';
const BEFORE='23343e14ace7796e1da29fb335a448f044982c3346b26a1b026bd7b711cfb7e0';
const AFTER='f8db060b03d1b85c632cc8a183d9843fe05701a73fdcd9e3a2c752fdafacf451';
const PROBE='fcb7746f2fcc9f7838cf00f90822bf924f9078c82fda4bbd9fe81f1bb20ca010';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const check=(ok,msg)=>{if(!ok)throw Error(msg);};
const env={PATH:process.env.PATH||'/usr/bin:/bin',LANG:'C.UTF-8',GIT_OPTIONAL_LOCKS:'0',GIT_NO_LAZY_FETCH:'1'};
let directory,applied=false,status='STOPPED',before,mode;
function read(p){const s=fs.lstatSync(p);check(s.isFile()&&s.size<=4194304&&fs.realpathSync(p)===p,'Unsafe input: '+p);return fs.readFileSync(p);}
function git(...args){const r=spawnSync('git',['--no-pager','--no-optional-locks','-c','core.fsmonitor=false',...args],{cwd:ROOT,env,encoding:'utf8',timeout:30000,maxBuffer:33554432});check(!r.error&&r.status===0,'Git inspection failed');return r.stdout;}
function state(){return JSON.stringify({head:git('rev-parse','HEAD').trim(),branch:git('branch','--show-current').trim(),
 index:hash(read(path.resolve(ROOT,git('rev-parse','--git-path','index').trim()))),
 otherDiff:hash(git('diff','--binary','--no-ext-diff','--no-textconv','HEAD','--','.',':(exclude)'+REL)),
 untrackedNames:hash(git('ls-files','--others','--exclude-standard','-z')),
 package:hash(read(ROOT+'/package.json')),lock:hash(read(ROOT+'/package-lock.json'))});}
function put(name,b){const p=directory+'/'+name;fs.writeFileSync(p,b,{flag:'wx',mode:0o600});return p;}
function probe(label,file){
 const r=spawnSync(process.execPath,['--experimental-vm-modules',directory+'/probe.cjs',file],{cwd:directory,env,encoding:'utf8',timeout:30000,maxBuffer:1048576});
 put(label+'.log',(r.stdout||'')+(r.stderr||''));check(!r.error&&r.status===0,'Probe failed: '+label);
 const report=JSON.parse(r.stdout);put(label+'.json',JSON.stringify(report,null,2));
 check(report.tests===6&&report.pass===6&&report.results?.length===6&&report.results.every(x=>x.pass===true),'Regression failed: '+label);
 console.log(label+'='+JSON.stringify(report));
}
function rollback(config){
 const fs=require('node:fs'),crypto=require('node:crypto');
 const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
 const read=p=>{if(!fs.lstatSync(p).isFile()||fs.realpathSync(p)!==p)throw Error('Unsafe rollback path');return fs.readFileSync(p);};
 const saved=read(config.backup),current=read(config.target);
 if(hash(saved)!==config.before)throw Error('Backup differs');
 if(hash(current)===config.before){console.log('ROLLBACK=ALREADY_RESTORED');return;}
 if(hash(current)!==config.after)throw Error('STOP: target has later edits; preserve work');
 const temp=config.backup+'.restore-'+crypto.randomBytes(8).toString('hex');
 try{
  fs.writeFileSync(temp,saved,{flag:'wx',mode:config.mode});fs.chmodSync(temp,config.mode);
  if(hash(read(config.target))!==config.after)throw Error('Target changed before rollback');
  fs.renameSync(temp,config.target);
  if(hash(read(config.target))!==config.before)throw Error('Rollback verification failed');
  console.log('ROLLBACK=RESTORED_VERIFIED');
 }finally{if(fs.existsSync(temp))fs.unlinkSync(temp);}
}
try{
 console.log('COMMAND_ID=MMHB-APPLY-SCHEMA-FAILURE-CACHE-20260925-54');
 check(JSON.parse(read(ROOT+'/package.json')).name==='mymentalhealthbuddy','Identity mismatch');
 check(!process.env.REPL_ID||process.env.REPL_ID==='9d71c4b8-8fcd-4b22-aee2-5883d9cbe5a4','Replit identity mismatch');
 check(git('rev-parse','--show-toplevel').trim()===ROOT,'Repository root mismatch');
 before=state();const current=JSON.parse(before);
 check(current.head===HEAD&&current.branch==='integration','Branch or HEAD changed');
 check(git('diff','--cached','--name-only','--',REL).trim()==='','Target has staged changes');
 const original=read(ROOT+'/'+REL);check(hash(original)===BEFORE,'Target differs from qualified baseline');
 const summary=JSON.parse(read(PRIOR+'/summary.json'));
 check(summary.status==='SCHEMA_FAILURE_CACHE_CANDIDATE_QUALIFIED_IN_ISOLATION'&&summary.head===HEAD&&
 summary.before===BEFORE&&summary.after===AFTER&&summary.tests===6&&summary.pass===6&&summary.sourcePreserved===true,'G53 summary differs');
 const candidate=read(PRIOR+'/candidate.mjs'),harness=read(PRIOR+'/probe.cjs');
 check(hash(candidate)===AFTER&&hash(harness)===PROBE,'Qualified artifacts differ');
 const parent=ROOT+'/.git/mmhb-review-evidence';check(fs.realpathSync(parent)===parent&&fs.lstatSync(parent).isDirectory(),'Unsafe evidence parent');
 directory=fs.mkdtempSync(parent+'/schema-cache-apply-');fs.chmodSync(directory,0o700);
 mode=fs.statSync(ROOT+'/'+REL).mode&0o777;
 put('before.mjs',original);put('candidate.mjs',candidate);put('probe.cjs',harness);put('state.before.json',before);
 check(hash(read(directory+'/before.mjs'))===BEFORE,'Backup verification failed');
 const config={backup:directory+'/before.mjs',target:ROOT+'/'+REL,before:BEFORE,after:AFTER,mode};
 put('rollback.cjs','('+rollback.toString()+')('+JSON.stringify(config)+');\n');
 const syntax=spawnSync(process.execPath,['--check',directory+'/rollback.cjs'],{env,encoding:'utf8',timeout:15000});
 check(!syntax.error&&syntax.status===0,'Rollback syntax failed');
 probe('PRE_APPLY_REGRESSION',directory+'/candidate.mjs');
 check(state()===before&&hash(read(ROOT+'/'+REL))===BEFORE,'Checkout or target changed before apply');
 const temp=put('apply.tmp',candidate);fs.chmodSync(temp,mode);
 fs.renameSync(temp,ROOT+'/'+REL);applied=true;
 check(hash(read(ROOT+'/'+REL))===AFTER,'Applied hash differs');
 probe('APPLIED_SOURCE_REGRESSION',ROOT+'/'+REL);
 check(state()===before,'Unrelated observed state changed');
 check((fs.statSync(ROOT+'/'+REL).mode&0o777)===mode,'Target mode changed');
 put('applied.diff',git('diff','--no-ext-diff','--no-textconv','HEAD','--',REL));
 status='SCHEMA_FAILURE_CACHE_REPAIR_APPLIED_RELEASE_PENDING';
 console.log('EXPECTED_SOURCE_HASH=PASS\nUNRELATED_OBSERVED_STATE_PRESERVATION=PASS');
}catch(e){console.log('REASON='+JSON.stringify(e.message));process.exitCode=2;}
if(directory){
 try{put('summary.json',JSON.stringify({status,applied,before:BEFORE,after:AFTER,head:HEAD,releaseQualified:false},null,2));}catch(e){status='STOPPED';process.exitCode=2;console.log('SUMMARY_WRITE_FAILED=true');}
 console.log('EVIDENCE_DIRECTORY='+directory+'\nROLLBACK_COMMAND=node '+directory+'/rollback.cjs');
}
console.log('STATUS='+status+'\nSOURCE_APPLIED='+applied+'\nSOURCE_FILES_CHANGED_BY_COMMAND='+(applied?1:0));
console.log('DATABASE_CONNECTIONS_BY_COMMAND=0\nAPPLICATION_BOOT_BY_COMMAND=NOT_RUN');
console.log('HTTP_READINESS_INTEGRATION=PENDING\nFULL_APP_TESTS=NOT_RUN:SCHEMA_CACHE_SCOPE_ONLY');
console.log('COMMIT_PUSH_DEPLOY=NOT_RUN\nRELEASE_QUALIFIED=false\nNEXT_ACTION=RETURN_FULL_OUTPUT');
console.log('REPORT_END=MMHB-APPLY-SCHEMA-FAILURE-CACHE-20260925-54');
MMHB54_NODE
