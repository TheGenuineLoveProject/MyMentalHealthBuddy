// server/routes/auth.mjs
// Authentication routes with JWT and bcrypt

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
import { logger } from "../utils/logger.mjs";

const router = express.Router();

router.use(authRateLimit);

const JWT_SECRET = process.env.SESSION_SECRET;
const JWT_EXPIRES_IN = "7d";

router.post("/register", validateBody(registerSchema), async (req, res) => {
  try {
    const { email, password, name } = req.validatedBody;

    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existing.length > 0) {
      return badRequest(res, "An account with this email already exists.");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const inserted = await db
      .insert(users)
      .values({
        email,
        passwordHash,
        name: name || "User",
      })
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        createdAt: users.createdAt,
      });

    const user = inserted[0];

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return success(res, { user, token }, "User registered successfully.");
  } catch (err) {
    logger.error("Registration failed", { error: err.message, requestId: req.requestId });
    return res.status(500).json({
      ok: false,
      message: "Unexpected server error during registration.",
    });
  }
});

router.post("/login", validateBody(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.validatedBody;

    const rows = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    const user = rows[0];

    if (!user) {
      return badRequest(res, "Invalid email or password.");
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return badRequest(res, "Invalid email or password.");
    }

    const safeUser = {
      id: user.id,
      email: user.email,
      name: user.name ?? null,
      createdAt: user.createdAt,
    };

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return success(res, { user: safeUser, token }, "Login successful.");
  } catch (err) {
    logger.error("Login failed", { error: err.message, requestId: req.requestId });
    return res.status(500).json({
      ok: false,
      message: "Unexpected server error during login.",
    });
  }
});

export default router;
