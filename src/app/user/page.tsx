
import ProductFilters from "@/components/ProductFilters";
import ProductListTable from "@/components/ProductListTable";
import { db } from "@/db"
import { Product } from "@prisma/client";


interface ProductProps {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  status: string;
  imageUrl: string;
  categoryId:number;

}

interface ProductWithCategory extends Product {
  Categories: { id: number; name: string } | null; // Allow null for optional relations
}

export default async function AdminDashboardPage() {
  const products: ProductWithCategory[] = await db.product.findMany({
    include: {
      Categories: true, // Include the related Category data
    },
  });

  // Map the data to include the category name
  const productData: ProductProps[] = products.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: Number(product.price),
    quantity: product.quantity,
    imageUrl: product.imageUrl_3,
    status: product.status,
    categoryId: product.categoryId,
    categoryName:  product.Categories?.name || "Uncategorized", // Add category name
  }));
  return (
    <>
      <ProductFilters />
      <ProductListTable products={productData}/>
    </>
  );
}
