#!/bin/bash

echo "🔧 RESTAURATION LANDING PAGE SIMPLE..."

cat > src/pages/LandingPage.tsx << 'LANDINGEOF'
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-white mb-6">
            KiloLab
          </h1>
          <p className="text-2xl text-white/80 mb-4">
            Pressing au kilo, simple et rapide
          </p>
          <p className="text-lg text-white/60 mb-12 max-w-2xl mx-auto">
            Déposez votre linge dans nos points relais partenaires. Nous nous occupons de tout.
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

          <div className="mt-8">
            <Link
              to="/partners-map"
              className="text-white/60 hover:text-white underline"
            >
              Voir la carte des partenaires
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-2">Premium</h3>
            <p className="text-white/60 mb-4">72-96h</p>
            <p className="text-4xl font-bold text-white">5€/kg</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-2">Express</h3>
            <p className="text-white/60 mb-4">24h</p>
            <p className="text-4xl font-bold text-white">10€/kg</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-2">Ultra Express</h3>
            <p className="text-white/60 mb-4">6h</p>
            <p className="text-4xl font-bold text-white">15€/kg</p>
          </div>
        </div>
      </div>
    </div>
  );
}
LANDINGEOF

echo "✅ Landing page SIMPLE restaurée"
echo ""
echo "🔄 Redémarre:"
echo "   npm run dev"

