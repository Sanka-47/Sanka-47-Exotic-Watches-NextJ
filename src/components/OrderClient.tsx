"use client";

import { useMemo } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import CheckoutPage from "@/components/CheckoutPage";
import { getStripePromise } from "@/lib/stripe-client";
import { toCents } from "@/lib/money";

export default function OrderClient({
  amount,
  productId,
  productName,
  userName,
}: {
  amount: number;
  productId: number;
  productName: string;
  userName: string;
}) {
  const stripePromise = useMemo(() => getStripePromise(), []);

  return (
    <Box sx={{ maxWidth: 560, mx: "auto" }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Typography variant="h5" fontWeight={700}>
          Checkout
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
          {userName}, you are ordering the {productName}.
        </Typography>

        <Elements
          stripe={stripePromise}
          options={{
            mode: "payment",
            amount: toCents(amount),
            currency: "usd",
            appearance: {
              theme: "stripe",
              variables: {
                colorPrimary: "#1976d2",
                borderRadius: "8px",
              },
            },
          }}
        >
          <CheckoutPage amount={amount} productId={productId} productName={productName} />
        </Elements>
      </motion.div>
    </Box>
  );
}
