// server/routes/social.mjs
// Admin social-post management for the Content Admin Dashboard.

import { Router } from "express";
import { db } from "../db/connection.mjs";
import { socialPosts } from "../../shared/schema.mjs";
import { desc } from "drizzle-orm";
import { requireAuth, requireAdmin } from "../middleware/auth.mjs";
import { logger } from "../utils/logger.mjs";

const router = Router();
router.use(requireAuth, requireAdmin);

router.get("/posts", async (_req, res) => {
  try {
    const rows = await db
      .select()
      .from(socialPosts)
      .orderBy(desc(socialPosts.createdAt))
      .limit(200);
    res.json(rows);
  } catch (err) {
    logger.error("[Social] Failed to list posts", { error: err.message });
    res.status(500).json({ error: "Failed to load posts" });
  }
});

router.post("/posts", async (req, res) => {
  try {
    const { title, content, platform, scheduledAt, status } = req.body || {};
    if (!content || typeof content !== "string" || !content.trim()) {
      return res.status(400).json({ error: "Content is required" });
    }
    if (!platform || typeof platform !== "string") {
      return res.status(400).json({ error: "Platform is required" });
    }

    const [row] = await db
      .insert(socialPosts)
      .values({
        title: title?.trim() || null,
        content: content.trim(),
        platform,
        status: status || "draft",
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        authorId: req.dbUserId,
      })
      .returning();

    res.status(201).json(row);
  } catch (err) {
    logger.error("[Social] Failed to create post", { error: err.message });
    res.status(500).json({ error: "Failed to create post" });
  }
});

export default router;
