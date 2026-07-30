import { billing } from "@/schema";
import { eq } from "drizzle-orm";
import { db } from "./db-config";
import { PLAN_LIMITS, PlanType } from "./plan";

// Get billing row — create free tier if first time
export async function getUserBilling(userId: string) {
  const existing = await db.query.billing.findFirst({
    where: eq(billing.userId, userId),
  });
  if (existing) return existing;

  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

  // First time user -> create free tier row
  const [created] = await db
    .insert(billing)
    .values({
      userId,
      messageResetAt: thirtyDaysFromNow, // ← not defaultNow()
    })
    .returning();

  return created;
}

// Check if user is within their plan limits
export async function checkLimit(
  userId: string,
  resource: "workspaces" | "documents" | "messagesPerMonth",
  currentCount: number
): Promise<{ allowed: boolean; plan: PlanType; limit: number }> {
  const userBilling = await getUserBilling(userId);
  const plan = userBilling.plan as PlanType;

  // Reset message count if new month
  if (resource === "messagesPerMonth") {
    const now = new Date();
    const nextReset = new Date(userBilling.messageResetAt);

    if (now >= nextReset) {
      const newResetAt = new Date(nextReset);
      newResetAt.setDate(newResetAt.getDate() + 30);

      await db
        .update(billing)
        .set({
          messageCount: 0,
          messageResetAt: newResetAt,
          updatedAt: now,
        })
        .where(eq(billing.userId, userId));

      return { allowed: true, plan, limit: PLAN_LIMITS[plan][resource] };
    }
  }

  const limit = PLAN_LIMITS[plan][resource];
  const allowed = currentCount < limit;

  return { allowed, plan, limit };
}

export async function incrementMessageCount(userId: string) {
  const userBilling = await getUserBilling(userId);
  await db
    .update(billing)
    .set({
      messageCount: userBilling.messageCount + 1,
      updatedAt: new Date(),
    })
    .where(eq(billing.userId, userId));
}
