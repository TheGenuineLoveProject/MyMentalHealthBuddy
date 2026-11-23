// Run: node --experimental-vm-modules --test server/tests/newsletter-consent.test.mjs
// Actual Express router, Zod, canonical tables and Drizzle transactions. Only
// PostgreSQL execution and logging are synthetic; no application DB is loaded.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import express from 'express';
import request from 'supertest';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { leads, newsletterSubscribers, analyticsEvents } from '../../shared/schema.mjs';

const sourcePath = process.env.MMHB_TEST_NEWSLETTER_SOURCE || fileURLToPath(new URL('../routes/newsletter.mjs', import.meta.url));
const routeSource = fs.readFileSync(sourcePath, 'utf8');
const email = 'synthetic@example.invalid';
const otherEmail = 'other@example.invalid';
const now = 2000000000000;

function lead(overrides = {}) {
  return { id: 'synthetic-lead', email, consent: false, interests: '["sleep","focus"]',
    source: 'original-campaign', utm_source: 'old-source', utm_medium: 'old-medium',
    utm_campaign: 'old-campaign', utm_content: 'old-content', utm_term: 'old-term',
    created_at: '2020-01-01T00:00:00.000Z', ...overrides };
}
function subscriber(overrides = {}) {
  return { id: 'synthetic-subscriber', email, status: 'active', source_path: '/original',
    created_at: '2020-01-01T00:00:00.000Z', ...overrides };
}

async function fixture({ leadRows = [], subscriberRows = [], fail, analyticsFailure = false } = {}) {
  const state = {
    data: { leads: new Map(leadRows.map(row => [row.email, structuredClone(row)])),
      newsletter_subscribers: new Map(subscriberRows.map(row => [row.email, structuredClone(row)])) },
    transaction: null, queries: [], analytics: [], logs: [], fail,
  };
  const current = () => state.transaction || state.data;
  function valuesFor(columns, tokens, params) {
    return Object.fromEntries(columns.map((column, index) => {
      const value = tokens[index];
      if (value === 'default') return [column, null];
      const parameter = value.match(/^\$(\d+)$/);
      assert.ok(parameter, `Unsupported synthetic SQL value: ${value}`);
      return [column, params[Number(parameter[1]) - 1]];
    }));
  }
  function assignments(text, params) {
    return Object.fromEntries([...text.matchAll(/"([a-z_]+)" = \$(\d+)/g)]
      .map(([, column, index]) => [column, params[Number(index) - 1]]));
  }
  const transport = { async query(config, params = []) {
    const sql = typeof config === 'string' ? config : config.text;
    state.queries.push({ sql, params: structuredClone(params) });
    if (sql === 'begin') {
      assert.equal(state.transaction, null);
      state.transaction = structuredClone(state.data);
      return { rows: [], rowCount: 0 };
    }
    if (sql === 'commit') {
      assert.ok(state.transaction);
      state.data = state.transaction; state.transaction = null;
      return { rows: [], rowCount: 0 };
    }
    if (sql === 'rollback') {
      state.transaction = null;
      return { rows: [], rowCount: 0 };
    }
    const table = sql.match(/(?:into|from|update) "([a-z_]+)"/)?.[1];
    const operation = sql.split(' ')[0];
    if (state.fail?.table === table && state.fail?.operation === operation) {
      state.fail = null;
      throw Error(`synthetic-private-db-failure ${email} private-campaign SQL-details`);
    }
    if (table === 'analytics_events') {
      assert.equal(state.transaction, null, 'telemetry must not run before commit');
      if (analyticsFailure) throw Error('synthetic-private-analytics-failure');
      const insert = sql.match(/^insert into "[a-z_]+" \((.*?)\) values \((.*?)\)/);
      assert.ok(insert);
      state.analytics.push(valuesFor(insert[1].split(',').map(s => s.trim().replaceAll('"', '')),
        insert[2].split(',').map(s => s.trim()), params));
      return { rows: [], rowCount: 1 };
    }
    assert.ok(table === 'leads' || table === 'newsletter_subscribers', `Unexpected SQL: ${sql}`);
    const records = current()[table];
    if (operation === 'select') {
      assert.match(sql, /where "leads"\."email" = \$1/);
      const row = records.get(params[0]);
      return { rows: row ? [[row.id]] : [], rowCount: row ? 1 : 0 };
    }
    if (operation === 'insert') {
      const insert = sql.match(/^insert into "[a-z_]+" \((.*?)\) values \((.*?)\)(.*)$/);
      assert.ok(insert);
      const record = valuesFor(insert[1].split(',').map(s => s.trim().replaceAll('"', '')),
        insert[2].split(',').map(s => s.trim()), params);
      const existing = records.get(record.email);
      if (existing) {
        if (!insert[3].includes('on conflict ("email") do update set')) {
          const error = Error('Synthetic duplicate email'); error.code = '23505'; throw error;
        }
        records.set(record.email, { ...existing, ...assignments(insert[3], params) });
      } else {
        records.set(record.email, { ...record, id: record.id || `synthetic-${table}` });
      }
      return { rows: [], rowCount: 1 };
    }
    const predicate = sql.match(/where "[a-z_]+"\."email" = \$(\d+)/);
    assert.ok(predicate, 'every destructive mutation must target an exact email');
    const target = params[Number(predicate[1]) - 1];
    const existing = records.get(target);
    if (operation === 'delete') records.delete(target);
    else if (operation === 'update' && existing) {
      records.set(target, { ...existing, ...assignments(sql.slice(0, sql.indexOf(' where ')), params) });
    } else assert.equal(operation, 'update');
    return { rows: [], rowCount: existing ? 1 : 0 };
  } };
  const db = drizzle(transport);
  const captureLog = (...args) => { state.logs.push(args); };
  const dependencies = {
    express: { Router: express.Router }, zod: { z }, 'drizzle-orm': { eq },
    '../db/connection.mjs': { db }, '../db/schema.mjs': { leads },
    '../../shared/schema.mjs': { analyticsEvents, newsletterSubscribers },
    '../utils/logger.mjs': { logger: { info: captureLog, error: captureLog, debug: captureLog } },
  };
  const context = vm.createContext({ Date: class extends Date { static now() { return now; } },
    setInterval: () => ({ unref() {} }) });
  const route = new vm.SourceTextModule(routeSource, { context });
  await route.link(specifier => {
    const exports = dependencies[specifier]; assert.ok(exports, `Unexpected route import: ${specifier}`);
    return new vm.SyntheticModule(Object.keys(exports), function () {
      for (const [key, value] of Object.entries(exports)) this.setExport(key, value);
    }, { context });
  });
  await route.evaluate();
  const app = express(); app.use(express.json());
  app.get('/health', (_req, res) => res.json({ ok: true }));
  app.use('/api/newsletter', route.namespace.default);
  return { state, app, async send(action, body = { email }) {
    const response = await request(app).post(`/api/newsletter/${action}`).send(body);
    await new Promise(setImmediate);
    return response;
  } };
}

