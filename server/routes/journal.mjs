// server/routes/journal.mjs

import express from "express";
import { db } from "../db/connection.mjs";
import { journal } from "../../shared/schema.mjs";
import { eq } from "drizzle-orm";
import { success, badRequest } from "../utils/response.mjs";

const router = express.Router();

/**
 * POST /api/journal
 * Body: { userId, title, content }
 */
router.post("/", async (req, res) => {
  try {
    const { userId, title, content } = req.body ?? {};

    if (!userId) {
      return badRequest(res, "User ID is required.", [
        { field: "userId", message: "Missing userId" },
      ]);
    }

    if (!title || !content) {
      return badRequest(res, "Title and content are required.", [
        { field: "title", message: !title ? "Missing title" : "" },
        { field: "content", message: !content ? "Missing content" : "" },
      ]);
    }

    const inserted = await db
      .insert(journal)
      .values({
        userId,
        title,
        content,
        createdAt: new Date(),
      })
      .returning({
        id: journal.id,
        title: journal.title,
        content: journal.content,
        createdAt: journal.createdAt,
      });

    return success(res, inserted[0], "Journal entry created.");
  } catch (err) {
    console.error("[journal/create] Unexpected error:", err);
    return res.status(500).json({
      ok: false,
      message: "Unexpected error when creating journal entry.",
    });
  }
});

/**
 * GET /api/journal/:userId
 * Fetch all entries for a user
 */
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const entries = await db
      .select()
      .from(journal)
      .where(eq(journal.userId, userId));

    return success(res, entries, "Journal entries fetched.");
  } catch (err) {
    console.error("[journal/fetch] Unexpected error:", err);
    return res.status(500).json({
      ok: false,
      message: "Unexpected error while fetching journal entries.",
    });
  }
});

export default router;