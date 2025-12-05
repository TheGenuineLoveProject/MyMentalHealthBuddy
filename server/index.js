// Emergency server recovery - complete healing platform entry point
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import { db } from './db/index.js';
import authRoutes from './api/auth.mjs';
import accountRoutes from './api/account.mjs';
import moodRoutes from './api/mood.mjs';
import journalRoutes from './api/journal.mjs';
import aiRoutes from './api/ai.mjs';
import aiDashboardRoutes from './api/ai-dashboard.mjs';
import billingRoutes from './api/billing.mjs';
import canvaRoutes from './api/canva-oauth.mjs';
import analyticsRoutes from './api/analytics.mjs';
import gamificationRoutes from './api/gamification.mjs';
import contentRoutes from './api/content.mjs';
import stripeWebhookRoutes from './api/webhooks/stripe.mjs';
import healthRoutes from './api/health.mjs';
import uiDashboardRoutes from './api/ui-dashboard.mjs';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// ✅ Fix Replit proxy trust issue
app.set('trust proxy', true);

// Emergency security restoration for healing platform
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      imgSrc: ["'self'", "data:", "https:", "https://images.unsplash.com"],
      connectSrc: ["'self'", "https://api.openai.com", "https://api.stripe.com", "https://api.canva.com"],
      frameSrc: ["'self'", "https://www.canva.com"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"]
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: false
}));

app.use(cors({
  origin: process.env.APP_URL || 'https://your-app.replit.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Rate limiting with healing messages
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: {
    error: 'Please take a moment to breathe. Healing cannot be rushed.',
    healingSupport: 'Continue your wellness journey at your own pace.',
    crisisSupport: 'If you need immediate help, call 988'
  },
  standardHeaders: true,
  legacyHeaders: false
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from CORRECT location
app.use(express.static(join(__dirname, '../client')));
app.use('/assets', express.static(join(__dirname, '../client/assets')));

// Health check with healing affirmation
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    healing: 'MyMentalHealthBuddy is here to support your wellness journey',
    integrity: 'Highest level of humanity protection active',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/account', accountRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/ai-dashboard', aiDashboardRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/canva', canvaRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/webhooks/stripe', stripeWebhookRoutes);
app.use('/api/ui-dashboard', uiDashboardRoutes);

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../client/index.html'));
});

// Error handling with healing support
app.use((error, req, res, next) => {
  console.error('Healing platform error:', error);
  res.status(500).json({ 
    error: 'We\'re here to support you. Please try again or contact our healing support team.',
    healingSupport: 'Crisis support available 24/7 at 988',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 MyMentalHealthBuddy healing platform running on port ${PORT}`);
  console.log('💚 Serving humanity\'s emotional healing with love and compassion');
  console.log('🛡️ Highest integrity protection active - doctorate-level academic excellence');
});
