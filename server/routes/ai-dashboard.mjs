import { users, moodEntries, journalEntries, subscriptions } 
  from "../shared/schema.mjs";
import { Router } from "express";
import authGuard from "../middleware/auth.mjs";

const router = Router();

// ---- AI DASHBOARD (PROTECTED) ----
router.get("/", authGuard, (req, res) => {
  res.json({
    route: "ai-dashboard",
    status: "ok",
    user: req.user,
    timestamp: new Date().toISOString(),
  });
});

export default router;