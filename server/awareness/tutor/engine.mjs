// MMHB CONSCIOUSNESS OS v2.0 — Prompt 3.5: Discernment Tutor engine.
//
// Pure-JS module — no external runtime deps beyond Drizzle ORM and the
// existing awareness pipeline. Stateless class; one instance per process.
//
// Design contract:
//   • DRY-RUN FIRST: lesson catalog is seeded idempotently from the
//     code-frozen LESSONS array on first call to ensureSeeded().
//   • Additive-only: never updates an existing lesson row (treat seed
//     as authoritative; rerun deletes nothing).
//   • Educational only: lessons name rhetorical patterns. No clinical
//     diagnosis, no "you have X disorder" framing.
//   • Crisis-safe: scenario text is reviewed; tutor responses include
//     a /crisis link in every dashboard footer (frontend) and the API
//     response carries a `disclaimer` field.
//   • Per-user isolation: every read/write keys on userId from JWT.

import { db } from "../../db/connection.mjs";
import { sql } from "drizzle-orm";
import {
  discernmentLessons,
  discernmentUserProgress,
  discernmentAttempts,
} from "../../../shared/schema.mjs";
import { eq, and, desc } from "drizzle-orm";
import { LESSONS, BELT_LADDER, BELT_REQUIREMENTS, nextBelt, rankBelt } from "./lessons.seed.mjs";
import { logger } from "../../utils/logger.mjs";

const DISCLAIMER =
  "Educational content only. Not a clinical diagnosis. If you are in distress, please visit /crisis for immediate support.";

let _seeded = false;
let _seedAttempts = 0;
const _maxSeedAttempts = 5;

export class DiscernmentTutor {
  /**
   * Idempotent first-boot seed of the lesson catalog. Called from the
   * routes module on first request rather than at boot, so the server
   * starts even if the DB is briefly unavailable.
   */
  async ensureSeeded() {
    if (_seeded) return { ok: true, cached: true };
    if (_seedAttempts >= _maxSeedAttempts) {
      // Stop hammering the DB after repeated failures. Operators can
      // restart the process or fix data manually; in the meantime,
      // serve from whatever active rows exist.
      return { ok: false, exhausted: true, attempts: _seedAttempts };
    }
    _seedAttempts += 1;
    let inserted = 0;
    let failed = 0;
    for (const l of LESSONS) {
      try {
        const result = await db.execute(sql`
          INSERT INTO discernment_lessons
            (belt, sequence, title, category, scenario, options,
             correct_option_id, awareness_rule_id, teaching, learn_more_url, points_award)
          VALUES
            (${l.belt}, ${l.sequence}, ${l.title}, ${l.category}, ${l.scenario},
             ${JSON.stringify(l.options)}::jsonb,
             ${l.correctOptionId}, ${l.awarenessRuleId}, ${l.teaching},
             ${l.learnMoreUrl ?? null}, ${l.pointsAward})
          ON CONFLICT (belt, sequence) DO NOTHING
        `);
        if (result?.rowCount > 0 || result?.rows?.length > 0) inserted += 1;
      } catch (err) {
        failed += 1;
        logger.warn(`[discernment] seed lesson ${l.belt}/${l.sequence} failed:`, err?.message || err);
      }
    }
    // Validate the catalog actually persisted before marking seeded.
    // A transient DB hiccup that lost ALL inserts must be retryable.
    let activeCount = 0;
    try {
      const countRows = await db.execute(sql`
        SELECT count(*)::int AS n FROM discernment_lessons WHERE active = true
      `);
      activeCount = Number(countRows?.rows?.[0]?.n ?? 0);
    } catch (err) {
      logger.warn(`[discernment] catalog count check failed:`, err?.message || err);
    }
    if (activeCount >= LESSONS.length) {
      _seeded = true;
      logger.info(`[discernment] catalog seeded (${inserted} new, ${activeCount} active total)`);
      return { ok: true, inserted, total: LESSONS.length, active: activeCount };
    }
    // Do NOT cache — leave _seeded=false so the next request retries.
    logger.warn(
      `[discernment] catalog incomplete (active=${activeCount}/${LESSONS.length} new=${inserted} failed=${failed}) — will retry`
    );
    return { ok: false, inserted, total: LESSONS.length, active: activeCount, failed };
  }

