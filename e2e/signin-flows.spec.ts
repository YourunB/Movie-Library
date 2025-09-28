import { test, expect } from '@playwright/test';

test('Sign In page renders correctly with server', async ({ page }) => {
  await page.goto('http://localhost:4200/signin');

  await expect(page.locator('main.login-page')).toBeVisible();

  await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible();

  await expect(page.getByRole('textbox', { name: /password/i })).toBeVisible();
});
