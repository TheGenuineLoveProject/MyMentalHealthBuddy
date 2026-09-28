#!/usr/bin/env bash
(
set -euo pipefail
cd /home/runner/workspace
node --input-type=commonjs <<'MMHB46_NODE'
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {spawnSync}=require('node:child_process');
const ROOT='/home/runner/workspace',ID='MMHB-DEPENDENCY-ALIGNMENT-20260925-46';
const hash=value=>crypto.createHash('sha256').update(value).digest('hex');
const checked=new Map(),absent=new Set();let before,status='STOPPED';
const check=(ok,why)=>{if(!ok)throw Error(why);};
function read(rel,optional=false){
  const file=path.join(ROOT,rel);let stat;
  try{stat=fs.lstatSync(file);}catch(e){if(optional&&e.code==='ENOENT'){absent.add(file);return null;}throw e;}
  check(stat.isFile()&&stat.size<=8388608&&fs.realpathSync(file)===file,'Unexpected metadata file: '+rel);
  const bytes=fs.readFileSync(file),pin=hash(bytes);
  if(checked.has(file))check(checked.get(file)===pin,'Metadata changed during inspection: '+rel);
  else checked.set(file,pin);
  return {value:JSON.parse(bytes),sha256:pin};
}
function git(...args){
  const r=spawnSync('git',['--no-pager','--no-optional-locks','-c','core.fsmonitor=false','-c','core.quotePath=true',...args],
    {cwd:ROOT,env:{PATH:process.env.PATH||'/usr/bin:/bin',LANG:'C.UTF-8',GIT_OPTIONAL_LOCKS:'0',GIT_NO_LAZY_FETCH:'1',GIT_TERMINAL_PROMPT:'0'},
      encoding:'utf8',timeout:30000,maxBuffer:33554432});
  check(!r.error&&r.status===0,'Git inspection failed: '+args[0]);return r.stdout;
}
function state(){return {head:git('rev-parse','HEAD').trim(),branch:git('branch','--show-current').trim(),
  index:hash(fs.readFileSync(path.resolve(ROOT,git('rev-parse','--git-path','index').trim()))),
  status:git('status','--porcelain=v1','--untracked-files=normal','--ignore-submodules=none'),
  diff:hash(git('diff','--binary','--no-ext-diff','--no-textconv','HEAD','--'))};}
const safe=value=>value==null?null:typeof value==='string'&&value.length<=160&&/^[A-Za-z0-9@./~^<>=*|+ _-]+$/.test(value)?value:'NON_VERSION_SPEC_REDACTED';
const specs=(value,name)=>Object.fromEntries(['dependencies','devDependencies','optionalDependencies','peerDependencies'].map(k=>[k,safe(value?.[k]?.[name])]));
const entry=value=>value?{name:safe(value.name),version:safe(value.version),link:value.link===true,dev:value.dev===true,optional:value.optional===true,
  integrityPresent:typeof value.integrity==='string'}:null;
const out=(key,value)=>console.log(key+'='+JSON.stringify(value));
try{
  console.log('COMMAND_ID='+ID);
  const pkg=read('package.json'),lock=read('package-lock.json');
  check(pkg.value.name==='mymentalhealthbuddy'&&(!process.env.REPL_ID||process.env.REPL_ID==='9d71c4b8-8fcd-4b22-aee2-5883d9cbe5a4'),'Project identity mismatch');
  check(git('rev-parse','--show-toplevel').trim()===ROOT,'Repository root mismatch');
  before=state();out('CURRENT',{head:before.head,branch:before.branch,trackedAndUntrackedStatus:before.status.trimEnd()});
  const hidden=read('node_modules/.package-lock.json',true),shrinkwrap=read('npm-shrinkwrap.json',true);
  out('LOCK_METADATA',{lockfileVersion:lock.value.lockfileVersion,packageSha256:pkg.sha256,lockSha256:lock.sha256,
    hiddenLockPresent:!!hidden,shrinkwrapPresent:!!shrinkwrap,packageManager:safe(pkg.value.packageManager)});
  console.log('HIDDEN_LOCK_SCOPE=INSTALLED_TREE_METADATA_ONLY;NOT_A_REPLACEMENT_FOR_PROJECT_LOCK');
  for(const name of ['pg','drizzle-orm','resend']){
    const installed=read('node_modules/'+name+'/package.json',true),expected=lock.value.packages?.['node_modules/'+name];
    out('DEPENDENCY',{name,declared:specs(pkg.value,name),lockRootDeclared:specs(lock.value.packages?.[''],name),
      installed:installed?{name:safe(installed.value.name),version:safe(installed.value.version),packageSha256:installed.sha256}:null,
      projectLock:entry(expected),legacyLock:entry(lock.value.dependencies?.[name]),
      hiddenLock:entry(hidden?.value.packages?.['node_modules/'+name]),shrinkwrap:entry(shrinkwrap?.value.packages?.['node_modules/'+name]),
      g45Checks:{installedNameMatches:installed?.value.name===name,rootLockEntryPresent:!!expected,
        exactVersionMatches:!!installed&&typeof expected?.version==='string'&&installed.value.version===expected.version}});
  }
  const nested=Object.entries(lock.value.packages||{}).filter(([key])=>key==='node_modules/resend'||key.endsWith('/node_modules/resend'));
  out('RESEND_LOCK_ENTRIES',{total:nested.length,entries:nested.slice(0,20).map(([key,value])=>({path:safe(key),...entry(value)})),truncated:nested.length>20});
  out('RESEND_OVERRIDE',safe(pkg.value.overrides?.resend));
  const headPkg=JSON.parse(git('show','HEAD:package.json')),headLock=JSON.parse(git('show','HEAD:package-lock.json'));
  out('COMMITTED_RESEND',{declared:specs(headPkg,'resend'),lock:entry(headLock.packages?.['node_modules/resend']),
    legacyLock:entry(headLock.dependencies?.resend)});
  for(const rel of ['.git/mmhb-review-evidence/billing-adapter-ca5T49/candidate/package-lock.json',
    '.git/mmhb-review-evidence/fresh-release-build-kcOaQK/candidate/package-lock.json']){
    const previous=read(rel,true);out('HISTORICAL_LOCK',{path:rel,present:!!previous,sha256:previous?.sha256||null,
      matchesCurrent:previous?.sha256===lock.sha256,resend:entry(previous?.value.packages?.['node_modules/resend'])});
  }
  status='DEPENDENCY_METADATA_REPORTED';
}catch(e){out('REASON',e.message);process.exitCode=2;}
finally{
  try{
    for(const [file,pin]of checked)check(fs.lstatSync(file).isFile()&&fs.realpathSync(file)===file&&hash(fs.readFileSync(file))===pin,'Inspected metadata changed');
    for(const file of absent){let found=false;try{fs.lstatSync(file);found=true;}catch(e){if(e.code!=='ENOENT')throw e;}check(!found,'Previously absent metadata appeared');}
    if(before)check(JSON.stringify(state())===JSON.stringify(before),'Checkout changed during inspection');
    console.log('OBSERVED_METADATA_AND_CHECKOUT_PRESERVATION=PASS');
  }catch(e){status='STOPPED';process.exitCode=2;out('PRESERVATION_ERROR',e.message);}
  console.log('STATUS='+status+'\nSOURCE_WRITES_BY_COMMAND=0\nPACKAGES_INSTALLED=0\nAPPLICATION_MODULES_EXECUTED=0\nDATABASE_CONNECTIONS=0');
  console.log('DEPENDENCY_REPAIR=NOT_APPLIED\nTLS_TESTS=NOT_RUN\nRELEASE_QUALIFIED=false\nNEXT_ACTION=RETURN_FULL_OUTPUT\nREPORT_END='+ID);
}
MMHB46_NODE
)
