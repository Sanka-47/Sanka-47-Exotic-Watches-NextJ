import { describe, expect, it } from "vitest";
import { formatUsd, fromCents, orderTotalCents, toCents } from "@/lib/money";

describe("money", () => {
  it("converts decimal amounts to integer cents", () => {
    expect(toCents(19.99)).toBe(1999);
    expect(toCents(0.1 + 0.2)).toBe(30);
    expect(toCents(1234.5)).toBe(123450);
  });

  it("rounds to the nearest cent", () => {
    expect(toCents(10.005)).toBe(1001);
    expect(toCents(10.004)).toBe(1000);
  });

  it("rejects non-finite amounts", () => {
    expect(() => toCents(Number.NaN)).toThrow(TypeError);
    expect(() => toCents(Number.POSITIVE_INFINITY)).toThrow(TypeError);
  });

  it("converts cents back to decimals", () => {
    expect(fromCents(1999)).toBe(19.99);
    expect(() => fromCents(19.99)).toThrow(TypeError);
  });

  it("computes order totals", () => {
    expect(orderTotalCents(1999, 3)).toBe(5997);
    expect(() => orderTotalCents(1999, 0)).toThrow(TypeError);
    expect(() => orderTotalCents(1999.5, 1)).toThrow(TypeError);
  });

  it("formats USD amounts", () => {
    expect(formatUsd(1999.5)).toBe("$1,999.50");
    expect(formatUsd(0)).toBe("$0.00");
    expect(() => formatUsd(Number.NaN)).toThrow(TypeError);
  });
});
