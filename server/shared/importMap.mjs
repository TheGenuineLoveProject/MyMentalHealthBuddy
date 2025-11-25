// server/shared/importMap.mjs
// FINAL CLEAN IMPORT MAP — SINGLE SOURCE OF TRUTH (SSOT)
// Replit-safe, Node ESM-safe, fully explicit import paths

export const BACKEND_IMPORTS = {
  core: {
    express: "express",
    helmet: "helmet",
    compression: "compression",
    cors: "cors",
    morgan: "morgan",
    path: "path",
    fs: "fs",
    url: "url"
  },

  middleware: {
    corsFix: "../middleware/cors-fix.mjs",
    auth: "../middleware/auth.mjs",
    rateLimiter: "../middleware/rateLimiter.mjs"
  },

  db: {
    connection: "../db/connection.mjs"
  },

  routes: {
    auth: "../routes/auth.mjs",
    mood: "../routes/mood.mjs",
    journal: "../routes/journal.mjs",
    content: "../routes/content.mjs",
    analytics: "../routes/analytics.mjs",
    billing: "../routes/billing.mjs",
    stripe: "../routes/stripe.mjs",
    stripeWebhook: "../routes/stripeWebhook.mjs",
  },

  ai: {
    ai: "../routes/ai.mjs",
    aiDashboard: "../routes/ai-dashboard.mjs",
    aiHandler: "../services/aiHandler.mjs",
    aiService: "../services/aiService.mjs"
  }
};

// Optional default export, used only by helper scripts
export default BACKEND_IMPORTS;