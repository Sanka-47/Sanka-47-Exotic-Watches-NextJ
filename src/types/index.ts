export enum ProductStatus {
  IN_STOCK = "IN_STOCK",
  LOW_STOCK = "LOW_STOCK",
  OUT_OF_STOCK = "OUT_OF_STOCK",
}

export interface CategoryOption {
  id: number;
  name: string;
}

export interface ProductListItem {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl: string;
  categoryId: number | null;
  categoryName: string;
  status: ProductStatus;
}

export interface ProductDetail {
  id: number;
  name: string;
  description: string;
  price: string;
  quantity: number;
  imageUrl: string;
  imageUrl_2: string;
  imageUrl_3: string;
  status: ProductStatus;
}

export type ActionResult<T = undefined> =
  | { success: true; message: string; data?: T }
  | { success: false; message: string };
