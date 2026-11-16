const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

/** Formats a decimal amount (e.g. 1999.5) as USD. */
export function formatUsd(amount: number): string {
  if (!Number.isFinite(amount)) {
    throw new TypeError(`Cannot format a non-finite amount: ${amount}`);
  }
  return usdFormatter.format(amount);
}

/** Converts a decimal amount to integer cents, rounded to the nearest cent. */
export function toCents(amount: number): number {
  if (!Number.isFinite(amount)) {
    throw new TypeError(`Cannot convert a non-finite amount to cents: ${amount}`);
  }
  return Math.round(amount * 100);
}

/** Converts integer cents back to a decimal amount. */
export function fromCents(cents: number): number {
  if (!Number.isInteger(cents)) {
    throw new TypeError(`Cents must be an integer, received: ${cents}`);
  }
  return cents / 100;
}

/** Computes an order line total in cents. */
export function orderTotalCents(unitPriceCents: number, quantity: number): number {
  if (!Number.isInteger(unitPriceCents) || unitPriceCents < 0) {
    throw new TypeError("unitPriceCents must be a non-negative integer");
  }
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new TypeError("quantity must be a positive integer");
  }
  return unitPriceCents * quantity;
}
