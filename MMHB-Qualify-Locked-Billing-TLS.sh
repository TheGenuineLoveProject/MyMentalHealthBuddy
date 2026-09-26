#!/usr/bin/env bash
(
set -euo pipefail
umask 077
cd /home/runner/workspace
node --input-type=commonjs <<'MMHB50_NODE'
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {spawnSync}=require('node:child_process');
const ROOT='/home/runner/workspace';
const PRIOR=ROOT+'/.git/mmhb-review-evidence/fresh-release-build-kcOaQK';
const G43=ROOT+'/.git/mmhb-review-evidence/billing-adapter-ca5T49';
const G49=ROOT+'/.git/mmhb-review-evidence/locked-resend-aSRNsE';
const DEPENDENCY_ROOT=G49+'/dependency-project';
const G49_PACKAGE_PIN='e034489afed62c076902a2176193bbfb682de357d0c673a517b4026dded4aa7f';
const G49_LOCK_PIN='6574eef640049a1acea6692899408b2d803bcd481fb9b9d3d59efe8d25b76fae';
const ID='MMHB-LOCKED-BILLING-TLS-QUALIFICATION-20260925-50';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const check=(ok,why)=>{if(!ok)throw Error(why);};
const env={PATH:process.env.PATH||'/usr/bin:/bin',LANG:'C.UTF-8',TZ:'UTC',CI:'true',NODE_ENV:'production',
  GIT_OPTIONAL_LOCKS:'0',GIT_TERMINAL_PROMPT:'0',GIT_NO_LAZY_FETCH:'1'};
let data,socket,PG,report,bootReview,candidate,policyPassed=false,started=false,stopped='NOT_STARTED';
let directory,before,status='STOPPED',preserved=false,interrupted=false;
let dependencyInventory,dependencyLock;
const inputs=new Map(),observed=new Map(),candidateFiles=new Map(),clusters=[];
process.on('SIGINT',()=>{interrupted=true;});process.on('SIGTERM',()=>{interrupted=true;});
function git(...args){
  const r=spawnSync('git',['--no-pager','--no-optional-locks','-c','core.fsmonitor=false','-c','core.quotePath=true',...args],
    {cwd:ROOT,env,encoding:'utf8',timeout:30000,maxBuffer:33554432});
  check(!r.error&&r.status===0,'Git inspection failed: '+args[0]);return r.stdout;
}
function bytes(file){
  const s=fs.lstatSync(file);check(s.isFile()&&s.size<=4194304&&fs.realpathSync(file)===file,'Unsafe or oversized bounded input: '+file);
  const value=fs.readFileSync(file),sha256=hash(value);
  if(inputs.has(file))check(inputs.get(file)===sha256,'Input changed: '+file);else inputs.set(file,sha256);
  return value;
}
function observe(file,maxBytes=268435456){
  const value=hashSnapshotInput(file,maxBytes),old=observed.get(file);
  if(old)check(value.sha256===old.sha256&&value.bytes===old.bytes,'Observed input changed: '+file);else observed.set(file,value);
  return value;
}
function snapshot(){
  const index=path.resolve(ROOT,git('rev-parse','--git-path','index').trim());
  check(fs.lstatSync(index).isFile(),'Unexpected Git index');
  return {head:git('rev-parse','HEAD').trim(),branch:git('branch','--show-current').trim(),
    index:hash(fs.readFileSync(index)),tracked:git('status','--porcelain=v1','--untracked-files=no','--ignore-submodules=none'),
    diff:hash(git('diff','--binary','--no-ext-diff','--no-textconv','HEAD','--')),
    untrackedNames:hash(git('ls-files','--others','--exclude-standard','-z')),
    package:hash(bytes(path.join(ROOT,'package.json'))),lock:hash(bytes(path.join(ROOT,'package-lock.json')))};
}
function privateDirectory(dir){
  const s=fs.lstatSync(dir);check(s.isDirectory()&&s.uid===process.getuid()&&(s.mode&0o077)===0&&fs.realpathSync(dir)===dir,'Expected private owned directory: '+dir);
}
function put(rel,value){
  check(!path.isAbsolute(rel)&&!rel.split('/').includes('..'),'Unsafe output path');
  const file=path.join(directory,rel);fs.mkdirSync(path.dirname(file),{recursive:true,mode:0o700});
  fs.writeFileSync(file,value,{flag:'wx',mode:0o600});return file;
}
function run(label,command,args,timeout=45000,ok=[0],cleanup=false){
  check(cleanup||!interrupted,'Interrupted before '+label);
  console.log(label+'=RUNNING');
  const r=spawnSync(command,args,{cwd:candidate||directory,env,encoding:'utf8',timeout,killSignal:'SIGKILL',maxBuffer:8388608});
  put('logs/'+label+'.log',(r.stdout||'')+(r.stderr||'')+(r.error?'\n'+r.error.message:''));
  check(!r.error&&ok.includes(r.status),label+' failed; private log retained');return r;
}

function installedInventory(project,lock){
  const rows=[],seen=new Set();
  function scan(modules,depth=0){
    check(depth<=24,'Installed dependency nesting exceeds bound');
    const ms=fs.lstatSync(modules);check(ms.isDirectory()&&fs.realpathSync(modules)===modules,'Unsafe installed node_modules');
    for(const item of fs.readdirSync(modules,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))){
      if(item.name.startsWith('.'))continue;
      const file=path.join(modules,item.name);
      if(item.name.startsWith('@')){
        check(item.isDirectory()&&fs.realpathSync(file)===file,'Unsafe installed scope');
        for(const child of fs.readdirSync(file,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name)))visit(path.join(file,child.name),depth);
      }else visit(file,depth);
    }
  }
  function visit(folder,depth){
    check(rows.length<10000,'Installed package count exceeds bound');
    const st=fs.lstatSync(folder);check(st.isDirectory()&&fs.realpathSync(folder)===folder,'Linked installed package rejected');
    const rel=path.relative(project,folder).split(path.sep).join('/'),expected=lock.packages[rel];
    check(expected&&!expected.link,'Installed package absent from root lock: '+rel);
    const packageBytes=bytes(path.join(folder,'package.json')),pkg=JSON.parse(packageBytes);
    check(pkg.version===expected.version,'Installed version differs from copied lock: '+rel);
    if(expected.name)check(pkg.name===expected.name,'Installed alias identity differs: '+rel);
    rows.push({path:rel,name:pkg.name,version:pkg.version,packageSha256:hash(packageBytes)});seen.add(rel);
    const nested=path.join(folder,'node_modules');
    try{fs.lstatSync(nested);}catch(e){if(e.code==='ENOENT')return;throw e;}scan(nested,depth+1);
  }
  scan(path.join(project,'node_modules'));
  const hidden=JSON.parse(bytes(path.join(project,'node_modules/.package-lock.json')));
  for(const row of rows){
    const actual=hidden.packages?.[row.path],expected=lock.packages[row.path];
    check(actual&&actual.version===expected.version,'Installed-tree lock differs: '+row.path);
    if(expected.integrity)check(actual.integrity===expected.integrity,'Installed-tree integrity metadata differs: '+row.path);
    if(expected.resolved)check(actual.resolved===expected.resolved,'Installed-tree origin metadata differs: '+row.path);
  }
  const absentOptional=[];
  for(const [rel,entry]of Object.entries(lock.packages))if(rel&&!seen.has(rel)){
    check(entry.optional===true,'Required locked package was not installed: '+rel);absentOptional.push(rel);
  }
  return {packages:rows.sort((a,b)=>a.path.localeCompare(b.path)),absentOptional:absentOptional.sort()};
}
function validateQualifiedDependencies(){
  privateDirectory(G49);privateDirectory(DEPENDENCY_ROOT);
  const prior=JSON.parse(bytes(G49+'/summary.json'));
  check(prior.command==='MMHB-REPLIT-LOCKED-RESEND-QUALIFICATION-20260925-49'&&
    prior.status==='ROOT_LOCKED_RESEND_QUALIFIED_IN_ISOLATED_INSTALL'&&prior.sourcePreserved===true&&
    prior.npmInstallCompleted===true&&prior.npmInstallExitCode===0&&prior.referenceSdkPassed===true&&
    prior.lockedSdkPassed===true&&prior.projectDependencyRepairApplied===false&&prior.releaseQualified===false&&
    prior.dependencyProject===DEPENDENCY_ROOT&&prior.packageSha256===G49_PACKAGE_PIN&&prior.lockSha256===G49_LOCK_PIN,
    'G49 locked dependency qualification differs');
  check(typeof prior.head==='string'&&/^[a-f0-9]{40}$/.test(prior.head),'Invalid G49 commit evidence');
  git('merge-base','--is-ancestor',prior.head,before.head);
  for(const [name,pin]of [['package.json',G49_PACKAGE_PIN],['package-lock.json',G49_LOCK_PIN]]){
    check(hash(bytes(ROOT+'/'+name))===pin&&hash(bytes(DEPENDENCY_ROOT+'/'+name))===pin,'G49 copied manifest differs: '+name);
  }
  dependencyLock=JSON.parse(bytes(DEPENDENCY_ROOT+'/package-lock.json'));
  check(dependencyLock.lockfileVersion===3&&dependencyLock.packages?.['node_modules/resend']?.version==='6.22.1','G49 root lock SDK differs');
  const saved=JSON.parse(bytes(G49+'/installed-metadata.json'));
  dependencyInventory=installedInventory(DEPENDENCY_ROOT,dependencyLock);
  check(JSON.stringify(saved)===JSON.stringify(dependencyInventory)&&prior.installedPackages===dependencyInventory.packages.length,
    'G49 installed dependency metadata changed');
  const sdk=JSON.parse(bytes(G49+'/locked.result.json'));
  check(sdk.status==='SDK_REGRESSION_PASSED'&&sdk.resend==='6.22.1'&&sdk.tests===14&&sdk.pass===14&&
    sdk.controls?.length===1&&sdk.controls.every(x=>x.pass===true)&&sdk.loadedModuleConfinement===true&&!sdk.harnessError&&
    Array.isArray(sdk.loadedModules)&&sdk.loadedModules.length>0&&sdk.loadedModules.length<=200,
    'G49 locked SDK result differs');
  for(const row of sdk.loadedModules){
    check(typeof row.path==='string'&&row.path.startsWith('node_modules/')&&!path.isAbsolute(row.path)&&
      !row.path.split('/').some(x=>!x||x==='.'||x==='..')&&/^[a-f0-9]{64}$/.test(row.sha256),'Invalid G49 SDK input path');
    check(hash(bytes(path.join(DEPENDENCY_ROOT,row.path)))===row.sha256,'G49 SDK source changed: '+row.path);
  }
  console.log('G49_LOCKED_DEPENDENCY_EVIDENCE=PASS_RECORDED_AND_RECHECKED');
  console.log('DEPENDENCY_SCOPE='+JSON.stringify({directory:DEPENDENCY_ROOT,resend:'6.22.1',
    installedPackages:dependencyInventory.packages.length,absentOptional:dependencyInventory.absentOptional.length,
    projectInstallationReplaced:false,nativeInstallScriptsExecuted:false}));
}

