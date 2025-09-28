import { test, expect } from '@playwright/test';

test('Person page handles missing data gracefully', async ({ page }) => {
  await page.goto('http://localhost:4200/person/287');

  const personSection = page.locator('main.person-section');
  const sectionExists = await personSection.count();

  if (sectionExists > 0) {
    await expect(personSection.locator('h1')).toBeVisible();
    await expect(personSection.locator('img')).toBeVisible();
  } else {
    await expect(page.locator('body')).toContainText(/actor|актёр|error|not found/i);
  }
});
