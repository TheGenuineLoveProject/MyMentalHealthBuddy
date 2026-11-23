// Run: node --experimental-vm-modules --test server/tests/billing-stale-cancellation.test.mjs
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
          if (column.trim() === '"subscription_status"') return state.user.subscriptionStatus;
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

for (const [name, replacement] of [
  ["active Pro", subscription()],
  ["active Elite", subscription({ items: { data: [{ price: { id: "price_elite_fixture" } }], has_more: false } })],
  ["trialing Pro", subscription({ status: "trialing" })],
  ["active scheduled-to-cancel", subscription({ cancel_at_period_end: true })],
  ["known price despite different metadata", subscription({ metadata: { plan: "elite" } })],
]) {
  test(`old deletion preserves newer ${name} and expiry without cancellation mail`, async () => {
    const plan = replacement.items.data[0].price.id === "price_elite_fixture" ? "elite" : "pro";
    const f = await fixture({ plan, list: async params => page(params.status === replacement.status ? [replacement] : []) });
    assert.equal((await f.send()).status, 200);
    unchanged(f.state, plan);
    assert.ok(f.state.processed.has("evt_synthetic_deleted"));
    assert.ok(f.state.lists.length >= 1);
    assert.equal(f.state.lists[0].params.status, "active");
  });
}

test("normal cancellation exhausts active and trialing lists then downgrades exact customer", async () => {
  const f = await fixture();
  assert.equal((await f.send()).status, 200);
  assert.deepEqual(f.state.lists.map(call => call.params.status), ["active", "trialing"]);
  assert.equal(f.state.user.subscriptionStatus, "free");
  assert.notEqual(f.state.user.subscriptionExpiresAt, expiry);
  assert.equal(f.state.updates.length, 1);
  assert.match(f.state.updates[0].sql, /xmin.*::text/);
  assert.equal(f.state.emails.length, 1);
  assert.equal(f.state.emails[0][0], "owner@example.invalid");
  assert.ok(f.state.processed.has("evt_synthetic_deleted"));
  assert.deepEqual(f.state.dbErrors, []);
});

test("new subscription creation followed by old deletion keeps the activated Pro plan and exact expiry", async () => {
  const replacement = subscription({ current_period_end: 1956528000 });
  const f = await fixture({ plan: "free", list: async params => page(params.status === "active" ? [replacement] : []) });
  const created = { id: "evt_synthetic_new_created", type: "customer.subscription.created", data: { object: replacement } };
  const activated = await f.send(created);
  assert.equal(activated.status, 200);
  assert.equal(f.state.user.subscriptionStatus, "pro");
  assert.equal(f.state.user.subscriptionExpiresAt, new Date(replacement.current_period_end * 1000).toISOString());
  assert.equal(f.state.user.rowVersion, "101");
  assert.equal(f.state.updates.length, 1);
  assert.equal(f.state.lists.length, 0);
  assert.ok(f.state.processed.has(created.id));
  const paidSnapshot = structuredClone(f.state.user);

  const cancelled = await f.send(event());
  assert.equal(cancelled.status, 200);
  assert.deepEqual(f.state.user, paidSnapshot, "old deletion must preserve the actual preceding activation");
  assert.equal(f.state.updates.length, 1, "only the new subscription activation should mutate the user");
  assert.equal(f.state.emails.length, 0);
  assert.deepEqual([...f.state.processed].sort(), ["evt_synthetic_deleted", created.id].sort());
  assert.equal(f.state.lists.length, 1);
  assert.deepEqual(f.state.dbErrors, []);
});

test("duplicate event skips provider lookup, downgrade, expiry and mail", async () => {
  const f = await fixture(); f.state.processed.add("evt_synthetic_deleted");
  const response = await f.send();
  assert.equal(response.status, 200); assert.equal(response.body.duplicate, true);
  unchanged(f.state); assert.equal(f.state.lists.length, 0);
});

for (const [name, badList] of [
  ["active lookup failure", async () => { throw Error("Synthetic Stripe failure"); }],
  ["trialing lookup failure", async params => { if (params.status === "trialing") throw Error("Synthetic Stripe failure"); return page(); }],
  ["unknown price with claiming metadata", async () => page([subscription({ items: { data: [{ price: { id: "price_unknown" } }], has_more: false }, metadata: { plan: "pro" } })])],
  ["Starter recurring state", async () => page([subscription({ items: { data: [{ price: { id: "price_starter_fixture" } }], has_more: false } })])],
  ["missing subscription items", async () => page([subscription({ items: undefined })])],
  ["incomplete subscription items", async () => page([subscription({ items: { data: [{ price: { id: "price_pro_fixture" } }], has_more: true } })])],
  ["wrong customer", async () => page([subscription({ customer: "cus_other" })])],
  ["wrong returned status", async () => page([subscription({ status: "past_due" })])],
  ["same ID still active", async () => page([subscription({ id: expired })])],
  ["missing list data", async () => ({ has_more: false })],
  ["missing has_more", async () => ({ data: [] })],
  ["empty page with more pages", async () => page([], true)],
  ["null subscription", async () => page([null])],
]) {
  test(`${name} fails retryably without marker or account changes`, async () => {
    const f = await fixture({ list: badList });
    assert.equal((await f.send()).status, 500);
    unchanged(f.state); assert.equal(f.state.processed.size, 0);
    assert.ok(f.state.lists.length >= 1);
  });
}

