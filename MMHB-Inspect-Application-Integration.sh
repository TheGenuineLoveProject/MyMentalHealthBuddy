(
set -eu
umask 077
cd /home/runner/workspace
node --input-type=commonjs <<'MMHB30_NODE'
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {spawnSync}=require('node:child_process');
const ROOT='/home/runner/workspace',PREVIOUS='/home/runner/mmhb-worker-qualify.RLr1dH';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const check=(ok,message)=>{if(!ok)throw Error(message);};
const env={PATH:process.env.PATH||'/usr/bin:/bin',LANG:'C.UTF-8',GIT_OPTIONAL_LOCKS:'0',GIT_TERMINAL_PROMPT:'0'};
let directory,before,status='STOPPED',printed=0,characters=0;
const report=[],manifest=[],seen=new Set();
function git(...args){
  const r=spawnSync('git',['--no-pager','--no-optional-locks','-c','core.fsmonitor=false','-c','core.quotePath=true',...args],
    {cwd:ROOT,env,encoding:'utf8',timeout:30000,maxBuffer:33554432});
  check(!r.error&&r.status===0,'Git inspection failed: '+args[0]);return r.stdout;
}
function regular(file){check(fs.lstatSync(file).isFile(),'Expected regular file: '+file);return fs.readFileSync(file);}
function state(){return JSON.stringify({head:git('rev-parse','HEAD').trim(),branch:git('branch','--show-current').trim(),
  index:hash(regular(path.resolve(ROOT,git('rev-parse','--git-path','index').trim()))),
  status:git('status','--porcelain=v1','--untracked-files=no','--ignore-submodules=none'),
  diff:hash(git('diff','--binary','--no-ext-diff','--no-textconv','HEAD')),
  untrackedNames:hash(git('ls-files','--others','--exclude-standard','-z')),
  package:hash(regular(path.join(ROOT,'package.json'))),lock:hash(regular(path.join(ROOT,'package-lock.json')))});}
function put(name,value){fs.writeFileSync(path.join(directory,name),value,{flag:'wx',mode:0o600});}
function redact(value){return value
  .replace(/-----BEGIN [^-]*PRIVATE KEY-----[\s\S]*?-----END [^-]*PRIVATE KEY-----/g,'[REDACTED_PRIVATE_KEY]')
  .replace(/\b(?:postgres(?:ql)?|mysql|mongodb(?:\+srv)?):\/\/[^\s'"`<>]+/gi,'[REDACTED_DATABASE_URL]')
  .replace(/(https?:\/\/)[^\s/@'"`]+:[^\s/@'"`]+@/gi,'$1[REDACTED_USERINFO]@')
  .replace(/([?&](?:api[_-]?key|(?:access|refresh|auth)[_-]?token|token|secret|password|signature|authorization|authentication)=)[^&\s'"`]+/gi,'$1[REDACTED]')
  .replace(/\b(?:sk|rk)_(?:live|test)_[A-Za-z0-9_-]+\b|\bre_[A-Za-z0-9_-]{12,}\b|\bgh[pousr]_[A-Za-z0-9_]+\b/g,'[REDACTED_API_KEY]')
  .replace(/\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g,'[REDACTED_JWT]')
  .replace(/(Bearer\s+)[A-Za-z0-9._~-]{12,}/gi,'$1[REDACTED]')
  .replace(/([\w$]*(?:password|secret|token|api_?key|private_?key)[\w$]*["']?\s*[:=]\s*)(["'`])((?:\\[\s\S]|(?!\2)[\s\S])*)\2/gi,'$1$2[REDACTED]$2')
  .replace(/\b([A-Z0-9_]*(?:KEY|TOKEN|SECRET|PASSWORD)[A-Z0-9_]*=)([^\s"'`;$]+)/g,'$1[REDACTED]');}
function emit(line){const shown=line.length>8192?line.slice(0,8192)+' [OUTPUT_LINE_TRUNCATED]':line;report.push(shown);console.log(shown);}
function readSource(rel){
  check(!path.isAbsolute(rel)&&!rel.split('/').includes('..'),'Invalid source path');
  const file=path.join(ROOT,rel);let stat;
  try{stat=fs.lstatSync(file);}catch(error){if(error.code==='ENOENT'){emit('MISSING='+JSON.stringify(rel));return null;}throw error;}
  check(stat.isFile()&&stat.size<=4194304,'Unexpected source file: '+rel);
  check(fs.realpathSync(file).startsWith(ROOT+path.sep),'Source path escapes repository');
  return regular(file);
}
function inspect(rel,mode='full',known=null){
  if(seen.has(rel))return;seen.add(rel);
  const b=readSource(rel);if(!b)return;
  const source=b.toString('utf8'),safe=redact(source),lines=safe.split('\n'),selected=new Set();
  const add=(a,z)=>{for(let i=Math.max(0,a);i<Math.min(lines.length,z);i++)selected.add(i);};
  if(known&&hash(b)===known){
    const item={path:rel,sha256:hash(b),lines:source.split('\n').length,knownCaptureMatches:true};
    manifest.push(item);emit('FILE='+JSON.stringify(item));return;
  }
  if(mode==='app'){
    add(0,80);
    const shutdown=lines.findIndex(line=>/function shutdown\s*\(/.test(line));
    if(shutdown>=0)add(shutdown-8,lines.length);else add(lines.length-180,lines.length);
    lines.forEach((line,i)=>{if(/app\.use\(["']\/api\/webhooks|(?:start|stop)\w*(?:Worker|Scheduler)|cron\.schedule/.test(line))add(i-3,i+8);});
  }else if(mode==='canonical'){
    lines.forEach((line,i)=>{if(/webhook_events|billing_notification_(?:intents|deliveries)/i.test(line))add(i-2,i+22);});
  }else if(mode==='replit'){
    let allowed=true;
    lines.forEach((line,i)=>{
      const section=line.trim();if(section.startsWith('['))allowed=/^\[deployment\]$|^\[\[?workflows(?:\.|\])/.test(section)&&!/\.env\b/i.test(section);
      if(allowed&&!/^\s*#/.test(line))selected.add(i);
    });
  }else add(0,Math.min(lines.length,300));
  const ordered=[...selected].sort((a,b)=>a-b),budget=Math.max(0,900-printed),shown=[];let wide=false;
  for(const i of ordered.slice(0,budget)){
    const text=lines[i].length>1000?lines[i].slice(0,1000)+' [SOURCE_LINE_TRUNCATED]':lines[i];
    if(characters+text.length>60000)break;
    if(text!==lines[i])wide=true;shown.push([i,text]);characters+=text.length;
  }
  const item={path:rel,sha256:hash(b),lines:source.split('\n').length,shown:shown.length,
    excerpts:mode!=='full',truncated:wide||shown.length<ordered.length||(mode==='full'&&lines.length>300),redacted:safe!==source};
  manifest.push(item);emit('FILE='+JSON.stringify(item));
  for(const [i,text]of shown)emit((i+1)+'|'+text);printed+=shown.length;emit('END_FILE='+JSON.stringify(rel));
}
try{
  emit('COMMAND_ID=MMHB-INTEGRATION-SOURCE-20260924-30');
  const pkg=JSON.parse(regular(path.join(ROOT,'package.json')));
  check(pkg.name==='mymentalhealthbuddy','Wrong project');
  check(!process.env.REPL_ID||process.env.REPL_ID==='9d71c4b8-8fcd-4b22-aee2-5883d9cbe5a4','Wrong Replit identity');
  check(git('rev-parse','--show-toplevel').trim()===ROOT,'Wrong repository root');
  before=state();const current=JSON.parse(before);
  check(current.head==='b3ce0daf53f52cab918dd0c40954f038ac68da9b'&&current.branch==='integration','Branch or HEAD changed');
  check(current.status===' M server/routes/webhook.mjs\n M server/services/email.mjs\n','Unexpected tracked changes');
  const prior=JSON.parse(regular(path.join(PREVIOUS,'summary.json')));
  check(prior.command==='MMHB-WORKER-QUALIFICATION-20260924-29'&&prior.status==='BILLING_WORKER_AND_SCHEDULER_QUALIFIED_IN_ISOLATION'&&
    prior.tests===6&&prior.pass===6&&prior.disposableDatabaseStopped==='PASS','Prior worker qualification differs');
  check(hash(regular(path.join(PREVIOUS,'billingNotificationWorker.mjs')))==='daac9fb0f94fa026a5567d22c3de74041cc1e3f793f44ce4edb0fe3476c2a940','Qualified worker changed');
  const previous=JSON.parse(regular(path.join(PREVIOUS,'state.after.json')));
  for(const key of ['head','branch','index','status','diff','package','lock'])check(current[key]===previous[key],'Reviewed checkout changed: '+key);
  directory=fs.mkdtempSync('/home/runner/mmhb-integration-source.');put('state.before.json',before);
  emit('EVIDENCE_DIRECTORY='+directory);emit('HEAD='+current.head);emit('BRANCH='+current.branch);
  emit('SOURCE_REDACTION=BEST_EFFORT_LITERAL_CREDENTIALS;ENV_FILES_NOT_READ');
  const scripts=pkg.scripts||{},names=new Set(Object.keys(scripts).filter(name=>/^(?:pre|post)?(?:start|dev|build)$|migrat|schema|^db:/i.test(name)));
  for(let round=0;round<5;round++)for(const name of [...names])for(const match of String(scripts[name]).matchAll(/npm run\s+([\w:-]+)/g))if(Object.hasOwn(scripts,match[1]))names.add(match[1]);
  const runners=new Set();
  for(const name of [...names].sort()){
    const command=String(scripts[name]);emit('PACKAGE_SCRIPT='+JSON.stringify({name,command:redact(command)}));
    if(/migrat|schema|^db:/i.test(name))for(const m of command.matchAll(/\b(?:node|tsx|ts-node|bash|sh)\s+((?:scripts|server)\/[\w./-]+\.(?:mjs|cjs|js|ts|sh))\b/g))runners.add(m[1]);
  }
  emit('PACKAGE_ENGINES='+redact(JSON.stringify(pkg.engines||{})));
  inspect('server/app.mjs','app');
  inspect('server/db/client.mjs','full','e874685907cae058bb9ad5d241271950dca9bf155b6d0e7fe8ef2e7d40bd441f');
  inspect('server/db/connection.mjs');
  inspect('server/db/sslConfig.mjs','full','121b4e62cc3d6d85e3841b98a5d466ebe90c0517b3be30802b732532914e7950');
  inspect('.replit','replit');
  const tracked=git('ls-files','-z').split('\0').filter(Boolean);
  for(const rel of tracked.filter(rel=>/^drizzle\.config\.(?:ts|js|mjs|cjs)$/.test(rel)))inspect(rel);
  inspect('server/db/ensureSchema.mjs','full','23343e14ace7796e1da29fb335a448f044982c3346b26a1b026bd7b711cfb7e0');
  inspect('server/db/schema.canonical.sql','canonical');
  const inventory=tracked.filter(rel=>/^(?:server\/db\/|scripts\/|migrations\/|drizzle\/)/.test(rel)&&/migrat|schema|postgres|bootstrap/i.test(rel)&&/\.(?:mjs|cjs|js|ts|sh|sql|json)$/.test(rel));
  emit('MIGRATION_INVENTORY='+JSON.stringify({total:inventory.length,paths:inventory.slice(0,100),truncated:inventory.length>100}));
  inspect('scripts/generate-canonical-schema.mjs');
  for(const rel of [...runners].sort().slice(0,8))inspect(rel);
  emit('DECLARED_MIGRATION_RUNNERS='+JSON.stringify({paths:[...runners].sort(),limit:8}));
  status='INTEGRATION_SOURCE_CAPTURED_REVIEW_REQUIRED';
}catch(error){emit('REASON='+redact(error.message));process.exitCode=2;}
finally{
  if(before){try{
    const after=state();check(after===before,'Checkout changed during inspection');
    for(const item of manifest)check(hash(regular(path.join(ROOT,item.path)))===item.sha256,'Inspected source changed: '+item.path);
    if(directory)put('state.after.json',after);emit('SOURCE_PRESERVATION=PASS');
  }catch(error){status='STOPPED';process.exitCode=2;emit('PRESERVATION_ERROR='+redact(error.message));}}
  emit('STATUS='+status);emit('SOURCE_WRITES_BY_COMMAND=0\nAPPLICATION_MODULES_EXECUTED=0\nDATABASE_CONNECTIONS=0\nMIGRATIONS_RUN=0');
  emit('WORKER_ACTIVATION=NOT_RUN\nAPP_TESTS=NOT_RUN:SOURCE_INSPECTION_ONLY\nCOMMIT=NOT_RUN\nPUSH=NOT_RUN\nDEPLOY=NOT_RUN\nRELEASE_QUALIFIED=false');
  if(directory){put('manifest.json',JSON.stringify(manifest,null,2));put('review.txt',report.join('\n')+'\n');emit('EVIDENCE_DIRECTORY='+directory);}
  emit('NEXT_ACTION=RETURN_FULL_OUTPUT\nREPORT_END=MMHB-INTEGRATION-SOURCE-20260924-30');
}

MMHB30_NODE
)
