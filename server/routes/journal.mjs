// server/routes/journal.mjs

import express from "express";
import { randomUUID } from "crypto";
import { db } from "../db/connection.mjs";
import { journals } from "../../shared/schema.mjs";
import { eq, sql } from "drizzle-orm";
import { success, badRequest } from "../utils/response.mjs";
import { requireAuth } from "../middleware/auth.mjs";
import { createJournalSchema, updateJournalSchema, validateBody } from "../validation/schemas.mjs";

const router = express.Router();

// Apply auth middleware to all journal routes
router.use(requireAuth);

/**
 * POST /api/journal
 * Body: { title, content }
 * User ID comes from JWT token
 */
router.post("/", validateBody(createJournalSchema), async (req, res) => {
  try {
    const userId = req.user?.id;
    const { title, content } = req.validatedBody;

    const inserted = await db
      .insert(journals)
      .values({
        id: randomUUID(),
        userId,
        title,
        text: content,
        createdAt: new Date(),
      })
      .returning({
        id: journals.id,
        title: journals.title,
        text: journals.text,
        createdAt: journals.createdAt,
      });

    const result = inserted[0];
    return success(res, { ...result, content: result.text }, "Journal entry created.");
  } catch (err) {
    console.error("[journal/create] Unexpected error:", err);
    return res.status(500).json({
      ok: false,
      message: "Unexpected error when creating journal entry.",
    });
  }
});

/**
 * GET /api/journal
 * Fetch all entries for authenticated user
 */
router.get("/", async (req, res) => {
  try {
    const userId = req.user?.id;

    const entries = await db
      .select()
      .from(journals)
      .where(eq(journals.userId, userId))
      .orderBy(sql`${journals.createdAt} DESC`);

    const mapped = entries.map(e => ({ ...e, content: e.text }));
    return success(res, mapped, "Journal entries fetched.");
  } catch (err) {
    console.error("[journal/fetch] Unexpected error:", err);
    return res.status(500).json({
      ok: false,
      message: "Unexpected error while fetching journal entries.",
    });
  }
});

/**
 * GET /api/journal/:id
 * Fetch single entry by ID
 */
router.get("/:id", async (req, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const entries = await db
      .select()
      .from(journals)
      .where(eq(journals.id, id));

    if (entries.length === 0) {
      return badRequest(res, "Journal entry not found.");
    }

    if (entries[0].userId !== userId) {
      return badRequest(res, "Access denied.");
    }

    const entry = entries[0];
    return success(res, { ...entry, content: entry.text }, "Journal entry fetched.");
  } catch (err) {
    console.error("[journal/fetch-one] Unexpected error:", err);
    return res.status(500).json({
      ok: false,
      message: "Unexpected error while fetching journal entry.",
    });
  }
});

/**
 * PUT /api/journal/:id
 * Update entry by ID
 */
router.put("/:id", validateBody(updateJournalSchema), async (req, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { title, content } = req.validatedBody;

    const existing = await db
      .select()
      .from(journals)
      .where(eq(journals.id, id));

    if (existing.length === 0 || existing[0].userId !== userId) {
      return badRequest(res, "Journal entry not found or access denied.");
    }

    const updateValues = { updatedAt: new Date() };
    if (title !== undefined) updateValues.title = title;
    if (content !== undefined) updateValues.text = content;

    const [updated] = await db
      .update(journals)
      .set(updateValues)
      .where(eq(journals.id, id))
      .returning();

    return success(res, { ...updated, content: updated.text }, "Journal entry updated.");
  } catch (err) {
    console.error("[journal/update] Unexpected error:", err);
    return res.status(500).json({
      ok: false,
      message: "Unexpected error while updating journal entry.",
    });
  }
});

/**
 * DELETE /api/journal/:id
 * Delete entry by ID
 */
router.delete("/:id", async (req, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    // Check ownership first
    const existing = await db
      .select()
      .from(journals)
      .where(eq(journals.id, id));

    if (existing.length === 0 || existing[0].userId !== userId) {
      return badRequest(res, "Journal entry not found or access denied.");
    }

    await db.delete(journals).where(eq(journals.id, id));

    return success(res, { id }, "Journal entry deleted.");
  } catch (err) {
    console.error("[journal/delete] Unexpected error:", err);
    return res.status(500).json({
      ok: false,
      message: "Unexpected error while deleting journal entry.",
    });
  }
});

export default router;
