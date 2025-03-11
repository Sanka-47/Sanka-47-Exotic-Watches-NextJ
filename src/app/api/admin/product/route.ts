import { db } from "@/db";
import cloudinary from "@/config/cloudinary";
import { ProductData } from "@/types";
import { Product } from "@prisma/client";

import { RESPONSE_LIMIT_DEFAULT } from "next/dist/server/api-utils";
import { LocalFlorist } from "@mui/icons-material";

export const POST = async (req: Request) => {
  try {
    const formData = await req.formData();
    console.log("Form data: ", formData);

    const name = formData.get("name") as string;
    const price = parseFloat(formData.get("price") as string);
    const quantity = parseInt(formData.get("quantity") as string);
    const description = formData.get("description") as string;
    const categoryId = parseInt(formData.get("category") as string);

    const imageFiles = formData.getAll("image") as File[]; // Get all images from FormData

    // Helper function to upload image to Cloudinary
    const uploadImage = async (image: File): Promise<string> => {
      if (!image) return "";

      const buffer = await image.arrayBuffer();
      const base64String = Buffer.from(buffer).toString("base64");
      const mimeType = image.type || "image/png"; // Ensure correct MIME type

      const result = await cloudinary.uploader.upload(
        `data:${mimeType};base64,${base64String}`,
        { folder: "CRUD" }
      );

      return result.secure_url;
    };

    // Upload images to Cloudinary (limit to 3 images)
    const uploadedImages = await Promise.all(
      imageFiles.slice(0, 3).map(uploadImage)
    );

    // Ensure all images exist in fields
    const [imageUrl_1, imageUrl_2, imageUrl_3] = [
      uploadedImages[0] || "",
      uploadedImages[1] || "",
      uploadedImages[2] || "",
    ];

    const productData = {
      name,
      description,
      price,
      quantity,
      status: "",
      imageUrl_1,
      imageUrl_2,
      imageUrl_3,
      categoryId,
    };

    // Save product in the database
    await db.product.create({
      data: productData,
    });

    return Response.redirect(`${process.env.NEXTAUTH_URL}/admin`);
  } catch (error) {
    console.error("Errors: ", error);
    return new Response(JSON.stringify({ message: "Error uploading product" }), { status: 500 });
  }
};
