import { Router } from "express";
import express from "express";
import Stripe from "stripe";
import { db } from "../db/client.mjs";
import { users, webhookEvents } from "../../shared/schema.mjs";
import { and, eq, sql } from "drizzle-orm";
import { logger } from "../utils/logger.mjs";
import { increment } from "../utils/metrics.mjs";
import { sendUpgradeConfirmation, sendCancellationAcknowledgment } from "../services/email.mjs";
import { alertWebhookSignatureFailure } from "../observability/safetyAlerts.mjs";
import {
  mapPriceIdToPlan,
  mapSubscriptionToPlan,
  mapInvoiceToPlan,
  resolvePlanFromCheckoutSession,
  diagnosePlanResolution,
} from "../utils/planMapping.mjs";

const router = Router();
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" })
  : null;

/**
 * Check if event has already been processed (durable idempotency)
 */
async function isProcessed(eventId) {
  try {
    const rows = await db.select().from(webhookEvents).where(eq(webhookEvents.id, eventId));
    return rows.length > 0;
  } catch (err) {
    logger.error("Idempotency check failed");
    throw err; // Do not perform side effects when durability cannot be checked.
  }
}

/**
 * Mark event as processed (durable persistence)
 */
async function markProcessed(event) {
  try {
    await db.insert(webhookEvents).values({
      id: event.id,
      eventType: event.type,
      status: "processed",
      processedAt: new Date(),
    });
  } catch (err) {
    logger.error("Failed to mark event processed");
    throw err; // Do not acknowledge an event without durable processing evidence.
  }
}

const SUBSCRIPTION_LOOKUP_BUDGET_MS = 10000;
const SUBSCRIPTION_LOOKUP_PAGE_LIMIT = 10;

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function requireStripeId(value, prefix) {
  if (typeof value !== "string" || !value.startsWith(prefix) ||
      value.length <= prefix.length || /\s/.test(value)) {
    throw new Error("Invalid Stripe subscription identity");
  }
  return value;
}

function stripeCustomerId(customer) {
  if (typeof customer === "string") return requireStripeId(customer, "cus_");
  // Both expanded Customer and DeletedCustomer objects retain this identity.
  if (!isRecord(customer) || customer.object !== "customer") {
    throw new Error("Invalid Stripe customer state");
  }
  return requireStripeId(customer.id, "cus_");
}

async function hasActiveReplacementSubscription(customerId, canceledSubscriptionId) {
  // The elapsed budget prevents starting more pages after expiry. Stripe's
  // per-request timeout is an inactivity timeout, so an in-flight response can
  // exceed this budget; validate elapsed time again before trusting its data.
  const deadline = Date.now() + SUBSCRIPTION_LOOKUP_BUDGET_MS;
  for (const status of ["active", "trialing"]) {
    const seenIds = new Set();
    const seenCursors = new Set();
    let startingAfter;
    for (let pageIndex = 0; pageIndex < SUBSCRIPTION_LOOKUP_PAGE_LIMIT; pageIndex++) {
      const remainingMs = deadline - Date.now();
      if (remainingMs <= 0) throw new Error("Stripe subscription lookup deadline exceeded");
      const page = await stripe.subscriptions.list({
        customer: customerId,
        status,
        limit: 100,
        ...(startingAfter ? { starting_after: startingAfter } : {}),
      }, { timeout: remainingMs, maxNetworkRetries: 0 });
      if (Date.now() >= deadline) throw new Error("Stripe subscription lookup deadline exceeded");
      if (!isRecord(page) || !Array.isArray(page.data) || page.data.length > 100 ||
          typeof page.has_more !== "boolean" || (page.has_more && page.data.length === 0)) {
        throw new Error("Incomplete Stripe subscription listing");
      }

      let foundReplacement = false;
      for (const candidate of page.data) {
        if (!isRecord(candidate)) throw new Error("Invalid Stripe subscription state");
        const candidateId = requireStripeId(candidate.id, "sub_");
        if (seenIds.has(candidateId) || stripeCustomerId(candidate.customer) !== customerId) {
          throw new Error("Inconsistent Stripe subscription listing");
        }
        seenIds.add(candidateId);
        // The explicitly canceled subscription itself is never replacement
        // evidence, even if the provider includes it during a status transition.
        if (candidateId === canceledSubscriptionId && candidate.status === "canceled") continue;
        if (candidate.status !== status || candidateId === canceledSubscriptionId) {
          throw new Error("Inconsistent Stripe subscription status");
        }
        // Current checkout creates one recurring item. Unknown or incomplete
        // item sets cannot prove that downgrading this customer is correct.
        if (!isRecord(candidate.items) || !Array.isArray(candidate.items.data) ||
            candidate.items.data.length !== 1 || candidate.items.has_more !== false) {
          throw new Error("Incomplete Stripe subscription pricing");
        }
        const plan = mapSubscriptionToPlan(candidate);
        if (plan !== "pro" && plan !== "elite") {
          throw new Error("Unknown Stripe recurring subscription plan");
        }
        foundReplacement = true;
      }

      const nextCursor = page.data.at(-1)?.id;
      if (page.has_more && (nextCursor === startingAfter || seenCursors.has(nextCursor))) {
        throw new Error("Stripe subscription pagination did not advance");
      }
      if (foundReplacement) return true;
      if (!page.has_more) break;
      if (pageIndex === SUBSCRIPTION_LOOKUP_PAGE_LIMIT - 1) {
        throw new Error("Stripe subscription lookup page limit exceeded");
      }
      seenCursors.add(nextCursor);
      startingAfter = nextCursor;
    }
  }
  return false;
}


