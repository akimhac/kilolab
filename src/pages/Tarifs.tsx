import { Helmet } from 'react-helmet-async';
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
        </section>

        {/* ═══════════════════════════════════════════════════════════
            COMPARATIF AMÉLIORÉ - Services Traditionnels vs Kilolab
        ═══════════════════════════════════════════════════════════ */}
        <section className="py-20 bg-slate-50 border-y border-slate-200">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-full text-sm font-bold mb-4">
                <AlertCircle size={16} />
                Arrêtez de payer trop cher
              </div>
              <h2 className="text-3xl font-black mb-4">Le match des prix 🥊</h2>
              <p className="text-slate-600">Comparaison pour 5kg de linge (environ 1 machine standard).</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* SERVICES TRADITIONNELS */}
              <div className="bg-white p-8 rounded-3xl border border-red-100 opacity-80 hover:opacity-100 transition duration-500">
                <div className="flex items-center gap-3 mb-6 text-red-500">
                  <X size={32} />
                  <h3 className="text-2xl font-bold">Laverie & Services Traditionnels</h3>
                </div>

                <ul className="space-y-4 text-slate-600 mb-8">
                  <li className="flex items-center gap-3 pb-3 border-b">
                    <X size={18} className="text-red-500 flex-shrink-0" />
                    <span>Déplacement obligatoire</span>
                  </li>
                  <li className="flex items-center gap-3 pb-3 border-b">
                    <Clock size={18} className="text-orange-500 flex-shrink-0" />
                    <span>Attente sur place (1h30 min)</span>
                  </li>
                  <li className="flex items-center gap-3 pb-3 border-b">
                    <X size={18} className="text-red-500 flex-shrink-0" />
                    <span>Linge souvent non plié</span>
                  </li>
                  <li className="flex items-center gap-3 pb-3">
                    <AlertCircle size={18} className="text-orange-500 flex-shrink-0" />
                    <span>Produits chimiques standards</span>
                  </li>
                </ul>

                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center">
                  <p className="text-sm mb-1">5kg (Lavage + Séchage + Lessive)</p>
                  <p className="font-black text-3xl">~18€ 💸</p>
                </div>
              </div>

              {/* KILOLAB */}
              <div className="bg-white p-8 rounded-3xl border-2 border-teal-500 shadow-xl relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-teal-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                  🏆 GAGNANT
                </div>

                <div className="flex items-center gap-3 mb-6 text-teal-600 mt-4">
                  <Check size={32} />
                  <h3 className="text-2xl font-bold">L'Expérience Kilolab</h3>
                </div>

                <ul className="space-y-4 text-slate-700 mb-8">
                  <li className="flex items-center gap-3 pb-3 border-b">
                    <Check size={18} className="text-teal-500 flex-shrink-0 font-bold" />
                    <span className="font-medium">Collecte & Livraison à domicile</span>
                  </li>
                  <li className="flex items-center gap-3 pb-3 border-b">
                    <Check size={18} className="text-teal-500 flex-shrink-0 font-bold" />
                    <span className="font-medium">Zéro attente (Vous restez chez vous)</span>
                  </li>
                  <li className="flex items-center gap-3 pb-3 border-b">
                    <Sparkles size={18} className="text-teal-500 flex-shrink-0 font-bold" />
                    <span className="font-medium">Linge lavé, séché et plié au carré</span>
                  </li>
                  <li className="flex items-center gap-3 pb-3">
                    <Check size={18} className="text-teal-500 flex-shrink-0 font-bold" />
                    <span className="font-medium">Traitement personnalisé & Soigné</span>
                  </li>
                </ul>

                <div className="bg-teal-600 text-white p-4 rounded-xl text-center">
                  <div className="text-sm opacity-90 mb-1">5kg × 3€ (Tout inclus)</div>
                  <div className="font-black text-3xl">15€ 🎉</div>
                </div>

                <p className="text-center text-teal-600 text-sm font-bold mt-4 bg-teal-50 p-3 rounded-xl">
                  ↘ Vous économisez 3€ + 1h30 de votre vie
                </p>
              </div>
            </div>

            {/* HIGHLIGHT BOX */}
            <div className="mt-12 text-center">
              <div className="inline-block bg-gradient-to-r from-teal-600 to-cyan-600 text-white p-6 rounded-2xl max-w-2xl">
                <h3 className="text-xl font-black mb-2">💎 Même prix, meilleur service</h3>
                <p className="text-teal-100">
                  Avec Kilolab, vous payez <strong className="text-white">moins cher qu'une laverie</strong>, et vous récupérez <strong className="text-white">votre temps libre</strong> !
                </p>
              </div>
            </div>
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