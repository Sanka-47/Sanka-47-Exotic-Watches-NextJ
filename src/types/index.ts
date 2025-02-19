export interface ProductData {
    id?: number;
    name: string;
    description: string;
    price: number; // Use number instead of string for price
    quantity: number;
    imageUrl: string;
    status: string;
    categoryId: number;
    Categories?: Categories | null;
  }

export interface Categories {
    id: number;
    name: string;
}

export enum ProductStatus {
    IN_STOCK = 'IN_STOCK',
    LOW_STOCK = 'LOW_STOCK',
    OUT_OF_STOCK = 'OUT_OF_STOCK',
  }
  