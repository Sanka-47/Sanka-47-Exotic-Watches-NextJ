import { loadStripe, type Stripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null> | null = null;

/** Lazily loads the Stripe.js instance in the browser. */
export function getStripePromise(): Promise<Stripe | null> {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;

  if (!publishableKey) {
    throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
  }

  stripePromise ??= loadStripe(publishableKey);
  return stripePromise;
}
