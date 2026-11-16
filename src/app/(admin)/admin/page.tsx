import { Box } from "@mui/material";
import { getAdminProducts } from "@/lib/products";
import { requireAdminPage } from "@/lib/auth-guards";
import { AdminProductHeader } from "@/components/admin/AdminProductHeader";
import ProductListTable from "@/components/ProductListTable";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await requireAdminPage();
  const products = await getAdminProducts();

  return (
    <Box>
      <AdminProductHeader productCount={products.length} />
      <ProductListTable products={products} />
    </Box>
  );
}
