import PaymentSuccessInner from "@/components/PaymentSuccess";

export default function PaymentSuccess({
  searchParams: { amount },
}: {
  searchParams: { amount: string };
}) {
  return <PaymentSuccessInner amount={amount} />;
}

