import { z } from "zod";

const optionalCategoryId = z.preprocess((value) => {
  if (value === undefined || value === null || value === "" || value === "0" || value === 0) {
    return null;
  }
  return value;
}, z.coerce.number().int().positive().nullable());

export const productInputSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120, "Name is too long"),
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(5000, "Description is too long"),
  price: z.coerce
    .number()
    .positive("Price must be greater than zero")
    .max(1_000_000, "Price is too large"),
  quantity: z.coerce.number().int().min(0, "Quantity cannot be negative").max(1_000_000),
  categoryId: optionalCategoryId,
});

export const productUpdateSchema = productInputSchema.extend({
  id: z.coerce.number().int().positive(),
});

export const checkoutSchema = z.object({
  productId: z.coerce.number().int().positive(),
  quantity: z.coerce.number().int().min(1).max(5).default(1),
});

export type ProductInput = z.infer<typeof productInputSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;

/** Turns the first validation issue into a message safe to show to users. */
export function firstIssueMessage(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Invalid input";
}
