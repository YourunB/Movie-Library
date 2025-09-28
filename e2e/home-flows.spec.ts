import { test, expect } from '@playwright/test';

test('Home page markup renders correctly without server', async ({ page }) => {
  await page.setContent(`
    <main class="wrapper">
      <app-trading-movies>Trading</app-trading-movies>
      <app-toggle-section>
        <app-now-playing-movies>Now Playing</app-now-playing-movies>
        <app-upcoming-movies>Upcoming</app-upcoming-movies>
      </app-toggle-section>
      <app-popular-slider>Popular</app-popular-slider>
      <app-todays-highlights>Highlights</app-todays-highlights>
    </main>
  `);

  await expect(page.locator('main.wrapper')).toBeVisible();
  await expect(page.locator('app-trading-movies')).toContainText('Trading');
  await expect(page.locator('app-toggle-section')).toBeVisible();
  await expect(page.locator('app-now-playing-movies')).toContainText('Now Playing');
  await expect(page.locator('app-upcoming-movies')).toContainText('Upcoming');
  await expect(page.locator('app-popular-slider')).toContainText('Popular');
  await expect(page.locator('app-todays-highlights')).toContainText('Highlights');
});
