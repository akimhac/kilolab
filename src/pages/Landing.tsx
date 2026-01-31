import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowRight, Check, X, MapPin, Scale, Package, AlertCircle, Clock, Truck } from 'lucide-react';

export default function Landing() {
  return (
    <div className="font-sans text-slate-900 bg-white">
      <Navbar />

      {/* =========================================
          1. HERO SECTION (STORYTELLING)
      ========================================= */}
      <div className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1582735689369-4fe89db7114c?q=80&w=2400&auto=format&fit=crop" 
          className="absolute inset-0 w-full h-full object-cover"
          alt="Linge propre"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-slate-900/80"></div>
        
        <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 text-center pt-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/20 backdrop-blur-md text-white rounded-full text-sm font-bold border border-teal-400/30 mb-8 animate-fade-in">
            ✨ Standard 3€/kg • Express 5€/kg
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-[1.1] tracking-tight drop-shadow-2xl animate-slide-up">
            Votre temps est précieux.<br/>
            <span className="text-teal-400">Pas votre lessive.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-12 leading-relaxed font-light drop-shadow-lg">
            Confiez-nous votre linge <strong className="font-bold text-white">au kilo</strong>. 
            Lavage, séchage et pliage inclus. Moins cher que la laverie, le service en plus.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link 
              to="/new-order"
              className="group inline-flex items-center justify-center gap-3 px-8 py-5 bg-teal-500 text-white rounded-full font-bold text-lg hover:bg-teal-400 transition-all shadow-2xl hover:scale-105"
            >
              Commander un lavage
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20}/>
            </Link>
            <Link 
              to="/tarifs"
              className="inline-flex items-center justify-center px-8 py-5 bg-white/10 backdrop-blur-md text-white border-2 border-white/20 rounded-full font-bold text-lg hover:bg-white hover:text-slate-900 transition-all"
            >
              Voir les tarifs
            </Link>
          </div>
        </div>
      </div>

      {/* =========================================
          2. OFFRES & PRIX
      ======================================== */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">Une formule pour chaque besoin</h2>
            <p className="text-slate-500 text-lg">Pas de frais cachés. Pesée devant vous.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* STANDARD */}
            <div className="border border-slate-200 rounded-3xl p-8 hover:shadow-xl transition relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-2 bg-slate-200 group-hover:bg-slate-900 transition-colors"></div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-black">Standard</h3>
                  <p className="text-slate-500">Le choix malin</p>
                </div>
                <div className="text-right">
                  <span className="text-4xl font-black">3€</span>
                  <span className="text-slate-400">/kg</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex gap-3"><Clock className="text-slate-400"/> Délai 48h - 72h</li>
                <li className="flex gap-3"><Truck className="text-slate-400"/> Collecte & Livraison</li>
                <li className="flex gap-3"><Check className="text-green-500"/> Lavé, Séché, Plié</li>
              </ul>
              <Link to="/new-order" className="block w-full py-4 bg-slate-100 text-slate-900 font-bold rounded-xl text-center hover:bg-slate-900 hover:text-white transition">
                Choisir Standard
              </Link>
            </div>

            {/* EXPRESS */}
            <div className="border-2 border-teal-500 rounded-3xl p-8 shadow-2xl relative overflow-hidden bg-slate-900 text-white transform md:scale-105">
              <div className="absolute top-4 right-4 bg-teal-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                Populaire
              </div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-black text-white">Express</h3>
                  <p className="text-teal-400">Pour les pressés</p>
                </div>
                <div className="text-right">
                  <span className="text-4xl font-black">5€</span>
                  <span className="text-slate-400">/kg</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex gap-3"><Clock className="text-teal-400"/> <strong>Délai 24h Chrono</strong></li>
                <li className="flex gap-3"><Truck className="text-teal-400"/> Collecte & Livraison Prioritaire</li>
                <li className="flex gap-3"><Check className="text-teal-400"/> Lavé, Séché, Plié</li>
              </ul>
              <Link to="/new-order" className="block w-full py-4 bg-teal-500 text-slate-900 font-bold rounded-xl text-center hover:bg-teal-400 transition">
                Choisir Express
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          3. NOTRE HISTOIRE (BALI)
      ========================================= */}
      <section className="bg-slate-50 py-24 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 relative w-full">
            <div className="grid grid-cols-2 gap-4 relative z-10">
              <img src="https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&auto=format&fit=crop" alt="Bali" className="rounded-2xl shadow-xl transform -rotate-2 hover:rotate-0 transition duration-500" />
              <img src="https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?w=800&auto=format&fit=crop" alt="Linge" className="rounded-2xl shadow-xl transform rotate-2 hover:rotate-0 transition duration-500 mt-8" />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-teal-200/20 rounded-full blur-3xl -z-10"></div>
          </div>

          <div className="flex-1 text-left">
            <span className="text-teal-600 font-bold uppercase tracking-wider text-sm mb-4 block">Notre Histoire</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
              De la douceur de Bali <br/>à l'exigence de Paris.
            </h2>
            <p className="text-slate-600 text-lg mb-6 leading-relaxed">
              Là-bas, le pressing au poids est la norme. Simple, direct, transparent. 
              Nous avons importé ce concept pour en finir avec le casse-tête des tarifs à la pièce.
            </p>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <p className="font-medium text-slate-900 text-lg">
                "Kilolab, c'est la fin du ticket de pressing à rallonge. 
                <span className="text-teal-600 font-bold block mt-2">Juste le poids du linge propre."</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
