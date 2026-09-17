node --input-type=module <<'MMHB_RUNTIME'
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import net from 'node:net';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
const root = fs.realpathSync('.');
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
const say = value => console.log(JSON.stringify(value));
let folder, child, closed, exited = false, timer, log = '', reason = null, port;
const checks = [];
const collect = chunk => { log = (log + chunk.toString()).slice(-131072); };
const read = file => {
  const full = path.join(root, file);
  if (!fs.lstatSync(full).isFile() || fs.realpathSync(full) !== full)
    throw Error('UNEXPECTED_FILE: ' + file);
  return fs.readFileSync(full);
};
async function request(route) {
  const response = await fetch('http://127.0.0.1:' + port + route, {
    redirect:'manual', signal:AbortSignal.timeout(4000)
  });
  const reader = response.body?.getReader();
  let size = 0; const chunks = [];
  if (reader) {
    try {
      while (size < 524288) {
        const {done, value} = await reader.read();
        if (done) break;
        const part = value.subarray(0, 524288 - size);
        chunks.push(Buffer.from(part)); size += part.length;
      }
    } finally { await reader.cancel(); }
  }
  return {status:response.status, type:response.headers.get('content-type') || '',
    body:Buffer.concat(chunks).toString('utf8')};
}
try {
  if (JSON.parse(read('package.json')).name !== 'mymentalhealthbuddy') throw Error('WRONG_PROJECT');
  const expected = '9e046524ba1e77b5202c0bbe895b8a6a430e38b5188b1a2f2613525a183c4816';
  if (sha(read('scripts/build-server.mjs')) !== expected) throw Error('BUILD_SCRIPT_CHANGED');
  for (const name of ['DATABASE_URL','SESSION_SECRET','REPL_ID'])
    if (!process.env[name]) throw Error('MISSING_WORKSPACE_SETTING: ' + name);
  const bundleHash = sha(read('dist/server.mjs'));
  read('dist/client/dist/index.html');
  for (const name of ['speakeasy','base32.js']) read('dist/node_modules/' + name + '/package.json');
  if (fs.lstatSync('dist').isSymbolicLink()) throw Error('UNEXPECTED_DIST_PATH');
  folder = fs.mkdtempSync(path.join(os.tmpdir(), 'mmhb-runtime-check-'));
  fs.chmodSync(folder, 0o700);
  const artifact = path.join(folder, 'app');
  fs.cpSync(path.join(root, 'dist'), artifact, {recursive:true, dereference:true});
  if (sha(fs.readFileSync(path.join(artifact,'server.mjs'))) !== bundleHash)
    throw Error('BUNDLE_CHANGED_DURING_COPY');
  for (let parent = folder; ; parent = path.dirname(parent)) {
    if (fs.existsSync(path.join(parent,'node_modules'))) throw Error('ISOLATION_PARENT_HAS_NODE_MODULES');
    if (parent === path.dirname(parent)) break;
  }
  const reservation = net.createServer();
  await new Promise((resolve, reject) => { reservation.once('error', reject); reservation.listen(0, '0.0.0.0', resolve); });
  port = reservation.address().port;
  await new Promise((resolve, reject) => reservation.close(error => error ? reject(error) : resolve()));
  const env = {...process.env, NODE_ENV:'production', PORT:String(port)};
  delete env.NODE_PATH; delete env.NODE_OPTIONS;
  say({status:'STARTING_TEMPORARY_PRODUCTION_COPY', folder, port,
    configuration:'workspace', normalDatabaseStartup:true});
  child = spawn(process.execPath, ['--no-global-search-paths', 'server.mjs'], {
    cwd:artifact, env, stdio:['ignore','pipe','pipe']
  });
  child.stdout.on('data', collect); child.stderr.on('data', collect);
  child.on('error', error => { reason = 'START_FAILED: ' + error.code; });
  closed = new Promise(resolve => child.once('close', () => { exited = true; resolve(); }));
  timer = setTimeout(() => { reason ||= 'RUNTIME_DEADLINE'; if (!exited) child.kill('SIGTERM'); }, 60000);
  const deadline = Date.now() + 40000;
  let ready = false;
  while (!exited && !reason && Date.now() < deadline) {
    if (log.includes('[SERVER] Listening on port ' + port)) {
      try { ready = (await request('/health')).status === 200; } catch {}
      if (ready) break;
    }
    await pause(250);
  }
  if (!ready) throw Error(exited ? 'PRODUCTION_PROCESS_EXITED' : 'STARTUP_NOT_READY');
  let home;
  for (const route of ['/health','/','/crisis']) {
    const response = await request(route);
    const passed = response.status === 200 && (route === '/health' ||
      (response.type.includes('text/html') && /id\s*=\s*["']root["']/.test(response.body)));
    checks.push({route, status:response.status, passed});
    if (!passed) throw Error('HTTP_CHECK_FAILED: ' + route);
    if (route === '/') home = response.body;
  }
  const asset = home.match(/<script\b[^>]*\bsrc=["'](\/assets\/[^"']+\.js(?:\?[^"']*)?)["']/i)?.[1];
  if (!asset) throw Error('HOMEPAGE_JAVASCRIPT_REFERENCE_MISSING');
  const javascript = await request(asset);
  const assetPassed = javascript.status === 200 && /javascript/.test(javascript.type) && javascript.body.length > 0;
  checks.push({route:asset, status:javascript.status, passed:assetPassed});
  if (!assetPassed) throw Error('JAVASCRIPT_ASSET_CHECK_FAILED');
  await pause(2000);
  if (exited || (await request('/health')).status !== 200) throw Error('PROCESS_STOPPED_AFTER_STARTUP');
  if (sha(read('dist/server.mjs')) !== bundleHash) throw Error('WORKSPACE_BUNDLE_CHANGED_DURING_CHECK');
} catch (error) { reason ||= error.message; }
finally {
  clearTimeout(timer);
  if (child && !exited) {
    child.kill('SIGTERM');
    await Promise.race([closed, pause(3000)]);
    if (!exited) { child.kill('SIGKILL'); await Promise.race([closed, pause(3000)]); }
    if (!exited) reason ||= 'TEST_PROCESS_CLEANUP_FAILED';
  }
}
const missing = [...new Set([...log.matchAll(/Cannot find (?:module|package) ['"]([^'"\n]+)['"]/g)].map(m => m[1]))];
const report = {status:reason ? 'STOP' : 'LOCAL_ARTIFACT_HTTP_CHECK_PASSED', reason,
  checks, missingModules:missing, processExitCode:child?.exitCode ?? null,
  processSignal:child?.signalCode ?? null, testProcessStopped:exited, folder:folder ?? null,
  sourceFilesChanged:0, deploymentRuns:0, publishedSiteVerified:false,
  schemaWarningObserved:/ensureSchema[^\n]*(?:failed|skipped)/i.test(log)};
if (folder) {
  fs.writeFileSync(path.join(folder,'runtime.log'), log, {mode:0o600});
  fs.writeFileSync(path.join(folder,'result.json'), JSON.stringify(report,null,2), {mode:0o600});
}
say(report);
if (reason) process.exitCode = 1;
MMHB_RUNTIME
