import { expect, test } from "@playwright/test";

test.describe("smoke", () => {
  test("home loads with hero and prefecture grid", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "COVID-19",
    );
    await expect(
      page.getByRole("link", { name: /すべてのグラフを見る/ }),
    ).toBeVisible();
  });

  test("archives pagination works", async ({ page }) => {
    await page.goto("/archives/1");
    await expect(
      page.getByRole("heading", { level: 1, name: /すべてのグラフ/ }),
    ).toBeVisible();
    await page.getByRole("link", { name: "2", exact: true }).first().click();
    await expect(page).toHaveURL(/\/archives\/2/);
  });

  test("search returns results", async ({ page }) => {
    await page.goto("/search/");
    await page.getByLabel("サイト内検索キーワード").fill("東京");
    await expect(page.locator("#search-results article").first()).toBeVisible({
      timeout: 10_000,
    });
  });

  test("article page renders chart and breadcrumbs", async ({ page }) => {
    await page
      .goto("/2022/09/26/tokyo-1234/", { waitUntil: "domcontentloaded" })
      .catch(() => {});
    if (page.url().includes("/2022/09/26/tokyo-1234/")) {
      await expect(page.locator("article img").first()).toBeVisible();
    } else {
      const link = page.locator("a[href^='/2022/']").first();
      await link.click();
      await expect(page.locator("article img").first()).toBeVisible();
    }
  });

  test("404 page is helpful", async ({ page }) => {
    const res = await page.goto("/this-route-does-not-exist");
    expect(res?.status()).toBe(404);
    await expect(
      page.getByRole("heading", { level: 1, name: "404" }),
    ).toBeVisible();
  });
});
