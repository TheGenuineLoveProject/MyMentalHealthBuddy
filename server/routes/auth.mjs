// server/routes/auth.mjs
import express from "express";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { z } from "zod";
import { eq } from "drizzle-orm";

import { db } from "../db/client.mjs";
import { users } from "../../shared/schema.mjs";

import { sendUniformAuthFailure } from "../lib/authErrors.mjs";
import { authRateLimit, loginRateLimit } from "../middleware/rateLimit.mjs";
import { requireAuth } from "../middleware/requireAuth.mjs";

import { logAudit, getClientIp, AUDIT_ACTIONS } from "../services/auditLog.mjs";

const router = express.Router();
router.use(cookieParser());

// -------------------------
// ENV / SECRETS
// -------------------------
const isProd = process.env.NODE_ENV === "production";
const ACCESS_SECRET =
  process.env.JWT_SECRET || (isProd ? null : "dev_secret_not_for_production");
const REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || (isProd ? null : "dev_refresh_secret_not_for_production");

if (isProd && (!ACCESS_SECRET || !REFRESH_SECRET)) {
  console.error("DEPLOY BLOCKED: JWT_SECRET and JWT_REFRESH_SECRET must be set in production.");
  process.exit(1);
}

// -------------------------
// HELPERS
// -------------------------
function signAccessToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role || "user",
      name: user.name,
      subscription_status: user.subscriptionStatus || user.subscription_status || "free",
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
  res.clearCookie("refresh_token", {
    path: "/api/auth/refresh",
  });
}

function safeUserShape(user) {
  // remove sensitive fields if present
  // (handles different schema naming styles)
  const {
    passwordHash: _passwordHash,
    password_hash: _password_hash,
    refreshTokenHash: _refreshTokenHash,
    refresh_token_hash: _refresh_token_hash,
    mfaSecret: _mfaSecret,
    mfa_backup_codes: _mfa_backup_codes,
    ...rest
  } = user || {};
  return rest;
}

// -------------------------
// VALIDATION SCHEMAS
// -------------------------
const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
});

// -------------------------
// REGISTER
// -------------------------
// Apply a generic auth limiter to register (OK to return 429 here)
router.post("/register", authRateLimit, async (req, res) => {
  try {
    const parsed = RegisterSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid registration data." });
    }

    const email = String(parsed.data.email).toLowerCase();
    const password = String(parsed.data.password);
    const name = parsed.data.name?.trim() || email.split("@")[0];

    const existing = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existing) {
      return res.status(409).json({ message: "User already exists." });
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

    await logAudit({
      userId: newUser.id,
      action: AUDIT_ACTIONS.REGISTER,
      resourceType: "user",
      resourceId: newUser.id,
      ipAddress: getClientIp(req),
      userAgent: req.headers["user-agent"],
    });

    const accessToken = signAccessToken(newUser);
    const refreshToken = signRefreshToken(newUser);
    setRefreshCookie(res, refreshToken);

    return res.status(200).json({
      token: accessToken,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Registration failed." });
  }
});

// -------------------------
// LOGIN  (SECURITY-UNIFORM)
// -------------------------
// IMPORTANT:
// - Always return 401 "Invalid credentials" for any auth failure
// - Even when rate-limited (your loginRateLimit must do that too)
router.post("/login", loginRateLimit, async (req, res) => {
  try {
    const parsed = LoginSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Email and password are required." });

    const email = String(parsed.data.email).toLowerCase();
    const password = String(parsed.data.password);

    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) return sendUniformAuthFailure(res, 401);

    const pwHash = user.passwordHash || user.password_hash;
    if (!pwHash) return sendUniformAuthFailure(res, 401);

    const ok = await bcrypt.compare(password, pwHash);
    if (!ok) {
      // optional audit on failures
      await logAudit({
        userId: user.id,
        action: AUDIT_ACTIONS.LOGIN_FAILED,
        resourceType: "user",
        resourceId: user.id,
        ipAddress: getClientIp(req),
        userAgent: req.headers["user-agent"],
        metadata: { reason: "invalid_password" },
      });
      return sendUniformAuthFailure(res, 401);
    }

    await logAudit({
      userId: user.id,
      action: AUDIT_ACTIONS.LOGIN_SUCCESS,
      resourceType: "user",
      resourceId: user.id,
      ipAddress: getClientIp(req),
      userAgent: req.headers["user-agent"],
    });

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    setRefreshCookie(res, refreshToken);

    return res.status(200).json({
      message: "Login successful",
      token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role || "user",
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    // still do not leak details
    return sendUniformAuthFailure(res, 401);
  }
});

// -------------------------
// REFRESH
// -------------------------
router.post("/refresh", async (req, res) => {
  try {
    const token = req.cookies?.refresh_token;
    if (!token) return res.status(401).json({ message: "Missing refresh token." });

    const payload = jwt.verify(token, REFRESH_SECRET);

    const user = await db.query.users.findFirst({
      where: eq(users.id, payload.id),
    });

    if (!user) return res.status(401).json({ message: "Invalid refresh token." });

    const accessToken = signAccessToken(user);
    return res.json({ token: accessToken });
  } catch {
    return res.status(401).json({ message: "Invalid refresh token." });
  }
});

// -------------------------
// LOGOUT
// -------------------------
router.post("/logout", (req, res) => {
  clearRefreshCookie(res);
  return res.json({ message: "Logged out" });
});

// -------------------------
// ME
// -------------------------
router.get("/me", requireAuth, (req, res) => {
  // requireAuth should attach req.user (decoded token OR full user object)
  // If it's a decoded token payload only, that's OK; just return safe.
  const user = safeUserShape(req.user);
  return res.json({ user });
});

export default router;