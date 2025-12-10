import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Loader2, LogIn, Shield, Key } from 'lucide-react';
import toast from 'react-hot-toast';

// Configuration admin
const ADMIN_EMAILS = ['akim.hachili@gmail.com', 'contact@kilolab.fr', 'admin@kilolab.fr'];
const ADMIN_SECRET_CODE = 'KILO2025ADMIN';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Modal admin
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminForm, setAdminForm] = useState({ email: '', password: '', code: '' });
  const [adminError, setAdminError] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);

  const from = location.state?.from || '/';

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        redirectUser(session.user.email);
      }
    });
  }, []);

  const redirectUser = async (email: string | undefined) => {
    if (!email) return;
    const lowerEmail = email.toLowerCase();

    // Vérifier si partenaire
    const { data: partnerData } = await supabase
      .from('partners')
      .select('id, is_active')
      .eq('email', lowerEmail)
      .maybeSingle();

    if (partnerData) {
      if (partnerData.is_active) {
        navigate('/partner-dashboard');
      } else {
        // Partenaire en attente de validation
        navigate('/partner-pending');
      }
      return;
    }

    // Client normal
    navigate(from === '/' ? '/client-dashboard' : from);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setErrors({ email: 'Email ou mot de passe incorrect' });
          toast.error('Email ou mot de passe incorrect');
        } else if (error.message.includes('Email not confirmed')) {
          toast.error('Veuillez confirmer votre email avant de vous connecter');
        } else {
          toast.error(error.message || 'Erreur de connexion');
        }
        return;
      }

      if (!data.user) {
        toast.error('Erreur de connexion');
        return;
      }

      toast.success('Connexion réussie !');
      await redirectUser(data.user.email);

    } catch (error: any) {
      console.error('Erreur:', error);
      toast.error('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  // Connexion admin avec code secret
  const handleAdminLogin = async () => {
    setAdminError('');
    setAdminLoading(true);

    const email = adminForm.email.trim().toLowerCase();

    if (adminForm.code !== ADMIN_SECRET_CODE) {
      setAdminError('Code d\'accès incorrect');
      setAdminLoading(false);
      return;
    }

    if (!ADMIN_EMAILS.map(e => e.toLowerCase()).includes(email)) {
      setAdminError('Email non autorisé pour l\'accès admin');
      setAdminLoading(false);
      return;
    }

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password: adminForm.password
      });

      if (authError) {
        setAdminError('Email ou mot de passe incorrect');
        setAdminLoading(false);
        return;
      }

      if (!authData.user) {
        setAdminError('Erreur de connexion');
        setAdminLoading(false);
        return;
      }

      toast.success('Bienvenue Admin !');
      setShowAdminModal(false);
      navigate('/admin-dashboard');

    } catch (err) {
      setAdminError('Une erreur est survenue');
    } finally {
      setAdminLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full">
        {/* Header */}
        <div className="mb-8">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-teal-600 hover:text-teal-700 transition mb-6">
            <ArrowLeft className="w-5 h-5" /> Retour
          </button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Connexion</h1>
            <p className="text-slate-600">Accédez à votre espace Kilolab</p>
          </div>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="votre@email.com"
                className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition ${
                  errors.email ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-teal-500'
                }`}
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none transition"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-teal-600 text-white rounded-xl font-bold text-lg hover:bg-teal-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 className="w-5 h-5 animate-spin" />Connexion...</> : <><LogIn className="w-5 h-5" />Se connecter</>}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-slate-600">
            Pas encore de compte ?{' '}
            <Link to="/signup" className="text-teal-600 font-semibold hover:underline">S'inscrire</Link>
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
          <Link to="/become-partner" className="block w-full py-3 text-center border-2 border-teal-500 text-teal-600 rounded-xl font-semibold hover:bg-teal-50 transition">
            Devenir partenaire pressing
          </Link>
          
          <button
            onClick={() => setShowAdminModal(true)}
            className="w-full py-3 text-center bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition flex items-center justify-center gap-2"
          >
            <Shield className="w-4 h-4" /> Espace Administrateur
          </button>
        </div>
      </div>

      {/* MODAL ADMIN */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Key className="w-8 h-8 text-teal-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Accès Administrateur</h2>
              <p className="text-slate-600 text-sm mt-2">Connexion sécurisée réservée aux admins</p>
            </div>

            {adminError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm text-center">{adminError}</div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email admin</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    value={adminForm.email}
                    onChange={(e) => setAdminForm({...adminForm, email: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-500"
                    placeholder="admin@kilolab.fr"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    value={adminForm.password}
                    onChange={(e) => setAdminForm({...adminForm, password: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Code secret</label>
                <input
                  type="password"
                  value={adminForm.code}
                  onChange={(e) => setAdminForm({...adminForm, code: e.target.value.toUpperCase()})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-500 text-center text-lg tracking-widest font-mono"
                  placeholder="CODE SECRET"
                />
              </div>

              <button
                onClick={handleAdminLogin}
                disabled={adminLoading}
                className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {adminLoading ? <><Loader2 className="w-5 h-5 animate-spin" />Vérification...</> : 'Accéder au Dashboard'}
              </button>

              <button
                onClick={() => { setShowAdminModal(false); setAdminForm({ email: '', password: '', code: '' }); setAdminError(''); }}
                className="w-full py-3 text-slate-600 hover:text-slate-900 transition text-sm"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
