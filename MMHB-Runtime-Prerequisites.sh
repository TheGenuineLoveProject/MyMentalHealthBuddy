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
const ROOT = '/home/runner/workspace';
const PRIOR = '/home/runner/mmhb-release-check.NNI5YP';
const SNAPSHOT = path.join(PRIOR,'source');
const HEAD = 'b3ce0daf53f52cab918dd0c40954f038ac68da9b';
const BASE = 'df8137696e4c7b0a7c16a08347e1b92f85b85371';
const AFTER = '5f09d685e57e53a79e959e650b8e2b6a60abda89e1b089e07ad6a16672095ba7';
const hash = b => crypto.createHash('sha256').update(b).digest('hex');
const blob = b => crypto.createHash('sha1').update(`blob ${b.length}\0`).update(b).digest('hex');
const check = (ok,message) => { if (!ok) throw new Error(message); };
const env = {PATH:process.env.PATH || '/usr/bin:/bin',LANG:'C.UTF-8',
  CI:'true',GIT_OPTIONAL_LOCKS:'0',GIT_TERMINAL_PROMPT:'0'};
let directory, before, gate = 'IDENTITY', passed = 0;
function git(...args) {
  const r = spawnSync('git',['--no-pager','--no-optional-locks',
    '-c','core.fsmonitor=false','-c','core.quotePath=true',...args],
    {cwd:ROOT,env,encoding:'utf8',timeout:60000,maxBuffer:32*1024*1024});
  check(!r.error && r.status === 0,'Git inspection failed: '+args[0]);
  return r.stdout;
}
function state() {
  return JSON.stringify({head:git('rev-parse','HEAD').trim(),
    branch:git('branch','--show-current').trim(),
    index:hash(fs.readFileSync(path.resolve(ROOT,git('rev-parse','--git-path','index').trim()))),
    status:git('status','--porcelain=v1','--untracked-files=no','--ignore-submodules=none'),
    diff:hash(git('diff','--binary','--no-ext-diff','--no-textconv','HEAD')),
    untracked:hash(git('ls-files','--others','--exclude-standard','-z'))});
}
function put(name,bytes) {
  fs.writeFileSync(path.join(directory,name),bytes,{flag:'wx',mode:0o600});
}
try {
  console.log('COMMAND_ID=MMHB-RUNTIME-PREREQUISITES-20260924-15');
  check(fs.realpathSync(ROOT) === fs.realpathSync(git('rev-parse','--show-toplevel').trim()),'Wrong repository root.');
  check(JSON.parse(fs.readFileSync(path.join(ROOT,'package.json'),'utf8')).name === 'mymentalhealthbuddy','Wrong project.');
  check(!process.env.REPL_ID || process.env.REPL_ID === '9d71c4b8-8fcd-4b22-aee2-5883d9cbe5a4','Wrong Replit project.');
  before = state();
  const current = JSON.parse(before);
  check(current.head === HEAD && current.branch === 'integration','HEAD or branch changed.');
  check(current.status === ' M server/routes/webhook.mjs\n','Tracked changes differ; preserve all work.');
  check(hash(fs.readFileSync(path.join(ROOT,'server/routes/webhook.mjs'))) === AFTER,'Applied repair differs.');
  gate = 'PRIOR_EVIDENCE';
  const previous = JSON.parse(fs.readFileSync(path.join(PRIOR,'state.after.json'),'utf8'));
  for (const key of ['head','branch','index','status','diff']) check(current[key] === previous[key],'Checkout changed since the passing checks: '+key);
  git('merge-base','--is-ancestor',BASE,HEAD);
  const manifest = new Map(JSON.parse(fs.readFileSync(path.join(PRIOR,'source-manifest.json'),'utf8')).map(x=>[x.path,x]));
  directory = fs.mkdtempSync('/home/runner/mmhb-runtime-review.');
  console.log('EVIDENCE_DIRECTORY='+directory+'\nPREVIOUS_SOURCE_AND_BUILD_GATES=RETAINED');
  put('state.before.json',before+'\n');
  function source(rel) {
    const expected = manifest.get(rel);
    check(expected?.sha256,'No regular-file snapshot record: '+rel);
    const saved = path.join(SNAPSHOT,rel), live = path.join(ROOT,rel);
    check(fs.lstatSync(saved).isFile() && fs.lstatSync(live).isFile(),'Not a regular source file: '+rel);
    const bytes = fs.readFileSync(saved);
    check(hash(bytes) === expected.sha256 && hash(fs.readFileSync(live)) === expected.sha256,'Source differs from the passing snapshot: '+rel);
    return bytes;
  }
  gate = 'RUNTIME_REVIEW';
  const selected = ['server/app.mjs','server/db/client.mjs','server/db/sslConfig.mjs',
    'server/db/ensureSchema.mjs','shared/schema.mjs','server/utils/planMapping.mjs',
    'server/security/csrf.mjs','scripts/security/verify-auth-session-contracts.mjs'];
  for (const rel of selected) console.log('SOURCE='+JSON.stringify({path:rel,blob:blob(source(rel))}));
  const diff = git('diff','--no-ext-diff','--no-textconv','--unified=3',BASE,'--',...selected);
  put('runtime-source-review.diff',diff);
  console.log('RUNTIME_SOURCE_DIFF_BEGIN\n'+(diff || '(No differences in selected files.)\n')+'RUNTIME_SOURCE_DIFF_END');
  const tools = {};
  for (const name of ['initdb','pg_ctl','postgres','psql','pg_config','docker']) {
    tools[name] = null;
    for (const dir of env.PATH.split(path.delimiter).filter(Boolean)) {
      const candidate = path.resolve(dir,name);
      try { fs.accessSync(candidate,fs.constants.X_OK); if (fs.statSync(candidate).isFile()) { tools[name] = candidate; break; } } catch {}
    }
  }
  const versions = {node:process.version};
  for (const name of ['pg','drizzle-orm','express','stripe']) {
    try { versions[name] = JSON.parse(fs.readFileSync(path.join(ROOT,'node_modules',name,'package.json'),'utf8')).version; }
    catch { versions[name] = 'UNAVAILABLE'; }
  }
  const candidates = [...manifest.keys()].filter(p => /^(tests|scripts)\//.test(p) && /(webhook|stripe|billing|postgres|integration|migration)/i.test(p));
  const capabilities = {tools,versions,testDatabaseVariablePresent:
    Boolean(process.env.MMHB_TEST_DATABASE_URL || process.env.TEST_DATABASE_URL),
    candidateFileCount:candidates.length,candidateFiles:candidates};
  put('runtime-capabilities.json',JSON.stringify(capabilities,null,2)+'\n');
  console.log('RUNTIME_CAPABILITIES='+JSON.stringify({...capabilities,candidateFiles:candidates.slice(0,80)}));
  if (candidates.length > 80) console.log('CANDIDATE_FILE_LIST_TRUNCATED=true');
  gate = 'SOURCE_CONTRACTS';
  for (const rel of ['package.json','server/routes/crisis.mjs','server/routes/disclaimer.mjs','server/middleware/rateLimit.mjs']) source(rel);
  const contracts = [
    ['SAFETY_SOURCE_CONTRACT','scripts/safety/verify-safety-guardrails.mjs','e19f5a21347265f2e3088a0e3a63b6db690b476c'],
    ['RATE_LIMIT_SOURCE_CONTRACT','scripts/security/verify-rate-limit-ip-spoof.mjs','ad42380ead5078c19eeab4fb19c360f099675132']
  ];
  for (const [label,rel,expected] of contracts) {
    gate = label;
    check(blob(source(rel)) === expected,'Verifier differs from reviewed source: '+rel);
    const r = spawnSync(process.execPath,[path.join(SNAPSHOT,rel)],{cwd:SNAPSHOT,env,
      encoding:'utf8',timeout:30000,maxBuffer:2*1024*1024,killSignal:'SIGKILL'});
    const output = (r.stdout || '')+(r.stderr || '');
    put(label+'.log',output);
    if (r.error || r.status !== 0) console.log(output.split('\n').slice(-50).join('\n'));
    check(!r.error && r.status === 0,label+' failed.');
    passed++;
    console.log(label+'=PASS:SOURCE_PATTERN_CHECK_ONLY');
  }
  gate = 'SOURCE_PRESERVATION';
  check(state() === before,'Checkout changed during review; preserve all work.');
  put('state.after.json',before+'\n');
  console.log('SOURCE_PRESERVATION=PASS\nSTATUS=RUNTIME_PREREQUISITES_COLLECTED');
} catch (error) {
  console.log('STATUS=STOPPED\nFAILED_GATE='+gate+'\nEVIDENCE='+error.message);
  if (before) {
    try { console.log('SOURCE_PRESERVATION='+(state() === before ? 'PASS' : 'CHANGED_REVIEW_REQUIRED')); }
    catch { console.log('SOURCE_PRESERVATION=UNKNOWN'); }
  }
  process.exitCode = 2;
} finally {
  console.log('SOURCE_CONTRACTS_PASSED='+passed+'/2\nSOURCE_WRITES_BY_COMMAND=0');
  console.log('TYPECHECK_AND_BUILD=NOT_REPEATED:PREVIOUS_PASS\nFULL_APP_TESTS=NOT_RUN');
  console.log('REAL_DATABASE_TESTS=NOT_RUN\nDATABASE_CONNECTIONS=NOT_OPENED');
  console.log('COMMIT=NOT_RUN\nPUSH=NOT_RUN\nDEPLOY=NOT_RUN\nRELEASE_QUALIFIED=false');
  console.log('NEXT_REQUIRED_ACTION=RETURN_FULL_OUTPUT_INCLUDING_SOURCE_DIFF');
  if (directory) console.log('EVIDENCE_DIRECTORY='+directory);
}
NODE
)
