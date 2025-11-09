import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { UserPlus, Mail, Lock, User, ArrowLeft } from 'lucide-react';

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'client' as 'client' | 'partner',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Créer le compte auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
          },
        },
      });

      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error('Erreur création compte');

      // 2. Créer le profil utilisateur
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: authData.user.id,
          email: formData.email,
          name: formData.name,
          role: formData.role,
        });

      if (profileError) throw profileError;

      // 3. Rediriger selon le rôle
      if (formData.role === 'partner') {
        navigate('/partner-dashboard');
      } else {
        navigate('/client-dashboard');
      }
    } catch (err: any) {
      console.error('Erreur inscription:', err);
      setError(err.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour
        </button>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <div className="flex items-center gap-3 mb-6">
            <UserPlus className="w-10 h-10 text-purple-400" />
            <h1 className="text-3xl font-bold text-white">Inscription</h1>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6 text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-white/80 mb-2 flex items-center gap-2">
                <User className="w-5 h-5" />
                Nom complet
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Jean Dupont"
              />
            </div>

            <div>
              <label className="block text-white/80 mb-2 flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label className="block text-white/80 mb-2 flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Mot de passe
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="••••••••"
              />
              <p className="text-white/40 text-sm mt-1">Minimum 6 caractères</p>
            </div>

            <div>
              <label className="block text-white/80 mb-2">Type de compte</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'client' })}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.role === 'client'
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-white/20 bg-white/5 hover:border-white/40'
                  }`}
                >
                  <p className="text-white font-semibold">Client</p>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'partner' })}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.role === 'partner'
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-white/20 bg-white/5 hover:border-white/40'
                  }`}
                >
                  <p className="text-white font-semibold">Partenaire</p>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 rounded-lg font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  S inscrire
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/60">
              Déjà un compte ?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-purple-300 hover:text-purple-200 font-semibold"
              >
                Se connecter
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
