import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { MapPin, Star, Clock, Euro, Search, Filter, Navigation, ArrowLeft, Loader2 } from 'lucide-react';

interface Partner {
  id: string;
  name: string;
  address: string;
  city: string;
  postal_code: string;
  latitude: number;
  longitude: number;
  rating: number;
  review_count: number;
  is_active: boolean;
}

export default function PartnersMap() {
  const navigate = useNavigate();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationEnabled, setLocationEnabled] = useState(false);

  // Charger les pressings - OPTIMISÉ (limite 100, seulement colonnes nécessaires)
  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const { data, error } = await supabase
          .from('partners')
          .select('id, name, address, city, postal_code, latitude, longitude, rating, review_count, is_active')
          .eq('is_active', true)
          .limit(100);

        if (error) throw error;
        setPartners(data || []);
        setFilteredPartners(data || []);
      } catch (err) {
        console.error('Erreur chargement:', err);
        setPartners([]);
        setFilteredPartners([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  // Géolocalisation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationEnabled(true);
        },
        () => setLocationEnabled(false)
      );
    }
  }, []);

  // Filtrer par recherche
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPartners(partners);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = partners.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.city.toLowerCase().includes(query) ||
      p.postal_code.includes(query)
    );
    setFilteredPartners(filtered);
  }, [searchQuery, partners]);

  // Calculer distance
  const calculateDistance = (lat: number, lng: number): string => {
    if (!userLocation) return '';
    const R = 6371;
    const dLat = (lat - userLocation.lat) * Math.PI / 180;
    const dLon = (lng - userLocation.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(lat * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c;
    return d < 1 ? `${Math.round(d * 1000)}m` : `${d.toFixed(1)}km`;
  };

  // Trier par distance si géoloc activée
  const sortedPartners = locationEnabled && userLocation
    ? [...filteredPartners].sort((a, b) => {
        const distA = Math.hypot(a.latitude - userLocation.lat, a.longitude - userLocation.lng);
        const distB = Math.hypot(b.latitude - userLocation.lat, b.longitude - userLocation.lng);
        return distA - distB;
      })
    : filteredPartners;

  const handleSelectPartner = (partner: Partner) => {
    sessionStorage.setItem('selectedPartner', JSON.stringify(partner));
    navigate('/new-order');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
                <ArrowLeft className="w-5 h-5" />
                Retour
              </button>
            </div>
            <Link to="/" className="text-xl font-bold text-green-600">Kilolab</Link>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      {/* Search */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, ville, code postal..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center justify-between mt-4">
          <p className="text-slate-600">
            <span className="font-semibold">{sortedPartners.length}</span> pressings trouvés
          </p>
          {locationEnabled && (
            <div className="flex items-center gap-2 text-green-600">
              <Navigation className="w-4 h-4" />
              <span className="text-sm">Position activée</span>
            </div>
          )}
        </div>
      </div>

      {/* Liste */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-green-500 animate-spin mb-4" />
            <p className="text-slate-600">Chargement des pressings...</p>
          </div>
        ) : sortedPartners.length === 0 ? (
          <div className="text-center py-20">
            <MapPin className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Aucun pressing trouvé</h3>
            <p className="text-slate-600">Essayez de modifier vos critères de recherche</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedPartners.slice(0, 50).map((partner) => (
              <div
                key={partner.id}
                className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition cursor-pointer border border-slate-100"
                onClick={() => handleSelectPartner(partner)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-slate-900 line-clamp-1">{partner.name}</h3>
                  {locationEnabled && partner.latitude && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      {calculateDistance(partner.latitude, partner.longitude)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-slate-600 text-sm mb-2">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="line-clamp-1">{partner.address}, {partner.postal_code} {partner.city}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium">{partner.rating?.toFixed(1) || '4.5'}</span>
                    <span className="text-slate-400 text-sm">({partner.review_count || 0})</span>
                  </div>
                  <div className="flex items-center gap-1 text-green-600 font-semibold">
                    <Euro className="w-4 h-4" />
                    <span>3€/kg</span>
                  </div>
                </div>

                <button className="w-full mt-3 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition">
                  Commander
                </button>
              </div>
            ))}
          </div>
        )}

        {sortedPartners.length > 50 && (
          <p className="text-center text-slate-500 mt-6">
            Affichage des 50 premiers résultats. Utilisez la recherche pour affiner.
          </p>
        )}
      </div>
    </div>
  );
}
