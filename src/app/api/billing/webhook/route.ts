import { db } from "@/lib/db-config";
import { stripe } from "@/lib/stripe";
import { billing } from "@/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import type Stripe from "stripe";

function resolvePlan(priceId: string): "pro" | "team" | null {
  if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID) return "pro";
  if (priceId === process.env.NEXT_PUBLIC_STRIPE_TEAM_PRICE_ID) return "team";
  return null;
}

export async function POST(req: Request) {
  // Do NOT use Clerk auth here — Stripe authenticates via signature
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[POST /api/billing/webhook] STRIPE_WEBHOOK_SECRET missing");
    return NextResponse.json(
      { success: false, message: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json(
      { success: false, message: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    console.error("[POST /api/billing/webhook] Signature verification failed:", error);
    return NextResponse.json(
      { success: false, message: "Invalid signature" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const userId = session.metadata?.userId;
        if (!userId) {
          console.error(
            "[stripe] checkout.session.completed missing metadata.userId",
            session.id
          );
          return NextResponse.json(
            { success: false, message: "Missing userId in session metadata" },
            { status: 400 }
          );
        }

        if (session.mode !== "subscription" || !session.subscription) {
          console.error(
            "[stripe] checkout.session.completed missing subscription",
            session.id
          );
          return NextResponse.json(
            { success: false, message: "Missing subscription on session" },
            { status: 400 }
          );
        }

        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription.id;

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = subscription.items.data[0]?.price?.id;
        if (!priceId) {
          console.error("[stripe] Subscription has no price:", subscriptionId);
          return NextResponse.json(
            { success: false, message: "Subscription has no price" },
            { status: 400 }
          );
        }

        const plan = resolvePlan(priceId);
        if (!plan) {
          console.error("[stripe] Unknown price id:", priceId);
          return NextResponse.json(
            { success: false, message: "Unknown price id" },
            { status: 400 }
          );
        }

        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

        const stripeCustomerId =
          typeof session.customer === "string"
            ? session.customer
            : session.customer?.id;

        await db
          .update(billing)
          .set({
            plan,
            stripeSubscriptionId: subscriptionId,
            ...(stripeCustomerId ? { stripeCustomerId } : {}),
            messageCount: 0,
            messageResetAt: thirtyDaysFromNow,
            updatedAt: new Date(),
          })
          .where(eq(billing.userId, userId));

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const subId = subscription.id;

        // Look up by subscription id — never use Clerk auth userId here
        await db
          .update(billing)
          .set({
            plan: "free",
            stripeSubscriptionId: null,
            updatedAt: new Date(),
          })
          .where(eq(billing.stripeSubscriptionId, subId));

        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const subId = subscription.id;
        const priceId = subscription.items.data[0]?.price?.id;

        if (!priceId) break;

        const plan = resolvePlan(priceId);
        if (!plan) {
          console.error("[stripe] Unknown price on subscription.updated:", priceId);
          break;
        }

        // Only update active/trialing subscriptions
        if (
          subscription.status === "active" ||
          subscription.status === "trialing"
        ) {
          await db
            .update(billing)
            .set({
              plan,
              stripeSubscriptionId: subId,
              updatedAt: new Date(),
            })
            .where(eq(billing.stripeSubscriptionId, subId));
        }

        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        console.error(
          "[stripe] Payment failed for customer:",
          invoice.customer
        );
        break;
      }

      default:
        // Unhandled event types — acknowledge so Stripe doesn't retry
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[POST /api/billing/webhook]", error);

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