  /**
   * Read-or-create progress row. Returns the canonical state for the
   * given user, defaulting to WHITE belt at zero points.
   */
  async getProgress(userId) {
    await this.ensureSeeded();
    const existing = await db
      .select()
      .from(discernmentUserProgress)
      .where(eq(discernmentUserProgress.userId, userId))
      .limit(1);
    if (existing.length > 0) return this._shapeProgress(existing[0]);

    // Lazy-create on first read.
    await db
      .insert(discernmentUserProgress)
      .values({ userId, currentBelt: "WHITE", pointsTotal: 0, lessonsPassed: 0, realWorldDetections: 0 })
      .onConflictDoNothing();
    const created = await db
      .select()
      .from(discernmentUserProgress)
      .where(eq(discernmentUserProgress.userId, userId))
      .limit(1);
    return this._shapeProgress(created[0]);
  }

  _shapeProgress(row) {
    const reqs = BELT_REQUIREMENTS[row.currentBelt] || {};
    const passedAttempts = Number(row.lessonsPassed || 0) + Math.floor(Number(row.realWorldDetections || 0) * 1.5);
    return {
      userId: row.userId,
      currentBelt: row.currentBelt,
      currentBeltRank: rankBelt(row.currentBelt),
      pointsTotal: Number(row.pointsTotal || 0),
      lessonsPassed: Number(row.lessonsPassed || 0),
      realWorldDetections: Number(row.realWorldDetections || 0),
      nextBelt: reqs.next,
      pointsToNext: reqs.pointsToNext,
      lessonsToNext: reqs.lessonsToNext,
      progressToNext: reqs.pointsToNext
        ? Math.min(100, Math.round((Number(row.pointsTotal || 0) / reqs.pointsToNext) * 100))
        : 100,
      passedTowardNext: passedAttempts,
      lastAdvancedAt: row.lastAdvancedAt,
      disclaimer: DISCLAIMER,
    };
  }

  /**
   * List lessons. If filterBelt is provided, returns just that belt;
   * otherwise returns the full catalog grouped by belt.
   */
  async listLessons({ belt = null } = {}) {
    await this.ensureSeeded();
    const rows = belt
      ? await db
          .select()
          .from(discernmentLessons)
          .where(and(eq(discernmentLessons.belt, belt), eq(discernmentLessons.active, true)))
          .orderBy(discernmentLessons.sequence)
      : await db
          .select()
          .from(discernmentLessons)
          .where(eq(discernmentLessons.active, true))
          .orderBy(discernmentLessons.belt, discernmentLessons.sequence);
    return rows.map((r) => this._shapeLessonForUser(r, /*hideAnswer=*/ true));
  }

  async getLesson(lessonId, { revealAnswer = false } = {}) {
    await this.ensureSeeded();
    const rows = await db.select().from(discernmentLessons).where(eq(discernmentLessons.id, lessonId)).limit(1);
    if (rows.length === 0) return null;
    return this._shapeLessonForUser(rows[0], !revealAnswer);
  }

  _shapeLessonForUser(row, hideAnswer) {
    const opts = Array.isArray(row.options) ? row.options : [];
    return {
      id: row.id,
      belt: row.belt,
      sequence: row.sequence,
      title: row.title,
      category: row.category,
      scenario: row.scenario,
      options: opts,
      ...(hideAnswer ? {} : { correctOptionId: row.correctOptionId }),
      teaching: hideAnswer ? null : row.teaching,
      learnMoreUrl: row.learnMoreUrl,
      pointsAward: row.pointsAward,
      awarenessRuleId: row.awarenessRuleId,
    };
  }

