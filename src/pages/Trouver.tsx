import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useState } from 'react';
import { MapPin, Search, Star, Navigation, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Trouver() {
  const [searchCity, setSearchCity] = useState('');

  // Données mockées (tu remplaceras par Supabase)
  const washers = [
    { 
      id: 1, 
      name: "Marie D.", 
      city: "Lille", 
      postalCode: "59000",
      address: "Vieux-Lille",
      rating: 4.9, 
      reviews: 87,
      distance: 0.8,
      available: true
    },
    { 
      id: 2, 
      name: "Thomas L.", 
      city: "Lille", 
      postalCode: "59000",
      address: "Wazemmes",
      rating: 4.8, 
      reviews: 45,
      distance: 1.2,
      available: true
    },
    { 
      id: 3, 
      name: "Sarah K.", 
      city: "Nantes", 
      postalCode: "44000",
      address: "Centre-ville",
      rating: 5.0, 
      reviews: 120,
      distance: 2.3,
      available: false
    }
  ];

  const filteredWashers = searchCity 
    ? washers.filter(w => w.city.toLowerCase().includes(searchCity.toLowerCase()) || w.postalCode.includes(searchCity))
    : washers;

  return (
    <>
      {/* SEO LOCAL OPTIMISÉ */}
      <Helmet>
        <title>Trouver un Washer Kilolab près de chez vous | Lille & Nantes</title>
        <meta 
          name="description" 
          content="Trouvez un Washer Kilolab à Lille, Nantes et environs. Lavage de linge à domicile par des voisins de confiance. Réservation en ligne." 
        />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://kilolab.fr/trouver" />
        <meta property="og:title" content="Trouver un Washer Kilolab près de chez vous" />
        <meta property="og:description" content="Washers disponibles à Lille, Nantes. Réservez votre lavage en 2 clics." />
        
        {/* Schema.org - ItemList (Liste de Washers) */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Washers Kilolab disponibles",
            "itemListElement": filteredWashers.map((washer, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "item": {
                "@type": "Person",
                "name": washer.name,
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": washer.city,
                  "postalCode": washer.postalCode,
                  "addressCountry": "FR"
                },
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": washer.rating,
                  "reviewCount": washer.reviews
                }
              }
            }))
          })}
        </script>
        
        {/* Schema.org - LocalBusiness */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Kilolab Lille",
            "image": "https://kilolab.fr/logo.png",
            "@id": "https://kilolab.fr",
            "url": "https://kilolab.fr",
            "telephone": "+33612345678",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Centre-ville",
              "addressLocality": "Lille",
              "postalCode": "59000",
              "addressCountry": "FR"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": 50.6292,
              "longitude": 3.0573
            },
            "openingHoursSpecification": {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday"
              ],
              "opens": "08:00",
              "closes": "22:00"
            },
            "priceRange": "€€",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "reviewCount": "127"
            }
          })}
        </script>
        
        <link rel="canonical" href="https://kilolab.fr/trouver" />
      </Helmet>

      <div className="min-h-screen bg-slate-50 font-sans">
        <Navbar />

        {/* HERO + RECHERCHE */}
        <header className="pt-32 pb-12 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-black mb-4">
                Trouvez votre <span className="text-teal-600">Washer</span>
              </h1>
              <p className="text-xl text-slate-600">
                Des voisins de confiance près de chez vous
              </p>
            </div>

            {/* BARRE DE RECHERCHE */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Entrez votre ville ou code postal (ex: Lille, 59000)"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="w-full p-4 pl-12 pr-4 border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-lg"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
              </div>
            </div>
          </div>
        </header>

        {/* LISTE DES WASHERS */}
        <section className="py-12">
          <div className="max-w-5xl mx-auto px-4">
            
            {/* NOMBRE DE RÉSULTATS */}
            <div className="mb-6">
              <p className="text-slate-600">
                <strong className="text-slate-900">{filteredWashers.length} Washers</strong> disponibles
                {searchCity && ` pour "${searchCity}"`}
              </p>
            </div>

            {/* CARTES WASHERS */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWashers.map(washer => (
                <div key={washer.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition">
                  
                  {/* HEADER */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {washer.name[0]}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{washer.name}</h3>
                        <p className="text-sm text-slate-500">{washer.address}</p>
                      </div>
                    </div>
                    {washer.available ? (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                        Dispo
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-bold">
                        Occupé
                      </span>
                    )}
                  </div>

                  {/* STATS */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Star className="text-yellow-500 fill-yellow-500" size={16} />
                      <span className="font-bold">{washer.rating}</span>
                      <span className="text-slate-500">({washer.reviews} avis)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Navigation size={16} />
                      <span>À {washer.distance} km</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin size={16} />
                      <span>{washer.city} ({washer.postalCode})</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <Link 
                    to={`/new-order?washer=${washer.id}`}
                    className={`block w-full py-3 rounded-xl font-bold text-center transition ${
                      washer.available
                        ? 'bg-teal-600 text-white hover:bg-teal-500'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {washer.available ? 'Réserver' : 'Indisponible'}
                  </Link>
                </div>
              ))}
            </div>

            {/* PAS DE RÉSULTATS */}
            {filteredWashers.length === 0 && (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                <MapPin className="mx-auto mb-4 text-slate-300" size={48} />
                <h3 className="text-xl font-bold mb-2 text-slate-700">
                  Aucun Washer disponible dans cette zone
                </h3>
                <p className="text-slate-500 mb-6">
                  Kilolab arrive bientôt dans votre ville ! Soyez notifié du lancement.
                </p>
                <button className="px-6 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-500 transition">
                  Me notifier
                </button>
              </div>
            )}
          </div>
        </section>

        {/* CTA DEVENIR WASHER */}
        <section className="py-20 bg-gradient-to-br from-teal-600 to-emerald-600 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-black mb-4">
              Pas de Washer près de chez vous ?
            </h2>
            <p className="text-xl mb-8 text-teal-50">
              Devenez le premier Washer de votre quartier et gagnez jusqu'à 600€/mois !
            </p>
            <Link 
              to="/become-washer"
              className="inline-block px-8 py-4 bg-white text-teal-600 rounded-xl font-bold hover:bg-teal-50 transition shadow-lg"
            >
              💰 Devenir Washer
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
