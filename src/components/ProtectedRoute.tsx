import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireRole?: 'client' | 'partner';
}

export default function ProtectedRoute({ children, requireRole }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  console.log('ProtectedRoute - Loading:', loading, 'User:', user?.email, 'Role:', user?.role);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <Loader className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-white text-xl">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('No user, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (requireRole && user.role !== requireRole) {
    console.log(`Wrong role: ${user.role}, required: ${requireRole}`);
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}