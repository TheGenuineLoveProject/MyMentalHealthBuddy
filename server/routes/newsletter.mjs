import { Router } from 'express';
import { z } from 'zod';

const router = Router();

const subscribeSchema = z.object({
  email: z.string().email('Invalid email address')
});

router.post('/subscribe', async (req, res) => {
  try {
    const { email } = subscribeSchema.parse(req.body);
    
    console.log(`[Newsletter] Subscription request: ${email.substring(0, 3)}***@***`);
    
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
    
    console.error('[Newsletter] Error:', error.message);
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
