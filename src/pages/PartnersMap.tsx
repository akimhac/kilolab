import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { ArrowLeft, MapPin, Phone, Mail, Star, Navigation } from 'lucide-react';
import { supabase } from '../lib/supabase';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import toast from 'react-hot-toast';
import PartnerPendingModal from '../components/PartnerPendingModal';

// Fix icônes Leaflet
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
  phone?: string;
  email?: string;
  latitude: number;
  longitude: number;
  rating?: number;
  is_active: boolean;
}

export default function PartnersMap() {
  const navigate = useNavigate();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<[number, number]>([48.8566, 2.3522]); // Paris par défaut
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [pendingPartnerName, setPendingPartnerName] = useState('');

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
        (error) => {
          console.log('Géolocalisation refusée, utilisation Paris par défaut');
        }
      );
    }
  };

  const loadPartners = async () => {
    try {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .order('name');

      if (error) throw error;
      setPartners(data || []);
    } catch (error: any) {
      console.error('Erreur chargement pressings:', error);
      toast.error('Erreur de chargement des pressings');
    } finally {
      setLoading(false);
    }
  };

  const handlePartnerClick = (partner: Partner) => {
    setSelectedPartner(partner);
    
    // Si pressing inactif, afficher modal
    if (!partner.is_active) {
      setPendingPartnerName(partner.name);
      setShowPendingModal(true);
    }
  };

  const handleOrderClick = (partner: Partner) => {
    if (!partner.is_active) {
      setPendingPartnerName(partner.name);
      setShowPendingModal(true);
      return;
    }

    // Vérifier si user connecté
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        toast.error('Connectez-vous pour passer commande');
        navigate('/login');
        return;
      }

      // Rediriger vers page commande
      navigate('/new-order', { state: { partner } });
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-semibold">Chargement de la carte...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-[1000]">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition"
            >
              <ArrowLeft className="w-5 h-5" />
              Retour
            </button>
            <h1 className="text-xl font-black text-slate-900">
              Trouvez votre pressing
            </h1>
            <div className="w-20"></div>
          </div>
        </div>
      </nav>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-73px)]">
        {/* Liste des pressings */}
        <div className="w-full lg:w-1/3 overflow-y-auto p-4 bg-slate-50">
          <div className="mb-4">
            <p className="text-sm text-slate-600 mb-2">
              <strong>{partners.length}</strong> pressings trouvés
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Actif</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span>En validation</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {partners.map((partner) => (
              <div
                key={partner.id}
                onClick={() => handlePartnerClick(partner)}
                className={`bg-white rounded-xl p-4 cursor-pointer transition-all ${
                  selectedPartner?.id === partner.id
                    ? 'ring-2 ring-blue-600 shadow-lg'
                    : 'hover:shadow-md'
                } ${!partner.is_active ? 'opacity-75' : ''}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-slate-900">{partner.name}</h3>
                      {!partner.is_active && (
                        <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">
                          En validation
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600">
                      {partner.address}, {partner.city}
                    </p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${partner.is_active ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                </div>

                {partner.rating && (
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold">{partner.rating.toFixed(1)}</span>
                  </div>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOrderClick(partner);
                  }}
                  className={`w-full py-2 rounded-lg font-semibold transition ${
                    partner.is_active
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-lg'
                      : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {partner.is_active ? 'Commander' : 'Bientôt disponible'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Carte */}
        <div className="w-full lg:w-2/3 h-[400px] lg:h-full relative">
          <MapContainer
            center={userLocation}
            zoom={12}
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Marqueur position utilisateur */}
            <Marker position={userLocation}>
              <Popup>
                <div className="text-center">
                  <Navigation className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="font-bold">Votre position</p>
                </div>
              </Popup>
            </Marker>

            {/* Marqueurs pressings */}
            {partners.map((partner) => (
              <Marker
                key={partner.id}
                position={[partner.latitude, partner.longitude]}
                eventHandlers={{
                  click: () => handlePartnerClick(partner)
                }}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-slate-900">{partner.name}</h3>
                      {!partner.is_active && (
                        <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-bold rounded-full ml-2">
                          En validation
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 mb-3">
                      {partner.address}<br />
                      {partner.postal_code} {partner.city}
                    </p>

                    {partner.phone && (
                      <div className="flex items-center gap-2 text-sm mb-2">
                        <Phone className="w-4 h-4 text-slate-500" />
                        <a href={`tel:${partner.phone}`} className="text-blue-600 hover:underline">
                          {partner.phone}
                        </a>
                      </div>
                    )}

                    {partner.email && (
                      <div className="flex items-center gap-2 text-sm mb-3">
                        <Mail className="w-4 h-4 text-slate-500" />
                        <a href={`mailto:${partner.email}`} className="text-blue-600 hover:underline">
                          {partner.email}
                        </a>
                      </div>
                    )}

                    <button
                      onClick={() => handleOrderClick(partner)}
                      className={`w-full py-2 rounded-lg font-semibold transition ${
                        partner.is_active
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-lg'
                          : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      {partner.is_active ? 'Commander' : 'Bientôt disponible'}
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Légende */}
          <div className="absolute bottom-4 left-4 bg-white rounded-xl shadow-lg p-4 z-[400]">
            <p className="text-sm font-bold text-slate-900 mb-2">Légende</p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="text-slate-600">Pressings disponibles</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-slate-600">Actif</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-slate-600">En validation</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal pressing en validation */}
      <PartnerPendingModal
        isOpen={showPendingModal}
        onClose={() => setShowPendingModal(false)}
        partnerName={pendingPartnerName}
      />
    </div>
  );
}
