import { supabase } from './supabase';

// 👇 LISTE DE SÉCURITÉ : Seuls ces emails peuvent entrer.
const ADMIN_EMAILS = ['admin@kilolab.fr', 'contact@kilolab.fr', 'akim.hachili@gmail.com'];

export interface AdminUser {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  last_login: string | null;
}

/**
 * Vérifie si l'utilisateur connecté est admin (SANS BASE DE DONNÉES)
 */
export const isAdmin = async (): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    // Si pas connecté ou pas d'email -> Dehors
    if (!session?.user?.email) return false;
    
    // Vérification simple : est-ce que l'email est dans la liste ?
    const email = session.user.email.toLowerCase().trim();
    return ADMIN_EMAILS.includes(email);

  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

/**
 * Récupère les infos de l'admin (SIMULÉ POUR ÉVITER LE CRASH BDD)
 */
export const getCurrentAdmin = async (): Promise<AdminUser | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user || !user.email) return null;
    
    // Vérification de sécurité
    if (!ADMIN_EMAILS.includes(user.email.toLowerCase().trim())) return null;
    
    // On renvoie un "faux" objet admin valide pour que le dashboard s'affiche
    return {
      id: user.id,
      user_id: user.id,
      email: user.email,
      full_name: 'Super Admin',
      created_at: new Date().toISOString(),
      last_login: new Date().toISOString()
    };

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
