import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
const EXPECTED_ROOT = '/home/runner/workspace';
const EXPECTED_HEAD = 'ba56d50f2f86bc9e47f829e9596f0d0b31699ab0';
const EXPECTED_NODE = 'v24.13.0';
const ESBUILD_REL = 'node_modules/esbuild/bin/esbuild';
const PINS = {
  "package.json": "0f7ef43511c004e3d268a2e2840d46a264453892937f5a2eb6a680b01481c1e0",
  "scripts/security/verify-auth-session-contracts.mjs": "71d2009a0c2b13001dc0e0606b72973527f6646ea091540dd3f4bd3311f4905f",
  "server/routes/auth.mjs": "fd4d9d7cfc75e23fc60dde5df5139ffb1fc826a338acf3c9cc7c2faba4ce362c",
  "server/services/refreshTokens.service.mjs": "5a9756caa3c772ac8c70f4a7860372dd42895e7df47c4e0956e42fa041528e8e",
  "server/routes/account.mjs": "e766374c5bc57032a5ad8573ed1c9bb37ef66dceb703957bf2bba289a5acd331",
  "server/app.mjs": "fb7316818f033e5748f7710a8c7c6f01991f03da6aa649a56189fbab71329818",
  "server/security/csrf.mjs": "648e21f3eb89933aeaaad1e967c59640cc52d2f8634002d3abbc6dafe358bce1",
  "server/replit_integrations/auth/replitAuth.mjs": "6235fd16449ca0974cc9d5103c1c3ae42e5ace1b7bbcdb6d3351aa7fbae7f9f2",
  "client/src/context/AuthContext.jsx": "ab68888ba5ebdc783ef77260c33546a1d4638b3950205e71c4210862f927c61d",
  "client/src/api/fetchWithAuth.js": "6c1ac4bca06cee87b46194521b3162cd82f31e364ee7862172b49abb168c6ef9",
  "client/src/lib/queryClient.js": "791ad03c4678a60a2582386a70d8798d5ced77089bf300207f053ea17b5f1388",
  "server/utils/cookies.mjs": "67d22050139f06abef51675f960607db950319de3ad590b80b8adf7991ef80b3",
  ".replit": "fdd7294d6332ab7814be58d8021b3ffee7e5f2157c035752454c541d3de34b63",
  "server/replit_integrations/auth/index.mjs": "96c6aacd6ee1239771cd50479b2090f2c90a141f948f7e48af279a9afd41d47a",
  "server/auth/mfa.service.mjs": "257135ac9d20fe3b96276011be6ea5d47770dd568af70653f11227ecc3aaf364",
  "server/db/sessionStore.mjs": "23f26b54c3b75135348f0c9fcb9193893f0e09fc8f471195c3d62969eaf8c6fb",
  "node_modules/typescript/package.json": "9332e97c30d3e53ed54910b89207ed657fb444066484df6e5b6965bf130865e9",
  "node_modules/typescript/lib/typescript.js": "569177652966bd528c319171c7dd22860dbf72bde116cbc4f644f1d02bb12e39",
  "package-lock.json": "648b869facffba16150769018ee062210691bd4ff10819ca379f501bfdb8d287",
  "scripts/build-server.mjs": "95fd8ce7393f7b99c32d2fad346bb580f736301aa891085e384b911e04d1394c",
  "tsconfig.json": "ca65a65cc06d0224dde35f5a8a635fc8f9527770d8c96211ce36b3ebb29548ed",
  "server/db/schema.canonical.sql": "e92e18c4d6bbfdf6faef7760e1116aa786b7b9dddc266db37c2f03998913e712",
  "node_modules/esbuild/package.json": "9d0bc453f4e791553c4cc2298ba023b409241fd9801e494741666eb0f6051490",
  "node_modules/esbuild/bin/esbuild": "e1698a3d5c6c0798fee4fd3b5cc816651f460c63d390a7a26ea4beb0b1884100",
  "node_modules/bcrypt/package.json": "33510b2b8859265a413ab101cdf961b1c9b076d93496f52d8ac7eacc007859a4",
  "node_modules/node-gyp-build/package.json": "9e8def3fbf123e28aa1ca4b6aa557fba4e66eecf6e86d170b61ec1c7ed51305d",
  "node_modules/@vitejs/plugin-react/package.json": "c5420bbbe5ea17fec4b09d44114f9eedd774efbfcc6f9a1d6228103b590af705",
  "dist/server.mjs": "74800300f01552beab4749dc0d6566488bb04a89e488075615198fb559d1b7a2",
  "dist/schema.canonical.sql": "9018cdef35b7585d18918c10f56cc0802afaf369cc7f05bc7efa9624979ddb7b",
  "client/dist/index.html": "957f6d802cda8b8fc0b5b4f0a7ce429a26d6a27638399e787e0de5f368bea393",
  "dist/client/dist/index.html": "7ff9516e7145f55e26c3ee8caccb1abe6dea74bf646cd5ad6738a66009d0d226",
  "bundle-report.html": "40b6a2dd45c614a8e2bec05de9692fac05cac65f5684169cf5eb7b89b1cc27f9"
};
const REQUIRED_INPUTS = ['server/app.mjs', 'server/security/csrf.mjs',
  'server/replit_integrations/auth/replitAuth.mjs'];
