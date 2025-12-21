import { MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NetworkSection() {
  return (
    <section className="py-16 md:py-24 bg-[#020617] text-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        
        <div className="w-16 h-16 bg-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-[0_0_20px_rgba(20,184,166,0.4)]">
          <MapPin size={32} className="text-slate-900" />
        </div>

        <h2 className="text-3xl md:text-6xl font-extrabold mb-4">
          Un maillage national.<br/>
          <span className="text-slate-500">En pleine expansion.</span>
        </h2>

        {/* STATS BOX */}
        <div className="mt-12 md:mt-16 bg-[#0F172A] border border-white/10 rounded-2xl p-6 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Sur mobile : Bordure en bas. Sur Desktop : Bordure à droite */}
            <div className="text-left border-b border-white/10 pb-8 md:pb-0 md:border-b-0 md:border-r md:border-white/10">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Pressings Référencés</p>
              <div className="text-4xl md:text-5xl font-extrabold text-white">1,800+</div>
              <p className="text-teal-500 text-sm mt-1">Zones éligibles identifiées</p>
            </div>
            <div className="text-left md:pl-8">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Couverture</p>
              <div className="text-4xl md:text-5xl font-extrabold text-white">92%</div>
              <p className="text-teal-500 text-sm mt-1">Des villes {'>'} 10k hab.</p>
            </div>
          </div>

          {/* CTA PRESSING */}
          <div className="mt-8 md:mt-12 pt-8 border-t border-white/10 text-left">
            <h3 className="text-lg md:text-xl font-bold text-white mb-2">Vous gérez un pressing ?</h3>
            <p className="text-slate-400 mb-6 text-sm">Votre établissement fait peut-être partie de notre sélection d'élite.</p>
            <Link 
              to="/become-partner"
              className="w-full bg-white text-slate-900 font-bold py-3 md:py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-200 transition text-sm md:text-base"
            >
              Vérifier si mon pressing est éligible <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
