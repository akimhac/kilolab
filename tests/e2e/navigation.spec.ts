/**
 * KiloLab E2E Tests - Navigation & Routing
 * Tests all major routes and navigation
 */
import { test, expect } from '@playwright/test';

const publicRoutes = [
  { path: '/', title: 'Landing' },
  { path: '/login', title: 'Login' },
  { path: '/signup', title: 'Signup' },
  { path: '/tarifs', title: 'Tarifs' },
  { path: '/faq', title: 'FAQ' },
  { path: '/contact', title: 'Contact' },
  { path: '/washers', title: 'Become Washer' },
  { path: '/partner', title: 'Partner Landing' },
  { path: '/cgu', title: 'CGU' },
  { path: '/cgv', title: 'CGV' },
  { path: '/privacy', title: 'Privacy' },
  { path: '/cookies', title: 'Cookies' },
];

test.describe('Public Routes', () => {
  for (const route of publicRoutes) {
    test(`should load ${route.title} page (${route.path})`, async ({ page }) => {
      const response = await page.goto(route.path);
      
      // Should not return 404 or error
      expect(response?.status()).toBeLessThan(400);
      
      // Page should have content
      await expect(page.locator('body')).not.toBeEmpty();
    });
  }
});

test.describe('Protected Routes Redirect', () => {
  const protectedRoutes = [
    '/dashboard',
    '/client-dashboard',
    '/washer-dashboard',
    '/partner-dashboard',
    '/settings',
    '/user-profile',
  ];

  for (const route of protectedRoutes) {
    test(`should redirect ${route} to login`, async ({ page }) => {
      await page.goto(route);
      
      // Should redirect to login or show login modal
      await page.waitForTimeout(2000);
      
      // Either redirected to login or shows auth prompt
      const currentUrl = page.url();
      const hasLoginForm = await page.locator('input[type="email"]').isVisible();
      
      expect(currentUrl.includes('login') || hasLoginForm).toBeTruthy();
    });
  }
});

test.describe('404 Page', () => {
  test('should display 404 for unknown routes', async ({ page }) => {
    await page.goto('/this-route-does-not-exist-12345');
    
    // Should show 404 content
    const notFoundText = page.locator('text=/404|page.*introuvable|not found/i');
    await expect(notFoundText.first()).toBeVisible();
  });
});

test.describe('Navigation Links', () => {
  test('should navigate from landing to login', async ({ page }) => {
    await page.goto('/');
    
    const loginLink = page.locator('a[href="/login"]').first();
    await loginLink.click();
    
    await expect(page).toHaveURL(/login/);
  });

  test('should navigate from landing to pricing', async ({ page }) => {
    await page.goto('/');
    
    const pricingLink = page.locator('a[href="/tarifs"]');
    if (await pricingLink.isVisible()) {
      await pricingLink.click();
      await expect(page).toHaveURL(/tarifs/);
    }
  });

  test('should navigate from landing to new order', async ({ page }) => {
    await page.goto('/');
    
    const orderButton = page.locator('a[href="/new-order"]').first();
    if (await orderButton.isVisible()) {
      await orderButton.click();
      await expect(page).toHaveURL(/new-order/);
    }
  });
});
