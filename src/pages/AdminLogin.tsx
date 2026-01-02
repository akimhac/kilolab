import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { isAdmin } from '../lib/adminAuth';
import toast from 'react-hot-toast';
import { Loader2, Lock, Mail } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Se connecter avec Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // 2. Vérifier si c'est un admin
      const adminStatus = await isAdmin();

      if (!adminStatus) {
        // Pas admin → Déconnecter et refuser
        await supabase.auth.signOut();
        throw new Error('Accès refusé : compte non autorisé');
      }

      // 3. Succès → Rediriger
      toast.success('✅ Connexion réussie !');
      window.location.href = '/admin';

    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black flex items-center justify-center p-4">
      <div className="bg-slate-800/50 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-slate-700 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Admin Kilolab</h1>
          <p className="text-slate-400 text-sm">Accès réservé aux administrateurs</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-700/50 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                placeholder="admin@kilolab.fr"
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-700/50 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-teal-600 hover:bg-teal-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold rounded-xl transition transform active:scale-95 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Connexion...
              </>
            ) : (
              'Se connecter'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-slate-400 hover:text-slate-300 text-sm transition"
          >
            ← Retour au site
          </a>
        </div>
      </div>
    </div>
  );
}
