import express from "express";
import { randomUUID } from "crypto";
import { db } from "../db/connection.mjs";
import { redirects } from "../../shared/schema.mjs";
import { eq, desc, sql } from "drizzle-orm";
import { success, badRequest } from "../utils/response.mjs";
import { requireAuth, requireAdmin } from "../middleware/auth.mjs";
import { logger } from "../utils/logger.mjs";

const router = express.Router();

function generateSlug(length = 6) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

router.get("/health", (_req, res) => {
  res.json({ ok: true, module: "redirects", status: "operational", timestamp: new Date().toISOString() });
});

router.get("/list", requireAuth, requireAdmin, async (req, res) => {
  try {
    const all = await db.select().from(redirects).orderBy(desc(redirects.createdAt)).limit(200);
    return success(res, all);
  } catch (error) {
    logger.error("Failed to fetch redirects:", error);
    return success(res, []);
  }
});

router.post("/create", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { url, slug: customSlug, campaignId } = req.body;
    if (!url) return badRequest(res, "url is required");

    const slug = customSlug && customSlug.trim() ? customSlug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "") : generateSlug();

    const existing = await db.select().from(redirects).where(eq(redirects.slug, slug)).limit(1);
    if (existing.length > 0) return badRequest(res, "Slug already exists");

    const [created] = await db.insert(redirects).values({
      slug,
      url,
      campaignId: campaignId || null,
    }).returning();

    return success(res, created, "Redirect created.");
  } catch (error) {
    logger.error("Failed to create redirect:", error);
    return badRequest(res, "Failed to create redirect");
  }
});

router.delete("/remove/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const [deleted] = await db.delete(redirects).where(eq(redirects.id, id)).returning();
    if (!deleted) return badRequest(res, "Redirect not found", 404);
    return success(res, deleted, "Redirect deleted.");
  } catch (error) {
    logger.error("Failed to delete redirect:", error);
    return badRequest(res, "Failed to delete redirect");
  }
});

router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const [redirect] = await db.select().from(redirects).where(eq(redirects.slug, slug)).limit(1);

    if (!redirect) {
      return res.status(404).send("Link not found");
    }

    db.update(redirects)
      .set({ clicks: sql`${redirects.clicks} + 1` })
      .where(eq(redirects.id, redirect.id))
      .catch(err => logger.error("Failed to increment redirect click:", err));

    return res.redirect(302, redirect.url);
  } catch (error) {
    logger.error("Redirect lookup failed:", error);
    return res.status(500).send("Redirect failed");
  }
});

export default router;
