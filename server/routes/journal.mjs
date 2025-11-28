// server/routes/journal.mjs
import express from "express";
import { db } from "../db/connection.mjs";
import { journals } from "../shared/schema.mjs";
import { authGuard } from "../middleware/auth.mjs";
import { eq, desc } from "drizzle-orm";
import { success, created, badRequest, notFound, forbidden, serverError } from "../utils/response.mjs";
import { validateJournal } from "../utils/validation.mjs";

const router = express.Router();

router.get("/ping", (req, res) => success(res, { route: "journal" }));

router.post("/", authGuard, async (req, res) => {
  try {
    const { valid, errors, data } = validateJournal(req.body);
    if (!valid) {
      return badRequest(res, "Validation failed.", errors);
    }

    const { text, title, mood } = validation.data;
    const userId = req.user.id;

    const [entry] = await db
      .insert(journals)
      .values({
        userId,
        text: text.trim(),
        title: title?.trim() || null,
        mood: mood || null
      })
      .returning();

    return created(res, { entry });
  } catch (err) {
    return serverError(res, err, "Failed to save journal entry");
  }
});

router.get("/", authGuard, async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = Math.min(parseInt(req.query.limit) || 50, 100);
    const offset = parseInt(req.query.offset) || 0;

    const list = await db
      .select()
      .from(journals)
      .where(eq(journals.userId, userId))
      .orderBy(desc(journals.createdAt))
      .limit(limit)
      .offset(offset);

    return success(res, { 
      list: list || [],
      pagination: { limit, offset, count: list.length }
    });
  } catch (err) {
    return serverError(res, err, "Failed to fetch journal entries");
  }
});

router.get("/:id", authGuard, async (req, res) => {
  try {
    const userId = req.user.id;
    const entryId = parseInt(req.params.id);

    if (isNaN(entryId)) {
      return badRequest(res, "Invalid entry ID");
    }

    const [entry] = await db
      .select()
      .from(journals)
      .where(eq(journals.id, entryId));

    if (!entry) {
      return notFound(res, "Journal entry not found");
    }

    if (entry.userId !== userId) {
      return forbidden(res, "Not authorized to view this entry");
    }

    return success(res, { entry });
  } catch (err) {
    return serverError(res, err, "Failed to fetch journal entry");
  }
});

router.put("/:id", authGuard, async (req, res) => {
  try {
    const userId = req.user.id;
    const entryId = parseInt(req.params.id);

    if (isNaN(entryId)) {
      return badRequest(res, "Invalid entry ID");
    }

    const validation = validate(journalUpdateSchema, req.body);
    if (!validation.valid) {
      return res.status(400).json({
        ok: false,
        error: "Validation failed",
        validationErrors: validation.errors
      });
    }

    const [existing] = await db
      .select()
      .from(journals)
      .where(eq(journals.id, entryId));

    if (!existing) {
      return notFound(res, "Journal entry not found");
    }

    if (existing.userId !== userId) {
      return forbidden(res, "Not authorized to edit this entry");
    }

    const updateData = {};
    if (validation.data.text) updateData.text = validation.data.text.trim();
    if (validation.data.title !== undefined) updateData.title = validation.data.title?.trim() || null;
    if (validation.data.mood !== undefined) updateData.mood = validation.data.mood;

    const [updated] = await db
      .update(journals)
      .set(updateData)
      .where(eq(journals.id, entryId))
      .returning();

    return success(res, { entry: updated });
  } catch (err) {
    return serverError(res, err, "Failed to update journal entry");
  }
});

router.delete("/:id", authGuard, async (req, res) => {
  try {
    const userId = req.user.id;
    const entryId = parseInt(req.params.id);

    if (isNaN(entryId)) {
      return badRequest(res, "Invalid entry ID");
    }

    const [existing] = await db
      .select()
      .from(journals)
      .where(eq(journals.id, entryId));

    if (!existing) {
      return notFound(res, "Journal entry not found");
    }

    if (existing.userId !== userId) {
      return forbidden(res, "Not authorized to delete this entry");
    }

    await db.delete(journals).where(eq(journals.id, entryId));

    return success(res, { message: "Journal entry deleted successfully" });
  } catch (err) {
    return serverError(res, err, "Failed to delete journal entry");
  }
});

export default router;
