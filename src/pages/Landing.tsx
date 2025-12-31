import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowRight, Check, X, MapPin, Scale, Package, AlertCircle } from 'lucide-react';

export default function Landing() {
  return (
    <div className="font-sans text-slate-900 bg-white">
      <Navbar />

      {/* =========================================
          1. HERO SECTION - L'OPTION MARKETING GAGNANTE (OPTION 1)
      ========================================= */}
      <div className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        
        {/* Image de fond : Linge plié dans un panier (Chaleureux & Premium) */}
        <img 
          src="https://images.unsplash.com/photo-1582735689369-4fe89db7114c?q=80&w=2400&auto=format&fit=crop" 
          className="absolute inset-0 w-full h-full object-cover"
          alt="Panier de linge propre et plié"
          loading="eager"
          // @ts-ignore
          fetchpriority="high"
        />

        {/* Overlay Pro (Dégradé pour lisibilité parfaite du texte blanc) */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-slate-900/80"></div>
        
        {/* Badge - Animation fade-in */}
        <div className="absolute top-24 sm:top-32 left-1/2 -translate-x-1/2 z-20 w-full text-center animate-fade-in px-4">
          <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-teal-500/20 backdrop-blur-md text-white rounded-full text-xs sm:text-sm font-bold border border-teal-400/30 shadow-xl">
            ✨ Le nouveau standard du pressing
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
              Voir les tarifs (3€/kg)
            </Link>
          </div>
        </div>
      </div>

      {/* =========================================
          2. LE RITUEL
      ========================================= */}
      <div className="py-16 sm:py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 sm:mb-20">
            <div className="inline-block px-4 py-1 bg-teal-50 text-teal-700 rounded-full text-sm font-bold mb-4 border border-teal-100">
              ✨ Simple comme bonjour
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">Votre nouveau rituel linge.</h2>
            <p className="text-slate-500 mt-3 sm:mt-4 text-base sm:text-lg">Plus d'images floues. Juste un service efficace.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10 sm:gap-12 relative items-start">
            <div className="hidden md:block absolute top-24 left-[15%] right-[15%] h-0.5 bg-teal-100 z-0"></div>

            {/* Étape 1 */}
            <div className="flex flex-col items-center relative z-10 group">
              <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-white border-4 border-teal-50 shadow-xl flex items-center justify-center mb-6 sm:mb-8 transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-2xl group-hover:border-teal-100">
                <MapPin className="text-teal-500 transition-transform group-hover:scale-110" size={56} strokeWidth={1.5} />
                <div className="absolute -bottom-3 sm:-bottom-4 w-9 h-9 sm:w-10 sm:h-10 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold border-4 border-white text-sm sm:text-base">1</div>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 text-slate-900">Localisez & Déposez</h3>
              <p className="text-slate-500 text-sm leading-relaxed text-center px-2 sm:px-4">
                Trouvez le pressing partenaire sur la carte interactive. Déposez votre sac directement au comptoir.
              </p>
            </div>

            {/* Étape 2 */}
            <div className="flex flex-col items-center relative z-10 group">
              <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-white border-4 border-teal-50 shadow-xl flex items-center justify-center mb-6 sm:mb-8 transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-2xl group-hover:border-teal-100">
                <Scale className="text-teal-500 transition-transform group-hover:scale-110" size={56} strokeWidth={1.5} />
                <div className="absolute -bottom-3 sm:-bottom-4 w-9 h-9 sm:w-10 sm:h-10 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold border-4 border-white text-sm sm:text-base">2</div>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 text-slate-900">Pesée & Traitement</h3>
              <p className="text-slate-500 text-sm leading-relaxed text-center px-2 sm:px-4">
                Pesée transparente devant vous. Votre linge est ensuite lavé, séché et plié par des experts.
              </p>
            </div>

            {/* Étape 3 */}
            <div className="flex flex-col items-center relative z-10 group">
              <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-white border-4 border-teal-50 shadow-xl flex items-center justify-center mb-6 sm:mb-8 transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-2xl group-hover:border-teal-100">
                <Package className="text-teal-500 transition-transform group-hover:scale-110" size={56} strokeWidth={1.5} />
                <div className="absolute -bottom-3 sm:-bottom-4 w-9 h-9 sm:w-10 sm:h-10 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold border-4 border-white text-sm sm:text-base">3</div>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 text-slate-900">Retrait Flash</h3>
              <p className="text-slate-500 text-sm leading-relaxed text-center px-2 sm:px-4">
                Recevez une notif SMS. Scannez votre QR Code pour récupérer votre linge propre en 30 secondes.
              </p>
            </div>
          </div>
          
          <div className="mt-16 sm:mt-20 text-center">
            <Link to="/new-order" className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-teal-600 text-white rounded-full font-bold text-base sm:text-lg hover:bg-teal-500 transition-all shadow-lg shadow-teal-500/30 hover:scale-105 active:scale-95">
              Trouver un pressing <ArrowRight size={18}/>
            </Link>
          </div>
        </div>
      </div>

      {/* =========================================
          3. COMPARATIF PRIX
      ========================================= */}
      <div className="py-16 sm:py-24 bg-slate-50 border-y border-slate-200">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-100 text-red-600 rounded-full font-bold text-xs sm:text-sm mb-5 sm:mb-6 border border-red-200">
            <AlertCircle size={14}/>
            <span>Arrêtez de brûler votre argent</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4 sm:mb-6 text-slate-900 px-4">
            Le modèle traditionnel "à la pièce" est obsolète.
          </h2>
          <p className="text-base sm:text-lg text-slate-500 mb-12 sm:mb-16 max-w-2xl mx-auto px-4">
            Passez au modèle "au poids" et redonnez du pouvoir d'achat à votre foyer.
          </p>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center max-w-4xl mx-auto">
            {/* Modèle Vieux */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 scale-95 opacity-80 grayscale transition-all duration-300 hover:grayscale-0 hover:opacity-100 hover:scale-100">
              <div className="flex items-center gap-2 mb-5 sm:mb-6 text-red-500 font-bold bg-red-50 w-fit px-3 py-1 rounded-full text-xs sm:text-sm">
                <X size={14}/> Pressing Traditionnel
              </div>
              <ul className="space-y-3 sm:space-y-4 text-left text-slate-500 font-medium text-xs sm:text-sm">
                <li className="flex justify-between border-b border-slate-50 pb-2"><span>3 Chemises</span> <span className="font-bold">24.00€</span></li>
                <li className="flex justify-between border-b border-slate-50 pb-2"><span>2 Pantalons</span> <span className="font-bold">20.00€</span></li>
                <li className="flex justify-between border-b border-slate-50 pb-2"><span>1 Manteau</span> <span className="font-bold">25.00€</span></li>
              </ul>
              <div className="mt-6 sm:mt-8 bg-red-50 p-4 rounded-xl">
                <p className="text-xs text-red-400 font-bold uppercase mb-1">Total</p>
                <div className="text-3xl sm:text-4xl font-black text-red-500">69.00€</div>
              </div>
            </div>

            {/* Modèle Kilolab */}
            <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl shadow-2xl border-2 border-teal-500 relative transform md:scale-105 z-10 text-white transition-transform duration-300 hover:scale-110">
              <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 bg-teal-500 text-white text-xs font-bold px-3 sm:px-4 py-1 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1">
                <Check size={12}/> La Méthode Kilolab
              </div>
              <div className="flex items-center gap-2 mb-6 sm:mb-8 text-teal-400 font-bold w-fit text-base sm:text-lg">
                Lavage au Kilo
              </div>
              <ul className="space-y-4 sm:space-y-5 text-left text-slate-300 font-medium text-xs sm:text-sm">
                <li className="flex justify-between border-b border-slate-700 pb-2">
                  <span>3 Chemises (0.6kg)</span> <span className="text-teal-400 font-bold">1.80€</span>
                </li>
                <li className="flex justify-between border-b border-slate-700 pb-2">
                  <span>2 Pantalons (1kg)</span> <span className="text-teal-400 font-bold">3.00€</span>
                </li>
                <li className="flex justify-between border-b border-slate-700 pb-2">
                  <span>1 Manteau (1.5kg)</span> <span className="text-teal-400 font-bold">4.50€</span>
                </li>
              </ul>
              <div className="mt-8 sm:mt-10 bg-slate-800 p-4 sm:p-5 rounded-2xl border border-slate-700 relative overflow-hidden">
                <div className="absolute inset-0 bg-teal-500 opacity-10 blur-xl"></div>
                <p className="text-xs text-slate-400 font-bold uppercase mb-1 relative z-10">Total Kilolab</p>
                <div className="text-4xl sm:text-5xl font-black text-white relative z-10">9.30€</div>
                <p className="text-xs sm:text-sm text-teal-300 font-bold mt-2 sm:mt-3 flex items-center justify-center gap-1 relative z-10 bg-teal-900/50 py-1 rounded-lg">
                  ↘ Vous économisez 59.70€ !
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================
          4. NOTRE HISTOIRE
      ========================================= */}
      <section className="bg-white py-16 sm:py-24 px-4 border-t border-slate-100 overflow-hidden">
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
              {/* Image 2 : Machines modernes */}
              <img 
                src="https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?w=800&auto=format&fit=crop&q=80" 
                alt="Linge propre et plié" 
                className="rounded-2xl sm:rounded-3xl shadow-xl object-cover h-40 sm:h-48 md:h-72 w-full mt-6 sm:mt-8 md:mt-12 transform rotate-3 hover:rotate-0 transition-all duration-500 hover:shadow-2xl"
                loading="lazy"
              />
            </div>
            {/* Décoration d'arrière-plan */}
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
              to="/partner"
              aria-label="Devenir partenaire"
              className="inline-flex items-center font-bold text-slate-900 hover:text-teal-600 transition-all gap-2 underline underline-offset-4 decoration-2 hover:decoration-teal-600 group"
            >
              Vous êtes un pressing ? Rejoignez-nous 
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18}/>
            </Link>
          </div>

        </div>
      </section>
{/* =========================================
    LIENS NAVIGATION & LÉGAL (SEO)
========================================= */}
<div className="py-8 px-4 bg-white border-t border-slate-100">
  <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
    
    {/* Liens Navigation */}
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
      <Link to="/faq" className="hover:text-teal-600 transition font-medium">
        FAQ
      </Link>
      <Link to="/for-who" className="hover:text-teal-600 transition font-medium">
        Comment ça marche
      </Link>
      <Link to="/tarifs" className="hover:text-teal-600 transition font-medium">
        Tarifs
      </Link>
      <Link to="/contact" className="hover:text-teal-600 transition font-medium">
        Contact
      </Link>
    </div>

    {/* Liens Légal */}
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
      <Link to="/legal" className="hover:text-teal-600 transition font-medium">
        Mentions légales
      </Link>
      <Link to="/cgu" className="hover:text-teal-600 transition font-medium">
        CGU
      </Link>
      <Link to="/cgv" className="hover:text-teal-600 transition font-medium">
        CGV
      </Link>
      <Link to="/privacy" className="hover:text-teal-600 transition font-medium">
        Confidentialité
      </Link>
      <Link to="/cookies" className="hover:text-teal-600 transition font-medium">
        Cookies
      </Link>
    </div>
  </div>
</div>

      <Footer />
    </div>
  );
}
