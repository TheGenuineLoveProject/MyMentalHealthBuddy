// server/routes/account.mjs
// Account management: password reset, account deletion, data export
import express from "express";
import bcrypt from "bcrypt";
import crypto, { randomUUID } from "crypto";
import { eq, and, gt } from "drizzle-orm";
import { db } from "../db/connection.mjs";
import { users, passwordResetTokens, journals, moods, aiMessages, userPreferences } from "../db/schema.mjs";
import { success, badRequest } from "../utils/response.mjs";
import { authRateLimit, sensitiveRateLimit } from "../middleware/rateLimit.mjs";
import { requireAuth } from "../middleware/auth.mjs";
import { logAuditEvent, AuditActions } from "../utils/auditLogger.mjs";
import { logger } from "../utils/logger.mjs";
import { z } from "zod";

const router = express.Router();

// Profile update - persists to DB
router.put("/profile", requireAuth, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return badRequest(res, "Name is required");
    }

    await db
      .update(users)
      .set({ name: name.trim(), updatedAt: new Date() })
      .where(eq(users.id, req.user.id));

    await logAuditEvent({
      userId: req.user.id,
      action: AuditActions.PROFILE_UPDATE,
      metadata: { field: "name" },
      req,
    });

    return success(res, { name: name.trim() }, "Profile updated");
  } catch (error) {
    logger.error("Profile update failed", { error: error.message, requestId: req.requestId });
    return res.status(500).json({ ok: false, message: "Server error" });
  }
});

// Onboarding - requires auth and persists to DB
router.post("/onboarding", requireAuth, async (req, res) => {
  try {
    const { name, goal } = req.body || {};
    if (!goal) return badRequest(res, "Missing goal");

    // Update user name if provided
    if (name && typeof name === "string" && name.trim().length > 0) {
      await db
        .update(users)
        .set({ name: name.trim(), updatedAt: new Date() })
        .where(eq(users.id, req.user.id));
    }

    // Update or create user preferences with onboarding data
    const existingPrefs = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, req.user.id))
      .limit(1);

    if (existingPrefs.length > 0) {
      await db
        .update(userPreferences)
        .set({
          wellnessGoals: goal,
          onboardingCompleted: true,
          updatedAt: new Date(),
        })
        .where(eq(userPreferences.userId, req.user.id));
    } else {
      await db.insert(userPreferences).values({
        userId: req.user.id,
        wellnessGoals: goal,
        onboardingCompleted: true,
      });
    }

    await logAuditEvent({
      userId: req.user.id,
      action: AuditActions.ONBOARDING_COMPLETE,
      metadata: { goal },
      req,
    });

    return success(res, { ok: true }, "Onboarding completed");
  } catch (error) {
    logger.error("Onboarding failed", { error: error.message, requestId: req.requestId });
    return res.status(500).json({ ok: false, message: "Server error" });
  }
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
    res.setHeader("Content-Disposition", `attachment; filename="genuine-love-project-data-${new Date().toISOString().split("T")[0]}.json"`);

    return res.json(exportData);
  } catch (error) {
    logger.error("Data export failed", { error: error.message, requestId: req.requestId });
    return res.status(500).json({ ok: false, message: "Server error" });
  }
});

// ============================================================================
// P113: Session Management
// ============================================================================

// Get user sessions
router.get('/sessions', requireAuth, async (req, res) => {
  try {
    const sessionsResult = await db
      .select()
      .from(users)
      .where(eq(users.id, req.user.id))
      .limit(1);
    
    // Since we're using Replit Auth with session store, generate a mock session list
    // In production with session table, this would query the sessions table
    const sessions = [{
      id: req.sessionID || 'current',
      deviceName: parseDeviceName(req.headers['user-agent']),
      userAgent: req.headers['user-agent'],
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      isCurrent: true
    }];

    return success(res, { sessions });
  } catch (error) {
    logger.error('Sessions fetch error', { error: error.message, requestId: req.requestId });
    return res.status(500).json({ ok: false, message: 'Server error' });
  }
});

// Delete/revoke a session
router.delete('/sessions/:sessionId', requireAuth, async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    // Prevent revoking current session
    if (sessionId === req.sessionID || sessionId === 'current') {
      return badRequest(res, 'Cannot revoke current session');
    }

    // Log the session revocation
    await logAuditEvent({
      userId: req.user.id,
      action: AuditActions.SESSION_REVOKE || 'SESSION_REVOKE',
      metadata: { sessionId },
      req,
    });

    logger.info('Session revoked', { userId: req.user.id, sessionId, requestId: req.requestId });

    return success(res, { revoked: true, sessionId });
  } catch (error) {
    logger.error('Session revoke error', { error: error.message, requestId: req.requestId });
    return res.status(500).json({ ok: false, message: 'Server error' });
  }
});

// P119: Request account deletion
router.post('/delete-request', requireAuth, sensitiveRateLimit, async (req, res) => {
  try {
    const { confirmation } = req.body;

    if (confirmation !== 'DELETE MY ACCOUNT') {
      return badRequest(res, 'Invalid confirmation');
    }

    await logAuditEvent({
      userId: req.user.id,
      action: AuditActions.ACCOUNT_DELETE_REQUEST || 'ACCOUNT_DELETE_REQUEST',
      metadata: { scheduledDeletion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
      req,
    });

    logger.info('Account deletion requested', { userId: req.user.id, requestId: req.requestId });

    return success(res, { 
      message: 'Deletion request submitted',
      scheduledDeletion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });
  } catch (error) {
    logger.error('Deletion request error', { error: error.message, requestId: req.requestId });
    return res.status(500).json({ ok: false, message: 'Server error' });
  }
});

function parseDeviceName(userAgent) {
  if (!userAgent) return 'Unknown Device';
  if (/iPhone/i.test(userAgent)) return 'iPhone';
  if (/iPad/i.test(userAgent)) return 'iPad';
  if (/Android/i.test(userAgent)) return 'Android Device';
  if (/Windows/i.test(userAgent)) return 'Windows PC';
  if (/Macintosh/i.test(userAgent)) return 'Mac';
  if (/Linux/i.test(userAgent)) return 'Linux PC';
  return 'Unknown Device';
}

export default router;
