"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import CheckoutPage from "@/components/CheckoutPage";
import convertToSubcurrency from "@/lib/actions/convertToSubcurrency";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { motion } from "framer-motion";

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function OrderPage() {
  const searchParams = useSearchParams();
  const [price, setPrice] = useState<string | null>(null);
  const [numericPrice, setNumericPrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const priceParam = searchParams.get("price");
    if (priceParam) {
      setPrice(priceParam);
    }
    setIsLoading(false);
  }, [searchParams]);

  useEffect(() => {
    if (price) {
      const parsedPrice = Number(price);
      if (!isNaN(parsedPrice)) {
        setNumericPrice(parsedPrice);
      }
    }
  }, [price]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-6 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-lg w-full mx-auto bg-white rounded-lg shadow-md p-6 sm:p-8"
      >
        {/* Header Section */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-gray-800">Red Dragon</h1>
          <h2 className="text-lg text-gray-600 mt-1">
            has requested{" "}
            <span className="font-bold text-gray-900">
              {isLoading ? (
                <span className="animate-pulse">Loading...</span>
              ) : numericPrice !== null ? (
                `$${numericPrice.toFixed(2)}`
              ) : (
                "Unable to load price"
              )}
            </span>
          </h2>
        </div>

        {/* Checkout Section */}
        {numericPrice !== null ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Elements
              stripe={stripePromise}
              options={{
                mode: "payment",
                amount: convertToSubcurrency(numericPrice),
                currency: "usd",
                appearance: {
                  theme: "stripe",
                  variables: {
                    colorPrimary: "#007bff",
                    colorBackground: "#ffffff",
                    colorText: "#1a1a1a",
                    borderRadius: "8px",
                    fontFamily: "'Inter', sans-serif",
                    spacingUnit: "4px",
                    fontSizeBase: "16px",
                  },
                  rules: {
                    ".Input": {
                      border: "1px solid #e0e0e0",
                      padding: "12px",
                      boxShadow: "none",
                      transition: "border-color 0.2s ease-in-out",
                    },
                    ".Input:focus": {
                      borderColor: "#007bff",
                      boxShadow: "0 0 0 2px rgba(0, 123, 255, 0.1)",
                    },
                    ".Tab": {
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                      padding: "12px",
                      backgroundColor: "#f9f9f9",
                      transition: "all 0.2s ease-in-out",
                    },
                    ".Tab--selected": {
                      borderColor: "#007bff",
                      backgroundColor: "#ffffff",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
                    },
                    ".Label": {
                      color: "#1a1a1a",
                      fontWeight: "500",
                      marginBottom: "8px",
                    },
                  },
                },
              }}
            >
              <CheckoutPage amount={numericPrice} />
            </Elements>
          </motion.div>
        ) : (
          !isLoading && (
            <div className="text-center text-red-600 bg-red-50 p-4 rounded-lg">
              <p className="text-sm font-medium">
                Failed to load the price. Please try again later.
              </p>
            </div>
          )
        )}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex justify-center mt-6">
            <div className="w-8 h-8 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
          </div>
        )}
      </motion.div>
    </div>
  );
}