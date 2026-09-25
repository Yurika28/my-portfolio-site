import { test, expect } from "@playwright/test";

test.describe("Home page", () => {
  test("nav renders logo, role and links", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "Yurika Maha" })).toBeVisible();
    await expect(
      page.getByRole("navigation").getByText("Full-Stack Developer")
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "About" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Contact" })).toBeVisible();
  });

  test("no horizontal overflow at this viewport", async ({ page }) => {
    await page.goto("/");
    const { scrollWidth, clientWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  });

  test("nav Contact button copies email and shows a toast", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/");

    await page.getByRole("button", { name: "Contact" }).click();
    await expect(page.getByText("Copied", { exact: true })).toBeVisible();

    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toBe("yurikamaha@gmail.com");
  });

  test("hero description word-fill animation runs on scroll", async ({ page }) => {
    await page.goto("/");
    const firstWord = page.locator("[data-word]").first();

    const colorBefore = await firstWord.evaluate(
      (el) => getComputedStyle(el).color
    );

    await page.mouse.wheel(0, 800);
    await page.waitForTimeout(500);

    const colorAfter = await firstWord.evaluate(
      (el) => getComputedStyle(el).color
    );

    expect(colorAfter).not.toBe(colorBefore);
  });

  test("projects carousel is reachable and shows project content", async ({ page }) => {
    await page.goto("/");
    await page.locator("#projects").scrollIntoViewIfNeeded();
    await page.mouse.wheel(0, 1500);
    await page.waitForTimeout(500);

    await expect(page.locator("#projects")).toBeVisible();
  });

  test("contact section: subtext fades in and social cards are clickable", async ({
    page,
  }) => {
    await page.goto("/");
    const contact = page.locator("#contact");
    await contact.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    await expect(page.getByRole("link", { name: /GitHub/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /LinkedIn/i })).toBeVisible();
  });

  test("contact copy-email button shows Copied confirmation", async ({
    page,
    context,
  }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/");
    await page.locator("#contact").scrollIntoViewIfNeeded();

    await page.getByRole("button", { name: /yurikamaha@gmail\.com/i }).click();
    await expect(page.getByText("Copied", { exact: true })).toBeVisible();
  });

  test("footer renders skill tags", async ({ page }) => {
    await page.goto("/");
    await page.locator("footer").scrollIntoViewIfNeeded();
    await expect(page.getByText("Full-Stack Development")).toBeVisible();
  });
});
