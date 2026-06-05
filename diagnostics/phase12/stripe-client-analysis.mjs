import fs from "fs";

const file = "client/src/services/billingClient.js";
const text = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";

const report = {
  timestamp: new Date().toISOString(),
  billingClientExists: fs.existsSync(file),
  usesViteStripePublishableKey: text.includes("VITE_STRIPE_PUBLISHABLE_KEY"),
  usesServerSecretKeyClientSide: text.includes("STRIPE_SECRET_KEY"),
  exportsCreateCheckoutSession: text.includes("createCheckoutSession"),
  recommendation: "Client must never use STRIPE_SECRET_KEY. Checkout should call server /api/billing/checkout only."
};

fs.writeFileSync("diagnostics/phase12/stripe-client-analysis.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
