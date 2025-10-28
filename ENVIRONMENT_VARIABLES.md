# 🔐 Environment Variables Guide

## Overview

This document lists all environment variables used by MyMentalHealthBuddy. Variables are categorized by importance and feature area.

## Variable Status Legend

- ✅ **Required** - Must be set for production
- ⚠️ **Recommended** - Should be set for full functionality
- 🔵 **Optional** - Enables additional features
- 🟢 **Auto-Provided** - Automatically provided by Replit

---

## Core Application Variables

### ✅ DATABASE_URL
- **Status:** Required (🟢 Auto-provided by Replit PostgreSQL)
- **Format:** `postgresql://user:password@host:port/database`
- **Purpose:** PostgreSQL database connection string
- **Example:** `postgresql://replit:password@db.replit.com:5432/mydb`
- **Note:** Automatically set when you create a Replit PostgreSQL database

### ✅ SESSION_SECRET
- **Status:** Required
- **Format:** Random string (minimum 32 characters)
- **Purpose:** Encrypts session cookies for user authentication
- **Security:** MUST be cryptographically random and kept secret
- **Generate:** 
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- **Example:** `a1b2c3d4e5f6...` (64 hex characters)

### ⚠️ NODE_ENV
- **Status:** Recommended
- **Values:** `production` | `development`
- **Purpose:** Controls environment-specific behavior
- **Default:** `development`
- **Production:** Set to `production` for:
  - Optimized error messages
  - Cache headers enabled
  - Source maps disabled
  - Performance optimizations

### ⚠️ PORT
- **Status:** Recommended (🟢 Auto-provided by Replit)
- **Format:** Number (1-65535)
- **Purpose:** HTTP server port
- **Default:** `5000`
- **Note:** Replit automatically sets this in deployment

---

## OpenAI Integration

### ✅ OPENAI_API_KEY
- **Status:** Required for AI Chat feature
- **Format:** `sk-...` (starts with "sk-")
- **Purpose:** OpenAI API authentication
- **Get Key:** https://platform.openai.com/api-keys
- **Cost:** Pay-per-use (GPT-4 Turbo ~$0.01-0.03 per conversation)
- **Example:** `sk-proj-abc123def456...`

**Features Enabled:**
- AI Therapy Chat (`/chat` page)
- Empathetic responses
- Mental health support conversations

---

## Stripe Payment Processing

### ✅ STRIPE_SECRET_KEY
- **Status:** Required for billing features
- **Format:** `sk_test_...` (test) or `sk_live_...` (production)
- **Purpose:** Stripe API authentication (server-side)
- **Get Key:** https://dashboard.stripe.com/apikeys
- **Security:** Server-side only, NEVER expose to client
- **Example (Test):** `sk_test_51A2B3C4...`
- **Example (Live):** `sk_live_51A2B3C4...`

### ✅ VITE_STRIPE_PUBLIC_KEY
- **Status:** Required for billing features
- **Format:** `pk_test_...` (test) or `pk_live_...` (production)
- **Purpose:** Stripe client-side integration
- **Get Key:** https://dashboard.stripe.com/apikeys
- **Note:** Prefix with `VITE_` to expose to frontend
- **Example (Test):** `pk_test_51A2B3C4...`
- **Example (Live):** `pk_live_51A2B3C4...`

### ⚠️ STRIPE_WEBHOOK_SECRET
- **Status:** Recommended for production
- **Format:** `whsec_...`
- **Purpose:** Verify Stripe webhook signatures
- **Get Secret:** Stripe Dashboard → Developers → Webhooks → Add Endpoint
- **Webhook URL:** `https://your-domain.com/api/stripe/webhook`
- **Required Events:**
  - `checkout.session.completed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`
- **Example:** `whsec_abc123def456...`

**Features Enabled:**
- Subscription management (`/billing` page)
- Payment processing
- Free ($0/month)
- Premium ($29.99/month)
- Professional ($49.99/month)

---

## Canva Visual Design Integration

### 🔵 CANVA_CLIENT_ID
- **Status:** Optional (enables design features)
- **Format:** UUID or custom ID
- **Purpose:** Canva OAuth application ID
- **Get ID:** https://www.canva.com/developers/
- **Example:** `abc123-def456-ghi789`

### 🔵 CANVA_CLIENT_SECRET
- **Status:** Optional (enables design features)
- **Format:** Random string
- **Purpose:** Canva OAuth authentication
- **Get Secret:** https://www.canva.com/developers/
- **Security:** Server-side only, keep secret
- **Example:** `secret_abc123def456...`

### 🔵 CANVA_REDIRECT_URI
- **Status:** Optional (enables design features)
- **Format:** Full URL
- **Purpose:** OAuth callback endpoint
- **Development:** `http://localhost:5000/api/canva/callback`
- **Production:** `https://your-domain.com/api/canva/callback`
- **Note:** Must match exactly in Canva app settings
- **Example:** `https://myapp.repl.co/api/canva/callback`

