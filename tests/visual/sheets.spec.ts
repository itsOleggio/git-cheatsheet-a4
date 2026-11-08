import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('./', { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
});

test('лист 1 совпадает с эталоном', async ({ page }) => {
  await expect(page.locator('#sheet')).toHaveScreenshot('sheet1.png');
});

test('лист 2 совпадает с эталоном', async ({ page }) => {
  await expect(page.locator('#sheet2')).toHaveScreenshot('sheet2.png');
});