function assertCommitted(state) {
  assert.equal(state.transaction, null);
  assert.equal(state.queries.filter(q => q.sql === 'begin').length, 1);
  assert.equal(state.queries.filter(q => q.sql === 'commit').length, 1);
  assert.equal(state.queries.some(q => q.sql === 'rollback'), false);
  const commit = state.queries.findIndex(q => q.sql === 'commit');
  const telemetry = state.queries.findIndex(q => q.sql.startsWith('insert into "analytics_events"'));
  assert.ok(telemetry > commit);
}

async function validationWorker(action) {
  process.on('unhandledRejection', error => {
    console.log(JSON.stringify({ unhandledRejection: true, errorName: error?.name }));
    process.exit(2);
  });
  const cases = [{}, { email: 42 }, { email: 'invalid' },
    { email: `${'a'.repeat(250)}@example.invalid` }];
  if (action === 'subscribe') cases.push({ email, consent: false }, { email, source: '' },
    { email, source: 'a'.repeat(101) }, { email, source: '/newsletter?private=narrative' },
    { email, utmSource: 'a'.repeat(256) }, { email, utmTimestamp: 'not-a-number' });
  const results = [];
  for (const body of cases) {
    const f = await fixture();
    const response = await f.send(action, body);
    results.push({ status: response.status, code: response.body.error?.code,
      databaseQueries: f.state.queries.length, health: (await request(f.app).get('/health')).status });
  }
  const f = await fixture();
  const normalized = await f.send(action, { email: '  SYNTHETIC@Example.invalid  ' });
  console.log(JSON.stringify({ results, normalizedStatus: normalized.status,
    normalizedEmailUsed: f.state.queries.some(q => q.params.includes(email)),
    healthy: (await request(f.app).get('/health')).status }));
}

