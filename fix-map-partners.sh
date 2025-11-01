#!/bin/bash

# Backup
cp src/pages/NewOrder.tsx src/pages/NewOrder.tsx.backup

# Fix: Afficher les partenaires sur la carte
cat > src/pages/NewOrder.tsx << 'REACTEOF'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { ArrowLeft, MapPin, Search } from 'lucide-react';
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

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  return null;
}

export default function NewOrder() {
  const [speed, setSpeed] = useState('express');
  const [weight, setWeight] = useState('');
  const [address, setAddress] = useState('');
  const [searchAddress, setSearchAddress] = useState('');
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [center, setCenter] = useState<[number, number]>([48.8566, 2.3522]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    loadPartners();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/login');
    }
  };

  const loadPartners = async () => {
    try {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .eq('is_active', true)
        .not('lat', 'is', null)
        .not('lon', 'is', null);

      if (error) throw error;
      
      const validPartners = (data || []).filter(
        p => p.lat !== 0 && p.lon !== 0
      );
      
      console.log('Pressings chargés:', validPartners.length);
      setPartners(validPartners);
    } catch (error) {
      console.error('Error loading partners:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchAddress.trim()) {
      alert('Veuillez entrer une adresse');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchAddress)}&countrycodes=fr&limit=1`,
        { headers: { 'User-Agent': 'KiloLab/1.0' } }
      );
      
      const results = await response.json();
      
      if (results && results.length > 0) {
        const data = results[0];
        setAddress(data.display_name || searchAddress);
        const newCenter: [number, number] = [parseFloat(data.lat), parseFloat(data.lon)];
        setCenter(newCenter);
      } else {
        alert('Adresse introuvable. Essayez une autre adresse.');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      alert('Erreur lors de la recherche. Réessayez.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async () => {
    if (!speed || !weight || !selectedPartner) {
      alert('Veuillez remplir tous les champs et sélectionner un point relais');
      return;
    }

    const weightNum = parseFloat(weight);
    if (isNaN(weightNum) || weightNum <= 0) {
      alert('Veuillez entrer un poids valide');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('email', user.email)
        .single();

      if (!profile) {
        alert('Profil utilisateur introuvable');
        return;
      }

      const pricePerKg = speed === 'premium' ? 500 : speed === 'express' ? 1000 : 1500;
      const estimatedPrice = Math.round(weightNum * pricePerKg);

      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          client_id: profile.id,
          partner_id: selectedPartner.id,
          speed: speed,
          weight_kg: weightNum,
          price_gross_cents: estimatedPrice,
          status: 'pending_weight',
          client_address: address,
        })
        .select()
        .single();

      if (error) throw error;

      alert(`✅ Commande créée !\n\nPrix estimé : ${(estimatedPrice / 100).toFixed(2)}€\n\nDéposez votre linge au point relais sélectionné.`);
      navigate('/client-dashboard');
    } catch (error: any) {
      console.error('Error creating order:', error);
      alert('Erreur : ' + error.message);
    }
  };

  const estimatedPrice = weight && !isNaN(parseFloat(weight))
    ? (parseFloat(weight) * (speed === 'premium' ? 5 : speed === 'express' ? 10 : 15)).toFixed(2)
    : '0.00';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate('/client-dashboard')}
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour au Dashboard
          </button>
        </div>

        <h1 className="text-4xl font-bold text-white mb-8">Nouvelle Commande</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Formulaire */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 space-y-6">
            {/* Formule */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4">1. Choisissez votre formule</h2>
              <div className="space-y-3">
                <button
                  onClick={() => setSpeed('premium')}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    speed === 'premium'
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-white/20 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex justify-between items-center text-white">
                    <div>
                      <span className="font-bold">Premium - 5€/kg</span>
                      <span className="text-sm text-white/60 ml-2">(72-96h)</span>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setSpeed('express')}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    speed === 'express'
                      ? 'border-blue-500 bg-blue-500/20'
                      : 'border-white/20 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex justify-between items-center text-white">
                    <div>
                      <span className="font-bold">Express - 10€/kg</span>
                      <span className="text-sm text-white/60 ml-2">(24h) ⭐</span>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setSpeed('ultra')}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    speed === 'ultra'
                      ? 'border-orange-500 bg-orange-500/20'
                      : 'border-white/20 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex justify-between items-center text-white">
                    <div>
                      <span className="font-bold">Ultra Express - 15€/kg</span>
                      <span className="text-sm text-white/60 ml-2">(6h)</span>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Poids */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4">2. Poids estimé (kg)</h2>
              <input
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Ex: 3.5"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <p className="text-yellow-400 text-sm mt-2">
                💡 Le poids sera vérifié au point relais. Prix estimé : {estimatedPrice}€
              </p>
            </div>

            {/* Adresse */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4">3. Votre adresse</h2>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={searchAddress}
                  onChange={(e) => setSearchAddress(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Entrez votre ville ou adresse"
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all font-semibold flex items-center gap-2 disabled:opacity-50"
                >
                  <Search className="w-5 h-5" />
                  Chercher
                </button>
              </div>
            </div>

            {/* Point relais */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4">4. Point relais sélectionné</h2>
              {selectedPartner ? (
                <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
                  <p className="text-white font-semibold">{selectedPartner.name}</p>
                  <p className="text-white/80 text-sm">{selectedPartner.address}</p>
                  <p className="text-white/80 text-sm">
                    {selectedPartner.postal_code} {selectedPartner.city}
                  </p>
                </div>
              ) : (
                <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 text-yellow-200">
                  Cliquez sur un marqueur sur la carte →
                </div>
              )}
            </div>

            <button
              onClick={handleCreateOrder}
              disabled={!speed || !weight || !selectedPartner}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              Créer la commande
            </button>
          </div>

          {/* Carte */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-6 h-6 text-purple-400" />
              <h2 className="text-xl font-bold text-white">Points relais près de vous</h2>
              <span className="ml-auto bg-purple-500/30 text-purple-200 px-3 py-1 rounded-full text-sm font-semibold">
                {partners.length} pressings
              </span>
            </div>

            <div className="h-[600px] rounded-xl overflow-hidden">
              <MapContainer
                center={center}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; OpenStreetMap'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapUpdater center={center} />

                {partners.map((partner) => (
                  <Marker
                    key={partner.id}
                    position={[partner.lat, partner.lon]}
                    eventHandlers={{
                      click: () => {
                        setSelectedPartner(partner);
                      },
                    }}
                  >
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-bold text-base mb-1">{partner.name}</h3>
                        <p className="text-sm text-gray-600">{partner.address}</p>
                        <p className="text-sm text-gray-600">
                          {partner.postal_code} {partner.city}
                        </p>
                        <button
                          onClick={() => setSelectedPartner(partner)}
                          className="mt-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-1 rounded text-sm font-semibold"
                        >
                          Sélectionner
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
REACTEOF

echo "✅ NewOrder.tsx mis à jour avec affichage des pressings"
