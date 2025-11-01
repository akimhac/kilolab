#!/bin/bash

echo "🔧 CORRECTION COMPLÈTE DE LA CARTE..."
echo ""

# ============================================
# 1. VÉRIFIER ET CORRIGER App.tsx
# ============================================
echo "📝 1/3 - Correction de App.tsx..."

# Créer une version propre de App.tsx
cat > src/App.tsx << 'APPEOF'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import Login from './pages/Login';
import Register from './pages/Register';
import LandingPage from './pages/LandingPage';
import ClientDashboard from './pages/ClientDashboard';
import PartnerDashboard from './pages/PartnerDashboard';
import NewOrder from './pages/NewOrder';
import PartnersMap from './pages/PartnersMap';

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Chargement...</div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/partners-map" element={<PartnersMap />} />
        <Route
          path="/client-dashboard"
          element={user ? <ClientDashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/partner-dashboard"
          element={user ? <PartnerDashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/new-order"
          element={user ? <NewOrder /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
APPEOF

echo "✅ App.tsx corrigé"

# ============================================
# 2. VÉRIFIER PartnersMap.tsx
# ============================================
echo "📝 2/3 - Vérification de PartnersMap.tsx..."

if [ -f "src/pages/PartnersMap.tsx" ]; then
    echo "✅ PartnersMap.tsx existe"
else
    echo "❌ Création de PartnersMap.tsx..."
    
    cat > src/pages/PartnersMap.tsx << 'MAPEOF'
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface Partner {
  id: string;
  name: string;
  address: string;
  city: string;
  postal_code: string;
  lat: number;
  lon: number;
}

export default function PartnersMap() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = async () => {
    try {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      setPartners(data || []);
    } catch (error) {
      console.error('Error loading partners:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Chargement de la carte...</div>
      </div>
    );
  }

  const defaultCenter: [number, number] = [46.603354, 1.888334];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Nos Partenaires</h1>
            <p className="text-white/60">
              Trouvez le point relais le plus proche de chez vous
            </p>
          </div>
          <Link
            to="/"
            className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg transition-all"
          >
            ← Retour
          </Link>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="h-[600px] relative">
            <MapContainer
              center={defaultCenter}
              zoom={6}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; OpenStreetMap'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {partners.map((partner) => (
                <Marker
                  key={partner.id}
                  position={[partner.lat, partner.lon]}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-bold text-lg mb-1">{partner.name}</h3>
                      <p className="text-sm text-gray-600">{partner.address}</p>
                      <p className="text-sm text-gray-600">
                        {partner.postal_code} {partner.city}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          <div className="p-6 bg-slate-900/50">
            <h2 className="text-xl font-bold text-white mb-4">
              Liste des partenaires ({partners.length})
            </h2>
            {partners.length === 0 ? (
              <p className="text-white/60">Aucun partenaire pour le moment.</p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {partners.map((partner) => (
                  <div
                    key={partner.id}
                    className="bg-white/10 rounded-lg p-4 border border-white/20"
                  >
                    <h3 className="font-semibold text-white mb-2">{partner.name}</h3>
                    <p className="text-sm text-white/70">{partner.address}</p>
                    <p className="text-sm text-white/70">
                      {partner.postal_code} {partner.city}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
MAPEOF
    
    echo "✅ PartnersMap.tsx créé"
fi

# ============================================
# 3. CRÉER LE FICHIER SQL (pas bash)
# ============================================
echo "�� 3/3 - Création du fichier SQL..."

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
('Net Pro Castellane', '25 Place Castellane', 'Marseille', '13006', 43.2846, 5.3819, true),
('Pressing Capitole', '8 Rue du Taur', 'Toulouse', '31000', 43.6084, 1.4420, true),
('Laverie Wilson', '15 Boulevard Wilson', 'Toulouse', '31000', 43.6046, 1.4468, true),
('Pressing Promenade Nice', '22 Promenade des Anglais', 'Nice', '06000', 43.6951, 7.2653, true),
('Clean Nice Centre', '10 Avenue Jean Médecin', 'Nice', '06000', 43.7031, 7.2661, true),
('Pressing Commerce Nantes', '5 Place du Commerce', 'Nantes', '44000', 47.2130, -1.5636, true),
('Pressing Kléber', '18 Place Kléber', 'Strasbourg', '67000', 48.5839, 7.7455, true),
('Pressing Chartrons', '45 Rue Notre Dame', 'Bordeaux', '33000', 44.8533, -0.5698, true),
('Pressing Grand Place Lille', '8 Place du Général de Gaulle', 'Lille', '59000', 50.6372, 3.0633, true),
('Pressing République Rennes', '15 Place de la République', 'Rennes', '35000', 48.1085, -1.6743, true);
SQLEOF

echo "✅ Fichier SQL créé : partners-data.sql"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ CORRECTIONS TERMINÉES !"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 PROCHAINES ÉTAPES:"
echo ""
echo "1. COPIE le contenu de partners-data.sql"
echo "2. VA sur https://supabase.com/dashboard"
echo "3. SQL Editor → New Query"
echo "4. COLLE le SQL et clique RUN"
echo ""
echo "5. REDÉMARRE le serveur:"
echo "   npm run dev"
echo ""
echo "6. VA sur:"
echo "   http://localhost:5173/partners-map"
echo ""

