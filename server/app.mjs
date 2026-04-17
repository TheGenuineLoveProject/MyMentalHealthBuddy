// server/app.mjs
// Shared Express app for testing and production
import express from "express";
import cookieParser from "cookie-parser";
import { logger } from "./utils/logger.mjs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.join(__dirname, "../public")));
const app = express();

// Core middleware
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

let _trackSystemResponse = null;
try {
  const systemMod = await import("./routes/system.mjs");
  _trackSystemResponse = systemMod.trackResponse;
} catch {}
if (_trackSystemResponse) {
  const track = _trackSystemResponse;
  app.use((req, res, next) => {
    res.on("finish", () => track(res.statusCode));
    next();
  });
}

// Root-level health endpoints (tests expect these)
app.get("/healthz", (_req, res) => {
  res.status(200).json({ 
    ok: true, 
    status: "ok", 
    version: "2.0.0" 
  });
});

app.get("/api/health-check", (_req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV || "development" });
});

app.get("/health", (_req, res) => res.json({ ok: true }));

/**
 * Mount routers if they exist.
 * If a router file has a syntax/runtime import error, it will be skipped.
 */
async function mountIfExists(mountPath, modulePath) {
  try {
    const mod = await import(modulePath);
    const router = mod.default || mod.router;
    if (router) app.use(mountPath, router);
  } catch (e) {
    // Log errors in test mode for debugging
    if (process.env.NODE_ENV === "test") {
      logger.warn("Failed to mount route", { mountPath, error: e?.message || e });
    }
  }
}

