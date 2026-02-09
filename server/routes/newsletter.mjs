import { Router } from 'express';
import { z } from 'zod';
import { eq } from "drizzle-orm";
import { db } from "../db/connection.mjs";
import { leads } from "../db/schema.mjs";
import { logger } from "../utils/logger.mjs";

const router = Router();

const subscribeSchema = z.object({
  email: z.string().email('Invalid email address')
});

router.post('/subscribe', async (req, res) => {
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

export default router;
