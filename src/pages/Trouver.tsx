import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { MapPin, Star, Clock, Search, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

interface Washer {
  id: string;
  full_name: string;
  city: string;
  postal_code: string;
  rating?: number;
  completed_orders?: number;
  is_available: boolean;
  response_time?: number;
  distance?: number;
}

export default function Trouver() {
  const [washers, setWashers] = useState<Washer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [userCity, setUserCity] = useState('');
  const [userPostalCode, setUserPostalCode] = useState('');

  useEffect(() => {
    fetchAllWashers();
  }, []);

  const enrich = (list: any[]) =>
    (list || []).map((w: any) => ({
      ...w,
      rating: 4.5 + Math.random() * 0.5,
      completed_orders: Math.floor(Math.random() * 50) + 5,
      response_time: Math.floor(Math.random() * 10) + 2,
      distance: Math.random() * 2 + 0.3,
    })) as Washer[];

  const fetchAllWashers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('washers')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setWashers(enrich(data || []));
    } catch (error: any) {
      console.error('Erreur chargement washers:', error);
      toast.error('Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    const searchTerm = userCity.trim() || userPostalCode.trim();

    if (!searchTerm) {
      toast.error('Veuillez entrer une ville ou un code postal');
      return;
    }

    setSearching(true);
    toast.loading('Recherche en cours...', { id: 'search' });

    try {
      const { data, error } = await supabase
        .from('washers')
        .select('*')
        .eq('status', 'approved');

      if (error) throw error;

      const filtered = (data || []).filter((w: any) => {
        const cityMatch = (w.city || '').toLowerCase().includes(searchTerm.toLowerCase());
        const postalMatch = (w.postal_code || '').includes(searchTerm);
        return cityMatch || postalMatch;
      });

      const enriched = enrich(filtered);
      setWashers(enriched);

      toast.dismiss('search');

      if (enriched.length > 0) toast.success(`✅ ${enriched.length} Washer(s) trouvé(s) !`);
      else toast.error('❌ Aucun Washer trouvé dans cette zone');
    } catch (error: any) {
      console.error('Erreur recherche:', error);
      toast.dismiss('search');
      toast.error('Erreur de recherche');
    } finally {
      setSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <>
      <Helmet>
        <title>Trouve ton Washer - Kilolab</title>
        <meta
          name="description"
          content="Trouve un Washer près de chez toi partout en France. Lavage professionnel à domicile."
        />
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <Navbar />

        <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
          {/* HERO */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black mb-4">🗺️ Trouve ton Washer</h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Des Washers disponibles partout en France
            </p>
          </div>

          {/* SEARCH BAR */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-slate-700 mb-2">📍 Ta ville</label>
                  <input
                    type="text"
                    placeholder="Ex: Lille, Paris, Nantes..."
                    value={userCity}
                    onChange={(e) => setUserCity(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="w-40">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Code postal</label>
                  <input
                    type="text"
                    placeholder="59000"
                    value={userPostalCode}
                    onChange={(e) => setUserPostalCode(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    onClick={handleSearch}
                    disabled={searching}
                    className="px-6 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {searching ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ✅ STATS - TEXTE CORRIGÉ */}
          <div className="grid grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <div className="bg-white rounded-xl p-6 text-center border border-slate-100">
              <div className="text-3xl font-black text-teal-600 mb-1">
                {washers.filter((w) => w.is_available).length}
              </div>
              <div className="text-sm text-slate-600 font-medium">
                Washers disponibles{washers.length > 0 ? ' près de vous' : ''}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 text-center border border-slate-100">
              <div className="text-3xl font-black text-blue-600 mb-1">~5min</div>
              <div className="text-sm text-slate-600 font-medium">Temps de réponse</div>
            </div>

            <div className="bg-white rounded-xl p-6 text-center border border-slate-100">
              <div className="text-3xl font-black text-purple-600 mb-1">4.8⭐</div>
              <div className="text-sm text-slate-600 font-medium">Note moyenne</div>
            </div>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="text-center py-12">
              <Loader2 className="animate-spin mx-auto mb-4 text-teal-600" size={48} />
              <p className="text-slate-600">Chargement des Washers disponibles...</p>
            </div>
          )}

          {/* AUCUN WASHER */}
          {!loading && washers.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
              <MapPin size={64} className="mx-auto mb-4 text-slate-300" />
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Pas encore de Washers dans ta zone
              </h3>
              <p className="text-slate-600 mb-6">Sois le premier Washer de ton quartier !</p>
              <Link
                to="/become-washer"
                className="inline-block px-6 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition"
              >
                💰 Devenir Washer
              </Link>
            </div>
          )}

          {/* LISTE WASHERS */}
          {!loading && washers.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {washers.map((washer) => (
                <div
                  key={washer.id}
                  className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-xl transition-all hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                        {washer.full_name ? washer.full_name.charAt(0).toUpperCase() : '?'}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-900">
                          {washer.full_name || 'Washer'}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-slate-500">
                          <MapPin size={14} />
                          {washer.city} ({washer.postal_code})
                        </div>
                      </div>
                    </div>

                    {washer.is_available ? (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                        🟢 Dispo
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded-full">
                        Occupé
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-yellow-500 mb-1">
                        <Star size={14} className="fill-yellow-400" />
                        <span className="font-bold text-slate-900">
                          {washer.rating?.toFixed(1) || '4.8'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">Note</p>
                    </div>

                    <div className="text-center">
                      <div className="font-bold text-slate-900 mb-1">{washer.completed_orders || 0}</div>
                      <p className="text-xs text-slate-500">Lavages</p>
                    </div>

                    <div className="text-center">
                      <div className="font-bold text-slate-900 mb-1">{washer.distance?.toFixed(1) || '0.5'}km</div>
                      <p className="text-xs text-slate-500">Distance</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-600 mb-4 bg-slate-50 p-3 rounded-lg">
                    <Clock size={16} className="text-teal-600" />
                    <span>Répond en ~{washer.response_time || 5}min</span>
                  </div>

                  <Link
                    to="/new-order"
                    className="block w-full py-3 bg-teal-600 text-white text-center font-bold rounded-xl hover:bg-teal-700 transition"
                  >
                    Commander
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* CTA Devenir Washer */}
          <div className="mt-16 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-3xl font-black mb-4">Deviens Washer dans ton quartier 💰</h2>
            <p className="text-xl mb-6 text-teal-100">Gagne jusqu'à 600€/mois en lavant le linge de tes voisins</p>
            <Link
              to="/become-washer"
              className="inline-block px-8 py-4 bg-white text-teal-600 rounded-xl font-bold hover:bg-slate-100 transition shadow-xl"
            >
              Je m'inscris
            </Link>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}