import { Page } from "@playwright/test";
import { debugElementsOnPage, FALLBACK_SELECTORS, getTimeout, TIMEOUTS } from "./const";

/**
 * Wait for the application to fully load and render
 */
export const waitForAppToLoad = async (page: Page) => {
  await page.waitForLoadState("networkidle");

  // Wait for React to mount and render essential elements
  await page.waitForFunction(
    () => {
      return (
        document.querySelector(
          '[data-test], [data-testid], .editor, .code-cell, [class*="code"]'
        ) !== null || document.querySelector("main, #root, #app, .app") !== null
      );
    },
    { timeout: getTimeout(TIMEOUTS.PAGE_LOAD) }
  );

  // Give additional time for dynamic content to load
  await page.waitForTimeout(2000);
};

/**
 * Navigate to a URL with fallback strategies
 */
export const navigateWithFallbacks = async (
  page: Page,
  primaryUrl: string,
  fallbackUrls: string[] = [],
  requiredElementSelectors: string[] = []
): Promise<{ success: boolean; url: string; foundElements: string[] }> => {
  const tryUrl = async (url: string): Promise<{ success: boolean; foundElements: string[] }> => {
    try {
      console.log(`Attempting to navigate to: ${url}`);
      await page.goto(url, { waitUntil: "networkidle", timeout: getTimeout(TIMEOUTS.NAVIGATION) });

      // Check if we successfully loaded a page with required elements
      const foundElements: string[] = [];

      if (requiredElementSelectors.length > 0) {
        for (const selector of requiredElementSelectors) {
          try {
            const element = await page.waitForSelector(selector, { timeout: 3000 });
            if (element && (await element.isVisible())) {
              foundElements.push(selector);
            }
          } catch (error) {
            // Element not found, continue
          }
        }

        if (foundElements.length > 0) {
          console.log(`✅ Successfully loaded ${url} with elements: ${foundElements.join(", ")}`);
          return { success: true, foundElements };
        }
      } else {
        // If no specific elements required, just check page loaded without errors
        const hasContent = await page.evaluate(() => {
          const body = document.body;
          return (
            body &&
            body.textContent &&
            body.textContent.length > 100 &&
            !body.textContent.includes("404") &&
            !body.textContent.includes("Not Found")
          );
        });

        if (hasContent) {
          console.log(`✅ Successfully loaded ${url}`);
          return { success: true, foundElements: [] };
        }
      }

      console.log(`⚠️ URL loaded but missing required elements: ${url}`);
      return { success: false, foundElements };
    } catch (error) {
      console.log(`❌ Failed to load ${url}:`, error);
      return { success: false, foundElements: [] };
    }
  };

  // Try primary URL first
  const primaryResult = await tryUrl(primaryUrl);
  if (primaryResult.success) {
    return { success: true, url: primaryUrl, foundElements: primaryResult.foundElements };
  }

  // Try fallback URLs
  for (const fallbackUrl of fallbackUrls) {
    const result = await tryUrl(fallbackUrl);
    if (result.success) {
      return { success: true, url: fallbackUrl, foundElements: result.foundElements };
    }
  }

  console.log(`❌ All navigation attempts failed`);
  return { success: false, url: primaryUrl, foundElements: [] };
};

/**
 * Find an element using multiple selector strategies
 */
export const findElementWithFallbacks = async (
  page: Page,
  selectorGroup: string[],
  options: { timeout?: number; mustBeVisible?: boolean } = {}
): Promise<{ element: any; selector: string } | null> => {
  const { timeout = 5000, mustBeVisible = true } = options;

  for (const selector of selectorGroup) {
    try {
      const element = await page.waitForSelector(selector, { timeout });

      if (element) {
        if (!mustBeVisible || (await element.isVisible())) {
          console.log(`✅ Found element with selector: ${selector}`);
          return { element, selector };
        }
      }
    } catch (error) {
      // Continue to next selector
    }
  }

  console.log(`❌ No element found with selectors: ${selectorGroup.join(", ")}`);
  return null;
};

/**
 * Find multiple elements of the same type (e.g., all buttons)
 */
export const findMultipleElements = async (
  page: Page,
  selectorGroups: string[][],
  options: { timeout?: number; mustBeVisible?: boolean } = {}
): Promise<Array<{ element: any; selector: string; type: string }>> => {
  const foundElements: Array<{ element: any; selector: string; type: string }> = [];

  for (let i = 0; i < selectorGroups.length; i++) {
    const result = await findElementWithFallbacks(page, selectorGroups[i], options);
    if (result) {
      foundElements.push({
        ...result,
        type: `group_${i}`,
      });
    }
  }

  return foundElements;
};

/**
 * Clear editor content with multiple strategies
 */
export const clearEditorContent = async (
  page: Page,
  editorSelectors: string[] = FALLBACK_SELECTORS.CODE_EDITOR
) => {
  const editorResult = await findElementWithFallbacks(page, editorSelectors, { timeout: 5000 });

  if (!editorResult) {
    console.log("⚠️ Could not find editor to clear");
    return false;
  }

  try {
    const { element, selector } = editorResult;

    // Try different clearing strategies
    await page.click(selector);

    // Strategy 1: Select all and delete
    try {
      await page.keyboard.press("Control+A");
      await page.keyboard.press("Backspace");
      console.log("✅ Cleared editor using Ctrl+A + Backspace");
      return true;
    } catch (error) {
      console.log("Strategy 1 failed:", error);
    }

    // Strategy 2: Triple click and delete
    try {
      await page.click(selector, { clickCount: 3 });
      await page.keyboard.press("Delete");
      console.log("✅ Cleared editor using triple-click + Delete");
      return true;
    } catch (error) {
      console.log("Strategy 2 failed:", error);
    }

    // Strategy 3: If it's a contenteditable, clear innerHTML
    try {
      await element.evaluate((el: any) => {
        if (el.contentEditable === "true") {
          el.innerHTML = "";
          return true;
        }
        if (el.tagName === "TEXTAREA" || el.tagName === "INPUT") {
          el.value = "";
          return true;
        }
        return false;
      });
      console.log("✅ Cleared editor using direct content manipulation");
      return true;
    } catch (error) {
      console.log("Strategy 3 failed:", error);
    }
  } catch (error) {
    console.log("Could not clear editor content:", error);
  }

  return false;
};

