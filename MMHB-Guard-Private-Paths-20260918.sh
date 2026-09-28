#!/usr/bin/env bash
# MMHB only. Applies one middleware guard and its regression check.
# No installs, application startup, database access, build or publication.
env -u NODE_OPTIONS -u NODE_PATH node --no-global-search-paths --input-type=module <<'MMHB_PRIVATE_PATH_GUARD'
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
const root = fs.realpathSync('.');
const say = value => console.log(JSON.stringify(value));
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const fail = code => { throw Object.assign(new Error(code), { code }); };
const read = rel => {
  const full = path.join(root, rel);
  const stat = fs.lstatSync(full);
  if (!stat.isFile() || fs.realpathSync(full) !== full || stat.size > 2097152)
    fail('FILE_NEEDS_REVIEW');
  return fs.readFileSync(full);
};
const run = (args, input) => {
  const child = spawnSync(process.execPath, args, {
    input, encoding: 'utf8', timeout: 15000, maxBuffer: 1048576,
    env: { ...process.env, NODE_OPTIONS: '', NODE_PATH: '' }
  });
  if (child.status !== 0 || child.error) fail('LOCAL_CHECK_FAILED');
  return child.stdout;
};
const guard = "// MMHB_SENSITIVE_PATH_GUARD_V1_BEGIN\n// Reject hidden-file probes before any router, static handler or SPA fallback.\n// Root .well-known remains available for public verification documents.\napp.use(function mmhbSensitivePathGuard(req, res, next) {\n  const reject = (status) => {\n    res.setHeader(\"Cache-Control\", \"no-store\");\n    res.setHeader(\"X-Content-Type-Options\", \"nosniff\");\n    return res.status(status).type(\"text/plain\").send(\n      status === 404 ? \"Not found\" : \"Bad request\"\n    );\n  };\n  let pathname = (req.originalUrl || req.url || \"/\").split(\"?\")[0];\n  try {\n    pathname = decodeURIComponent(pathname);\n  } catch {\n    return reject(400);\n  }\n  // Inspect repeated encodings without rewriting the URL used by other routes.\n  for (let depth = 0; depth <= 4; depth += 1) {\n    const segments = pathname.split(/[\\\\/]+/).filter(Boolean);\n    if (segments.some((segment, index) =>\n      segment.startsWith(\".\") && !(index === 0 && segment === \".well-known\")\n    )) return reject(404);\n    const decoded = pathname.replace(/%(25|2e|2f|5c)/gi,\n      (_, hex) => String.fromCharCode(parseInt(hex, 16)));\n    if (decoded === pathname) return next();\n    pathname = decoded;\n  }\n  return reject(400);\n});\n// MMHB_SENSITIVE_PATH_GUARD_V1_END";
const verifier = "// Run without importing the application, connecting to a DB or starting it.\nimport fs from 'node:fs';\nimport vm from 'node:vm';\nimport assert from 'node:assert/strict';\nimport { fileURLToPath } from 'node:url';\n\nconst appFile = process.argv[2] || fileURLToPath(new URL('../../server/app.mjs', import.meta.url));\nconst source = fs.readFileSync(appFile, 'utf8');\nconst begin = '// MMHB_SENSITIVE_PATH_GUARD_V1_BEGIN';\nconst end = '// MMHB_SENSITIVE_PATH_GUARD_V1_END';\nconst anchor = 'const app = express();';\nassert.equal(source.split(begin).length, 2, 'guard must occur once');\nassert.equal(source.split(end).length, 2, 'guard end must occur once');\nassert.equal(source.split(anchor).length, 2, 'app init must occur once');\nconst start = source.indexOf(begin);\nconst finish = source.indexOf(end) + end.length;\nassert.equal(source.slice(source.indexOf(anchor) + anchor.length, start).trim(), '',\n  'guard must be the first middleware after app init');\nassert.ok(source.indexOf('app.use(express.static(') > finish, 'guard must precede static files');\nassert.ok(source.indexOf('console.log(\"[SPA ROUTE]\"') > finish, 'guard must precede SPA fallback');\nlet middleware;\nnew vm.Script(source.slice(start, finish)).runInNewContext({\n  app: { use(fn) { assert.equal(middleware, undefined); middleware = fn; } },\n}, { timeout: 1000 });\nassert.equal(typeof middleware, 'function');\n\nconst blocked = [\n  '/.env', '/.env.production', '/.env.test', '/.env.bak', '/.env~',\n  '/backend/.env', '/server/.env', '/admin/.env', '/config/.env',\n  '/app/.env.production', '/.git/config', '/.svn/entries', '/.hg/store',\n  '/a/.hidden/file', '/.env?download=1', '/%2eenv', '/.%65nv',\n  '/%2Egit/config', '/backend%2f.env', '/backend%5c.env',\n  '/backend\\\\.env', '/%252eenv', '/%25252eenv', '/%2525252eenv',\n  '/backend%252f%252eenv', '/.well-known/.env', '/.well-known/%252eenv',\n  '/.well-known/../.env', '/a/.well-known/test', '/.well-known-secret',\n];\nconst allowed = [\n  '/', '/health', '/crisis', '/login', '/dashboard', '/journal',\n  '/api/auth/user', '/api/streaks/checkin', '/api/ai/chat',\n  '/assets/index-Dxetk6sK.js', '/brand/favicon.svg', '/robots.txt',\n  '/service-worker.js', '/.well-known/acme-challenge/public-token',\n  '/.well-known/security.txt', '/.well-known/assetlinks.json',\n  '/.well-known/apple-app-site-association', '/search?q=/.env',\n  '/articles/self-worth', '/articles/100%25', '/articles/caf%C3%A9',\n  '/article/my.env.notes',\n];\nconst malformed = ['/bad%ZZ', '/bad%', '/%ff'];\nlet checks = 0;\nfor (const method of ['GET', 'HEAD', 'POST']) {\n  for (const [paths, expected] of [[blocked, 404], [allowed, null], [malformed, 400]]) {\n    for (const url of paths) {\n      const req = { originalUrl: url, url, method };\n      const before = JSON.stringify(req);\n      const headers = {};\n      let status = null, body = null, type = null, nextCalls = 0, sends = 0;\n      const res = {\n        setHeader(k, v) { headers[k] = v; },\n        status(v) { status = v; return this; },\n        type(v) { type = v; return this; },\n        send(v) { body = v; sends += 1; return this; },\n      };\n      middleware(req, res, () => { nextCalls += 1; });\n      const label = method + ' ' + url;\n      assert.equal(status, expected, label);\n      assert.equal(nextCalls, expected === null ? 1 : 0, label);\n      assert.equal(sends, expected === null ? 0 : 1, label);\n      assert.equal(JSON.stringify(req), before, 'URL must remain unchanged: ' + label);\n      if (expected !== null) {\n        assert.equal(headers['Cache-Control'], 'no-store', label);\n        assert.equal(headers['X-Content-Type-Options'], 'nosniff', label);\n        assert.equal(type, 'text/plain', label);\n        assert.equal(body, expected === 404 ? 'Not found' : 'Bad request', label);\n      }\n      checks += 1;\n    }\n  }\n}\nconsole.log(JSON.stringify({ status: 'PATH_GUARD_TESTS_PASSED', checks,\n  testScope: 'isolated_middleware_and_source_order', applicationStarted: false,\n  databaseConnected: false, productionVerified: false }));\n";

