import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'partner' | 'client';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setLoading(false);
      return;
    }

    setUser(user);

    if (requiredRole) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('role, is_admin')
        .eq('id', user.id)
        .single();

      if (profile) {
        // Si admin requis, vérifier is_admin
        if (requiredRole === 'admin' && !profile.is_admin) {
          setLoading(false);
          return;
        }
        
        // Sinon vérifier le rôle
        if (requiredRole !== 'admin' && profile.role !== requiredRole) {
          setLoading(false);
          return;
        }

        setUserRole(profile.role);
      }
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-teal-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole === 'admin' && userRole !== 'admin') {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && requiredRole !== 'admin' && userRole !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
