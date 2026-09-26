#!/usr/bin/env bash
set -euo pipefail
umask 077
cd /home/runner/workspace
node --input-type=commonjs <<'MMHB53_NODE'
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{spawnSync}=require('node:child_process');
const ROOT='/home/runner/workspace',REL='server/db/ensureSchema.mjs';
const BEFORE='23343e14ace7796e1da29fb335a448f044982c3346b26a1b026bd7b711cfb7e0',AFTER="f8db060b03d1b85c632cc8a183d9843fe05701a73fdcd9e3a2c752fdafacf451";
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const check=(ok,msg)=>{if(!ok)throw Error(msg);};
const env={PATH:process.env.PATH||'/usr/bin:/bin',LANG:'C.UTF-8',GIT_OPTIONAL_LOCKS:'0',GIT_NO_LAZY_FETCH:'1'};
let before,directory,status='STOPPED';
function git(...args){const r=spawnSync('git',['--no-pager','--no-optional-locks','-c','core.fsmonitor=false',...args],{cwd:ROOT,env,encoding:'utf8',timeout:30000,maxBuffer:33554432});check(!r.error&&r.status===0,'Git inspection failed');return r.stdout;}
function read(file){const s=fs.lstatSync(file);check(s.isFile()&&s.size<4194304&&fs.realpathSync(file)===file,'Unsafe input');return fs.readFileSync(file);}
function state(){return JSON.stringify({head:git('rev-parse','HEAD').trim(),branch:git('branch','--show-current').trim(),
 status:git('status','--porcelain=v1','--untracked-files=normal'),diff:hash(git('diff','--binary','--no-ext-diff','--no-textconv','HEAD')),
 index:hash(read(path.resolve(ROOT,git('rev-parse','--git-path','index').trim()))),
 package:hash(read(ROOT+'/package.json')),lock:hash(read(ROOT+'/package-lock.json')),source:hash(read(ROOT+'/'+REL))});}
