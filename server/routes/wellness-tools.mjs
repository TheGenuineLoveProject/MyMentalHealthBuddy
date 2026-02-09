import express from "express";
import { db } from "../db/connection.mjs";
import { valuesEntries, boundaryScripts, movementLogs, coherenceEntries, reflections } from "../../shared/schema.mjs";
import { eq, and, desc } from "drizzle-orm";
import { success, badRequest } from "../utils/response.mjs";
import { requireAuth } from "../middleware/auth.mjs";
import { logger } from "../utils/logger.mjs";

const router = express.Router();

/* =====================================================
 * VALUES ENTRIES
 * =====================================================
 */

router.get("/values", requireAuth, async (req, res) => {
  try {
    const entries = await db
      .select()
      .from(valuesEntries)
      .where(eq(valuesEntries.userId, req.dbUserId))
      .orderBy(desc(valuesEntries.createdAt))
      .limit(20);
    
    return success(res, entries);
  } catch (error) {
    logger.error("Failed to fetch values entries:", error);
    return badRequest(res, "Failed to fetch values entries");
  }
});

router.post("/values", requireAuth, async (req, res) => {
  try {
    const { coreValues, reflections, priorityRanking } = req.body;
    
    const [entry] = await db
      .insert(valuesEntries)
      .values({
        userId: req.dbUserId,
        coreValues: typeof coreValues === "string" ? coreValues : JSON.stringify(coreValues),
        reflections,
        priorityRanking: typeof priorityRanking === "string" ? priorityRanking : JSON.stringify(priorityRanking),
      })
      .returning();
    
    return success(res, entry, 201);
  } catch (error) {
    logger.error("Failed to save values entry:", error);
    return badRequest(res, "Failed to save values entry");
  }
});

/* =====================================================
 * BOUNDARY SCRIPTS
 * =====================================================
 */

router.get("/boundaries", requireAuth, async (req, res) => {
  try {
    const scripts = await db
      .select()
      .from(boundaryScripts)
      .where(eq(boundaryScripts.userId, req.dbUserId))
      .orderBy(desc(boundaryScripts.createdAt))
      .limit(50);
    
    return success(res, scripts);
  } catch (error) {
    logger.error("Failed to fetch boundary scripts:", error);
    return badRequest(res, "Failed to fetch boundary scripts");
  }
});

router.post("/boundaries", requireAuth, async (req, res) => {
  try {
    const { situation, boundaryType, script, softVersion, practiceNotes } = req.body;
    
    const [entry] = await db
      .insert(boundaryScripts)
      .values({
        userId: req.dbUserId,
        situation,
        boundaryType,
        script,
        softVersion,
        practiceNotes,
      })
      .returning();
    
    return success(res, entry, 201);
  } catch (error) {
    logger.error("Failed to save boundary script:", error);
    return badRequest(res, "Failed to save boundary script");
  }
});

router.patch("/boundaries/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const [script] = await db
      .update(boundaryScripts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(boundaryScripts.id, id))
      .returning();
    
    if (!script) {
      return badRequest(res, "Script not found", 404);
    }
    return success(res, script);
  } catch (error) {
    logger.error("Failed to update boundary script:", error);
    return badRequest(res, "Failed to update boundary script");
  }
});

router.delete("/boundaries/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete(boundaryScripts).where(eq(boundaryScripts.id, id));
    return success(res, { message: "Script deleted" });
  } catch (error) {
    logger.error("Failed to delete boundary script:", error);
    return badRequest(res, "Failed to delete boundary script");
  }
});

/* =====================================================
 * MOVEMENT LOGS
 * =====================================================
 */

router.get("/movement", requireAuth, async (req, res) => {
  try {
    const logs = await db
      .select()
      .from(movementLogs)
      .where(eq(movementLogs.userId, req.dbUserId))
      .orderBy(desc(movementLogs.createdAt))
      .limit(50);
    
    return success(res, logs);
  } catch (error) {
    logger.error("Failed to fetch movement logs:", error);
    return badRequest(res, "Failed to fetch movement logs");
  }
});

