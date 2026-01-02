import { supabase } from './supabase';

export interface AdminUser {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  last_login: string | null;
}

/**
 * Vérifie si l'utilisateur connecté est admin
 */
export const isAdmin = async (): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return false;
    
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (error || !data) return false;
    
    return true;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

/**
 * Récupère les infos de l'admin connecté
 */
export const getCurrentAdmin = async (): Promise<AdminUser | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;
    
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (error || !data) return null;
    
    // Update last_login
    await supabase
      .from('admin_users')
      .update({ last_login: new Date().toISOString() })
      .eq('user_id', user.id);
    
    return data as AdminUser;
  } catch (error) {
    console.error('Error getting current admin:', error);
    return null;
  }
};

/**
 * Déconnexion
 */
export const logoutAdmin = async (): Promise<void> => {
  await supabase.auth.signOut();
  window.location.href = '/admin/login';
};

/**
 * Hook de protection - redirige si pas admin
 */
export const requireAdmin = async (): Promise<boolean> => {
  const admin = await isAdmin();
  
  if (!admin) {
    window.location.href = '/admin/login';
    return false;
  }
  
  return true;
};
