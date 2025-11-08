#!/bin/bash

echo "🔍 DIAGNOSTIC PAGES BLANCHES"
echo "============================="

# 1. Vérifier la structure des fichiers
echo ""
echo "📁 Vérification fichiers pages..."
ls -la src/pages/ | grep -E "Login|PartnersMap|PartnerLanding"

# 2. Vérifier les imports dans App.tsx
echo ""
echo "📝 Contenu actuel App.tsx (imports):"
head -20 src/App.tsx

# 3. Tester en local d'abord
echo ""
echo "🧪 Test en local..."
npm run dev &
DEV_PID=$!
sleep 5

# 4. Vérifier console navigateur
echo ""
echo "📊 Si pages blanches, ouvre Console Navigateur (F12) et cherche:"
echo "   - Erreurs JavaScript (rouge)"
echo "   - Failed to fetch module"
echo "   - 404 errors"

# 5. Fix si c'est un problème de lazy loading
echo ""
echo "🔧 Application du fix lazy loading..."

cat > src/App.tsx << 'ENDOFFILE'
import { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// Import DIRECT (pas lazy) pour debug
import LandingPage from './pages/LandingPage';
import PartnerLanding from './pages/PartnerLanding';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ClientDashboard from './pages/ClientDashboard';
import PartnerDashboard from './pages/PartnerDashboard';
import NewOrder from './pages/NewOrder';
import Checkout from './pages/Checkout';
import PartnersMap from './pages/PartnersMap';
import CGV from './pages/CGV';
import MentionsLegales from './pages/MentionsLegales';
import Privacy from './pages/Privacy';
import PromoPopup from './components/PromoPopup';
import CookieConsent from './components/CookieConsent';

const Loader = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
    <div className="text-white text-xl">Chargement...</div>
  </div>
);

export default function App() {
  return (
    <HelmetProvider>
      <Router>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<><LandingPage /><PromoPopup /><CookieConsent /></>} />
            <Route path="/partners" element={<PartnerLanding />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/client-dashboard" element={<ClientDashboard />} />
            <Route path="/partner-dashboard" element={<PartnerDashboard />} />
            <Route path="/new-order" element={<NewOrder />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/partners-map" element={<PartnersMap />} />
            <Route path="/cgv" element={<CGV />} />
            <Route path="/mentions-legales" element={<MentionsLegales />} />
            <Route path="/privacy" element={<Privacy />} />
          </Routes>
        </Suspense>
      </Router>
    </HelmetProvider>
  );
}
ENDOFFILE

# 6. Vérifier que Login.tsx a un export default
echo ""
echo "🔍 Vérification export Login.tsx..."
tail -5 src/pages/Login.tsx

# 7. Reconstruire complètement
echo ""
echo "🔨 Rebuild complet..."
rm -rf node_modules/.vite
rm -rf dist
npm run build

echo ""
echo "✅ Diagnostic terminé"
echo ""
echo "📋 NEXT STEPS:"
echo "   1. Vérifie dans la console ce que ça affiche"
echo "   2. Teste en local: npm run dev"
echo "   3. Ouvre http://localhost:5173/login"
echo "   4. Ouvre Console (F12) et copie-moi les erreurs"

kill $DEV_PID 2>/dev/null
