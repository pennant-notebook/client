import {
  test,
  expect
} from '../setup/setupScriptComponent'
import {
  ALERT_BLOCK_SELECTOR,
  ALERT_ICON_WRAPPER_SELECTOR,
  ALERT_MENU_ERROR_SELECTOR,
  ALERT_MENU_DROPDOWN_SELECTOR,
  MARKDOWN_EDITOR_BOX_SELECTOR,
  SLASH_MENU_SELECTOR,
  SLASH_MENU_ALERT_SELECTOR,
  URL_ALERT_BLOCK as URL,
} from '../utils/const'

test.describe('Alert Block Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
  });

  test('should render the Alert block correctly', async ({ page }) => {
    await page.click(MARKDOWN_EDITOR_BOX_SELECTOR);
    await page.keyboard.type('/');
    await page.waitForSelector(SLASH_MENU_SELECTOR);
    await page.click(SLASH_MENU_ALERT_SELECTOR);

    const alertBlock = await page.waitForSelector(ALERT_BLOCK_SELECTOR);

    expect(await alertBlock.isVisible()).toBe(true);
    expect(await alertBlock.getAttribute('data-type')).toBe('warning');
  });

  test('should be able to change the Alert type', async ({
    page
  }) => {
    await page.click(ALERT_ICON_WRAPPER_SELECTOR);
    await page.click(ALERT_MENU_DROPDOWN_SELECTOR);
    await page.click(ALERT_MENU_ERROR_SELECTOR);

    const alertBlock = await page.waitForSelector(ALERT_BLOCK_SELECTOR);

    expect(await alertBlock.getAttribute('data-type')).toBe('error');

    if (process.platform === 'darwin') {
      await page.keyboard.down('Meta');
      await page.keyboard.press('a');
      await page.keyboard.up('Meta');
    } else {
      await page.keyboard.down('Control');
      await page.keyboard.press('a');
      await page.keyboard.up('Control');
    }
    await page.keyboard.press('Backspace');
  });

});
