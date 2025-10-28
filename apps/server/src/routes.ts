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

  // Get journals endpoint
  app.get("/api/journals",
    rateLimitMiddleware(apiRateLimiter),
    asyncHandler(async (req, res) => {
      const userId = Sanitizer.sanitizeUserId(req.headers["x-user-id"]);
      const journals = await storage.getJournalsByUserId(userId);
      res.json(journals);
    })
  );

  // Create journal endpoint
  app.post("/api/journals",
    rateLimitMiddleware(apiRateLimiter),
    asyncHandler(async (req, res) => {
      const userId = Sanitizer.sanitizeUserId(req.headers["x-user-id"]);
      
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

  // Update journal endpoint
  app.patch("/api/journals/:id",
    rateLimitMiddleware(apiRateLimiter),
    asyncHandler(async (req, res) => {
      const id = Sanitizer.sanitizeString(req.params.id);
      const userId = Sanitizer.sanitizeUserId(req.headers["x-user-id"]);

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

  // Delete journal endpoint
  app.delete("/api/journals/:id",
    rateLimitMiddleware(apiRateLimiter),
    asyncHandler(async (req, res) => {
      const id = Sanitizer.sanitizeString(req.params.id);
      const userId = Sanitizer.sanitizeUserId(req.headers["x-user-id"]);

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

  // Get mood entries endpoint
  app.get("/api/moods",
    rateLimitMiddleware(apiRateLimiter),
    asyncHandler(async (req, res) => {
      const userId = Sanitizer.sanitizeUserId(req.headers["x-user-id"]);
      const moods = await storage.getMoodEntriesByUserId(userId);
      res.json(moods);
    })
  );

  // Create mood entry endpoint
  app.post("/api/moods",
    rateLimitMiddleware(apiRateLimiter),
    asyncHandler(async (req, res) => {
      const userId = Sanitizer.sanitizeUserId(req.headers["x-user-id"]);
      
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

  // Get crisis resources endpoint
  app.get("/api/crisis-resources",
    asyncHandler(async (req, res) => {
      const country = Sanitizer.sanitizeString(
        (req.query.country as string) || "US"
      ).toUpperCase().slice(0, 2) || "US";
      
      const resources = await storage.getCrisisResourcesByCountry(country);
      res.json(resources);
    })
  );

  // Export journals endpoint
  app.get("/api/journals/export",
    rateLimitMiddleware(apiRateLimiter),
    asyncHandler(async (req, res) => {
      const userId = Sanitizer.sanitizeUserId(req.headers["x-user-id"]);
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

  // Export moods endpoint
  app.get("/api/moods/export",
    rateLimitMiddleware(apiRateLimiter),
    asyncHandler(async (req, res) => {
      const userId = Sanitizer.sanitizeUserId(req.headers["x-user-id"]);
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

  // Get mood analytics endpoint
  app.get("/api/moods/analytics",
    rateLimitMiddleware(apiRateLimiter),
    asyncHandler(async (req, res) => {
      const userId = Sanitizer.sanitizeUserId(req.headers["x-user-id"]);
      const moods = await storage.getMoodEntriesByUserId(userId);

      const analytics = DataExporter.generateMoodAnalytics(moods);
      const insights = DataExporter.generateInsights(moods);

      res.json({
        ...analytics,
        insights
      });
    })
  );

  // Billing Transactions endpoints
  app.get("/api/transactions/:userId",
    rateLimitMiddleware(apiRateLimiter),
    asyncHandler(async (req, res) => {
      const requestedUserId = Sanitizer.sanitizeString(req.params.userId);
      const authenticatedUserId = Sanitizer.sanitizeUserId(req.headers["x-user-id"]);
      
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
    rateLimitMiddleware(apiRateLimiter),
    asyncHandler(async (req, res) => {
      const id = Sanitizer.sanitizeString(req.params.id);
      const authenticatedUserId = Sanitizer.sanitizeUserId(req.headers["x-user-id"]);
      
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
    rateLimitMiddleware(apiRateLimiter),
    asyncHandler(async (req, res) => {
      const authenticatedUserId = Sanitizer.sanitizeUserId(req.headers["x-user-id"]);
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

  // Create subscription checkout session
  app.post("/api/stripe/create-subscription-checkout",
    rateLimitMiddleware(apiRateLimiter),
    asyncHandler(async (req, res) => {
      const authenticatedUserId = Sanitizer.sanitizeUserId(req.headers["x-user-id"]);
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

  // Create one-time payment checkout session
  app.post("/api/stripe/create-payment-checkout",
    rateLimitMiddleware(apiRateLimiter),
    asyncHandler(async (req, res) => {
      const authenticatedUserId = Sanitizer.sanitizeUserId(req.headers["x-user-id"]);
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

  // Get user's active subscriptions
  app.get("/api/stripe/subscriptions",
    rateLimitMiddleware(apiRateLimiter),
    asyncHandler(async (req, res) => {
      const authenticatedUserId = Sanitizer.sanitizeUserId(req.headers["x-user-id"]);
      const subscriptions = await StripeService.getUserSubscriptions(authenticatedUserId);
      res.json(subscriptions);
    })
  );

  // Cancel subscription
  app.post("/api/stripe/cancel-subscription",
    rateLimitMiddleware(apiRateLimiter),
    asyncHandler(async (req, res) => {
      const { subscriptionId } = req.body;

      if (!subscriptionId || typeof subscriptionId !== "string") {
        return res.status(400).json({ error: "Invalid subscriptionId" });
      }

      // TODO: Add authorization check to ensure user owns this subscription
      const subscription = await StripeService.cancelSubscription(subscriptionId);
      res.json(subscription);
    })
  );

  // Get subscription details
  app.get("/api/stripe/subscription/:id",
    rateLimitMiddleware(apiRateLimiter),
    asyncHandler(async (req, res) => {
      const id = Sanitizer.sanitizeString(req.params.id);
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
}
