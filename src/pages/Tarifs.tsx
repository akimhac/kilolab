import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Check, X, Clock, Zap, Sparkles, AlertCircle, Shield, CheckCircle, Heart } from 'lucide-react';
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
  const { t } = useTranslation();
  
  return (
    <>
      <Helmet>
        <title>{t('pricing.heroTitle')} {t('pricing.heroTitle2')} | Kilolab</title>
        <meta name="description" content={t('pricing.heroSubtitle')} />
        <link rel="canonical" href="https://kilolab.fr/tarifs" />
      </Helmet>

      <div className="min-h-screen bg-white font-sans">
        <Navbar />

        {/* HERO */}
        <header className="pt-32 pb-16 bg-slate-900 text-white text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-black mb-6">
              {t('pricing.heroTitle')}<br />
              <span className="text-teal-400">{t('pricing.heroTitle2')}</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              {t('pricing.heroSubtitle')}
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
                  {t('pricing.standard.badge')}
                </span>
                <h3 className="text-2xl font-black mt-3 text-slate-900">{t('pricing.standard.price')}</h3>
                <p className="text-sm text-slate-600 mt-2 font-medium">
                  {t('pricing.standard.description')}
                </p>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex gap-3 text-slate-700 font-medium">
                  <Check size={20} className="text-green-500 flex-shrink-0" />
                  {t('pricing.standard.washing')}
                </li>
                <li className="flex gap-3 text-slate-700 font-medium">
                  <Check size={20} className="text-green-500 flex-shrink-0" />
                  {t('pricing.standard.drying')}
                </li>
                <li className="flex gap-3 text-slate-700 font-medium">
                  <Check size={20} className="text-green-500 flex-shrink-0" />
                  {t('pricing.standard.folding')}
                </li>
                <li className="flex gap-3 text-slate-700 font-medium bg-slate-50 p-3 rounded-lg">
                  <Clock size={20} className="text-slate-400 flex-shrink-0" />
                  <strong>{t('pricing.standard.time')}</strong>
                </li>
              </ul>

              <Link
                to="/new-order"
                className="w-full py-4 border-2 border-slate-900 text-slate-900 font-bold rounded-xl text-center hover:bg-slate-900 hover:text-white transition"
              >
                {t('pricing.standard.cta')}
              </Link>
              </div>
            </AnimateOnScroll>

            {/* EXPRESS */}
            <AnimateOnScroll delay={150}>
              <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-2xl border-2 border-teal-500 flex flex-col relative transform md:scale-105 hover:scale-110 transition duration-300 h-full">
              <div className="absolute top-4 right-4 bg-teal-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                {t('pricing.express.popular')}
              </div>

              <div className="mb-6">
                <span className="bg-teal-500/20 text-teal-300 px-3 py-1 rounded-full text-xs font-bold uppercase">
                  {t('pricing.express.badge')}
                </span>
                <h3 className="text-2xl font-black mt-3">{t('pricing.express.price')}</h3>
                <p className="text-sm text-slate-400 mt-2 font-medium">
                  {t('pricing.express.description')}
                </p>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex gap-3 font-medium">
                  <Check size={20} className="text-teal-400 flex-shrink-0" />
                  {t('pricing.express.washing')}
                </li>
                <li className="flex gap-3 font-medium">
                  <Check size={20} className="text-teal-400 flex-shrink-0" />
                  {t('pricing.express.drying')}
                </li>
                <li className="flex gap-3 font-medium">
                  <Sparkles size={20} className="text-teal-400 flex-shrink-0" />
                  {t('pricing.express.folding')}
                </li>
                <li className="flex gap-3 font-medium">
                  <Check size={20} className="text-teal-400 flex-shrink-0" />
                  {t('pricing.express.stain')}
                </li>
                <li className="flex gap-3 font-medium bg-white/10 p-3 rounded-lg">
                  <Zap size={20} className="text-yellow-400 flex-shrink-0" />
                  <strong>{t('pricing.express.time')}</strong>
                </li>
              </ul>

              <Link
                to="/new-order"
                className="w-full py-4 bg-teal-500 text-slate-900 font-bold rounded-xl text-center hover:bg-teal-400 transition shadow-lg"
              >
                {t('pricing.express.cta')}
              </Link>
              </div>
            </AnimateOnScroll>
          </div>

          {/* BADGES CONFIANCE */}
          <AnimateOnScroll delay={300}>
            <div className="mt-12 flex justify-center items-center gap-6 flex-wrap text-sm font-medium text-slate-600">
            <div className="flex items-center gap-2">
              <Shield size={18} className="text-green-500" />
              <span>{t('pricing.trust.secure')}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={18} className="text-blue-500" />
              <span>{t('pricing.trust.verified')}</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle size={18} className="text-purple-500" />
              <span>{t('pricing.trust.support')}</span>
            </div>
          </div>
          </AnimateOnScroll>
        </section>

        {/* BÉNÉFICES SECTION - STARTUP STYLE */}
        <section className="py-20 bg-slate-50 border-y border-slate-200">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-700 rounded-full text-sm font-bold mb-4">
                <Sparkles size={16} />
                Ce que vous gagnez
              </div>
              <h2 className="text-3xl md:text-4xl font-black mb-4">
                Reprenez le contrôle de votre temps
              </h2>
              <p className="text-slate-600 text-lg">Plus qu'un service de laverie, un nouveau style de vie.</p>
            </div>

            {/* Benefits Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {/* Card 1 */}
              <AnimateOnScroll delay={0}>
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white h-full">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-xl flex items-center justify-center mb-4">
                    <Check size={24} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Fini les corvées</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">
                    Plus jamais de tri, de machine à lancer, de séchage à surveiller.
                  </p>
                  <p className="text-teal-400 font-semibold text-sm">
                    2h30 économisées/semaine
                  </p>
                </div>
              </AnimateOnScroll>

              {/* Card 2 */}
              <AnimateOnScroll delay={100}>
                <div className="bg-gradient-to-br from-purple-600 to-violet-700 rounded-3xl p-6 text-white h-full">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                    <Heart size={24} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Plus de temps libre</h3>
                  <p className="text-purple-100 text-sm leading-relaxed mb-4">
                    Des moments précieux avec votre famille, vos amis, ou pour vous.
                  </p>
                  <p className="text-white font-semibold text-sm">
                    Livré sous 48h max
                  </p>
                </div>
              </AnimateOnScroll>

              {/* Card 3 */}
              <AnimateOnScroll delay={200}>
                <div className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-3xl p-6 text-white h-full">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                    <Shield size={24} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">L'esprit tranquille</h3>
                  <p className="text-teal-50 text-sm leading-relaxed mb-4">
                    Lessive professionnelle, pliage soigné, vêtements traités avec soin.
                  </p>
                  <p className="text-white font-semibold text-sm">
                    98% de clients satisfaits
                  </p>
                </div>
              </AnimateOnScroll>
            </div>

            {/* Ideal For Section */}
            <AnimateOnScroll delay={300}>
              <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 md:p-10">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">
                      Idéal pour vous si...
                    </h3>
                    <ul className="space-y-3">
                      {[
                        "Vous travaillez beaucoup et manquez de temps",
                        "Vous avez une famille et des journées chargées", 
                        "Vous préférez profiter de la vie",
                        "Vous aimez avoir du linge frais sans effort"
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className="w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check size={12} className="text-white" />
                          </div>
                          <span className="text-slate-300 text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="text-center">
                    <div className="inline-block bg-teal-500/20 backdrop-blur-sm rounded-2xl p-6 border border-teal-500/30">
                      <p className="text-teal-400 font-semibold mb-1">À partir de</p>
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-5xl font-black text-white">3€</span>
                        <span className="text-xl text-slate-400">/kg</span>
                      </div>
                      <p className="text-slate-400 text-xs mt-1">Collecte & livraison incluses</p>
                      <Link 
                        to="/new-order" 
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-bold mt-4 hover:shadow-lg transition-all hover:scale-105 text-sm"
                      >
                        Essayer maintenant
                        <Zap size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-white">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl font-black text-center mb-12">{t('pricing.faq.title')}</h2>

            <div className="space-y-4">
              <details className="bg-slate-50 p-6 rounded-2xl group cursor-pointer">
                <summary className="font-bold flex justify-between items-center list-none">
                  {t('pricing.faq.weight.q')}
                  <span className="group-open:rotate-180 transition text-teal-500">▼</span>
                </summary>
                <p className="mt-4 text-slate-600">
                  {t('pricing.faq.weight.a')}
                </p>
              </details>

              <details className="bg-slate-50 p-6 rounded-2xl group cursor-pointer">
                <summary className="font-bold flex justify-between items-center list-none">
                  {t('pricing.faq.minimum.q')}
                  <span className="group-open:rotate-180 transition text-teal-500">▼</span>
                </summary>
                <p className="mt-4 text-slate-600">
                  {t('pricing.faq.minimum.a')}
                </p>
              </details>

              <details className="bg-slate-50 p-6 rounded-2xl group cursor-pointer">
                <summary className="font-bold flex justify-between items-center list-none">
                  {t('pricing.faq.difference.q')}
                  <span className="group-open:rotate-180 transition text-teal-500">▼</span>
                </summary>
                <p className="mt-4 text-slate-600">
                  {t('pricing.faq.difference.a')}
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