import fs from "fs";

function exists(path) {
  return fs.existsSync(path);
}

function read(path) {
  return exists(path) ? fs.readFileSync(path, "utf8") : "";
}

function countFiles(dir, exts = []) {
  if (!exists(dir)) return 0;
  const out = [];
  function walk(p) {
    for (const item of fs.readdirSync(p, { withFileTypes: true })) {
      const full = `${p}/${item.name}`;
      if (item.isDirectory()) walk(full);
      else if (!exts.length || exts.some(ext => full.endsWith(ext))) out.push(full);
    }
  }
  walk(dir);
  return out.length;
}

function keyMode(v, sk = false) {
  if (!v) return "missing";
  if (sk && v.startsWith("sk_test_")) return "test";
  if (sk && v.startsWith("sk_live_")) return "live";
  if (!sk && v.startsWith("pk_test_")) return "test";
  if (!sk && v.startsWith("pk_live_")) return "live";
  return "unknown";
}

const app = read("server/app.mjs");
const billing = read("server/routes/billing.mjs");
const webhook = read("server/routes/webhook.mjs");
const billingClient = read("client/src/services/billingClient.js");
const pricingPage = read("client/src/pages/Pricing.jsx") + "\n" + read("client/src/pages/PricingPage.jsx");

const secretMode = keyMode(process.env.STRIPE_SECRET_KEY, true);
const publicMode = keyMode(process.env.STRIPE_PUBLISHABLE_KEY, false);
const viteMode = keyMode(process.env.VITE_STRIPE_PUBLISHABLE_KEY, false);

const stripeAligned =
  secretMode !== "missing" &&
  viteMode !== "missing" &&
  secretMode === viteMode &&
  (publicMode === "missing" || publicMode === secretMode);

const report = {
  timestamp: new Date().toISOString(),
  inventory: {
    pages: countFiles("client/src/pages", [".jsx", ".tsx"]),
    components: countFiles("client/src/components", [".jsx", ".tsx", ".js", ".ts"]),
    serverFiles: countFiles("server", [".mjs", ".js"]),
    sharedFiles: countFiles("shared", [".mjs", ".js", ".ts"])
  },
  runtimeEntrypoint: {
    serverAppExists: exists("server/app.mjs"),
    usesProcessEnvPort: app.includes("process.env.PORT"),
    hasListen: app.includes(".listen("),
    hasHealthMount: app.includes("/api/health") || app.includes("healthRoutes"),
    hasReadyMount: app.includes("/api/ready") || app.includes("ready"),
    hasBillingMount: app.includes("/api/billing"),
    hasWebhookMount: app.includes("/api/webhooks") || app.includes("/api/webhook")
  },
  revenueGate: {
    billingRouteExists: exists("server/routes/billing.mjs"),
    webhookRouteExists: exists("server/routes/webhook.mjs"),
    checkoutSessionServerCreate: billing.includes("checkout.sessions.create"),
    checkoutClientFunction: billingClient.includes("createCheckoutSession"),
    billingPortalServerCreate: billing.includes("billingPortal.sessions.create"),
    subscriptionStatusRoute: billing.includes("subscription-status"),
    webhookCheckoutCompleted: webhook.includes("checkout.session.completed"),
    webhookSubscriptionUpdated: webhook.includes("customer.subscription.updated"),
    webhookInvoicePaid: webhook.includes("invoice.paid"),
    pricingPageReferencesCheckout: pricingPage.includes("createCheckoutSession") || pricingPage.includes("/api/billing/checkout")
  },
  stripeMode: {
    secretMode,
    publishableMode: publicMode,
    vitePublishableMode: viteMode,
    aligned: stripeAligned,
    safeForCheckoutTesting: stripeAligned
  },
  blockers: [
    ...(!stripeAligned ? ["Stripe keys are not aligned or VITE_STRIPE_PUBLISHABLE_KEY is missing."] : []),
    ...(process.env.CORS_ORIGIN === "*" ? ["CORS_ORIGIN is wildcard and must be restricted before production."] : []),
    "Rotate every secret/key/token that appeared in screenshots before production.",
    "Review GitHub Dependabot vulnerabilities before production deployment.",
    "Run real checkout and webhook tests only after Stripe mode alignment."
  ],
  nextSafeAction: stripeAligned
    ? "Proceed to test checkout with Stripe test card and webhook delivery."
    : "Fix Replit Secrets first: align Stripe modes and add VITE_STRIPE_PUBLISHABLE_KEY."
};

fs.writeFileSync("diagnostics/phase14/deployment-revenue-gate-audit.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
