import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Loader2, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const ADMIN_EMAILS = ['admin@kilolab.fr', 'contact@kilolab.fr', 'akim.hachili@gmail.com'];

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Vérifier que c'est un email admin AVANT de se connecter
    if (!ADMIN_EMAILS.includes(email.toLowerCase().trim())) {
      toast.error('⛔ Accès réservé aux administrateurs');
      return;
    }

    setLoading(true);

    try {
      // Connexion simple sans toucher à user_profiles
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Email ou mot de passe incorrect');
        } else if (error.message.includes('Email not confirmed')) {
          throw new Error('Email non confirmé. Vérifiez votre boîte mail.');
        } else {
          throw error;
        }
      }

      if (!data.session) {
        throw new Error('Impossible de créer la session');
      }

      // Vérifier une dernière fois que c'est bien un admin
      if (!ADMIN_EMAILS.includes(data.session.user.email || '')) {
        await supabase.auth.signOut();
        throw new Error('⛔ Accès refusé');
      }

      // Tout est OK !
      toast.success('✅ Connexion réussie !');
      
      // Redirection immédiate
      navigate('/admin');

    } catch (error: any) {
      console.error('❌ Erreur login:', error);
      toast.error(error.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      
      <div className="max-w-md w-full">
        
        <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-8 text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <ShieldCheck className="text-teal-600" size={40} />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Admin Kilolab
            </h1>
            <p className="text-teal-100 text-sm">
              Accès réservé aux administrateurs
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="p-8 space-y-6">
            
            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-slate-500" size={18} />
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                  placeholder="admin@kilolab.fr"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-slate-500" size={18} />
                <input 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>
            </div>

            {/* Button */}
            <button 
              disabled={loading} 
              type="submit" 
              className="w-full py-4 bg-teal-500 text-white rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-teal-600 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-teal-500/30"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Connexion...
                </>
              ) : (
                <>
                  <ShieldCheck size={20} />
                  Se connecter
                </>
              )}
            </button>

          </form>

          {/* Info */}
          <div className="px-8 pb-8">
            <div className="bg-slate-700/50 border border-slate-600 rounded-xl p-4">
              <p className="text-xs text-slate-400 text-center">
                🔒 Connexion sécurisée réservée aux administrateurs Kilolab
              </p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-slate-400 hover:text-teal-400 transition text-sm font-medium"
          >
            ← Retour au site
          </button>
        </div>

      </div>
    </div>
  );
}
