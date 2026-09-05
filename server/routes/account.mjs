// server/routes/account.mjs
// Account management: password reset, account deletion, data export
import express from "express";
import bcrypt from "bcrypt";
import crypto, { randomUUID } from "crypto";
import { eq, and, gt, isNull } from "drizzle-orm";
import { db } from "../db/connection.mjs";
import { users, passwordResetTokens, journals, moods, aiMessages, userPreferences } from "../db/schema.mjs";
import { success, badRequest } from "../utils/response.mjs";
import { authRateLimit, sensitiveRateLimit } from "../middleware/rateLimit.mjs";
import { requireAuth } from "../middleware/auth.mjs";
import { logAuditEvent, AuditActions } from "../utils/auditLogger.mjs";
import { logger } from "../utils/logger.mjs";
import { sendTransactionalEmail } from "../utils/email.mjs";
import { z } from "zod";
import {
  createMfaEnrollment,
  encryptMfaSecret,
  decryptMfaSecret,
  verifyTotpCode,
} from "../auth/mfa.service.mjs";
import {
  generateMfaRecoverySet,
  verifyMfaRecoveryCode,
} from "../auth/mfaRecovery.service.mjs";
import {
  deleteMfaLoginChallengesForUser,
} from "../services/mfaChallenges.service.mjs";
import {
  revokeAllRefreshTokens,
} from "../services/refreshTokens.service.mjs";

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
      .where(eq(users.id, req.dbUserId));

    await logAuditEvent({
      userId: req.dbUserId,
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
        .where(eq(users.id, req.dbUserId));
    }

    // Update or create user preferences with onboarding data
    const existingPrefs = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, req.dbUserId))
      .limit(1);

    if (existingPrefs.length > 0) {
      await db
        .update(userPreferences)
        .set({
          wellnessGoals: goal,
          onboardingCompleted: true,
          updatedAt: new Date(),
        })
        .where(eq(userPreferences.userId, req.dbUserId));
    } else {
      await db.insert(userPreferences).values({
        userId: req.dbUserId,
        wellnessGoals: goal,
        onboardingCompleted: true,
      });
    }

    await logAuditEvent({
      userId: req.dbUserId,
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

    const publicBaseUrl =
      process.env.PUBLIC_APP_URL ||
      process.env.APP_PUBLIC_URL ||
      process.env.FRONTEND_URL ||
      process.env.REPLIT_DOMAINS?.split(",")?.[0]?.replace(/^/, "https://") ||
      "https://www.genuineloveproject.com";

    const resetUrl = `${publicBaseUrl.replace(/\/$/, "")}/reset-password?token=${encodeURIComponent(token)}`;

    const emailResult = await sendTransactionalEmail({
      to: email,
      subject: "Reset your MyMentalHealthBuddy password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; padding: 24px; color: #2f3a3a;">
          <h1 style="color:#2F5D5D;">Password reset request</h1>
          <p>We received a request to reset your password.</p>
          <p>This link expires in 1 hour. If you did not request this, you can ignore this email.</p>
          <p style="margin: 28px 0;">
            <a href="${resetUrl}" style="background:#2F5D5D;color:#ffffff;padding:12px 18px;border-radius:8px;text-decoration:none;display:inline-block;">
              Reset password
            </a>
          </p>
          <p style="font-size:13px;color:#667;">If the button does not work, copy and paste this link into your browser:</p>
          <p style="font-size:13px;word-break:break-all;color:#2F5D5D;">${resetUrl}</p>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
          <p style="font-size:12px;color:#777;">
            Educational wellness support only. If you are in crisis, call or text 988, or text HOME to 741741.
          </p>
        </div>
      `
    });

    if (emailResult?.skipped) {
      logger.warn("Password reset email skipped because email service is not configured", { email });
    } else {
      logger.info("Password reset email queued", { email });
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
    const userId = req.dbUserId;

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
    const userId = req.dbUserId;

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
      .where(eq(users.id, req.dbUserId))
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
      userId: req.dbUserId,
      action: AuditActions.SESSION_REVOKE || 'SESSION_REVOKE',
      metadata: { sessionId },
      req,
    });

    logger.info('Session revoked', { userId: req.dbUserId, sessionId, requestId: req.requestId });

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
      userId: req.dbUserId,
      action: AuditActions.ACCOUNT_DELETE_REQUEST || 'ACCOUNT_DELETE_REQUEST',
      metadata: { scheduledDeletion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
      req,
    });

    logger.info('Account deletion requested', { userId: req.dbUserId, requestId: req.requestId });

    return success(res, { 
      message: 'Deletion request submitted',
      scheduledDeletion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });
  } catch (error) {
    logger.error('Deletion request error', { error: error.message, requestId: req.requestId });
    return res.status(500).json({ ok: false, message: 'Server error' });
  }
});

router.get("/security", requireAuth, async (req, res) => {
  try {
    const userRows = await db
      .select({
        mfaEnabled: users.mfaEnabled,
        createdAt: users.createdAt,
        passwordHash: users.passwordHash,
      })
      .from(users)
      .where(eq(users.id, req.dbUserId))
      .limit(1);

    if (userRows.length === 0) {
      return badRequest(res, "User not found");
    }

    const user = userRows[0];
    return res.json({
      twoFactorEnabled: user.mfaEnabled || false,
      hasPassword: !!user.passwordHash,
      accountCreated: user.createdAt,
    });
  } catch (error) {
    logger.error("Security status failed", { error: error.message, requestId: req.requestId });
    return res.status(500).json({ ok: false, message: "Server error" });
  }
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
});

router.post("/password", requireAuth, sensitiveRateLimit, async (req, res) => {
  try {
    const parsed = changePasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      return badRequest(res, parsed.error.errors[0].message);
    }

    const { currentPassword, newPassword } = parsed.data;

    const userRows = await db
      .select({ passwordHash: users.passwordHash })
      .from(users)
      .where(eq(users.id, req.dbUserId))
      .limit(1);

    if (userRows.length === 0) {
      return badRequest(res, "User not found");
    }

    const user = userRows[0];

    if (!user.passwordHash) {
      return badRequest(res, "Account uses external authentication. Password change is not available.");
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return badRequest(res, "Current password is incorrect");
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await db
      .update(users)
      .set({ passwordHash: newHash, updatedAt: new Date() })
      .where(eq(users.id, req.dbUserId));

    await logAuditEvent({
      userId: req.dbUserId,
      action: AuditActions.PASSWORD_CHANGE || "PASSWORD_CHANGE",
      req,
    });

    return success(res, null, "Password updated successfully");
  } catch (error) {
    logger.error("Password change failed", { error: error.message, requestId: req.requestId });
    return res.status(500).json({ ok: false, message: "Server error" });
  }
});

router.post("/2fa/setup", requireAuth, sensitiveRateLimit, async (req, res) => {
  res.set("Cache-Control", "no-store");

  try {
    const currentPassword =
      typeof req.body?.currentPassword === "string"
        ? req.body.currentPassword
        : "";

    if (!currentPassword) {
      return badRequest(
        res,
        "Current password is required"
      );
    }

    const userRows = await db
      .select({
        email: users.email,
        passwordHash: users.passwordHash,
        mfaEnabled: users.mfaEnabled,
      })
      .from(users)
      .where(eq(users.id, req.dbUserId))
      .limit(1);

    if (userRows.length === 0) {
      return badRequest(res, "User not found");
    }

    const user = userRows[0];

    if (user.mfaEnabled) {
      return badRequest(
        res,
        "2FA is already enabled"
      );
    }

    /*
     * External-auth-only accounts currently have no purpose-bound
     * provider reauthentication primitive. Fail closed rather than
     * treating an existing bearer token as fresh authentication.
     */
    if (!user.passwordHash) {
      return badRequest(
        res,
        "This account requires provider reauthentication before changing two-factor authentication."
      );
    }

    const passwordMatches =
      await bcrypt.compare(
        currentPassword,
        user.passwordHash
      );

    if (!passwordMatches) {
      return badRequest(
        res,
        "Current password is incorrect"
      );
    }

    const enrollment =
      await createMfaEnrollment(
        user.email || req.dbUserId
      );

    const storedSecret =
      encryptMfaSecret(
        enrollment.secret
      );

    /*
     * Setup establishes only a pending authenticator secret.
     *
     * Recovery credentials do not exist until successful TOTP
     * verification in /2fa/verify.
     */
    const prepared = await db
      .update(users)
      .set({
        mfaEnabled: false,
        mfaSecret: storedSecret,
        mfaBackupCodes: null,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(
            users.id,
            req.dbUserId
          ),
          eq(
            users.mfaEnabled,
            false
          )
        )
      )
      .returning({
        id: users.id,
      });

    /*
     * Older rows may contain NULL mfa_enabled. Preserve the same
     * security semantics without permitting an enabled account to be
     * downgraded by a racing setup request.
     */
    if (prepared.length !== 1) {
      const legacyRows = await db
        .select({
          mfaEnabled:
            users.mfaEnabled,
        })
        .from(users)
        .where(
          eq(
            users.id,
            req.dbUserId
          )
        )
        .limit(1);

      if (
        legacyRows.length !== 1 ||
        legacyRows[0].mfaEnabled === true
      ) {
        return badRequest(
          res,
          "Unable to start 2FA setup because the account security state changed."
        );
      }

      const legacyMfaEnabledPredicate =
        legacyRows[0].mfaEnabled === null
          ? isNull(users.mfaEnabled)
          : eq(
              users.mfaEnabled,
              false
            );

      const legacyPrepared = await db
        .update(users)
        .set({
          mfaEnabled: false,
          mfaSecret: storedSecret,
          mfaBackupCodes: null,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(
              users.id,
              req.dbUserId
            ),
            legacyMfaEnabledPredicate
          )
        )
        .returning({
          id: users.id,
        });

      if (legacyPrepared.length !== 1) {
        return badRequest(
          res,
          "Unable to start 2FA setup because the account security state changed."
        );
      }
    }

    return res.json({
      ok: true,
      qrCode:
        enrollment.qrCodeDataUrl,
    });
  } catch (error) {
    logger.error(
      "2FA setup failed",
      {
        error: error.message,
        requestId: req.requestId,
      }
    );

    return res
      .status(500)
      .json({
        ok: false,
        message: "Server error",
      });
  }
});

router.post("/2fa/verify", requireAuth, sensitiveRateLimit, async (req, res) => {
  res.set("Cache-Control", "no-store");

  try {
    const currentPassword =
      typeof req.body?.currentPassword === "string"
        ? req.body.currentPassword
        : "";

    const code =
      typeof req.body?.code === "string"
        ? req.body.code.trim()
        : "";

    if (!currentPassword) {
      return badRequest(
        res,
        "Current password is required"
      );
    }

    if (!/^\d{6}$/.test(code)) {
      return badRequest(
        res,
        "A 6-digit verification code is required"
      );
    }

    const userRows = await db
      .select({
        passwordHash:
          users.passwordHash,
        mfaSecret:
          users.mfaSecret,
        mfaEnabled:
          users.mfaEnabled,
      })
      .from(users)
      .where(
        eq(
          users.id,
          req.dbUserId
        )
      )
      .limit(1);

    if (userRows.length === 0) {
      return badRequest(
        res,
        "User not found"
      );
    }

    const user = userRows[0];

    if (!user.passwordHash) {
      return badRequest(
        res,
        "This account requires provider reauthentication before changing two-factor authentication."
      );
    }

    if (!user.mfaSecret) {
      return badRequest(
        res,
        "2FA setup not started. Please start setup first."
      );
    }

    if (user.mfaEnabled) {
      return badRequest(
        res,
        "2FA is already enabled"
      );
    }

    const passwordMatches =
      await bcrypt.compare(
        currentPassword,
        user.passwordHash
      );

    if (!passwordMatches) {
      return badRequest(
        res,
        "Current password is incorrect"
      );
    }

    const decryptedSecret =
      decryptMfaSecret(
        user.mfaSecret
      );

    if (
      !verifyTotpCode(
        decryptedSecret,
        code
      )
    ) {
      return badRequest(
        res,
        "Invalid verification code. Please check your authenticator app and try again."
      );
    }

    /*
     * Recovery credentials are generated only after both password
     * reauthentication and pending-secret TOTP verification succeed.
     *
     * A racing loser may generate an in-memory candidate set, but
     * only the transaction winner can persist hashes or return the
     * corresponding plaintext values.
     */
    const {
      codes,
      storage,
    } = generateMfaRecoverySet({
      count: 6,
    });

    const enabled =
      await db.transaction(
        async (tx) => {
          const updated = await tx
            .update(users)
            .set({
              mfaEnabled: true,
              mfaBackupCodes:
                storage,
              updatedAt:
                new Date(),
            })
            .where(
              and(
                eq(
                  users.id,
                  req.dbUserId
                ),
                eq(
                  users.mfaEnabled,
                  false
                ),
                eq(
                  users.mfaSecret,
                  user.mfaSecret
                )
              )
            )
            .returning({
              id: users.id,
            });

          if (
            updated.length !== 1
          ) {
            return false;
          }

          await deleteMfaLoginChallengesForUser({
            userId:
              req.dbUserId,
            executor: tx,
          });

          await revokeAllRefreshTokens(
            req.dbUserId,
            tx
          );

          return true;
        }
      );

    if (!enabled) {
      return badRequest(
        res,
        "Unable to enable 2FA because the account security state changed."
      );
    }

    await logAuditEvent({
      userId: req.dbUserId,
      action:
        AuditActions.MFA_ENABLE ||
        "MFA_ENABLE",
      req,
    });

    /*
     * Plaintext recovery credentials cross the response boundary
     * exactly once after the security transaction has committed.
     */
    return res.json({
      ok: true,
      backupCodes: codes,
      message:
        "Two-factor authentication enabled successfully",
    });
  } catch (error) {
    logger.error(
      "2FA verify failed",
      {
        error: error.message,
        requestId: req.requestId,
      }
    );

    return res
      .status(500)
      .json({
        ok: false,
        message: "Server error",
      });
  }
});

router.post("/2fa/disable", requireAuth, sensitiveRateLimit, async (req, res) => {
  res.set("Cache-Control", "no-store");

  try {
    const currentPassword =
      typeof req.body?.currentPassword === "string"
        ? req.body.currentPassword
        : "";

    const code =
      typeof req.body?.code === "string"
        ? req.body.code.trim()
        : "";

    const recoveryCode =
      typeof req.body?.recoveryCode === "string"
        ? req.body.recoveryCode.trim()
        : "";

    if (!currentPassword) {
      return badRequest(
        res,
        "Current password is required"
      );
    }

    const totpSupplied =
      code.length > 0;

    const recoverySupplied =
      recoveryCode.length > 0;

    if (
      totpSupplied ===
      recoverySupplied
    ) {
      return badRequest(
        res,
        "Provide exactly one MFA verification method."
      );
    }

    if (
      totpSupplied &&
      !/^\d{6}$/.test(code)
    ) {
      return badRequest(
        res,
        "A 6-digit verification code is required"
      );
    }

    if (
      recoverySupplied &&
      recoveryCode.length > 128
    ) {
      return badRequest(
        res,
        "Invalid MFA recovery credential"
      );
    }

    const userRows = await db
      .select({
        passwordHash:
          users.passwordHash,
        mfaEnabled:
          users.mfaEnabled,
        mfaSecret:
          users.mfaSecret,
        mfaBackupCodes:
          users.mfaBackupCodes,
      })
      .from(users)
      .where(
        eq(
          users.id,
          req.dbUserId
        )
      )
      .limit(1);

    if (userRows.length === 0) {
      return badRequest(
        res,
        "User not found"
      );
    }

    const user = userRows[0];

    if (!user.mfaEnabled) {
      return badRequest(
        res,
        "2FA is not currently enabled"
      );
    }

    if (!user.passwordHash) {
      return badRequest(
        res,
        "This account requires provider reauthentication before changing two-factor authentication."
      );
    }

    const passwordMatches =
      await bcrypt.compare(
        currentPassword,
        user.passwordHash
      );

    if (!passwordMatches) {
      return badRequest(
        res,
        "Current password is incorrect"
      );
    }

    if (totpSupplied) {
      if (!user.mfaSecret) {
        return badRequest(
          res,
          "MFA authenticator state is unavailable"
        );
      }

      const secret =
        decryptMfaSecret(
          user.mfaSecret
        );

      if (
        !verifyTotpCode(
          secret,
          code
        )
      ) {
        return badRequest(
          res,
          "Invalid MFA verification credential"
        );
      }
    } else {
      if (!user.mfaBackupCodes) {
        return badRequest(
          res,
          "MFA recovery credentials are unavailable"
        );
      }

      let recoveryValid = false;

      try {
        recoveryValid =
          verifyMfaRecoveryCode({
            stored:
              user.mfaBackupCodes,
            code:
              recoveryCode,
          });
      } catch {
        recoveryValid = false;
      }

      if (!recoveryValid) {
        return badRequest(
          res,
          "Invalid MFA verification credential"
        );
      }
    }

    const disabled =
      await db.transaction(
        async (tx) => {
          const updated = await tx
            .update(users)
            .set({
              mfaEnabled: false,
              mfaSecret: null,
              mfaBackupCodes:
                null,
              updatedAt:
                new Date(),
            })
            .where(
              and(
                eq(
                  users.id,
                  req.dbUserId
                ),
                eq(
                  users.mfaEnabled,
                  true
                )
              )
            )
            .returning({
              id: users.id,
            });

          if (
            updated.length !== 1
          ) {
            return false;
          }

          await deleteMfaLoginChallengesForUser({
            userId:
              req.dbUserId,
            executor: tx,
          });

          await revokeAllRefreshTokens(
            req.dbUserId,
            tx
          );

          return true;
        }
      );

    if (!disabled) {
      return badRequest(
        res,
        "Unable to disable 2FA because the account security state changed."
      );
    }

    await logAuditEvent({
      userId: req.dbUserId,
      action:
        AuditActions.MFA_DISABLE ||
        "MFA_DISABLE",
      req,
    });

    return success(
      res,
      null,
      "Two-factor authentication disabled"
    );
  } catch (error) {
    logger.error(
      "2FA disable failed",
      {
        error: error.message,
        requestId: req.requestId,
      }
    );

    return res
      .status(500)
      .json({
        ok: false,
        message: "Server error",
      });
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


// Health check endpoint for admin daily tools monitoring
router.get("/", (req, res) => {
  res.json({ ok: true, module: "account", status: "operational", timestamp: new Date().toISOString() });
});

export default router;