const EXTERNALS = ['pg-native', 'pg-cloudflare', 'bufferutil', 'utf-8-validate', 'bcrypt'];
const ROOT = fs.realpathSync('.');
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const gate = (ok, code, detail = {}) => {
  if (!ok) throw Object.assign(new Error(code), { gate: code, detail });
};
const inside = (root, full) => full.startsWith(root + path.sep);
const privatePath = value => /(?:^|\/)(?:\.env(?:\.|$)|\.npmrc$|\.git(?:\/|$))|\.(?:pem|key|p12|pfx)$/i.test(value);
const publicPath = value => typeof value === 'string' && value.length <= 300 &&
  /^[A-Za-z0-9_@.+/-]+$/.test(value) && !privatePath(value) &&
  !path.isAbsolute(value) && !value.split('/').some(x => x === '..' || x === '.');
// es5-ext uses literal # directories for prototype methods. These are file
// paths, not URL fragments or shell text. Keep the general display policy intact.
const ES5_EXT_SOURCES = [
  'node_modules/es5-ext/array/#/e-index-of.js',
  'node_modules/es5-ext/string/#/contains/index.js',
  'node_modules/es5-ext/string/#/contains/is-implemented.js',
  'node_modules/es5-ext/string/#/contains/shim.js'
];
const ES5_EXT_READ_PATHS = new Set([...ES5_EXT_SOURCES,
  ...['node_modules/es5-ext/array/#', 'node_modules/es5-ext/string/#',
    'node_modules/es5-ext/string/#/contains'].flatMap(dir =>
    ['package.json', 'tsconfig.json', 'jsconfig.json'].map(base => dir + '/' + base))]);
const inputReadPath = value => publicPath(value) ||
  (typeof value === 'string' && ES5_EXT_READ_PATHS.has(value) && !privatePath(value));
const label = value => publicPath(value) ? value : 'REDACTED_PATH_' + hash(String(value)).slice(0, 12);
// No npm commands, project scripts, application imports or inherited child secrets.
const MIN_ENV = { PATH: '/usr/local/bin:/usr/bin:/bin', LANG: 'C', LC_ALL: 'C',
  NODE_ENV: 'production', GIT_OPTIONAL_LOCKS: '0' };
// Replit's git may live in a Nix store, outside the compiler's minimal PATH.
const GIT_BIN = (process.env.PATH || '').split(path.delimiter).filter(path.isAbsolute)
  .map(dir => path.join(dir, 'git')).find(file => {
    try { fs.accessSync(file, fs.constants.X_OK); return fs.statSync(file).isFile(); }
    catch { return false; }
  });
const git = (...args) => execFileSync(GIT_BIN || '/usr/bin/git', ['-c', 'core.fsmonitor=false',
  '-c', 'core.untrackedCache=false', ...args], {
  cwd: ROOT, env: MIN_ENV, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
  timeout: 30000, maxBuffer: 64 * 1024 * 1024
});

