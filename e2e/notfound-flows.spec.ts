import { test, expect } from '@playwright/test';

test('Not Found page renders correctly with server', async ({ page }) => {
  await page.goto('http://localhost:4200/404');

  await expect(page.locator('main.notfound-page')).toBeVisible();

  await expect(page.locator('main.notfound-page > p')).toBeVisible();

  const homeLink = page.locator('a.notfound-link');
  await expect(homeLink).toBeVisible();

  await expect(homeLink.locator('mat-icon')).toHaveText('home');
});
