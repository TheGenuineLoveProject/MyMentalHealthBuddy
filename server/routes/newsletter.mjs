import { Router } from 'express';
import { z } from 'zod';
import { eq } from "drizzle-orm";
import { db } from "../db/connection.mjs";
import { leads } from "../db/schema.mjs";
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

const subscribeSchema = z.object({
  email: z.string().email('Invalid email address')
});

router.post('/subscribe', rateLimit, async (req, res) => {
  try {
    const { email } = subscribeSchema.parse(req.body);
    
    logger.info("[Newsletter] Subscription request", { email: `${email.substring(0, 3)}***@***` });

    const normalizedEmail = email.toLowerCase().trim();

    const existing = await db
      .select({ id: leads.id })
      .from(leads)
      .where(eq(leads.email, normalizedEmail))
      .limit(1);

    if (existing.length > 0) {
      return res.json({ 
        ok: true, 
        message: 'You are already subscribed. Thank you!' 
      });
    }

    await db.insert(leads).values({
      email: normalizedEmail,
      source: "newsletter-subscribe",
      consent: true,
      interests: JSON.stringify([]),
    });

    res.json({ 
      ok: true, 
      message: 'Subscription received. Thank you for joining us.' 
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        ok: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: error.errors[0]?.message || 'Invalid input'
        }
      });
    }
    
    logger.error("[Newsletter] Error", { error: error?.message || error });
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
  try {
    const { email } = subscribeSchema.parse(req.body);

    logger.info("[Newsletter] Unsubscribe request", { email: `${email.substring(0, 3)}***@***` });

    const normalizedEmail = email.toLowerCase().trim();

    const existing = await db
      .select({ id: leads.id })
      .from(leads)
      .where(eq(leads.email, normalizedEmail))
      .limit(1);

    if (existing.length === 0) {
      return res.json({
        ok: true,
        message: 'If this email was subscribed, it has been removed. Thank you.'
      });
    }

    await db.delete(leads).where(eq(leads.email, normalizedEmail));

    res.json({
      ok: true,
      message: 'You have been unsubscribed. We respect your choice. Take care.'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        ok: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: error.errors[0]?.message || 'Invalid input'
        }
      });
    }

    logger.error("[Newsletter] Unsubscribe error", { error: error?.message || error });
    res.status(500).json({
      ok: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Unable to process request'
      }
    });
  }
});

export default router;
