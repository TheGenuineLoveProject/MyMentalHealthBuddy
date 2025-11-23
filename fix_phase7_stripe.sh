#!/usr/bin/env bash
set -e

echo "MyMentalHealthBuddy — Phase 7 (Stripe Billing, PURE JS/MJS) starting..."
echo "---------------------------------------------------------------"

# STEP 0 — Ensure we are in project ROOT
cd "$HOME/workspace" 2>/dev/null || cd ~/workspace
if [ ! -f package.json ]; then
  echo "[ERROR] package.json not found in $(pwd). Open a new Shell and run again from repl root."
  exit 1
fi
echo "[OK] In project ROOT: $(pwd)"

# STEP 1 — Ensure Stripe + Drizzle deps are installed (JS only)
echo "[STEP] Ensuring stripe + drizzle deps installed..."
npm ls stripe >/dev/null 2>&1 || npm install stripe --save
npm ls drizzle-orm >/dev/null 2>&1 || npm install drizzle-orm postgres
npm ls drizzle-kit >/dev/null 2>&1 || npm install -D drizzle-kit
echo "[OK] Stripe + ORM deps ready."

# STEP 2 — Ensure subscriptions table exists in shared/schema.mjs (JS)
if grep -q "subscriptions = pgTable" shared/schema.mjs 2>/dev/null; then
  echo "[OK] 'subscriptions' table already present in shared/schema.mjs"
else
  echo "[STEP] Adding 'subscriptions' table to shared/schema.mjs (JS)..."
  cat <<'SCHEMA' >> shared/schema.mjs

// Stripe subscriptions table
export const subscriptions = pgTable('subscriptions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
  stripeSubscriptionId: varchar('stripe_subscription_id', { length: 255 }),
  status: varchar('status', { length: 50 }).notNull(),
  planId: varchar('plan_id', { length: 100 }).notNull(),
  currentPeriodEnd: timestamp('current_period_end'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
SCHEMA
  echo "[OK] 'subscriptions' table appended to shared/schema.mjs"
fi

# STEP 3 — Create server/routes/billing.mjs (pure JS)
echo "[STEP] Creating server/routes/billing.mjs..."
mkdir -p server/routes

cat <<'BILL' > server/routes/billing.mjs
import { Router } from 'express';
import Stripe from 'stripe';
import { db } from '../db/connection.mjs';
import { subscriptions, users } from '../../shared/schema.mjs';
import { eq } from 'drizzle-orm';
import authGuard from '../middleware/auth.mjs';

const router = Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});

// Get or create Stripe customer for logged-in user
async function getOrCreateCustomer(user) {
  if (user.stripeCustomerId) {
    return user.stripeCustomerId;
  }

  const customer = await stripe.customers.create({
    email: user.email,
    name: user.name || undefined,
  });

  // If you later add stripeCustomerId column to users, this will save it.
  try {
    await db
      .update(users)
      .set({ stripeCustomerId: customer.id })
      .where(eq(users.id, user.id));
  } catch (err) {
    console.error('Could not save stripeCustomerId on user (safe to ignore if column missing):', err.message);
  }

  return customer.id;
}

// POST /api/billing/create-checkout-session
router.post('/create-checkout-session', authGuard, async (req, res) => {
  try {
    const { priceId, mode } = req.body || {};

    if (!priceId) {
      return res.status(400).json({ error: 'Missing priceId' });
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, req.user.userId))
      .limit(1);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const customerId = await getOrCreateCustomer(user);

    const session = await stripe.checkout.sessions.create({
      mode: mode || 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      customer: customerId,
      success_url:
        (process.env.FRONTEND_URL || 'http://localhost:5173') +
        '/billing/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url:
        (process.env.FRONTEND_URL || 'http://localhost:5173') +
        '/billing/cancelled',
      metadata: {
        userId: String(user.id),
      },
    });

    return res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    return res.status(500).json({ error: 'Unable to create checkout session' });
  }
});

// GET /api/billing/subscription
router.get('/subscription', authGuard, async (req, res) => {
  try {
    const [sub] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, req.user.userId))
      .limit(1);

    if (!sub) {
      return res.json({ active: false });
    }

    return res.json({
      active: sub.status === 'active' || sub.status === 'trialing',
      subscription: sub,
    });
  } catch (err) {
    console.error('Get subscription error:', err);
    return res.status(500).json({ error: 'Unable to fetch subscription' });
  }
});

// POST /api/billing/create-portal-session
router.post('/create-portal-session', authGuard, async (req, res) => {
  try {
    const [sub] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, req.user.userId))
      .limit(1);

    if (!sub || !sub.stripeCustomerId) {
      return res.status(400).json({ error: 'No active Stripe customer' });
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: sub.stripeCustomerId,
      return_url:
        process.env.FRONTEND_URL || 'http://localhost:5173/account',
    });

    return res.json({ url: portalSession.url });
  } catch (err) {
    console.error('Stripe portal error:', err);
    return res.status(500).json({ error: 'Unable to create portal session' });
  }
});

