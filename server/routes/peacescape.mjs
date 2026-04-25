// server/routes/peacescape.mjs
//
// MMHB Peace Scape — Layer 2 foundation route.
//
// Read-only stub that powers the /peacescape page. Returns the user's
// current sanctuary state (palette, accessory, theme, evolution stage)
// or a starter sanctuary for guests / new users.
//
// Strict-protected import boundary respected: this file does NOT import
// from /api/ai/chat handlers, server/ai/* (orchestrator, memory, profile,
// summary, crisis), or /start internals. It only reads aggregate counts
// from journals/moods and the optional user_avatars row to produce a
// pure projection of the user's current sanctuary.
//
// Mounted at /api/peacescape via EXTENDED_ROUTES in server/app.mjs with
// auth: "optional" so guests get a starter scape and signed-in users
// get their personalized sanctuary.

import express from "express";
import { sql } from "drizzle-orm";
import db from "../db/client.mjs";
import { logger } from "../utils/logger.mjs";

const router = express.Router();

// Evolution thresholds (journal-count gated). Pure data, no PII.
const EVOLUTION_STAGES = [
  { stage: 1, label: "Seed Garden",     unlockAt: 0,   description: "A quiet patch of meadow. Just you and Buddy beginning together." },
  { stage: 2, label: "First Bloom",     unlockAt: 3,   description: "A few wildflowers have opened. Something is taking root." },
  { stage: 3, label: "Tended Grove",    unlockAt: 10,  description: "Young trees ring the meadow. The sanctuary remembers your visits." },
  { stage: 4, label: "Mossy Sanctuary", unlockAt: 25,  description: "Soft moss, old stones, a small still pond. A place that knows you." },
  { stage: 5, label: "Living Forest",   unlockAt: 60,  description: "Tall trees, dappled light, a sense of being held by something bigger." },
  { stage: 6, label: "Inner Cathedral", unlockAt: 120, description: "A wide, luminous space — the kind that comes from years of returning." },
];

function stageForCount(count) {
  let current = EVOLUTION_STAGES[0];
  for (const s of EVOLUTION_STAGES) {
    if (count >= s.unlockAt) current = s;
  }
  const next = EVOLUTION_STAGES.find((s) => s.unlockAt > count) || null;
  return { current, next };
}

const STARTER_SCAPE = {
  palette: "sage",
  accessory: "none",
  theme: "meadow",
  customization: { unlocked: false, available: ["palette", "accessory", "theme"] },
};

async function safeQuery(label, fn, fallback) {
  try {
    return await fn();
  } catch (err) {
    logger.warn(`[peacescape] ${label} failed: ${err?.message || err}`);
    return fallback;
  }
}

// Allowlists for sanctuary customization. All values are visual-only labels —
// no PII, no behavioral data. Persisted to user_avatars (one row per user).
const ALLOWED_PALETTE  = new Set(["sage", "rose", "gold", "sky", "violet", "dawn"]);
const ALLOWED_ACCESSORY = new Set(["none", "star", "heart", "leaf", "moon", "sun", "feather"]);
const ALLOWED_THEME     = new Set(["meadow", "forest", "ocean", "dawn", "dusk", "cosmos"]);

