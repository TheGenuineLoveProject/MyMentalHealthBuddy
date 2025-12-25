import { pgTable, uuid, text, timestamp, index } from "drizzle-orm/pg-core";

export const pendingEntitlements = pgTable(
  "pending_entitlements",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    stripeCustomerId: text("stripe_customer_id"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => ({
    peEmailIdx: index("pe_email_idx").on(t.email),
    peStripeIdx: index("pe_stripe_idx").on(t.stripeCustomerId),
  })
);