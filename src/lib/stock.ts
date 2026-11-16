import { ProductStatus } from "@/types";

const LOW_STOCK_THRESHOLD = 3;

/** Derives a display status from stock instead of storing a duplicate column. */
export function getStockStatus(quantity: number): ProductStatus {
  if (quantity <= 0) return ProductStatus.OUT_OF_STOCK;
  if (quantity <= LOW_STOCK_THRESHOLD) return ProductStatus.LOW_STOCK;
  return ProductStatus.IN_STOCK;
}

export const STATUS_COLORS: Record<ProductStatus, string> = {
  [ProductStatus.IN_STOCK]: "#009f7f",
  [ProductStatus.LOW_STOCK]: "#b26a00",
  [ProductStatus.OUT_OF_STOCK]: "#c62828",
};

export function getStatusColor(status: ProductStatus): string {
  return STATUS_COLORS[status] ?? "#1976d2";
}

export function formatStatus(status: ProductStatus | string): string {
  switch (status) {
    case ProductStatus.IN_STOCK:
      return "In Stock";
    case ProductStatus.LOW_STOCK:
      return "Low Stock";
    case ProductStatus.OUT_OF_STOCK:
      return "Out of Stock";
    default:
      return "Unknown";
  }
}
