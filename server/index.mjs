import 'dotenv/config';
import express from 'express';
import compression from 'compression';
import { logger } from "./utils/logger.mjs";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import { fileURLToPath } from "url";
import { dirname, join } from 'path';
import process from "node:process";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth/index.mjs";
import authRouter from './routes/auth.mjs';
import githubAuthRouter from './routes/github-auth.mjs';
import adminRouter from './routes/admin.mjs';
import blogRouter from './routes/blog.mjs';
import journalRouter from './routes/journal.mjs';
import { requireAdult } from './middleware/requireAdult.mjs';
import moodRouter from './routes/mood.mjs';
import healthRouter from './routes/health.mjs';
import accountRouter from './routes/account.mjs';
import aiRouter from './routes/ai.mjs';
import analyticsRouter from './routes/analytics.mjs';
import billingRouter from './routes/billing.mjs';
import gamificationRouter from './routes/gamification.mjs';
import onboardingRouter from './routes/onboarding.mjs';
import therapyRouter from './routes/therapy.mjs';
import dashboardRouter from './routes/ui-dashboard.mjs';
import webhookRouter from "./routes/webhook.mjs";
import insightsRouter from './routes/insights.mjs';
import statesRouter from './routes/states.mjs';
import promptsRouter from './routes/prompts.mjs';
import mirrorRouter from "./routes/mirror.mjs";
import communityRouter from "./routes/community.mjs";
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
import proFeaturesRouter from "./routes/pro-features.mjs";
import traumaHealingProtocolsRouter from "./routes/trauma-healing-protocols.mjs";
import spiritualIntelligenceRouter from "./routes/spiritual-intelligence.mjs";
import newsletterRouter from "./routes/newsletter.mjs";
import contactRouter from "./routes/contact.mjs";
import metricsRouter from "./routes/metrics.mjs";
import auditLogsRouter from "./routes/audit-logs.mjs";
import relationshipDynamicsRouter from "./routes/relationship-dynamics.mjs";
import cognitiveEnhancementRouter from "./routes/cognitive-enhancement.mjs";
import emotionalResilienceRouter from "./routes/emotional-resilience.mjs";
import lifePurposeRouter from "./routes/life-purpose.mjs";
import mindBodyIntegrationRouter from "./routes/mind-body-integration.mjs";
import socialIntelligenceRouter from "./routes/social-intelligence.mjs";
import peakPerformanceRouter from "./routes/peak-performance.mjs";
import personalGrowthRouter from "./routes/personal-growth.mjs";
import psychologicalSafetyRouter from "./routes/psychological-safety.mjs";
import leadsRouter from "./routes/leads.mjs";
import adminSocialStudioRouter from "./routes/admin-social-studio.mjs";
import wellnessToolsRouter from "./routes/wellness-tools.mjs";
import socialPostingRouter from "./routes/social-posting.mjs";
import socialPostsRouter from "./routes/social-posts.mjs";
import userRouter from "./routes/user.mjs";
import perplexityRouter from "./routes/perplexity.mjs";
import feedRouter from "./routes/feed.mjs";
import { requestId, requestLogger } from "./middleware/requestId.mjs";
import contentRouter from "./routes/content.mjs";
import adminBillingRouter from "./routes/adminBilling.mjs";
import deploymentReadinessRouter from "./routes/deploymentReadiness.mjs";
import metricsSummaryRouter from "./routes/metricsSummary.mjs";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Environment detection (must be early for validation logic)
const isProduction = process.env.NODE_ENV === 'production';

// Environment variable validation with categories
const envValidation = {
  critical: [
    { name: 'DATABASE_URL', value: process.env.DATABASE_URL },
    { name: 'SESSION_SECRET', value: process.env.SESSION_SECRET },
  ],
  recommended: [
    { name: 'OPENAI_API_KEY', value: process.env.OPENAI_API_KEY || process.env.AI_INTEGRATIONS_OPENAI_API_KEY },
    { name: 'STRIPE_SECRET_KEY', value: process.env.STRIPE_SECRET_KEY },
    { name: 'STRIPE_WEBHOOK_SECRET', value: process.env.STRIPE_WEBHOOK_SECRET },
    { name: 'SENTRY_DSN', value: process.env.SENTRY_DSN },
  ],
  optional: [
    { name: 'GITHUB_CLIENT_ID', value: process.env.GITHUB_CLIENT_ID },
    { name: 'GITHUB_CLIENT_SECRET', value: process.env.GITHUB_CLIENT_SECRET },
  ],
};

