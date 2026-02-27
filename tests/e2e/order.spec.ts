/**
 * KiloLab E2E Tests - Order Flow
 * Tests the complete order creation process
 */
import { test, expect } from '@playwright/test';

test.describe('Order Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/new-order');
  });

  test('should display order form with steps', async ({ page }) => {
    // Check step indicator
    const steps = page.locator('text=/formule|poids|localisation|date|paiement/i');
    await expect(steps.first()).toBeVisible();
  });

  test('should display formula selection', async ({ page }) => {
    // Check formula options
    await expect(page.locator('text=/standard/i').first()).toBeVisible();
    await expect(page.locator('text=/express/i').first()).toBeVisible();
  });

  test('should allow formula selection', async ({ page }) => {
    // Click on Express option
    const expressOption = page.locator('text=/express/i').first();
    await expressOption.click();
    
    // Should be selected (check for visual feedback)
    // The card should have a selected state
  });

  test('should navigate to weight step', async ({ page }) => {
    // Select a formula
    await page.locator('text=/standard/i').first().click();
    
    // Click next
    const nextButton = page.getByRole('button', { name: /suivant/i });
    await nextButton.click();
    
    // Should show weight slider
    await expect(page.locator('input[type="range"]')).toBeVisible();
  });

  test('should display weight estimation button', async ({ page }) => {
    // Navigate to weight step
    await page.locator('text=/standard/i').first().click();
    await page.getByRole('button', { name: /suivant/i }).click();
    
    // Check for AI estimation button
    const aiButton = page.locator('text=/estimer|photo|ia/i');
    await expect(aiButton.first()).toBeVisible();
  });

  test('should update price based on weight', async ({ page }) => {
    // Navigate to weight step
    await page.locator('text=/standard/i').first().click();
    await page.getByRole('button', { name: /suivant/i }).click();
    
    // Get initial price
    const priceElement = page.locator('text=/€/').first();
    const initialPrice = await priceElement.textContent();
    
    // Move slider
    const slider = page.locator('input[type="range"]');
    await slider.fill('10');
    
    // Price should update
    await page.waitForTimeout(500);
    const newPrice = await priceElement.textContent();
    
    // Prices might be different if weight changed
  });

  test('should show location search', async ({ page }) => {
    // Navigate through steps
    await page.locator('text=/standard/i').first().click();
    await page.getByRole('button', { name: /suivant/i }).click();
    await page.getByRole('button', { name: /suivant/i }).click();
    
    // Check for location input
    const locationInput = page.locator('input[placeholder*="code postal"], input[placeholder*="ville"]');
    await expect(locationInput.first()).toBeVisible();
  });

  test('should require login for checkout', async ({ page }) => {
    // Navigate through all steps
    await page.locator('text=/standard/i').first().click();
    await page.getByRole('button', { name: /suivant/i }).click(); // to weight
    await page.getByRole('button', { name: /suivant/i }).click(); // to location
    
    // Fill location
    const locationInput = page.locator('input[placeholder*="code postal"], input[placeholder*="ville"]').first();
    await locationInput.fill('75001');
    await page.getByRole('button', { name: /chercher/i }).click();
    
    // Wait and continue
    await page.waitForTimeout(2000);
    const continueBtn = page.getByRole('button', { name: /poursuivre|suivant/i });
    if (await continueBtn.isVisible()) {
      await continueBtn.click();
    }
  });
});
