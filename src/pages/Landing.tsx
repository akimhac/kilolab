import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowRight, Check, X, MapPin, Scale, Package, AlertCircle, Clock, Zap } from 'lucide-react';

export default function Landing() {
  return (
    <div className="font-sans text-slate-900 bg-white">
      <Navbar />

      {/* =========================================
          1. HERO SECTION (BALI STYLE)
      ========================================= */}
      <div className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        
        {/* Image de fond */}
        <img 
          src="https://images.unsplash.com/photo-1582735689369-4fe89db7114c?q=80&w=2400&auto=format&fit=crop" 
          className="absolute inset-0 w-full h-full object-cover"
          alt="Panier de linge propre et plié"
          loading="eager"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-slate-900/80"></div>
        
        {/* Badge */}
        <div className="absolute top-24 sm:top-32 left-1/2 -translate-x-1/2 z-20 w-full text-center animate-fade-in px-4">
          <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-teal-500/20 backdrop-blur-md text-white rounded-full text-xs sm:text-sm font-bold border border-teal-400/30 shadow-xl">
            ✨ Nouveau : Standard 3€/kg • Express 5€/kg
          </div>
        </div>

        {/* Contenu principal */}
        <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 text-center pt-16 sm:pt-20">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white mb-6 sm:mb-8 leading-[1.1] tracking-tight drop-shadow-2xl animate-slide-up">
            Votre temps est précieux.<br/>
            <span className="text-teal-400">Pas votre lessive.</span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-10 sm:mb-12 leading-relaxed font-light drop-shadow-lg animate-slide-up-delay">
            Confiez-nous votre linge <strong className="font-bold text-white">au kilo</strong>. Nous le lavons, séchons et<br className="hidden md:block"/>
            plions pour vous. Moins cher qu'un café par jour.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center animate-slide-up-delay-2">
            <Link 
              to="/new-order"
              aria-label="Créer une nouvelle commande" 
              className="group inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-4 sm:py-5 bg-teal-500 text-white rounded-full font-bold text-base sm:text-lg hover:bg-teal-400 transition-all duration-300 shadow-2xl shadow-teal-500/40 hover:shadow-teal-400/50 hover:scale-105 active:scale-95"
            >
              Me libérer de la corvée 
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20}/>
            </Link>
            
            <Link 
              to="/tarifs"
              aria-label="Consulter les tarifs" 
              className="inline-flex items-center justify-center px-6 sm:px-8 py-4 sm:py-5 bg-slate-800/40 backdrop-blur-md text-white border-2 border-white/20 rounded-full font-bold text-base sm:text-lg hover:bg-white hover:text-slate-900 transition-all duration-300 active:scale-95"
            >
              Voir les tarifs (Dès 3€/kg)
            </Link>
          </div>
        </div>
      </div>

      {/* =========================================
          2. COMPARATIF CHOC (MAISON vs KILOLAB)
      ========================================= */}
      <section className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4 text-slate-900">
              Laver chez soi coûte <span className="text-red-500 underline decoration-red-200 decoration-4">plus cher</span>.
            </h2>
            <p className="text-slate-600 text-lg">
              Entre l'eau, l'électricité, la lessive et votre temps... le calcul est vite fait.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center max-w-4xl mx-auto">
            {/* MAISON */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
              <h3 className="text-xl font-bold text-slate-500 mb-6 flex items-center justify-center gap-2">
                <X size={20}/> Faire sa lessive soi-même
              </h3>
              <ul className="space-y-4 text-left text-slate-500 mb-8 text-sm">
                <li className="flex justify-between border-b border-slate-100 pb-2"><span>Eau + Électricité</span> <span>~0.80€ /cycle</span></li>
                <li className="flex justify-between border-b border-slate-100 pb-2"><span>Lessive + Adoucissant</span> <span>~0.50€ /dose</span></li>
                <li className="flex justify-between border-b border-slate-100 pb-2"><span>Amortissement Machine</span> <span>~0.40€ /cycle</span></li>
                <li className="flex justify-between border-b border-slate-100 pb-2 bg-red-50 p-2 rounded font-bold text-red-600"><span>Votre Temps (2h)</span> <span>Inestimable ⏳</span></li>
              </ul>
              <div className="bg-slate-100 text-slate-500 font-bold p-4 rounded-xl text-center">
                Coût réel caché élevé 😓
              </div>
            </div>

            {/* KILOLAB */}
            <div className="bg-slate-900 p-8 rounded-3xl shadow-2xl border-2 border-teal-500 text-white transform md:scale-105">
              <h3 className="text-xl font-bold text-teal-400 mb-6 flex items-center justify-center gap-2">
                <Check size={20}/> Méthode Kilolab
              </h3>
              <ul className="space-y-4 text-left text-slate-300 mb-8 text-sm">
                <li className="flex justify-between border-b border-slate-700 pb-2"><span>Lavage Pro</span> <span className="text-teal-400">Inclus</span></li>
                <li className="flex justify-between border-b border-slate-700 pb-2"><span>Séchage & Pliage</span> <span className="text-teal-400">Inclus</span></li>
                <li className="flex justify-between border-b border-slate-700 pb-2"><span>Collecte & Livraison</span> <span className="text-teal-400">Inclus</span></li>
                <li className="flex justify-between border-b border-slate-700 pb-2 bg-teal-900/50 p-2 rounded font-bold text-white"><span>Votre Temps</span> <span>100% Libre 🎉</span></li>
              </ul>
              <div className="bg-teal-600 text-white font-bold p-4 rounded-xl shadow-lg text-center">
                À partir de 3€ / kg
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          3. NOTRE HISTOIRE (BALI)
      ========================================= */}
      <section className="bg-white py-20 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-16">

          {/* BLOC IMAGES */}
          <div className="flex-1 relative w-full max-w-md md:max-w-none">
            <div className="grid grid-cols-2 gap-3 sm:gap-4 relative z-10">
              <img 
                src="https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&auto=format&fit=crop&q=80" 
                alt="Temple balinais" 
                className="rounded-2xl sm:rounded-3xl shadow-xl object-cover h-40 sm:h-48 md:h-72 w-full mb-6 sm:mb-8 md:mb-12 transform -rotate-3 hover:rotate-0 transition-all duration-500 hover:shadow-2xl"
                loading="lazy"
              />
              <img 
                src="https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?w=800&auto=format&fit=crop&q=80" 
                alt="Linge propre et plié" 
                className="rounded-2xl sm:rounded-3xl shadow-xl object-cover h-40 sm:h-48 md:h-72 w-full mt-6 sm:mt-8 md:mt-12 transform rotate-3 hover:rotate-0 transition-all duration-500 hover:shadow-2xl"
                loading="lazy"
              />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-teal-50 to-indigo-50 rounded-full blur-3xl opacity-50 -z-10"></div>
          </div>

          {/* BLOC TEXTE */}
          <div className="flex-1 text-center md:text-left">
            <span className="text-teal-600 font-bold uppercase tracking-wider text-xs sm:text-sm inline-block mb-3 sm:mb-4 bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
              Notre Histoire
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 sm:mb-8 leading-tight">
              De la douceur de Bali <br/>à l'exigence de Paris.
            </h2>
            <p className="text-slate-600 leading-relaxed text-base sm:text-lg mb-5 sm:mb-6">
              Là-bas, le pressing au poids est la norme : simple, direct, sans artifices. 
              Nous avons eu le coup de foudre pour cette transparence radicale.
            </p>
            <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm inline-block mb-6 sm:mb-8 w-full md:w-auto">
              <p className="text-slate-600 leading-relaxed text-base sm:text-lg font-medium">
                Kilolab importe ce concept en France. Fini le casse-tête des tarifs à la pièce.
                <br/>
                <span className="text-teal-600 font-bold text-lg sm:text-xl mt-2 block">
                  Juste le poids du linge propre.
                </span>
              </p>
            </div>
            <Link 
              to="/become-washer"
              aria-label="Devenir Washer"
              className="inline-flex items-center font-bold text-slate-900 hover:text-teal-600 transition-all gap-2 underline underline-offset-4 decoration-2 hover:decoration-teal-600 group"
            >
              Envie de gagner de l'argent ? Devenez Washer (Particulier) 
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18}/>
            </Link>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
