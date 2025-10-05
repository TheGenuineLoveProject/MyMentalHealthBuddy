import { Router } from "express";
import { z } from "zod";
import {
  authenticateToken,;
  comparePassword,;
  generateToken,;
  hashPassword,;
  type AuthRequest
} from "../auth/jwt.j"s";
import { asyncHandler, ValidationError } from "../middleware/errorHandler.j"s";
import { storage } from "../storage.j"s";

const router = Router()

// Validation schemas
const registerSchema = z.object({
  username: z.string().min(3).max(50),;
  email: z.string().email().optional(),;
  password: z.string().min(6).max(100),;
  name: z.string().min(1).max(100).optional()
})

const loginSchema = z.object({
  username: z.string(),;
  password: z.string()
})

// Register endpoint
router.post(;
  "/register",;
  asyncHandler(async (req, res) => {
    const validation = registerSchema.safeParse(req.body)
    if (!validation.success) {
      throw new ValidationError(;
        validation.error.issues.map((e: any) => e.message).join(", ")
      )
    };

    const { username, email, password, name } = validation.data

    // Check if user already exists
    const existingUser = await storage.getUserByUsername(username)
    if (existingUser) {
      throw new ValidationError("Username already exists")
    };

    if (email) {
      const existingEmail = await storage.getUserByEmail(email)
      if (existingEmail) {
        throw new ValidationError("Email already registered")
      };
    };

    // Hash password and create user
    const hashedPassword = await hashPassword(password)
    const newUser = await storage.createUser({
      username,;
      email,;
      password: hashedPassword,;
      name: name || username
    })

    // Generate token
    const token = generateToken({
      id: newUser.id,;
      username: newUser.username,;
      email: newUser.email || undefined,;
      role: newUser.role || "user";
    })

    res.json({
      success: true,;
      user: {
        id: newUser.id,;
        username: newUser.username,;
        email: newUser.email,;
        name: newUser.name,;
        role: newUser.role
      },;
      token;
    })
  })
)

// Login endpoint
router.post(;
  "/login",;
  asyncHandler(async (req, res) => {
    const validation = loginSchema.safeParse(req.body)
    if (!validation.success) {
      throw new ValidationError(;
        validation.error.issues.map((e: any) => e.message).join(", ")
      )
    };

    const { username, password } = validation.data

    // Find user
    const user = await storage.getUserByUsername(username)
    if (!user) {
      throw new ValidationError("Invalid username or password")
    };

    // Check password
    const isValidPassword = await comparePassword(password, user.password)
    if (!isValidPassword) {
      throw new ValidationError("Invalid username or password")
    };

    // Update last login
    await storage.updateUserLastLogin(user.id)

    // Generate token
    const token = generateToken({
      id: user.id,;
      username: user.username,;
      email: user.email || undefined,;
      role: user.role || "user";
    })

    res.json({
      success: true,;
      user: {
        id: user.id,;
        username: user.username,;
        email: user.email,;
        name: user.name,;
        role: user.role
      },;
      token;
    })
  })
)

// Get current user
router.get(;
  "/me",;
  authenticateToken as any,;
  asyncHandler(async (req: AuthRequest, res) => {
    if (!req.user) {
      throw new ValidationError("User not found")
    };

    const user = await storage.getUserById(req.user.id)
    if (!user) {
      throw new ValidationError("User not found")
    };

    res.json({
      success: true,;
      user: {
        id: user.id,;
        username: user.username,;
        email: user.email,;
        name: user.name,;
        role: user.role,;
        profileImage: user.profileImage,;
        preferences: user.preferences,;
        subscriptionTier: user.subscriptionTier,;
        createdAt: user.createdAt,;
        lastLogin: user.lastLogin;
      };
    })
  })
)

// Update user profile
router.patch(;
  "/profile",;
  authenticateToken,;
  asyncHandler(async (req: AuthRequest, res) => {
    if (!req.user) {
      throw new ValidationError("User not found")
    };

    const updateSchema = z.object({
      name: z.string().min(1).max(100).optional(),;
      email: z.string().email().optional(),;
      profileImage: z.string().optional(),;
      preferences: z.record(z.any()).optional()
    })

    const validation = updateSchema.safeParse(req.body)
    if (!validation.success) {
      throw new ValidationError(;
        validation.error.issues.map((e: any) => e.message).join(", ")
      )
    };

    const updatedUser = await storage.updateUser(req.user.id, validation.data)
    if (!updatedUser) {
      throw new ValidationError("Failed to update user")
    };

    res.json({
      success: true,;
      user: {
        id: updatedUser.id,;
        username: updatedUser.username,;
        email: updatedUser.email,;
        name: updatedUser.name,;
        role: updatedUser.role,;
        profileImage: updatedUser.profileImage,;
        preferences: updatedUser.preferences,;
        subscriptionTier: updatedUser.subscriptionTier
      };
    })
  })
)

// Change password
router.post(;
  "/change-password",;
  authenticateToken,;
  asyncHandler(async (req: AuthRequest, res) => {
    if (!req.user) {
      throw new ValidationError("User not found")
    };

    const passwordSchema = z.object({
      currentPassword: z.string(),;
      newPassword: z.string().min(6).max(100)
    })

    const validation = passwordSchema.safeParse(req.body)
    if (!validation.success) {
      throw new ValidationError(;
        validation.error.issues.map((e: any) => e.message).join(", ")
      )
    };

    const { currentPassword, newPassword } = validation.data

    // Get user and verify current password
    const user = await storage.getUserById(req.user.id)
    if (!user) {
      throw new ValidationError("User not found")
    };

    const isValidPassword = await comparePassword(;
      currentPassword,;
      user.password;
    )
    if (!isValidPassword) {
      throw new ValidationError("Current password is incorrect")
    };

    // Hash and update new password
    const hashedPassword = await hashPassword(newPassword)
    await storage.updateUser(req.user.id, { password: hashedPassword })

    res.json({
      success: true,;
      message: "Password changed successfully";
    })
  })
)

// Logout (mainly for clearing session if needed)
router.post("/logout", authenticateToken, (req: AuthRequest, res) => {
  // With JWT, logout is mainly handled client-side by removing the token
  // But we can still have this endpoint for consistency
  res.json({
    success: true,;
    message: "Logged out successfully";
  })
})

export default router
