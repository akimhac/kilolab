import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isPartner: boolean;
  partnerData: any | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isPartner: false,
  partnerData: null,
  signOut: async () => {}
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPartner, setIsPartner] = useState(false);
  const [partnerData, setPartnerData] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        checkPartnerStatus(session.user.email);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        checkPartnerStatus(session.user.email);
      } else {
        setIsPartner(false);
        setPartnerData(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkPartnerStatus = async (email: string | undefined) => {
    if (!email) return;
    const { data: partner } = await supabase
      .from('partners')
      .select('*')
      .eq('email', email.toLowerCase())
      .maybeSingle();
    if (partner) {
      setIsPartner(true);
      setPartnerData(partner);
    } else {
      setIsPartner(false);
      setPartnerData(null);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setIsPartner(false);
    setPartnerData(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, isPartner, partnerData, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
