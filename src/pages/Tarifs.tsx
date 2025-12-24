import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { Check, Sparkles } from 'lucide-react';

export default function Tarifs() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
            <h1 className="text-4xl font-black mb-4">Tarifs simples. Sans surprise.</h1>
            <p className="text-slate-500 text-lg">Lavez votre linge au juste prix.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-start">
            
            {/* FORMULE ÉCO */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                <h3 className="text-xl font-bold mb-2">Formule Éco</h3>
                <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-5xl font-black text-teal-600">3€</span>
                    <span className="text-slate-400 font-bold">/kg</span>
                </div>
                <ul className="space-y-4 mb-8">
                    <li className="flex items-center gap-3 text-slate-600 font-medium">
                        <Check size={20} className="text-teal-500" /> Lavage simple
                    </li>
                    <li className="flex items-center gap-3 text-slate-600 font-medium">
                        <Check size={20} className="text-teal-500" /> Séchage
                    </li>
                    <li className="flex items-center gap-3 text-slate-600 font-medium">
                        <Check size={20} className="text-teal-500" /> Pliage standard
                    </li>
                    <li className="flex items-center gap-3 text-slate-600 font-medium">
                        <Check size={20} className="text-teal-500" /> Prêt en 48h
                    </li>
                </ul>
                <Link to="/new-order" className="block w-full py-4 text-center border-2 border-slate-900 text-slate-900 font-bold rounded-xl hover:bg-slate-50 transition">
                    Choisir
                </Link>
            </div>

            {/* FORMULE EXPRESS (POPULAIRE) */}
            <div className="bg-slate-900 rounded-3xl p-8 border border-slate-900 shadow-xl relative text-white transform md:-translate-y-4">
                <div className="absolute top-0 right-0 bg-teal-500 text-white px-4 py-1 rounded-bl-xl rounded-tr-xl text-xs font-bold uppercase tracking-wider">
                    Populaire
                </div>
                <h3 className="text-xl font-bold mb-2">Formule Express</h3>
                <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-5xl font-black text-white">5€</span>
                    <span className="text-slate-400 font-bold">/kg</span>
                </div>
                <ul className="space-y-4 mb-8">
                    <li className="flex items-center gap-3 font-medium">
                        <Check size={20} className="text-teal-400" /> Tout inclus (Lavage, Séchage)
                    </li>
                    <li className="flex items-center gap-3 font-medium">
                        <Check size={20} className="text-teal-400" /> Pliage soigné
                    </li>
                    <li className="flex items-center gap-3 font-medium">
                        <Check size={20} className="text-teal-400" /> Traitement détachant
                    </li>
                    <li className="flex items-center gap-3 font-bold text-teal-400">
                        <Sparkles size={20} /> Prêt en 24h
                    </li>
                </ul>
                <Link to="/new-order" className="block w-full py-4 text-center bg-teal-500 text-slate-900 font-bold rounded-xl hover:bg-teal-400 transition shadow-lg shadow-teal-500/25">
                    Commander
                </Link>
            </div>

            {/* SPÉCIAL & TAPIS */}
            <div className="bg-white rounded-3xl p-8 border border-purple-100 shadow-sm">
                <h3 className="text-xl font-bold mb-2">Spécial & Tapis</h3>
                <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-5xl font-black text-purple-600">Devis</span>
                    <span className="text-slate-400 font-bold text-sm">/pièce</span>
                </div>
                <ul className="space-y-4 mb-8">
                    <li className="flex items-center gap-3 text-slate-600 font-medium">
                        <Check size={20} className="text-purple-400" /> Tapis & Rideaux
                    </li>
                    <li className="flex items-center gap-3 text-slate-600 font-medium">
                        <Check size={20} className="text-purple-400" /> Couettes XL
                    </li>
                    <li className="flex items-center gap-3 text-slate-600 font-medium">
                        <Check size={20} className="text-purple-400" /> Costumes délicats
                    </li>
                    <li className="flex items-center gap-3 text-slate-600 font-medium">
                        <Check size={20} className="text-purple-400" /> Traitement à sec
                    </li>
                </ul>
                <Link to="/contact" className="block w-full py-4 text-center border-2 border-purple-100 text-purple-600 font-bold rounded-xl hover:bg-purple-50 transition">
                    Demander un devis
                </Link>
            </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}