// JWT secret handling - use SESSION_SECRET for token signing (consistent approach)
if (isProduction) {
  if (!process.env.SESSION_SECRET) {
    logger.error('CRITICAL: SESSION_SECRET required in production');
    process.exit(1);
  }
  process.env.JWT_SECRET = process.env.JWT_SECRET || process.env.SESSION_SECRET;
  process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || process.env.SESSION_SECRET;
} else {
  process.env.JWT_SECRET = process.env.JWT_SECRET || process.env.SESSION_SECRET || 'dev-jwt-secret';
  process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || process.env.SESSION_SECRET || 'dev-jwt-refresh';
}

const missingCritical = envValidation.critical.filter(v => !v.value);
const missingRecommended = envValidation.recommended.filter(v => !v.value);
const missingOptional = envValidation.optional.filter(v => !v.value);

if (missingCritical.length > 0 && isProduction) {
  logger.error("CRITICAL: Missing required env vars", { vars: missingCritical.map(v => v.name).join(', ') });
  logger.error('Server cannot start in production without these. Exiting.');
  process.exit(1);
}

if (missingRecommended.length > 0) {
  logger.warn("WARNING: Missing recommended env vars", { vars: missingRecommended.map(v => v.name).join(', ') });
  logger.warn('Some features may not work correctly.');
}

if (missingOptional.length > 0) {
  logger.info("Optional env vars not set", { vars: missingOptional.map(v => v.name).join(', ') });
}

logger.info("Environment validation complete", { mode: isProduction ? 'PRODUCTION' : 'DEVELOPMENT' });

const app = express();

async function startProductionServer() {

app.set('trust proxy', 1);

// Request tracking middleware (first in chain)
app.use(requestId);
app.use(requestLogger);

const replitDevDomain = process.env.REPLIT_DEV_DOMAIN;
const replitDomainsList = process.env.REPLIT_DOMAINS?.split(",").map(d => d.trim()) || [];
const allDomains = replitDevDomain ? [replitDevDomain, ...replitDomainsList] : replitDomainsList;
const allowedDomains = allDomains.length > 0
  ? [...new Set(allDomains)].map(d => `https://${d}`)
  : ["http://localhost:5000"];
const frameAncestorsDomains = isProduction
  ? ["'self'", ...allowedDomains, "https://*.replit.dev", "https://*.replit.com"]
  : ["'self'", "https://*.replit.dev", "https://*.replit.com", "http://localhost:*"];

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://js.stripe.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
      imgSrc: ["'self'", "data:", "blob:", "https:"],
      connectSrc: ["'self'", "https://api.openai.com", "https://api.stripe.com", "wss:", "ws:", "https:"],
      frameSrc: ["'self'", "https://js.stripe.com"],
      frameAncestors: frameAncestorsDomains,
      objectSrc: ["'none'"],
      upgradeInsecureRequests: isProduction ? [] : null,
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

// Sanitize all incoming request bodies (strip script tags, event handlers, etc.)
const { sanitizeBody, securityHeaders } = await import("./middleware/security.mjs");
app.use(sanitizeBody);

// Security headers for API responses (no-cache, XSS protection)
app.use("/api", securityHeaders);

// Global API rate limiter (120 requests/min per IP)
const { default: apiRateLimit } = await import("./middleware/rateLimit.mjs");
app.use("/api", apiRateLimit);

// Replit Auth (session + OIDC) — must be before routes
await setupAuth(app);
registerAuthRoutes(app);

const corsOrigins = isProduction
  ? [...allowedDomains, /\.replit\.dev$/, /\.replit\.com$/]
  : [/\.replit\.dev$/, /\.replit\.com$/, /localhost:\d+$/];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const isAllowed = corsOrigins.some(allowed =>
      typeof allowed === "string" ? allowed === origin : allowed.test(origin)
    );
    if (isAllowed) {
      callback(null, true);
    } else if (!isProduction) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "X-CSRF-Token"],
}));

