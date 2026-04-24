// server/routes/growth-journey.mjs
//
// MMHB Growth Journey aggregator — the "metacognition mirror" endpoint.
//
// Read-only, non-diagnostic, trauma-informed. Aggregates the user's own
// activity (journals, moods) and reflects gentle observations back. Never
// writes data. Never produces clinical claims. Always safe for guests
// (returns an honest "we haven't met yet" shape with starter prompts).
//
// Mounted at /api/growth via EXTENDED_ROUTES in server/app.mjs with
// auth: "optional" so the surface works for guests AND signed-in users.
//
// This file is NOT a Buddy Engine file and does NOT import from the
// strict-protected /api/ai/chat handlers, the orchestrator, the memory
// engine, the profile engine, the summary engine, or the crisis classifier.
// It only reads aggregate counts and uses the same pure pattern as
// buildJournalSummary in server/engine/therapyIntelligence.mjs.

import express from "express";
import { sql } from "drizzle-orm";
import db from "../db/client.mjs";
import { buildJournalSummary } from "../engine/therapyIntelligence.mjs";
import { logger } from "../utils/logger.mjs";

const router = express.Router();

const METACOGNITIVE_INVITATIONS = [
  "What is one feeling you noticed today that surprised you?",
  "If you watched yourself this week from the outside, what would you say with kindness?",
  "What is one thought you had today that you don't have to believe?",
  "Where in your body have you been holding the most? What might it be asking for?",
  "What was true a month ago that isn't quite as true now?",
  "If your nervous system could speak in one sentence today, what would it say?",
  "Who were you on your hardest day this week — and what did that version of you need?",
  "What is one small kindness you could offer the part of you that is tired?",
  "Notice what is noticing right now. Just for a breath.",
  "What story have you been telling yourself this week — and is all of it yours to carry?",
];

function pickInvitations(seed = 0, count = 3) {
  const out = [];
  const base = Math.abs(Number(seed) || Math.floor(Date.now() / 86400000));
  for (let i = 0; i < count; i++) {
    out.push(METACOGNITIVE_INVITATIONS[(base + i) % METACOGNITIVE_INVITATIONS.length]);
  }
  return out;
}

function daysBetween(a, b) {
  const ms = Math.max(0, b.getTime() - a.getTime());
  return Math.floor(ms / 86400000);
}

function tenureCopy(days) {
  if (days <= 0) return "We just met. There's no rush.";
  if (days === 1) return "We've been together 1 day.";
  if (days < 7) return `We've been together ${days} days.`;
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return `We've been together ${days} days — about ${weeks} ${weeks === 1 ? "week" : "weeks"}.`;
  }
  if (days < 365) {
    const months = Math.floor(days / 30);
    return `We've been together ${days} days — about ${months} ${months === 1 ? "month" : "months"}.`;
  }
  const years = Math.floor(days / 365);
  return `We've been together ${days} days — about ${years} ${years === 1 ? "year" : "years"}.`;
}

async function safeQuery(query, fallback) {
  try {
    const result = await db.execute(query);
    return result.rows || [];
  } catch (err) {
    logger?.warn?.("growth-journey query skipped", { error: err?.message || String(err) });
    return fallback;
  }
}

/**
 * GET /api/growth/journey
 *
 * Returns the metacognition-mirror payload for the current viewer.
 *
 * Shape:
 * {
 *   ok: true,
 *   tenure: { days, since, copy },
 *   activity: { journalCount, moodCount, distinctEmotions },
 *   reflection: { dominantFeelings, themes, observation },
 *   milestones: Array<{ id, name, description, unlocked, progress, target }>,
 *   invitations: string[3],
 *   privacy: { signedIn, consent },
 * }
 *
 * Guest viewers get the same shape with zeros and starter copy.
 */
