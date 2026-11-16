import { expect, test } from "@playwright/test";

const hasBaseUrl = Boolean(process.env.E2E_BASE_URL);

test.skip(
  !hasBaseUrl,
  "Set E2E_BASE_URL to a running instance (with a seeded database) to run the Playwright suite.",
);

test("storefront lists products", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /exotic watches, curated/i })).toBeVisible();
});

test("search and category filters are usable", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Search watches").fill("sub");
  await expect(page).toHaveURL(/\?q=sub/);
});

test("checkout redirects anonymous visitors to sign-in", async ({ page }) => {
  await page.goto("/product/1/order");
  await expect(page).toHaveURL(/\/signIn/);
});

test("admin routes are protected", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/signIn/);
});
