import fs from "fs";

function exists(p) {
  return fs.existsSync(p);
}

function read(p) {
  return exists(p) ? fs.readFileSync(p, "utf8") : "";
}

function countFiles(dir) {
  if (!exists(dir)) return 0;
  let count = 0;
  function walk(p) {
    for (const item of fs.readdirSync(p, { withFileTypes: true })) {
      const full = `${p}/${item.name}`;
      if (item.isDirectory()) walk(full);
      else count++;
    }
  }
  walk(dir);
  return count;
}

function mode(v, type) {
  if (!v) return "missing";
  if (type === "secret" && v.startsWith("sk_test_")) return "test";
  if (type === "secret" && v.startsWith("sk_live_")) return "live";
  if (type === "public" && v.startsWith("pk_test_")) return "test";
  if (type === "public" && v.startsWith("pk_live_")) return "live";
  return "unknown";
}

const billingClient = read("client/src/services/billingClient.js");
const billingRoute = read("server/routes/billing.mjs");
const webhookRoute = read("server/routes/webhook.mjs");
const app = read("server/app.mjs");

const secretMode = mode(process.env.STRIPE_SECRET_KEY, "secret");
const publishableMode = mode(process.env.STRIPE_PUBLISHABLE_KEY, "public");
const vitePublishableMode = mode(process.env.VITE_STRIPE_PUBLISHABLE_KEY, "public");

const stripeAligned =
  secretMode !== "missing" &&
  vitePublishableMode !== "missing" &&
  secretMode === vitePublishableMode &&
  (publishableMode === "missing" || publishableMode === secretMode);

const report = {
  timestamp: new Date().toISOString(),
  verifiedState: {
    packageJson: exists("package.json"),
    serverApp: exists("server/app.mjs"),
    clientSrc: exists("client/src"),
    sharedSchema: exists("shared/schema.mjs"),
    distIndex: exists("client/dist/index.html"),
    pagesCount: countFiles("client/src/pages"),
    componentsCount: countFiles("client/src/components"),
    serverFileCount: countFiles("server"),
    sharedFileCount: countFiles("shared")
  },
  runtimeWiring: {
    usesPortEnv: app.includes("process.env.PORT"),
    hasListen: app.includes(".listen("),
    billingMounted: app.includes("/api/billing"),
    webhookMounted: app.includes("/api/webhooks") || app.includes("/api/webhook"),
    healthReadyPresent: app.includes("health") && app.includes("ready")
  },
  billingSafety: {
    clientBillingExists: exists("client/src/services/billingClient.js"),
    clientCallsServerCheckout: billingClient.includes("/api/billing/checkout"),
    clientExportsCheckout: billingClient.includes("createCheckoutSession"),
    serverCreatesCheckoutSession: billingRoute.includes("checkout.sessions.create"),
    serverCreatesPortalSession: billingRoute.includes("billingPortal.sessions.create"),
    webhookHandlesCheckoutComplete: webhookRoute.includes("checkout.session.completed"),
    webhookHandlesSubscriptionUpdated: webhookRoute.includes("customer.subscription.updated"),
    webhookHandlesInvoicePaid: webhookRoute.includes("invoice.paid")
  },
  stripeGate: {
    secretMode,
    publishableMode,
    vitePublishableMode,
    aligned: stripeAligned,
    safeForCheckoutTesting: stripeAligned
  },
  hardBlockersBeforeRevenueTesting: [
    ...(!stripeAligned ? ["Stripe keys are not mode-aligned or VITE_STRIPE_PUBLISHABLE_KEY is missing."] : []),
    ...(process.env.CORS_ORIGIN === "*" ? ["CORS_ORIGIN is wildcard and must be restricted before production."] : []),
    "Rotate every exposed Stripe/Replit/GitHub token before production.",
    "Review and patch GitHub Dependabot vulnerabilities.",
    "Run Stripe test checkout only after secret rotation and Stripe mode alignment."
  ]
};

fs.writeFileSync("diagnostics/phase14/current-state-report.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