router.get("/journey", async (req, res) => {
  try {
    const user = req.user || null;
    const userId = user?.id || null;
    const now = new Date();

    let tenureDays = 0;
    let tenureSince = null;

    let journalRows = [];
    let moodRows = [];

    if (userId) {
      const userRows = await safeQuery(
        sql`SELECT created_at FROM users WHERE id = ${userId} LIMIT 1`,
        []
      );
      const createdAt = userRows[0]?.created_at;
      if (createdAt) {
        const since = new Date(createdAt);
        if (!Number.isNaN(since.getTime())) {
          tenureDays = daysBetween(since, now);
          tenureSince = since.toISOString();
        }
      }

      journalRows = await safeQuery(
        sql`SELECT text, created_at FROM journals
            WHERE user_id = ${userId}
            ORDER BY created_at DESC
            LIMIT 200`,
        []
      );
      moodRows = await safeQuery(
        sql`SELECT rating, emotion, created_at FROM moods
            WHERE user_id = ${userId}
            ORDER BY created_at DESC
            LIMIT 200`,
        []
      );
    }

    // Run the existing pure summarizer on the user's journal text.
    // We only pass the text content — never raw rows, never PII.
    const journalEntries = journalRows.map((r) => String(r.text || "")).filter(Boolean);
    const summary = buildJournalSummary({ entries: journalEntries });

    const distinctEmotions = new Set();
    for (const f of summary.dominantFeelings || []) {
      if (f?.feeling) distinctEmotions.add(String(f.feeling).toLowerCase());
    }
    for (const m of moodRows) {
      const e = m?.emotion || m?.rating;
      if (e) distinctEmotions.add(String(e).toLowerCase());
    }

    const activity = {
      journalCount: journalEntries.length,
      moodCount: moodRows.length,
      distinctEmotions: distinctEmotions.size,
    };

    // Dynamic milestone unlocks — gentle, achievable, never punitive.
    const milestones = [
      {
        id: "first-step",
        name: "First step taken",
        description: "Capture your first reflection — even one sentence.",
        target: 1,
        progress: Math.min(activity.journalCount, 1),
      },
      {
        id: "noticing-pattern",
        name: "Patterns noticed",
        description: "Five reflections begin to reveal a shape.",
        target: 5,
        progress: Math.min(activity.journalCount, 5),
      },
      {
        id: "vocabulary-grows",
        name: "Vocabulary grows",
        description: "Notice three distinct emotional textures.",
        target: 3,
        progress: Math.min(activity.distinctEmotions, 3),
      },
      {
        id: "two-weeks",
        name: "Two weeks together",
        description: "Time itself is part of the practice.",
        target: 14,
        progress: Math.min(tenureDays, 14),
      },
      {
        id: "deep-knowing",
        name: "Deep knowing",
        description: "Twenty reflections — a quiet library of self.",
        target: 20,
        progress: Math.min(activity.journalCount, 20),
      },
      {
        id: "season-together",
        name: "A season together",
        description: "Ninety days of forever-companion presence.",
        target: 90,
        progress: Math.min(tenureDays, 90),
      },
    ].map((m) => ({
      ...m,
      unlocked: m.progress >= m.target,
    }));

    const payload = {
      ok: true,
      tenure: {
        days: tenureDays,
        since: tenureSince,
        copy: tenureCopy(tenureDays),
      },
      activity,
      reflection: {
        dominantFeelings: summary.dominantFeelings || [],
        themes: summary.themes || [],
        observation: summary.observation || "",
      },
      milestones,
      invitations: pickInvitations(activity.journalCount + tenureDays, 3),
      privacy: {
        signedIn: Boolean(userId),
        consent: "This page reflects your own data back to you. It is not a diagnosis.",
      },
      version: "1.0.0",
    };

    res.set("Cache-Control", "private, max-age=30");
    return res.json(payload);
  } catch (err) {
    logger?.error?.("growth-journey unexpected", { error: err?.message || String(err) });
    return res.status(500).json({ ok: false, error: "Failed to build growth journey" });
  }
});

export default router;
