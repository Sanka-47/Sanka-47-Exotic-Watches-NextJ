"use client";

import React, { useEffect, useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import convertToSubcurrency from "@/lib/actions/convertToSubcurrency";
import { Button, Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

const CheckoutPage = ({ amount }: { amount: number }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: convertToSubcurrency(amount) }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [amount]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      setLoading(false);
      return;
    }

    const { error: submitError } = await elements.submit();

    if (submitError) {
      setErrorMessage(submitError.message);
      setLoading(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `http://www.localhost:3000/payment-success?amount=${amount}`,
      },
    });

    if (error) {
      setErrorMessage(error.message);
    }

    setLoading(false);
  };

  if (!clientSecret || !stripe || !elements) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: 4,
        }}
      >
        <Box
          sx={{
            width: 32,
            height: 32,
            border: "4px solid",
            borderColor: "grey.300",
            borderTopColor: "primary.main",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            "@keyframes spin": {
              "0%": { transform: "rotate(0deg)" },
              "100%": { transform: "rotate(360deg)" },
            },
          }}
        />
      </Box>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      sx={{
        bgcolor: "white",
        p: 3,
        borderRadius: 2,
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Payment Element */}
      {clientSecret && (
        <Box sx={{ mb: 3 }}>
          <PaymentElement
            options={{
              layout: "tabs",
              paymentMethodOrder: ["card", "link"],
              fields: {
                billingDetails: {
                  name: "auto",
                  email: "auto",
                },
              },
              wallets: {
                applePay: "auto",
                googlePay: "auto",
              },
            }}
          />
        </Box>
      )}

      {/* Error Message */}
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Typography
            variant="body2"
            color="error"
            sx={{
              mb: 2,
              p: 1,
              bgcolor: "error.light",
              borderRadius: 1,
              color: "error.contrastText",
            }}
          >
            {errorMessage}
          </Typography>
        </motion.div>
      )}

      {/* MUI Pay Button */}
      <Button
        type="submit"
        variant="contained"
        disabled={!stripe || loading}
        sx={{
          width: "100%",
          py: 1.5,
          bgcolor: "primary.main",
          color: "white",
          fontWeight: "bold",
          borderRadius: 2,
          textTransform: "none",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          transition: "all 0.3s ease",
          "&:hover": {
            bgcolor: "primary.dark",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            transform: "translateY(-1px)",
          },
          "&:disabled": {
            bgcolor: "grey.400",
            color: "grey.50",
            boxShadow: "none",
            animation: loading ? "pulse 1.5s infinite" : "none",
            "@keyframes pulse": {
              "0%": { opacity: 0.5 },
              "50%": { opacity: 0.8 },
              "100%": { opacity: 0.5 },
            },
          },
        }}
      >
        {!loading ? `Pay $${amount.toFixed(2)}` : "Processing..."}
      </Button>
    </motion.form>
  );
};

export default CheckoutPage;