// Mount all API routers
await mountIfExists("/api/auth", "./routes/auth.mjs");
await mountIfExists("/api/admin", "./routes/admin.mjs");
await mountIfExists("/api/journal", "./routes/journal.mjs");
await mountIfExists("/api/mood", "./routes/mood.mjs");
await mountIfExists("/api/moods", "./routes/mood.mjs");
await mountIfExists("/api/badges", "./routes/badges.mjs");
await mountIfExists("/api/invites", "./routes/invites.mjs");
await mountIfExists("/api/states", "./routes/states.mjs");
await mountIfExists("/api/insights", "./routes/insights.mjs");
await mountIfExists("/api/wisdom", "./routes/wisdom.mjs");
await mountIfExists("/api/dialectics", "./routes/dialectics.mjs");
await mountIfExists("/api/practices", "./routes/practices.mjs");
await mountIfExists("/api/knowledge", "./routes/knowledge.mjs");
await mountIfExists("/api/philosophy", "./routes/philosophy.mjs");
await mountIfExists("/api/metacognition", "./routes/metacognition.mjs");
await mountIfExists("/api/creativity", "./routes/creativity.mjs");
await mountIfExists("/api/resilience", "./routes/resilience.mjs");
await mountIfExists("/api/foresight", "./routes/foresight.mjs");
await mountIfExists("/api/systems-compassion", "./routes/systems-compassion.mjs");
await mountIfExists("/api/collective-intelligence", "./routes/collective-intelligence.mjs");
await mountIfExists("/api/wisdom-synthesis", "./routes/wisdom-synthesis.mjs");
await mountIfExists("/api/cognitive-lab", "./routes/cognitive-lab.mjs");
await mountIfExists("/api/contemplative", "./routes/contemplative.mjs");
await mountIfExists("/api/ethical-reasoning", "./routes/ethical-reasoning.mjs");
await mountIfExists("/api/existential", "./routes/existential.mjs");
await mountIfExists("/api/embodiment", "./routes/embodiment.mjs");
await mountIfExists("/api/narrative", "./routes/narrative.mjs");
await mountIfExists("/api/relational", "./routes/relational.mjs");
await mountIfExists("/api/values", "./routes/values.mjs");
await mountIfExists("/api/neuro-integration", "./routes/neuro-integration.mjs");
await mountIfExists("/api/socio-ecology", "./routes/socio-ecology.mjs");
await mountIfExists("/api/praxis", "./routes/praxis.mjs");
await mountIfExists("/api/post-trauma", "./routes/post-trauma.mjs");
await mountIfExists("/api/healing", "./routes/healing-tools.mjs");
await mountIfExists("/api/meaning", "./routes/meaning-future.mjs");
await mountIfExists("/api/content-generator", "./routes/content-generator.mjs");
await mountIfExists("/api/mirror", "./routes/mirror.mjs");
await mountIfExists("/api/ai", "./routes/ai.js");
await mountIfExists("/api/gamification", "./routes/gamification.mjs");
await mountIfExists("/api/health", "./routes/health.mjs");
await mountIfExists("/api/admin/soft-launch-metrics", "./routes/soft-launch-metrics.mjs");
await mountIfExists("/api/feedback", "./routes/feedback.mjs");
await mountIfExists("/api/gratitude", "./routes/gratitude.mjs");
await mountIfExists("/api/favorites", "./routes/favorites.mjs");
await mountIfExists("/api/admin/publishing", "./routes/admin-publishing.mjs");
await mountIfExists("/rss.xml", "./routes/rss.mjs");
await mountIfExists("/api/auth/github", "./routes/github-auth.mjs");
await mountIfExists("/api/blog", "./routes/blog.mjs");
await mountIfExists("/api/account", "./routes/account.mjs");
await mountIfExists("/api/analytics", "./routes/analytics.mjs");
await mountIfExists("/api/billing", "./routes/billing.mjs");
await mountIfExists("/api/pro-features", "./routes/pro-features.mjs");
await mountIfExists("/api/onboarding", "./routes/onboarding.mjs");
await mountIfExists("/api/therapy", "./routes/therapy.mjs");
await mountIfExists("/api/dashboard", "./routes/ui-dashboard.mjs");
await mountIfExists("/api/webhook", "./routes/webhook.mjs");
await mountIfExists("/api/progress", "./routes/progress.mjs");
await mountIfExists("/api/prompts", "./routes/prompts.mjs");
await mountIfExists("/api/community", "./routes/community.mjs");
await mountIfExists("/api/integrations", "./routes/integrationHealth.mjs");
await mountIfExists("/api/healing-intelligence", "./routes/healing-intelligence.mjs");
await mountIfExists("/api/cognitive-mastery", "./routes/cognitive-mastery.mjs");
await mountIfExists("/api/wisdom-engine", "./routes/wisdom-engine.mjs");
await mountIfExists("/api/self-mastery", "./routes/self-mastery.mjs");
await mountIfExists("/api/transformation", "./routes/transformation-engine.mjs");
await mountIfExists("/api/content-intelligence", "./routes/content-intelligence.mjs");
await mountIfExists("/api/deep-learning", "./routes/deep-learning.mjs");
await mountIfExists("/api/purpose-compass", "./routes/purpose-compass.mjs");
await mountIfExists("/api/emotional-mastery", "./routes/emotional-mastery.mjs");
await mountIfExists("/api/holistic-healing", "./routes/holistic-healing.mjs");
await mountIfExists("/api/mastery-excellence", "./routes/mastery-excellence.mjs");
await mountIfExists("/api/content-studio", "./routes/content-studio.mjs");
await mountIfExists("/api/consciousness", "./routes/consciousness-expansion.mjs");
await mountIfExists("/api/human-potential", "./routes/human-potential.mjs");
await mountIfExists("/api/wisdom-traditions", "./routes/wisdom-traditions.mjs");
await mountIfExists("/api/life-design", "./routes/life-design.mjs");
await mountIfExists("/api/healing-modalities", "./routes/healing-modalities.mjs");
await mountIfExists("/api/self-mastery-intelligence", "./routes/self-mastery-intelligence.mjs");
await mountIfExists("/api/universal-content", "./routes/universal-content.mjs");
await mountIfExists("/api/trauma-healing", "./routes/trauma-healing-protocols.mjs");
await mountIfExists("/api/spiritual-intelligence", "./routes/spiritual-intelligence.mjs");
await mountIfExists("/api/relationship-dynamics", "./routes/relationship-dynamics.mjs");
await mountIfExists("/api/cognitive-enhancement", "./routes/cognitive-enhancement.mjs");
await mountIfExists("/api/emotional-resilience", "./routes/emotional-resilience.mjs");
await mountIfExists("/api/life-purpose", "./routes/life-purpose.mjs");
await mountIfExists("/api/mind-body", "./routes/mind-body-integration.mjs");
await mountIfExists("/api/social-intelligence", "./routes/social-intelligence.mjs");
await mountIfExists("/api/peak-performance", "./routes/peak-performance.mjs");
await mountIfExists("/api/personal-growth", "./routes/personal-growth.mjs");
await mountIfExists("/api/psychological-safety", "./routes/psychological-safety.mjs");
await mountIfExists("/api/social/posts", "./routes/social-posts.mjs");
await mountIfExists("/api/social-posts", "./routes/social-posts.mjs");
await mountIfExists("/api/leads", "./routes/leads.mjs");
await mountIfExists("/api/newsletter", "./routes/newsletter.mjs");
await mountIfExists("/api/products", "./routes/products.mjs");
await mountIfExists("/api/social-posting", "./routes/social-posting.mjs");
await mountIfExists("/api/admin/social/enterprise", "./routes/social-enterprise.mjs");
await mountIfExists("/api/admin/social", "./routes/admin-social-studio.mjs");
await mountIfExists("/api/wellness-tools", "./routes/wellness-tools.mjs");
await mountIfExists("/api/user", "./routes/user.mjs");
await mountIfExists("/api/perplexity", "./routes/perplexity.mjs");
await mountIfExists("/api/email", "./routes/email.mjs");
await mountIfExists("/api/admin/security", "./routes/admin-security.mjs");
await mountIfExists("/api/admin/audit-logs", "./routes/audit-logs.mjs");
await mountIfExists("/api/admin/billing", "./routes/adminBilling.mjs");
await mountIfExists("/api/uploads", "./routes/object-storage.mjs");
await mountIfExists("/api/reflection", "./routes/reflection.mjs");
await mountIfExists("/api/deployment-readiness", "./routes/deploymentReadiness.mjs");
await mountIfExists("/api/metrics/summary", "./routes/metricsSummary.mjs");
await mountIfExists("/api/narrative-drafts", "./routes/narrative-drafts.mjs");
await mountIfExists("/api/contact", "./routes/contact.mjs");
await mountIfExists("/api/metrics", "./routes/metrics.mjs");
await mountIfExists("/api/login", "./routes/login.mjs");
await mountIfExists("/api/user-settings", "./routes/userSettings.mjs");
await mountIfExists("/api/account-actions", "./routes/accountActions.mjs");
await mountIfExists("/api/ai-dashboard", "./routes/ai-dashboard.mjs");
await mountIfExists("/api/feed", "./routes/feed.mjs");
await mountIfExists("/api/healing-core", "./routes/healing.mjs");
await mountIfExists("/api/meaning-core", "./routes/meaning.mjs");
await mountIfExists("/api/figma", "./routes/figma.mjs");
await mountIfExists("/api/analytics-events", "./routes/analytics-events.mjs");
await mountIfExists("/api/system", "./routes/system.mjs");
await mountIfExists("/api/kernel", "./routes/kernel.mjs");
await mountIfExists("/api/mfa", "./routes/mfa.mjs");
await mountIfExists("/api/canva-oauth", "./routes/canva-oauth.mjs");
await mountIfExists("/api/content", "./routes/content.mjs");
await mountIfExists("/api", "./routes/api.mjs");

// JSON 404 (important so tests don't get HTML)
app.use((req, res) => {
  res.status(404).json({ ok: false, error: "Not found", path: req.path });
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
export default app;