**Features Enabled:**
- Visual design creation (`/designs` page)
- Social media post templates (Instagram, Facebook, Twitter, LinkedIn)
- Mental health quote generator
- Mood visualization designs
- Canva editor integration

---

## Feature Matrix

| Feature | Required Variables | Optional Variables |
|---------|-------------------|-------------------|
| Basic App | `DATABASE_URL`, `SESSION_SECRET` | `NODE_ENV`, `PORT` |
| AI Chat Therapy | `OPENAI_API_KEY` | - |
| Billing System | `STRIPE_SECRET_KEY`, `VITE_STRIPE_PUBLIC_KEY` | `STRIPE_WEBHOOK_SECRET` |
| Design Studio | `CANVA_CLIENT_ID`, `CANVA_CLIENT_SECRET`, `CANVA_REDIRECT_URI` | - |

---

## Environment Setup by Deployment Stage

### Development (Local)

Create `.env` file in project root:

```bash
# Core
DATABASE_URL=postgresql://localhost:5432/myapp
SESSION_SECRET=dev_secret_key_minimum_32_characters_long

# Features (add as needed)
OPENAI_API_KEY=sk-...
STRIPE_SECRET_KEY=sk_test_...
VITE_STRIPE_PUBLIC_KEY=pk_test_...
CANVA_CLIENT_ID=your_dev_app_id
CANVA_CLIENT_SECRET=your_dev_secret
CANVA_REDIRECT_URI=http://localhost:5000/api/canva/callback
```

### Production (Replit Deployment)

Use Replit Secrets (Tools → Secrets):

1. Click "Add Secret"
2. Add each variable one by one
3. Values are encrypted and secure
4. Never commit secrets to git

**Required for production:**
```bash
SESSION_SECRET=<generate-strong-random-key>
NODE_ENV=production
OPENAI_API_KEY=sk-live-...
STRIPE_SECRET_KEY=sk_live_...
VITE_STRIPE_PUBLIC_KEY=pk_live_...
```

**Optional for production:**
```bash
STRIPE_WEBHOOK_SECRET=whsec_...
CANVA_CLIENT_ID=<production-app-id>
CANVA_CLIENT_SECRET=<production-secret>
CANVA_REDIRECT_URI=https://your-domain.com/api/canva/callback
```

---

## Security Best Practices

### 🔐 DO:
- ✅ Use strong random values for `SESSION_SECRET`
- ✅ Rotate secrets periodically
- ✅ Use test keys for development
- ✅ Use live keys only in production
- ✅ Store secrets in Replit Secrets, never in code
- ✅ Different keys per environment

### ⛔ DON'T:
- ❌ Commit `.env` files to git
- ❌ Share secrets in chat/email
- ❌ Use production keys in development
- ❌ Hardcode secrets in source code
- ❌ Reuse `SESSION_SECRET` across projects
- ❌ Use weak or predictable secrets

---

## Validation

The application validates environment variables at startup using Zod schemas.

**Check validation:** `apps/server/src/lib/env.ts`

**Startup logs:**
```
✅ Environment variables validated
✅ Server running on port 5000 (production mode)
```

**Validation errors example:**
```
❌ Environment validation failed:
- SESSION_SECRET: String must contain at least 32 character(s)
- OPENAI_API_KEY: Required
```

---

## Troubleshooting

### "Environment validation failed"
- Check all required variables are set
- Verify `SESSION_SECRET` is at least 32 characters
- Ensure no typos in variable names

### "OpenAI API error"
- Verify `OPENAI_API_KEY` is correct
- Check API key has sufficient credits
- Confirm key starts with `sk-`

### "Stripe error"
- Ensure test keys used in development
- Verify live keys for production
- Check keys match (test with test, live with live)

### "Canva OAuth failed"
- Verify `CANVA_REDIRECT_URI` matches app settings
- Check client ID and secret are correct
- Ensure redirect URI is https in production

---

## Cost Estimates (Monthly)

| Service | Free Tier | Typical Cost | Notes |
|---------|-----------|--------------|-------|
| Replit PostgreSQL | ✅ Included | $0 | Part of deployment plan |
| OpenAI API | $5 free credit | $20-100 | Depends on chat usage |
| Stripe | ✅ Free | 2.9% + $0.30/transaction | Only on successful charges |
| Canva | ✅ Free tier | $0-12.99 | Free for basic use |

**Total Minimum:** $0-20/month (excluding Stripe transaction fees)

---

## Quick Reference Commands

```bash
# Generate secure SESSION_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Test environment variables locally
npm run dev:server

# Check which variables are set (don't show values)
node -e "console.log(Object.keys(process.env).filter(k => k.includes('STRIPE') || k.includes('OPENAI') || k.includes('CANVA')))"

# Validate production setup
curl https://your-app.repl.co/health
```

---

**Last Updated:** October 28, 2025  
**Version:** 1.1.0
