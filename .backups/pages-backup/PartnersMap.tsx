import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { supabase } from '../lib/supabase'; // 
import { MapPin, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default marker icon
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
  latitude: number | null;
  longitude: number | null;
  lat: number | null;
  lon: number | null;
  phone?: string;
  email?: string;
}

export default function PartnersMap() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    postal_code: '',
    phone: '',
    email: '',
  });

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    console.log('🔄 Chargement des pressings...');
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .eq('is_active', true);

      console.log('📊 Données reçues:', data);

      if (error) {
        console.error('❌ Erreur:', error);
        throw error;
      }

      // Filtrer les partenaires avec coordonnées
      const partnersWithCoords = (data || []).filter((p: Partner) =>  // ← CORRECTION ICI
        (p.latitude && p.longitude) || (p.lat && p.lon)
      );

      console.log(`✅ ${partnersWithCoords.length} pressings avec coordonnées`);
      setPartners(partnersWithCoords);
    } catch (error) {
      console.error('Erreur chargement:', error);
      toast.error('Erreur de chargement des pressings');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { error } = await supabase
        .from('partners')
        .insert([formData]);

      if (error) throw error;

      toast.success('Demande envoyée avec succès !');
      setShowForm(false);
      setFormData({
        name: '',
        address: '',
        city: '',
        postal_code: '',
        phone: '',
        email: '',
      });
      fetchPartners();
    } catch (error: any) {
      console.error('Error:', error);
      toast.error("Erreur lors de l'envoi");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Chargement de la carte...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              <MapPin className="inline w-10 h-10 text-purple-400 mr-3" />
              Nos partenaires
            </h1>
            <p className="text-gray-400">
              {partners.length} pressing{partners.length > 1 ? 's' : ''} disponible{partners.length > 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition"
          >
            <Plus className="w-5 h-5" />
            Devenir partenaire
          </button>
        </div>

        {/* Partners List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 hover:border-purple-500/50 transition"
            >
              <h3 className="text-xl font-bold text-white mb-2">{partner.name}</h3>
              <p className="text-gray-300 text-sm mb-1">{partner.address}</p>
              <p className="text-gray-300 text-sm mb-3">
                {partner.postal_code} {partner.city}
              </p>
              {partner.phone && (
                <p className="text-gray-400 text-sm">📞 {partner.phone}</p>
              )}
              {partner.email && (
                <p className="text-gray-400 text-sm">✉️ {partner.email}</p>
              )}
            </div>
          ))}
        </div>

        {/* Map */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Carte interactive</h2>
          <div className="h-96 rounded-xl overflow-hidden">
            <MapContainer
              center={[46.603354, 1.888334]}
              zoom={6}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
              />
              {partners.map((partner) => {
                const lat = partner.latitude || partner.lat;
                const lon = partner.longitude || partner.lon;
                
                if (!lat || !lon) return null;

                return (
                  <Marker key={partner.id} position={[lat, lon]}>
                    <Popup>
                      <div className="p-2">
                        <strong className="text-lg">{partner.name}</strong>
                        <p className="text-sm mt-1">{partner.address}</p>
                        <p className="text-sm">{partner.postal_code} {partner.city}</p>
                        {partner.phone && <p className="text-sm mt-2">📞 {partner.phone}</p>}
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        </div>
      </div>

      {/* Partner Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-slate-800 to-purple-900 border border-purple-500 rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
              <h3 className="text-2xl font-bold text-white mb-6">Devenir partenaire</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Nom de l'établissement *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Adresse *</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Code postal *</label>
                    <input
                      type="text"
                      required
                      value={formData.postal_code}
                      onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Ville *</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Téléphone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition"
                >
                  Envoyer ma demande
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}