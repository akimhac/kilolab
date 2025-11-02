import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface UserProfile {
  id: string;
  email: string;
  role: 'client' | 'partner';
  full_name?: string;
  created_at: string;
}

interface User extends UserProfile {
  role: 'client' | 'partner';
  full_name?: string;
}

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  isClient: boolean;
  isPartner: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
    isAuthenticated: false,
    isClient: false,
    isPartner: false,
  });

  useEffect(() => {
    let mounted = true;
    let isLoadingProfile = false;

    async function loadProfile(user: any) {
      if (isLoadingProfile) return;
      isLoadingProfile = true;

      try {
        const { data: profile, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('email', user.email)
          .single();

        if (error) {
          console.error('Profile load error:', error);
          
          // Si le profil n'existe pas, créer un profil par défaut
          if (error.code === 'PGRST116') {
            const { data: newProfile, error: createError } = await supabase
              .from('user_profiles')
              .insert({
                id: user.id,
                email: user.email,
                role: 'client'
              })
              .select()
              .single();

            if (!createError && newProfile && mounted) {
              const mergedUser: User = {
                ...user,
                ...newProfile,
              };
              setState({
                user: mergedUser,
                profile: newProfile,
                loading: false,
                isAuthenticated: true,
                isClient: newProfile.role === 'client',
                isPartner: newProfile.role === 'partner',
              });
            }
          }
        } else if (profile && mounted) {
          const mergedUser: User = {
            ...user,
            ...profile,
          };
          setState({
            user: mergedUser,
            profile,
            loading: false,
            isAuthenticated: true,
            isClient: profile.role === 'client',
            isPartner: profile.role === 'partner',
          });
        }
      } catch (err) {
        console.error('Error in loadProfile:', err);
      } finally {
        isLoadingProfile = false;
      }
    }

    async function getInitialSession() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          if (mounted) {
            setState({
              user: null,
              profile: null,
              loading: false,
              isAuthenticated: false,
              isClient: false,
              isPartner: false,
            });
          }
          return;
        }

        if (session?.user && mounted) {
          await loadProfile(session.user);
        } else if (mounted) {
          setState({
            user: null,
            profile: null,
            loading: false,
            isAuthenticated: false,
            isClient: false,
            isPartner: false,
          });
        }
      } catch (err) {
        console.error('Error getting session:', err);
        if (mounted) {
          setState(prev => ({ ...prev, loading: false }));
        }
      }
    }

    // Charger la session initiale
    getInitialSession();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        if (session?.user) {
          await loadProfile(session.user);
        } else {
          setState({
            user: null,
            profile: null,
            loading: false,
            isAuthenticated: false,
            isClient: false,
            isPartner: false,
          });
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []); // Dépendances vides = exécution une seule fois

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setState({
        user: null,
        profile: null,
        loading: false,
        isAuthenticated: false,
        isClient: false,
        isPartner: false,
      });
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role: 'client' | 'partner') => {
    try {
      // 1. Créer l'utilisateur avec Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Erreur lors de la création du compte');

      // 2. Créer le profil utilisateur
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: authData.user.id,
          email,
          full_name: fullName,
          role,
        });

      if (profileError) throw profileError;

      return authData.user;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  return { ...state, signOut, signUp };
}