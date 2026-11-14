// Run: node --experimental-vm-modules --test server/tests/billing-starter-checkout.test.mjs
// The real router, Express raw-body middleware, Stripe signature verification,
// and plan mapper run against synthetic database and provider boundaries.
import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import vm from "node:vm";
import express from "express";
import request from "supertest";
import Stripe from "stripe";

const signingSecret = "whsec_offline_fixture";
const sdk = new Stripe("sk_test_offline_fixture");
const routeSource = fs.readFileSync(new URL("../routes/webhook.mjs", import.meta.url), "utf8");
const mappingSource = fs.readFileSync(new URL("../utils/planMapping.mjs", import.meta.url), "utf8");

function starterSession(overrides = {}) {
  return {
    id: "cs_starter_fixture",
    mode: "payment",
    payment_status: "paid",
    customer: "cus_offline_fixture",
    subscription: null,
    customer_details: { email: "synthetic@example.invalid", name: "Fixture" },
    metadata: { plan: "starter" },
    line_items: { data: [{ price: { id: "price_starter_fixture" } }] },
    ...overrides,
  };
}

function checkoutEvent(session, type = "checkout.session.completed", id = "evt_offline_fixture") {
  // Real Checkout events omit expanded line items. Only the retrieved session
  // can establish which configured price was charged.
  const object = { ...session };
  delete object.line_items;
  return { id, type, data: { object } };
}

async function fixture(session = starterSession()) {
  const state = {
    session,
    retrievalError: null,
    retrievals: [],
    updates: [],
    emails: [],
    logEntries: [],
    signatureAlerts: [],
    matchedUsers: 1,
    processed: new Set(),
  };
  const db = {
    select: () => ({ from: () => ({ where: async condition =>
      state.processed.has(condition.value) ? [{ id: condition.value }] : [],
    }) }),
    update: () => ({ set: values => ({ where: async condition => {
      state.updates.push({ values, condition });
      return { rowCount: state.matchedUsers };
    } }) }),
    insert: () => ({ values: async values => { state.processed.add(values.id); } }),
  };
  const stripe = {
    webhooks: sdk.webhooks,
    checkout: { sessions: { retrieve: async (id, options) => {
      state.retrievals.push({ id, options });
      if (state.retrievalError) throw state.retrievalError;
      return state.session;
    } } },
  };
  const noop = () => {};
  const captureLog = (...args) => { state.logEntries.push(args); };
  const dependencies = {
    express: { default: express, Router: express.Router },
    stripe: { default: class { constructor() { return stripe; } } },
    "../db/client.mjs": { db },
    "../../shared/schema.mjs": {
      users: { email: "email", stripeCustomerId: "stripeCustomerId" },
      webhookEvents: { id: "id" },
    },
    "drizzle-orm": { eq: (column, value) => ({ column, value }) },
    "../utils/logger.mjs": { logger: { info: captureLog, warn: captureLog, error: captureLog } },
    "../utils/metrics.mjs": { increment: noop },
    "../services/email.mjs": {
      sendUpgradeConfirmation: async (...args) => { state.emails.push(args); },
      sendCancellationAcknowledgment: async () => {},
    },
    "../observability/safetyAlerts.mjs": {
      alertWebhookSignatureFailure: async details => { state.signatureAlerts.push(details); },
    },
  };
  // Isolated env prevents this suite from loading application credentials or
  // opening an application database, even when invoked in an owner's checkout.
  const context = vm.createContext({
    Buffer, Date,
    process: { env: {
      STRIPE_SECRET_KEY: "sk_test_offline_fixture",
      STRIPE_WEBHOOK_SECRET: signingSecret,
      STRIPE_PRICE_STARTER: "price_starter_fixture",
      STRIPE_PRICE_PRO: "price_pro_fixture",
      STRIPE_PRICE_ELITE: "price_elite_fixture",
    } },
  });
  const mapping = new vm.SourceTextModule(mappingSource, { context, identifier: "planMapping" });
  await mapping.link(() => { throw new Error("Unexpected plan-mapper dependency"); });
  await mapping.evaluate();
  const route = new vm.SourceTextModule(routeSource, { context, identifier: "webhook" });
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
    async send(event, validSignature = true) {
      const payload = JSON.stringify(event);
      const signature = sdk.webhooks.generateTestHeaderString({
        payload, secret: validSignature ? signingSecret : "whsec_invalid_fixture",
      });
      return request(app).post("/api/webhooks/stripe")
        .set("Content-Type", "application/json")
        .set("stripe-signature", signature).send(payload);
    },
  };
}

