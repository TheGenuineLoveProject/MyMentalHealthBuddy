import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import { discoverNpm, runNpm } from './locked-npm-runner-r16.mjs';

// Inert CLI fixtures only: no npm, network, install, lifecycle, or app execution.
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'mmhb-r16-npm-runner-fixtures-'));
fs.chmodSync(root, 0o700);
const results = [];
let count = 0;
function fixture(source = 'process.exit(0);', version = '11.9.0', config) {
  const base = path.join(root, `case-${++count}`);
  const npm = path.join(base, 'lib/node_modules/npm');
  fs.mkdirSync(path.join(npm, 'bin'), { recursive: true });
  fs.mkdirSync(path.join(base, 'bin'));
  const cli = path.join(npm, 'bin/npm-cli.js');
  fs.writeFileSync(cli, `#!/usr/bin/env node\n${source}\n`, { mode: 0o700 });
  fs.writeFileSync(path.join(npm, 'package.json'), JSON.stringify({ name: 'npm', version }));
  if (config !== undefined) fs.writeFileSync(path.join(npm, 'npmrc'), config);
  fs.symlinkSync('../lib/node_modules/npm/bin/npm-cli.js', path.join(base, 'bin/npm'));
  const report = path.join(base, 'report');
  const stage = path.join(report, 'stage');
  fs.mkdirSync(stage, { recursive: true, mode: 0o700 });
  for (const name of ['package.json', 'package-lock.json']) fs.writeFileSync(path.join(stage, name), '{}');
  return { base, npm, cli, report, stage, searchPath: path.join(base, 'bin') };
}
function tool(f) { return discoverNpm(f.searchPath, process.execPath); }
async function test(name, operation) {
  try { await operation(); results.push({ name, status: 'PASS' }); }
  catch (error) { results.push({ name, status: 'FAIL', error: error.message }); throw error; }
}
await test('Standard npm symlink and stable discovery identities', () => {
  const f = fixture(); const a = tool(f); const b = tool(f);
  assert.equal(a.version, '11.9.0'); assert.equal(a.cli.resolved, f.cli);
  assert.deepEqual(a, b);
});
await test('Unsupported npm major rejected without execution', () => {
  const f = fixture('throw new Error("MUST_NOT_EXECUTE")', '9.9.9');
  assert.throws(() => tool(f), { code: 'NPM_CLI_VERSION_UNSUPPORTED' });
});
await test('Scoped registry setting rejected without revealing value', () => {
  const f = fixture('', '11.9.0', '@private:registry=https://secret.example/\n');
  try { tool(f); assert.fail('accepted'); } catch (e) {
    assert.equal(e.code, 'NPM_BUILTIN_CONFIG_UNREVIEWED');
    assert.ok(!JSON.stringify(e).includes('secret.example'));
  }
});
await test('Only fixed harmless distribution paths accepted', () => {
  const f = fixture('', '11.9.0', '# paths\nprefix=/nix/store/npm\nglobalconfig=/nix/store/npm/etc/npmrc\nnode_gyp=/nix/store/npm/node-gyp.js\n');
  assert.deepEqual(tool(f).builtinConfig.keys, ['globalconfig', 'node_gyp', 'prefix']);
});
await test('Builtin variable expansion rejected', () => {
  const f = fixture('', '11.9.0', 'prefix=${SOME_ENV}\n');
  assert.throws(() => tool(f), { code: 'NPM_BUILTIN_CONFIG_UNREVIEWED_VALUE' });
});
await test('Dangling builtin config does not count as absent', () => {
  const f = fixture(); fs.symlinkSync('missing', path.join(f.npm, 'npmrc'));
  assert.throws(() => tool(f), { code: 'NPM_TOOL_FILE_UNAVAILABLE' });
});
await test('Unqualified copied wrapper layout rejected without execution', () => {
  const f = fixture(); const executable = path.join(f.base, 'bin/npm');
  fs.unlinkSync(executable); fs.writeFileSync(executable, '#!/usr/bin/env node\nthrow new Error("NEVER_RUN");\n', { mode: 0o700 });
  assert.throws(() => tool(f), { code: 'NPM_EXECUTABLE_LAYOUT_UNSUPPORTED' });
});
await test('Stage with extra file rejected before child starts', async () => {
  const f = fixture(); fs.writeFileSync(path.join(f.stage, 'unqualified'), '');
  await assert.rejects(runNpm(tool(f), f.stage, f.report), { code: 'NPM_STAGE_NOT_FRESH_MANIFEST_PAIR' });
});
await test('Success uses explicit fixed flags and credential-free child environment', async () => {
  const f = fixture('const fs=require("node:fs"); fs.writeFileSync("observed.json",JSON.stringify({args:process.argv.slice(2),env:process.env,cwd:process.cwd()}));');
  process.env.MMHB_FIXTURE_SECRET = 'synthetic-fixture-only';
  process.env.npm_config_registry = 'https://unqualified.example/';
  let result;
  try { result = await runNpm(tool(f), f.stage, f.report); }
  finally { delete process.env.MMHB_FIXTURE_SECRET; delete process.env.npm_config_registry; }
  assert.equal(result.status, 'NPM_CI_PROCESS_PASS_PENDING_TREE_VERIFICATION');
  assert.equal(result.attempted, true); assert.equal(result.started, true);
  const observed = JSON.parse(fs.readFileSync(path.join(f.stage, 'observed.json')));
  assert.equal(observed.cwd, f.stage);
  assert.deepEqual(Object.keys(observed.env).sort(), ['LANG', 'LC_ALL', 'NO_COLOR', 'PATH', 'TMPDIR']);
  for (const arg of ['ci', `--prefix=${f.stage}`, '--ignore-scripts=true', '--workspaces=false', '--logs-max=0', '--registry=https://registry.npmjs.org/', '--legacy-peer-deps=false']) assert.ok(observed.args.includes(arg));
  assert.equal(result.logIdentity.bytes, 0);
});
await test('Nonzero npm code reported; raw log text stays in private file', async () => {
  const f = fixture('process.stderr.write("npm error code ERESOLVE\\nSYNTHETIC_PRIVATE_LOG_MARKER\\n"); process.exitCode=1;');
  const result = await runNpm(tool(f), f.stage, f.report);
  assert.equal(result.exitCode, 1); assert.deepEqual(result.errorCodes, ['ERESOLVE']);
  assert.ok(!JSON.stringify(result).includes('SYNTHETIC_PRIVATE_LOG_MARKER'));
  assert.equal(fs.statSync(result.logFile).mode & 0o777, 0o600);
});
await test('SIGTERM closes owned child and returns interrupted evidence', async () => {
  const f = fixture('require("node:fs").writeFileSync("pid.txt",String(process.pid)); setInterval(()=>{},1000);');
  const timer = setTimeout(() => process.kill(process.pid, 'SIGTERM'), 1000);
  const result = await runNpm(tool(f), f.stage, f.report); clearTimeout(timer);
  assert.equal(result.interrupted, true); assert.equal(result.interruptedBy, 'SIGTERM');
  assert.equal(result.signal, 'SIGTERM');
  const pid = Number(fs.readFileSync(path.join(f.stage, 'pid.txt'), 'utf8'));
  assert.throws(() => process.kill(pid, 0), { code: 'ESRCH' });
});
await test('Output cap stops child and retains exactly bounded log', async () => {
  const f = fixture('process.stdout.write(Buffer.alloc(17*1024*1024,120)); setInterval(()=>{},1000);');
  const result = await runNpm(tool(f), f.stage, f.report);
  assert.equal(result.logLimitExceeded, true); assert.equal(result.logIdentity.bytes, 16 * 1024 * 1024);
  assert.equal(result.status, 'NPM_CI_PROCESS_FAILED');
});
await test('Tool mutation during child is detected after exit', async () => {
  const f = fixture('require("node:fs").appendFileSync(__filename,"\\n// changed by inert fixture\\n");');
  const result = await runNpm(tool(f), f.stage, f.report);
  assert.equal(result.toolIdentitiesPreserved, false);
  assert.equal(result.status, 'NPM_CI_PROCESS_FAILED');
});
await test('Timeout and forced termination with fixture-accelerated timers', async () => {
  const f = fixture('process.on("SIGTERM",()=>{}); require("node:fs").writeFileSync("pid.txt",String(process.pid)); setInterval(()=>{},1000);');
  const originalTimeout = globalThis.setTimeout;
  globalThis.setTimeout = (fn, ms, ...args) => originalTimeout(fn, ms === 900000 ? 250 : ms === 5000 ? 100 : ms, ...args);
  let result;
  try { result = await runNpm(tool(f), f.stage, f.report); }
  finally { globalThis.setTimeout = originalTimeout; }
  assert.equal(result.timedOut, true); assert.equal(result.signal, 'SIGKILL');
  assert.equal(result.status, 'NPM_CI_PROCESS_FAILED');
  const pid = Number(fs.readFileSync(path.join(f.stage, 'pid.txt'), 'utf8'));
  assert.throws(() => process.kill(pid, 0), { code: 'ESRCH' });
});
await test('Heartbeat EPIPE closes child with fixture-accelerated interval', async () => {
  const f = fixture('require("node:fs").writeFileSync("pid.txt",String(process.pid)); setInterval(()=>{},1000);');
  const originalInterval = globalThis.setInterval;
  const originalWrite = process.stdout.write;
  globalThis.setInterval = (fn, ms, ...args) => originalInterval(fn, ms === 30000 ? 250 : ms, ...args);
  process.stdout.write = function () { const error = new Error('synthetic EPIPE'); error.code = 'EPIPE'; process.stdout.emit('error', error); return false; };
  let result;
  try { result = await runNpm(tool(f), f.stage, f.report); }
  finally { globalThis.setInterval = originalInterval; process.stdout.write = originalWrite; }
  assert.equal(result.progressWriteFailed, true); assert.equal(result.signal, 'SIGTERM');
  assert.equal(result.status, 'NPM_CI_PROCESS_FAILED');
  const pid = Number(fs.readFileSync(path.join(f.stage, 'pid.txt'), 'utf8'));
  assert.throws(() => process.kill(pid, 0), { code: 'ESRCH' });
});
console.log(JSON.stringify({ scope: 'INERT_CLI_FIXTURES_ONLY_NO_NPM_OR_NETWORK', results }, null, 2));
