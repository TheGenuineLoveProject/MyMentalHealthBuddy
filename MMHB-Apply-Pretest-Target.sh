#!/usr/bin/env bash
set -euo pipefail
umask 077
cd /home/runner/workspace
node --input-type=commonjs <<'MMHB70_NODE'
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{spawnSync}=require('node:child_process');
const ROOT='/home/runner/workspace',REL='scripts/check-contract-routes.sh',TARGET=ROOT+'/'+REL;
const PRIOR=ROOT+'/.git/mmhb-review-evidence/pretest-target-UWCs3R';
const BEFORE='749855ddae860497fa59c91b38b072e94d9d7d1a0460ce7d8f08646c526e7a74',AFTER='023a3cbaa1d1ea6ca080ac8bf9f29b478d38694165e37b394ad21db93ea1d9e5';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex'),check=(v,m)=>{if(!v)throw Error(m);};
const env={PATH:process.env.PATH||'/usr/bin:/bin',LANG:'C.UTF-8',GIT_OPTIONAL_LOCKS:'0',GIT_NO_LAZY_FETCH:'1'};
let directory,temp,applied=false,qualified=false,status='STOPPED',before,original,mode;
function read(f){const s=fs.lstatSync(f);check(s.isFile()&&s.size<1048576&&fs.realpathSync(f)===f,'Unsafe input: '+f);return fs.readFileSync(f);}
function git(...args){const r=spawnSync('git',['--no-pager','--no-optional-locks','-c','core.fsmonitor=false',...args],{cwd:ROOT,env,encoding:'utf8',timeout:30000,maxBuffer:33554432});check(!r.error&&r.status===0,'Git inspection failed');return r.stdout;}
function state(){const scope=['--','.',':(exclude)'+REL];return JSON.stringify({head:git('rev-parse','HEAD').trim(),branch:git('branch','--show-current').trim(),index:hash(fs.readFileSync(path.resolve(ROOT,git('rev-parse','--git-path','index').trim()))),status:git('status','--porcelain=v1','--untracked-files=all',...scope),diff:hash(git('diff','--binary','--no-ext-diff','--no-textconv','HEAD',...scope)),package:hash(read(ROOT+'/package.json')),lock:hash(read(ROOT+'/package-lock.json'))});}
function put(name,b){const f=directory+'/'+name;fs.writeFileSync(f,b,{flag:'wx',mode:0o600});return f;}
function syntax(file){const r=spawnSync('bash',['-n',file],{cwd:ROOT,env,encoding:'utf8',timeout:10000});check(!r.error&&r.status===0,'Shell syntax failed');}
try{
 console.log('COMMAND_ID=MMHB-APPLY-PRETEST-TARGET-70');
 check(JSON.parse(read(ROOT+'/package.json')).name==='mymentalhealthbuddy','Project mismatch');check(!process.env.REPL_ID||process.env.REPL_ID==='9d71c4b8-8fcd-4b22-aee2-5883d9cbe5a4','Replit mismatch');check(git('rev-parse','--show-toplevel').trim()===ROOT,'Repository mismatch');
 before=state();const s=JSON.parse(before);check(s.head==='0e6c2b2b8d0d484aca1ae3de18a49ed75c9dc681'&&s.branch==='integration','Branch or HEAD changed');
 original=read(TARGET);check(hash(original)===BEFORE,'Pretest differs from reviewed original');mode=fs.statSync(TARGET).mode&0o777;
 const summary=JSON.parse(read(PRIOR+'/summary.json'));check(summary.status==='PRETEST_TARGET_CANDIDATE_QUALIFIED_NOT_APPLIED'&&summary.tests===8&&summary.pass===8&&summary.beforeHash===BEFORE&&summary.candidateHash===AFTER,'G69 qualification differs');
 const result=JSON.parse(read(PRIOR+'/result.json'));check(result.tests===8&&result.pass===8&&result.results.length===8&&result.results.every(x=>x.pass),'G69 test results differ');
 const candidate=read(PRIOR+'/pretest.candidate.sh');check(hash(candidate)===AFTER,'Qualified candidate differs');syntax(PRIOR+'/pretest.candidate.sh');qualified=true;
 const parent=ROOT+'/.git/mmhb-review-evidence';check(fs.realpathSync(parent)===parent,'Evidence path differs');directory=fs.mkdtempSync(parent+'/pretest-apply-');fs.chmodSync(directory,0o700);
 console.log('EVIDENCE_DIRECTORY='+directory);put('pretest.before.sh',original);put('pretest.after.sh',candidate);
 put('rollback.cjs',`'use strict';\nconst fs=require('node:fs'),crypto=require('node:crypto');\nconst target=${JSON.stringify(TARGET)},backup=${JSON.stringify(directory+'/pretest.before.sh')};\nconst hash=b=>crypto.createHash('sha256').update(b).digest('hex');\nif(!fs.lstatSync(target).isFile()||fs.realpathSync(target)!==target||hash(fs.readFileSync(target))!==${JSON.stringify(AFTER)})throw Error('STOP: target changed; rollback not applied');\nconst bytes=fs.readFileSync(backup);if(hash(bytes)!==${JSON.stringify(BEFORE)})throw Error('STOP: backup differs');\nconst tmp=target+'.rollback-'+crypto.randomBytes(8).toString('hex');\ntry{fs.writeFileSync(tmp,bytes,{flag:'wx',mode:${mode}});fs.chmodSync(tmp,${mode});fs.renameSync(tmp,target);}finally{if(fs.existsSync(tmp))fs.unlinkSync(tmp);}\nconsole.log('PRETEST_ROLLBACK=PASS');\n`);
 check(hash(read(directory+'/pretest.before.sh'))===BEFORE,'Backup verification failed');check(state()===before&&hash(read(TARGET))===BEFORE,'State changed before apply');
 temp=TARGET+'.g70-'+crypto.randomBytes(8).toString('hex');fs.writeFileSync(temp,candidate,{flag:'wx',mode});fs.chmodSync(temp,mode);fs.renameSync(temp,TARGET);temp=undefined;applied=true;
 check(hash(read(TARGET))===AFTER,'Applied bytes differ');syntax(TARGET);check(state()===before,'Unrelated checkout state changed');
 console.log('APPLIED_SOURCE_HASH=PASS\nAPPLIED_SHELL_SYNTAX=PASS\nUNRELATED_OBSERVED_STATE_PRESERVATION=PASS');status='PRETEST_TARGET_REPAIR_APPLIED_RELEASE_PENDING';
}catch(e){console.log('REASON='+JSON.stringify(e.message));process.exitCode=2;
 if(applied)try{check(hash(read(TARGET))===AFTER,'Target changed after apply; automatic rollback refused');const r=spawnSync(process.execPath,[directory+'/rollback.cjs'],{cwd:ROOT,env,encoding:'utf8',timeout:10000});check(!r.error&&r.status===0&&hash(read(TARGET))===BEFORE,'Automatic rollback failed');applied=false;console.log('AUTOMATIC_ROLLBACK=PASS');}catch(error){console.log('ROLLBACK_ERROR='+JSON.stringify(error.message));}
}finally{
 if(temp&&fs.existsSync(temp))fs.unlinkSync(temp);
 if(directory){put('summary.json',JSON.stringify({status,sourceApplied:applied,file:REL,beforeHash:BEFORE,afterHash:AFTER,releaseQualified:false},null,2));console.log('ROLLBACK_COMMAND=node '+directory+'/rollback.cjs');}
}
console.log('STATUS='+status+'\nSOURCE_APPLIED='+applied+'\nAPPLIED_FILE='+(applied?REL:'NONE'));
console.log('QUALIFIED_CANDIDATE_VERIFIED='+qualified);
console.log('DATABASE_CONNECTIONS=0\nHTTP_REQUESTS=0\nSERVER_RESTART=NOT_RUN\nFULL_APP_TESTS=NOT_RUN\nCOMMIT_PUSH_DEPLOY=NOT_RUN\nRELEASE_QUALIFIED=false\nNEXT_ACTION=RETURN_FULL_OUTPUT\nREPORT_END=MMHB-APPLY-PRETEST-TARGET-70');

MMHB70_NODE
