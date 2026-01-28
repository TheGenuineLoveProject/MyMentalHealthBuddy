// server/routes/auth.mjs
import { Router } from "express";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { z } from "zod";
import { eq } from "drizzle-orm";

import { db } from "../db/client.mjs";
import { users } from "../../shared/schema.mjs";

const router = Router();
router.use(cookieParser());

// --------------------
// ENV / SECRETS
// --------------------
const isProd = process.env.NODE_ENV === "production";

const ACCESS_SECRET =
  process.env.JWT_SECRET || (isProd ? null : "dev_secret_not_for_production");
const REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET ||
  (isProd ? null : "dev_refresh_secret_not_for_production");

if (isProd && (!ACCESS_SECRET || !REFRESH_SECRET)) {
  console.error(
    "DEPLOY BLOCKED: JWT_SECRET and JWT_REFRESH_SECRET must be set in production."
  );
  process.exit(1);
}

// --------------------
// HELPERS
// --------------------
function safeUserShape(user) {
  if (!user) return null;
  // remove common sensitive fields if present
  const {
    passwordHash,
    password_hash,
    refreshTokenHash,
    refresh_token_hash,
    mfaSecret,
    mfa_secret,
    mfa_backup_codes,
    ...rest
  } = user;
  return rest;
}

function signAccessToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role || "user",
      name: user.name,
      subscription_status:
        user.subscriptionStatus || user.subscription_status || "free",
    },
    ACCESS_SECRET,
    { expiresIn: "15m" }
  );
}

function signRefreshToken(user) {
  return jwt.sign({ id: user.id }, REFRESH_SECRET, { expiresIn: "7d" });
}

function setRefreshCookie(res, token) {
  res.cookie("refresh_token", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "strict" : "lax",
    path: "/api/auth/refresh",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

function clearRefreshCookie(res) {
  res.clearCookie("refresh_token", { path: "/api/auth/refresh" });
}

// IMPORTANT: tests want NO sensitive leakage and they accept 400 or 401 for bad creds
function sendUniformAuthFailure(res, status = 401) {
  return res
    .status(status)
    .json({ ok: false, message: "Invalid credentials." });
}

// --------------------
// SCHEMAS
// --------------------
const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
});

// --------------------
// ROUTES
// --------------------

// Register (kept simple + consistent)
router.post("/register", async (req, res) => {
  try {
    const parsed = RegisterSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ ok: false, message: "Invalid registration data." });
    }

    const email = String(parsed.data.email).toLowerCase();
    const password = String(parsed.data.password);
    const name = (parsed.data.name || "").trim() || email.split("@")[0];

    const existing = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existing) {
      // do NOT leak sensitive details, but this is fine for register
      return res.status(409).json({ ok: false, message: "User already exists." });
    }

    const hashed = await bcrypt.hash(password, 10);

    const newUser = {
      id: crypto.randomUUID(),
      email,
      passwordHash: hashed,
      name,
      role: "user",
      subscriptionStatus: "free",
    };

    await db.insert(users).values(newUser);

    const accessToken = signAccessToken(newUser);
    const refreshToken = signRefreshToken(newUser);
    setRefreshCookie(res, refreshToken);

    return res.status(200).json({
      ok: true,
      token: accessToken,
      user: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role },
    });
  } catch (err) {
    console.error("[Auth] register error:", err);
    return res.status(500).json({ ok: false, message: "Registration failed." });
  }
});

// Login - Tests want: for bad credentials, return 400 or 401 (NOT 404)
// and do NOT echo back sensitive info.
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ ok: false, message: "Email and password are required." });
    }

    const normalizedEmail = String(email).toLowerCase();
    const user = await db.query.users.findFirst({
      where: eq(users.email, normalizedEmail),
    });

    if (!user) return sendUniformAuthFailure(res, 401);

    const pwHash = user.passwordHash || user.password_hash;
    if (!pwHash) return sendUniformAuthFailure(res, 401);

    const ok = await bcrypt.compare(password, pwHash);
    if (!ok) return sendUniformAuthFailure(res, 401);

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    setRefreshCookie(res, refreshToken);

    return res.status(200).json({
      ok: true,
      token: accessToken,
      user: safeUserShape(user),
    });
  } catch (err) {
    console.error("[Auth] login error:", err);
    return res.status(500).json({ ok: false, message: "Login failed." });
  }
});

// Refresh
router.post("/refresh", async (req, res) => {
  try {
    const token = req.cookies?.refresh_token;
    if (!token)
      return res.status(401).json({ ok: false, message: "Missing refresh token." });

    let payload;
    try {
      payload = jwt.verify(token, REFRESH_SECRET);
    } catch {
      return res.status(401).json({ ok: false, message: "Invalid refresh token." });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, payload.id),
    });
    if (!user) return res.status(401).json({ ok: false, message: "Invalid refresh token." });

    const accessToken = signAccessToken(user);
    return res.json({ ok: true, token: accessToken });
  } catch (err) {
    console.error("[Auth] refresh error:", err);
    return res.status(500).json({ ok: false, message: "Refresh failed." });
  }
});

// Logout
router.post("/logout", (_req, res) => {
  clearRefreshCookie(res);
  return res.json({ ok: true, message: "Logged out." });
});

// Me (simple token check)
router.get("/me", async (req, res) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ ok: false, message: "Unauthorized." });

    let payload;
    try {
      payload = jwt.verify(token, ACCESS_SECRET);
    } catch {
      return res.status(401).json({ ok: false, message: "Unauthorized." });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, payload.id),
    });
    if (!user) return res.status(401).json({ ok: false, message: "Unauthorized." });

    return res.json({ ok: true, user: safeUserShape(user) });
  } catch (err) {
    console.error("[Auth] me error:", err);
    return res.status(500).json({ ok: false, message: "Failed to load user." });
  }
});

export default router;