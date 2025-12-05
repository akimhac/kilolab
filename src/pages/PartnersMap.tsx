// src/pages/PartnersMap.tsx
// Liste des pressings avec filtres et géolocalisation - Prix 3€/kg standard

import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  MapPin, Star, Search, Filter, Navigation, ChevronDown,
  Loader2, Phone, Clock, Euro, ArrowLeft, X, SlidersHorizontal
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Partner {
  id: string;
  name: string;
  address: string;
  city: string;
  postal_code: string;
  phone?: string;
  email?: string;
  latitude?: number;
  longitude?: number;
  is_active: boolean;
  price_per_kg?: number;
  average_rating?: number;
  total_reviews?: number;
  distance?: number;
}

export default function PartnersMap() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  
  // Filtres
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minRating: 0,
    maxPrice: 10,
    city: '',
    sortBy: 'distance' as 'distance' | 'rating' | 'name' | 'price'
  });
  
  // Pagination
  const [displayCount, setDisplayCount] = useState(20);

  useEffect(() => {
    loadPartners();
    requestGeolocation();
  }, []);

  const loadPartners = async () => {
    try {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;

      // Charger les notes moyennes
      const partnersWithRatings = await Promise.all(
        (data || []).map(async (partner) => {
          const { data: reviews } = await supabase
            .from('reviews')
            .select('rating')
            .eq('partner_id', partner.id);

          const ratings = reviews || [];
          const avgRating = ratings.length > 0 
            ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length 
            : 0;

          return {
            ...partner,
            average_rating: Math.round(avgRating * 10) / 10,
            total_reviews: ratings.length,
            price_per_kg: partner.price_per_kg || 3 // 3€ par défaut
          };
        })
      );

      setPartners(partnersWithRatings);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const requestGeolocation = () => {
    if (!navigator.geolocation) {
      toast.error('Géolocalisation non supportée');
      return;
    }

    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setGeoLoading(false);
        toast.success('Position trouvée !');
      },
      (error) => {
        console.log('Géoloc refusée:', error);
        setGeoLoading(false);
      },
      { timeout: 10000 }
    );
  };

  // Calcul de distance (formule Haversine)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Filtrage et tri
  const filteredPartners = useMemo(() => {
    let result = partners.map(partner => ({
      ...partner,
      distance: userLocation && partner.latitude && partner.longitude
        ? calculateDistance(userLocation.lat, userLocation.lng, partner.latitude, partner.longitude)
        : undefined
    }));

    // Recherche textuelle
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.city.toLowerCase().includes(query) ||
        p.postal_code.includes(query) ||
        p.address.toLowerCase().includes(query)
      );
    }

    // Filtre par note
    if (filters.minRating > 0) {
      result = result.filter(p => (p.average_rating || 0) >= filters.minRating);
    }

    // Filtre par ville
    if (filters.city) {
      result = result.filter(p => 
        p.city.toLowerCase().includes(filters.city.toLowerCase())
      );
    }

    // Tri
    switch (filters.sortBy) {
      case 'distance':
        result.sort((a, b) => (a.distance || 9999) - (b.distance || 9999));
        break;
      case 'rating':
        result.sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0));
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price':
        result.sort((a, b) => (a.price_per_kg || 3) - (b.price_per_kg || 3));
        break;
    }

    return result;
  }, [partners, searchQuery, filters, userLocation]);

  const displayedPartners = filteredPartners.slice(0, displayCount);
  const hasMore = displayCount < filteredPartners.length;

  const handleSelectPartner = (partner: Partner) => {
    navigate('/new-order', { state: { selectedPartner: partner } });
  };

  // Liste des villes uniques
  const cities = useMemo(() => {
    const uniqueCities = [...new Set(partners.map(p => p.city))].sort();
    return uniqueCities;
  }, [partners]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-teal-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Chargement des pressings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="w-5 h-5" />
              Retour
            </button>
            <Link to="/" className="text-xl font-bold text-green-600">Kilolab</Link>
            <div className="w-16"></div>
          </div>

          {/* Barre de recherche */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par nom, ville, code postal..."
                className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-green-500 focus:outline-none"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-3 rounded-xl border-2 transition ${
                showFilters ? 'bg-green-500 border-green-500 text-white' : 'border-slate-200 text-slate-600'
              }`}
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
            <button
              onClick={requestGeolocation}
              disabled={geoLoading}
              className={`p-3 rounded-xl border-2 transition ${
                userLocation ? 'bg-green-500 border-green-500 text-white' : 'border-slate-200 text-slate-600'
              }`}
            >
              {geoLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Navigation className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Filtres */}
          {showFilters && (
            <div className="mt-3 p-4 bg-slate-50 rounded-xl space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {/* Tri */}
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Trier par</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters({...filters, sortBy: e.target.value as any})}
                    className="w-full p-2 border rounded-lg text-sm"
                  >
                    <option value="distance">Distance</option>
                    <option value="rating">Note</option>
                    <option value="name">Nom</option>
                    <option value="price">Prix</option>
                  </select>
                </div>

                {/* Note minimum */}
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Note minimum</label>
                  <select
                    value={filters.minRating}
                    onChange={(e) => setFilters({...filters, minRating: Number(e.target.value)})}
                    className="w-full p-2 border rounded-lg text-sm"
                  >
                    <option value="0">Tous</option>
                    <option value="3">3+ étoiles</option>
                    <option value="4">4+ étoiles</option>
                    <option value="4.5">4.5+ étoiles</option>
                  </select>
                </div>

                {/* Ville */}
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Ville</label>
                  <select
                    value={filters.city}
                    onChange={(e) => setFilters({...filters, city: e.target.value})}
                    className="w-full p-2 border rounded-lg text-sm"
                  >
                    <option value="">Toutes</option>
                    {cities.slice(0, 50).map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                {/* Reset */}
                <div className="flex items-end">
                  <button
                    onClick={() => setFilters({ minRating: 0, maxPrice: 10, city: '', sortBy: 'distance' })}
                    className="w-full p-2 text-sm text-green-600 hover:bg-green-50 rounded-lg transition"
                  >
                    Réinitialiser
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Résultats */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-slate-600">
            <strong className="text-slate-900">{filteredPartners.length}</strong> pressings trouvés
          </p>
          {userLocation && (
            <span className="text-sm text-green-600 flex items-center gap-1">
              <Navigation className="w-4 h-4" />
              Position activée
            </span>
          )}
        </div>

        {/* Liste */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedPartners.map((partner) => (
            <div
              key={partner.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden border border-slate-100"
            >
              <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 text-lg">{partner.name}</h3>
                    <p className="text-sm text-slate-600 flex items-center gap-1 mt-1">
                      <MapPin className="w-4 h-4" />
                      {partner.city} ({partner.postal_code})
                    </p>
                  </div>
                  {partner.distance !== undefined && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                      {partner.distance < 1 
                        ? `${Math.round(partner.distance * 1000)}m` 
                        : `${partner.distance.toFixed(1)}km`
                      }
                    </span>
                  )}
                </div>

                {/* Adresse */}
                <p className="text-sm text-slate-500 mb-3">{partner.address}</p>

                {/* Stats */}
                <div className="flex items-center gap-4 mb-4">
                  {/* Note */}
                  <div className="flex items-center gap-1">
                    <Star className={`w-4 h-4 ${
                      (partner.average_rating || 0) > 0 ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'
                    }`} />
                    <span className="text-sm font-medium">
                      {(partner.average_rating || 0) > 0 ? partner.average_rating?.toFixed(1) : '-'}
                    </span>
                    <span className="text-xs text-slate-400">
                      ({partner.total_reviews || 0} avis)
                    </span>
                  </div>

                  {/* Prix */}
                  <div className="flex items-center gap-1 text-green-600">
                    <Euro className="w-4 h-4" />
                    <span className="text-sm font-bold">{partner.price_per_kg || 3}€/kg</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSelectPartner(partner)}
                    className="flex-1 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition"
                  >
                    Commander
                  </button>
                  {partner.phone && (
                    <a
                      href={`tel:${partner.phone}`}
                      className="p-3 border-2 border-slate-200 rounded-xl hover:bg-slate-50 transition"
                    >
                      <Phone className="w-5 h-5 text-slate-600" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pas de résultats */}
        {filteredPartners.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Aucun pressing trouvé</h3>
            <p className="text-slate-600 mb-4">Essayez de modifier vos critères de recherche</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilters({ minRating: 0, maxPrice: 10, city: '', sortBy: 'distance' });
              }}
              className="text-green-600 font-medium hover:underline"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}

        {/* Charger plus */}
        {hasMore && (
          <div className="text-center mt-8">
            <button
              onClick={() => setDisplayCount(prev => prev + 20)}
              className="px-8 py-3 bg-white border-2 border-green-500 text-green-600 rounded-xl font-semibold hover:bg-green-50 transition"
            >
              Charger plus ({filteredPartners.length - displayCount} restants)
            </button>
          </div>
        )}
      </div>

      {/* Footer info */}
      <div className="bg-green-50 py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-green-800">
            💡 <strong>Tarif unique : 3€/kg</strong> (Standard) ou 5€/kg (Express) - 
            Jusqu'à 90% d'économie par rapport au pressing traditionnel !
          </p>
        </div>
      </div>
    </div>
  );
}
