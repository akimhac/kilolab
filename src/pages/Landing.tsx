import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CheckCircle, ArrowRight, Star, XCircle } from 'lucide-react';

export default function Landing() {
  return (
    <div className="font-sans text-slate-900 bg-white">
      <Navbar />

      {/* 1. HERO SECTION */}
      <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
            <img 
                src="https://images.unsplash.com/photo-1545173168-9f1947eebb8f?q=80&w=2000&auto=format&fit=crop" 
                className="w-full h-full object-cover opacity-10"
                alt="Texture linge"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white via-white/80 to-white"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <div className="inline-block px-4 py-2 bg-teal-50 text-teal-700 rounded-full text-sm font-bold mb-6 border border-teal-100 shadow-sm animate-fade-in-up">
            ✨ Le nouveau standard du pressing
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-tight">
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
            <Link to="/tarifs" className="px-8 py-4 bg-white text-slate-700 border-2 border-slate-200 rounded-full font-bold text-lg hover:border-slate-900 transition flex items-center justify-center">
              Voir les tarifs (3€/kg)
            </Link>
          </div>

          <div className="mt-12 flex items-center justify-center gap-2 text-sm font-bold text-slate-400">
            <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white"></div>
                ))}
            </div>
            <p>Déjà 500+ clients heureux</p>
          </div>
        </div>
      </div>

      {/* 2. LE PROBLÈME (Remonté comme demandé) */}
      <div className="py-20 bg-slate-50 border-y border-slate-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-full font-bold text-sm mb-6">
                <XCircle size={16}/> Arrêtez de brûler votre argent
            </div>
            <h2 className="text-4xl font-black mb-6 text-slate-900">
                Le modèle traditionnel<br/>
                "à la pièce" est obsolète.
            </h2>
            <p className="text-lg text-slate-500 mb-12">
                Passez au modèle "au poids" et redonnez du pouvoir d'achat à votre foyer.
            </p>

            <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 opacity-70 scale-95 grayscale">
                    <h3 className="text-xl font-bold text-slate-400 mb-6">Pressing Traditionnel</h3>
                    <ul className="space-y-4 text-left text-slate-400">
                        <li className="flex justify-between border-b border-slate-50 pb-2"><span>3 Chemises</span> <span>24.00€</span></li>
                        <li className="flex justify-between border-b border-slate-50 pb-2"><span>2 Pantalons</span> <span>20.00€</span></li>
                        <li className="flex justify-between border-b border-slate-50 pb-2"><span>1 Manteau</span> <span>25.00€</span></li>
                    </ul>
                    <div className="mt-8 text-3xl font-black text-red-300">Total: 69.00€</div>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-xl border-2 border-teal-500 relative transform md:scale-105 z-10">
                    <div className="absolute top-0 right-0 bg-teal-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl uppercase">Gagnant</div>
                    <h3 className="text-xl font-bold text-teal-900 mb-6">Modèle Kilolab</h3>
                    <ul className="space-y-4 text-left text-slate-700">
                        <li className="flex justify-between border-b border-slate-50 pb-2 items-center">
                            <span>Même quantité de linge</span> 
                            <span className="bg-teal-50 px-2 py-1 rounded text-teal-700 font-bold">Au poids</span>
                        </li>
                        <li className="flex justify-between border-b border-slate-50 pb-2">
                            <span>Lavage + Séchage + Pliage</span>
                            <span>Inclus</span>
                        </li>
                    </ul>
                    <div className="mt-8 text-4xl font-black text-teal-600">Total: 15.00€</div>
                    <p className="text-xs text-teal-600 font-bold mt-2">Soit 54€ d'économie immédiate.</p>
                </div>
            </div>
        </div>
      </div>

      {/* 3. COMMENT ÇA MARCHE (Avec les PHOTOS dans les ronds) */}
      <div className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-black text-center mb-16">Simple comme bonjour.</h2>
            
            <div className="grid md:grid-cols-3 gap-12 text-center">
                
                {/* ETAPE 1 */}
                <div className="flex flex-col items-center">
                    <div className="w-48 h-48 rounded-full border-4 border-teal-100 p-2 mb-6 relative">
                        <img 
                            src="https://images.unsplash.com/photo-1549488497-61759b8eb648?q=80&w=500&auto=format&fit=crop" 
                            className="w-full h-full object-cover rounded-full shadow-lg"
                            alt="Localiser"
                        />
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-10 h-10 bg-teal-500 text-white rounded-full flex items-center justify-center font-black border-4 border-white text-lg">1</div>
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Localisez & Déposez</h3>
                    <p className="text-slate-500 px-4">Trouvez le pressing partenaire le plus proche sur la carte. Déposez votre sac directement au comptoir.</p>
                </div>

                {/* ETAPE 2 */}
                <div className="flex flex-col items-center">
                    <div className="w-48 h-48 rounded-full border-4 border-teal-100 p-2 mb-6 relative">
                        <img 
                            src="https://images.unsplash.com/photo-1582735689369-4fe89db7114c?q=80&w=500&auto=format&fit=crop" 
                            className="w-full h-full object-cover rounded-full shadow-lg"
                            alt="Pesée"
                        />
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-10 h-10 bg-teal-500 text-white rounded-full flex items-center justify-center font-black border-4 border-white text-lg">2</div>
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Pesée transparente</h3>
                    <p className="text-slate-500 px-4">Le partenaire pèse votre linge devant vous. Vous validez le prix instantanément sur l'app.</p>
                </div>

                {/* ETAPE 3 */}
                <div className="flex flex-col items-center">
                    <div className="w-48 h-48 rounded-full border-4 border-teal-100 p-2 mb-6 relative">
                        <img 
                            src="https://images.unsplash.com/photo-1517677208171-0bc5e2e3f603?q=80&w=500&auto=format&fit=crop" 
                            className="w-full h-full object-cover rounded-full shadow-lg"
                            alt="Linge propre"
                        />
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-10 h-10 bg-teal-500 text-white rounded-full flex items-center justify-center font-black border-4 border-white text-lg">3</div>
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Récupérez propre</h3>
                    <p className="text-slate-500 px-4">48h plus tard, recevez une notif. Votre linge est lavé, séché et plié au carré. Prêt à ranger.</p>
                </div>

            </div>
        </div>
      </div>

      {/* 4. AVIS / CONFIANCE */}
      <div className="bg-slate-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center gap-1 mb-6 text-yellow-400">
                <Star className="fill-current"/><Star className="fill-current"/><Star className="fill-current"/><Star className="fill-current"/><Star className="fill-current"/>
            </div>
            <h2 className="text-3xl md:text-5xl font-black mb-8">"Je ne repasserai plus jamais."</h2>
            <p className="text-xl text-slate-400 italic mb-8">
                "J'ai déposé 7kg de linge lundi soir en rentrant du boulot. Mercredi c'était prêt, plié mieux que dans un magasin. Pour 21€, c'est imbattable."
            </p>
            <div className="font-bold text-lg">Thomas D. <span className="text-slate-500 font-normal">・ Client à Lille</span></div>
        </div>
      </div>

      {/* 5. STORYTELLING (BALI) - Remis en bas comme demandé */}
      <div className="py-24 px-4 bg-white">
         <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 relative">
                <img 
                    src="https://images.unsplash.com/photo-1517677208171-0bc5e2e3f603?q=80&w=1000&auto=format&fit=crop" 
                    className="rounded-3xl shadow-2xl rotate-2 hover:rotate-0 transition duration-500"
                    alt="Pressing Bali"
                />
                <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg border border-slate-100 max-w-xs">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Inspiration</p>
                    <p className="text-sm font-bold text-slate-900">Le modèle balinais : simple, efficace, sans superflu.</p>
                </div>
            </div>
            <div className="order-1 md:order-2">
                <div className="inline-block px-4 py-1 bg-teal-100 text-teal-800 rounded-full font-bold text-xs mb-4">NOTRE HISTOIRE</div>
                <h2 className="text-4xl font-black mb-6 text-slate-900 leading-tight">
                    De la douceur de Bali<br/>
                    à l'exigence de Paris.
                </h2>
                <p className="text-lg text-slate-500 mb-6">
                    Là-bas, le pressing au poids est la norme : simple, direct, sans artifices. 
                    Nous avons eu le coup de foudre pour cette transparence radicale.
                </p>
                <p className="text-lg text-slate-500 mb-8">
                    Kilolab importe ce concept en France. Fini le casse-tête des tarifs à la pièce.
                    <br/><strong className="text-teal-600">Juste le poids du linge propre.</strong>
                </p>
                <Link to="/partner" className="text-slate-900 font-black underline hover:text-teal-600 transition">
                    Vous êtes un pressing ? Rejoignez le mouvement →
                </Link>
            </div>
         </div>
      </div>

      <Footer />
    </div>
  );
}
