// MMHB CONSCIOUSNESS OS v2.0 — Prompt 3.5 Discernment Tutor public surface.
//
// Mounted at /api/discernment. Per-route auth:
//   GET  /belts                    — public (belt ladder + thresholds)
//   GET  /lessons                  — public (catalog, no answers)
//   GET  /lessons/:id              — public (single lesson, no answer)
//   GET  /progress                 — requireAuth
//   POST /attempts                 — requireAuth
//   POST /real-world               — requireAuth (validates user-supplied text)
//   GET  /attempts/recent          — requireAuth
//
// EDUCATIONAL ONLY. Every authenticated response carries a /crisis
// disclaimer; never mutate awareness/protocol tables from this surface.

import express from "express";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { requireAuth } from "../middleware/auth.mjs";
import { tutor, BELT_LADDER, BELT_REQUIREMENTS, DISCLAIMER } from "../awareness/tutor/engine.mjs";

const router = express.Router();
router.use(express.json({ limit: "32kb" }));

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => `${ipKeyGenerator(req)}:${req.user?.id || "anon"}`,
  message: { ok: false, error: "Too many discernment requests. Please slow down." },
});
router.use(limiter);

function fail(res, op, err, code = 500) {
  try { console.warn(`[discernment/${op}]`, err?.message || err); } catch {}
  return res.status(code).json({ ok: false, error: `${op} failed` });
}

router.get("/belts", (_req, res) => {
  res.json({
    ok: true,
    belts: BELT_LADDER.map((b) => ({
      belt: b,
      next: BELT_REQUIREMENTS[b]?.next ?? null,
      pointsToNext: BELT_REQUIREMENTS[b]?.pointsToNext ?? null,
      lessonsToNext: BELT_REQUIREMENTS[b]?.lessonsToNext ?? null,
    })),
    disclaimer: DISCLAIMER,
  });
});

router.get("/lessons", async (req, res) => {
  try {
    const belt = typeof req.query.belt === "string" ? req.query.belt.toUpperCase() : null;
    if (belt && !BELT_LADDER.includes(belt)) {
      return res.status(400).json({ ok: false, error: "invalid_belt" });
    }
    const lessons = await tutor.listLessons({ belt });
    res.json({ ok: true, count: lessons.length, lessons, disclaimer: DISCLAIMER });
  } catch (err) {
    return fail(res, "list-lessons", err);
  }
});

router.get("/lessons/:id", async (req, res) => {
  try {
    const lesson = await tutor.getLesson(req.params.id);
    if (!lesson) return res.status(404).json({ ok: false, error: "lesson_not_found" });
    res.json({ ok: true, lesson, disclaimer: DISCLAIMER });
  } catch (err) {
    return fail(res, "get-lesson", err);
  }
});

router.get("/progress", requireAuth, async (req, res) => {
  try {
    const progress = await tutor.getProgress(req.user.id);
    res.json({ ok: true, progress });
  } catch (err) {
    return fail(res, "progress", err);
  }
});

router.post("/attempts", requireAuth, async (req, res) => {
  try {
    const { lessonId, selectedOptionId, timeMs } = req.body || {};
    if (!lessonId || typeof lessonId !== "string") {
      return res.status(400).json({ ok: false, error: "lessonId_required" });
    }
    if (!selectedOptionId || typeof selectedOptionId !== "string") {
      return res.status(400).json({ ok: false, error: "selectedOptionId_required" });
    }
    const result = await tutor.submitAttempt({
      userId: req.user.id,
      lessonId,
      selectedOptionId,
      timeMs: typeof timeMs === "number" ? timeMs : null,
    });
    res.json(result);
  } catch (err) {
    if (err?.code === "lesson_not_found") {
      return res.status(404).json({ ok: false, error: "lesson_not_found" });
    }
    return fail(res, "submit-attempt", err);
  }
});

router.post("/real-world", requireAuth, async (req, res) => {
  try {
    const { text } = req.body || {};
    if (typeof text !== "string" || text.trim().length < 4) {
      return res.status(400).json({ ok: false, error: "text_too_short" });
    }
    if (text.length > 4000) {
      return res.status(400).json({ ok: false, error: "text_too_long", maxChars: 4000 });
    }
    const result = await tutor.validateRealWorldDetection({ userId: req.user.id, text });
    res.json(result);
  } catch (err) {
    return fail(res, "real-world-validation", err);
  }
});

router.get("/attempts/recent", requireAuth, async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const attempts = await tutor.recentAttempts(req.user.id, limit);
    res.json({ ok: true, count: attempts.length, attempts });
  } catch (err) {
    return fail(res, "recent-attempts", err);
  }
});

export default router;