router.post("/movement", requireAuth, async (req, res) => {
  try {
    const { movementType, durationSeconds, energyBefore, energyAfter, notes } = req.body;
    
    const [log] = await db
      .insert(movementLogs)
      .values({
        userId: req.dbUserId,
        movementType,
        durationSeconds,
        energyBefore,
        energyAfter,
        notes,
      })
      .returning();
    
    return success(res, log, 201);
  } catch (error) {
    logger.error("Failed to save movement log:", error);
    return badRequest(res, "Failed to save movement log");
  }
});

/* =====================================================
 * COHERENCE ENTRIES
 * =====================================================
 */

router.get("/coherence", requireAuth, async (req, res) => {
  try {
    const entries = await db
      .select()
      .from(coherenceEntries)
      .where(eq(coherenceEntries.userId, req.dbUserId))
      .orderBy(desc(coherenceEntries.createdAt))
      .limit(20);
    
    return success(res, entries);
  } catch (error) {
    logger.error("Failed to fetch coherence entries:", error);
    return badRequest(res, "Failed to fetch coherence entries");
  }
});

router.post("/coherence", requireAuth, async (req, res) => {
  try {
    const { alignmentLevel, bodyState, mindState, heartState, integrationNotes } = req.body;
    
    const [entry] = await db
      .insert(coherenceEntries)
      .values({
        userId: req.dbUserId,
        alignmentLevel,
        bodyState,
        mindState,
        heartState,
        integrationNotes,
      })
      .returning();
    
    return success(res, entry, 201);
  } catch (error) {
    logger.error("Failed to save coherence entry:", error);
    return badRequest(res, "Failed to save coherence entry");
  }
});

/* =====================================================
 * MEANING MAP
 * =====================================================
 */

router.get("/meaning-map", requireAuth, async (req, res) => {
  try {
    const entries = await db
      .select()
      .from(reflections)
      .where(and(eq(reflections.userId, req.dbUserId), eq(reflections.mode, "meaning-map")))
      .orderBy(desc(reflections.createdAt))
      .limit(10);
    
    return success(res, entries);
  } catch (error) {
    logger.error("Failed to fetch meaning map entries:", error);
    return badRequest(res, "Failed to fetch meaning map entries");
  }
});

router.get("/meaning-map/latest", requireAuth, async (req, res) => {
  try {
    const [entry] = await db
      .select()
      .from(reflections)
      .where(and(eq(reflections.userId, req.dbUserId), eq(reflections.mode, "meaning-map")))
      .orderBy(desc(reflections.createdAt))
      .limit(1);
    
    return success(res, entry || null);
  } catch (error) {
    logger.error("Failed to fetch latest meaning map:", error);
    return badRequest(res, "Failed to fetch meaning map");
  }
});

router.post("/meaning-map", requireAuth, async (req, res) => {
  try {
    const { answers, coreValues, meaningStatement } = req.body;
    
    const [entry] = await db
      .insert(reflections)
      .values({
        userId: req.dbUserId,
        text: meaningStatement || "",
        mode: "meaning-map",
        tags: JSON.stringify(coreValues || []),
        stateSnapshot: JSON.stringify({ answers: answers || {} }),
      })
      .returning();
    
    return success(res, entry, 201);
  } catch (error) {
    logger.error("Failed to save meaning map:", error);
    return badRequest(res, "Failed to save meaning map");
  }
});

/* =====================================================
 * GRIEF LETTER
 * =====================================================
 */

router.get("/grief-letter", requireAuth, async (req, res) => {
  try {
    const entries = await db
      .select()
      .from(reflections)
      .where(and(eq(reflections.userId, req.dbUserId), eq(reflections.mode, "grief-letter")))
      .orderBy(desc(reflections.createdAt))
      .limit(20);
    
    return success(res, entries);
  } catch (error) {
    logger.error("Failed to fetch grief letters:", error);
    return badRequest(res, "Failed to fetch grief letters");
  }
});

