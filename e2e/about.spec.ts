import { test, expect } from "@playwright/test";

test.describe("About page", () => {
  test("renders heading and skills", async ({ page }) => {
    await page.goto("/about");

    await expect(page.getByRole("heading", { name: "About Me" })).toBeVisible();
    await expect(page.getByText("TypeScript")).toBeVisible();
    await expect(page.getByText("REST APIs")).toBeVisible();
  });

  test("page does not scroll (fixed viewport section)", async ({ page }) => {
    await page.goto("/about");
    const scrollY = await page.evaluate(() => {
      window.scrollTo(0, 500);
      return window.scrollY;
    });
    expect(scrollY).toBe(0);
  });

  test("skills pile settles into a flex row after the Flip animation", async ({
    page,
  }) => {
    await page.goto("/about");
    await page.waitForTimeout(1200);

    const pileClass = await page.locator("ul").filter({ hasText: "TypeScript" }).getAttribute("class");
    expect(pileClass).toContain("flex");
  });

  test("nav Contact button copies email and shows a toast", async ({
    page,
    context,
  }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/about");

    await page.getByRole("button", { name: "Contact" }).click();
    await expect(page.getByText("Copied", { exact: true })).toBeVisible();

    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toBe("yurikamaha@gmail.com");
  });

  test("no horizontal overflow at this viewport", async ({ page }) => {
    await page.goto("/about");
    const { scrollWidth, clientWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  });
});
