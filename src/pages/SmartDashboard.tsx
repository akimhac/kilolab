import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';

export default function SmartDashboard() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const detectRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/select-dashboard', { replace: true });
          return;
        }

        // Check if user is admin
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();

        if (profile?.role === 'admin') {
          navigate('/admin-dashboard', { replace: true });
          return;
        }

        // Check if user is a washer
        const { data: washer } = await supabase
          .from('washers')
          .select('id, status')
          .eq('user_id', user.id)
          .maybeSingle();

        if (washer) {
          navigate('/washer-dashboard', { replace: true });
          return;
        }

        // Check if user is a partner
        const { data: partner } = await supabase
          .from('partners')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (partner) {
          navigate('/partner-dashboard', { replace: true });
          return;
        }

        // Default: client dashboard
        navigate('/client-dashboard', { replace: true });
      } catch {
        navigate('/client-dashboard', { replace: true });
      } finally {
        setChecking(false);
      }
    };

    detectRole();
  }, [navigate]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4 text-teal-600" size={48} />
          <p className="text-slate-600 font-medium">Redirection...</p>
        </div>
      </div>
    );
  }

  return null;
}
