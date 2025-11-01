#!/bin/bash

echo "🔧 CORRECTION DE TOUS LES PROBLÈMES..."
echo ""

# ============================================
# 1. CORRIGER Login.tsx - RETIRER LES COMPTES TEST
# ============================================
echo "📝 1/4 - Suppression des comptes test de Login.tsx..."

cat > src/pages/Login.tsx << 'LOGINEOF'
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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
        </div>
      </div>
    </div>
  );
}
LOGINEOF

echo "✅ Login.tsx corrigé (comptes test retirés)"

# ============================================
# 2. AJOUTER BOUTON DÉCONNEXION DANS ClientDashboard
# ============================================
echo "📝 2/4 - Ajout du bouton déconnexion..."

# Vérifier si le bouton existe déjà
if ! grep -q "handleLogout" src/pages/ClientDashboard.tsx; then
    # Ajouter la fonction de déconnexion après les imports
    sed -i "/import.*supabase/a \\nimport { LogOut } from 'lucide-react';" src/pages/ClientDashboard.tsx
    
    # Ajouter la fonction handleLogout dans le composant (après les useState)
    sed -i "/const \[.*useState/a \\n  const handleLogout = async () => {\n    await supabase.auth.signOut();\n    window.location.href = '/';\n  };" src/pages/ClientDashboard.tsx
    
    # Ajouter le bouton dans le header (après le titre)
    sed -i "/<h1.*Mon espace client/a \\          <button\n            onClick={handleLogout}\n            className=\"flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded-lg transition-all\"\n          >\n            <LogOut className=\"w-4 h-4\" />\n            Déconnexion\n          </button>" src/pages/ClientDashboard.tsx
    
    echo "✅ Bouton déconnexion ajouté"
else
    echo "✅ Bouton déconnexion déjà présent"
fi

# ============================================
# 3. CORRIGER LE BOUTON INSCRIPTION SUR LA LANDING
# ============================================
echo "📝 3/4 - Correction du bouton inscription..."

# Chercher et corriger les liens vers /signup en /register
sed -i 's|to="/signup"|to="/register"|g' src/pages/LandingPage.tsx
sed -i 's|href="/signup"|href="/register"|g' src/pages/LandingPage.tsx

echo "✅ Bouton inscription corrigé"

# ============================================
# 4. AJOUTER BOUTON "NOS PARTENAIRES" SUR LA LANDING
# ============================================
echo "📝 4/4 - Ajout du bouton carte des partenaires..."

# Chercher si le bouton existe déjà
if ! grep -q "partners-map" src/pages/LandingPage.tsx; then
    # Trouver la section CTA et ajouter le bouton
    # On va l'ajouter après un bouton existant
    sed -i '/"Commencer maintenant"/a \            <Link\n              to="/partners-map"\n              className="inline-flex items-center justify-center gap-2 bg-white text-purple-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl"\n            >\n              🗺️ Voir nos partenaires\n            </Link>' src/pages/LandingPage.tsx
    
    echo "✅ Bouton carte partenaires ajouté"
else
    echo "✅ Bouton carte déjà présent"
fi

# ============================================
# RÉSUMÉ
# ============================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ TOUTES LES CORRECTIONS APPLIQUÉES !"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Corrections effectuées:"
echo "  ✅ Comptes test retirés de la page login"
echo "  ✅ Bouton déconnexion ajouté au dashboard"
echo "  ✅ Bouton inscription corrigé (/register)"
echo "  ✅ Bouton 'Voir nos partenaires' ajouté"
echo ""
echo "🔄 Redémarre maintenant:"
echo "   npm run dev"
echo ""