router.post("/grief-letter", requireAuth, async (req, res) => {
  try {
    const { recipient, content } = req.body;
    
    if (!content || content.trim().length < 10) {
      return badRequest(res, "Letter content is required (at least 10 characters)");
    }
    
    const [entry] = await db
      .insert(reflections)
      .values({
        userId: req.dbUserId,
        text: content.trim(),
        mode: "grief-letter",
        tags: recipient ? JSON.stringify({ recipient }) : null,
      })
      .returning();
    
    return success(res, entry, 201);
  } catch (error) {
    logger.error("Failed to save grief letter:", error);
    return badRequest(res, "Failed to save grief letter");
  }
});

router.delete("/grief-letter/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const [existing] = await db
      .select()
      .from(reflections)
      .where(and(eq(reflections.id, id), eq(reflections.userId, req.dbUserId)))
      .limit(1);
    
    if (!existing) {
      return badRequest(res, "Letter not found", 404);
    }
    
    await db.delete(reflections).where(eq(reflections.id, id));
    return success(res, { message: "Letter deleted" });
  } catch (error) {
    logger.error("Failed to delete grief letter:", error);
    return badRequest(res, "Failed to delete grief letter");
  }
});

/* =====================================================
 * WEEKLY REFLECTION
 * =====================================================
 */

router.get("/weekly-reflection", requireAuth, async (req, res) => {
  try {
    const entries = await db
      .select()
      .from(reflections)
      .where(and(eq(reflections.userId, req.dbUserId), eq(reflections.mode, "weekly-reflection")))
      .orderBy(desc(reflections.createdAt))
      .limit(12);
    
    return success(res, entries);
  } catch (error) {
    logger.error("Failed to fetch weekly reflections:", error);
    return badRequest(res, "Failed to fetch weekly reflections");
  }
});

router.post("/weekly-reflection", requireAuth, async (req, res) => {
  try {
    const { answers, weekRange } = req.body;
    
    if (!answers || Object.keys(answers).length === 0) {
      return badRequest(res, "Reflection answers are required");
    }
    
    const [entry] = await db
      .insert(reflections)
      .values({
        userId: req.dbUserId,
        text: JSON.stringify(answers),
        mode: "weekly-reflection",
        tags: weekRange ? JSON.stringify({ weekRange }) : null,
      })
      .returning();
    
    return success(res, entry, 201);
  } catch (error) {
    logger.error("Failed to save weekly reflection:", error);
    return badRequest(res, "Failed to save weekly reflection");
  }
});

/* =====================================================
 * CHALLENGE PROGRESS
 * =====================================================
 */

router.get("/challenge-progress", requireAuth, async (req, res) => {
  try {
    const entries = await db
      .select()
      .from(reflections)
      .where(and(
        eq(reflections.userId, req.dbUserId),
        eq(reflections.mode, "challenge-progress")
      ))
      .orderBy(desc(reflections.createdAt))
      .limit(1);
    
    if (entries.length > 0 && entries[0].content) {
      try {
        const progress = JSON.parse(entries[0].content);
        return success(res, { progress });
      } catch (parseErr) {
        logger.warn("Progress JSON parse fallback", { error: parseErr?.message || parseErr });
        return success(res, { progress: {} });
      }
    }
    
    return success(res, { progress: {} });
  } catch (error) {
    logger.error("Failed to fetch challenge progress:", error);
    return badRequest(res, "Failed to fetch challenge progress");
  }
});

router.post("/challenge-progress", requireAuth, async (req, res) => {
  try {
    const { progress } = req.body;
    
    if (!progress || typeof progress !== "object") {
      return badRequest(res, "Progress data is required");
    }
    
    const [entry] = await db
      .insert(reflections)
      .values({
        userId: req.dbUserId,
        mode: "challenge-progress",
        content: JSON.stringify(progress),
      })
      .returning();
    
    return success(res, entry, 201);
  } catch (error) {
    logger.error("Failed to save challenge progress:", error);
    return badRequest(res, "Failed to save challenge progress");
  }
});


// Health check endpoint for admin daily tools monitoring
router.get("/", (req, res) => {
  res.json({ ok: true, module: "wellness-tools", status: "operational", timestamp: new Date().toISOString() });
});

export default router;
