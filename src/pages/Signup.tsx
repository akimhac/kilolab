import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Mail, Lock, User, Gift } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Signup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');

  useEffect(() => {
    // Récupérer le code parrain depuis l'URL
    const refCode = searchParams.get('ref');
    if (refCode) {
      setReferralCode(refCode);
    }
  }, [searchParams]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      // Si code parrain fourni, créer le lien
      if (referralCode && data.user) {
        const { data: referrer } = await supabase
          .from('referrals')
          .select('referrer_id')
          .eq('referral_code', referralCode.toUpperCase())
          .single();

        if (referrer) {
          await supabase.from('referrals').insert({
            referrer_id: referrer.referrer_id,
            referred_id: data.user.id,
            referral_code: referralCode.toUpperCase(),
            status: 'pending'
          });
        }
      }

      toast.success('Compte créé ! Vérifiez vos emails pour confirmer votre compte.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error: any) {
      console.error('Error:', error);
      if (error.message.includes('already registered')) {
        toast.error('Cet email est déjà utilisé');
      } else {
        toast.error('Erreur lors de la création du compte');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 transition font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour
        </button>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
              Créer un compte
            </h1>
            <p className="text-slate-600">
              Rejoignez Kilolab et simplifiez votre quotidien
            </p>
          </div>

          {referralCode && (
            <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-xl p-4 mb-6 flex items-center gap-3">
              <Gift className="w-6 h-6 text-orange-600" />
              <div>
                <p className="font-bold text-slate-900">Code parrain détecté !</p>
                <p className="text-sm text-slate-600">
                  Vous recevrez 10€ après votre 1ère commande 🎉
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-slate-300 rounded-xl focus:border-blue-600 focus:outline-none transition"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Mot de passe *
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-slate-300 rounded-xl focus:border-blue-600 focus:outline-none transition"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Confirmer le mot de passe *
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-slate-300 rounded-xl focus:border-blue-600 focus:outline-none transition"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Code parrain (optionnel)
              </label>
              <div className="relative">
                <Gift className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                  className="w-full pl-12 pr-4 py-3 border-2 border-slate-300 rounded-xl focus:border-blue-600 focus:outline-none transition uppercase"
                  placeholder="XXXXXXXX"
                  maxLength={8}
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Vous avez un code ? Gagnez 10€ sur votre 1ère commande !
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Création...
                </div>
              ) : (
                'Créer mon compte'
              )}
            </button>
          </form>

          <p className="text-center text-slate-600 mt-6">
            Déjà un compte ?{' '}
            <Link to="/login" className="text-blue-600 font-bold hover:underline">
              Se connecter
            </Link>
          </p>

          <p className="text-xs text-slate-500 text-center mt-6">
            En créant un compte, vous acceptez nos{' '}
            <button onClick={() => navigate('/legal/cgu')} className="text-blue-600 hover:underline">
              CGU
            </button>
            {' '}et notre{' '}
            <button onClick={() => navigate('/legal/privacy')} className="text-blue-600 hover:underline">
              Politique de confidentialité
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
