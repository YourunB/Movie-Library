import { test, expect } from '@playwright/test';

test('Gallery page handles empty or failed data gracefully', async ({ page }) => {
  await page.goto('http://localhost:4200/gallery');

  await expect(page.getByRole('heading', { name: /gallery/i })).toBeVisible();

  const galleryGrid = page.locator('.gallery-grid');
  const gridExists = await galleryGrid.count();

  if (gridExists > 0) {
    const movieCards = galleryGrid.locator('app-movie-card');
    const skeletonCards = galleryGrid.locator('.skeleton-card');

    const hasMovies = await movieCards.count();
    const hasSkeletons = await skeletonCards.count();

    expect(hasMovies > 0 || hasSkeletons > 0).toBeTruthy();
  } else {
    const noResults = page.locator('.no-results');
    await expect(noResults).toBeVisible();
  }
});
