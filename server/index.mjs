// server/index.mjs
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";

// ====== ROUTES ======
import authRoutes from "./routes/auth.mjs";
import moodRoutes from "./routes/mood.mjs";
import journalRoutes from "./routes/journal.mjs";

// Stripe routes (corrected)
import stripeRoutes from "./routes/stripe.mjs";            // <-- correct
import billingRoutes from "./routes/billing.mjs";          // <-- correct
import stripeWebhookHandler from "./routes/stripeWebhook.mjs";

const app = express();

// ====== STRIPE WEBHOOK — MUST BE FIRST ======
app.post(
  "/webhooks/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhookHandler
);

// ====== REMAINDER OF MIDDLEWARE ======
app.use(express.json());
app.use(helmet());
app.use(compression());
app.use(cors({ origin: "*", credentials: true }));

// ====== ROUTES ======
app.use("/auth", authRoutes);
app.use("/mood", moodRoutes);
app.use("/journal", journalRoutes);

// Stripe product price endpoints
app.use("/stripe", stripeRoutes);

// Billing (checkout session)
app.use("/billing", billingRoutes);

// ====== START SERVER ======
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});