const candidatePins={"server/billing/billingRuntime.mjs": "11899c03bd21bf40ee473bb7e910fe0ee74ea09f420efd21b9ca488ee889f055", "server/billing/createApplication.mjs": "c673230f78b22aaa4d55640f0c72e0c5a434f62655cd7e914a407e63bcfbee97", "server/billing/application.mjs": "63ca099e749e1501000288cc28d6507a125dcde805accee64d5f8e1272a0ae2f", "server/billing/billingShutdown.mjs": "7a1118cab260659e475f6d58fd9acb4cf32661ddaef5dede716f1bd967178aeb", "server/services/billingEventTransaction.mjs": "f8a9fce70124b55d5197cdfed53be393cbd098b80cafb607b352c4a101f9db60", "server/services/billingDelivery.mjs": "39cee16ceae83013e500f10cbc3ccc9ccbfca8bd9f9ceafbdb5d2065c3d68f25", "server/services/billingEmailTransport.mjs": "c4757e3c030600af8bf4bb6d7946fc85195541b38e5c0534b8ba5608ec1892d4", "server/services/billingNotificationTemplate.mjs": "cdb91217cea6ea6fb1bee2633a0f9b396d3d9a452acafd37a6d1491a37bd8e34", "server/services/billingNotificationWorker.mjs": "daac9fb0f94fa026a5567d22c3de74041cc1e3f793f44ce4edb0fe3476c2a940", "server/db/billingSchema.mjs": "a76caf2a49a63b9f0fece48c81eefd43c352b0b541ca856cff184e045f47cd13"};
const expectedCandidateFiles=["server/billing/billingRuntime.mjs", "server/billing/createApplication.mjs", "server/billing/application.mjs", "server/billing/billingShutdown.mjs", "server/services/billingEventTransaction.mjs", "server/services/billingDelivery.mjs", "server/services/billingEmailTransport.mjs", "server/services/billingNotificationTemplate.mjs", "server/services/billingNotificationWorker.mjs", "server/db/billingSchema.mjs", "server/db/billingSchemaContract.mjs", "server/app.mjs", "server/routes/webhook.mjs"];

const EXPECTED_TESTS=8,EXPECTED_CONTROLS=1;

function snapshotInputIO(file,destinations,maxBytes) {
  const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
  let initial,canonicalMatch=null,sourceFd;
  const outputFds=[];
  const kind=s=>!s?'unavailable':s.isSymbolicLink()?'symlink':s.isDirectory()?'directory':s.isFile()?'regular':'other';
  function fail(code,extra={}) {
    const metadata={path:typeof file==='string'?file:'[invalid path]',type:kind(initial),
      bytes:initial?initial.size.toString():null,canonicalMatch,...extra};
    throw Object.assign(Error('Snapshot '+code+': '+JSON.stringify(metadata)),{code,metadata});
  }
  const same=(a,b)=>['dev','ino','size','mtimeNs','ctimeNs'].every(key=>a[key]===b[key]);
  function checkCurrent() {
    const opened=fs.fstatSync(sourceFd,{bigint:true});
    if(!opened.isFile()||!same(initial,opened))fail('source_changed');
    let current;
    try{current=fs.lstatSync(file,{bigint:true});}catch(e){fail('source_path_changed',{filesystemCode:e.code});}
    let canonical;
    try{canonical=fs.realpathSync(file)===file;}catch{canonical=false;}
    if(!current.isFile()||!same(initial,current)||!canonical)fail('source_path_changed',{currentType:kind(current),currentCanonicalMatch:canonical});
  }
  if(typeof file!=='string'||!path.isAbsolute(file)||path.resolve(file)!==file)fail('invalid_source_path');
  if(!Number.isSafeInteger(maxBytes)||maxBytes<0||maxBytes>268435456)fail('invalid_snapshot_bound');
  if(!Array.isArray(destinations)||destinations.length>2||new Set(destinations).size!==destinations.length)
    fail('invalid_destinations');
  try{initial=fs.lstatSync(file,{bigint:true});}catch(e){fail('source_unavailable',{filesystemCode:e.code});}
  try{canonicalMatch=fs.realpathSync(file)===file;}catch{canonicalMatch=false;}
  if(!initial.isFile())fail('source_not_regular');
  if(!canonicalMatch)fail('source_path_not_canonical');
  if(initial.size>BigInt(maxBytes))fail('source_exceeds_remaining_budget',{maxBytes});
  if(!Number.isInteger(fs.constants.O_NOFOLLOW)||!Number.isInteger(fs.constants.O_NONBLOCK))
    fail('required_open_flags_unavailable');
  for(const destination of destinations) {
    if(typeof destination!=='string'||!path.isAbsolute(destination)||path.resolve(destination)!==destination||destination===file)
      fail('invalid_destination');
    const parent=path.dirname(destination);
    let safe=false;
    try{safe=fs.lstatSync(parent).isDirectory()&&fs.realpathSync(parent)===parent;}catch{}
    if(!safe)fail('destination_parent_not_canonical',{destination});
  }
  try {
    try{sourceFd=fs.openSync(file,fs.constants.O_RDONLY|fs.constants.O_NOFOLLOW|fs.constants.O_NONBLOCK);}
    catch(e){fail('source_open_failed',{filesystemCode:e.code});}
    checkCurrent();
    // Only create output files after the source and every destination parent
    // have passed validation. Exclusive creation preserves existing work.
    for(const destination of destinations) {
      try{outputFds.push(fs.openSync(destination,fs.constants.O_WRONLY|fs.constants.O_CREAT|
        fs.constants.O_EXCL|fs.constants.O_NOFOLLOW,0o600));}
      catch(e){fail('destination_open_failed',{destination,filesystemCode:e.code});}
    }
    const buffer=Buffer.allocUnsafe(1048576),digest=crypto.createHash('sha256');
    let bytes=0;
    for(;;) {
      // One extra byte detects growth at the exact remaining-budget boundary.
      const length=Math.min(buffer.length,maxBytes-bytes+1);
      const count=fs.readSync(sourceFd,buffer,0,length,null);
      if(count===0)break;
      bytes+=count;
      if(bytes>maxBytes)fail('source_grew_beyond_budget',{maxBytes,observedBytes:bytes});
      if(BigInt(bytes)>initial.size)fail('source_changed',{observedBytes:bytes});
      const chunk=buffer.subarray(0,count);digest.update(chunk);
      for(const fd of outputFds) {
        let written=0;
        while(written<count) {
          const amount=fs.writeSync(fd,chunk,written,count-written,null);
          if(amount<=0)fail('destination_write_stalled');
          written+=amount;
        }
      }
    }
    if(BigInt(bytes)!==initial.size)fail('source_changed',{observedBytes:bytes});
    checkCurrent();
    const result={bytes,sha256:digest.digest('hex')};
    // Confirm both on-disk copies through the same bounded read path. This
    // also rejects output mutation or replacement before accepting a snapshot.
    for(const destination of destinations) {
      const copied=snapshotInputIO(destination,[],maxBytes);
      if(copied.bytes!==result.bytes||copied.sha256!==result.sha256)fail('destination_digest_mismatch',{destination});
    }
    checkCurrent();
    return result;
  } finally {
    let closeError;
    for(const fd of outputFds)try{fs.closeSync(fd);}catch(e){closeError??=e;}
    if(sourceFd!==undefined)try{fs.closeSync(sourceFd);}catch(e){closeError??=e;}
    if(closeError)fail('descriptor_close_failed',{filesystemCode:closeError.code});
  }
}
function copySnapshotInput(file,destinations,maxBytes) {
  if(!Array.isArray(destinations)||destinations.length<1)throw Error('Snapshot copy requires at least one destination');
  return snapshotInputIO(file,destinations,maxBytes);
}
function hashSnapshotInput(file,maxBytes) {
  return snapshotInputIO(file,[],maxBytes);
}

