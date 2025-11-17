import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft, MapPin, Phone, Clock, Euro } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

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
  latitude: number;
  longitude: number;
  phone: string;
  email: string;
  opening_hours: any;
  price_per_kg: number;
}

export default function PartnersMap() {
  const navigate = useNavigate();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number]>([48.8566, 2.3522]);

  useEffect(() => {
    loadPartners();
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        () => {
          console.log('Geolocation non disponible');
        }
      );
    }
  };

  const loadPartners = async () => {
    try {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .limit(50);

      if (error) throw error;
      setPartners(data || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async (partner: Partner) => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate('/login', { 
        state: { 
          from: '/partners-map',
          partnerId: partner.id,
          message: 'Connectez-vous pour créer une commande'
        } 
      });
    } else {
      navigate('/new-order', { 
        state: { 
          selectedPartner: partner,
        } 
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-semibold">Chargement de la carte...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-white border-b shadow-lg px-4 py-4 flex items-center justify-between z-10">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour
        </button>
        <div className="text-sm text-slate-600 font-semibold">
          <MapPin className="w-4 h-4 inline mr-1" />
          {partners.length} pressings disponibles
        </div>
      </div>

      <div className="flex-1 flex">
        <div className="flex-1 relative">
          <MapContainer
            center={userLocation}
            zoom={13}
            className="h-full w-full"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap'
            />
            {partners.map((partner) => (
              <Marker
                key={partner.id}
                position={[partner.latitude, partner.longitude]}
                eventHandlers={{
                  click: () => setSelectedPartner(partner),
                }}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-bold text-lg mb-2">{partner.name}</h3>
                    <p className="text-sm text-slate-600 mb-2">{partner.address}</p>
                    <button
                      onClick={() => handleCreateOrder(partner)}
                      className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition text-sm font-semibold"
                    >
                      Choisir ce pressing
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div className="w-96 bg-white border-l shadow-xl overflow-y-auto">
          {selectedPartner ? (
            <div className="p-6">
              <button
                onClick={() => setSelectedPartner(null)}
                className="text-sm text-purple-600 hover:text-purple-700 mb-4 font-semibold"
              >
                ← Voir tous les pressings
              </button>

              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {selectedPartner.name}
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-slate-700">{selectedPartner.address}</p>
                    <p className="text-slate-600">{selectedPartner.postal_code} {selectedPartner.city}</p>
                  </div>
                </div>

                {selectedPartner.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-purple-600" />
                    <a href={`tel:${selectedPartner.phone}`} className="text-purple-600 hover:underline font-semibold">
                      {selectedPartner.phone}
                    </a>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Euro className="w-5 h-5 text-purple-600" />
                  <p className="text-lg font-bold text-purple-600">
                    À partir de 5€/kg
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-purple-600 mt-1" />
                  <div className="text-sm text-slate-600">
                    <p className="font-semibold mb-1">Horaires</p>
                    <p>Lun-Ven: 8h-19h</p>
                    <p>Sam: 9h-18h</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleCreateOrder(selectedPartner)}
                className="w-full py-4 rounded-2xl font-bold text-lg text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-2xl transition-all transform hover:scale-105"
              >
                Créer ma commande
              </button>

              <p className="text-xs text-slate-500 mt-4 text-center">
                Vous pourrez choisir votre formule à l'étape suivante
              </p>
            </div>
          ) : (
            <div className="p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Pressings à proximité
              </h2>
              <div className="space-y-4">
                {partners.slice(0, 10).map((partner) => (
                  <div
                    key={partner.id}
                    onClick={() => setSelectedPartner(partner)}
                    className="p-4 border-2 border-slate-200 rounded-xl hover:border-purple-500 hover:shadow-md transition cursor-pointer"
                  >
                    <h3 className="font-bold text-slate-900 mb-2">{partner.name}</h3>
                    <p className="text-sm text-slate-600 mb-2">{partner.city}</p>
                    <p className="text-lg font-bold text-purple-600">
                      À partir de 5€/kg
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
