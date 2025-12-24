import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowRight, Star, XCircle, MapPin, Scale, Shirt } from 'lucide-react';

export default function Landing() {
  return (
    <div className="font-sans text-slate-900 bg-white">
      <Navbar />

      {/* =========================================
          1. HERO SECTION
      ========================================= */}
      <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
            {/* Image de fond texture linge propre (Corrigée) */}
            <img 
                src="https://images.unsplash.com/photo-1517677208171-0bc5e2e3f603?q=80&w=2070&auto=format&fit=crop" 
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
                    <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?img=${i + 20}`} alt="avatar client" />
                    </div>
                ))}
            </div>
            <p>Déjà 500+ clients heureux</p>
          </div>
        </div>
      </div>

      {/* =========================================
          2. STORYTELLING (BALI) - REMONTÉ ICI
      ========================================= */}
      <div className="py-24 px-4 bg-white border-t border-slate-100">
         <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 relative">
                {/* Image Bali réparée */}
                <img 
                    src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop&q=60" 
                    className="rounded-[3rem] shadow-2xl rotate-2 hover:rotate-0 transition duration-500 object-cover h-[500px] w-full"
                    alt="Pressing Bali open air"
                />
                <div className="absolute -bottom-6 -right-6 bg-white p-5 rounded-2xl shadow-xl border border-slate-100 max-w-xs z-10">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Inspiration</p>
                    <p className="text-sm font-bold text-slate-900 leading-tight">Le modèle balinais : simple, efficace, sans superflu.</p>
                </div>
            </div>
            <div className="order-1 md:order-2">
                <div className="inline-block px-4 py-1 bg-teal-100 text-teal-800 rounded-full font-bold text-xs mb-6 tracking-wider">NOTRE HISTOIRE</div>
                <h2 className="text-4xl md:text-5xl font-black mb-8 text-slate-900 leading-[1.1]">
                    De la douceur de Bali<br/>
                    à l'exigence de Paris.
                </h2>
                <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                    Là-bas, le pressing au poids est la norme : simple, direct, sans artifices. 
                    Nous avons eu le coup de foudre pour cette transparence radicale.
                </p>
                <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                    Kilolab importe ce concept en France. Fini le casse-tête des tarifs à la pièce.
                    <br/><strong className="text-teal-600 font-black">Juste le poids du linge propre.</strong>
                </p>
                <Link to="/partner" className="inline-flex items-center text-slate-900 font-black underline underline-offset-4 hover:text-teal-600 transition group">
                    Vous êtes un pressing ? Rejoignez le mouvement <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform"/>
                </Link>
            </div>
         </div>
      </div>

      {/* =========================================
          3. LE PROBLÈME (Comparatif)
      ========================================= */}
      <div className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-full font-bold text-sm mb-6">
                <XCircle size={16}/> Arrêtez de brûler votre argent
            </div>
            <h2 className="text-4xl font-black mb-6 text-slate-900">
                Le modèle traditionnel<br/>
                "à la pièce" est obsolète.
            </h2>
            <p className="text-lg text-slate-500 mb-16">
                Passez au modèle "au poids" et redonnez du pouvoir d'achat à votre foyer.
            </p>

            <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Modèle Vieux */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 opacity-70 scale-95 grayscale">
                    <h3 className="text-xl font-bold text-slate-400 mb-8">Pressing Traditionnel</h3>
                    <ul className="space-y-4 text-left text-slate-400 font-medium">
                        <li className="flex justify-between border-b border-slate-50 pb-3"><span>3 Chemises</span> <span>24.00€</span></li>
                        <li className="flex justify-between border-b border-slate-50 pb-3"><span>2 Pantalons</span> <span>20.00€</span></li>
                        <li className="flex justify-between border-b border-slate-50 pb-3"><span>1 Manteau</span> <span>25.00€</span></li>
                    </ul>
                    <div className="mt-10 text-3xl font-black text-red-300">Total: 69.00€</div>
                </div>

                {/* Modèle Kilolab */}
                <div className="bg-white p-8 rounded-3xl shadow-2xl border-2 border-teal-500 relative transform md:scale-105 z-10">
                    <div className="absolute top-0 right-0 bg-teal-500 text-white text-xs font-bold px-4 py-1 rounded-bl-xl rounded-tr-2xl uppercase tracking-wider">Gagnant</div>
                    <h3 className="text-xl font-bold text-teal-900 mb-8">Modèle Kilolab</h3>
                    <ul className="space-y-4 text-left text-slate-700 font-bold">
                        <li className="flex justify-between border-b border-slate-50 pb-3 items-center">
                            <span>Même quantité de linge</span> 
                            <span className="bg-teal-100 px-3 py-1 rounded-full text-teal-700 text-sm">Au poids</span>
                        </li>
                        <li className="flex justify-between border-b border-slate-50 pb-3">
                            <span>Lavage + Séchage + Pliage</span>
                            <span className="text-teal-600"><CheckCircle size={20}/></span>
                        </li>
                    </ul>
                    <div className="mt-10 text-4xl font-black text-teal-600">Total: 15.00€</div>
                    <p className="text-sm text-teal-700 font-bold mt-3 bg-teal-50 inline-block px-3 py-1 rounded-lg">Soit 54€ d'économie immédiate.</p>
                </div>
            </div>
        </div>
      </div>

      {/* =========================================
          4. COMMENT ÇA MARCHE (Cercles avec VRAIES PHOTOS)
      ========================================= */}
      <div className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-black text-center mb-20">Simple comme bonjour.</h2>
            
            <div className="grid md:grid-cols-3 gap-12 text-center relative">
                {/* Ligne connecteur (visible sur desktop) */}
                <div className="hidden md:block absolute top-24 left-[20%] right-[20%] h-1 bg-teal-50 z-0"></div>

                {/* ETAPE 1 */}
                <div className="flex flex-col items-center group relative z-10">
                    <div className="w-52 h-52 rounded-full border-8 border-white shadow-xl mb-8 relative overflow-hidden transition transform group-hover:scale-105 bg-teal-50">
                        <img 
                            src="https://images.unsplash.com/photo-1604871005786-643d66707729?w=600&auto=format&fit=crop&q=60" 
                            className="w-full h-full object-cover"
                            alt="Localiser"
                        />
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-12 h-12 bg-teal-500 text-white rounded-full flex items-center justify-center font-black border-4 border-white text-xl shadow-sm">1</div>
                    </div>
                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-2"><MapPin className="text-teal-500" size={28}/> Localisez</h3>
                    <p className="text-slate-600 px-6 leading-relaxed">Trouvez le pressing partenaire le plus proche sur la carte. Déposez votre sac directement au comptoir.</p>
                </div>

                {/* ETAPE 2 */}
                <div className="flex flex-col items-center group relative z-10">
                    <div className="w-52 h-52 rounded-full border-8 border-white shadow-xl mb-8 relative overflow-hidden transition transform group-hover:scale-105 bg-teal-50">
                        <img 
                            src="https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=600&auto=format&fit=crop&q=60" 
                            className="w-full h-full object-cover"
                            alt="Pesée"
                        />
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-12 h-12 bg-teal-500 text-white rounded-full flex items-center justify-center font-black border-4 border-white text-xl shadow-sm">2</div>
                    </div>
                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-2"><Scale className="text-teal-500" size={28}/> Pesez</h3>
                    <p className="text-slate-600 px-6 leading-relaxed">Le partenaire pèse votre linge devant vous. Prix transparent au kilo. Pas de surprise.</p>
                </div>

                {/* ETAPE 3 */}
                <div className="flex flex-col items-center group relative z-10">
                    <div className="w-52 h-52 rounded-full border-8 border-white shadow-xl mb-8 relative overflow-hidden transition transform group-hover:scale-105 bg-teal-50">
                        <img 
                            src="https://images.unsplash.com/photo-1489274495757-95c7c83700c0?w=600&auto=format&fit=crop&q=60" 
                            className="w-full h-full object-cover"
                            alt="Linge propre"
                        />
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-12 h-12 bg-teal-500 text-white rounded-full flex items-center justify-center font-black border-4 border-white text-xl shadow-sm">3</div>
                    </div>
                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-2"><Shirt className="text-teal-500" size={28}/> Récupérez</h3>
                    <p className="text-slate-600 px-6 leading-relaxed">48h plus tard, recevez une notif. Votre linge est lavé, séché et plié au carré. Prêt à ranger.</p>
                </div>

            </div>
        </div>
      </div>

      {/* =========================================
          5. AVIS / CONFIANCE
      ========================================= */}
      <div className="bg-slate-900 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center gap-1 mb-8 text-yellow-400">
                <Star className="fill-current" size={24}/><Star className="fill-current" size={24}/><Star className="fill-current" size={24}/><Star className="fill-current" size={24}/><Star className="fill-current" size={24}/>
            </div>
            <h2 className="text-3xl md:text-5xl font-black mb-10 leading-tight">"Je ne repasserai plus jamais."</h2>
            <p className="text-xl md:text-2xl text-slate-300 italic mb-10 font-serif leading-relaxed">
                "J'ai déposé 7kg de linge lundi soir en rentrant du boulot. Mercredi c'était prêt, plié mieux que dans un magasin. Pour 21€, c'est imbattable."
            </p>
            <div className="font-bold text-lg">Thomas D. <span className="text-slate-500 font-normal">・ Client à Lille</span></div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
