import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";

const router = express.Router();

// In-memory demo DB (replace with PostgreSQL later)
const users = [];

// REGISTER
router.post("/register",
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;
  const exists = users.find(u => u.email === email);
  if (exists) return res.status(400).json({ error: "User exists" });

  const hashed = await bcrypt.hash(password, 10);
  users.push({ email, password: hashed });

  return res.json({ status: "ok", message: "Registered successfully" });
});

// LOGIN
router.post("/login",
  body("email").isEmail(),
  async (req, res) => {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email);
    if (!user) return res.status(400).json({ error: "Invalid login" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Invalid login" });

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "2h" });

    res.json({ status: "ok", token });
  }
);

// VERIFY TOKEN
router.get("/verify", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ status: "ok", user: decoded });
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
});

export default router;
