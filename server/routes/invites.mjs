import express from "express";
import { db } from "../db.mjs";
import { invites, badges } from "../../shared/schema.mjs";
import { eq } from "drizzle-orm";
import { logger } from "../utils/logger.mjs";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    if (!req.dbUserId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userInvites = await db
      .select()
      .from(invites)
      .where(eq(invites.senderId, req.dbUserId));

    res.json(userInvites);
  } catch (error) {
    logger.error("Error fetching invites:", { error: error?.message || error });
    res.status(500).json({ error: "Failed to fetch invites" });
  }
});

router.post("/", async (req, res) => {
  try {
    if (!req.dbUserId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { email } = req.body;
    
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return res.status(400).json({ error: "Valid email required" });
    }

    const [newInvite] = await db
      .insert(invites)
      .values({
        senderId: req.dbUserId,
        email: email.toLowerCase().trim(),
        status: "pending"
      })
      .returning();

    const existingBadge = await db
      .select()
      .from(badges)
      .where(eq(badges.userId, req.dbUserId))
      .where(eq(badges.badgeId, "invited-friend"))
      .limit(1);

    if (existingBadge.length === 0) {
      await db.insert(badges).values({
        userId: req.dbUserId,
        badgeId: "invited-friend"
      });
    }

    res.status(201).json(newInvite);
  } catch (error) {
    logger.error("Error creating invite:", { error: error?.message || error });
    res.status(500).json({ error: "Failed to create invite" });
  }
});

export default router;
