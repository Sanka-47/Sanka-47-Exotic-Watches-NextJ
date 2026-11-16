import type { Prisma } from "@prisma/client";
import { db } from "@/db";
import { getStockStatus } from "@/lib/stock";
import type { CategoryOption, ProductDetail, ProductListItem } from "@/types";

export const STOREFRONT_PAGE_SIZE = 12;

export interface ProductListResult {
  items: ProductListItem[];
  total: number;
  page: number;
  pageCount: number;
}

type ProductWithCategory = Prisma.ProductGetPayload<{ include: { category: true } }>;

function toListItem(product: ProductWithCategory): ProductListItem {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: Number(product.price),
    quantity: product.quantity,
    imageUrl: product.imageUrl_1,
    categoryId: product.categoryId,
    categoryName: product.category?.name ?? "Uncategorized",
    status: getStockStatus(product.quantity),
  };
}

export async function getProducts({
  search,
  categoryId,
  page,
  pageSize = STOREFRONT_PAGE_SIZE,
}: {
  search?: string;
  categoryId?: number | null;
  page: number;
  pageSize?: number;
}): Promise<ProductListResult> {
  const safePageSize = Math.min(Math.max(Math.floor(pageSize), 1), 48);
  const where: Prisma.ProductWhereInput = {};

  if (search) where.name = { contains: search };
  if (categoryId) where.categoryId = categoryId;

  const requestedPage = Number.isFinite(page) ? Math.floor(page) : 1;
  const safePage = Math.max(requestedPage, 1);

  const [rows, total] = await Promise.all([
    db.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
      skip: (safePage - 1) * safePageSize,
      take: safePageSize,
    }),
    db.product.count({ where }),
  ]);

  const pageCount = Math.max(1, Math.ceil(total / safePageSize));

  return {
    items: rows.map(toListItem),
    total,
    page: safePage,
    pageCount,
  };
}

export async function getCategories(): Promise<CategoryOption[]> {
  const categories = await db.category.findMany({ orderBy: { name: "asc" } });
  return categories.map(({ id, name }) => ({ id, name }));
}

export async function getProductDetail(productId: number): Promise<ProductDetail | null> {
  if (!Number.isInteger(productId) || productId <= 0) return null;

  const product = await db.product.findUnique({ where: { id: productId } });
  if (!product) return null;

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: Number(product.price).toFixed(2),
    quantity: product.quantity,
    imageUrl: product.imageUrl_1,
    imageUrl_2: product.imageUrl_2 ?? product.imageUrl_1,
    imageUrl_3: product.imageUrl_3 ?? product.imageUrl_1,
    status: getStockStatus(product.quantity),
  };
}

export async function getAdminProducts(): Promise<ProductListItem[]> {
  const products = await db.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
  return products.map(toListItem);
}

export interface EditableProduct {
  id: number;
  name: string;
  description: string;
  price: string;
  quantity: number;
  imageUrl: string;
}

export async function getEditableProduct(productId: number): Promise<EditableProduct | null> {
  if (!Number.isInteger(productId) || productId <= 0) return null;

  const product = await db.product.findUnique({ where: { id: productId } });
  if (!product) return null;

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: Number(product.price).toFixed(2),
    quantity: product.quantity,
    imageUrl: product.imageUrl_1,
  };
}

export async function getLowStockProducts(): Promise<ProductListItem[]> {
  const products = await db.product.findMany({
    where: { quantity: { lt: 4 } },
    include: { category: true },
    orderBy: { quantity: "asc" },
  });
  return products.map(toListItem);
}