function captureBootSources({root,candidate,readFile}) {
  const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
  if(typeof readFile!=='function'||typeof root!=='string'||typeof candidate!=='string'||
    !path.isAbsolute(root)||!path.isAbsolute(candidate))throw Error('Invalid boot capture inputs');
  const tree=path.resolve(candidate),live=path.resolve(root);
  if(tree===live||fs.realpathSync(tree)!==tree||!fs.lstatSync(tree).isDirectory())
    throw Error('Boot capture requires a canonical detached candidate directory');
  const limits={files:16,bytes:192*1024,authFiles:12,authBytes:128*1024,perFileBytes:64*1024,edges:256};
  const manifest=[],chunks=['BOOT_SOURCE_CAPTURE_SCOPE=READ_ONLY;APPLICATION_MODULES_NOT_EXECUTED;REDACTION=BEST_EFFORT'];
  const limitations=[
    'This source review does not qualify full server boot, external integrations, production TLS, or readiness.',
    'Only the authentication local import closure, direct internal-intelligence imports, and biometrics crypto root are selected.',
    'Literal dependency detection is a bounded lexical inventory; computed imports, package implementations and runtime loading are not traversed.',
    'Source text may contain confidential literals not covered by best-effort redaction; review before sharing.'
  ];
  const captured=new Map(),attempted=new Set(),authSeen=new Set(),authCounted=new Set(),edges=[];
  let totalBytes=0,authBytes=0,authFiles=0,truncated=false;
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
  function safeRelative(rel){return typeof rel==='string'&&rel.length<=300&&
    /^[A-Za-z0-9_@./-]+$/.test(rel)&&!path.isAbsolute(rel)&&
    !rel.split('/').some(x=>!x||x==='.'||x==='..'||x==='node_modules'||x==='.git'||
      x.startsWith('.env')||x==='.ssh'||x==='.aws')&&/\.(?:mjs|cjs|js|mts|cts|ts|jsx|tsx)$/.test(rel);}
  function entry(rel){
    if(!safeRelative(rel))return {state:'REJECTED_SOURCE_PATH'};
    const absolute=path.join(tree,rel);let stat;
    try{stat=fs.lstatSync(absolute);}catch(error){return {state:error.code==='ENOENT'?'MISSING':'UNREADABLE_METADATA'};}
    if(!stat.isFile()||stat.isSymbolicLink())return {state:'REJECTED_NONREGULAR_SOURCE'};
    try{if(fs.realpathSync(absolute)!==absolute)return {state:'REJECTED_NONCANONICAL_SOURCE'};}
    catch{return {state:'UNREADABLE_METADATA'};}
    return {state:'REGULAR',absolute,stat};
  }
  function record(item){manifest.push(item);chunks.push('BOOT_REVIEW_SOURCE='+JSON.stringify(item));}
  // Ignore comments and string contents when detecting import keywords. This
  // tokenizer deliberately does not evaluate JavaScript or decode string escapes.
  function dependencies(source){
    const tokens=[];let i=0,unsupported=false;
    while(i<source.length){const c=source[i];
      if(/\s/.test(c)){i++;continue;}
      if(c==='/'&&source[i+1]==='/'){i=source.indexOf('\n',i+2);if(i<0)break;continue;}
      if(c==='/'&&source[i+1]==='*'){const end=source.indexOf('*/',i+2);if(end<0)break;i=end+2;continue;}
      if(c==='"'||c==="'"){
        const quote=c;let value='',escaped=false;i++;
        while(i<source.length&&source[i]!==quote){if(source[i]==='\\'){escaped=true;i+=2;}else value+=source[i++];}
        if(i<source.length)i++;tokens.push({kind:'string',value,escaped});continue;
      }
      if(c==='`'){
        unsupported=true;i++;while(i<source.length){if(source[i]==='\\'){i+=2;continue;}if(source[i++]==='`')break;}
        tokens.push({kind:'template',value:''});continue;
      }
      if(/[A-Za-z_$]/.test(c)){const begin=i++;while(i<source.length&&/[\w$]/.test(source[i]))i++;
        tokens.push({kind:'word',value:source.slice(begin,i)});continue;}
      tokens.push({kind:'punct',value:c});i++;
    }
    const specs=new Set();
    const add=t=>{if(t?.kind==='string'&&!t.escaped)specs.add(t.value);else unsupported=true;};
    for(let n=0;n<tokens.length;n++){
      const t=tokens[n];if(t.kind!=='word'||!['import','export','require'].includes(t.value))continue;
      if(tokens[n-1]?.value==='.')continue;
      if(t.value==='require'){if(tokens[n+1]?.value==='(')add(tokens[n+2]);continue;}
      if(t.value==='import'&&tokens[n+1]?.value==='.')continue;
      if(t.value==='import'&&tokens[n+1]?.value==='('){add(tokens[n+2]);continue;}
      if(t.value==='import'&&tokens[n+1]?.kind==='string'){add(tokens[n+1]);continue;}
      for(let j=n+1;j<Math.min(tokens.length,n+150);j++){
        if(tokens[j].value===';'||(['import','export'].includes(tokens[j].value)&&tokens[j].kind==='word'))break;
        if(tokens[j].value==='from'&&tokens[j].kind==='word'){add(tokens[j+1]);break;}
      }
    }
    return {specifiers:[...specs].sort(),unsupported};
  }
  function resolve(from,specifier){
    if(!specifier.startsWith('.'))return {state:'PACKAGE_OR_BUILTIN_NOT_TRAVERSED'};
    if(specifier.includes('?')||specifier.includes('#')||specifier.includes('\\')||specifier.includes('%'))
      return {state:'UNSUPPORTED_LOCAL_SPECIFIER'};
    const absolute=path.resolve(tree,path.dirname(from),specifier),rel=path.relative(tree,absolute).split(path.sep).join('/');
    if(!rel||rel==='..'||rel.startsWith('../')||path.isAbsolute(rel))return {state:'REJECTED_OUTSIDE_CANDIDATE'};
    const ext=path.extname(rel),options=ext?[rel]:['.mjs','.js','.cjs','.ts','.mts','.cts','.jsx','.tsx'].flatMap(x=>[rel+x,rel+'/index'+x]);
    const matches=options.filter(x=>entry(x).state==='REGULAR');
    if(matches.length===1)return {state:'RESOLVED',file:matches[0]};
    if(matches.length>1)return {state:'AMBIGUOUS_EXTENSIONLESS_IMPORT',matches};
    return {state:ext?entry(rel).state:'MISSING_OR_UNSUPPORTED_LOCAL_DEPENDENCY',file:rel};
  }
  function capture(rel,scope){
    if(captured.has(rel)){
      const cached=captured.get(rel);
      if(scope==='auth'&&!authCounted.has(rel)){
        if(authFiles>=limits.authFiles||authBytes+cached.bytes>limits.authBytes){
          truncated=true;record({file:rel,scope,state:'AUTH_TRAVERSAL_LIMIT',bytes:cached.bytes,truncated:true});return null;}
        authCounted.add(rel);authFiles++;authBytes+=cached.bytes;
      }
      return cached;
    }
    if(attempted.has(rel))return null;attempted.add(rel);
    const meta=entry(rel);if(meta.state!=='REGULAR'){record({file:rel,scope,state:meta.state});return null;}
    let reason=null;
    if(meta.stat.size>limits.perFileBytes)reason='PER_FILE_BYTE_LIMIT';
    else if(captured.size>=limits.files)reason='TOTAL_FILE_LIMIT';
    else if(totalBytes+meta.stat.size>limits.bytes)reason='TOTAL_BYTE_LIMIT';
    else if(scope==='auth'&&(authFiles>=limits.authFiles||authBytes+meta.stat.size>limits.authBytes))reason='AUTH_TRAVERSAL_LIMIT';
    if(reason){truncated=true;record({file:rel,scope,state:reason,bytes:meta.stat.size,truncated:true});return null;}
    let raw;try{raw=readFile(meta.absolute);}catch{record({file:rel,scope,state:'SOURCE_READ_FAILED'});return null;}
    if(!Buffer.isBuffer(raw))raw=Buffer.from(raw);
    const after=entry(rel);
    if(after.state!=='REGULAR'||after.stat.dev!==meta.stat.dev||after.stat.ino!==meta.stat.ino||
      after.stat.size!==meta.stat.size||after.stat.mtimeMs!==meta.stat.mtimeMs||after.stat.ctimeMs!==meta.stat.ctimeMs||
      raw.length!==meta.stat.size||raw.length>limits.perFileBytes||totalBytes+raw.length>limits.bytes){
      record({file:rel,scope,state:'SOURCE_CHANGED_OR_LIMIT_EXCEEDED',truncated:true});truncated=true;return null;}
    const source=raw.toString('utf8'),text=redact(source),scan=dependencies(source);
    const item={file:rel,scope,state:'CAPTURED',sha256:crypto.createHash('sha256').update(raw).digest('hex'),
      bytes:raw.length,redacted:text!==source,lines:text.split('\n').length,truncated:false};
    record(item);chunks.push(text.split('\n').map((line,n)=>(n+1)+'|'+line).join('\n'));
    chunks.push('END_BOOT_REVIEW_SOURCE='+JSON.stringify(rel));totalBytes+=raw.length;
    if(scope==='auth'){authCounted.add(rel);authFiles++;authBytes+=raw.length;}
    scan.bytes=raw.length;captured.set(rel,scan);
    if(scan.unsupported)limitations.push('Lexical inventory may omit computed, template, or escaped dependencies in '+rel);
    return scan;
  }
  const internal='server/internal-intelligence-server.mjs',auth='server/replit_integrations/auth/index.mjs';
  const internalScan=capture(internal,'internal-root');
  capture(auth,'auth');
  capture('server/biometrics/crypto.mjs','crypto-root');
  const queue=[auth];
  while(queue.length){const rel=queue.shift();if(authSeen.has(rel))continue;authSeen.add(rel);
    const scan=capture(rel,'auth');if(!scan)continue;
    for(const specifier of scan.specifiers){if(edges.length>=limits.edges){truncated=true;break;}
      const resolution=resolve(rel,specifier);edges.push({from:rel,specifier,...resolution});
      if(resolution.state==='RESOLVED')queue.push(resolution.file);}
  }
  for(const specifier of internalScan?.specifiers||[]){if(edges.length>=limits.edges){truncated=true;break;}
    const resolution=resolve(internal,specifier);
    edges.push({from:internal,specifier,...resolution});if(resolution.state==='RESOLVED')capture(resolution.file,'internal-direct');}
  for(const edge of edges)chunks.push('BOOT_IMPORT_EDGE='+redact(JSON.stringify(edge)));
  if(truncated)limitations.push('One or more file, byte, or dependency-edge limits were reached; omitted source remains unreviewed.');
  chunks.push('BOOT_CAPTURE_COUNTS='+JSON.stringify({files:captured.size,bytes:totalBytes,authFiles,authBytes,limits,truncated}));
  chunks.push('BOOT_CAPTURE_LIMITATIONS='+JSON.stringify(limitations));
  return {text:chunks.join('\n')+'\n',manifest,limitations};
}

