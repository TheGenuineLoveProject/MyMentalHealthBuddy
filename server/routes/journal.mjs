// server/routes/journal.mjs
// MyMentalHealthBuddy — Journaling API
// ESM · Drizzle ORM · Replit-safe

import express from "express";
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { desc } from "drizzle-orm";
import { db } from "../db/connection.mjs";
import { schema } from "../../shared/schema.mjs";
import { success, badRequest } from "../services/response.mjs";

export const journalEntries = pgTable("journal_entries", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

const router = express.Router();

// Small helper: standard success response
function ok(res, payload = {}, status = 200) {
  return res.status(status).json({
    success: true,
    ...payload,
  });
}

// Small helper: standard error response
function badRequest(res, message = "Validation failed.", errors = []) {
  return res.status(400).json({
    success: false,
    message,
    errors,
  });
}

/**
 * GET /api/journal
 * Returns the user’s most recent journal entries.
 */
router.get("/", async (req, res, next) => {
  try {
    const entries = await db
      .select()
      .from(journalEntries)
      .orderBy(desc(journalEntries.createdAt))
      .limit(50);

    return ok(res, { entries });
  } catch (err) {
    return next(err);
  }
});

/**
 * POST /api/journal
 * Body: { text: string }
 * Saves a new journal entry.
 */
router.post("/", async (req, res, next) => {
  try {
    const { text: rawText } = req.body || {};
    const text = typeof rawText === "string" ? rawText.trim() : "";

    const errors = [];

    if (!text) {
      errors.push({ field: "text", message: "Journal entry cannot be empty." });
    } else if (text.length > 5000) {
      errors.push({
        field: "text",
        message: "Journal entry is too long. Try splitting it into smaller pieces.",
      });
    }

    if (errors.length > 0) {
      return badRequest(
        res,
        "Please adjust your entry and try again.",
        errors
      );
    }

    const [inserted] = await db
      .insert(journalEntries)
      .values({ text })
      .returning();

    return ok(
      res,
      {
        message:
          "Your thoughts have been safely saved. Thank you for sharing your truth.",
        entry: inserted,
      },
      201
    );
  } catch (err) {
    return next(err);
  }
});

export default router;