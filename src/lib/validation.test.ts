import { describe, expect, it } from "vitest";
import {
  checkoutSchema,
  firstIssueMessage,
  productInputSchema,
  productUpdateSchema,
} from "@/lib/validation";

describe("productInputSchema", () => {
  it("accepts a valid product", () => {
    const result = productInputSchema.parse({
      name: "Submariner",
      description: "A classic dive watch",
      price: "12500.50",
      quantity: "3",
      categoryId: "2",
    });

    expect(result).toEqual({
      name: "Submariner",
      description: "A classic dive watch",
      price: 12500.5,
      quantity: 3,
      categoryId: 2,
    });
  });

  it("treats an empty or zero category as uncategorized", () => {
    expect(productInputSchema.parse({ ...validProduct, categoryId: "" }).categoryId).toBeNull();
    expect(productInputSchema.parse({ ...validProduct, categoryId: "0" }).categoryId).toBeNull();
    expect(productInputSchema.parse({ ...validProduct, categoryId: undefined }).categoryId).toBeNull();
  });

  it("rejects negative prices and stock", () => {
    expect(productInputSchema.safeParse({ ...validProduct, price: "-1" }).success).toBe(false);
    expect(productInputSchema.safeParse({ ...validProduct, quantity: "-1" }).success).toBe(false);
  });

  it("rejects blank names", () => {
    expect(productInputSchema.safeParse({ ...validProduct, name: "   " }).success).toBe(false);
  });

  it("requires an id when updating", () => {
    expect(productUpdateSchema.safeParse(validProduct).success).toBe(false);
    expect(productUpdateSchema.safeParse({ ...validProduct, id: "5" }).success).toBe(true);
  });

  it("produces a readable first error", () => {
    const result = productInputSchema.safeParse({ ...validProduct, price: "0" });
    if (result.success) throw new Error("expected validation to fail");
    expect(firstIssueMessage(result.error)).toBe("Price must be greater than zero");
  });
});

describe("checkoutSchema", () => {
  it("defaults quantity to one", () => {
    expect(checkoutSchema.parse({ productId: "3" })).toEqual({ productId: 3, quantity: 1 });
  });

  it("caps quantity per order", () => {
    expect(checkoutSchema.safeParse({ productId: 3, quantity: 6 }).success).toBe(false);
  });

  it("rejects invalid product ids", () => {
    expect(checkoutSchema.safeParse({ productId: "abc" }).success).toBe(false);
    expect(checkoutSchema.safeParse({ productId: 0 }).success).toBe(false);
  });
});

const validProduct = {
  name: "Submariner",
  description: "A classic dive watch",
  price: "12500.50",
  quantity: "3",
  categoryId: "2",
};