if (process.argv[2] === '--newsletter-validation-worker') {
  await validationWorker(process.argv[3]);
} else {
  for (const action of ['subscribe', 'unsubscribe']) {
    test(`${action} validates in an owned process without an unhandled rejection`, () => {
      const child = spawnSync(process.execPath, ['--experimental-vm-modules', fileURLToPath(import.meta.url),
        '--newsletter-validation-worker', action], { encoding: 'utf8', timeout: 10000,
        env: { PATH: process.env.PATH || '/usr/bin:/bin', MMHB_TEST_NEWSLETTER_SOURCE: sourcePath } });
      assert.ifError(child.error);
      assert.equal(child.status, 0, child.stdout + child.stderr);
      const result = JSON.parse(child.stdout.trim().split('\n').find(line => line.startsWith('{')));
      assert.equal(result.results.length, action === 'subscribe' ? 10 : 4);
      for (const response of result.results) {
        assert.deepEqual(response, { status: 400, code: 'VALIDATION_ERROR', databaseQueries: 0, health: 200 });
      }
      assert.equal(result.normalizedStatus, 200);
      assert.equal(result.normalizedEmailUsed, true);
      assert.equal(result.healthy, 200);
    });
  }

  test('new subscription commits both stores and returns the UI success flag', async () => {
    const f = await fixture(); const response = await f.send('subscribe', { email, consent: true, source: '/pricing' });
    assert.equal(response.status, 200);
    assert.deepEqual(response.body, { ok: true, data: { subscribed: true }, message: 'Subscription received. Thank you for joining us.' });
    assert.equal(f.state.data.leads.get(email).consent, true);
    assert.equal(f.state.data.leads.get(email).interests, '[]');
    assert.equal(f.state.data.newsletter_subscribers.get(email).status, 'active');
    assertCommitted(f.state);
  });

  test('email-only legacy Subscribe action remains supported', async () => {
    const f = await fixture(); assert.equal((await f.send('subscribe')).status, 200);
    assert.equal(f.state.data.leads.get(email).consent, true);
    assert.equal(f.state.data.newsletter_subscribers.get(email).status, 'active');
  });

  test('renewed consent reactivates both stores while preserving unrelated metadata', async () => {
    const originalLead = lead(); const originalSubscriber = subscriber({ status: 'unsubscribed' });
    const f = await fixture({ leadRows: [originalLead], subscriberRows: [originalSubscriber] });
    assert.equal((await f.send('subscribe')).status, 200);
    assert.deepEqual({ ...f.state.data.leads.get(email), consent: false, updated_at: undefined },
      { ...originalLead, updated_at: undefined });
    assert.deepEqual(f.state.data.newsletter_subscribers.get(email), { ...originalSubscriber, status: 'active' });
    assertCommitted(f.state);
  });

  test('fresh supplied attribution updates only those fields and validated source', async () => {
    const f = await fixture({ leadRows: [lead()], subscriberRows: [subscriber()] });
    assert.equal((await f.send('subscribe', { email, source: ' /pricing ', utmTimestamp: now - 1000,
      utmSource: 'new-source', utmCampaign: 'new-campaign' })).status, 200);
    const row = f.state.data.leads.get(email);
    assert.equal(row.utm_source, 'new-source'); assert.equal(row.utm_campaign, 'new-campaign');
    assert.equal(row.utm_medium, 'old-medium'); assert.equal(row.utm_content, 'old-content');
    assert.equal(row.utm_term, 'old-term'); assert.equal(row.source, '/pricing');
    assert.equal(f.state.data.newsletter_subscribers.get(email).source_path, '/pricing');
  });

  for (const [name, timestamp] of [['expired', now - 31 * 86400000], ['missing', undefined]]) {
    test(`${name} attribution does not erase or replace existing campaign metadata`, async () => {
      const f = await fixture({ leadRows: [lead()], subscriberRows: [subscriber()] });
      assert.equal((await f.send('subscribe', { email, utmSource: 'ignored', utmTimestamp: timestamp })).status, 200);
      const row = f.state.data.leads.get(email);
      assert.equal(row.utm_source, 'old-source'); assert.equal(row.utm_campaign, 'old-campaign');
      assert.equal(row.source, 'original-campaign');
    });
  }

  for (const [name, leadRows, subscriberRows] of [
    ['both stores', [lead()], [subscriber()]],
    ['subscriber only', [], [subscriber()]],
    ['lead only', [lead()], []],
    ['neither store', [], []],
  ]) {
    test(`unsubscribe handles ${name} and remains idempotent`, async () => {
      const f = await fixture({ leadRows, subscriberRows });
      const response = await f.send('unsubscribe'); assert.equal(response.status, 200);
      assert.equal(f.state.data.leads.has(email), false);
      if (subscriberRows.length) assert.equal(f.state.data.newsletter_subscribers.get(email).status, 'unsubscribed');
      assertCommitted(f.state);
      assert.equal((await f.send('unsubscribe')).status, 200);
      assert.equal(f.state.data.leads.has(email), false);
      if (subscriberRows.length) assert.equal(f.state.data.newsletter_subscribers.get(email).status, 'unsubscribed');
    });
  }

  test('unsubscribe then explicit subscribe reactivates an existing subscriber', async () => {
    const f = await fixture({ leadRows: [lead()], subscriberRows: [subscriber()] });
    assert.equal((await f.send('unsubscribe')).status, 200);
    assert.equal((await f.send('subscribe', { email, consent: true })).status, 200);
    assert.equal(f.state.data.leads.get(email).consent, true);
    assert.equal(f.state.data.newsletter_subscribers.get(email).status, 'active');
  });

  for (const action of ['subscribe', 'unsubscribe']) {
    test(`${action} rolls back the first mutation when its second store write fails`, async () => {
      const f = await fixture({ leadRows: [lead()], subscriberRows: [subscriber()],
        fail: { table: 'newsletter_subscribers', operation: action === 'subscribe' ? 'insert' : 'update' } });
      const before = structuredClone(f.state.data);
      const response = await f.send(action);
      assert.equal(response.status, 500); assert.equal(response.body.ok, false);
      assert.deepEqual(f.state.data, before); assert.equal(f.state.transaction, null);
      assert.equal(f.state.queries.some(q => q.sql === 'rollback'), true);
      assert.equal(f.state.queries.some(q => q.sql === 'commit'), false);
      assert.deepEqual(f.state.analytics, []);
      assert.equal((await f.send(action)).status, 200, 'retry can complete after the transient failure');
    });
  }

  test('a failed first-time subscriber insert cannot leave a new consenting lead', async () => {
    const f = await fixture({ fail: { table: 'newsletter_subscribers', operation: 'insert' } });
    assert.equal((await f.send('subscribe')).status, 500);
    assert.equal(f.state.data.leads.size, 0); assert.equal(f.state.data.newsletter_subscribers.size, 0);
    assert.deepEqual(f.state.analytics, []);
  });

  test('both actions preserve records belonging to another normalized email', async () => {
    const otherLead = lead({ email: otherEmail, id: 'other-lead' });
    const otherSubscriber = subscriber({ email: otherEmail, id: 'other-subscriber' });
    const f = await fixture({ leadRows: [lead(), otherLead], subscriberRows: [subscriber(), otherSubscriber] });
    assert.equal((await f.send('subscribe')).status, 200);
    assert.equal((await f.send('unsubscribe')).status, 200);
    assert.deepEqual(f.state.data.leads.get(otherEmail), otherLead);
    assert.deepEqual(f.state.data.newsletter_subscribers.get(otherEmail), otherSubscriber);
  });

  test('telemetry contains fixed action paths and no contact or campaign payload', async () => {
    const f = await fixture();
    await f.send('subscribe', { email, source: '/pricing', utmSource: 'private-campaign', utmTimestamp: now });
    await f.send('unsubscribe');
    assert.deepEqual(f.state.analytics.map(row => [row.event_name, row.path, row.meta]), [
      ['newsletter_signup_success', '/newsletter', '{}'],
      ['newsletter_unsubscribe', '/newsletter/unsubscribe', '{}'],
    ]);
    const output = JSON.stringify([f.state.analytics, f.state.logs]);
    for (const value of [email, 'private-campaign', '/pricing']) assert.equal(output.includes(value), false);
    for (const entry of f.state.logs) assert.equal(entry.length, 1, 'diagnostics must contain fixed messages only');
  });

  test('analytics failure does not turn committed subscription or opt-out into failure', async () => {
    const f = await fixture({ analyticsFailure: true });
    assert.equal((await f.send('subscribe')).status, 200);
    assert.equal(f.state.data.leads.get(email).consent, true);
    assert.equal((await f.send('unsubscribe')).status, 200);
    assert.equal(f.state.data.leads.has(email), false);
    assert.equal(f.state.data.newsletter_subscribers.get(email).status, 'unsubscribed');
  });

  test('database failure diagnostics and responses omit private raw error details', async () => {
    const f = await fixture({ fail: { table: 'newsletter_subscribers', operation: 'insert' } });
    const response = await f.send('subscribe'); assert.equal(response.status, 500);
    const output = JSON.stringify([response.body, f.state.logs]);
    for (const value of [email, 'synthetic-private-db-failure', 'private-campaign', 'SQL-details']) {
      assert.equal(output.includes(value), false);
    }
    assert.deepEqual(f.state.logs, [['[Newsletter] Subscription failed']]);
  });

  test('the existing five requests per minute rate policy remains enforced', async () => {
    const f = await fixture();
    for (let i = 0; i < 5; i++) assert.equal((await f.send('subscribe')).status, 200);
    const response = await f.send('unsubscribe');
    assert.equal(response.status, 429); assert.equal(response.body.error.code, 'RATE_LIMITED');
  });
}
