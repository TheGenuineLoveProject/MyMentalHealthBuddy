const env = process.env;

function modeOf(value, livePrefix, testPrefix) {
  if (!value) return "missing";
  if (value.startsWith(livePrefix)) return "live";
  if (value.startsWith(testPrefix)) return "test";
  return "unknown";
}

const secretMode = modeOf(env.STRIPE_SECRET_KEY || "", "sk_live_", "sk_test_");
const publicMode =
  modeOf(env.STRIPE_PUBLISHABLE_KEY || "", "pk_live_", "pk_test_") ||
  modeOf(env.VITE_STRIPE_PUBLISHABLE_KEY || "", "pk_live_", "pk_test_");

const vitePublicMode = modeOf(env.VITE_STRIPE_PUBLISHABLE_KEY || "", "pk_live_", "pk_test_");
const serverPublicMode = modeOf(env.STRIPE_PUBLISHABLE_KEY || "", "pk_live_", "pk_test_");

const requiredPrices = [
  "STRIPE_PRICE_STARTER",
  "STRIPE_PRICE_PRO",
  "STRIPE_PRICE_PRO_MONTHLY",
  "STRIPE_PRICE_PRO_YEARLY",
  "STRIPE_PRICE_ELITE",
  "STRIPE_PRICE_ELITE_MONTHLY",
  "STRIPE_PRICE_ELITE_YEARLY",
];

const priceStatus = Object.fromEntries(
  requiredPrices.map((key) => [key, env[key] ? "present" : "missing"])
);

const result = {
  timestamp: new Date().toISOString(),
  stripe: {
    secretMode,
    serverPublicMode,
    vitePublicMode,
    modeAligned:
      secretMode !== "missing" &&
      secretMode !== "unknown" &&
      (serverPublicMode === secretMode || vitePublicMode === secretMode),
  },
  webhookSecret: env.STRIPE_WEBHOOK_SECRET ? "present" : "missing",
  prices: priceStatus,
  recommendation:
    secretMode === "test" && (serverPublicMode === "live" || vitePublicMode === "live")
      ? "CRITICAL: replace publishable key with TEST publishable key OR replace secret key with LIVE secret key. Do not mix test and live."
      : secretMode === "live" && (serverPublicMode === "test" || vitePublicMode === "test")
      ? "CRITICAL: replace publishable key with LIVE publishable key OR replace secret key with TEST secret key. Do not mix test and live."
      : "Stripe key modes appear aligned or need missing-key completion.",
};

console.log(JSON.stringify(result, null, 2));
