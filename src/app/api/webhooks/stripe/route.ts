import type Stripe from "stripe";
import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe";
import { markOrderFailed, markOrderPaid } from "@/lib/orders";

export const runtime = "nodejs";

function orderIdFrom(intent: Stripe.PaymentIntent): number | null {
  const orderId = Number(intent.metadata.orderId);
  return Number.isInteger(orderId) && orderId > 0 ? orderId : null;
}

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Webhook is not configured." }, { status: 400 });
  }

  const payload = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    console.error("Invalid Stripe webhook signature", error);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  switch (event.type) {
    case "payment_intent.succeeded": {
      const orderId = orderIdFrom(event.data.object);
      if (orderId) await markOrderPaid(orderId, event.data.object.id);
      break;
    }
    case "payment_intent.payment_failed":
    case "payment_intent.canceled": {
      const orderId = orderIdFrom(event.data.object);
      if (orderId) await markOrderFailed(orderId);
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
