import React from 'react';
import { db } from '@/db';
import { Product } from '@prisma/client';
import { notFound } from 'next/navigation';
import ProductView from '@/components/ProductView';

interface ProductViewPageProps {
  params: {
    productId: string;
  };
}

export default async function ProductViewPage(props: ProductViewPageProps) {
  const params = await props.params;
  const productId = parseInt(params.productId);

  const product: Product | null = await db.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!product) {
    return notFound();
  }

  const plainProduct = {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price.toString(),
    quantity: product.quantity,
    imageUrl: product.imageUrl_1, // First Image
    imageUrl_2: product.imageUrl_2, // Second Image
    imageUrl_3: product.imageUrl_3, // Third Image (Added to be displayed)
    status: product.status,
  };

  return <ProductView product={plainProduct} />;
}
