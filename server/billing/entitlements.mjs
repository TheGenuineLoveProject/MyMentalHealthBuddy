import { db } from "../db/client.mjs";
import { pendingEntitlements } from "../db/schema/pendingEntitlements.mjs";
import { eq, and, isNull } from "drizzle-orm";

// ✅ Adjust these two imports to match YOUR filenames:
import { users } from "../db/schema/users.mjs";
import { subscriptions } from "../db/schema/subscriptions.mjs";

export async function applyOrBufferEntitlement({ stripeCustomerId, email, tier, status }) {
  const found = await db.select().from(users).where(eq(users.stripeCustomerId, stripeCustomerId)).limit(1);
  const user = found[0];

  if (!user) {
    await db.insert(pendingEntitlements).values({ stripeCustomerId, email: email || null, tier, status });
    return { buffered: true };
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

export async function applyPendingForUser(user) {
  if (!user?.stripeCustomerId) return;

  const pending = await db
    .select()
    .from(pendingEntitlements)
    .where(and(eq(pendingEntitlements.stripeCustomerId, user.stripeCustomerId), isNull(pendingEntitlements.appliedAt)));

  for (const p of pending) {
    await db
      .insert(subscriptions)
      .values({ userId: user.id, stripeCustomerId: p.stripeCustomerId, tier: p.tier, status: p.status })
      .onConflictDoUpdate({
        target: subscriptions.userId,
        set: { stripeCustomerId: p.stripeCustomerId, tier: p.tier, status: p.status },
      });

    await db.update(pendingEntitlements).set({ appliedAt: new Date() }).where(eq(pendingEntitlements.id, p.id));
  }
}