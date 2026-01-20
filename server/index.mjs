import 'dotenv/config';
import express from 'express';
import compression from 'compression';
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import { dirname, join } from 'path';
import process from "node:process";
import authRouter from './routes/auth.mjs';
import adminRouter from './routes/admin.mjs';
import blogRouter from './routes/blog.mjs';
import journalRouter from './routes/journal.mjs';
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
import { requestId, requestLogger } from "./middleware/requestId.mjs";
import { contentRouter } from "./routes/content.mjs";
app.use("/api/content", contentRouter);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const isProduction = process.env.NODE_ENV === "production";

if (isProduction) {
  const requiredEnvVars = [
    { name: 'DATABASE_URL', value: process.env.DATABASE_URL },
    { name: 'JWT_SECRET', value: process.env.JWT_SECRET },
    { name: 'JWT_REFRESH_SECRET', value: process.env.JWT_REFRESH_SECRET },
    { name: 'SESSION_SECRET', value: process.env.SESSION_SECRET },
  ];
  
  const optionalButRecommended = [
    { name: 'STRIPE_SECRET_KEY', value: process.env.STRIPE_SECRET_KEY },
    { name: 'STRIPE_WEBHOOK_SECRET', value: process.env.STRIPE_WEBHOOK_SECRET },
    { name: 'CORS_ORIGIN', value: process.env.CORS_ORIGIN || process.env.CORS_ORIGINS },
  ];
  
  const missingRequired = requiredEnvVars.filter(v => !v.value);
  const missingOptional = optionalButRecommended.filter(v => !v.value);
  
  if (missingRequired.length > 0) {
    console.error(`DEPLOY BLOCKED: Missing required environment variables: ${missingRequired.map(v => v.name).join(', ')}`);
    process.exit(1);
  }
  
  if (missingOptional.length > 0) {
    console.warn(`WARNING: Missing recommended environment variables: ${missingOptional.map(v => v.name).join(', ')}`);
  }
}

const app = express();

app.set('trust proxy', 1);

// Request tracking middleware (first in chain)
app.use(requestId);
app.use(requestLogger);

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
      imgSrc: ["'self'", "data:", "blob:", "https:"],
      connectSrc: ["'self'", "https://api.openai.com", "https://api.stripe.com", "wss:", "ws:"],
      frameSrc: ["'self'", "https://js.stripe.com"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: isProduction ? [] : null,
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
}));
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Production-safe CORS configuration
const allowedOrigins = [
  process.env.CORS_ORIGIN,
  process.env.CORS_ORIGINS,
  isProduction ? undefined : "http://localhost:5000",
  isProduction ? undefined : "http://localhost:5173",
].filter(Boolean).flatMap((value) =>
  value.split(",").map((entry) => entry.trim()).filter(Boolean)
);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    // In development, allow all origins
    if (!isProduction) return callback(null, true);
    // In production, check allowlist
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));

app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/blog', blogRouter);
app.use('/api/journal', journalRouter);
app.use('/api/mood', moodRouter);
app.use('/api/health', healthRouter);
app.use('/api/account', accountRouter);
app.use('/api/ai', aiRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/billing', billingRouter);
app.use('/api/gamification', gamificationRouter);
app.use('/api/onboarding', onboardingRouter);
app.use('/api/therapy', therapyRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/webhook', webhookRouter);
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
app.use('/api/content', contentGeneratorRouter);
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

const SERVER_START_TIME = Date.now();

app.get("/api/health-check", (_req, res) => {
  res.json({ ok: true, env: isProduction ? "production" : "development" });
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

const distPath = join(__dirname, "../client/dist");
app.use(express.static(distPath));

app.get("*", (_req, res) => {
  res.sendFile(join(distPath, "index.html"));
});

app.use((err, _req, res, _next) => {
  console.error("Server error:", err);
  res.status(500).json({
    ok: false,
    error: "INTERNAL_SERVER_ERROR",
    message: "Something went wrong. Please try again.",
  });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on http://0.0.0.0:${PORT}`);
});

function _gracefulShutdown(signal) {
  console.log(`${signal} received, shutting down gracefully...`);
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
  setTimeout(() => {
    console.error("Forced shutdown after timeout.");
    process.exit(1);
  }, 10000);
}

process.on("SIGTERM", () => {
  console.log("[shutdown] SIGTERM received");
  process.exit(0);
});
process.on("SIGINT", () => {
  console.log("[shutdown] SIGINT received");
  process.exit(0);
});