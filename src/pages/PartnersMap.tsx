import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft, MapPin, Phone, Clock, Euro, Navigation } from 'lucide-react';

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
  const [searchCity, setSearchCity] = useState('');

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = async () => {
    try {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .order('city')
        .limit(100);

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

  const filteredPartners = partners.filter(p => 
    p.city.toLowerCase().includes(searchCity.toLowerCase()) ||
    p.name.toLowerCase().includes(searchCity.toLowerCase()) ||
    p.postal_code.includes(searchCity)
  );

  const groupedByCity = filteredPartners.reduce((acc, partner) => {
    const city = partner.city;
    if (!acc[city]) acc[city] = [];
    acc[city].push(partner);
    return acc;
  }, {} as Record<string, Partner[]>);

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
      {/* Header */}
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
            <div className="text-sm text-slate-600 font-semibold">
              <MapPin className="w-4 h-4 inline mr-1" />
              {partners.length} pressings disponibles
            </div>
          </div>

          {/* Barre de recherche */}
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher par ville ou code postal..."
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl border-2 border-purple-300 focus:border-purple-600 focus:outline-none text-lg"
            />
            <Navigation className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Liste des pressings */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {selectedPartner ? (
          /* Vue détail pressing */
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <button
              onClick={() => setSelectedPartner(null)}
              className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6 font-semibold"
            >
              <ArrowLeft className="w-5 h-5" />
              Voir tous les pressings
            </button>

            <h1 className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              {selectedPartner.name}
            </h1>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4">
                <div className="flex items-start gap-3 bg-purple-50 p-4 rounded-xl">
                  <MapPin className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-slate-900">{selectedPartner.address}</p>
                    <p className="text-slate-600">{selectedPartner.postal_code} {selectedPartner.city}</p>
                  </div>
                </div>

                {selectedPartner.phone && (
                  <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-xl">
                    <Phone className="w-6 h-6 text-blue-600" />
                    <a href={`tel:${selectedPartner.phone}`} className="text-blue-600 hover:underline font-semibold">
                      {selectedPartner.phone}
                    </a>
                  </div>
                )}

                <div className="flex items-center gap-3 bg-green-50 p-4 rounded-xl">
                  <Euro className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="font-bold text-green-900 text-xl">À partir de 5€/kg</p>
                    <p className="text-sm text-green-700">Prix selon formule choisie</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-xl">
                <div className="flex items-start gap-3 mb-4">
                  <Clock className="w-6 h-6 text-slate-600 mt-1" />
                  <div>
                    <p className="font-bold text-slate-900 mb-3">Horaires d'ouverture</p>
                    <div className="space-y-1 text-slate-700">
                      <p>Lundi - Vendredi : 8h - 19h</p>
                      <p>Samedi : 9h - 18h</p>
                      <p>Dimanche : Fermé</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleCreateOrder(selectedPartner)}
              className="w-full py-5 rounded-2xl font-bold text-xl text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-2xl transition-all transform hover:scale-105"
            >
              Créer ma commande
            </button>
          </div>
        ) : (
          /* Liste des pressings par ville */
          <div>
            {Object.entries(groupedByCity).length === 0 ? (
              <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
                <MapPin className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Aucun pressing trouvé
                </h2>
                <p className="text-slate-600">
                  Essayez une autre ville ou code postal
                </p>
              </div>
            ) : (
              Object.entries(groupedByCity).map(([city, cityPartners]) => (
                <div key={city} className="mb-8">
                  <h2 className="text-3xl font-black text-slate-900 mb-4 flex items-center gap-3">
                    <MapPin className="w-8 h-8 text-purple-600" />
                    {city}
                    <span className="text-lg font-normal text-slate-500">
                      ({cityPartners.length} pressing{cityPartners.length > 1 ? 's' : ''})
                    </span>
                  </h2>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cityPartners.map((partner) => (
                      <div
                        key={partner.id}
                        onClick={() => setSelectedPartner(partner)}
                        className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all cursor-pointer border-2 border-transparent hover:border-purple-500 group"
                      >
                        <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-purple-600 transition">
                          {partner.name}
                        </h3>
                        
                        <div className="space-y-2 mb-4">
                          <p className="text-slate-600 text-sm flex items-start gap-2">
                            <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            {partner.address}
                          </p>
                          <p className="text-slate-500 text-sm">
                            {partner.postal_code} {partner.city}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                          <div className="flex items-center gap-2 text-green-600">
                            <Euro className="w-5 h-5" />
                            <span className="font-bold">À partir de 5€/kg</span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCreateOrder(partner);
                            }}
                            className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:shadow-lg transition text-sm"
                          >
                            Commander
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
