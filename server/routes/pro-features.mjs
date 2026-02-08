import express from "express";
import { requireAuth } from "../middleware/auth.mjs";
import { requirePro, attachUserPlan } from "../middleware/requirePlan.mjs";
import { success } from "../utils/response.mjs";

const router = express.Router();

router.use(requireAuth);
router.use(attachUserPlan);

router.get("/healing-journeys", requirePro, async (req, res) => {
  return success(res, {
    feature: "healing_journeys",
    plan: req.userPlan,
    message: "Welcome to Healing Journeys - a Pro feature",
    journeys: [
      { id: "self-love", title: "Self-Love Journey", sessions: 12 },
      { id: "inner-child", title: "Inner Child Healing", sessions: 8 },
      { id: "anxiety-relief", title: "Anxiety Relief Program", sessions: 10 },
    ],
  });
});

router.get("/advanced-analytics", requirePro, async (req, res) => {
  return success(res, {
    feature: "advanced_analytics",
    plan: req.userPlan,
    message: "Advanced Analytics - Pro feature",
    analytics: {
      moodTrends: { available: true },
      journalInsights: { available: true },
      wellnessScores: { available: true },
    },
  });
});

router.get("/ai-concierge", requirePro, async (req, res) => {
  return success(res, {
    feature: "ai_concierge",
    plan: req.userPlan,
    message: "AI Wellness Concierge - Pro feature",
  });
});

router.get("/check-access", async (req, res) => {
  return success(res, {
    currentPlan: req.userPlan,
    access: {
      freeFeatures: true,
      proFeatures: req.userPlan === "pro",
    },
  });
});

export default router;
