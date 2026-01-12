import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { MapPin, Search, Loader2, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Trouver() {
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 48.8566, lng: 2.3522 });

  // Simulation de géolocalisation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          console.log('Géolocalisation refusée');
        }
      );
    }
  }, []);

  const handleSearch = async () => {
    if (!address.trim()) {
      toast.error('Veuillez entrer une adresse');
      return;
    }

    setSearching(true);
    setShowResults(false);

    // Simulation de recherche avec délai
    setTimeout(() => {
      setSearching(false);
      setShowResults(true);
      toast.success('3 pressings trouvés près de vous !');
    }, 2000);
  };

  const simulatedPressings = [
    {
      name: 'Pressing Express',
      address: '15 Rue de la République',
      city: 'Paris 11ème',
      distance: '0.8 km',
      rating: 4.8,
      reviews: 127,
      price: '3.50€/kg'
    },
    {
      name: 'Clean & Fresh',
      address: '8 Avenue Parmentier',
      city: 'Paris 11ème',
      distance: '1.2 km',
      rating: 4.6,
      reviews: 89,
      price: '3.20€/kg'
    },
    {
      name: 'Pressing du Coin',
      address: '42 Boulevard Voltaire',
      city: 'Paris 11ème',
      distance: '1.5 km',
      rating: 4.7,
      reviews: 156,
      price: '3.00€/kg'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 font-sans">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* HEADER */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-3xl mb-6 shadow-xl">
              <MapPin className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Trouvez votre pressing
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Découvrez les meilleurs pressings près de chez vous et rejoignez Kilolab
            </p>
          </div>

          {/* SEARCH BAR */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="bg-white rounded-3xl shadow-2xl p-4 border-2 border-teal-100">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-500" size={24} />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Entrez votre adresse (ex: 15 Rue de Rivoli, Paris)"
                    className="w-full pl-14 pr-4 py-4 text-lg border-none focus:outline-none rounded-2xl"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  disabled={searching}
                  className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-teal-700 hover:to-cyan-700 transition-all shadow-lg disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
                >
                  {searching ? (
                    <>
                      <Loader2 className="animate-spin" size={24} />
                      Recherche...
                    </>
                  ) : (
                    <>
                      <Search size={24} />
                      Rechercher
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* ANIMATION DE RECHERCHE */}
          {searching && (
            <div className="max-w-4xl mx-auto mb-12">
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-teal-100">
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="relative mb-6">
                    <div className="w-32 h-32 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <MapPin className="w-16 h-16 text-white animate-bounce" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    Recherche en cours...
                  </h3>
                  <p className="text-slate-600">
                    Nous analysons les pressings disponibles dans votre secteur
                  </p>
                  <div className="flex gap-2 mt-6">
                    <div className="w-3 h-3 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-3 h-3 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-3 h-3 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* RÉSULTATS SIMULÉS */}
          {showResults && !searching && (
            <div className="max-w-5xl mx-auto">
              
              {/* MAP SIMULÉE */}
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8 border border-teal-100">
                <div className="relative h-96 bg-gradient-to-br from-teal-100 via-cyan-100 to-blue-100">
                  {/* Simulation de carte */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="relative inline-block">
                        {/* Point central (utilisateur) */}
                        <div className="w-16 h-16 bg-red-500 rounded-full border-4 border-white shadow-xl flex items-center justify-center animate-pulse">
                          <MapPin className="w-8 h-8 text-white" />
                        </div>
                        
                        {/* Points pressings autour */}
                        <div className="absolute -top-20 -left-32 w-12 h-12 bg-teal-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center animate-bounce">
                          <MapPin className="w-6 h-6 text-white" />
                        </div>
                        <div className="absolute -bottom-24 left-20 w-12 h-12 bg-teal-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center animate-bounce" style={{ animationDelay: '200ms' }}>
                          <MapPin className="w-6 h-6 text-white" />
                        </div>
                        <div className="absolute top-8 -right-36 w-12 h-12 bg-teal-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center animate-bounce" style={{ animationDelay: '400ms' }}>
                          <MapPin className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      
                      <div className="mt-8 bg-white px-6 py-3 rounded-full shadow-lg inline-block">
                        <p className="text-sm font-bold text-teal-600 flex items-center gap-2">
                          <Sparkles size={16} />
                          3 pressings trouvés près de vous
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Badge localisation */}
                  <div className="absolute top-4 left-4 bg-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-bold text-slate-700">Votre position</span>
                  </div>
                </div>
              </div>

              {/* BANNER INFO */}
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-6 mb-8 border-2 border-orange-200">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-orange-100 rounded-xl">
                    <Sparkles className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      Vous ne trouvez pas votre pressing habituel ?
                    </h3>
                    <p className="text-slate-700 mb-4">
                      Notre réseau s'agrandit chaque jour ! Inscrivez-vous dès maintenant et nous vous préviendrons dès qu'un pressing rejoint Kilolab près de chez vous.
                    </p>
                    <div className="flex gap-3 flex-wrap">
                      <button
                        onClick={() => navigate('/signup')}
                        className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-bold hover:from-teal-700 hover:to-cyan-700 transition-all shadow-lg flex items-center gap-2"
                      >
                        <CheckCircle size={20} />
                        Créer mon compte client
                        <ArrowRight size={20} />
                      </button>
                      <button
                        onClick={() => navigate('/login')}
                        className="bg-white text-teal-600 px-6 py-3 rounded-xl font-bold hover:bg-teal-50 transition-all border-2 border-teal-600 flex items-center gap-2"
                      >
                        J'ai déjà un compte
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* LISTE DES PRESSINGS */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <MapPin className="text-teal-600" size={28} />
                  Pressings disponibles
                </h2>

                {simulatedPressings.map((pressing, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-slate-100 cursor-pointer group"
                    onClick={() => {
                      toast.success(`${pressing.name} sélectionné ! Créez votre compte pour commander.`, { duration: 4000 });
                      setTimeout(() => navigate('/signup'), 2000);
                    }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
                            {pressing.name}
                          </h3>
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                            Disponible
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-slate-600 mb-3">
                          <MapPin size={16} className="text-teal-500" />
                          <span className="text-sm">{pressing.address}, {pressing.city}</span>
                          <span className="px-2 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-bold">
                            {pressing.distance}
                          </span>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500 font-bold">★</span>
                            <span className="font-bold text-slate-900">{pressing.rating}</span>
                            <span className="text-sm text-slate-500">({pressing.reviews} avis)</span>
                          </div>
                          <div className="px-3 py-1 bg-teal-50 text-teal-700 rounded-lg font-bold text-sm">
                            {pressing.price}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <button className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-bold hover:from-teal-700 hover:to-cyan-700 transition-all shadow-lg group-hover:scale-105 flex items-center gap-2">
                          Choisir
                          <ArrowRight size={18} />
                        </button>
                        <p className="text-xs text-slate-500">
                          Livraison 24h
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA FINAL */}
              <div className="mt-12 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-3xl p-8 text-center text-white shadow-2xl">
                <h2 className="text-3xl font-black mb-4">
                  Prêt à simplifier votre pressing ?
                </h2>
                <p className="text-xl mb-6 opacity-90">
                  Créez votre compte en 2 minutes et commandez dès aujourd'hui
                </p>
                <div className="flex gap-4 justify-center flex-wrap">
                  <button
                    onClick={() => navigate('/signup')}
                    className="bg-white text-teal-600 px-8 py-4 rounded-xl font-bold hover:bg-teal-50 transition-all shadow-lg text-lg flex items-center gap-2"
                  >
                    <CheckCircle size={24} />
                    Créer mon compte
                    <ArrowRight size={24} />
                  </button>
                  <button
                    onClick={() => navigate('/login')}
                    className="bg-teal-700 text-white px-8 py-4 rounded-xl font-bold hover:bg-teal-800 transition-all border-2 border-white/20 text-lg"
                  >
                    Se connecter
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* ÉTAT INITIAL (pas de recherche) */}
          {!searching && !showResults && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-3xl p-12 shadow-xl border border-teal-100 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-teal-600" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">
                  Trouvez le pressing parfait
                </h2>
                <p className="text-xl text-slate-600 mb-8">
                  Entrez votre adresse pour découvrir les pressings Kilolab près de chez vous
                </p>
                
                {/* AVANTAGES */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                  <div className="p-6 bg-gradient-to-br from-teal-50 to-white rounded-2xl border border-teal-100">
                    <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <MapPin className="w-6 h-6 text-teal-600" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">Proximité</h3>
                    <p className="text-sm text-slate-600">Trouvez les pressings les plus proches de chez vous</p>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-cyan-50 to-white rounded-2xl border border-cyan-100">
                    <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-6 h-6 text-cyan-600" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">Qualité</h3>
                    <p className="text-sm text-slate-600">Tous nos pressings sont sélectionnés et vérifiés</p>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-blue-100">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">Simple</h3>
                    <p className="text-sm text-slate-600">Commandez en quelques clics, livraison 24h</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      <Footer />
    </div>
  );
}
