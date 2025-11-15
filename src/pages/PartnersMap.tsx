import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { supabase } from '../lib/supabase';
import { MapPin, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Partner {
  id: string;
  name: string;
  address: string;
  city: string;
  postal_code: string;
  lat: number;
  lon: number;
  phone?: string;
  email?: string;
}

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
        .not('lat', 'is', null)
        .not('lon', 'is', null)
        .eq('is_active', true);

      console.log('📊 Résultat:', data);

      if (fetchError) {
        console.error('❌ Erreur:', fetchError);
        throw fetchError;
      }

      if (!data || data.length === 0) {
        setError('Aucun pressing trouvé');
        console.warn('⚠️ Aucune donnée');
      } else {
        console.log(`✅ ${data.length} pressings chargés`);
        setPartners(data);
      }
    } catch (err: any) {
      console.error('💥 Erreur:', err);
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
            {partners.length} pressing{partners.length > 1 ? 's' : ''} partenaire{partners.length > 1 ? 's' : ''}
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
              attribution='&copy; OpenStreetMap'
            />
            {partners.map((partner) => (
              <Marker
                key={partner.id}
                position={[partner.lat, partner.lon]}
                eventHandlers={{
                  click: () => setSelectedPartner(partner),
                }}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-bold text-lg">{partner.name}</h3>
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
                    {selectedPartner.name}
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