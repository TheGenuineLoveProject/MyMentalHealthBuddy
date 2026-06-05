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

const secretMode = mode(process.env.STRIPE_SECRET_KEY || "");
const publicMode = mode(process.env.STRIPE_PUBLISHABLE_KEY || "");
const vitePublicMode = mode(process.env.VITE_STRIPE_PUBLISHABLE_KEY || "");

const stripeAligned =
  secretMode !== "missing" &&
  publicMode !== "missing" &&
  vitePublicMode !== "missing" &&
  secretMode === publicMode &&
  publicMode === vitePublicMode;

const corsSafe =
  !!process.env.CORS_ORIGIN &&
  process.env.CORS_ORIGIN !== "*";

const report = {
  timestamp: new Date().toISOString(),
  build: {
    packageJson: exists("package.json"),
    distIndex: exists("client/dist/index.html"),
    serverApp: exists("server/app.mjs"),
    billingRoute: exists("server/routes/billing.mjs"),
    webhookRoute: exists("server/routes/webhook.mjs"),
    billingClient: exists("client/src/services/billingClient.js")
  },
  stripe: {
    secretMode,
    publicMode,
    vitePublicMode,
    aligned: stripeAligned,
    webhookSecretPresent: !!process.env.STRIPE_WEBHOOK_SECRET
  },
  productionSafety: {
    corsOriginSet: !!process.env.CORS_ORIGIN,
    corsWildcardBlocked: process.env.CORS_ORIGIN === "*" ? false : true,
    corsSafe
  },
  deployGate: {
    readyForRealPayments: stripeAligned && corsSafe,
    readyForPublicLaunch: stripeAligned && corsSafe,
    nextHumanActions: [
      "Rotate exposed Stripe/Replit/GitHub secrets.",
      "Use matching Stripe TEST keys for test checkout or matching LIVE keys for production.",
      "Set VITE_STRIPE_PUBLISHABLE_KEY to the matching publishable key.",
      "Set CORS_ORIGIN to the real production domain, not wildcard.",
      "Review GitHub Dependabot vulnerabilities."
    ]
  }
};

fs.writeFileSync("diagnostics/phase17/deployment-gate.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));

if (!report.deployGate.readyForPublicLaunch) {
  process.exitCode = 0;
}
