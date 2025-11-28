import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../db/connection.mjs";
import { users } from "../shared/schema.mjs";
import { eq } from "drizzle-orm";
import { success, created, unauthorized, badRequest, serverError } from "../utils/response.mjs";
import { validate, registerSchema, loginSchema } from "../utils/validation.mjs";

const router = express.Router();

const JWT_SECRET = process.env.SESSION_SECRET;
const JWT_EXPIRY = "7d";

function getJwtSecret() {
  if (!JWT_SECRET) {
    throw new Error("CRITICAL: SESSION_SECRET is not set");
  }
  return JWT_SECRET;
}

router.get("/ping", (req, res) => {
  return success(res, { route: "auth" });
});

router.post("/register", async (req, res) => {
  try {
    const validation = validate(registerSchema, req.body);
    if (!validation.valid) {
      return badRequest(res, "Validation failed", validation.errors);
    }

    const { email, password, name } = validation.data;

    const existing = await db.select().from(users).where(eq(users.email, email.toLowerCase()));
    if (existing.length > 0) {
      return badRequest(res, "An account with this email already exists");
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const [newUser] = await db
      .insert(users)
      .values({
        email: email.toLowerCase(),
        password_hash: passwordHash,
        name: name
      })
      .returning();

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, name: newUser.name },
      getJwtSecret(),
      { expiresIn: JWT_EXPIRY }
    );

    return created(res, {
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name
      },
      token
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return serverError(res, err, "Registration failed. Please try again.");
  }
});

router.post("/login", async (req, res) => {
  try {
    const validation = validate(loginSchema, req.body);
    if (!validation.valid) {
      return badRequest(res, "Validation failed", validation.errors);
    }

    const { email, password } = validation.data;

    const result = await db.select().from(users).where(eq(users.email, email.toLowerCase()));
    if (result.length === 0) {
      return unauthorized(res, "Invalid email or password");
    }

    const user = result[0];

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return unauthorized(res, "Invalid email or password");
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      getJwtSecret(),
      { expiresIn: JWT_EXPIRY }
    );

    return success(res, {
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      token
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return serverError(res, err, "Login failed");
  }
});

router.get("/me", async (req, res) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return unauthorized(res, "No token provided");
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, getJwtSecret());

    const result = await db.select().from(users).where(eq(users.id, decoded.id));

    if (result.length === 0) {
      return unauthorized(res, "User not found");
    }

    const user = result[0];

    return success(res, {
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });

  } catch (err) {
    console.error("ME ERROR:", err);
    return unauthorized(res, "Invalid or expired token");
  }
});

export default router;