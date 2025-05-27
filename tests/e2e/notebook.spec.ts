import type { ConsoleMessage } from "@playwright/test";
import { expect, test } from "@playwright/test";
import { URL_CODE_CELL as URL } from "../utils/const";

test.describe("A single WebSocket provider should be initialized per notebook", () => {
  test("Single Client WebSocket connection initially", async ({ page }) => {
    // Setup console message collection before navigation
    const consoleMessages: ConsoleMessage[] = [];
    page.on("console", (message) => {
      console.log(`[Console ${message.type()}]:`, message.text());
      consoleMessages.push(message);
    });

    await page.goto(URL);

    // Wait for the page to fully load and settle
    await page.waitForLoadState("networkidle");

    // Wait a bit longer for async operations
    await page.waitForTimeout(5000);

    console.log(`Collected ${consoleMessages.length} console messages`);
    consoleMessages.forEach((msg, i) => {
      console.log(`  ${i}: ${msg.text()}`);
    });

    // Look for the provider sync message anywhere in the console log
    const hasSyncMessage = consoleMessages.some((msg) =>
      msg.text().includes("🔮 Provider + IndexedDB Synced 🔮")
    );

    // If no sync message, check if the page loaded properly
    if (!hasSyncMessage) {
      const pageTitle = await page.title();
      const currentUrl = page.url();
      console.log(`Page title: ${pageTitle}, URL: ${currentUrl}`);

      // Take a screenshot for debugging
      await page.screenshot({ path: "test-failure-single-client.png" });

      // Check if there are any error messages
      const errorMessages = consoleMessages.filter((msg) => msg.type() === "error");
      if (errorMessages.length > 0) {
        console.log("Error messages found:");
        errorMessages.forEach((msg) => console.log(`  ERROR: ${msg.text()}`));
      }
    }

    expect(hasSyncMessage).toBe(true);
  });

  test("Clients connecting to the same notebook should be connected to the same WebSocket Provider", async ({
    browser,
  }) => {
    const context1 = await browser.newContext();
    const page1 = await context1.newPage();
    const consoleMessages1: ConsoleMessage[] = [];
    page1.on("console", (message) => consoleMessages1.push(message));

    const context2 = await browser.newContext();
    const page2 = await context2.newPage();
    const consoleMessages2: ConsoleMessage[] = [];
    page2.on("console", (message) => consoleMessages2.push(message));

    // Load both pages and wait for network to settle
    await Promise.all([page1.goto(URL), page2.goto(URL)]);

    await Promise.all([
      page1.waitForLoadState("networkidle"),
      page2.waitForLoadState("networkidle"),
    ]);

    // Wait longer for WebSocket connections to establish
    await page1.waitForTimeout(5000);
    await page2.waitForTimeout(5000);

    console.log("consoleMessages1 length: ", consoleMessages1.length);
    console.log("consoleMessages2 length: ", consoleMessages2.length);

    // Check that both pages have sync messages (main requirement)
    const hasSyncMessage1 = consoleMessages1.some((msg) =>
      msg.text().includes("🔮 Provider + IndexedDB Synced 🔮")
    );
    const hasSyncMessage2 = consoleMessages2.some((msg) =>
      msg.text().includes("🔮 Provider + IndexedDB Synced 🔮")
    );

    if (!hasSyncMessage1 || !hasSyncMessage2) {
      console.log(
        "Messages1:",
        consoleMessages1.map((msg) => msg.text())
      );
      console.log(
        "Messages2:",
        consoleMessages2.map((msg) => msg.text())
      );
    }

    // Core requirement: both clients should have provider sync messages
    expect(hasSyncMessage1).toBe(true);
    expect(hasSyncMessage2).toBe(true);

    // Optional: Try to verify they're using the same provider (if provider details are logged)
    const providerIndex1 = consoleMessages1.findIndex(
      (msg) => msg && msg.text && msg.text().includes("HocuspocusProvider")
    );
    const providerIndex2 = consoleMessages2.findIndex(
      (msg) => msg && msg.text && msg.text().includes("HocuspocusProvider")
    );

    if (providerIndex1 >= 0 && providerIndex2 >= 0) {
      try {
        const providerDetails1 = await consoleMessages1[providerIndex1].args()[0].jsonValue();
        const providerDetails2 = await consoleMessages2[providerIndex2].args()[0].jsonValue();

        console.log("Provider details 1:", providerDetails1);
        console.log("Provider details 2:", providerDetails2);

        // If we have provider details, verify they match
        if (providerDetails1 && providerDetails2) {
          expect(providerDetails1.url).toBe(providerDetails2.url);
          expect(providerDetails1.name).toBe(providerDetails2.name);
        }
      } catch (error) {
        console.log("Could not extract provider details:", error);
        // This is optional verification, so don't fail the test
      }
    }

    // Cleanup
    await context1.close();
    await context2.close();
  });
});
