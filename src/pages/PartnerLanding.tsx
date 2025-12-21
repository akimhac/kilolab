import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';
import { TrendingUp, ShieldCheck, Users, ArrowRight, Calculator } from 'lucide-react';

export default function PartnerLanding() {
  // État pour le simulateur
  const [dailyVolume, setDailyVolume] = useState(20); // Valeur par défaut : 20kg
  
  // LOGIQUE DE CALCUL : 
  // Hypothèse : Le partenaire touche ~2.20€ net par kg (après com Kilolab)
  // Jours ouvrés : 26 jours / mois
  const revenuePerKg = 2.2; 
  const monthlyRevenue = Math.round(dailyVolume * revenuePerKg * 26);

  return (
    <div className="bg-white font-sans text-slate-900">
      <SEOHead 
        title="Devenir Partenaire Kilolab" 
        description="Rejoignez le premier réseau de pressings au kilo. Augmentez votre chiffre d'affaires sans effort." 
      />
      <Navbar />

      {/* HERO SECTION */}
      <div className="pt-32 pb-20 px-4 bg-slate-900 text-white overflow-hidden relative">
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556740758-90de2742dd61?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
         <div className="max-w-6xl mx-auto text-center relative z-10">
            <div className="inline-block px-4 py-2 bg-teal-500/20 text-teal-300 font-bold rounded-full text-sm mb-6 border border-teal-500/30">
                Réseau Certifié Kilolab
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                Remplissez vos machines.<br/>
                <span className="text-teal-400">On s'occupe des clients.</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
                Kilolab vous apporte du volume de linge, trié et prêt à laver. 
                Vous faites ce que vous aimez : la qualité.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/become-partner" className="px-8 py-4 bg-teal-500 text-slate-900 rounded-xl font-bold hover:bg-teal-400 transition shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2">
                    Rejoindre le réseau <ArrowRight size={20}/>
                </Link>
            </div>
         </div>
      </div>

      {/* --- SECTION SIMULATEUR (NOUVEAU !) --- */}
      <div className="py-20 px-4 bg-slate-50 relative overflow-hidden">
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Combien allez-vous gagner ?</h2>
                <p className="text-slate-500">Utilisez notre simulateur pour estimer vos nouveaux revenus avec Kilolab.</p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-12 relative z-10">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    
                    {/* COLONNE GAUCHE : LE SLIDER */}
                    <div>
                        <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex justify-between">
                            <span>Volume traité par jour</span>
                            <span className="text-slate-900 font-extrabold">{dailyVolume} kg</span>
                        </label>
                        <input 
                            type="range" 
                            min="5" 
                            max="100" 
                            step="5" 
                            value={dailyVolume} 
                            onChange={(e) => setDailyVolume(parseInt(e.target.value))}
                            className="w-full h-4 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-teal-500 mb-4"
                        />
                        <p className="text-xs text-slate-400">
                            ~ {Math.ceil(dailyVolume / 5)} machine(s) de 5kg par jour.
                        </p>
                    </div>

                    {/* COLONNE DROITE : LE RÉSULTAT */}
                    <div className="bg-teal-50 rounded-2xl p-8 text-center border border-teal-100">
                        <p className="text-slate-600 font-medium mb-2">Revenu mensuel estimé (Net)</p>
                        <div className="text-5xl font-extrabold text-slate-900 mb-2">
                            {monthlyRevenue} €<span className="text-lg text-slate-500 font-medium">/mois</span>
                        </div>
                        <p className="text-xs text-teal-700 font-bold mb-6">
                            Basé sur 26 jours ouvrés.
                        </p>
                        <Link to="/become-partner" className="inline-block w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition shadow-lg">
                            Commencer à générer ces revenus
                        </Link>
                    </div>

                </div>
            </div>
            {/* Décoration background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-teal-500/10 to-indigo-500/10 rounded-full blur-3xl opacity-50 -z-10 pointer-events-none"></div>
        </div>
      </div>
      {/* -------------------------------------- */}

      {/* ARGUMENTS */}
      <div className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                    <div className="w-14 h-14 bg-white text-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                        <TrendingUp size={32}/>
                    </div>
                    <h3 className="font-bold text-xl mb-3">Revenus Garantis</h3>
                    <p className="text-slate-500">Augmentez votre CA de 20% à 30% grâce à nos flux de commandes réguliers.</p>
                </div>
                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                    <div className="w-14 h-14 bg-white text-teal-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                        <Users size={32}/>
                    </div>
                    <h3 className="font-bold text-xl mb-3">Zéro Gestion Client</h3>
                    <p className="text-slate-500">Marketing, paiement, support : on gère tout. Vous recevez juste le linge.</p>
                </div>
                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                    <div className="w-14 h-14 bg-white text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                        <ShieldCheck size={32}/>
                    </div>
                    <h3 className="font-bold text-xl mb-3">Paiement Sécurisé</h3>
                    <p className="text-slate-500">Vous êtes payé automatiquement toutes les semaines pour les commandes traitées.</p>
                </div>
            </div>
        </div>
      </div>

      {/* PROCESSUS */}
      <div className="py-24 px-4 bg-white border-t border-slate-100">
         <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-12">Comment ça marche ?</h2>
            <div className="space-y-8 text-left">
                <div className="flex gap-6 items-start">
                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold shrink-0 mt-1">1</div>
                    <div>
                        <h4 className="font-bold text-lg">Candidature</h4>
                        <p className="text-slate-500">Remplissez le formulaire en 2 minutes avec votre Kbis.</p>
                    </div>
                </div>
                <div className="flex gap-6 items-start">
                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold shrink-0 mt-1">2</div>
                    <div>
                        <h4 className="font-bold text-lg">Validation Qualité</h4>
                        <p className="text-slate-500">Un expert Kilolab vérifie vos installations et vos standards.</p>
                    </div>
                </div>
                <div className="flex gap-6 items-start">
                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold shrink-0 mt-1">3</div>
                    <div>
                        <h4 className="font-bold text-lg">Activation</h4>
                        <p className="text-slate-500">Vous recevez vos accès Pro et commencez à scanner les commandes.</p>
                    </div>
                </div>
            </div>
         </div>
      </div>

      <Footer />
    </div>
  );
}
