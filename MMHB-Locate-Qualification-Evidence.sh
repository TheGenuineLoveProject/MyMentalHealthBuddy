(
set -eu
cd /home/runner/workspace
node --input-type=commonjs <<'MMHB31_NODE'
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {spawnSync}=require('node:child_process');
const ROOT='/home/runner/workspace',PARENT='/home/runner';
const EXPECTED='/home/runner/mmhb-worker-qualify.RLr1dH';
const PIN='daac9fb0f94fa026a5567d22c3de74041cc1e3f793f44ce4edb0fe3476c2a940';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const info=file=>{try{return fs.lstatSync(file);}catch(e){if(e.code==='ENOENT')return null;throw e;}};
const kind=s=>!s?'MISSING':s.isSymbolicLink()?'SYMLINK_NOT_FOLLOWED':s.isDirectory()?'DIRECTORY':s.isFile()?'FILE':'OTHER';
const label=v=>typeof v==='string'&&/^[A-Za-z0-9_-]{1,120}$/.test(v)?v:'UNEXPECTED_VALUE';
const count=v=>Number.isSafeInteger(v)&&v>=0&&v<=100000?v:null;
function git(...args){
  const r=spawnSync('git',['--no-pager','--no-optional-locks','-c','core.fsmonitor=false','-c','core.quotePath=true',...args],
    {cwd:ROOT,env:{PATH:process.env.PATH||'/usr/bin:/bin',LANG:'C.UTF-8',GIT_OPTIONAL_LOCKS:'0'},encoding:'utf8',timeout:30000,maxBuffer:1048576});
  if(r.error||r.status!==0)throw Error('Git inspection failed: '+args[0]);return r.stdout.trimEnd();
}
function inspect(directory){
  try{
    const s=info(directory);console.log('DIRECTORY='+JSON.stringify({path:directory,type:kind(s)}));
    if(!s?.isDirectory()||s.isSymbolicLink())return;
    for(const name of ['summary.json','result.json','state.before.json','state.after.json','billingNotificationWorker.mjs']){
      const file=path.join(directory,name),entry=info(file);
      const metadata={name,type:kind(entry),bytes:entry?.isFile()?entry.size:null};
      console.log('FILE='+JSON.stringify(metadata));
      if(!entry?.isFile()||entry.size>1048576)continue;
      if(name==='billingNotificationWorker.mjs'){
        const actual=hash(fs.readFileSync(file));console.log('WORKER='+JSON.stringify({sha256:actual,matchesQualifiedWorker:actual===PIN}));continue;
      }
      if(name!=='summary.json'&&name!=='result.json')continue;
      const content=fs.readFileSync(file,'utf8');
      let data;try{data=JSON.parse(content);}catch{console.log('JSON_STATE='+JSON.stringify({name,state:'INVALID_JSON'}));continue;}
      if(!data||typeof data!=='object'||Array.isArray(data)){console.log('JSON_STATE='+JSON.stringify({name,state:'UNEXPECTED_SHAPE'}));continue;}
      if(name==='summary.json')console.log('SUMMARY='+JSON.stringify({command:label(data.command),status:label(data.status),tests:count(data.tests),pass:count(data.pass),
        disposableDatabaseStopped:label(data.disposableDatabaseStopped),sourceWrites:count(data.sourceWrites),releaseQualified:data.releaseQualified===false?false:'UNVERIFIED'}));
      else console.log('RESULT='+JSON.stringify({tests:count(data.tests),pass:count(data.pass),
        checks:Array.isArray(data.checks)?data.checks.slice(0,16).map(x=>({name:label(x?.name),pass:x?.pass===true})):null,
        controls:Array.isArray(data.controls)?data.controls.slice(0,4).map(x=>({name:label(x?.name),pass:x?.pass===true})):null}));
    }
  }catch(error){console.log('INSPECTION_ERROR='+JSON.stringify({directory,code:label(error.code||'READ_ERROR')}));}
}
console.log('COMMAND_ID=MMHB-LOCATE-EVIDENCE-20260924-31');
try{
  const packageFile=path.join(ROOT,'package.json');if(!info(packageFile)?.isFile())throw Error('Missing regular package.json');
  if(JSON.parse(fs.readFileSync(packageFile,'utf8')).name!=='mymentalhealthbuddy'||
    (process.env.REPL_ID&&process.env.REPL_ID!=='9d71c4b8-8fcd-4b22-aee2-5883d9cbe5a4'))throw Error('Project identity mismatch');
  if(git('rev-parse','--show-toplevel')!==ROOT)throw Error('Repository root differs');
  console.log('HEAD='+JSON.stringify(git('rev-parse','HEAD')));
  console.log('BRANCH='+JSON.stringify(git('branch','--show-current')));
  console.log('TRACKED_STATUS='+JSON.stringify(git('status','--porcelain=v1','--untracked-files=no','--ignore-submodules=none')));
  console.log('EXPECTED_PATH_CHECK');inspect(EXPECTED);
  const matches=fs.readdirSync(PARENT,{withFileTypes:true}).filter(e=>/^mmhb-(?:worker|pipeline)-qualify\.[A-Za-z0-9]+$/.test(e.name));
  const candidates=matches.filter(e=>e.isDirectory()).map(e=>({directory:path.join(PARENT,e.name),mtime:fs.lstatSync(path.join(PARENT,e.name)).mtimeMs})).sort((a,b)=>b.mtime-a.mtime);
  console.log('SEARCH='+JSON.stringify({parent:PARENT,matchingEntries:matches.length,regularDirectories:candidates.length,limit:12,truncated:candidates.length>12}));
  for(const {directory}of candidates.slice(0,12))if(directory!==EXPECTED)inspect(directory);
  console.log('STATUS=EVIDENCE_LOCATION_REPORT_COMPLETE');
}catch(error){console.log('STATUS=STOPPED\nREASON='+error.message);process.exitCode=2;}
console.log('HISTORICAL_TEST_RESULTS=NOT_INVALIDATED_BY_MISSING_FILES');
console.log('SOURCE_WRITES_BY_COMMAND=0\nTESTS_STARTED=0\nDATABASE_CONNECTIONS=0\nRELEASE_QUALIFIED=false');
console.log('NEXT_ACTION=RETURN_FULL_OUTPUT\nREPORT_END=MMHB-LOCATE-EVIDENCE-20260924-31');

MMHB31_NODE
)
