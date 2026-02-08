/**
 * Platform Status Snapshot
 * Machine-readable status report for The Genuine Love Project
 * Generated: 2026-02-08
 * 
 * This file is a static reference. It does NOT execute code.
 * Update this file when platform state changes.
 */

export const PLATFORM_STATUS = {
  version: "1.0.0",
  lastVerified: "2026-02-08",

  subscriptionPipeline: {
    status: "LIVE",
    tiers: ["free", "pro"],
    canonicalField: "users.subscription_status",
    allowedValues: ["free", "pro"],
    defaultValue: "free",
    sourceOfTruth: "database column, never raw Stripe status",
  },

  billingReadiness: {
    status: "LIVE",
    stripeProductsCreated: true,
    checkoutRoute: "/api/stripe/create-checkout-session",
    portalRoute: "/api/stripe/create-portal-session",
    billingPage: "/account/billing",
    contextSource: "AuthContext.subscriptionStatus",
    fallback: "Stripe API lookup by stripeCustomerId",
  },

  webhookIntegrity: {
    status: "LIVE",
    endpoint: "/api/webhook/stripe",
    signatureVerification: true,
    idempotency: "webhookEvents table with durable dedup",
    handledEvents: [
      "checkout.session.completed",
      "customer.subscription.created",
      "customer.subscription.updated",
      "customer.subscription.deleted",
      "invoice.paid",
      "invoice.payment_failed",
    ],
    retryBehavior: "500 on failure (Stripe retries), 200 on success/duplicate",
    emailTriggers: {
      upgrade: "sendUpgradeConfirmation on checkout.session.completed",
      cancellation: "sendCancellationAcknowledgment on customer.subscription.deleted",
    },
  },

  frontendGating: {
    status: "LIVE",
    configFile: "client/src/config/featureAccess.js",
    gateComponent: "PlanGate.jsx",
    contextHook: "useAuth() -> { subscriptionStatus, isPro }",
    softGatedFeatures: [
      { feature: "AI Chat", freeLimit: 5, proLimit: "unlimited", unit: "daily sessions" },
    ],
    neverGated: ["moodTracking", "journaling", "dailyReflection", "crisisSupport", "wisdom", "communityWall"],
  },

  serverEnforcement: {
    status: "LIVE",
    aiChatLimit: {
      file: "server/routes/ai.mjs",
      freeLimit: 5,
      enforcement: "counts ai_messages WHERE created_at >= today, returns 429",
      proBypass: true,
    },
  },

  visualIndicators: {
    proBadge: {
      navbar: "TglpNavbar.jsx — gold crown badge for Pro users",
      dashboard: "Overview.jsx — Pro badge in greeting area",
    },
  },

  emailLifecycle: {
    service: "Resend via server/services/email.mjs",
    upgradeEmail: true,
    cancellationEmail: true,
    pattern: "fire-and-forget (.catch) — never blocks webhook",
  },

  guardrails: {
    noPremiumTier: true,
    noDarkPatterns: true,
    noStreakPressure: true,
    traumaInformed: true,
    coreToolsAlwaysFree: true,
  },
};
