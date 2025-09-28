import express from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { storage } from '../../storage';
import { asyncHandler, ValidationError, AuthenticationError } from '../../middleware/errorHandler';
import { authenticateToken, type AuthRequest } from '../../auth/jwt';

const router = express.Router();

// Optimized validation schemas
const registerSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(128),
  name: z.string().min(2).max(100)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

// High-performance JWT token generation
const generateTokens = (userId: string) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'mymentalhealthbuddy-jwt-secret-2024',
    { expiresIn: '24h' }
  );
  
  const refreshToken = jwt.sign(
    { userId, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET || 'mymentalhealthbuddy-refresh-secret-2024',
    { expiresIn: '30d' }
  );
  
  return { accessToken, refreshToken };
};

// Register route with optimized password hashing
router.post('/register', asyncHandler(async (req, res) => {
  const validation = registerSchema.safeParse(req.body);
  if (!validation.success) {
    throw new ValidationError(validation.error.issues[0].message);
  }
  
  const { email, password, name } = validation.data;
  
  // Check if user exists
  const existingUser = await storage.getUserByEmail(email);
  if (existingUser) {
    throw new ValidationError('Email already registered');
  }
  
  // Hash password with optimized salt rounds
  const hashedPassword = await bcrypt.hash(password, 12);
  
  // Create user
  const user = await storage.createUser({
    email,
    hashedPassword,
    name,
    createdAt: new Date(),
    subscriptionTier: 'free',
    aiSessionsUsed: 0,
    aiSessionsLimit: 5
  });
  
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
}));

// Login route with optimized authentication
router.post('/login', asyncHandler(async (req, res) => {
  const validation = loginSchema.safeParse(req.body);
  if (!validation.success) {
    throw new ValidationError('Invalid email or password');
  }
  
  const { email, password } = validation.data;
  
  // Get user with optimized query
  const user = await storage.getUserByEmail(email);
  if (!user) {
    throw new AuthenticationError('Invalid email or password');
  }
  
  // Verify password
  const isValid = await bcrypt.compare(password, user.hashedPassword);
  if (!isValid) {
    throw new AuthenticationError('Invalid email or password');
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
}));

// Logout route with session cleanup
router.post('/logout', asyncHandler(async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Session destruction error:', err);
    }
  });
  
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
}));

// Get current user route
router.get('/me', authenticateToken as any, asyncHandler(async (req: AuthRequest, res) => {
  if (!req.user) {
    throw new AuthenticationError('Not authenticated');
  }
  
  const user = await storage.getUserById(req.user.id);
  if (!user) {
    throw new AuthenticationError('User not found');
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
}));

// Refresh token route
router.post('/refresh', asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    throw new AuthenticationError('Refresh token required');
  }
  
  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || 'mymentalhealthbuddy-refresh-secret-2024'
    ) as { userId: string; type: string };
    
    if (decoded.type !== 'refresh') {
      throw new AuthenticationError('Invalid token type');
    }
    
    const tokens = generateTokens(decoded.userId);
    
    res.json({
      success: true,
      ...tokens
    });
  } catch (error) {
    throw new AuthenticationError('Invalid refresh token');
  }
}));

export default router;