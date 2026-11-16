import { describe, expect, it } from "vitest";
import { formatStatus, getStatusColor, getStockStatus } from "@/lib/stock";
import { ProductStatus } from "@/types";

describe("stock", () => {
  it("derives status from quantity", () => {
    expect(getStockStatus(0)).toBe(ProductStatus.OUT_OF_STOCK);
    expect(getStockStatus(-1)).toBe(ProductStatus.OUT_OF_STOCK);
    expect(getStockStatus(1)).toBe(ProductStatus.LOW_STOCK);
    expect(getStockStatus(3)).toBe(ProductStatus.LOW_STOCK);
    expect(getStockStatus(4)).toBe(ProductStatus.IN_STOCK);
  });

  it("formats status labels", () => {
    expect(formatStatus(ProductStatus.IN_STOCK)).toBe("In Stock");
    expect(formatStatus(ProductStatus.LOW_STOCK)).toBe("Low Stock");
    expect(formatStatus(ProductStatus.OUT_OF_STOCK)).toBe("Out of Stock");
    expect(formatStatus("something-else")).toBe("Unknown");
  });

  it("returns a colour for every status", () => {
    for (const status of Object.values(ProductStatus)) {
      expect(getStatusColor(status)).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });
});
