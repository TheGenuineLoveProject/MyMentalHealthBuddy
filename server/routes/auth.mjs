import express from "express";
import bcrypt from "bcryptjs";
import { sql } from "drizzle-orm";
import db from "../db/client.mjs";
import { signUserToken, requireAuth } from "../middleware/auth.mjs";

const router = express.Router();

async function ensureUsersTable() {
  // users table is managed by Drizzle schema (uuid id, name NOT NULL, etc.)
  // No-op here to avoid schema collision with the canonical table.
  return;
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
      RETURNING id, email, role
    `);

    const user = created.rows[0];
    const token = signUserToken(user);

    return res.json({ ok: true, token, user });
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
      SELECT id, email, role, password_hash
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
        role: user.role
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
