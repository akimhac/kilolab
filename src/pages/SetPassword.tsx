import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const email = searchParams.get('email');
  const token = searchParams.get('token');

  useEffect(() => {
    if (!email || !token) {
      toast.error('Lien invalide');
      navigate('/');
    }
  }, [email, token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);

    try {
      // Créer le compte Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: email!,
        password: password,
        options: {
          data: {
            role: 'partner'
          }
        }
      });

      if (error) throw error;

      // Mettre à jour le profil
      await supabase
        .from('user_profiles')
        .update({ 
          password_set: true,
          updated_at: new Date().toISOString()
        })
        .eq('email', email);

      toast.success('Mot de passe créé avec succès !');
      
      // Rediriger vers login
      setTimeout(() => {
        navigate('/login?type=partner');
      }, 1500);

    } catch (error: any) {
      console.error('Erreur:', error);
      toast.error(error.message || 'Erreur lors de la création du mot de passe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-4">
            <Lock className="w-8 h-8 text-teal-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Créez votre mot de passe
          </h1>
          <p className="text-gray-600">
            Votre compte pressing a été validé !
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {email}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mot de passe */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none"
                placeholder="Minimum 6 caractères"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Confirmation */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Confirmer le mot de passe
            </label>
            <div className="relative">
              <CheckCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none"
                placeholder="Confirmez votre mot de passe"
                required
                minLength={6}
              />
            </div>
          </div>

          {/* Indicateur de force */}
          {password.length > 0 && (
            <div className="space-y-2">
              <div className="flex gap-2">
                <div className={`h-2 flex-1 rounded ${password.length >= 6 ? 'bg-teal-500' : 'bg-gray-200'}`}></div>
                <div className={`h-2 flex-1 rounded ${password.length >= 8 ? 'bg-teal-500' : 'bg-gray-200'}`}></div>
                <div className={`h-2 flex-1 rounded ${password.length >= 10 && /[A-Z]/.test(password) && /[0-9]/.test(password) ? 'bg-teal-500' : 'bg-gray-200'}`}></div>
              </div>
              <p className="text-xs text-gray-500">
                {password.length < 6 && 'Faible'}
                {password.length >= 6 && password.length < 8 && 'Moyen'}
                {password.length >= 8 && 'Bon'}
                {password.length >= 10 && /[A-Z]/.test(password) && /[0-9]/.test(password) && 'Fort'}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || password.length < 6 || password !== confirmPassword}
            className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-4 rounded-xl font-bold hover:from-teal-700 hover:to-cyan-700 transition-all shadow-lg shadow-teal-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Création en cours...' : 'Créer mon mot de passe'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Vous aurez ensuite accès à votre tableau de bord pressing
        </p>
      </div>
    </div>
  );
}
