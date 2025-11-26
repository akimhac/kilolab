import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft, MapPin, Phone, Euro, Search, ChevronDown, ChevronUp, Building2 } from 'lucide-react';

interface Partner {
  id: string;
  name: string;
  address: string;
  city: string;
  postal_code: string;
  phone?: string;
  email?: string;
  price_per_kg?: number;
  is_active?: boolean;
}

export default function PartnersMap() {
  const navigate = useNavigate();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(50);
  const [sortBy, setSortBy] = useState<'city' | 'name' | 'price'>('city');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    loadAllPartners();
  }, []);

  const loadAllPartners = async () => {
    setLoading(true);
    try {
      // Charger TOUS les pressings sans limite
      const { data, error, count } = await supabase
        .from('partners')
        .select('*', { count: 'exact' })
        .order('city', { ascending: true });

      if (error) throw error;
      
      console.log(`✅ ${data?.length} pressings chargés (total: ${count})`);
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

  // Filtrage par recherche
  const filteredPartners = partners.filter(p => {
    const query = searchQuery.toLowerCase();
    return (
      p.city?.toLowerCase().includes(query) ||
      p.name?.toLowerCase().includes(query) ||
      p.postal_code?.includes(query) ||
      p.address?.toLowerCase().includes(query)
    );
  });

  // Tri
  const sortedPartners = [...filteredPartners].sort((a, b) => {
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
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Grouper par ville
  const groupedByCity = sortedPartners.slice(0, visibleCount).reduce((acc, partner) => {
    const city = partner.city || 'Autre';
    if (!acc[city]) acc[city] = [];
    acc[city].push(partner);
    return acc;
  }, {} as Record<string, Partner[]>);

  const toggleSort = (field: 'city' | 'name' | 'price') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

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
        <div className="max-w-7xl mx-auto px-4 py-6">
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
              {partners.length} pressings disponibles
            </div>
          </div>

          {/* Titre */}
          <h1 className="text-3xl font-bold text-slate-900 mb-4 text-center">
            Trouvez votre pressing
          </h1>

          {/* Barre de recherche */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher par ville, nom ou code postal..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(50); // Reset pagination on search
              }}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-purple-200 focus:border-purple-600 focus:outline-none text-lg"
            />
          </div>

          {/* Boutons de tri */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => toggleSort('city')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-1 transition ${
                sortBy === 'city' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Ville
              {sortBy === 'city' && (sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
            </button>
            <button
              onClick={() => toggleSort('name')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-1 transition ${
                sortBy === 'name' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Nom
              {sortBy === 'name' && (sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
            </button>
            <button
              onClick={() => toggleSort('price')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-1 transition ${
                sortBy === 'price' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Prix
              {sortBy === 'price' && (sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
            </button>
          </div>

          {/* Résultats */}
          <div className="mt-4 text-sm text-slate-500">
            {filteredPartners.length === partners.length 
              ? `${partners.length} pressings` 
              : `${filteredPartners.length} résultats sur ${partners.length}`
            }
            {visibleCount < filteredPartners.length && ` (${visibleCount} affichés)`}
          </div>
        </div>
      </div>

      {/* Liste des pressings */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {selectedPartner ? (
          /* Vue détaillée d'un pressing */
          <div className="bg-white rounded-3xl shadow-xl p-8 max-w-2xl mx-auto">
            <button
              onClick={() => setSelectedPartner(null)}
              className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6 font-semibold"
            >
              <ArrowLeft className="w-5 h-5" />
              Retour à la liste
            </button>

            <h2 className="text-3xl font-bold text-slate-900 mb-4">{selectedPartner.name}</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-slate-700">{selectedPartner.address}</p>
                  <p className="text-slate-700">{selectedPartner.postal_code} {selectedPartner.city}</p>
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
            {Object.entries(groupedByCity).map(([city, cityPartners]) => (
              <div key={city}>
                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2 sticky top-[220px] bg-gradient-to-br from-purple-50 to-pink-50 py-2 z-10">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  {city}
                  <span className="text-sm font-normal text-slate-500">
                    ({cityPartners.length} pressing{cityPartners.length > 1 ? 's' : ''})
                  </span>
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cityPartners.map((partner) => (
                    <div
                      key={partner.id}
                      onClick={() => setSelectedPartner(partner)}
                      className="bg-white p-5 rounded-2xl border-2 border-slate-100 hover:border-purple-400 hover:shadow-lg transition cursor-pointer group"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-slate-900 group-hover:text-purple-600 transition">
                          {partner.name}
                        </h3>
                        <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0" title="Actif"></div>
                      </div>
                      
                      <p className="text-sm text-slate-500 mb-2">
                        {partner.address}
                      </p>
                      <p className="text-sm text-slate-600 mb-3">
                        {partner.postal_code} {partner.city}
                      </p>
                      
                      {partner.price_per_kg && (
                        <p className="text-lg font-bold text-purple-600">
                          {partner.price_per_kg}€/kg
                        </p>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCreateOrder(partner);
                        }}
                        className="mt-4 w-full py-2 bg-purple-100 text-purple-700 rounded-xl font-semibold hover:bg-purple-600 hover:text-white transition"
                      >
                        Commander
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Bouton "Charger plus" */}
            {visibleCount < filteredPartners.length && (
              <div className="text-center py-8">
                <button
                  onClick={() => setVisibleCount(prev => prev + 50)}
                  className="px-8 py-4 bg-purple-600 text-white rounded-2xl font-bold text-lg hover:bg-purple-700 transition shadow-lg hover:shadow-xl"
                >
                  Afficher plus de pressings
                  <span className="ml-2 text-purple-200">
                    ({filteredPartners.length - visibleCount} restants)
                  </span>
                </button>
              </div>
            )}

            {/* Message si aucun résultat */}
            {filteredPartners.length === 0 && (
              <div className="text-center py-16">
                <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-600 mb-2">Aucun pressing trouvé</h3>
                <p className="text-slate-500">Essayez une autre recherche</p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-4 text-purple-600 font-semibold hover:underline"
                >
                  Effacer la recherche
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
