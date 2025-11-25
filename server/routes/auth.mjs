// server/routes/auth.mjs
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../db/connection.mjs";
import { users } from "../shared/schema.mjs";
import { eq } from "drizzle-orm";

const router = express.Router();

// Health check
router.get("/ping", (req, res) => res.json({ ok: true, route: "auth" }));

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Check if user already exists
    const [existingUser] = await db.select().from(users).where(eq(users.email, email));
    if (existingUser) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const [newUser] = await db
      .insert(users)
      .values({ email, passwordHash, name: name || null })
      .returning();

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.SESSION_SECRET || "dev-secret",
      { expiresIn: "7d" }
    );

    res.status(201).json({ 
      ok: true,
      user: { id: newUser.id, email: newUser.email, name: newUser.name }, 
      token 
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Registration failed. Please try again." });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.SESSION_SECRET || "dev-secret",
      { expiresIn: "7d" }
    );

    res.json({ 
      ok: true,
      user: { id: user.id, email: user.email, name: user.name }, 
      token 
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed. Please try again." });
  }
});

export default router;