// server/routes/auth.mjs

import express from "express";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

import { db } from "../db/connection.mjs";
import { users } from "../../shared/schema.mjs";
import { success, badRequest } from "../utils/response.mjs";

const router = express.Router();

/**
 * POST /api/auth/register
 * Body: { email, password, name? }
 */
router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body ?? {};

    // Basic validation
    if (!email || !password) {
      return badRequest(res, "Email and password are required.", [
        { field: "email", message: !email ? "Email is required." : "" },
        { field: "password", message: !password ? "Password is required." : "" },
      ]);
    }

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

    // Insert new user
    const inserted = await db
      .insert(users)
      .values({
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

    return success(res, { user }, "User registered successfully.");
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
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body ?? {};

    if (!email || !password) {
      return badRequest(res, "Email and password are required.", [
        { field: "email", message: !email ? "Email is required." : "" },
        { field: "password", message: !password ? "Password is required." : "" },
      ]);
    }

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

    return success(res, { user: safeUser }, "Login successful.");
  } catch (err) {
    console.error("[auth/login] Unexpected error:", err);
    return res.status(500).json({
      ok: false,
      message: "Unexpected server error during login.",
    });
  }
});

export default router;