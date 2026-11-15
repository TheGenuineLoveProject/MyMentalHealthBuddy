// Run: node --experimental-vm-modules --test server/tests/billing-stale-downgrades.test.mjs
// Real Express router, Stripe signature verification, canonical schema and
// Drizzle SQL generation; only database execution, email and Stripe IO are fake.
import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import vm from "node:vm";
import express from "express";
import request from "supertest";
import Stripe from "stripe";
import { and, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { users, webhookEvents } from "../../shared/schema.mjs";

const routeSource = fs.readFileSync(process.env.MMHB_TEST_WEBHOOK_SOURCE || new URL("../routes/webhook.mjs", import.meta.url), "utf8");
const mappingSource = fs.readFileSync(new URL("../utils/planMapping.mjs", import.meta.url), "utf8");
const signingSecret = "whsec_synthetic_cancellation_fixture";
const sdk = new Stripe("sk_test_synthetic_cancellation_fixture");
const customer = "cus_synthetic_owner";
const expired = "sub_synthetic_old";
const expiry = "2030-01-01T00:00:00.000Z";
const page = (data = [], has_more = false) => ({ object: "list", data, has_more });
const subscription = (overrides = {}) => ({
  id: "sub_synthetic_replacement", object: "subscription", customer, status: "active",
  items: { data: [{ price: { id: "price_pro_fixture" } }], has_more: false }, ...overrides,
});
const deleted = (overrides = {}) => ({
  id: expired, object: "subscription", customer, status: "canceled", current_period_end: 1700000000, ...overrides,
});
const event = (object = deleted(), id = "evt_synthetic_deleted") => ({
  id, type: "customer.subscription.deleted", data: { object },
});

async function fixture({ list = async () => page(), plan = "elite", clock } = {}) {
  const state = {
    user: { id: "11111111-1111-4111-8111-111111111111", email: "owner@example.invalid", name: "Synthetic owner", stripeCustomerId: customer,
      subscriptionStatus: plan, subscriptionExpiresAt: expiry, rowVersion: "100" },
    queries: [], updates: [], emails: [], lists: [], processed: new Set(), dbErrors: [], logEntries: [],
  };
  const client = { async query(config, params = []) {
    const sql = config.text;
    state.queries.push({ sql, params });
    try {
      if (/^select .* from "webhook_events"/.test(sql)) {
        assert.match(sql, /where "webhook_events"\."id" = \$1/);
        return { rows: state.processed.has(params[0]) ? [[params[0], "customer.subscription.deleted", "processed", new Date().toISOString()]] : [] };
      }
      if (/^select .* from "users"/.test(sql)) {
        assert.match(sql, /where "users"\."stripe_customer_id" = \$1/);
        assert.equal(params[0], customer, "lookup must use exact normalized customer");
        const selected = sql.slice(7, sql.indexOf(' from "users"')).split(',').map(column => {
          if (/xmin/.test(column)) return state.user.rowVersion;
          if (/subscription_status/.test(column)) return state.user.subscriptionStatus;
          for (const key of ['email', 'name', 'id']) if (column.trim() === `"${key}"`) return state.user[key];
          throw Error('Unexpected user projection: ' + column);
        });
        return { rows: [selected] };
      }
      if (sql.startsWith('update "users"')) {
        const predicate = sql.match(/"users"\."stripe_customer_id" = \$(\d+)/);
        assert.ok(predicate, "mutation must target a customer");
        assert.equal(params[Number(predicate[1]) - 1], customer);
        const version = sql.match(/xmin"?\s*::\s*text\s*=\s*\$(\d+)/i);
        // Activation uses the existing customer-scoped update; cancellation
        // adds xmin. Execute either SQL shape faithfully, including old-source
        // cancellation without xmin so baseline tests expose its actual downgrade.
        if (version && params[Number(version[1]) - 1] !== state.user.rowVersion) return { rows: [], rowCount: 0 };
        state.updates.push({ sql, params });
        const columns = { subscription_status: "subscriptionStatus", subscription_expires_at: "subscriptionExpiresAt", updated_at: "updatedAt" };
        for (const [, column, index] of sql.matchAll(/"([a-z_]+)" = \$(\d+)/g)) {
          if (columns[column]) state.user[columns[column]] = params[Number(index) - 1];
        }
        state.user.rowVersion = String(Number(state.user.rowVersion) + 1);
        return { rows: sql.includes(' returning ') ? [[state.user.id]] : [], rowCount: 1 };
      }
      if (sql.startsWith('insert into "webhook_events"')) {
        assert.match(sql, /\("id", "event_type", "status", "processed_at"\)/);
        state.processed.add(params[0]);
        return { rows: [], rowCount: 1 };
      }
      throw Error("Unexpected synthetic database statement");
    } catch (error) { state.dbErrors.push(error.message); throw error; }
  } };
  const db = drizzle(client, { schema: { users, webhookEvents } });
  const stripe = {
    webhooks: sdk.webhooks,
    subscriptions: { list: async (params, options) => {
      state.lists.push({ params: { ...params }, options });
      assert.equal(params.customer, customer);
      assert.equal(params.limit, 100);
      assert.ok(["active", "trialing"].includes(params.status));
      assert.equal(options.maxNetworkRetries, 0);
      assert.ok(options.timeout > 0 && options.timeout <= 10000);
      return list(params, state.lists.length, state);
    } },
  };
  const noop = () => {};
  const captureLog = (...args) => { state.logEntries.push(args); };
  const dependencies = {
    express: { default: express, Router: express.Router },
    stripe: { default: class { constructor() { return stripe; } } },
    "../db/client.mjs": { db },
    "../../shared/schema.mjs": { users, webhookEvents },
    "drizzle-orm": { and, eq, sql },
    "../utils/logger.mjs": { logger: { info: captureLog, warn: captureLog, error: captureLog } },
    "../utils/metrics.mjs": { increment: noop },
    "../services/email.mjs": { sendUpgradeConfirmation: async () => {},
      sendCancellationAcknowledgment: async (...args) => { state.emails.push(args); } },
    "../observability/safetyAlerts.mjs": { alertWebhookSignatureFailure: async () => {} },
  };
  const FixtureDate = clock ? class extends Date { static now() { return clock.now; } } : Date;
  const context = vm.createContext({ Buffer, Date: FixtureDate, process: { env: {
    STRIPE_SECRET_KEY: "sk_test_synthetic_cancellation_fixture", STRIPE_WEBHOOK_SECRET: signingSecret,
    STRIPE_PRICE_STARTER: "price_starter_fixture", STRIPE_PRICE_PRO: "price_pro_fixture",
    STRIPE_PRICE_ELITE: "price_elite_fixture",
  } } });
  const mapper = new vm.SourceTextModule(mappingSource, { context });
  await mapper.link(() => { throw Error("Unexpected mapping import"); }); await mapper.evaluate();
  const router = new vm.SourceTextModule(routeSource, { context });
  await router.link(specifier => {
    if (specifier === "../utils/planMapping.mjs") return mapper;
    const exports = dependencies[specifier]; assert.ok(exports, `Unexpected route import ${specifier}`);
    return new vm.SyntheticModule(Object.keys(exports), function () {
      for (const [name, value] of Object.entries(exports)) this.setExport(name, value);
    }, { context });
  });
  await router.evaluate();
  const app = express(); app.use("/api/webhooks", router.namespace.default);
  return { state, async send(payload = event(), validSignature = true) {
    const body = JSON.stringify(payload);
    return request(app).post("/api/webhooks/stripe").set("Content-Type", "application/json")
      .set("stripe-signature", sdk.webhooks.generateTestHeaderString({ payload: body,
        secret: validSignature ? signingSecret : "whsec_wrong_fixture" })).send(body);
  } };
}

function unchanged(state, expectedPlan = "elite") {
  assert.equal(state.user.subscriptionStatus, expectedPlan);
  assert.equal(state.user.subscriptionExpiresAt, expiry);
  assert.equal(state.updates.length, 0);
  assert.equal(state.emails.length, 0);
  assert.deepEqual(state.dbErrors, []);
}

// Separate fixture intentionally keeps these regressions runnable against the
// historical route without importing/running another test suite.
const failedInvoice = (overrides = {}) => ({
  id: 'in_synthetic_old', object: 'invoice', customer, subscription: expired, ...overrides,
});
const negativeCases = [
  ['inactive creation', 'customer.subscription.created', () => deleted({ status: 'incomplete' })],
  ['inactive update', 'customer.subscription.updated', () => deleted({ status: 'past_due' })],
  ['failed invoice', 'invoice.payment_failed', failedInvoice],
];
const notification = (type, object, id = 'evt_synthetic_negative') => ({ id, type, data: { object } });
function noEffects(f) {
  assert.equal(f.state.updates.length, 0);
  assert.equal(f.state.emails.length, 0);
  assert.equal(f.state.processed.size, 0);
  assert.deepEqual(f.state.dbErrors, []);
}

for (const [name, type, object] of negativeCases) {
  test(`actual activation then delayed ${name} preserves exact paid account`, async () => {
    const replacement = subscription({ current_period_end: 1956528000 });
    const f = await fixture({ plan: 'free', list: async params => page(params.status === 'active' ? [replacement] : []) });
    const activation = notification('customer.subscription.created', replacement, 'evt_synthetic_activation');
    assert.equal((await f.send(activation)).status, 200);
    assert.equal(f.state.user.subscriptionStatus, 'pro');
    assert.equal(f.state.user.subscriptionExpiresAt, new Date(1956528000 * 1000).toISOString());
    assert.equal(f.state.user.rowVersion, '101');
    const before = structuredClone(f.state.user);
    assert.equal((await f.send(notification(type, object()))).status, 200);
    assert.deepEqual(f.state.user, before);
    assert.equal(f.state.updates.length, 1);
    assert.equal(f.state.emails.length, 0);
    assert.deepEqual([...f.state.processed].sort(), ['evt_synthetic_activation', 'evt_synthetic_negative']);
    assert.ok(f.state.lists.length > 0);
    assert.deepEqual(f.state.dbErrors, []);
    const logged = JSON.stringify(f.state.logEntries);
    for (const privateValue of [customer, expired, replacement.id, 'owner@example.invalid']) assert.equal(logged.includes(privateValue), false);
  });

  for (const status of ['active', 'trialing']) {
    test(`${name} preserves the same subscription after recovery to ${status}`, async () => {
      const recovered = subscription({ id: expired, status });
      const f = await fixture({ list: async params => page(params.status === status ? [recovered] : []) });
      assert.equal((await f.send(notification(type, object()))).status, 200);
      unchanged(f.state);
      assert.ok(f.state.processed.has('evt_synthetic_negative'));
    });
  }

  test(`${name} downgrades when complete live lists prove no paid subscriptions`, async () => {
    const f = await fixture();
    assert.equal((await f.send(notification(type, object()))).status, 200);
    assert.deepEqual(f.state.lists.map(call => call.params.status), ['active', 'trialing']);
    assert.equal(f.state.user.subscriptionStatus, 'free');
    assert.equal(f.state.user.subscriptionExpiresAt, type === 'invoice.payment_failed' ? expiry : new Date(1700000000 * 1000).toISOString());
    assert.equal(f.state.updates.length, 1);
    assert.match(f.state.updates[0].sql, /xmin.*::text/);
    assert.ok(f.state.processed.has('evt_synthetic_negative'));
    assert.equal(f.state.emails.length, 0);
    assert.deepEqual(f.state.dbErrors, []);
  });

  test(`${name} preserves a separately purchased Starter entitlement`, async () => {
    const f = await fixture({ plan: 'starter' });
    f.state.user.subscriptionExpiresAt = null;
    const before = structuredClone(f.state.user);
    assert.equal((await f.send(notification(type, object()))).status, 200);
    assert.deepEqual(f.state.user, before);
    assert.equal(f.state.updates.length, 0);
    assert.equal(f.state.emails.length, 0);
    assert.ok(f.state.processed.has('evt_synthetic_negative'));
  });

  for (const [failure, list] of [
    ['provider failure', async () => { throw Error('private-provider-detail owner@example.invalid cus_synthetic_owner'); }],
    ['unknown price despite paid metadata', async () => page([subscription({ metadata: { plan: 'pro' }, items: { data: [{ price: { id: 'price_unknown' } }], has_more: false } })])],
    ['malformed listing', async () => ({ data: [], has_more: 'false' })],
  ]) {
    test(`${name}: ${failure} returns retryable error without side effects`, async () => {
      const f = await fixture({ list });
      const before = structuredClone(f.state.user);
      const response = await f.send(notification(type, object()));
      assert.equal(response.status, 500);
      assert.deepEqual(f.state.user, before); noEffects(f);
      const diagnostics = JSON.stringify([response.body, f.state.logEntries]);
      for (const secret of ['private-provider-detail', 'owner@example.invalid', customer, expired]) assert.equal(diagnostics.includes(secret), false);
    });
  }

  test(`${name}: concurrent activation defeats stale xmin update; retry preserves it`, async () => {
    let retry = false;
    const f = await fixture({ list: async (params, _count, state) => {
      if (retry) return page(params.status === 'active' ? [subscription()] : []);
      assert.ok(state.queries.some(query => query.sql.includes('xmin')), 'snapshot must precede lookup');
      state.user.subscriptionStatus = 'pro';
      state.user.subscriptionExpiresAt = '2032-01-01T00:00:00.000Z';
      state.user.rowVersion = '101';
      return page();
    } });
    const payload = notification(type, object());
    assert.equal((await f.send(payload)).status, 500);
    noEffects(f);
    assert.equal(f.state.user.subscriptionStatus, 'pro');
    assert.equal(f.state.user.subscriptionExpiresAt, '2032-01-01T00:00:00.000Z');
    const attempted = f.state.queries.find(query => query.sql.startsWith('update "users"'));
    assert.ok(attempted?.params.includes('100'));
    const concurrent = structuredClone(f.state.user);
    retry = true;
    assert.equal((await f.send(payload)).status, 200);
    assert.deepEqual(f.state.user, concurrent);
    assert.equal(f.state.updates.length, 0);
    assert.ok(f.state.processed.has(payload.id));
  });

  test(`${name}: durable replay skips all provider and mutation work`, async () => {
    const f = await fixture(); f.state.processed.add('evt_synthetic_negative');
    const response = await f.send(notification(type, object()));
    assert.equal(response.status, 200); assert.equal(response.body.duplicate, true);
    unchanged(f.state); assert.equal(f.state.lists.length, 0);
  });
}

test('Starter survives an old subscription deletion with no cancellation email', async () => {
  const f = await fixture({ plan: 'starter' });
  f.state.user.subscriptionExpiresAt = null;
  const before = structuredClone(f.state.user);
  assert.equal((await f.send(event())).status, 200);
  assert.deepEqual(f.state.user, before);
  assert.equal(f.state.updates.length, 0); assert.equal(f.state.emails.length, 0);
  assert.equal(f.state.lists.length, 0); assert.ok(f.state.processed.has('evt_synthetic_deleted'));
});

test('actual paid invoice then delayed failed invoice preserves recovered subscription', async () => {
  const f = await fixture({ plan: 'free', list: async params => page(params.status === 'active' ? [subscription({ id: expired })] : []) });
  const paid = notification('invoice.paid', failedInvoice({ lines: { data: [{ price: { id: 'price_pro_fixture' } }] } }), 'evt_synthetic_paid');
  assert.equal((await f.send(paid)).status, 200);
  assert.equal(f.state.user.subscriptionStatus, 'pro');
  const before = structuredClone(f.state.user);
  assert.equal((await f.send(notification('invoice.payment_failed', failedInvoice()))).status, 200);
  assert.deepEqual(f.state.user, before);
  assert.equal(f.state.updates.length, 1);
  assert.deepEqual([...f.state.processed].sort(), ['evt_synthetic_negative', 'evt_synthetic_paid']);
});

for (const [name, object] of [
  ['legacy string', failedInvoice()],
  ['legacy expanded', failedInvoice({ subscription: { object: 'subscription', id: expired } })],
  ['modern parent', failedInvoice({ subscription: undefined, parent: { type: 'subscription_details', subscription_details: { subscription: expired } } })],
  ['matching legacy and modern', failedInvoice({ parent: { type: 'subscription_details', subscription_details: { subscription: expired } } })],
]) {
  test(`${name} invoice association checks current subscriptions`, async () => {
    const f = await fixture({ list: async () => page([subscription()]) });
    assert.equal((await f.send(notification('invoice.payment_failed', object))).status, 200);
    unchanged(f.state); assert.equal(f.state.lists.length, 1);
    assert.ok(f.state.processed.has('evt_synthetic_negative'));
  });
}

for (const [name, object] of [
  ['legacy explicit one-off', failedInvoice({ subscription: null })],
  ['modern explicit one-off', failedInvoice({ subscription: undefined, parent: null })],
]) {
  test(`${name} invoice does not revoke account or query subscriptions`, async () => {
    const f = await fixture();
    assert.equal((await f.send(notification('invoice.payment_failed', object))).status, 200);
    unchanged(f.state); assert.equal(f.state.lists.length, 0);
    assert.ok(f.state.processed.has('evt_synthetic_negative'));
  });
}

for (const [name, object] of [
  ['missing both forms', failedInvoice({ subscription: undefined })],
  ['empty legacy ID', failedInvoice({ subscription: '' })],
  ['malformed expanded subscription', failedInvoice({ subscription: { id: expired } })],
  ['conflicting associations', failedInvoice({ parent: { type: 'subscription_details', subscription_details: { subscription: 'sub_other' } } })],
  ['null versus recurring conflict', failedInvoice({ subscription: null, parent: { type: 'subscription_details', subscription_details: { subscription: expired } } })],
  ['unknown parent type', failedInvoice({ subscription: undefined, parent: { type: 'future_unknown' } })],
  ['missing modern subscription', failedInvoice({ subscription: undefined, parent: { type: 'subscription_details', subscription_details: {} } })],
  ['missing customer', failedInvoice({ customer: undefined })],
]) {
  test(`${name} invoice is retryable without account mutation or receipt`, async () => {
    const f = await fixture();
    assert.equal((await f.send(notification('invoice.payment_failed', object))).status, 500);
    noEffects(f); assert.equal(f.state.lists.length, 0);
  });
}

test('invalid signature cannot trigger negative-event provider lookup or writes', async () => {
  const f = await fixture();
  assert.equal((await f.send(notification('invoice.payment_failed', failedInvoice()), false)).status, 400);
  noEffects(f); assert.equal(f.state.lists.length, 0);
});

for (const type of ['customer.subscription.created', 'customer.subscription.updated']) {
  for (const [name, override] of [['missing subscription ID', { id: undefined }], ['missing customer', { customer: undefined }]]) {
    test(`${type}: ${name} is not acknowledged or applied`, async () => {
      const f = await fixture();
      assert.equal((await f.send(notification(type, deleted(override)))).status, 500);
      noEffects(f); assert.equal(f.state.lists.length, 0);
    });
  }
}

for (const status of [undefined, null, 'future_unknown']) {
  test(`unrecognized subscription status ${String(status)} cannot establish a downgrade`, async () => {
    const f = await fixture();
    assert.equal((await f.send(notification('customer.subscription.updated', deleted({ status })))).status, 500);
    noEffects(f); assert.equal(f.state.lists.length, 0);
  });
}

test('modern quote invoice is explicitly standalone and cannot revoke subscription access', async () => {
  const f = await fixture();
  const invoice = failedInvoice({ subscription: undefined, parent: { type: 'quote_details', quote_details: { quote: 'qt_synthetic' }, subscription_details: null } });
  assert.equal((await f.send(notification('invoice.payment_failed', invoice))).status, 200);
  unchanged(f.state); assert.equal(f.state.lists.length, 0);
  assert.ok(f.state.processed.has('evt_synthetic_negative'));
});

for (const [name, override] of [
  ['invalid quote identity', { subscription: undefined, parent: { type: 'quote_details', quote_details: { quote: '' } } }],
  ['quote with conflicting subscription details', { subscription: undefined, parent: { type: 'quote_details', quote_details: { quote: 'qt_synthetic' }, subscription_details: { subscription: expired } } }],
  ['quote contradicting legacy recurring association', { parent: { type: 'quote_details', quote_details: { quote: 'qt_synthetic' } } }],
  ['expanded subscription belonging to another customer', { subscription: { object: 'subscription', id: expired, customer: 'cus_unrelated' } }],
]) {
  test(`${name} fails without changing entitlement`, async () => {
    const f = await fixture();
    assert.equal((await f.send(notification('invoice.payment_failed', failedInvoice(override)))).status, 500);
    noEffects(f); assert.equal(f.state.lists.length, 0);
  });
}
