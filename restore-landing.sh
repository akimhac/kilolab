#!/bin/bash

echo "🔧 RESTAURATION DE LA LANDING PAGE..."

# ============================================
# RESTAURER LA LANDING PAGE ORIGINALE
# ============================================

cat > src/pages/LandingPage.tsx << 'LANDINGEOF'
import { Link } from 'react-router-dom';
import { Package, Clock, Shield, Star, CheckCircle } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-white mb-6">
              KiloLab
            </h1>
            <p className="text-2xl text-white/80 mb-4">
              Pressing au kilo, simple et rapide
            </p>
            <p className="text-lg text-white/60 mb-12 max-w-2xl mx-auto">
              Déposez votre linge dans nos points relais partenaires. Nous nous occupons de tout : 
              lavage, séchage, repassage et emballage.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl"
              >
                Commencer maintenant
              </Link>
              
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-lg text-white px-8 py-4 rounded-full font-bold text-lg transition-all border-2 border-white/20"
              >
                Se connecter
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Formules Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Nos Formules</h2>
          <p className="text-white/60 text-lg">Choisissez la vitesse qui vous convient</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Premium */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-purple-500/50 transition-all">
            <div className="text-center">
              <Package className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Premium</h3>
              <p className="text-white/60 mb-4">72-96 heures</p>
              <div className="text-5xl font-bold text-white mb-6">
                5€<span className="text-2xl text-white/60">/kg</span>
              </div>
              <ul className="space-y-3 text-left mb-8">
                <li className="flex items-center gap-2 text-white/80">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  Lavage et séchage
                </li>
                <li className="flex items-center gap-2 text-white/80">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  Repassage professionnel
                </li>
                <li className="flex items-center gap-2 text-white/80">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  Emballage soigné
                </li>
              </ul>
            </div>
          </div>

          {/* Express */}
          <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-lg rounded-2xl p-8 border-2 border-purple-500 relative overflow-hidden transform scale-105">
            <div className="absolute top-4 right-4 bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              POPULAIRE
            </div>
            <div className="text-center">
              <Clock className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Express</h3>
              <p className="text-white/60 mb-4">24 heures</p>
              <div className="text-5xl font-bold text-white mb-6">
                10€<span className="text-2xl text-white/60">/kg</span>
              </div>
              <ul className="space-y-3 text-left mb-8">
                <li className="flex items-center gap-2 text-white/80">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  Service rapide 24h
                </li>
                <li className="flex items-center gap-2 text-white/80">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  Traitement prioritaire
                </li>
                <li className="flex items-center gap-2 text-white/80">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  Qualité premium
                </li>
              </ul>
            </div>
          </div>

          {/* Ultra Express */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-blue-500/50 transition-all">
            <div className="text-center">
              <Shield className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Ultra Express</h3>
              <p className="text-white/60 mb-4">6 heures</p>
              <div className="text-5xl font-bold text-white mb-6">
                15€<span className="text-2xl text-white/60">/kg</span>
              </div>
              <ul className="space-y-3 text-left mb-8">
                <li className="flex items-center gap-2 text-white/80">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  Service ultra-rapide
                </li>
                <li className="flex items-center gap-2 text-white/80">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  Priorité absolue
                </li>
                <li className="flex items-center gap-2 text-white/80">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  Parfait pour urgences
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Comment ça marche */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Comment ça marche ?</h2>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="bg-purple-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-2xl">
              1
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Commandez</h3>
            <p className="text-white/60">
              Créez votre commande en ligne et choisissez votre formule
            </p>
          </div>

          <div className="text-center">
            <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-2xl">
              2
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Déposez</h3>
            <p className="text-white/60">
              Apportez votre linge au point relais le plus proche
            </p>
          </div>

          <div className="text-center">
            <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-2xl">
              3
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Nous traitons</h3>
            <p className="text-white/60">
              Votre linge est lavé, séché et repassé professionnellement
            </p>
          </div>

          <div className="text-center">
            <div className="bg-yellow-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-2xl">
              4
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Récupérez</h3>
            <p className="text-white/60">
              Votre linge est prêt au point relais, propre et repassé
            </p>
          </div>
        </div>
      </div>

      {/* Témoignages */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Ils nous font confiance</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-white/80 mb-4">
              "Service ultra rapide et qualité impeccable ! Je recommande vivement."
            </p>
            <p className="text-white/60 text-sm">Marie D. - Paris</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-white/80 mb-4">
              "Très pratique avec les points relais. Mon linge est toujours parfait."
            </p>
            <p className="text-white/60 text-sm">Thomas L. - Lyon</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-white/80 mb-4">
              "Prix très compétitifs et service impeccable. Je ne changerai plus !"
            </p>
            <p className="text-white/60 text-sm">Sophie M. - Marseille</p>
          </div>
        </div>
      </div>

      {/* CTA Final */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h2 className="text-4xl font-bold text-white mb-6">
          Prêt à essayer KiloLab ?
        </h2>
        <p className="text-xl text-white/60 mb-8">
          Créez votre compte et passez votre première commande maintenant
        </p>
        <Link
          to="/register"
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-12 py-5 rounded-full font-bold text-xl transition-all shadow-2xl hover:shadow-purple-500/50"
        >
          Créer mon compte gratuitement
        </Link>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-white/60">
            <p>© 2025 KiloLab. Tous droits réservés.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
LANDINGEOF

echo "✅ Landing page restaurée"

# ============================================
# AJOUTER LES DONNÉES DE TEST DANS SUPABASE
# ============================================

cat > partners-data.sql << 'SQLEOF'
INSERT INTO partners (name, address, city, postal_code, lat, lon, is_active) VALUES
('Pressing du Marais', '24 Rue des Francs Bourgeois', 'Paris', '75004', 48.8577, 2.3627, true),
('Clean Express Montmartre', '18 Rue Lepic', 'Paris', '75018', 48.8867, 2.3330, true),
('Laverie Saint-Germain', '45 Rue de Seine', 'Paris', '75006', 48.8545, 2.3360, true),
('Pressing Opéra', '8 Rue Auber', 'Paris', '75009', 48.8722, 2.3299, true),
('Net & Sec Bastille', '12 Rue de la Roquette', 'Paris', '75011', 48.8546, 2.3735, true),
('Pressing Confluence Lyon', '15 Cours Charlemagne', 'Lyon', '69002', 45.7430, 4.8185, true),
('Laverie Bellecour', '3 Place Bellecour', 'Lyon', '69002', 45.7578, 4.8320, true),
('Pressing Vieux-Port', '12 Quai du Port', 'Marseille', '13002', 43.2963, 5.3703, true),
('Pressing Capitole', '8 Rue du Taur', 'Toulouse', '31000', 43.6084, 1.4420, true),
('Pressing Promenade Nice', '22 Promenade des Anglais', 'Nice', '06000', 43.6951, 7.2653, true);
SQLEOF

echo "✅ Fichier SQL créé : partners-data.sql"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ RESTAURATION TERMINÉE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 MAINTENANT:"
echo ""
echo "1. COPIE le contenu de partners-data.sql"
echo "2. VA sur https://supabase.com/dashboard"
echo "3. SQL Editor → New Query"
echo "4. COLLE le SQL et RUN"
echo ""
echo "5. REDÉMARRE:"
echo "   npm run dev"
echo ""
echo "6. LA CARTE sera visible sur:"
echo "   http://localhost:5173/partners-map"
echo ""

