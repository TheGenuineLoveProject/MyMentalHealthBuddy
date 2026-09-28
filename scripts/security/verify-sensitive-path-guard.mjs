// Run without importing the application, connecting to a DB or starting it.
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const appFile = process.argv[2] || fileURLToPath(new URL('../../server/app.mjs', import.meta.url));
const source = fs.readFileSync(appFile, 'utf8');
const begin = '// MMHB_SENSITIVE_PATH_GUARD_V1_BEGIN';
const end = '// MMHB_SENSITIVE_PATH_GUARD_V1_END';
const anchor = 'const app = express();';
assert.equal(source.split(begin).length, 2, 'guard must occur once');
assert.equal(source.split(end).length, 2, 'guard end must occur once');
assert.equal(source.split(anchor).length, 2, 'app init must occur once');
const start = source.indexOf(begin);
const finish = source.indexOf(end) + end.length;
assert.equal(source.slice(source.indexOf(anchor) + anchor.length, start).trim(), '',
  'guard must be the first middleware after app init');
assert.ok(source.indexOf('app.use(express.static(') > finish, 'guard must precede static files');
assert.ok(source.indexOf('console.log("[SPA ROUTE]"') > finish, 'guard must precede SPA fallback');
let middleware;
new vm.Script(source.slice(start, finish)).runInNewContext({
  app: { use(fn) { assert.equal(middleware, undefined); middleware = fn; } },
}, { timeout: 1000 });
assert.equal(typeof middleware, 'function');

const blocked = [
  '/.env', '/.env.production', '/.env.test', '/.env.bak', '/.env~',
  '/backend/.env', '/server/.env', '/admin/.env', '/config/.env',
  '/app/.env.production', '/.git/config', '/.svn/entries', '/.hg/store',
  '/a/.hidden/file', '/.env?download=1', '/%2eenv', '/.%65nv',
  '/%2Egit/config', '/backend%2f.env', '/backend%5c.env',
  '/backend\\.env', '/%252eenv', '/%25252eenv', '/%2525252eenv',
  '/backend%252f%252eenv', '/.well-known/.env', '/.well-known/%252eenv',
  '/.well-known/../.env', '/a/.well-known/test', '/.well-known-secret',
];
const allowed = [
  '/', '/health', '/crisis', '/login', '/dashboard', '/journal',
  '/api/auth/user', '/api/streaks/checkin', '/api/ai/chat',
  '/assets/index-Dxetk6sK.js', '/brand/favicon.svg', '/robots.txt',
  '/service-worker.js', '/.well-known/acme-challenge/public-token',
  '/.well-known/security.txt', '/.well-known/assetlinks.json',
  '/.well-known/apple-app-site-association', '/search?q=/.env',
  '/articles/self-worth', '/articles/100%25', '/articles/caf%C3%A9',
  '/article/my.env.notes',
];
const malformed = ['/bad%ZZ', '/bad%', '/%ff'];
let checks = 0;
for (const method of ['GET', 'HEAD', 'POST']) {
  for (const [paths, expected] of [[blocked, 404], [allowed, null], [malformed, 400]]) {
    for (const url of paths) {
      const req = { originalUrl: url, url, method };
      const before = JSON.stringify(req);
      const headers = {};
      let status = null, body = null, type = null, nextCalls = 0, sends = 0;
      const res = {
        setHeader(k, v) { headers[k] = v; },
        status(v) { status = v; return this; },
        type(v) { type = v; return this; },
        send(v) { body = v; sends += 1; return this; },
      };
      middleware(req, res, () => { nextCalls += 1; });
      const label = method + ' ' + url;
      assert.equal(status, expected, label);
      assert.equal(nextCalls, expected === null ? 1 : 0, label);
      assert.equal(sends, expected === null ? 0 : 1, label);
      assert.equal(JSON.stringify(req), before, 'URL must remain unchanged: ' + label);
      if (expected !== null) {
        assert.equal(headers['Cache-Control'], 'no-store', label);
        assert.equal(headers['X-Content-Type-Options'], 'nosniff', label);
        assert.equal(type, 'text/plain', label);
        assert.equal(body, expected === 404 ? 'Not found' : 'Bad request', label);
      }
      checks += 1;
    }
  }
}
console.log(JSON.stringify({ status: 'PATH_GUARD_TESTS_PASSED', checks,
  testScope: 'isolated_middleware_and_source_order', applicationStarted: false,
  databaseConnected: false, productionVerified: false }));