  /**
   * Submit an attempt. Records the attempt, updates points/passed,
   * triggers belt advancement when thresholds are met. Returns the
   * lesson with the answer revealed plus the user's new progress.
   */
  async submitAttempt({ userId, lessonId, selectedOptionId, timeMs = null }) {
    await this.ensureSeeded();
    const lessonRows = await db
      .select()
      .from(discernmentLessons)
      .where(eq(discernmentLessons.id, lessonId))
      .limit(1);
    if (lessonRows.length === 0) {
      const e = new Error("lesson_not_found");
      e.code = "lesson_not_found";
      throw e;
    }
    const lesson = lessonRows[0];
    const correct = selectedOptionId === lesson.correctOptionId;
    // The lesson's headline award is exposed unconditionally as
    // pointsAvailable so the UI can always show what was at stake.
    const lessonAward = Number(lesson.pointsAward || 10);

    // Anti-farming: a lesson only contributes points + a "lesson passed"
    // credit once per user. Repeat correct attempts on the same lesson
    // record an attempt for analytics but do NOT increment points or
    // lessons_passed. This prevents farming low-belt lessons to unlock
    // higher belts.
    let firstCorrect = false;
    if (correct) {
      const prior = await db
        .select({ id: discernmentAttempts.id })
        .from(discernmentAttempts)
        .where(and(
          eq(discernmentAttempts.userId, userId),
          eq(discernmentAttempts.lessonId, lessonId),
          eq(discernmentAttempts.correct, true),
        ))
        .limit(1);
      firstCorrect = prior.length === 0;
    }
    let credited = firstCorrect ? lessonAward : 0;

    try {
      await db.insert(discernmentAttempts).values({
        userId,
        lessonId,
        selectedOptionId: String(selectedOptionId).slice(0, 32),
        correct,
        pointsEarned: credited,
        timeMs: typeof timeMs === "number" ? Math.max(0, Math.min(600000, Math.round(timeMs))) : null,
      });
    } catch (err) {
      // Concurrency safety: the partial unique index
      // `uniq_discernment_first_correct` (user_id, lesson_id) WHERE
      // correct=true AND points_earned>0 means two simultaneous
      // first-correct submissions race. The loser hits unique violation
      // here. Treat that gracefully as a repeat-correct attempt: insert
      // a non-credited row so the analytics record persists, and
      // downgrade the response payload accordingly.
      if (err?.code === "23505" && err?.constraint === "uniq_discernment_first_correct") {
        firstCorrect = false;
        credited = 0;
        await db.insert(discernmentAttempts).values({
          userId,
          lessonId,
          selectedOptionId: String(selectedOptionId).slice(0, 32),
          correct,
          pointsEarned: 0,
          timeMs: typeof timeMs === "number" ? Math.max(0, Math.min(600000, Math.round(timeMs))) : null,
        });
      } else {
        throw err;
      }
    }

    if (firstCorrect) {
      // Atomic increment via SQL — avoids read-modify-write races on
      // simultaneous double-submit.
      await db.execute(sql`
        INSERT INTO discernment_user_progress
          (user_id, current_belt, points_total, lessons_passed, updated_at)
        VALUES (${userId}, 'WHITE', ${credited}, 1, now())
        ON CONFLICT (user_id) DO UPDATE
          SET points_total = discernment_user_progress.points_total + ${credited},
              lessons_passed = discernment_user_progress.lessons_passed + 1,
              updated_at = now()
      `);
    }

    const advanced = correct ? await this._maybeAdvance(userId) : null;
    const progress = await this.getProgress(userId);
    const revealed = this._shapeLessonForUser(lesson, /*hideAnswer=*/ false);

    return {
      ok: true,
      correct,
      // pointsEarned reflects what was ACTUALLY credited to the user's
      // running total. A repeat correct answer on the same lesson returns
      // 0 (anti-farming), even though the lesson's headline award is
      // larger. Surface the would-have-been award separately so the UI
      // can explain why no credit was given.
      pointsEarned: credited,
      pointsAvailable: lessonAward,
      alreadyPassed: correct && !firstCorrect,
      lesson: revealed,
      progress,
      advancedTo: advanced,
      disclaimer: DISCLAIMER,
    };
  }

