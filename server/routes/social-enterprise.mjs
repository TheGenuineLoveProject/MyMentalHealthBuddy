import express from "express";
import { randomUUID } from "crypto";
import { db } from "../db/connection.mjs";
import { socialPosts, publishingEvents, analyticsEvents } from "../../shared/schema.mjs";
import { eq, desc, and, gte, sql } from "drizzle-orm";
import { success, badRequest } from "../utils/response.mjs";
import { requireAuth, requireAdmin } from "../middleware/auth.mjs";
import { logger } from "../utils/logger.mjs";
import { validatePublishingContent } from "../../shared/publishingRules.mjs";

const router = express.Router();

const VALID_STATUSES = ["draft", "review", "approved", "posted"];
const VALID_ORIGIN_TYPES = ["blog", "newsletter", "reflection", "campaign", "standalone"];
const VALID_PLATFORMS = ["instagram", "tiktok", "x", "youtube", "facebook", "linkedin", "threads", "pinterest"];
const VALID_THEMES = [
  "self-compassion", "boundaries", "healing", "gratitude", "mindfulness",
  "inner-child", "self-worth", "resilience", "emotional-intelligence", "growth",
  "trauma-awareness", "self-love", "community", "purpose"
];

const STATUS_TRANSITIONS = {
  draft: "review",
  review: "approved",
  approved: "posted",
};

function logPublishingEvent(type, meta) {
  return db.insert(publishingEvents).values({ type, meta }).catch(err => {
    logger.error("Failed to log publishing event", { type, error: err.message });
  });
}

router.get("/posts", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { status, theme, origin_type, limit: limitParam } = req.query;
    const conditions = [];

    if (status && VALID_STATUSES.includes(status)) {
      conditions.push(eq(socialPosts.status, status));
    }
    if (theme) {
      conditions.push(eq(socialPosts.theme, theme));
    }
    if (origin_type && VALID_ORIGIN_TYPES.includes(origin_type)) {
      conditions.push(eq(socialPosts.originType, origin_type));
    }

    const query = db.select().from(socialPosts);
    const maxRows = Math.min(parseInt(limitParam) || 200, 500);

    const posts = conditions.length > 0
      ? await query.where(and(...conditions)).orderBy(desc(socialPosts.createdAt)).limit(maxRows)
      : await query.orderBy(desc(socialPosts.createdAt)).limit(maxRows);

    return success(res, posts);
  } catch (error) {
    logger.error("Failed to fetch enterprise social posts:", error);
    return badRequest(res, "Failed to fetch posts");
  }
});

router.get("/post/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const [post] = await db.select().from(socialPosts).where(eq(socialPosts.id, id)).limit(1);
    if (!post) return badRequest(res, "Post not found", 404);
    return success(res, post);
  } catch (error) {
    logger.error("Failed to fetch social post:", error);
    return badRequest(res, "Failed to fetch post");
  }
});

router.post("/post", requireAuth, requireAdmin, async (req, res) => {
  try {
    const {
      title, content, platform = "instagram", theme, originType = "standalone",
      originId, captions, hashtags, gentleCtaUrl, safetyNote,
      crisisLinkRequired = 0, audience
    } = req.body;

    if (!title || !title.trim()) return badRequest(res, "Title is required");
    if (!content || !content.trim()) return badRequest(res, "Content is required");
    if (!safetyNote || !safetyNote.trim()) return badRequest(res, "Safety note is required");

    const userId = req.dbUserId;
    const userName = req.session?.passport?.user?.username || "admin";

    const [newPost] = await db.insert(socialPosts).values({
      title: title.trim(),
      content: content.trim(),
      platform,
      status: "draft",
      theme: theme || null,
      originType,
      originId: originId || null,
      captions: captions || {},
      hashtags: hashtags || "",
      gentleCtaUrl: gentleCtaUrl || null,
      safetyNote: safetyNote.trim(),
      crisisLinkRequired: crisisLinkRequired ? 1 : 0,
      audience: audience || null,
      authorId: userId,
      createdBy: userName,
      postedPlatforms: [],
    }).returning();

    await logPublishingEvent("social_draft_created", {
      postId: newPost.id, title: newPost.title, createdBy: userName
    });

    return success(res, newPost, "Draft created.");
  } catch (error) {
    logger.error("Failed to create enterprise social post:", error);
    return badRequest(res, "Failed to create post");
  }
});

