import { test, expect } from '@playwright/test';

test('Movie page handles failed data gracefully', async ({ page }) => {

  await page.goto('http://localhost:4200/movie/123');

  await expect(page.getByRole('heading', { name: /trailer/i })).toBeVisible();

  await expect(page.getByRole('heading', { name: /cast/i })).toBeVisible();

  const skeletonHero = page.locator('.movie-hero.skeleton');
  await expect(skeletonHero).toBeVisible();

  const trailerFrame = page.locator('iframe');
  await expect(trailerFrame).toHaveCount(0);

  const emptyCast = page.locator('.empty-state');
  const castGrid = page.locator('.cast-grid');
  const castCards = castGrid.locator('.cast-card');

  const hasEmptyMessage = await emptyCast.isVisible();
  const hasCastCards = await castCards.count();

  expect(hasEmptyMessage || hasCastCards === 0).toBeTruthy();
});
