import 'dotenv/config';
import express from "express";
import cors from "cors";
import { logger } from "./utils/logger.mjs";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import authRouter from "./routes/auth.mjs";
import githubAuthRouter from "./routes/github-auth.mjs";
import passport from "passport";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth/index.mjs";
import adminRouter from "./routes/admin.mjs";
import blogRouter from "./routes/blog.mjs";
import journalRouter from "./routes/journal.mjs";
import { requireAdult } from "./middleware/requireAdult.mjs";
import moodRouter from "./routes/mood.mjs";
import healthRouter from "./routes/health.mjs";
import accountRouter from "./routes/account.mjs";
import aiRouter from "./routes/ai.mjs";
import analyticsRouter from "./routes/analytics.mjs";
import billingRouter from "./routes/billing.mjs";
import gamificationRouter from "./routes/gamification.mjs";
import onboardingRouter from "./routes/onboarding.mjs";
import therapyRouter from "./routes/therapy.mjs";
import dashboardRouter from "./routes/ui-dashboard.mjs";
import webhookRouter from "./routes/webhook.mjs";
import insightsRouter from "./routes/insights.mjs";
import progressRouter from "./routes/progress.mjs";
import statesRouter from "./routes/states.mjs";
import gratitudeRouter from "./routes/gratitude.mjs";
import promptsRouter from "./routes/prompts.mjs";
import mirrorRouter from "./routes/mirror.mjs";
import communityRouter from "./routes/community.mjs";
import integrationHealthRouter from "./routes/integrationHealth.mjs";
import wisdomRouter from "./routes/wisdom.mjs";
import dialecticsRouter from "./routes/dialectics.mjs";
import practicesRouter from "./routes/practices.mjs";
import knowledgeRouter from "./routes/knowledge.mjs";
import philosophyRouter from "./routes/philosophy.mjs";
import metacognitionRouter from "./routes/metacognition.mjs";
import creativityRouter from "./routes/creativity.mjs";
import resilienceRouter from "./routes/resilience.mjs";
import foresightRouter from "./routes/foresight.mjs";
import systemsCompassionRouter from "./routes/systems-compassion.mjs";
import collectiveIntelligenceRouter from "./routes/collective-intelligence.mjs";
import wisdomSynthesisRouter from "./routes/wisdom-synthesis.mjs";
import cognitiveLabRouter from "./routes/cognitive-lab.mjs";
import contemplativeRouter from "./routes/contemplative.mjs";
import ethicalReasoningRouter from "./routes/ethical-reasoning.mjs";
import existentialRouter from "./routes/existential.mjs";
import embodimentRouter from "./routes/embodiment.mjs";
import narrativeRouter from "./routes/narrative.mjs";
import relationalRouter from "./routes/relational.mjs";
import valuesRouter from "./routes/values.mjs";
import neuroIntegrationRouter from "./routes/neuro-integration.mjs";
import socioEcologyRouter from "./routes/socio-ecology.mjs";
import praxisRouter from "./routes/praxis.mjs";
import postTraumaRouter from "./routes/post-trauma.mjs";
import healingToolsRouter from "./routes/healing-tools.mjs";
import meaningFutureRouter from "./routes/meaning-future.mjs";
import contentGeneratorRouter from "./routes/content-generator.mjs";
import healingIntelligenceRouter from "./routes/healing-intelligence.mjs";
import cognitiveMasteryRouter from "./routes/cognitive-mastery.mjs";
import wisdomEngineRouter from "./routes/wisdom-engine.mjs";
import selfMasteryRouter from "./routes/self-mastery.mjs";
import transformationEngineRouter from "./routes/transformation-engine.mjs";
import contentIntelligenceRouter from "./routes/content-intelligence.mjs";
import deepLearningRouter from "./routes/deep-learning.mjs";
import purposeCompassRouter from "./routes/purpose-compass.mjs";
import emotionalMasteryRouter from "./routes/emotional-mastery.mjs";
import holisticHealingRouter from "./routes/holistic-healing.mjs";
import masteryExcellenceRouter from "./routes/mastery-excellence.mjs";
import contentStudioRouter from "./routes/content-studio.mjs";
import consciousnessExpansionRouter from "./routes/consciousness-expansion.mjs";
import humanPotentialRouter from "./routes/human-potential.mjs";
import wisdomTraditionsRouter from "./routes/wisdom-traditions.mjs";
import lifeDesignRouter from "./routes/life-design.mjs";
import healingModalitiesRouter from "./routes/healing-modalities.mjs";
import selfMasteryIntelligenceRouter from "./routes/self-mastery-intelligence.mjs";
import proFeaturesRouter from "./routes/pro-features.mjs";
import universalContentRouter from "./routes/universal-content.mjs";
import traumaHealingProtocolsRouter from "./routes/trauma-healing-protocols.mjs";
import spiritualIntelligenceRouter from "./routes/spiritual-intelligence.mjs";
import relationshipDynamicsRouter from "./routes/relationship-dynamics.mjs";
import cognitiveEnhancementRouter from "./routes/cognitive-enhancement.mjs";
import emotionalResilienceRouter from "./routes/emotional-resilience.mjs";
import lifePurposeRouter from "./routes/life-purpose.mjs";
import mindBodyIntegrationRouter from "./routes/mind-body-integration.mjs";
import socialIntelligenceRouter from "./routes/social-intelligence.mjs";
import peakPerformanceRouter from "./routes/peak-performance.mjs";
import personalGrowthRouter from "./routes/personal-growth.mjs";
import psychologicalSafetyRouter from "./routes/psychological-safety.mjs";
import socialPostsRouter from "./routes/social-posts.mjs";
import leadsRouter from "./routes/leads.mjs";
import newsletterRouter from "./routes/newsletter.mjs";
import productsRouter from "./routes/products.mjs";
import socialPostingRouter from "./routes/social-posting.mjs";
import adminSocialStudioRouter from "./routes/admin-social-studio.mjs";
import socialEnterpriseRouter from "./routes/social-enterprise.mjs";
import wellnessToolsRouter from "./routes/wellness-tools.mjs";
import userRouter from "./routes/user.mjs";
import perplexityRouter from "./routes/perplexity.mjs";
import emailRouter from "./routes/email.mjs";
import adminSecurityRouter from "./routes/admin-security.mjs";
import objectStorageRouter from "./routes/object-storage.mjs";
import reflectionRouter from "./routes/reflection.mjs";
import deploymentReadinessRouter from "./routes/deploymentReadiness.mjs";
import metricsSummaryRouter from "./routes/metricsSummary.mjs";
import softLaunchMetricsRouter, { recordPageView } from "./routes/soft-launch-metrics.mjs";
import feedbackRouter from "./routes/feedback.mjs";
import narrativeDraftsRouter from "./routes/narrative-drafts.mjs";
import { setupWebSocket } from "./lib/websocket.mjs";
import { requestId, requestLogger } from "./middleware/requestId.mjs";

