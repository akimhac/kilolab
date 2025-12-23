import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import TrustBar from './TrustBar';

export default function Hero() {
  return (
    <div className="relative bg-slate-950 overflow-hidden min-h-screen flex flex-col">
      <div className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" alt="Linge Propre" className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-slate-900/30"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
      </div>

      <div className="relative z-10 flex-grow flex items-center pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-300 text-sm font-bold mb-8 backdrop-blur-md shadow-lg">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </span>
              Le nouveau standard du pressing
            </div>

            <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight text-white mb-8 leading-[1.05] drop-shadow-2xl">
              Votre temps est précieux.<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-emerald-300">Pas votre lessive.</span>
            </h1>

            <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl leading-relaxed font-medium drop-shadow-md">
              Confiez-nous votre linge <strong>au kilo</strong>. Nous le lavons, séchons et plions pour vous. 
              Moins cher qu'un café par jour.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 items-start">
              <Link to="/signup" className="w-full sm:w-auto px-10 py-5 bg-teal-500 text-slate-900 rounded-full font-bold text-xl hover:bg-teal-400 transition shadow-[0_0_40px_rgba(20,184,166,0.5)] flex items-center justify-center gap-2 transform hover:scale-105">
                Me libérer de la corvée <ArrowRight className="w-6 h-6" />
              </Link>
              
              <Link to="/tarifs" className="w-full sm:w-auto px-10 py-5 bg-white/10 border border-white/30 text-white rounded-full font-bold text-xl hover:bg-white/20 transition backdrop-blur-md flex items-center justify-center">
                Voir les tarifs (3€/kg)
              </Link>
            </div>
          </div>
        </div>
      </div>
      <TrustBar />
    </div>
  );
}
