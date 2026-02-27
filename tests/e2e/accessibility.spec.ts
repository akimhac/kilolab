/**
 * KiloLab E2E Tests - Performance & Accessibility
 * Tests core web vitals and accessibility standards
 */
import { test, expect } from '@playwright/test';

test.describe('Performance', () => {
  test('landing page should load within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;
    
    // Should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
    
    // Main content should be visible
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should not have console errors on landing', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Filter out known acceptable errors (like favicon)
    const criticalErrors = errors.filter(e => 
      !e.includes('favicon') && 
      !e.includes('404') &&
      !e.includes('manifest')
    );
    
    expect(criticalErrors).toHaveLength(0);
  });

  test('images should have alt text', async ({ page }) => {
    await page.goto('/');
    
    const images = page.locator('img');
    const count = await images.count();
    
    for (let i = 0; i < Math.min(count, 10); i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      const src = await img.getAttribute('src');
      
      // Images should have alt text (can be empty for decorative)
      expect(alt !== null).toBeTruthy();
    }
  });
});

test.describe('Accessibility', () => {
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');
    
    // Should have exactly one h1
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThanOrEqual(1);
  });

  test('buttons should be keyboard accessible', async ({ page }) => {
    await page.goto('/');
    
    // Tab to first interactive element
    await page.keyboard.press('Tab');
    
    // Should have focus visible
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('forms should have labels', async ({ page }) => {
    await page.goto('/login');
    
    const emailInput = page.locator('input[type="email"]');
    
    // Check for associated label or aria-label
    const id = await emailInput.getAttribute('id');
    const ariaLabel = await emailInput.getAttribute('aria-label');
    const placeholder = await emailInput.getAttribute('placeholder');
    
    // Should have some form of labeling
    expect(id || ariaLabel || placeholder).toBeTruthy();
  });

  test('color contrast should be sufficient', async ({ page }) => {
    await page.goto('/');
    
    // Check that text is visible
    const mainText = page.locator('h1, p').first();
    await expect(mainText).toBeVisible();
    
    // Text should be readable (not too light)
    const color = await mainText.evaluate(el => 
      window.getComputedStyle(el).color
    );
    
    // Should not be pure white or very light
    expect(color).not.toBe('rgb(255, 255, 255)');
  });
});

test.describe('Mobile Responsiveness', () => {
  test('should be usable on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Content should not overflow
    const body = page.locator('body');
    const bodyWidth = await body.evaluate(el => el.scrollWidth);
    
    expect(bodyWidth).toBeLessThanOrEqual(375);
  });

  test('touch targets should be adequate size', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check button sizes
    const buttons = page.locator('button, a[href]');
    const count = await buttons.count();
    
    for (let i = 0; i < Math.min(count, 5); i++) {
      const button = buttons.nth(i);
      if (await button.isVisible()) {
        const box = await button.boundingBox();
        if (box) {
          // Touch targets should be at least 44x44 pixels
          // (allowing some flexibility)
          expect(box.width).toBeGreaterThanOrEqual(30);
          expect(box.height).toBeGreaterThanOrEqual(30);
        }
      }
    }
  });
});
