import type { Metadata } from "next";
import Link from "next/link";
import { Alert, Box, Button, Card, CardContent, Divider, Stack, Typography } from "@mui/material";
import { requireUserPage } from "@/lib/auth-guards";
import { getOrderByPaymentIntent } from "@/lib/orders";
import { fromCents, formatUsd } from "@/lib/money";
import { stripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Order status",
};

interface PaymentSuccessPageProps {
  searchParams: Promise<{ payment_intent?: string }>;
}

function StatusCard({
  severity,
  title,
  message,
  children,
}: {
  severity: "success" | "info" | "warning" | "error";
  title: string;
  message: string;
  children?: React.ReactNode;
}) {
  return (
    <Box sx={{ maxWidth: 560, mx: "auto" }}>
      <Card sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Alert severity={severity} sx={{ mb: 3 }}>
            {title}
          </Alert>
          <Typography variant="body1" color="text.secondary">
            {message}
          </Typography>
          {children}
          <Divider sx={{ my: 3 }} />
          <Button component={Link} href="/" variant="outlined">
            Continue shopping
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}

export default async function PaymentSuccessPage({ searchParams }: PaymentSuccessPageProps) {
  const user = await requireUserPage();
  const { payment_intent: paymentIntentId } = await searchParams;

  if (!paymentIntentId) {
    return (
      <StatusCard
        severity="info"
        title="Nothing to show"
        message="This page displays the result of a completed checkout. Start an order from a product page."
      />
    );
  }

  let intent;
  try {
    intent = await stripe.paymentIntents.retrieve(paymentIntentId);
  } catch {
    return (
      <StatusCard
        severity="error"
        title="Payment not found"
        message="We could not find that payment. If you were charged, contact support with your receipt."
      />
    );
  }

  if (intent.status !== "succeeded") {
    return (
      <StatusCard
        severity="warning"
        title="Payment not completed"
        message={`Stripe reports this payment as "${intent.status}". No stock has been reserved.`}
      />
    );
  }

  const order = await getOrderByPaymentIntent(intent.id, user.id);

  if (!order) {
    return (
      <StatusCard
        severity="success"
        title="Payment received"
        message="Your payment succeeded. The order will appear in your account once the Stripe webhook is processed."
      />
    );
  }

  return (
    <Box sx={{ maxWidth: 560, mx: "auto" }}>
      <Card sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Alert severity="success" sx={{ mb: 3 }}>
            {order.status === "PAID" ? "Order confirmed" : "Payment received, order is processing"}
          </Alert>

          <Typography variant="h5" fontWeight={700}>
            {formatUsd(fromCents(order.totalCents))}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Order #{order.id} · {new Date(order.createdAt).toLocaleDateString()}
          </Typography>

          <Stack spacing={1} sx={{ mt: 3 }}>
            {order.items.map((item) => (
              <Box key={item.id} sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                <Typography variant="body2">
                  {item.productName} × {item.quantity}
                </Typography>
                <Typography variant="body2">
                  {formatUsd(fromCents(item.unitPriceCents * item.quantity))}
                </Typography>
              </Box>
            ))}
          </Stack>

          <Divider sx={{ my: 3 }} />
          <Button component={Link} href="/" variant="outlined">
            Continue shopping
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
