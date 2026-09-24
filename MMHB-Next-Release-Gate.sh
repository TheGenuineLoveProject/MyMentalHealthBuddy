#!/usr/bin/env bash
(
set -eu
umask 077
cd /home/runner/workspace
node --input-type=commonjs <<'NODE'
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const {spawnSync} = require('node:child_process');
const {pathToFileURL} = require('node:url');
const ROOT = '/home/runner/workspace';
const HEAD = 'b3ce0daf53f52cab918dd0c40954f038ac68da9b';
const REL = 'server/routes/webhook.mjs';
const AFTER = '5f09d685e57e53a79e959e650b8e2b6a60abda89e1b089e07ad6a16672095ba7';
const hash = b => crypto.createHash('sha256').update(b).digest('hex');
const blob = b => crypto.createHash('sha1').update(`blob ${b.length}\0`).update(b).digest('hex');
const check = (ok, message) => { if (!ok) throw new Error(message); };
const env = {PATH:process.env.PATH || '/usr/bin:/bin', LANG:'C.UTF-8',
  CI:'true', GIT_OPTIONAL_LOCKS:'0', GIT_TERMINAL_PROMPT:'0'};
let directory, originalState, currentState, gate = 'IDENTITY';
let typecheck = 'NOT_RUN', syntax = 'NOT_RUN', build = 'NOT_RUN';
function git(...args) {
  const r = spawnSync('git', ['--no-pager','--no-optional-locks',
    '-c','core.fsmonitor=false','-c','core.quotePath=true',...args],
    {cwd:ROOT, env, encoding:'utf8', maxBuffer:32*1024*1024, timeout:60000});
  check(!r.error && r.status === 0, 'Git inspection failed: '+args[0]);
  return r.stdout;
}
function state() {
  const index = path.resolve(ROOT, git('rev-parse','--git-path','index').trim());
  return JSON.stringify({head:git('rev-parse','HEAD').trim(),
    branch:git('branch','--show-current').trim(), index:hash(fs.readFileSync(index)),
    status:git('status','--porcelain=v1','--untracked-files=no','--ignore-submodules=none'),
    diff:hash(git('diff','--binary','--no-ext-diff','--no-textconv','HEAD')),
    untracked:hash(git('ls-files','--others','--exclude-standard','-z'))});
}
function put(name, data) {
  fs.writeFileSync(path.join(directory,name),data,{flag:'wx',mode:0o600});
}
function run(label, args, cwd, timeout = 60000, extraEnv = {}) {
  const r = spawnSync(process.execPath,args,{cwd,env:{...env,...extraEnv},encoding:'utf8',
    maxBuffer:8*1024*1024,timeout,killSignal:'SIGKILL'});
  const output = (r.stdout || '')+(r.stderr || '');
  put(label+'.log',output);
  if (r.error || r.status !== 0) {
    console.log(output.split('\n').slice(-70).join('\n'));
    if (r.error) console.log('PROCESS_ERROR='+r.error.code);
    throw new Error(label+' failed; full output is in '+label+'.log');
  }
  return output;
}
try {
  console.log('COMMAND_ID=MMHB-RELEASE-GATE-20260923-14');
  check(fs.realpathSync(ROOT) === fs.realpathSync(git('rev-parse','--show-toplevel').trim()),
    'Repository root differs.');
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT,'package.json'),'utf8'));
  check(pkg.name === 'mymentalhealthbuddy', 'Project identity differs.');
  check(!process.env.REPL_ID || process.env.REPL_ID === '9d71c4b8-8fcd-4b22-aee2-5883d9cbe5a4',
    'Replit project identity differs.');
  originalState = state();
  const initial = JSON.parse(originalState);
  check(initial.head === HEAD && initial.branch === 'integration', 'HEAD or branch differs.');
  console.log('HEAD='+initial.head+'\nBRANCH='+initial.branch);
  gate = 'APPLIED_REPAIR';
  check(initial.status === ' M '+REL+'\n', 'Tracked state differs; preserve it and return output.');
  check(fs.lstatSync(path.join(ROOT,REL)).isFile(), 'Webhook is not a regular file.');
  check(hash(fs.readFileSync(path.join(ROOT,REL))) === AFTER, 'Webhook differs from the qualified repair.');
  check(pkg.scripts?.typecheck === 'tsc --noEmit', 'Typecheck command changed; review required.');
  directory = fs.mkdtempSync('/home/runner/mmhb-release-check.');
  console.log('EVIDENCE_DIRECTORY='+directory+'\nAPPLIED_REPAIR=PASS');
  put('state.before.json',originalState+'\n');
  put('applied.diff',git('diff','--no-ext-diff','--no-textconv','--',REL));
  put('package-scripts.json',JSON.stringify(pkg.scripts,null,2)+'\n');
  for (const name of ['pretest','test','typecheck','build','prebuild','postbuild','verify:auth-session-contracts','verify:foundation']) {
    console.log('SCRIPT='+JSON.stringify({name,command:pkg.scripts?.[name] || null}));
  }
  gate = 'SOURCE_SNAPSHOT';
  const snapshot = path.join(directory,'source');
  fs.mkdirSync(snapshot,{mode:0o700});
  const files = git('ls-files','-z').split('\0').filter(Boolean);
  const manifest = [];
  for (const rel of files) {
    check(!path.isAbsolute(rel) && !rel.split('/').some(p => p === '..' || p === '.git' || p === 'node_modules'),
      'Unsupported tracked path: '+JSON.stringify(rel));
    const from = path.join(ROOT,rel), to = path.join(snapshot,rel), st = fs.lstatSync(from);
    fs.mkdirSync(path.dirname(to),{recursive:true,mode:0o700});
    if (st.isSymbolicLink()) {
      const link = fs.readlinkSync(from);
      check(!path.isAbsolute(link) && path.resolve(path.dirname(to),link).startsWith(snapshot+path.sep),
        'Tracked link leaves snapshot: '+JSON.stringify(rel));
      fs.symlinkSync(link,to);
      manifest.push({path:rel,link});
    } else {
      check(st.isFile(), 'Tracked path is not a regular file: '+JSON.stringify(rel));
      fs.copyFileSync(from,to,fs.constants.COPYFILE_FICLONE);
      const bytes = fs.readFileSync(to);
      manifest.push({path:rel,sha256:hash(bytes),blob:blob(bytes)});
    }
  }
  put('source-manifest.json',JSON.stringify(manifest,null,2)+'\n');
  check(state() === originalState, 'Checkout changed while copying; preserve both copies.');
  check(hash(fs.readFileSync(path.join(snapshot,REL))) === AFTER,'Snapshot webhook mismatch.');
  check(fs.statSync(path.join(ROOT,'node_modules')).isDirectory(),'Installed dependencies are missing.');
  fs.symlinkSync(path.join(ROOT,'node_modules'),path.join(snapshot,'node_modules'),'dir');
  console.log('SOURCE_SNAPSHOT=PASS\nTRACKED_FILES_COPIED='+files.length);
  const inspect = files.filter(p => /^vite\.config\./.test(p) ||
    /^tsconfig.*\.json$/.test(p) || p === 'scripts/check-contract-routes.sh' ||
    p === 'scripts/verify-foundation.mjs' || p === 'scripts/safety/verify-safety-guardrails.mjs' ||
    p === 'scripts/biometrics/verify-healthkit-webhook-contract.mjs' ||
    /auth.*session.*contract.*\.[cm]?js$/.test(p));
  for (const rel of inspect) {
    const entry = manifest.find(m => m.path === rel);
    console.log('REVIEW_FILE='+JSON.stringify(entry));
  }
  gate = 'TYPECHECK';
  console.log('TYPECHECK=RUNNING');
  typecheck = 'FAIL';
  const tsc = path.join(ROOT,'node_modules','typescript','bin','tsc');
  check(fs.statSync(tsc).isFile(), 'Installed TypeScript compiler is missing.');
  const config = JSON.parse(run('TSC_CONFIG',[tsc,'--showConfig','--pretty','false'],snapshot));
  console.log('TYPECHECK_COVERAGE='+JSON.stringify({files:config.files?.length || 0,
    allowJs:config.compilerOptions?.allowJs === true,checkJs:config.compilerOptions?.checkJs === true}));
  check(config.files?.length > 0, 'Typecheck resolved no input files.');
  run('TYPECHECK',[tsc,'--noEmit','--pretty','false'],snapshot,180000);
  typecheck = 'PASS';
  console.log('TYPECHECK=PASS');
  gate = 'BACKEND_SYNTAX';
  syntax = 'FAIL';
  const backend = files.filter(p => p.startsWith('server/') && /\.(mjs|cjs|js)$/.test(p));
  check(backend.includes(REL), 'Webhook missing from syntax inputs.');
  for (let i=0;i<backend.length;i++) {
    run('SYNTAX-'+String(i).padStart(4,'0'),['--check',path.join(snapshot,backend[i])],snapshot,20000);
    if ((i+1)%50 === 0) console.log('BACKEND_SYNTAX_PROGRESS='+String(i+1)+'/'+backend.length);
  }
  syntax = 'PASS';
  console.log('BACKEND_SYNTAX=PASS\nBACKEND_FILES_CHECKED='+backend.length);
  gate = 'BUILD_CONFIGURATION';
  check(pkg.scripts?.build === 'vite build', 'Build command changed; review required.');
  check(blob(fs.readFileSync(path.join(snapshot,'vite.config.js'))) === 'e43fe32649c84475bcc0e52acbb733327e82c6a7',
    'Vite configuration differs from the reviewed baseline; source snapshot retained.');
  const emptyEnv = path.join(directory,'empty-env');
  fs.mkdirSync(emptyEnv,{mode:0o700});
  const outputDir = path.join(directory,'frontend-build');
  const viteEntry = pathToFileURL(path.join(ROOT,'node_modules','vite','dist','node','index.js')).href;
  const options = {configFile:path.join(snapshot,'vite.config.js'),configLoader:'native',
    mode:'production',envDir:emptyEnv,cacheDir:path.join(directory,'vite-cache'),
    build:{outDir:outputDir,emptyOutDir:true}};
  put('build.mjs','import {build} from '+JSON.stringify(viteEntry)+';\nawait build('+JSON.stringify(options)+');\n');
  gate = 'FRONTEND_BUILD';
  build = 'FAIL';
  console.log('FRONTEND_BUILD=RUNNING');
  run('FRONTEND_BUILD',[path.join(directory,'build.mjs')],snapshot,180000,{NODE_ENV:'production'});
  const indexHtml = fs.readFileSync(path.join(outputDir,'index.html'));
  check(indexHtml.length > 0,'Fresh build did not produce index.html.');
  build = 'PASS';
  console.log('FRONTEND_BUILD=PASS\nBUILD_INDEX_SHA256='+hash(indexHtml));
  gate = 'SOURCE_PRESERVATION';
  currentState = state();
  check(currentState === originalState, 'Checkout changed during checks; preserve all work.');
  put('state.after.json',currentState+'\n');
  console.log('SOURCE_PRESERVATION=PASS\nSTATUS=SOURCE_AND_BUILD_GATES_PASSED_RELEASE_PENDING');
} catch (error) {
  console.log('STATUS=STOPPED\nFAILED_GATE='+gate+'\nEVIDENCE='+error.message);
  if (originalState) {
    try { console.log('SOURCE_PRESERVATION='+(state() === originalState ? 'PASS' : 'CHANGED_REVIEW_REQUIRED')); }
    catch { console.log('SOURCE_PRESERVATION=UNKNOWN'); }
  }
  process.exitCode = 2;
} finally {
  console.log('TYPECHECK_FINAL='+typecheck+'\nBACKEND_SYNTAX_FINAL='+syntax);
  console.log('SOURCE_WRITES_BY_COMMAND=0\nFULL_APP_TESTS=NOT_RUN:ISOLATED_RUNTIME_REQUIRED');
  console.log('REAL_DATABASE_TESTS=NOT_RUN\nFRONTEND_BUILD_FINAL='+build);
  console.log('BUILD_SCOPE=TEMPORARY_CLIENT_BUILD_WITHOUT_DEPLOYMENT_ENVIRONMENT\nSERVER_PACKAGE=NOT_VERIFIED');
  console.log('LINT=NOT_RUN\nCI=NOT_RUN\nCOMMIT=NOT_RUN\nPUSH=NOT_RUN\nDEPLOY=NOT_RUN');
  console.log('RELEASE_QUALIFIED=false\nNEXT_REQUIRED_ACTION=RETURN_FULL_OUTPUT');
  if (directory) console.log('EVIDENCE_DIRECTORY='+directory);
}
NODE
)
