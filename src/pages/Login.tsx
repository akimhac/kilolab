import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Mail, Lock, ArrowLeft, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Connexion
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      });

      if (authError) {
        if (authError.message.includes('Invalid login')) {
          toast.error('Email ou mot de passe incorrect');
        } else {
          toast.error(authError.message);
        }
        setLoading(false);
        return;
      }

      if (!authData.user) {
        toast.error('Erreur de connexion');
        setLoading(false);
        return;
      }

      const userEmail = authData.user.email?.toLowerCase();

      // 2. Vérifier si c'est un partenaire
      const { data: partner } = await supabase
        .from('partners')
        .select('id, name, is_active, user_id')
        .eq('email', userEmail)
        .single();

      if (partner) {
        // Si le user_id n'est pas encore lié, le faire maintenant
        if (!partner.user_id) {
          await supabase
            .from('partners')
            .update({ user_id: authData.user.id })
            .eq('id', partner.id);
        }

        toast.success(`Bienvenue ${partner.name} !`);
        
        if (partner.is_active) {
          navigate('/partner-dashboard');
        } else {
          navigate('/partner-coming-soon');
        }
        return;
      }

      // 3. Vérifier si c'est un admin
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('role, first_name')
        .eq('user_id', authData.user.id)
        .single();

      if (profile?.role === 'admin') {
        toast.success(`Bienvenue Admin !`);
        navigate('/admin-dashboard');
        return;
      }

      // 4. Sinon c'est un client
      toast.success(`Bienvenue ${profile?.first_name || ''} !`);
      navigate('/client-dashboard');

    } catch (err: any) {
      console.error('Erreur:', err);
      toast.error('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Retour
          </button>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Connexion</h1>
            <p className="text-slate-600">Accédez à votre espace Kilolab</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="votre@email.fr"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-teal-600 text-white rounded-xl font-bold text-lg hover:bg-teal-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Connexion...
                </>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <Link to="/forgot-password" className="text-sm text-teal-600 hover:underline block">
              Mot de passe oublié ?
            </Link>
            <p className="text-slate-600">
              Pas encore de compte ?{' '}
              <Link to="/signup" className="text-teal-600 font-semibold hover:underline">
                S'inscrire
              </Link>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-center text-sm text-slate-500 mb-3">Vous êtes un pressing ?</p>
            <Link 
              to="/become-partner"
              className="block w-full py-3 text-center border-2 border-teal-500 text-teal-600 rounded-xl font-semibold hover:bg-teal-50 transition"
            >
              Devenir partenaire
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
