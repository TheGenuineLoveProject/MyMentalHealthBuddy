import express from "express";
import { db } from "../db/connection.mjs";
import { postDrafts, contentTemplates, calendarEntries } from "../../shared/schema.mjs";
import { eq, desc, and } from "drizzle-orm";
import { success, badRequest } from "../utils/response.mjs";
import { requireAuth, requireAdmin } from "../middleware/auth.mjs";
import { logger } from "../utils/logger.mjs";

const router = express.Router();

/* =====================================================
 * POST DRAFTS CRUD
 * =====================================================
 */

router.get("/drafts", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { status, platform } = req.query;
    let query = db.select().from(postDrafts).orderBy(desc(postDrafts.createdAt));
    
    const drafts = await query.limit(100);
    return success(res, drafts);
  } catch (error) {
    logger.error("Failed to fetch drafts:", error);
    return badRequest(res, "Failed to fetch drafts");
  }
});

router.get("/drafts/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const [draft] = await db
      .select()
      .from(postDrafts)
      .where(eq(postDrafts.id, id))
      .limit(1);
    
    if (!draft) {
      return badRequest(res, "Draft not found", 404);
    }
    return success(res, draft);
  } catch (error) {
    logger.error("Failed to fetch draft:", error);
    return badRequest(res, "Failed to fetch draft");
  }
});

router.post("/drafts", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { platform, hook, caption, cta, hashtags, disclaimer, theme } = req.body;
    
    const [draft] = await db
      .insert(postDrafts)
      .values({
        userId: req.user.id,
        platform,
        hook,
        caption,
        cta,
        hashtags,
        disclaimer,
        theme,
        status: "draft",
      })
      .returning();
    
    return success(res, draft, 201);
  } catch (error) {
    logger.error("Failed to create draft:", error);
    return badRequest(res, "Failed to create draft");
  }
});

router.patch("/drafts/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const [draft] = await db
      .update(postDrafts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(postDrafts.id, id))
      .returning();
    
    if (!draft) {
      return badRequest(res, "Draft not found", 404);
    }
    return success(res, draft);
  } catch (error) {
    logger.error("Failed to update draft:", error);
    return badRequest(res, "Failed to update draft");
  }
});

router.delete("/drafts/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete(postDrafts).where(eq(postDrafts.id, id));
    return success(res, { message: "Draft deleted" });
  } catch (error) {
    logger.error("Failed to delete draft:", error);
    return badRequest(res, "Failed to delete draft");
  }
});

router.post("/drafts/:id/approve", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const [draft] = await db
      .update(postDrafts)
      .set({ status: "approved", updatedAt: new Date() })
      .where(eq(postDrafts.id, id))
      .returning();
    
    if (!draft) {
      return badRequest(res, "Draft not found", 404);
    }
    return success(res, draft);
  } catch (error) {
    logger.error("Failed to approve draft:", error);
    return badRequest(res, "Failed to approve draft");
  }
});

/* =====================================================
 * CONTENT TEMPLATES CRUD
 * =====================================================
 */

router.get("/templates", requireAuth, requireAdmin, async (req, res) => {
  try {
    const templates = await db
      .select()
      .from(contentTemplates)
      .where(eq(contentTemplates.isActive, true))
      .orderBy(desc(contentTemplates.createdAt));
    
    return success(res, templates);
  } catch (error) {
    logger.error("Failed to fetch templates:", error);
    return badRequest(res, "Failed to fetch templates");
  }
});

router.post("/templates", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { type, name, structure, voiceRules, level } = req.body;
    
    if (!structure) {
      return badRequest(res, "Structure is required");
    }
    
    const [template] = await db
      .insert(contentTemplates)
      .values({ type, name, structure, voiceRules, level })
      .returning();
    
    return success(res, template, 201);
  } catch (error) {
    logger.error("Failed to create template:", error);
    return badRequest(res, "Failed to create template");
  }
});

router.delete("/templates/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await db
      .update(contentTemplates)
      .set({ isActive: false })
      .where(eq(contentTemplates.id, id));
    
    return success(res, { message: "Template archived" });
  } catch (error) {
    logger.error("Failed to archive template:", error);
    return badRequest(res, "Failed to archive template");
  }
});

/* =====================================================
 * CALENDAR ENTRIES CRUD
 * =====================================================
 */

router.get("/calendar", requireAuth, requireAdmin, async (req, res) => {
  try {
    const entries = await db
      .select()
      .from(calendarEntries)
      .orderBy(desc(calendarEntries.scheduledDate))
      .limit(100);
    
    return success(res, entries);
  } catch (error) {
    logger.error("Failed to fetch calendar:", error);
    return badRequest(res, "Failed to fetch calendar");
  }
});

router.post("/calendar", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { draftId, scheduledDate, platform, theme } = req.body;
    
    if (!draftId || !scheduledDate) {
      return badRequest(res, "Draft ID and scheduled date are required");
    }
    
    const [entry] = await db
      .insert(calendarEntries)
      .values({ draftId, scheduledDate: new Date(scheduledDate), platform, theme })
      .returning();
    
    await db
      .update(postDrafts)
      .set({ status: "scheduled", scheduledFor: new Date(scheduledDate) })
      .where(eq(postDrafts.id, draftId));
    
    return success(res, entry, 201);
  } catch (error) {
    logger.error("Failed to create calendar entry:", error);
    return badRequest(res, "Failed to create calendar entry");
  }
});

router.delete("/calendar/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete(calendarEntries).where(eq(calendarEntries.id, id));
    return success(res, { message: "Calendar entry deleted" });
  } catch (error) {
    logger.error("Failed to delete calendar entry:", error);
    return badRequest(res, "Failed to delete calendar entry");
  }
});

/* =====================================================
 * EXPORT FUNCTIONALITY
 * =====================================================
 */

router.post("/export", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { format = "json", status = "approved" } = req.body;
    
    const drafts = await db
      .select()
      .from(postDrafts)
      .where(eq(postDrafts.status, status))
      .orderBy(desc(postDrafts.createdAt));
    
    if (format === "csv") {
      const headers = ["id", "platform", "hook", "caption", "cta", "hashtags", "theme", "status"];
      const csv = [
        headers.join(","),
        ...drafts.map(d => headers.map(h => `"${(d[h] || "").replace(/"/g, '""')}"`).join(","))
      ].join("\n");
      
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=social-posts-export.csv");
      return res.send(csv);
    }
    
    return success(res, drafts);
  } catch (error) {
    logger.error("Failed to export:", error);
    return badRequest(res, "Failed to export");
  }
});

export default router;
