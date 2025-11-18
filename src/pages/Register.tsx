import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { User, Mail, Phone, Lock, MapPin, Building } from 'lucide-react';

export default function Register() {
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get('type') === 'partner' ? 'partner' : 'client';
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState(initialType);
  
  // Champs spécifiques partenaires
  const [businessName, setBusinessName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setLoading(false);
      return;
    }

    try {
      // 1. Créer le compte Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        // 2. Créer le profil utilisateur
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            email: data.user.email,
            name: userType === 'partner' ? businessName : name,
            phone: phone,
            role: userType,
            address: userType === 'partner' ? address : null,
            city: userType === 'partner' ? city : null,
            postal_code: userType === 'partner' ? postalCode : null,
          });

        if (profileError) throw profileError;

        // 3. Si partenaire, créer aussi une entrée dans partners
        if (userType === 'partner') {
          const { error: partnerError } = await supabase
            .from('partners')
            .insert({
              name: businessName,
              email: data.user.email,
              address: address,
              city: city,
              postal_code: postalCode,
              phone: phone,
              is_active: false, // En attente de validation
              lat: 0, // À compléter plus tard
              lon: 0,
            });

          if (partnerError) throw partnerError;
        }

        alert(
          userType === 'partner'
            ? '✅ Inscription partenaire réussie !\n\nVotre compte sera activé après validation de votre profil.'
            : '✅ Inscription réussie !\n\nVous pouvez maintenant vous connecter.'
        );
        
        navigate('/login');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      setError(error.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">KiloLab</h1>
            <h2 className="text-xl text-white/80">Créer un compte</h2>
          </div>

          {/* Type Selection */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
              type="button"
              onClick={() => setUserType('client')}
              className={`p-4 rounded-xl border-2 transition-all ${
                userType === 'client'
                  ? 'border-blue-500 bg-blue-500/20'
                  : 'border-white/20 bg-white/5 hover:bg-white/10'
              }`}
            >
              <User className="w-8 h-8 mx-auto mb-2 text-white" />
              <p className="text-white font-semibold">Client</p>
              <p className="text-white/60 text-sm">Je veux faire laver mon linge</p>
            </button>

            <button
              type="button"
              onClick={() => setUserType('partner')}
              className={`p-4 rounded-xl border-2 transition-all ${
                userType === 'partner'
                  ? 'border-green-500 bg-green-500/20'
                  : 'border-white/20 bg-white/5 hover:bg-white/10'
              }`}
            >
              <Building className="w-8 h-8 mx-auto mb-2 text-white" />
              <p className="text-white font-semibold">Partenaire</p>
              <p className="text-white/60 text-sm">Je suis un pressing</p>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {userType === 'client' ? (
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Nom complet
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jean Dupont"
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    Nom du pressing
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Pressing de la Gare"
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Code postal
                    </label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="75001"
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Ville
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Paris"
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Adresse complète
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="10 Rue de la Gare"
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Téléphone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="06 12 34 56 78"
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm">
                {error}
              </div>
            )}

            {userType === 'partner' && (
              <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-3 text-blue-200 text-sm">
                ℹ️ Votre compte partenaire sera activé après validation par notre équipe.
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                userType === 'partner'
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                  : 'bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700'
              } text-white`}
            >
              {loading ? 'Inscription...' : `S'inscrire${userType === 'partner' ? ' comme partenaire' : ''}`}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/60 text-sm">
              Déjà un compte ?{' '}
              <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">
                Se connecter
              </Link>
            </p>
          </div>

          <div className="mt-6 text-center">
            <Link to="/" className="text-white/60 hover:text-white text-sm inline-flex items-center gap-2">
              ← Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
