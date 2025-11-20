import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { supabase } from '../lib/supabase';
import { ArrowLeft, MapPin, Star, Phone, Mail, Clock, Navigation } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix icône Leaflet
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
  phone?: string;
  email?: string;
  opening_hours?: string;
  price_per_kg: number;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  users?: {
    email: string;
  };
}

interface PartnerWithReviews extends Partner {
  average_rating: number;
  total_reviews: number;
  reviews?: Review[];
}

export default function PartnersMap() {
  const navigate = useNavigate();
  const [partners, setPartners] = useState<PartnerWithReviews[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<PartnerWithReviews | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<[number, number]>([48.8566, 2.3522]); // Paris par défaut

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
          console.log('Geolocation error:', error);
        }
      );
    }
  };

  const loadPartners = async () => {
    try {
      // Charger les pressings
      const { data: partnersData, error: partnersError } = await supabase
        .from('partners')
        .select('*');

      if (partnersError) throw partnersError;

      // Charger les avis pour chaque pressing
      const partnersWithReviews = await Promise.all(
        (partnersData || []).map(async (partner) => {
          const { data: reviews, error: reviewsError } = await supabase
            .from('reviews')
            .select(`
              id,
              rating,
              comment,
              created_at,
              users:user_id (email)
            `)
            .eq('partner_id', partner.id)
            .order('created_at', { ascending: false });

          if (reviewsError) {
            console.error('Reviews error:', reviewsError);
          }

          const totalReviews = reviews?.length || 0;
          const averageRating = totalReviews > 0
            ? reviews!.reduce((sum, r) => sum + r.rating, 0) / totalReviews
            : 0;

          return {
            ...partner,
            average_rating: averageRating,
            total_reviews: totalReviews,
            reviews: reviews || []
          };
        })
      );

      setPartners(partnersWithReviews);
    } catch (error: any) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPartners = partners.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.postal_code.includes(searchQuery)
  );

  const handleSelectPartner = (partner: PartnerWithReviews) => {
    setSelectedPartner(partner);
  };

  const handleOrderClick = () => {
    if (selectedPartner) {
      navigate('/new-order', { state: { selectedPartner } });
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= Math.round(rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-slate-300'
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Chargement des pressings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4 z-10">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour
          </button>
          <input
            type="text"
            placeholder="Rechercher par ville, code postal..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-blue-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 flex overflow-hidden">
        {/* Liste des pressings */}
        <div className="w-full md:w-1/3 overflow-y-auto border-r border-slate-200 bg-slate-50 p-4">
          <h2 className="text-2xl font-black text-slate-900 mb-4">
            {filteredPartners.length} pressing{filteredPartners.length > 1 ? 's' : ''} trouvé{filteredPartners.length > 1 ? 's' : ''}
          </h2>

          <div className="space-y-3">
            {filteredPartners.map((partner) => (
              <div
                key={partner.id}
                onClick={() => handleSelectPartner(partner)}
                className={`bg-white rounded-xl p-4 cursor-pointer transition-all hover:shadow-lg border-2 ${
                  selectedPartner?.id === partner.id
                    ? 'border-blue-600 shadow-lg'
                    : 'border-slate-200'
                }`}
              >
                <h3 className="font-bold text-lg text-slate-900 mb-1">
                  {partner.name}
                </h3>
                
                {/* Note moyenne */}
                {partner.total_reviews > 0 && (
                  <div className="flex items-center gap-2 mb-2">
                    {renderStars(partner.average_rating)}
                    <span className="text-sm text-slate-600">
                      {partner.average_rating.toFixed(1)} ({partner.total_reviews} avis)
                    </span>
                  </div>
                )}

                <p className="text-sm text-slate-600 mb-2 flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  {partner.address}, {partner.postal_code} {partner.city}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                  <div className="text-sm text-slate-500">
                    À partir de <strong className="text-blue-600">3,50€/kg</strong>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectPartner(partner);
                      handleOrderClick();
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-bold text-sm hover:shadow-lg transition"
                  >
                    Commander
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carte */}
        <div className="hidden md:block flex-1 relative">
          <MapContainer
            center={userLocation}
            zoom={12}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filteredPartners.map((partner) => (
              <Marker
                key={partner.id}
                position={[partner.latitude, partner.longitude]}
                eventHandlers={{
                  click: () => handleSelectPartner(partner),
                }}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-bold text-slate-900 mb-1">{partner.name}</h3>
                    {partner.total_reviews > 0 && (
                      <div className="flex items-center gap-1 mb-2">
                        {renderStars(partner.average_rating)}
                        <span className="text-xs text-slate-600 ml-1">
                          ({partner.total_reviews})
                        </span>
                      </div>
                    )}
                    <p className="text-sm text-slate-600 mb-2">{partner.address}</p>
                    <button
                      onClick={handleOrderClick}
                      className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition"
                    >
                      Commander
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* Panel détails pressing sélectionné (desktop) */}
      {selectedPartner && (
        <div className="hidden md:block fixed bottom-0 right-0 w-96 bg-white shadow-2xl rounded-t-3xl p-6 max-h-96 overflow-y-auto z-20">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-1">
                {selectedPartner.name}
              </h2>
              {selectedPartner.total_reviews > 0 && (
                <div className="flex items-center gap-2 mb-2">
                  {renderStars(selectedPartner.average_rating)}
                  <span className="text-sm text-slate-600">
                    {selectedPartner.average_rating.toFixed(1)} ({selectedPartner.total_reviews} avis)
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={() => setSelectedPartner(null)}
              className="text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3 mb-4 text-sm">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <span className="text-slate-700">
                {selectedPartner.address}, {selectedPartner.postal_code} {selectedPartner.city}
              </span>
            </div>

            {selectedPartner.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-600" />
                <a href={`tel:${selectedPartner.phone}`} className="text-blue-600 hover:underline">
                  {selectedPartner.phone}
                </a>
              </div>
            )}

            {selectedPartner.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-600" />
                <a href={`mailto:${selectedPartner.email}`} className="text-blue-600 hover:underline">
                  {selectedPartner.email}
                </a>
              </div>
            )}

            {selectedPartner.opening_hours && (
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700">{selectedPartner.opening_hours}</span>
              </div>
            )}
          </div>

          {/* Derniers avis */}
          {selectedPartner.reviews && selectedPartner.reviews.length > 0 && (
            <div className="border-t border-slate-200 pt-4 mb-4">
              <h3 className="font-bold text-slate-900 mb-3">Derniers avis</h3>
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {selectedPartner.reviews.slice(0, 3).map((review) => (
                  <div key={review.id} className="bg-slate-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      {renderStars(review.rating)}
                      <span className="text-xs text-slate-500">
                        {new Date(review.created_at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="text-sm text-slate-700 italic">"{review.comment}"</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleOrderClick}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold hover:shadow-xl transition"
          >
            Commander ici
          </button>
        </div>
      )}
    </div>
  );
}
