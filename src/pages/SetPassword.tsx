import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // États du formulaire
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Récupération des infos de l'URL
  const email = searchParams.get('email');
  const token = searchParams.get('token');

  // Sécurité : Si pas d'email ou de token, on dégage
  useEffect(() => {
    if (!email || !token) {
      toast.error('Lien invalide ou expiré');
      navigate('/');
    }
  }, [email, token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validation basique
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
      // 2. ÉTAPE CRUCIALE : On échange le token d'invitation contre une session active
      // C'est ça qui manquait ou qui était faux avant.
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email: email!,
        token: token!,
        type: 'invite', // On précise bien que c'est une INVITATION
      });

      if (verifyError) throw verifyError;

      // 3. Une fois connecté, on met à jour le mot de passe
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });

      if (updateError) throw updateError;

      // 4. On met à jour le profil pour dire "C'est bon, il a son mot de passe"
      // (Optionnel mais recommandé pour ton suivi admin)
      await supabase
        .from('user_profiles')
        .update({ 
          password_set: true,
          updated_at: new Date().toISOString()
        })
        .eq('email', email);

      // 5. Succès et redirection
      toast.success('Compte activé avec succès ! Bienvenue 🚀');
      
      // Petit délai pour laisser l'utilisateur lire le message
      setTimeout(() => {
        // On redirige vers le login. 
        // Note : Comme il est déjà connecté techniquement, on pourrait l'envoyer au dashboard,
        // mais le login est plus propre pour s'assurer que tout est chargé.
        navigate('/login?type=partner');
      }, 1500);

    } catch (error: any) {
      console.error('Erreur:', error);
      // Gestion des messages d'erreur spécifiques
      if (error.message.includes('Token')) {
        toast.error('Ce lien a expiré ou a déjà été utilisé.');
      } else {
        toast.error(error.message || 'Erreur lors de l\'activation');
      }
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Créez votre mot de passe</h1>
          <p className="text-gray-600">Votre compte pressing a été validé !</p>
          <p className="text-sm text-teal-600 font-medium mt-2 bg-teal-50 inline-block px-3 py-1 rounded-full">
            {email}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Champ Mot de passe */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors"
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

          {/* Champ Confirmation */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Confirmer</label>
            <div className="relative">
              <CheckCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors"
                placeholder="Confirmez le mot de passe"
                required
                minLength={6}
              />
            </div>
          </div>

          {/* Indicateur de force (UI) */}
          {password.length > 0 && (
            <div className="space-y-2">
              <div className="flex gap-2">
                <div className={`h-2 flex-1 rounded transition-all duration-300 ${password.length >= 6 ? 'bg-teal-500' : 'bg-gray-200'}`}></div>
                <div className={`h-2 flex-1 rounded transition-all duration-300 ${password.length >= 8 ? 'bg-teal-500' : 'bg-gray-200'}`}></div>
                <div className={`h-2 flex-1 rounded transition-all duration-300 ${password.length >= 10 ? 'bg-teal-500' : 'bg-gray-200'}`}></div>
              </div>
              <p className="text-xs text-gray-500 text-right">
                {password.length < 6 && 'Trop court'}
                {password.length >= 6 && password.length < 8 && 'Moyen'}
                {password.length >= 8 && 'Fort 💪'}
              </p>
            </div>
          )}

          {/* Bouton de soumission */}
          <button
            type="submit"
            disabled={loading || password.length < 6 || password !== confirmPassword}
            className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-4 rounded-xl font-bold hover:from-teal-700 hover:to-cyan-700 transition-all shadow-lg shadow-teal-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
          >
            {loading ? 'Activation en cours...' : 'Activer mon compte'}
          </button>
        </form>
      </div>
    </div>
  );
}
