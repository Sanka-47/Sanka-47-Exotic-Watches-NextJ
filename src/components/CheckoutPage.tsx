"use client";

import { useEffect, useRef, useState } from "react";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Alert, Box, Button, CircularProgress, Typography } from "@mui/material";
import { formatUsd } from "@/lib/money";

export default function CheckoutPage({
  amount,
  productId,
  productName,
}: {
  amount: number;
  productId: number;
  productName: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const started = useRef(false);

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    // Guards against the double effect invocation of React StrictMode in dev.
    if (started.current) return;
    started.current = true;

    const controller = new AbortController();

    async function createIntent() {
      try {
        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, quantity: 1 }),
          signal: controller.signal,
        });

        const data = (await response.json()) as { clientSecret?: string; error?: string };

        if (!response.ok || !data.clientSecret) {
          throw new Error(data.error ?? "Could not start the payment.");
        }

        setClientSecret(data.clientSecret);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setErrorMessage(error instanceof Error ? error.message : "Could not start the payment.");
      }
    }

    void createIntent();
    return () => controller.abort();
  }, [productId, attempt]);

  function retry() {
    started.current = false;
    setErrorMessage(null);
    setAttempt((current) => current + 1);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    if (!stripe || !elements || !clientSecret) return;

    setLoading(true);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setErrorMessage(submitError.message ?? "Please check your payment details.");
      setLoading(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
      },
    });

    if (error) {
      setErrorMessage(error.message ?? "The payment could not be completed.");
      setLoading(false);
    }
  }

  if (!clientSecret) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, py: 6 }}>
        {errorMessage ? (
          <>
            <Alert severity="error" sx={{ width: "100%" }}>
              {errorMessage}
            </Alert>
            <Button variant="outlined" onClick={retry}>
              Try again
            </Button>
          </>
        ) : (
          <>
            <CircularProgress />
            <Typography variant="body2" color="text.secondary">
              Preparing secure payment…
            </Typography>
          </>
        )}
      </Box>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: "#fff",
        padding: 24,
        borderRadius: 12,
        border: "1px solid #e0e0e0",
      }}
    >
      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        {productName}
      </Typography>

      <PaymentElement options={{ layout: "tabs" }} />

      {errorMessage ? (
        <Alert severity="error" sx={{ mt: 2 }}>
          {errorMessage}
        </Alert>
      ) : null}

      <Button
        type="submit"
        variant="contained"
        fullWidth
        size="large"
        disabled={!stripe || loading}
        sx={{ mt: 3, textTransform: "none", py: 1.5 }}
      >
        {loading ? "Processing…" : `Pay ${formatUsd(amount)}`}
      </Button>

      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2 }}>
        Demo checkout. Use Stripe test card 4242 4242 4242 4242 with any future expiry date.
      </Typography>
    </form>
  );
}
