// server/routes/auth.mjs

import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";

import { db } from "../db/connection.mjs";
import { users } from "../../shared/schema.mjs";
import { success, badRequest } from "../utils/response.mjs";

const router = express.Router();
const JWT_SECRET = process.env.SESSION_SECRET;

// Warn instead of crashing if secret missing
if (!JWT_SECRET) {
  console.warn(
    "[auth] SESSION_SECRET is not set. JWT tokens will not be issued."
  );
}

function createToken(user) {
  if (!JWT_SECRET) return null;
  return jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// POST /api/auth/register
router.post("/register", async (req, res, next) => {
  try {
    const { email, password, name } = req.body || {};

    if (!email || !password) {
      return badRequest(res, "Email and password are required.", [
        { field: "email", message: "Email is required." },
        { field: "password", message: "Password is required." },
      ]);
    }

    const [existing] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existing) {
      return badRequest(res, "An account with this email already exists.", [
        { field: "email", message: "Email already in use." },
      ]);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [created] = await db
      .insert(users)
      .values({
        email,
        passwordHash,
        name: name ?? null,
      })
      .returning();

    const token = createToken(created);

    return success(res, "Account created.", {
      user: { id: created.id, email: created.email, name: created.name },
      token,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return badRequest(res, "Email and password are required.", [
        { field: "email", message: "Email is required." },
        { field: "password", message: "Password is required." },
      ]);
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (!user) {
      return badRequest(res, "Invalid email or password.", [
        { field: "email", message: "Invalid email or password." },
      ]);
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return badRequest(res, "Invalid email or password.", [
        { field: "password", message: "Invalid email or password." },
      ]);
    }

    const token = createToken(user);

    return success(res, "Logged in.", {
      user: { id: user.id, email: user.email, name: user.name },
      token,
    });
  } catch (err) {
    next(err);
  }
});

// Simple health route to prove wiring works
router.get("/me", (req, res) => {
  return success(res, "Auth route is wired correctly.", null);
});

// Ping endpoint for consistency
router.get("/ping", (_req, res) => {
  return success(res, "Auth route is healthy.", { route: "auth" });
});

export default router;