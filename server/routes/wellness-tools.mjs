import express from "express";
import { db } from "../db/connection.mjs";
import { valuesEntries, boundaryScripts, movementLogs, coherenceEntries } from "../../shared/schema.mjs";
import { eq, desc } from "drizzle-orm";
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
      .where(eq(valuesEntries.userId, req.user.id))
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
        userId: req.user.id,
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
      .where(eq(boundaryScripts.userId, req.user.id))
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
        userId: req.user.id,
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
      .where(eq(movementLogs.userId, req.user.id))
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
        userId: req.user.id,
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
      .where(eq(coherenceEntries.userId, req.user.id))
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
        userId: req.user.id,
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

export default router;
