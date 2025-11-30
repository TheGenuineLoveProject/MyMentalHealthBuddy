// server/routes/auth.mjs

import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { db } from "../db/connection.mjs";
import { schema } from "../../shared/schema.mjs";
import { validateAuthPayload } from "../utils/validation.mjs";
// ⬇️ IMPORTANT: we only import success, NOT badRequest
import { success } from "../services/response.mjs";

const router = express.Router();

// Local badRequest that includes validation errors
function badRequest(res, message, errors = []) {
  return res.status(400).json({
    ok: false,
    message,
    errors,
  });
}

/* REGISTER */
router.post("/register", async (req, res) => {
  const { email, password, name } = req.body || {};
  const errors = [];

  if (!email) errors.push({ field: "email", message: "Email required" });
  if (!password) errors.push({ field: "password", message: "Password required" });
  if (!name) errors.push({ field: "name", message: "Name required" });

  if (errors.length) return badRequest(res, "Validation failed", errors);

  try {
    const hashed = await bcrypt.hash(password, 10);

    await db.insert(users).values({
      email,
      password: hashed,
      name,
    });

    return res.json({ ok: true });
  } catch (err) {
    console.error("[register error]", err);
    return res.status(500).json({ ok: false, error: "Registration failed" });
  }
});

/* LOGIN */
router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  const errors = [];

  if (!email) errors.push({ field: "email", message: "Email required" });
  if (!password) errors.push({ field: "password", message: "Password required" });

  if (errors.length) return badRequest(res, "Validation failed", errors);

  try {
    const [user] = await db.select().from(users).where(users.email.eq(email));

    if (!user) return badRequest(res, "Invalid credentials");

    const match = await bcrypt.compare(password, user.password);
    if (!match) return badRequest(res, "Invalid credentials");

    if (!process.env.SESSION_SECRET) {
      console.error("❌ SESSION_SECRET missing");
      return res.status(500).json({ ok: false, error: "Server misconfigured" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.SESSION_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ ok: true, token });
  } catch (err) {
    console.error("[login error]", err);
    return res.status(500).json({ ok: false, error: "Login failed" });
  }
});

export default router;