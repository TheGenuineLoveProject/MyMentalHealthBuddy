import express from "express";
import corsFix from "./middleware/cors-fix.mjs";
import { rateLimiter } from "./middleware/rateLimiter.mjs";

import authRoutes from "./routes/auth.mjs";
import journalRoutes from "./routes/journal.mjs";
import contentRoutes from "./routes/content.mjs";
import analyticsRoutes from "./routes/analytics.mjs";
import billingRoutes from "./routes/billing.mjs";
import stripeRoutes from "./routes/stripe.mjs";
import stripeWebhookRoutes from "./routes/stripeWebhook.mjs";
import aiRoutes from "./routes/ai.mjs";
import moodRoutes from "./routes/mood.mjs";

const app = express();
app.use(express.json());
app.use(corsFix);
app.use(rateLimiter);

app.use("/auth", authRoutes);
app.use("/journal", journalRoutes);
app.use("/content", contentRoutes);
app.use("/analytics", analyticsRoutes);
app.use("/billing", billingRoutes);
app.use("/stripe", stripeRoutes);
app.use("/stripe-webhook", stripeWebhookRoutes);
app.use("/ai", aiRoutes);
app.use("/mood", moodRoutes);

// PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Backend running on:", PORT));