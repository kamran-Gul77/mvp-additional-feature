import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import clientPromise from "@/lib/mongodb";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db("compliance_buddy");

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session;

      if (session.metadata?.userId) {
        await db.collection("users").updateOne(
          { clerkId: session.metadata.userId },
          {
            $set: {
              subscription: "paid",
              stripeCustomerId: session.customer as string,
              subscriptionId: session.subscription as string,
              updatedAt: new Date(),
            },
          }
        );
      }
      break;

    case "customer.subscription.deleted":
      const subscription = event.data.object as Stripe.Subscription;

      await db.collection("users").updateOne(
        { subscriptionId: subscription.id },
        {
          $set: {
            subscription: "free",
            subscriptionId: null,
            updatedAt: new Date(),
          },
        }
      );
      break;

    case "invoice.payment_failed":
      // Handle failed payment
      const invoice = event.data.object as Stripe.Invoice;
      console.log("Payment failed for subscription:", invoice.subscription);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
