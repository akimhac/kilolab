import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { supabase } from '../lib/supabase';
import { MapPin, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface Partner {
  id: string;
  business_name: string;
  address: string;
  city: string;
  postal_code: string;
  latitude: number;
  longitude: number;
  phone?: string;
  email?: string;
}

const customIcon = L.divIcon({
  className: 'custom-marker',
  html: `<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); width: 40px; height: 40px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.3);"><div style="transform: rotate(45deg); color: white; font-size: 20px;">📍</div></div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

export default function PartnersMap() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = async () => {
    console.log('🔄 Chargement des pressings...');
    setLoading(true);
    setError('');

    try {
      const { data, error: fetchError } = await supabase
        .from('partners')
        .select('*')
        .eq('is_active', true)
        .not('latitude', 'is', null)
        .not('longitude', 'is', null);

      console.log('📊 Résultat Supabase:', { data, error: fetchError });

      if (fetchError) {
        console.error('❌ Erreur Supabase:', fetchError);
        throw fetchError;
      }

      if (!data || data.length === 0) {
        setError('Aucun pressing trouvé');
        console.warn('⚠️ Aucune donnée retournée');
      } else {
        console.log(`✅ ${data.length} pressings chargés`);
        setPartners(data);
      }
    } catch (err: any) {
      console.error('❌ Erreur:', err);
      setError(err.message || 'Erreur de chargement');
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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">⚠️ {error}</div>
          <button
            onClick={loadPartners}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <MapPin className="w-10 h-10 text-purple-400" />
            Carte des Partenaires
          </h1>
          <p className="text-white/80 text-xl">
            {partners.length} pressing{partners.length > 1 ? 's' : ''} partenaire
            {partners.length > 1 ? 's' : ''} en France et Belgique
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 h-[600px]">
          <MapContainer
            center={[46.603354, 1.888334]}
            zoom={6}
            style={{ height: '100%', width: '100%', borderRadius: '12px' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            {partners.map((partner) => (
              <Marker
                key={partner.id}
                position={[partner.latitude, partner.longitude]}
                icon={customIcon}
                eventHandlers={{
                  click: () => setSelectedPartner(partner),
                }}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-bold text-lg">{partner.business_name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{partner.address}</p>
                    <p className="text-sm text-gray-600">
                      {partner.postal_code} {partner.city}
                    </p>
                    {partner.phone && (
                      <p className="text-sm text-purple-600 mt-2">{partner.phone}</p>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <AnimatePresence>
          {selectedPartner && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50"
              onClick={() => setSelectedPartner(null)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-white rounded-2xl p-6 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-bold text-slate-900">
                    {selectedPartner.business_name}
                  </h3>
                  <button
                    onClick={() => setSelectedPartner(null)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="space-y-3 text-slate-600">
                  <p>{selectedPartner.address}</p>
                  <p>
                    {selectedPartner.postal_code} {selectedPartner.city}
                  </p>
                  {selectedPartner.phone && <p>📞 {selectedPartner.phone}</p>}
                  {selectedPartner.email && <p>✉️ {selectedPartner.email}</p>}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
