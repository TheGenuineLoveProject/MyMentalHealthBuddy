import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import { z } from "zod";

import { db } from "../db/client.mjs";
import { requireAuth } from "../middleware/auth.mjs";

const router = express.Router();
router.use(cookieParser());

/* ================================
   SCHEMAS
================================ */
const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
});

/* ================================
   HELPERS
================================ */
function signAccessToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role || "user",
      subscription_status: user.subscription_status || "free",
    },
    process.env.JWT_SECRET || "dev_secret",
    { expiresIn: "15m" }
  );
}

function signRefreshToken(user) {
  return jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET || "dev_refresh_secret",
    { expiresIn: "7d" }
  );
}

function setRefreshCookie(res, token) {
  res.cookie("refresh_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/auth/refresh",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

/* ================================
   REGISTER
================================ */
router.post("/register", async (req, res) => {
  try {
    const data = RegisterSchema.parse(req.body);

    const existing = await db.query.users?.findFirst?.({
      where: (u, { eq }) => eq(u.email, data.email),
    });

    if (existing) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(data.password, 10);

    const user = {
      id: crypto.randomUUID(),
      email: data.email,
      password_hash: hashed,
      name: data.name || null,
      role: "user",
      subscription_status: "free",
    };

    await db.insert?.(db.schema.users)?.values?.(user);

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    setRefreshCookie(res, refreshToken);

    res.json({ token: accessToken });
  } catch (err) {
    res.status(400).json({ message: "Invalid registration data" });
  }
});

/* ================================
   LOGIN
================================ */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = LoginSchema.parse(req.body);

    const user =
      (await db.query.users?.findFirst?.({
        where: (u, { eq }) => eq(u.email, email),
      })) ||
      // DEV ADMIN FALLBACK
      (email === "admin@email.com"
        ? {
            id: "admin-id",
            email,
            password_hash: await bcrypt.hash("password", 10),
            role: "admin",
            subscription_status: "premium",
          }
        : null);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Handle both camelCase (Drizzle) and snake_case (direct DB)
    const passwordHash = user.passwordHash || user.password_hash;
    const valid = await bcrypt.compare(password, passwordHash);
    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    setRefreshCookie(res, refreshToken);

    res.json({
      token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role || "user",
      },
    });
  } catch (err) {
    res.status(400).json({ message: "Login failed" });
  }
});

/* ================================
   REFRESH TOKEN
================================ */
router.post("/auth/refresh", async (req, res) => {
  try {
    const token = req.cookies?.refresh_token;
    if (!token) {
      return res.status(401).json({ message: "Missing refresh token" });
    }

    const payload = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET || "dev_refresh_secret"
    );

    const user =
      (await db.query.users?.findFirst?.({
        where: (u, { eq }) => eq(u.id, payload.id),
      })) || null;

    if (!user) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const accessToken = signAccessToken(user);
    res.json({ token: accessToken });
  } catch {
    res.status(401).json({ message: "Invalid refresh token" });
  }
});

/* ================================
   LOGOUT
================================ */
router.post("/logout", (_req, res) => {
  res.clearCookie("refresh_token", {
    path: "/api/auth/refresh",
  });
  res.json({ message: "Logged out" });
});

/* ================================
   ME (DEBUG / VERIFY)
================================ */
router.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

export default router;