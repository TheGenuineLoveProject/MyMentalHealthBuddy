import express from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { storage } from "../../storage";
import {
  asyncHandler,
  ValidationError,
  AuthenticationError
} from "../../middleware/errorHandler";
import { authenticateToken, type AuthRequest } from "../../auth/jwt";
import {
  registrationLimiter,
  loginLimiter
} from "../../middleware/rateLimiter";

const router = express.Router();

// Enhanced validation schemas with comprehensive rules
const registerSchema = z.object({
  email: z
    .string()
    .email({ message: "Please provide a valid email address" })
    .max(255, { message: "Email must be less than 255 characters" })
    .toLowerCase()
    .trim()
    .optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(30, { message: "Username must be less than 30 characters" })
    .regex(/^[a-zA-Z0-9_-]+$/, {
      message:
        "Username can only contain letters, numbers, underscores and hyphens"
    })
    .trim(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(128, { message: "Password must be less than 128 characters" })
    .regex(/^(?=.*[a-z])/, {
      message: "Password must contain at least one lowercase letter"
    })
    .regex(/^(?=.*[A-Z])/, {
      message: "Password must contain at least one uppercase letter"
    })
    .regex(/^(?=.*[0-9])/, {
      message: "Password must contain at least one number"
    })
    .regex(/^(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/, {
      message: "Password must contain at least one special character"
    }),
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(100, { message: "Name must be less than 100 characters" })
    .regex(/^[a-zA-Z\s'-]+$/, {
      message: "Name can only contain letters, spaces, hyphens and apostrophes"
    })
    .trim()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

// High-performance JWT token generation
const generateTokens = (userId: string) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET || "mymentalhealthbuddy-jwt-secret-2024",
    { expiresIn: "24h" }
  );

  const refreshToken = jwt.sign(
    { userId, type: "refresh" },
    process.env.JWT_REFRESH_SECRET || "mymentalhealthbuddy-refresh-secret-2024",
    { expiresIn: "30d" }
  );

  return { accessToken, refreshToken };
};

// Register route with enhanced validation and error handling
router.post(
  "/register",
  registrationLimiter,
  asyncHandler(async (req, res) => {
    // Validate input data
    const validation = registerSchema.safeParse(req.body);
    if (!validation.success) {
      const errors = validation.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message
      }));
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors
      });
    }

    const { email, username, password, name } = validation.data;

    // Check if user exists by email or username
    try {
      if (email) {
        const existingUserByEmail = await storage.getUserByEmail(email);
        if (existingUserByEmail) {
          return res.status(400).json({
            success: false,
            message: "Registration failed",
            errors: [
              { field: "email", message: "This email is already registered" }
            ]
          });
        }
      }

      const existingUserByUsername = await storage.getUserByUsername(username);
      if (existingUserByUsername) {
        return res.status(400).json({
          success: false,
          message: "Registration failed",
          errors: [
            { field: "username", message: "This username is already taken" }
          ]
        });
      }
    } catch (error) {
      console.error("Error checking existing users:", error);
      return res.status(500).json({
        success: false,
        message:
          "An error occurred while checking user availability. Please try again later."
      });
    }

    // Hash password with optimized salt rounds
    let hashedPassword: string;
    try {
      hashedPassword = await bcrypt.hash(password, 12);
    } catch (error) {
      console.error("Password hashing error:", error);
      return res.status(500).json({
        success: false,
        message:
          "An error occurred while securing your password. Please try again."
      });
    }

    // Create user with comprehensive error handling
    let user;
    try {
      user = await storage.createUser({
        email: email || undefined,
        username,
        password: hashedPassword,
        name,
        createdAt: new Date(),
        subscriptionTier: "free",
        aiSessionsUsed: 0,
        aiSessionsLimit: 5
      });
    } catch (error: any) {
      console.error("User creation error:", error);

      // Check for specific database errors
      if (
        error.message?.includes("duplicate") ||
        error.message?.includes("unique")
      ) {
        return res.status(400).json({
          success: false,
          message:
            "This account information is already in use. Please try different credentials."
        });
      }

      return res.status(500).json({
        success: false,
        message:
          "Unable to create your account at this time. Please try again later."
      });
    }

    // Generate tokens
    const tokens = generateTokens(user.id);

    // Set session
    (req.session as any).user = { id: user.id, email: user.email };

    res.status(201).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        subscriptionTier: user.subscriptionTier
      },
      ...tokens
    });
  })
);

// Login route with optimized authentication
router.post(
  "/login",
  loginLimiter,
  asyncHandler(async (req, res) => {
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      throw new ValidationError("Invalid email or password");
    }

    const { email, password } = validation.data;

    // Get user with optimized query
    const user = await storage.getUserByEmail(email);
    if (!user) {
      throw new AuthenticationError("Invalid email or password");
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new AuthenticationError("Invalid email or password");
    }

    // Generate tokens
    const tokens = generateTokens(user.id);

    // Set session
    (req.session as any).user = { id: user.id, email: user.email };

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        subscriptionTier: user.subscriptionTier,
        aiSessionsUsed: user.aiSessionsUsed,
        aiSessionsLimit: user.aiSessionsLimit
      },
      ...tokens
    });
  })
);

// Logout route with session cleanup
router.post(
  "/logout",
  asyncHandler(async (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Session destruction error:", err);
      }
    });

    res.json({
      success: true,
      message: "Logged out successfully"
    });
  })
);

// Get current user route
router.get(
  "/me",
  authenticateToken as any,
  asyncHandler(async (req: AuthRequest, res) => {
    if (!req.user) {
      throw new AuthenticationError("Not authenticated");
    }

    const user = await storage.getUserById(req.user.id);
    if (!user) {
      throw new AuthenticationError("User not found");
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        subscriptionTier: user.subscriptionTier,
        aiSessionsUsed: user.aiSessionsUsed,
        aiSessionsLimit: user.aiSessionsLimit,
        createdAt: user.createdAt
      }
    });
  })
);

// Refresh token route
router.post(
  "/refresh",
  asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AuthenticationError("Refresh token required");
    }

    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET ||
          "mymentalhealthbuddy-refresh-secret-2024"
      ) as { userId: string; type: string };

      if (decoded.type !== "refresh") {
        throw new AuthenticationError("Invalid token type");
      }

      const tokens = generateTokens(decoded.userId);

      res.json({
        success: true,
        ...tokens
      });
    } catch (error) {
      throw new AuthenticationError("Invalid refresh token");
    }
  })
);

export default router;
