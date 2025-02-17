import { test, expect } from '@playwright/test';
import path from 'path';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000/');
});

test.describe('Server selection', () => {
  test('should populate dropdown with server names', async ({ page }) => {
    await expect(page.getByRole('combobox')).toContainText('ElementalGaiaManaAetherPrimalChaosLightCrystalMateriaMeteorDynamis');
  });
});

test.describe('File upload', () => {
  test('should allow me to upload a file with items', async ({ page }) => {
    await page.getByRole('combobox').selectOption('Chaos');
    await page.getByText('Select a MakePlace file').click();
    await page.getByRole('textbox', { name: 'Select a MakePlace file' }).setInputFiles(path.join(__dirname, '../ExampleData.list.txt'));

    await Promise.all([
      page.waitForResponse('https://universalis.app/api/v2/**'),
      page.locator('.animate-spin').waitFor({ state: 'detached' }),
    ]);

    const tableRows = await page.locator('table tbody tr').all();
    expect(tableRows.length).toBeGreaterThan(0);
  });
});
