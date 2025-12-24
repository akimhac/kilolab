import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowRight, Check, X, MapPin, Scale, Package, AlertCircle } from 'lucide-react';

export default function Landing() {
  return (
    <div className="font-sans text-slate-900 bg-white">
      <Navbar />

      {/* =========================================
          1. HERO SECTION (Fidèle à ton image "towel")
      ========================================= */}
      <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Fond avec texture linge/serviettes */}
        <div className="absolute inset-0 z-0">
            <img 
                src="https://images.unsplash.com/photo-1629033486259-b14a09164286?q=80&w=2000&auto=format&fit=crop" 
                className="w-full h-full object-cover opacity-20"
                alt="Texture serviettes"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white via-white/50 to-white"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <div className="inline-block px-4 py-2 bg-teal-50 text-teal-700 rounded-full text-sm font-bold mb-6 border border-teal-100 shadow-sm">
            ✨ Le nouveau standard du pressing
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-tight text-slate-900">
            Votre temps est précieux.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-600">Pas votre lessive.</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Confiez-nous votre linge <strong>au kilo</strong>. Nous le lavons, séchons et plions pour vous. 
            Moins cher qu'un café par jour.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/new-order" className="px-8 py-4 bg-teal-500 text-white rounded-full font-bold text-lg hover:bg-teal-400 transition shadow-xl shadow-teal-500/30 flex items-center justify-center gap-2">
              Me libérer de la corvée <ArrowRight size={20}/>
            </Link>
            <Link to="/tarifs" className="px-8 py-4 bg-slate-900 text-white rounded-full font-bold text-lg hover:bg-slate-800 transition flex items-center justify-center">
              Voir les tarifs (3€/kg)
            </Link>
          </div>
        </div>
      </div>

      {/* =========================================
          2. HISTOIRE (Bali & Paris - Comme ta maquette)
      ========================================= */}
      <div className="py-20 px-4 bg-white">
         <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            {/* Images : Temple Bali + Machine */}
            <div className="relative h-[400px] w-full flex items-center justify-center">
                <img 
                    src="https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=600&auto=format&fit=crop&q=60" 
                    className="absolute left-0 top-10 w-2/3 h-64 object-cover rounded-2xl shadow-xl z-10 border-4 border-white rotate-[-6deg]"
                    alt="Temple Bali"
                />
                <img 
                    src="https://images.unsplash.com/photo-1545173168-9f1947eebb8f?w=600&auto=format&fit=crop&q=60" 
                    className="absolute right-0 bottom-10 w-2/3 h-64 object-cover rounded-2xl shadow-xl z-0 border-4 border-white rotate-[6deg]"
                    alt="Machines à laver"
                />
            </div>
            
            <div>
                <div className="inline-block px-3 py-1 bg-teal-100 text-teal-800 rounded-lg font-bold text-xs mb-4 uppercase tracking-wider">NOTRE HISTOIRE</div>
                <h2 className="text-4xl font-black mb-6 text-slate-900 leading-tight">
                    De la douceur de Bali<br/>
                    à l'exigence de Paris.
                </h2>
                <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                    Là-bas, le pressing au poids est la norme : simple, direct, sans artifices. 
                    Nous avons eu le coup de foudre pour cette transparence radicale.
                </p>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <p className="text-lg text-slate-800 font-medium">
                        Kilolab importe ce concept en France. Fini le casse-tête des tarifs à la pièce.
                        <br/><span className="text-teal-600 font-black text-xl mt-2 block">Juste le poids du linge propre.</span>
                    </p>
                </div>
            </div>
         </div>
      </div>

      {/* =========================================
          3. COMPARATIF (Exactement ton screen : Card Noir à droite)
      ========================================= */}
      <div className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="max-w-5xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-full font-bold text-sm mb-6 border border-red-200">
                <AlertCircle size={16}/> Arrêtez de brûler votre argent
            </div>
            <h2 className="text-4xl font-black mb-4 text-slate-900">
                Le modèle traditionnel "à la pièce" est obsolète.
            </h2>
            <p className="text-lg text-slate-500 mb-16">
                Passez au modèle "au poids" et redonnez du pouvoir d'achat à votre foyer.
            </p>

            <div className="grid md:grid-cols-2 gap-6 items-center">
                
                {/* Modèle Vieux (Blanc) */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
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

                {/* Modèle Kilolab (FONCÉ - Comme ton screen) */}
                <div className="bg-slate-900 p-8 rounded-3xl shadow-2xl border-2 border-teal-500 relative transform md:scale-105 z-10 text-white">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-teal-500 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-lg">
                        La Méthode Kilolab
                    </div>
                    
                    <div className="flex items-center gap-2 mb-6 text-teal-400 font-bold w-fit text-lg">
                        <Check size={20} className="bg-teal-500 text-slate-900 rounded-full p-0.5"/> Lavage au Kilo
                    </div>

                    <ul className="space-y-4 text-left text-slate-300 font-medium text-sm">
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

                    <div className="mt-8 bg-slate-800 p-4 rounded-xl border border-slate-700">
                        <p className="text-xs text-slate-400 font-bold uppercase mb-1">Total Kilolab</p>
                        <div className="text-5xl font-black text-white">9.30€</div>
                        <p className="text-sm text-teal-400 font-bold mt-2 flex items-center justify-center gap-1">
                            ↘ Vous économisez 59.70€
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* =========================================
          4. RITUEL / ETAPES (Tes cercles exacts)
      ========================================= */}
      <div className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
                <div className="inline-block px-4 py-1 bg-teal-50 text-teal-700 rounded-full text-sm font-bold mb-4 border border-teal-100">
                    ✨ Simple comme bonjour
                </div>
                <h2 className="text-4xl font-black text-slate-900">Votre nouveau rituel linge.</h2>
                <p className="text-slate-500 mt-4 text-lg">Plus d'images floues. Juste un service efficace.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 relative items-start">
                {/* Ligne connecteur */}
                <div className="hidden md:block absolute top-24 left-[15%] right-[15%] h-0.5 bg-teal-100 z-0"></div>

                {/* ETAPE 1 */}
                <div className="flex flex-col items-center relative z-10 group">
                    <div className="w-48 h-48 rounded-full bg-white border-4 border-teal-50 shadow-xl flex items-center justify-center mb-8 relative group-hover:scale-105 transition duration-300">
                        <MapPin className="text-teal-500" size={64} strokeWidth={1.5} />
                        <div className="absolute -bottom-4 w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold border-4 border-white">1</div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm w-full text-center hover:shadow-md transition">
                        <h3 className="text-xl font-bold mb-2 text-slate-900">Localisez & Déposez</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Trouvez le pressing partenaire sur la carte interactive. Déposez votre sac directement au comptoir.
                        </p>
                    </div>
                </div>

                {/* ETAPE 2 */}
                <div className="flex flex-col items-center relative z-10 group">
                    <div className="w-48 h-48 rounded-full bg-white border-4 border-teal-50 shadow-xl flex items-center justify-center mb-8 relative group-hover:scale-105 transition duration-300">
                        <Scale className="text-teal-500" size={64} strokeWidth={1.5} />
                        <div className="absolute -bottom-4 w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold border-4 border-white">2</div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm w-full text-center hover:shadow-md transition">
                        <h3 className="text-xl font-bold mb-2 text-slate-900">Pesée & Traitement</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Pesée transparente devant vous. Votre linge est ensuite lavé, séché et plié par des experts.
                        </p>
                    </div>
                </div>

                {/* ETAPE 3 */}
                <div className="flex flex-col items-center relative z-10 group">
                    <div className="w-48 h-48 rounded-full bg-white border-4 border-teal-50 shadow-xl flex items-center justify-center mb-8 relative group-hover:scale-105 transition duration-300">
                        <Package className="text-teal-500" size={64} strokeWidth={1.5} />
                        <div className="absolute -bottom-4 w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold border-4 border-white">3</div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm w-full text-center hover:shadow-md transition">
                        <h3 className="text-xl font-bold mb-2 text-slate-900">Retrait Flash</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Recevez une notif SMS. Scannez votre QR Code pour récupérer votre linge propre en 30 secondes.
                        </p>
                    </div>
                </div>

            </div>
            
            <div className="mt-16 text-center">
                 <Link to="/new-order" className="inline-flex items-center gap-2 px-8 py-4 bg-teal-600 text-white rounded-full font-bold text-lg hover:bg-teal-500 transition shadow-lg shadow-teal-500/30">
                    Trouver un pressing <ArrowRight size={20}/>
                 </Link>
            </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