/**
 * Type code into editor with verification
 */
export const typeCodeInEditor = async (
  page: Page,
  code: string,
  editorSelectors: string[] = FALLBACK_SELECTORS.CODE_EDITOR
): Promise<boolean> => {
  const editorResult = await findElementWithFallbacks(page, editorSelectors);

  if (!editorResult) {
    console.log("❌ Could not find editor to type in");
    return false;
  }

  try {
    const { selector } = editorResult;

    // Clear first
    await clearEditorContent(page, [selector]);

    // Click to focus
    await page.click(selector);

    // Type the code
    await page.keyboard.type(code, { delay: 50 }); // Add small delay for stability

    // Verify content was typed
    const content = await page.$eval(selector, (el: any) => {
      if (el.tagName === "TEXTAREA" || el.tagName === "INPUT") {
        return el.value;
      }
      return el.textContent || el.innerText;
    });

    if (content.includes(code.substring(0, 10))) {
      // Check first 10 chars
      console.log("✅ Successfully typed code into editor");
      return true;
    } else {
      console.log("⚠️ Code may not have been typed correctly");
      console.log("Expected:", code.substring(0, 50));
      console.log("Found:", content.substring(0, 50));
    }
  } catch (error) {
    console.log("❌ Failed to type code in editor:", error);
  }

  return false;
};

/**
 * Execute code and wait for output
 */
export const executeCodeAndWaitForOutput = async (
  page: Page,
  expectedOutput: string,
  runButtonSelectors: string[] = FALLBACK_SELECTORS.RUN_BUTTON,
  outputSelectors: string[] = FALLBACK_SELECTORS.OUTPUT
): Promise<{ success: boolean; output: string }> => {
  // Find and click run button
  const runButtonResult = await findElementWithFallbacks(page, runButtonSelectors);

  if (!runButtonResult) {
    console.log("⚠️ No run button found, trying keyboard shortcut");
    await page.keyboard.press("Shift+Enter");
  } else {
    await runButtonResult.element.click();
    console.log(`✅ Clicked run button: ${runButtonResult.selector}`);
  }

  // Wait for output
  let foundOutput = "";
  let outputFound = false;

  // Try to find output in dedicated output elements
  for (const outputSelector of outputSelectors) {
    try {
      const output = await page.waitForSelector(outputSelector, {
        timeout: getTimeout(TIMEOUTS.CODE_EXECUTION),
      });
      if (output) {
        foundOutput = await output.innerText();
        if (foundOutput.includes(expectedOutput)) {
          outputFound = true;
          console.log(`✅ Found expected output with selector: ${outputSelector}`);
          break;
        }
      }
    } catch (error) {
      // Continue to next selector
    }
  }

  // If not found in dedicated output elements, check entire page
  if (!outputFound) {
    try {
      foundOutput = await page.evaluate((expected: string) => {
        const allElements = document.querySelectorAll("*");
        for (const el of allElements) {
          const text = el.textContent || "";
          if (text.includes(expected)) {
            return text;
          }
        }
        return "";
      }, expectedOutput);

      if (foundOutput.includes(expectedOutput)) {
        outputFound = true;
        console.log("✅ Found expected output in page content");
      }
    } catch (error) {
      console.log("Error searching page content:", error);
    }
  }

  return { success: outputFound, output: foundOutput };
};

/**
 * Debug helper - take screenshot and log page state
 */
export const debugPageState = async (page: Page, testName: string) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const screenshotPath = `debug-${testName}-${timestamp}.png`;

  await page.screenshot({ path: screenshotPath });
  console.log(`📸 Screenshot saved: ${screenshotPath}`);

  const pageInfo = await page.evaluate(() => ({
    title: document.title,
    url: window.location.href,
    bodyLength: document.body.innerHTML.length,
    hasDataTest: !!document.querySelector("[data-test]"),
    hasDataTestId: !!document.querySelector("[data-testid]"),
    hasEditorElements: !!(
      document.querySelector(".editor") ||
      document.querySelector('[class*="editor"]') ||
      document.querySelector("textarea")
    ),
  }));

  console.log("Page state:", pageInfo);

  await debugElementsOnPage(page);

  return screenshotPath;
};

/**
 * Generic test setup for navigation and basic checks
 */
export const setupTest = async (
  page: Page,
  primaryUrl: string,
  fallbackUrls: string[] = [],
  requiredSelectors: string[] = []
): Promise<{ success: boolean; url: string }> => {
  const navResult = await navigateWithFallbacks(page, primaryUrl, fallbackUrls, requiredSelectors);

  if (!navResult.success) {
    await debugPageState(page, "navigation-failure");
  }

  await waitForAppToLoad(page);

  return { success: navResult.success, url: navResult.url };
};
