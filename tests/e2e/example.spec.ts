import { test, expect } from '@playwright/test';

test.describe('E2E Tests', () => {
  test('should load homepage', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Pennant/);
  });
});