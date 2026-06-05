const env = process.env;

function mode(value) {
  if (!value) return "missing";
  if (value.startsWith("sk_test_") || value.startsWith("pk_test_")) return "test";
  if (value.startsWith("sk_live_") || value.startsWith("pk_live_")) return "live";
  return "unknown";
}

const report = {
  timestamp: new Date().toISOString(),
  secretKeyMode: mode(env.STRIPE_SECRET_KEY),
  publishableKeyMode: mode(env.STRIPE_PUBLISHABLE_KEY),
  vitePublishableKeyMode: mode(env.VITE_STRIPE_PUBLISHABLE_KEY),
  webhookSecretPresent: Boolean(env.STRIPE_WEBHOOK_SECRET),
  requiredAction: [],
};

if (report.secretKeyMode === "test" && report.publishableKeyMode === "live") {
  report.requiredAction.push("Replace STRIPE_PUBLISHABLE_KEY with pk_test_* OR replace STRIPE_SECRET_KEY with sk_live_*.");
}

if (report.secretKeyMode === "live" && report.publishableKeyMode === "test") {
  report.requiredAction.push("Replace STRIPE_PUBLISHABLE_KEY with pk_live_* OR replace STRIPE_SECRET_KEY with sk_test_*.");
}

if (report.vitePublishableKeyMode === "missing") {
  report.requiredAction.push("Add VITE_STRIPE_PUBLISHABLE_KEY in Replit Secrets.");
}

if (!report.webhookSecretPresent) {
  report.requiredAction.push("Add STRIPE_WEBHOOK_SECRET in Replit Secrets.");
}

report.safeForCheckoutTesting = report.requiredAction.length === 0;

console.log(JSON.stringify(report, null, 2));

if (!report.safeForCheckoutTesting) {
  process.exitCode = 2;
}
