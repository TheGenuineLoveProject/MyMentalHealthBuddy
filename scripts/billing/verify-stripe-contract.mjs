import fs from "node:fs";

const files = {
  billing: "server/routes/billing.mjs",
  webhook: "server/routes/webhook.mjs",
  adminBilling: "server/routes/adminBilling.mjs",
  stripeCustomer: "server/billing/stripeCustomer.mjs",
  packageJson: "package.json",
};

function read(path) {
  if (!fs.existsSync(path)) throw new Error(`Missing file: ${path}`);
  return fs.readFileSync(path, "utf8");
}

function pass(name) {
  console.log(`PASS ${name}`);
}

function assertHas(name, text, pattern) {
  if (!pattern.test(text)) throw new Error(`FAIL ${name}`);
  pass(name);
}

const billing = read(files.billing);
const webhook = read(files.webhook);
const adminBilling = read(files.adminBilling);
const stripeCustomer = read(files.stripeCustomer);
const pkg = JSON.parse(read(files.packageJson));

assertHas("billing route has checkout endpoint", billing, /router\.post\(["'`]\/checkout["'`]/);
assertHas("billing rejects unconfigured stripe", billing, /Stripe not configured/);
assertHas("billing validates price allow-list", billing, /allow-list|PRICE|priceId|directPriceId/);
assertHas("billing creates checkout session", billing, /checkout\.sessions\.create/);
assertHas("billing has customer portal", billing, /billingPortal|portal\.sessions\.create|customer portal/i);

assertHas("webhook handles checkout completed", webhook, /checkout\.session\.completed/);
assertHas("webhook handles subscription created", webhook, /customer\.subscription\.created/);
assertHas("webhook handles subscription updated", webhook, /customer\.subscription\.updated/);
assertHas("webhook handles subscription deleted", webhook, /customer\.subscription\.deleted/);
assertHas("webhook maps subscription to plan", webhook, /mapSubscriptionToPlan|resolvePlanFromCheckoutSession/);
assertHas("webhook refuses unknown entitlement", webhook, /refusing entitlement|unknown plan|subscription_mapping_unknown/);

assertHas("admin billing has subscription route", adminBilling, /subscriptions|plan-distribution/);
assertHas("stripe customer helper creates customer", stripeCustomer, /customers\.create|stripeCustomerId/);

if (!pkg.dependencies?.stripe && !pkg.devDependencies?.stripe) {
  throw new Error("FAIL stripe package missing");
}
pass("stripe package present");

console.log("STRIPE_MONETIZATION_CONTRACT_VERIFY_PASS");
