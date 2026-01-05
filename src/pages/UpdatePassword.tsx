import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import { Lock, Check, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function UpdatePassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Vérifier si on a bien un token de récupération
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Session invalide. Demandez un nouveau lien.');
        navigate('/forgot-password');
      }
    };
    
    checkSession();

    // Écouter les changements d'état auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        // L'utilisateur est bien là pour changer son mdp
        console.log('Mode récupération de mot de passe activé');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleUpdate = async (e: React.FormEvent) => {
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
      const { error } = await supabase.auth.updateUser({ 
        password: password 
      });

      if (error) throw error;

      toast.success('Mot de passe modifié avec succès !');
      
      // Rediriger après 1 seconde
      setTimeout(() => {
        navigate('/login');
      }, 1000);

    } catch (error: any) {
      console.error('Erreur:', error);
      toast.error(error.message || 'Erreur lors de la modification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-8 text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="text-teal-600" size={32} />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Nouveau mot de passe
              </h1>
              <p className="text-teal-100 text-sm">
                Choisissez un mot de passe sécurisé
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleUpdate} className="p-8 space-y-6">
              
              {/* Nouveau mot de passe */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Nouveau mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
                  <input 
                    type="password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                    placeholder="••••••••"
                    minLength={6}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Minimum 6 caractères
                </p>
              </div>

              {/* Confirmer mot de passe */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
                  <input 
                    type="password" 
                    required 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                    placeholder="••••••••"
                    minLength={6}
                  />
                </div>
              </div>

              {/* Bouton */}
              <button 
                disabled={loading} 
                type="submit" 
                className="w-full py-4 bg-teal-500 text-white rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-teal-600 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-teal-500/30"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Modification...
                  </>
                ) : (
                  <>
                    <Check size={20} />
                    Valider le nouveau mot de passe
                  </>
                )}
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
