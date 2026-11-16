import ProductFilters from "@/components/ProductFilters";
import ProductListTable from "@/components/ProductListTable";
import { db } from "@/db";
import { Product } from "@prisma/client";

interface ProductProps {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  status: string;
  imageUrl: string;
  categoryId: number;
  categoryName: string;
}

interface ProductWithCategory extends Product {
  Categories: { id: number; name: string } | null;
}

export default async function AdminDashboardPage() {
  const products: ProductWithCategory[] = await db.product.findMany({
    include: {
      Categories: true,
    },
  });

  const productData: ProductProps[] = products.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: Number(product.price),
    quantity: product.quantity,
    imageUrl: product.imageUrl_3,
    status: product.status,
    categoryId: product.categoryId,
    categoryName: product.Categories?.name || "Uncategorized",
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your products and inventory
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Filters Section */}
          <div className="p-6 border-b border-gray-200">
            <ProductFilters />
          </div>

          {/* Products Table Section */}
          <div className="p-6">
            <ProductListTable products={productData} />
          </div>
        </div>
      </main>
    </div>
  );
}