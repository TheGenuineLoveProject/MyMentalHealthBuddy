// server/routes/ai-dashboard.mjs
import { Router } from "express";

const router = Router();

// Simple placeholder dashboard route
// GET /ai/dashboard
router.get("/dashboard", (req, res) => {
  res.json({
    status: "ok",
    message: "AI dashboard endpoint is wired and alive."
  });
});

export default router;