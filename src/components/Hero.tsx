import { Link } from 'react-router-dom';
import { ArrowRight, UserPlus } from 'lucide-react';
import TrustBar from './TrustBar';

export default function Hero() {
  return (
    <div className="relative bg-slate-950 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1521791136064-7984c1bc84f2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
          alt="Pressing moderne"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/90 to-slate-950"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 sm:pt-48 sm:pb-24">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl max-w-3xl mx-auto">
            <span className="block">Votre temps est précieux.</span>
            <span className="block text-teal-500">Pas votre lessive.</span>
          </h1>
          <p className="mt-6 max-w-lg mx-auto text-xl text-gray-300 sm:max-w-3xl">
            Confiez-nous votre linge <strong>au kilo</strong>. Nous le lavons, séchons et plions pour vous. Moins cher qu'un café par jour.
          </p>
          <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center sm:space-x-4">
            {/* Bouton Principal : Redirige vers l'inscription */}
            <Link
              to="/signup"
              className="w-full flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-full text-slate-900 bg-teal-500 hover:bg-teal-400 md:py-4 md:text-lg md:px-10 transition-all hover:scale-105 shadow-lg shadow-teal-500/20 mb-4 sm:mb-0"
            >
              Me libérer de la corvée
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            {/* Nouveau Bouton Secondaire : Voir les tarifs */}
            <Link
              to="/pricing"
              className="w-full flex items-center justify-center px-8 py-4 border-2 border-teal-500 text-base font-medium rounded-full text-teal-500 hover:bg-teal-500 hover:text-slate-900 md:py-4 md:text-lg md:px-10 transition-all"
            >
              Voir les tarifs (3€/kg)
            </Link>
          </div>
        </div>
      </div>
      <TrustBar />
    </div>
  );
}