export default router;
BILL
echo "[OK] server/routes/billing.mjs created."

# STEP 4 — Create server/routes/stripeWebhook.mjs (function + raw body)
echo "[STEP] Creating server/routes/stripeWebhook.mjs..."

cat <<'WEB' > server/routes/stripeWebhook.mjs
import Stripe from 'stripe';
import { db } from '../db/connection.mjs';
import { subscriptions } from '../../shared/schema.mjs';
import { eq } from 'drizzle-orm';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});

export default async function stripeWebhookHandler(req, res) {
  const sig = req.headers['stripe-signature'];

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('STRIPE_WEBHOOK_SECRET is not set.');
    return res.status(500).send('Webhook not configured');
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Stripe webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    const type = event.type;
    const data = event.data.object;

    if (type === 'checkout.session.completed') {
      const userId = data.metadata && data.metadata.userId;
      if (!userId) {
        console.warn('No userId metadata on checkout.session.completed');
      } else {
        await upsertSubscription({
          userId: Number(userId),
          customerId: data.customer,
          subscriptionId: data.subscription,
          status: data.status || 'active',
          planId:
            data.items &&
            data.items.data &&
            data.items.data[0] &&
            data.items.data[0].price &&
            data.items.data[0].price.id,
          currentPeriodEnd: data.current_period_end
            ? new Date(data.current_period_end * 1000)
            : null,
        });
      }
    }

    if (
      type === 'customer.subscription.created' ||
      type === 'customer.subscription.updated' ||
      type === 'customer.subscription.deleted'
    ) {
      const subscription = data;
      const customerId = subscription.customer;
      const stripeSubscriptionId = subscription.id;

      await upsertSubscription({
        userId: null,
        customerId,
        subscriptionId: stripeSubscriptionId,
        status: subscription.status,
        planId:
          subscription.items &&
          subscription.items.data &&
          subscription.items.data[0] &&
          subscription.items.data[0].price &&
          subscription.items.data[0].price.id,
        currentPeriodEnd: subscription.current_period_end
          ? new Date(subscription.current_period_end * 1000)
          : null,
      });
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Stripe webhook handler error:', err);
    res.status(500).send('Webhook handler error');
  }
}

async function upsertSubscription({
  userId,
  customerId,
  subscriptionId,
  status,
  planId,
  currentPeriodEnd,
}) {
  if (!customerId && !userId) {
    console.warn('upsertSubscription called without userId or customerId');
    return;
  }

  const whereClause = userId
    ? eq(subscriptions.userId, userId)
    : eq(subscriptions.stripeCustomerId, customerId);

  const existing = await db
    .select()
    .from(subscriptions)
    .where(whereClause)
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(subscriptions)
      .set({
        stripeCustomerId: customerId || existing[0].stripeCustomerId,
        stripeSubscriptionId: subscriptionId,
        status,
        planId: planId || existing[0].planId,
        currentPeriodEnd: currentPeriodEnd || existing[0].currentPeriodEnd,
      })
      .where(eq(subscriptions.id, existing[0].id));
  } else {
    await db.insert(subscriptions).values({
      userId,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      status,
      planId,
      currentPeriodEnd,
    });
  }
}
WEB
echo "[OK] server/routes/stripeWebhook.mjs created."

# STEP 5 — Wire routes into server/index.mjs (JS/MJS only)
echo "[STEP] Wiring billing + webhook routes into server/index.mjs..."

# Add imports at the very top if missing
grep -q "stripeWebhookHandler" server/index.mjs || \
  sed -i "1i import stripeWebhookHandler from './routes/stripeWebhook.mjs';" server/index.mjs

grep -q "billingRouter" server/index.mjs || \
  sed -i "1i import billingRouter from './routes/billing.mjs';" server/index.mjs

# Register webhook BEFORE json body parsing
if ! grep -q "webhooks/stripe" server/index.mjs; then
  sed -i "/const app = express();/a app.post('/webhooks/stripe', express.raw({ type: 'application/json' }), stripeWebhookHandler);" server/index.mjs
fi

# Register /api/billing router before app.listen
if ! grep -q \"'/api/billing'\" server/index.mjs; then
  sed -i "/app.listen/i app.use('/api/billing', billingRouter);" server/index.mjs
fi

echo "[OK] server/index.mjs updated with billing + webhook routes."

echo "---------------------------------------------------------------"
echo "Phase 7 (Stripe Billing, PURE JS/MJS) script finished."
echo "Next:"
echo " 1) Set STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET in Replit Secrets."
echo " 2) Re-run 'npm start' and confirm server boots."
echo " 3) Use a test priceId to hit POST /api/billing/create-checkout-session."
echo "---------------------------------------------------------------"
