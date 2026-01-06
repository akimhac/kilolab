import { supabase } from './supabase';

// 👇 LA LISTE DE SÉCURITÉ (Indispensable pour contourner le bug BDD)
const ADMIN_EMAILS = ['admin@kilolab.fr', 'contact@kilolab.fr', 'akim.hachili@gmail.com'];

export interface AdminUser {
  id: string;
  email: string;
  full_name: string | null;
  last_login?: string;
}

/**
 * Vérifie si l'utilisateur connecté est admin (SANS BASE DE DONNÉES)
 */
export const isAdmin = async (): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user?.email) return false;
    
    // Vérification via la liste en dur
    return ADMIN_EMAILS.includes(session.user.email.toLowerCase());
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

/**
 * Récupère les infos de l'admin (SIMULÉ POUR ÉVITER LE CRASH)
 */
export const getCurrentAdmin = async (): Promise<AdminUser | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user || !user.email) return null;
    
    // Vérification liste
    if (!ADMIN_EMAILS.includes(user.email.toLowerCase())) return null;
    
    // On retourne un objet admin "virtuel"
    return {
      id: user.id,
      user_id: user.id,
      email: user.email,
      full_name: 'Super Admin',
      last_login: new Date().toISOString()
    } as any;
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
 * Hook de protection
 */
export const requireAdmin = async (): Promise<boolean> => {
  const admin = await isAdmin();
  
  if (!admin) {
    window.location.href = '/admin/login';
    return false;
  }
  
  return true;
};
