/**
 * Email API Routes
 * Handles email operations for The Genuine Love Project
 */

import express from 'express';
import { 
  sendWelcomeEmail, 
  sendChallengeReminder, 
  sendMilestoneEmail,
  testEmailConnection 
} from '../services/email.mjs';

const router = express.Router();

router.get('/health', async (req, res) => {
  try {
    const status = await testEmailConnection();
    res.json({
      service: 'email',
      status: status.connected ? 'connected' : 'disconnected',
      fromEmail: status.fromEmail || null,
      error: status.error || null
    });
  } catch (error) {
    res.status(500).json({
      service: 'email',
      status: 'error',
      error: error.message
    });
  }
});

router.post('/welcome', async (req, res) => {
  const { email, name } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  
  const result = await sendWelcomeEmail(email, name);
  
  if (result.success) {
    res.json({ message: 'Welcome email sent', id: result.id });
  } else {
    res.status(500).json({ error: result.error });
  }
});

router.post('/challenge-reminder', async (req, res) => {
  const { email, name, day } = req.body;
  
  if (!email || !day) {
    return res.status(400).json({ error: 'Email and day are required' });
  }
  
  const result = await sendChallengeReminder(email, name, day);
  
  if (result.success) {
    res.json({ message: 'Challenge reminder sent', id: result.id });
  } else {
    res.status(500).json({ error: result.error });
  }
});

router.post('/milestone', async (req, res) => {
  const { email, name, milestone } = req.body;
  
  if (!email || !milestone) {
    return res.status(400).json({ error: 'Email and milestone are required' });
  }
  
  const result = await sendMilestoneEmail(email, name, milestone);
  
  if (result.success) {
    res.json({ message: 'Milestone email sent', id: result.id });
  } else {
    res.status(500).json({ error: result.error });
  }
});

export default router;
