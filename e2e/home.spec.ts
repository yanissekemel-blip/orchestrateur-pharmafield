import { expect, test } from '@playwright/test';

test('a signed-out visitor is sent to the login page', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/login/);
  await expect(page.getByRole('heading', { name: 'Connexion' })).toBeVisible();
  await expect(page.getByLabel('E-mail')).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Se connecter' }),
  ).toBeVisible();
});