  async _maybeAdvance(userId) {
    const cur = await db
      .select()
      .from(discernmentUserProgress)
      .where(eq(discernmentUserProgress.userId, userId))
      .limit(1);
    if (cur.length === 0) return null;
    const row = cur[0];
    const reqs = BELT_REQUIREMENTS[row.currentBelt];
    if (!reqs || !reqs.next) return null;
    const passedAttempts = Number(row.lessonsPassed || 0) + Math.floor(Number(row.realWorldDetections || 0) * 1.5);
    if (Number(row.pointsTotal) >= reqs.pointsToNext && passedAttempts >= reqs.lessonsToNext) {
      await db
        .update(discernmentUserProgress)
        .set({ currentBelt: reqs.next, lastAdvancedAt: new Date(), updatedAt: new Date() })
        .where(eq(discernmentUserProgress.userId, userId));
      logger.info(`[discernment] user ${userId} advanced ${row.currentBelt} → ${reqs.next}`);
      return reqs.next;
    }
    return null;
  }

  /**
   * Real-world detection validation: user submits text they encountered
   * (a message, a comment), the awareness pipeline scores it, and if any
   * pattern is detected with severity >= 'low', we credit the user with
   * a real-world detection (counted at 1.5× lesson weight toward belt
   * advancement). Pure read of the awareness pipeline; no mutation of
   * the awareness tables.
   */
  async validateRealWorldDetection({ userId, text }) {
    await this.ensureSeeded();
    if (typeof text !== "string" || text.trim().length < 4) {
      return { ok: false, error: "text_too_short" };
    }
    const { getPipeline } = await import("../detection/pipeline.mjs").catch(() => ({}));
    if (typeof getPipeline !== "function") {
      return { ok: false, error: "awareness_pipeline_unavailable" };
    }
    const pipeline = getPipeline();
    const result = await pipeline.detect({ text, contentSource: "import", userId, persist: false });
    const ensemble = Array.isArray(result?.ensemble) ? result.ensemble : [];
    // Credit threshold for tutor (pedagogical) is INTENTIONALLY looser
    // than the pipeline's `flagged` floor (which is tuned for auto-
    // moderation). The user manually submitted text asking "is this
    // manipulation?" — any detector hit at >=0.15 OR any pair of hits
    // counts as a real-world catch worth crediting.
    const maxConfidence = ensemble.reduce((m, e) => Math.max(m, e?.confidence ?? 0), 0);
    const credited = (ensemble.length >= 2) || (ensemble.length >= 1 && maxConfidence >= 0.15);
    const signals = ensemble.map((e) => ({
      tactic: e.tactic,
      category: e.category,
      severity: e.confidence >= 0.80 ? "high" : e.confidence >= 0.65 ? "medium" : e.confidence >= 0.40 ? "low" : "info",
    }));
    if (credited) {
      await db.execute(sql`
        INSERT INTO discernment_user_progress
          (user_id, current_belt, real_world_detections, updated_at)
        VALUES (${userId}, 'WHITE', 1, now())
        ON CONFLICT (user_id) DO UPDATE
          SET real_world_detections = discernment_user_progress.real_world_detections + 1,
              updated_at = now()
      `);
      await this._maybeAdvance(userId);
    }
    const progress = await this.getProgress(userId);
    return {
      ok: true,
      credited,
      detectedSignals: signals.map((s) => ({ tactic: s.tactic, category: s.category, severity: s.severity })),
      progress,
      disclaimer: DISCLAIMER,
    };
  }

  async recentAttempts(userId, limit = 20) {
    await this.ensureSeeded();
    const rows = await db
      .select()
      .from(discernmentAttempts)
      .where(eq(discernmentAttempts.userId, userId))
      .orderBy(desc(discernmentAttempts.createdAt))
      .limit(Math.min(Math.max(1, limit), 100));
    return rows.map((r) => ({
      id: r.id,
      lessonId: r.lessonId,
      selectedOptionId: r.selectedOptionId,
      correct: r.correct,
      pointsEarned: r.pointsEarned,
      timeMs: r.timeMs,
      createdAt: r.createdAt,
    }));
  }
}

export const tutor = new DiscernmentTutor();
export { BELT_LADDER, BELT_REQUIREMENTS, nextBelt, rankBelt, DISCLAIMER };