router.put("/post/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const [existing] = await db.select().from(socialPosts).where(eq(socialPosts.id, id)).limit(1);
    if (!existing) return badRequest(res, "Post not found", 404);

    if (existing.status !== "draft" && existing.status !== "review") {
      return badRequest(res, "Only draft or in-review posts can be edited");
    }

    const { title, content, platform, theme, originType, captions,
      hashtags, gentleCtaUrl, safetyNote, crisisLinkRequired, audience } = req.body;

    const updateData = { updatedAt: new Date() };
    if (title !== undefined) updateData.title = title.trim();
    if (content !== undefined) updateData.content = content.trim();
    if (platform !== undefined) updateData.platform = platform;
    if (theme !== undefined) updateData.theme = theme;
    if (originType !== undefined) updateData.originType = originType;
    if (captions !== undefined) updateData.captions = captions;
    if (hashtags !== undefined) updateData.hashtags = hashtags;
    if (gentleCtaUrl !== undefined) updateData.gentleCtaUrl = gentleCtaUrl;
    if (safetyNote !== undefined) updateData.safetyNote = safetyNote.trim();
    if (crisisLinkRequired !== undefined) updateData.crisisLinkRequired = crisisLinkRequired ? 1 : 0;
    if (audience !== undefined) updateData.audience = audience;

    if (existing.status === "review") {
      updateData.status = "draft";
      updateData.reviewedAt = null;
      updateData.reviewedBy = null;
    }

    const [updated] = await db.update(socialPosts).set(updateData).where(eq(socialPosts.id, id)).returning();
    const userName = req.session?.passport?.user?.username || "admin";
    await logPublishingEvent("social_post_edited", { postId: id, editedBy: userName });

    return success(res, updated, "Post updated.");
  } catch (error) {
    logger.error("Failed to update enterprise social post:", error);
    return badRequest(res, "Failed to update post");
  }
});

router.post("/post/:id/submit", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const [post] = await db.select().from(socialPosts).where(eq(socialPosts.id, id)).limit(1);
    if (!post) return badRequest(res, "Post not found", 404);
    if (post.status !== "draft") return badRequest(res, "Only drafts can be submitted for review");

    if (!post.safetyNote || !post.safetyNote.trim()) {
      return badRequest(res, "Safety note is required before submitting for review");
    }

    const userName = req.session?.passport?.user?.username || "admin";
    const [updated] = await db.update(socialPosts).set({
      status: "review",
      reviewedAt: new Date(),
      reviewedBy: userName,
      updatedAt: new Date(),
    }).where(eq(socialPosts.id, id)).returning();

    await logPublishingEvent("social_submitted_for_review", { postId: id, submittedBy: userName });
    return success(res, updated, "Submitted for review.");
  } catch (error) {
    logger.error("Failed to submit social post for review:", error);
    return badRequest(res, "Failed to submit for review");
  }
});

router.post("/post/:id/approve", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const [post] = await db.select().from(socialPosts).where(eq(socialPosts.id, id)).limit(1);
    if (!post) return badRequest(res, "Post not found", 404);
    if (post.status !== "review") return badRequest(res, "Only posts in review can be approved");

    if (!post.safetyNote || !post.safetyNote.trim()) {
      return res.status(422).json({
        ok: false,
        message: "Cannot approve without a safety note",
        errors: ["Safety note is required"],
        warnings: [],
      });
    }

    const allCaptionText = post.captions
      ? Object.values(post.captions).join(" ")
      : "";
    const combinedContent = `${post.title} ${post.content} ${allCaptionText}`;
    const safety = validatePublishingContent(post.title, "", combinedContent);
    if (!safety.valid) {
      return res.status(422).json({
        ok: false,
        message: "Content safety validation failed",
        errors: safety.errors,
        warnings: safety.warnings,
      });
    }

    if (post.crisisLinkRequired === 1) {
      const hasCrisisRef = /crisis|988|hotline|lifeline|emergency|help\s*line/i.test(combinedContent);
      if (!hasCrisisRef) {
        return res.status(422).json({
          ok: false,
          message: "Crisis link required but not found in content",
          errors: ["This post is flagged as requiring a crisis link. Please include a reference to crisis support (e.g., /crisis or 988 Lifeline)."],
          warnings: [],
        });
      }
    }

    const userName = req.session?.passport?.user?.username || "admin";
    const [updated] = await db.update(socialPosts).set({
      status: "approved",
      approvedAt: new Date(),
      approvedBy: userName,
      updatedAt: new Date(),
    }).where(eq(socialPosts.id, id)).returning();

    await logPublishingEvent("social_post_approved", {
      postId: id, approvedBy: userName, safetyWarnings: safety.warnings
    });

    const result = { ...updated, safetyWarnings: safety.warnings };
    return success(res, result, safety.warnings.length > 0
      ? `Approved with warnings: ${safety.warnings.join("; ")}`
      : "Post approved.");
  } catch (error) {
    logger.error("Failed to approve social post:", error);
    return badRequest(res, "Failed to approve");
  }
});

