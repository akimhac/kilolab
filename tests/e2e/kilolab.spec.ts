import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('should load with hero section and translations', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Navbar visible with logo
    await expect(page.locator('[data-testid="logo"]')).toBeVisible();
    await expect(page.locator('[data-testid="logo"]')).toContainText('Kilolab');

    // Hero section
    await expect(page.locator('h1')).toContainText('Libérez votre temps');

    // Trust badges
    await expect(page.locator('[data-testid="trust-badge"]')).toBeVisible();

    // CTA buttons
    await expect(page.locator('[data-testid="cta-primary"]')).toBeVisible();
    await expect(page.locator('[data-testid="cta-secondary"]')).toBeVisible();
  });

  test('should have working navigation links', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Click Tarifs link
    await page.locator('[data-testid="nav-tarifs"]').click();
    await expect(page).toHaveURL('/tarifs');

    // Click FAQ link
    await page.goBack();
    await page.locator('[data-testid="nav-faq"]').click();
    await expect(page).toHaveURL('/faq');
  });

  test('should display cost comparison with interactive slider', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Scroll to cost comparison
    const slider = page.locator('[data-testid="weight-slider"]');
    await slider.scrollIntoViewIfNeeded();
    await expect(slider).toBeVisible();
  });

  test('should display embedded video section', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Scroll down to find video section
    const videoIframe = page.locator('iframe[title*="Kilolab"]');
    await videoIframe.scrollIntoViewIfNeeded();
    await expect(videoIframe).toBeVisible();
  });

  test('should display footer with translated content', async ({ page }) => {
    await page.goto('/');

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);

    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    await expect(footer).toContainText('Kilolab');
  });
});

test.describe('BecomeWasher Page', () => {
  test('should load with immersive hero', async ({ page }) => {
    await page.goto('/become-washer');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('[data-testid="washer-hero-title"]')).toBeVisible();
    await expect(page.locator('[data-testid="washer-hero-title"]')).toContainText('Votre machine tourne');

    // CTA buttons
    await expect(page.locator('[data-testid="cta-inscription"]')).toBeVisible();
  });

  test('should have working earnings simulator', async ({ page }) => {
    await page.goto('/become-washer');
    await page.waitForLoadState('networkidle');

    const slider = page.locator('[data-testid="simulator-slider"]');
    await slider.scrollIntoViewIfNeeded();
    await expect(slider).toBeVisible();
  });

  test('should open registration form on CTA click', async ({ page }) => {
    await page.goto('/become-washer');
    await page.waitForLoadState('networkidle');

    await page.locator('[data-testid="cta-inscription"]').click();
    await page.waitForTimeout(500);

    // Form step 1 should be visible
    await expect(page.locator('text=Vos informations')).toBeVisible();
    await expect(page.locator('input[placeholder="Thomas Dupont"]')).toBeVisible();
  });

  test('should show live counter', async ({ page }) => {
    await page.goto('/become-washer');
    await page.waitForLoadState('networkidle');

    // Scroll past hero to see the live counter
    await page.evaluate(() => window.scrollTo(0, window.innerHeight + 100));
    await page.waitForTimeout(500);

    await expect(page.locator('text=se sont inscrits aujourd')).toBeVisible();
  });
});

test.describe('Login Page', () => {
  test('should display translated login form', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('text=Connexion').first()).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });
});

test.describe('Other Pages', () => {
  test('FAQ page loads', async ({ page }) => {
    await page.goto('/faq');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1, h2').first()).toBeVisible();
    await expect(page.locator('[data-testid="logo"]')).toBeVisible();
  });

  test('Contact page loads', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('Tarifs page loads', async ({ page }) => {
    await page.goto('/tarifs');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('Settings page loads', async ({ page }) => {
    await page.goto('/settings');
    await page.waitForLoadState('networkidle');
    // Settings requires auth - will show loading or redirect, just check page doesn't crash
    await expect(page.locator('[data-testid="logo"]')).toBeVisible();
  });

  test('GPS Navigation page loads', async ({ page }) => {
    await page.goto('/washer-gps');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=Navigation GPS')).toBeVisible();
    await expect(page.locator('text=Lancer le GPS')).toBeVisible();
  });
});

test.describe('Mobile Responsive', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('landing page mobile: hamburger menu visible', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Hamburger should be visible on mobile
    await expect(page.locator('[data-testid="mobile-menu-btn"]')).toBeVisible();

    // Desktop nav should be hidden
    await expect(page.locator('[data-testid="nav-tarifs"]')).not.toBeVisible();
  });

  test('landing page mobile: menu opens on click', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.locator('[data-testid="mobile-menu-btn"]').click();
    await page.waitForTimeout(500);

    // Mobile menu should show links (check the mobile menu container)
    const mobileMenu = page.locator('.lg\\:hidden >> text=Tarifs');
    await expect(mobileMenu).toBeVisible();
  });

  test('become-washer mobile: hero displays correctly', async ({ page }) => {
    await page.goto('/become-washer');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('[data-testid="washer-hero-title"]')).toBeVisible();
    await expect(page.locator('[data-testid="cta-inscription"]')).toBeVisible();
  });
});