router.get("/", (_req, res) => {
  res.json({ ok: true, module: "webhooks", status: "operational", timestamp: new Date().toISOString() });
});

router.get("/health", (_req, res) => {
  res.json({ ok: true, module: "stripeWebhook", status: stripe ? "configured" : "not_configured", timestamp: new Date().toISOString() });
});

// IMPORTANT: raw body ONLY for stripe signature verification
router.post(
  "/stripe",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    if (!stripe) {
      logger.warn("Stripe webhook received but STRIPE_SECRET_KEY not configured");
      return res.status(503).json({ error: "Stripe not configured" });
    }
    const sig = req.headers["stripe-signature"];
    let event;

    // Validate webhook signature
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch {
      logger.error("Stripe webhook signature verification failed");
      void alertWebhookSignatureFailure({
        provider: "stripe",
        error: "Signature verification failed",
      });
      return res.status(400).send("Webhook signature verification failed");
    }

    // Keep durability checks inside the error boundary: database failures
    // must return a retryable response before side effects run.
    try {
      if (await isProcessed(event.id)) {
        logger.info("Duplicate webhook event skipped", { type: event.type });
        return res.json({ received: true, duplicate: true });
      }

      switch (event.type) {
        case "checkout.session.completed":
        case "checkout.session.async_payment_succeeded": {
          const session = event.data.object;
          const isOneTimePayment = session.mode === "payment";
          // Starter is sold in payment mode, which has no subscription ID.
          // Delayed payments finish in a separate, signed async-success event.
          if (event.type === "checkout.session.async_payment_succeeded" && !isOneTimePayment) {
            break;
          }
          if (!session.customer || (!isOneTimePayment && !session.subscription)) {
            logger.warn("checkout.session.completed missing customer or subscription");
            break;
          }
          // Stripe leaves session.customer_email null when a Customer is
          // attached at session creation (billing.mjs passes `customer`);
          // the buyer's email lives on customer_details.email. Derive from
          // both so the primary activation path can match the user.
          const customerEmail = session.customer_details?.email || session.customer_email;
          if (!customerEmail) {
            logger.warn("checkout.session.completed missing customer email — cannot match user");
            break;
          }
          // Re-fetch session with line items expanded — webhook payload
          // does not include line_items by default. The line item price ID
          // is the AUTHORITATIVE source for plan tier (what Stripe charged).
          // SECURITY: if retrieve fails, FAIL CLOSED — throw so the outer
          // catch returns 500 without markProcessed, letting Stripe retry.
          // Never grant entitlement from client-supplied metadata alone when
          // we cannot independently verify the charged price ID.
          let authoritativeSession;
          try {
            authoritativeSession = await stripe.checkout.sessions.retrieve(session.id, {
              expand: ["line_items"],
            });
          } catch (expandErr) {
            logger.error("checkout.session.completed: line_items retrieve FAILED — refusing entitlement, deferring to Stripe retry");
            increment("subscription_mapping_unknown", { source: "checkout_retrieve_failed" });
            throw expandErr; // outer catch → 500 → no markProcessed → Stripe retries
          }
          if (isOneTimePayment) {
            const chargedPlan = mapPriceIdToPlan(authoritativeSession?.line_items?.data?.[0]?.price?.id);
            if (
              authoritativeSession.mode !== "payment" ||
              authoritativeSession.payment_status !== "paid" ||
              chargedPlan !== "starter"
            ) {
              logger.warn(`${event.type}: one-time checkout is not a verified paid Starter purchase`);
              break;
            }
          }
          const checkoutPlan = resolvePlanFromCheckoutSession(authoritativeSession);
          if (!checkoutPlan) {
            const diag = diagnosePlanResolution(authoritativeSession);
            const alertSource = diag.mismatch ? "checkout_mismatch" : "checkout";
            logger.error(
              diag.mismatch
                ? "checkout.session.completed: SECURITY metadata.plan != price-derived plan — refusing entitlement"
                : "checkout.session.completed: unknown plan — refusing to default",
              {
                priceDerivedPlan: diag.priceDerivedPlan,
                metadataIsValid: diag.metadataIsValid,
                mismatch: diag.mismatch,
              }
            );
            increment("subscription_mapping_unknown", { source: alertSource });
            break;
          }
          const checkoutResult = await db
            .update(users)
            .set({
              stripeCustomerId: session.customer,
              subscriptionStatus: checkoutPlan,
              // A one-time unlock must not inherit an expired recurring plan.
              ...(isOneTimePayment ? { subscriptionExpiresAt: null } : {}),
              updatedAt: new Date(),
            })
            .where(eq(users.email, customerEmail));
          const checkoutRowsAffected = checkoutResult?.rowCount ?? checkoutResult?.changes ?? 0;
          if (checkoutRowsAffected === 0) {
            logger.warn("checkout.session.completed: no user matched by email");
          } else {
            logger.info("Subscription activated via checkout", { status: checkoutPlan });
            increment("subscription_transition", { plan: `free_to_${checkoutPlan}` });
          }
          sendUpgradeConfirmation(customerEmail, session.customer_details?.name || "").catch(() => {
            logger.warn("Failed to send upgrade email");
          });
          break;
        }

        case "customer.subscription.created":
        case "customer.subscription.updated": {
          const subscription = event.data.object;
          if (!subscription.customer) {
            logger.warn(`${event.type} missing customer field`);
            break;
          }
          const isActive = ["active", "trialing"].includes(subscription.status);
          let canonicalStatus;
          if (isActive) {
            const mappedPlan = mapSubscriptionToPlan(subscription);
            if (!mappedPlan) {
              logger.error(`${event.type}: unknown price id — refusing to default to pro`);
              increment("subscription_mapping_unknown", { source: "subscription" });
              break;
            }
            canonicalStatus = mappedPlan;
          } else {
            canonicalStatus = "free";
          }
          const syncResult = await db
            .update(users)
            .set({
              subscriptionStatus: canonicalStatus,
              subscriptionExpiresAt: subscription.current_period_end
                ? new Date(subscription.current_period_end * 1000)
                : null,
              updatedAt: new Date(),
            })
            .where(eq(users.stripeCustomerId, subscription.customer));
          const syncRows = syncResult?.rowCount ?? syncResult?.changes ?? 0;
          if (syncRows === 0) {
            logger.warn(`${event.type}: no user found for stripeCustomerId`, { stripeStatus: subscription.status });
          } else {
            logger.info("Subscription status synced", { stripeStatus: subscription.status, canonicalStatus });
          }
          break;
        }

        case "customer.subscription.deleted": {
          const subscription = event.data.object;
          const customerId = stripeCustomerId(subscription.customer);
          const canceledSubscriptionId = requireStripeId(subscription.id, "sub_");
          // Snapshot the row before the provider lookup. xmin is PostgreSQL's
          // exact row version, so a concurrent activation cannot be overwritten
          // after the lookup finishes. No lock is held while contacting Stripe.
          const userRows = await db.select({
            id: users.id,
            email: users.email,
            name: users.name,
            rowVersion: sql`${users}.xmin::text`.as("row_version"),
          })
            .from(users)
            .where(eq(users.stripeCustomerId, customerId));
          if (userRows.length === 0) break;
          const cancelledUser = userRows[0];
          if (userRows.length !== 1 || typeof cancelledUser.id !== "string" || !cancelledUser.id ||
              typeof cancelledUser.rowVersion !== "string" || !/^\d+$/.test(cancelledUser.rowVersion)) {
            throw new Error("Ambiguous Stripe customer account state");
          }
          if (await hasActiveReplacementSubscription(customerId, canceledSubscriptionId)) {
            logger.info("Stale subscription cancellation skipped: replacement remains active");
            break;
          }
          
          const deleteResult = await db
            .update(users)
            .set({
              subscriptionStatus: "free",
              subscriptionExpiresAt: new Date(),
              updatedAt: new Date(),
            })
            .where(and(
              eq(users.id, cancelledUser.id),
              eq(users.stripeCustomerId, customerId),
              eq(sql`${users}.xmin::text`, cancelledUser.rowVersion),
            ));
          const deleteRows = deleteResult?.rowCount ?? deleteResult?.changes ?? 0;
          if (deleteRows !== 1) {
            throw new Error("Stripe customer account changed during cancellation; retry required");
          }
          logger.info("Subscription deleted, reverted to free");
          increment("subscription_transition", { plan: "pro_to_free" });
          
          if (cancelledUser?.email) {
            sendCancellationAcknowledgment(
              cancelledUser.email, 
              cancelledUser.name || "",
              subscription.current_period_end
            ).catch(() => {
              logger.warn("Failed to send cancellation email");
            });
          }
          break;
        }

        case "invoice.paid": {
          const invoice = event.data.object;
          if (!invoice.customer) {
            logger.warn("invoice.paid missing customer field");
            break;
          }
          const invoicePlan = mapInvoiceToPlan(invoice);
          if (!invoicePlan) {
            logger.error("invoice.paid: unknown price id — refusing to default to pro");
            increment("subscription_mapping_unknown", { source: "invoice_paid" });
            break;
          }
          const paidResult = await db
            .update(users)
            .set({
              subscriptionStatus: invoicePlan,
              updatedAt: new Date(),
            })
            .where(eq(users.stripeCustomerId, invoice.customer));
          const paidRows = paidResult?.rowCount ?? paidResult?.changes ?? 0;
          if (paidRows === 0) {
            logger.warn("invoice.paid: no user found for stripeCustomerId");
          } else {
            logger.info("Invoice paid, plan confirmed", { plan: invoicePlan });
          }
          break;
        }

        case "invoice.payment_failed": {
          const invoice = event.data.object;
          if (!invoice.customer) {
            logger.warn("invoice.payment_failed missing customer field");
            break;
          }
          const failedResult = await db
            .update(users)
            .set({
              subscriptionStatus: "free",
              updatedAt: new Date(),
            })
            .where(eq(users.stripeCustomerId, invoice.customer));
          const failedRows = failedResult?.rowCount ?? failedResult?.changes ?? 0;
          if (failedRows === 0) {
            logger.warn("invoice.payment_failed: no user found for stripeCustomerId");
          } else {
            logger.info("Invoice payment failed, reverted to free");
          }
          break;
        }

        default:
          logger.info("Unhandled Stripe event type", { type: event.type });
      }

      // Mark as processed ONLY after successful handling
      await markProcessed(event);
      return res.json({ received: true });
    } catch {
      logger.error("Webhook handler failed", { eventType: event.type });
      // Do NOT mark processed on failure; Stripe will retry.
      return res.status(500).json({ error: "Webhook handler failed" });
    }
  }
);


// Health check endpoint for admin daily tools monitoring
router.get("/", (req, res) => {
  res.json({ ok: true, module: "webhook", status: "operational", timestamp: new Date().toISOString() });
});

export default router;
