import { db } from "../db/client.mjs";
import { pendingEntitlements, subscriptions, users } from "../db/schema/index.mjs";
import { eq, and, isNull } from "drizzle-orm";

export async function applyPendingForUser(user) {
  if (!user?.id) return;

  const stripeCustomerId = user.stripeCustomerId;

  const pending = stripeCustomerId
    ? await db.select().from(pendingEntitlements).where(and(eq(pendingEntitlements.stripeCustomerId, stripeCustomerId), isNull(pendingEntitlements.appliedAt)))
    : [];

  for (const p of pending) {
    await db.insert(subscriptions).values({
      userId: user.id,
      tier: p.tier,
      stripeCustomerId: p.stripeCustomerId,
      status: p.status,
    }).onConflictDoUpdate({
      target: subscriptions.userId,
      set: { tier: p.tier, status: p.status, stripeCustomerId: p.stripeCustomerId },
    });

    await db.update(pendingEntitlements).set({ appliedAt: new Date() }).where(eq(pendingEntitlements.id, p.id));
  }
}