import { getUserBilling } from "@/lib/billing";
import { db } from "@/lib/db-config";
import { stripe } from "@/lib/stripe";
import { billing } from "@/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

/*
1. Auth → userId
2. Validate body → { priceId: string }
3. getUserBilling(userId) → check existing stripeCustomerId
4. If no stripeCustomerId:
     stripe.customers.create({ metadata: { userId } })
     update billing table with new cus_xxx
5. stripe.checkout.sessions.create({
     customer: stripeCustomerId,
     line_items: [{ price: priceId, quantity: 1 }],
     mode: "subscription",
     success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing/success`,
     cancel_url:  `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
     metadata: { userId },  // ← critical, webhook needs this
   })
6. Return { url: session.url }
*/

const checkoutSchema = z.object({
  priceId: z
    .string()
    .min(1, "Price id required")
    .startsWith("price_", "Invalid Stripe price id"),
});

export async function POST(req: Request) {
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

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const parsed = checkoutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { priceId } = parsed.data;
    const userBilling = await getUserBilling(userId);

    let stripeCustomerId = userBilling.stripeCustomerId;

    // Stale IDs from a previous Stripe account/sandbox are invalid
    if (stripeCustomerId) {
      let customerValid = false;
      try {
        const existing = await stripe.customers.retrieve(stripeCustomerId);
        customerValid = !("deleted" in existing && existing.deleted);
      } catch (error) {
        if (
          !(
            error instanceof stripe.errors.StripeError &&
            error.code === "resource_missing"
          )
        ) {
          throw error;
        }
      }

      if (!customerValid) {
        stripeCustomerId = null;
        await db
          .update(billing)
          .set({
            stripeCustomerId: null,
            stripeSubscriptionId: null,
            plan: "free",
            updatedAt: new Date(),
          })
          .where(eq(billing.userId, userId));
      }
    }

    if (!stripeCustomerId) {
      const user = await currentUser();
      const email = user?.primaryEmailAddress?.emailAddress;

      const customer = await stripe.customers.create({
        email: email ?? undefined,
        metadata: { userId },
      });

      stripeCustomerId = customer.id;

      await db
        .update(billing)
        .set({
          stripeCustomerId,
          updatedAt: new Date(),
        })
        .where(eq(billing.userId, userId));
    }

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
      metadata: { userId },
    });

    if (!session.url) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to create checkout session",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Checkout session created",
        data: { checkoutUrl: session.url },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("[POST /api/billing/checkout ]", error);

    // Stripe-specific errors (invalid price, etc.)
    if (error instanceof stripe.errors.StripeError) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: error.statusCode ?? 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
