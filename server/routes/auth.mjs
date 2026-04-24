import express from "express";
import bcrypt from "bcryptjs";
import { sql } from "drizzle-orm";
import db from "../db/client.mjs";
import { signUserToken, requireAuth } from "../middleware/auth.mjs";

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

router.post("/register", async (req, res) => {
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

router.post("/login", async (req, res) => {
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

export default router;
