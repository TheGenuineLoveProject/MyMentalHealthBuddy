(
set -eu
umask 077
cd /home/runner/workspace
node --input-type=commonjs <<'MMHB_IDENTITY'
const fs=require('node:fs');
if(JSON.parse(fs.readFileSync('package.json','utf8')).name!=='mymentalhealthbuddy'||
  (process.env.REPL_ID&&process.env.REPL_ID!=='9d71c4b8-8fcd-4b22-aee2-5883d9cbe5a4')) {
  throw new Error('STOP: project identity mismatch.');
}
MMHB_IDENTITY
MMHB16_STAGE=$(mktemp -d /home/runner/mmhb-pg-text.XXXXXX)
cat > "$MMHB16_STAGE/MMHB-Postgres-Qualification.cjs" <<'MMHB_SOURCE'
'use strict';
const fs=require('node:fs'), path=require('node:path'), crypto=require('node:crypto');
const {spawnSync}=require('node:child_process');
const ROOT='/home/runner/workspace';
const PREVIOUS='/home/runner/mmhb-runtime-review.Lxd8ou';
const SNAPSHOT='/home/runner/mmhb-release-check.NNI5YP';
const HEAD='b3ce0daf53f52cab918dd0c40954f038ac68da9b';
const BEFORE='890008336b729c6a55cdf74c82d97373eb3f0326dc5db60fb1c57e9f77a3e461';
const AFTER='5f09d685e57e53a79e959e650b8e2b6a60abda89e1b089e07ad6a16672095ba7';
const PG_BIN='/nix/store/bgwr5i8jf8jpg75rr53rz3fqv5k8yrwp-postgresql-16.10/bin';
const cleanEnv={PATH:process.env.PATH||'/usr/bin:/bin',LANG:'C.UTF-8',CI:'true',
  GIT_OPTIONAL_LOCKS:'0',GIT_TERMINAL_PROMPT:'0'};
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const blob=b=>crypto.createHash('sha1').update(`blob ${b.length}\0`).update(b).digest('hex');
const check=(ok,message)=>{if(!ok)throw new Error(message);};
let directory,before,data,pgctl,started=false,gate='IDENTITY',finalStatus='STOPPED';
let baseline=null,candidate=null,stopped='NOT_STARTED',interrupted=false;
process.on('SIGINT',()=>{interrupted=true;process.exitCode=2;});
process.on('SIGTERM',()=>{interrupted=true;process.exitCode=2;});
function git(...args){
  const r=spawnSync('git',['--no-pager','--no-optional-locks','-c','core.fsmonitor=false',
    '-c','core.quotePath=true',...args],{cwd:ROOT,env:cleanEnv,encoding:'utf8',timeout:60000,maxBuffer:32*1024*1024});
  check(!r.error&&r.status===0,'Git inspection failed: '+args[0]);return r.stdout;
}
function state(){return JSON.stringify({head:git('rev-parse','HEAD').trim(),
  branch:git('branch','--show-current').trim(),
  index:hash(fs.readFileSync(path.resolve(ROOT,git('rev-parse','--git-path','index').trim()))),
  status:git('status','--porcelain=v1','--untracked-files=no','--ignore-submodules=none'),
  diff:hash(git('diff','--binary','--no-ext-diff','--no-textconv','HEAD')),
  untracked:hash(git('ls-files','--others','--exclude-standard','-z'))});}
function put(name,bytes){
  const file=path.join(directory,name);fs.writeFileSync(file,bytes,{flag:'wx',mode:0o600});return file;
}
function run(label,command,args,timeout=45000){
  console.log(label+'=RUNNING');
  const r=spawnSync(command,args,{cwd:directory,env:cleanEnv,encoding:'utf8',
    timeout,killSignal:'SIGKILL',maxBuffer:4*1024*1024});
  put(label+'.log',(r.stdout||'')+(r.stderr||''));
  return r;
}
function diagnostics(r){
  console.log(((r.stdout||'')+(r.stderr||'')).split('\n').slice(-35).join('\n'));
  if(r.error)console.log('PROCESS_ERROR='+r.error.message);
}
function success(r,label){
  if(r.error||r.status!==0)diagnostics(r);
  check(!r.error&&r.status===0,label+' failed; see '+label+'.log');
}
try{
  console.log('COMMAND_ID=MMHB-POSTGRES-QUALIFICATION-20260924-16');
  console.log('ISSUE_ID=MMHB-WEBHOOK-DURABILITY-001');
  check(fs.realpathSync(ROOT)===fs.realpathSync(git('rev-parse','--show-toplevel').trim()),'Wrong repository root.');
  check(JSON.parse(fs.readFileSync(path.join(ROOT,'package.json'),'utf8')).name==='mymentalhealthbuddy','Wrong project.');
  check(!process.env.REPL_ID||process.env.REPL_ID==='9d71c4b8-8fcd-4b22-aee2-5883d9cbe5a4','Wrong Replit project.');
  before=state();const current=JSON.parse(before);
  check(current.head===HEAD&&current.branch==='integration','HEAD or branch changed.');
  check(current.status===' M server/routes/webhook.mjs\n','Unexpected tracked changes; preserve all work.');
  const previous=JSON.parse(fs.readFileSync(path.join(PREVIOUS,'state.after.json'),'utf8'));
  for(const key of ['head','branch','index','status','diff'])check(current[key]===previous[key],'Checkout changed: '+key);
  gate='SOURCE_AND_DEPENDENCIES';
  check(process.getuid()!==0,'Run as the regular Replit user, not root.');
  check(process.version==='v24.13.0','Node version changed since the reported qualification.');
  const pins={'server/routes/webhook.mjs':AFTER,
    'shared/schema.mjs':'9e16820e0c611159675b7d541883d67e82e0c7c1',
    'server/utils/planMapping.mjs':'11e6d6acb8ed3e35c728d4da7c406ed070c19b32'};
  const manifest=new Map(JSON.parse(fs.readFileSync(path.join(SNAPSHOT,'source-manifest.json'),'utf8')).map(x=>[x.path,x]));
  const bytes={};
  for(const [rel,pin] of Object.entries(pins)){
    const live=path.join(ROOT,rel),saved=path.join(SNAPSHOT,'source',rel);
    check(fs.lstatSync(live).isFile()&&fs.lstatSync(saved).isFile(),'Expected regular source: '+rel);
    bytes[rel]=fs.readFileSync(saved);
    check(hash(bytes[rel])===manifest.get(rel)?.sha256&&hash(fs.readFileSync(live))===hash(bytes[rel]),'Snapshot differs: '+rel);
    check((pin.length===64?hash(bytes[rel]):blob(bytes[rel]))===pin,'Reviewed source differs: '+rel);
  }
  const old=Buffer.from(git('show',HEAD+':server/routes/webhook.mjs'));
  check(hash(old)===BEFORE,'Baseline webhook differs.');
  const versions={node:process.version};
  for(const [name,expected] of Object.entries({pg:'8.23.0','drizzle-orm':'0.45.2',express:'4.22.2',stripe:'22.6.0'})){
    versions[name]=JSON.parse(fs.readFileSync(path.join(ROOT,'node_modules',name,'package.json'),'utf8')).version;
    check(versions[name]===expected,'Installed dependency changed: '+name);
  }
  console.log('DEPENDENCIES='+JSON.stringify(versions));
  const initdb=path.join(PG_BIN,'initdb');pgctl=path.join(PG_BIN,'pg_ctl');
  for(const file of [initdb,pgctl,path.join(PG_BIN,'postgres')])fs.accessSync(file,fs.constants.X_OK);
  const space=fs.statfsSync('/home/runner');
  check(space.bavail*space.bsize>=512*1024*1024,'Less than 512 MiB available for the disposable cluster.');
  directory=fs.mkdtempSync('/home/runner/mmhb-postgres-qualify.');
  console.log('EVIDENCE_DIRECTORY='+directory);
  put('state.before.json',before+'\n');
  const route=put('webhook.candidate.mjs',bytes['server/routes/webhook.mjs']);
  const original=put('webhook.baseline.mjs',old);
  const schema=put('schema.mjs',bytes['shared/schema.mjs']);
  const mapping=put('planMapping.mjs',bytes['server/utils/planMapping.mjs']);
  const harness=path.join(__dirname,'webhook-postgres.mjs');
  check(fs.lstatSync(harness).isFile(),'Missing qualification harness.');
  put('qualification-inputs.json',JSON.stringify({head:HEAD,versions,
    candidate:hash(bytes['server/routes/webhook.mjs']),baseline:hash(old),
    harness:hash(fs.readFileSync(harness)),schema:hash(bytes['shared/schema.mjs']),
    mapping:hash(bytes['server/utils/planMapping.mjs'])},null,2)+'\n');
  data=path.join(directory,'data');const socket=path.join(directory,'socket');
  fs.mkdirSync(socket,{mode:0o700});
  const password=crypto.randomBytes(32).toString('hex');
  const passwordFile=put('fixture-password',password+'\n');
  gate='DISPOSABLE_POSTGRES_INITIALIZATION';
  success(run('INITDB',initdb,['-D',data,'-U','mmhb_owner','--auth-local=scram-sha-256',
    '--auth-host=reject','--pwfile='+passwordFile,'--encoding=UTF8','--locale=C','--no-instructions']), 'INITDB');
  fs.appendFileSync(path.join(data,'postgresql.conf'),`\nlisten_addresses = ''\nunix_socket_directories = '${socket}'\nunix_socket_permissions = 0700\nport = 6543\nmax_connections = 16\nshared_buffers = '16MB'\ntimezone = 'UTC'\nlog_statement = 'none'\n`);
  gate='DISPOSABLE_POSTGRES_START';
  success(run('PG_START',pgctl,['-D',data,'-l',path.join(directory,'postgres.log'),'-w','-t','20','start'],30000),'PG_START');
  started=true;stopped='PENDING';
  console.log('DATABASE_SCOPE=NEW_PRIVATE_UNIX_SOCKET_CLUSTER_WITH_SYNTHETIC_DATA');
  const execute=mode=>{
    const result=path.join(directory,mode+'.result.json');
    const config=put(mode+'.config.json',JSON.stringify({mode,root:ROOT,directory,data,socket,password,
      schema,mapping,route:mode==='baseline'?original:route,result})+'\n');
    const r=run(mode.toUpperCase()+'_POSTGRES_HTTP',process.execPath,
      ['--experimental-vm-modules',harness,config],60000);
    if(r.error||![0,1].includes(r.status)||!fs.existsSync(result))diagnostics(r);
    check(!r.error&&[0,1].includes(r.status),'Test process did not finish normally: '+mode);
    const report=JSON.parse(fs.readFileSync(result,'utf8'));
    check(report.mode===mode&&Array.isArray(report.checks)&&Array.isArray(report.observations),
      'Malformed test result.');
    check(report.tests===report.checks.length&&report.pass===report.checks.filter(x=>x.pass).length&&
      report.fail===report.checks.filter(x=>!x.pass).length&&
      JSON.stringify(report.failed)===JSON.stringify(report.checks.filter(x=>!x.pass).map(x=>x.name))&&
      ((r.status===0)===(report.fail===0)),'Test exit code/result mismatch.');
    console.log(mode.toUpperCase()+'_POSTGRES_HTTP='+JSON.stringify({tests:report.tests,
      pass:report.pass,fail:report.fail,failed:report.failed,releaseBlockingFindings:report.releaseBlockingFindings}));
    console.log(mode.toUpperCase()+'_OBSERVATIONS='+JSON.stringify(report.observations));
    if(report.fail)console.log(mode.toUpperCase()+'_FAILURES='+JSON.stringify(report.checks.filter(x=>!x.pass)));
    return report;
  };
  gate='BASELINE_REPRODUCTION';baseline=execute('baseline');
  const expected=['durability_read_failure','durability_write_failure','marker_unique_conflict'];
  check(baseline.tests===7&&baseline.pass===4&&JSON.stringify([...baseline.failed].sort())===JSON.stringify(expected.sort()),'Baseline did not reproduce exactly the three expected defects.');
  gate='CANDIDATE_POSTGRES_HTTP';candidate=execute('candidate');
  check(candidate.tests===7&&candidate.pass===7&&candidate.fail===0,'Candidate PostgreSQL qualification failed.');
  finalStatus=candidate.releaseBlockingFindings.length
    ?'TARGETED_DB_GATES_PASSED_RELEASE_BLOCKERS_REPRODUCED':'TARGETED_DB_GATES_PASSED_RELEASE_PENDING';
}catch(error){
  console.log('FAILED_GATE='+gate+'\nEVIDENCE='+error.message);
  process.exitCode=2;
}finally{
  if(data&&pgctl&&(started||fs.existsSync(path.join(data,'postmaster.pid')))){
    try{
      const r=run('PG_STOP',pgctl,['-D',data,'-m','fast','-w','-t','20','stop'],30000);
      success(r,'PG_STOP');
      const s=run('PG_STATUS_AFTER_STOP',pgctl,['-D',data,'status'],10000);
      check(!s.error&&s.status===3,'Disposable database shutdown was not confirmed.');
      stopped='PASS';
    }catch(error){stopped='FAILED';finalStatus='STOPPED';process.exitCode=2;
      console.log('CLEANUP_ERROR='+error.message+'\nCLEANUP_DATA_DIRECTORY='+data);}
  }
  if(before){
    try{const after=state();check(after===before,'Checkout changed during qualification.');
      if(directory)put('state.after.json',after+'\n');console.log('SOURCE_PRESERVATION=PASS');
    }catch(error){finalStatus='STOPPED';process.exitCode=2;console.log('SOURCE_PRESERVATION=CHANGED_OR_UNKNOWN\nEVIDENCE='+error.message);}
  }
  if(interrupted){finalStatus='STOPPED';process.exitCode=2;}
  const summary={command:'MMHB-POSTGRES-QUALIFICATION-20260924-16',status:finalStatus,
    baseline:baseline&&{tests:baseline.tests,pass:baseline.pass,failed:baseline.failed},
    candidate:candidate&&{tests:candidate.tests,pass:candidate.pass,failed:candidate.failed},
    releaseBlockingFindings:candidate?.releaseBlockingFindings||[],disposableDatabaseStopped:stopped,
    sourceWrites:0,liveDatabaseConnections:0,fullAppTests:'NOT_RUN',releaseQualified:false};
  if(directory)put('summary.json',JSON.stringify(summary,null,2)+'\n');
  console.log('DISPOSABLE_DATABASE_STOPPED='+stopped+'\nSTATUS='+finalStatus);
  console.log('SOURCE_WRITES_BY_COMMAND=0\nLIVE_DATABASE_CONNECTIONS=0\nLIVE_DATABASE_MIGRATIONS=0');
  console.log('FULL_APP_TESTS=NOT_RUN\nPRODUCTION_SCHEMA_COMPATIBILITY=NOT_VERIFIED');
  console.log('COMMIT=NOT_RUN\nPUSH=NOT_RUN\nDEPLOY=NOT_RUN\nRELEASE_QUALIFIED=false');
  console.log('NEXT_REQUIRED_ACTION=RETURN_FULL_OUTPUT');
  if(directory)console.log('EVIDENCE_DIRECTORY='+directory);
}
MMHB_SOURCE
node --check "$MMHB16_STAGE/MMHB-Postgres-Qualification.cjs"
node --input-type=commonjs - "$MMHB16_STAGE" <<'MMHB_INSTALL'
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const expected='38fb60319e9b8ec1623c9e660ae902882e976c163a7b6b57b3c73129c6aa5571';
const incoming=path.join(process.argv[2],'MMHB-Postgres-Qualification.cjs');
if(hash(fs.readFileSync(incoming))!==expected)throw new Error('STOP: incomplete or changed pasted script.');
const directory='/home/runner/mmhb-step16-readable';
try{fs.mkdirSync(directory,{mode:0o700});}catch(e){if(e.code!=='EEXIST')throw e;}
const info=fs.lstatSync(directory);
if(!info.isDirectory()||info.uid!==process.getuid()||(info.mode&0o077)!==0)throw new Error('STOP: expected a private owned directory.');
const target=path.join(directory,'MMHB-Postgres-Qualification.cjs');
try{fs.copyFileSync(incoming,target,fs.constants.COPYFILE_EXCL);}catch(e){if(e.code!=='EEXIST')throw e;}
if(!fs.lstatSync(target).isFile()||hash(fs.readFileSync(target))!==expected)throw new Error('STOP: existing file differs; preserved.');
const harness=path.join(directory,'webhook-postgres.mjs');
if(!fs.lstatSync(harness).isFile()||hash(fs.readFileSync(harness))!=='2517fbed61f585b103412a6a296086b0a2c0864dd6810e1dcd586ab66fa9fcb7')throw new Error('STOP: complete Step 1 first.');
console.log('READABLE_SCRIPTS_VERIFIED=PASS');
const env={PATH:process.env.PATH||'/usr/bin:/bin',LANG:'C.UTF-8'};
if(process.env.REPL_ID)env.REPL_ID=process.env.REPL_ID;
const result=require('node:child_process').spawnSync(process.execPath,[target],{stdio:'inherit',env});
if(result.error)console.log('RUNNER_ERROR='+result.error.message);
process.exit(result.status??2);
MMHB_INSTALL
)
