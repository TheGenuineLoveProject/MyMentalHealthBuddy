import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';

// This helper inspects and invokes the already installed npm CLI. It never
// executes a PATH shell wrapper or an application/package lifecycle script.
const CLI_LIMIT = 256 * 1024;
const CONFIG_LIMIT = 64 * 1024;
const PACKAGE_LIMIT = 1024 * 1024;
const LOG_LIMIT = 16 * 1024 * 1024;
const RUN_TIMEOUT = 15 * 60 * 1000;
const NPM_CODES = new Set([
  'EUSAGE', 'ERESOLVE', 'ETARGET', 'EINTEGRITY', 'ELOCKVERIFY', 'EBADENGINE',
  'EBADPLATFORM', 'E401', 'E403', 'E404', 'E429', 'E500', 'E502', 'E503',
  'ETIMEDOUT', 'ESOCKETTIMEDOUT', 'ENOTFOUND', 'EAI_AGAIN', 'ECONNRESET',
  'ECONNREFUSED', 'ENOENT', 'EACCES', 'EPERM', 'ENOSPC', 'ENOTEMPTY',
  'ERR_INVALID_ARG_TYPE', 'ERR_INVALID_URL', 'UNABLE_TO_VERIFY_LEAF_SIGNATURE',
  'SELF_SIGNED_CERT_IN_CHAIN', 'CERT_HAS_EXPIRED', 'UNABLE_TO_GET_ISSUER_CERT_LOCALLY',
]);
const digest = value => crypto.createHash('sha256').update(value).digest('hex');

function fail(code, detail = {}) {
  const error = new Error(code);
  error.code = code;
  error.detail = detail;
  throw error;
}

function readObserved(file, maxBytes, { executable = false } = {}) {
  let resolved, initial, fd;
  try {
    resolved = fs.realpathSync(file);
    initial = fs.statSync(resolved);
  } catch (error) {
    fail('NPM_TOOL_FILE_UNAVAILABLE', { operation: 'identity', code: error.code || 'UNKNOWN' });
  }
  if (!initial.isFile() || initial.size > maxBytes) fail('NPM_TOOL_FILE_TYPE_OR_SIZE');
  if (executable && (initial.mode & 0o111) === 0) fail('NPM_TOOL_NOT_EXECUTABLE');
  const unchanged = (a, b) => ['dev', 'ino', 'size', 'mode', 'mtimeMs', 'ctimeMs'].every(key => a[key] === b[key]);
  try {
    fd = fs.openSync(resolved, fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW);
    if (!unchanged(initial, fs.fstatSync(fd))) fail('NPM_TOOL_CHANGED_DURING_READ');
    const bytes = Buffer.alloc(initial.size);
    let offset = 0;
    while (offset < bytes.length) {
      const count = fs.readSync(fd, bytes, offset, bytes.length - offset, offset);
      if (count === 0) fail('NPM_TOOL_CHANGED_DURING_READ');
      offset += count;
    }
    if (!unchanged(initial, fs.fstatSync(fd)) || !unchanged(initial, fs.statSync(resolved)) || fs.realpathSync(file) !== resolved) {
      fail('NPM_TOOL_CHANGED_DURING_READ');
    }
    return { identity: { path: file, resolved, state: 'FILE', sha256: digest(bytes), bytes: bytes.length, mode: initial.mode }, bytes };
  } finally { if (fd !== undefined) fs.closeSync(fd); }
}

function regularIdentity(file, maxBytes, options) {
  return readObserved(file, maxBytes, options).identity;
}

function readBounded(file, maxBytes) {
  return readObserved(file, maxBytes);
}

