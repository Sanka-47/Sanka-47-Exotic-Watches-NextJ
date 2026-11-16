import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductView from "@/components/ProductView";
import { getProductDetail } from "@/lib/products";

interface ProductPageProps {
  params: Promise<{ productId: string }>;
}

async function loadProduct(productId: string) {
  const id = Number.parseInt(productId, 10);
  if (!Number.isInteger(id) || id <= 0) return null;
  return getProductDetail(id);
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { productId } = await params;
  const product = await loadProduct(productId);
  if (!product) return { title: "Product not found" };

  return {
    title: product.name,
    description: product.description.slice(0, 155),
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { productId } = await params;
  const product = await loadProduct(productId);
  if (!product) notFound();

  return <ProductView product={product} canOrder />;
}
