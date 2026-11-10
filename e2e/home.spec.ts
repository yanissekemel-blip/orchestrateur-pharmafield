import { expect, test } from '@playwright/test';

test('home page loads', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Orchestrateur Pharmafield' }),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Commencer' })).toBeVisible();
});
