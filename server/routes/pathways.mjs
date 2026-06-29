import express from "express";

const router = express.Router();

router.get("/progress", async (_req, res) => {
  return res.json({
    ok: true,
    status: "ready",
    feature: "pathways-progress",
    progress: {
      completedPathways: [],
      activePathway: null,
      completionPercent: 0,
      lastUpdated: null
    }
  });
});

export default router;
