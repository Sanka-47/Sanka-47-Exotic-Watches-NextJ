import { getCategories } from "@/lib/products";
import { requireAdminPage } from "@/lib/auth-guards";
import ProductAddForm from "@/components/ProductAddForm";

export const dynamic = "force-dynamic";

export default async function ProductAddPage() {
  await requireAdminPage();
  const categories = await getCategories();

  return <ProductAddForm categories={categories} />;
}
