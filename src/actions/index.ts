"use server";

import { db } from "@/db";
import cloudinary from "@/config/cloudinary";
import { redirect } from "next/navigation";
import { getImagePublicId } from "@/utils/cloudinary";
import { Product, Categories } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { Category } from "@mui/icons-material";

export async function productEdit(formData: FormData) {
  try {
    const id = parseInt(formData.get("id") as string);
    const name = formData.get("name") as string;
    const price = parseFloat(formData.get("price") as string); // Convert to number
    const quantity = parseInt(formData.get("quantity") as string);
    const description = formData.get("description") as string;
    const image = formData.get("image") as File | null;

    // Fetch the current product to get the existing image URL
    const currentProduct = await db.product.findUnique({
      where: { id },
    });

    if (!currentProduct) {
      return {
        success: false,
        message: "Product not found",
      };
    }

    let imageUrl = currentProduct.imageUrl_1; // Assuming imageUrl_1 is the primary image field

    // If a new image is uploaded, delete the old image from Cloudinary and upload the new one
    if (image && image.size > 0) {
      // Delete the old image from Cloudinary if it exists
      const publicId = getImagePublicId(currentProduct.imageUrl_1);
      if (publicId) {
        await cloudinary.uploader.destroy(`${process.env.CLOUDINARY_PROJECT_FOLDER}/${publicId}`);
      }

      // Upload the new image to Cloudinary
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
    }

    // Update the product in the database
    await db.product.update({
      where: { id },
      data: {
        name,
        price,
        quantity,
        description,
        imageUrl_1: imageUrl, // Update the primary image URL
      },
    });

    return {
      success: true,
      message: "Product updated successfully",
    };
  } catch (error) {
    console.error("Error updating product:", error);
    return {
      success: false,
      message: "Failed to update product",
    };
  }
}

export async function productDelete(productId: number) {
  try {
    // Fetch the current product
    const currentProduct = await db.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!currentProduct) {
      return {
        success: false,
        message: "Product not found",
      };
    }

    // Delete images from Cloudinary
    const publicIds = [
      getImagePublicId(currentProduct.imageUrl_1),
      getImagePublicId(currentProduct.imageUrl_2),
      getImagePublicId(currentProduct.imageUrl_3),
    ].filter(Boolean); // Remove any empty or null values

    // Delete images concurrently
    await Promise.all(
      publicIds.map((publicId) =>
        cloudinary.uploader.destroy(`${process.env.CLOUDINARY_PROJECT_FOLDER}/${publicId}`)
      )
    );

    // Delete product from the database
    await db.product.delete({
      where: {
        id: productId,
      },
    });

    return {
      success: true,
      message: "Product deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting product:", error);
    return {
      success: false,
      message: "Failed to delete product",
    };
  }
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
  category: number | null
) {
  const products = await db.product.findMany({
    where: {
      name: {
        contains: value || "", // Partial match
         // Case-insensitive search
      },
      categoryId: category || undefined, // Filter by category if provided
    },
  });

  // Convert Decimal price to number
  return products.map((product) => ({
    ...product,
    price:
      product.price instanceof Decimal ? product.price.toNumber() : product.price,
  }));
}