router.patch("/state", async (req, res) => {
  const user = req.user || null;
  if (!user || !user.id) {
    return res.status(401).json({ ok: false, error: "auth_required",
      message: "Sign in to save your sanctuary." });
  }

  const body = req.body || {};
  const palette = typeof body.palette === "string" ? body.palette : null;
  const accessory = typeof body.accessory === "string" ? body.accessory : null;
  const theme = typeof body.theme === "string" ? body.theme : null;

  if (palette && !ALLOWED_PALETTE.has(palette)) {
    return res.status(400).json({ ok: false, error: "invalid_palette",
      allowed: [...ALLOWED_PALETTE] });
  }
  if (accessory && !ALLOWED_ACCESSORY.has(accessory)) {
    return res.status(400).json({ ok: false, error: "invalid_accessory",
      allowed: [...ALLOWED_ACCESSORY] });
  }
  if (theme && !ALLOWED_THEME.has(theme)) {
    return res.status(400).json({ ok: false, error: "invalid_theme",
      allowed: [...ALLOWED_THEME] });
  }
  if (!palette && !accessory && !theme) {
    return res.status(400).json({ ok: false, error: "no_fields",
      message: "Provide palette, accessory, or theme." });
  }

  try {
    const journalCount = await safeQuery(
      "journals.count.patch",
      async () => {
        const r = await db.execute(
          sql`SELECT COUNT(*)::int AS n FROM journals WHERE user_id = ${user.id}`
        );
        return Number(r?.rows?.[0]?.n ?? r?.[0]?.n ?? 0);
      },
      0,
    );
    const { current } = stageForCount(journalCount);

    // Upsert: insert with defaults, then overlay only the provided fields.
    await db.execute(sql`
      INSERT INTO user_avatars (user_id, palette, accessory, peacescape_theme,
                                evolution_stage, journal_count_at_unlock)
      VALUES (${user.id},
              ${palette || "sage"},
              ${accessory || "none"},
              ${theme || "meadow"},
              ${current.stage},
              ${journalCount})
      ON CONFLICT (user_id) DO UPDATE SET
        palette           = COALESCE(${palette}, user_avatars.palette),
        accessory         = COALESCE(${accessory}, user_avatars.accessory),
        peacescape_theme  = COALESCE(${theme}, user_avatars.peacescape_theme),
        evolution_stage   = ${current.stage},
        journal_count_at_unlock = ${journalCount},
        updated_at        = NOW()
    `);

    const r = await db.execute(
      sql`SELECT palette, accessory, peacescape_theme AS theme, evolution_stage
          FROM user_avatars WHERE user_id = ${user.id} LIMIT 1`
    );
    const row = r?.rows?.[0] || r?.[0] || null;

    return res.json({
      ok: true,
      authenticated: true,
      scape: {
        palette: String(row?.palette || "sage"),
        accessory: String(row?.accessory || "none"),
        theme: String(row?.theme || "meadow"),
        customization: { unlocked: true, available: ["palette", "accessory", "theme"] },
      },
      stage: current,
      saved: { palette, accessory, theme },
    });
  } catch (err) {
    logger.warn(`[peacescape] PATCH /state failed: ${err?.message || err}`);
    return res.status(500).json({ ok: false, error: "save_failed",
      message: "Couldn't save your sanctuary right now. Please try again in a moment." });
  }
});

router.get("/state", async (req, res) => {
  const user = req.user || null;

  // Guest / unauthenticated → starter scape, no DB hit needed.
  if (!user || !user.id) {
    return res.json({
      ok: true,
      authenticated: false,
      scape: STARTER_SCAPE,
      stage: stageForCount(0).current,
      nextStage: stageForCount(0).next,
      journalCount: 0,
      starter: true,
      tagline: "A sanctuary that grows with you. Plant your first reflection to begin.",
    });
  }

  // Signed-in: read journal count + optional avatar row in parallel.
  const [journalCount, avatarRow] = await Promise.all([
    safeQuery(
      "journals.count",
      async () => {
        const r = await db.execute(
          sql`SELECT COUNT(*)::int AS n FROM journals WHERE user_id = ${user.id}`
        );
        return Number(r?.rows?.[0]?.n ?? r?.[0]?.n ?? 0);
      },
      0,
    ),
    safeQuery(
      "user_avatars.read",
      async () => {
        const r = await db.execute(
          sql`SELECT palette, accessory, peacescape_theme AS theme, evolution_stage, journal_count_at_unlock
              FROM user_avatars WHERE user_id = ${user.id} LIMIT 1`
        );
        return r?.rows?.[0] || r?.[0] || null;
      },
      null,
    ),
  ]);

  const { current, next } = stageForCount(journalCount);

  const scape = avatarRow
    ? {
        palette: String(avatarRow.palette || "sage"),
        accessory: String(avatarRow.accessory || "none"),
        theme: String(avatarRow.theme || "meadow"),
        customization: { unlocked: true, available: ["palette", "accessory", "theme"] },
      }
    : STARTER_SCAPE;

  return res.json({
    ok: true,
    authenticated: true,
    scape,
    stage: current,
    nextStage: next,
    journalCount,
    starter: !avatarRow,
    tagline:
      journalCount === 0
        ? "Your sanctuary is ready. The first reflection plants the first seed."
        : `Your sanctuary remembers ${journalCount} ${journalCount === 1 ? "visit" : "visits"}.`,
  });
});

export default router;
