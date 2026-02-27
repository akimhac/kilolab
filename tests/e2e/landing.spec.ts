/**
 * KiloLab E2E Tests - Landing Page
 * Tests the main landing page functionality
 */
import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display hero section with CTA', async ({ page }) => {
    // Check hero title
    await expect(page.locator('h1')).toBeVisible();
    
    // Check CTA button exists
    const ctaButton = page.getByRole('button', { name: /commander|commencer/i });
    await expect(ctaButton.first()).toBeVisible();
  });

  test('should have working navigation', async ({ page }) => {
    // Check navbar is present
    const navbar = page.locator('nav');
    await expect(navbar).toBeVisible();

    // Check logo link
    const logo = page.locator('a[href="/"]').first();
    await expect(logo).toBeVisible();
  });

  test('should display pricing section', async ({ page }) => {
    // Scroll to pricing or check if visible
    const pricingSection = page.locator('text=/tarif|prix|€/i').first();
    await expect(pricingSection).toBeVisible();
  });

  test('should have footer with links', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();

    // Check legal links
    await expect(page.locator('a[href="/cgu"]')).toBeVisible();
    await expect(page.locator('a[href="/privacy"]')).toBeVisible();
  });

  test('should be responsive', async ({ page }) => {
    // Test at mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Hero should still be visible
    await expect(page.locator('h1')).toBeVisible();
    
    // Navigation might be collapsed to hamburger
    const mobileMenu = page.locator('[data-testid="mobile-menu"], button[aria-label*="menu"]');
    // Either menu button or nav links should be visible
  });
});
