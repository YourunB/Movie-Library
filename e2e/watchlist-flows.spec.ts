import { test, expect } from '@playwright/test';

test('Watchlist page handles VPN-blocked data gracefully', async ({ page }) => {
  await page.goto('http://localhost:4200/watchlist');

  const bodyText = await page.locator('body').innerText();

  const galleryGrid = page.locator('.gallery-grid');
  const emptyList = page.locator('.empty-list');
  const vpnWarning = /vpn|restricted|retry|region/i;

  const gridExists = await galleryGrid.count();
  const emptyExists = await emptyList.count();

  if (gridExists > 0) {
    galleryGrid.locator('app-movie-card');
  } else if (emptyExists > 0) {
    await expect(emptyList.locator('.no-results')).toBeVisible();
    await expect(emptyList.locator('mat-icon')).toHaveText('home');
  } else {
    expect(vpnWarning.test(bodyText)).toBeTruthy();
  }
});
