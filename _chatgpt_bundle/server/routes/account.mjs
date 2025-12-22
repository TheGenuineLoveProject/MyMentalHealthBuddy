// server/routes/account.mjs
// Account management: password reset, account deletion, data export

import express from "express";
const router = express.Router();
import bcrypt from "bcrypt";
import crypto, { randomUUID } from "crypto";
import { eq, and, gt } from "drizzle-orm";

import { db } from "../db/connection.mjs";
import { users, passwordResetTokens, journals, moods, aiMessages } from "../db/schema.mjs";
import { success, badRequest } from "../utils/response.mjs";
import { authRateLimit, sensitiveRateLimit } from "../middleware/rateLimit.mjs";
import { requireAuth } from "../middleware/auth.mjs";
import { logAuditEvent, AuditActions } from "../utils/auditLogger.mjs";
import { logger } from "../utils/logger.mjs";
import { z } from "zod";

router.post("/onboarding", async (req, res) => {
  // TODO: require auth (session user)
  const { name, goal } = req.body || {};
  if (!goal) return res.status(400).json({ error: "Missing goal" });

  // TODO: write to DB user profile table
  return res.json({ ok: true });
});

const passwordResetRequestSchema = z.object({
  email: z.string().email("Valid email required"),
});

const passwordResetConfirmSchema = z.object({
  token: z.string().min(1, "Reset token required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const deleteAccountSchema = z.object({
  password: z.string().min(1, "Current password required for confirmation"),
});

router.post("/password-reset/request", authRateLimit, async (req, res) => {
  try {
    const parsed = passwordResetRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return badRequest(res, parsed.error.errors[0].message);
    }

    const { email } = parsed.data;

    await logAuditEvent({
      action: AuditActions.PASSWORD_RESET_REQUEST,
      metadata: { email },
      req,
    });

    const userRows = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (userRows.length === 0) {
      return success(res, null, "If an account exists with this email, a reset link will be sent.");
    }

    const user = userRows[0];

    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await db.insert(passwordResetTokens).values({
      id: randomUUID(),
      userId: user.id,
      tokenHash,
      expiresAt,
    });

    if (process.env.NODE_ENV === "development" && !process.env.REPLIT_DEPLOYMENT) {
      logger.info("Password reset token generated (dev only)", { email, token });
    }

    return success(res, null, "If an account exists with this email, a reset link will be sent.");
  } catch (error) {
    logger.error("Password reset request failed", { error: error.message, requestId: req.requestId });
    return res.status(500).json({ ok: false, message: "Server error" });
  }
});

router.post("/password-reset/confirm", authRateLimit, async (req, res) => {
  try {
    const parsed = passwordResetConfirmSchema.safeParse(req.body);
    if (!parsed.success) {
      return badRequest(res, parsed.error.errors[0].message);
    }

    const { token, password } = parsed.data;
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const tokenRows = await db
      .select()
      .from(passwordResetTokens)
      .where(
        and(
          eq(passwordResetTokens.tokenHash, tokenHash),
          gt(passwordResetTokens.expiresAt, new Date())
        )
      )
      .limit(1);

    if (tokenRows.length === 0 || tokenRows[0].usedAt) {
      return badRequest(res, "Invalid or expired reset token.");
    }

    const resetToken = tokenRows[0];

    const passwordHash = await bcrypt.hash(password, 10);

    await db
      .update(users)
      .set({ passwordHash, updatedAt: new Date() })
      .where(eq(users.id, resetToken.userId));

    await db
      .update(passwordResetTokens)
      .set({ usedAt: new Date() })
      .where(eq(passwordResetTokens.id, resetToken.id));

    await logAuditEvent({
      userId: resetToken.userId,
      action: AuditActions.PASSWORD_RESET_COMPLETE,
      req,
    });

    return success(res, null, "Password has been reset successfully.");
  } catch (error) {
    logger.error("Password reset confirm failed", { error: error.message, requestId: req.requestId });
    return res.status(500).json({ ok: false, message: "Server error" });
  }
});

router.delete("/", requireAuth, sensitiveRateLimit, async (req, res) => {
  try {
    const parsed = deleteAccountSchema.safeParse(req.body);
    if (!parsed.success) {
      return badRequest(res, parsed.error.errors[0].message);
    }

    const { password } = parsed.data;
    const userId = req.user.id;

    const userRows = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (userRows.length === 0) {
      return badRequest(res, "Account not found.");
    }

    const user = userRows[0];
    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return badRequest(res, "Incorrect password.");
    }

    await logAuditEvent({
      userId,
      action: AuditActions.ACCOUNT_DELETE,
      metadata: { email: user.email },
      req,
    });

    await db.delete(aiMessages).where(eq(aiMessages.userId, userId));
    await db.delete(journals).where(eq(journals.userId, userId));
    await db.delete(moods).where(eq(moods.userId, userId));
    await db.delete(passwordResetTokens).where(eq(passwordResetTokens.userId, userId));
    await db.delete(users).where(eq(users.id, userId));

    return success(res, null, "Account and all data deleted successfully.");
  } catch (error) {
    logger.error("Account deletion failed", { error: error.message, requestId: req.requestId });
    return res.status(500).json({ ok: false, message: "Server error" });
  }
});

router.get("/export", requireAuth, sensitiveRateLimit, async (req, res) => {
  try {
    const userId = req.user.id;

    const userRows = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    const moodRows = await db
      .select()
      .from(moods)
      .where(eq(moods.userId, userId));

    const journalRows = await db
      .select()
      .from(journals)
      .where(eq(journals.userId, userId));

    const aiMessageRows = await db
      .select()
      .from(aiMessages)
      .where(eq(aiMessages.userId, userId));

    await logAuditEvent({
      userId,
      action: AuditActions.DATA_EXPORT,
      req,
    });

    const exportData = {
      exportDate: new Date().toISOString(),
      user: userRows[0] || null,
      moods: moodRows,
      journals: journalRows,
      aiMessages: aiMessageRows,
    };

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", `attachment; filename="mymentalhealthbuddy-export-${new Date().toISOString().split("T")[0]}.json"`);

    return res.json(exportData);
  } catch (error) {
    logger.error("Data export failed", { error: error.message, requestId: req.requestId });
    return res.status(500).json({ ok: false, message: "Server error" });
  }
});

export default router;
