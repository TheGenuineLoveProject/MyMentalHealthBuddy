import express from "express";
import { db } from "../db/client.mjs";
import { userFavorites } from "../../shared/schema.mjs";
import { eq, and } from "drizzle-orm";
import { logger } from "../utils/logger.mjs";

const router = express.Router();

router.get("/", async (req, res) => {
  if (!req.dbUserId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const { type } = req.query;
    
    let query = db
      .select()
      .from(userFavorites)
      .where(eq(userFavorites.userId, req.dbUserId));

    if (type) {
      query = db
        .select()
        .from(userFavorites)
        .where(
          and(
            eq(userFavorites.userId, req.dbUserId),
            eq(userFavorites.itemType, type)
          )
        );
    }

    const favorites = await query;
    res.json(favorites);
  } catch (error) {
    logger.error("Error fetching favorites:", { error: error?.message || error });
    res.status(500).json({ error: "Failed to fetch favorites" });
  }
});

router.post("/", async (req, res) => {
  if (!req.dbUserId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { itemType, itemContent } = req.body;

  if (!itemType || !itemContent) {
    return res.status(400).json({ error: "Item type and content are required" });
  }

  try {
    const existing = await db
      .select()
      .from(userFavorites)
      .where(
        and(
          eq(userFavorites.userId, req.dbUserId),
          eq(userFavorites.itemType, itemType),
          eq(userFavorites.itemContent, itemContent)
        )
      );

    if (existing.length > 0) {
      return res.json({ message: "Already favorited", favorite: existing[0] });
    }

    const [favorite] = await db
      .insert(userFavorites)
      .values({
        userId: req.dbUserId,
        itemType,
        itemContent: itemContent.trim()
      })
      .returning();

    res.status(201).json(favorite);
  } catch (error) {
    logger.error("Error saving favorite:", { error: error?.message || error });
    res.status(500).json({ error: "Failed to save favorite" });
  }
});

router.delete("/:id", async (req, res) => {
  if (!req.dbUserId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { id } = req.params;

  try {
    const [deleted] = await db
      .delete(userFavorites)
      .where(
        and(
          eq(userFavorites.id, id),
          eq(userFavorites.userId, req.dbUserId)
        )
      )
      .returning();

    if (!deleted) {
      return res.status(404).json({ error: "Favorite not found" });
    }

    res.json({ message: "Favorite removed" });
  } catch (error) {
    logger.error("Error removing favorite:", { error: error?.message || error });
    res.status(500).json({ error: "Failed to remove favorite" });
  }
});

export default router;
