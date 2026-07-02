import express from "express";
import bcrypt from "bcrypt";
import { sql } from "drizzle-orm";
import db from "../db/client.mjs";
import { signUserToken, requireAuth } from "../middleware/auth.mjs";
import { loginRateLimit, authRateLimit } from "../middleware/rateLimit.mjs";

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
        profile_image_url text
      )
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
      RETURNING id, email, role, created_at
    `);

    const user = created.rows[0];
    const token = signUserToken(user);

    return res.json({
      ok: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        createdAt: user.created_at
      }
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
      SELECT id, email, role, password_hash, created_at
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

    const token = signUserToken(user);

    return res.json({
      ok: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        createdAt: user.created_at
      }
    });
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ error: "Login failed" });
  }
});

router.get("/me", requireAuth, async (req, res) => {
  return res.json({
    ok: true,
    user: req.user
  });
});
router.get("/user", requireAuth, async (req, res) => {
  res.json(req.user);
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

router.post("/refresh", requireAuth, async (req, res) => {
  try {
    // requireAuth has already validated the access JWT and populated req.user.
    // Token-age guard: req.user.exp is unix-seconds (decoded JWT payload).
    const expMs = (req.user?.exp || 0) * 1000;
    const remainingMs = expMs - Date.now();
    if (expMs && remainingMs > REFRESH_WINDOW_MS) {
      // Still plenty of life left — refuse to extend (anti-abuse).
      // Use 200 (not an error) so the client treats it as a no-op success.
      return res.json({
        ok: true,
        refreshed: false,
        message: "Your session is still healthy — no refresh needed yet.",
        expiresAt: new Date(expMs).toISOString(),
      });
    }
    // Within the refresh window — issue a fresh token.
    const token = signUserToken(req.user);
    return res.json({
      ok: true,
      refreshed: true,
      token,
      user: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (err) {
    console.error("refresh error:", err);
    return res.status(500).json({
      error: "We couldn't refresh your session right now. Please sign in again when you're ready.",
    });
  }
});

router.post("/logout", requireAuth, async (req, res) => {
  // Defensive cleanup of any stored refresh-token hash. Idempotent — succeeds
  // even when the column is already null. Wrapped so a DB hiccup doesn't
  // block the user from completing logout on the client.
  try {
    await ensureUsersTable();
    await db.execute(sql`
      UPDATE users SET refresh_token_hash = NULL WHERE id = ${req.user.id}
    `);
  } catch (err) {
    console.warn("logout cleanup warning:", err?.message || err);
  }

  // Clear any auth-related cookies the server may have set during OAuth flows.
  try {
    res.clearCookie("authToken");
    res.clearCookie("refreshToken");
  } catch {
    // clearCookie can throw if headers were already sent; safe to ignore.
  }

  return res.json({
    ok: true,
    message: "You're signed out. Take care of yourself.",
  });
});

export default router;
