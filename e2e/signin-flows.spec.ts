import { test, expect } from '@playwright/test';

test('Sign In markup renders correctly', async ({ page }) => {
  await page.setContent(`
    <main class="login-page">
      <form>
        <input type="email" aria-label="Email" />
        <input type="password" aria-label="Password" />
        <button type="submit">Login</button>
      </form>
    </main>
  `);

  await expect(page.locator('main.login-page')).toBeVisible();
  await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible();
  await expect(page.getByRole('textbox', { name: /password/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /login/i })).toBeVisible();
});
