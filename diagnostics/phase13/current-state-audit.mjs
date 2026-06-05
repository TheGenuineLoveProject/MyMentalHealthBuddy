import fs from "fs";

function exists(path) {
  return fs.existsSync(path);
}

function read(path) {
  return exists(path) ? fs.readFileSync(path, "utf8") : "";
}

const billingClient = read("client/src/services/billingClient.js");
const ledger = read("docs/operations/A_TO_Z_EXECUTION_LEDGER.md");

const report = {
  timestamp: new Date().toISOString(),
  platform: {
    packageJson: exists("package.json"),
    clientSrc: exists("client/src"),
    serverApp: exists("server/app.mjs"),
    sharedSchema: exists("shared/schema.mjs"),
    distExists: exists("client/dist/index.html")
  },
  billingClient: {
    exists: exists("client/src/services/billingClient.js"),
    exportsCreateCheckoutSession: billingClient.includes("createCheckoutSession"),
    referencesServerCheckoutRoute: billingClient.includes("/api/billing/checkout"),
    clientSecretLeakPatternPresent: billingClient.includes("STRIPE_SECRET_KEY")
  },
  operationsLedger: {
    exists: exists("docs/operations/A_TO_Z_EXECUTION_LEDGER.md"),
    mentionsStripeBlocker: ledger.toLowerCase().includes("stripe"),
    mentionsSecretRotation: ledger.toLowerCase().includes("secret")
  },
  knownDeploymentBlockers: [
    "Rotate exposed Stripe/Replit/GitHub secrets before production.",
    "Align Stripe secret and publishable keys to the same mode.",
    "Add VITE_STRIPE_PUBLISHABLE_KEY in Replit Secrets.",
    "Restrict production CORS from wildcard to the real domain.",
    "Review GitHub Dependabot vulnerabilities.",
    "Run checkout/webhook tests only after Stripe secrets are aligned."
  ]
};

fs.writeFileSync("diagnostics/phase13/current-state-audit.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
