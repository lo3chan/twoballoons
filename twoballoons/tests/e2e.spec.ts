import { test, expect } from '@playwright/test';

test('can navigate to the application and load monaco editor', async ({ page }) => {
    await page.goto('http://localhost:1420');

    // Check if Monaco Editor container exists (it has a specific class)
    await expect(page.locator('.monaco-editor').first()).toBeVisible({ timeout: 5000 });

    // We expect the canvas to be rendered as well
    await expect(page.locator('canvas').first()).toBeVisible();

    // Verify our new language toggle is present
    await expect(page.getByText('BalloonDSL', { exact: false })).toBeVisible();
    // BalloonDSL unified mode verified

    // Verify Export/Import Diagram Modal Workflow
    await page.getByRole('button', { name: /Export \/ Import/i }).click();
    await expect(page.getByText('Diagram Tools')).toBeVisible();

    // Check Export tab
    await expect(page.getByRole('button', { name: /Generate Export/i })).toBeVisible();

    // Click Import tab
    await page.getByRole('button', { name: /Import/i, exact: true }).click();
    await expect(page.getByRole('button', { name: /Import Diagram/i })).toBeVisible();
});
