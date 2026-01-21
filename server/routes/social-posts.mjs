import express from "express";
import { randomUUID } from "crypto";
import { db } from "../db/connection.mjs";
import { socialPosts } from "../../shared/schema.mjs";
import { eq, desc } from "drizzle-orm";
import { success, badRequest } from "../utils/response.mjs";
import { requireAuth, requireAdmin } from "../middleware/auth.mjs";
import { logger } from "../utils/logger.mjs";

const router = express.Router();

router.get("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const posts = await db
      .select()
      .from(socialPosts)
      .orderBy(desc(socialPosts.createdAt))
      .limit(50);
    
    return success(res, posts);
  } catch (error) {
    logger.error("Failed to fetch social posts:", error);
    return badRequest(res, "Failed to fetch social posts");
  }
});

router.get("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const [post] = await db
      .select()
      .from(socialPosts)
      .where(eq(socialPosts.id, id))
      .limit(1);
    
    if (!post) {
      return badRequest(res, "Post not found", 404);
    }
    
    return success(res, post);
  } catch (error) {
    logger.error("Failed to fetch social post:", error);
    return badRequest(res, "Failed to fetch social post");
  }
});

router.post("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { title, content, platform, mediaUrl, scheduledAt, hashtags, status = "draft" } = req.body;
    
    if (!title || !content || !platform) {
      return badRequest(res, "Title, content, and platform are required");
    }
    
    const [newPost] = await db
      .insert(socialPosts)
      .values({
        title,
        content,
        platform,
        mediaUrl: mediaUrl || null,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        hashtags: hashtags || null,
        status,
        authorId: req.user?.id || randomUUID(),
      })
      .returning();
    
    return success(res, newPost, 201);
  } catch (error) {
    logger.error("Failed to create social post:", error);
    return badRequest(res, "Failed to create social post");
  }
});

router.patch("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, platform, mediaUrl, scheduledAt, hashtags, status } = req.body;
    
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (platform !== undefined) updateData.platform = platform;
    if (mediaUrl !== undefined) updateData.mediaUrl = mediaUrl;
    if (scheduledAt !== undefined) updateData.scheduledAt = scheduledAt ? new Date(scheduledAt) : null;
    if (hashtags !== undefined) updateData.hashtags = hashtags;
    if (status !== undefined) updateData.status = status;
    updateData.updatedAt = new Date();
    
    const [updatedPost] = await db
      .update(socialPosts)
      .set(updateData)
      .where(eq(socialPosts.id, id))
      .returning();
    
    if (!updatedPost) {
      return badRequest(res, "Post not found", 404);
    }
    
    return success(res, updatedPost);
  } catch (error) {
    logger.error("Failed to update social post:", error);
    return badRequest(res, "Failed to update social post");
  }
});

router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const [deletedPost] = await db
      .delete(socialPosts)
      .where(eq(socialPosts.id, id))
      .returning();
    
    if (!deletedPost) {
      return badRequest(res, "Post not found", 404);
    }
    
    return success(res, { message: "Post deleted successfully" });
  } catch (error) {
    logger.error("Failed to delete social post:", error);
    return badRequest(res, "Failed to delete social post");
  }
});

router.post("/:id/publish", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const [updatedPost] = await db
      .update(socialPosts)
      .set({
        status: "published",
        publishedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(socialPosts.id, id))
      .returning();
    
    if (!updatedPost) {
      return badRequest(res, "Post not found", 404);
    }
    
    return success(res, updatedPost);
  } catch (error) {
    logger.error("Failed to publish social post:", error);
    return badRequest(res, "Failed to publish social post");
  }
});

export default router;
