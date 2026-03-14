// Admin configuration - centralized
// IMPORTANT: In production, use environment variables for sensitive data

// Admin emails authorized to access the admin dashboard
// Add VITE_ADMIN_EMAILS in .env for production (comma-separated)
const envAdmins = import.meta.env.VITE_ADMIN_EMAILS?.split(',').map((e: string) => e.trim().toLowerCase()) || [];

export const ADMIN_EMAILS: string[] = [
  'admin@kilolab.fr',
  'contact@kilolab.fr',
  ...envAdmins
].filter(Boolean);

export const isAdminEmail = (email: string | null | undefined): boolean => {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
};
