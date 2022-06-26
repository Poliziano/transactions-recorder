import { expect, test } from "@playwright/test";

test("displays 'Transactions' title", async ({ page }) => {
  await page.goto("/");
  expect(await page.textContent("h2")).toBe("Transactions");
});
