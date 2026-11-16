import { notFound } from "next/navigation";
import { getEditableProduct } from "@/lib/products";
import ProductEditForm from "@/components/ProductEditForm";

export const dynamic = "force-dynamic";

interface ProductEditPageProps {
  params: Promise<{ productId: string }>;
}

export default async function ProductEditPage({ params }: ProductEditPageProps) {
  const { productId } = await params;
  const id = Number.parseInt(productId, 10);
  const product = Number.isInteger(id) ? await getEditableProduct(id) : null;

  if (!product) notFound();

  return <ProductEditForm product={product} />;
}
