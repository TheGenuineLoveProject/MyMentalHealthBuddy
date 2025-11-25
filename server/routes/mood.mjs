import express from "express";
import { authGuard } from "../middleware/auth.mjs"; // adjust if your path is different

export const router = express.Router();

// POST /mood  → save today’s mood
router.post("/", authGuard, (req, res) => {
  const { mood, notes } = req.body || {};

  console.log("Mood saved:", { mood, notes });

  // TODO: later save to PostgreSQL
  return res.json({ ok: true });
});

// GET /mood/ping → simple health check
router.get("/ping", (req, res) => {
  res.json({ ok: true, route: "mood" });
});

export default router;