router.post("/post/:id/mark-posted", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { platforms } = req.body;

    if (!platforms || !Array.isArray(platforms) || platforms.length === 0) {
      return badRequest(res, "At least one platform must be specified");
    }
    const invalidPlatforms = platforms.filter(p => !VALID_PLATFORMS.includes(p));
    if (invalidPlatforms.length > 0) {
      return badRequest(res, `Invalid platforms: ${invalidPlatforms.join(", ")}`);
    }

    const [post] = await db.select().from(socialPosts).where(eq(socialPosts.id, id)).limit(1);
    if (!post) return badRequest(res, "Post not found", 404);
    if (post.status !== "approved") return badRequest(res, "Only approved posts can be marked as posted");

    const existingPlatforms = Array.isArray(post.postedPlatforms) ? post.postedPlatforms : [];
    const allPlatforms = [...new Set([...existingPlatforms, ...platforms])];

    const userName = req.session?.passport?.user?.username || "admin";
    const [updated] = await db.update(socialPosts).set({
      status: "posted",
      postedPlatforms: allPlatforms,
      postedAt: new Date(),
      publishedAt: new Date(),
      updatedAt: new Date(),
    }).where(eq(socialPosts.id, id)).returning();

    await logPublishingEvent("social_post_marked_posted", {
      postId: id, platforms: allPlatforms, postedBy: userName
    });

    return success(res, updated, "Post marked as posted.");
  } catch (error) {
    logger.error("Failed to mark social post as posted:", error);
    return badRequest(res, "Failed to mark as posted");
  }
});

router.get("/signals", requireAuth, requireAdmin, async (req, res) => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const topThemes = await db
      .select({
        theme: socialPosts.theme,
        count: sql`count(*)::int`.as("count"),
      })
      .from(socialPosts)
      .where(and(
        eq(socialPosts.status, "posted"),
        socialPosts.theme !== null,
      ))
      .groupBy(socialPosts.theme)
      .orderBy(desc(sql`count(*)`))
      .limit(10);

    const recentAnalytics = await db
      .select({
        eventName: analyticsEvents.eventName,
        path: analyticsEvents.path,
        count: sql`count(*)::int`.as("count"),
      })
      .from(analyticsEvents)
      .where(and(
        gte(analyticsEvents.createdAt, sevenDaysAgo),
        eq(analyticsEvents.eventCategory, "blog"),
      ))
      .groupBy(analyticsEvents.eventName, analyticsEvents.path)
      .orderBy(desc(sql`count(*)`))
      .limit(10);

    const statusCounts = await db
      .select({
        status: socialPosts.status,
        count: sql`count(*)::int`.as("count"),
      })
      .from(socialPosts)
      .groupBy(socialPosts.status);

    const suggestedFocus = [];
    const draftCount = statusCounts.find(s => s.status === "draft")?.count || 0;
    const reviewCount = statusCounts.find(s => s.status === "review")?.count || 0;
    const approvedCount = statusCounts.find(s => s.status === "approved")?.count || 0;

    if (approvedCount > 3) suggestedFocus.push("You have " + approvedCount + " approved posts ready to share.");
    if (reviewCount > 5) suggestedFocus.push("Review queue is growing (" + reviewCount + ") — consider approving or returning to draft.");
    if (draftCount > 10) suggestedFocus.push("Many drafts (" + draftCount + ") — consider trimming or advancing the best ones.");

    if (topThemes.length > 0) {
      const topTheme = topThemes[0].theme;
      suggestedFocus.push(`Most-posted theme: "${topTheme}" — consider diversifying or doubling down.`);
    }

    if (recentAnalytics.length > 0) {
      const topBlogPath = recentAnalytics[0].path;
      suggestedFocus.push(`Top blog activity this week: ${topBlogPath} — consider creating social content from this.`);
    }

    return success(res, {
      topThemes,
      recentBlogActivity: recentAnalytics,
      statusCounts: Object.fromEntries(statusCounts.map(s => [s.status, s.count])),
      suggestedFocus,
    });
  } catch (error) {
    logger.error("Failed to fetch social signals:", error);
    return success(res, { topThemes: [], recentBlogActivity: [], statusCounts: {}, suggestedFocus: [] });
  }
});

router.get("/audit", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { limit: limitParam } = req.query;
    const maxRows = Math.min(parseInt(limitParam) || 50, 200);

    const events = await db
      .select()
      .from(publishingEvents)
      .where(sql`${publishingEvents.type} LIKE 'social_%'`)
      .orderBy(desc(publishingEvents.createdAt))
      .limit(maxRows);

    return success(res, events);
  } catch (error) {
    logger.error("Failed to fetch social audit log:", error);
    return success(res, []);
  }
});

router.get("/themes", requireAuth, requireAdmin, async (_req, res) => {
  return success(res, VALID_THEMES);
});

router.get("/platforms", requireAuth, requireAdmin, async (_req, res) => {
  return success(res, VALID_PLATFORMS);
});

export default router;
