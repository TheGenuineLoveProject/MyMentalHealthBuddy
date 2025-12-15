import express from "express";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import { z } from "zod";
import db from "../db/client.mjs";
import { signAccessToken, signRefreshToken, verifyToken } from "../utils/jwt.mjs";
import { getCookieOptions } from "../utils/cookies.mjs";
import { sha256 } from "../utils/hash.mjs";
import { ensureStripeCustomerForUser } from "../services/stripeSync.mjs";

const router = express.Router();
router.use(cookieParser());

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
});

function setRefreshCookie(res, refreshToken) {
  res.cookie("refresh_token", refreshToken, {
    ...getCookieOptions(),
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
}

router.post("/register", async (req, res) => {
  try {
    const parsed = RegisterSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid input" });

    const { email, password, name } = parsed.data;
    const existing = await db.execute(`SELECT id FROM users WHERE email = $1`, [email]);
    if (existing.rows?.length) return res.status(409).json({ message: "Email already in use" });

    const passwordHash = await bcrypt.hash(password, 12);
    const inserted = await db.execute(
      `INSERT INTO users (id, email, name, password_hash, role, subscription_status)
       VALUES (gen_random_uuid()::text, $1, $2, $3, 'user', 'free')
       RETURNING id, email, name, role, subscription_status`,
      [email, name || "User", passwordHash]
    );

    const user = inserted.rows[0];
    try { await ensureStripeCustomerForUser(user.id, user.email); } catch {}

    const token = signAccessToken({ id: user.id, email: user.email, role: user.role });
    const refreshToken = signRefreshToken({ id: user.id });
    await db.execute(`UPDATE users SET refresh_token_hash = $1 WHERE id = $2`, [sha256(refreshToken), user.id]);

    setRefreshCookie(res, refreshToken);
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const parsed = LoginSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid input" });

    const { email, password } = parsed.data;
    const result = await db.execute(`SELECT * FROM users WHERE email = $1`, [email]);
    const user = result.rows?.[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    try { await ensureStripeCustomerForUser(user.id, user.email); } catch {}

    const token = signAccessToken({ id: user.id, email: user.email, role: user.role });
    const refreshToken = signRefreshToken({ id: user.id });
    await db.execute(`UPDATE users SET refresh_token_hash = $1 WHERE id = $2`, [sha256(refreshToken), user.id]);

    setRefreshCookie(res, refreshToken);
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
});

router.post("/refresh", async (req, res) => {
  try {
    const token = req.cookies?.refresh_token;
    if (!token) return res.status(401).json({ message: "Missing refresh token" });

    const payload = verifyToken(token);
    if (!payload?.id) return res.status(401).json({ message: "Invalid refresh token" });

    const result = await db.execute(`SELECT * FROM users WHERE id = $1`, [payload.id]);
    const user = result.rows?.[0];
    if (!user || sha256(token) !== user.refresh_token_hash) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const newRefresh = signRefreshToken({ id: user.id });
    await db.execute(`UPDATE users SET refresh_token_hash = $1 WHERE id = $2`, [sha256(newRefresh), user.id]);

    const newToken = signAccessToken({ id: user.id, email: user.email, role: user.role });
    setRefreshCookie(res, newRefresh);
    res.json({ token: newToken });
  } catch (err) {
    console.error("Refresh error:", err);
    res.status(401).json({ message: "Invalid refresh token" });
  }
});

router.post("/logout", async (req, res) => {
  try {
    const token = req.cookies?.refresh_token;
    if (token) {
      try {
        const decoded = verifyToken(token);
        if (decoded?.id) await db.execute(`UPDATE users SET refresh_token_hash = NULL WHERE id = $1`, [decoded.id]);
      } catch {}
    }
    res.clearCookie("refresh_token", getCookieOptions());
    res.json({ ok: true });
  } catch {
    res.json({ ok: true });
  }
});

export default router;
