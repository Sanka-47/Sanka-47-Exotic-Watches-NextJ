import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { stripe } from "@/lib/stripe";
import {
  attachPaymentIntent,
  createPendingOrder,
  InventoryError,
  markOrderFailed,
} from "@/lib/orders";
import { checkoutSchema, firstIssueMessage } from "@/lib/validation";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "You must be signed in to check out." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: firstIssueMessage(parsed.error) }, { status: 400 });
  }

  let order: { id: number; totalCents: number };
  try {
    order = await createPendingOrder({
      userId: session.user.id,
      productId: parsed.data.productId,
      quantity: parsed.data.quantity,
    });
  } catch (error) {
    if (error instanceof InventoryError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    console.error("Could not create order", error);
    return NextResponse.json({ error: "Could not start the payment." }, { status: 500 });
  }

  try {
    // The amount comes from the database, never from the request body.
    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount: order.totalCents,
        currency: "usd",
        automatic_payment_methods: { enabled: true },
        metadata: {
          orderId: String(order.id),
          userId: session.user.id,
        },
      },
      { idempotencyKey: `order_${order.id}` },
    );

    await attachPaymentIntent(order.id, paymentIntent.id);

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      orderId: order.id,
    });
  } catch (error) {
    await markOrderFailed(order.id);
    console.error("Stripe payment intent creation failed", error);
    return NextResponse.json({ error: "Could not start the payment." }, { status: 502 });
  }
}
