import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface UserProfile {
  id: string;
  email: string;
  role: 'client' | 'partner';
  created_at: string;
}

interface AuthState {
  user: any | null;
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
              setState({
                user,
                profile: newProfile,
                loading: false,
                isAuthenticated: true,
                isClient: newProfile.role === 'client',
                isPartner: newProfile.role === 'partner',
              });
            }
          }
        } else if (profile && mounted) {
          setState({
            user,
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

  return state;
}