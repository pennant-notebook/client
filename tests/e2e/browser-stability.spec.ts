import { expect, test } from "@playwright/test";
import { BASE_URL } from "../utils/const";

test.describe("Browser Stability Check", () => {
  test("should launch browser successfully", async ({ page, browserName }) => {
    console.log(`🚀 Testing browser launch: ${browserName}`);

    try {
      // Simple navigation test
      await page.goto("about:blank");
      console.log("✅ Browser launched successfully");

      // Test basic page loading
      await page.goto(BASE_URL, { waitUntil: "domcontentloaded", timeout: 10000 });
      console.log(`✅ Successfully loaded: ${page.url()}`);

      // Test basic page interaction
      const title = await page.title();
      console.log(`📄 Page title: ${title}`);

      // Take a screenshot to verify rendering works
      await page.screenshot({ path: `browser-test-${browserName}.png` });
      console.log(`📸 Screenshot saved for ${browserName}`);

      expect(title).toBeTruthy();
    } catch (error) {
      console.error(`❌ Browser test failed for ${browserName}:`, error);
      throw error;
    }
  });

  test("should handle basic page interactions", async ({ page }) => {
    console.log("🔧 Testing basic page interactions...");

    await page.goto(BASE_URL, { waitUntil: "domcontentloaded" });

    // Test clicking and basic interactions
    const body = await page.locator("body");
    await expect(body).toBeVisible();

    // Test JavaScript execution
    const userAgent = await page.evaluate(() => navigator.userAgent);
    console.log(`🌐 User Agent: ${userAgent}`);

    expect(userAgent).toBeTruthy();

    console.log("✅ Basic interactions working");
  });
});
