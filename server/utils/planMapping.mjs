// Deterministic Stripe price-id → internal plan mapping.
// Returns null for unknown price IDs — callers MUST handle null explicitly
// and NEVER default unknown plans to "pro".
// Built from the same STRIPE_PRICE_* env vars billing.mjs uses, so the
// checkout side and the webhook side stay in sync via shared env source.

const VALID_PAID_PLANS = ["starter", "pro", "elite"];

let _priceMap = null;
function priceMap() {
  if (_priceMap) return _priceMap;
  const m = new Map();
  const add = (envVal, plan) => {
    if (envVal && typeof envVal === "string") m.set(envVal, plan);
  };
  add(process.env.STRIPE_PRICE_STARTER,        "starter");
  add(process.env.STRIPE_PRICE_PRO,            "pro");
  add(process.env.STRIPE_PRICE_PRO_MONTHLY,    "pro");
  add(process.env.STRIPE_PRICE_PRO_YEARLY,     "pro");
  add(process.env.STRIPE_PRICE_ELITE,          "elite");
  add(process.env.STRIPE_PRICE_ELITE_MONTHLY,  "elite");
  add(process.env.STRIPE_PRICE_ELITE_YEARLY,   "elite");
  _priceMap = m;
  return m;
}

export function mapPriceIdToPlan(priceId) {
  if (!priceId || typeof priceId !== "string") return null;
  return priceMap().get(priceId) || null;
}

export function mapSubscriptionToPlan(subscription) {
  const priceId = subscription?.items?.data?.[0]?.price?.id;
  return mapPriceIdToPlan(priceId);
}

export function mapInvoiceToPlan(invoice) {
  const priceId = invoice?.lines?.data?.[0]?.price?.id;
  return mapPriceIdToPlan(priceId);
}

// AUTHORITATIVE plan derivation for a Stripe Checkout Session.
// PRIORITY 1: line_items[0].price.id — what Stripe actually charged (trustworthy).
// PRIORITY 2: session.metadata.plan — client-supplied at session creation
//   (only trusted when NO line item price ID is present at all, AND value
//    is allow-listed).
// SECURITY rules:
//   - Both present and AGREE                 → grant price-derived plan
//   - Both present and DISAGREE              → null  (security mismatch)
//   - Line item price present but UNMAPPABLE → null  (NEVER fall back to
//                                                     client metadata when
//                                                     a real charge exists
//                                                     for an unknown price)
//   - Line item absent + valid metadata      → grant metadata plan
//   - Line item absent + invalid metadata    → null
// Returns null on unknown/mismatch — caller fails safely.
export function resolvePlanFromCheckoutSession(session) {
  const lineItemPriceId = session?.line_items?.data?.[0]?.price?.id;
  const priceDerivedPlan = mapPriceIdToPlan(lineItemPriceId);
  const metaPlan = session?.metadata?.plan;
  const metaIsValid = VALID_PAID_PLANS.includes(metaPlan);

  if (lineItemPriceId) {
    // A charge with a real price ID exists — the price is the only trustworthy
    // signal. If it cannot be mapped, refuse entitlement regardless of metadata.
    if (!priceDerivedPlan) return null;
    if (metaIsValid && metaPlan !== priceDerivedPlan) return null; // mismatch
    return priceDerivedPlan;
  }
  // No line item price at all (e.g., retrieve failed and webhook payload
  // had none) — fall back to metadata.plan only when allow-listed.
  if (metaIsValid) return metaPlan;
  return null;
}

// Diagnostic helper: returns the structured derivation so callers can log
// the discrepancy (price-derived vs metadata) when resolvePlan returns null.
export function diagnosePlanResolution(session) {
  const lineItemPriceId = session?.line_items?.data?.[0]?.price?.id ?? null;
  const priceDerivedPlan = mapPriceIdToPlan(lineItemPriceId);
  const metaPlan = session?.metadata?.plan ?? null;
  const metaIsValid = VALID_PAID_PLANS.includes(metaPlan);
  return {
    lineItemPriceId,
    priceDerivedPlan,
    metadataPlan: metaPlan,
    metadataIsValid: metaIsValid,
    mismatch: !!(priceDerivedPlan && metaIsValid && metaPlan !== priceDerivedPlan),
  };
}

export { VALID_PAID_PLANS };
