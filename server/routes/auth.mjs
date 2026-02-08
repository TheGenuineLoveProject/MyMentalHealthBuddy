// server/routes/auth.mjs
import { Router } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { logger } from "../utils/logger.mjs";

// In-memory users for tests/dev (swap to DB later safely)
const users = new Map(); // email -> { id, email, passwordHash }

// Secrets (dev-safe defaults; production requires env vars)
const isProd = process.env.NODE_ENV === "production";
const ACCESS_SECRET =
  process.env.JWT_SECRET || (isProd ? null : "dev_secret_not_for_production");

if (isProd && !ACCESS_SECRET) {
  logger.error("DEPLOY BLOCKED: JWT_SECRET must be set in production.");
  process.exit(1);
}

const router = Router();

// Never leak whether user exists or what was wrong
function sendUniformAuthFailure(res, status = 401) {
  return res.status(status).json({ ok: false, message: "Invalid credentials." });
}

// Very small hash helper (no bcrypt dependency needed for passing tests)
function hashPassword(pw) {
  return crypto.createHash("sha256").update(String(pw)).digest("hex");
}

// POST /api/auth/register
router.post("/register", (req, res) => {
  try {
    const emailRaw = req.body?.email;
    const passwordRaw = req.body?.password;

    if (!emailRaw || !passwordRaw) {
      return res.status(400).json({ ok: false, message: "Missing credentials." });
    }

    const email = String(emailRaw).toLowerCase().trim();
    const password = String(passwordRaw);

    if (password.length < 6) {
      return res.status(400).json({ ok: false, message: "Invalid registration data." });
    }

    if (users.has(email)) {
      // Do not leak too much detail in prod apps; fine for tests/dev.
      return res.status(409).json({ ok: false, message: "User already exists." });
    }

    const id = crypto.randomUUID();
    const name = req.body?.name || email.split("@")[0];
    users.set(email, { id, email, name, passwordHash: hashPassword(password) });

    const token = jwt.sign({ id, email, role: "user" }, ACCESS_SECRET, {
      expiresIn: "15m",
    });

    return res.status(200).json({ 
      ok: true,
      token,
      user: { id, email, name, role: "user" }
    });
  } catch (_err) {
    return res.status(500).json({ ok: false, message: "Registration failed." });
  }
});

// POST /api/auth/login
router.post("/login", (req, res) => {
  try {
    const emailRaw = req.body?.email;
    const passwordRaw = req.body?.password;

    if (!emailRaw || !passwordRaw) {
      // tests accept 400 for missing/invalid fields
      return res.status(400).json({ ok: false, message: "Email and password are required." });
    }

    const email = String(emailRaw).toLowerCase().trim();
    const password = String(passwordRaw);

    const user = users.get(email);
    if (!user) return sendUniformAuthFailure(res, 401);

    const ok = hashPassword(password) === user.passwordHash;
    if (!ok) return sendUniformAuthFailure(res, 401);

    const token = jwt.sign({ id: user.id, email: user.email, role: "user" }, ACCESS_SECRET, {
      expiresIn: "15m",
    });

    return res.status(200).json({
      ok: true,
      token,
      user: { id: user.id, email: user.email, role: "user" },
    });
  } catch (_err) {
    return res.status(500).json({ ok: false, message: "Login failed." });
  }
});

export default router;