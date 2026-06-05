import fs from "fs";

function exists(path) {
  return fs.existsSync(path);
}

function mode(value) {
  if (!value) return "missing";
  if (value.startsWith("sk_test_") || value.startsWith("pk_test_")) return "test";
  if (value.startsWith("sk_live_") || value.startsWith("pk_live_")) return "live";
  return "unknown";
}

const stripeSecretMode = mode(process.env.STRIPE_SECRET_KEY || "");
const stripePublishableMode = mode(process.env.STRIPE_PUBLISHABLE_KEY || "");
const viteStripeMode = mode(process.env.VITE_STRIPE_PUBLISHABLE_KEY || "");
const corsOrigin = process.env.CORS_ORIGIN || "";

const report = {
  timestamp: new Date().toISOString(),
  files: {
    packageJson: exists("package.json"),
    serverApp: exists("server/app.mjs"),
    clientDist: exists("client/dist/index.html"),
    billingRoute: exists("server/routes/billing.mjs"),
    webhookRoute: exists("server/routes/webhook.mjs"),
    billingClient: exists("client/src/services/billingClient.js")
  },
  stripe: {
    secretMode: stripeSecretMode,
    publishableMode: stripePublishableMode,
    vitePublishableMode: viteStripeMode,
    webhookSecretPresent: Boolean(process.env.STRIPE_WEBHOOK_SECRET),
    aligned:
      stripeSecretMode !== "missing" &&
      stripePublishableMode !== "missing" &&
      viteStripeMode !== "missing" &&
      stripeSecretMode === stripePublishableMode &&
      stripeSecretMode === viteStripeMode
  },
  cors: {
    value: corsOrigin || "missing",
    present: Boolean(corsOrigin),
    wildcard: corsOrigin === "*",
    productionSafe: Boolean(corsOrigin) && corsOrigin !== "*"
  },
  gate: {
    readyForRealPayments: false,
    readyForPublicProduction: false
  }
};

report.gate.readyForRealPayments =
  report.files.billingRoute &&
  report.files.webhookRoute &&
  report.files.billingClient &&
  report.stripe.aligned &&
  report.stripe.webhookSecretPresent;

report.gate.readyForPublicProduction =
  report.files.packageJson &&
  report.files.serverApp &&
  report.files.clientDist &&
  report.gate.readyForRealPayments &&
  report.cors.productionSafe;

report.nextActions = [];
if (!report.stripe.aligned) report.nextActions.push("Fix Stripe secrets: STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY, and VITE_STRIPE_PUBLISHABLE_KEY must exist and use the same mode.");
if (!report.stripe.webhookSecretPresent) report.nextActions.push("Rotate and set STRIPE_WEBHOOK_SECRET.");
if (!report.cors.productionSafe) report.nextActions.push("Set CORS_ORIGIN to the production domain, not wildcard.");
if (!report.gate.readyForPublicProduction) report.nextActions.push("Do not run real payments or public production launch yet.");

console.log(JSON.stringify(report, null, 2));
process.exit(report.gate.readyForPublicProduction ? 0 : 1);
