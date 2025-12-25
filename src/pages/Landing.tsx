import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowRight, Check, X, MapPin, Scale, Package, AlertCircle } from 'lucide-react';

export default function Landing() {
  return (
    <div className="font-sans text-slate-900 bg-white">
      <Navbar />

      {/* =========================================
          1. HERO SECTION (VERSION PRO - GRADIENT)
      ========================================= */}
      <div className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        
        {/* Image de fond */}
        <img 
          src="https://images.unsplash.com/photo-1489274495757-95c7c83700c0?q=80&w=2400&auto=format&fit=crop" 
          className="absolute inset-0 w-full h-full object-cover"
          alt="Linge propre et soigné"
          loading="eager"
        />

        {/* Overlay Pro (Dégradé pour lisibilité) */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-slate-900/70"></div>
        
        {/* Badge */}
        <div className="absolute top-32 left-1/2 -translate-x-1/2 z-20 w-full text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-500/20 backdrop-blur-md text-white rounded-full text-sm font-bold border border-teal-400/30 shadow-xl">
            ✨ Le nouveau standard du pressing
          </div>
        </div>

        {/* Contenu principal */}
        <div className="relative z-20 max-w-5xl mx-auto px-6 text-center pt-20">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-[1.1] tracking-tight drop-shadow-lg">
            Votre temps est précieux.<br/>
            <span className="text-teal-400">Pas votre lessive.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-12 leading-relaxed font-light drop-shadow-md">
            Confiez-nous votre linge <strong className="font-bold text-white">au kilo</strong>. Nous le lavons, séchons et<br className="hidden md:block"/>
            plions pour vous. Moins cher qu'un café par jour.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link 
              to="/new-order" 
              className="group inline-flex items-center justify-center gap-3 px-8 py-5 bg-teal-500 text-white rounded-full font-bold text-lg hover:bg-teal-400 transition-all duration-300 shadow-2xl shadow-teal-500/40 hover:shadow-teal-400/50 hover:scale-105"
            >
              Me libérer de la corvée 
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={22}/>
            </Link>
            
            <Link 
              to="/tarifs" 
              className="inline-flex items-center justify-center px-8 py-5 bg-slate-800/40 backdrop-blur-md text-white border-2 border-white/20 rounded-full font-bold text-lg hover:bg-white hover:text-slate-900 transition-all duration-300"
            >
              Voir les tarifs (3€/kg)
            </Link>
          </div>
        </div>
      </div>

      {/* =========================================
          2. LE RITUEL
      ========================================= */}
      <div className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-block px-4 py-1 bg-teal-50 text-teal-700 rounded-full text-sm font-bold mb-4 border border-teal-100">
              ✨ Simple comme bonjour
            </div>
            <h2 className="text-4xl font-black text-slate-900">Votre nouveau rituel linge.</h2>
            <p className="text-slate-500 mt-4 text-lg">Plus d'images floues. Juste un service efficace.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 relative items-start">
            <div className="hidden md:block absolute top-24 left-[15%] right-[15%] h-0.5 bg-teal-100 z-0"></div>

            <div className="flex flex-col items-center relative z-10 group">
              <div className="w-48 h-48 rounded-full bg-white border-4 border-teal-50 shadow-xl flex items-center justify-center mb-8 transition transform group-hover:scale-105">
                <MapPin className="text-teal-500" size={64} strokeWidth={1.5} />
                <div className="absolute -bottom-4 w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold border-4 border-white">1</div>
              </div>
              <h3 className="text-xl font-bold mb-2 text-slate-900">Localisez & Déposez</h3>
              <p className="text-slate-500 text-sm leading-relaxed text-center px-4">
                Trouvez le pressing partenaire sur la carte interactive. Déposez votre sac directement au comptoir.
              </p>
            </div>

            <div className="flex flex-col items-center relative z-10 group">
              <div className="w-48 h-48 rounded-full bg-white border-4 border-teal-50 shadow-xl flex items-center justify-center mb-8 transition transform group-hover:scale-105">
                <Scale className="text-teal-500" size={64} strokeWidth={1.5} />
                <div className="absolute -bottom-4 w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold border-4 border-white">2</div>
              </div>
              <h3 className="text-xl font-bold mb-2 text-slate-900">Pesée & Traitement</h3>
              <p className="text-slate-500 text-sm leading-relaxed text-center px-4">
                Pesée transparente devant vous. Votre linge est ensuite lavé, séché et plié par des experts.
              </p>
            </div>

            <div className="flex flex-col items-center relative z-10 group">
              <div className="w-48 h-48 rounded-full bg-white border-4 border-teal-50 shadow-xl flex items-center justify-center mb-8 transition transform group-hover:scale-105">
                <Package className="text-teal-500" size={64} strokeWidth={1.5} />
                <div className="absolute -bottom-4 w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold border-4 border-white">3</div>
              </div>
              <h3 className="text-xl font-bold mb-2 text-slate-900">Retrait Flash</h3>
              <p className="text-slate-500 text-sm leading-relaxed text-center px-4">
                Recevez une notif SMS. Scannez votre QR Code pour récupérer votre linge propre en 30 secondes.
              </p>
            </div>
          </div>
          
          <div className="mt-20 text-center">
            <Link to="/new-order" className="inline-flex items-center gap-2 px-8 py-4 bg-teal-600 text-white rounded-full font-bold text-lg hover:bg-teal-500 transition shadow-lg shadow-teal-500/30">
              Trouver un pressing <ArrowRight size={20}/>
            </Link>
          </div>
        </div>
      </div>

      {/* =========================================
          3. COMPARATIF PRIX
      ========================================= */}
      <div className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-full font-bold text-sm mb-6 border border-red-200">
            <AlertCircle size={16}/> Arrêtez de brûler votre argent
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-6 text-slate-900">
            Le modèle traditionnel "à la pièce" est obsolète.
          </h2>
          <p className="text-lg text-slate-500 mb-16 max-w-2xl mx-auto">
            Passez au modèle "au poids" et redonnez du pouvoir d'achat à votre foyer.
          </p>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Modèle Vieux */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 scale-95 opacity-80 grayscale transition hover:grayscale-0 hover:opacity-100 hover:scale-100">
              <div className="flex items-center gap-2 mb-6 text-red-500 font-bold bg-red-50 w-fit px-3 py-1 rounded-full text-sm">
                <X size={16}/> Pressing Traditionnel
              </div>
              <ul className="space-y-4 text-left text-slate-500 font-medium text-sm">
                <li className="flex justify-between border-b border-slate-50 pb-2"><span>3 Chemises</span> <span>24.00€</span></li>
                <li className="flex justify-between border-b border-slate-50 pb-2"><span>2 Pantalons</span> <span>20.00€</span></li>
                <li className="flex justify-between border-b border-slate-50 pb-2"><span>1 Manteau</span> <span>25.00€</span></li>
              </ul>
              <div className="mt-8 bg-red-50 p-4 rounded-xl">
                <p className="text-xs text-red-400 font-bold uppercase mb-1">Total</p>
                <div className="text-4xl font-black text-red-500">69.00€</div>
              </div>
            </div>

            {/* Modèle Kilolab */}
            <div className="bg-slate-900 p-8 rounded-3xl shadow-2xl border-2 border-teal-500 relative transform md:scale-105 z-10 text-white">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-teal-500 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1">
                <Check size={14}/> La Méthode Kilolab
              </div>
              <div className="flex items-center gap-2 mb-8 text-teal-400 font-bold w-fit text-lg">
                Lavage au Kilo
              </div>
              <ul className="space-y-5 text-left text-slate-300 font-medium text-sm">
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
              <div className="mt-10 bg-slate-800 p-5 rounded-2xl border border-slate-700 relative overflow-hidden">
                <div className="absolute inset-0 bg-teal-500 opacity-10 blur-xl"></div>
                <p className="text-xs text-slate-400 font-bold uppercase mb-1 relative z-10">Total Kilolab</p>
                <div className="text-5xl font-black text-white relative z-10">9.30€</div>
                <p className="text-sm text-teal-300 font-bold mt-3 flex items-center justify-center gap-1 relative z-10 bg-teal-900/50 py-1 rounded-lg">
                  ↘ Vous économisez 59.70€ !
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================
          4. NOTRE HISTOIRE (CORRIGÉE : IMAGES VALIDÉES)
      ========================================= */}
      <div className="py-32 px-4 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          
          {/* GAUCHE : Composition des deux images */}
          <div className="relative h-[500px] w-full">
            {/* Image 1 : Temple de Bali */}
            <div className="absolute left-0 top-8 w-[55%] z-20 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
              <img 
                src="https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&auto=format&fit=crop&q=80" 
                className="w-full h-80 object-cover rounded-2xl shadow-2xl border-8 border-white"
                alt="Temple de Bali au lever du soleil"
              />
            </div>
            
            {/* Image 2 : Machines à laver modernes */}
            <div className="absolute right-0 bottom-0 w-[55%] z-10 transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <img 
                src="https://images.unsplash.com/photo-1545173168-9f1947eebb8f?w=800&auto=format&fit=crop&q=80" 
                className="w-full h-80 object-cover rounded-2xl shadow-2xl border-8 border-white"
                alt="Machines à laver professionnelles"
              />
            </div>
          </div>
          
          {/* DROITE : Texte */}
          <div>
            <div className="inline-block px-3 py-1.5 bg-teal-100 text-teal-700 rounded-lg font-bold text-xs mb-6 uppercase tracking-wider">
              NOTRE HISTOIRE
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-slate-900 leading-tight">
              De la douceur de Bali<br/>
              à l'exigence de Paris.
            </h2>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Là-bas, le pressing au poids est la norme : simple, direct, sans artifices. 
              Nous avons eu le coup de foudre pour cette transparence radicale.
            </p>
            
            <div className="bg-slate-50 p-6 rounded-2xl border-l-4 border-teal-500 mb-8">
              <p className="text-base text-slate-700 leading-relaxed">
                Kilolab importe ce concept en France. Fini le casse-tête des tarifs à la pièce.
              </p>
              <p className="text-xl font-black text-teal-600 mt-3">
                Juste le poids du linge propre.
              </p>
            </div>
            
            <Link 
              to="/partner" 
              className="inline-flex items-center gap-2 font-bold text-slate-900 hover:text-teal-600 transition-colors group"
            >
              Vous êtes un pressing ? Rejoignez-nous 
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18}/>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
