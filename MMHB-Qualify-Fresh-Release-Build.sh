#!/usr/bin/env bash
(
set -euo pipefail
umask 077
cd /home/runner/workspace
node --input-type=commonjs <<'MMHB44_NODE'
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {spawnSync}=require('node:child_process');
const ROOT='/home/runner/workspace';
const PRIOR=ROOT+'/.git/mmhb-review-evidence/billing-application-FXVusv';
const QUALIFIED=ROOT+'/.git/mmhb-review-evidence/billing-adapter-ca5T49';
const ID='MMHB-FRESH-RELEASE-BUILD-20260925-44';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const check=(ok,why)=>{if(!ok)throw Error(why);};
const env={PATH:process.env.PATH||'/usr/bin:/bin',LANG:'C.UTF-8',TZ:'UTC',CI:'true',NODE_ENV:'production',
  GIT_OPTIONAL_LOCKS:'0',GIT_TERMINAL_PROMPT:'0',GIT_NO_LAZY_FETCH:'1'};
let clientReport,clientManifest,typecheckReport,inventoryReport,contractResults=[],sourceTree,clientFresh=false;
let directory,detached,before,status='STOPPED',preserved=false,interrupted=false;
const inputs=new Map(),observed=new Map(),dependencyRecords=[],packageResults=[],publicTrees=[],stagedInputs=new Map();
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
function run(label,command,args,cwd,timeout=120000,ok=[0]){
  check(!interrupted,'Interrupted before '+label);console.log(label+'=RUNNING');
  const r=spawnSync(command,args,{cwd,env,encoding:'utf8',timeout,killSignal:'SIGKILL',maxBuffer:8388608});
  put('logs/'+label+'.log',(r.stdout||'')+(r.stderr||'')+(r.error?'\n'+r.error.message:''));
  check(!r.error&&ok.includes(r.status),label+' failed; private log retained');return r;
}

const candidatePins={"server/billing/billingRuntime.mjs": "11899c03bd21bf40ee473bb7e910fe0ee74ea09f420efd21b9ca488ee889f055", "server/billing/createApplication.mjs": "c673230f78b22aaa4d55640f0c72e0c5a434f62655cd7e914a407e63bcfbee97", "server/billing/application.mjs": "63ca099e749e1501000288cc28d6507a125dcde805accee64d5f8e1272a0ae2f", "server/billing/billingShutdown.mjs": "7a1118cab260659e475f6d58fd9acb4cf32661ddaef5dede716f1bd967178aeb", "server/services/billingEventTransaction.mjs": "f8a9fce70124b55d5197cdfed53be393cbd098b80cafb607b352c4a101f9db60", "server/services/billingDelivery.mjs": "39cee16ceae83013e500f10cbc3ccc9ccbfca8bd9f9ceafbdb5d2065c3d68f25", "server/services/billingEmailTransport.mjs": "c4757e3c030600af8bf4bb6d7946fc85195541b38e5c0534b8ba5608ec1892d4", "server/services/billingNotificationTemplate.mjs": "cdb91217cea6ea6fb1bee2633a0f9b396d3d9a452acafd37a6d1491a37bd8e34", "server/services/billingNotificationWorker.mjs": "daac9fb0f94fa026a5567d22c3de74041cc1e3f793f44ce4edb0fe3476c2a940", "server/db/billingSchema.mjs": "a76caf2a49a63b9f0fece48c81eefd43c352b0b541ca856cff184e045f47cd13"};
const expectedCandidateFiles=["server/billing/billingRuntime.mjs", "server/billing/createApplication.mjs", "server/billing/application.mjs", "server/billing/billingShutdown.mjs", "server/services/billingEventTransaction.mjs", "server/services/billingDelivery.mjs", "server/services/billingEmailTransport.mjs", "server/services/billingNotificationTemplate.mjs", "server/services/billingNotificationWorker.mjs", "server/db/billingSchema.mjs", "server/db/billingSchemaContract.mjs", "server/app.mjs", "server/routes/webhook.mjs"];

// Historical source reviewed in full; require the exact hash before executing.
// Each verifier reads files using Node built-ins only. No application imports,
// database connections, subprocesses, or network requests occur in these bytes.
const reviewedChecks = Object.freeze([
  Object.freeze({
    label: 'AUTH_SESSION_SOURCE_CONTRACT',
    path: 'scripts/security/verify-auth-session-contracts.mjs',
    sha256: 'abacd65e1f6061aba3999a44fc94bfbad62d2983d50176dfcbef169944c4ba3d',
  }),
  Object.freeze({
    label: 'SAFETY_SOURCE_CONTRACT',
    path: 'scripts/safety/verify-safety-guardrails.mjs',
    sha256: '245e6196b6929cbeaf8182e83251be8513d653a7e4072bc65c4bc3373b37e558',
  }),
  Object.freeze({
    label: 'STRIPE_SOURCE_CONTRACT',
    path: 'scripts/billing/verify-stripe-contract.mjs',
    sha256: 'd86f36d3353e70987ceb5dfd4320c7740c5e1654e7934bbe0f3ac1262a86b112',
  }),
  Object.freeze({
    label: 'RATE_LIMIT_SOURCE_CONTRACT',
    path: 'scripts/security/verify-rate-limit-ip-spoof.mjs',
    sha256: '0839826938cc3de037f2142a6ab4d42db32cd9850f9d70cacb394167a66aeb28',
  }),
]);

// These are historical candidate paths for source collection only. Their
// contents have not been qualified here and must not be executed from this list.
const testSourceReviewPaths = Object.freeze([
  'scripts/check-contract-routes.sh',
  'scripts/biometrics/verify-healthkit-webhook-contract.mjs',
  'scripts/verify-foundation.mjs',
  'scripts/security/verify-postgres-tls-policy.mjs',
]);

const reviewedCheckScope = Object.freeze({
  scripts: 4,
  scope: 'SOURCE_HASH_AND_PATTERN_CHECKS_ONLY',
  authentication: 'Three frozen source hashes, exact package test wiring, seven in-memory verifier controls; no session or MFA behavior exercised.',
  safety: 'Six source-pattern checks; no model output, crisis routing, or clinical behavior exercised.',
  stripe: 'Route, event, mapping, and package source patterns; no Stripe request, signature, transaction, or delivery exercised.',
  rateLimit: 'Two middleware source-string checks; no HTTP traffic, proxy trust, or rate-limit enforcement exercised.',
  expectedCandidateCompatibility: 'Known staged webhook retains required event names, plan mapping names, and unknown-entitlement refusal text; authentication verifier does not pin billing or application files.',
  packagePipelineConstraint: 'Authentication checker pins the exact test command string and its own command/hooks; legitimate package test-pipeline edits require separately reviewed verifier changes.',
});

'use strict';

// Pure collection, never execution or shell evaluation. Original command text
// must be redacted by the caller before being saved or printed. File candidates
// must still pass the caller's regular-file, confinement, and byte-limit checks.
function collectTestSourceInventory(pkg) {
  const scripts = pkg && typeof pkg.scripts === 'object' &&
    pkg.scripts !== null && !Array.isArray(pkg.scripts) ? pkg.scripts : {};
  const pending = [{ name: 'test', lifecycle: true }, { name: 'typecheck', lifecycle: true }];
  const visited = new Set();
  const expandedLifecycle = new Set();
  const entries = [];
  const files = new Set([
    'scripts/check-contract-routes.sh',
    'scripts/biometrics/verify-healthkit-webhook-contract.mjs',
    'scripts/verify-foundation.mjs',
    'scripts/security/verify-postgres-tls-policy.mjs',
  ]);
  const limitations = new Set();
  const validName = name => /^[A-Za-z0-9:_-]{1,120}$/.test(name);

  function inspect(name, addLifecycle) {
    if (!validName(name)) return;
    if (addLifecycle && !expandedLifecycle.has(name)) {
      expandedLifecycle.add(name);
      pending.push({ name: 'pre' + name, lifecycle: false }, { name: 'post' + name, lifecycle: false });
    }
    if (visited.has(name)) return;
    visited.add(name);
    const command = Object.hasOwn(scripts, name) ? scripts[name] : null;
    if (command !== null && typeof command !== 'string') {
      entries.push({ name, state: 'INVALID_COMMAND_TYPE' });
      return;
    }
    if (typeof command === 'string' && command.length > 8192) {
      entries.push({ name, state: 'COMMAND_TOO_LONG', characters: command.length });
      limitations.add('OVERSIZED_COMMAND_NOT_PARSED');
      return;
    }
    entries.push({ name, command });
    if (command === null) return;

    // Collect literal npm run references; this is not an npm/shell parser.
    // Dynamic names, variable expansion, quoting, or alternate launchers remain
    // visible in command text but are explicitly not interpreted.
    for (const match of command.matchAll(/(?:^|[\s;&|])npm\s+run\s+([A-Za-z0-9:_-]{1,120})(?=$|[\s;&|])/g)) {
      pending.push({ name: match[1], lifecycle: true });
    }
    // Only literal repository-relative script/test filenames are candidates.
    // Text inside arguments may produce a candidate, never an execution target.
    for (const match of command.matchAll(/(?:^|[\s'"=])(?:\.\/)?((?:scripts|tests)\/[A-Za-z0-9_./-]+\.(?:mjs|cjs|js|ts|sh))(?=$|[\s'";&|])/g)) {
      const file = match[1];
      if (file.split('/').every(part => part !== '' && part !== '.' && part !== '..')) files.add(file);
      else limitations.add('UNSAFE_RELATIVE_PATH_NOT_COLLECTED');
    }
  }

  while (pending.length && visited.size < 64) {
    const item = pending.shift();
    // Lifecycle hooks do not recursively generate prepre/postpre hook names.
    // Explicit npm run references do have their own lifecycle hooks.
    inspect(item.name, item.lifecycle);
  }
  if (pending.length) limitations.add('SCRIPT_GRAPH_LIMIT_REACHED');
  limitations.add('LITERAL_REFERENCES_ONLY_NOT_SHELL_OR_NPM_EXECUTION');
  return {
    scripts: entries.sort((a, b) => a.name.localeCompare(b.name)),
    sourceCandidates: [...files].sort(),
    limitations: [...limitations].sort(),
    executionAuthorizedByInventory: false,
  };
}


function redactReview(value){
  return value.replace(/-----BEGIN [^-]*PRIVATE KEY-----[\s\S]*?-----END [^-]*PRIVATE KEY-----/g,'[REDACTED_PRIVATE_KEY]')
    .replace(/\b(?:postgres(?:ql)?|mysql|mongodb(?:\+srv)?):\/\/[^\s'"`<>]+/gi,'[REDACTED_DATABASE_URL]')
    .replace(/(https?:\/\/)[^\s/@'"`]+:[^\s/@'"`]+@/gi,'$1[REDACTED_USERINFO]@')
    .replace(/([?&](?:api[_-]?key|(?:access|refresh|auth)[_-]?token|token|secret|password|signature|authorization)=)[^&\s'"`]+/gi,'$1[REDACTED]')
    .replace(/\b(?:sk|rk)_(?:live|test)_[A-Za-z0-9_-]+\b|\bre_[A-Za-z0-9_-]{12,}\b|\bgh[pousr]_[A-Za-z0-9_]+\b/g,'[REDACTED_API_KEY]')
    .replace(/\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g,'[REDACTED_JWT]')
    .replace(/(Bearer\s+)[A-Za-z0-9._~-]{12,}/gi,'$1[REDACTED]')
    .replace(/([\w$]*(?:password|secret|token|api_?key|private_?key)[\w$]*["']?\s*[:=]\s*)(["'`])((?:\\[\s\S]|(?!\2)[\s\S])*)\2/gi,'$1$2[REDACTED]$2')
    .replace(/\b([A-Z0-9_]*(?:KEY|TOKEN|SECRET|PASSWORD)[A-Z0-9_]*=)([^\s"'`;$]+)/g,'$1[REDACTED]');
}
function captureTestSources(pkg,tree){
  const inventory=collectTestSourceInventory(pkg),chunks=[],sources=[];
  for(const item of inventory.scripts)chunks.push('PACKAGE_TEST_SCRIPT='+redactReview(JSON.stringify(item)));
  chunks.push('SOURCE_CAPTURE_SCOPE=READ_ONLY;REDACTION=BEST_EFFORT;UNKNOWN_SCRIPTS_NOT_EXECUTED');
  const known=new Set(reviewedChecks.map(x=>x.path));
  let total=0;
  for(const rel of inventory.sourceCandidates){
    if(known.has(rel))continue;
    let st;try{st=fs.lstatSync(tree+'/'+rel);}catch(e){if(e.code!=='ENOENT')throw e;}
    if(!st){chunks.push('REVIEW_SOURCE='+JSON.stringify({file:rel,state:'MISSING'}));continue;}
    if(!st.isFile()||st.size>65536||total+st.size>262144){chunks.push('REVIEW_SOURCE='+JSON.stringify({file:rel,state:'BOUNDED_REVIEW_LIMIT_OR_UNSAFE_FILE'}));continue;}
    const raw=bytes(tree+'/'+rel),content=redactReview(raw.toString('utf8'));total+=raw.length;
    const item={file:rel,sha256:hash(raw),bytes:raw.length,redacted:content!==raw.toString('utf8'),lines:content.split('\n').length};sources.push(item);
    chunks.push('REVIEW_SOURCE='+JSON.stringify(item));chunks.push(content.split('\n').map((line,i)=>(i+1)+'|'+line).join('\n'));
    chunks.push('END_REVIEW_SOURCE='+JSON.stringify(rel));
  }
  chunks.push('REVIEW_LIMITATIONS='+JSON.stringify(inventory.limitations));
  const full=chunks.join('\n')+'\n';put('test-source-review.txt',full);
  put('test-source-review-manifest.json',JSON.stringify({sources,inventory:JSON.parse(redactReview(JSON.stringify(inventory)))},null,2));
  const limit=32000;
  return {console:full.length<=limit?full:full.slice(0,limit)+'\nCONSOLE_REVIEW_TRUNCATED=true;READ_SAVED_TEST_REVIEW_FILE\n',complete:full.length<=limit};
}

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

function artifactTreeWalk(source,destination,options={}) {
  const fs=require('node:fs'),path=require('node:path');
  const fault=(code,detail={})=>Object.assign(Error('Artifact tree '+code+': '+JSON.stringify(detail)),{code,detail});
  const check=(ok,code,detail)=>{if(!ok)throw fault(code,detail);};
  check(options&&typeof options==='object'&&!Array.isArray(options),'invalid_options');
  check(Object.keys(options).every(key=>['maxBytes','maxFiles','allowNodeModules'].includes(key)),'unknown_option');
  const {maxBytes=268435456,maxFiles=10000,allowNodeModules=false}=options;
  check(Number.isSafeInteger(maxBytes)&&maxBytes>=0&&maxBytes<=268435456,'invalid_byte_bound');
  check(Number.isSafeInteger(maxFiles)&&maxFiles>=0&&maxFiles<=10000,'invalid_file_bound');
  check(typeof allowNodeModules==='boolean','invalid_node_modules_policy');
  const canonical=value=>typeof value==='string'&&path.isAbsolute(value)&&path.resolve(value)===value;
  check(canonical(source),'invalid_source_path');
  check(destination===null||canonical(destination),'invalid_destination_path');
  if(destination!==null)check(destination!==source&&
    !destination.startsWith(source.endsWith(path.sep)?source:source+path.sep),'destination_overlaps_source');
  const same=(a,b)=>['dev','ino','size','mtimeNs','ctimeNs'].every(key=>a[key]===b[key]);
  function current(file) {
    let entry;try{entry=fs.lstatSync(file,{bigint:true});}catch(error){throw fault('entry_unavailable',{path:file,filesystemCode:error.code});}
    check(!entry.isSymbolicLink(),'symlink_rejected',{path:file});
    let resolved;try{resolved=fs.realpathSync(file);}catch(error){throw fault('canonical_check_failed',{path:file,filesystemCode:error.code});}
    check(resolved===file,'noncanonical_path',{path:file});return entry;
  }
  const initial=current(source);check(initial.isDirectory(),'source_not_directory',{path:source});
  if(destination!==null) {
    const parent=path.dirname(destination),s=current(parent);
    check(s.isDirectory(),'destination_parent_not_directory',{path:parent});
    // Never merge with, truncate, or replace an existing artifact directory.
    try{fs.mkdirSync(destination,{mode:0o700});}catch(error){throw fault('destination_create_failed',{path:destination,filesystemCode:error.code});}
  }
  const manifest=[],observed=[];let bytes=0,files=0,directories=0;
  function visit(relative,depth) {
    check(depth<=30,'depth_limit',{path:relative});
    const folder=relative?path.join(source,relative):source,entry=current(folder);
    check(entry.isDirectory(),'entry_changed_type',{path:folder});
    check(++directories<=10000,'directory_limit');observed.push({file:folder,stat:entry,directory:true});
    let handle;
    try {
      handle=fs.opendirSync(folder);
      for(;;) {
        const child=handle.readSync();if(!child)break;
        const name=child.name;
        check(name!=='.'&&name!=='..'&&!path.isAbsolute(name)&&!name.includes(path.sep),'invalid_entry_name');
        check(allowNodeModules||name!=='node_modules','node_modules_rejected',{path:relative?relative+'/'+name:name});
        const rel=relative?relative+'/'+name:name,file=path.join(source,rel),s=current(file);
        if(s.isDirectory()) {
          check(depth+1<=30,'depth_limit',{path:rel});
          if(destination!==null)fs.mkdirSync(path.join(destination,rel),{mode:0o700});
          visit(rel,depth+1);continue;
        }
        check(s.isFile(),'nonregular_entry',{path:file});
        check(++files<=maxFiles,'file_limit',{maxFiles});
        observed.push({file,stat:s,directory:false});
        const value=destination===null?hashSnapshotInput(file,maxBytes-bytes):
          copySnapshotInput(file,[path.join(destination,rel)],maxBytes-bytes);
        bytes+=value.bytes;
        manifest.push({path:rel,bytes:value.bytes,sha256:value.sha256});
      }
    } finally {if(handle)handle.closeSync();}
  }
  visit('',0);
  // This detects name/type changes and earlier files changing while later
  // entries were being copied or hashed. Callers also compare fresh manifests
  // after packaging to detect modifications made after this walk completes.
  for(const item of observed) {
    const s=current(item.file);
    check((item.directory?s.isDirectory():s.isFile())&&same(item.stat,s),'tree_changed_during_walk',{path:item.file});
  }
  return manifest.sort((a,b)=>a.path<b.path?-1:a.path>b.path?1:0);
}
function hashTree(source,options={}) {
  return artifactTreeWalk(source,null,options);
}
function copyTree(source,destination,options={}) {
  return artifactTreeWalk(source,destination,options);
}

function materializeBuildDependencies({root,workspace,buildScript,lockBytes,limitBytes=268435456,copyInput}={}) {
  const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),vm=require('node:vm');
  const {createRequire}=require('node:module');
  const hash=value=>crypto.createHash('sha256').update(value).digest('hex');
  const check=(ok,why)=>{if(!ok)throw Error('Packaging: '+why);};
  const canonicalDirectory=dir=>path.isAbsolute(dir)&&fs.lstatSync(dir).isDirectory()&&fs.realpathSync(dir)===dir;
  check(canonicalDirectory(root)&&canonicalDirectory(workspace)&&root!==workspace,'invalid source or private workspace');
  check(typeof copyInput==='function'&&Number.isSafeInteger(limitBytes)&&limitBytes>=0&&limitBytes<=268435456,'invalid copy bound');
  check(typeof buildScript==='string'&&hash(buildScript)==='9e046524ba1e77b5202c0bbe895b8a6a430e38b5188b1a2f2613525a183c4816','reviewed production builder changed');
  const modules=path.join(root,'node_modules'),targetModules=path.join(workspace,'node_modules');
  check(canonicalDirectory(modules),'installed dependency directory must be canonical');
  try{fs.lstatSync(targetModules);throw Error('Packaging: target node_modules already exists');}catch(e){if(e.code!=='ENOENT')throw e;}
  const metadata=new Map(),sourceLinks=new Map(),directoryInputs=new Map(),copiedFiles=[],linkedBuildPackages=[];
  const maxFiles=10000;
  function readMetadata(file,encoding) {
    check(file===path.join(root,'package-lock.json')||file.startsWith(modules+path.sep),'metadata escapes source');
    const info=fs.lstatSync(file,{bigint:true});check(info.isFile()&&info.size<=4194304n&&fs.realpathSync(file)===file,'unsafe dependency metadata');
    const fd=fs.openSync(file,fs.constants.O_RDONLY|fs.constants.O_NOFOLLOW|fs.constants.O_NONBLOCK);
    const same=(a,b)=>['dev','ino','size','mtimeNs','ctimeNs'].every(key=>a[key]===b[key]);
    let bytes;
    try {
      check(same(info,fs.fstatSync(fd,{bigint:true})),'dependency metadata replaced before read');
      bytes=Buffer.alloc(Number(info.size));let count=0;
      while(count<bytes.length){const n=fs.readSync(fd,bytes,count,bytes.length-count,null);check(n>0,'dependency metadata truncated');count+=n;}
      check(fs.readSync(fd,Buffer.alloc(1),0,1,null)===0,'dependency metadata grew');
      check(same(info,fs.fstatSync(fd,{bigint:true}))&&same(info,fs.lstatSync(file,{bigint:true}))&&fs.realpathSync(file)===file,
        'dependency metadata changed during read');
    }finally{fs.closeSync(fd);}
    const result={file,bytes:bytes.length,sha256:hash(bytes)};
    if(metadata.has(file))check(metadata.get(file).sha256===result.sha256,'dependency metadata changed during discovery');
    metadata.set(file,result);return encoding?bytes.toString(encoding):bytes;
  }
  check(hash(readMetadata(path.join(root,'package-lock.json')))===hash(lockBytes),'lockfile differs from source snapshot');
  const begin=buildScript.indexOf('function packageRuntime(root, destination) {');
  const end=buildScript.indexOf('\nconst packaged = packageRuntime(ROOT);',begin);
  check(begin>=0&&end>begin&&buildScript.indexOf('function packageRuntime(root, destination) {',begin+1)===-1,'runtime discovery boundary changed');
  const discovery=buildScript.slice(begin,end);
  const runtimePackages=vm.runInNewContext(discovery+'\npackageRuntime(ROOT)',{
    ROOT:root,path,createRequire,fs:{existsSync:fs.existsSync,realpathSync:fs.realpathSync,readFileSync:readMetadata},
  },{timeout:30000});
  check(Array.isArray(runtimePackages)&&runtimePackages.length>0&&runtimePackages.length<=100,'invalid runtime closure');
  function entries(directory) {
    const opened=fs.opendirSync(directory),result=[];
    try {let item;while((item=opened.readSync())){check(result.length<maxFiles,'directory entry limit exceeded');result.push(item);}}
    finally{opened.closeSync();}
    result.sort((a,b)=>a.name.localeCompare(b.name));
    const description=result.map(item=>({name:item.name,type:item.isSymbolicLink()?'link':item.isDirectory()?'directory':item.isFile()?'file':'other'}));
    const entry={path:directory,sha256:hash(JSON.stringify(description))};
    if(directoryInputs.has(directory))check(directoryInputs.get(directory).sha256===entry.sha256,'dependency directory changed during copy');
    directoryInputs.set(directory,entry);return result;
  }
  let total=0;
  fs.mkdirSync(targetModules,{mode:0o700});
  for(const relative of runtimePackages) {
    check(typeof relative==='string'&&relative.startsWith('node_modules/')&&!relative.split('/').includes('..')&&!path.isAbsolute(relative),'unsafe runtime package path');
    const folder=path.join(root,relative),destination=path.join(workspace,relative);
    check(canonicalDirectory(folder)&&folder.startsWith(modules+path.sep),'linked runtime package changed');
    function copy(source,output,ancestors) {
      const lexical=fs.lstatSync(source),actual=fs.realpathSync(source);
      check(actual===folder||actual.startsWith(folder+path.sep),'package symlink escapes runtime package');
      if(lexical.isSymbolicLink())sourceLinks.set(source,{path:source,target:fs.readlinkSync(source),canonicalTarget:actual});
      const info=fs.lstatSync(actual);
      if(info.isDirectory()) {
        check(!ancestors.has(actual),'cyclic package directory');
        const next=new Set(ancestors);next.add(actual);fs.mkdirSync(output,{recursive:true,mode:0o700});
        for(const entry of entries(actual)) {
          // Match the production builder: each nested dependency is handled by
          // the locked closure, never swept into its parent's package copy.
          if(entry.name==='node_modules')continue;
          copy(path.join(actual,entry.name),path.join(output,entry.name),next);
        }
      }else{
        check(info.isFile(),'nonregular runtime package entry');check(copiedFiles.length<maxFiles,'runtime file limit exceeded');
        const result=copyInput(actual,[output],limitBytes-total);total+=result.bytes;
        copiedFiles.push({source,canonicalSource:actual,destination:output,bytes:result.bytes,sha256:result.sha256});
      }
    }
    copy(folder,destination,new Set());
  }
  let links=0;
  function linkBuildPackage(source,destination) {
    const actual=fs.realpathSync(source);
    check(actual.startsWith(modules+path.sep)&&fs.lstatSync(actual).isDirectory(),'build dependency escapes installed tree');
    try{fs.lstatSync(destination);return;}catch(e){if(e.code!=='ENOENT')throw e;}
    check(++links<=10000,'build dependency link limit exceeded');
    fs.symlinkSync(source,destination,'dir');linkedBuildPackages.push({path:destination,target:source,canonicalTarget:actual});
  }
  for(const entry of entries(modules)) {
    if(entry.name.startsWith('.'))continue;
    const source=path.join(modules,entry.name),destination=path.join(targetModules,entry.name);
    if(entry.name.startsWith('@')) {
      check(/^@[a-z0-9_.-]+$/i.test(entry.name)&&canonicalDirectory(source),'unsafe installed package scope');
      fs.mkdirSync(destination,{recursive:true,mode:0o700});
      for(const member of entries(source)) {
        check(/^[a-z0-9_.-]+$/i.test(member.name)&&(member.isDirectory()||member.isSymbolicLink()),'unexpected scoped dependency entry');
        linkBuildPackage(path.join(source,member.name),path.join(destination,member.name));
      }
    }else{
      check(/^[a-z0-9_.-]+$/i.test(entry.name)&&(entry.isDirectory()||entry.isSymbolicLink()),'unexpected dependency entry');
      linkBuildPackage(source,destination);
    }
  }
  return {runtimePackages:[...runtimePackages],copiedFiles,sourceLinks:[...sourceLinks.values()],
    metadataInputs:[...metadata.values()],directoryInputs:[...directoryInputs.values()],linkedBuildPackages,bytes:total};
}

function verifyMaterializedInputs(dependencies,{hashInput}={}) {
  const fs=require('node:fs'),crypto=require('node:crypto');
  const hash=value=>crypto.createHash('sha256').update(value).digest('hex');
  const check=(ok,why)=>{if(!ok)throw Error('Packaging preservation: '+why);};
  check(dependencies&&typeof hashInput==='function','invalid dependencies');
  for(const item of dependencies.copiedFiles) {
    for(const file of [item.canonicalSource,item.destination]) {
      const current=hashInput(file,item.bytes);
      check(current.bytes===item.bytes&&current.sha256===item.sha256,'runtime file changed: '+file);
    }
  }
  for(const item of dependencies.metadataInputs) {
    const current=hashInput(item.file,item.bytes);
    check(current.bytes===item.bytes&&current.sha256===item.sha256,'dependency metadata changed: '+item.file);
  }
  for(const item of [...dependencies.sourceLinks,...dependencies.linkedBuildPackages]) {
    check(fs.lstatSync(item.path).isSymbolicLink()&&fs.readlinkSync(item.path)===item.target&&
      fs.realpathSync(item.path)===item.canonicalTarget,'dependency symlink changed: '+item.path);
  }
  for(const item of dependencies.directoryInputs) {
    check(fs.lstatSync(item.path).isDirectory()&&fs.realpathSync(item.path)===item.path,'dependency directory changed: '+item.path);
    const opened=fs.opendirSync(item.path),entries=[];
    try {let entry;while((entry=opened.readSync())){
      check(entries.length<10000,'dependency directory exceeds entry bound');
      entries.push({name:entry.name,type:entry.isSymbolicLink()?'link':entry.isDirectory()?'directory':entry.isFile()?'file':'other'});
    }}finally{opened.closeSync();}
    entries.sort((a,b)=>a.name.localeCompare(b.name));
    check(hash(JSON.stringify(entries))===item.sha256,'dependency directory listing changed: '+item.path);
  }
  return true;
}

async function runPackagedSmoke() {
  const fs=require('node:fs'),path=require('node:path'),Module=require('node:module'),assert=require('node:assert/strict');
  const config=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
  const artifact=fs.realpathSync(config.artifact),root=path.join(artifact,'node_modules');
  assert.equal(artifact,config.artifact);assert.ok(fs.lstatSync(root).isDirectory());assert.equal(fs.realpathSync(root),root);
  assert.equal(process.env.NODE_PATH,undefined);assert.equal(process.env.NODE_OPTIONS,undefined);
  const original=Module._resolveFilename,resolutions=new Set(),builtins=new Set(Module.builtinModules.map(name=>name.replace(/^node:/,'')));
  Module._resolveFilename=function(request,...args){
    const resolved=original.call(this,request,...args);
    if(typeof resolved==='string'&&!builtins.has(resolved.replace(/^node:/,''))){
      assert.ok(path.isAbsolute(resolved),'Unexpected non-file module resolution');
      const actual=fs.realpathSync(resolved);assert.ok(actual.startsWith(root+path.sep),'Runtime dependency escaped detached artifact');
      resolutions.add(actual);
    }
    return resolved;
  };
  const req=Module.createRequire(path.join(artifact,'server.mjs')),checks=[],controls=[];
  async function test(name,work){try{await work();checks.push({name,pass:true});}catch(error){checks.push({name,pass:false,error:String(error.message).slice(0,400)});}}
  try {
    await test('packaged_bcrypt_native_hash_and_compare',async()=>{
      const bcrypt=req('bcrypt'),encoded=await bcrypt.hash('synthetic-packaging-password',4);
      assert.equal(await bcrypt.compare('synthetic-packaging-password',encoded),true);
      const wrong=await bcrypt.compare('synthetic-wrong-password',encoded);assert.equal(wrong,false);
      controls.push({name:'bcrypt_rejects_wrong_password',pass:wrong===false});
    });
    await test('packaged_speakeasy_fixed_time_totp',async()=>{
      const speakeasy=req('speakeasy'),secret='JBSWY3DPEHPK3PXP',time=1700000000;
      const token=speakeasy.totp({secret,encoding:'base32',time,step:30,digits:6});assert.match(token,/^\d{6}$/);
      assert.equal(speakeasy.totp.verify({secret,encoding:'base32',time,step:30,digits:6,window:0,token}),true);
    });
    await test('packaged_qrcode_renders_svg',async()=>{
      const qrcode=req('qrcode'),svg=await qrcode.toString('MMHB synthetic package smoke',{type:'svg',margin:1});
      assert.equal(typeof svg,'string');assert.match(svg,/<svg\b/);assert.match(svg,/<path\b/);
    });
  }finally{Module._resolveFilename=original;}
  const result={scope:'DETACHED_PACKAGED_DEPENDENCY_SMOKE_ONLY_NO_APP_BOOT',tests:checks.length,
    pass:checks.filter(row=>row.pass).length,checks,controls,resolvedFiles:[...resolutions].sort()};
  fs.writeFileSync(config.result,JSON.stringify(result,null,2)+'\n',{flag:'wx',mode:0o600});
  if(result.pass!==3||controls.length!==1||!controls.every(row=>row.pass))process.exitCode=1;
}

function makeIntegrationCandidates(app,webhook,shutdownSource,baselineApp) {
  const replace=(text,from,to,label)=>{
    if(text.split(from).length!==2)throw Error('Integration anchor changed: '+label);
    return text.replace(from,to);
  };
  if(app.includes('MMHB_BILLING_APPLICATION_V1'))throw Error('Application integration already present; inspect it');
  const appBefore=app;
  app=replace(app,'import webhookRoutes from "./routes/webhook.mjs";',
    'import webhookRoutes from "./routes/webhook.mjs";\n'+
    '// MMHB_BILLING_APPLICATION_V1\n'+
    'import { billingRuntime } from "./billing/application.mjs";\n'+
    'import { drainBillingServer } from "./billing/billingShutdown.mjs";','app imports');
  const start=app.indexOf('function shutdown(signal) {');
  const end=app.indexOf('\nprocess.on("SIGTERM", () => shutdown("SIGTERM"));',start);
  if(start<0||end<0||app.indexOf('function shutdown(signal) {',start+1)!==-1)throw Error('Shutdown boundary changed');
  const oldShutdown=app.slice(start,end);
  const knownStart=baselineApp.indexOf('function shutdown(signal) {');
  const knownEnd=baselineApp.indexOf('\nprocess.on("SIGTERM", () => shutdown("SIGTERM"));',knownStart);
  if(knownStart<0||knownEnd<0||oldShutdown!==baselineApp.slice(knownStart,knownEnd))
    throw Error('Reviewed shutdown implementation changed');
  if(!oldShutdown.includes('}, 5000).unref();')||!oldShutdown.includes('server?.closeAllConnections?.();')||
    !oldShutdown.includes('if (relistenTimer) clearTimeout(relistenTimer);'))throw Error('Shutdown implementation changed');
  const nextShutdown=`let billingShutdownPromise = null;
function shutdown(signal) {
  if (billingShutdownPromise) return billingShutdownPromise;
  console.log('[SERVER] shutdown requested', { signal });
  shuttingDown = true;
  if (relistenTimer) clearTimeout(relistenTimer);
  billingShutdownPromise = drainBillingServer({ server, runtime: billingRuntime, deadlineMs: 45000 })
    .then(result => {
      console.log('[SERVER] shutdown result', result);
      process.exit(result.ok ? 0 : 1);
    }, () => {
      console.error('[SERVER] shutdown failed');
      process.exit(1);
    });
  return billingShutdownPromise;
}
`;
  app=app.slice(0,start)+nextShutdown+app.slice(end);
  app=replace(app,'server.on("listening", () => {',
    'server.on("listening", () => {\n'+
    '  // Billing readiness is independent of the legacy best-effort bootstrap.\n'+
    '  void billingRuntime.start().catch(() => console.error("[BILLING] startup unavailable"));','listening');
  // A newly starting process must not kill the old process while its worker
  // persists an in-flight outcome. Exhausting bind retries exits this newcomer.
  const kill='    else if (listenRetries === 8) reclaimPortFromStaleDuplicates("SIGKILL");';
  app=replace(app,kill,'    // No forced peer kill: the old process owns its bounded drain.','peer SIGKILL');
  app=replace(app,'    // retry 8 (~3.2s), it\'s wedged — force it. Retries continue either way.',
    '    // later retries, let its own shutdown deadline govern termination.','peer comment');
  app=replace(app,'// instance releases the port immediately on shutdown (closeAllConnections), so\n// a retry typically succeeds within a few hundred ms. If the port is held by a',
    '// instance closes its listening socket while accepted work drains. If the port is held by a',
    'handoff comment');
  app=replace(app,'    // handlers that release the port instantly). If it STILL holds the port by',
    '    // handlers that stop accepting new requests). If it STILL holds the port on','reclaim comment');
  const mount='app.use("/api/webhooks", webhookRoutes);';
  if(app.split(mount).length!==2||app.indexOf(mount)>app.indexOf('app.use(express.json('))
    throw Error('Raw webhook mount order changed');
  webhook=replace(webhook,'import { db } from "../db/client.mjs";',
    'import { billingDb as db, billingRuntime } from "../billing/application.mjs";','webhook database');
  webhook=replace(webhook,'{ apiVersion: "2024-06-20" }',
    '{ apiVersion: "2024-06-20", timeout: 10000, maxNetworkRetries: 0 }','Stripe timeout');
  webhook=replace(webhook,'  async (req, res) => {','  billingRuntime.handleWebhook(async (req, res) => {','handler begin');
  webhook=replace(webhook,'  }\n);','  })\n);','handler end');
  const health=`function billingWebhookHealth(_req, res) {
  const state = billingRuntime.status();
  const ready = state.ready && Boolean(stripe);
  res.set('Cache-Control', 'no-store');
  return res.status(ready ? 200 : 503).json({
    ok: ready, module: 'stripeWebhook', status: state.state,
    stripeConfigured: Boolean(stripe), timestamp: new Date().toISOString()
  });
}
`;
  const hstart=webhook.indexOf('router.get("/", (_req, res) => {');
  const hend=webhook.indexOf('// IMPORTANT: raw body ONLY for stripe signature verification',hstart);
  if(hstart<0||hend<0||!webhook.slice(hstart,hend).includes('router.get("/health"'))throw Error('Webhook health anchor changed');
  webhook=webhook.slice(0,hstart)+health+'router.get("/", billingWebhookHealth);\nrouter.get("/health", billingWebhookHealth);\n\n'+webhook.slice(hend);
  const duplicate='// Health check endpoint for admin daily tools monitoring\nrouter.get("/", (req, res) => {\n  res.json({ ok: true, module: "webhook", status: "operational", timestamp: new Date().toISOString() });\n});';
  webhook=replace(webhook,duplicate,'// Billing health is registered once above the Stripe handler.','duplicate health');
  return {app,webhook,shutdownSource,appBefore,oldShutdown};
}

async function qualifyFrontend() {
  'use strict';
  const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
  const {pathToFileURL}=require('node:url');
  const cfg=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
  const hash=value=>crypto.createHash('sha256').update(value).digest('hex');
  const fault=code=>Object.assign(Error('Frontend qualification: '+code),{code});
  const check=(ok,code)=>{if(!ok)throw fault(code);};
  const within=(value,base)=>value===base||value.startsWith(base+path.sep);
  const canonicalDirectory=value=>typeof value==='string'&&path.isAbsolute(value)&&
    path.resolve(value)===value&&fs.lstatSync(value).isDirectory()&&fs.realpathSync(value)===value;
  const report={scope:'FRESH_FRONTEND_BUILD_WITHOUT_DEPLOYMENT_ENVIRONMENT',pass:false,
    deploymentEnvironmentQualified:false,browserTests:false};
  let failure,resultAllowed=false;
  try {
    check(canonicalDirectory(cfg.root)&&canonicalDirectory(cfg.source)&&canonicalDirectory(cfg.directory),
      'invalid_root_or_staging_directory');
    check(cfg.source!==cfg.root&&within(cfg.source,cfg.directory),'source_must_be_private_staging');
    check(typeof cfg.output==='string'&&path.isAbsolute(cfg.output)&&path.resolve(cfg.output)===cfg.output&&
      within(cfg.output,cfg.directory)&&cfg.output!==cfg.directory&&cfg.output!==cfg.source,
      'output_must_be_private_staging');
    check(typeof cfg.result==='string'&&path.isAbsolute(cfg.result)&&path.resolve(cfg.result)===cfg.result&&
      within(cfg.result,cfg.directory)&&cfg.result!==cfg.output,'result_must_be_private_staging');
    check(canonicalDirectory(path.dirname(cfg.result)),'result_parent_must_be_private_staging');
    resultAllowed=true;
    try {fs.lstatSync(cfg.output);throw fault('fresh_output_already_exists');}
    catch(error){if(error.code!=='ENOENT')throw error;}
    check(process.env.NODE_ENV==='production','production_build_environment_required');
    check(!process.env.REPL_ID&&!process.env.NODE_OPTIONS&&!process.env.NODE_PATH,
      'unreviewed_runtime_environment');
    check(!Object.keys(process.env).some(key=>key.startsWith('VITE_')),'deployment_vite_variables_present');
    const configFile=path.join(cfg.source,'vite.config.js');
    check(fs.lstatSync(configFile).isFile()&&fs.realpathSync(configFile)===configFile,'unsafe_vite_configuration');
    const configHash=hash(fs.readFileSync(configFile));
    check(configHash==='4b0866ecaacafc2f497010f37c40de9377766f554ca06989efd3ff027a4fff5e',
      'reviewed_vite_configuration_changed');
    const modules=path.join(cfg.root,'node_modules');
    check(canonicalDirectory(modules),'installed_dependencies_not_canonical');
    const packageFile=path.join(modules,'vite/package.json'),lockFile=path.join(cfg.source,'package-lock.json');
    const vitePackage=JSON.parse(fs.readFileSync(packageFile,'utf8'));
    const lock=JSON.parse(fs.readFileSync(lockFile,'utf8'));
    check(vitePackage.name==='vite'&&typeof vitePackage.version==='string'&&
      lock.packages?.['node_modules/vite']?.version===vitePackage.version,
      'installed_vite_lock_mismatch');
    report.viteVersion=vitePackage.version;
    const envDir=path.join(cfg.directory,'frontend-empty-env'),cacheDir=path.join(cfg.directory,'frontend-cache');
    fs.mkdirSync(envDir,{mode:0o700});fs.mkdirSync(cacheDir,{mode:0o700});
    const entry=path.join(modules,'vite/dist/node/index.js');
    check(fs.lstatSync(entry).isFile()&&fs.realpathSync(entry)===entry,'unsafe_vite_api_entry');
    // The caller's evidence directory is not the project root. Resolve any
    // relative config paths using the isolated project, as `vite build` does.
    process.chdir(cfg.source);
    const {build}=await import(pathToFileURL(entry).href);
    check(typeof build==='function','vite_build_api_missing');
    let resolvedCount=0;
    const guard={name:'mmhb-private-build-configuration',enforce:'post',configResolved(config){
      check(++resolvedCount===1,'unexpected_multiple_configuration_resolution');
      const absolute=value=>typeof value==='string'&&path.isAbsolute(value)&&path.resolve(value)===value;
      check(absolute(config.root)&&within(config.root,cfg.source)&&canonicalDirectory(config.root),
        'vite_root_escapes_staging');
      check(config.envDir===envDir&&config.cacheDir===cacheDir&&config.build?.outDir===cfg.output&&
        config.build?.emptyOutDir===true,'private_build_overrides_changed');
      check(config.mode==='production'&&config.command==='build'&&config.isProduction===true,
        'unexpected_vite_build_mode');
      const publicDir=config.publicDir;
      check(publicDir===false||publicDir===''||[path.join(cfg.source,'client/public'),path.join(cfg.source,'public')].includes(publicDir),
        'vite_public_directory_not_fully_snapshotted');
      if(publicDir)check(canonicalDirectory(publicDir),'configured_public_directory_missing_or_linked');
      const aliases=Array.isArray(config.resolve?.alias)?config.resolve.alias:
        Object.entries(config.resolve?.alias||{}).map(([find,replacement])=>({find,replacement}));
      for(const alias of aliases){
        check(alias&&typeof alias.replacement==='string','unexpected_alias_shape');
        // Vite adds /@fs aliases for its own client helpers. Installed package
        // paths are permitted; application aliases must stay in this copy.
        const replacement=alias.replacement.replace(/^\/@fs(?=\/)/,'');
        if(path.isAbsolute(replacement))check(within(path.resolve(replacement),cfg.source)||
          within(path.resolve(replacement),modules),'absolute_alias_escapes_staging');
      }
      report.configuration={sha256:configHash,root:path.relative(cfg.source,config.root)||'.',
        publicDirectory:publicDir?path.relative(cfg.source,publicDir)||'.':null,
        aliasCount:aliases.length,mode:config.mode,configLoader:'native',emptyEnvironment:true};
    }};
    await build({configFile,configLoader:'native',mode:'production',envDir,cacheDir,
      plugins:[guard],build:{outDir:cfg.output,emptyOutDir:true}});
    check(resolvedCount===1,'configuration_guard_did_not_run');
    check(hash(fs.readFileSync(configFile))===configHash,'vite_configuration_changed_during_build');
    const indexFile=path.join(cfg.output,'index.html');
    check(fs.lstatSync(indexFile).isFile()&&fs.realpathSync(indexFile)===indexFile,'fresh_index_missing_or_linked');
    const index=fs.readFileSync(indexFile);check(index.length>0&&index.length<=4194304,'fresh_index_empty_or_oversized');
    report.index={bytes:index.length,sha256:hash(index)};
    report.pass=true;
  } catch(error) {report.error=typeof error.code==='string'?error.code:'frontend_build_failed';failure=error;}
  if(resultAllowed)fs.writeFileSync(cfg.result,JSON.stringify(report,null,2)+'\n',{flag:'wx',mode:0o600});
  if(failure)throw failure;
  return report;
}

try{
  console.log('COMMAND_ID='+ID);
  check(JSON.parse(bytes(ROOT+'/package.json')).name==='mymentalhealthbuddy','Project identity mismatch');
  check(!process.env.REPL_ID||process.env.REPL_ID==='9d71c4b8-8fcd-4b22-aee2-5883d9cbe5a4','Replit identity mismatch');
  check(git('rev-parse','--show-toplevel').trim()===ROOT,'Repository root mismatch');
  check(process.getuid()!==0,'Run as the regular Replit user');
  check(process.versions.node.split('.')[0]==='24','Expected Node 24');
  before=snapshot();console.log('CURRENT='+JSON.stringify({head:before.head,branch:before.branch}));
  check(before.branch==='integration'&&before.tracked==='','Unexpected branch or tracked changes; preserve work');
  privateDirectory(PRIOR);
  const previous=JSON.parse(bytes(PRIOR+'/summary.json'));
  check(previous.command==='MMHB-BILLING-APPLICATION-RETRY-20260925-40'&&previous.head==='0e6c2b2b8d0d484aca1ae3de18a49ed75c9dc681'&&
    previous.status==='BILLING_APPLICATION_CANDIDATE_QUALIFIED_IN_ISOLATION'&&previous.sourcePreserved===true&&
    previous.tests===10&&previous.pass===10&&previous.disposableDatabaseStopped==='PASS','G40 summary differs');
  const qualified=JSON.parse(bytes(PRIOR+'/result.json')),build=JSON.parse(bytes(PRIOR+'/build-result.json'));
  check(qualified.tests===10&&qualified.pass===10&&qualified.checks?.length===10&&qualified.checks.every(x=>x.pass===true)&&
    qualified.controls?.length===1&&qualified.controls[0].pass===true,'G40 tests differ');
  check(build.results?.length===2&&build.results.every(x=>x.pass===true),'G40 build comparison differs');
  git('merge-base','--is-ancestor',previous.head,before.head);
  const source=JSON.parse(bytes(PRIOR+'/source-manifest.json')),changes=JSON.parse(bytes(PRIOR+'/candidate-manifest.json'));
  check(Array.isArray(source)&&source.length===3581&&changes?.length===13,'G40 source manifests differ');
  const byPath=new Map(),changeMap=new Map();
  const validRel=rel=>typeof rel==='string'&&!path.isAbsolute(rel)&&!rel.split('/').some(x=>x==='..'||x==='.'||x===''||x==='.git'||x==='node_modules');
  for(const entry of source){check(validRel(entry.file)&&/^[a-f0-9]{64}$/.test(entry.sha256)&&!byPath.has(entry.file),'Invalid source manifest entry');byPath.set(entry.file,entry);}
  for(const entry of changes){check(validRel(entry.file)&&/^[a-f0-9]{64}$/.test(entry.after)&&!changeMap.has(entry.file),'Invalid candidate manifest entry');changeMap.set(entry.file,entry);}
  check(changes.every(x=>expectedCandidateFiles.includes(x.file))&&expectedCandidateFiles.every(x=>changeMap.has(x)),'Candidate scope differs');
  for(const [rel,pin]of Object.entries(candidatePins))check(changeMap.get(rel)?.after===pin,'Candidate pin differs: '+rel);
  const schemaEvidence=ROOT+'/.git/mmhb-review-evidence/billing-schema-j6qgnN';
  const contract=bytes(schemaEvidence+'/billing-schema-contract.json');
  check(hash(contract)==='9caba9be9d259d0607a027021749da642daacfcc21298d011742a15d038dfb10','Qualified schema contract changed');
  const intent=bytes(schemaEvidence+'/candidate/billing-notification-intents.sql'),delivery=bytes(schemaEvidence+'/candidate/billing-notification-deliveries.sql');
  check(hash(intent)==='0abfb97fdb56428ceb0d7f02ecb951216c2eb61f356c8412b886f1fe1a27feea'&&
    hash(delivery)==='49f51f3bcd963df35fa276b58d9e42ef04091976934b9a28a1bd119602551d9f','Qualified migration data changed');
  const schemaCode='export const billingSchemaContract='+JSON.stringify(JSON.parse(contract))+';\n'+
    'export const billingMigrationSQL='+JSON.stringify(intent.toString('utf8')+'\n'+delivery.toString('utf8'))+';\n';
  check(changeMap.get('server/db/billingSchemaContract.mjs').after===hash(schemaCode),'Candidate schema binding changed');
  const reviewedApp=bytes(ROOT+'/.git/mmhb-review-evidence/billing-candidates-w7Q3B8/baseline/server/app.mjs');
  check(hash(reviewedApp)==='ef9c243bce76fe646a14a5c6556711faf664d772dc00384b24b8e85003d0eca6','Reviewed app anchor changed');
  const transactionalWebhook=bytes(schemaEvidence+'/candidate/webhook.after.mjs');
  check(hash(transactionalWebhook)==='071a2dec33cb5b426e2616d0b017d21ea37f05849079bb091f095bb1712e6e08','Transactional webhook changed');
  const generated=makeIntegrationCandidates(bytes(PRIOR+'/baseline/server/app.mjs').toString('utf8'),transactionalWebhook.toString('utf8'),
    bytes(PRIOR+'/candidate/server/billing/billingShutdown.mjs').toString('utf8'),reviewedApp.toString('utf8'));
  check(changeMap.get('server/app.mjs').after===hash(generated.app)&&changeMap.get('server/routes/webhook.mjs').after===hash(generated.webhook),'Candidate application patch differs');
  privateDirectory(QUALIFIED);
  const g43=JSON.parse(bytes(QUALIFIED+'/summary.json')),g43Tests=JSON.parse(bytes(QUALIFIED+'/result.json'));
  check(g43.command==='MMHB-BILLING-ADAPTER-QUALIFICATION-20260925-43'&&
    g43.status==='BILLING_ADAPTER_AND_USERS_READINESS_QUALIFIED_IN_ISOLATION'&&g43.sourcePreserved===true&&
    g43.tests===12&&g43.pass===12&&g43.disposableDatabaseStopped==='PASS','G43 summary differs');
  check(g43Tests.tests===12&&g43Tests.pass===12&&g43Tests.checks?.length===12&&g43Tests.checks.every(x=>x.pass===true)&&
    g43Tests.controls?.length===2&&g43Tests.controls.every(x=>x.pass===true),'G43 adapter tests differ');
  git('merge-base','--is-ancestor',g43.head,before.head);
  const full=JSON.parse(bytes(QUALIFIED+'/candidate-manifest.json')),repair=JSON.parse(bytes(QUALIFIED+'/repair-manifest.json'));
  const expected=new Map(source.map(x=>[x.file,x.sha256]));
  for(const row of changes)expected.set(row.file,row.after);
  expected.set('server/db/billingUsersReadiness.mjs','3914d63a3bf2d37b550730fcdc6918bb262d526c5482a14974bda5a484c74d10');
  expected.set('server/billing/createApplication.mjs','5647e7176c073994c54c6c08dedbb0283b7a16780bf7602ed620c51714be89a6');
  const g43Map=new Map();
  check(Array.isArray(full)&&full.length===expected.size,'G43 full manifest count differs');
  for(const entry of full){
    check(validRel(entry.file)&&!g43Map.has(entry.file)&&expected.get(entry.file)===entry.sha256,'G43 candidate scope or hash differs');
    g43Map.set(entry.file,entry.sha256);
  }
  check(Array.isArray(repair)&&repair.length===2&&repair.every(x=>
    ['server/db/billingUsersReadiness.mjs','server/billing/createApplication.mjs'].includes(x.file)&&expected.get(x.file)===x.after)&&
    new Set(repair.map(x=>x.file)).size===2,'G43 repair manifest differs');
  const pkg=JSON.parse(bytes(ROOT+'/package.json')),lockBytes=bytes(ROOT+'/package-lock.json'),lock=JSON.parse(lockBytes);
  check(pkg.scripts?.build==='vite build'&&pkg.scripts?.typecheck==='tsc --noEmit','Reviewed build/typecheck command differs');
  const versions={node:process.version};
  for(const name of ['vite','typescript','esbuild']){
    const installed=JSON.parse(bytes(ROOT+'/node_modules/'+name+'/package.json'));
    check(installed.name===name&&installed.version===lock.packages?.['node_modules/'+name]?.version,'Installed build dependency does not match lockfile: '+name);
    versions[name]=installed.version;
  }
  const builder=bytes(ROOT+'/scripts/build-server.mjs');
  check(hash(builder)==='9e046524ba1e77b5202c0bbe895b8a6a430e38b5188b1a2f2613525a183c4816','Reviewed production builder changed');
  check(hash(bytes(ROOT+'/vite.config.js'))==='4b0866ecaacafc2f497010f37c40de9377766f554ca06989efd3ff027a4fff5e','Reviewed Vite config changed');
  check(hash(bytes(ROOT+'/tsconfig.json'))==='ca65a65cc06d0224dde35f5a8a635fc8f9527770d8c96211ce36b3ebb29548ed','Reviewed TypeScript config changed');
  for(const item of reviewedChecks)check(hash(bytes(ROOT+'/'+item.path))===item.sha256,'Reviewed source checker changed: '+item.path);
  console.log('G43_QUALIFICATION=PASS_RECORDED;RECHECKING_EXACT_SOURCE');
  console.log('BUILD_DEPENDENCIES='+JSON.stringify(versions));
  const parent=path.join(path.resolve(ROOT,git('rev-parse','--absolute-git-dir').trim()),'mmhb-review-evidence');privateDirectory(parent);
  const free=fs.statfsSync(parent);check(free.bavail*free.bsize>=2147483648,'Need 2 GiB free for source, build, and detached package');
  directory=fs.mkdtempSync(path.join(parent,'fresh-release-build-'));privateDirectory(directory);
  console.log('EVIDENCE_DIRECTORY='+directory);put('state.before.json',JSON.stringify(before,null,2));
  sourceTree=path.join(directory,'candidate');fs.mkdirSync(sourceTree,{mode:0o700});
  for(const row of source){
    check(observe(ROOT+'/'+row.file).sha256===row.sha256,'Current application source differs from G40: '+row.file);
    check(observe(PRIOR+'/baseline/'+row.file).sha256===row.sha256,'G40 baseline differs: '+row.file);
  }
  for(const [rel,pin]of expected)check(observe(QUALIFIED+'/candidate/'+rel).sha256===pin,'Qualified G43 candidate differs: '+rel);
  const tracked=git('ls-files','-z').split('\0').filter(Boolean),manifest=[],omitted=[];
  const secret=rel=>rel.split('/').some(p=>p==='.env'||p.startsWith('.env.')||['.git','.ssh','.aws'].includes(p))||
    /\.(?:pem|key|p12|pfx|sqlite|sqlite3|db)$/i.test(rel)||/(?:^|\/)(?:id_rsa|id_ed25519)(?:\.|$)/.test(rel);
  const excludedArtifact=rel=>/^(?:node_modules\/|dist\/|client\/dist\/|MMHB-)/.test(rel)||rel.endsWith('.tsbuildinfo')||rel.split('/').includes('.git');
  let total=0;
  for(const rel of tracked){
    check(validRel(rel),'Unsafe tracked path');
    if(secret(rel)||excludedArtifact(rel)){omitted.push({file:rel,reason:secret(rel)?'CREDENTIAL_OR_DATABASE_FILE':'GENERATED_OR_REVIEW_ARTIFACT'});continue;}
    const target=sourceTree+'/'+rel;fs.mkdirSync(path.dirname(target),{recursive:true,mode:0o700});
    const copied=copySnapshotInput(ROOT+'/'+rel,[target],Math.min(268435456,536870912-total));total+=copied.bytes;
    check(observe(ROOT+'/'+rel).sha256===copied.sha256,'Source changed immediately after copy: '+rel);manifest.push({file:rel,...copied});stagedInputs.set(rel,copied);
  }
  // Include complete public trees, including untracked static assets. The Vite
  // helper permits only these copied public locations or publicDir:false.
  for(const rel of ['client/public','public']){
    let exists=false;try{fs.lstatSync(ROOT+'/'+rel);exists=true;}catch(e){if(e.code!=='ENOENT')throw e;}
    if(!exists)continue;
    const listed=hashTree(ROOT+'/'+rel);
    check(listed.every(x=>!secret(rel+'/'+x.path)),'Sensitive file present in public assets; review required');
    const existingBytes=manifest.filter(x=>x.file.startsWith(rel+'/')).reduce((n,x)=>n+x.bytes,0);
    total+=listed.reduce((n,x)=>n+x.bytes,0)-existingBytes;
    check(total<=536870912,'Full source and assets exceed 512 MiB copy bound');
    const target=sourceTree+'/'+rel;fs.rmSync(target,{recursive:true,force:true});fs.mkdirSync(path.dirname(target),{recursive:true,mode:0o700});
    check(JSON.stringify(copyTree(ROOT+'/'+rel,target))===JSON.stringify(listed),'Public assets changed during copying');
    publicTrees.push({relative:rel,manifest:listed});
    for(const x of listed)stagedInputs.set(rel+'/'+x.path,{bytes:x.bytes,sha256:x.sha256});
  }
  const overlays=[...expected].filter(([rel,pin])=>!byPath.has(rel)||byPath.get(rel).sha256!==pin);
  for(const [rel,pin]of overlays){
    if(!byPath.has(rel)){
      let occupied=false;try{fs.lstatSync(ROOT+'/'+rel);occupied=true;}catch(e){if(e.code!=='ENOENT')throw e;}
      check(!occupied,'New application target exists; preserve it: '+rel);
    }
    const target=sourceTree+'/'+rel;
    if(fs.existsSync(target))fs.unlinkSync(target);
    fs.mkdirSync(path.dirname(target),{recursive:true,mode:0o700});
    const copied=copySnapshotInput(QUALIFIED+'/candidate/'+rel,[target],4194304);
    check(copied.sha256===pin,'Candidate changed during overlay');stagedInputs.set(rel,copied);
  }
  put('tracked-source-manifest.json',JSON.stringify(manifest,null,2));
  put('omitted-tracked-files.json',JSON.stringify(omitted,null,2));
  put('public-input-manifests.json',JSON.stringify(publicTrees,null,2));
  put('candidate-input-manifest.json',JSON.stringify([...stagedInputs].map(([file,x])=>({file,...x})),null,2));
  console.log('SOURCE_SNAPSHOT='+JSON.stringify({trackedFiles:manifest.length,publicTrees:publicTrees.map(x=>({path:x.relative,files:x.manifest.length})),bytes:total,priorClientDistCopied:false}));
  console.log('CURRENT_APPLICATION_AND_G43_CANDIDATE_MATCH=PASS');
  inventoryReport=captureTestSources(pkg,sourceTree);
  const dependencies=materializeBuildDependencies({root:ROOT,workspace:sourceTree,buildScript:builder.toString('utf8'),lockBytes,limitBytes:268435456,copyInput:copySnapshotInput});
  dependencyRecords.push(dependencies);put('dependency-inputs.json',JSON.stringify(dependencies,null,2));
  console.log('RUNTIME_DEPENDENCIES='+JSON.stringify({packages:dependencies.runtimePackages.length,bytes:dependencies.bytes}));
  const tsc=ROOT+'/node_modules/typescript/bin/tsc';observe(tsc);
  const config=JSON.parse(run('TYPECHECK_CONFIG',process.execPath,[tsc,'--showConfig','--pretty','false'],sourceTree).stdout);
  typecheckReport={files:config.files?.length||0,allowJs:config.compilerOptions?.allowJs===true,checkJs:config.compilerOptions?.checkJs===true,pass:false};
  check(typecheckReport.files>0,'TypeScript resolved no input files');console.log('TYPECHECK_COVERAGE='+JSON.stringify(typecheckReport));
  fs.mkdirSync(directory+'/typescript-cache',{mode:0o700});
  run('TYPECHECK',process.execPath,[tsc,'--noEmit','--pretty','false','--incremental','true','--tsBuildInfoFile',directory+'/typescript-cache/build.tsbuildinfo'],sourceTree,180000);
  typecheckReport.pass=true;console.log('TYPECHECK=PASS');
  for(const item of reviewedChecks){
    check(hash(bytes(sourceTree+'/'+item.path))===item.sha256,'Staged source checker changed');
    run(item.label,process.execPath,[sourceTree+'/'+item.path],sourceTree,45000);
    contractResults.push({name:item.label,pass:true});console.log(item.label+'=PASS');
  }
  console.log('REVIEWED_CONTRACT_SCOPE='+reviewedCheckScope.scope);
  const front=put('frontend.cjs','('+qualifyFrontend.toString()+')().catch(e=>{console.error(e.code||e.message);process.exitCode=2;});\n');
  const frontResult=directory+'/frontend-result.json';
  const frontConfig=put('frontend-config.json',JSON.stringify({root:ROOT,source:sourceTree,directory,result:frontResult,output:sourceTree+'/client/dist'}));
  const frontendExecution=run('FRESH_FRONTEND_BUILD',process.execPath,[front,frontConfig],sourceTree,240000,[0,1,2]);
  clientReport=JSON.parse(bytes(frontResult));
  console.log('FRONTEND_BUILD_DETAIL='+JSON.stringify({pass:clientReport.pass,error:clientReport.error||null,configuration:clientReport.configuration}));
  check(frontendExecution.status===0&&clientReport.pass===true,'Fresh frontend failed: '+(clientReport.error||'BUILD_PROCESS_ERROR'));
  clientManifest=hashTree(sourceTree+'/client/dist');
  check(clientManifest.some(x=>x.path==='index.html'&&x.bytes>0),'Fresh client index is missing');
  const configuredPublic=publicTrees.find(x=>x.relative===clientReport.configuration?.publicDirectory);
  if(clientReport.configuration?.publicDirectory)check(configuredPublic,'Fresh build public directory has no complete snapshot');
  const freshByPath=new Map(clientManifest.map(x=>[x.path,x]));
  for(const entry of configuredPublic?.manifest||[]){
    const built=freshByPath.get(entry.path);
    check(built&&built.bytes===entry.bytes&&built.sha256===entry.sha256,'Public asset missing or changed in fresh output: '+entry.path);
  }
  console.log('PUBLIC_ASSET_FIDELITY='+JSON.stringify({pass:true,files:configuredPublic?.manifest.length||0}));
  put('fresh-client-manifest.json',JSON.stringify(clientManifest,null,2));
  clientFresh=true;
  console.log('FRESH_FRONTEND_RESULT='+JSON.stringify({pass:true,files:clientManifest.length,bytes:clientManifest.reduce((n,x)=>n+x.bytes,0),deploymentEnvironment:false}));
  const record={mode:'g43-candidate-with-fresh-client',build:false,artifact:false,smoke:false};packageResults.push(record);
  run('PRODUCTION_BUILD',process.execPath,[sourceTree+'/scripts/build-server.mjs'],sourceTree,120000);record.build=true;
  run('SERVER_BUNDLE_SYNTAX',process.execPath,['--check',sourceTree+'/dist/server.mjs'],sourceTree,30000);
  check(hashSnapshotInput(sourceTree+'/dist/schema.canonical.sql',4194304).sha256===expected.get('server/db/schema.canonical.sql'),'Packaged canonical schema differs');
  check(JSON.stringify(hashTree(sourceTree+'/dist/client/dist'))===JSON.stringify(clientManifest),'Packaged frontend differs from fresh build');
  const artifactManifest=hashTree(sourceTree+'/dist',{allowNodeModules:true});
  detached=fs.mkdtempSync('/tmp/mmhb-release-artifact-');privateDirectory(detached);
  const portable=detached+'/candidate';
  check(JSON.stringify(copyTree(sourceTree+'/dist',portable,{allowNodeModules:true}))===JSON.stringify(artifactManifest),'Detached package differs');record.artifact=true;
  put('artifact-manifest.json',JSON.stringify(artifactManifest,null,2));
  const smoke=put('smoke.cjs','('+runPackagedSmoke.toString()+')().catch(e=>{console.error(e.code||e.message);process.exitCode=2;});\n');
  const smokeResult=directory+'/smoke-result.json',smokeConfig=put('smoke-config.json',JSON.stringify({artifact:portable,result:smokeResult}));
  run('DETACHED_NATIVE_RUNTIME',process.execPath,[smoke,smokeConfig],portable,45000,[0,1]);
  const smokeReport=JSON.parse(bytes(smokeResult));
  record.smoke=smokeReport.tests===3&&smokeReport.pass===3&&smokeReport.checks?.length===3&&smokeReport.checks.every(x=>x.pass===true)&&
    smokeReport.controls?.length===1&&smokeReport.controls.every(x=>x.pass===true);
  console.log('PACKAGE_RESULT='+JSON.stringify({...record,runtime:smokeReport.checks,controls:smokeReport.controls}));
  check(record.smoke,'Detached native runtime checks failed');
  check(JSON.stringify(hashTree(portable,{allowNodeModules:true}))===JSON.stringify(artifactManifest),'Detached artifact changed during smoke checks');
  status='FRESH_CLIENT_AND_G43_PACKAGE_QUALIFIED_ON_CURRENT_HOST';
}catch(e){console.log('REASON='+JSON.stringify(e.message));process.exitCode=2;}
finally{
  if(before){try{
    check(JSON.stringify(snapshot())===JSON.stringify(before),'Checkout changed during qualification');
    for(const file of inputs.keys())bytes(file);
    for(const [file,entry]of observed)check(hashSnapshotInput(file,entry.bytes).sha256===entry.sha256,'Observed source changed: '+file);
    for(const tree of publicTrees){
      check(JSON.stringify(hashTree(ROOT+'/'+tree.relative))===JSON.stringify(tree.manifest),'Live public asset tree changed');
      check(JSON.stringify(hashTree(sourceTree+'/'+tree.relative))===JSON.stringify(tree.manifest),'Private public inputs changed');
    }
    if(sourceTree)for(const [rel,x]of stagedInputs)check(hashSnapshotInput(sourceTree+'/'+rel,x.bytes).sha256===x.sha256,'Staged input changed: '+rel);
    if(clientManifest)check(JSON.stringify(hashTree(sourceTree+'/client/dist'))===JSON.stringify(clientManifest),'Fresh client assets changed during packaging');
    for(const dependencies of dependencyRecords)verifyMaterializedInputs(dependencies,{hashInput:hashSnapshotInput});
    preserved=true;console.log('OBSERVED_SOURCE_AND_INPUT_PRESERVATION=PASS');if(directory)put('state.after.json',JSON.stringify(snapshot(),null,2));
  }catch(e){status='STOPPED';process.exitCode=2;console.log('PRESERVATION_ERROR='+JSON.stringify(e.message));}}
  if(interrupted||!preserved){status='STOPPED';process.exitCode=2;}
  if(directory){try{put('summary.json',JSON.stringify({command:ID,status,head:before?.head,sourcePreserved:preserved,
    typecheck:typecheckReport,contracts:contractResults,frontend:clientReport,results:packageResults,
    clientFreshBuild:clientFresh,deploymentBuildEnvironment:false,nativeCompatibility:'CURRENT_HOST_ONLY',
    fullAppTests:false,serverBoot:false,applicationApplied:false,databaseConnections:0,releaseQualified:false},null,2));}
    catch(e){status='STOPPED';process.exitCode=2;console.log('REPORT_WRITE_ERROR='+JSON.stringify(e.message));}}
  if(inventoryReport){console.log('TEST_REVIEW_SOURCE_BEGIN');console.log(inventoryReport.console);console.log('TEST_REVIEW_SOURCE_END');}
  console.log('STATUS='+status+'\nSOURCE_WRITES_BY_COMMAND=0\nDATABASE_CONNECTIONS=0\nREAL_EMAILS_SENT=0');
  console.log('CLIENT_BUILD_FRESHNESS='+(clientFresh?'QUALIFIED_FOR_ISOLATED_BUILD':'NOT_QUALIFIED'));
  console.log('DEPLOYMENT_BUILD_ENVIRONMENT=NOT_QUALIFIED\nNATIVE_COMPATIBILITY=CURRENT_HOST_ONLY\nFULL_SERVER_BOOT=NOT_RUN\nFULL_APP_TESTS=NOT_RUN:FOUR_REVIEWED_SOURCE_CHECKERS_ONLY');
  console.log('APPLICATION_SOURCE_APPLY=NOT_RUN\nWORKER_ACTIVATION=NOT_RUN\nLIVE_MIGRATIONS=NOT_RUN\nCOMMIT_PUSH_DEPLOY=NOT_RUN\nRELEASE_QUALIFIED=false');
  if(directory)console.log('EVIDENCE_DIRECTORY='+directory+'\nNEXT_TEST_REVIEW_FILE='+directory+'/test-source-review.txt');
  if(detached)console.log('DETACHED_ARTIFACT_DIRECTORY='+detached);
  console.log('NEXT_ACTION=RETURN_FULL_OUTPUT\nREPORT_END='+ID);
}

MMHB44_NODE
)
