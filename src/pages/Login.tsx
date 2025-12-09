import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Mail, Lock, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [partnerNeedsAccount, setPartnerNeedsAccount] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPartnerNeedsAccount(false);

    const email = formData.email.trim().toLowerCase();

    try {
      // 1. Tenter la connexion
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password: formData.password
      });

      if (authError) {
        console.log('Auth error:', authError.message);
        
        // Si identifiants invalides, vérifier si c'est un partenaire sans compte
        if (authError.message.includes('Invalid login credentials')) {
          // Vérifier si l'email existe dans partners
          const { data: partner } = await supabase
            .from('partners')
            .select('id, name')
            .eq('email', email)
            .maybeSingle();

          if (partner) {
            // C'est un partenaire mais il n'a pas encore créé son compte auth
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

      // 2. Connexion réussie - Vérifier le type d'utilisateur
      const userEmail = authData.user.email?.toLowerCase();

      // Vérifier si c'est un partenaire
      const { data: partner } = await supabase
        .from('partners')
        .select('id, name, is_active, user_id')
        .eq('email', userEmail)
        .maybeSingle();

      if (partner) {
        // Lier le user_id si pas encore fait
        if (!partner.user_id) {
          await supabase
            .from('partners')
            .update({ user_id: authData.user.id })
            .eq('id', partner.id);
        }

        toast.success(`Bienvenue ${partner.name} !`);
        navigate(partner.is_active ? '/partner-dashboard' : '/partner-coming-soon');
        return;
      }

      // Vérifier le profil utilisateur
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('role, first_name')
        .eq('user_id', authData.user.id)
        .maybeSingle();

      if (profile?.role === 'admin') {
        toast.success('Bienvenue Admin !');
        navigate('/admin-dashboard');
        return;
      }

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
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-6">
            <ArrowLeft className="w-4 h-4" /> Retour
          </button>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Connexion</h1>
            <p className="text-slate-600">Accédez à votre espace Kilolab</p>
          </div>

          {/* Message pour partenaire sans compte */}
          {partnerNeedsAccount && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-800">Compte non créé</p>
                  <p className="text-sm text-amber-700 mt-1">
                    Votre pressing est enregistré mais vous devez créer un compte pour accéder à votre espace.
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
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" />Connexion...</> : 'Se connecter'}
            </button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-slate-600">
              Pas encore de compte ?{' '}
              <Link to="/signup" className="text-teal-600 font-semibold hover:underline">S'inscrire</Link>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-center text-sm text-slate-500 mb-3">Vous êtes un pressing ?</p>
            <Link to="/become-partner" className="block w-full py-3 text-center border-2 border-teal-500 text-teal-600 rounded-xl font-semibold hover:bg-teal-50 transition">
              Devenir partenaire
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