// Server-side redirects for alias routes (308 Permanent Redirect)
// 308 preserves the HTTP method (unlike 301 which may change POST to GET)
// These must come before API routes and static file serving
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

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/admin', adminRouter);
app.use('/api/blog', blogRouter);
app.use('/api/journal', requireAdult, journalRouter);
app.use('/api/mood', moodRouter);
app.use('/api/health', healthRouter);
app.use('/api/metrics', metricsRouter);
app.use('/api/admin/audit-logs', auditLogsRouter);
app.use('/api/admin/billing', adminBillingRouter);
app.use('/api/account', accountRouter);
app.use('/api/ai', requireAdult, aiRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/billing', billingRouter);
app.use('/api/pro-features', proFeaturesRouter);
app.use('/api/gamification', gamificationRouter);
app.use('/api/onboarding', onboardingRouter);
app.use('/api/therapy', therapyRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/webhook', webhookRouter);
app.use('/api/deployment-readiness', deploymentReadinessRouter);
app.use('/api/metrics', metricsSummaryRouter);
app.use('/api/insights', insightsRouter);
app.use('/api/states', statesRouter);
app.use('/api/prompts', promptsRouter);
app.use('/api/mirror', mirrorRouter);
app.use('/api/community', communityRouter);
app.use('/api/wisdom', wisdomRouter);
app.use('/api/dialectics', dialecticsRouter);
app.use('/api/practices', practicesRouter);
app.use('/api/knowledge', knowledgeRouter);
app.use('/api/philosophy', philosophyRouter);
app.use('/api/metacognition', metacognitionRouter);
app.use('/api/creativity', creativityRouter);
app.use('/api/resilience', resilienceRouter);
app.use('/api/newsletter', newsletterRouter);
app.use('/api/contact', contactRouter);
app.use('/api/foresight', foresightRouter);
app.use('/api/systems-compassion', systemsCompassionRouter);
app.use('/api/collective-intelligence', collectiveIntelligenceRouter);
app.use('/api/wisdom-synthesis', wisdomSynthesisRouter);
app.use('/api/cognitive-lab', cognitiveLabRouter);
app.use('/api/contemplative', contemplativeRouter);
app.use('/api/ethical-reasoning', ethicalReasoningRouter);
app.use('/api/existential', existentialRouter);
app.use('/api/embodiment', embodimentRouter);
app.use('/api/narrative', narrativeRouter);
app.use('/api/relational', relationalRouter);
app.use('/api/values', valuesRouter);
app.use('/api/neuro-integration', neuroIntegrationRouter);
app.use('/api/socio-ecology', socioEcologyRouter);
app.use('/api/praxis', praxisRouter);
app.use('/api/post-trauma', postTraumaRouter);
app.use('/api/healing', healingToolsRouter);
app.use('/api/meaning', meaningFutureRouter);
app.use('/api/healing-intelligence', healingIntelligenceRouter);
app.use('/api/cognitive-mastery', cognitiveMasteryRouter);
app.use('/api/wisdom-engine', wisdomEngineRouter);
app.use('/api/self-mastery', selfMasteryRouter);
app.use('/api/transformation', transformationEngineRouter);
app.use('/api/content-intelligence', contentIntelligenceRouter);
app.use('/api/deep-learning', deepLearningRouter);
app.use('/api/purpose-compass', purposeCompassRouter);
app.use('/api/emotional-mastery', emotionalMasteryRouter);
app.use('/api/holistic-healing', holisticHealingRouter);
app.use('/api/mastery-excellence', masteryExcellenceRouter);
app.use('/api/content-studio', contentStudioRouter);
app.use('/api/consciousness', consciousnessExpansionRouter);
app.use('/api/human-potential', humanPotentialRouter);
app.use('/api/wisdom-traditions', wisdomTraditionsRouter);
app.use('/api/life-design', lifeDesignRouter);
app.use('/api/healing-modalities', healingModalitiesRouter);
app.use('/api/self-mastery-intelligence', selfMasteryIntelligenceRouter);
app.use('/api/universal-content', universalContentRouter);
app.use('/api/trauma-healing', traumaHealingProtocolsRouter);
app.use('/api/spiritual-intelligence', spiritualIntelligenceRouter);
app.use('/api/relationship-dynamics', relationshipDynamicsRouter);
app.use('/api/cognitive-enhancement', cognitiveEnhancementRouter);
app.use('/api/emotional-resilience', emotionalResilienceRouter);
app.use('/api/life-purpose', lifePurposeRouter);
app.use('/api/mind-body', mindBodyIntegrationRouter);
app.use('/api/social-intelligence', socialIntelligenceRouter);
app.use('/api/peak-performance', peakPerformanceRouter);
app.use('/api/personal-growth', personalGrowthRouter);
app.use('/api/psychological-safety', psychologicalSafetyRouter);
app.use('/api/leads', leadsRouter);
app.use('/api/admin/social', adminSocialStudioRouter);
app.use('/api/wellness-tools', requireAdult, wellnessToolsRouter);
app.use('/api/social-posting', socialPostingRouter);
app.use('/api/social-posts', socialPostsRouter);
app.use('/api/content', contentRouter);
app.use('/api/perplexity', perplexityRouter);

const SERVER_START_TIME = Date.now();

app.get("/api/health-check", (_req, res) => {
  res.json({ ok: true, env: isProduction ? "production" : "development" });
});

app.get("/healthz", (_req, res) => {
  res.status(200).json({ 
    ok: true,
    status: "ok",
    version: "2.0.0",
    uptimeSeconds: Math.floor((Date.now() - SERVER_START_TIME) / 1000)
  });
});
app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});
app.use("/health", healthRouter);

