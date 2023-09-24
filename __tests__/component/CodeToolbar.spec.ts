import { test, expect } from '../setup/setupScriptComponent';
import {
  URL_CODE_CELL as URL,
  CODE_TOOLBAR_CONTAINER_SELECTOR,
  LANGUAGE_SELECTOR,
  LANGUAGE_OPTION_JS_SELECTOR
} from '../utils/const';

test.describe('CodeToolbar Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
  });

  test('should render CodeToolbar component', async ({ page }) => {
    const codeToolbarContainer = await page.waitForSelector(CODE_TOOLBAR_CONTAINER_SELECTOR);
    expect(codeToolbarContainer).toBeTruthy();
  });

  test('should have language selector with default value as JavaScript', async ({ page }) => {
    const languageSelector = await page.waitForSelector(LANGUAGE_SELECTOR);
    expect(languageSelector).toBeTruthy();
    const selectedLanguage = await page.$eval(LANGUAGE_SELECTOR, (el: HTMLSelectElement) => el.value);
    expect(selectedLanguage).toBe(LANGUAGE_OPTION_JS_SELECTOR);
  });
});
