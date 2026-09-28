#!/usr/bin/env bash
(
set -eu
cd /home/runner/workspace
node --input-type=commonjs <<'MMHB_STATUS'
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root='/home/runner/workspace',parent=root+'/.git/mmhb-review-evidence';
const script='MMHB-Qualify-Billing-Application-G40.sh';
const out=(key,value)=>console.log(key+'='+JSON.stringify(value));
const count=v=>Number.isSafeInteger(v)&&v>=0&&v<=100000?v:null;
const stat=p=>{try{return fs.lstatSync(p);}catch{return null;}};
function read(p){
  const s=stat(p);
  if(!s?.isFile()||s.size>1048576||fs.realpathSync(p)!==p)return null;
  try{return JSON.parse(fs.readFileSync(p,'utf8'));}catch{return null;}
}
try{
  if(read(root+'/package.json')?.name!=='mymentalhealthbuddy'||
    (process.env.REPL_ID&&process.env.REPL_ID!=='9d71c4b8-8fcd-4b22-aee2-5883d9cbe5a4'))throw Error('Project identity mismatch');
  console.log('COMMAND_ID=MMHB-G40-STATUS-RECOVERY-41');
  const p=root+'/'+script,s=stat(p);
  out('SCRIPT',{present:!!s,regular:!!s?.isFile(),matchesG40:s?.isFile()&&s.size<1048576&&fs.realpathSync(p)===p?
    crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')==='513ab6bb6f999701a287e6d31fae9fa3f69c2f26e637c406e76f61daaabe5400':false});
  const dirs=stat(parent)?.isDirectory()&&fs.realpathSync(parent)===parent?fs.readdirSync(parent)
    .filter(n=>/^billing-application-[A-Za-z0-9]+$/.test(n))
    .map(n=>path.join(parent,n)).filter(p=>stat(p)?.isDirectory()&&fs.realpathSync(p)===p)
    .sort((a,b)=>stat(b).mtimeMs-stat(a).mtimeMs):[];
  out('EVIDENCE_DIRECTORIES_FOUND',dirs.length);
  for(const d of dirs.slice(0,3)){
    out('DIRECTORY',d);
    const summary=read(d+'/summary.json');
    const keys=['command','status','head','sourcePreserved','tests','pass','disposableDatabaseStopped','releaseQualified'];
    const safe=summary&&Object.fromEntries(keys.filter(k=>['string','number','boolean'].includes(typeof summary[k]))
      .map(k=>[k,typeof summary[k]==='string'?summary[k].slice(0,180):summary[k]]));
    out('SAVED_SUMMARY',safe||'MISSING_OR_UNREADABLE');
    const r=read(d+'/result.json'),b=read(d+'/build-result.json');
    out('SAVED_TEST_COUNTS',r?{tests:count(r.tests),pass:count(r.pass)}:'MISSING_OR_UNREADABLE');
    out('SAVED_BUILD_COUNTS',Array.isArray(b?.results)?b.results.slice(0,2).map(x=>({mode:['baseline','candidate'].includes(x.mode)?x.mode:'UNKNOWN',pass:x.pass===true,inputCount:count(x.inputCount)})):'MISSING_OR_UNREADABLE');
    out('PID_FILE_PRESENT',!!stat(d+'/data/postmaster.pid'));
  }
  const matches=[];let unreadable=0;
  for(const pid of fs.readdirSync('/proc').filter(n=>/^\d+$/.test(n))){
    if(Number(pid)===process.pid)continue;
    try{
      const args=fs.readFileSync('/proc/'+pid+'/cmdline','utf8').split('\0').filter(Boolean);
      const exe=path.basename(args[0]||'');let role;
      if(exe==='bash'&&args.some(x=>path.basename(x)===script)&&fs.readlinkSync('/proc/'+pid+'/cwd')===root)role='G40_LAUNCHER';
      if(exe==='node'&&args.includes('--input-type=commonjs')&&fs.readlinkSync('/proc/'+pid+'/cwd')===root)role='POSSIBLE_STDIN_RUNNER';
      if(dirs.some(d=>args.includes(d+'/build.cjs')||args.includes(d+'/qualify.cjs'))&&exe==='node')role='QUALIFICATION_CHILD';
      if(['postgres','pg_ctl','initdb'].includes(exe)&&dirs.some(d=>args.includes(d+'/data')))role='DISPOSABLE_DATABASE_PROCESS';
      if(role)matches.push({pid:Number(pid),role});
    }catch{unreadable++;}
  }
  out('OBSERVED_PROCESSES',matches);out('PROCESS_ENTRIES_UNREADABLE_OR_EXITED',unreadable);
  console.log('NOTE=Missing results or process matches do not prove the command never ran. PID file alone does not prove a running database.');
  console.log('SOURCE_WRITES=0\nTESTS_STARTED=0\nDATABASE_CONNECTIONS=0\nREPORT_END=MMHB-G40-STATUS-RECOVERY-41');
}catch(e){out('READ_ERROR',e.code||e.message);process.exitCode=2;}
MMHB_STATUS
)
