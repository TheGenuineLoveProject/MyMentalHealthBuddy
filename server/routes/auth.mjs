// server/routes/auth.mjs

import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

import { db } from "../db/connection.mjs";
import { users } from "../../shared/schema.mjs";
import { success, badRequest } from "../utils/response.mjs";
import { registerSchema, loginSchema, validateBody } from "../validation/schemas.mjs";
import { authRateLimit } from "../middleware/rateLimit.mjs";

// [MMB] Auth stubs with standardized responses (wire to your real auth)
import { Router } from "express";
import { ok, fail } from "../utils/apiResponse.mjs";

export const authRouter = Router();

authRouter.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body || {};
    if (!email || !password || !name) return fail(res, 400, "Missing fields", "VALIDATION");
    // TODO: integrate with real user creation + hashing
    return ok(res, { user: { id: "TODO", email, name } }, "Registered");
  } catch (e) {
    return fail(res, 500, "Internal error", "REGISTER_ERROR");
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return fail(res, 400, "Missing fields", "VALIDATION");
    // TODO: integrate with real verification + JWT/session
    return ok(res, { token: "TODO", user: { id: "TODO", email } }, "Logged in");
  } catch {
    return fail(res, 500, "Internal error", "LOGIN_ERROR");
  }
});

const router = express.Router();

// Apply stricter rate limiting to auth endpoints
router.use(authRateLimit);

const JWT_SECRET = process.env.SESSION_SECRET;
const JWT_EXPIRES_IN = "7d";

/**
 * POST /api/auth/register
 * Body: { email, password, name? }
 */
router.post("/register", validateBody(registerSchema), async (req, res) => {
  try {
    const { email, password, name } = req.validatedBody;

    // Check if user already exists
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existing.length > 0) {
      return badRequest(res, "An account with this email already exists.");
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert new user with generated UUID
    const userId = randomUUID();
    const inserted = await db
      .insert(users)
      .values({
        id: userId,
        email,
        passwordHash,
        name: name ?? null,
      })
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        createdAt: users.createdAt,
      });

    const user = inserted[0];

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return success(res, { user, token }, "User registered successfully.");
  } catch (err) {
    console.error("[auth/register] Unexpected error:", err);
    return res.status(500).json({
      ok: false,
      message: "Unexpected server error during registration.",
    });
  }
});

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
router.post("/login", validateBody(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.validatedBody;

    // Look up user
    const rows = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    const user = rows[0];

    if (!user) {
      return badRequest(res, "Invalid email or password.");
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return badRequest(res, "Invalid email or password.");
    }

    // Return safe user shape (no passwordHash)
    const safeUser = {
      id: user.id,
      email: user.email,
      name: user.name ?? null,
      createdAt: user.createdAt,
    };

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return success(res, { user: safeUser, token }, "Login successful.");
  } catch (err) {
    console.error("[auth/login] Unexpected error:", err);
    return res.status(500).json({
      ok: false,
      message: "Unexpected server error during login.",
    });
  }
});

export default router;