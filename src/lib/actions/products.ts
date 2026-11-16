"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { requireAdmin, UnauthorizedError } from "@/lib/auth-guards";
import { destroyImages, uploadProductImage } from "@/lib/cloudinary";
import { firstIssueMessage, productInputSchema, productUpdateSchema } from "@/lib/validation";
import type { ActionResult } from "@/types";

function readImages(formData: FormData, field: string): File[] {
  return formData
    .getAll(field)
    .filter((entry): entry is File => entry instanceof File && entry.size > 0)
    .slice(0, 3);
}

export async function productCreate(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdmin();

    const parsed = productInputSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
      return { success: false, message: firstIssueMessage(parsed.error) };
    }

    const files = readImages(formData, "images");
    if (files.length === 0) {
      return { success: false, message: "At least one product image is required." };
    }

    const uploads = await Promise.all(files.map(uploadProductImage));
    const [first, second, third] = uploads;

    await db.product.create({
      data: {
        ...parsed.data,
        imageUrl_1: first?.url ?? "",
        imageUrl_2: second?.url ?? null,
        imageUrl_3: third?.url ?? null,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin");

    return { success: true, message: "Product created successfully." };
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return { success: false, message: error.message };
    }
    console.error("productCreate failed", error);
    return { success: false, message: "Could not create the product." };
  }
}

export async function productEdit(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdmin();

    const parsed = productUpdateSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
      return { success: false, message: firstIssueMessage(parsed.error) };
    }

    const { id, ...fields } = parsed.data;
    const current = await db.product.findUnique({ where: { id } });
    if (!current) {
      return { success: false, message: "Product not found." };
    }

    const [file] = readImages(formData, "image");
    let replacementUrl: string | null = null;

    if (file) {
      const uploaded = await uploadProductImage(file);
      replacementUrl = uploaded.url;
    }

    await db.product.update({
      where: { id },
      data: {
        ...fields,
        ...(replacementUrl ? { imageUrl_1: replacementUrl } : {}),
      },
    });

    // Only delete the previous image after the database write succeeded.
    if (replacementUrl && current.imageUrl_1 !== replacementUrl) {
      await destroyImages([current.imageUrl_1]);
    }

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath(`/product/${id}`);

    return { success: true, message: "Product updated successfully." };
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return { success: false, message: error.message };
    }
    console.error("productEdit failed", error);
    return { success: false, message: "Could not update the product." };
  }
}

export async function productDelete(productId: number): Promise<ActionResult> {
  try {
    await requireAdmin();

    if (!Number.isInteger(productId) || productId <= 0) {
      return { success: false, message: "Invalid product id." };
    }

    const current = await db.product.findUnique({ where: { id: productId } });
    if (!current) {
      return { success: false, message: "Product not found." };
    }

    // Delete the row first so a failed Cloudinary call cannot leave a product
    // pointing at images that no longer exist.
    await db.product.delete({ where: { id: productId } });

    await destroyImages(
      [current.imageUrl_1, current.imageUrl_2, current.imageUrl_3].filter(
        (url): url is string => Boolean(url),
      ),
    );

    revalidatePath("/");
    revalidatePath("/admin");

    return { success: true, message: "Product deleted successfully." };
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return { success: false, message: error.message };
    }
    console.error("productDelete failed", error);
    return { success: false, message: "Could not delete the product." };
  }
}
