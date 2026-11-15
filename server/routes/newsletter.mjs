import { Router } from 'express';
import { z } from 'zod';
import { eq } from "drizzle-orm";
import { db } from "../db/connection.mjs";
import { leads } from "../db/schema.mjs";
import { analyticsEvents, newsletterSubscribers } from "../../shared/schema.mjs";
import { logger } from "../utils/logger.mjs";

const router = Router();

const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 5;

function rateLimit(req, res, next) {
  const ip = req.ip || req.connection?.remoteAddress || 'unknown';
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitStore.set(ip, { windowStart: now, count: 1 });
    return next();
  }

  entry.count++;
  if (entry.count > RATE_LIMIT_MAX) {
    return res.status(429).json({
      ok: false,
      error: {
        code: 'RATE_LIMITED',
        message: 'Too many requests. Please try again in a moment.'
      }
    });
  }

  return next();
}

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore) {
    if (now - entry.windowStart > RATE_LIMIT_WINDOW_MS * 5) {
      rateLimitStore.delete(key);
    }
  }
}, RATE_LIMIT_WINDOW_MS * 5).unref();

const emailSchema = z.string().trim().toLowerCase().max(255, 'Email address is too long')
  .email('Invalid email address');
const sourceSchema = z.string().trim().min(1, 'Source is required when supplied')
  .max(100, 'Source is too long')
  .regex(/^(?:\/|\/?[A-Za-z0-9][A-Za-z0-9/_-]*)$/, 'Invalid source identifier');
const subscribeSchema = z.object({
  email: emailSchema,
  // The legacy Subscribe action accepts an email alone. An explicit refusal
  // must never be converted into positive consent.
  consent: z.literal(true).optional(),
  source: sourceSchema.optional(),
  utmSource: z.string().max(255).optional(),
  utmMedium: z.string().max(255).optional(),
  utmCampaign: z.string().max(255).optional(),
  utmContent: z.string().max(255).optional(),
  utmTerm: z.string().max(255).optional(),
  utmTimestamp: z.number().nonnegative().optional(),
});
const unsubscribeSchema = z.object({ email: emailSchema });
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

function freshAttribution(input) {
  if (!input.utmTimestamp || Date.now() - input.utmTimestamp > THIRTY_DAYS_MS) return {};
  return Object.fromEntries(
    ['utmSource', 'utmMedium', 'utmCampaign', 'utmContent', 'utmTerm']
      .filter(key => input[key] !== undefined)
      .map(key => [key, input[key]])
  );
}

function invalidInput(res, error) {
  return res.status(400).json({
    ok: false,
    error: {
      code: 'VALIDATION_ERROR',
      message: error.issues[0]?.message || 'Invalid input',
    },
  });
}

function recordAnalytics(eventName, path) {
  // Consent persistence is authoritative. Optional telemetry runs only after
  // commit and can never turn a committed change into a failure response.
  try {
    const pending = db.insert(analyticsEvents).values({
      eventName,
      eventCategory: 'newsletter',
      path,
      meta: {},
      privacyLevel: 'minimal',
    });
    void Promise.resolve(pending).catch(() => {});
  } catch {
    // No email, source text, or provider/SQL error details enter telemetry.
  }
}

router.post('/subscribe', rateLimit, async (req, res) => {
  const parsed = subscribeSchema.safeParse(req.body);
  if (!parsed.success) return invalidInput(res, parsed.error);

  try {
    const { email, source } = parsed.data;
    const attribution = freshAttribution(parsed.data);
    await db.transaction(async tx => {
      // Use the same lead -> subscriber order for subscribe and unsubscribe.
      // Upsert atomically handles renewed consent and concurrent first signups.
      await tx.insert(leads).values({
        email,
        source: source ?? 'newsletter-subscribe',
        consent: true,
        interests: JSON.stringify([]),
        ...attribution,
      }).onConflictDoUpdate({
        target: leads.email,
        set: {
          consent: true,
          ...(source !== undefined ? { source } : {}),
          ...attribution,
          updatedAt: new Date(),
        },
      });
      await tx.insert(newsletterSubscribers).values({
        email,
        status: 'active',
        sourcePath: source ?? null,
      }).onConflictDoUpdate({
        target: newsletterSubscribers.email,
        set: { status: 'active', ...(source !== undefined ? { sourcePath: source } : {}) },
      });
    });

    logger.info('[Newsletter] Subscription preferences saved');
    recordAnalytics('newsletter_signup_success', '/newsletter');

    res.json({ 
      ok: true, 
      data: { subscribed: true },
      message: 'Subscription received. Thank you for joining us.' 
    });
  } catch {
    logger.error('[Newsletter] Subscription failed');
    res.status(500).json({
      ok: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Unable to process subscription'
      }
    });
  }
});

router.post('/unsubscribe', rateLimit, async (req, res) => {
  const parsed = unsubscribeSchema.safeParse(req.body);
  if (!parsed.success) return invalidInput(res, parsed.error);

  try {
    const { email } = parsed.data;
    await db.transaction(async tx => {
      await tx.delete(leads).where(eq(leads.email, email));
      // This must run even when there was no lead: older records can exist in
      // either store independently. A failure rolls back both mutations.
      await tx.update(newsletterSubscribers)
        .set({ status: 'unsubscribed' })
        .where(eq(newsletterSubscribers.email, email));
    });

    logger.info('[Newsletter] Unsubscribe completed');
    recordAnalytics('newsletter_unsubscribe', '/newsletter/unsubscribe');

    res.json({
      ok: true,
      message: 'If this email was subscribed, it has been removed. Thank you.'
    });
  } catch {
    logger.error('[Newsletter] Unsubscribe failed');
    res.status(500).json({
      ok: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Unable to process request'
      }
    });
  }
});


// Health check endpoint for admin daily tools monitoring
router.get("/", (req, res) => {
  res.json({ ok: true, module: "newsletter", status: "operational", timestamp: new Date().toISOString() });
});

export default router;
