import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDevAccounts, setShowDevAccounts] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('email', data.user.email)
          .single();

        if (profile?.role === 'partner') {
          navigate('/partner-dashboard');
        } else {
          navigate('/client-dashboard');
        }
      }
    } catch (error: any) {
      setError(error.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">KiloLab</h1>
            <h2 className="text-xl text-white/80">Connexion</h2>
            <p className="text-white/60 mt-2">Accédez à votre espace</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/60 text-sm">
              Pas encore de compte ?{' '}
              <Link to="/register" className="text-purple-400 hover:text-purple-300 font-medium">
                Créer un compte
              </Link>
            </p>
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-white/60 hover:text-white text-sm inline-flex items-center gap-2"
            >
              ← Retour à l'accueil
            </Link>
          </div>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setShowDevAccounts(!showDevAccounts)}
              className="text-white/40 hover:text-white/60 text-xs"
            >
              {showDevAccounts ? '🔒 Masquer' : '🔓 Afficher'} comptes test
            </button>
          </div>

          {showDevAccounts && (
            <div className="mt-4 bg-slate-800/50 rounded-lg p-4 text-xs border border-slate-700">
              <p className="text-slate-400 font-semibold mb-2">🔧 Comptes de test</p>
              <div className="space-y-1 text-slate-300">
                <p><span className="text-slate-500">Client:</span> client@test.com / password123</p>
                <p><span className="text-slate-500">Partenaire:</span> partenaire@test.com / password123</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
