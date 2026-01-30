import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowRight, Star, Clock, Banknote, Smartphone, MapPin, ShieldCheck, CheckCircle2, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Landing() {
  const [washersEarning, setWashersEarning] = useState(15);

  return (
    <>
      {/* SEO OPTIMISÉ */}
      <Helmet>
        <title>Kilolab - Gagne jusqu'à 600€/mois en lavant du linge | Le Uber du Linge</title>
        <meta 
          name="description" 
          content="Transforme ta machine à laver en source de revenus. Lave le linge de tes voisins et gagne jusqu'à 600€/mois. Liberté totale, comme Uber. Lille & Nantes." 
        />
        
        {/* Open Graph (Facebook, LinkedIn) */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://kilolab.fr" />
        <meta property="og:title" content="Kilolab - Gagne jusqu'à 600€/mois en lavant du linge" />
        <meta property="og:description" content="Le Uber du linge. Rejoins les Washers et transforme ta machine à laver en machine à cash." />
        <meta property="og:image" content="https://kilolab.fr/og-image-washer.jpg" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Kilolab - Gagne jusqu'à 600€/mois" />
        <meta name="twitter:description" content="Le Uber du linge. Rejoins les Washers Kilolab." />
        <meta name="twitter:image" content="https://kilolab.fr/og-image-washer.jpg" />
        
        {/* SEO Local */}
        <meta name="geo.region" content="FR-59" />
        <meta name="geo.placename" content="Lille" />
        <meta name="geo.position" content="50.6292;3.0573" />
        
        {/* Keywords (moins important mais utile) */}
        <meta name="keywords" content="washer, linge, lavage, pressing, uber linge, gagner argent, job étudiant, lille, nantes, job flexible" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://kilolab.fr" />
        
        {/* Schema.org JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Kilolab",
            "description": "Plateforme C2C de lavage de linge - Le Uber du Linge",
            "url": "https://kilolab.fr",
            "logo": "https://kilolab.fr/logo.png",
            "sameAs": [
              "https://www.facebook.com/kilolab",
              "https://www.instagram.com/kilolab"
            ],
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Lille",
              "addressRegion": "Hauts-de-France",
              "postalCode": "59000",
              "addressCountry": "FR"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "reviewCount": "127"
            }
          })}
        </script>
        
        {/* JobPosting Schema (pour Google Jobs) */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "JobPosting",
            "title": "Washer - Laveur de Linge à Domicile",
            "description": "Rejoins Kilolab et gagne jusqu'à 600€/mois en lavant le linge de tes voisins. Liberté totale, horaires flexibles.",
            "datePosted": "2026-01-30",
            "validThrough": "2026-12-31",
            "employmentType": "CONTRACTOR",
            "hiringOrganization": {
              "@type": "Organization",
              "name": "Kilolab",
              "sameAs": "https://kilolab.fr"
            },
            "jobLocation": {
              "@type": "Place",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Lille",
                "addressRegion": "Hauts-de-France",
                "addressCountry": "FR"
              }
            },
            "baseSalary": {
              "@type": "MonetaryAmount",
              "currency": "EUR",
              "value": {
                "@type": "QuantitativeValue",
                "value": 600,
                "unitText": "MONTH"
              }
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-white font-sans text-slate-900">
        <Navbar />

        {/* HERO - SPLIT WASHER / CLIENT */}
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
                  💰 Devenir Washer (Job)
                  <ArrowRight size={20} />
                </Link>
                <Link
                  to="/trouver"
                  className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/20 font-bold rounded-2xl hover:bg-white/20 transition flex items-center justify-center gap-2"
                >
                  🧺 Commander un lavage
                </Link>
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

        {/* SECTION REVENUS WASHER */}
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
                <div className="flex gap-6 items-start">
                  <div className="bg-teal-100 p-4 rounded-2xl shrink-0">
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

                <div className="flex gap-6 items-start">
                  <div className="bg-blue-100 p-4 rounded-2xl shrink-0">
                    <Clock className="text-blue-600" size={32} />
                  </div>
                  <div>
                    <h3 className="font-bold text-2xl mb-2">2h de travail réel</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Récupération (15min) + Pliage (30min). La machine fait le reste pendant que tu fais autre chose.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 items-start">
                  <div className="bg-purple-100 p-4 rounded-2xl shrink-0">
                    <MapPin className="text-purple-600" size={32} />
                  </div>
                  <div>
                    <h3 className="font-bold text-2xl mb-2">Missions à 500m</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Tu ne laves que pour tes voisins. Pas besoin de voiture, tout se fait à pied ou en vélo.
                    </p>
                  </div>
                </div>
              </div>

              {/* DROITE : SIMULATEUR */}
              <div className="bg-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-700 text-white">
                <h3 className="text-2xl font-black mb-6">Simulateur de revenus 💰</h3>
                
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

                <div className="grid grid-cols-2 gap-4">
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
                  className="mt-8 w-full block py-4 bg-teal-500 text-slate-900 rounded-xl font-bold text-center hover:bg-teal-400 transition shadow-lg"
                >
                  Je m'inscris maintenant
                </Link>
              </div>

            </div>
          </div>
        </section>

        {/* COMMENT ÇA MARCHE (CLIENT) */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black mb-4">
                Pour les clients : Simple comme bonjour
              </h2>
              <p className="text-slate-600">Ton linge lavé par tes voisins de confiance</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Smartphone size={32} />,
                  title: "1. Commande",
                  desc: "Choisis ton créneau sur l'app. Un Washer près de chez toi accepte."
                },
                {
                  icon: <Clock size={32} />,
                  title: "2. Dépôt",
                  desc: "Le Washer récupère ton sac devant ta porte à l'heure choisie."
                },
                {
                  icon: <Star size={32} />,
                  title: "3. Livraison",
                  desc: "24h après : linge propre, plié, livré. Tu notes le Washer sur 5 étoiles."
                }
              ].map((item, i) => (
                <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center hover:-translate-y-1 transition duration-300">
                  <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-xl mb-3">{item.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TRUST & SAFETY */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <ShieldCheck size={48} className="mx-auto text-teal-600 mb-6" />
            <h2 className="text-3xl font-black mb-4">Contrôles & Sécurité</h2>
            <p className="text-slate-600 leading-relaxed mb-8">
              Tous les Washers sont vérifiés (identité, RIB, avis clients).
              Chaque lavage est assuré jusqu'à 200€.
              Système de notation 5 étoiles comme Uber.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-slate-50 px-6 py-3 rounded-full text-sm font-bold text-slate-700">
                ✓ Vérification identité
              </div>
              <div className="bg-slate-50 px-6 py-3 rounded-full text-sm font-bold text-slate-700">
                ✓ Assurance incluse
              </div>
              <div className="bg-slate-50 px-6 py-3 rounded-full text-sm font-bold text-slate-700">
                ✓ Support 7j/7
              </div>
            </div>
          </div>
        </section>

        {/* STATS SOCIALES */}
        <section className="py-16 bg-slate-900 text-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-5xl font-black text-teal-400 mb-2">600€</div>
                <p className="text-slate-400">Revenus moyen Washer / mois</p>
              </div>
              <div>
                <div className="text-5xl font-black text-teal-400 mb-2">4.8★</div>
                <p className="text-slate-400">Note moyenne des Washers</p>
              </div>
              <div>
                <div className="text-5xl font-black text-teal-400 mb-2">24h</div>
                <p className="text-slate-400">Délai moyen de traitement</p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
