import { notFound } from "next/navigation";
import { getProductDetail } from "@/lib/products";
import ProductView from "@/components/ProductView";

export const dynamic = "force-dynamic";

interface ProductViewPageProps {
  params: Promise<{ productId: string }>;
}

export default async function ProductViewPage({ params }: ProductViewPageProps) {
  const { productId } = await params;
  const id = Number.parseInt(productId, 10);
  const product = Number.isInteger(id) ? await getProductDetail(id) : null;

  if (!product) notFound();

  return <ProductView product={product} />;
}
