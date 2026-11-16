import { db } from "@/db";
import { orderTotalCents, toCents } from "@/lib/money";

export class InventoryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InventoryError";
  }
}

export interface PendingOrder {
  id: number;
  totalCents: number;
}

/**
 * Creates a PENDING order from server-side product data only. The client can
 * never influence the price: it sends a product id and a quantity.
 */
export async function createPendingOrder({
  userId,
  productId,
  quantity,
}: {
  userId: string;
  productId: number;
  quantity: number;
}): Promise<PendingOrder> {
  const product = await db.product.findUnique({ where: { id: productId } });

  if (!product) {
    throw new InventoryError("This product no longer exists.");
  }
  if (product.quantity < quantity) {
    throw new InventoryError("There is not enough stock for this order.");
  }

  const unitPriceCents = toCents(Number(product.price));
  const totalCents = orderTotalCents(unitPriceCents, quantity);

  const order = await db.order.create({
    data: {
      userId,
      totalCents,
      items: {
        create: {
          productId: product.id,
          productName: product.name,
          quantity,
          unitPriceCents,
        },
      },
    },
    select: { id: true, totalCents: true },
  });

  return order;
}

export async function attachPaymentIntent(orderId: number, paymentIntentId: string) {
  await db.order.update({
    where: { id: orderId },
    data: { stripePaymentIntentId: paymentIntentId },
  });
}

export async function markOrderFailed(orderId: number) {
  await db.order.updateMany({
    where: { id: orderId, status: "PENDING" },
    data: { status: "FAILED" },
  });
}

/**
 * Idempotently marks an order as paid and decrements stock. Called from the
 * Stripe webhook, which is the only trusted source of payment truth.
 */
export async function markOrderPaid(orderId: number, paymentIntentId: string) {
  await db.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order || order.status === "PAID") return;

    await tx.order.update({
      where: { id: order.id },
      data: { status: "PAID", stripePaymentIntentId: paymentIntentId },
    });

    for (const item of order.items) {
      if (!item.productId) continue;

      const product = await tx.product.findUnique({ where: { id: item.productId } });
      if (!product) continue;

      await tx.product.update({
        where: { id: product.id },
        data: { quantity: Math.max(0, product.quantity - item.quantity) },
      });
    }
  });
}

export async function getOrderForUser(orderId: number, userId: string) {
  return db.order.findFirst({
    where: { id: orderId, userId },
    include: { items: true },
  });
}

export async function getOrderByPaymentIntent(paymentIntentId: string, userId: string) {
  return db.order.findFirst({
    where: { stripePaymentIntentId: paymentIntentId, userId },
    include: { items: true },
  });
}