// JWT secret handling — ensure JWT_SECRET is always set (match production pattern)
process.env.JWT_SECRET = process.env.JWT_SECRET || process.env.SESSION_SECRET || 'dev-jwt-secret';
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || process.env.SESSION_SECRET || 'dev-jwt-refresh';

// Lightweight env validation for development
const devEnvChecks = [
  { name: 'DATABASE_URL', value: process.env.DATABASE_URL },
  { name: 'SESSION_SECRET', value: process.env.SESSION_SECRET },
];
const missingDev = devEnvChecks.filter(v => !v.value);
if (missingDev.length > 0) {
  logger.warn("Missing recommended env vars for development", { vars: missingDev.map(v => v.name).join(', ') });
}

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
async function startServer() {
  // Harden Express defaults
  app.disable("x-powered-by");
  app.set("trust proxy", 1);

  // Request tracking middleware (first in chain)
  app.use(requestId);
  app.use(requestLogger);
  
  // Universal CORS - allow all origins in development
  app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
  }));
  
  // Security headers (fully relaxed for development and iframe embedding)
  app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: false,
    frameguard: false
  }));
  
  // Additional headers for universal access
  app.use((req, res, next) => {
    res.setHeader('X-Frame-Options', 'ALLOWALL');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    next();
  });
  
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Sanitize all incoming request bodies (strip script tags, event handlers, etc.)
  const { sanitizeBody, securityHeaders } = await import("./middleware/security.mjs");
  app.use(sanitizeBody);

  // Security headers for API responses (no-cache, XSS protection)
  app.use("/api", securityHeaders);

  // Global API rate limiter (120 requests/min per IP)
  const { default: apiRateLimit } = await import("./middleware/rateLimit.mjs");
  app.use("/api", apiRateLimit);

  // Setup Replit Auth (must be before other routes)
  // Integration: blueprint:javascript_log_in_with_replit
  await setupAuth(app);
  registerAuthRoutes(app);

  // Server-side redirects for alias routes (308 Permanent Redirect)
  // 308 preserves the HTTP method (unlike 301 which may change POST to GET)
  // These must come before API routes and Vite middleware
  const aliasRedirects = {
    '/home': '/',
    '/welcome': '/'
  };
  
  app.use((req, res, next) => {
    const canonical = aliasRedirects[req.path];
    if (canonical) {
      // Use 308 Permanent Redirect to preserve HTTP method
      res.set('Location', canonical);
      res.set('Cache-Control', 'public, max-age=31536000, immutable');
      return res.status(308).end();
    }
    next();
  });

  app.use("/api/auth/github", githubAuthRouter);
  app.use("/api/admin", adminRouter);
  app.use("/api/admin/soft-launch-metrics", softLaunchMetricsRouter);
  app.use("/api/feedback", feedbackRouter);
  app.use("/api/narrative-drafts", narrativeDraftsRouter);
  app.use("/api/blog", blogRouter);
  app.use("/api/journal", requireAdult, journalRouter);
  app.use("/api/reflection", requireAdult, reflectionRouter);
  app.use("/api/mood", moodRouter);
  app.use("/api/health", healthRouter);
  app.use("/api/account", accountRouter);
  app.use("/api/ai", requireAdult, aiRouter);
  app.use("/api/analytics", analyticsRouter);
  app.use("/api/billing", billingRouter);
  app.use("/api/pro-features", proFeaturesRouter);
  app.use("/api/gamification", gamificationRouter);
  app.use("/api/onboarding", onboardingRouter);
  app.use("/api/therapy", therapyRouter);
  app.use("/api/dashboard", dashboardRouter);
  app.use("/api/webhook", webhookRouter);
  app.use("/api/deployment-readiness", deploymentReadinessRouter);
  app.use("/api/insights", insightsRouter);
  app.use("/api/progress", progressRouter);
  app.use("/api/states", statesRouter);
  app.use("/api/gratitude", gratitudeRouter);
  app.use("/api/prompts", promptsRouter);
  app.use("/api/mirror", mirrorRouter);
  app.use("/api/community", communityRouter);
  app.use("/api/integrations", integrationHealthRouter);
  app.use("/api/wisdom", wisdomRouter);
  app.use("/api/dialectics", dialecticsRouter);
  app.use("/api/practices", practicesRouter);
  app.use("/api/knowledge", knowledgeRouter);
  app.use("/api/philosophy", philosophyRouter);
  app.use("/api/metacognition", metacognitionRouter);
  app.use("/api/creativity", creativityRouter);
  app.use("/api/resilience", resilienceRouter);
  app.use("/api/foresight", foresightRouter);
  app.use("/api/systems-compassion", systemsCompassionRouter);
  app.use("/api/collective-intelligence", collectiveIntelligenceRouter);
  app.use("/api/wisdom-synthesis", wisdomSynthesisRouter);
  app.use("/api/cognitive-lab", cognitiveLabRouter);
  app.use("/api/contemplative", contemplativeRouter);
  app.use("/api/ethical-reasoning", ethicalReasoningRouter);
  app.use("/api/existential", existentialRouter);
  app.use("/api/embodiment", embodimentRouter);
  app.use("/api/narrative", narrativeRouter);
  app.use("/api/relational", relationalRouter);
  app.use("/api/values", valuesRouter);
  app.use("/api/neuro-integration", neuroIntegrationRouter);
  app.use("/api/socio-ecology", socioEcologyRouter);
  app.use("/api/praxis", praxisRouter);
  app.use("/api/post-trauma", postTraumaRouter);
  app.use("/api/healing", healingToolsRouter);
  app.use("/api/meaning", meaningFutureRouter);
  app.use("/api/content", contentGeneratorRouter);
  app.use("/api/healing-intelligence", healingIntelligenceRouter);
  app.use("/api/cognitive-mastery", cognitiveMasteryRouter);
  app.use("/api/wisdom-engine", wisdomEngineRouter);
  app.use("/api/self-mastery", selfMasteryRouter);
  app.use("/api/transformation", transformationEngineRouter);
  app.use("/api/content-intelligence", contentIntelligenceRouter);
  app.use("/api/deep-learning", deepLearningRouter);
  app.use("/api/purpose-compass", purposeCompassRouter);
  app.use("/api/emotional-mastery", emotionalMasteryRouter);
  app.use("/api/holistic-healing", holisticHealingRouter);
  app.use("/api/mastery-excellence", masteryExcellenceRouter);
  app.use("/api/content-studio", contentStudioRouter);
  app.use("/api/consciousness", consciousnessExpansionRouter);
  app.use("/api/human-potential", humanPotentialRouter);
  app.use("/api/wisdom-traditions", wisdomTraditionsRouter);
  app.use("/api/life-design", lifeDesignRouter);
  app.use("/api/healing-modalities", healingModalitiesRouter);
  app.use("/api/self-mastery-intelligence", selfMasteryIntelligenceRouter);
  app.use("/api/universal-content", universalContentRouter);
  app.use("/api/trauma-healing", traumaHealingProtocolsRouter);
  app.use("/api/spiritual-intelligence", spiritualIntelligenceRouter);
  app.use("/api/relationship-dynamics", relationshipDynamicsRouter);
  app.use("/api/cognitive-enhancement", cognitiveEnhancementRouter);
  app.use("/api/emotional-resilience", emotionalResilienceRouter);
  app.use("/api/life-purpose", lifePurposeRouter);
  app.use("/api/mind-body", mindBodyIntegrationRouter);
  app.use("/api/social-intelligence", socialIntelligenceRouter);
  app.use("/api/peak-performance", peakPerformanceRouter);
  app.use("/api/personal-growth", personalGrowthRouter);
  app.use("/api/psychological-safety", psychologicalSafetyRouter);
  app.use("/api/social/posts", socialPostsRouter);
  app.use("/api/social-posts", socialPostsRouter);
  app.use("/api/leads", leadsRouter);
  app.use("/api/newsletter", newsletterRouter);
  app.use("/api/products", productsRouter);
  app.use("/api/social-posting", socialPostingRouter);
  app.use("/api/admin/social/enterprise", socialEnterpriseRouter);
  app.use("/api/admin/social", adminSocialStudioRouter);
  app.use("/api/wellness-tools", requireAdult, wellnessToolsRouter);
  app.use("/api/user", userRouter);
  app.use("/api/perplexity", perplexityRouter);
  app.use("/api/email", emailRouter);
  app.use("/api/admin/security", adminSecurityRouter);
  app.use("/api/uploads", objectStorageRouter);
  app.use("/api/metrics", metricsSummaryRouter);

  const SERVER_START_TIME = Date.now();

  app.get("/api/health-check", (_req, res) => {
    res.json({ ok: true, env: "development" });
  });

  app.get("/healthz", (_req, res) => {
    res.status(200).json({ 
      ok: true,
      status: "ok",
      version: "2.0.0",
      uptimeSeconds: Math.floor((Date.now() - SERVER_START_TIME) / 1000)
    });
  });

  app.use("/health", healthRouter);

  app.get("/api/content/stats", async (req, res) => {
    try {
      const { requireAuth } = await import("./middleware/auth.mjs");
      const authResult = await new Promise((resolve) => {
        requireAuth(req, res, (err) => resolve(err ? "auth_failed" : "ok"));
      });
      if (authResult === "auth_failed") return;
      
      if (req.user?.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const { blogPosts, socialPosts, digitalProducts, productPurchases } = await import("../shared/schema.mjs");
      const { db } = await import("./db/connection.mjs");
      const { sql, eq } = await import("drizzle-orm");
      
      const [blogCount] = await db.select({ count: sql`count(*)` }).from(blogPosts);
      const [publishedBlogCount] = await db.select({ count: sql`count(*)` }).from(blogPosts).where(eq(blogPosts.status, "published"));
      const [socialCount] = await db.select({ count: sql`count(*)` }).from(socialPosts);
      const [scheduledCount] = await db.select({ count: sql`count(*)` }).from(socialPosts).where(eq(socialPosts.status, "scheduled"));
      const [productCount] = await db.select({ count: sql`count(*)` }).from(digitalProducts);
      const [revenueResult] = await db.select({ total: sql`COALESCE(SUM(price_paid), 0)` }).from(productPurchases);
      
      res.json({
        totalPosts: Number(blogCount?.count || 0),
        publishedPosts: Number(publishedBlogCount?.count || 0),
        socialPosts: Number(socialCount?.count || 0),
        scheduledPosts: Number(scheduledCount?.count || 0),
        totalProducts: Number(productCount?.count || 0),
        totalRevenue: Number(revenueResult?.total || 0),
      });
    } catch (error) {
      logger.error("Content stats error", { error: error?.message || error });
      res.json({
        totalPosts: 0,
        publishedPosts: 0,
        socialPosts: 0,
        scheduledPosts: 0,
        totalProducts: 0,
        totalRevenue: 0,
      });
    }
  });

  const vite = await createViteServer({
    configFile: resolve(__dirname, "../vite.config.js"),
    server: { 
      middlewareMode: true,
      allowedHosts: true
    },
    appType: "spa",
  });
  
  // API 404 handler — catch unmatched /api routes before Vite middleware
  app.all("/api/*", (_req, res) => {
    res.status(404).json({ ok: false, error: "NOT_FOUND", message: "Endpoint not found" });
  });

  // Vite middleware MUST be registered before any catch-all routes
  app.use(vite.middlewares);

  // Vite internal paths: /@vite/*, /@fs/*, /@react-refresh, /src/*, /node_modules/.vite/*
  app.use("/{*splat}", async (req, res, next) => {
    const url = req.originalUrl;
    
    // Skip Vite internal paths - let Vite middleware handle them
    if (url.startsWith('/@') || 
        url.startsWith('/src/') || 
        url.startsWith('/node_modules/') ||
        url.includes('.vite')) {
      return next();
    }
    
    try {
      if (!url.startsWith("/api/")) {
        recordPageView(url.split("?")[0]);
      }
      const fs = await import("fs/promises");
      const indexPath = resolve(__dirname, "../client/index.html");
      let template = await fs.readFile(indexPath, "utf-8");
      template = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(template);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });

  const { errorHandler } = await import("./middleware/errorHandler.mjs");
  app.use(errorHandler);

  const preferredPort = parseInt(process.env.PORT, 10) || 5000;
  const fallbackPorts = [preferredPort, 5001, 5002, 5003];
  
  async function tryListen(port) {
    return new Promise((resolve, reject) => {
      const server = app.listen(port, "0.0.0.0");
      server.once('listening', () => resolve(server));
      server.once('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          reject(err);
        } else {
          reject(err);
        }
      });
    });
  }
  
  let server = null;
  let boundPort = null;
  
  for (const port of fallbackPorts) {
    try {
      server = await tryListen(port);
      boundPort = port;
      break;
    } catch (err) {
      if (err.code === 'EADDRINUSE') {
        logger.info("Port is busy, trying next", { port });
        try {
          const { execSync } = await import('child_process');
          const pids = execSync(`lsof -ti tcp:${port} 2>/dev/null || true`, { encoding: 'utf-8' }).trim();
          if (pids) {
            logger.info("Blocked by PIDs", { port, pids: pids.split('\n').join(', ') });
            logger.info("To free port", { command: `kill -9 ${pids.split('\n').join(' ')}` });
          }
        } catch (e) {}
      } else {
        throw err;
      }
    }
  }
  
  if (!server) {
    logger.error("Could not bind to any port", { ports: fallbackPorts.join(', ') });
    logger.error("Run: npm run dev:free && npm run dev");
    process.exit(1);
  }
  
  logger.info("Dev server listening", { url: `http://0.0.0.0:${boundPort}`, port: boundPort });
  if (boundPort !== preferredPort) {
    logger.info("Preferred port was busy", { preferredPort, boundPort });
  }

  function gracefulShutdown(signal) {
    logger.info("Signal received, shutting down", { signal });
    server.close(() => {
      logger.info("Server closed.");
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 5000);
  }

  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
}

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled promise rejection", { error: reason?.message || reason });
});

process.on("uncaughtException", (err) => {
  logger.error("Uncaught exception — shutting down", { error: err?.message || err, stack: err?.stack });
  process.exit(1);
});

startServer().catch(err => logger.error("Failed to start dev server", { error: err?.message || err }));
