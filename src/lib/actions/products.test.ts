import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  class UnauthorizedError extends Error {
    constructor(message = "You do not have permission to perform this action.") {
      super(message);
      this.name = "UnauthorizedError";
    }
  }

  return {
    UnauthorizedError,
    requireAdmin: vi.fn(),
    findUnique: vi.fn(),
    deleteProduct: vi.fn(),
    destroyImages: vi.fn(),
    revalidatePath: vi.fn(),
  };
});

vi.mock("@/lib/auth-guards", () => ({
  requireAdmin: mocks.requireAdmin,
  UnauthorizedError: mocks.UnauthorizedError,
}));

vi.mock("@/db", () => ({
  db: {
    product: {
      findUnique: mocks.findUnique,
      delete: mocks.deleteProduct,
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));

vi.mock("@/lib/cloudinary", () => ({
  destroyImages: mocks.destroyImages,
  uploadProductImage: vi.fn(),
}));

import { productDelete } from "@/lib/actions/products";

const product = {
  id: 1,
  name: "Submariner",
  imageUrl_1: "https://res.cloudinary.com/demo/image/upload/v1/exotica/a.jpg",
  imageUrl_2: null,
  imageUrl_3: null,
};

describe("productDelete authorization", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not touch the database when the caller is not an admin", async () => {
    mocks.requireAdmin.mockRejectedValue(new mocks.UnauthorizedError());

    const result = await productDelete(1);

    expect(result).toEqual({
      success: false,
      message: "You do not have permission to perform this action.",
    });
    expect(mocks.findUnique).not.toHaveBeenCalled();
    expect(mocks.deleteProduct).not.toHaveBeenCalled();
    expect(mocks.destroyImages).not.toHaveBeenCalled();
  });

  it("deletes the row before removing Cloudinary images", async () => {
    mocks.requireAdmin.mockResolvedValue({ id: "u1", role: "ADMIN" });
    mocks.findUnique.mockResolvedValue(product);
    mocks.deleteProduct.mockResolvedValue(product);
    mocks.destroyImages.mockResolvedValue(undefined);

    const result = await productDelete(1);

    expect(result.success).toBe(true);
    expect(mocks.deleteProduct).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(mocks.destroyImages).toHaveBeenCalledWith([product.imageUrl_1]);
    expect(mocks.deleteProduct.mock.invocationCallOrder[0]).toBeLessThan(
      mocks.destroyImages.mock.invocationCallOrder[0] ?? Number.POSITIVE_INFINITY,
    );
  });

  it("rejects invalid ids", async () => {
    mocks.requireAdmin.mockResolvedValue({ id: "u1", role: "ADMIN" });

    const result = await productDelete(-3);

    expect(result).toEqual({ success: false, message: "Invalid product id." });
    expect(mocks.findUnique).not.toHaveBeenCalled();
  });
});
