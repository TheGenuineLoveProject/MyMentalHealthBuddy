"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = registerRoutes;
const routes_analytics_js_1 = require("./routes.analytics.js");
const storage_js_1 = require("../storage.js");
const schema_js_1 = require("../../shared/schema.js");
const openai_js_1 = require("./openai.js");
const validation_js_1 = require("./validation.js");
const export_js_1 = require("./export.js");
const stripe_service_js_1 = require("./stripe-service.js");
const canva_service_js_1 = require("./canva-service.js");
const authMiddleware_js_1 = require("./lib/authMiddleware.js");
const apiCache_js_1 = require("./lib/apiCache.js");
const healthCheck_js_1 = require("./lib/healthCheck.js");
const logger_js_1 = require("./lib/logger.js");
// Async handler wrapper for better error handling
function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
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
function registerRoutes(app) {
    // ============================================
    // HEALTH CHECK ENDPOINTS
    // ============================================
    // Comprehensive health check with all dependency status
    app.get("/api/health", (0, healthCheck_js_1.healthCheckHandler)(storage_js_1.storage));
    // Liveness probe - simple check that service is running
    app.get("/api/health/live", healthCheck_js_1.livenessHandler);
    // Readiness probe - check if service is ready to accept traffic
    app.get("/api/health/ready", (0, healthCheck_js_1.readinessHandler)(storage_js_1.storage));
    // ============================================
    // CSRF TOKEN ENDPOINT
    // ============================================
    // Get CSRF token - Frontend calls this to get token for secure requests
    app.get("/api/csrf-token", authMiddleware_js_1.devAuthFallback, asyncHandler(async (req, res) => {
        // Generate or retrieve CSRF token for the session
        let csrfToken = req.session?.csrfToken;
        if (!csrfToken) {
            csrfToken = (0, authMiddleware_js_1.generateCsrfToken)(req);
        }
        res.json({ csrfToken });
    }));
    // Chat endpoint with enhanced error handling and rate limiting
    app.post("/api/chat", rateLimitMiddleware(validation_js_1.chatRateLimiter), asyncHandler(async (req, res) => {
        // Validate and sanitize input
        const sanitized = validation_js_1.Sanitizer.sanitizeObject(req.body);
        const result = schema_js_1.healingRequestSchema.safeParse(sanitized);
        if (!result.success) {
            return res.status(400).json({ error: result.error.flatten() });
        }
        const userMessage = result.data.message;
        const sessionId = validation_js_1.Sanitizer.sanitizeString(req.headers["x-session-id"] || `session-${Date.now()}`);
        // Get conversation history
        const history = await storage_js_1.storage.getHealingMessagesBySessionId(sessionId);
        const chatHistory = history.map(h => [
            { role: "user", content: h.userMessage },
            { role: "assistant", content: h.aiResponse }
        ]).flat();
        // Generate AI response with enhanced error handling
        const aiResponse = await (0, openai_js_1.generateChatResponse)(userMessage, chatHistory);
        // Save the conversation
        const savedMessage = await storage_js_1.storage.createHealingMessage({
            userId: null,
            sessionId,
            userMessage,
            aiResponse,
            emotion: null,
            sentiment: null,
            tokensUsed: null,
            isHelpful: null,
            tags: null
        });
        res.json({
            id: savedMessage.id,
            reply: aiResponse,
            sessionId
        });
    }));
    // Chat history endpoint
    app.get("/api/chat/history/:sessionId", asyncHandler(async (req, res) => {
        const sessionId = validation_js_1.Sanitizer.sanitizeString(req.params.sessionId);
        if (!sessionId) {
            return res.status(400).json({ error: 'Invalid session ID' });
        }
        const messages = await storage_js_1.storage.getHealingMessagesBySessionId(sessionId);
        res.json(messages);
    }));
    // Get journals endpoint - SECURED ✅
    app.get("/api/journals", authMiddleware_js_1.devAuthFallback, authMiddleware_js_1.requireAuth, rateLimitMiddleware(validation_js_1.apiRateLimiter), asyncHandler(async (req, res) => {
        const userId = req.userId; // From session, not header
        const journals = await storage_js_1.storage.getJournalsByUserId(userId);
        res.json(journals);
    }));
    // Create journal endpoint - SECURED ✅
    app.post("/api/journals", authMiddleware_js_1.devAuthFallback, authMiddleware_js_1.requireAuth, authMiddleware_js_1.csrfProtection, rateLimitMiddleware(validation_js_1.apiRateLimiter), asyncHandler(async (req, res) => {
        const userId = req.userId; // From session, not header
        // Sanitize and validate input
        const sanitized = validation_js_1.Sanitizer.sanitizeObject({
            ...req.body,
            userId
        });
        const result = schema_js_1.insertJournalSchema.safeParse(sanitized);
        if (!result.success) {
            return res.status(400).json({ error: result.error.flatten() });
        }
        const journal = await storage_js_1.storage.createJournal(result.data);
        res.status(201).json(journal);
    }));
    // Update journal endpoint - SECURED ✅
    app.patch("/api/journals/:id", authMiddleware_js_1.devAuthFallback, authMiddleware_js_1.requireAuth, authMiddleware_js_1.csrfProtection, rateLimitMiddleware(validation_js_1.apiRateLimiter), asyncHandler(async (req, res) => {
        const id = validation_js_1.Sanitizer.sanitizeString(req.params.id);
        const userId = req.userId; // From session, not header
        if (!id) {
            return res.status(400).json({ error: 'Invalid journal ID' });
        }
        const existing = await storage_js_1.storage.getJournalById(id);
        if (!existing) {
            return res.status(404).json({ error: "Journal entry not found" });
        }
        if (existing.userId !== userId) {
            return res.status(403).json({ error: "Not authorized to update this entry" });
        }
        // Sanitize and validate partial update
        const sanitized = validation_js_1.Sanitizer.sanitizeObject(req.body);
        const result = schema_js_1.insertJournalSchema.partial().safeParse(sanitized);
        if (!result.success) {
            return res.status(400).json({ error: result.error.flatten() });
        }
        const updated = await storage_js_1.storage.updateJournal(id, result.data);
        res.json(updated);
    }));
    // Delete journal endpoint - SECURED ✅
    app.delete("/api/journals/:id", authMiddleware_js_1.devAuthFallback, authMiddleware_js_1.requireAuth, authMiddleware_js_1.csrfProtection, rateLimitMiddleware(validation_js_1.apiRateLimiter), asyncHandler(async (req, res) => {
        const id = validation_js_1.Sanitizer.sanitizeString(req.params.id);
        const userId = req.userId; // From session, not header
        if (!id) {
            return res.status(400).json({ error: 'Invalid journal ID' });
        }
        const existing = await storage_js_1.storage.getJournalById(id);
        if (!existing) {
            return res.status(404).json({ error: "Journal entry not found" });
        }
        if (existing.userId !== userId) {
            return res.status(403).json({ error: "Not authorized to delete this entry" });
        }
        await storage_js_1.storage.deleteJournal(id);
        res.status(204).send();
    }));
    // Get mood entries endpoint - SECURED ✅
    app.get("/api/moods", authMiddleware_js_1.devAuthFallback, authMiddleware_js_1.requireAuth, rateLimitMiddleware(validation_js_1.apiRateLimiter), asyncHandler(async (req, res) => {
        const userId = req.userId; // From session, not header
        const moods = await storage_js_1.storage.getMoodEntriesByUserId(userId);
        res.json(moods);
    }));
    // Create mood entry endpoint - SECURED ✅
    app.post("/api/moods", authMiddleware_js_1.devAuthFallback, authMiddleware_js_1.requireAuth, authMiddleware_js_1.csrfProtection, rateLimitMiddleware(validation_js_1.apiRateLimiter), asyncHandler(async (req, res) => {
        const userId = req.userId; // From session, not header
        // Sanitize and validate input
        const sanitized = validation_js_1.Sanitizer.sanitizeObject({
            ...req.body,
            userId
        });
        const result = schema_js_1.insertMoodEntrySchema.safeParse(sanitized);
        if (!result.success) {
            return res.status(400).json({ error: result.error.flatten() });
        }
        const moodEntry = await storage_js_1.storage.createMoodEntry(result.data);
        res.status(201).json(moodEntry);
    }));
    // Get crisis resources endpoint - PUBLIC with long caching
    app.get("/api/crisis-resources", (0, apiCache_js_1.apiCache)(apiCache_js_1.CACHE_PRESETS.PUBLIC_LONG), // 1 hour cache for static reference data
    asyncHandler(async (req, res) => {
        const country = validation_js_1.Sanitizer.sanitizeString(req.query.country || "US").toUpperCase().slice(0, 2) || "US";
        const resources = await storage_js_1.storage.getCrisisResourcesByCountry(country);
        res.json(resources);
    }));
    // Export journals endpoint - SECURED ✅ PREMIUM FEATURE
    app.get("/api/journals/export", authMiddleware_js_1.devAuthFallback, authMiddleware_js_1.requireAuth, (0, authMiddleware_js_1.requireTier)('premium', storage_js_1.storage), rateLimitMiddleware(validation_js_1.apiRateLimiter), asyncHandler(async (req, res) => {
        const userId = req.userId; // From session, not header
        const format = req.query.format || "json";
        const journals = await storage_js_1.storage.getJournalsByUserId(userId);
        if (format === "csv") {
            const csv = export_js_1.DataExporter.journalsToCSV(journals);
            res.setHeader("Content-Type", "text/csv");
            res.setHeader("Content-Disposition", `attachment; filename="journals-${Date.now()}.csv"`);
            res.send(csv);
        }
        else {
            res.setHeader("Content-Type", "application/json");
            res.setHeader("Content-Disposition", `attachment; filename="journals-${Date.now()}.json"`);
            res.json(journals);
        }
    }));
    // Export moods endpoint - SECURED ✅ PREMIUM FEATURE
    app.get("/api/moods/export", authMiddleware_js_1.devAuthFallback, authMiddleware_js_1.requireAuth, (0, authMiddleware_js_1.requireTier)('premium', storage_js_1.storage), rateLimitMiddleware(validation_js_1.apiRateLimiter), asyncHandler(async (req, res) => {
        const userId = req.userId; // From session, not header
        const format = req.query.format || "json";
        const moods = await storage_js_1.storage.getMoodEntriesByUserId(userId);
        if (format === "csv") {
            const csv = export_js_1.DataExporter.moodsToCSV(moods);
            res.setHeader("Content-Type", "text/csv");
            res.setHeader("Content-Disposition", `attachment; filename="moods-${Date.now()}.csv"`);
            res.send(csv);
        }
        else {
            res.setHeader("Content-Type", "application/json");
            res.setHeader("Content-Disposition", `attachment; filename="moods-${Date.now()}.json"`);
            res.json(moods);
        }
    }));
    // Get mood analytics endpoint - SECURED ✅ PREMIUM FEATURE
    app.get("/api/moods/analytics", authMiddleware_js_1.devAuthFallback, authMiddleware_js_1.requireAuth, (0, authMiddleware_js_1.requireTier)('premium', storage_js_1.storage), rateLimitMiddleware(validation_js_1.apiRateLimiter), asyncHandler(async (req, res) => {
        const userId = req.userId; // From session, not header
        const moods = await storage_js_1.storage.getMoodEntriesByUserId(userId);
        const analytics = export_js_1.DataExporter.generateMoodAnalytics(moods);
        const insights = export_js_1.DataExporter.generateInsights(moods);
        res.json({
            ...analytics,
            insights
        });
    }));
    // Billing Transactions endpoints - SECURED ✅
    app.get("/api/transactions/:userId", authMiddleware_js_1.devAuthFallback, authMiddleware_js_1.requireAuth, rateLimitMiddleware(validation_js_1.apiRateLimiter), asyncHandler(async (req, res) => {
        const requestedUserId = validation_js_1.Sanitizer.sanitizeString(req.params.userId);
        const authenticatedUserId = req.userId; // From session, not header
        if (!requestedUserId) {
            return res.status(400).json({ error: "User ID is required" });
        }
        // Authorization check: users can only access their own transactions
        if (requestedUserId !== authenticatedUserId) {
            return res.status(403).json({ error: "Unauthorized: You can only access your own transaction history" });
        }
        const transactions = await storage_js_1.storage.getBillingTransactionsByUserId(requestedUserId);
        res.json(transactions);
    }));
    app.get("/api/transaction/:id", authMiddleware_js_1.devAuthFallback, authMiddleware_js_1.requireAuth, rateLimitMiddleware(validation_js_1.apiRateLimiter), asyncHandler(async (req, res) => {
        const id = validation_js_1.Sanitizer.sanitizeString(req.params.id);
        const authenticatedUserId = req.userId; // From session, not header
        const transaction = await storage_js_1.storage.getBillingTransactionById(id);
        if (!transaction) {
            return res.status(404).json({ error: "Transaction not found" });
        }
        // Authorization check: users can only access their own transactions
        if (transaction.userId !== authenticatedUserId) {
            return res.status(403).json({ error: "Unauthorized: You can only access your own transactions" });
        }
        res.json(transaction);
    }));
    app.post("/api/transactions", authMiddleware_js_1.devAuthFallback, authMiddleware_js_1.requireAuth, authMiddleware_js_1.csrfProtection, rateLimitMiddleware(validation_js_1.apiRateLimiter), asyncHandler(async (req, res) => {
        const authenticatedUserId = req.userId; // From session, not header
        const sanitized = validation_js_1.Sanitizer.sanitizeObject(req.body);
        const result = schema_js_1.insertBillingTransactionSchema.safeParse(sanitized);
        if (!result.success) {
            return res.status(400).json({ error: result.error.flatten() });
        }
        // Authorization check: override userId with authenticated user to prevent forgery
        const transactionData = {
            ...result.data,
            userId: authenticatedUserId, // Force userId to be the authenticated user
            currency: result.data.currency || "USD"
        };
        const transaction = await storage_js_1.storage.createBillingTransaction(transactionData);
        res.status(201).json(transaction);
    }));
    // ============================================
    // STRIPE PAYMENT & SUBSCRIPTION ENDPOINTS
    // ============================================
    // Get subscription tier configuration
    app.get("/api/stripe/tiers", rateLimitMiddleware(validation_js_1.apiRateLimiter), asyncHandler(async (req, res) => {
        res.json(stripe_service_js_1.SUBSCRIPTION_TIERS);
    }));
    // Create subscription checkout session - SECURED ✅
    app.post("/api/stripe/create-subscription-checkout", authMiddleware_js_1.devAuthFallback, authMiddleware_js_1.requireAuth, authMiddleware_js_1.csrfProtection, rateLimitMiddleware(validation_js_1.apiRateLimiter), asyncHandler(async (req, res) => {
        const authenticatedUserId = req.userId; // From session, not header
        const { tier, successUrl, cancelUrl } = req.body;
        if (!tier || !["premium", "professional"].includes(tier)) {
            return res.status(400).json({ error: "Invalid subscription tier. Must be 'premium' or 'professional'." });
        }
        if (!successUrl || !cancelUrl) {
            return res.status(400).json({ error: "Missing successUrl or cancelUrl" });
        }
        const session = await stripe_service_js_1.StripeService.createSubscriptionCheckout(authenticatedUserId, tier, successUrl, cancelUrl);
        res.json({
            sessionId: session.id,
            url: session.url
        });
    }));
    // Create one-time payment checkout session - SECURED ✅
    app.post("/api/stripe/create-payment-checkout", authMiddleware_js_1.devAuthFallback, authMiddleware_js_1.requireAuth, authMiddleware_js_1.csrfProtection, rateLimitMiddleware(validation_js_1.apiRateLimiter), asyncHandler(async (req, res) => {
        const authenticatedUserId = req.userId; // From session, not header
        const { amount, description, successUrl, cancelUrl } = req.body;
        if (!amount || typeof amount !== "number" || amount <= 0) {
            return res.status(400).json({ error: "Invalid amount. Must be a positive number in cents." });
        }
        if (!description || typeof description !== "string") {
            return res.status(400).json({ error: "Missing or invalid description" });
        }
        if (!successUrl || !cancelUrl) {
            return res.status(400).json({ error: "Missing successUrl or cancelUrl" });
        }
        const session = await stripe_service_js_1.StripeService.createOneTimeCheckout(authenticatedUserId, amount, description, successUrl, cancelUrl);
        res.json({
            sessionId: session.id,
            url: session.url
        });
    }));
    // Get user's active subscriptions - SECURED ✅
    app.get("/api/stripe/subscriptions", authMiddleware_js_1.devAuthFallback, authMiddleware_js_1.requireAuth, rateLimitMiddleware(validation_js_1.apiRateLimiter), asyncHandler(async (req, res) => {
        const authenticatedUserId = req.userId; // From session, not header
        const subscriptions = await stripe_service_js_1.StripeService.getUserSubscriptions(authenticatedUserId);
        res.json(subscriptions);
    }));
    // Cancel subscription - SECURED ✅
    app.post("/api/stripe/cancel-subscription", authMiddleware_js_1.devAuthFallback, authMiddleware_js_1.requireAuth, authMiddleware_js_1.csrfProtection, rateLimitMiddleware(validation_js_1.apiRateLimiter), asyncHandler(async (req, res) => {
        const authenticatedUserId = req.userId; // From session, not header
        const { subscriptionId } = req.body;
        if (!subscriptionId || typeof subscriptionId !== "string") {
            return res.status(400).json({ error: "Invalid subscriptionId" });
        }
        // Authorization check: ensure user owns this subscription
        const userSubscriptions = await stripe_service_js_1.StripeService.getUserSubscriptions(authenticatedUserId);
        const ownsSubscription = userSubscriptions.some((sub) => sub.id === subscriptionId);
        if (!ownsSubscription) {
            return res.status(403).json({ error: "Not authorized to cancel this subscription" });
        }
        const subscription = await stripe_service_js_1.StripeService.cancelSubscription(subscriptionId);
        res.json(subscription);
    }));
    // Get subscription details - SECURED ✅
    app.get("/api/stripe/subscription/:id", authMiddleware_js_1.devAuthFallback, authMiddleware_js_1.requireAuth, rateLimitMiddleware(validation_js_1.apiRateLimiter), asyncHandler(async (req, res) => {
        const authenticatedUserId = req.userId; // From session, not header
        const id = validation_js_1.Sanitizer.sanitizeString(req.params.id);
        // Authorization check: verify user owns this subscription
        const userSubscriptions = await stripe_service_js_1.StripeService.getUserSubscriptions(authenticatedUserId);
        const ownsSubscription = userSubscriptions.some((sub) => sub.id === id);
        if (!ownsSubscription) {
            return res.status(403).json({ error: "Not authorized to view this subscription" });
        }
        const subscription = await stripe_service_js_1.StripeService.getSubscription(id);
        res.json(subscription);
    }));
    // Stripe webhook handler
    app.post("/api/stripe/webhook", 
    // Note: Raw body is needed for Stripe webhook signature verification
    asyncHandler(async (req, res) => {
        const sig = req.headers["stripe-signature"];
        if (!sig || typeof sig !== "string") {
            return res.status(400).json({ error: "Missing Stripe signature" });
        }
        let event;
        try {
            // Verify webhook signature
            const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
            if (webhookSecret) {
                event = stripe_service_js_1.stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
            }
            else {
                // For development: accept webhook without verification (NOT for production!)
                logger_js_1.logger.warn("Stripe webhook secret not configured - skipping signature verification");
                event = req.body;
            }
        }
        catch (err) {
            logger_js_1.logger.error("Webhook signature verification failed", err);
            return res.status(400).json({ error: `Webhook Error: ${err.message}` });
        }
        // Handle the event
        await stripe_service_js_1.StripeService.handleWebhookEvent(event);
        // Return success to acknowledge receipt
        res.json({ received: true });
    }));
    // ============================================================================
    // CANVA DESIGN & VISUAL CONTENT ROUTES
    // ============================================================================
    // Check if Canva is enabled
    app.get("/api/canva/status", asyncHandler(async (req, res) => {
        res.json({
            enabled: canva_service_js_1.canvaService.isEnabled(),
            message: canva_service_js_1.canvaService.isEnabled()
                ? "Canva API is configured and ready"
                : "Canva API credentials not configured"
        });
    }));
    // Get Canva authorization URL - SECURED ✅ PROFESSIONAL FEATURE
    app.get("/api/canva/auth-url", authMiddleware_js_1.devAuthFallback, authMiddleware_js_1.requireAuth, (0, authMiddleware_js_1.requireTier)('professional', storage_js_1.storage), rateLimitMiddleware(validation_js_1.apiRateLimiter), asyncHandler(async (req, res) => {
        if (!canva_service_js_1.canvaService.isEnabled()) {
            return res.status(503).json({ error: "Canva API not configured" });
        }
        const authenticatedUserId = req.userId; // From session, not header
        const state = `${authenticatedUserId}-${Date.now()}`;
        const authUrl = canva_service_js_1.canvaService.getAuthorizationUrl(state);
        res.json({ authUrl, state });
    }));
    // Canva OAuth callback
    app.get("/api/canva/callback", asyncHandler(async (req, res) => {
        const { code, state } = req.query;
        if (!code || typeof code !== "string") {
            return res.status(400).json({ error: "Missing authorization code" });
        }
        if (!state || typeof state !== "string") {
            return res.status(400).json({ error: "Missing state parameter" });
        }
        try {
            // Extract user ID from state
            const userId = state.split("-")[0];
            // Exchange code for tokens
            const tokens = await canva_service_js_1.canvaService.exchangeCodeForToken(code);
            // Save tokens to user record
            const expiresAt = new Date(Date.now() + tokens.expires_in * 1000);
            await storage_js_1.storage.updateUser(userId, {
                canvaAccessToken: tokens.access_token,
                canvaRefreshToken: tokens.refresh_token,
                canvaTokenExpiresAt: expiresAt
            });
            // Redirect to designs page or dashboard
            res.redirect("/designs?canva_connected=true");
        }
        catch (error) {
            logger_js_1.logger.error("Canva OAuth callback error", error instanceof Error ? error : new Error(String(error)));
            res.redirect("/designs?canva_error=true");
        }
    }));
    // Create a new design - SECURED ✅ PROFESSIONAL FEATURE
    app.post("/api/canva/designs", authMiddleware_js_1.devAuthFallback, authMiddleware_js_1.requireAuth, (0, authMiddleware_js_1.requireTier)('professional', storage_js_1.storage), authMiddleware_js_1.csrfProtection, rateLimitMiddleware(validation_js_1.apiRateLimiter), asyncHandler(async (req, res) => {
        if (!canva_service_js_1.canvaService.isEnabled()) {
            return res.status(503).json({ error: "Canva API not configured" });
        }
        const authenticatedUserId = req.userId; // From session, not header
        const { designType, title, imageUrl } = req.body;
        if (!designType) {
            return res.status(400).json({ error: "Design type is required" });
        }
        // Get user's Canva access token
        const user = await storage_js_1.storage.getUserById(authenticatedUserId);
        if (!user || !user.canvaAccessToken) {
            return res.status(401).json({ error: "Canva not connected. Please authorize first." });
        }
        // TODO: Check if token is expired and refresh if needed
        // Create design in Canva
        const design = await canva_service_js_1.canvaService.createDesign(user.canvaAccessToken, designType, title, imageUrl ? undefined : undefined // Asset upload would go here
        );
        res.json({
            canvaDesignId: design.id,
            title: design.title,
            editUrl: design.urls.edit_url,
            viewUrl: design.urls.view_url,
            thumbnail: design.thumbnail?.url
        });
    }));
    // Create social media post - SECURED ✅ PROFESSIONAL FEATURE
    app.post("/api/canva/create-social-post", authMiddleware_js_1.devAuthFallback, authMiddleware_js_1.requireAuth, (0, authMiddleware_js_1.requireTier)('professional', storage_js_1.storage), authMiddleware_js_1.csrfProtection, rateLimitMiddleware(validation_js_1.apiRateLimiter), asyncHandler(async (req, res) => {
        if (!canva_service_js_1.canvaService.isEnabled()) {
            return res.status(503).json({ error: "Canva API not configured" });
        }
        const authenticatedUserId = req.userId; // From session, not header
        const { platform, title, imageUrl } = req.body;
        if (!platform || !["instagram", "facebook", "twitter", "linkedin"].includes(platform)) {
            return res.status(400).json({ error: "Invalid platform. Must be instagram, facebook, twitter, or linkedin" });
        }
        // Get user's Canva access token
        const user = await storage_js_1.storage.getUserById(authenticatedUserId);
        if (!user || !user.canvaAccessToken) {
            return res.status(401).json({ error: "Canva not connected. Please authorize first." });
        }
        // Create social media post
        const design = await canva_service_js_1.canvaService.createSocialMediaPost(user.canvaAccessToken, platform, title || `Mental Health ${platform.charAt(0).toUpperCase() + platform.slice(1)} Post`, imageUrl);
        res.json({
            canvaDesignId: design.id,
            title: design.title,
            editUrl: design.urls.edit_url,
            viewUrl: design.urls.view_url,
            platform
        });
    }));
    // Generate mental health quote design - SECURED ✅ PROFESSIONAL FEATURE
    app.post("/api/canva/generate-quote", authMiddleware_js_1.devAuthFallback, authMiddleware_js_1.requireAuth, (0, authMiddleware_js_1.requireTier)('professional', storage_js_1.storage), authMiddleware_js_1.csrfProtection, rateLimitMiddleware(validation_js_1.apiRateLimiter), asyncHandler(async (req, res) => {
        if (!canva_service_js_1.canvaService.isEnabled()) {
            return res.status(503).json({ error: "Canva API not configured" });
        }
        const authenticatedUserId = req.userId; // From session, not header
        const { quote, author } = req.body;
        if (!quote) {
            return res.status(400).json({ error: "Quote text is required" });
        }
        const user = await storage_js_1.storage.getUserById(authenticatedUserId);
        if (!user || !user.canvaAccessToken) {
            return res.status(401).json({ error: "Canva not connected. Please authorize first." });
        }
        const design = await canva_service_js_1.canvaService.generateMentalHealthQuote(user.canvaAccessToken, quote, author);
        res.json({
            canvaDesignId: design.id,
            title: design.title,
            editUrl: design.urls.edit_url,
            viewUrl: design.urls.view_url
        });
    }));
    // Generate mood visualization - SECURED ✅ PROFESSIONAL FEATURE
    app.post("/api/canva/generate-mood-visual", authMiddleware_js_1.devAuthFallback, authMiddleware_js_1.requireAuth, (0, authMiddleware_js_1.requireTier)('professional', storage_js_1.storage), authMiddleware_js_1.csrfProtection, rateLimitMiddleware(validation_js_1.apiRateLimiter), asyncHandler(async (req, res) => {
        if (!canva_service_js_1.canvaService.isEnabled()) {
            return res.status(503).json({ error: "Canva API not configured" });
        }
        const authenticatedUserId = req.userId; // From session, not header
        const { mood, intensity, date } = req.body;
        if (!mood || !intensity) {
            return res.status(400).json({ error: "Mood and intensity are required" });
        }
        const user = await storage_js_1.storage.getUserById(authenticatedUserId);
        if (!user || !user.canvaAccessToken) {
            return res.status(401).json({ error: "Canva not connected. Please authorize first." });
        }
        const design = await canva_service_js_1.canvaService.generateMoodVisualization(user.canvaAccessToken, mood, intensity, date || new Date().toISOString().split("T")[0]);
        res.json({
            canvaDesignId: design.id,
            title: design.title,
            editUrl: design.urls.edit_url,
            viewUrl: design.urls.view_url
        });
    }));
    // Export design - SECURED ✅ PROFESSIONAL FEATURE
    app.post("/api/canva/export/:designId", authMiddleware_js_1.devAuthFallback, authMiddleware_js_1.requireAuth, (0, authMiddleware_js_1.requireTier)('professional', storage_js_1.storage), authMiddleware_js_1.csrfProtection, rateLimitMiddleware(validation_js_1.apiRateLimiter), asyncHandler(async (req, res) => {
        if (!canva_service_js_1.canvaService.isEnabled()) {
            return res.status(503).json({ error: "Canva API not configured" });
        }
        const authenticatedUserId = req.userId; // From session, not header
        const designId = validation_js_1.Sanitizer.sanitizeString(req.params.designId);
        const { format } = req.body;
        if (!["PNG", "JPG", "PDF"].includes(format)) {
            return res.status(400).json({ error: "Invalid format. Must be PNG, JPG, or PDF" });
        }
        const user = await storage_js_1.storage.getUserById(authenticatedUserId);
        if (!user || !user.canvaAccessToken) {
            return res.status(401).json({ error: "Canva not connected. Please authorize first." });
        }
        const exportJob = await canva_service_js_1.canvaService.exportDesign(user.canvaAccessToken, designId, format);
        res.json({
            jobId: exportJob.job.id,
            status: exportJob.job.status,
            urls: exportJob.urls
        });
    }));
    // Get design templates
    app.get("/api/canva/templates", asyncHandler(async (req, res) => {
        const templates = canva_service_js_1.canvaService.getDesignTemplates();
        res.json(templates);
    }));
    // List user designs - SECURED ✅ PROFESSIONAL FEATURE
    app.get("/api/canva/designs", authMiddleware_js_1.devAuthFallback, authMiddleware_js_1.requireAuth, (0, authMiddleware_js_1.requireTier)('professional', storage_js_1.storage), rateLimitMiddleware(validation_js_1.apiRateLimiter), asyncHandler(async (req, res) => {
        if (!canva_service_js_1.canvaService.isEnabled()) {
            return res.status(503).json({ error: "Canva API not configured" });
        }
        const authenticatedUserId = req.userId; // From session, not header
        const user = await storage_js_1.storage.getUserById(authenticatedUserId);
        if (!user || !user.canvaAccessToken) {
            return res.status(401).json({ error: "Canva not connected. Please authorize first." });
        }
        const designs = await canva_service_js_1.canvaService.listUserDesigns(user.canvaAccessToken);
        res.json({ designs });
    }));
    // Error Tracking Endpoint
    app.post("/api/errors", asyncHandler(async (req, res) => {
        const errorData = validation_js_1.Sanitizer.sanitizeObject(req.body);
        // Log frontend errors
        logger_js_1.logger.error('Frontend Error Captured', {
            message: errorData.message,
            stack: errorData.stack,
            url: errorData.url,
            timestamp: errorData.timestamp,
            userAgent: errorData.userAgent
        });
        // In production, this would forward to external error tracking service
        // Example integrations:
        // - Sentry: Sentry.captureException(new Error(errorData.message))
        // - DataDog: logger.error(errorData.message, errorData)
        // - LogRocket: LogRocket.captureException(new Error(errorData.message))
        // Store error count for monitoring dashboard (optional)
        // await storage.incrementErrorCount(errorData);
        res.status(200).json({
            success: true,
            message: 'Error logged successfully',
            errorId: `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        });
    }));
    // Performance Analytics Endpoint
    app.post("/api/performance", asyncHandler(async (req, res) => {
        const metricsData = validation_js_1.Sanitizer.sanitizeObject(req.body);
        // Log Web Vitals metrics
        logger_js_1.logger.info('Performance Metrics', {
            metrics: metricsData.metrics,
            page: metricsData.page,
            timestamp: metricsData.timestamp,
            userAgent: metricsData.userAgent
        });
        // In production, forward to analytics service
        // Example integrations:
        // - Google Analytics: gtag('event', 'web_vitals', metricsData)
        // - PostHog: posthog.capture('web_vitals', metricsData)
        // - Plausible: plausible('Web Vitals', { props: metricsData})
        // Store metrics for performance dashboard (optional)
        // await storage.savePerformanceMetrics(metricsData);
        res.status(200).json({
            success: true,
            message: 'Metrics logged successfully'
        });
    }));
    // ============================================
    // SOCIAL MEDIA MANAGEMENT - 360° PLATFORM
    // ============================================
    // Get connected social media accounts
    app.get("/api/social/accounts", authMiddleware_js_1.devAuthFallback, authMiddleware_js_1.requireAuth, asyncHandler(async (req, res) => {
        const userId = req.userId;
        const accounts = await storage_js_1.storage.getSocialAccountsByUserId(userId);
        res.json(accounts);
    }));
    // Connect new social media account
    app.post("/api/social/accounts", authMiddleware_js_1.devAuthFallback, authMiddleware_js_1.requireAuth, authMiddleware_js_1.csrfProtection, asyncHandler(async (req, res) => {
        const userId = req.userId;
        const accountData = validation_js_1.Sanitizer.sanitizeObject(req.body);
        const account = await storage_js_1.storage.createSocialAccount({
            ...accountData,
            userId,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        res.status(201).json(account);
    }));
    // Get social media profiles for an account
    app.get("/api/social/accounts/:accountId/profiles", authMiddleware_js_1.devAuthFallback, authMiddleware_js_1.requireAuth, asyncHandler(async (req, res) => {
        const { accountId } = req.params;
        const profiles = await storage_js_1.storage.getSocialProfilesByAccountId(accountId);
        res.json(profiles);
    }));
    // Get all social media posts
    app.get("/api/social/posts", authMiddleware_js_1.devAuthFallback, authMiddleware_js_1.requireAuth, asyncHandler(async (req, res) => {
        const userId = req.userId;
        const posts = await storage_js_1.storage.getSocialPostsByUserId(userId);
        res.json(posts);
    }));
    // Create new social media post
    app.post("/api/social/posts", authMiddleware_js_1.devAuthFallback, authMiddleware_js_1.requireAuth, authMiddleware_js_1.csrfProtection, asyncHandler(async (req, res) => {
        const userId = req.userId;
        const postData = validation_js_1.Sanitizer.sanitizeObject(req.body);
        const post = await storage_js_1.storage.createSocialPost({
            ...postData,
            userId,
            status: 'published',
            publishedAt: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        res.status(201).json(post);
    }));
    // ============================================
    // AI IMAGE GENERATION - 360° PLATFORM
    // ============================================
    // Get user's media assets
    app.get("/api/media/assets", authMiddleware_js_1.devAuthFallback, authMiddleware_js_1.requireAuth, asyncHandler(async (req, res) => {
        const userId = req.userId;
        const assets = await storage_js_1.storage.getMediaAssetsByUserId(userId);
        res.json(assets);
    }));
    // Generate AI image
    app.post("/api/media/generate", authMiddleware_js_1.devAuthFallback, authMiddleware_js_1.requireAuth, authMiddleware_js_1.csrfProtection, asyncHandler(async (req, res) => {
        const userId = req.userId;
        const { prompt, size, quality } = validation_js_1.Sanitizer.sanitizeObject(req.body);
        // Create AI run tracking
        const aiRun = await storage_js_1.storage.createAiRun({
            userId,
            model: 'gpt-image-1',
            runType: 'image_generation',
            inputPrompt: prompt,
            status: 'pending',
            tokensUsed: 0,
            creditsUsed: '0.02',
            metadata: { size, quality },
            createdAt: new Date(),
        });
        res.status(202).json({
            message: 'Image generation started',
            runId: aiRun.id
        });
    }));
    // ============================================
    // AI PROMPTS MANAGEMENT - 360° PLATFORM
    // ============================================
    // Get AI prompts
    app.get("/api/ai/prompts", authMiddleware_js_1.devAuthFallback, authMiddleware_js_1.requireAuth, asyncHandler(async (req, res) => {
        const userId = req.userId;
        const { category } = req.query;
        const prompts = category
            ? await storage_js_1.storage.getAiPromptsByCategory(category)
            : await storage_js_1.storage.getAiPromptsByUserId(userId);
        res.json(prompts);
    }));
    // Create AI prompt template
    app.post("/api/ai/prompts", authMiddleware_js_1.devAuthFallback, authMiddleware_js_1.requireAuth, authMiddleware_js_1.csrfProtection, asyncHandler(async (req, res) => {
        const userId = req.userId;
        const promptData = validation_js_1.Sanitizer.sanitizeObject(req.body);
        const prompt = await storage_js_1.storage.createAiPrompt({
            ...promptData,
            userId,
            usageCount: 0,
            avgQualityScore: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        res.status(201).json(prompt);
    }));
    // Generate AI content
    app.post("/api/ai/generate-content", rateLimitMiddleware(validation_js_1.chatRateLimiter), asyncHandler(async (req, res) => {
        const { prompt, contentType, tone, length } = validation_js_1.Sanitizer.sanitizeObject(req.body);
        if (!prompt || typeof prompt !== 'string') {
            return res.status(400).json({ error: 'Prompt is required' });
        }
        const wordCounts = {
            short: 100,
            medium: 250,
            long: 500
        };
        const targetWords = wordCounts[length] || 250;
        const systemPrompts = {
            journal: 'Generate a thoughtful, introspective journal entry that encourages self-reflection and emotional awareness.',
            social: 'Create an engaging, authentic social media post that connects with the audience.',
            email: 'Write a professional, clear, and concise email.',
            blog: 'Create an informative, well-structured blog post with clear sections.',
            general: 'Generate helpful, relevant content based on the user\'s request.'
        };
        const systemPrompt = systemPrompts[contentType] || systemPrompts.general;
        const toneInstruction = tone ? `Write in a ${tone} tone.` : '';
        const fullPrompt = `${systemPrompt} ${toneInstruction} Target length: approximately ${targetWords} words.\n\nUser request: ${prompt}`;
        const content = await (0, openai_js_1.generateChatResponse)(fullPrompt, []);
        res.json({ content });
    }));
    // ============================================
    // KNOWLEDGE MANAGEMENT - SELF-EVOLVING AI
    // ============================================
    // Get knowledge sources
    app.get("/api/knowledge/sources", authMiddleware_js_1.devAuthFallback, authMiddleware_js_1.requireAuth, asyncHandler(async (req, res) => {
        const userId = req.userId;
        const sources = await storage_js_1.storage.getKnowledgeSourcesByUserId(userId);
        res.json(sources);
    }));
    // Ingest new knowledge
    app.post("/api/knowledge/ingest", authMiddleware_js_1.devAuthFallback, authMiddleware_js_1.requireAuth, authMiddleware_js_1.csrfProtection, asyncHandler(async (req, res) => {
        const userId = req.userId;
        const { title, content, sourceType, url, category } = validation_js_1.Sanitizer.sanitizeObject(req.body);
        const source = await storage_js_1.storage.createKnowledgeSource({
            userId,
            title,
            sourceType,
            sourceUrl: url || null,
            category: category || null,
            status: 'active',
            language: 'en',
            credibilityScore: '3.00',
            metadata: { wordCount: content.split(/\s+/).length },
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        res.status(201).json(source);
    }));
    // Get knowledge chunks for a source
    app.get("/api/knowledge/sources/:sourceId/chunks", authMiddleware_js_1.devAuthFallback, authMiddleware_js_1.requireAuth, asyncHandler(async (req, res) => {
        const { sourceId } = req.params;
        const chunks = await storage_js_1.storage.getKnowledgeChunksBySourceId(sourceId);
        res.json(chunks);
    }));
    // ============================================
    // AI USAGE TRACKING & ANALYTICS
    // ============================================
    // Get AI usage statistics
    app.get("/api/ai/usage", authMiddleware_js_1.devAuthFallback, authMiddleware_js_1.requireAuth, asyncHandler(async (req, res) => {
        const userId = req.userId;
        const usage = await storage_js_1.storage.getAiUsageByUserId(userId);
        res.json(usage);
    }));
    // Track AI usage
    app.post("/api/ai/usage", authMiddleware_js_1.devAuthFallback, authMiddleware_js_1.requireAuth, authMiddleware_js_1.csrfProtection, asyncHandler(async (req, res) => {
        const userId = req.userId;
        const usageData = validation_js_1.Sanitizer.sanitizeObject(req.body);
        const usage = await storage_js_1.storage.createAiUsageTracking({
            userId,
            date: new Date(),
            feature: usageData.feature,
            model: usageData.model || null,
            requestCount: usageData.requestCount || 1,
            tokensUsed: usageData.tokensUsed || 0,
            creditsUsed: usageData.creditsUsed || '0',
            successCount: usageData.successCount || 1,
            failureCount: usageData.failureCount || 0,
            metadata: usageData.metadata || {},
        });
        res.status(201).json(usage);
    }));
    // Monitoring Dashboard Data Endpoint
    app.get("/api/monitoring/stats", rateLimitMiddleware(validation_js_1.apiRateLimiter), asyncHandler(async (req, res) => {
        // Return real-time monitoring statistics
        // In production, this would query stored error/performance data
        res.json({
            errors: {
                total: 0,
                last24h: 0,
                criticalCount: 0
            },
            performance: {
                avgLCP: 0,
                avgINP: 0,
                avgCLS: 0,
                avgFCP: 0,
                avgTTFB: 0
            },
            uptime: process.uptime(),
            timestamp: new Date().toISOString()
        });
    }));
    // ============================================
    // ADVANCED SEARCH API - Full-Text Search with Relevance Scoring
    // ============================================
    // Comprehensive search across all content
    app.get("/api/search", authMiddleware_js_1.devAuthFallback, authMiddleware_js_1.optionalAuth, rateLimitMiddleware(validation_js_1.apiRateLimiter), asyncHandler(async (req, res) => {
        const { SearchService } = await Promise.resolve().then(() => __importStar(require("./services/searchService.js")));
        const searchService = new SearchService(storage_js_1.storage);
        const query = validation_js_1.Sanitizer.sanitizeString(req.query.q || '');
        const types = req.query.types
            ? req.query.types.split(',').map(t => validation_js_1.Sanitizer.sanitizeString(t))
            : undefined;
        const limit = parseInt(req.query.limit || '20', 10);
        const offset = parseInt(req.query.offset || '0', 10);
        const userId = req.userId ? req.userId.toString() : null;
        const results = await searchService.search({
            query,
            types,
            limit,
            offset,
            userId
        });
        res.json(results);
    }));
    // Autocomplete suggestions
    app.get("/api/search/autocomplete", rateLimitMiddleware(validation_js_1.apiRateLimiter), asyncHandler(async (req, res) => {
        const { SearchService } = await Promise.resolve().then(() => __importStar(require("./services/searchService.js")));
        const searchService = new SearchService(storage_js_1.storage);
        const query = validation_js_1.Sanitizer.sanitizeString(req.query.q || '');
        const limit = parseInt(req.query.limit || '5', 10);
        const suggestions = await searchService.autocomplete(query, limit);
        res.json({ suggestions });
    }));
    // Trending search queries
    app.get("/api/search/trending", rateLimitMiddleware(validation_js_1.apiRateLimiter), asyncHandler(async (req, res) => {
        const { SearchService } = await Promise.resolve().then(() => __importStar(require("./services/searchService.js")));
        const searchService = new SearchService(storage_js_1.storage);
        const limit = parseInt(req.query.limit || '10', 10);
        const trending = await searchService.getTrending(limit);
        res.json({ trending });
    }));
    // ============================================
    // BACKUP & RESTORE ENDPOINTS
    // ============================================
    // Create backup
    app.post("/api/backups", authMiddleware_js_1.devAuthFallback, authMiddleware_js_1.requireAuth, authMiddleware_js_1.csrfProtection, asyncHandler(async (req, res) => {
        const userId = req.userId.toString();
        const { backupService } = await Promise.resolve().then(() => __importStar(require("./services/backupService.js")));
        const backup = await backupService.createBackup(userId, 'full');
        res.status(201).json(backup);
    }));
    // List backups
    app.get("/api/backups", authMiddleware_js_1.devAuthFallback, authMiddleware_js_1.requireAuth, asyncHandler(async (req, res) => {
        const userId = req.userId.toString();
        const { backupService } = await Promise.resolve().then(() => __importStar(require("./services/backupService.js")));
        const backups = await backupService.listBackups(userId);
        res.json(backups);
    }));
    // Get backup stats
    app.get("/api/backups/stats", authMiddleware_js_1.devAuthFallback, authMiddleware_js_1.requireAuth, asyncHandler(async (req, res) => {
        const { backupService } = await Promise.resolve().then(() => __importStar(require("./services/backupService.js")));
        const stats = await backupService.getBackupStats();
        res.json(stats);
    }));
    // Restore backup
    app.post("/api/backups/:backupId/restore", authMiddleware_js_1.devAuthFallback, authMiddleware_js_1.requireAuth, authMiddleware_js_1.csrfProtection, asyncHandler(async (req, res) => {
        const { backupId } = req.params;
        const userId = req.userId.toString();
        const { backupService } = await Promise.resolve().then(() => __importStar(require("./services/backupService.js")));
        // Verify backup ownership with exact prefix match
        const expectedPrefix = `backup-${userId}-`;
        if (!backupId.startsWith(expectedPrefix)) {
            return res.status(403).json({ error: 'Forbidden: You do not own this backup' });
        }
        await backupService.restoreBackup(backupId);
        res.json({ message: 'Backup restored successfully' });
    }));
    // Delete backup
    app.delete("/api/backups/:backupId", authMiddleware_js_1.devAuthFallback, authMiddleware_js_1.requireAuth, authMiddleware_js_1.csrfProtection, asyncHandler(async (req, res) => {
        const { backupId } = req.params;
        const userId = req.userId.toString();
        const { backupService } = await Promise.resolve().then(() => __importStar(require("./services/backupService.js")));
        // Verify backup ownership with exact prefix match
        const expectedPrefix = `backup-${userId}-`;
        if (!backupId.startsWith(expectedPrefix)) {
            return res.status(403).json({ error: 'Forbidden: You do not own this backup' });
        }
        await backupService.deleteBackup(backupId);
        res.json({ message: 'Backup deleted successfully' });
    }));
    // ============================================
    // PERFORMANCE MONITORING ENDPOINTS - ADMIN ONLY
    // ============================================
    // Get performance stats (Admin only)
    app.get("/api/admin/performance/stats", authMiddleware_js_1.devAuthFallback, authMiddleware_js_1.requireAuth, asyncHandler(async (req, res) => {
        // Check if user is admin
        const user = await storage_js_1.storage.getUserById(req.userId.toString());
        if (!user || !user.isAdmin) {
            return res.status(403).json({ error: 'Forbidden: Admin access required' });
        }
        const { performanceMonitor } = await Promise.resolve().then(() => __importStar(require("./services/performanceMonitor.js")));
        const stats = performanceMonitor.getStats();
        res.json(stats);
    }));
    // Get slowest routes (Admin only)
    app.get("/api/admin/performance/slow-routes", authMiddleware_js_1.devAuthFallback, authMiddleware_js_1.requireAuth, asyncHandler(async (req, res) => {
        // Check if user is admin
        const user = await storage_js_1.storage.getUserById(req.userId.toString());
        if (!user || !user.isAdmin) {
            return res.status(403).json({ error: 'Forbidden: Admin access required' });
        }
        const { performanceMonitor } = await Promise.resolve().then(() => __importStar(require("./services/performanceMonitor.js")));
        const limit = parseInt(req.query.limit || '10', 10);
        const slowRoutes = performanceMonitor.getSlowestRoutes(limit);
        res.json(slowRoutes);
    }));
    // Auto-added: Analytics endpoints
    try {
        (0, routes_analytics_js_1.registerAnalytics)(app);
    }
    catch { /* noop */ }
}
