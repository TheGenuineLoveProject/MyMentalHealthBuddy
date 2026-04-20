import authRoutes from "./routes/auth.mjs";
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT ERROR:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED PROMISE:', err);
});
import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ ROUTES (FIXES aiRoutes error)
import aiRoutes from "./routes/ai.mjs";
import aiHealingRoutes from "./routes/ai.healing.mjs";
import aiBusinessRoutes from "./routes/ai.business.mjs";
import healthRoutes from "./routes/health.mjs";

// ✅ OPTIONAL AUTH (FIXES authMiddleware error)
import { optionalAuth } from "./middleware/auth.mjs";
import { requireAdult } from "./middleware/requireAdult.mjs";

// ----------------------------
// APP INIT
// ----------------------------
const app = express();

// ----------------------------
// MIDDLEWARE
// ----------------------------
app.use(cors());
app.use(express.json());


// ===== SECURITY LAYER =====
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";

// basic security headers
app.use(helmet());

// cookies (for future session use)
app.use(cookieParser());

// ===== RATE LIMIT (AI ROUTES ONLY) =====
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

// apply limiter ONLY to AI routes
app.use("/api/ai", aiLimiter);



// Serve static frontend assets (public/ai-chat.html, etc.)
app.use(express.static(path.join(__dirname, "..", "public")));

// ----------------------------
// ROUTES
// ----------------------------

// Health check (must work first)
app.use("/api/health", healthRoutes);

// Healing engine (gated by age verification; admin sub-routes self-gate)
app.use("/api/ai/healing", requireAdult, aiHealingRoutes);

// Business engine (staff/admin only; admin sub-routes self-gate)
app.use("/api/ai/business", aiBusinessRoutes);

// Auth routes (mount before AI routes so /api/auth/* works)
app.use("/api/auth", authRoutes);

// AI routes (aiLimiter already mounted above on /api/ai before this handler)
app.use("/api/ai", optionalAuth, aiRoutes);

// ----------------------------
// ROOT
// ----------------------------
app.get("/", (req, res) => {
  res.json({
    service: "MyMentalHealthBuddy",
    brand: "TheGenuineLoveProject",
    status: "running",
  });
});

// ----------------------------
// START SERVER
// ----------------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