test("paid one-time Starter activates without a subscription and clears stale expiry", async () => {
  const f = await fixture();
  const result = await f.send(checkoutEvent(f.state.session));
  assert.equal(result.status, 200);
  assert.equal(f.state.retrievals.length, 1);
  assert.equal(f.state.retrievals[0].options.expand[0], "line_items");
  assert.equal(f.state.updates.length, 1);
  assert.equal(f.state.updates[0].values.subscriptionStatus, "starter");
  assert.equal(f.state.updates[0].values.subscriptionExpiresAt, null);
  assert.equal(f.state.updates[0].values.stripeCustomerId, "cus_offline_fixture");
  assert.equal(f.state.updates[0].condition.value, "synthetic@example.invalid");
  assert.equal(f.state.emails.length, 1);
  assert.equal(f.state.processed.size, 1);
});

test("an unpaid completion is acknowledged; a later async success activates Starter", async () => {
  const f = await fixture(starterSession({ payment_status: "unpaid" }));
  let result = await f.send(checkoutEvent(f.state.session, undefined, "evt_pending"));
  assert.equal(result.status, 200);
  assert.equal(f.state.updates.length, 0);
  assert.equal(f.state.emails.length, 0);
  assert.ok(f.state.processed.has("evt_pending"));
  f.state.session = starterSession();
  result = await f.send(checkoutEvent(f.state.session, "checkout.session.async_payment_succeeded", "evt_settled"));
  assert.equal(result.status, 200);
  assert.equal(f.state.retrievals.length, 2);
  assert.equal(f.state.updates.length, 1);
  assert.equal(f.state.updates[0].values.subscriptionStatus, "starter");
  assert.equal(f.state.emails.length, 1);
  assert.equal(f.state.processed.size, 2);
});

for (const [name, overrides] of [
  ["unpaid payment", { payment_status: "unpaid" }],
  ["no-payment-required session", { payment_status: "no_payment_required" }],
  ["subscription-mode retrieval", { mode: "subscription" }],
  ["metadata-only plan", { line_items: { data: [] } }],
  ["unknown charged price", { line_items: { data: [{ price: { id: "price_unknown_fixture" } }] } }],
  ["recurring Pro price", { metadata: { plan: "pro" }, line_items: { data: [{ price: { id: "price_pro_fixture" } }] } }],
  ["Starter price with conflicting metadata", { metadata: { plan: "elite" } }],
]) {
  test(`authoritative ${name} cannot activate a one-time Starter purchase`, async () => {
    const f = await fixture(starterSession(overrides));
    const result = await f.send(checkoutEvent(starterSession()));
    assert.equal(result.status, 200);
    assert.equal(f.state.retrievals.length, 1);
    assert.equal(f.state.updates.length, 0);
    assert.equal(f.state.emails.length, 0);
  });
}

test("async success also requires authoritative paid status", async () => {
  const f = await fixture(starterSession({ payment_status: "unpaid" }));
  const result = await f.send(checkoutEvent(starterSession(), "checkout.session.async_payment_succeeded"));
  assert.equal(result.status, 200);
  assert.equal(f.state.retrievals.length, 1);
  assert.equal(f.state.updates.length, 0);
  assert.equal(f.state.emails.length, 0);
});

