import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Check, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Pricing() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold mb-4">Tarifs simples. Sans surprise.</h1>
          <p className="text-slate-500 text-xl">Lavez votre linge au juste prix.</p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          
          {/* OFFRE 1 : ÉCO */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:border-teal-500 transition duration-300">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Formule Éco</h3>
            <div className="text-4xl font-extrabold text-teal-600 mb-6">3€ <span className="text-sm text-slate-400 font-normal">/kg</span></div>
            <ul className="space-y-4 mb-8 text-slate-600">
              <li className="flex gap-3"><Check size={20} className="text-teal-500"/> Lavage simple</li>
              <li className="flex gap-3"><Check size={20} className="text-teal-500"/> Séchage</li>
              <li className="flex gap-3"><Check size={20} className="text-teal-500"/> Pliage standard</li>
              <li className="flex gap-3"><Check size={20} className="text-teal-500"/> Prêt en 48h</li>
            </ul>
            <Link to="/new-order" className="block w-full py-3 border-2 border-slate-900 text-slate-900 font-bold rounded-xl text-center hover:bg-slate-900 hover:text-white transition">
              Choisir
            </Link>
          </div>

          {/* OFFRE 2 : EXPRESS / PREMIUM */}
          <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl transform md:-translate-y-4 border border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-teal-500 text-black text-xs font-bold px-3 py-1 rounded-bl-xl">POPULAIRE</div>
            <h3 className="text-xl font-bold mb-2">Formule Express</h3>
            <div className="text-4xl font-extrabold text-white mb-6">5€ <span className="text-sm text-slate-400 font-normal">/kg</span></div>
            <ul className="space-y-4 mb-8 text-slate-300">
              <li className="flex gap-3"><Check size={20} className="text-teal-400"/> Tout inclus (Lavage, Séchage)</li>
              <li className="flex gap-3"><Check size={20} className="text-teal-400"/> Pliage soigné</li>
              <li className="flex gap-3"><Check size={20} className="text-teal-400"/> Traitement détachant</li>
              <li className="flex gap-3"><Check size={20} className="text-teal-400"/> <strong>Prêt en 24h</strong></li>
            </ul>
            <Link to="/new-order" className="block w-full py-3 bg-teal-500 text-slate-900 font-bold rounded-xl text-center hover:bg-teal-400 transition">
              Commander
            </Link>
          </div>

          {/* OFFRE 3 : SPÉCIAL */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:border-purple-500 transition duration-300">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Spécial & Tapis</h3>
            <div className="text-4xl font-extrabold text-purple-600 mb-6">Devis <span className="text-sm text-slate-400 font-normal">/pièce</span></div>
            <ul className="space-y-4 mb-8 text-slate-600">
              <li className="flex gap-3"><Check size={20} className="text-purple-500"/> Tapis & Rideaux</li>
              <li className="flex gap-3"><Check size={20} className="text-purple-500"/> Couettes XL</li>
              <li className="flex gap-3"><Check size={20} className="text-purple-500"/> Costumes délicats</li>
              <li className="flex gap-3"><Check size={20} className="text-purple-500"/> Traitement à sec</li>
            </ul>
            <Link to="/contact" className="block w-full py-3 border-2 border-purple-100 text-purple-600 font-bold rounded-xl text-center hover:bg-purple-50 transition">
              Demander un devis
            </Link>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}
