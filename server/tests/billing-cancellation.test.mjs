// Run: node --experimental-vm-modules --test server/tests/billing-cancellation.test.mjs
// Compile and execute the actual webhook's queries with canonical table columns
// and real Drizzle. Only the PostgreSQL transport and external effects are mocked.
import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import vm from "node:vm";
import express from "express";
import request from "supertest";
import Stripe from "stripe";
import { drizzle } from "drizzle-orm/node-postgres";
import { and, eq, sql } from "drizzle-orm";
import { users, webhookEvents } from "../../shared/schema.mjs";

const signingSecret = "whsec_cancellation_offline_fixture";
const sdk = new Stripe("sk_test_cancellation_offline_fixture");
const routeSource = fs.readFileSync(new URL("../routes/webhook.mjs", import.meta.url), "utf8");
const mappingSource = fs.readFileSync(new URL("../utils/planMapping.mjs", import.meta.url), "utf8");

function cancellationEvent(customer = "cus_cancellation_fixture") {
  return {
    id: "evt_cancellation_fixture",
    type: "customer.subscription.deleted",
    data: { object: {
      id: "sub_cancellation_fixture",
      customer,
      status: "canceled",
      current_period_end: 1780000000,
    } },
  };
}

async function fixture() {
  const state = {
    user: {
      id: "00000000-0000-4000-8000-000000000001",
      email: "synthetic@example.invalid",
      name: "Cancellation Fixture",
      stripe_customer_id: "cus_cancellation_fixture",
      subscription_status: "pro",
      subscription_expires_at: "2099-01-01T00:00:00.000Z",
      row_version: "1",
    },
    queries: [],
    updateAttempts: 0,
    successfulUpdates: 0,
    emails: [],
    processed: new Map(),
    failUserLookup: false,
    failUserUpdate: false,
  };
  const transport = {
    async query(config, params = []) {
      const text = typeof config === "string" ? config : config.text;
      state.queries.push({ text, params });
      if (text.startsWith("select ") && text.includes('from "webhook_events"')) {
        const marker = state.processed.get(params[0]);
        return { rows: marker ? [marker] : [], rowCount: marker ? 1 : 0 };
      }
      if (text.startsWith("select ") && text.includes('from "users"')) {
        if (state.failUserLookup) throw new Error("Synthetic user-read failure");
        const matched = params[0] === state.user.stripe_customer_id;
        // Drizzle requests rowMode=array and applies the selected column map.
        // An undefined schema column fails during its SQL construction first.
        return { rows: matched ? [[state.user.id, state.user.email, state.user.name, state.user.row_version]] : [], rowCount: matched ? 1 : 0 };
      }
      if (text.startsWith('update "users"')) {
        state.updateAttempts++;
        if (state.failUserUpdate) throw new Error("Synthetic user-update failure");
        const matched = params.at(-3) === state.user.id &&
          params.at(-2) === state.user.stripe_customer_id && params.at(-1) === state.user.row_version;
        if (matched) {
          for (const [, column, parameter] of text.matchAll(/"(\w+)" = \$(\d+)/g)) {
            if (column !== "stripe_customer_id") state.user[column] = params[Number(parameter) - 1];
          }
          state.successfulUpdates++;
          state.user.row_version = String(Number(state.user.row_version) + 1);
        }
        return { rows: [], rowCount: matched ? 1 : 0 };
      }
      if (text.startsWith('insert into "webhook_events"')) {
        state.processed.set(params[0], params);
        return { rows: [], rowCount: 1 };
      }
      throw new Error(`Unexpected SQL in offline test: ${text}`);
    },
  };
  const db = drizzle(transport);
  const noop = () => {};
  const dependencies = {
    express: { default: express, Router: express.Router },
    stripe: { default: class { constructor() {
      return { webhooks: sdk.webhooks, subscriptions: { list: async () => ({ data: [], has_more: false }) } };
    } } },
    "../db/client.mjs": { db },
    "../../shared/schema.mjs": { users, webhookEvents },
    "drizzle-orm": { and, eq, sql },
    "../utils/logger.mjs": { logger: { info: noop, warn: noop, error: noop } },
    "../utils/metrics.mjs": { increment: noop },
    "../services/email.mjs": {
      sendUpgradeConfirmation: async () => {},
      sendCancellationAcknowledgment: async (...args) => { state.emails.push(args); },
    },
    "../observability/safetyAlerts.mjs": { alertWebhookSignatureFailure: async () => {} },
  };
  const context = vm.createContext({
    Buffer, Date,
    process: { env: {
      STRIPE_SECRET_KEY: "sk_test_cancellation_offline_fixture",
      STRIPE_WEBHOOK_SECRET: signingSecret,
    } },
  });
  const mapping = new vm.SourceTextModule(mappingSource, { context });
  await mapping.link(() => { throw new Error("Unexpected plan-mapper dependency"); });
  await mapping.evaluate();
  const route = new vm.SourceTextModule(routeSource, { context });
  await route.link(specifier => {
    if (specifier === "../utils/planMapping.mjs") return mapping;
    const exports = dependencies[specifier];
    assert.ok(exports, `Unexpected router dependency: ${specifier}`);
    return new vm.SyntheticModule(Object.keys(exports), function () {
      for (const [name, value] of Object.entries(exports)) this.setExport(name, value);
    }, { context });
  });
  await route.evaluate();
  const app = express();
  app.use("/api/webhooks", route.namespace.default);
  return {
    state,
    send(event = cancellationEvent()) {
      const payload = JSON.stringify(event);
      const signature = sdk.webhooks.generateTestHeaderString({ payload, secret: signingSecret });
      return request(app).post("/api/webhooks/stripe")
        .set("Content-Type", "application/json")
        .set("stripe-signature", signature).send(payload);
    },
  };
}

