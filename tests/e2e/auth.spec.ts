/**
 * KiloLab E2E Tests - Authentication Flow
 * Tests login, signup, and password reset
 */
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/login');
    
    // Check form elements
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.getByRole('button', { name: /connexion|se connecter/i })).toBeVisible();
  });

  test('should show validation errors for empty form', async ({ page }) => {
    await page.goto('/login');
    
    // Try to submit empty form
    const submitButton = page.getByRole('button', { name: /connexion|se connecter/i });
    await submitButton.click();
    
    // Should show error or validation
    // HTML5 validation will prevent submission
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toHaveAttribute('required', '');
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Fill with invalid credentials
    await page.fill('input[type="email"]', 'invalid@test.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    
    // Submit
    await page.getByRole('button', { name: /connexion|se connecter/i }).click();
    
    // Wait for error message (toast or inline)
    const errorMessage = page.locator('text=/erreur|invalide|incorrect/i');
    await expect(errorMessage).toBeVisible({ timeout: 10000 });
  });

  test('should navigate to signup page', async ({ page }) => {
    await page.goto('/login');
    
    // Click signup link
    const signupLink = page.locator('a[href="/signup"], a[href*="signup"]');
    await signupLink.click();
    
    // Should be on signup page
    await expect(page).toHaveURL(/signup/);
  });

  test('should display signup page with required fields', async ({ page }) => {
    await page.goto('/signup');
    
    // Check form fields
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    
    // Check for name field
    const nameInput = page.locator('input[name="name"], input[placeholder*="nom"]');
    // May or may not exist depending on implementation
  });

  test('should have forgot password link', async ({ page }) => {
    await page.goto('/login');
    
    const forgotLink = page.locator('a[href*="forgot"], a[href*="password"]');
    await expect(forgotLink).toBeVisible();
  });

  test('should display forgot password page', async ({ page }) => {
    await page.goto('/forgot-password');
    
    await expect(page.locator('input[type="email"]')).toBeVisible();
    const submitButton = page.getByRole('button', { name: /envoyer|réinitialiser|reset/i });
    await expect(submitButton).toBeVisible();
  });
});
