  import { users, moodEntries, journalEntries, subscriptions } 
    from "../shared/schema.mjs";
import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../db/connection.mjs";
// auth.mjs

import { eq } from "drizzle-orm";

const router = Router();

router.post("/register", async (req, res) => {
  const { email, password, name } = req.body;

  const exists = await db.select().from(users).where(eq(users.email, email));
  if (exists.length > 0) return res.status(400).json({ error: "User exists" });

  const hash = await bcrypt.hash(password, 10);

  const [newUser] = await db.insert(users).values({
    email,
    passwordHash: hash,
    name
  }).returning();

  const token = jwt.sign({ userId: newUser.id }, process.env.SESSION_SECRET, { expiresIn: "7d" });

  res.json({ token });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const [user] = await db.select().from(users).where(eq(users.email, email));
  if (!user) return res.status(401).json({ error: "Invalid login" });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: "Invalid login" });

  const token = jwt.sign({ userId: user.id }, process.env.SESSION_SECRET, { expiresIn: "7d" });

  res.json({ token });
});

export default router;
