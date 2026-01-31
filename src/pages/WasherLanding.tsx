import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowRight, Star, Clock, Banknote, Smartphone, MapPin, ShieldCheck, TrendingUp, Users, CheckCircle, Zap } from 'lucide-react';
import { useState } from 'react';

export default function WasherLanding() {
  const [washersEarning, setWashersEarning] = useState(15);

  return (
    <>
      <Helmet>
        <title>Deviens Washer Kilolab - Gagne jusqu'à 600€/mois en lavant du linge</title>
        <meta 
          name="description" 
          content="Transforme ta machine à laver en source de revenus. Lave le linge de tes voisins et gagne jusqu'à 600€/mois. Liberté totale, comme Uber." 
        />
        <meta property="og:title" content="Kilolab - Gagne jusqu'à 600€/mois en lavant du linge" />
        <meta property="og:description" content="Le Uber du linge. Rejoins les Washers Kilolab." />
        <link rel="canonical" href="https://kilolab.fr/washers" />
      </Helmet>

      <div className="min-h-screen bg-white font-sans text-slate-900">
        <Navbar />

        {/* HERO */}
        <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-teal-500/20 text-teal-300 px-4 py-2 rounded-full text-sm font-bold mb-8 border border-teal-500/30 animate-pulse">
                <span className="w-2 h-2 bg-teal-400 rounded-full"></span>
                Lille & Nantes • Lancement 2025
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black mb-6 leading-[1.1] tracking-tight text-white">
                Transforme ta machine à laver<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
                  en machine à cash.
                </span>
              </h1>
              
              <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                Lave le linge de tes voisins, gagne jusqu'à <strong className="text-teal-400">600€/mois</strong>. 
                Liberté totale, comme Uber. Pas de patron, pas d'horaires.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link 
                  to="/become-washer"
                  className="w-full sm:w-auto px-8 py-4 bg-teal-500 text-slate-900 font-bold rounded-2xl hover:bg-teal-400 transition hover:scale-105 flex items-center justify-center gap-2 shadow-xl shadow-teal-500/30"
                >
                  💰 Devenir Washer
                  <ArrowRight size={20} />
                </Link>
                
                  href="#simulator"
                  className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/20 font-bold rounded-2xl hover:bg-white/20 transition flex items-center justify-center gap-2"
                >
                  📊 Simuler mes gains
                </a>
              </div>

              {/* SOCIAL PROOF */}
              <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full border-2 border-slate-900"></div>
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full border-2 border-slate-900"></div>
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full border-2 border-slate-900"></div>
                  </div>
                  <span className="font-bold text-white">45 Washers actifs</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star size={16} className="fill-yellow-400 text-yellow-400" />
                  <span className="font-bold text-white">4.8/5</span>
                  <span>(127 avis)</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* AVANTAGES */}
        <section className="py-24 bg-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black mb-4">
                Le "Uber" du linge. <span className="text-teal-600">Dans ton quartier.</span>
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Pas de diplôme, pas d'expérience. Juste une machine à laver et un peu de temps libre.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-center">
              
              {/* GAUCHE : AVANTAGES */}
              <div className="space-y-8">
                <div className="flex gap-6 items-start group">
                  <div className="bg-teal-100 p-4 rounded-2xl shrink-0 group-hover:scale-110 transition">
                    <Banknote className="text-teal-600" size={32} />
                  </div>
                  <div>
                    <h3 className="font-bold text-2xl mb-2">17,50€ par lavage</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Tu gardes 70% du prix. Pour un sac de 5kg à 25€, tu empoches 17,50€. 
                      Fais 4 lavages/semaine = <strong className="text-teal-600">280€/mois</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 items-start group">
                  <div className="bg-blue-100 p-4 rounded-2xl shrink-0 group-hover:scale-110 transition">
                    <Clock className="text-blue-600" size={32} />
                  </div>
                  <div>
                    <h3 className="font-bold text-2xl mb-2">2h de travail réel</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Récupération (15min) + Pliage (30min). La machine fait le reste pendant que tu fais autre chose.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 items-start group">
                  <div className="bg-purple-100 p-4 rounded-2xl shrink-0 group-hover:scale-110 transition">
                    <MapPin className="text-purple-600" size={32} />
                  </div>
                  <div>
                    <h3 className="font-bold text-2xl mb-2">Missions à 500m</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Tu ne laves que pour tes voisins. Pas besoin de voiture, tout se fait à pied ou en vélo.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 items-start group">
                  <div className="bg-green-100 p-4 rounded-2xl shrink-0 group-hover:scale-110 transition">
                    <ShieldCheck className="text-green-600" size={32} />
                  </div>
                  <div>
                    <h3 className="font-bold text-2xl mb-2">Assurance incluse</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Chaque lavage est assuré jusqu'à 200€. Support 7j/7. Système de notation 5 étoiles.
                    </p>
                  </div>
                </div>
              </div>

              {/* DROITE : SIMULATEUR */}
              <div id="simulator" className="bg-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-700 text-white">
                <h3 className="text-2xl font-black mb-6 flex items-center gap-2">
                  <TrendingUp className="text-teal-400"/> Simulateur de revenus 💰
                </h3>
                
                <div className="mb-8">
                  <div className="flex justify-between mb-3">
                    <span className="text-slate-400">Lavages par semaine</span>
                    <span className="text-3xl font-black text-teal-400">{washersEarning}</span>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="30" 
                    value={washersEarning}
                    onChange={(e) => setWashersEarning(parseInt(e.target.value))}
                    className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-2">
                    <span>Quelques sacs</span>
                    <span>Gros volume</span>
                  </div>
                </div>

                <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-700 mb-6">
                  <p className="text-slate-400 text-sm mb-2">Revenus mensuels estimés</p>
                  <p className="text-5xl font-black text-teal-400">
                    {(washersEarning * 4 * 17.5).toFixed(0)}€
                  </p>
                  <p className="text-slate-500 text-xs mt-2">
                    Basé sur 70% de commission (17,50€ par lavage)
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-white/5 p-4 rounded-xl text-center">
                    <p className="text-slate-400 text-xs mb-1">Temps/semaine</p>
                    <p className="text-2xl font-bold text-white">~{(washersEarning * 2).toFixed(0)}h</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl text-center">
                    <p className="text-slate-400 text-xs mb-1">Taux horaire</p>
                    <p className="text-2xl font-bold text-white">
                      {(17.5 / 2).toFixed(0)}€/h
                    </p>
                  </div>
                </div>

                <Link 
                  to="/become-washer"
                  className="w-full block py-4 bg-teal-500 text-slate-900 rounded-xl font-bold text-center hover:bg-teal-400 transition shadow-lg"
                >
                  Je m'inscris maintenant
                </Link>
              </div>

            </div>
          </div>
        </section>

        {/* COMMENT ÇA MARCHE */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black mb-4">
                Comment ça marche ?
              </h2>
              <p className="text-slate-600">En 4 étapes simples</p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  icon: <Smartphone size={32} />,
                  title: "1. Inscription",
                  desc: "Remplis le formulaire en 5min. Vérification d'identité sous 24h."
                },
                {
                  icon: <CheckCircle size={32} />,
                  title: "2. Validation",
                  desc: "On t'appelle pour confirmer. Tu reçois ton kit de démarrage (peson + guide)."
                },
                {
                  icon: <Zap size={32} />,
                  title: "3. Première mission",
                  desc: "Active ta dispo dans l'app. Un client près de chez toi commande."
                },
                {
                  icon: <Banknote size={32} />,
                  title: "4. Paiement",
                  desc: "Reçois ton paiement sous 48h après livraison. Virement bancaire automatique."
                }
              ].map((item, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center hover:-translate-y-1 transition duration-300">
                  <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TÉMOIGNAGES */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-black mb-4">Ils gagnent déjà avec Kilolab</h2>
              <p className="text-slate-600">Témoignages de nos Washers</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah, 24 ans",
                  city: "Lille",
                  avatar: "S",
                  revenue: "380€/mois",
                  text: "Parfait pour compléter mes études ! Je fais 3-4 lavages par semaine entre mes cours.",
                  rating: 5
                },
                {
                  name: "Karim, 35 ans",
                  city: "Nantes",
                  avatar: "K",
                  revenue: "520€/mois",
                  text: "En tant que freelance, c'est un complément de revenu régulier. Très flexible.",
                  rating: 5
                },
                {
                  name: "Marie, 42 ans",
                  city: "Lille",
                  avatar: "M",
                  revenue: "290€/mois",
                  text: "Je travaille à temps partiel, ça me fait un extra confortable sans contrainte.",
                  rating: 5
                }
              ].map((testimonial, i) => (
                <div key={i} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{testimonial.name}</h4>
                      <p className="text-sm text-slate-500">{testimonial.city}</p>
                    </div>
                    <div className="ml-auto bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-xs font-bold">
                      {testimonial.revenue}
                    </div>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-slate-600 italic leading-relaxed">"{testimonial.text}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="py-20 bg-gradient-to-r from-teal-600 to-cyan-600 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-black mb-4">Prêt à te lancer ?</h2>
            <p className="text-xl mb-8 text-teal-100">
              Rejoins les 45 Washers actifs sur Lille & Nantes. Inscription gratuite.
            </p>
            <Link 
              to="/become-washer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-teal-600 rounded-2xl font-bold text-lg hover:bg-slate-100 transition shadow-2xl"
            >
              💰 Devenir Washer maintenant
              <ArrowRight size={20} />
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
