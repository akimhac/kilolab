import { supabase } from './supabase';
const ADMIN_EMAILS = ['admin@kilolab.fr', 'contact@kilolab.fr', 'akim.hachili@gmail.com'];

export const isAdmin = async (): Promise<boolean> => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user?.email) return false;
  return ADMIN_EMAILS.includes(session.user.email.toLowerCase().trim());
};

export const requireAdmin = async (): Promise<boolean> => {
  const admin = await isAdmin();
  if (!admin) { window.location.href = '/admin/login'; return false; }
  return true;
};