function builtinConfig(npmRoot) {
  const file = path.join(npmRoot, 'npmrc');
  try { fs.lstatSync(file); }
  catch (error) {
    if (error.code === 'ENOENT') return { path: file, state: 'ABSENT', keys: [] };
    fail('NPM_BUILTIN_CONFIG_UNAVAILABLE', { code: error.code || 'UNKNOWN' });
  }
  // These distribution path settings are inert for this invocation: --prefix
  // and --globalconfig override the first two; node_gyp is never used with
  // lifecycle scripts disabled. No transport/auth/registry setting is accepted.
  const allowed = new Set(['prefix', 'globalconfig', 'node_gyp']);
  const { identity, bytes } = readBounded(file, CONFIG_LIMIT);
  if (identity.resolved !== file) fail('NPM_BUILTIN_CONFIG_SYMLINK');
  const text = bytes.toString('utf8');
  if (!Buffer.from(text).equals(bytes) || /[\0\x01-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(text)) {
    fail('NPM_BUILTIN_CONFIG_ENCODING');
  }
  const seen = new Set();
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith(';')) continue;
    const match = /^([a-z_]+)\s*=\s*(.+)$/.exec(trimmed);
    if (!match || !allowed.has(match[1]) || seen.has(match[1])) {
      fail('NPM_BUILTIN_CONFIG_UNREVIEWED', { allowedKeys: [...allowed] });
    }
    // npmrc values are never printed. Reject INI structural escapes, multiline
    // continuation and variable expansion even in the permitted path settings.
    if (/[\[\]$`\\]/.test(match[2]) || match[2].length > 4096) {
      fail('NPM_BUILTIN_CONFIG_UNREVIEWED_VALUE', { key: match[1] });
    }
    seen.add(match[1]);
  }
  return { ...identity, keys: [...seen].sort() };
}

function cliFrom(file, observed, depth = 0) {
  if (depth > 3) fail('NPM_WRAPPER_DEPTH');
  const { identity, bytes } = readBounded(file, CLI_LIMIT);
  observed.push(identity);
  const resolved = identity.resolved;
  if (resolved.endsWith('/bin/npm-cli.js')) return resolved;
  const text = bytes.toString('utf8');
  if (!Buffer.from(text).equals(bytes) || !/^#![^\n]*(?:\/|\s)(?:bash|sh)(?:\s|$)/.test(text.split('\n')[0])) {
    fail('NPM_EXECUTABLE_LAYOUT_UNSUPPORTED');
  }
  // Nix wrapProgram commonly redirects a binary to a literal -wrapped target.
  // Extract only a literal absolute target from the exec command; never eval,
  // source, or execute the shell text, exports, command substitutions or flags.
  const targets = [];
  for (const line of text.split('\n')) {
    const match = /^\s*exec\s+(?:-a\s+["']?\$0["']?\s+)?(["'])(\/nix\/store\/[A-Za-z0-9+._/-]+)\1\s+["']?\$@["']?\s*$/.exec(line);
    if (match) targets.push(match[2]);
  }
  if (targets.length !== 1 || !/(?:\/bin\/npm-cli\.js|\/\.?(?:npm|npm-cli)(?:-wrapped)+)$/.test(targets[0])) {
    fail('NPM_WRAPPER_LAYOUT_UNSUPPORTED');
  }
  return cliFrom(targets[0], observed, depth + 1);
}

export function discoverNpm(searchPath, nodePath) {
  if (typeof searchPath !== 'string' || searchPath.length > 65536 || typeof nodePath !== 'string') {
    fail('NPM_DISCOVERY_ARGUMENT');
  }
  const node = regularIdentity(nodePath, 256 * 1024 * 1024, { executable: true });
  if (node.resolved !== fs.realpathSync(process.execPath)) fail('NPM_NODE_EXECUTABLE_MISMATCH');
  let executable;
  for (const directory of searchPath.split(path.delimiter)) {
    // An empty or relative PATH segment could select a project file.
    if (!path.isAbsolute(directory)) continue;
    const candidate = path.join(directory, 'npm');
    try { fs.accessSync(candidate, fs.constants.X_OK); executable = candidate; break; }
    catch (error) { if (!['ENOENT', 'EACCES', 'ENOTDIR'].includes(error.code)) fail('NPM_PATH_LOOKUP_FAILED', { code: error.code || 'UNKNOWN' }); }
  }
  if (!executable) fail('NPM_EXECUTABLE_NOT_FOUND');
  const observed = [];
  const cliPath = cliFrom(executable, observed);
  const npmRoot = path.dirname(path.dirname(cliPath));
  const { identity: packageIdentity, bytes: packageBytes } = readBounded(path.join(npmRoot, 'package.json'), PACKAGE_LIMIT);
  let metadata;
  try { metadata = JSON.parse(packageBytes.toString('utf8')); }
  catch { fail('NPM_PACKAGE_METADATA_INVALID'); }
  if (metadata.name !== 'npm' || typeof metadata.version !== 'string' || !/^(?:10|11|12)\.\d+\.\d+$/.test(metadata.version)) {
    fail('NPM_CLI_VERSION_UNSUPPORTED');
  }
  if (packageIdentity.resolved !== path.join(npmRoot, 'package.json')) fail('NPM_PACKAGE_METADATA_SYMLINK');
  const config = builtinConfig(npmRoot);
  const cli = observed.find(row => row.resolved === cliPath);
  return {
    name: 'npm', version: metadata.version, cli, package: packageIdentity,
    builtinConfig: config, node: { ...node, version: process.version },
    wrapperObservations: observed.filter(row => row.resolved !== cliPath),
    scope: 'EXISTING_CLI_IDENTITIES_NOT_FULL_NPM_DISTRIBUTION_INTEGRITY',
  };
}

function toolsPreserved(tool) {
  const rows = [tool.cli, tool.package, tool.node, ...tool.wrapperObservations];
  if (tool.builtinConfig.state === 'FILE') rows.push(tool.builtinConfig);
  else if (fs.existsSync(tool.builtinConfig.path)) return false;
  for (const row of rows) {
    try {
      const current = regularIdentity(row.path, Math.max(row.bytes, 1));
      for (const field of ['resolved', 'sha256', 'bytes', 'mode']) if (row[field] !== current[field]) return false;
    } catch { return false; }
  }
  return true;
}

function directory(file) {
  const stat = fs.lstatSync(file);
  if (!stat.isDirectory() || stat.isSymbolicLink() || fs.realpathSync(file) !== path.resolve(file)) fail('NPM_DIRECTORY_NOT_PHYSICAL');
  return fs.realpathSync(file);
}

export async function runNpm(tool, stage, reportDir) {
  stage = directory(stage);
  reportDir = directory(reportDir);
  if (stage === reportDir || !stage.startsWith(reportDir + path.sep)) fail('NPM_STAGE_NOT_INSIDE_REPORT');
  if (fs.readdirSync(stage).sort().join('\0') !== ['package-lock.json', 'package.json'].join('\0')) fail('NPM_STAGE_NOT_FRESH_MANIFEST_PAIR');
  for (const name of ['package.json', 'package-lock.json']) {
    if (!fs.lstatSync(path.join(stage, name)).isFile()) fail('NPM_STAGE_MANIFEST_NOT_REGULAR');
  }
  if (!toolsPreserved(tool)) fail('NPM_TOOL_IDENTITIES_CHANGED');
  const privateDir = fs.mkdtempSync(path.join(reportDir, 'npm-run-'));
  fs.chmodSync(privateDir, 0o700);
  for (const child of ['cache', 'logs', 'tmp']) fs.mkdirSync(path.join(privateDir, child), { mode: 0o700 });
  const userConfig = path.join(privateDir, 'empty-user.npmrc');
  const globalConfig = path.join(privateDir, 'empty-global.npmrc');
  for (const file of [userConfig, globalConfig]) fs.writeFileSync(file, '', { flag: 'wx', mode: 0o600 });
  const logPath = path.join(privateDir, 'npm-ci.log');
  const logFd = fs.openSync(logPath, 'wx', 0o600);
  const args = [
    tool.cli.resolved, 'ci', `--prefix=${stage}`, '--global=false', '--workspaces=false',
    '--ignore-scripts=true', '--audit=false', '--fund=false', '--update-notifier=false',
    '--progress=false', '--color=false', '--include=dev', '--include=optional', '--include=peer',
    '--legacy-peer-deps=false', '--strict-peer-deps=false', '--force=false',
    '--registry=https://registry.npmjs.org/', `--userconfig=${userConfig}`, `--globalconfig=${globalConfig}`,
    `--cache=${path.join(privateDir, 'cache')}`, `--logs-dir=${path.join(privateDir, 'logs')}`,
    '--fetch-retries=1', '--fetch-timeout=60000', '--logs-max=0',
  ];
  const env = {
    PATH: path.dirname(tool.node.resolved), LANG: 'C', LC_ALL: 'C', NO_COLOR: '1',
    TMPDIR: path.join(privateDir, 'tmp'),
  };
  const startedAt = Date.now();
  const result = {
    name: 'npm-ci-private-locked-stage', attempts: 1, attempted: true, started: false,
    exitCode: null, signal: null, timedOut: false, interruptedBy: null,
    interrupted: false, outputLimitExceeded: false, logLimitExceeded: false, spawnErrorCode: null, errorCodes: [],
    npmVersion: tool.version, privateDirectory: privateDir, logFile: logPath,
    lifecycleScriptsEnabled: false, networkActivity: 'PERMITTED_NOT_COUNTED',
  };
  let logged = 0;
  let child, timeout, heartbeat, forceKill;
  let closing = false;
  const requestStop = () => {
    if (closing || !child || child.exitCode !== null || child.signalCode !== null) return;
    try { child.kill('SIGTERM'); } catch { result.childSignalFailed = true; }
    if (!forceKill) forceKill = setTimeout(() => {
      if (!closing && child.exitCode === null && child.signalCode === null) {
        try { child.kill('SIGKILL'); } catch { result.childSignalFailed = true; }
      }
    }, 5000);
  };
  const onInterrupt = signal => {
    result.interruptedBy = signal;
    result.interrupted = true;
    requestStop();
  };
  const onSigint = () => onInterrupt('SIGINT');
  const onSigterm = () => onInterrupt('SIGTERM');
  const onProgressError = () => { result.progressWriteFailed = true; requestStop(); };
  const writeLog = chunk => {
    const bytes = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    const remaining = LOG_LIMIT - logged;
    if (remaining > 0) {
      const selected = bytes.subarray(0, remaining);
      try {
        let written = 0;
        while (written < selected.length) written += fs.writeSync(logFd, selected, written, selected.length - written);
        logged += selected.length;
      }
      catch { result.logWriteFailed = true; requestStop(); }
    }
    if (bytes.length > remaining) { result.outputLimitExceeded = true; result.logLimitExceeded = true; requestStop(); }
  };
  try {
    await new Promise(resolve => {
      process.on('SIGINT', onSigint);
      process.on('SIGTERM', onSigterm);
      process.stdout.on('error', onProgressError);
      try {
        child = spawn(tool.node.resolved, args, { cwd: stage, env, shell: false, stdio: ['ignore', 'pipe', 'pipe'] });
      } catch (error) {
        result.spawnErrorCode = /^[A-Z0-9_]{1,48}$/.test(error.code || '') ? error.code : 'UNKNOWN';
        resolve();
        return;
      }
      child.once('spawn', () => { result.started = true; });
      child.stdout.on('data', writeLog);
      child.stderr.on('data', writeLog);
      child.stdout.on('error', () => { result.streamError = true; requestStop(); });
      child.stderr.on('error', () => { result.streamError = true; requestStop(); });
      child.once('error', error => {
        result.spawnErrorCode = /^[A-Z0-9_]{1,48}$/.test(error.code || '') ? error.code : 'UNKNOWN';
      });
      child.once('close', (code, signal) => {
        closing = true;
        result.exitCode = code;
        result.signal = signal;
        resolve();
      });
      timeout = setTimeout(() => { result.timedOut = true; requestStop(); }, RUN_TIMEOUT);
      heartbeat = setInterval(() => {
        if (process.stdout.destroyed || !process.stdout.writable) { onProgressError(); return; }
        try { process.stdout.write(`NPM_CI_PROGRESS=RUNNING ELAPSED_SECONDS=${Math.floor((Date.now() - startedAt) / 1000)} LOG_BYTES=${logged}\n`); }
        catch { onProgressError(); }
      }, 30000);
    });
  } catch (error) {
    error.processResult = result;
    throw error;
  } finally {
    closing = true;
    clearTimeout(timeout);
    clearTimeout(forceKill);
    clearInterval(heartbeat);
    process.removeListener('SIGINT', onSigint);
    process.removeListener('SIGTERM', onSigterm);
    process.stdout.removeListener('error', onProgressError);
    try { fs.closeSync(logFd); } catch (error) { error.processResult = result; throw error; }
  }
  try {
  result.durationMs = Date.now() - startedAt;
  result.logIdentity = regularIdentity(logPath, LOG_LIMIT);
  const log = fs.readFileSync(logPath, 'utf8');
  result.errorCodes = [...new Set([...log.matchAll(/(?:npm\s+(?:error|ERR!)[ \t]+code[ \t]+)([A-Z][A-Z0-9_]+)/g)]
    .map(match => match[1]).filter(code => NPM_CODES.has(code)))].sort();
  result.toolIdentitiesPreserved = toolsPreserved(tool);
  result.status = result.started && result.exitCode === 0 && !result.signal && !result.timedOut &&
    !result.interruptedBy && !result.outputLimitExceeded && !result.logWriteFailed && !result.progressWriteFailed && !result.streamError && !result.childSignalFailed && !result.spawnErrorCode && result.toolIdentitiesPreserved
    ? 'NPM_CI_PROCESS_PASS_PENDING_TREE_VERIFICATION' : 'NPM_CI_PROCESS_FAILED';
  result.scope = 'NPM_PROCESS_ONLY_NOT_NATIVE_TOOL_BUILD_APPLICATION_OR_RELEASE_QUALIFICATION';
  return result;
  } catch (error) { error.processResult = result; throw error; }
}
