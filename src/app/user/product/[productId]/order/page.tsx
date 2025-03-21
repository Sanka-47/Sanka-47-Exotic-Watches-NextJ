'use client';
import CheckoutPage from "@/components/CheckoutPage";
import convertToSubcurrency from "@/lib/actions/convertToSubcurrency";
import { Elements } from "@stripe/react-stripe-js"; 
import { loadStripe } from "@stripe/stripe-js";  


if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY == undefined) {
    throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
  }
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

function page() {
    const amount = 1000;
  return (
    <main className="max-w-6x1 mx-auto p-10 text-white text-center border m-10 rounded-md bg-gradient-to-tr from-blue-500
    to-purple-500">
    <div className="mb-10">
    <h1 className="text-4x1 font-extrabold mb-2">Sonny</h1>
    <h2 className="text-2x1">
        has requested
        <span className="font-bold"> ${amount}</span>
    </h2>
    </div>
    
    <Elements
        stripe={stripePromise}
        options={{
        mode: "payment",
        amount: convertToSubcurrency(amount), // cents
        currency: "usd",
        }}>
        <CheckoutPage amount={amount} />
    </Elements>
    </main>
  )
}

export default page