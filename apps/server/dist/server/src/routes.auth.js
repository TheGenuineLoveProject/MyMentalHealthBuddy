import bcrypt from "bcrypt";
import { storage } from "../storage.js";
import { z } from "zod";
import { Sanitizer, apiRateLimiter } from "./validation.js";
import { requireAuth } from "./lib/authMiddleware.js";
import { logger } from "./lib/logger.js";
// Async handler wrapper
function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res)).catch(next);
    };
}
// Rate limiter middleware
function rateLimitMiddleware(limiter) {
    return (req, res, next) => {
        const identifier = req.ip || req.socket.remoteAddress || 'unknown';
        if (!limiter.check(identifier)) {
            return res.status(429).json({
                error: 'Too many requests. Please try again in a moment.',
                retryAfter: 60
            });
        }
        next();
    };
}
// Validation schemas
const signupSchema = z.object({
    username: z.string().min(3).max(255),
    password: z.string().min(8).max(255),
    name: z.string().min(1).max(255).optional(),
    email: z.string().email().optional()
});
const loginSchema = z.object({
    username: z.string().min(1),
    password: z.string().min(1)
});
export function registerAuthRoutes(app) {
    // ============================================
    // AUTHENTICATION ROUTES
    // ============================================
    /**
     * POST /api/auth/signup
     * Create new user account with bcrypt password hashing
     */
    app.post("/api/auth/signup", rateLimitMiddleware(apiRateLimiter), asyncHandler(async (req, res) => {
        // Validate and sanitize input
        const sanitized = Sanitizer.sanitizeObject(req.body);
        const result = signupSchema.safeParse(sanitized);
        if (!result.success) {
            return res.status(400).json({
                error: 'Validation failed',
                details: result.error.flatten()
            });
        }
        const { username, password, name, email } = result.data;
        // Check if username already exists
        const existingUser = await storage.getUserByUsername(username);
        if (existingUser) {
            return res.status(409).json({
                error: 'Username already taken',
                message: 'Please choose a different username'
            });
        }
        // Hash password with bcrypt (10 rounds)
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create user
        const newUser = await storage.createUser({
            username,
            password: hashedPassword,
            name: name || username,
            email: email || null,
            role: 'user',
            isAdmin: false,
            isActive: true,
            subscriptionTier: 'free',
            subscriptionStatus: 'inactive',
            preferences: JSON.stringify({})
        });
        // Set session
        if (req.session) {
            req.session.userId = newUser.id;
            req.userId = newUser.id;
        }
        logger.info('User signed up successfully', { userId: newUser.id, username });
        // Return user data (without password)
        res.status(201).json({
            user: {
                id: newUser.id,
                username: newUser.username,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                subscriptionTier: newUser.subscriptionTier
            },
            message: 'Account created successfully'
        });
    }));
    /**
     * POST /api/auth/login
     * Authenticate user and create session
     */
    app.post("/api/auth/login", rateLimitMiddleware(apiRateLimiter), asyncHandler(async (req, res) => {
        // Validate input
        const sanitized = Sanitizer.sanitizeObject(req.body);
        const result = loginSchema.safeParse(sanitized);
        if (!result.success) {
            return res.status(400).json({
                error: 'Validation failed',
                details: result.error.flatten()
            });
        }
        const { username, password } = result.data;
        // Find user
        const user = await storage.getUserByUsername(username);
        if (!user) {
            return res.status(401).json({
                error: 'Invalid credentials',
                message: 'Username or password is incorrect'
            });
        }
        // Check if user is active
        if (!user.isActive) {
            return res.status(403).json({
                error: 'Account disabled',
                message: 'Your account has been disabled. Please contact support.'
            });
        }
        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({
                error: 'Invalid credentials',
                message: 'Username or password is incorrect'
            });
        }
        // Update last login timestamp
        await storage.updateUser(user.id, { lastLogin: new Date() });
        // Set session
        if (req.session) {
            req.session.userId = user.id;
            req.userId = user.id;
            if (user.isAdmin) {
                req.session.isAdmin = true;
            }
        }
        logger.info('User logged in successfully', { userId: user.id, username });
        // Return user data (without password)
        res.json({
            user: {
                id: user.id,
                username: user.username,
                name: user.name,
                email: user.email,
                role: user.role,
                isAdmin: user.isAdmin,
                subscriptionTier: user.subscriptionTier,
                subscriptionStatus: user.subscriptionStatus
            },
            message: 'Login successful'
        });
    }));
    /**
     * GET /api/auth/me
     * Get current authenticated user
     */
    app.get("/api/auth/me", requireAuth, asyncHandler(async (req, res) => {
        const userId = req.userId;
        const user = await storage.getUserById(userId);
        if (!user) {
            return res.status(404).json({
                error: 'User not found',
                message: 'Your account could not be found'
            });
        }
        // Return user data (without password)
        res.json({
            user: {
                id: user.id,
                username: user.username,
                name: user.name,
                email: user.email,
                role: user.role,
                isAdmin: user.isAdmin,
                subscriptionTier: user.subscriptionTier,
                subscriptionStatus: user.subscriptionStatus,
                profileImage: user.profileImage,
                preferences: user.preferences,
                createdAt: user.createdAt,
                lastLogin: user.lastLogin
            }
        });
    }));
    /**
     * POST /api/auth/logout
     * Destroy user session
     */
    app.post("/api/auth/logout", requireAuth, asyncHandler(async (req, res) => {
        const userId = req.userId;
        // Destroy session
        if (req.session) {
            req.session.destroy((err) => {
                if (err) {
                    logger.error('Session destruction failed', { error: err, userId });
                    return res.status(500).json({
                        error: 'Logout failed',
                        message: 'Could not complete logout. Please try again.'
                    });
                }
                logger.info('User logged out successfully', { userId });
                res.json({ message: 'Logout successful' });
            });
        }
        else {
            res.json({ message: 'Logout successful' });
        }
    }));
}
