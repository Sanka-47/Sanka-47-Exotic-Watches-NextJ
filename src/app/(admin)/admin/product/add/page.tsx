import { getCategories } from "@/lib/products";
import ProductAddForm from "@/components/ProductAddForm";

export const dynamic = "force-dynamic";

export default async function ProductAddPage() {
  const categories = await getCategories();

  return <ProductAddForm categories={categories} />;
}
