#!/bin/bash

echo "🚀 Amélioration complète de Kilolab..."
echo ""

# ============================================
# A) AMÉLIORATION FORMULAIRE PARTENAIRE
# ============================================

echo "📝 1. Création du formulaire partenaire amélioré..."

cat > src/pages/BecomePartner.tsx << 'ENDOFFILE'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Store, MapPin, Phone, Mail, Check, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BecomePartner() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    postal_code: '',
    city: '',
    phone: '',
    email: '',
    siret: '',
    description: '',
    services: [] as string[],
    opening_hours: '',
  });
  const [loading, setLoading] = useState(false);

  const services = [
    'Nettoyage à sec',
    'Repassage',
    'Retouches',
    'Pressing express (24h)',
    'Traitement cuir',
    'Traitement daim',
    'Lavage rideaux',
    'Nettoyage couettes',
  ];

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Insertion demande partenaire
      const { error } = await supabase.from('partner_requests').insert({
        name: formData.name,
        address: formData.address,
        postal_code: formData.postal_code,
        city: formData.city,
        phone: formData.phone,
        email: formData.email,
        siret: formData.siret,
        description: formData.description,
        services: formData.services,
        opening_hours: formData.opening_hours,
        status: 'pending',
      });

      if (error) throw error;

      toast.success('Demande envoyée avec succès ! Nous vous contacterons sous 48h.');
      navigate('/');
    } catch (error: any) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de l\'envoi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-white/60 hover:text-white mb-8 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour
        </button>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <Store className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-white mb-2">
              Devenez Partenaire Kilolab
            </h1>
            <p className="text-white/80 text-lg">
              Rejoignez notre réseau de pressings de confiance
            </p>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 w-20 rounded-full ${
                  step >= s ? 'bg-purple-500' : 'bg-white/20'
                }`}
              />
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Informations de base */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Informations de base
                </h2>

                <div>
                  <label className="block text-white/80 mb-2">
                    Nom du pressing *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white"
                    placeholder="Pressing Central Paris"
                  />
                </div>

                <div>
                  <label className="block text-white/80 mb-2">SIRET *</label>
                  <input
                    type="text"
                    required
                    value={formData.siret}
                    onChange={(e) => setFormData({ ...formData, siret: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white"
                    placeholder="123 456 789 00012"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 mb-2">
                      Téléphone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700"
                >
                  Suivant
                </button>
              </div>
            )}

            {/* Step 2: Adresse */}
            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white mb-4">Adresse</h2>

                <div>
                  <label className="block text-white/80 mb-2">Adresse *</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 mb-2">
                      Code postal *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.postal_code}
                      onChange={(e) =>
                        setFormData({ ...formData, postal_code: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 mb-2">Ville *</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 bg-white/10 text-white py-3 rounded-lg font-semibold hover:bg-white/20"
                  >
                    Précédent
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700"
                  >
                    Suivant
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Services */}
            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Vos services
                </h2>

                <div className="grid md:grid-cols-2 gap-3">
                  {services.map((service) => (
                    <button
                      key={service}
                      type="button"
                      onClick={() => handleServiceToggle(service)}
                      className={`p-4 rounded-lg border-2 transition flex items-center gap-3 ${
                        formData.services.includes(service)
                          ? 'border-purple-500 bg-purple-500/20'
                          : 'border-white/20 bg-white/5 hover:border-white/40'
                      }`}
                    >
                      {formData.services.includes(service) && (
                        <Check className="w-5 h-5 text-purple-400" />
                      )}
                      <span className="text-white text-sm">{service}</span>
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-white/80 mb-2">
                    Horaires d'ouverture
                  </label>
                  <textarea
                    value={formData.opening_hours}
                    onChange={(e) =>
                      setFormData({ ...formData, opening_hours: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white"
                    placeholder="Lun-Ven: 9h-19h, Sam: 9h-12h"
                  />
                </div>

                <div>
                  <label className="block text-white/80 mb-2">
                    Description (optionnel)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={4}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white"
                    placeholder="Présentez votre pressing..."
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex-1 bg-white/10 text-white py-3 rounded-lg font-semibold hover:bg-white/20"
                  >
                    Précédent
                  </button>
                  <button
                    type="submit"
                    disabled={loading || formData.services.length === 0}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
                  >
                    {loading ? 'Envoi...' : 'Envoyer ma demande'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Avantages */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">📈</div>
            <h3 className="text-white font-bold mb-2">Visibilité accrue</h3>
            <p className="text-white/60 text-sm">
              Touchez de nouveaux clients dans votre zone
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">💰</div>
            <h3 className="text-white font-bold mb-2">Sans commission</h3>
            <p className="text-white/60 text-sm">
              Gardez 100% de vos revenus
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">🚀</div>
            <h3 className="text-white font-bold mb-2">Gestion simplifiée</h3>
            <p className="text-white/60 text-sm">
              Dashboard intuitif pour gérer vos commandes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
ENDOFFILE

# ============================================
# B) AMÉLIORATION LANDING PAGE
# ============================================

echo "📝 2. Amélioration de la landing page..."

cat > src/pages/LandingPage.tsx << 'ENDOFFILE'
import { useNavigate } from 'react-router-dom';
import { Sparkles, MapPin, Clock, Shield, TrendingUp, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6">
              Le pressing
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {' '}
                nouvelle génération
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-3xl mx-auto">
              Trouvez le pressing parfait près de chez vous. Simple, rapide,
              transparent.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/partners-map')}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition flex items-center justify-center gap-2"
              >
                <MapPin className="w-6 h-6" />
                Trouver un pressing
              </button>
              <button
                onClick={() => navigate('/become-partner')}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold text-lg hover:bg-white/20 transition border border-white/20"
              >
                Devenir partenaire
              </button>
            </div>
          </motion.div>
        </div>

        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white/5 backdrop-blur-sm border-y border-white/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-white mb-2">2600+</div>
              <div className="text-white/60">Pressings partenaires</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-white mb-2">100%</div>
              <div className="text-white/60">Vérifiés et de confiance</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-white mb-2">24h</div>
              <div className="text-white/60">Service express disponible</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h2 className="text-4xl font-bold text-white text-center mb-16">
          Pourquoi choisir Kilolab ?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: MapPin,
              title: 'Trouvez facilement',
              description:
                'Carte interactive avec tous les pressings près de chez vous',
            },
            {
              icon: Clock,
              title: 'Gagnez du temps',
              description:
                'Réservez en ligne et suivez votre commande en temps réel',
            },
            {
              icon: Shield,
              title: 'Confiance garantie',
              description:
                'Tous nos partenaires sont vérifiés et notés par la communauté',
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-purple-500/50 transition"
            >
              <feature.icon className="w-12 h-12 text-purple-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-white/70">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-y border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <Users className="w-16 h-16 text-purple-400 mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-white mb-6">
            Vous êtes pressing ?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Rejoignez notre réseau et développez votre activité
          </p>
          <button
            onClick={() => navigate('/become-partner')}
            className="px-8 py-4 bg-white text-purple-900 rounded-xl font-semibold text-lg hover:bg-gray-100 transition"
          >
            Devenir partenaire gratuitement
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white/60">
          <p>© 2025 Kilolab - Le pressing nouvelle génération</p>
        </div>
      </footer>
    </div>
  );
}
ENDOFFILE

# ============================================
# C) SYSTÈME DE VÉRIFICATION PRESSINGS
# ============================================

echo "📝 3. Création table partner_requests..."

cat > create-partner-requests-table.sql << 'ENDSQL'
-- Table pour les demandes de partenariat
CREATE TABLE IF NOT EXISTS partner_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  address VARCHAR NOT NULL,
  postal_code VARCHAR NOT NULL,
  city VARCHAR NOT NULL,
  phone VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  siret VARCHAR NOT NULL,
  description TEXT,
  services JSONB,
  opening_hours TEXT,
  status VARCHAR DEFAULT 'pending', -- pending, approved, rejected
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE partner_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all on partner_requests" 
ON partner_requests FOR ALL USING (true);

-- Fonction pour marquer les pressings suspects
CREATE OR REPLACE FUNCTION mark_suspicious_partners()
RETURNS TABLE (
  id UUID,
  name VARCHAR,
  reason TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    CASE 
      WHEN p.phone IS NULL OR p.phone = '' THEN 'Pas de téléphone'
      WHEN p.email IS NULL OR p.email = '' THEN 'Pas d\'email'
      WHEN p.lat IS NULL OR p.lon IS NULL THEN 'Pas de coordonnées GPS'
      WHEN p.address LIKE '%test%' OR p.address LIKE '%fake%' THEN 'Adresse suspecte'
      ELSE 'OK'
    END as reason
  FROM partners p
  WHERE 
    p.phone IS NULL OR p.phone = ''
    OR p.email IS NULL OR p.email = ''
    OR p.lat IS NULL OR p.lon IS NULL
    OR p.address LIKE '%test%' OR p.address LIKE '%fake%';
END;
$$ LANGUAGE plpgsql;

-- Statistiques pressings
CREATE OR REPLACE FUNCTION get_partners_stats()
RETURNS TABLE (
  total INT,
  with_coords INT,
  with_phone INT,
  with_email INT,
  active INT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::INT as total,
    COUNT(*) FILTER (WHERE lat IS NOT NULL AND lon IS NOT NULL)::INT as with_coords,
    COUNT(*) FILTER (WHERE phone IS NOT NULL AND phone != '')::INT as with_phone,
    COUNT(*) FILTER (WHERE email IS NOT NULL AND email != '')::INT as with_email,
    COUNT(*) FILTER (WHERE is_active = true)::INT as active
  FROM partners;
END;
$$ LANGUAGE plpgsql;
ENDSQL

echo "✅ Script SQL créé: create-partner-requests-table.sql"
echo ""
echo "📋 Exécutez ce SQL dans Supabase SQL Editor:"
echo "   cat create-partner-requests-table.sql"
echo ""

# ============================================
# D) MISE À JOUR DES ROUTES
# ============================================

echo "📝 4. Mise à jour du router..."

cat > src/App.tsx << 'ENDOFFILE'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PartnersMap from './pages/PartnersMap';
import BecomePartner from './pages/BecomePartner';
import ClientDashboard from './pages/ClientDashboard';
import PartnerDashboard from './pages/PartnerDashboard';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/partners-map" element={<PartnersMap />} />
        <Route path="/become-partner" element={<BecomePartner />} />
        <Route path="/client-dashboard" element={<ClientDashboard />} />
        <Route path="/partner-dashboard" element={<PartnerDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
ENDOFFILE

echo ""
echo "🎉 TERMINÉ !"
echo ""
echo "📋 PROCHAINES ÉTAPES:"
echo "1. Exécutez le SQL: cat create-partner-requests-table.sql"
echo "   Puis copiez-collez dans Supabase SQL Editor"
echo ""
echo "2. Committez et poussez:"
echo "   git add ."
echo "   git commit -m 'feat: improve partner form and landing page'"
echo "   git push"
echo ""
echo "3. Testez sur kilolab.fr:"
echo "   - Nouvelle landing page: https://kilolab.fr"
echo "   - Formulaire partenaire: https://kilolab.fr/become-partner"
echo ""
echo "✨ Les faux avis sont laissés pour montrer le potentiel !"
ENDOFFILE
