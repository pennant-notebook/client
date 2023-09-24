import { test, expect, Page } from '../setup/setupScript'
import {
  URL_CODE_CELL as URL,
  CODE_CELL_SELECTOR,
  CODE_TOOLBAR_SELECTOR,
  CODE_CELL_EDITOR_SELECTOR,
  CODE_CELL_OUTPUT_SELECTOR,
  RUN_CODE_BUTTON_SELECTOR,
  LOADING_INDICATOR_SELECTOR
} from '../utils/const';

const clearEditorContent = async (page: Page) => {
  await page.click(CODE_CELL_EDITOR_SELECTOR, { clickCount: 3 });
  await page.keyboard.press('Backspace');
};

test.describe('CodeCell Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
    await clearEditorContent(page);
  });

  test.afterEach(async ({ page }) => {
    await clearEditorContent(page);
  });

  test('should render CodeCell component', async ({ page }) => {
    const codeCell = await page.waitForSelector(CODE_CELL_SELECTOR);
    expect(codeCell).toBeTruthy();
  });

  test('should render toolbar in CodeCell component', async ({ page }) => {
    const codeToolbar = await page.waitForSelector(CODE_TOOLBAR_SELECTOR);
    expect(codeToolbar).toBeTruthy();
  });

  test('should execute code and display output', async ({ page }) => {
    await page.keyboard.type('console.log("testing cell")');
    await page.click(RUN_CODE_BUTTON_SELECTOR);

    /* loading indicator should appear then disappear */
    await page.waitForSelector(LOADING_INDICATOR_SELECTOR);
    await page.waitForSelector(LOADING_INDICATOR_SELECTOR, { state: 'detached' });

    /* check the output */
    const output = await page.waitForSelector(CODE_CELL_OUTPUT_SELECTOR);
    const outputText = await output.innerText();
    expect(outputText).toContain('testing cell');
  });



});
