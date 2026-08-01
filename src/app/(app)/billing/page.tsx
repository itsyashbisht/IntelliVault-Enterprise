import { getUserBilling } from "@/lib/billing";
import { db } from "@/lib/db-config";
import { PLAN_LIMITS, type PlanType } from "@/lib/plan";
import { documents, workspaceMembers } from "@/schema";
import { auth } from "@clerk/nextjs/server";
import { and, count, eq, inArray } from "drizzle-orm";
import { redirect } from "next/navigation";
import BillingClient from "./billing-client";

function formatResetDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default async function BillingPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const userBilling = await getUserBilling(userId);
  const plan = userBilling.plan as PlanType;
  const limits = PLAN_LIMITS[plan];

  const ownedWorkspaces = await db
    .select({ workspaceId: workspaceMembers.workspaceId })
    .from(workspaceMembers)
    .where(
      and(
        eq(workspaceMembers.userId, userId),
        eq(workspaceMembers.role, "owner")
      )
    );

  const workspaceCount = ownedWorkspaces.length;
  const ownedIds = ownedWorkspaces.map((w) => w.workspaceId);

  const documentCount =
    ownedIds.length === 0
      ? 0
      : (
          await db
            .select({ count: count() })
            .from(documents)
            .where(inArray(documents.workspaceId, ownedIds))
        )[0]?.count ?? 0;

  return (
    <BillingClient
      data={{
        plan,
        messageCount: userBilling.messageCount,
        messageLimit: limits.messagesPerMonth,
        documentCount: Number(documentCount),
        documentLimit: limits.documents,
        workspaceCount,
        workspaceLimit: limits.workspaces,
        messageResetAt: formatResetDate(new Date(userBilling.messageResetAt)),
        canManageBilling: Boolean(userBilling.stripeCustomerId),
      }}
    />
  );
}
