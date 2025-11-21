import { Router } from "express";
const router = Router();

// SIMPLE HEALTH CHECK
router.get("/", (req, res) => {
  res.json({
    route: "ai-dashboard",
    status: "ok",
    timestamp: new Date().toISOString()
  });
});

export default router;