const anchor = 'const app = express();';
const marker = '// MMHB_SENSITIVE_PATH_GUARD_V1_BEGIN';
const appRel = 'server/app.mjs';
const testRel = 'scripts/security/verify-sensitive-path-guard.mjs';
let staging, backup = null;
const writes = [];
const temporaryFiles = [];
try {
  if (JSON.parse(read('package.json')).name !== 'mymentalhealthbuddy') fail('WRONG_PROJECT');
  const oldApp = read(appRel);
  const source = oldApp.toString('utf8');
  if (source.split(anchor).length !== 2 ||
      !source.includes('app.use(express.static(') ||
      !source.includes('console.log("[SPA ROUTE]"')) fail('APP_LAYOUT_NEEDS_REVIEW');
  const already = source.includes(marker);
  if (already && !source.includes(guard)) fail('EXISTING_GUARD_NEEDS_REVIEW');
  const candidate = already ? source : source.replace(anchor, anchor + '\n\n' + guard);
  const testPath = path.join(root, testRel);
  const testParent = path.dirname(testPath);
  if (!fs.statSync(testParent).isDirectory() || fs.realpathSync(testParent) !== testParent)
    fail('TEST_FOLDER_NEEDS_REVIEW');
  let oldTest = null;
  try { oldTest = read(testRel); } catch (err) { if (err.code !== 'ENOENT') throw err; }
  if (oldTest && oldTest.toString('utf8') !== verifier) fail('EXISTING_TEST_NEEDS_REVIEW');
  const planned = [
    { rel: appRel, before: oldApp, after: Buffer.from(candidate) },
    { rel: testRel, before: oldTest, after: Buffer.from(verifier) }
  ].filter(item => !item.before || !item.before.equals(item.after));
  staging = fs.mkdtempSync(path.join(os.tmpdir(), 'mmhb-path-guard-check-'));
  fs.writeFileSync(path.join(staging, 'app.mjs'), candidate, { mode: 0o600 });
  fs.writeFileSync(path.join(staging, 'verify.mjs'), verifier, { mode: 0o600 });
  run(['--input-type=module', '--check'], candidate);
  run(['--input-type=module', '--check'], verifier);
  const checked = JSON.parse(run([path.join(staging, 'verify.mjs'), path.join(staging, 'app.mjs')]).trim());
  if (checked.status !== 'PATH_GUARD_TESTS_PASSED') fail('TEST_RESULT_NEEDS_REVIEW');
  say(checked);
  if (planned.length) {
    // Backup stays outside public/static folders and the published project tree.
    backup = fs.mkdtempSync(path.join(os.tmpdir(), 'mmhb-path-guard-backup-'));
    for (const item of planned) {
      if (item.before) fs.writeFileSync(path.join(backup, path.basename(item.rel)), item.before, { mode: 0o600 });
    }
    fs.writeFileSync(path.join(backup, 'manifest.json'), JSON.stringify({ root,
      files: planned.map(item => ({ file: item.rel, beforeSha256: item.before ? sha(item.before) : null,
        afterSha256: sha(item.after) })) }, null, 2), { mode: 0o600 });
    for (const item of planned) {
      const target = path.join(root, item.rel);
      if (item.before) {
        if (!read(item.rel).equals(item.before)) fail('SOURCE_CHANGED_DURING_CHECK');
      } else if (fs.existsSync(target)) fail('SOURCE_CHANGED_DURING_CHECK');
      const temp = target + '.mmhb-stage-' + crypto.randomBytes(8).toString('hex');
      temporaryFiles.push(temp);
      const mode = item.before ? (fs.statSync(target).mode & 0o777) : 0o644;
      fs.writeFileSync(temp, item.after, { flag: 'wx', mode });
      fs.renameSync(temp, target);
      writes.push(item);
    }
  }
  say({ status: already ? 'PATH_GUARD_ALREADY_PRESENT' : 'PATH_GUARD_SOURCE_READY',
    checks: checked.checks, sourceFilesChanged: writes.length, backup,
    serverSha256: sha(read(appRel)), applicationStarted: false, databaseConnected: false,
    buildRuns: 0, deploymentRuns: 0, publishedSiteVerified: false });
} catch (err) {
  let rollbackComplete = true;
  for (const item of [...writes].reverse()) {
    try {
      if (!read(item.rel).equals(item.after)) { rollbackComplete = false; continue; }
      if (item.before) fs.writeFileSync(path.join(root, item.rel), item.before);
      else fs.unlinkSync(path.join(root, item.rel));
    } catch { rollbackComplete = false; }
  }
  say({ status: 'STOP', reason: err.code || 'CHECK_FAILED', backup, rollbackComplete,
    buildRuns: 0, deploymentRuns: 0 });
  process.exitCode = 1;
} finally {
  for (const file of temporaryFiles) { try { fs.unlinkSync(file); } catch {} }
  if (staging) fs.rmSync(staging, { recursive: true, force: true });
}
MMHB_PRIVATE_PATH_GUARD
