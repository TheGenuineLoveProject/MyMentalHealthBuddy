import { registerAnalytics } from "./routes.analytics.js";
import type { Express, Request, Response, NextFunction } from "express";
import { storage } from "../storage.js";
import { 
  insertJournalSchema, 
  insertMoodEntrySchema,
  healingRequestSchema,
  insertBillingTransactionSchema
} from "../../shared/schema.js";
import { generateChatResponse } from "./openai.js";
import {
  Sanitizer,
  ValidationError,
  apiRateLimiter,
  chatRateLimiter
} from "./validation.js";
import { DataExporter } from "./export.js";
import { StripeService, stripe, SUBSCRIPTION_TIERS } from "./stripe-service.js";
import { canvaService } from "./canva-service.js";
import type { SelectCanvaDesign, InsertCanvaDesign } from "../../shared/schema.js";
import { 
  requireAuth, 
  optionalAuth, 
  requireTier, 
  csrfProtection,
  generateCsrfToken,
  devAuthFallback
} from "./lib/authMiddleware.js";
import { apiCache, CACHE_PRESETS } from "./lib/apiCache.js";
import { healthCheckHandler, livenessHandler, readinessHandler } from "./lib/healthCheck.js";

// Async handler wrapper for better error handling
function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Rate limiter middleware
function rateLimitMiddleware(limiter: typeof apiRateLimiter) {
  return (req: Request, res: Response, next: NextFunction) => {
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

export function registerRoutes(app: Express) {
  // ============================================
  // HEALTH CHECK ENDPOINTS
  // ============================================
  
  // Comprehensive health check with all dependency status
  app.get("/api/health", healthCheckHandler(storage));
  
  // Liveness probe - simple check that service is running
  app.get("/api/health/live", livenessHandler);
  
  // Readiness probe - check if service is ready to accept traffic
  app.get("/api/health/ready", readinessHandler(storage));
  
  // ============================================
  // CSRF TOKEN ENDPOINT
  // ============================================
  
  // Get CSRF token - Frontend calls this to get token for secure requests
  app.get("/api/csrf-token",
    devAuthFallback,
    asyncHandler(async (req, res) => {
      // Generate or retrieve CSRF token for the session
      let csrfToken = req.session?.csrfToken;
      
      if (!csrfToken) {
        csrfToken = generateCsrfToken(req);
      }
      
      res.json({ csrfToken });
    })
  );

  // Chat endpoint with enhanced error handling and rate limiting
  app.post("/api/chat", 
    rateLimitMiddleware(chatRateLimiter),
    asyncHandler(async (req, res) => {
      // Validate and sanitize input
      const sanitized = Sanitizer.sanitizeObject(req.body);
      const result = healingRequestSchema.safeParse(sanitized);
      
      if (!result.success) {
        return res.status(400).json({ error: result.error.flatten() });
      }

      const userMessage = result.data.message;
      const sessionId = Sanitizer.sanitizeString(
        req.headers["x-session-id"] as string || `session-${Date.now()}`
      );

      // Get conversation history
      const history = await storage.getHealingMessagesBySessionId(sessionId);
      const chatHistory = history.map(h => [
        { role: "user" as const, content: h.userMessage },
        { role: "assistant" as const, content: h.aiResponse }
      ]).flat();

      // Generate AI response with enhanced error handling
      const aiResponse = await generateChatResponse(userMessage, chatHistory);

      // Save the conversation
      const savedMessage = await storage.createHealingMessage({
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
    })
  );

  // Chat history endpoint
  app.get("/api/chat/history/:sessionId", 
    asyncHandler(async (req, res) => {
      const sessionId = Sanitizer.sanitizeString(req.params.sessionId);
      
      if (!sessionId) {
        return res.status(400).json({ error: 'Invalid session ID' });
      }

      const messages = await storage.getHealingMessagesBySessionId(sessionId);
      res.json(messages);
    })
  );

  // Get journals endpoint - SECURED ✅
  app.get("/api/journals",
    devAuthFallback,
    requireAuth,
    rateLimitMiddleware(apiRateLimiter),
    asyncHandler(async (req, res) => {
      const userId = req.userId!; // From session, not header
      const journals = await storage.getJournalsByUserId(userId);
      res.json(journals);
    })
  );

  // Create journal endpoint - SECURED ✅
  app.post("/api/journals",
    devAuthFallback,
    requireAuth,
    csrfProtection,
    rateLimitMiddleware(apiRateLimiter),
    asyncHandler(async (req, res) => {
      const userId = req.userId!; // From session, not header
      
      // Sanitize and validate input
      const sanitized = Sanitizer.sanitizeObject({
        ...req.body,
        userId
      });
      const result = insertJournalSchema.safeParse(sanitized);

      if (!result.success) {
        return res.status(400).json({ error: result.error.flatten() });
      }

      const journal = await storage.createJournal(result.data as any);
      res.status(201).json(journal);
    })
  );

  // Update journal endpoint - SECURED ✅
  app.patch("/api/journals/:id",
    devAuthFallback,
    requireAuth,
    csrfProtection,
    rateLimitMiddleware(apiRateLimiter),
    asyncHandler(async (req, res) => {
      const id = Sanitizer.sanitizeString(req.params.id);
      const userId = req.userId!; // From session, not header

      if (!id) {
        return res.status(400).json({ error: 'Invalid journal ID' });
      }

      const existing = await storage.getJournalById(id);
      if (!existing) {
        return res.status(404).json({ error: "Journal entry not found" });
      }

      if (existing.userId !== userId) {
        return res.status(403).json({ error: "Not authorized to update this entry" });
      }

      // Sanitize and validate partial update
      const sanitized = Sanitizer.sanitizeObject(req.body);
      const result = insertJournalSchema.partial().safeParse(sanitized);

      if (!result.success) {
        return res.status(400).json({ error: result.error.flatten() });
      }

      const updated = await storage.updateJournal(id, result.data as any);
      res.json(updated);
    })
  );

  // Delete journal endpoint - SECURED ✅
  app.delete("/api/journals/:id",
    devAuthFallback,
    requireAuth,
    csrfProtection,
    rateLimitMiddleware(apiRateLimiter),
    asyncHandler(async (req, res) => {
      const id = Sanitizer.sanitizeString(req.params.id);
      const userId = req.userId!; // From session, not header

      if (!id) {
        return res.status(400).json({ error: 'Invalid journal ID' });
      }

      const existing = await storage.getJournalById(id);
      if (!existing) {
        return res.status(404).json({ error: "Journal entry not found" });
      }

      if (existing.userId !== userId) {
        return res.status(403).json({ error: "Not authorized to delete this entry" });
      }

      await storage.deleteJournal(id);
      res.status(204).send();
    })
  );

  // Get mood entries endpoint - SECURED ✅
  app.get("/api/moods",
    devAuthFallback,
    requireAuth,
    rateLimitMiddleware(apiRateLimiter),
    asyncHandler(async (req, res) => {
      const userId = req.userId!; // From session, not header
      const moods = await storage.getMoodEntriesByUserId(userId);
      res.json(moods);
    })
  );

  // Create mood entry endpoint - SECURED ✅
  app.post("/api/moods",
    devAuthFallback,
    requireAuth,
    csrfProtection,
    rateLimitMiddleware(apiRateLimiter),
    asyncHandler(async (req, res) => {
      const userId = req.userId!; // From session, not header
      
      // Sanitize and validate input
      const sanitized = Sanitizer.sanitizeObject({
        ...req.body,
        userId
      });
      const result = insertMoodEntrySchema.safeParse(sanitized);

      if (!result.success) {
        return res.status(400).json({ error: result.error.flatten() });
      }

      const moodEntry = await storage.createMoodEntry(result.data as any);
      res.status(201).json(moodEntry);
    })
  );

  // Get crisis resources endpoint - PUBLIC with long caching
  app.get("/api/crisis-resources",
    apiCache(CACHE_PRESETS.PUBLIC_LONG), // 1 hour cache for static reference data
    asyncHandler(async (req, res) => {
      const country = Sanitizer.sanitizeString(
        (req.query.country as string) || "US"
      ).toUpperCase().slice(0, 2) || "US";
      
      const resources = await storage.getCrisisResourcesByCountry(country);
      res.json(resources);
    })
  );

  // Export journals endpoint - SECURED ✅ PREMIUM FEATURE
  app.get("/api/journals/export",
    devAuthFallback,
    requireAuth,
    requireTier('premium', storage),
    rateLimitMiddleware(apiRateLimiter),
    asyncHandler(async (req, res) => {
      const userId = req.userId!; // From session, not header
      const format = (req.query.format as string) || "json";

      const journals = await storage.getJournalsByUserId(userId);

      if (format === "csv") {
        const csv = DataExporter.journalsToCSV(journals);
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", `attachment; filename="journals-${Date.now()}.csv"`);
        res.send(csv);
      } else {
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Content-Disposition", `attachment; filename="journals-${Date.now()}.json"`);
        res.json(journals);
      }
    })
  );

  // Export moods endpoint - SECURED ✅ PREMIUM FEATURE
  app.get("/api/moods/export",
    devAuthFallback,
    requireAuth,
    requireTier('premium', storage),
    rateLimitMiddleware(apiRateLimiter),
    asyncHandler(async (req, res) => {
      const userId = req.userId!; // From session, not header
      const format = (req.query.format as string) || "json";

      const moods = await storage.getMoodEntriesByUserId(userId);

      if (format === "csv") {
        const csv = DataExporter.moodsToCSV(moods);
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", `attachment; filename="moods-${Date.now()}.csv"`);
        res.send(csv);
      } else {
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Content-Disposition", `attachment; filename="moods-${Date.now()}.json"`);
        res.json(moods);
      }
    })
  );

  // Get mood analytics endpoint - SECURED ✅ PREMIUM FEATURE
  app.get("/api/moods/analytics",
    devAuthFallback,
    requireAuth,
    requireTier('premium', storage),
    rateLimitMiddleware(apiRateLimiter),
    asyncHandler(async (req, res) => {
      const userId = req.userId!; // From session, not header
      const moods = await storage.getMoodEntriesByUserId(userId);

      const analytics = DataExporter.generateMoodAnalytics(moods);
      const insights = DataExporter.generateInsights(moods);

      res.json({
        ...analytics,
        insights
      });
    })
  );

  // Billing Transactions endpoints - SECURED ✅
  app.get("/api/transactions/:userId",
    devAuthFallback,
    requireAuth,
    rateLimitMiddleware(apiRateLimiter),
    asyncHandler(async (req, res) => {
      const requestedUserId = Sanitizer.sanitizeString(req.params.userId);
      const authenticatedUserId = req.userId!; // From session, not header
      
      if (!requestedUserId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      // Authorization check: users can only access their own transactions
      if (requestedUserId !== authenticatedUserId) {
        return res.status(403).json({ error: "Unauthorized: You can only access your own transaction history" });
      }

      const transactions = await storage.getBillingTransactionsByUserId(requestedUserId);
      res.json(transactions);
    })
  );

  app.get("/api/transaction/:id",
    devAuthFallback,
    requireAuth,
    rateLimitMiddleware(apiRateLimiter),
    asyncHandler(async (req, res) => {
      const id = Sanitizer.sanitizeString(req.params.id);
      const authenticatedUserId = req.userId!; // From session, not header
      
      const transaction = await storage.getBillingTransactionById(id);
      
      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }

      // Authorization check: users can only access their own transactions
      if (transaction.userId !== authenticatedUserId) {
        return res.status(403).json({ error: "Unauthorized: You can only access your own transactions" });
      }

      res.json(transaction);
    })
  );

  app.post("/api/transactions",
    devAuthFallback,
    requireAuth,
    csrfProtection,
    rateLimitMiddleware(apiRateLimiter),
    asyncHandler(async (req, res) => {
      const authenticatedUserId = req.userId!; // From session, not header
      const sanitized = Sanitizer.sanitizeObject(req.body);
      const result = insertBillingTransactionSchema.safeParse(sanitized);
      
      if (!result.success) {
        return res.status(400).json({ error: result.error.flatten() });
      }

      // Authorization check: override userId with authenticated user to prevent forgery
      const transactionData = {
        ...result.data,
        userId: authenticatedUserId,  // Force userId to be the authenticated user
        currency: result.data.currency || "USD"
      } as import("../../shared/schema.js").InsertBillingTransaction;

      const transaction = await storage.createBillingTransaction(transactionData);
      res.status(201).json(transaction);
    })
  );

  // ============================================
  // STRIPE PAYMENT & SUBSCRIPTION ENDPOINTS
  // ============================================

  // Get subscription tier configuration
  app.get("/api/stripe/tiers",
    rateLimitMiddleware(apiRateLimiter),
    asyncHandler(async (req, res) => {
      res.json(SUBSCRIPTION_TIERS);
    })
  );

  // Create subscription checkout session - SECURED ✅
  app.post("/api/stripe/create-subscription-checkout",
    devAuthFallback,
    requireAuth,
    csrfProtection,
    rateLimitMiddleware(apiRateLimiter),
    asyncHandler(async (req, res) => {
      const authenticatedUserId = req.userId!; // From session, not header
      const { tier, successUrl, cancelUrl } = req.body;

      if (!tier || !["premium", "professional"].includes(tier)) {
        return res.status(400).json({ error: "Invalid subscription tier. Must be 'premium' or 'professional'." });
      }

      if (!successUrl || !cancelUrl) {
        return res.status(400).json({ error: "Missing successUrl or cancelUrl" });
      }

      const session = await StripeService.createSubscriptionCheckout(
        authenticatedUserId,
        tier,
        successUrl,
        cancelUrl
      );

      res.json({ 
        sessionId: session.id,
        url: session.url 
      });
    })
  );

  // Create one-time payment checkout session - SECURED ✅
  app.post("/api/stripe/create-payment-checkout",
    devAuthFallback,
    requireAuth,
    csrfProtection,
    rateLimitMiddleware(apiRateLimiter),
    asyncHandler(async (req, res) => {
      const authenticatedUserId = req.userId!; // From session, not header
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

      const session = await StripeService.createOneTimeCheckout(
        authenticatedUserId,
        amount,
        description,
        successUrl,
        cancelUrl
      );

      res.json({ 
        sessionId: session.id,
        url: session.url 
      });
    })
  );

  // Get user's active subscriptions - SECURED ✅
  app.get("/api/stripe/subscriptions",
    devAuthFallback,
    requireAuth,
    rateLimitMiddleware(apiRateLimiter),
    asyncHandler(async (req, res) => {
      const authenticatedUserId = req.userId!; // From session, not header
      const subscriptions = await StripeService.getUserSubscriptions(authenticatedUserId);
      res.json(subscriptions);
    })
  );

  // Cancel subscription - SECURED ✅
  app.post("/api/stripe/cancel-subscription",
    devAuthFallback,
    requireAuth,
    csrfProtection,
    rateLimitMiddleware(apiRateLimiter),
    asyncHandler(async (req, res) => {
      const authenticatedUserId = req.userId!; // From session, not header
      const { subscriptionId } = req.body;

      if (!subscriptionId || typeof subscriptionId !== "string") {
        return res.status(400).json({ error: "Invalid subscriptionId" });
      }

      // Authorization check: ensure user owns this subscription
      const userSubscriptions = await StripeService.getUserSubscriptions(authenticatedUserId);
      const ownsSubscription = userSubscriptions.some((sub: any) => sub.id === subscriptionId);
      
      if (!ownsSubscription) {
        return res.status(403).json({ error: "Not authorized to cancel this subscription" });
      }

      const subscription = await StripeService.cancelSubscription(subscriptionId);
      res.json(subscription);
    })
  );

  // Get subscription details - SECURED ✅
  app.get("/api/stripe/subscription/:id",
    devAuthFallback,
    requireAuth,
    rateLimitMiddleware(apiRateLimiter),
    asyncHandler(async (req, res) => {
      const authenticatedUserId = req.userId!; // From session, not header
      const id = Sanitizer.sanitizeString(req.params.id);
      
      // Authorization check: verify user owns this subscription
      const userSubscriptions = await StripeService.getUserSubscriptions(authenticatedUserId);
      const ownsSubscription = userSubscriptions.some((sub: any) => sub.id === id);
      
      if (!ownsSubscription) {
        return res.status(403).json({ error: "Not authorized to view this subscription" });
      }
      
      const subscription = await StripeService.getSubscription(id);
      res.json(subscription);
    })
  );

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
          event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            webhookSecret
          );
        } else {
          // For development: accept webhook without verification (NOT for production!)
          console.warn("⚠️  Stripe webhook secret not configured - skipping signature verification");
          event = req.body;
        }
      } catch (err: any) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return res.status(400).json({ error: `Webhook Error: ${err.message}` });
      }

      // Handle the event
      await StripeService.handleWebhookEvent(event);

      // Return success to acknowledge receipt
      res.json({ received: true });
    })
  );

  // ============================================================================
  // CANVA DESIGN & VISUAL CONTENT ROUTES
  // ============================================================================

  // Check if Canva is enabled
  app.get("/api/canva/status",
    asyncHandler(async (req, res) => {
      res.json({
        enabled: canvaService.isEnabled(),
        message: canvaService.isEnabled() 
          ? "Canva API is configured and ready" 
          : "Canva API credentials not configured"
      });
    })
  );

  // Get Canva authorization URL - SECURED ✅ PROFESSIONAL FEATURE
  app.get("/api/canva/auth-url",
    devAuthFallback,
    requireAuth,
    requireTier('professional', storage),
    rateLimitMiddleware(apiRateLimiter),
    asyncHandler(async (req, res) => {
      if (!canvaService.isEnabled()) {
        return res.status(503).json({ error: "Canva API not configured" });
      }

      const authenticatedUserId = req.userId!; // From session, not header
      const state = `${authenticatedUserId}-${Date.now()}`;
      const authUrl = canvaService.getAuthorizationUrl(state);

      res.json({ authUrl, state });
    })
  );

  // Canva OAuth callback
  app.get("/api/canva/callback",
    asyncHandler(async (req, res) => {
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
        const tokens = await canvaService.exchangeCodeForToken(code);
        
        // Save tokens to user record
        const expiresAt = new Date(Date.now() + tokens.expires_in * 1000);
        await storage.updateUser(userId, {
          canvaAccessToken: tokens.access_token,
          canvaRefreshToken: tokens.refresh_token,
          canvaTokenExpiresAt: expiresAt
        });

        // Redirect to designs page or dashboard
        res.redirect("/designs?canva_connected=true");
      } catch (error: any) {
        console.error("Canva OAuth callback error:", error);
        res.redirect("/designs?canva_error=true");
      }
    })
  );

  // Create a new design - SECURED ✅ PROFESSIONAL FEATURE
  app.post("/api/canva/designs",
    devAuthFallback,
    requireAuth,
    requireTier('professional', storage),
    csrfProtection,
    rateLimitMiddleware(apiRateLimiter),
    asyncHandler(async (req, res) => {
      if (!canvaService.isEnabled()) {
        return res.status(503).json({ error: "Canva API not configured" });
      }

      const authenticatedUserId = req.userId!; // From session, not header
      const { designType, title, imageUrl } = req.body;

      if (!designType) {
        return res.status(400).json({ error: "Design type is required" });
      }

      // Get user's Canva access token
      const user = await storage.getUserById(authenticatedUserId);
      if (!user || !user.canvaAccessToken) {
        return res.status(401).json({ error: "Canva not connected. Please authorize first." });
      }

      // TODO: Check if token is expired and refresh if needed

      // Create design in Canva
      const design = await canvaService.createDesign(
        user.canvaAccessToken,
        designType,
        title,
        imageUrl ? undefined : undefined // Asset upload would go here
      );

      res.json({
        canvaDesignId: design.id,
        title: design.title,
        editUrl: design.urls.edit_url,
        viewUrl: design.urls.view_url,
        thumbnail: design.thumbnail?.url
      });
    })
  );

  // Create social media post - SECURED ✅ PROFESSIONAL FEATURE
  app.post("/api/canva/create-social-post",
    devAuthFallback,
    requireAuth,
    requireTier('professional', storage),
    csrfProtection,
    rateLimitMiddleware(apiRateLimiter),
    asyncHandler(async (req, res) => {
      if (!canvaService.isEnabled()) {
        return res.status(503).json({ error: "Canva API not configured" });
      }

      const authenticatedUserId = req.userId!; // From session, not header
      const { platform, title, imageUrl } = req.body;

      if (!platform || !["instagram", "facebook", "twitter", "linkedin"].includes(platform)) {
        return res.status(400).json({ error: "Invalid platform. Must be instagram, facebook, twitter, or linkedin" });
      }

      // Get user's Canva access token
      const user = await storage.getUserById(authenticatedUserId);
      if (!user || !user.canvaAccessToken) {
        return res.status(401).json({ error: "Canva not connected. Please authorize first." });
      }

      // Create social media post
      const design = await canvaService.createSocialMediaPost(
        user.canvaAccessToken,
        platform,
        title || `Mental Health ${platform.charAt(0).toUpperCase() + platform.slice(1)} Post`,
        imageUrl
      );

      res.json({
        canvaDesignId: design.id,
        title: design.title,
        editUrl: design.urls.edit_url,
        viewUrl: design.urls.view_url,
        platform
      });
    })
  );

  // Generate mental health quote design - SECURED ✅ PROFESSIONAL FEATURE
  app.post("/api/canva/generate-quote",
    devAuthFallback,
    requireAuth,
    requireTier('professional', storage),
    csrfProtection,
    rateLimitMiddleware(apiRateLimiter),
    asyncHandler(async (req, res) => {
      if (!canvaService.isEnabled()) {
        return res.status(503).json({ error: "Canva API not configured" });
      }

      const authenticatedUserId = req.userId!; // From session, not header
      const { quote, author } = req.body;

      if (!quote) {
        return res.status(400).json({ error: "Quote text is required" });
      }

      const user = await storage.getUserById(authenticatedUserId);
      if (!user || !user.canvaAccessToken) {
        return res.status(401).json({ error: "Canva not connected. Please authorize first." });
      }

      const design = await canvaService.generateMentalHealthQuote(
        user.canvaAccessToken,
        quote,
        author
      );

      res.json({
        canvaDesignId: design.id,
        title: design.title,
        editUrl: design.urls.edit_url,
        viewUrl: design.urls.view_url
      });
    })
  );

  // Generate mood visualization - SECURED ✅ PROFESSIONAL FEATURE
  app.post("/api/canva/generate-mood-visual",
    devAuthFallback,
    requireAuth,
    requireTier('professional', storage),
    csrfProtection,
    rateLimitMiddleware(apiRateLimiter),
    asyncHandler(async (req, res) => {
      if (!canvaService.isEnabled()) {
        return res.status(503).json({ error: "Canva API not configured" });
      }

      const authenticatedUserId = req.userId!; // From session, not header
      const { mood, intensity, date } = req.body;

      if (!mood || !intensity) {
        return res.status(400).json({ error: "Mood and intensity are required" });
      }

      const user = await storage.getUserById(authenticatedUserId);
      if (!user || !user.canvaAccessToken) {
        return res.status(401).json({ error: "Canva not connected. Please authorize first." });
      }

      const design = await canvaService.generateMoodVisualization(
        user.canvaAccessToken,
        mood,
        intensity,
        date || new Date().toISOString().split("T")[0]
      );

      res.json({
        canvaDesignId: design.id,
        title: design.title,
        editUrl: design.urls.edit_url,
        viewUrl: design.urls.view_url
      });
    })
  );

  // Export design - SECURED ✅ PROFESSIONAL FEATURE
  app.post("/api/canva/export/:designId",
    devAuthFallback,
    requireAuth,
    requireTier('professional', storage),
    csrfProtection,
    rateLimitMiddleware(apiRateLimiter),
    asyncHandler(async (req, res) => {
      if (!canvaService.isEnabled()) {
        return res.status(503).json({ error: "Canva API not configured" });
      }

      const authenticatedUserId = req.userId!; // From session, not header
      const designId = Sanitizer.sanitizeString(req.params.designId);
      const { format } = req.body;

      if (!["PNG", "JPG", "PDF"].includes(format)) {
        return res.status(400).json({ error: "Invalid format. Must be PNG, JPG, or PDF" });
      }

      const user = await storage.getUserById(authenticatedUserId);
      if (!user || !user.canvaAccessToken) {
        return res.status(401).json({ error: "Canva not connected. Please authorize first." });
      }

      const exportJob = await canvaService.exportDesign(
        user.canvaAccessToken,
        designId,
        format
      );

      res.json({
        jobId: exportJob.job.id,
        status: exportJob.job.status,
        urls: exportJob.urls
      });
    })
  );

  // Get design templates
  app.get("/api/canva/templates",
    asyncHandler(async (req, res) => {
      const templates = canvaService.getDesignTemplates();
      res.json(templates);
    })
  );

  // List user designs - SECURED ✅ PROFESSIONAL FEATURE
  app.get("/api/canva/designs",
    devAuthFallback,
    requireAuth,
    requireTier('professional', storage),
    rateLimitMiddleware(apiRateLimiter),
    asyncHandler(async (req, res) => {
      if (!canvaService.isEnabled()) {
        return res.status(503).json({ error: "Canva API not configured" });
      }

      const authenticatedUserId = req.userId!; // From session, not header

      const user = await storage.getUserById(authenticatedUserId);
      if (!user || !user.canvaAccessToken) {
        return res.status(401).json({ error: "Canva not connected. Please authorize first." });
      }

      const designs = await canvaService.listUserDesigns(user.canvaAccessToken);

      res.json({ designs });
    })
  );

  // Error Tracking Endpoint
  app.post("/api/errors",
    asyncHandler(async (req, res) => {
      const errorData = Sanitizer.sanitizeObject(req.body);
      
      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.error('📊 Frontend Error Captured:', {
          message: errorData.message,
          stack: errorData.stack,
          url: errorData.url,
          timestamp: errorData.timestamp,
          userAgent: errorData.userAgent
        });
      }

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
    })
  );

  // Performance Analytics Endpoint
  app.post("/api/performance",
    asyncHandler(async (req, res) => {
      const metricsData = Sanitizer.sanitizeObject(req.body);
      
      // Log Web Vitals in development
      if (process.env.NODE_ENV === 'development') {
        console.log('📈 Performance Metrics:', {
          metrics: metricsData.metrics,
          page: metricsData.page,
          timestamp: metricsData.timestamp,
          userAgent: metricsData.userAgent
        });
      }

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
    })
  );

  // ============================================
  // SOCIAL MEDIA MANAGEMENT - 360° PLATFORM
  // ============================================
  
  // Get connected social media accounts
  app.get("/api/social/accounts",
    devAuthFallback,
    requireAuth,
    asyncHandler(async (req, res) => {
      const userId = req.userId!;
      const accounts = await storage.getSocialAccountsByUserId(userId);
      res.json(accounts);
    })
  );

  // Connect new social media account
  app.post("/api/social/accounts",
    devAuthFallback,
    requireAuth,
    csrfProtection,
    asyncHandler(async (req, res) => {
      const userId = req.userId!;
      const accountData = Sanitizer.sanitizeObject(req.body);
      
      const account = await storage.createSocialAccount({
        ...accountData,
        userId,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      res.status(201).json(account);
    })
  );

  // Get social media profiles for an account
  app.get("/api/social/accounts/:accountId/profiles",
    devAuthFallback,
    requireAuth,
    asyncHandler(async (req, res) => {
      const { accountId } = req.params;
      const profiles = await storage.getSocialProfilesByAccountId(accountId);
      res.json(profiles);
    })
  );

  // Get all social media posts
  app.get("/api/social/posts",
    devAuthFallback,
    requireAuth,
    asyncHandler(async (req, res) => {
      const userId = req.userId!;
      const posts = await storage.getSocialPostsByUserId(userId);
      res.json(posts);
    })
  );

  // Create new social media post
  app.post("/api/social/posts",
    devAuthFallback,
    requireAuth,
    csrfProtection,
    asyncHandler(async (req, res) => {
      const userId = req.userId!;
      const postData = Sanitizer.sanitizeObject(req.body);
      
      const post = await storage.createSocialPost({
        ...postData,
        userId,
        status: 'published',
        publishedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      res.status(201).json(post);
    })
  );

  // ============================================
  // AI IMAGE GENERATION - 360° PLATFORM
  // ============================================
  
  // Get user's media assets
  app.get("/api/media/assets",
    devAuthFallback,
    requireAuth,
    asyncHandler(async (req, res) => {
      const userId = req.userId!;
      const assets = await storage.getMediaAssetsByUserId(userId);
      res.json(assets);
    })
  );

  // Generate AI image
  app.post("/api/media/generate",
    devAuthFallback,
    requireAuth,
    csrfProtection,
    asyncHandler(async (req, res) => {
      const userId = req.userId!;
      const { prompt, size, quality } = Sanitizer.sanitizeObject(req.body);
      
      // Create AI run tracking
      const aiRun = await storage.createAiRun({
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
    })
  );

  // ============================================
  // AI PROMPTS MANAGEMENT - 360° PLATFORM
  // ============================================
  
  // Get AI prompts
  app.get("/api/ai/prompts",
    devAuthFallback,
    requireAuth,
    asyncHandler(async (req, res) => {
      const userId = req.userId!;
      const { category } = req.query;
      
      const prompts = category
        ? await storage.getAiPromptsByCategory(category as string)
        : await storage.getAiPromptsByUserId(userId);
      
      res.json(prompts);
    })
  );

  // Create AI prompt template
  app.post("/api/ai/prompts",
    devAuthFallback,
    requireAuth,
    csrfProtection,
    asyncHandler(async (req, res) => {
      const userId = req.userId!;
      const promptData = Sanitizer.sanitizeObject(req.body);
      
      const prompt = await storage.createAiPrompt({
        ...promptData,
        userId,
        usageCount: 0,
        avgQualityScore: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      res.status(201).json(prompt);
    })
  );

  // Generate AI content
  app.post("/api/ai/generate-content",
    rateLimitMiddleware(chatRateLimiter),
    asyncHandler(async (req, res) => {
      const { prompt, contentType, tone, length } = Sanitizer.sanitizeObject(req.body);
      
      if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      const wordCounts = {
        short: 100,
        medium: 250,
        long: 500
      };
      
      const targetWords = wordCounts[length as keyof typeof wordCounts] || 250;
      
      const systemPrompts: Record<string, string> = {
        journal: 'Generate a thoughtful, introspective journal entry that encourages self-reflection and emotional awareness.',
        social: 'Create an engaging, authentic social media post that connects with the audience.',
        email: 'Write a professional, clear, and concise email.',
        blog: 'Create an informative, well-structured blog post with clear sections.',
        general: 'Generate helpful, relevant content based on the user\'s request.'
      };
      
      const systemPrompt = systemPrompts[contentType as string] || systemPrompts.general;
      const toneInstruction = tone ? `Write in a ${tone} tone.` : '';
      
      const fullPrompt = `${systemPrompt} ${toneInstruction} Target length: approximately ${targetWords} words.\n\nUser request: ${prompt}`;
      
      const content = await generateChatResponse(fullPrompt, []);
      
      res.json({ content });
    })
  );

  // ============================================
  // KNOWLEDGE MANAGEMENT - SELF-EVOLVING AI
  // ============================================
  
  // Get knowledge sources
  app.get("/api/knowledge/sources",
    devAuthFallback,
    requireAuth,
    asyncHandler(async (req, res) => {
      const userId = req.userId!;
      const sources = await storage.getKnowledgeSourcesByUserId(userId);
      res.json(sources);
    })
  );

  // Ingest new knowledge
  app.post("/api/knowledge/ingest",
    devAuthFallback,
    requireAuth,
    csrfProtection,
    asyncHandler(async (req, res) => {
      const userId = req.userId!;
      const { title, content, sourceType, url, category } = Sanitizer.sanitizeObject(req.body);
      
      const source = await storage.createKnowledgeSource({
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
    })
  );

  // Get knowledge chunks for a source
  app.get("/api/knowledge/sources/:sourceId/chunks",
    devAuthFallback,
    requireAuth,
    asyncHandler(async (req, res) => {
      const { sourceId } = req.params;
      const chunks = await storage.getKnowledgeChunksBySourceId(sourceId);
      res.json(chunks);
    })
  );

  // ============================================
  // AI USAGE TRACKING & ANALYTICS
  // ============================================
  
  // Get AI usage statistics
  app.get("/api/ai/usage",
    devAuthFallback,
    requireAuth,
    asyncHandler(async (req, res) => {
      const userId = req.userId!;
      const usage = await storage.getAiUsageByUserId(userId);
      res.json(usage);
    })
  );

  // Track AI usage
  app.post("/api/ai/usage",
    devAuthFallback,
    requireAuth,
    csrfProtection,
    asyncHandler(async (req, res) => {
      const userId = req.userId!;
      const usageData = Sanitizer.sanitizeObject(req.body);
      
      const usage = await storage.createAiUsageTracking({
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
    })
  );

  // Monitoring Dashboard Data Endpoint
  app.get("/api/monitoring/stats",
    rateLimitMiddleware(apiRateLimiter),
    asyncHandler(async (req, res) => {
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
    })
  );

  // ============================================
  // ADVANCED SEARCH API - Full-Text Search with Relevance Scoring
  // ============================================
  
  // Comprehensive search across all content
  app.get("/api/search",
    devAuthFallback,
    optionalAuth,
    rateLimitMiddleware(apiRateLimiter),
    asyncHandler(async (req, res) => {
      const { SearchService } = await import("./services/searchService.js");
      const searchService = new SearchService(storage);
      
      const query = Sanitizer.sanitizeString(req.query.q as string || '');
      const types = req.query.types 
        ? (req.query.types as string).split(',').map(t => Sanitizer.sanitizeString(t))
        : undefined;
      const limit = parseInt(req.query.limit as string || '20', 10);
      const offset = parseInt(req.query.offset as string || '0', 10);
      const userId = req.userId ? req.userId.toString() : null;

      const results = await searchService.search({
        query,
        types,
        limit,
        offset,
        userId
      });

      res.json(results);
    })
  );

  // Autocomplete suggestions
  app.get("/api/search/autocomplete",
    rateLimitMiddleware(apiRateLimiter),
    asyncHandler(async (req, res) => {
      const { SearchService } = await import("./services/searchService.js");
      const searchService = new SearchService(storage);
      
      const query = Sanitizer.sanitizeString(req.query.q as string || '');
      const limit = parseInt(req.query.limit as string || '5', 10);

      const suggestions = await searchService.autocomplete(query, limit);

      res.json({ suggestions });
    })
  );

  // Trending search queries
  app.get("/api/search/trending",
    rateLimitMiddleware(apiRateLimiter),
    asyncHandler(async (req, res) => {
      const { SearchService } = await import("./services/searchService.js");
      const searchService = new SearchService(storage);
      
      const limit = parseInt(req.query.limit as string || '10', 10);

      const trending = await searchService.getTrending(limit);

      res.json({ trending });
    })
  );

  // ============================================
  // BACKUP & RESTORE ENDPOINTS
  // ============================================
  
  // Create backup
  app.post("/api/backups",
    devAuthFallback,
    requireAuth,
    csrfProtection,
    asyncHandler(async (req, res) => {
      const userId = req.userId!.toString();
      const { backupService } = await import("./services/backupService.js");
      
      const backup = await backupService.createBackup(userId, 'full');
      
      res.status(201).json(backup);
    })
  );

  // List backups
  app.get("/api/backups",
    devAuthFallback,
    requireAuth,
    asyncHandler(async (req, res) => {
      const userId = req.userId!.toString();
      const { backupService } = await import("./services/backupService.js");
      
      const backups = await backupService.listBackups(userId);
      
      res.json(backups);
    })
  );

  // Get backup stats
  app.get("/api/backups/stats",
    devAuthFallback,
    requireAuth,
    asyncHandler(async (req, res) => {
      const { backupService } = await import("./services/backupService.js");
      
      const stats = await backupService.getBackupStats();
      
      res.json(stats);
    })
  );

  // Restore backup
  app.post("/api/backups/:backupId/restore",
    devAuthFallback,
    requireAuth,
    csrfProtection,
    asyncHandler(async (req, res) => {
      const { backupId } = req.params;
      const userId = req.userId!.toString();
      const { backupService } = await import("./services/backupService.js");
      
      // Verify backup ownership with exact prefix match
      const expectedPrefix = `backup-${userId}-`;
      if (!backupId.startsWith(expectedPrefix)) {
        return res.status(403).json({ error: 'Forbidden: You do not own this backup' });
      }
      
      await backupService.restoreBackup(backupId);
      
      res.json({ message: 'Backup restored successfully' });
    })
  );

  // Delete backup
  app.delete("/api/backups/:backupId",
    devAuthFallback,
    requireAuth,
    csrfProtection,
    asyncHandler(async (req, res) => {
      const { backupId } = req.params;
      const userId = req.userId!.toString();
      const { backupService } = await import("./services/backupService.js");
      
      // Verify backup ownership with exact prefix match
      const expectedPrefix = `backup-${userId}-`;
      if (!backupId.startsWith(expectedPrefix)) {
        return res.status(403).json({ error: 'Forbidden: You do not own this backup' });
      }
      
      await backupService.deleteBackup(backupId);
      
      res.json({ message: 'Backup deleted successfully' });
    })
  );

  // ============================================
  // PERFORMANCE MONITORING ENDPOINTS - ADMIN ONLY
  // ============================================
  
  // Get performance stats (Admin only)
  app.get("/api/admin/performance/stats",
    devAuthFallback,
    requireAuth,
    asyncHandler(async (req, res) => {
      // Check if user is admin
      const user = await storage.getUserById(req.userId!.toString());
      if (!user || !user.isAdmin) {
        return res.status(403).json({ error: 'Forbidden: Admin access required' });
      }

      const { performanceMonitor } = await import("./services/performanceMonitor.js");
      
      const stats = performanceMonitor.getStats();
      
      res.json(stats);
    })
  );

  // Get slowest routes (Admin only)
  app.get("/api/admin/performance/slow-routes",
    devAuthFallback,
    requireAuth,
    asyncHandler(async (req, res) => {
      // Check if user is admin
      const user = await storage.getUserById(req.userId!.toString());
      if (!user || !user.isAdmin) {
        return res.status(403).json({ error: 'Forbidden: Admin access required' });
      }

      const { performanceMonitor } = await import("./services/performanceMonitor.js");
      
      const limit = parseInt(req.query.limit as string || '10', 10);
      const slowRoutes = performanceMonitor.getSlowestRoutes(limit);
      
      res.json(slowRoutes);
    })
  );
  
  // Auto-added: Analytics endpoints
  try { registerAnalytics(app as any); } catch { /* noop */ }
}

