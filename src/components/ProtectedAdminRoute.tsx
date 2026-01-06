import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

const ADMIN_EMAILS = [
  'admin@kilolab.fr',
  'contact@kilolab.fr',
  'akim.hachili@gmail.com'
];

export default function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdminUser, setIsAdminUser] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // 1. Vérifier si utilisateur connecté
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      setIsAuthenticated(true);

      // 2. Vérifier si admin (SIMPLIFIÉ - SANS TOUCHER user_profiles)
      const userEmail = session.user.email;
      const adminStatus = userEmail ? ADMIN_EMAILS.includes(userEmail.toLowerCase()) : false;
      
      setIsAdminUser(adminStatus);
      
    } catch (error) {
      console.error('❌ Auth check error:', error);
      setIsAuthenticated(false);
      setIsAdminUser(false);
    } finally {
      setLoading(false);
    }
  };

  // Afficher loader pendant la vérification
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4 text-teal-600" size={48} />
          <p className="text-slate-600 font-medium">Vérification des accès admin...</p>
        </div>
      </div>
    );
  }

  // Si pas connecté → Rediriger vers /admin/login
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // Si connecté mais pas admin → Rediriger vers home
  if (!isAdminUser) {
    return <Navigate to="/" replace />;
  }

  // Si tout est OK → Afficher la page
  return <>{children}</>;
}
