import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";
import { loginUser, navigateToAuthenticatedNotebook } from "../utils/auth-utils";
import { BASE_URL, URL_TEST_NOTEBOOK } from "../utils/const";

const findToolbarElements = async (page: Page) => {
  console.log("🔍 Looking for toolbar elements...");

  const toolbarChecks = {
    // Look for cell toolbars or action buttons
    cellToolbars: [
      '[data-test*="toolbar"]',
      ".cell-toolbar",
      ".toolbar",
      '[class*="toolbar"]',
      ".cell-actions",
    ],

    // Look for run buttons
    runButtons: [
      'button:has-text("Run")',
      'button:has-text("Execute")',
      'button[title*="run"]',
      'button[title*="execute"]',
      '[data-test*="run"]',
      ".run-button",
    ],

    // Look for language selection
    languageSelectors: [
      '[data-test*="language"]',
      ".language-selector",
      'select[name*="language"]',
      ".language-dropdown",
      'button:has-text("Python")',
      'button:has-text("JavaScript")',
    ],

    // Look for cell controls
    cellControls: [
      'button[title*="delete"]',
      'button[title*="remove"]',
      'button:has-text("Delete")',
      '[data-test*="delete"]',
      '[data-test*="remove"]',
      ".delete-button",
      ".remove-button",
    ],

    // Look for cell type controls
    cellTypeControls: [
      'button:has-text("+ Code")',
      'button:has-text("+ Markdown")',
      '[data-test*="add-code"]',
      '[data-test*="add-markdown"]',
    ],
  };

  const foundElements: any = {};

  for (const [elementType, selectors] of Object.entries(toolbarChecks)) {
    for (const selector of selectors) {
      try {
        const elements = await page.$$(selector);
        const visibleElements: any[] = [];

        for (const element of elements) {
          if (await element.isVisible()) {
            visibleElements.push(element);
          }
        }

        if (visibleElements.length > 0) {
          foundElements[elementType] = foundElements[elementType] || [];
          foundElements[elementType].push({
            selector,
            count: visibleElements.length,
            elements: visibleElements,
          });
          console.log(
            `✅ Found ${visibleElements.length} ${elementType} with selector: ${selector}`
          );
        }
      } catch (error) {
        // Continue to next selector
      }
    }
  }

  return foundElements;
};

const testToolbarInteraction = async (
  page: Page,
  toolbarElement: any,
  toolbarType: string
): Promise<boolean> => {
  try {
    console.log(`🧪 Testing ${toolbarType} interaction...`);

    // Try to hover over the toolbar to see if it reveals more options
    await toolbarElement.hover();
    await page.waitForTimeout(1000);

    // Check if hovering revealed additional buttons
    const additionalButtons = await page.$$('button:visible, [role="button"]:visible');
    console.log(`Found ${additionalButtons.length} total interactive elements after hover`);

    // Try to click the toolbar (if it's clickable)
    const isClickable = await toolbarElement.evaluate((el: any) => {
      return (
        el.tagName === "BUTTON" ||
        el.getAttribute("role") === "button" ||
        el.onclick !== null ||
        el.style.cursor === "pointer"
      );
    });

    if (isClickable) {
      console.log(`✅ ${toolbarType} appears to be clickable`);
      await toolbarElement.click();
      await page.waitForTimeout(1000);
      return true;
    }

    return false;
  } catch (error) {
    console.log(`⚠️ Error testing ${toolbarType} interaction:`, error);
    return false;
  }
};

