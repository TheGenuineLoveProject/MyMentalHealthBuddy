import { db } from "../db/client.mjs";
import { pendingEntitlements, users, subscriptions } from "../db/schema/index.mjs";
import { eq } from "drizzle-orm";

export async function applyOrBufferEntitlement({ stripeCustomerId, email, tier, status }) {
  // 1) try to find user by stripe_customer_id (best) or email (fallback)
  const userByStripe = await db.select().from(users).where(eq(users.stripeCustomerId, stripeCustomerId)).limit(1);
  const user = userByStripe[0];

  if (!user) {
    // Buffer it
    await db.insert(pendingEntitlements).values({
      stripeCustomerId,
      email: email || null,
      tier,
      status,
    });
    return { buffered: true };
  }

  // Apply it
  await db.insert(subscriptions).values({
    userId: user.id,
    tier,
    stripeCustomerId,
    status,
  }).onConflictDoUpdate({
    target: subscriptions.userId,
    set: { tier, status, stripeCustomerId },
  });

  return { applied: true };
}