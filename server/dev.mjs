import 'dotenv/config';
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import authRouter from "./routes/auth.mjs";
import githubAuthRouter from "./routes/github-auth.mjs";
import passport from "passport";
import adminRouter from "./routes/admin.mjs";
import blogRouter from "./routes/blog.mjs";
import journalRouter from "./routes/journal.mjs";
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
import statesRouter from "./routes/states.mjs";
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
import productsRouter from "./routes/products.mjs";
import { requestId, requestLogger } from "./middleware/requestId.mjs";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
async function startServer() {
  // Request tracking middleware (first in chain)
  app.use(requestId);
  app.use(requestLogger);
  
  const allowedOrigins = [
    process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : null,
    process.env.REPLIT_DOMAINS ? `https://${process.env.REPLIT_DOMAINS.split(',')[0]}` : null,
    'http://localhost:5000',
    'http://127.0.0.1:5000',
  ].filter(Boolean);
  
  app.use(cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.some(allowed => origin.startsWith(allowed.replace(/:\d+$/, '')))) {
        callback(null, true);
      } else if (process.env.NODE_ENV === 'development') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  }));
  
  // Security headers (relaxed for development)
  app.use(helmet({
    contentSecurityPolicy: false, // Disabled for Vite HMR
    crossOriginEmbedderPolicy: false,
  }));
  
  app.use(express.json({ limit: '1mb' }));
  app.use(cookieParser());
  app.use(passport.initialize());

  app.use("/api/auth", authRouter);
  app.use("/api/auth", githubAuthRouter);
  app.use("/api/admin", adminRouter);
  app.use("/api/blog", blogRouter);
  app.use("/api/journal", journalRouter);
  app.use("/api/mood", moodRouter);
  app.use("/api/health", healthRouter);
  app.use("/api/account", accountRouter);
  app.use("/api/ai", aiRouter);
  app.use("/api/analytics", analyticsRouter);
  app.use("/api/billing", billingRouter);
  app.use("/api/gamification", gamificationRouter);
  app.use("/api/onboarding", onboardingRouter);
  app.use("/api/therapy", therapyRouter);
  app.use("/api/dashboard", dashboardRouter);
  app.use("/api/webhook", webhookRouter);
  app.use("/api/insights", insightsRouter);
  app.use("/api/states", statesRouter);
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
  app.use("/api/products", productsRouter);

  const SERVER_START_TIME = Date.now();

  app.get("/api/health-check", (_req, res) => {
    res.json({ ok: true, env: "development" });
  });

  app.get("/healthz", (_req, res) => {
    res.status(200).json({ 
      status: "ok",
      version: "1.0.0",
      buildTime: new Date().toISOString(),
      commit: process.env.REPL_ID || "local",
      uptimeSeconds: Math.floor((Date.now() - SERVER_START_TIME) / 1000)
    });
  });

  app.get("/health", (_req, res) => {
    res.status(200).json({ 
      status: "ok",
      version: "1.0.0",
      buildTime: new Date().toISOString(),
      commit: process.env.REPL_ID || "local",
      uptimeSeconds: Math.floor((Date.now() - SERVER_START_TIME) / 1000)
    });
  });

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
      console.error("Content stats error:", error);
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
      allowedHosts: [
        'localhost',
        '127.0.0.1',
        '.replit.dev',
        '.replit.app',
        '.repl.co',
        '.spock.replit.dev',
        process.env.REPLIT_DEV_DOMAIN,
        process.env.REPLIT_DOMAINS?.split(',')[0]
      ].filter(Boolean)
    },
    appType: "spa",
  });
  
  // Vite middleware MUST be registered before any catch-all routes
  app.use(vite.middlewares);

  // SPA fallback - only for non-API, non-Vite routes
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

  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Dev server listening on http://0.0.0.0:${PORT}`);
  });

  function gracefulShutdown(signal) {
    console.log(`${signal} received, shutting down...`);
    server.close(() => {
      console.log("Server closed.");
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 5000);
  }

  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
}

startServer().catch(console.error);
