// src/pages/Signup.tsx
// Page d'inscription corrigée avec gestion d'erreurs améliorée

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Mail, Lock, User, Gift, Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    referralCode: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Nom
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    // Mot de passe
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Minimum 6 caractères';
    }

    // Confirmation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Veuillez corriger les erreurs');
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // 1. Créer le compte
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        options: {
          data: {
            name: formData.name.trim(),
            user_type: 'client'
          },
          emailRedirectTo: `${window.location.origin}/client-dashboard`
        }
      });

      if (authError) {
        console.error('Erreur auth:', authError);
        
        // Messages d'erreur personnalisés
        if (authError.message.includes('already registered')) {
          setErrors({ email: 'Cet email est déjà utilisé' });
          toast.error('Cet email est déjà utilisé');
        } else if (authError.message.includes('invalid')) {
          setErrors({ email: 'Email invalide' });
          toast.error('Email invalide');
        } else if (authError.message.includes('password')) {
          setErrors({ password: 'Mot de passe trop faible' });
          toast.error('Mot de passe trop faible (min 6 caractères)');
        } else {
          toast.error(authError.message || 'Erreur lors de l\'inscription');
        }
        return;
      }

      if (!authData.user) {
        toast.error('Erreur lors de la création du compte');
        return;
      }

      // 2. Si code parrain fourni, l'enregistrer
      if (formData.referralCode.trim()) {
        try {
          const { data: referral } = await supabase
            .from('referrals')
            .select('*')
            .eq('referral_code', formData.referralCode.trim().toUpperCase())
            .single();

          if (referral) {
            await supabase
              .from('referrals')
              .update({ 
                referred_id: authData.user.id,
                status: 'validated'
              })
              .eq('id', referral.id);
          }
        } catch (refError) {
          console.log('Code parrain non trouvé ou erreur:', refError);
          // On continue quand même, ce n'est pas bloquant
        }
      }

      // 3. Succès !
      setSuccess(true);
      toast.success('Compte créé avec succès !');

      // 4. Vérifier si confirmation email requise
      if (authData.user && !authData.session) {
        // Email de confirmation envoyé
        toast.success('Vérifiez votre email pour confirmer votre compte');
      } else if (authData.session) {
        // Connexion directe (si email non requis)
        setTimeout(() => {
          navigate('/client-dashboard');
        }, 2000);
      }

    } catch (error: any) {
      console.error('Erreur inscription:', error);
      toast.error('Une erreur est survenue. Réessayez.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-4">
            Compte créé avec succès ! 🎉
          </h1>
          <p className="text-slate-600 mb-6">
            Vérifiez votre boîte email pour confirmer votre compte.
            <br />
            <span className="text-sm text-slate-500">(Pensez à vérifier les spams)</span>
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/login')}
              className="w-full py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition"
            >
              Se connecter
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour
          </button>
          
          <h1 className="text-2xl font-bold text-purple-600 mb-2">
            Créer un compte
          </h1>
          <p className="text-slate-600">
            Rejoignez Kilolab et simplifiez votre quotidien
          </p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nom */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nom complet *
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Jean Dupont"
                className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition ${
                  errors.name 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-slate-200 focus:border-purple-500'
                }`}
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email *
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="jean@exemple.com"
                className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition ${
                  errors.email 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-slate-200 focus:border-purple-500'
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Mot de passe */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Mot de passe *
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none transition ${
                  errors.password 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-slate-200 focus:border-purple-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirmer mot de passe */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Confirmer le mot de passe *
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="••••••••"
                className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition ${
                  errors.confirmPassword 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-slate-200 focus:border-purple-500'
                }`}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Code parrain */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Code parrain (optionnel)
            </label>
            <div className="relative">
              <Gift className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={formData.referralCode}
                onChange={(e) => setFormData({ ...formData, referralCode: e.target.value.toUpperCase() })}
                placeholder="XXXXXXXX"
                maxLength={8}
                className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:outline-none transition font-mono tracking-wider"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Vous avez un code ? Gagnez 10€ sur votre 1ère commande !
            </p>
          </div>

          {/* Bouton submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Création en cours...
              </>
            ) : (
              'Créer mon compte'
            )}
          </button>
        </form>

        {/* Lien connexion */}
        <p className="text-center text-slate-600 mt-6">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-purple-600 font-semibold hover:underline">
            Se connecter
          </Link>
        </p>

        {/* CGU */}
        <p className="text-xs text-slate-500 text-center mt-4">
          En créant un compte, vous acceptez nos{' '}
          <Link to="/legal/cgu" className="text-purple-600 hover:underline">CGU</Link>
          {' '}et notre{' '}
          <Link to="/legal/privacy" className="text-purple-600 hover:underline">Politique de confidentialité</Link>
        </p>
      </div>
    </div>
  );
}
