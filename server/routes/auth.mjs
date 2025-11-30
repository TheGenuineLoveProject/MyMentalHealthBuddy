// server/routes/auth.mjs
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

import { db } from "../db/connection.mjs";
import { users } from "../../shared/schema.mjs";

const router = express.Router();

// Local response helpers
function success(res, data, status = 200) {
  return res.status(status).json({ ok: true, ...data });
}

function badRequest(res, message, errors = []) {
  return res.status(400).json({ ok: false, message, errors });
}

function unauthorized(res, message = "Unauthorized") {
  return res.status(401).json({ ok: false, message });
}

function serverError(res, message = "Server error") {
  return res.status(500).json({ ok: false, error: message });
}

// Health check
router.get("/ping", (req, res) => {
  return success(res, { route: "auth" });
});

// REGISTER
router.post("/register", async (req, res) => {
  const { email, password, name } = req.body || {};
  const errors = [];

  if (!email) errors.push({ field: "email", message: "Email required" });
  if (!password) errors.push({ field: "password", message: "Password required" });

  if (errors.length) return badRequest(res, "Validation failed", errors);

  try {
    // Check if user exists
    const existing = await db.select().from(users).where(eq(users.email, email.toLowerCase()));
    if (existing.length > 0) {
      return badRequest(res, "Email already registered");
    }

    const hashed = await bcrypt.hash(password, 10);

    const [newUser] = await db.insert(users).values({
      email: email.toLowerCase(),
      passwordHash: hashed,
    }).returning();

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.SESSION_SECRET,
      { expiresIn: "7d" }
    );

    return success(res, { 
      user: { id: newUser.id, email: newUser.email },
      token 
    }, 201);
  } catch (err) {
    console.error("[register error]", err);
    return serverError(res, "Registration failed");
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  const errors = [];

  if (!email) errors.push({ field: "email", message: "Email required" });
  if (!password) errors.push({ field: "password", message: "Password required" });

  if (errors.length) return badRequest(res, "Validation failed", errors);

  try {
    const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase()));

    if (!user) return unauthorized(res, "Invalid credentials");

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return unauthorized(res, "Invalid credentials");

    if (!process.env.SESSION_SECRET) {
      console.error("SESSION_SECRET missing");
      return serverError(res, "Server misconfigured");
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.SESSION_SECRET,
      { expiresIn: "7d" }
    );

    return success(res, { 
      user: { id: user.id, email: user.email },
      token 
    });
  } catch (err) {
    console.error("[login error]", err);
    return serverError(res, "Login failed");
  }
});

// GET CURRENT USER
router.get("/me", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return unauthorized(res, "No token provided");
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SESSION_SECRET);
    
    const [user] = await db.select().from(users).where(eq(users.id, decoded.id));
    if (!user) return unauthorized(res, "User not found");

    return success(res, { 
      user: { id: user.id, email: user.email }
    });
  } catch (err) {
    return unauthorized(res, "Invalid token");
  }
});

export default router;
