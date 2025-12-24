import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, ArrowRight, Star } from 'lucide-react';

export default function Trouver() {
  const navigate = useNavigate();
  const [city, setCity] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // On redirige vers la commande avec la ville pré-remplie (si on voulait complexifier)
    // Pour l'instant on envoie vers le new order classique
    navigate('/new-order');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />
      
      {/* HERO RECHERCHE */}
      <div className="pt-32 pb-20 px-4 bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-black mb-6">Trouvez un artisan près de chez vous</h1>
            <p className="text-slate-500 text-lg mb-8">Saisissez votre ville pour voir les disponibilités.</p>
            
            <form onSubmit={handleSearch} className="relative max-w-xl mx-auto">
                <div className="flex items-center bg-white border-2 border-slate-200 rounded-2xl p-2 shadow-lg focus-within:border-teal-500 transition">
                    <MapPin className="ml-4 text-slate-400" size={24}/>
                    <input 
                        type="text" 
                        placeholder="Ex: Paris, Lille, Maubeuge..." 
                        className="flex-1 p-3 outline-none font-bold text-lg text-slate-800 placeholder:font-normal"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                    <button type="submit" className="bg-slate-900 text-white p-4 rounded-xl hover:bg-teal-500 transition">
                        <Search size={24}/>
                    </button>
                </div>
            </form>
        </div>
      </div>

      {/* LISTE DES VILLES POPULAIRES (Fake pour le SEO/Design) */}
      <div className="py-16 px-4 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-8">Zones populaires</h2>
        <div className="grid md:grid-cols-3 gap-6">
            {['Paris', 'Lille', 'Maubeuge', 'Valenciennes', 'Lyon', 'Bordeaux'].map((ville) => (
                <div key={ville} onClick={() => navigate('/new-order')} className="group bg-white p-6 rounded-2xl border border-slate-100 hover:border-teal-500 cursor-pointer transition shadow-sm hover:shadow-md">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-lg">{ville}</h3>
                        <ArrowRight size={20} className="text-slate-300 group-hover:text-teal-500 transition"/>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-slate-500">
                        <Star size={14} className="fill-yellow-400 text-yellow-400"/>
                        <span className="font-bold text-slate-900">4.9</span>
                        <span>(Partenaires vérifiés)</span>
                    </div>
                </div>
            ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