function identity(full, allowLink = false, readPolicy = null) {
  gate(inside(ROOT, full), 'INPUT_OUTSIDE_WORKSPACE');
  const rel = path.relative(ROOT, full);
  if (readPolicy) gate(readPolicy(rel), 'METAFILE_PRIVATE_OR_UNSUPPORTED_INPUT', { file: label(rel) });
  let cursor = ROOT;
  for (const part of rel.split(path.sep)) {
    cursor = path.join(cursor, part);
    try {
      const st = fs.lstatSync(cursor);
      gate(!st.isSymbolicLink() || allowLink, 'INPUT_SYMLINK', { file: label(rel) });
    } catch (error) {
      if (error.code === 'ENOENT') return { state: 'ABSENT' };
      throw error;
    }
  }
  const resolved = fs.realpathSync(full);
  gate(inside(ROOT, resolved), 'RESOLVED_INPUT_OUTSIDE_WORKSPACE', { file: label(rel) });
  // Enforce the resolved read boundary before any file-content hashing.
  if (readPolicy) gate(readPolicy(path.relative(ROOT, resolved)),
    'METAFILE_PRIVATE_OR_UNSUPPORTED_RESOLUTION', { file: label(rel) });
  const st = fs.statSync(full);
  gate(st.isFile() && st.size <= 256 * 1024 * 1024, 'INPUT_FILE_LIMIT', { file: label(rel) });
  const fd = fs.openSync(full, 'r'), buffer = Buffer.alloc(1024 * 1024);
  const digest = crypto.createHash('sha256');
  try {
    let count;
    while ((count = fs.readSync(fd, buffer, 0, buffer.length, null)) > 0) digest.update(buffer.subarray(0, count));
  } finally { fs.closeSync(fd); }
  const after = fs.statSync(full);
  gate(after.ino === st.ino && after.size === st.size && after.mtimeMs === st.mtimeMs && after.mode === st.mode,
    'INPUT_CHANGED_DURING_HASH', { file: label(rel) });
  return { state: 'FILE', sha256: digest.digest('hex'), bytes: st.size, mode: st.mode,
    resolved: path.relative(ROOT, resolved) };
}
function rawIdentity(rel) {
  const full = path.resolve(ROOT, rel);
  gate(inside(ROOT, full), 'WORKTREE_PATH_OUTSIDE_ROOT');
  try {
    const st = fs.lstatSync(full);
    if (st.isSymbolicLink()) return { state: 'SYMLINK', mode: st.mode, sha256: hash(fs.readlinkSync(full)) };
  } catch (error) { if (error.code === 'ENOENT') return { state: 'ABSENT' }; throw error; }
  return identity(full, true);
}
function snapshot() {
  // git status/diff can invoke clean filters. Hash file bytes and index instead.
  const names = [...new Set(git('ls-files', '--cached', '--others', '--exclude-standard', '-z')
    .split('\0').filter(Boolean))].sort();
  gate(names.length <= 30000, 'WORKTREE_FILE_COUNT_LIMIT');
  let total = 0;
  const records = names.map(file => {
    const record = rawIdentity(file);
    total += record.bytes || 0;
    gate(total <= 4 * 1024 ** 3, 'WORKTREE_SIZE_LIMIT');
    return [file, record];
  });
  const index = path.relative(ROOT, path.resolve(ROOT, git('rev-parse', '--git-path', 'index').trim()));
  return { head: git('rev-parse', 'HEAD').trim(), branch: git('branch', '--show-current').trim(),
    index: rawIdentity(index), stagedEntriesSha256: hash(git('ls-files', '--stage', '-z')),
    trackedFlagsSha256: hash(git('ls-files', '-v', '-z')),
    worktree: hash(JSON.stringify(records)), files: names.length, records };
}
function snapshotDifference(before, after) {
  const components = ['head', 'branch', 'index', 'stagedEntriesSha256', 'trackedFlagsSha256', 'worktree', 'files']
    .filter(key => JSON.stringify(before[key]) !== JSON.stringify(after[key]));
  const b = new Map(before.records), a = new Map(after.records), changes = [];
  for (const file of [...new Set([...b.keys(), ...a.keys()])].sort()) {
    const old = b.get(file), next = a.get(file);
    if (JSON.stringify(old) !== JSON.stringify(next)) changes.push({ file: label(file),
      fields: [...new Set([...Object.keys(old || {}), ...Object.keys(next || {})])]
        .filter(key => JSON.stringify(old?.[key]) !== JSON.stringify(next?.[key])) });
  }
  return { components, changedFileCount: changes.length, changes: changes.slice(0, 40),
    rawIndexOnly: components.length === 1 && components[0] === 'index',
    scope: 'CURRENT_R11D_OBSERVATIONS_ONLY_NOT_HISTORICAL_R11A' };
}
function checkPins() {
  const result = {};
  for (const [rel, expected] of Object.entries(PINS)) {
    const observed = identity(path.join(ROOT, rel), rel.startsWith('node_modules/'));
    gate(observed.sha256 === expected, 'R10A_BASELINE_DRIFT', { file: label(rel) });
    result[rel] = observed;
  }
  return result;
}
function readJSON(full, max = 32 * 1024 * 1024) {
  const st = fs.lstatSync(full);
  gate(st.isFile() && st.size <= max, 'JSON_FILE_LIMIT');
  return JSON.parse(fs.readFileSync(full, 'utf8'));
}
function outputIdentity(full) {
  const st = fs.lstatSync(full);
  gate(st.isFile() && st.size <= 64 * 1024 * 1024, 'OUTPUT_FILE_LIMIT');
  return { sha256: hash(fs.readFileSync(full)), bytes: st.size };
}
function inputManifest(meta) {
  gate(meta.inputs && typeof meta.inputs === 'object' && !Array.isArray(meta.inputs) &&
    Object.keys(meta.inputs).length <= 30000 && meta.outputs, 'INVALID_METAFILE');
  const records = new Map();
  const included = new Set();
  function observe(rel, mandatory = false) {
    gate(inputReadPath(rel), 'METAFILE_PRIVATE_OR_UNSUPPORTED_INPUT', { file: label(rel) });
    if (!records.has(rel)) records.set(rel, identity(path.join(ROOT, rel), rel.startsWith('node_modules/'), inputReadPath));
    if (mandatory) gate(records.get(rel).state === 'FILE', 'METAFILE_INPUT_MISSING', { file: label(rel) });
    gate(records.size <= 30000, 'INPUT_MANIFEST_LIMIT');
  }
  for (const name of Object.keys(meta.inputs).sort()) {
    gate(name.length <= 4096 && name.split('/').length <= 100, 'METAFILE_KEY_LIMIT');
    const full = path.resolve(ROOT, name);
    gate(inside(ROOT, full), 'METAFILE_INPUT_OUTSIDE_WORKSPACE');
    const rel = path.relative(ROOT, full);
    observe(rel, true); included.add(rel);
    // Keep resolution metadata including its absence. JSON is data, never imported.
    let dir = path.dirname(full);
    while (dir === ROOT || inside(ROOT, dir)) {
      for (const base of ['package.json', 'tsconfig.json', 'jsconfig.json']) {
        const config = path.relative(ROOT, path.join(dir, base));
        observe(config);
        // esbuild 0.28.2 prefers sibling tsconfig.json over jsconfig.json.
        // The pinned root tsconfig is mandatory and explicitly selected above.
        // Keep root jsconfig in the manifest; only its presence is non-blocking.
        if (base !== 'package.json' && config !== 'tsconfig.json' && config !== 'jsconfig.json' &&
            !config.startsWith('node_modules/') && records.get(config).state !== 'ABSENT') {
          gate(false, 'CONFIG_EQUIVALENCE_REQUIRES_REVIEW', { file: label(config) });
        }
      }
      if (dir === ROOT) break;
      dir = path.dirname(dir);
    }
  }
  for (const rel of REQUIRED_INPUTS) {
    gate(included.has(rel), 'REPAIRED_AUTH_INPUT_NOT_BUNDLED', { file: rel });
    gate(records.get(rel).sha256 === PINS[rel], 'REPAIRED_AUTH_INPUT_DRIFT', { file: rel });
  }
  return { inputs: [...included].sort(), records: Object.fromEntries([...records].sort(([a], [b]) => a.localeCompare(b))) };
}
function verifyManifest(manifest) {
  for (const [rel, before] of Object.entries(manifest.records)) {
    const after = identity(path.join(ROOT, rel), rel.startsWith('node_modules/'), inputReadPath);
    gate(JSON.stringify(after) === JSON.stringify(before), 'BUILD_INPUT_DRIFT', { file: label(rel) });
  }
}
function nativeTree(dep) {
  const base = path.join(ROOT, 'node_modules', dep);
  const rows = [];
  let bytes = 0;
  function walk(dir) {
    gate(fs.lstatSync(dir).isDirectory() && fs.realpathSync(dir) === dir, 'NATIVE_DIRECTORY_SYMLINK');
    for (const item of fs.readdirSync(dir).sort()) {
      const full = path.join(dir, item), st = fs.lstatSync(full);
      gate(!st.isSymbolicLink(), 'NATIVE_SYMLINK_REQUIRES_REVIEW');
      if (st.isDirectory()) walk(full);
      else {
        const rel = path.relative(ROOT, full);
        gate(publicPath(rel) && st.isFile(), 'NATIVE_FILE_TYPE_OR_PATH');
        const id = identity(full);
        bytes += id.bytes;
        gate(bytes <= 128 * 1024 * 1024 && rows.length < 10000, 'NATIVE_TREE_LIMIT');
        rows.push({ file: rel, ...id });
      }
    }
  }
  walk(base);
  gate(rows.length > 0, 'NATIVE_TREE_EMPTY');
  return rows;
}
function diagnostics(logPath) {
  const st = fs.statSync(logPath), fd = fs.openSync(logPath, 'r');
  const data = Buffer.alloc(Math.min(st.size, 256 * 1024));
  try { fs.readSync(fd, data, 0, data.length, 0); } finally { fs.closeSync(fd); }
  const body = data.toString('utf8');
  const unresolved = [...body.matchAll(/Could not resolve ["']([@A-Za-z0-9_./-]{1,160})["']/g)]
    .map(m => label(m[1]));
  const locations = [...body.matchAll(/^\s*([@A-Za-z0-9_./-]+):([0-9]+):([0-9]+):/gm)]
    .map(m => ({ file: label(m[1]), line: Number(m[2]), column: Number(m[3]) }));
  return { unresolvedModules: [...new Set(unresolved)].slice(0, 20), locations: locations.slice(0, 20),
    rawLog: 'PRIVATE_LOCAL_FILE_NOT_PRINTED', bytes: st.size };
}

let reportDir, before, baseline, manifest, failure, buildRuns = 0, buildAttempts = 0, timeoutSignal = false;
let phase = 'WORKSPACE_PREFLIGHT';
const copiedNativeSources = new Map();
let result = { project: 'MyMentalHealthBuddy', status: 'NOT_STARTED',
  historicalR11APreservation: 'UNRESOLVED_INITIAL_SNAPSHOT_NOT_RETAINED' };
// Return bounded error context; never print raw messages, stacks, command
// arguments, environment values or private absolute paths.
function failureInfo(error, failedPhase, fallback = 'UNEXPECTED_DRIVER_FAILURE') {
  const detail = { ...(error.detail || {}) };
  const rawOperation = typeof error.syscall === 'string' ? error.syscall.split(' ')[0] : '';
  const operation = rawOperation === 'spawnSync' ? 'spawn' : rawOperation;
  if (['lstat', 'stat', 'open', 'read', 'write', 'realpath', 'scandir', 'mkdir',
    'copyfile', 'chmod', 'spawn', 'readlink', 'access'].includes(operation)) detail.syscall = operation;
  if (typeof error.path === 'string') {
    const full = path.resolve(ROOT, error.path);
    detail.file = reportDir && inside(reportDir, full)
      ? 'REPORT/' + label(path.relative(reportDir, full))
      : inside(ROOT, full) ? label(path.relative(ROOT, full)) : label(error.path);
  }
  return { gate: error.gate || fallback, phase: failedPhase, detail,
    errorCode: typeof error.code === 'string' && /^[A-Z0-9_]+$/.test(error.code) ? error.code : undefined };
}
function saveEvidence(name, value) {
  fs.writeFileSync(path.join(reportDir, name), JSON.stringify(value, null, 2), { flag: 'wx', mode: 0o600 });
}
console.log('COMMAND_ID=MMHB-SERVER-CANDIDATE-R11D');
console.log('UTC=' + new Date().toISOString());
console.log('ISSUE_ID=RELEASE-PIPELINE-PROVENANCE-001');
console.log('VERIFIER_REPAIR=FRESH_METADATA_AND_CONTEXTUAL_ERRORS');
try {
  gate(ROOT === EXPECTED_ROOT, 'WORKSPACE_PATH');
  gate(process.version === EXPECTED_NODE && process.platform === 'linux' && process.arch === 'x64', 'R10A_MACHINE_DRIFT');
  gate(fs.realpathSync(git('rev-parse', '--show-toplevel').trim()) === ROOT, 'GIT_ROOT');
  reportDir = fs.mkdtempSync('/tmp/mmhb-server-candidate-r11d-');
  fs.chmodSync(reportDir, 0o700);
  console.log('REPORT_DIRECTORY=' + reportDir);
  phase = 'INITIAL_WORKTREE_SNAPSHOT';
  before = snapshot();
  saveEvidence('worktree-before.json', before);
  gate(before.head === EXPECTED_HEAD && before.branch === 'integration', 'GIT_BASELINE_DRIFT');
  phase = 'PINNED_BASELINE';
  baseline = checkPins();
  saveEvidence('pinned-before.json', baseline);
  phase = 'BUILD_CONFIGURATION';
  gate(!readJSON(path.join(ROOT, 'tsconfig.json')).extends, 'TSCONFIG_EXTENDS_REQUIRES_REVIEW');
  const esbuildPkg = readJSON(path.join(ROOT, 'node_modules/esbuild/package.json'));
  gate(esbuildPkg.version === '0.28.2', 'ESBUILD_VERSION_DRIFT');
  const lock = readJSON(path.join(ROOT, 'package-lock.json'));
  const react = readJSON(path.join(ROOT, 'node_modules/@vitejs/plugin-react/package.json'));
  result.frontendDependency = { name: '@vitejs/plugin-react',
    installed: react.version, locked: lock.packages?.['node_modules/@vitejs/plugin-react']?.version,
    releaseQualification: 'PENDING_DEPENDENCY_ALIGNMENT' };
  gate(result.frontendDependency.installed === '6.1.1' && result.frontendDependency.locked === '6.1.0', 'REACT_METADATA_DRIFT');
  phase = 'COMPILER_RESOLUTION';
  const binary = fs.realpathSync(path.join(ROOT, ESBUILD_REL));
  gate(inside(ROOT, binary), 'ESBUILD_BINARY_OUTSIDE_ROOT');
  // The pinned native CLI loads no JavaScript plugins or application code.
  // Discovery creates the current metadata; no older temporary report is read.
  // This is not a filesystem sandbox: input policy is checked after discovery.
  phase = 'CANDIDATE_DIRECTORY';
  const candidateDir = path.join(reportDir, 'candidate');
  fs.mkdirSync(candidateDir, { mode: 0o700 });
  const outfile = path.join(candidateDir, 'server.mjs');
  const metafile = path.join(reportDir, 'esbuild-meta.json');
  const args = ['server/app.mjs', '--bundle', '--platform=node', '--format=esm', '--target=node24',
    '--tsconfig=' + path.join(ROOT, 'tsconfig.json'), '--outfile=' + outfile, '--metafile=' + metafile,
    ...EXTERNALS.map(x => '--external:' + x),
    "--banner:js=import { createRequire as __createRequire } from 'node:module';\nconst require = __createRequire(import.meta.url);",
    '--color=false', '--log-level=warning'];
  result.contract = { compiler: 'esbuild 0.28.2 native CLI', entry: 'server/app.mjs',
    target: 'node24', format: 'esm', platform: 'node', external: EXTERNALS,
    config: 'Explicit pinned root tsconfig; sibling root jsconfig is observed but shadowed; nested project configs cause review stop',
    environment: 'Fixed minimal child environment; NODE_ENV=production; no define substitution',
    frontend: 'NOT_BUILT_OR_COPIED', appExecution: false, nativeLoadTest: false,
    inputDiscovery: 'FRESH_FIRST_COMPILATION_NO_RETAINED_REPORT_DEPENDENCY',
    qualification: 'CURRENT_INPUT_MANIFEST_BEFORE_AND_AFTER_SECOND_COMPILATION',
    readBoundary: 'POST_DISCOVERY_VALIDATION_NOT_COMPILER_FILESYSTEM_ISOLATION' };
  console.log('GATE=R10A_BASELINE RESULT=PASS');
  console.log('REPORT_DIRECTORY=' + reportDir);
  function compile(number) {
    phase = number === 1 ? 'DISCOVERY_COMPILATION' : 'QUALIFICATION_COMPILATION';
    console.log('BUILD_PASS=' + number + ' ACTION=' + phase);
    const log = path.join(reportDir, 'build-' + number + '.log');
    const fd = fs.openSync(log, 'wx', 0o600);
    let execution;
    try {
      buildAttempts++;
      execution = spawnSync(binary, args, { cwd: ROOT, env: { ...MIN_ENV, TMPDIR: reportDir },
        stdio: ['ignore', fd, fd], timeout: 180000, killSignal: 'SIGTERM' });
    } finally { fs.closeSync(fd); }
    if (execution.pid > 0) buildRuns++;
    timeoutSignal ||= execution.error?.code === 'ETIMEDOUT';
    gate(execution.status === 0 && !execution.error && !execution.signal, 'SERVER_COMPILATION_FAILED',
      { pass: number, exitCode: execution.status, signal: execution.signal || null,
        timedOut: execution.error?.code === 'ETIMEDOUT',
        launchError: execution.error ? failureInfo(execution.error, phase) : undefined,
        diagnostics: diagnostics(log) });
    phase = number === 1 ? 'DISCOVERY_OUTPUT_VALIDATION' : 'QUALIFICATION_OUTPUT_VALIDATION';
    const meta = readJSON(metafile);
    gate(meta.outputs && typeof meta.outputs === 'object' && !Array.isArray(meta.outputs), 'INVALID_OUTPUT_METAFILE');
    const outputEntries = Object.entries(meta.outputs);
    const serverOutput = outputEntries.find(([name]) => path.resolve(ROOT, name) === outfile);
    gate(serverOutput && path.resolve(ROOT, serverOutput[1].entryPoint || '') === path.join(ROOT, 'server/app.mjs'),
      'SERVER_ENTRY_MISSING_FROM_OUTPUT_METAFILE');
    gate(outputEntries.every(([name]) => inside(candidateDir, path.resolve(ROOT, name)) &&
      inside(candidateDir, fs.realpathSync(path.resolve(ROOT, name)))), 'UNEXPECTED_BUILD_OUTPUT_PATH');
    return { meta, bundle: outputIdentity(outfile) };
  }
  const first = compile(1);
  saveEvidence('discovery-metafile.json', first.meta);
  saveEvidence('discovery-bundle-identity.json', first.bundle);
  phase = 'DISCOVERY_INPUT_MANIFEST';
  manifest = inputManifest(first.meta);
  saveEvidence('inputs-before-final-build.json', manifest);
  verifyManifest(manifest); checkPins();
  result.inputDiscovery = { inputs: manifest.inputs.length,
    observedPaths: Object.keys(manifest.records).length,
    exactEs5ExtExceptionsUsed: Object.keys(manifest.records).filter(x => ES5_EXT_READ_PATHS.has(x)).sort(),
    inputManifestSha256: hash(JSON.stringify(manifest)),
    scope: 'CURRENT_IDENTITIES_AFTER_DISCOVERY_BEFORE_SECOND_BUILD' };
  console.log('GATE=FRESH_INPUT_MANIFEST RESULT=PASS');
  const second = compile(2);
  saveEvidence('qualification-metafile.json', second.meta);
  saveEvidence('qualification-bundle-identity.json', second.bundle);
  phase = 'QUALIFICATION_INPUT_COMPARISON';
  const finalManifest = inputManifest(second.meta);
  saveEvidence('inputs-after-final-build.json', finalManifest);
  gate(JSON.stringify(finalManifest) === JSON.stringify(manifest), 'BUILD_INPUT_CLOSURE_DRIFT');
  verifyManifest(manifest);
  gate(first.bundle.sha256 === second.bundle.sha256, 'BUILD_REPEATABILITY_MISMATCH');
  phase = 'CANDIDATE_PACKAGING';
  const allOutputs = Object.keys(second.meta.outputs).sort().map(name => {
    const full = path.resolve(ROOT, name);
    return { file: path.relative(candidateDir, full), ...outputIdentity(full) };
  });
  const sqlSource = path.join(ROOT, 'server/db/schema.canonical.sql');
  const sqlTarget = path.join(candidateDir, 'schema.canonical.sql');
  fs.copyFileSync(sqlSource, sqlTarget, fs.constants.COPYFILE_EXCL);
  gate(outputIdentity(sqlTarget).sha256 === PINS['server/db/schema.canonical.sql'], 'SCHEMA_COPY_MISMATCH');
  const nativeCopies = [];
  for (const dep of ['bcrypt', 'node-gyp-build']) {
    const nativeBefore = nativeTree(dep);
    copiedNativeSources.set(dep, nativeBefore);
    for (const row of nativeBefore) {
      const target = path.join(candidateDir, row.file);
      gate(inside(candidateDir, target), 'NATIVE_DESTINATION_ESCAPE');
      fs.mkdirSync(path.dirname(target), { recursive: true, mode: 0o700 });
      fs.copyFileSync(path.join(ROOT, row.file), target, fs.constants.COPYFILE_EXCL);
      fs.chmodSync(target, row.mode & 0o777);
      gate(outputIdentity(target).sha256 === row.sha256, 'NATIVE_COPY_MISMATCH');
    }
    gate(JSON.stringify(nativeTree(dep)) === JSON.stringify(nativeBefore), 'NATIVE_SOURCE_DRIFT');
    nativeCopies.push(...nativeBefore);
  }
  const externalImports = [...new Set(Object.values(second.meta.outputs).flatMap(out =>
    (out.imports || []).filter(x => x.external).map(x =>
      /^(?:node:)[A-Za-z0-9_/-]+$/.test(x.path) ? x.path : label(x.path))))].sort();
  result = { ...result, status: 'SERVER_CANDIDATE_ONLY_NOT_RELEASE',
    bundle: second.bundle, outputs: allOutputs, schema: outputIdentity(sqlTarget),
    nativeFiles: nativeCopies.length, nativeManifestSha256: hash(JSON.stringify(nativeCopies)),
    bundledInputCount: manifest.inputs.length, observedInputCount: Object.keys(manifest.records).length,
    inputManifestSha256: hash(JSON.stringify(manifest)),
    requiredAuthInputs: Object.fromEntries(REQUIRED_INPUTS.map(x => [x, manifest.records[x].sha256])),
    externalImports, repeatability: 'TWO_MATCHING_SERVER_BUNDLES_WITH_STABLE_OBSERVED_INPUTS',
    limitations: ['Not a frontend build or complete deployable release',
      'Same-machine repeatability; not lockfile-only clean-install reproducibility',
      'Discovery inputs are validated after compilation; compiler reads are not restricted by the manifest policy',
      'Not an operating-system filesystem/network sandbox',
      'Inputs and Git state checked without locking concurrent editors',
      'No application, native ABI, database, browser, OIDC or deployed-runtime qualification',
      'Metafile does not qualify dynamic filesystem reads or dynamic require at runtime'] };
  fs.writeFileSync(path.join(reportDir, 'native-copy-manifest.json'), JSON.stringify(nativeCopies, null, 2), { flag: 'wx', mode: 0o600 });
  console.log('GATE=SERVER_BUILD_AND_INPUT_PROVENANCE RESULT=PASS');
  console.log('GATE=SOURCE_SCHEMA_AND_NATIVE_COPIES RESULT=PASS');
} catch (error) {
  failure = failureInfo(error, phase);
} finally {
  // Persist independent preservation observations even when another check fails.
  const preservationFailures = [];
  const attempt = (name, check) => {
    phase = name;
    try { check(); }
    catch (error) { preservationFailures.push(failureInfo(error, phase, 'PRESERVATION_CHECK_FAILED')); }
  };
  if (before) {
    if (baseline) attempt('FINAL_PIN_PRESERVATION', () => {
      const observed = {};
      const changed = [];
      for (const [rel, expected] of Object.entries(baseline)) {
        observed[rel] = identity(path.join(ROOT, rel), rel.startsWith('node_modules/'));
        if (JSON.stringify(observed[rel]) !== JSON.stringify(expected)) changed.push(rel);
      }
      saveEvidence('pinned-after.json', observed);
      gate(changed.length === 0, 'PINNED_FILE_NOT_PRESERVED', { file: changed[0] && label(changed[0]), changedFiles: changed.map(label) });
    });
    if (manifest) attempt('FINAL_INPUT_PRESERVATION', () => verifyManifest(manifest));
    for (const [dep, records] of copiedNativeSources) attempt('FINAL_NATIVE_PRESERVATION', () => {
      gate(JSON.stringify(nativeTree(dep)) === JSON.stringify(records), 'NATIVE_SOURCE_NOT_PRESERVED', { dependency: dep });
    });
    attempt('FINAL_WORKTREE_SNAPSHOT', () => {
      const after = snapshot();
      saveEvidence('worktree-after.json', after);
      const difference = snapshotDifference(before, after);
      saveEvidence('worktree-comparison.json', difference);
      result.currentPreservation = difference;
      gate(difference.components.length === 0, 'GIT_OR_WORKTREE_NOT_PRESERVED', difference);
    });
    if (preservationFailures.length) {
      result.preservation = 'FAILED';
      result.preservationFailures = preservationFailures;
      failure = { ...preservationFailures[0], previousFailure: failure };
    } else {
      result.preservation = 'OBSERVED_INPUTS_AND_GIT_STATE_PRESERVED';
      console.log('GATE=OBSERVED_INPUTS_AND_GIT_STATE_PRESERVED RESULT=PASS');
    }
  }
  if (failure) {
    result.status = 'SERVER_CANDIDATE_FAILED'; result.failure = failure;
  }
  result.buildAttempts = buildAttempts;
  result.buildProcessesStarted = buildRuns;
  result.buildTimeoutSignal = timeoutSignal;
  result.evidenceWrite = reportDir ? 'SAVED' : 'REPORT_NOT_CREATED';
  if (reportDir) {
    try { saveEvidence('server-candidate-evidence.json', result); }
    catch (error) {
      failure = { ...failureInfo(error, 'FINAL_EVIDENCE_WRITE', 'EVIDENCE_WRITE_FAILED'), previousFailure: failure };
      result.status = 'SERVER_CANDIDATE_FAILED';
      result.failure = failure;
      result.evidenceWrite = 'FAILED';
    }
  }
  if (failure) console.log('FAILED_GATE=' + failure.gate);
  console.log(JSON.stringify(result, null, 2));
  console.log('SOURCE_EDIT=0 PACKAGE_EDIT=0 PACKAGE_INSTALL=0 APPLICATION_STARTED=0');
  console.log('APPLICATION_HTTP_REQUEST=0 DATABASE_CODE_EXECUTED=0 CREDENTIAL_CHANGE=0');
  console.log('STAGE=0 COMMIT=0 PUSH=0 DEPLOY=0');
  console.log('EXISTING_SERVED_OUTPUTS=NOT_TARGETED FRONTEND_BUILD=NOT_RUN FULL_NPM_TEST=NOT_RUN');
  console.log('NETWORK_ISOLATION=NOT_ENFORCED NATIVE_ABI=UNPROVEN');
  console.log('RUNTIME_OIDC_AND_LOGOUT=UNPROVEN ALL_CSRF_POLICY_QUALIFIED=NO DEPLOYED_ARTIFACT_PROVEN=NO');
  if (reportDir) console.log('REPORT_DIRECTORY=' + reportDir);
  console.log('STATUS=' + result.status);
  console.log('NEXT_ACTION=STOP_AND_RETURN_COMPLETE_OUTPUT');
  process.exitCode = failure ? 1 : 0;
}