async function qualifyBillingTls() {
  'use strict';
  const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),dns=require('node:dns');
  const {createRequire,registerHooks,isBuiltin}=require('node:module'),{pathToFileURL,fileURLToPath}=require('node:url');
  const cfg=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
  const fault=code=>Object.assign(Error(code),{code});
  const check=(value,code)=>{if(!value)throw fault(code);};
  const safeCode=error=>{
    const seen=new Set();
    for(let n=0;error&&n<8&&!seen.has(error);n++,error=error.cause){
      seen.add(error);
      if(typeof error.code==='string'&&/^[A-Z0-9_]{1,90}$/.test(error.code))return error.code;
    }
    return 'UNCLASSIFIED_ERROR';
  };
  const codes=error=>{
    const result=[],seen=new Set();
    for(let n=0;error&&n<8&&!seen.has(error);n++,error=error.cause){
      seen.add(error);if(typeof error.code==='string'&&/^[A-Z0-9_]{1,90}$/.test(error.code))result.push(error.code);
    }
    return result;
  };
  async function bounded(promise,code,ms=15000){
    let timer;try{return await Promise.race([promise,new Promise((_resolve,reject)=>{timer=setTimeout(()=>reject(fault(code)),ms);})]);}
    finally{clearTimeout(timer);}
  }
  function regular(file,max=1048576){
    const s=fs.lstatSync(file);check(s.isFile()&&s.size>0&&s.size<=max&&fs.realpathSync(file)===file,'UNSAFE_FIXTURE_FILE');
    return fs.readFileSync(file,'utf8');
  }
  for(const directory of [cfg.root,cfg.dependencyRoot,cfg.candidateRoot,cfg.directory,cfg.data,cfg.wrongHostData,cfg.socket]){
    check(typeof directory==='string'&&path.isAbsolute(directory)&&fs.realpathSync(directory)===directory&&fs.lstatSync(directory).isDirectory(),'UNSAFE_FIXTURE_DIRECTORY');
  }
  check(cfg.data.startsWith(cfg.directory+path.sep)&&cfg.wrongHostData.startsWith(cfg.directory+path.sep)&&cfg.data!==cfg.wrongHostData,'DATABASE_OUTSIDE_EVIDENCE');
  check(/^\/tmp\/mmhb-g45-[A-Za-z0-9]+$/.test(cfg.socket),'UNEXPECTED_SOCKET_DIRECTORY');
  check((fs.lstatSync(cfg.socket).mode&0o077)===0&&fs.lstatSync(cfg.socket).uid===process.getuid(),'UNSAFE_SOCKET_OWNERSHIP');
  for(const port of [cfg.port,cfg.wrongHostPort])check(Number.isSafeInteger(port)&&port>=1024&&port<=65535,'INVALID_FIXTURE_PORT');
  check(cfg.port!==cfg.wrongHostPort,'FIXTURE_PORTS_MUST_DIFFER');
  check(typeof cfg.password==='string'&&/^[a-f0-9]{64}$/.test(cfg.password),'INVALID_FIXTURE_PASSWORD');
  check(process.env.NODE_ENV==='production','PRODUCTION_ENVIRONMENT_REQUIRED');
  for(const key of Object.keys(process.env))check(!/^(PG|DATABASE_)|^(NODE_OPTIONS|NODE_PATH|NODE_EXTRA_CA_CERTS|NODE_TLS_REJECT_UNAUTHORIZED)$/.test(key),'UNEXPECTED_INHERITED_DATABASE_OR_TLS_ENV');
  const ca=regular(cfg.caFile),wrongCa=regular(cfg.wrongCaFile);
  check(cfg.caFile.startsWith(cfg.directory+path.sep)&&cfg.wrongCaFile.startsWith(cfg.directory+path.sep),'CERTIFICATE_OUTSIDE_EVIDENCE');
  const trusted=new crypto.X509Certificate(ca),untrusted=new crypto.X509Certificate(wrongCa);
  check(trusted.ca&&untrusted.ca&&trusted.fingerprint256!==untrusted.fingerprint256,'INVALID_DISTINCT_CA_FIXTURES');
  const pidFor=(data,port)=>{
    const pid=regular(path.join(data,'postmaster.pid')).trimEnd().split('\n');
    check(/^\d+$/.test(pid[0])&&Number(pid[0])>1&&pid[1]===data&&Number(pid[3])===port&&pid[4]===cfg.socket,'POSTMASTER_IDENTITY_MISMATCH');
    process.kill(Number(pid[0]),0);return pid;
  };
  const pid=pidFor(cfg.data,cfg.port),wrongHostPid=pidFor(cfg.wrongHostData,cfg.wrongHostPort);
  check(pid[0]!==wrongHostPid[0],'FIXTURE_POSTMASTERS_MUST_DIFFER');
  const requireFromDependencies=createRequire(path.join(cfg.dependencyRoot,'package.json'));
  let Pool,Client,sql,moduleGuard,loadedModules=[],runtimeModuleConfinement=false;
  // Keep resolution guards within this harness; no application source is changed.
  function installRuntimeModuleGuard(){
    check(typeof registerHooks==='function','SYNCHRONOUS_MODULE_HOOKS_UNAVAILABLE');
    const dependencyModules=path.join(cfg.dependencyRoot,'node_modules');
    check(fs.realpathSync(dependencyModules)===dependencyModules&&fs.lstatSync(dependencyModules).isDirectory(),'UNSAFE_DEPENDENCY_DIRECTORY');
    const observed=new Map();let total=0,violation=false;
    function moduleFile(url){
      if(isBuiltin(url))return null;
      try{
        const address=new URL(url);
        check(address.protocol==='file:'&&!address.search&&!address.hash,'MODULE_PROTOCOL_NOT_ALLOWED');
        const file=fileURLToPath(address),canonical=fs.realpathSync(file);
        check(canonical===path.resolve(file),'MODULE_PATH_NOT_CANONICAL');
        const scope=canonical.startsWith(dependencyModules+path.sep)?'dependency':canonical.startsWith(cfg.candidateRoot+path.sep)?'candidate':null;
        check(scope,'MODULE_OUTSIDE_QUALIFIED_ROOTS');
        return {file,scope,path:path.relative(scope==='dependency'?cfg.dependencyRoot:cfg.candidateRoot,file).split(path.sep).join('/')};
      }catch(error){violation=true;throw error;}
    }
    function observeModule(info){
      try{
      const st=fs.lstatSync(info.file);
      check(st.isFile()&&st.size<=8388608,'UNSAFE_OR_OVERSIZED_RUNTIME_MODULE');
      const value=fs.readFileSync(info.file),sha256=crypto.createHash('sha256').update(value).digest('hex');
      check(value.length===st.size,'RUNTIME_MODULE_SIZE_CHANGED');
      const prior=observed.get(info.file);
      if(prior)check(prior.sha256===sha256&&prior.bytes===value.length,'RUNTIME_MODULE_CHANGED');
      else{
        check(observed.size<2048&&total+value.length<=67108864,'RUNTIME_MODULE_SCOPE_EXCEEDED');
        observed.set(info.file,{scope:info.scope,path:info.path,bytes:value.length,sha256});total+=value.length;
      }
      }catch(error){violation=true;throw error;}
    }
    const hooks=registerHooks({
      resolve(specifier,context,nextResolve){const result=nextResolve(specifier,context);moduleFile(result.url);return result;},
      load(url,context,nextLoad){
        const info=moduleFile(url);if(info)observeModule(info);
        const result=nextLoad(url,context);if(info)observeModule(info);return result;
      }
    });
    return {
      finish(){
        check(!violation,'RUNTIME_MODULE_CONFINEMENT_VIOLATION');
        check([...observed.values()].some(row=>row.scope==='candidate')&&[...observed.values()].some(row=>row.scope==='dependency'),'RUNTIME_MODULE_GRAPH_INCOMPLETE');
        for(const [file,row]of observed)observeModule({...row,file});
        return [...observed.values()].sort((a,b)=>(a.scope+'/'+a.path).localeCompare(b.scope+'/'+b.path));
      },
      stop(){hooks.deregister();}
    };
  }
  const savedOrder=dns.getDefaultResultOrder(),savedFetch=globalThis.fetch;
  const checks=[],controls=[],pools=new Map();let owner,wrongHostOwner,identity,wrongHostIdentity,externalCalls=0,preflightError=null,cleanupError=null;
  const tlsErrors=new Set(['SELF_SIGNED_CERT_IN_CHAIN','DEPTH_ZERO_SELF_SIGNED_CERT','UNABLE_TO_VERIFY_LEAF_SIGNATURE','UNABLE_TO_GET_ISSUER_CERT','UNABLE_TO_GET_ISSUER_CERT_LOCALLY']);
  dns.setDefaultResultOrder('ipv4first');
  globalThis.fetch=async()=>{externalCalls++;throw fault('EXTERNAL_FETCH_FORBIDDEN');};
  const endpoint=(port=cfg.port)=>{
    const url=new URL('postgresql://localhost/postgres');url.hostname='localhost';url.port=String(port);url.username='mmhb_owner';url.password=cfg.password;return url;
  };
  const fixtureEnv=(overrides={})=>({NODE_ENV:'production',DATABASE_URL:endpoint().toString(),MMHB_BILLING_PIPELINE_ENABLED:'true',...overrides});
  const ownerOptions={host:cfg.socket,port:cfg.port,user:'mmhb_owner',password:cfg.password,database:'postgres',ssl:false,
    max:1,connectionTimeoutMillis:3000,idleTimeoutMillis:1000,statement_timeout:5000,query_timeout:10000,application_name:'mmhb-g45-owner'};
  async function closeAll(){
    for(const [pool,record]of pools){
      record.closing||=(Promise.resolve().then(()=>pool.end()));
      await bounded(record.closing,'POOL_SHUTDOWN_TIMEOUT',6000);pools.delete(pool);
    }
  }
  async function test(name,work,control=false){
    const record={name,pass:false};
    try{const details=await work();check(externalCalls===0,'UNEXPECTED_EXTERNAL_CALL');record.pass=true;if(details)Object.assign(record,details);}
    catch(error){record.errorCode=safeCode(error);}
    finally{
      try{await closeAll();}catch(error){record.pass=false;record.cleanupErrorCode=safeCode(error);}
      (control?controls:checks).push(record);
    }
  }
  const encryptedSql=()=>sql`SELECT current_setting('data_directory') AS data,current_user AS role,current_database() AS database,
    inet_server_addr()::text AS address,inet_server_port() AS port,
    extract(epoch FROM pg_postmaster_start_time())::text AS started,
    s.ssl AS encrypted,s.version AS tls_version,s.cipher AS cipher,
    current_setting('application_name') AS application
    FROM pg_catalog.pg_stat_ssl AS s WHERE s.pid=pg_backend_pid()`;
  function checkEncrypted(row,{application='mmhb-billing',expectedData=cfg.data,expectedPort=cfg.port,expectedIdentity=identity}={}){
    check(row&&row.data===expectedData&&row.role==='mmhb_owner'&&row.database==='postgres'&&row.address==='127.0.0.1'&&row.port===expectedPort,'ENCRYPTED_DATABASE_IDENTITY_MISMATCH');
    check(row.started===expectedIdentity.started&&row.encrypted===true&&/^TLSv1\.[23]$/.test(row.tls_version)&&typeof row.cipher==='string'&&row.cipher.length>0,'ENCRYPTION_NOT_CONFIRMED');
    check(row.application===application,'UNEXPECTED_APPLICATION_ID');
    return {encrypted:true,tlsVersion:row.tls_version};
  }
  let createBillingApplication;
  function application(env,expectedCa){
    const configs=[],clients=[];
    const requestedPort=Number(new URL(env.DATABASE_URL).port);
    check([cfg.port,cfg.wrongHostPort].includes(requestedPort),'APPLICATION_PORT_ESCAPED_FIXTURE');
    const app=createBillingApplication({env,onState(){},workerOptions:{onReport(){}},poolFactory:config=>{
      configs.push(config);
      check(config.ssl&&config.ssl.rejectUnauthorized===true&&config.ssl.ca===expectedCa,'EXPLICIT_TRUST_REPLACED');
      check(config.max===3&&config.connectionTimeoutMillis===3000&&config.statement_timeout===5000&&config.query_timeout===12000,'CONNECTION_BOUNDS_REPLACED');
      const parsed=new Client(config).connectionParameters;
      check(parsed.host==='localhost'&&parsed.port===requestedPort&&parsed.user==='mmhb_owner'&&parsed.database==='postgres'&&parsed.password===cfg.password,'TCP_ENDPOINT_ESCAPED_FIXTURE');
      check(parsed.ssl&&parsed.ssl.rejectUnauthorized===true&&parsed.ssl.ca===expectedCa,'PARSED_TRUST_REPLACED');
      const pool=new Pool(config);pools.set(pool,{});pool.on('connect',client=>clients.push(client));return pool;
    }});
    check(configs.length===1&&app.db&&app.runtime.status().state==='idle','UNEXPECTED_APPLICATION_STARTUP');
    return {app,configs,clients};
  }
  async function accepted(env,expectedCa){
    const {app,configs,clients}=application(env,expectedCa);
    const result=await bounded(app.db.execute(encryptedSql()),'TLS_QUERY_TIMEOUT');
    const evidence=checkEncrypted(result.rows[0]);
    check(clients.length===1&&clients[0].connection.stream.encrypted===true&&clients[0].connection.stream.authorized===true,'CLIENT_TRUST_NOT_AUTHORIZED');
    check(app.runtime.status().state==='idle','WORKER_RUNTIME_WAS_STARTED');
    return {...evidence,authorized:true,configs};
  }
  async function rejected(env,expectedCa,allowed){
    const {app,clients}=application(env,expectedCa);let captured;
    try{await bounded(app.db.execute(encryptedSql()),'TLS_QUERY_TIMEOUT');}catch(error){captured=error;}
    check(captured,'UNTRUSTED_CONNECTION_WAS_ACCEPTED');
    const observed=codes(captured),expected=observed.find(code=>allowed.has(code));
    check(expected,'REJECTION_WAS_NOT_EXPECTED_TLS_ERROR');check(clients.length===0,'REJECTED_CLIENT_REACHED_POOL');
    check(app.runtime.status().state==='idle','WORKER_RUNTIME_WAS_STARTED');return{rejectionCode:expected};
  }
  function adversarialUrl(rootCert){
    const url=endpoint();
    for(const [key,value]of Object.entries({sslmode:'require',sslrootcert:rootCert,sslcert:path.join(cfg.directory,'absent-client-cert.pem'),
      sslkey:path.join(cfg.directory,'absent-client-key.pem'),sslpassword:'synthetic-only',sslnegotiation:'direct',ssl:'false',
      options:'-c statement_timeout=0',statement_timeout:'0',query_timeout:'0',idle_in_transaction_session_timeout:'0',connect_timeout:'0',application_name:'unexpected'}))url.searchParams.set(key,value);
    return url.toString();
  }
  try{
    moduleGuard=installRuntimeModuleGuard();
    ({Pool,Client}=requireFromDependencies('pg'));({sql}=requireFromDependencies('drizzle-orm'));
    owner=new Pool(ownerOptions);owner.on('error',()=>{});
    wrongHostOwner=new Pool({...ownerOptions,port:cfg.wrongHostPort});wrongHostOwner.on('error',()=>{});
    async function verifyOwner(pool,data,port,pid){
      const result=(await bounded(pool.query(`SELECT current_setting('data_directory') AS data,current_setting('listen_addresses') AS listen,
        current_setting('ssl') AS ssl,current_setting('port')::int AS port,inet_server_addr() AS address,current_user AS owner,
        extract(epoch FROM pg_postmaster_start_time())::text AS started`),'PRIVATE_DATABASE_IDENTITY_TIMEOUT')).rows[0];
      check(result.data===data&&result.listen==='127.0.0.1'&&result.ssl==='on'&&result.port===port&&result.address===null&&result.owner==='mmhb_owner','PRIVATE_DATABASE_IDENTITY_MISMATCH');
      check(Math.abs(Number(result.started)-Number(pid[2]))<2,'POSTMASTER_START_TIME_MISMATCH');return result;
    }
    identity=await verifyOwner(owner,cfg.data,cfg.port,pid);
    wrongHostIdentity=await verifyOwner(wrongHostOwner,cfg.wrongHostData,cfg.wrongHostPort,wrongHostPid);
    ({createBillingApplication}=await import(pathToFileURL(path.join(cfg.candidateRoot,'server/billing/createApplication.mjs')).href));
    check(typeof createBillingApplication==='function','APPLICATION_FACTORY_MISSING');
    await test('trusted_inline_ca_encrypts_actual_adapter_query',async()=>{
      const {configs,...result}=await accepted(fixtureEnv({DATABASE_SSL_CA_PEM:ca}),ca);return result;
    });
    await test('trusted_ca_file_encrypts_actual_adapter_query',async()=>{
      const {configs,...result}=await accepted(fixtureEnv({PGSSLROOTCERT:cfg.caFile}),ca);return result;
    });
    await test('default_trust_rejects_private_ca',()=>rejected(fixtureEnv(),undefined,tlsErrors));
    await test('wrong_ca_rejects_actual_adapter_connection',()=>rejected(fixtureEnv({DATABASE_SSL_CA_PEM:wrongCa}),wrongCa,tlsErrors));
    await test('trusted_ca_rejects_hostname_mismatch',()=>rejected(fixtureEnv({DATABASE_URL:endpoint(cfg.wrongHostPort).toString(),DATABASE_SSL_CA_PEM:ca}),ca,new Set(['ERR_TLS_CERT_ALTNAME_INVALID'])));
    await test('dsn_ssl_parameters_cannot_replace_valid_explicit_trust',async()=>{
      const {configs,...result}=await accepted(fixtureEnv({DATABASE_URL:adversarialUrl(cfg.wrongCaFile),DATABASE_SSL_CA_PEM:ca}),ca);
      check(new URL(configs[0].connectionString).searchParams.size===0,'UNSAFE_DSN_PARAMETERS_REMAIN');return result;
    });
    await test('dsn_require_cannot_bypass_wrong_explicit_ca',()=>rejected(fixtureEnv({DATABASE_URL:adversarialUrl(cfg.caFile),DATABASE_SSL_CA_PEM:wrongCa}),wrongCa,tlsErrors));
    await test('production_disabled_tls_rejected_before_pool_construction',async()=>{
      let constructed=0,captured;
      try{createBillingApplication({env:fixtureEnv({DATABASE_SSL:'false'}),onState(){},poolFactory(){constructed++;throw fault('POOL_MUST_NOT_BE_CREATED');}});}
      catch(error){captured=error;}
      check(captured&&captured.message==='DATABASE_SSL=false is not permitted when NODE_ENV=production'&&constructed===0,'DISABLED_TLS_REACHED_POOL');return{poolConstructed:false};
    });
    await test('insecure_raw_pg_control_accepts_wrong_ca_and_wrong_hostname',async()=>{
      // Fixture-only negative control: deliberately bypass authentication of this
      // synthetic loopback server; never used by the application adapter.
      const pool=new Pool({host:'localhost',port:cfg.wrongHostPort,user:'mmhb_owner',password:cfg.password,database:'postgres',
        ssl:{ca:wrongCa,rejectUnauthorized:false},max:1,connectionTimeoutMillis:3000,statement_timeout:5000,query_timeout:10000,
        application_name:'mmhb-g45-negative-control'});pools.set(pool,{});pool.on('error',()=>{});
      const result=await bounded(pool.query(`SELECT current_setting('data_directory') AS data,current_user AS role,current_database() AS database,
        inet_server_addr()::text AS address,inet_server_port() AS port,extract(epoch FROM pg_postmaster_start_time())::text AS started,
        s.ssl AS encrypted,s.version AS tls_version,s.cipher AS cipher,current_setting('application_name') AS application
        FROM pg_catalog.pg_stat_ssl AS s WHERE s.pid=pg_backend_pid()`),'NEGATIVE_CONTROL_TIMEOUT');
      return {...checkEncrypted(result.rows[0],{application:'mmhb-g45-negative-control',expectedData:cfg.wrongHostData,expectedPort:cfg.wrongHostPort,expectedIdentity:wrongHostIdentity}),fixtureOnly:true,authorizationDeliberatelyDisabled:true};
    },true);
  }catch(error){preflightError=safeCode(error);}
  finally{
    try{await closeAll();}catch(error){cleanupError=safeCode(error);}
    for(const pool of [owner,wrongHostOwner])if(pool)try{await bounded(pool.end(),'OWNER_SHUTDOWN_TIMEOUT',6000);}catch(error){cleanupError=safeCode(error);}
    if(moduleGuard){
      try{loadedModules=moduleGuard.finish();runtimeModuleConfinement=true;}catch(error){cleanupError=safeCode(error);}
      finally{moduleGuard.stop();}
    }
    dns.setDefaultResultOrder(savedOrder);globalThis.fetch=savedFetch;
  }
  const report={scope:'ACTUAL_BILLING_ADAPTER_PRIVATE_POSTGRES_TLS_PRODUCTION_MODE',tests:checks.length,pass:checks.filter(x=>x.pass).length,
    checks,controls,failed:checks.filter(x=>!x.pass),preflightError,cleanupError,externalCalls,workerStarted:false,
    deployedDatabaseQualified:false,liveDatabaseConnections:0,sourceWrites:0,
    dependencyRoot:cfg.dependencyRoot,runtimeModuleConfinement,loadedModules};
  fs.writeFileSync(path.join(cfg.directory,'tls.result.json'),JSON.stringify(report,null,2)+'\n',{flag:'wx',mode:0o600});
  console.log('TLS_RESULT='+JSON.stringify(report));
  check(checks.length===8&&checks.every(x=>x.pass)&&controls.length===1&&controls.every(x=>x.pass)&&!preflightError&&!cleanupError&&externalCalls===0&&runtimeModuleConfinement,'TLS_QUALIFICATION_FAILED');
  return report;
}

