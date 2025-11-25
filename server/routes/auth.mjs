// server/routes/auth.mjs
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../db/connection.mjs";
import { users } from "../shared/schema.mjs";
import { eq } from "drizzle-orm";

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password) return res.status(400).json({ error: "Missing fields" });

  const passwordHash = await bcrypt.hash(password, 12);

  const [newUser] = await db
    .insert(users)
    .values({ email, passwordHash, name })
    .returning();

  const token = jwt.sign(
    { id: newUser.id, email: newUser.email },
    process.env.SESSION_SECRET,
    { expiresIn: "7d" }
  );

  res.status(201).json({ user: newUser, token });
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const [user] = await db.select().from(users).where(eq(users.email, email));

  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.SESSION_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ user, token });
});

export default router;