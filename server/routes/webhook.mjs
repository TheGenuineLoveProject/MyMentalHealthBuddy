import { Router } from "express";
import express from "express";
import Stripe from "stripe";
import { db } from "../db/client.mjs";
import { users, webhookEvents } from "../../shared/schema.mjs";
import { eq } from "drizzle-orm";
import { logger } from "../utils/logger.mjs";
import { increment } from "../utils/metrics.mjs";
import { sendUpgradeConfirmation, sendCancellationAcknowledgment } from "../services/email.mjs";
import { alertWebhookSignatureFailure } from "../observability/safetyAlerts.mjs";
import {
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
    logger.error("Idempotency check failed", { error: err.message, eventId });
    return false; // Allow retry on DB error
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
    // Log but don't fail - duplicate insert is acceptable
    logger.warn("Failed to mark event processed", { error: err.message, eventId: event.id });
  }
}

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
    } catch (err) {
      logger.error("Stripe webhook signature verification failed", { error: err.message });
      void alertWebhookSignatureFailure({
        provider: "stripe",
        error: err,
        sourceIp: req.ip || req.headers["x-forwarded-for"] || null,
      });
      return res.status(400).send("Webhook signature verification failed");
    }

    // Durable idempotency check
    if (await isProcessed(event.id)) {
      logger.info("Duplicate webhook event skipped", { eventId: event.id, type: event.type });
      return res.json({ received: true, duplicate: true });
    }

    // Handle events safely (retry-safe, idempotent)
    try {
      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object;
          if (!session.customer || !session.subscription) {
            logger.warn("checkout.session.completed missing customer or subscription", { sessionId: session.id });
            break;
          }
          // Stripe leaves session.customer_email null when a Customer is
          // attached at session creation (billing.mjs passes `customer`);
          // the buyer's email lives on customer_details.email. Derive from
          // both so the primary activation path can match the user.
          const customerEmail = session.customer_details?.email || session.customer_email;
          if (!customerEmail) {
            logger.warn("checkout.session.completed missing customer email — cannot match user", { customer: session.customer });
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
            logger.error("checkout.session.completed: line_items retrieve FAILED — refusing entitlement, deferring to Stripe retry", {
              error: expandErr.message,
              sessionId: session.id,
            });
            increment("subscription_mapping_unknown", { source: "checkout_retrieve_failed" });
            throw expandErr; // outer catch → 500 → no markProcessed → Stripe retries
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
                sessionId: session.id,
                email: session.customer_email,
                ...diag,
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
              updatedAt: new Date(),
            })
            .where(eq(users.email, customerEmail));
          const checkoutRowsAffected = checkoutResult?.rowCount ?? checkoutResult?.changes ?? 0;
          if (checkoutRowsAffected === 0) {
            logger.warn("checkout.session.completed: no user matched by email", { email: customerEmail, customer: session.customer });
          } else {
            logger.info("Subscription activated via checkout", { customer: session.customer, status: checkoutPlan });
            increment("subscription_transition", { plan: `free_to_${checkoutPlan}` });
          }
          sendUpgradeConfirmation(customerEmail, session.customer_details?.name || "").catch(err => {
            logger.warn("Failed to send upgrade email", { error: err.message });
          });
          break;
        }

        case "customer.subscription.created":
        case "customer.subscription.updated": {
          const subscription = event.data.object;
          if (!subscription.customer) {
            logger.warn(`${event.type} missing customer field`, { subscriptionId: subscription.id });
            break;
          }
          const isActive = ["active", "trialing"].includes(subscription.status);
          let canonicalStatus;
          if (isActive) {
            const mappedPlan = mapSubscriptionToPlan(subscription);
            if (!mappedPlan) {
              logger.error(`${event.type}: unknown price id — refusing to default to pro`, {
                subscriptionId: subscription.id,
                priceId: subscription?.items?.data?.[0]?.price?.id ?? null,
                customer: subscription.customer,
              });
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
            logger.warn(`${event.type}: no user found for stripeCustomerId`, { customer: subscription.customer, stripeStatus: subscription.status });
          } else {
            logger.info("Subscription status synced", { customer: subscription.customer, stripeStatus: subscription.status, canonicalStatus });
          }
          break;
        }

        case "customer.subscription.deleted": {
          const subscription = event.data.object;
          if (!subscription.customer) {
            logger.warn("customer.subscription.deleted missing customer field", { subscriptionId: subscription.id });
            break;
          }
          const userRows = await db.select({ email: users.email, username: users.username })
            .from(users)
            .where(eq(users.stripeCustomerId, subscription.customer));
          
          const deleteResult = await db
            .update(users)
            .set({
              subscriptionStatus: "free",
              subscriptionExpiresAt: new Date(),
              updatedAt: new Date(),
            })
            .where(eq(users.stripeCustomerId, subscription.customer));
          const deleteRows = deleteResult?.rowCount ?? deleteResult?.changes ?? 0;
          if (deleteRows === 0) {
            logger.warn("customer.subscription.deleted: no user found for stripeCustomerId", { customer: subscription.customer });
          } else {
            logger.info("Subscription deleted, reverted to free", { customer: subscription.customer });
            increment("subscription_transition", { plan: "pro_to_free" });
          }
          
          const cancelledUser = userRows?.[0];
          if (cancelledUser?.email) {
            sendCancellationAcknowledgment(
              cancelledUser.email, 
              cancelledUser.username || "", 
              subscription.current_period_end
            ).catch(err => {
              logger.warn("Failed to send cancellation email", { error: err.message });
            });
          }
          break;
        }

        case "invoice.paid": {
          const invoice = event.data.object;
          if (!invoice.customer) {
            logger.warn("invoice.paid missing customer field", { invoiceId: invoice.id });
            break;
          }
          const invoicePlan = mapInvoiceToPlan(invoice);
          if (!invoicePlan) {
            logger.error("invoice.paid: unknown price id — refusing to default to pro", {
              invoiceId: invoice.id,
              priceId: invoice?.lines?.data?.[0]?.price?.id ?? null,
              customer: invoice.customer,
            });
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
            logger.warn("invoice.paid: no user found for stripeCustomerId", { customer: invoice.customer });
          } else {
            logger.info("Invoice paid, plan confirmed", { customer: invoice.customer, plan: invoicePlan });
          }
          break;
        }

        case "invoice.payment_failed": {
          const invoice = event.data.object;
          if (!invoice.customer) {
            logger.warn("invoice.payment_failed missing customer field", { invoiceId: invoice.id });
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
            logger.warn("invoice.payment_failed: no user found for stripeCustomerId", { customer: invoice.customer });
          } else {
            logger.info("Invoice payment failed, reverted to free", { customer: invoice.customer });
          }
          break;
        }

        default:
          logger.info("Unhandled Stripe event type", { type: event.type });
      }

      // Mark as processed ONLY after successful handling
      await markProcessed(event);
      return res.json({ received: true });
    } catch (e) {
      logger.error("Webhook handler failed", { error: e.message, eventType: event.type });
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