async function main(){
try{
  console.log('COMMAND_ID='+ID);
  check(JSON.parse(bytes(ROOT+'/package.json')).name==='mymentalhealthbuddy','Project identity mismatch');
  check(!process.env.REPL_ID||process.env.REPL_ID==='9d71c4b8-8fcd-4b22-aee2-5883d9cbe5a4','Replit identity mismatch');
  check(git('rev-parse','--show-toplevel').trim()===ROOT,'Repository root mismatch');
  check(process.getuid()!==0,'Run as the regular Replit user');
  check(process.versions.node.split('.')[0]==='24','Expected Node 24');
  before=snapshot();console.log('CURRENT='+JSON.stringify({head:before.head,branch:before.branch}));
  check(before.branch==='integration'&&before.tracked==='','Unexpected branch or tracked changes; preserve work');
  privateDirectory(PRIOR);privateDirectory(G43);
  const previous=JSON.parse(bytes(PRIOR+'/summary.json'));
  check(previous.command==='MMHB-FRESH-RELEASE-BUILD-20260925-44'&&
    previous.status==='FRESH_CLIENT_AND_G43_PACKAGE_QUALIFIED_ON_CURRENT_HOST'&&previous.sourcePreserved===true&&
    previous.typecheck?.pass===true&&previous.contracts?.length===4&&previous.contracts.every(x=>x.pass===true)&&
    previous.clientFreshBuild===true&&previous.frontend?.pass===true&&previous.results?.length===1&&
    previous.results.every(x=>x.build===true&&x.artifact===true&&x.smoke===true),'G44 qualification summary differs');
  git('merge-base','--is-ancestor',previous.head,before.head);
  const g43=JSON.parse(bytes(G43+'/summary.json'));
  check(g43.command==='MMHB-BILLING-ADAPTER-QUALIFICATION-20260925-43'&&
    g43.status==='BILLING_ADAPTER_AND_USERS_READINESS_QUALIFIED_IN_ISOLATION'&&g43.sourcePreserved===true&&
    g43.tests===12&&g43.pass===12&&g43.disposableDatabaseStopped==='PASS','G43 qualification summary differs');
  const source=JSON.parse(bytes(PRIOR+'/tracked-source-manifest.json'));
  const staged=JSON.parse(bytes(PRIOR+'/candidate-input-manifest.json'));
  const g43Manifest=JSON.parse(bytes(G43+'/candidate-manifest.json'));
  const validRel=rel=>typeof rel==='string'&&!path.isAbsolute(rel)&&!rel.split('/').some(x=>!x||['.','..','.git','node_modules'].includes(x));
  function manifestMap(rows){
    check(Array.isArray(rows)&&rows.length>0&&rows.length<=20000,'Invalid manifest size');const map=new Map();
    for(const row of rows){check(validRel(row.file)&&/^[a-f0-9]{64}$/.test(row.sha256)&&!map.has(row.file),'Invalid source manifest row');map.set(row.file,row);}
    return map;
  }
  const original=manifestMap(source),current=manifestMap(staged),qualified=manifestMap(g43Manifest);
  const pins={...candidatePins,
    'server/billing/createApplication.mjs':'5647e7176c073994c54c6c08dedbb0283b7a16780bf7602ed620c51714be89a6',
    'server/db/billingUsersReadiness.mjs':'3914d63a3bf2d37b550730fcdc6918bb262d526c5482a14974bda5a484c74d10',
    'server/db/sslConfig.mjs':'5cd34b8606acc79303666990a55bcaa355f67b34a02e0973dacb0d6c534e62fa',
    'scripts/security/verify-postgres-tls-policy.mjs':'459f73dd67135955027d2e8d07873e1d439f840aa06762c7ff4e9f253331e245'};
  for(const [rel,pin]of Object.entries(pins))check(current.get(rel)?.sha256===pin,'Reviewed TLS input differs: '+rel);
  const needed=rel=>/^(?:server|shared)\//.test(rel)||['package.json','package-lock.json','scripts/security/verify-postgres-tls-policy.mjs'].includes(rel);
  for(const rel of original.keys())if(needed(rel))check(current.has(rel),'Source missing from candidate manifest: '+rel);
  const selected=[...current.values()].filter(x=>needed(x.file));
  check(selected.length>20&&selected.length<2000,'Unexpected TLS source scope');
  const pkg=JSON.parse(bytes(ROOT+'/package.json')),lock=JSON.parse(bytes(ROOT+'/package-lock.json'));
  validateQualifiedDependencies();
  const versions={node:process.version};
  for(const name of ['pg','drizzle-orm','resend']){
    const installed=JSON.parse(bytes(DEPENDENCY_ROOT+'/node_modules/'+name+'/package.json'));
    check(installed.name===name&&installed.version===lock.packages?.['node_modules/'+name]?.version,'Qualified dependency differs from lock: '+name);versions[name]=installed.version;
  }
  PG='/nix/store/bgwr5i8jf8jpg75rr53rz3fqv5k8yrwp-postgresql-16.10/bin';
  for(const bin of ['postgres','initdb','pg_ctl'])check(fs.statSync(PG+'/'+bin).isFile(),'Missing PostgreSQL binary: '+bin);
  const parent=path.join(path.resolve(ROOT,git('rev-parse','--absolute-git-dir').trim()),'mmhb-review-evidence');privateDirectory(parent);
  const space=fs.statfsSync(parent);check(space.bavail*space.bsize>=536870912,'Need 512 MiB free for disposable TLS qualification');
  directory=fs.mkdtempSync(path.join(parent,'billing-tls-'));privateDirectory(directory);
  console.log('EVIDENCE_DIRECTORY='+directory);put('state.before.json',JSON.stringify(before,null,2));
  candidate=directory+'/candidate';fs.mkdirSync(candidate,{mode:0o700});
  let total=0;
  for(const row of selected){
    const rel=row.file;
    check(!/\.(?:pem|key|p12|pfx|sqlite|sqlite3|db)$/i.test(rel)&&!rel.split('/').some(x=>x==='.env'||x.startsWith('.env.')),'Sensitive path in candidate scope');
    if(original.has(rel))check(observe(ROOT+'/'+rel).sha256===original.get(rel).sha256,'Current source differs from G44: '+rel);
    else {let exists=false;try{fs.lstatSync(ROOT+'/'+rel);exists=true;}catch(e){if(e.code!=='ENOENT')throw e;}check(!exists,'Staged new target is occupied: '+rel);}
    if(qualified.has(rel))check(row.sha256===qualified.get(rel).sha256,'G43 candidate differs: '+rel);
    else check(original.get(rel)?.sha256===row.sha256,'Unqualified candidate input: '+rel);
    check(observe(PRIOR+'/candidate/'+rel).sha256===row.sha256,'G44 candidate changed: '+rel);
    fs.mkdirSync(path.dirname(candidate+'/'+rel),{recursive:true,mode:0o700});
    const copied=copySnapshotInput(PRIOR+'/candidate/'+rel,[candidate+'/'+rel],Math.min(16777216,67108864-total));
    check(copied.sha256===row.sha256,'Candidate changed during copy');total+=copied.bytes;candidateFiles.set(rel,row.sha256);
  }
  fs.symlinkSync(DEPENDENCY_ROOT+'/node_modules',candidate+'/node_modules','dir');
  fs.mkdirSync(directory+'/tmp',{mode:0o700});env.TMPDIR=directory+'/tmp';
  put('candidate-manifest.json',JSON.stringify([...candidateFiles].map(([file,sha256])=>({file,sha256})),null,2));
  console.log('G44_BUILD_AND_G43_ADAPTER_EVIDENCE=PASS_RECORDED');
  console.log('CURRENT_TLS_SOURCE_MATCH=PASS');console.log('SOURCE_SNAPSHOT='+JSON.stringify({files:selected.length,bytes:total}));
  bootReview=captureBootSources({root:ROOT,candidate,readFile:bytes});
  put('boot-source-review.txt',bootReview.text);put('boot-source-manifest.json',JSON.stringify(bootReview.manifest,null,2));
  const policy=run('TLS_POLICY_SOURCE_CHECK',process.execPath,[candidate+'/scripts/security/verify-postgres-tls-policy.mjs'],45000,[0,1,2]);
  if(policy.status!==0)console.log('TLS_POLICY_DIAGNOSTIC='+JSON.stringify((policy.stderr||policy.stdout||'')
    .replace(/\bpostgres(?:ql)?:\/\/[^\s'"`<>]+/gi,'[REDACTED_DATABASE_URL]').slice(-6000)));
  check(policy.status===0,'TLS policy source check failed');policyPassed=true;
  console.log('TLS_POLICY_SOURCE_CHECK=PASS');
  const pgVersion=run('PG_VERSION',PG+'/postgres',['--version']).stdout.trim();check(/PostgreSQL\) 16\.10$/.test(pgVersion),'Unexpected PostgreSQL version');versions.postgres=pgVersion;
  versions.openssl=run('OPENSSL_VERSION','openssl',['version']).stdout.trim();console.log('DEPENDENCIES='+JSON.stringify(versions));
  // Every key and certificate is a fresh synthetic fixture, never a project credential.
  const caFile=directory+'/ca.pem',wrongCaFile=directory+'/wrong-ca.pem',serverFile=directory+'/server.pem';
  run('FIXTURE_CA','openssl',['req','-x509','-newkey','rsa:2048','-nodes','-days','2','-sha256','-subj','/CN=MMHB G45 Local Fixture CA',
    '-addext','basicConstraints=critical,CA:TRUE','-addext','keyUsage=critical,keyCertSign,cRLSign','-keyout',directory+'/ca.key','-out',caFile]);
  run('FIXTURE_WRONG_CA','openssl',['req','-x509','-newkey','rsa:2048','-nodes','-days','2','-sha256','-subj','/CN=MMHB G45 Wrong Fixture CA',
    '-addext','basicConstraints=critical,CA:TRUE','-addext','keyUsage=critical,keyCertSign,cRLSign','-keyout',directory+'/wrong-ca.key','-out',wrongCaFile]);
  run('FIXTURE_SERVER_KEY','openssl',['req','-new','-newkey','rsa:2048','-nodes','-sha256','-subj','/CN=localhost',
    '-keyout',directory+'/server.key','-out',directory+'/server.csr']);
  const extension=put('server.ext','basicConstraints=critical,CA:FALSE\nkeyUsage=critical,digitalSignature,keyEncipherment\nextendedKeyUsage=serverAuth\nsubjectAltName=DNS:localhost\n');
  run('FIXTURE_SERVER_CERT','openssl',['x509','-req','-in',directory+'/server.csr','-CA',caFile,'-CAkey',directory+'/ca.key',
    '-set_serial','2','-days','2','-sha256','-extfile',extension,'-out',serverFile]);
  run('FIXTURE_CERT_VALID','openssl',['verify','-CAfile',caFile,'-verify_hostname','localhost',serverFile]);
  const wrongHostExtension=put('wrong-host.ext','basicConstraints=critical,CA:FALSE\nkeyUsage=critical,digitalSignature,keyEncipherment\nextendedKeyUsage=serverAuth\nsubjectAltName=DNS:wrong-host.example.invalid\n');
  const wrongHostCert=directory+'/wrong-host.pem';
  run('FIXTURE_WRONG_HOST_CERT','openssl',['x509','-req','-in',directory+'/server.csr','-CA',caFile,'-CAkey',directory+'/ca.key',
    '-set_serial','3','-days','2','-sha256','-extfile',wrongHostExtension,'-out',wrongHostCert]);
  const wrongHostCheck=run('FIXTURE_WRONG_HOST_REJECTED','openssl',['verify','-CAfile',caFile,'-verify_hostname','localhost',wrongHostCert],30000,[2]);
  check(/hostname mismatch/i.test(wrongHostCheck.stderr),'Wrong-host certificate failed for an unexpected reason');
  for(const name of ['ca.key','wrong-ca.key','server.key'])check((fs.statSync(directory+'/'+name).mode&0o077)===0,'Fixture key permissions are not private');
  data=directory+'/data';socket=fs.mkdtempSync('/tmp/mmhb-g45-');privateDirectory(socket);
  const password=crypto.randomBytes(32).toString('hex'),pwfile=put('fixture-password',password+'\n');
  const allocatePort=()=>new Promise((resolve,reject)=>{
    const server=require('node:net').createServer();server.once('error',reject);
    server.listen({host:'127.0.0.1',port:0,exclusive:true},()=>{const value=server.address().port;server.close(error=>error?reject(error):resolve(value));});
  });
  async function startCluster(name,clusterData,certificate){
    const record={name,data:clusterData,started:false};clusters.push(record);
    run('INITDB_'+name,PG+'/initdb',['-D',clusterData,'-U','mmhb_owner','--auth-local=scram-sha-256','--auth-host=scram-sha-256',
      '--pwfile='+pwfile,'--encoding=UTF8','--locale=C','--no-instructions']);
    const port=await allocatePort();check(Number.isSafeInteger(port)&&port>1024&&port<65536,'Invalid allocated fixture port');
    record.port=port;
    fs.appendFileSync(clusterData+'/postgresql.conf',`\nlisten_addresses = '127.0.0.1'\nport = ${port}\nunix_socket_directories = '${socket}'\nunix_socket_permissions = 0700\nmax_connections = 20\nshared_buffers = '16MB'\ntimezone = 'UTC'\nlog_statement = 'none'\nssl = on\nssl_min_protocol_version = 'TLSv1.2'\nssl_cert_file = '${certificate}'\nssl_key_file = '${directory}/server.key'\n`);
    fs.writeFileSync(clusterData+'/pg_hba.conf','local all all scram-sha-256\nhostssl all all 127.0.0.1/32 scram-sha-256\nhostnossl all all 127.0.0.1/32 reject\n',{mode:0o600});
    stopped='PENDING';record.startAttempted=true;
    run('PG_START_'+name,PG+'/pg_ctl',['-D',clusterData,'-l',directory+'/postgres-'+name+'.log','-w','-t','20','start'],30000);record.started=true;
    return port;
  }
  const port=await startCluster('TRUSTED',data,serverFile),wrongHostData=directory+'/wrong-host-data';
  const wrongHostPort=await startCluster('WRONG_HOST',wrongHostData,wrongHostCert);
  console.log('DATABASE_SCOPE=TWO_NEW_LOOPBACK_TLS_CLUSTERS_WITH_PRIVATE_SOCKET_AND_SYNTHETIC_CREDENTIALS');
  const harness=put('qualify.cjs','('+qualifyBillingTls.toString()+')().catch(e=>{console.error(e.code||e.message);process.exitCode=2;});\n');
  run('HARNESS_SYNTAX',process.execPath,['--check',harness]);
  const config=put('tls-config.json',JSON.stringify({root:ROOT,dependencyRoot:DEPENDENCY_ROOT,candidateRoot:candidate,directory,data,socket,port,password,caFile,wrongCaFile,wrongHostData,wrongHostPort}));
  const execution=run('REAL_TLS_ADAPTER_TESTS',process.execPath,[harness,config],120000,[0,1,2]);
  report=JSON.parse(bytes(directory+'/tls.result.json'));
  console.log('NEGATIVE_CONTROL='+JSON.stringify(report.controls));
  console.log('TLS_RESULT='+JSON.stringify({tests:report.tests,pass:report.pass,checks:report.checks,preflightError:report.preflightError,cleanupError:report.cleanupError,externalCalls:report.externalCalls,runtimeModuleConfinement:report.runtimeModuleConfinement}));
  check(execution.status===0&&report.tests===EXPECTED_TESTS&&report.pass===EXPECTED_TESTS&&report.checks?.length===EXPECTED_TESTS&&report.checks.every(x=>x.pass===true)&&
    report.controls?.length===EXPECTED_CONTROLS&&report.controls.every(x=>x.pass===true)&&!report.preflightError&&!report.cleanupError&&report.externalCalls===0&&
    report.runtimeModuleConfinement===true&&report.dependencyRoot===DEPENDENCY_ROOT,'TLS qualification failed');
  check(Array.isArray(report.loadedModules)&&report.loadedModules.length>0&&report.loadedModules.length<=4000&&
    report.loadedModules.some(x=>x.scope==='dependency')&&report.loadedModules.some(x=>x.scope==='candidate'),'TLS runtime module evidence missing');
  const loadedPaths=new Set();
  for(const row of report.loadedModules){
    check(['dependency','candidate'].includes(row.scope)&&typeof row.path==='string'&&!path.isAbsolute(row.path)&&
      !row.path.split('/').some(x=>!x||x==='.'||x==='..')&&/^[a-f0-9]{64}$/.test(row.sha256)&&
      !loadedPaths.has(row.scope+':'+row.path),'Invalid TLS runtime module evidence');
    loadedPaths.add(row.scope+':'+row.path);
    if(row.scope==='dependency')check(row.path.startsWith('node_modules/'),'Invalid dependency module prefix');
    const moduleFile=path.join(row.scope==='dependency'?DEPENDENCY_ROOT:candidate,row.path);
    const actual=observe(moduleFile,16777216);
    check(actual.sha256===row.sha256&&actual.bytes===row.bytes,'TLS runtime module changed: '+row.path);
  }
  console.log('TLS_RUNTIME_MODULES='+JSON.stringify({files:report.loadedModules.length,confinement:true,dependencyRoot:DEPENDENCY_ROOT}));
  status='BILLING_PRODUCTION_MODE_TLS_QUALIFIED_WITH_LOCAL_FIXTURE';
}catch(e){console.log('REASON='+JSON.stringify(e.message));process.exitCode=2;}
finally{
  for(const cluster of [...clusters].reverse()){
    if(cluster.started||fs.existsSync(cluster.data+'/postmaster.pid')){
      try{run('PG_STOP_'+cluster.name,PG+'/pg_ctl',['-D',cluster.data,'-m','fast','-w','-t','20','stop'],30000,[0],true);
        run('PG_STOP_VERIFY_'+cluster.name,PG+'/pg_ctl',['-D',cluster.data,'status'],10000,[3],true);cluster.stopped='PASS';
      }catch(e){cluster.stopped='FAILED';status='STOPPED';process.exitCode=2;console.log('CLEANUP_ERROR='+JSON.stringify(e.message));}
    }else cluster.stopped=cluster.startAttempted?'NO_PID_AFTER_FAILED_START':'NOT_STARTED';
  }
  if(clusters.some(x=>x.stopped==='FAILED'))stopped='FAILED';
  else if(clusters.length===2&&clusters.every(x=>x.stopped==='PASS'))stopped='PASS';
  else if(clusters.some(x=>x.stopped==='PASS'))stopped='STARTED_CLUSTERS_STOPPED';
  else if(clusters.length)stopped='NOT_STARTED_OR_NO_PID';
  if(socket&&stopped==='PASS'){try{fs.rmdirSync(socket);}catch(e){console.log('SOCKET_CLEANUP='+JSON.stringify(e.code));}}
  if(before){try{
    check(JSON.stringify(snapshot())===JSON.stringify(before),'Checkout changed during qualification');
    for(const file of inputs.keys())bytes(file);
    for(const [file,entry]of observed)check(hashSnapshotInput(file,entry.bytes).sha256===entry.sha256,'Observed input changed: '+file);
    for(const [rel,pin]of candidateFiles)check(hashSnapshotInput(candidate+'/'+rel,16777216).sha256===pin,'Private candidate changed: '+rel);
    if(candidate)check(fs.realpathSync(candidate+'/node_modules')===DEPENDENCY_ROOT+'/node_modules','Dependency link changed');
    if(dependencyInventory)check(JSON.stringify(installedInventory(DEPENDENCY_ROOT,dependencyLock))===JSON.stringify(dependencyInventory),'G49 dependency metadata changed during TLS qualification');
    preserved=true;console.log('OBSERVED_SOURCE_AND_INPUT_PRESERVATION=PASS');if(directory)put('state.after.json',JSON.stringify(snapshot(),null,2));
  }catch(e){status='STOPPED';process.exitCode=2;console.log('PRESERVATION_ERROR='+JSON.stringify(e.message));}}
  if(interrupted||!preserved||stopped!=='PASS'){status='STOPPED';process.exitCode=2;}
  if(directory){try{put('summary.json',JSON.stringify({command:ID,status,head:before?.head,sourcePreserved:preserved,
    policyPassed,tests:report?.tests,pass:report?.pass,controls:report?.controls,disposableDatabaseStopped:stopped,
    dependencyRoot:DEPENDENCY_ROOT,runtimeModuleConfinement:report?.runtimeModuleConfinement===true,
    productionModeLocalTLS:status==='BILLING_PRODUCTION_MODE_TLS_QUALIFIED_WITH_LOCAL_FIXTURE',deploymentTLS:false,
    sourceWrites:0,liveDatabaseConnections:0,applicationApplied:false,fullServerBoot:false,fullAppTests:false,releaseQualified:false},null,2));}
    catch(e){status='STOPPED';process.exitCode=2;console.log('REPORT_WRITE_ERROR='+JSON.stringify(e.message));}}
  if(bootReview){console.log('BOOT_SOURCE_REVIEW_BEGIN');
    console.log(bootReview.text.length<=60000?bootReview.text:bootReview.text.slice(0,60000)+'\nCONSOLE_REVIEW_TRUNCATED=true;RETURN_SAVED_BOOT_SOURCE_REVIEW');
    console.log('BOOT_SOURCE_REVIEW_END');}
  console.log('STATUS='+status+'\nDISPOSABLE_DATABASE_STOPPED='+stopped);
  console.log('SOURCE_WRITES_BY_COMMAND=0\nLIVE_DATABASE_CONNECTIONS=0\nLIVE_DATABASE_MIGRATIONS=0\nREAL_EMAILS_SENT=0');
  console.log('PROJECT_NODE_MODULES_WRITES_BY_COMMAND=0\nPROJECT_LOCK_WRITES_BY_COMMAND=0\nDEPENDENCY_REPAIR=NOT_APPLIED');
  console.log('TLS_SCOPE=ACTUAL_ADAPTER_WITH_LOCAL_SYNTHETIC_CERTIFICATES\nDEPLOYMENT_DATABASE_TLS=NOT_QUALIFIED');
  console.log('APPLICATION_SOURCE_APPLY=NOT_RUN\nPRODUCTION_WORKER_ACTIVATION=NOT_RUN\nFULL_SERVER_BOOT=NOT_RUN\nFULL_APP_TESTS=NOT_RUN');
  console.log('G44_BUILD=HISTORICAL_PASS_NOT_RERUN\nCOMMIT_PUSH_DEPLOY=NOT_RUN\nRELEASE_QUALIFIED=false');
  if(directory)console.log('EVIDENCE_DIRECTORY='+directory+'\nBOOT_SOURCE_REVIEW_FILE='+directory+'/boot-source-review.txt');
  console.log('NEXT_ACTION=RETURN_FULL_OUTPUT\nREPORT_END='+ID);
}}
main().catch(e=>{console.error('RUNNER_ERROR='+e.message);process.exitCode=2;});

MMHB50_NODE
)
