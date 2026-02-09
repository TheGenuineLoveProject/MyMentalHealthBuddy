import { Router } from "express";
import jwt from "jsonwebtoken";
import { db } from "../db.mjs";
import { softLaunchFeedback } from "../../shared/schema.mjs";
import { desc } from "drizzle-orm";
import { JWT_SECRET as ACCESS_SECRET } from "../config/secrets.mjs";
import { logger } from "../utils/logger.mjs";

const router = Router();

const VALID_CATEGORIES = ["bug", "idea", "confusion", "praise"];

function requireAdmin(req, res, next) {
  const header = req.headers?.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ ok: false, message: "Unauthorized" });
  try {
    const payload = jwt.verify(token, ACCESS_SECRET);
    if (payload.role !== "admin") throw new Error("Not admin");
    return next();
  } catch {
    return res.status(401).json({ ok: false, message: "Unauthorized" });
  }
}

router.post("/", async (req, res) => {
  try {
    const { category, message, contactEmail } = req.body;

    if (!category || !VALID_CATEGORIES.includes(category)) {
      return res.status(400).json({ ok: false, message: `Category must be one of: ${VALID_CATEGORIES.join(", ")}` });
    }
    if (!message || typeof message !== "string" || message.trim().length < 3) {
      return res.status(400).json({ ok: false, message: "Message is required (at least 3 characters)" });
    }
    if (message.length > 2000) {
      return res.status(400).json({ ok: false, message: "Message must be under 2000 characters" });
    }

    const [entry] = await db.insert(softLaunchFeedback).values({
      category,
      message: message.trim(),
      contactEmail: contactEmail?.trim() || null,
    }).returning();

    logger.info("[Feedback] New feedback submitted", { category, id: entry.id });
    res.json({ ok: true, id: entry.id });
  } catch (err) {
    logger.error("[Feedback] Error saving feedback", { error: err.message });
    res.status(500).json({ ok: false, message: "Failed to save feedback" });
  }
});

router.get("/", requireAdmin, async (_req, res) => {
  try {
    const entries = await db
      .select()
      .from(softLaunchFeedback)
      .orderBy(desc(softLaunchFeedback.createdAt))
      .limit(200);

    res.json({ ok: true, feedback: entries, total: entries.length });
  } catch (err) {
    logger.error("[Feedback] Error loading feedback", { error: err.message });
    res.status(500).json({ ok: false, message: "Failed to load feedback" });
  }
});

export default router;
