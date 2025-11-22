import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import authGuard from "../middleware/auth.mjs";

const router = Router();

// In-memory demo DB (replace with PostgreSQL later)
const users = [];

// REGISTER
router.post(
  "/register",
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    const exists = users.find((u) => u.email === email);
    if (exists) return res.status(400).json({ error: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    users.push({ email, password: hashed });

    return res.json({ success: true });
  }
);

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email);
  if (!user) return res.status(400).json({ error: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: "Invalid credentials" });

  const token = jwt.sign({ email }, process.env.JWT_SECRET || "default-secret", {
    expiresIn: "1h",
  });

  res.json({ token });
});

// Protected test
router.get("/me", authGuard, (req, res) => {
  res.json({
    message: "Authenticated user ✓",
    user: req.user,
  });
});

export default router;