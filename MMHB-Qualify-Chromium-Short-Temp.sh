#!/usr/bin/env bash
set -euo pipefail
umask 077
cd /home/runner/workspace
node --input-type=commonjs <<'MMHB79_NODE'
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {spawnSync}=require('node:child_process');
const ROOT='/home/runner/workspace';
const DEPS=ROOT+'/.git/mmhb-review-evidence/locked-resend-aSRNsE/dependency-project';
const EXE='/repl/ctls/zf0fjblfrh2xqfrdnv4xrkzsjm0ffhzf-chromium/bin/chromium';
const env={PATH:process.env.PATH||'/usr/bin:/bin',LANG:'C.UTF-8',GIT_OPTIONAL_LOCKS:'0',GIT_NO_LAZY_FETCH:'1'};
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const check=(ok,msg)=>{if(!ok)throw Error(msg);};
function git(...args){const r=spawnSync('git',['--no-pager','--no-optional-locks','-c','core.fsmonitor=false',...args],{cwd:ROOT,env,encoding:'utf8',timeout:15000,maxBuffer:33554432});check(!r.error&&r.status===0,'Git inspection failed');return r.stdout;}
function snapshot(){return JSON.stringify({head:git('rev-parse','HEAD'),branch:git('branch','--show-current'),status:git('status','--porcelain=v1','--untracked-files=normal'),diff:hash(git('diff','--binary','--no-ext-diff','--no-textconv','HEAD')),package:hash(fs.readFileSync('package.json')),lock:hash(fs.readFileSync('package-lock.json'))});}
let directory,before,shortTemp,probePassed=false;
console.log('COMMAND_ID=MMHB-CHROMIUM-SHORT-TEMP-QUALIFICATION-79');
try{
  check(JSON.parse(fs.readFileSync('package.json','utf8')).name==='mymentalhealthbuddy','Project identity mismatch');
  before=snapshot();
  check(git('rev-parse','HEAD').trim()==='0e6c2b2b8d0d484aca1ae3de18a49ed75c9dc681'&&git('branch','--show-current').trim()==='integration','Branch or HEAD changed');
  const prior=ROOT+'/.git/mmhb-review-evidence/browser-launch-UHgI5Z/launch-error.txt';
  check(fs.lstatSync(prior).isFile()&&fs.statSync(prior).size<1048576,'Expected bounded G78 diagnostic');
  const diagnostic=fs.readFileSync(prior,'utf8');
  check(diagnostic.includes('Socket path too long:')&&diagnostic.includes('/browser-home/org.chromium.Chromium.'),'G78 socket-path evidence differs');
  console.log('BASELINE=G78_SOCKET_PATH_TOO_LONG_RECORDED');
  const lock=JSON.parse(fs.readFileSync('package-lock.json','utf8'));
  for(const name of ['playwright','playwright-core']){
    const p=JSON.parse(fs.readFileSync(path.join(DEPS,'node_modules',name,'package.json'),'utf8'));
    check(p.name===name&&p.version==='1.62.1'&&p.version===lock.packages?.['node_modules/'+name]?.version,'Browser dependency mismatch: '+name);
    console.log('DEPENDENCY='+JSON.stringify({name,version:p.version}));
  }
  fs.accessSync(EXE,fs.constants.X_OK);
  const parent=ROOT+'/.git/mmhb-review-evidence';
  check(fs.lstatSync(parent).isDirectory()&&!fs.lstatSync(parent).isSymbolicLink(),'Evidence directory unavailable');
  directory=fs.mkdtempSync(parent+'/browser-launch-');
  const home=directory+'/browser-home';fs.mkdirSync(home,{mode:0o700});
  shortTemp=fs.mkdtempSync('/tmp/mmhb-chr-');
  fs.chmodSync(shortTemp,0o700);
  check(Buffer.byteLength(shortTemp+'/org.chromium.Chromium.XXXXXX/SingletonSocket')<100,'Temporary socket path budget exceeded');
  console.log('EVIDENCE_DIRECTORY='+directory);
  console.log('REPAIR_SCOPE=BROWSER_TMPDIR_ONLY;OTHER_LAUNCH_SETTINGS_PRESERVED');
  console.log('BROWSER_TMPDIR='+shortTemp);
  console.log('EXECUTABLE='+JSON.stringify({path:EXE,realpath:fs.realpathSync(EXE)}));
  const child=String.raw`
const fs=require('node:fs');
const {createRequire}=require('node:module');
const [deps,exe,home,dir,shortTemp]=process.argv.slice(2);
const {chromium}=createRequire(deps+'/package.json')('playwright');
const result={launch:false,blankPage:false,closed:false,applicationTested:false};
let browser;
(async()=>{
  try{
    browser=await chromium.launch({executablePath:exe,headless:true,timeout:30000,
      env:{PATH:process.env.PATH,HOME:home,TMPDIR:shortTemp,LANG:'C.UTF-8'},
      args:['--disable-background-networking','--disable-component-update','--disable-sync','--no-first-run']});
    result.launch=true;result.version=browser.version();
    const context=await browser.newContext({serviceWorkers:'block',offline:true});
    await context.route('**/*',route=>route.abort());
    const page=await context.newPage();
    result.blankPage=page.url()==='about:blank'&&await page.evaluate(()=>1+1)===2;
    await context.close();
  }catch(e){
    const diagnostic=String(e.stack||e).replace(/Bearer\s+\S+/gi,'Bearer [REDACTED]').replace(/(https?:\/\/)[^\s/@]+:[^\s/@]+@/gi,'$1[REDACTED]@');
    fs.writeFileSync(dir+'/launch-error.txt',diagnostic,{flag:'wx',mode:0o600});
    console.log('LAUNCH_DIAGNOSTICS_BEGIN\n'+diagnostic+'\nLAUNCH_DIAGNOSTICS_END');
    result.errorRecorded=true;
  }finally{
    if(browser){try{await browser.close();result.closed=true;}catch{result.closeFailed=true;}}
    fs.writeFileSync(dir+'/result.json',JSON.stringify(result,null,2),{flag:'wx',mode:0o600});
    console.log('BROWSER_RESULT='+JSON.stringify(result));
    if(!result.launch||!result.blankPage||!result.closed)process.exitCode=2;
  }
})().catch(()=>{process.exitCode=2;});
`;
  const file=directory+'/probe.cjs';fs.writeFileSync(file,child,{flag:'wx',mode:0o600});
  const run=spawnSync(process.execPath,[file,DEPS,EXE,home,directory,shortTemp],{cwd:directory,env,encoding:'utf8',timeout:75000,killSignal:'SIGKILL',maxBuffer:4194304});
  const output=(run.stdout||'')+(run.stderr||'');
  fs.writeFileSync(directory+'/probe.log',output,{flag:'wx',mode:0o600});
  console.log(output.length>30000?'DIAGNOSTIC_OUTPUT_TRUNCATED;FULL_OUTPUT_IN_PROBE_LOG\n'+output.slice(-30000):output);
  console.log('PROBE_EXIT='+JSON.stringify({code:run.status,signal:run.signal,error:run.error?.code||null}));
  if(run.status===0&&!run.error){
    const result=JSON.parse(fs.readFileSync(directory+'/result.json','utf8'));
    probePassed=result.launch===true&&result.blankPage===true&&result.closed===true;
  }
  console.log('STATUS='+(probePassed?'SHORT_TEMP_BROWSER_LAUNCH_QUALIFIED':'SHORT_TEMP_BROWSER_QUALIFICATION_FAILED'));
  if(!probePassed)process.exitCode=2;
  if(run.status!==0||run.error)process.exitCode=2;
}catch(e){console.log('REASON='+JSON.stringify(e.message));console.log('STATUS=STOPPED');process.exitCode=2;}
finally{
  if(shortTemp){
    if(probePassed){try{fs.rmSync(shortTemp,{recursive:true,force:true});console.log('PRIVATE_BROWSER_TEMP_CLEANUP=PASS');}catch{console.log('PRIVATE_BROWSER_TEMP_CLEANUP=FAILED');process.exitCode=2;}}
    else console.log('PRIVATE_BROWSER_TEMP_RETAINED='+shortTemp);
  }
  if(before){try{check(snapshot()===before,'Observed checkout changed');console.log('OBSERVED_CHECKOUT_PRESERVATION=PASS');}catch(e){console.log('PRESERVATION_ERROR='+JSON.stringify(e.message));process.exitCode=2;}}
  console.log('G77_BROWSER_HARNESS_REPAIR=PENDING\nAPPLICATION_BROWSER_TESTS=NOT_RUN:BLANK_BROWSER_ONLY\nPACKAGES_INSTALLED=0\nCOMMIT_PUSH_DEPLOY=NOT_RUN\nSOURCE_WRITES_BY_COMMAND=0\nAPPLICATION_STARTS=0\nDATABASE_STARTS=0\nAPPLICATION_NAVIGATIONS=0\nNETWORK_ISOLATION=NO_OS_SANDBOX;NO_APPLICATION_NAVIGATION_REQUESTED\nRELEASE_QUALIFIED=false\nREPORT_END=MMHB-CHROMIUM-SHORT-TEMP-QUALIFICATION-79');
}
MMHB79_NODE
