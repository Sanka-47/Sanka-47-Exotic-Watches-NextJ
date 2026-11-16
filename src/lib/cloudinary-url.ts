/**
 * Extracts the Cloudinary public id from a delivery URL, e.g.
 * https://res.cloudinary.com/demo/image/upload/v123/exotica-watches/abc.jpg
 * -> exotica-watches/abc
 *
 * Kept free of the Cloudinary SDK so it can be unit tested and reused.
 */
export function extractPublicId(imageUrl: string): string | null {
  if (!imageUrl) return null;

  const withoutQuery = imageUrl.split("?")[0]?.trim();
  if (!withoutQuery) return null;

  const match = withoutQuery.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-zA-Z0-9]+)?$/);
  return match?.[1] ?? withoutQuery;
}
