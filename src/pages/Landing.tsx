import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowRight, Check, X, MapPin, Scale, Package, AlertCircle } from 'lucide-react';

export default function Landing() {
  return (
    <div className="font-sans text-slate-900 bg-slate-50">
      <Navbar />

      {/* =========================================
          1. HERO SECTION (AVEC IMAGE PILE DE LINGE)
      ========================================= */}
      <div className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-slate-900">
        
        {/* IMAGE DE FOND : PILE DE LINGE PLIÉ */}
        <div className="absolute inset-0 z-0">
            <img 
                src="https://images.unsplash.com/photo-1489274495757-95c7c83700c0?q=80&w=2000&auto=format&fit=crop" 
                className="w-full h-full object-cover"
                alt="Pile de linge propre et doux"
            />
            <div className="absolute inset-0 bg-black/50 z-1"></div>
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-1"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center text-white mt-16">
          <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-md text-white rounded-full text-sm font-bold mb-6 border border-white/30 shadow-lg">
            ✨ Le nouveau standard du pressing
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tight leading-tight drop-shadow-lg text-white">
            Votre temps est précieux.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-emerald-400">Pas votre lessive.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-100 max-w-2xl mx-auto mb-12 leading-relaxed drop-shadow-md font-medium">
            Confiez-nous votre linge <strong>au kilo</strong>. Nous le lavons, séchons et plions pour vous. 
            <br/>Moins cher qu'un café par jour.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link to="/new-order" className="px-10 py-5 bg-teal-500 text-white rounded-full font-bold text-xl hover:bg-teal-400 transition shadow-2xl shadow-teal-500/50 flex items-center justify-center gap-3 transform hover:scale-105 duration-200">
              Me libérer de la corvée <ArrowRight size={24}/>
            </Link>
            
            <Link to="/tarifs" className="px-10 py-5 bg-white/10 backdrop-blur-md text-white border-2 border-white/30 rounded-full font-bold text-xl hover:bg-white hover:text-slate-900 transition flex items-center justify-center">
              Voir les tarifs (3€/kg)
            </Link>
          </div>
        </div>
      </div>

      {/* =========================================
          2. LE RITUEL (3 ÉTAPES)
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
                {/* Pressing Traditionnel */}
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

                {/* Kilolab */}
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
          4. NOTRE HISTOIRE (BALI + 2 IMAGES INCLINÉES)
      ========================================= */}
      <div className="py-24 px-4 bg-white overflow-hidden">
         <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            {/* GAUCHE : 2 images inclinées + pile de linge en fond */}
            <div className="relative h-[500px] w-full flex items-center justify-center">
                {/* IMAGE FOND : Pile de linge (floutée) */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <img 
                        src="https://images.unsplash.com/photo-1489274495757-95c7c83700c0?w=800&auto=format&fit=crop&q=60" 
                        className="w-[85%] h-[400px] object-cover rounded-3xl shadow-xl opacity-20 blur-[2px]"
                        alt="Pile de linge propre en arrière-plan"
                    />
                </div>
                
                {/* IMAGE 1 : Temple Bali (gauche, -6deg) */}
                <img 
                    src="https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=600&auto=format&fit=crop&q=60" 
                    className="absolute left-0 top-8 w-[52%] h-72 object-cover rounded-3xl shadow-2xl z-10 border-4 border-white -rotate-6 hover:rotate-0 transition duration-500"
                    alt="Temple de Bali"
                />
                
                {/* IMAGE 2 : Machines (droite, +6deg) */}
                <img 
                    src="https://images.unsplash.com/photo-1545173168-9f1947eebb8f?w=600&auto=format&fit=crop&q=60" 
                    className="absolute right-0 bottom-8 w-[52%] h-72 object-cover rounded-3xl shadow-2xl z-10 border-4 border-white rotate-6 hover:rotate-0 transition duration-500"
                    alt="Laverie Moderne"
                />
            </div>
            
            {/* DROITE : Texte */}
            <div className="relative z-10 md:pl-12">
                <div className="inline-block px-3 py-1 bg-teal-100 text-teal-800 rounded-lg font-bold text-xs mb-6 uppercase tracking-wider">NOTRE HISTOIRE</div>
                <h2 className="text-4xl font-black mb-6 text-slate-900 leading-tight">
                    De la douceur de Bali<br/>
                    à l'exigence de la métropole.
                </h2>
                <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                    Là-bas, le pressing au poids est la norme : simple, direct, sans artifices. 
                    Nous avons eu le coup de foudre pour cette transparence radicale.
                </p>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-8">
                    <p className="text-lg text-slate-800 font-medium">
                        Kilolab importe ce concept en France. Fini le casse-tête des tarifs à la pièce.
                        <br/><span className="text-teal-600 font-black text-xl mt-2 block">Juste le poids du linge propre.</span>
                    </p>
                </div>
                <Link to="/partner" className="inline-flex items-center font-bold text-slate-900 hover:text-teal-600 transition gap-2 underline underline-offset-4">
                    Vous êtes un pressing ? Rejoignez-nous <ArrowRight size={18}/>
                </Link>
            </div>
         </div>
      </div>

      <Footer />
    </div>
  );
}
