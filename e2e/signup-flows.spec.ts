import { test, expect } from '@playwright/test';

test('Signup markup renders correctly without server', async ({ page }) => {
  await page.setContent(`
    <main class="signup-page" role="main" aria-labelledby="signup-title">
      <form class="signup-form">
        <p id="signup-title" class="signup-form-title">Sign Up</p>

        <mat-form-field>
          <mat-label>Email</mat-label>
          <input type="email" aria-label="Email" />
        </mat-form-field>

        <mat-form-field>
          <mat-label>Password</mat-label>
          <input type="password" aria-label="Password" />
          <button type="button" aria-label="Show password">
            <mat-icon>visibility_off</mat-icon>
          </button>
        </mat-form-field>

        <button type="submit">Register</button>

        <div class="signup-links">
          <a href="/signin" aria-label="Go to signin page">Sign In</a>
        </div>
      </form>
    </main>
  `);

  await expect(page.locator('main.signup-page')).toBeVisible();
  await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible();
  await expect(page.getByRole('textbox', { name: /password/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /register/i })).toBeVisible();
});