function put(name,data){const f=directory+'/'+name;fs.writeFileSync(f,data,{flag:'wx',mode:0o600});return f;}
try{
 console.log('COMMAND_ID=MMHB-SCHEMA-FAILURE-CACHE-20260925-53');
 check(JSON.parse(read(ROOT+'/package.json')).name==='mymentalhealthbuddy','Project identity mismatch');
 check(!process.env.REPL_ID||process.env.REPL_ID==='9d71c4b8-8fcd-4b22-aee2-5883d9cbe5a4','Replit identity mismatch');
 check(git('rev-parse','--show-toplevel').trim()===ROOT,'Root mismatch');
 before=state();const current=JSON.parse(before);console.log('CURRENT='+JSON.stringify({head:current.head,branch:current.branch}));
 check(current.branch==='integration','Unexpected branch');check(current.source===BEFORE,'Schema source changed; review required');
 let candidate=read(ROOT+'/'+REL).toString('utf8');const original=candidate;
 for(const [a,b]of [["  let bootstrapped = false;", "  let bootstrapped = false;\n  let bootstrapFailure = null;"], ["    if (bootstrapped) return { ok: true, cached: true };", "    if (bootstrapped) return bootstrapFailure\n      ? { ...structuredClone(bootstrapFailure), cached: true }\n      : { ok: true, cached: true };"], ["      return { ok: false, ran: 0, failed: [failure], failedCount: 1, omittedFailures: 0 };", "      bootstrapFailure = { ok: false, ran: 0, failed: [failure], failedCount: 1, omittedFailures: 0 };\n      return structuredClone(bootstrapFailure);"], ["    bootstrapped = true;\n    return results;", "    if (!results.ok) bootstrapFailure = structuredClone(results);\n    bootstrapped = true;\n    return results;"]]){check(candidate.split(a).length===2,'Patch anchor differs');candidate=candidate.replace(a,b);}
 check(hash(candidate)===AFTER,'Candidate hash mismatch');
 const parent=ROOT+'/.git/mmhb-review-evidence';check(fs.realpathSync(parent)===parent&&fs.lstatSync(parent).isDirectory(),'Evidence parent differs');
 directory=fs.mkdtempSync(parent+'/schema-failure-cache-');fs.chmodSync(directory,0o700);
 console.log('EVIDENCE_DIRECTORY='+directory);
 put('baseline.mjs',original);put('candidate.mjs',candidate);put('probe.cjs',"'use strict';\nconst fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');\nasync function main(){\n const file=process.argv[2],context=vm.createContext({structuredClone});\n const mod=new vm.SourceTextModule(fs.readFileSync(file,'utf8'),{context,initializeImportMeta(meta){meta.url='file:///synthetic/server/db/ensureSchema.mjs';}});\n await mod.link(spec=>{\n  const values=spec==='drizzle-orm'?{sql:{raw:x=>x}}:\n   spec==='./connection.mjs'?{db:{execute(){throw Error('Unexpected default database use');}}}:\n   spec==='../utils/logger.mjs'?{logger:{}}:\n   spec==='node:fs'?{readFileSync(){throw Error('Unexpected real filesystem read');}}:\n   spec==='node:url'?{fileURLToPath:require('node:url').fileURLToPath}:\n   spec==='node:path'?{dirname:require('node:path').dirname,join:require('node:path').join}:null;\n  assert(values,'Unexpected import '+spec);\n  return new vm.SyntheticModule(Object.keys(values),function(){for(const [k,v]of Object.entries(values))this.setExport(k,v);},{context});\n });\n await mod.evaluate();const results=[];\n async function test(name,fn){try{await fn();results.push({name,pass:true});}catch(e){results.push({name,pass:false,error:e.message});}}\n function setup({readFails=false,dbFails=false,count=1}={}){\n  let reads=0,calls=0;\n  const run=mod.namespace.createEnsureSchema({log:{},readCanonical(){reads++;if(readFails)throw Error('private-marker');return Array(count).fill('SELECT 1;').join('\\n--> statement-breakpoint\\n');},database:{async execute(){calls++;if(dbFails)throw Object.assign(Error('private-marker'),{code:'42501'});return {rows:[]};}}});\n  return {run,counts:()=>({reads,calls})};\n }\n await test('successful_bootstrap_remains_cached',async()=>{const x=setup();assert.equal((await x.run()).ok,true);assert.equal((await x.run()).cached,true);assert.deepEqual(x.counts(),{reads:1,calls:1});});\n await test('read_failure_stays_failed_without_retry',async()=>{const x=setup({readFails:true});assert.equal((await x.run()).ok,false);const b=await x.run();assert.equal(b.ok,false);assert.equal(b.cached,true);assert.equal(b.failedCount,1);assert.deepEqual(x.counts(),{reads:1,calls:0});});\n await test('statement_failure_stays_failed_without_retry',async()=>{const x=setup({dbFails:true});await x.run();const b=await x.run();assert.equal(b.ok,false);assert.equal(b.failed[0].sqlstate,'42501');assert.deepEqual(x.counts(),{reads:1,calls:1});});\n await test('first_result_mutation_cannot_change_cached_failure',async()=>{const x=setup({dbFails:true});const a=await x.run();a.ok=true;a.failed.length=0;const b=await x.run();assert.equal(b.ok,false);assert.equal(b.failed.length,1);});\n await test('cached_result_mutation_cannot_change_later_failure',async()=>{const x=setup({readFails:true});await x.run();const b=await x.run();assert.equal(b.ok,false);b.failed[0].category='changed';assert.equal((await x.run()).failed[0].category,'schema_read_failed');});\n await test('failure_cap_and_error_redaction_preserved',async()=>{const x=setup({dbFails:true,count:30});const a=await x.run();assert.equal(a.failed.length,25);assert.equal(a.failedCount,30);assert.equal(a.omittedFailures,5);assert(!JSON.stringify(a).includes('private-marker'));});\n console.log(JSON.stringify({tests:results.length,pass:results.filter(x=>x.pass).length,results}));\n}\nmain().catch(e=>{console.error(e);process.exitCode=2;});\n");
 const reports={};
 for(const mode of ['baseline','candidate']){
  const syntax=spawnSync(process.execPath,['--check',directory+'/'+mode+'.mjs'],{env,encoding:'utf8',timeout:15000});
  check(!syntax.error&&syntax.status===0,'Module syntax failed');
  const r=spawnSync(process.execPath,['--experimental-vm-modules',directory+'/probe.cjs',directory+'/'+mode+'.mjs'],{cwd:directory,env,encoding:'utf8',timeout:30000,maxBuffer:1048576});
  put(mode+'.log',(r.stdout||'')+(r.stderr||''));check(!r.error&&r.status===0,'Probe execution failed');
  reports[mode]=JSON.parse(r.stdout);put(mode+'.result.json',JSON.stringify(reports[mode],null,2));
  console.log(mode.toUpperCase()+'_RESULT='+JSON.stringify(reports[mode]));
 }
 check(reports.baseline.tests===6&&reports.baseline.pass===2&&reports.baseline.results.filter(x=>!x.pass).map(x=>x.name).join('|')===
 'read_failure_stays_failed_without_retry|statement_failure_stays_failed_without_retry|first_result_mutation_cannot_change_cached_failure|cached_result_mutation_cannot_change_later_failure','Baseline defect not reproduced');
 check(reports.candidate.tests===6&&reports.candidate.pass===6&&reports.candidate.results.every(x=>x.pass===true),'Candidate qualification failed');
 check(hash(read(directory+'/candidate.mjs'))===AFTER&&hash(read(directory+'/baseline.mjs'))===BEFORE,'Staged source changed');
 check(state()===before,'Observed source or checkout changed');
 const diff=spawnSync('git',['--no-pager','diff','--no-index','--no-ext-diff','--no-textconv','--',directory+'/baseline.mjs',directory+'/candidate.mjs'],{env,encoding:'utf8',timeout:15000,maxBuffer:1048576});
 check(!diff.error&&diff.status===1,'Candidate diff failed');put('candidate.diff',diff.stdout);
 console.log('CANDIDATE_DIFF_BEGIN\n'+diff.stdout+'CANDIDATE_DIFF_END');
 status='SCHEMA_FAILURE_CACHE_CANDIDATE_QUALIFIED_IN_ISOLATION';
 put('summary.json',JSON.stringify({status,head:current.head,before:BEFORE,after:AFTER,tests:6,pass:6,sourcePreserved:true,
 testScope:'ACTUAL_MODULE_WITH_INJECTED_DATABASE_AND_SCHEMA_READER',applicationApplied:false,releaseQualified:false},null,2));
 console.log('OBSERVED_SOURCE_AND_CHECKOUT_PRESERVATION=PASS');
}catch(e){console.log('REASON='+JSON.stringify(e.message));process.exitCode=2;}
console.log('STATUS='+status);
console.log('SOURCE_WRITES_BY_COMMAND=0\nDATABASE_CONNECTIONS=0\nREAL_EMAILS_SENT=0');
console.log('APPLICATION_SOURCE_APPLY=NOT_RUN\nHTTP_READINESS_INTEGRATION=PENDING\nFULL_SERVER_BOOT=NOT_RUN');
console.log('FULL_APP_TESTS=NOT_RUN:SCHEMA_RESULT_CACHE_ONLY\nCOMMIT_PUSH_DEPLOY=NOT_RUN\nRELEASE_QUALIFIED=false');
if(directory)console.log('EVIDENCE_DIRECTORY='+directory);
console.log('NEXT_ACTION=RETURN_FULL_OUTPUT\nREPORT_END=MMHB-SCHEMA-FAILURE-CACHE-20260925-53');
MMHB53_NODE