test("linked customer cancellation downgrades and uses canonical name/email", async () => {
  const f = await fixture();
  const before = Date.now();
  const result = await f.send();
  const after = Date.now();
  assert.equal(result.status, 200);
  assert.equal(f.state.successfulUpdates, 1);
  assert.equal(f.state.user.subscription_status, "free");
  const expiresAt = new Date(f.state.user.subscription_expires_at).getTime();
  assert.ok(expiresAt >= before && expiresAt <= after);
  assert.deepEqual(f.state.emails, [["synthetic@example.invalid", "Cancellation Fixture", 1780000000]]);
  assert.equal(f.state.processed.size, 1);
  const recipientRead = f.state.queries.find(query => query.text.includes('from "users"'));
  assert.match(recipientRead.text, /select "id", "email", "name", "users"\.xmin::text as "row_version"/);
});

test("unmatched customer leaves other users unchanged and sends no cancellation email", async () => {
  const f = await fixture();
  const result = await f.send(cancellationEvent("cus_unmatched_fixture"));
  assert.equal(result.status, 200);
  assert.equal(f.state.successfulUpdates, 0);
  assert.equal(f.state.user.subscription_status, "pro");
  assert.equal(f.state.user.subscription_expires_at, "2099-01-01T00:00:00.000Z");
  assert.equal(f.state.emails.length, 0);
  assert.equal(f.state.processed.size, 1);
});

test("recipient lookup failure remains retryable before any downgrade or notification", async () => {
  const f = await fixture();
  f.state.failUserLookup = true;
  let result = await f.send();
  assert.equal(result.status, 500);
  assert.equal(f.state.updateAttempts, 0);
  assert.equal(f.state.emails.length, 0);
  assert.equal(f.state.processed.size, 0);
  f.state.failUserLookup = false;
  result = await f.send();
  assert.equal(result.status, 200);
  assert.equal(f.state.successfulUpdates, 1);
  assert.equal(f.state.emails.length, 1);
  assert.equal(f.state.processed.size, 1);
});

test("downgrade failure returns 500 with no marker or email and permits retry", async () => {
  const f = await fixture();
  f.state.failUserUpdate = true;
  let result = await f.send();
  assert.equal(result.status, 500);
  assert.equal(f.state.successfulUpdates, 0);
  assert.equal(f.state.user.subscription_status, "pro");
  assert.equal(f.state.emails.length, 0);
  assert.equal(f.state.processed.size, 0);
  f.state.failUserUpdate = false;
  result = await f.send();
  assert.equal(result.status, 200);
  assert.equal(f.state.successfulUpdates, 1);
  assert.equal(f.state.emails.length, 1);
  assert.equal(f.state.processed.size, 1);
});

test("processed cancellation replay does not repeat the downgrade or email", async () => {
  const f = await fixture();
  assert.equal((await f.send()).status, 200);
  const result = await f.send();
  assert.equal(result.status, 200);
  assert.equal(result.body.duplicate, true);
  assert.equal(f.state.updateAttempts, 1);
  assert.equal(f.state.emails.length, 1);
  assert.equal(f.state.processed.size, 1);
});

test("missing customer fails closed without downgrading, notifying, or marking", async () => {
  const f = await fixture();
  const result = await f.send(cancellationEvent(null));
  assert.equal(result.status, 500);
  assert.equal(f.state.updateAttempts, 0);
  assert.equal(f.state.emails.length, 0);
  assert.equal(f.state.processed.size, 0);
});