test("retrieval failure returns 500 without a marker; retry can activate", async () => {
  const f = await fixture();
  f.state.retrievalError = new Error("synthetic-provider-error cs_starter_fixture synthetic@example.invalid");
  const event = checkoutEvent(f.state.session);
  let result = await f.send(event);
  assert.equal(result.status, 500);
  assert.equal(f.state.processed.size, 0);
  assert.equal(f.state.updates.length, 0);
  assert.match(JSON.stringify(f.state.logEntries), /line_items retrieve FAILED/);
  assert.doesNotMatch(JSON.stringify(f.state.logEntries), /synthetic-provider-error|cs_starter_fixture|example\.invalid/);
  f.state.retrievalError = null;
  result = await f.send(event);
  assert.equal(result.status, 200);
  assert.equal(f.state.updates.length, 1);
  assert.equal(f.state.processed.size, 1);
});

test("replaying a processed Starter event does not repeat activation or email", async () => {
  const f = await fixture();
  const event = checkoutEvent(f.state.session);
  assert.equal((await f.send(event)).status, 200);
  const result = await f.send(event);
  assert.equal(result.status, 200);
  assert.equal(result.body.duplicate, true);
  assert.equal(f.state.retrievals.length, 1);
  assert.equal(f.state.updates.length, 1);
  assert.equal(f.state.emails.length, 1);
});

test("existing subscription checkout remains handled without resetting its expiry", async () => {
  const session = starterSession({
    mode: "subscription", subscription: "sub_offline_fixture",
    metadata: { plan: "pro" }, line_items: { data: [{ price: { id: "price_pro_fixture" } }] },
  });
  const f = await fixture(session);
  assert.equal((await f.send(checkoutEvent(session))).status, 200);
  assert.equal(f.state.updates.length, 1);
  assert.equal(f.state.updates[0].values.subscriptionStatus, "pro");
  assert.equal("subscriptionExpiresAt" in f.state.updates[0].values, false);
});

test("invalid signature has no database or provider effects", async () => {
  const f = await fixture();
  const result = await f.send(checkoutEvent(f.state.session), false);
  assert.equal(result.status, 400);
  assert.equal(f.state.retrievals.length, 0);
  assert.equal(f.state.updates.length, 0);
  assert.equal(f.state.processed.size, 0);
  assert.deepEqual(
    JSON.parse(JSON.stringify(f.state.signatureAlerts)),
    [{ provider: "stripe", error: "Signature verification failed" }],
  );
  assert.deepEqual(f.state.logEntries, [["Stripe webhook signature verification failed"]]);
});

test("checkout logs omit buyer and provider identifiers when no user matches", async () => {
  const f = await fixture();
  f.state.matchedUsers = 0;
  assert.equal((await f.send(checkoutEvent(f.state.session))).status, 200);
  const logged = JSON.stringify(f.state.logEntries);
  assert.match(logged, /no user matched by email/);
  assert.doesNotMatch(logged, /synthetic@example\.invalid|cus_offline_fixture|cs_starter_fixture|evt_offline_fixture/);
  assert.equal(f.state.updates[0].condition.value, "synthetic@example.invalid");
});

test("checkout plan diagnostics omit arbitrary metadata and provider price identifiers", async () => {
  const session = starterSession({
    mode: "subscription",
    subscription: "sub_offline_fixture",
    metadata: { plan: "synthetic-metadata" },
    line_items: { data: [{ price: { id: "price_offline_unknown_fixture" } }] },
  });
  const f = await fixture(session);
  assert.equal((await f.send(checkoutEvent(session))).status, 200);
  const logged = JSON.stringify(f.state.logEntries);
  assert.match(logged, /unknown plan/);
  assert.match(logged, /"metadataIsValid":false/);
  assert.doesNotMatch(logged, /synthetic-metadata|price_offline_unknown_fixture|cs_starter_fixture/);
  assert.equal(f.state.updates.length, 0);
});
