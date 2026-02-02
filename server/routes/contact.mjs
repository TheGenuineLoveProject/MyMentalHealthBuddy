import { Router } from 'express';
import { z } from 'zod';
import { logger } from '../utils/logger.mjs';

const router = Router();

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Valid email is required'),
  subject: z.string().min(1, 'Subject is required').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000)
});

router.post('/', async (req, res) => {
  try {
    const data = contactSchema.parse(req.body);
    
    logger.info('[Contact] Message received', {
      name: data.name.substring(0, 3) + '***',
      email: data.email.substring(0, 3) + '***@***',
      subject: data.subject.substring(0, 20) + (data.subject.length > 20 ? '...' : '')
    });
    
    res.json({ 
      ok: true, 
      message: 'Thank you for your message. We will respond within 24-48 hours.' 
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
    
    logger.error('[Contact] Error:', error.message);
    res.status(500).json({
      ok: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Unable to send message. Please try again.'
      }
    });
  }
});

export default router;
