import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Check, X, Clock, Zap, Sparkles, AlertCircle, Shield, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useRef, useState, ReactNode } from 'react';

// Animation component
function AnimateOnScroll({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'none' : 'translateY(30px)',
        transition: `opacity 0.6s ease-out ${delay}ms, transform 0.6s ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function Tarifs() {
  return (
    <>
      <Helmet>
        <title>Tarifs Kilolab - Dès 3€/kg | Standard ou Express</title>
        <meta
          name="description"
          content="Standard 3€/kg (48-72h) ou Express 5€/kg (24h). Lavage, séchage et pliage inclus. Économisez jusqu'à 77% vs services traditionnels."
        />
        <link rel="canonical" href="https://kilolab.fr/tarifs" />
      </Helmet>

      <div className="min-h-screen bg-white font-sans">
        <Navbar />

        {/* HERO */}
        <header className="pt-32 pb-16 bg-slate-900 text-white text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-black mb-6">
              Tarifs simples.<br />
              <span className="text-teal-400">Sans surprise.</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              Deux formules claires. Aucun frais caché.
            </p>
          </div>
        </header>

        {/* LES 2 FORMULES */}
        <section className="py-20 px-4 -mt-10">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
            {/* STANDARD */}
            <AnimateOnScroll delay={0}>
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200 flex flex-col hover:-translate-y-2 transition duration-300 h-full">
              <div className="mb-6">
                <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold uppercase">
                  Standard
                </span>
                <h3 className="text-2xl font-black mt-3 text-slate-900">3€/kg</h3>
                <p className="text-sm text-slate-600 mt-2 font-medium">
                  Idéal pour le quotidien.
                </p>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex gap-3 text-slate-700 font-medium">
                  <Check size={20} className="text-green-500 flex-shrink-0" />
                  Lavage
                </li>
                <li className="flex gap-3 text-slate-700 font-medium">
                  <Check size={20} className="text-green-500 flex-shrink-0" />
                  Séchage
                </li>
                <li className="flex gap-3 text-slate-700 font-medium">
                  <Check size={20} className="text-green-500 flex-shrink-0" />
                  Pliage soigné
                </li>
                <li className="flex gap-3 text-slate-700 font-medium bg-slate-50 p-3 rounded-lg">
                  <Clock size={20} className="text-slate-400 flex-shrink-0" />
                  <strong>Prêt sous 48 à 72h</strong>
                </li>
              </ul>

              <Link
                to="/new-order"
                className="w-full py-4 border-2 border-slate-900 text-slate-900 font-bold rounded-xl text-center hover:bg-slate-900 hover:text-white transition"
              >
                Choisir Standard
              </Link>
              </div>
            </AnimateOnScroll>

            {/* EXPRESS */}
            <AnimateOnScroll delay={150}>
              <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-2xl border-2 border-teal-500 flex flex-col relative transform md:scale-105 hover:scale-110 transition duration-300 h-full">
              <div className="absolute top-4 right-4 bg-teal-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                Populaire
              </div>

              <div className="mb-6">
                <span className="bg-teal-500/20 text-teal-300 px-3 py-1 rounded-full text-xs font-bold uppercase">
                  Premium
                </span>
                <h3 className="text-2xl font-black mt-3">5€/kg</h3>
                <p className="text-sm text-slate-400 mt-2 font-medium">
                  Idéal si vous êtes pressé.
                </p>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex gap-3 font-medium">
                  <Check size={20} className="text-teal-400 flex-shrink-0" />
                  Lavage prioritaire
                </li>
                <li className="flex gap-3 font-medium">
                  <Check size={20} className="text-teal-400 flex-shrink-0" />
                  Séchage express
                </li>
                <li className="flex gap-3 font-medium">
                  <Sparkles size={20} className="text-teal-400 flex-shrink-0" />
                  Pliage "boutique"
                </li>
                <li className="flex gap-3 font-medium">
                  <Check size={20} className="text-teal-400 flex-shrink-0" />
                  Traitement détachant
                </li>
                <li className="flex gap-3 font-medium bg-white/10 p-3 rounded-lg">
                  <Zap size={20} className="text-yellow-400 flex-shrink-0" />
                  <strong>Sous 24h garanti</strong>
                </li>
              </ul>

              <Link
                to="/new-order"
                className="w-full py-4 bg-teal-500 text-slate-900 font-bold rounded-xl text-center hover:bg-teal-400 transition shadow-lg"
              >
                Choisir Express
              </Link>
              </div>
            </AnimateOnScroll>
          </div>

          {/* BADGES CONFIANCE */}
          <AnimateOnScroll delay={300}>
            <div className="mt-12 flex justify-center items-center gap-6 flex-wrap text-sm font-medium text-slate-600">
            <div className="flex items-center gap-2">
              <Shield size={18} className="text-green-500" />
              <span>Paiement sécurisé</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={18} className="text-blue-500" />
              <span>Washers vérifiés</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle size={18} className="text-purple-500" />
              <span>Support client disponible</span>
            </div>
          </div>
          </AnimateOnScroll>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            COMPARATIF AMÉLIORÉ - Services Traditionnels vs Kilolab
        ═══════════════════════════════════════════════════════════ */}
        <section className="py-20 bg-slate-50 border-y border-slate-200">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-full text-sm font-bold mb-4">
                <AlertCircle size={16} />
                Arrêtez de perdre du temps et de l'argent
              </div>
              <h2 className="text-3xl md:text-4xl font-black mb-4">Le VRAI coût de votre lessive 💰</h2>
              <p className="text-slate-600 text-lg">Ce que vous payez vraiment quand vous faites votre linge vous-même.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-stretch">
              {/* COÛT RÉEL - VOUS-MÊME / LAVERIE */}
              <AnimateOnScroll delay={0}>
                <div className="bg-gradient-to-br from-red-50 to-orange-50 p-8 rounded-3xl border-2 border-red-200 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                      <X size={24} className="text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-red-700">Faire soi-même / Laverie</h3>
                      <p className="text-sm text-red-500">Le coût caché qu'on ignore</p>
                    </div>
                  </div>

                  {/* Détail des coûts */}
                  <div className="space-y-3 mb-6 flex-1">
                    <div className="flex justify-between items-center p-3 bg-white/80 rounded-xl">
                      <span className="text-slate-700">Eau + Électricité</span>
                      <span className="font-bold text-slate-900">2.70€</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/80 rounded-xl">
                      <span className="text-slate-700">Lessive + Adoucissant</span>
                      <span className="font-bold text-slate-900">1.80€</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/80 rounded-xl">
                      <span className="text-slate-700">Usure machine + Séchage</span>
                      <span className="font-bold text-slate-900">2.30€</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-orange-100 rounded-xl border border-orange-200">
                      <div className="flex items-center gap-2">
                        <Clock size={18} className="text-orange-600" />
                        <span className="text-orange-800 font-medium">Votre temps (2h30)</span>
                      </div>
                      <span className="font-bold text-orange-700">30€*</span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-5 rounded-2xl">
                    <div className="flex justify-between items-center mb-2 text-sm opacity-90">
                      <span>Coût matériel</span>
                      <span>~7€</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-white/30 text-sm opacity-90">
                      <span>Coût de votre temps</span>
                      <span>~30€</span>
                    </div>
                    <div className="flex justify-between items-center pt-3">
                      <span className="font-bold text-lg">COÛT RÉEL TOTAL</span>
                      <span className="font-black text-4xl">~37€</span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-slate-500 mt-3 text-center">*Basé sur le SMIC horaire (12€/h)</p>
                </div>
              </AnimateOnScroll>

              {/* KILOLAB */}
              <AnimateOnScroll delay={150}>
                <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-8 rounded-3xl border-2 border-teal-400 shadow-xl relative h-full flex flex-col">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-400 text-slate-900 px-5 py-1.5 rounded-full text-sm font-black shadow-lg">
                    🏆 VOUS GAGNEZ
                  </div>

                  <div className="flex items-center gap-3 mb-6 mt-4">
                    <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                      <Check size={24} className="text-teal-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-teal-700">Avec Kilolab</h3>
                      <p className="text-sm text-teal-500">Tout inclus, zéro effort</p>
                    </div>
                  </div>

                  {/* Avantages */}
                  <div className="space-y-3 mb-6 flex-1">
                    <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-teal-100">
                      <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check size={16} className="text-white" />
                      </div>
                      <span className="font-medium text-slate-900">Collecte gratuite à domicile</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-teal-100">
                      <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check size={16} className="text-white" />
                      </div>
                      <span className="font-medium text-slate-900">Lavage pro + Séchage + Pliage</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-teal-100">
                      <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check size={16} className="text-white" />
                      </div>
                      <span className="font-medium text-slate-900">Livraison en 48h</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-teal-100 rounded-xl border border-teal-200">
                      <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Clock size={16} className="text-white" />
                      </div>
                      <span className="font-bold text-teal-800">Votre temps : 0 minute</span>
                    </div>
                  </div>

                  {/* Prix Kilolab */}
                  <div className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white p-5 rounded-2xl mb-4">
                    <div className="text-center">
                      <p className="text-sm opacity-90 mb-1">5kg × 3€/kg (Tout inclus)</p>
                      <p className="font-black text-5xl">15€</p>
                    </div>
                  </div>

                  {/* Économies */}
                  <div className="bg-white p-4 rounded-xl border-2 border-teal-300">
                    <div className="text-center">
                      <p className="text-teal-600 font-bold text-sm uppercase tracking-wide mb-2">Vous économisez</p>
                      <div className="flex justify-center items-center gap-4">
                        <div className="text-center">
                          <p className="text-3xl font-black text-slate-900">22€</p>
                          <p className="text-xs text-slate-500">d'argent</p>
                        </div>
                        <div className="text-2xl text-slate-300">+</div>
                        <div className="text-center">
                          <p className="text-3xl font-black text-slate-900">2h30</p>
                          <p className="text-xs text-slate-500">de vie</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>
            </div>

            {/* HIGHLIGHT BOX - Plus impactant */}
            <AnimateOnScroll delay={300}>
              <div className="mt-12 text-center">
                <div className="inline-block bg-gradient-to-r from-slate-900 to-slate-800 text-white p-8 rounded-3xl max-w-3xl shadow-2xl">
                  <p className="text-5xl font-black mb-4">🤯</p>
                  <h3 className="text-2xl md:text-3xl font-black mb-4">
                    Vous payez pour <span className="text-red-400">PERDRE</span> 2h30 de votre vie ?
                  </h3>
                  <p className="text-slate-300 text-lg mb-6">
                    Avec Kilolab, pour <strong className="text-teal-400">moins cher</strong> qu'un aller-retour à la laverie, 
                    vous récupérez <strong className="text-teal-400">2h30 de temps libre</strong>. 
                  </p>
                  <Link
                    to="/new-order"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-teal-500 text-white font-bold rounded-full hover:bg-teal-400 transition-all hover:scale-105 active:scale-95 shadow-lg"
                  >
                    Récupérer mon temps
                    <Zap size={20} />
                  </Link>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-white">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl font-black text-center mb-12">Questions fréquentes</h2>

            <div className="space-y-4">
              <details className="bg-slate-50 p-6 rounded-2xl group cursor-pointer">
                <summary className="font-bold flex justify-between items-center list-none">
                  Comment est calculé le poids ?
                  <span className="group-open:rotate-180 transition text-teal-500">▼</span>
                </summary>
                <p className="mt-4 text-slate-600">
                  Le Washer pèse votre sac devant vous avec un peson digital lors de la collecte. Vous validez le poids ensemble.
                </p>
              </details>

              <details className="bg-slate-50 p-6 rounded-2xl group cursor-pointer">
                <summary className="font-bold flex justify-between items-center list-none">
                  Y a-t-il un minimum de commande ?
                  <span className="group-open:rotate-180 transition text-teal-500">▼</span>
                </summary>
                <p className="mt-4 text-slate-600">
                  Oui, le minimum est de 3kg (soit 9€ en Standard). C'est environ l'équivalent d'une petite machine.
                </p>
              </details>

              <details className="bg-slate-50 p-6 rounded-2xl group cursor-pointer">
                <summary className="font-bold flex justify-between items-center list-none">
                  Quelle différence entre Standard et Express ?
                  <span className="group-open:rotate-180 transition text-teal-500">▼</span>
                </summary>
                <p className="mt-4 text-slate-600">
                  <strong>Standard (3€/kg)</strong> : Sous 48 à 72h, idéal pour le quotidien.<br />
                  <strong>Express (5€/kg)</strong> : Sous 24h garanti, traitement détachant inclus, pliage "boutique".
                </p>
              </details>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}