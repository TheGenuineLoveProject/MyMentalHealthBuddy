# Monetization Intelligence

**Generated:** 2026-02-06
**Phase:** 14 — Monetization Intelligence
**Status:** ANALYSIS ONLY — No changes applied

---

## Current Billing Architecture

### Stripe Integration

| Component | File | Function |
|-----------|------|----------|
| Billing Routes | server/routes/billing.mjs | Plan listing, checkout session creation |
| Stripe Webhook | server/routes/stripeWebhook.mjs | Subscription lifecycle management |
| Admin Billing | server/routes/adminBilling.mjs | Revenue dashboards |
| Products | server/routes/products.mjs | Product catalog |
| Stripe Sync | server/services/stripeSync.mjs | Customer/subscription sync |
| Stripe Utility | server/utils/stripe.mjs | Stripe client configuration |
| Token System | server/services/tokens.mjs | Usage-based credits |
| Pro Features | server/routes/pro-features.mjs | Premium feature gating |
| Plan Guard | server/middleware/requirePlan.mjs | Subscription-level access control |

### Subscription Flow

```
Free User
  → Views pricing page (/pricing)
  → Selects plan
  → POST /api/billing/create-checkout-session
  → Redirected to Stripe Checkout
  → Payment processed
  → Stripe webhook fires (checkout.session.completed)
  → updateUserSubscription() called
  → User tier updated in database
  → Premium features unlocked (requirePlan middleware)
```

### Webhook Events Handled

| Event | Action |
|-------|--------|
| checkout.session.completed | Create/update subscription |
| customer.subscription.created | Record new subscription |
| customer.subscription.updated | Update tier/status |
| customer.subscription.deleted | Downgrade to free |
| invoice.payment_succeeded | Extend subscription period |
| invoice.payment_failed | Mark payment issue |

### Idempotency

The billing system uses idempotency keys: `generateIdempotencyKey(userId, plan, timestamp)` to prevent duplicate checkout sessions within the same minute.

---

## Revenue Opportunity Map

### Expansion Opportunities

| Opportunity | Trigger Point | Current State | Potential |
|-------------|--------------|---------------|-----------|
| Free → Pro Upgrade | After 7-day streak | Pricing page exists | HIGH |
| Feature Gating | Using advanced AI tools | requirePlan middleware active | HIGH |
| Usage-Based Upsell | AI token limit reached | Token system exists | MEDIUM |
| Content Studio Premium | Creating content | Content studio active | MEDIUM |
| Advanced Analytics | Viewing insights | Dashboard exists | MEDIUM |
| Priority AI Access | During peak usage | Rate limiting exists | LOW |

### Retention Opportunities

| Opportunity | Mechanism | Current State | Potential |
|-------------|-----------|---------------|-----------|
| Streak Protection | Allow "freeze" for paid users | Streak tracking active | HIGH |
| Export Data | PDF journal export for paid | Journal system active | MEDIUM |
| Custom AI Persona | Personalized AI companion | AI system active | HIGH |
| Extended History | Full mood/journal history | Data stored in DB | MEDIUM |
| Priority Support | Faster response time | Contact form exists | LOW |
| Community Leadership | Moderator badges for premium | Badge system active | LOW |

### Churn Prevention Signals

| Signal | Data Source | Response |
|--------|------------|----------|
| Decreased login frequency | Analytics | Engagement reminder email |
| Stopped journaling | Journal table | Gentle check-in notification |
| Broken streak | Gamification data | Streak recovery offer |
| Failed payment | Stripe webhook | Dunning email sequence |
| Feature exploration plateau | Analytics | Feature discovery prompt |

---

## Recommended Monetization Enhancements

### 1. Value-Based Upgrade Prompts (HIGH Priority)

Instead of aggressive upsells, show value-based prompts:
- "You've journaled 30 days in a row! Unlock deeper insights with Pro."
- "Your emotional patterns show growth. See your full story with Premium."

### 2. Trial Period with Engagement Gates (MEDIUM Priority)

- 7-day Pro trial after signup
- Trial extends to 14 days if user completes 5+ wellness exercises
- Converts engagement into trial length, rewarding active users

### 3. Token-Based AI Usage (MEDIUM Priority)

- Free tier: 10 AI conversations/month
- Pro tier: Unlimited AI conversations
- Token system already exists (server/services/tokens.mjs)
- Requires enforcement in AI route middleware

### 4. Annual Plan Discount (LOW Priority)

- Monthly pricing visible at /pricing
- Add annual option with 2 months free
- Stripe supports both billing intervals

---

## Revenue Metrics to Track

| Metric | Formula | Frequency |
|--------|---------|-----------|
| MRR (Monthly Recurring Revenue) | Sum of active subscriptions | Daily |
| ARPU (Average Revenue Per User) | MRR / total users | Monthly |
| Churn Rate | Cancelled / total subscribers | Monthly |
| LTV (Lifetime Value) | ARPU / churn rate | Quarterly |
| Conversion Rate | Paid users / total users | Weekly |
| Trial Conversion | Converted trials / total trials | Weekly |
| Expansion Revenue | Upgrades / total revenue | Monthly |
| Net Revenue Retention | (MRR + expansion - churn) / starting MRR | Monthly |

---

## Ethical Monetization Principles

1. **Transparent pricing** — No hidden fees, clear feature comparison
2. **Genuine value gate** — Premium features must deliver real wellness value
3. **No artificial scarcity** — Crisis resources always free
4. **Easy cancellation** — One-click cancel, no guilt trips
5. **Data portability** — Users can export their data regardless of plan
6. **Free tier meaningful** — Free users get genuine value, not a crippled experience

---

## Phase 14 Status: COMPLETE
No code modified. Stripe flows mapped. Opportunities documented.
