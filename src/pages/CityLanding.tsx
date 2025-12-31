import { useParams, Navigate, Link } from 'react-router-dom';
import { citiesData } from '../data/citiesData';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead'; // Assure-toi que le nom correspond à ton fichier existant
import { ArrowRight, Check, MapPin } from 'lucide-react';

export default function CityLanding() {
  const { city } = useParams<{ city: string }>();
  // Normalise la ville (minuscule)
  const cityKey = city?.toLowerCase() || '';
  const data = citiesData[cityKey];

  // Si la ville n'existe pas dans nos data -> Redirection vers Home
  if (!data) return <Navigate to="/" replace />;

  const cityName = cityKey.charAt(0).toUpperCase() + cityKey.slice(1);

  return (
    <div className="font-sans text-slate-900 bg-white">
      <SEOHead 
        title={data.title} 
        description={data.meta} 
        canonical={`/pressing/${cityKey}`}
      />
      
      <Navbar />
      
      {/* HERO SECTION DYNAMIQUE */}
      <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 opacity-20">
            <img src="https://images.unsplash.com/photo-1517677208171-0bc12f949b42?q=80&w=2000&auto=format&fit=crop" className="w-full h-full object-cover" alt="Pressing" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/20 backdrop-blur-md text-teal-300 rounded-full text-sm font-bold border border-teal-500/30 mb-6">
                <MapPin size={16} /> Disponible à {cityName}
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                {data.h1}
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
                {data.intro}
            </p>
            <Link 
              to="/new-order"
              className="inline-flex items-center gap-3 px-8 py-4 bg-teal-500 text-white rounded-full font-bold text-lg hover:bg-teal-400 transition-all shadow-lg shadow-teal-500/40 hover:scale-105"
            >
              Commander à {cityName} <ArrowRight size={20}/>
            </Link>
        </div>
      </div>

      {/* SECTION EXPLICATION RAPIDE */}
      <div className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Pourquoi choisir Kilolab à {cityName} ?</h2>
            <div className="grid md:grid-cols-3 gap-8">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                    <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">1</div>
                    <h3 className="font-bold text-lg mb-2">Collecte Locale</h3>
                    <p className="text-slate-500 text-sm">Nos chauffeurs partenaires sillonnent {cityName} pour récupérer votre linge.</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                    <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">2</div>
                    <h3 className="font-bold text-lg mb-2">Lavage Pro</h3>
                    <p className="text-slate-500 text-sm">Traité par les meilleurs pressings de {cityName}, sélectionnés par nos soins.</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                    <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">3</div>
                    <h3 className="font-bold text-lg mb-2">Retour 48h</h3>
                    <p className="text-slate-500 text-sm">Votre linge revient lavé, séché et plié chez vous à {cityName}.</p>
                </div>
            </div>
        </div>
      </div>

      {/* FAQ SEO (ACCORDÉON) */}
      <div className="max-w-3xl mx-auto px-4 py-16 border-t border-slate-100">
        <h2 className="text-2xl font-bold mb-8 text-center">Questions fréquentes sur le pressing à {cityName}</h2>
        <div className="space-y-4">
            <details className="group bg-white rounded-xl border border-slate-200 open:border-teal-200 open:ring-1 open:ring-teal-100 transition-all">
                <summary className="flex items-center justify-between p-4 font-bold cursor-pointer list-none text-slate-800">
                    <span>Y a-t-il une blanchisserie Kilolab autour de moi à {cityName} ?</span>
                    <span className="transition-transform group-open:rotate-180">▼</span>
                </summary>
                <div className="px-4 pb-4 text-slate-600 text-sm leading-relaxed">
                    Oui, nous disposons d'un réseau de partenaires certifiés couvrant toute la zone de {cityName} et sa périphérie proche.
                </div>
            </details>
            <details className="group bg-white rounded-xl border border-slate-200 open:border-teal-200 open:ring-1 open:ring-teal-100 transition-all">
                <summary className="flex items-center justify-between p-4 font-bold cursor-pointer list-none text-slate-800">
                    <span>Quel est le prix d'un pressing au kilo à {cityName} ?</span>
                    <span className="transition-transform group-open:rotate-180">▼</span>
                </summary>
                <div className="px-4 pb-4 text-slate-600 text-sm leading-relaxed">
                    À {cityName}, comme partout en France, notre tarif unique commence à 3€/kg pour la formule Éco (48h).
                </div>
            </details>
        </div>
      </div>

      <Footer />
    </div>
  );
}
