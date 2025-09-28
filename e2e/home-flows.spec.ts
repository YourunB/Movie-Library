import { test, expect } from '@playwright/test';

test('Home page renders correctly with server', async ({ page }) => {
  await page.goto('http://localhost:4200/');

  await expect(page.locator('main.wrapper')).toBeVisible();

  await expect(page.locator('app-trading-movies')).toBeVisible();

  await expect(page.locator('app-toggle-section')).toBeVisible();

  await expect(page.locator('app-now-playing-movies')).toBeVisible();

  await expect(page.locator('app-popular-slider')).toBeVisible();

  await expect(page.locator('app-todays-highlights')).toBeVisible();
});
