// 1. Auth → userId
// 2. getUserBilling(userId) → get stripeCustomerId
// 3. If no stripeCustomerId → they're free tier, no portal
//    return 400 "No active subscription"
// 4. stripe.billingPortal.sessions.create({
//      customer: stripeCustomerId,
//      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing`
//    })
// 5. return { url: session.url }

import { getUserBilling } from "@/lib/billing";
import { db } from "@/lib/db-config";
import { stripe } from "@/lib/stripe";
import { billing } from "@/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!process.env.NEXT_PUBLIC_APP_URL) {
      return NextResponse.json(
        { success: false, message: "App URL not configured" },
        { status: 500 }
      );
    }

    const userBilling = await getUserBilling(userId);
    if (!userBilling.stripeCustomerId) {
      return NextResponse.json(
        { success: false, message: "No active subscription" },
        { status: 400 }
      );
    }

    try {
      await stripe.customers.retrieve(userBilling.stripeCustomerId);
    } catch (error) {
      if (
        error instanceof stripe.errors.StripeError &&
        error.code === "resource_missing"
      ) {
        await db
          .update(billing)
          .set({
            stripeCustomerId: null,
            stripeSubscriptionId: null,
            plan: "free",
            updatedAt: new Date(),
          })
          .where(eq(billing.userId, userId));

        return NextResponse.json(
          {
            success: false,
            message: "No active subscription. Please upgrade again.",
          },
          { status: 400 }
        );
      }
      throw error;
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: userBilling.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
    });

    if (!session.url) {
      return NextResponse.json(
        { success: false, message: "Failed to create portal session" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Portal session created",
      data: { portalUrl: session.url },
    });
  } catch (error) {
    console.error("[POST /api/billing/portal ]", error);

    if (error instanceof stripe.errors.StripeError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: error.statusCode ?? 500 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
