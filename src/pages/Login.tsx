import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Mail, Lock, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [partnerNeedsAccount, setPartnerNeedsAccount] = useState(false);

  // Vérifier si déjà connecté
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        redirectUser(session.user.email);
      }
    });
  }, []);

  const redirectUser = async (email: string | undefined) => {
    if (!email) return;

    // Vérifier si partenaire
    const { data: partner } = await supabase
      .from('partners')
      .select('id, is_active')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (partner) {
      if (partner.is_active) {
        navigate('/partner-dashboard');
      } else {
        navigate('/partner-coming-soon');
      }
      return;
    }

    // Vérifier si admin
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profile?.role === 'admin') {
        navigate('/admin-dashboard');
        return;
      }
    }

    // Client par défaut
    navigate('/client-dashboard');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPartnerNeedsAccount(false);

    const email = formData.email.trim().toLowerCase();

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password: formData.password
      });

      if (authError) {
        if (authError.message.includes('Invalid login credentials')) {
          // Vérifier si c'est un partenaire sans compte
          const { data: partner } = await supabase
            .from('partners')
            .select('id, name')
            .eq('email', email)
            .maybeSingle();

          if (partner) {
            setPartnerNeedsAccount(true);
            toast.error(`Le pressing "${partner.name}" doit d'abord créer un compte.`);
          } else {
            toast.error('Email ou mot de passe incorrect');
          }
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

      toast.success('Connexion réussie !');
      await redirectUser(authData.user.email);

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
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-6">
            <ArrowLeft className="w-4 h-4" /> Retour
          </button>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Connexion</h1>
            <p className="text-slate-600">Accédez à votre espace Kilolab</p>
          </div>

          {partnerNeedsAccount && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-800">Compte non créé</p>
                  <p className="text-sm text-amber-700 mt-1">
                    Votre pressing est enregistré mais vous devez créer un compte.
                  </p>
                  <Link to="/signup" className="inline-block mt-2 text-sm font-semibold text-amber-700 hover:text-amber-800 underline">
                    Créer mon compte →
                  </Link>
                </div>
              </div>
            </div>
          )}

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
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500"
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
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full py-4 bg-teal-600 text-white rounded-xl font-bold text-lg hover:bg-teal-700 transition disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" />Connexion...</> : 'Se connecter'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-600">
              Pas encore de compte ?{' '}
              <Link to="/signup" className="text-teal-600 font-semibold hover:underline">S'inscrire</Link>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100">
            <Link to="/become-partner" className="block w-full py-3 text-center border-2 border-teal-500 text-teal-600 rounded-xl font-semibold hover:bg-teal-50 transition">
              Devenir partenaire pressing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