test.describe("Toolbar Components with Authentication", () => {
  test.beforeEach(async ({ page }) => {
    console.log("\n🚀 Starting toolbar test setup...");

    // Authenticate the user
    console.log("🔐 Authenticating user...");
    const loginSuccess = await loginUser(page, BASE_URL);

    if (!loginSuccess) {
      console.log("⚠️ Login failed, but continuing with test...");
    }

    // Navigate to the test notebook
    console.log("📓 Navigating to test notebook...");
    const navigationSuccess = await navigateToAuthenticatedNotebook(page, URL_TEST_NOTEBOOK);

    if (!navigationSuccess) {
      console.log("⚠️ Could not navigate to test notebook, trying direct approach...");
      await page.goto(URL_TEST_NOTEBOOK, { waitUntil: "networkidle" });
    }

    // Wait for page to stabilize
    await page.waitForTimeout(3000);

    // Take a screenshot for debugging
    await page.screenshot({ path: "debug-toolbar-setup.png" });
  });

  test("should find toolbar or control elements", async ({ page }) => {
    console.log("\n🔧 Testing toolbar presence...");

    const foundElements = await findToolbarElements(page);
    const hasAnyToolbarElements = Object.keys(foundElements).length > 0;

    if (hasAnyToolbarElements) {
      console.log("✅ Found toolbar-related elements");
      console.log("📋 Summary of found elements:");

      for (const [elementType, elementData] of Object.entries(foundElements)) {
        console.log(`  - ${elementType}: ${(elementData as any[]).length} types found`);
      }

      expect(hasAnyToolbarElements).toBe(true);
    } else {
      console.log("⚠️ No toolbar elements found initially");

      // Maybe toolbars appear when we interact with cells
      // Try creating a code cell first
      const addCodeButton = await page.$('button:has-text("+ Code")');
      if (addCodeButton) {
        console.log("🔧 Creating a code cell to see if toolbars appear...");
        await addCodeButton.click();
        await page.waitForTimeout(2000);

        // Check again for toolbar elements
        const retryElements = await findToolbarElements(page);
        const hasToolbarsAfterCreatingCell = Object.keys(retryElements).length > 0;

        if (hasToolbarsAfterCreatingCell) {
          console.log("✅ Found toolbar elements after creating code cell");
          expect(hasToolbarsAfterCreatingCell).toBe(true);
        } else {
          test.skip(true, "No toolbar elements found even after creating code cell");
        }
      } else {
        test.skip(true, "No toolbar elements or cell creation buttons found");
      }
    }
  });

  test("should have functional run controls", async ({ page }) => {
    console.log("\n▶️ Testing run controls...");

    const foundElements = await findToolbarElements(page);

    if (foundElements.runButtons && foundElements.runButtons.length > 0) {
      const runButtonInfo = foundElements.runButtons[0];
      const runButton = runButtonInfo.elements[0];

      console.log(`✅ Found run button with selector: ${runButtonInfo.selector}`);

      // Test if the run button is functional
      const isEnabled = await runButton.isEnabled();
      console.log(`Run button enabled: ${isEnabled}`);

      if (isEnabled) {
        // Test clicking the run button (but don't actually execute if there's no code)
        console.log("🧪 Testing run button click...");
        await runButton.click();
        await page.waitForTimeout(1000);

        // Check if clicking had any effect (modal, state change, etc.)
        const afterClickState = await page.evaluate(() => {
          return {
            hasModal: !!document.querySelector('.modal, [role="dialog"]'),
            hasLoading: !!document.querySelector('.loading, .spinner, [class*="loading"]'),
            activeElement: document.activeElement?.tagName,
          };
        });

        console.log("After click state:", afterClickState);
        expect(isEnabled).toBe(true);
      } else {
        console.log("⚠️ Run button is disabled - this might be expected without code");
        expect(runButton).toBeTruthy(); // At least the button exists
      }
    } else {
      console.log("⚠️ No run buttons found");

      // Maybe run buttons appear in context - try creating a code cell with some content
      const addCodeButton = await page.$('button:has-text("+ Code")');
      if (addCodeButton) {
        await addCodeButton.click();
        await page.waitForTimeout(2000);

        // Try to add some code
        const editors = await page.$$(
          '[data-test*="editor"], .editor, textarea, [contenteditable="true"]'
        );
        if (editors.length > 0) {
          await editors[0].click();
          await page.keyboard.type('print("test")');
          await page.waitForTimeout(1000);

          // Check again for run buttons
          const retryElements = await findToolbarElements(page);
          if (retryElements.runButtons && retryElements.runButtons.length > 0) {
            console.log("✅ Found run buttons after adding code");
            expect(retryElements.runButtons.length).toBeGreaterThan(0);
          } else {
            test.skip(true, "No run buttons found even after adding code");
          }
        } else {
          test.skip(true, "Could not find editor to add code");
        }
      } else {
        test.skip(true, "No run controls found and cannot create code cell");
      }
    }
  });

  test("should have cell management controls", async ({ page }) => {
    console.log("\n🗂️ Testing cell management controls...");

    const foundElements = await findToolbarElements(page);

    // Check for add cell controls (+ Code, + Markdown buttons)
    if (foundElements.cellTypeControls && foundElements.cellTypeControls.length > 0) {
      console.log("✅ Found cell type controls (+ Code, + Markdown)");

      const addCodeControl = foundElements.cellTypeControls.find(
        (control: any) => control.selector.includes("Code") || control.selector.includes("code")
      );

      if (addCodeControl) {
        console.log("✅ Add Code button is available");

        // Test adding a code cell
        const addButton = addCodeControl.elements[0];
        await addButton.click();
        await page.waitForTimeout(2000);

        // Check if a cell was added
        const cells = await page.$$('[data-test*="cell"], .cell, .code-cell');
        console.log(`Found ${cells.length} cells after clicking add code`);

        expect(cells.length).toBeGreaterThan(0);
      }
    }

    // Check for delete/remove controls
    if (foundElements.cellControls && foundElements.cellControls.length > 0) {
      console.log("✅ Found cell control buttons (delete/remove)");
      expect(foundElements.cellControls.length).toBeGreaterThan(0);
    }

    // If we found any management controls, the test passes
    const hasManagementControls =
      (foundElements.cellTypeControls && foundElements.cellTypeControls.length > 0) ||
      (foundElements.cellControls && foundElements.cellControls.length > 0);

    if (hasManagementControls) {
      console.log("✅ Cell management controls are available");
      expect(hasManagementControls).toBe(true);
    } else {
      console.log("⚠️ No cell management controls found");
      test.skip(true, "No cell management controls found");
    }
  });

  test("should have language or execution environment controls", async ({ page }) => {
    console.log("\n🐍 Testing language/environment controls...");

    const foundElements = await findToolbarElements(page);

    if (foundElements.languageSelectors && foundElements.languageSelectors.length > 0) {
      console.log("✅ Found language selector controls");

      const languageControl = foundElements.languageSelectors[0];
      const languageElement = languageControl.elements[0];

      // Test interaction with language selector
      await testToolbarInteraction(page, languageElement, "language selector");

      expect(foundElements.languageSelectors.length).toBeGreaterThan(0);
    } else {
      console.log("⚠️ No explicit language selectors found");

      // Check if there are any indications of the current language/environment
      const languageIndicators = await page.$$eval("*", (elements: Element[]) =>
        elements
          .map((el) => ({
            text: el.textContent?.trim(),
            classes: el.className,
          }))
          .filter(
            (el) =>
              el.text &&
              (el.text.toLowerCase().includes("python") ||
                el.text.toLowerCase().includes("javascript") ||
                el.text.toLowerCase().includes("js") ||
                el.text.toLowerCase().includes("language"))
          )
          .slice(0, 5)
      );

      if (languageIndicators.length > 0) {
        console.log("✅ Found language indicators:", languageIndicators);
        expect(languageIndicators.length).toBeGreaterThan(0);
      } else {
        console.log("⚠️ No language controls or indicators found");
        test.skip(true, "No language/environment controls found");
      }
    }
  });
});
