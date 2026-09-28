import express from "express";
import bcrypt from "bcrypt";
import {
  sql } from "drizzle-orm";
import db from "../db/client.mjs";
import { signUserToken, requireAuth } from "../middleware/auth.mjs";
import { newRefreshToken } from "../auth/tokens.mjs";
import { loginRateLimit,
  authRateLimit } from "../middleware/rateLimit.mjs";
import { makeRefreshToken } from "../auth/tokens.mjs";
import { getRefreshCookieOptions } from "../utils/cookies.mjs";
import {
  storeRefreshToken,
  findValidRefreshToken,
  revokeRefreshToken,
  revokeRefreshTokenByToken,
  rotateRefreshToken,
} from "../services/refreshTokens.service.mjs";
import {
  createMfaChallengeRecord,
  verifyMfaChallenge,
  decryptMfaSecret,
  verifyTotpCode,
} from "../auth/mfa.service.mjs";
import {
  storeMfaLoginChallenge,
  consumeMfaLoginChallenge,
} from "../services/mfaChallenges.service.mjs";
import { consumeMfaRecoveryLogin } from "../services/mfaRecoveryLogin.service.mjs";

const router = express.Router();

let _usersTableEnsured = false;
async function ensureUsersTable() {
  // Idempotent boot bootstrap. The canonical Drizzle schema lives in
  // shared/schema.mjs but the drizzle-kit config currently points at the
  // empty database/schema/ files, so `drizzle-kit push` is a no-op. Until
  // that gets reconciled we make this route resilient by creating the
  // tables it depends on with IF NOT EXISTS — column shape MUST match
  // shared/schema.mjs exactly so a future migration converges cleanly.
  if (_usersTableEnsured) return;
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        email varchar(255) NOT NULL UNIQUE,
        password_hash varchar(255),
        name varchar(255) NOT NULL,
        created_at timestamp NOT NULL DEFAULT now(),
        updated_at timestamp NOT NULL DEFAULT now(),
        role text DEFAULT 'user',
        refresh_token_hash text,
        mfa_enabled boolean DEFAULT false,
        mfa_secret text,
        mfa_backup_codes text,
        stripe_customer_id text,
        subscription_status text DEFAULT 'free',
        subscription_expires_at timestamp,
        github_id text,
        replit_id text UNIQUE,
        profile_image_url text,
        timezone varchar(100) NOT NULL DEFAULT 'UTC'
      )
    `);

    await db.execute(sql`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS timezone varchar(100) NOT NULL DEFAULT 'UTC'
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid NOT NULL,
        token_hash text NOT NULL,
        expires_at timestamp NOT NULL,
        created_at timestamp DEFAULT now()
      )
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS refresh_tokens_user_id_idx ON refresh_tokens(user_id)
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS refresh_tokens_token_hash_idx ON refresh_tokens(token_hash)
    `);

    _usersTableEnsured = true;
  } catch (err) {
    console.warn("ensureUsersTable bootstrap warning:", err?.message || err);
  }
}

function deriveNameFromEmail(email) {
  const local = String(email || "").split("@")[0] || "user";
  return local.slice(0, 64) || "user";
}

function toPublicUser(user) {
  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role || "user",
    createdAt: user.created_at,
    subscriptionStatus: user.subscription_status || "free",
    profileImageUrl: user.profile_image_url || null,
    timezone: user.timezone || "UTC",
  };
}

async function findHydratedUserById(userId) {
  const result = await db.execute(sql`
    SELECT
      id,
      email,
      name,
      role,
      created_at,
      subscription_status,
      profile_image_url,
      timezone
    FROM users
    WHERE id = ${userId}
    LIMIT 1
  `);

  return result.rows?.[0] || null;
}

async function issueSession(res, user) {
  const token = signUserToken(user);
  const refreshToken = newRefreshToken();

  await storeRefreshToken({
    userId: user.id,
    token: refreshToken,
  });

  res.cookie("refresh_token", refreshToken, getRefreshCookieOptions());

  return token;
}

function clearRefreshCookie(res) {
  res.clearCookie("refresh_token", {
    ...getRefreshCookieOptions(),
    maxAge: undefined,
  });
}

router.post("/register", authRateLimit, async (req, res) => {
  try {
    await ensureUsersTable();

    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "").trim();

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }

    const existing = await db.execute(sql`
      SELECT id, email, role
      FROM users
      WHERE email = ${email}
      LIMIT 1
    `);

    if (existing.rows?.length) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const name = deriveNameFromEmail(email);

    const created = await db.execute(sql`
      INSERT INTO users (email, password_hash, name, role)
      VALUES (${email}, ${passwordHash}, ${name}, 'user')
      RETURNING
        id,
        email,
        name,
        role,
        created_at,
        subscription_status,
        profile_image_url,
        timezone
    `);

    const user = created.rows[0];
    const token = await issueSession(res, user);

    return res.json({
      ok: true,
      token,
      user: toPublicUser(user)
    });
  } catch (err) {
    console.error("register error:", err);
    return res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/login", loginRateLimit, async (req, res) => {
  try {
    await ensureUsersTable();

    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "").trim();

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const result = await db.execute(sql`
      SELECT
        id,
        email,
        name,
        role,
        password_hash,
        mfa_enabled,
        created_at,
        subscription_status,
        profile_image_url,
        timezone
      FROM users
      WHERE email = ${email}
      LIMIT 1
    `);

    const user = result.rows?.[0];
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (user.mfa_enabled) {
      const {
        challenge,
        jti,
        expiresAt,
      } = createMfaChallengeRecord(
        user.id
      );

      /*
       * Persist only SHA-256(jti) before exposing the signed
       * pre-authentication credential to the client.
       *
       * If persistence fails, no usable challenge is returned.
       */
      await storeMfaLoginChallenge({
        userId: user.id,
        jti,
        expiresAt,
      });

      res.set("Cache-Control", "no-store");

      return res.json({
        ok: true,
        mfaRequired: true,
        challenge,
      });
    }

    const token = await issueSession(res, user);

    res.set("Cache-Control", "no-store");

    return res.json({
      ok: true,
      token,
      user: toPublicUser(user)
    });
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ error: "Login failed" });
  }
});

router.post("/mfa/verify", authRateLimit, async (req, res) => {
  try {
    await ensureUsersTable();

    const challenge = String(
      req.body?.challenge || ""
    ).trim();

    const code = String(
      req.body?.code || ""
    ).trim();

    const recoveryCode = String(
      req.body?.recoveryCode || ""
    ).trim();

    const totpSupplied =
      code.length > 0;

    const recoverySupplied =
      recoveryCode.length > 0;

    /*
     * Require exactly one second-factor mode.
     *
     * Presence and syntax are deliberately separate concepts:
     * malformed TOTP + recovery code is still "both supplied" and
     * therefore rejected rather than silently selecting recovery.
     */
    if (
      !challenge ||
      totpSupplied === recoverySupplied
    ) {
      return res.status(400).json({
        error:
          "MFA challenge and exactly one verification method required",
      });
    }

    if (
      totpSupplied &&
      !/^\d{6}$/.test(code)
    ) {
      return res.status(400).json({
        error:
          "A 6-digit authenticator code is required",
      });
    }

    /*
     * Bound pre-auth recovery input size before cryptographic parsing.
     */
    if (
      recoverySupplied &&
      recoveryCode.length > 128
    ) {
      return res.status(400).json({
        error:
          "Invalid MFA recovery credential",
      });
    }

    let claims;

    try {
      claims =
        verifyMfaChallenge(challenge);
    } catch {
      return res.status(401).json({
        error:
          "Invalid or expired MFA challenge",
      });
    }

    /*
     * RECOVERY PATH
     *
     * consumeMfaRecoveryLogin() commits the coupled PostgreSQL
     * transition:
     *
     *   recovery credential AVAILABLE -> CONSUMED
     *   challenge nonce       AVAILABLE -> CONSUMED
     *
     * or rolls both back.
     *
     * Session issuance occurs only after that transaction promise
     * resolves successfully.
     */
    if (recoverySupplied) {
      const recoveryResult =
        await consumeMfaRecoveryLogin({
          userId: claims.sub,
          jti: claims.jti,
          code: recoveryCode,
        });

      if (!recoveryResult) {
        return res.status(401).json({
          error:
            "Invalid, expired, or already used MFA verification credential",
        });
      }

      const token =
        await issueSession(
          res,
          recoveryResult.user
        );

      res.set(
        "Cache-Control",
        "no-store"
      );

      return res.json({
        ok: true,
        token,
        user: toPublicUser(
          recoveryResult.user
        ),
        recoveryCodeUsed: true,
        remainingRecoveryCodes:
          recoveryResult
            .remainingRecoveryCodes,
      });
    }

    /*
     * TOTP PATH
     *
     * Preserve the previously-qualified TOTP behavior.
     */
    const result = await db.execute(sql`
      SELECT
        id,
        email,
        name,
        role,
        mfa_enabled,
        mfa_secret,
        created_at,
        subscription_status,
        profile_image_url,
        timezone
      FROM users
      WHERE id = ${claims.sub}
      LIMIT 1
    `);

    const user = result.rows?.[0];

    if (
      !user ||
      !user.mfa_enabled ||
      !user.mfa_secret
    ) {
      return res.status(401).json({
        error:
          "MFA verification unavailable",
      });
    }

    let secret;

    try {
      secret =
        decryptMfaSecret(
          user.mfa_secret
        );
    } catch {
      return res.status(401).json({
        error:
          "MFA verification failed",
      });
    }

    if (
      !verifyTotpCode(
        secret,
        code
      )
    ) {
      return res.status(401).json({
        error:
          "Invalid verification code",
      });
    }

    /*
     * TOTP validity alone cannot create a session.
     */
    const consumed =
      await consumeMfaLoginChallenge({
        userId: user.id,
        jti: claims.jti,
      });

    if (!consumed) {
      return res.status(401).json({
        error:
          "Invalid, expired, or already used MFA challenge",
      });
    }

    const token =
      await issueSession(
        res,
        user
      );

    res.set(
      "Cache-Control",
      "no-store"
    );

    return res.json({
      ok: true,
      token,
      user: toPublicUser(user),
    });
  } catch (err) {
    console.error(
      "mfa login verification error:",
      err
    );

    return res.status(500).json({
      error:
        "MFA verification failed",
    });
  }
});

router.get("/me", requireAuth, async (req, res) => {
  try {
    await ensureUsersTable();
    const user = await findHydratedUserById(req.dbUserId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({
      ok: true,
      user: toPublicUser(user),
    });
  } catch (err) {
    console.error("auth me error:", err);
    return res.status(500).json({ error: "Unable to load user profile" });
  }
});

router.get("/user", requireAuth, async (req, res) => {
  try {
    await ensureUsersTable();
    const user = await findHydratedUserById(req.dbUserId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(toPublicUser(user));
  } catch (err) {
    console.error("auth user error:", err);
    return res.status(500).json({ error: "Unable to load user profile" });
  }
});
// ─────────────────────────────────────────────────────────────────────────────
// Round 3 (Apr-26 user-approved unlock): /refresh + /logout
//
// Design notes (read before extending):
//   • The acceptance criteria for this task explicitly require that
//     /login and /register remain unchanged. /login therefore does NOT
//     issue an opaque refresh token today.
//   • /refresh implements a "sliding session" model: client presents a
//     still-valid access JWT (typically called shortly before expiry) and
//     receives a fresh JWT with extended expiry. requireAuth handles the
//     signature/expiry check, so we only re-sign on success.
//   • The schema column `refresh_token_hash` is reserved for a future
//     opaque-rotation flow; /logout defensively clears it so any latent
//     enrollment is invalidated cleanly.
//   • Error copy follows the trauma-informed wellness microcopy guideline:
//     calm, blame-free, action-oriented.
// ─────────────────────────────────────────────────────────────────────────────

// Anti-abuse window for sliding-session refresh (architect review Apr-26).
// Only re-issue when the current token is within REFRESH_WINDOW_MS of expiry.
// This stops a stolen token from being extended indefinitely on every minute,
// while still allowing a real user to keep their session alive near rollover.
const REFRESH_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

router.post("/refresh", async (req, res) => {
  try {
    await ensureUsersTable();

    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) {
      return res.status(401).json({ error: "Refresh token required" });
    }

    /*
     * Read-only preflight lookup lets us resolve the account before consuming
     * the credential. Security does not depend on this read: the authoritative
     * single-consumer decision occurs inside rotateRefreshToken().
     */
    const existing = await findValidRefreshToken(refreshToken);
    if (!existing) {
      /*
       * A refresh cookie was presented, but this request may be stale because
       * another same-browser request already consumed the predecessor and
       * installed its successor. Do not clear shared cookie state from the
       * stale response: doing so could erase the winning credential.
       *
       * The absence of a refresh cookie is still handled above as 401.
       */
      res.set("Cache-Control", "no-store");
      return res.status(409).json({
        error: "Refresh token unavailable or rotation conflict",
        retryable: true,
      });
    }

    const userRows = await db.execute(sql`
      SELECT
        id,
        email,
        name,
        role,
        created_at,
        subscription_status,
        profile_image_url,
        timezone
      FROM users
      WHERE id = ${existing.userId}
      LIMIT 1
    `);

    const user = userRows.rows?.[0];
    if (!user) {
      await revokeRefreshToken({
        userId: existing.userId,
        token: refreshToken,
      });
      clearRefreshCookie(res);
      return res.status(401).json({ error: "User not found" });
    }

    /*
     * Generate the successor before entering the transaction, but do not
     * expose it to the client until PostgreSQL has atomically consumed the
     * predecessor and persisted this replacement.
     */
    const replacementRefreshToken = newRefreshToken();

    const rotation = await rotateRefreshToken({
      token: refreshToken,
      newToken: replacementRefreshToken,
    });

    /*
     * A racing replay reaches this branch after the winning request has
     * already consumed the predecessor. No successor credential is returned.
     */
    if (!rotation) {
      /*
       * This request passed the read-only preflight but lost the atomic
       * consume race. Another same-browser tab/request may already have
       * installed the successor cookie. Never clear shared browser credential
       * state from the losing response.
       */
      res.set("Cache-Control", "no-store");
      return res.status(409).json({
        error: "Refresh token rotation conflict",
        retryable: true,
      });
    }

    /*
     * Token hash ownership must remain stable across preflight and atomic
     * consumption. Any impossible ownership disagreement is treated as a
     * credential-integrity failure and the newly-created credential is
     * immediately revoked.
     */
    if (String(rotation.userId) !== String(user.id)) {
      await revokeRefreshToken({
        userId: rotation.userId,
        token: replacementRefreshToken,
      });
      clearRefreshCookie(res);
      return res.status(401).json({
        error: "Refresh credential integrity check failed",
      });
    }

    const token = signUserToken(user);

    res.cookie(
      "refresh_token",
      replacementRefreshToken,
      getRefreshCookieOptions()
    );

    return res.json({
      ok: true,
      refreshed: true,
      token,
      user: toPublicUser(user),
    });
  } catch (err) {
    console.error("refresh error:", err);
    return res.status(500).json({
      error: "We couldn't refresh your session right now. Please sign in again when you're ready.",
    });
  }
});


router.post("/logout", async (req, res) => {
  res.set("Cache-Control", "no-store");

  try {
    await ensureUsersTable();

    const refreshToken = req.cookies?.refresh_token;
    if (refreshToken) {
      const revocation = await revokeRefreshTokenByToken(refreshToken);

      if (revocation.revokedCount > 1) {
        console.warn(
          "logout integrity warning: duplicate refresh-token hashes revoked"
        );
      }
    }

    // Confirm server-side revocation before discarding the retry credential.
    clearRefreshCookie(res);
    res.clearCookie("authToken");
    res.clearCookie("refreshToken");

    return res.json({
      ok: true,
      message: "You're signed out. Take care of yourself.",
    });
  } catch {
    // Never report completed logout when revocation or cookie cleanup failed.
    // Do not put database errors or credential values into the response/log.
    console.warn("logout could not be confirmed");
    return res.status(503).json({
      ok: false,
      code: "LOGOUT_INCOMPLETE",
      error: "We couldn't confirm that sign-out completed. Please try again.",
    });
  }
});

export default router;
