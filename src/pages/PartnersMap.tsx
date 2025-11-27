import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  ArrowLeft, MapPin, Phone, Euro, Search, ChevronDown, ChevronUp, 
  Building2, Star, Filter, X, Navigation, Loader2 
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Partner {
  id: string;
  name: string;
  address: string;
  city: string;
  postal_code: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  price_per_kg?: number;
  is_active?: boolean;
  average_rating?: number;
  total_reviews?: number;
  distance?: number;
}

export default function PartnersMap() {
  const navigate = useNavigate();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(50);
  const [sortBy, setSortBy] = useState<'city' | 'name' | 'price' | 'rating' | 'distance'>('city');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lon: number} | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  
  // Filtres
  const [filters, setFilters] = useState({
    minRating: 0,
    maxPrice: 10,
    city: '',
    postalCode: ''
  });

  useEffect(() => {
    loadAllPartners();
  }, []);

  // Demander la géolocalisation
  const requestLocation = () => {
    if (!navigator.geolocation) {
      toast.error('La géolocalisation n\'est pas supportée');
      return;
    }

    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
        setSortBy('distance');
        toast.success('Position détectée !');
        setGeoLoading(false);
      },
      (error) => {
        console.error('Erreur géoloc:', error);
        toast.error('Impossible de vous localiser');
        setGeoLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Calculer la distance entre 2 points (formule Haversine)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const loadAllPartners = async () => {
    setLoading(true);
    try {
      // Charger tous les pressings actifs
      const { data: partnersData, error } = await supabase
        .from('partners')
        .select('*')
        .eq('is_active', true)
        .order('city', { ascending: true });

      if (error) throw error;

      // Charger les notes moyennes
      const { data: ratingsData } = await supabase
        .from('reviews')
        .select('partner_id, rating');

      // Calculer la moyenne par partenaire
      const ratingsMap: Record<string, { sum: number; count: number }> = {};
      ratingsData?.forEach(r => {
        if (!ratingsMap[r.partner_id]) {
          ratingsMap[r.partner_id] = { sum: 0, count: 0 };
        }
        ratingsMap[r.partner_id].sum += r.rating;
        ratingsMap[r.partner_id].count += 1;
      });

      // Enrichir les partenaires avec les notes
      const enrichedPartners = partnersData?.map(p => ({
        ...p,
        average_rating: ratingsMap[p.id] 
          ? Math.round((ratingsMap[p.id].sum / ratingsMap[p.id].count) * 10) / 10 
          : null,
        total_reviews: ratingsMap[p.id]?.count || 0
      })) || [];

      console.log(`✅ ${enrichedPartners.length} pressings chargés`);
      setPartners(enrichedPartners);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur de chargement');
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

  // Filtrage et tri avec useMemo pour les performances
  const processedPartners = useMemo(() => {
    let result = [...partners];

    // Ajouter la distance si géoloc disponible
    if (userLocation) {
      result = result.map(p => ({
        ...p,
        distance: p.latitude && p.longitude 
          ? calculateDistance(userLocation.lat, userLocation.lon, p.latitude, p.longitude)
          : 9999
      }));
    }

    // Filtrage par recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.city?.toLowerCase().includes(query) ||
        p.name?.toLowerCase().includes(query) ||
        p.postal_code?.includes(query) ||
        p.address?.toLowerCase().includes(query)
      );
    }

    // Filtrage par filtres avancés
    if (filters.minRating > 0) {
      result = result.filter(p => (p.average_rating || 0) >= filters.minRating);
    }
    if (filters.maxPrice < 10) {
      result = result.filter(p => (p.price_per_kg || 0) <= filters.maxPrice);
    }
    if (filters.city) {
      result = result.filter(p => 
        p.city?.toLowerCase().includes(filters.city.toLowerCase())
      );
    }
    if (filters.postalCode) {
      result = result.filter(p => 
        p.postal_code?.startsWith(filters.postalCode)
      );
    }

    // Tri
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'city':
          comparison = (a.city || '').localeCompare(b.city || '');
          break;
        case 'name':
          comparison = (a.name || '').localeCompare(b.name || '');
          break;
        case 'price':
          comparison = (a.price_per_kg || 0) - (b.price_per_kg || 0);
          break;
        case 'rating':
          comparison = (b.average_rating || 0) - (a.average_rating || 0);
          break;
        case 'distance':
          comparison = (a.distance || 9999) - (b.distance || 9999);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [partners, searchQuery, filters, sortBy, sortOrder, userLocation]);

  // Grouper par ville
  const groupedByCity = useMemo(() => {
    return processedPartners.slice(0, visibleCount).reduce((acc, partner) => {
      const city = partner.city || 'Autre';
      if (!acc[city]) acc[city] = [];
      acc[city].push(partner);
      return acc;
    }, {} as Record<string, Partner[]>);
  }, [processedPartners, visibleCount]);

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder(field === 'rating' ? 'desc' : 'asc');
    }
  };

  const resetFilters = () => {
    setFilters({ minRating: 0, maxPrice: 10, city: '', postalCode: '' });
    setSearchQuery('');
  };

  const activeFiltersCount = [
    filters.minRating > 0,
    filters.maxPrice < 10,
    filters.city,
    filters.postalCode
  ].filter(Boolean).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-semibold">Chargement des pressings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header fixe */}
      <div className="bg-white border-b shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition font-semibold"
            >
              <ArrowLeft className="w-5 h-5" />
              Retour
            </button>
            <div className="text-lg font-bold text-purple-600">
              <Building2 className="w-5 h-5 inline mr-2" />
              {partners.length} pressings
            </div>
          </div>

          {/* Titre */}
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 text-center">
            Trouvez votre pressing
          </h1>

          {/* Barre de recherche + Géoloc */}
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher par ville, nom ou code postal..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setVisibleCount(50);
                }}
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-600 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
                </button>
              )}
            </div>
            
            {/* Bouton Géolocalisation */}
            <button
              onClick={requestLocation}
              disabled={geoLoading}
              className={`px-4 py-3 rounded-xl font-semibold flex items-center gap-2 transition ${
                userLocation 
                  ? 'bg-green-100 text-green-700 border-2 border-green-300' 
                  : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
              }`}
            >
              {geoLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Navigation className="w-5 h-5" />
              )}
              <span className="hidden sm:inline">
                {userLocation ? 'Localisé' : 'Me localiser'}
              </span>
            </button>

            {/* Bouton Filtres */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-3 rounded-xl font-semibold flex items-center gap-2 transition relative ${
                showFilters || activeFiltersCount > 0
                  ? 'bg-purple-600 text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Filter className="w-5 h-5" />
              <span className="hidden sm:inline">Filtres</span>
              {activeFiltersCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-pink-500 text-white text-xs rounded-full flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* Panneau de filtres */}
          {showFilters && (
            <div className="bg-slate-50 rounded-xl p-4 mb-4 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-800">Filtres avancés</h3>
                <button
                  onClick={resetFilters}
                  className="text-sm text-purple-600 hover:underline"
                >
                  Réinitialiser
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Note minimum */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Note minimum
                  </label>
                  <select
                    value={filters.minRating}
                    onChange={(e) => setFilters({...filters, minRating: Number(e.target.value)})}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-purple-500 focus:outline-none"
                  >
                    <option value={0}>Toutes les notes</option>
                    <option value={3}>3+ étoiles</option>
                    <option value={4}>4+ étoiles</option>
                    <option value={4.5}>4.5+ étoiles</option>
                  </select>
                </div>

                {/* Prix maximum */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Prix max/kg: {filters.maxPrice}€
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="10"
                    step="0.5"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({...filters, maxPrice: Number(e.target.value)})}
                    className="w-full accent-purple-600"
                  />
                </div>

                {/* Ville */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Ville
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Paris"
                    value={filters.city}
                    onChange={(e) => setFilters({...filters, city: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                {/* Code postal */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Code postal
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 75"
                    value={filters.postalCode}
                    onChange={(e) => setFilters({...filters, postalCode: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Boutons de tri */}
          <div className="flex gap-2 flex-wrap">
            {[
              { key: 'distance', label: 'Distance', show: !!userLocation },
              { key: 'city', label: 'Ville', show: true },
              { key: 'name', label: 'Nom', show: true },
              { key: 'price', label: 'Prix', show: true },
              { key: 'rating', label: 'Note', show: true }
            ].filter(s => s.show).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => toggleSort(key as typeof sortBy)}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1 transition ${
                  sortBy === key 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {label}
                {sortBy === key && (
                  sortOrder === 'asc' 
                    ? <ChevronUp className="w-4 h-4" /> 
                    : <ChevronDown className="w-4 h-4" />
                )}
              </button>
            ))}
          </div>

          {/* Compteur de résultats */}
          <div className="mt-3 text-sm text-slate-500">
            {processedPartners.length === partners.length 
              ? `${partners.length} pressings` 
              : `${processedPartners.length} résultats sur ${partners.length}`
            }
            {visibleCount < processedPartners.length && ` (${visibleCount} affichés)`}
          </div>
        </div>
      </div>

      {/* Liste des pressings */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {selectedPartner ? (
          /* Vue détaillée */
          <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 max-w-2xl mx-auto">
            <button
              onClick={() => setSelectedPartner(null)}
              className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6 font-semibold"
            >
              <ArrowLeft className="w-5 h-5" />
              Retour à la liste
            </button>

            <div className="flex items-start justify-between mb-4">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">{selectedPartner.name}</h2>
              {selectedPartner.average_rating && (
                <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="font-bold text-yellow-700">{selectedPartner.average_rating}</span>
                  <span className="text-sm text-yellow-600">({selectedPartner.total_reviews})</span>
                </div>
              )}
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-slate-700">{selectedPartner.address}</p>
                  <p className="text-slate-700">{selectedPartner.postal_code} {selectedPartner.city}</p>
                  {selectedPartner.distance && (
                    <p className="text-sm text-purple-600 font-semibold mt-1">
                      📍 À {selectedPartner.distance.toFixed(1)} km de vous
                    </p>
                  )}
                </div>
              </div>

              {selectedPartner.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-purple-600 flex-shrink-0" />
                  <a href={`tel:${selectedPartner.phone}`} className="text-purple-600 hover:underline">
                    {selectedPartner.phone}
                  </a>
                </div>
              )}

              {selectedPartner.price_per_kg && (
                <div className="flex items-center gap-3">
                  <Euro className="w-5 h-5 text-purple-600 flex-shrink-0" />
                  <span className="text-2xl font-bold text-purple-600">
                    {selectedPartner.price_per_kg}€/kg
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={() => handleCreateOrder(selectedPartner)}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold text-lg hover:shadow-xl transition transform hover:scale-[1.02]"
            >
              Commander chez ce pressing
            </button>
          </div>
        ) : (
          /* Liste groupée par ville */
          <div className="space-y-8">
            {sortBy === 'distance' && userLocation ? (
              // Affichage liste simple triée par distance
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {processedPartners.slice(0, visibleCount).map((partner) => (
                  <PartnerCard 
                    key={partner.id} 
                    partner={partner} 
                    onSelect={() => setSelectedPartner(partner)}
                    onOrder={() => handleCreateOrder(partner)}
                    showDistance={!!userLocation}
                  />
                ))}
              </div>
            ) : (
              // Affichage groupé par ville
              Object.entries(groupedByCity).map(([city, cityPartners]) => (
                <div key={city}>
                  <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2 sticky top-[280px] bg-gradient-to-r from-purple-50 to-pink-50 py-2 z-10">
                    <MapPin className="w-5 h-5 text-purple-600" />
                    {city}
                    <span className="text-sm font-normal text-slate-500">
                      ({cityPartners.length})
                    </span>
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cityPartners.map((partner) => (
                      <PartnerCard 
                        key={partner.id} 
                        partner={partner} 
                        onSelect={() => setSelectedPartner(partner)}
                        onOrder={() => handleCreateOrder(partner)}
                        showDistance={!!userLocation}
                      />
                    ))}
                  </div>
                </div>
              ))
            )}

            {/* Bouton "Charger plus" */}
            {visibleCount < processedPartners.length && (
              <div className="text-center py-8">
                <button
                  onClick={() => setVisibleCount(prev => prev + 50)}
                  className="px-8 py-4 bg-purple-600 text-white rounded-2xl font-bold text-lg hover:bg-purple-700 transition shadow-lg hover:shadow-xl"
                >
                  Afficher plus
                  <span className="ml-2 text-purple-200">
                    ({processedPartners.length - visibleCount} restants)
                  </span>
                </button>
              </div>
            )}

            {/* Message si aucun résultat */}
            {processedPartners.length === 0 && (
              <div className="text-center py-16">
                <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-600 mb-2">Aucun pressing trouvé</h3>
                <p className="text-slate-500 mb-4">Essayez d'autres critères de recherche</p>
                <button
                  onClick={resetFilters}
                  className="text-purple-600 font-semibold hover:underline"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Composant carte partenaire
function PartnerCard({ 
  partner, 
  onSelect, 
  onOrder,
  showDistance 
}: { 
  partner: Partner; 
  onSelect: () => void;
  onOrder: () => void;
  showDistance: boolean;
}) {
  return (
    <div
      onClick={onSelect}
      className="bg-white p-5 rounded-2xl border-2 border-slate-100 hover:border-purple-400 hover:shadow-lg transition cursor-pointer group"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-slate-900 group-hover:text-purple-600 transition line-clamp-1">
          {partner.name}
        </h3>
        <div className="flex items-center gap-2">
          {partner.average_rating && (
            <div className="flex items-center gap-1 text-sm">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="font-semibold">{partner.average_rating}</span>
            </div>
          )}
          <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0" title="Actif"></div>
        </div>
      </div>
      
      <p className="text-sm text-slate-500 mb-1 line-clamp-1">
        {partner.address}
      </p>
      <p className="text-sm text-slate-600 mb-2">
        {partner.postal_code} {partner.city}
      </p>

      {showDistance && partner.distance && (
        <p className="text-sm text-purple-600 font-semibold mb-2">
          📍 {partner.distance.toFixed(1)} km
        </p>
      )}
      
      <div className="flex items-center justify-between mt-3">
        {partner.price_per_kg && (
          <p className="text-lg font-bold text-purple-600">
            {partner.price_per_kg}€/kg
          </p>
        )}
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOrder();
          }}
          className="px-4 py-2 bg-purple-100 text-purple-700 rounded-xl font-semibold hover:bg-purple-600 hover:text-white transition text-sm"
        >
          Commander
        </button>
      </div>
    </div>
  );
}
