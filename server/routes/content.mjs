import { users, moodEntries, journalEntries, subscriptions } 
  from "../shared/schema.mjs";
import { Router } from "express";
import authGuard from "../middleware/auth.mjs";

const router = Router();

router.get("/", authGuard, (req, res) => {
  res.json({
    message: "Content route working ✓",
    user: req.user,
  });
});

export default router;