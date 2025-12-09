import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Mail, Lock, ArrowLeft, Loader2, AlertCircle, Shield, Key } from 'lucide-react';
import toast from 'react-hot-toast';

// Configuration admin sécurisée
const ADMIN_EMAIL = 'akim.hachili@gmail.com';
const ADMIN_SECRET_CODE = 'KILO2025ADMIN'; // Code secret à changer

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [partnerNeedsAccount, setPartnerNeedsAccount] = useState(false);
  
  // État pour le modal admin
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  const [adminError, setAdminError] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) redirectUser(session.user.email);
    });
  }, []);

  const redirectUser = async (email: string | undefined) => {
    if (!email) return;
    const lowerEmail = email.toLowerCase();

    // Vérifier si partenaire
    const { data: partner } = await supabase
      .from('partners')
      .select('id, is_active')
      .eq('email', lowerEmail)
      .maybeSingle();

    if (partner) {
      navigate(partner.is_active ? '/partner-dashboard' : '/partner-coming-soon');
      return;
    }

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

    } catch (err) {
      toast.error('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  // Vérification du code admin
  const handleAdminAccess = async () => {
    setAdminError('');
    
    // Vérifier le code secret
    if (adminCode !== ADMIN_SECRET_CODE) {
      setAdminError('Code incorrect');
      return;
    }

    // Vérifier que l'utilisateur est connecté avec le bon email
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      setAdminError('Vous devez d\'abord vous connecter');
      return;
    }

    if (session.user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      setAdminError('Accès non autorisé pour cet email');
      return;
    }

    // Accès autorisé !
    toast.success('Bienvenue Admin !');
    setShowAdminModal(false);
    navigate('/admin-dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-500 hover:text-slate-700">
              <ArrowLeft className="w-4 h-4" /> Retour
            </button>
            <span className="text-xl font-bold text-teal-600">Kilolab</span>
          </div>

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
                  <p className="text-sm text-amber-700 mt-1">Votre pressing est enregistré mais vous devez créer un compte.</p>
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
            
            {/* BOUTON ADMIN */}
            <button
              onClick={() => setShowAdminModal(true)}
              className="w-full py-3 text-center bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4" />
              Espace Administrateur
            </button>
          </div>
        </div>
      </div>

      {/* MODAL ADMIN */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Key className="w-8 h-8 text-teal-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Accès Administrateur</h2>
              <p className="text-slate-600 text-sm mt-2">Entrez le code secret pour accéder au dashboard</p>
            </div>

            {adminError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm text-center">
                {adminError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Code d'accès</label>
                <input
                  type="password"
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-500 focus:border-transparent text-center text-lg tracking-widest font-mono"
                  placeholder="••••••••••••"
                  autoFocus
                />
              </div>

              <button
                onClick={handleAdminAccess}
                className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition"
              >
                Vérifier et accéder
              </button>

              <button
                onClick={() => {
                  setShowAdminModal(false);
                  setAdminCode('');
                  setAdminError('');
                }}
                className="w-full py-3 text-slate-600 hover:text-slate-900 transition text-sm"
              >
                Annuler
              </button>
            </div>

            <p className="text-xs text-slate-400 text-center mt-6">
              Connectez-vous d'abord avec votre compte admin, puis entrez le code.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
