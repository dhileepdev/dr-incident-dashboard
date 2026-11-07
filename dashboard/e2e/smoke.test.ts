import { test, expect } from "@playwright/test";

test("renders incident list and severity cards", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /incidents/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /alert sources/i }).first()).toBeVisible();
});
