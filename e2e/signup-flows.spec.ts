import { test, expect } from '@playwright/test';

test('Signup page renders correctly with server', async ({ page }) => {
  await page.goto('http://localhost:4200/signup');

  await expect(page.locator('main.signup-page')).toBeVisible();

  await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible();

  await expect(page.getByRole('textbox', { name: /password/i })).toBeVisible();

  await expect(page.getByRole('button', { name: /register/i })).toBeVisible();
});
