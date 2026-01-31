import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  ArrowRight, Star, CheckCircle, Clock, MapPin, 
  Shield, Sparkles, TrendingUp, Users, Package,
  Zap, Droplet, AlertCircle, Gift
} from 'lucide-react';
import { useState } from 'react';

export default function Landing() {
  const [weight, setWeight] = useState(5);

  // Calcul DIY réaliste
  const diyWater = 1.80;
  const diyElectricity = 0.90;
  const diyDetergent = 1.20;
  const diySoftener = 0.60;
  const diyMachineWear = 0.80;
  const diyDryer = 1.50; // optionnel
  const diyMaterialTotal = diyWater + diyElectricity + diyDetergent + diySoftener + diyMachineWear + diyDryer;
  
  const diyTimeHours = 2.5;
  const hourlyRate = 12; // SMIC
  const diyTimeCost = diyTimeHours * hourlyRate;
  const diyTotalCost = diyMaterialTotal + diyTimeCost;

  // Prix Kilolab
  const kilolabPrice = weight * 5;
  const timeSaved = diyTimeHours;
  const moneySaved = diyMaterialTotal - kilolabPrice;

  return (
    <>
      <Helmet>
        <title>Kilolab - Laverie à domicile | Service de pressing en ligne</title>
        <meta 
          name="description" 
          content="Service de laverie à domicile. Enlèvement, lavage professionnel et livraison en 48h. Gagnez du temps avec Kilolab, le Uber du linge." 
        />
        <link rel="canonical" href="https://kilolab.fr" />
      </Helmet>

      <div className="min-h-screen bg-white">
        <Navbar />

        {/* HERO */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-gradient-to-br from-slate-900 via-teal-900 to-cyan-900">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              
              {/* GAUCHE - TEXTE */}
              <div className="text-white">
                <div className="inline-flex items-center gap-2 bg-teal-500/20 text-teal-300 px-4 py-2 rounded-full text-sm font-bold mb-8 border border-teal-500/30">
                  <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></span>
                  Lille & Nantes • Lancement 2025
                </div>

                <h1 className="text-5xl md:text-7xl font-black mb-6 leading-[1.1] tracking-tight">
                  Le Uber du linge.<br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
                    Dans ton quartier.
                  </span>
                </h1>

                <p className="text-xl text-slate-300 mb-10 leading-relaxed">
                  Ton linge lavé, séché et plié par un Washer près de chez toi. 
                  <strong className="text-teal-400"> Enlèvement gratuit + Livraison en 48h.</strong>
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-12">
                  <Link
                    to="/new-order"
                    className="px-8 py-4 bg-teal-500 text-slate-900 font-bold rounded-2xl hover:bg-teal-400 transition hover:scale-105 flex items-center justify-center gap-2 shadow-xl shadow-teal-500/30"
                  >
                    Commander maintenant
                    <ArrowRight size={20} />
                  </Link>
                  <Link
                    to="/washers"
                    className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/20 font-bold rounded-2xl hover:bg-white/20 transition flex items-center justify-center gap-2"
                  >
                    💰 Devenir Washer
                  </Link>
                </div>

                {/* SOCIAL PROOF */}
                <div className="flex flex-wrap items-center gap-8 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full border-2 border-slate-900"></div>
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full border-2 border-slate-900"></div>
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full border-2 border-slate-900"></div>
                    </div>
                    <span className="font-bold text-white">45+ Washers actifs</span>
                  </div>
                  <div className="flex items-center gap-1 text-white">
                    <Star size={16} className="fill-yellow-400 text-yellow-400" />
                    <span className="font-bold">4.8/5</span>
                    <span className="text-slate-300">(127 avis)</span>
                  </div>
                </div>
              </div>

              {/* DROITE - CALCULATEUR */}
              <div className="bg-white rounded-3xl p-8 shadow-2xl">
                <h3 className="text-2xl font-black mb-6 text-slate-900">
                  💰 Calcule ton prix
                </h3>

                <div className="mb-6">
                  <label className="block text-sm font-bold text-slate-700 mb-3">
                    Poids de ton linge
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="2"
                      max="10"
                      value={weight}
                      onChange={(e) => setWeight(parseInt(e.target.value))}
                      className="flex-1 h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
                    />
                    <div className="w-20 text-center">
                      <span className="text-3xl font-black text-teal-600">{weight}</span>
                      <span className="text-sm text-slate-600 ml-1">kg</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 mt-2">
                    <span>Petit sac</span>
                    <span>Gros volume</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-6 mb-6 border-2 border-teal-200">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-slate-600 font-medium">Prix Kilolab</span>
                    <div className="text-right">
                      <div className="text-4xl font-black text-teal-600">{kilolabPrice}€</div>
                      <div className="text-xs text-slate-500">5€/kg</div>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2 text-slate-700">
                      <CheckCircle size={16} className="text-teal-600 shrink-0" />
                      <span>Enlèvement gratuit à domicile</span>
                    </li>
                    <li className="flex items-center gap-2 text-slate-700">
                      <CheckCircle size={16} className="text-teal-600 shrink-0" />
                      <span>Lavage + Séchage professionnel</span>
                    </li>
                    <li className="flex items-center gap-2 text-slate-700">
                      <CheckCircle size={16} className="text-teal-600 shrink-0" />
                      <span>Livraison en 48h maximum</span>
                    </li>
                  </ul>
                </div>

                <Link
                  to="/new-order"
                  className="block w-full py-4 bg-teal-600 text-white text-center font-bold rounded-xl hover:bg-teal-700 transition shadow-lg"
                >
                  Commander maintenant
                </Link>

                <p className="text-center text-xs text-slate-500 mt-4">
                  ✨ Premier lavage à -20% avec le code KILO20
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* COMPARATIF DIY VS KILOLAB */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black mb-4">
                DIY vs Kilolab : <span className="text-teal-600">Le vrai coût</span>
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Au-delà du prix, c'est ton temps qui a de la valeur
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              
              {/* DIY */}
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl p-8 border-2 border-orange-200 relative">
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-black">
                  ⚠️ COÛT CACHÉ
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 bg-orange-100 rounded-2xl">
                    <AlertCircle className="text-orange-600" size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">🧺 Faire soi-même</h3>
                    <p className="text-sm text-slate-600">Coûts réels pour {weight}kg</p>
                  </div>
                </div>

                {/* Détails coûts */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Droplet size={18} className="text-blue-600" />
                      <span className="text-sm font-medium">Eau (60L)</span>
                    </div>
                    <span className="font-bold text-slate-900">{diyWater.toFixed(2)}€</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Zap size={18} className="text-yellow-600" />
                      <span className="text-sm font-medium">Électricité (60°)</span>
                    </div>
                    <span className="font-bold text-slate-900">{diyElectricity.toFixed(2)}€</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Sparkles size={18} className="text-purple-600" />
                      <span className="text-sm font-medium">Lessive premium</span>
                    </div>
                    <span className="font-bold text-slate-900">{diyDetergent.toFixed(2)}€</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-pink-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Sparkles size={18} className="text-pink-600" />
                      <span className="text-sm font-medium">Adoucissant</span>
                    </div>
                    <span className="font-bold text-slate-900">{diySoftener.toFixed(2)}€</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <TrendingUp size={18} className="text-slate-600" />
                      <span className="text-sm font-medium">Usure machine</span>
                    </div>
                    <span className="font-bold text-slate-900">{diyMachineWear.toFixed(2)}€</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Zap size={18} className="text-orange-600" />
                      <span className="text-sm font-medium">Sèche-linge</span>
                    </div>
                    <span className="font-bold text-slate-900">{diyDryer.toFixed(2)}€</span>
                  </div>
                </div>

                {/* Temps */}
                <div className="bg-white/70 backdrop-blur-sm p-5 rounded-2xl border border-orange-300 mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <Clock className="text-orange-600" size={20} />
                      <span className="font-bold text-slate-900">Ton temps</span>
                    </div>
                    <span className="text-2xl font-black text-orange-600">{diyTimeHours}h</span>
                  </div>
                  <p className="text-xs text-slate-600 mb-3">
                    Tri (15min) + Lavage (1h30) + Séchage (30min) + Pliage (30min)
                  </p>
                  <div className="flex justify-between items-center pt-3 border-t">
                    <span className="text-sm text-slate-600">Valorisé au SMIC ({hourlyRate}€/h)</span>
                    <span className="font-bold text-orange-700">{diyTimeCost.toFixed(2)}€</span>
                  </div>
                </div>

                {/* Total */}
                <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6 rounded-2xl text-white">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium opacity-90">Coût matériel seul</span>
                    <span className="font-bold">{diyMaterialTotal.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/30">
                    <span className="text-sm font-medium opacity-90">Coût de ton temps</span>
                    <span className="font-bold">{diyTimeCost.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-black text-lg">COÛT TOTAL RÉEL</span>
                    <span className="text-4xl font-black">{diyTotalCost.toFixed(2)}€</span>
                  </div>
                  <p className="text-center text-xs mt-3 bg-white/20 rounded-lg py-2 font-bold">
                    ⚠️ Sans compter le stress et la corvée
                  </p>
                </div>
              </div>

              {/* KILOLAB */}
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-3xl p-8 border-2 border-teal-200 relative">
                <div className="absolute top-4 right-4 bg-yellow-400 text-slate-900 px-3 py-1 rounded-full text-xs font-black rotate-12 shadow-lg">
                  ⭐ MEILLEUR CHOIX
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 bg-teal-100 rounded-2xl">
                    <Sparkles className="text-teal-600" size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">✨ Service Kilolab</h3>
                    <p className="text-sm text-slate-600">Tout inclus pour {weight}kg</p>
                  </div>
                </div>

                {/* Avantages */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-teal-100">
                    <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center shrink-0">
                      <CheckCircle size={18} className="text-white" />
                    </div>
                    <span className="font-medium text-slate-900">Enlèvement gratuit à ton domicile</span>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-teal-100">
                    <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center shrink-0">
                      <CheckCircle size={18} className="text-white" />
                    </div>
                    <span className="font-medium text-slate-900">Lavage professionnel (lessive premium)</span>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-teal-100">
                    <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center shrink-0">
                      <CheckCircle size={18} className="text-white" />
                    </div>
                    <span className="font-medium text-slate-900">Séchage + Pliage impeccable</span>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-teal-100">
                    <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center shrink-0">
                      <CheckCircle size={18} className="text-white" />
                    </div>
                    <span className="font-medium text-slate-900">Livraison en 48h maximum</span>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-teal-100">
                    <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center shrink-0">
                      <CheckCircle size={18} className="text-white" />
                    </div>
                    <span className="font-medium text-slate-900">Assurance 200€ incluse</span>
                  </div>
                </div>

                {/* Prix */}
                <div className="bg-white p-6 rounded-2xl border-2 border-teal-200 mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-slate-600 font-medium">Prix tout compris</span>
                    <span className="font-bold text-slate-900">{kilolabPrice.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t">
                    <div className="flex items-center gap-2">
                      <Clock size={20} className="text-teal-600" />
                      <span className="font-bold text-slate-900">Ton temps</span>
                    </div>
                    <span className="text-3xl font-black text-teal-600">0h !</span>
                  </div>
                </div>

                {/* Économies */}
                <div className="bg-gradient-to-r from-green-500 to-teal-500 p-6 rounded-2xl text-white mb-6">
                  <p className="text-sm font-bold mb-4 text-center">🎉 TU ÉCONOMISES PAR RAPPORT AU DIY</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center bg-white/20 rounded-xl p-4">
                      <p className="text-3xl font-black mb-1">{timeSaved.toFixed(1)}h</p>
                      <p className="text-xs font-medium">de temps libre</p>
                      <p className="text-xs mt-1 opacity-80">= {diyTimeCost.toFixed(0)}€ en valeur</p>
                    </div>
                    <div className="text-center bg-white/20 rounded-xl p-4">
                      <p className="text-3xl font-black mb-1">0€</p>
                      <p className="text-xs font-medium">de stress</p>
                      <p className="text-xs mt-1 opacity-80">corvée = terminée !</p>
                    </div>
                  </div>
                </div>

                <Link
                  to="/new-order"
                  className="block w-full py-4 bg-teal-600 text-white text-center font-bold rounded-xl hover:bg-teal-700 transition shadow-lg text-lg"
                >
                  ✅ Je choisis Kilolab
                </Link>

                <p className="text-center text-xs text-slate-500 mt-4">
                  💡 <strong>Astuce :</strong> {timeSaved}h économisées = {diyTimeCost.toFixed(0)}€ de ton temps valorisé
                </p>
              </div>

            </div>

            {/* Conclusion */}
            <div className="mt-12 text-center max-w-3xl mx-auto">
              <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white p-8 rounded-2xl">
                <h3 className="text-2xl font-black mb-3">
                  💎 Le vrai coût, c'est ton temps
                </h3>
                <p className="text-lg text-teal-100 mb-6">
                  Pour seulement <strong className="text-white">{(kilolabPrice - diyMaterialTotal).toFixed(2)}€ de plus</strong>, 
                  tu récupères <strong className="text-white">{timeSaved}h de vie</strong> (valeur: {diyTimeCost}€)
                </p>
                <div className="inline-block bg-white/20 px-6 py-3 rounded-xl border border-white/30">
                  <p className="text-sm font-bold">
                    ✨ En gros, tu es <span className="text-yellow-300">PAYÉ {(diyTimeCost - (kilolabPrice - diyMaterialTotal)).toFixed(0)}€</span> pour ne rien faire
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* COMMENT ÇA MARCHE */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black mb-4">
                Comment ça marche ?
              </h2>
              <p className="text-xl text-slate-600">Simple comme bonjour</p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  step: "1",
                  icon: <Package size={32} />,
                  title: "Commande en ligne",
                  desc: "Choisis ton créneau d'enlèvement en 2 clics"
                },
                {
                  step: "2",
                  icon: <MapPin size={32} />,
                  title: "Enlèvement gratuit",
                  desc: "Un Washer passe récupérer ton linge chez toi"
                },
                {
                  step: "3",
                  icon: <Sparkles size={32} />,
                  title: "Lavage pro",
                  desc: "Lavé, séché, plié avec soin par ton Washer"
                },
                {
                  step: "4",
                  icon: <CheckCircle size={32} />,
                  title: "Livraison 48h",
                  desc: "Reçois ton linge propre prêt à ranger"
                }
              ].map((item, i) => (
                <div key={i} className="relative">
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition-all hover:-translate-y-1">
                    <div className="absolute -top-4 -left-4 w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center font-black text-xl shadow-lg">
                      {item.step}
                    </div>
                    <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                      {item.icon}
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-center">{item.title}</h3>
                    <p className="text-slate-600 text-sm text-center leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="py-20 bg-gradient-to-r from-teal-600 to-cyan-600 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Prêt à récupérer ton temps libre ?
            </h2>
            <p className="text-xl mb-8 text-teal-100">
              Rejoins les 500+ utilisateurs qui ont déjà arrêté la corvée du linge
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/new-order"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-teal-600 rounded-2xl font-bold hover:bg-slate-100 transition shadow-2xl text-lg"
              >
                Commander maintenant
                <ArrowRight size={20} />
              </Link>
              <Link
                to="/washers"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-teal-700 text-white rounded-2xl font-bold hover:bg-teal-800 transition border-2 border-white/20 text-lg"
              >
                💰 Devenir Washer
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
