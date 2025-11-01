import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Mail, Lock, User, ArrowLeft, UserPlus, Building, AlertCircle } from 'lucide-react';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'client' | 'partner'>('client');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('📝 Création du compte pour:', email);

      // 1. Vérifier si l'email existe déjà
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('email')
        .eq('email', email.trim())
        .single();

      if (existingProfile) {
        throw new Error('Cet email est déjà utilisé. Connectez-vous plutôt.');
      }

      // 2. Créer le compte Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: {
            name: name,
            role: role,
          }
        }
      });

      if (authError) {
        console.error('❌ Auth error:', authError);
        throw authError;
      }

      if (!authData.user) {
        throw new Error('Erreur lors de la création du compte');
      }

      console.log('✅ Compte Auth créé:', authData.user.id);

      // 3. Attendre un peu pour que la session s'établisse
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 4. Créer le profil avec retry
      let profileCreated = false;
      let attempts = 0;
      const maxAttempts = 3;

      while (!profileCreated && attempts < maxAttempts) {
        attempts++;
        console.log(`📋 Tentative ${attempts}/${maxAttempts} de création du profil...`);

        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            email: email.trim(),
            name: name || email.split('@')[0],
            role: role,
          });

        if (!profileError) {
          profileCreated = true;
          console.log('✅ Profil créé');
        } else {
          console.error(`❌ Erreur profil (tentative ${attempts}):`, profileError);
          
          if (attempts === maxAttempts) {
            throw new Error(`Impossible de créer le profil: ${profileError.message}`);
          }
          
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      // 5. Si partenaire, créer aussi l'entrée dans partners
      if (role === 'partner') {
        console.log('🏢 Création de l\'entrée partenaire...');
        
        const { error: partnerError } = await supabase
          .from('partners')
          .insert({
            name: name || email.split('@')[0],
            email: email.trim(),
            is_active: true,
          });

        if (partnerError) {
          console.error('⚠️ Erreur création partenaire:', partnerError);
          // Ne pas bloquer si l'erreur est un doublon
          if (!partnerError.message.includes('duplicate')) {
            throw new Error(`Erreur partenaire: ${partnerError.message}`);
          }
        } else {
          console.log('✅ Entrée partenaire créée');
        }
      }

      alert('✅ Compte créé avec succès !\n\nVous pouvez maintenant vous connecter.');
      navigate('/login');

    } catch (err: any) {
      console.error('❌ Signup error:', err);
      
      let errorMessage = 'Erreur lors de la création du compte';
      
      if (err.message.includes('already registered')) {
        errorMessage = 'Cet email est déjà utilisé';
      } else if (err.message.includes('Invalid email')) {
        errorMessage = 'Email invalide';
      } else if (err.message.includes('Password')) {
        errorMessage = 'Le mot de passe doit contenir au moins 6 caractères';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour à l'accueil
          </Link>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">KiloLab</h1>
            <p className="text-white/60">Inscription</p>
            <p className="text-white/80 mt-2">Créez votre compte</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            {/* Type de compte */}
            <div>
              <label className="block text-white/80 font-medium mb-3">Type de compte</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('client')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    role === 'client'
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-white/20 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <User className="w-6 h-6 text-white mx-auto mb-2" />
                  <p className="text-white font-semibold">Client</p>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('partner')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    role === 'partner'
                      ? 'border-green-500 bg-green-500/20'
                      : 'border-white/20 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <Building className="w-6 h-6 text-white mx-auto mb-2" />
                  <p className="text-white font-semibold">Partenaire</p>
                </button>
              </div>
            </div>

            {/* Nom */}
            <div>
              <label className="block text-white/80 font-medium mb-2">
                {role === 'partner' ? 'Nom du pressing' : 'Nom complet'}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={role === 'partner' ? 'Pressing Paris Centre' : 'Jean Dupont'}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-white/80 font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <label className="block text-white/80 font-medium mb-2">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <p className="text-white/40 text-xs mt-1">Minimum 6 caractères</p>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-300 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-200 font-semibold mb-1">Erreur</p>
                  <p className="text-red-200/80 text-sm">{error}</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Création en cours...
                </div>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Créer mon compte
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/60">
              Déjà un compte ?{' '}
              <Link to="/login" className="text-purple-400 hover:text-purple-300 font-semibold">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
