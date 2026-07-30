// 1. Auth → userId
// 2. getUserBilling(userId)
// 3. Return plan, limits, usage, and subscription flags

import { getUserBilling } from "@/lib/billing";
import { PLAN_LIMITS, PlanType } from "@/lib/plan";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const userBilling = await getUserBilling(userId);
    const plan = userBilling.plan as PlanType;

    return NextResponse.json({
      success: true,
      message: "User's billing details fetched successfully!",
      data: {
        plan,
        messageCount: userBilling.messageCount,
        messageLimit: PLAN_LIMITS[plan].messagesPerMonth,
        documentLimit: PLAN_LIMITS[plan].documents,
        workspaceLimit: PLAN_LIMITS[plan].workspaces,
        messageResetAt: userBilling.messageResetAt,
        hasSubscription: Boolean(userBilling.stripeSubscriptionId),
        canManageBilling: Boolean(userBilling.stripeCustomerId),
      },
    });
  } catch (error) {
    console.error("[GET /api/billing]", error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
