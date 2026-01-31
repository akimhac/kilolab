import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { MapPin, Search, Loader2, Phone, Mail, Clock, ArrowRight, Navigation, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Trouver() {
  const navigate = useNavigate();
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPartners, setFilteredPartners] = useState<any[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    fetchPartners();
    requestGeolocation();
  }, []);

  const requestGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => console.log("Géoloc refusée:", error)
      );
    }
  };

  const fetchPartners = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('partners')
      .select('*')
      .eq('is_active', true);
    
    setPartners(data || []);
    setFilteredPartners(data || []);
    setLoading(false);
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredPartners(partners);
      return;
    }

    const results = partners.filter(p => 
      (p.city && p.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.postal_code && p.postal_code.includes(searchQuery)) ||
      (p.company_name && p.company_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.address && p.address.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    setFilteredPartners(results);

    if (results.length === 0) {
      toast('Aucun pressing trouvé dans cette zone', { icon: '🔍' });
    } else {
      toast.success(`${results.length} pressing(s) trouvé(s) !`);
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
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

  const sortedPartners = userLocation 
    ? [...filteredPartners].sort((a, b) => {
        if (!a.latitude || !a.longitude) return 1;
        if (!b.latitude || !b.longitude) return -1;
        const distA = calculateDistance(userLocation.lat, userLocation.lng, a.latitude, a.longitude);
        const distB = calculateDistance(userLocation.lat, userLocation.lng, b.latitude, b.longitude);
        return distA - distB;
      })
    : filteredPartners;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="animate-spin text-teal-600 mx-auto mb-4" size={48}/>
          <p className="text-slate-600 font-medium">Chargement de la carte...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            Trouve un pressing <span className="text-teal-600">près de chez toi</span>
          </h1>
          <p className="text-xl text-slate-600">
            {partners.length} pressings partenaires disponibles
          </p>
        </div>

        {/* RECHERCHE */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-4 text-slate-400" size={20}/>
              <input 
                type="text" 
                placeholder="Code postal, ville ou nom du pressing..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-medium text-lg shadow-sm"
              />
            </div>
            <button 
              onClick={handleSearch}
              className="px-8 py-4 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-500 transition shadow-lg flex items-center gap-2"
            >
              <Search size={20}/>
              Chercher
            </button>
          </div>

          {userLocation && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2">
              <Navigation size={16} className="text-green-600"/>
              <span className="text-sm font-bold text-green-700">
                Localisation activée - Les pressings sont triés par distance
              </span>
            </div>
          )}
        </div>

        {/* RÉSULTATS */}
        {filteredPartners.length === 0 ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-slate-200">
              <AlertCircle size={64} className="mx-auto mb-4 text-slate-300" />
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Aucun pressing trouvé
              </h3>
              <p className="text-slate-600 mb-6">
                Il n'y a pas encore de pressing dans cette zone, mais le réseau Kilolab peut prendre en charge ta commande !
              </p>
              <Link 
                to="/new-order"
                className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-500 transition"
              >
                Commander quand même
                <ArrowRight size={18}/>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedPartners.map((partner) => {
              const distance = userLocation && partner.latitude && partner.longitude
                ? calculateDistance(userLocation.lat, userLocation.lng, partner.latitude, partner.longitude)
                : null;

              return (
                <div 
                  key={partner.id}
                  onClick={() => setSelectedPartner(partner)}
                  className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                >
                  {/* HEADER */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                      {(partner.company_name || "P").charAt(0).toUpperCase()}
                    </div>
                    {distance && (
                      <div className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <MapPin size={12}/>
                        {distance.toFixed(1)} km
                      </div>
                    )}
                  </div>

                  {/* NOM */}
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition">
                    {partner.company_name || "Pressing Kilolab"}
                  </h3>

                  {/* ADRESSE */}
                  <div className="flex items-start gap-2 text-sm text-slate-600 mb-4">
                    <MapPin size={16} className="text-slate-400 shrink-0 mt-0.5"/>
                    <span>
                      {partner.address}<br/>
                      {partner.postal_code} {partner.city}
                    </span>
                  </div>

                  {/* CONTACT */}
                  {partner.phone && (
                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                      <Phone size={14} className="text-slate-400"/>
                      <span>{partner.phone}</span>
                    </div>
                  )}

                  {partner.email && (
                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
                      <Mail size={14} className="text-slate-400"/>
                      <span className="truncate">{partner.email}</span>
                    </div>
                  )}

                  {/* CTA */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/new-order');
                    }}
                    className="w-full py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-500 transition flex items-center justify-center gap-2 shadow-lg"
                  >
                    Commander ici
                    <ArrowRight size={16}/>
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* ALTERNATIVE : PAS DE PRESSING */}
        {partners.length > 0 && (
          <div className="mt-16 max-w-3xl mx-auto">
            <div className="bg-gradient-to-r from-slate-900 to-teal-900 rounded-2xl p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-3">
                Ton pressing n'est pas encore partenaire ?
              </h3>
              <p className="text-slate-300 mb-6">
                Passe quand même commande ! Le réseau Kilolab trouvera un Washer certifié près de chez toi.
              </p>
              <Link 
                to="/new-order"
                className="inline-flex items-center gap-2 px-8 py-4 bg-teal-500 text-slate-900 rounded-xl font-bold hover:bg-teal-400 transition shadow-xl"
              >
                Commander avec le réseau Kilolab
                <ArrowRight size={20}/>
              </Link>
            </div>
          </div>
        )}

      </div>

      {/* MODAL DÉTAILS PRESSING */}
      {selectedPartner && (
        <div 
          onClick={() => setSelectedPartner(null)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl">
                {(selectedPartner.company_name || "P").charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-900">
                  {selectedPartner.company_name || "Pressing Kilolab"}
                </h2>
                <p className="text-slate-500">{selectedPartner.city}</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* ADRESSE */}
              <div className="bg-slate-50 p-4 rounded-xl border">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={18} className="text-teal-600"/>
                  <h3 className="font-bold text-slate-900">Adresse</h3>
                </div>
                <p className="text-slate-600">
                  {selectedPartner.address}<br/>
                  {selectedPartner.postal_code} {selectedPartner.city}
                </p>
              </div>

              {/* CONTACT */}
              {(selectedPartner.phone || selectedPartner.email) && (
                <div className="bg-slate-50 p-4 rounded-xl border">
                  <h3 className="font-bold text-slate-900 mb-3">Contact</h3>
                  <div className="space-y-2">
                    {selectedPartner.phone && (
                      <div className="flex items-center gap-2">
                        <Phone size={16} className="text-teal-600"/>
                        <a href={`tel:${selectedPartner.phone}`} className="text-slate-600 hover:text-teal-600 transition">
                          {selectedPartner.phone}
                        </a>
                      </div>
                    )}
                    {selectedPartner.email && (
                      <div className="flex items-center gap-2">
                        <Mail size={16} className="text-teal-600"/>
                        <a href={`mailto:${selectedPartner.email}`} className="text-slate-600 hover:text-teal-600 transition">
                          {selectedPartner.email}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* HORAIRES (SI DISPONIBLE) */}
              {selectedPartner.opening_hours && (
                <div className="bg-slate-50 p-4 rounded-xl border">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock size={18} className="text-teal-600"/>
                    <h3 className="font-bold text-slate-900">Horaires</h3>
                  </div>
                  <p className="text-slate-600 whitespace-pre-line">
                    {selectedPartner.opening_hours}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-8 flex gap-4">
              <button 
                onClick={() => setSelectedPartner(null)}
                className="flex-1 py-4 border-2 border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition"
              >
                Fermer
              </button>
              <button 
                onClick={() => navigate('/new-order')}
                className="flex-1 py-4 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-500 transition shadow-lg flex items-center justify-center gap-2"
              >
                Commander
                <ArrowRight size={18}/>
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
