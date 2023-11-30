import { URL_CODE_CELL as URL } from '../../utils/const';
import { test, expect } from '../../setup/setupScriptComponent';

test.describe('A single WebSocket provider should be initialized per notebook', () => {

  test('Single Client WebSocket connection initially', async ({ page }) => {
    await page.goto(URL);

    const consoleMessages: any[] = [];
    page.on('console', message => consoleMessages.push(message));

    await page.waitForTimeout(2000);
    console.log({ consoleMessages });
    expect(consoleMessages[0].text()).toContain('🔮 Provider + IndexedDB Synced 🔮');
    expect(consoleMessages[1].args()[0].jsonValue()).resolves.toMatchObject({ isSynced: true });
  });

  test('Clients connecting to the same notebook should be connected to the same WebSocket Provider', async ({ browser }) => {
    const context1 = await browser.newContext();
    const page1 = await context1.newPage();
    const consoleMessages1: any[] = [];
    page1.on('console', message => consoleMessages1.push(message));

    const context2 = await browser.newContext();
    const page2 = await context2.newPage();
    const consoleMessages2: any[] = [];
    page2.on('console', message => consoleMessages2.push(message));

    await page1.goto(URL);
    await page2.goto(URL);

    await page1.waitForTimeout(2000);
    await page2.waitForTimeout(2000);

    console.log("consoleMessages1 [1]: ", consoleMessages1[1]);
    console.log("consoleMessages2 [1]: ", consoleMessages2[1]);

    const providerIndex1 = consoleMessages1.findIndex(msg => msg.text().includes('HocuspocusProvider'));
    const providerIndex2 = consoleMessages2.findIndex(msg => msg.text().includes('HocuspocusProvider'));

    /*  Extract provider details */
    const providerDetails1 = await consoleMessages1[providerIndex1].args()[0].jsonValue();
    const providerDetails2 = await consoleMessages2[providerIndex2].args()[0].jsonValue();

    /* Check if both providers are the same */
    expect(providerDetails1.url).toBe(providerDetails2.url);
    expect(providerDetails1.name).toBe(providerDetails2.name);
  });
});