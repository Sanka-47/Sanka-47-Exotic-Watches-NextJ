import { v2 as cloudinary } from "cloudinary";
import { extractPublicId } from "@/lib/cloudinary-url";
import { env } from "@/lib/env";

export { extractPublicId };

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

export interface UploadedImage {
  url: string;
  publicId: string;
}

export function isAcceptedImage(file: File): boolean {
  return ALLOWED_IMAGE_TYPES.has(file.type) && file.size > 0 && file.size <= MAX_IMAGE_BYTES;
}

export async function uploadProductImage(file: File): Promise<UploadedImage> {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error("Only JPEG, PNG, WebP and AVIF images are supported.");
  }
  if (file.size <= 0 || file.size > MAX_IMAGE_BYTES) {
    throw new Error("Images must be between 1 byte and 5 MB.");
  }

  const base64 = Buffer.from(await file.arrayBuffer()).toString("base64");
  const result = await cloudinary.uploader.upload(`data:${file.type};base64,${base64}`, {
    folder: env.CLOUDINARY_UPLOAD_FOLDER,
    resource_type: "image",
  });

  return { url: result.secure_url, publicId: result.public_id };
}

/** Best-effort cleanup: a failed Cloudinary delete must not fail a DB mutation. */
export async function destroyImages(imageUrls: string[]): Promise<void> {
  const publicIds = imageUrls
    .map((url) => extractPublicId(url))
    .filter((publicId): publicId is string => Boolean(publicId));

  await Promise.allSettled(
    publicIds.map((publicId) => cloudinary.uploader.destroy(publicId)),
  );
}
