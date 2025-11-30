// server/routes/journal.mjs
import express from "express";
import { desc, eq } from "drizzle-orm";
import { db } from "../db/connection.mjs";
import { journals } from "../../shared/schema.mjs";

const router = express.Router();

// Response helpers
function success(res, data, status = 200) {
  return res.status(status).json({ ok: true, ...data });
}

function badRequest(res, message, errors = []) {
  return res.status(400).json({ ok: false, message, errors });
}

function serverError(res, message = "Server error") {
  return res.status(500).json({ ok: false, error: message });
}

// Health check
router.get("/ping", (req, res) => {
  return success(res, { route: "journal" });
});

// GET all journal entries
router.get("/", async (req, res) => {
  try {
    const entries = await db
      .select()
      .from(journals)
      .orderBy(desc(journals.createdAt))
      .limit(50);

    return success(res, { entries });
  } catch (err) {
    console.error("[journal.get error]", err);
    return serverError(res, "Failed to fetch journal entries");
  }
});

// GET journal entries by user
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const entries = await db
      .select()
      .from(journals)
      .where(eq(journals.userId, userId))
      .orderBy(desc(journals.createdAt))
      .limit(50);

    return success(res, { entries });
  } catch (err) {
    console.error("[journal.getByUser error]", err);
    return serverError(res, "Failed to fetch journal entries");
  }
});

// POST new journal entry
router.post("/", async (req, res) => {
  try {
    const { text, userId, tags, triggers } = req.body || {};
    const errors = [];

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      errors.push({ field: "text", message: "Journal entry cannot be empty" });
    } else if (text.length > 10000) {
      errors.push({ field: "text", message: "Journal entry is too long (max 10000 characters)" });
    }

    if (!userId) {
      errors.push({ field: "userId", message: "User ID is required" });
    }

    if (errors.length > 0) {
      return badRequest(res, "Validation failed", errors);
    }

    const [inserted] = await db
      .insert(journals)
      .values({ 
        text: text.trim(), 
        userId,
        tags: tags || null,
        triggers: triggers || null
      })
      .returning();

    return success(res, {
      message: "Journal entry saved successfully",
      entry: inserted,
    }, 201);
  } catch (err) {
    console.error("[journal.post error]", err);
    return serverError(res, "Failed to save journal entry");
  }
});

// DELETE journal entry
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const [deleted] = await db
      .delete(journals)
      .where(eq(journals.id, parseInt(id)))
      .returning();

    if (!deleted) {
      return badRequest(res, "Journal entry not found");
    }

    return success(res, { message: "Journal entry deleted", deleted });
  } catch (err) {
    console.error("[journal.delete error]", err);
    return serverError(res, "Failed to delete journal entry");
  }
});

export default router;
