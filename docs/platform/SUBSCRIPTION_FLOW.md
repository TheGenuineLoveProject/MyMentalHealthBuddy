# Subscription State Flow — Internal Reference

## End-to-End Flow

```
User clicks "Upgrade" on /account/billing
  → POST /api/stripe/create-checkout-session
  → Stripe Checkout (hosted)
  → User completes payment
  → Stripe fires checkout.session.completed webhook
  → POST /api/webhook/stripe
  → Webhook verifies signature + idempotency
  → UPDATE users SET subscription_status = 'pro' WHERE email = customer_email
  → Fire-and-forget upgrade confirmation email
  → AuthContext re-fetches /api/auth/user → isPro = true
  → PlanGate components unlock, Pro badge appears
```

## Cancellation Flow

```
User clicks "Manage Subscription" on /account/billing
  → POST /api/stripe/create-portal-session
  → Stripe Customer Portal (hosted)
  → User cancels subscription
  → Stripe fires customer.subscription.deleted webhook
  → POST /api/webhook/stripe
  → Webhook verifies signature + idempotency
  → Fetch user email BEFORE status update (for email)
  → UPDATE users SET subscription_status = 'free'
  → Fire-and-forget cancellation acknowledgment email
  → AuthContext re-fetches → isPro = false
  → PlanGate components re-gate, Pro badge hidden
```

## Canonical Status

- Column: `users.subscription_status`
- Allowed values: `"free"` | `"pro"` (never raw Stripe statuses)
- Default: `"free"`
- Written ONLY by webhook handlers
- Read by: AuthContext, server-side enforcement, billing page

## How to Add a New Pro Feature

1. Add the feature key to `client/src/config/featureAccess.js`:
   ```js
   newFeature: {
     requiredPlan: "pro",
     label: "Feature Name",
     description: "What it does",
   },
   ```

2. In the component, use the access hook:
   ```jsx
   import { useFeatureAccess } from "@/hooks/useFeatureAccess";
   
   const { allowed } = useFeatureAccess("newFeature");
   
   if (!allowed) {
     return <PlanGate feature="newFeature" />;
   }
   ```

3. If server-side enforcement is needed, check `subscriptionStatus` in the route handler.

4. Never gate: mood tracking, journaling, daily reflection, crisis support.

## How to Roll Back Monetization

To revert to fully-free (no gating):

1. In `featureAccess.js`, change all `requiredPlan: "pro"` to `requiredPlan: "free"`
2. Remove PlanGate wrappers from components (or PlanGate becomes a no-op since all features are "free")
3. In `server/routes/ai.mjs`, set `FREE_DAILY_SESSION_LIMIT` to a very high number (e.g., 999)
4. No database changes needed — `subscription_status` column stays, just stops being checked
5. Stripe products remain but no checkout links are exposed

To fully remove Stripe:
1. Remove billing page links
2. Remove webhook route
3. Remove Stripe SDK import
4. Keep `subscription_status` column as-is (defaults to "free")

## Key Files

| Purpose | File |
|---------|------|
| Feature access config | `client/src/config/featureAccess.js` |
| Feature access hook | `client/src/hooks/useFeatureAccess.js` |
| Gate component | `client/src/components/PlanGate.jsx` |
| Auth context (isPro) | `client/src/context/AuthContext.jsx` |
| Billing page | `client/src/pages/account/Billing.jsx` |
| Webhook handler | `server/routes/webhook.mjs` |
| AI session enforcement | `server/routes/ai.mjs` |
| Email lifecycle | `server/services/email.mjs` |
| Platform status | `docs/platform/platformStatus.js` |
| Deployment readiness | `server/routes/deploymentReadiness.mjs` |

## Safety Guardrails

- Core healing tools are NEVER gated
- No dark patterns, no urgency tactics, no guilt-based copy
- Cancellation is always one click via Stripe portal
- Emails are fire-and-forget (never block webhook processing)
- Webhook idempotency prevents duplicate processing
- All status writes are canonical (never raw Stripe values)
