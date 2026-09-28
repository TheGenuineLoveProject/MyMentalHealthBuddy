#!/usr/bin/env bash
(
set -euo pipefail
umask 077
cd /home/runner/workspace
node --input-type=commonjs <<'MMHB48_NODE'
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {spawnSync}=require('node:child_process');
const ROOT='/home/runner/workspace',ID='MMHB-LOCK-ORIGIN-INSPECTION-20260925-48';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const check=(ok,why)=>{if(!ok)throw Error(why);};
const observed=new Map();let before,status='STOPPED';
const env={PATH:process.env.PATH||'/usr/bin:/bin',LANG:'C.UTF-8',GIT_OPTIONAL_LOCKS:'0',GIT_NO_LAZY_FETCH:'1',GIT_TERMINAL_PROMPT:'0'};
const pathPattern=/^(?:node_modules\/(?:@[a-z0-9_.-]+\/)?[a-z0-9_.-]+)(?:\/node_modules\/(?:@[a-z0-9_.-]+\/)?[a-z0-9_.-]+)*$/i;
const integrityPattern=/^(sha512|sha384|sha256|sha1)-[A-Za-z0-9+/=]+(?:\s+(?:sha512|sha384|sha256|sha1)-[A-Za-z0-9+/=]+)*$/;
function regular(file,max=8388608){
  const s=fs.lstatSync(file);check(s.isFile()&&s.size<=max&&fs.realpathSync(file)===file,'Unexpected metadata file');return fs.readFileSync(file);
}
function read(file){const b=regular(file);observed.set(file,hash(b));return b;}
function git(...args){
  const r=spawnSync('git',['--no-pager','--no-optional-locks','-c','core.fsmonitor=false','-c','core.quotePath=true',...args],
    {cwd:ROOT,env,encoding:'utf8',timeout:30000,maxBuffer:33554432});
  check(!r.error&&r.status===0,'Git inspection failed: '+args[0]);return r.stdout;
}
function snapshot(){return {head:git('rev-parse','HEAD').trim(),branch:git('branch','--show-current').trim(),
  index:hash(regular(path.resolve(ROOT,git('rev-parse','--git-path','index').trim()),33554432)),
  status:hash(git('status','--porcelain=v1','--untracked-files=normal','--ignore-submodules=none')),
  untrackedNames:hash(git('ls-files','--others','--exclude-standard','-z')),
  diff:hash(git('diff','--binary','--no-ext-diff','--no-textconv','HEAD','--'))};}
function describeResolved(value){
  const result={form:value===undefined?'MISSING':typeof value==='string'?'STRING':'NON_STRING',
    scheme:null,hostname:null,nonDefaultPortPresent:null,userinfoPresent:null,queryPresent:null,fragmentPresent:null,
    pathEndsInTgz:null,g47UrlFailures:[]};
  if(typeof value!=='string'){result.g47UrlFailures.push('URL_NOT_PARSEABLE');return result;}
  if(value.length>8192){result.form='OVERSIZED_STRING';result.g47UrlFailures.push('URL_INSPECTION_BOUND');return result;}
  let u;try{u=new URL(value);}catch{result.g47UrlFailures.push('URL_NOT_PARSEABLE');return result;}
  result.form='PARSED_URL';
  result.scheme=['https:','http:','file:','git:','git+https:','ssh:','git+ssh:','data:'].includes(u.protocol)?u.protocol:'OTHER';
  result.hostname=['https:','http:'].includes(u.protocol)&&u.hostname.length<=253&&/^[a-z0-9.\[\]:-]*$/i.test(u.hostname)?u.hostname:'NOT_DISPLAYED';
  result.nonDefaultPortPresent=!!u.port;result.userinfoPresent=!!(u.username||u.password);
  result.queryPresent=!!u.search;result.fragmentPresent=!!u.hash;result.pathEndsInTgz=u.pathname.endsWith('.tgz');
  const conditions={HTTPS_REQUIRED:u.protocol==='https:',HOST_NOT_NPMJS:u.hostname==='registry.npmjs.org',
    PORT_PRESENT:!u.port,USERINFO_PRESENT:!u.username&&!u.password,QUERY_PRESENT:!u.search,
    FRAGMENT_PRESENT:!u.hash,TARBALL_SUFFIX_MISSING:u.pathname.endsWith('.tgz')};
  result.g47UrlFailures=Object.keys(conditions).filter(key=>!conditions[key]);return result;
}
function describeEntry(name,entry){
  const valid=entry&&typeof entry==='object'&&!Array.isArray(entry);
  const url=describeResolved(valid?entry.resolved:undefined),issues=[];
  if(!pathPattern.test(name))issues.push('UNSUPPORTED_PACKAGE_PATH');
  if(!valid)issues.push('INVALID_LOCK_ENTRY');
  else{
    if(entry.link)issues.push('LINKED_PACKAGE');
    if(typeof entry.version!=='string')issues.push('MISSING_VERSION');
  }
  const bundledWithoutResolved=!!(valid&&entry.inBundle&&!entry.resolved);
  if(!bundledWithoutResolved){
    issues.push(...url.g47UrlFailures);
    if(typeof entry?.integrity!=='string'||!integrityPattern.test(entry.integrity))issues.push('INTEGRITY_MISSING_OR_UNSUPPORTED');
  }
  const version=valid&&typeof entry.version==='string'&&entry.version.length<=100&&/^[0-9A-Za-z.+-]+$/.test(entry.version)?entry.version:null;
  return {path:pathPattern.test(name)&&name.length<=300?name:'UNEXPECTED_PATH_REDACTED',version,
    linked:!!entry?.link,bundledWithoutResolved,integrityPresent:typeof entry?.integrity==='string',
    integrityAlgorithms:typeof entry?.integrity==='string'&&integrityPattern.test(entry.integrity)?[...new Set(entry.integrity.split(/\s+/).map(v=>v.split('-')[0]))]:[],
    ...url,g47ConstraintFailures:issues};
}
const out=(label,value)=>console.log(label+'='+JSON.stringify(value));
try{
  console.log('COMMAND_ID='+ID);
  const pkgBytes=read(ROOT+'/package.json'),lockBytes=read(ROOT+'/package-lock.json');
  let pkg,lock;try{pkg=JSON.parse(pkgBytes);lock=JSON.parse(lockBytes);}catch{throw Error('Package or lock JSON is invalid');}
  check(pkg?.name==='mymentalhealthbuddy'&&(!process.env.REPL_ID||process.env.REPL_ID==='9d71c4b8-8fcd-4b22-aee2-5883d9cbe5a4'),'Project identity mismatch');
  check(git('rev-parse','--show-toplevel').trim()===ROOT,'Repository root mismatch');
  before=snapshot();out('CURRENT',{head:before.head,branch:before.branch});
  out('LOCK_METADATA',{lockfileVersion:lock.lockfileVersion,packageSha256:hash(pkgBytes),lockSha256:hash(lockBytes),
    packageMatchesG46:hash(pkgBytes)==='e034489afed62c076902a2176193bbfb682de357d0c673a517b4026dded4aa7f',
    lockMatchesG46:hash(lockBytes)==='6574eef640049a1acea6692899408b2d803bcd481fb9b9d3d59efe8d25b76fae'});
  check(lock.packages&&typeof lock.packages==='object'&&!Array.isArray(lock.packages),'Missing lock package map');
  const entries=Object.entries(lock.packages).filter(([name])=>name!=='');check(entries.length<=10000,'Lock package count exceeds inspection bound');
  const groups=new Map(),reasons={},examples=[];let rejected=0,bundled=0;
  for(const [name,entry]of entries){
    const row=describeEntry(name,entry);
    if(row.bundledWithoutResolved)bundled++;
    if(row.g47ConstraintFailures.length){rejected++;if(examples.length<10)examples.push(row);}
    for(const reason of row.g47ConstraintFailures)reasons[reason]=(reasons[reason]||0)+1;
    const key=JSON.stringify({form:row.form,scheme:row.scheme,hostname:row.hostname,bundledWithoutResolved:row.bundledWithoutResolved,failures:row.g47ConstraintFailures});
    const group=groups.get(key)||{...JSON.parse(key),count:0,examples:[]};group.count++;
    if(group.examples.length<2)group.examples.push(row.path);groups.set(key,group);
  }
  out('LOCK_SCAN',{entries:entries.length,g47ConstraintRejected:rejected,bundledWithoutResolved:bundled,reasonCounts:reasons});
  for(const name of ['node_modules/@alloc/quick-lru','node_modules/resend'])
    out('TARGET_ENTRY',Object.hasOwn(lock.packages,name)?describeEntry(name,lock.packages[name]):{path:name,present:false});
  const sorted=[...groups.values()].sort((a,b)=>b.count-a.count);
  out('ORIGIN_GROUPS',{total:sorted.length,groups:sorted.slice(0,24),truncated:sorted.length>24});
  out('G47_REJECTION_EXAMPLES',{entries:examples,truncated:rejected>examples.length});
  console.log('INTERPRETATION=G47_CONSTRAINT_FAILURE_IS_NOT_A_SECURITY_VERDICT');
  console.log('OUTPUT_POLICY=NO_FULL_URLS_URL_PATHS_USERINFO_QUERY_VALUES_FRAGMENT_VALUES_NPM_CONFIG_OR_ENVIRONMENT_VALUES');
  status='LOCK_ORIGIN_DIAGNOSIS_COMPLETE';
}catch(e){out('REASON',e.message);process.exitCode=2;}
finally{
  try{
    for(const [file,pin]of observed)check(hash(regular(file))===pin,'Inspected input changed');
    if(before)check(JSON.stringify(snapshot())===JSON.stringify(before),'Checkout changed during inspection');
    console.log('OBSERVED_INPUT_AND_CHECKOUT_PRESERVATION='+(before?'PASS':'NOT_CAPTURED'));
  }catch(e){out('PRESERVATION_ERROR',e.message);status='STOPPED';process.exitCode=2;}
  console.log('STATUS='+status+'\nSOURCE_WRITES_BY_COMMAND=0\nPACKAGES_INSTALLED=0\nNETWORK_REQUESTS_BY_COMMAND=0');
  console.log('APPLICATION_MODULES_EXECUTED=0\nDATABASE_CONNECTIONS=0\nDEPENDENCY_REPAIR=NOT_APPLIED\nTLS_TESTS=NOT_RUN');
  console.log('COMMIT_PUSH_DEPLOY=NOT_RUN\nRELEASE_QUALIFIED=false\nNEXT_ACTION=RETURN_FULL_OUTPUT\nREPORT_END='+ID);
}

MMHB48_NODE
)