// RSS, Sitemap, Robots (must be before SPA catch-all)
app.use('/', feedRouter);

// API 404 handler — catch unmatched /api routes before SPA catch-all
app.all("/api/*", (_req, res) => {
  res.status(404).json({ ok: false, error: "NOT_FOUND", message: "Endpoint not found" });
});

const distPath = join(__dirname, "../client/dist");

app.use(express.static(distPath, {
  etag: true,
  lastModified: true,
  setHeaders(res, filePath) {
    const isServiceWorker = filePath.endsWith('serviceWorker.js');
    const isHtmlOrJson = filePath.endsWith('.html') || filePath.endsWith('.json');
    const isHashedAsset = /\.[a-f0-9]{8,}\.(js|css)$/i.test(filePath);

    if (isServiceWorker || isHtmlOrJson) {
      res.setHeader('Cache-Control', 'no-cache, must-revalidate');
    } else if (isHashedAsset) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    } else {
      res.setHeader('Cache-Control', 'public, max-age=3600');
    }
  }
}));

app.get("*", (_req, res) => {
  res.setHeader('Cache-Control', 'no-cache, must-revalidate');
  res.sendFile(join(distPath, "index.html"));
});

app.use((err, req, res, _next) => {
  logger.error("Unhandled error", { error: err?.message || err, stack: err?.stack, requestId: req.requestId });
  if (res.headersSent) return;
  res.status(500).json({
    ok: false,
    error: "INTERNAL_SERVER_ERROR",
    message: "Something went wrong. Please try again.",
  });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, "0.0.0.0", () => {
  logger.info("Server listening", { url: `http://0.0.0.0:${PORT}`, port: PORT });
});

async function gracefulShutdown(signal) {
  logger.info(`${signal} received, shutting down gracefully...`);
  const forceTimer = setTimeout(() => {
    logger.error("Forced shutdown after timeout.");
    process.exit(1);
  }, 10000);
  forceTimer.unref();

  server.close(async () => {
    logger.info("HTTP server closed.");
    try {
      const { pool } = await import("./db/client.mjs");
      if (pool && typeof pool.end === "function") {
        await pool.end();
        logger.info("Database pool closed.");
      }
    } catch {}
    process.exit(0);
  });
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

} // end startProductionServer

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled promise rejection", { error: reason?.message || reason });
});

process.on("uncaughtException", (err) => {
  logger.error("Uncaught exception — shutting down", { error: err?.message || err, stack: err?.stack });
  process.exit(1);
});

startProductionServer().catch(err => {
  logger.error("Failed to start production server", { error: err?.message || err });
  process.exit(1);
});