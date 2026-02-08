import { Router } from 'express';
import { z } from 'zod';
import { logger } from "../utils/logger.mjs";

const router = Router();

const subscribeSchema = z.object({
  email: z.string().email('Invalid email address')
});

router.post('/subscribe', async (req, res) => {
  try {
    const { email } = subscribeSchema.parse(req.body);
    
    logger.info("[Newsletter] Subscription request", { email: `${email.substring(0, 3)}***@***` });
    
    res.json({ 
      ok: true, 
      message: 'Subscription received. Check your email to confirm.' 
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
