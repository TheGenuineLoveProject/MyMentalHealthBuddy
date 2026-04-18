import express from "express";
import cors from "cors";

// ✅ ROUTES (FIXES aiRoutes error)
import aiRoutes from "./routes/ai.mjs";
import aiHealingRoutes from "./routes/ai.healing.mjs";
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

// ----------------------------
// ROUTES
// ----------------------------

// Health check (must work first)
app.use("/api/health", healthRoutes);

// Healing engine (gated by age verification; admin sub-routes self-gate)
app.use("/api/ai/healing", requireAdult, aiHealingRoutes);

// AI routes
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