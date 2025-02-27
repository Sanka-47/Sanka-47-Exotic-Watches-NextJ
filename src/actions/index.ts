"use server";

import { db } from "@/db";
import cloudinary from "@/config/cloudinary";
import { redirect } from "next/navigation";
import { getImagePublicId } from "@/utils/cloudinary";
import { Product,Categories } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { Category } from "@mui/icons-material";

export async function productEdit(formData: FormData) {
  const id = parseInt(formData.get("id") as string);
  const name = formData.get("name") as string;
  const price = formData.get("price") as string;
  const quantity = parseInt(formData.get("quantity") as string);
  const description = formData.get("description") as string;
  const image = formData.get("image") as File | null;

  let imageUrl: string | undefined;

  if (image !== null) {
    const imageBuffer = await image.arrayBuffer();
    const imageArray = Array.from(new Uint8Array(imageBuffer));
    const imageData = Buffer.from(imageArray);
    const imageBase64 = imageData.toString("base64");

    const result = await cloudinary.uploader.upload(
      `data:image/png;base64,${imageBase64}`,
      {
        folder: "CRUD",
      }
    );

    imageUrl = result.secure_url;

    const currentProduct = await db.product.findUnique({
      where: {
        id: id,
      },
    });

    if (currentProduct && currentProduct.imageUrl) {
      const public_id = getImagePublicId(currentProduct.imageUrl);

      await cloudinary.uploader.destroy(
        `${process.env.CLOUDINARY_PROJECT_FOLDER}/${public_id}`
      );
    }
  }

  await db.product.update({
    where: {
      id: id,
    },
    data: {
      name,
      price,
      quantity,
      description,
      imageUrl: imageUrl || undefined,
    },
  });

  redirect("/admin");
}

export async function productDelete(productId: number) {
  // delete image from cloudinary
  const currentProduct = await db.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (currentProduct) {
    const public_id = getImagePublicId(currentProduct.imageUrl);

    await cloudinary.uploader.destroy(
      `${process.env.CLOUDINARY_PROJECT_FOLDER}/${public_id}`
    );
  }

  // delete image from database
  await db.product.delete({
    where: {
      id: productId,
    },
  });

  redirect("/admin");
}
// interface Product {
//   id: number;
//   name: string;
//   description: string;
//   price: Decimal;
//   quantity: number;
//   imageUrl: string;
//   status: string;
//   categoryId: number;
// }
export async function productSearch(

  
  
  value: string | null,
  category :number | null
) {
  // console.log("Selected value:", value);
  const product: Product | null = await db.product.findFirst({
    where: {
      name: value || undefined,
      categoryId: category || undefined
    },
  });

  if (product) {
    // Convert the Decimal price to a number
    return {
      ...product,
      price: product.price instanceof Decimal ? product.price.toNumber() : product.price,
    };
  } else {
    
    return null;
  }
}


