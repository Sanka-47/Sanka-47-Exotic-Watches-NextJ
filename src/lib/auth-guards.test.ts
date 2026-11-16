import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  redirect: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`);
  }),
}));

vi.mock("@/auth", () => ({ auth: mocks.auth }));
vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));

import {
  requireAdmin,
  requireAdminPage,
  requireUser,
  UnauthorizedError,
} from "@/lib/auth-guards";

const adminUser = { id: "u1", name: "Admin", email: "admin@example.com", role: "ADMIN" };
const normalUser = { id: "u2", name: "Shopper", email: "shopper@example.com", role: "USER" };

function sessionFor(user: typeof adminUser | typeof normalUser | null) {
  return user ? { user, expires: "2099-01-01" } : null;
}

describe("auth guards", () => {
  beforeEach(() => {
    mocks.auth.mockReset();
    mocks.redirect.mockClear();
  });

  it("rejects anonymous callers", async () => {
    mocks.auth.mockResolvedValue(null);
    await expect(requireUser()).rejects.toBeInstanceOf(UnauthorizedError);
    await expect(requireAdmin()).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it("rejects signed-in non-admins from admin actions", async () => {
    mocks.auth.mockResolvedValue(sessionFor(normalUser));
    await expect(requireAdmin()).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it("allows admins", async () => {
    mocks.auth.mockResolvedValue(sessionFor(adminUser));
    await expect(requireAdmin()).resolves.toMatchObject({ id: "u1", role: "ADMIN" });
  });

  it("redirects anonymous visitors away from admin pages", async () => {
    mocks.auth.mockResolvedValue(null);
    await expect(requireAdminPage()).rejects.toThrow("NEXT_REDIRECT:/signIn");
  });

  it("redirects non-admin users to the storefront", async () => {
    mocks.auth.mockResolvedValue(sessionFor(normalUser));
    await expect(requireAdminPage()).rejects.toThrow("NEXT_REDIRECT:/");
  });
});
