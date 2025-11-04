import { test, expect } from '@playwright/test';

test('should open google.com', async ({ page }) => {
  await page.goto('https://www.google.com');
  await expect(page).toHaveTitle(/Google/);
});
