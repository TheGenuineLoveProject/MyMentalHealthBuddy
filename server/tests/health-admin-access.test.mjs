// node --experimental-vm-modules --test server/tests/health-admin-access.test.mjs
// Actual router and HTTP requests; no production modules, env, DB or commands.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { performance } from 'node:perf_hooks';
import test from 'node:test';
import express from 'express';
import request from 'supertest';

const source = readFileSync(process.env.HEALTH_ROUTE_UNDER_TEST || new URL('../routes/health.mjs', import.meta.url), 'utf8');
const token = 'synthetic-admin-health-fixture';
const targets = [
  ['repair', 'post', '/repair', { command: 'test-db' }],
  ['git-status', 'get', '/git-status'],
  ['platform-integrity', 'get', '/platform-integrity'],
];
async function fixture({ env = {}, session } = {}) {
  const calls = { db: [], imports: [], logs: [], ai: [] };
  const context = vm.createContext({
    process: { env: { NODE_ENV: 'test', ...env }, version: 'vSynthetic', platform: 'synthetic',
      uptime: () => 10, memoryUsage: () => ({ heapUsed: 100, heapTotal: 200, rss: 300 }) },
    setTimeout, clearTimeout,
  });
  const dependencies = {
    express: { default: express },
    'drizzle-orm': { sql: (parts, ...values) => ({ text: parts.join('?'), values }) },
    'node:perf_hooks': { performance },
    '../db/client.mjs': {
      default: { execute: async query => { calls.db.push(query); return { rows: [] }; } },
      pool: {
        totalCount: 0, idleCount: 0, waitingCount: 0,
        connect: async () => { calls.db.push({ operation: 'pool.connect' }); throw Error('Synthetic pool connection not expected'); },
        query: async query => { calls.db.push({ operation: 'pool.query', query }); return { rows: [] }; },
      },
    },
    '../utils/aiClient.mjs': { isConfigured: () => { calls.ai.push('isConfigured'); return false; } },
    '../utils/logger.mjs': { logger: Object.fromEntries(['info', 'warn', 'error'].map(level => [level, (...args) => calls.logs.push({ level, args })])) },
  };
  const router = new vm.SourceTextModule(source, {
    context,
    // Never delegate dynamic imports to Node: even baseline requests cannot
    // reach real child_process, fs, network, or any newly introduced module.
    importModuleDynamically: async specifier => {
      calls.imports.push(specifier);
      const blocked = new vm.SyntheticModule(['default', 'execSync'], function () {
        const execSync = () => Buffer.from('synthetic');
        this.setExport('execSync', execSync);
        this.setExport('default', { readFileSync: () => '{}' });
      }, { context });
      await blocked.link(() => { throw Error('No nested dynamic imports allowed'); });
      await blocked.evaluate();
      return blocked;
    },
  });
  await router.link(specifier => {
    const exports = dependencies[specifier];
    assert.ok(exports, `Unexpected static import: ${specifier}`);
    return new vm.SyntheticModule(Object.keys(exports), function () {
      for (const [key, value] of Object.entries(exports)) this.setExport(key, value);
    }, { context });
  });
  await router.evaluate();
  const app = express();
  app.use(express.json());
  // A trusted middleware-created session, never copied from request input.
  if (session) app.use((req, _res, next) => { req.session = session; next(); });
  app.use('/api/health', router.namespace.default);
  return { calls, send(method, path, body, headers = {}) {
    let req = request(app)[method]('/api/health' + path).set(headers);
    return body ? req.send(body) : req;
  } };
}
function untouched(f) {
  assert.deepEqual(f.calls, { db: [], imports: [], logs: [], ai: [] });
}
for (const [configuration, env] of [['absent', {}], ['empty', { ADMIN_TOKEN: '' }]]) {
  for (const [name, method, path, body] of targets) {
    for (const [identity, headers, session] of [
      ['anonymous', {}, undefined],
      ['invented token', { 'x-admin-token': token }, undefined],
      ['trusted admin session', {}, { user: { isAdmin: true } }],
    ]) {
      test(`${configuration} admin configuration refuses ${name} even with ${identity}`, async () => {
        const f = await fixture({ env, session });
        const response = await f.send(method, path, body, headers);
        assert.equal(response.status, 503);
        assert.deepEqual(response.body, { ok: false, error: 'Admin repair disabled' });
        untouched(f);
      });
    }
  }
}
for (const [name, method, path, body] of targets) {
  for (const [identity, headers, status] of [
    ['missing credentials', {}, 401],
    ['wrong header token', { 'x-admin-token': 'wrong-synthetic' }, 403],
    ['wrong Bearer token', { authorization: 'Bearer wrong-synthetic' }, 403],
  ]) {
    test(`configured ${name} refuses ${identity} before any work`, async () => {
      const f = await fixture({ env: { ADMIN_TOKEN: token } });
      assert.equal((await f.send(method, path, body, headers)).status, status);
      untouched(f);
    });
  }
  test(`body and query admin claims cannot authorize ${name}`, async () => {
    const f = await fixture({ env: { ADMIN_TOKEN: token } });
    const forged = { ...body, role: 'admin', isAdmin: true, user: { isAdmin: true }, session: { user: { isAdmin: true } } };
    assert.equal((await f.send(method, path + '?role=admin&isAdmin=true', forged)).status, 401);
    untouched(f);
  });
}
for (const [name, headers] of [
  ['header', { 'x-admin-token': token }], ['Bearer', { authorization: `Bearer ${token}` }],
]) {
  test(`configured valid ${name} authorizes the actual test-db handler`, async () => {
    const f = await fixture({ env: { ADMIN_TOKEN: token } });
    const response = await f.send('post', '/repair', { command: 'test-db' }, headers);
    assert.equal(response.status, 200); assert.equal(response.body.success, true);
    assert.equal(f.calls.db.length, 2);
    assert.match(f.calls.db[0].text, /SELECT 1/);
    assert.match(f.calls.db[1].text, /pg_tables/);
    assert.equal(f.calls.logs.length, 1);
    assert.deepEqual(f.calls.imports, []);
  });
}
test('configured trusted admin session retains benign restart authorization', async () => {
  const f = await fixture({ env: { ADMIN_TOKEN: token }, session: { user: { isAdmin: true } } });
  const response = await f.send('post', '/repair', { command: 'restart-service' });
  assert.equal(response.status, 200); assert.equal(response.body.success, true);
  assert.equal(f.calls.logs.length, 1); assert.deepEqual(f.calls.db, []); assert.deepEqual(f.calls.imports, []);
});
test('ordinary session cannot authorize repair', async () => {
  const f = await fixture({ env: { ADMIN_TOKEN: token }, session: { user: { isAdmin: false } } });
  assert.equal((await f.send('post', '/repair', { command: 'restart-service' })).status, 401);
  untouched(f);
});
test('explicit wrong token is not rescued by trusted admin session', async () => {
  const f = await fixture({ env: { ADMIN_TOKEN: token }, session: { user: { isAdmin: true } } });
  assert.equal((await f.send('post', '/repair', { command: 'restart-service' }, { 'x-admin-token': 'wrong' })).status, 403);
  untouched(f);
});
for (const [name, env] of [['unconfigured', {}], ['configured', { ADMIN_TOKEN: token }]]) {
  test(`${name} public health and liveness remain available without credentials`, async () => {
    const f = await fixture({ env });
    const health = await f.send('get', '/');
    assert.equal(health.status, 200); assert.equal(health.body.status, 'healthy');
    const live = await f.send('get', '/live');
    assert.equal(live.status, 200); assert.equal(live.body.status, 'alive');
    assert.deepEqual(f.calls.db, []); assert.deepEqual(f.calls.imports, []); assert.deepEqual(f.calls.logs, []);
    assert.equal(f.calls.ai.length, 1);
  });
}
