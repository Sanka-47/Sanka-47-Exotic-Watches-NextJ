"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import CheckoutPage from "@/components/CheckoutPage";
import convertToSubcurrency from "@/lib/actions/convertToSubcurrency";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function OrderPage() {
  const searchParams = useSearchParams();
  const [price, setPrice] = useState<string | null>(null);
  const [numericPrice, setNumericPrice] = useState<number | null>(null);

  useEffect(() => {
    const priceParam = searchParams.get("price");
    if (priceParam) {
      setPrice(priceParam);
    }
  }, [searchParams]); // This ensures it runs when the searchParams change

  useEffect(() => {
    if (price) {
      const parsedPrice = Number(price);
      if (!isNaN(parsedPrice)) {
        setNumericPrice(parsedPrice);
      }
    }
  }, [price]); // This runs when `price` is updated

  return (
    <main className="max-w-6x1 mx-auto p-10 text-white text-center border m-10 rounded-md bg-gradient-to-tr from-blue-500 to-purple-500">
      <div className="mb-10">
        <h1 className="text-4x1 font-extrabold mb-2">Red Dragon</h1>
        <h2 className="text-2x1">
          has requested
          <span className="font-bold"> ${numericPrice !== null ? numericPrice : "loading..."}</span>
        </h2>
      </div>

      {numericPrice !== null && (
        <Elements
          stripe={stripePromise}
          options={{
            mode: "payment",
            amount: convertToSubcurrency(numericPrice), // cents
            currency: "usd",
          }}
        >
          <CheckoutPage amount={numericPrice} />
        </Elements>
      )}
    </main>
  );
}
