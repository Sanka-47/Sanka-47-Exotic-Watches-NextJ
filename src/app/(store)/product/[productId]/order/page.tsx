import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Box, Button, Typography } from "@mui/material";
import Link from "next/link";
import { requireUserPage } from "@/lib/auth-guards";
import { getProductDetail } from "@/lib/products";
import OrderClient from "@/components/OrderClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Checkout",
};

interface OrderPageProps {
  params: Promise<{ productId: string }>;
}

export default async function OrderPage({ params }: OrderPageProps) {
  const user = await requireUserPage();
  const { productId } = await params;
  const id = Number.parseInt(productId, 10);
  const product = Number.isInteger(id) ? await getProductDetail(id) : null;

  if (!product) notFound();

  if (product.quantity <= 0) {
    return (
      <Box sx={{ maxWidth: 560, mx: "auto", textAlign: "center", py: 8 }}>
        <Typography variant="h5" fontWeight={700}>
          This watch is out of stock
        </Typography>
        <Button component={Link} href={`/product/${product.id}`} sx={{ mt: 2 }}>
          Back to product
        </Button>
      </Box>
    );
  }

  return (
    <OrderClient
      amount={Number(product.price)}
      productId={product.id}
      productName={product.name}
      userName={user.name ?? "there"}
    />
  );
}