test("expanded event and replacement customers are normalized to the same customer", async () => {
  const f = await fixture({ list: async () => page([subscription({ customer: { object: "customer", id: customer } })]) });
  assert.equal((await f.send(event(deleted({ customer: { object: "customer", id: customer } })))).status, 200);
  unchanged(f.state); assert.equal(f.state.lists[0].params.customer, customer);
});

test("replacement beyond the first page prevents downgrade", async () => {
  const f = await fixture({ list: async params => params.starting_after
    ? page([subscription()]) : page([deleted()], true) });
  assert.equal((await f.send()).status, 200);
  unchanged(f.state);
  assert.equal(f.state.lists.length, 2);
  assert.equal(f.state.lists[1].params.starting_after, expired);
});

test("pagination retrieval failure leaves the event retryable and account untouched", async () => {
  const f = await fixture({ list: async params => {
    if (params.starting_after) throw Error("Synthetic second-page failure");
    return page([deleted()], true);
  } });
  assert.equal((await f.send()).status, 500); unchanged(f.state);
  assert.equal(f.state.processed.size, 0); assert.equal(f.state.lists.length, 2);
});

test("nonadvancing pagination fails rather than looping or downgrading", async () => {
  const f = await fixture({ list: async () => page([deleted()], true) });
  assert.equal((await f.send()).status, 500); unchanged(f.state);
  assert.equal(f.state.processed.size, 0); assert.ok(f.state.lists.length <= 2);
});

test("invalid signature causes no provider calls, database access or email", async () => {
  const f = await fixture(); assert.equal((await f.send(event(), false)).status, 400);
  unchanged(f.state); assert.equal(f.state.queries.length, 0); assert.equal(f.state.lists.length, 0);
});

test("budget is shared across status lookups and rejects an exhausted response", async () => {
  const clock = { now: 0 };
  const f = await fixture({ clock, list: async params => {
    clock.now += params.status === 'active' ? 6000 : 4001;
    return page();
  } });
  assert.equal((await f.send()).status, 500); unchanged(f.state);
  assert.equal(f.state.processed.size, 0);
  assert.deepEqual(f.state.lists.map(call => call.options.timeout), [10000, 4000]);
});

test("a replacement arriving after the lookup deadline is not acknowledged", async () => {
  const clock = { now: 0 };
  const f = await fixture({ clock, list: async () => { clock.now = 10001; return page([subscription()]); } });
  assert.equal((await f.send()).status, 500); unchanged(f.state);
  assert.equal(f.state.processed.size, 0); assert.equal(f.state.lists.length, 1);
});

test("concurrent replacement activation invalidates cancellation snapshot and retry preserves it", async () => {
  let retry = false;
  const f = await fixture({ list: async (params, _count, state) => {
    if (retry) return page(params.status === 'active' ? [subscription()] : []);
    assert.ok(state.queries.some(query => query.sql.includes('xmin')), 'snapshot must precede Stripe lookup');
    state.user.rowVersion = '101'; // Another webhook updated the row after the snapshot.
    return page();
  } });
  assert.equal((await f.send()).status, 500); unchanged(f.state);
  assert.equal(f.state.processed.size, 0);
  const mutation = f.state.queries.find(query => query.sql.startsWith('update "users"'));
  assert.ok(mutation, 'the database must reject the stale compare-and-swap');
  assert.ok(mutation.params.includes('100'));
  retry = true;
  assert.equal((await f.send()).status, 200); unchanged(f.state);
  assert.ok(f.state.processed.has('evt_synthetic_deleted'));
});

for (const [name, override] of [['missing customer', {customer: undefined}], ['missing subscription ID', {id: undefined}],
  ['malformed expanded customer', {customer: {id: customer}}]]) {
  test(`${name} fails without mutations or a processed marker`, async () => {
    const f = await fixture();
    assert.equal((await f.send(event(deleted(override)))).status, 500);
    unchanged(f.state); assert.equal(f.state.processed.size, 0); assert.equal(f.state.lists.length, 0);
  });
}


test("replacement protection logs omit account and provider identifiers", async () => {
  const f = await fixture({ list: async () => page([subscription()]) });
  assert.equal((await f.send()).status, 200);
  unchanged(f.state);
  const logged = JSON.stringify(f.state.logEntries);
  assert.match(logged, /Stale subscription cancellation skipped/);
  for (const value of [customer, expired, "sub_synthetic_replacement", "owner@example.invalid"]) {
    assert.equal(logged.includes(value), false, "private identifier must not enter diagnostics");
  }
});

test("replacement lookup failures omit private provider error text", async () => {
  const f = await fixture({ list: async () => {
    throw Error(`synthetic-private-provider-error ${customer} ${expired} owner@example.invalid`);
  } });
  assert.equal((await f.send()).status, 500);
  unchanged(f.state);
  assert.equal(f.state.processed.size, 0);
  const logged = JSON.stringify(f.state.logEntries);
  assert.match(logged, /Webhook handler failed/);
  for (const value of ["synthetic-private-provider-error", customer, expired, "owner@example.invalid"]) {
    assert.equal(logged.includes(value), false, "provider failures must not leak private details");
  }
});
