import { db } from "../db/client.mjs";
import { users, subscriptions } from "../db/schema.mjs";
import { eq } from "drizzle-orm";
import { logger } from "../utils/logger.mjs";

export async function applyOrBufferEntitlement({ stripeCustomerId, tier, status }) {
  const found = await db.select().from(users).where(eq(users.stripeCustomerId, stripeCustomerId)).limit(1);
  const user = found[0];

  if (!user) {
    logger.warn("User not found for stripeCustomerId, entitlement not applied", { stripeCustomerId, tier });
    return { buffered: false, reason: "user_not_found" };
  }

  await db
    .insert(subscriptions)
    .values({ userId: user.id, stripeCustomerId, tier, status })
    .onConflictDoUpdate({
      target: subscriptions.userId,
      set: { stripeCustomerId, tier, status },
    });

  return { applied: true };
}

export async function applyPendingForUser(_user) {
  // Pending entitlements feature not yet implemented
  return;
}