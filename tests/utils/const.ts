const PORT = 3000;
export const BASE_URL = !(typeof process !== "undefined" && process.env.RUN_IN_DOCKER)
  ? `http://localhost:${PORT}`
  : `http://host.docker.internal:${PORT}`;

const testUser = "@testing";

// Updated test notebook URL provided by user
const testNotebookDoc = "22874249-7834-4e44-a7b8-5d084d89e369";
const codeEditorId = "editor-f6000bef-8b13-4460-8eac-86644805ad88";

// Primary URLs - using the new test notebook
export const URL_CODE_CELL = `${BASE_URL}/${testUser}/${testNotebookDoc}`;
export const URL_TEST_NOTEBOOK = `${BASE_URL}/${testUser}/${testNotebookDoc}`;

// Authentication credentials
export const AUTH_CREDENTIALS = {
  username: "testing",
  password: "123456",
};

// Fallback URLs - try these if primary URL fails
export const FALLBACK_URLS = {
  CODE_CELL: [`${BASE_URL}/${testUser}/${testNotebookDoc}`, BASE_URL],
};

// Primary selectors for CodeCell components
export const CODE_CELL_SELECTOR = "[data-test='codeCell']";
export const CODE_TOOLBAR_SELECTOR = "[data-test='codeToolbar']";
export const CODE_CELL_EDITOR_SELECTOR = `[data-test='codeEditor'][data-testid='${codeEditorId}']`;
export const CODE_CELL_PROCESSING_SELECTOR = "[data-test='processing']";
export const CODE_CELL_OUTPUT_SELECTOR = "[data-test='output']";
export const CODE_CELL_STACK_SELECTOR = "[data-test='codeCell-stack']";
export const CODE_CELL_BADGE_SELECTOR = "[data-test='codeCell-badge']";
export const CODE_TOOLBAR_COMPONENT_SELECTOR = "[data-test='codeToolbar-component']";
export const CODE_CELL_OUTPUT_BOX_SELECTOR = "[data-test='codeCell-outputBox']";

// Fallback selectors - try these if primary selectors fail
export const FALLBACK_SELECTORS = {
  CODE_CELL: [
    "[data-test='codeCell']",
    "[data-testid*='code']",
    ".code-cell",
    "[class*='codecell']",
    "[class*='code-cell']",
    ".editor-container",
    "[data-test*='cell']",
  ],

  CODE_EDITOR: [
    `[data-test='codeEditor'][data-testid='${codeEditorId}']`,
    "[data-testid*='editor']",
    ".editor",
    "[class*='editor']",
    "textarea",
    "[contenteditable='true']",
    ".code-input",
    ".monaco-editor",
    ".cm-editor",
  ],

  CODE_TOOLBAR: [
    "[data-test='codeToolbar']",
    "[data-test*='toolbar']",
    ".code-toolbar",
    "[class*='toolbar']",
    ".toolbar",
    "[data-testid*='toolbar']",
  ],

  RUN_BUTTON: [
    "[data-test='runCodeButton']",
    "[data-test*='run']",
    "button:has-text('Run')",
    "button:has-text('Execute')",
    ".run-button",
    "[class*='run']",
    "[aria-label*='run']",
    "[title*='run']",
  ],

  OUTPUT: [
    "[data-test='output']",
    "[data-test*='output']",
    ".output",
    "[class*='output']",
    ".result",
    ".console",
    ".execution-result",
  ],
};

// Constants for selecting components in CodeToolbar.tsx
export const CODE_TOOLBAR_CONTAINER_SELECTOR = "[data-test='codeToolbarContainer']";
export const TOOLBAR_STACK_SELECTOR = "[data-test='toolbarStack']";
export const LANGUAGE_SELECTOR = "[data-test='language']";
export const LANGUAGE_OPTION_JS_SELECTOR = "[data-test='languageOption-js']";
export const LANGUAGE_OPTION_GO_SELECTOR = "[data-test='languageOption-go']";
export const RUN_CODE_BUTTON_SELECTOR = "[data-test='runCodeButton']";
export const REMOVE_CELL_BUTTON_SELECTOR = "[data-test='removeCellButton']";
export const LOADING_INDICATOR_SELECTOR = "[data-test='loadingIndicator']";

// Constants for selecting components in MarkdownCell.tsx
export const MARKDOWN_CELL_BOX_SELECTOR = "[data-id='markdown-cell-box']";
export const MARKDOWN_CONTAINER_SELECTOR = "[data-id='markdown-container']";
export const MARKDOWN_TOOLBAR_SELECTOR = "[data-id='markdown-toolbar']";
export const MARKDOWN_EDITOR_BOX_SELECTOR = "[data-id='markdown-editor-box']";
export const MARKDOWN_EDITOR_SELECTOR = "[data-id='markdown-editor']";

// Constants for selecting components in Alert.tsx
const alertDoc = "46637dd7-a40a-4505-8007-0170e40291c0";
export const URL_ALERT_BLOCK = `${BASE_URL}/${testUser}/${alertDoc}`;
export const ALERT_BLOCK_SELECTOR = "[data-test='alertContainer']";
export const ALERT_ICON_WRAPPER_SELECTOR = "[data-test='alertIconWrapper']";
export const ALERT_MENU_DROPDOWN_SELECTOR = "[data-test='menuDropdown']";
export const ALERT_MENU_ITEM_SELECTOR = "[data-test='menuItem']";
export const ALERT_MENU_ERROR_SELECTOR = "[data-type='error']";
export const SLASH_MENU_SELECTOR = "#tippy-3";
export const SLASH_MENU_ALERT_SELECTOR =
  'button:has-text("Alert"):has-text("Used to emphasize text")';

// Utility functions for robust element selection
export const findElementWithFallbacks = async (page: any, selectors: string[]) => {
  for (const selector of selectors) {
    try {
      const element = await page.waitForSelector(selector, { timeout: 3000 });
      if (element && (await element.isVisible())) {
        return { element, selector };
      }
    } catch (error) {
      // Continue to next selector
    }
  }
  return null;
};

export const debugElementsOnPage = async (page: any) => {
  const elements = await page.$$eval(
    '*[data-test], *[data-testid], *[class*="code"], *[class*="editor"], *[class*="toolbar"]',
    (elements: Element[]) =>
      elements
        .map((el) => ({
          tag: el.tagName,
          dataTest: el.getAttribute("data-test"),
          dataTestId: el.getAttribute("data-testid"),
          classes: el.className,
          id: el.id,
          textContent: el.textContent?.substring(0, 50),
        }))
        .filter(
          (el) =>
            el.dataTest ||
            el.dataTestId ||
            el.classes?.includes("code") ||
            el.classes?.includes("editor") ||
            el.classes?.includes("toolbar")
        )
        .slice(0, 20) // Limit output
  );

  console.log("Available elements on page:", JSON.stringify(elements, null, 2));
  return elements;
};

// Common timeouts
export const TIMEOUTS = {
  ELEMENT_WAIT: 15000,
  PAGE_LOAD: 30000,
  CODE_EXECUTION: 10000,
  NAVIGATION: 20000,
};

// Test environment detection
export const isCI = !!(typeof process !== "undefined" && process.env.CI);
export const isDocker = !!(typeof process !== "undefined" && process.env.RUN_IN_DOCKER);

// Adjust timeouts for CI environment
export const getTimeout = (baseTimeout: number) => {
  return isCI ? baseTimeout * 2 : baseTimeout;
};
