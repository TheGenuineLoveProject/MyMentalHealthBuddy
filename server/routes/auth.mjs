// server/routes/auth.mjs
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import db from "../db/connection.mjs";
import { users } from "../shared/schema.mjs";
import { eq } from "drizzle-orm";

import {
  success,
  created,
  badRequest,
  unauthorized,
  conflict,
  serverError,
} from "../utils/response.mjs";

import {
  validateRegister,
  validateLogin,
} from "../utils/validation.mjs";

const router = express.Router();

const JWT_SECRET = process.env.SESSION_SECRET;
const JWT_EXPIRY = "7d";

function getJwtSecret() {
  if (!JWT_SECRET) {
    throw new Error("SESSION_SECRET not configured");
  }
  return JWT_SECRET;
}

// Simple ping
router.get("/ping", (req, res) => {
  return success(res, { route: "auth" });
});

// ---------- REGISTER ----------
router.post("/register", async (req, res) => {
  try {
    const { valid, errors, data } = validateRegister(req.body);

    if (!valid) {
      return badRequest(res, "Validation failed.", errors);
    }

    const { email, password, name } = data;

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()));

    if (existingUser.length > 0) {
      return conflict(res, "An account with this email already exists");
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const [newUser] = await db
      .insert(users)
      .values({
        email: email.toLowerCase(),
        password_hash: passwordHash,
        name: name || null,
      })
      .returning();

    const token = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      },
      getJwtSecret(),
      { expiresIn: JWT_EXPIRY }
    );

    return created(res, {
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      },
      token,
    });
  } catch (err) {
    console.error(err);
    return serverError(res, err, "Registration failed. Please try again.");
  }
});

// ---------- LOGIN ----------
router.post("/login", async (req, res) => {
  try {
    const { valid, errors, data } = validateLogin(req.body);

    if (!valid) {
      return badRequest(res, "Validation failed.", errors);
    }

    const { email, password } = data;

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()));

    if (!user) {
      return unauthorized(res, "Invalid email or password");
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return unauthorized(res, "Invalid email or password");
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      getJwtSecret(),
      { expiresIn: JWT_EXPIRY }
    );

    return success(res, {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    });
  } catch (err) {
    console.error(err);
    return serverError(res, err, "Login failed. Please try again.");
  }
});

// ---------- ME ----------
router.get("/me", async (req, res) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return unauthorized(res, "No token provided");
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, getJwtSecret());

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, decoded.id));

    if (!user) {
      return unauthorized(res, "User not found");
    }

    return success(res, {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    console.error(err);
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return unauthorized(res, "Invalid or expired token");
    }
    return serverError(res, err, "Failed to verify token");
  }
});

export default router;