// server/routes/auth.mjs
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../db/connection.mjs";
import { users } from "../shared/schema.mjs";
import { eq } from "drizzle-orm";
import { success, created, badRequest, unauthorized, conflict, serverError } from "../utils/response.mjs";
import { registerSchema, loginSchema, validate } from "../utils/validation.mjs";

const router = express.Router();

const JWT_SECRET = process.env.SESSION_SECRET || "dev-secret-change-in-production";
const JWT_EXPIRY = "7d";

router.get("/ping", (req, res) => success(res, { route: "auth" }));

router.post("/register", async (req, res) => {
  try {
    const validation = validate(registerSchema, req.body);
    if (!validation.valid) {
      return res.status(400).json({
        ok: false,
        error: "Validation failed",
        validationErrors: validation.errors
      });
    }

    const { email, password, name } = validation.data;

    const [existingUser] = await db.select().from(users).where(eq(users.email, email.toLowerCase()));
    if (existingUser) {
      return conflict(res, "An account with this email already exists");
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const [newUser] = await db
      .insert(users)
      .values({ 
        email: email.toLowerCase(), 
        passwordHash, 
        name: name || null 
      })
      .returning();

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );

    return created(res, { 
      user: { id: newUser.id, email: newUser.email, name: newUser.name }, 
      token 
    });
  } catch (err) {
    return serverError(res, err, "Registration failed. Please try again.");
  }
});

router.post("/login", async (req, res) => {
  try {
    const validation = validate(loginSchema, req.body);
    if (!validation.valid) {
      return res.status(400).json({
        ok: false,
        error: "Validation failed",
        validationErrors: validation.errors
      });
    }

    const { email, password } = validation.data;

    const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase()));

    if (!user) {
      return unauthorized(res, "Invalid email or password");
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return unauthorized(res, "Invalid email or password");
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );

    return success(res, { 
      user: { id: user.id, email: user.email, name: user.name }, 
      token 
    });
  } catch (err) {
    return serverError(res, err, "Login failed. Please try again.");
  }
});

router.get("/me", async (req, res) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return unauthorized(res, "No token provided");
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const [user] = await db.select().from(users).where(eq(users.id, decoded.id));
    
    if (!user) {
      return unauthorized(res, "User not found");
    }

    return success(res, { 
      user: { id: user.id, email: user.email, name: user.name } 
    });
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return unauthorized(res, "Invalid or expired token");
    }
    return serverError(res, err, "Failed to verify token");
  }
});

export default router;
