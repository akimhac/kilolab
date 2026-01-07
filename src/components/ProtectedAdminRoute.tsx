import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';

const ADMIN_EMAILS = ['admin@kilolab.fr', 'contact@kilolab.fr', 'akim.hachili@gmail.com'];

export default function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setLoading(false);
        return;
      }

      setIsAuth(true);
      const email = session.user.email?.toLowerCase().trim() || '';
      // Vérification simple via la liste, plus besoin de fichier externe
      setIsAdmin(ADMIN_EMAILS.includes(email));
      
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-teal-600" size={48} />
      </div>
    );
  }

  if (!isAuth) return <Navigate to="/admin/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return <>{children}</>;
}
