import { test, expect } from '@playwright/test';

test('About page renders correctly with server', async ({ page }) => {
  await page.goto('http://localhost:4200/about');

  await expect(page.getByRole('heading', { name: /about/i })).toBeVisible();

  await expect(page.getByText('Created: 2025')).toBeVisible();

  await expect(page.getByRole('link', { name: /tmdb api/i })).toBeVisible();

  await expect(page.getByRole('heading', { name: /developers/i })).toBeVisible();

  await expect(page.locator('.dev-cards__card')).toHaveCount(3);
});
