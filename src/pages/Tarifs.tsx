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

        {/* COMPARATIF */}
        <section className="py-20 bg-slate-50 border-y border-slate-200">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-full text-sm font-bold mb-4">
                <AlertCircle size={16} />
                {t('pricing.comparison.badge')}
              </div>
              <h2 className="text-3xl md:text-4xl font-black mb-4">{t('pricing.comparison.title')}</h2>
              <p className="text-slate-600 text-lg">{t('pricing.comparison.subtitle')}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-stretch">
              {/* COÛT RÉEL - DIY */}
              <AnimateOnScroll delay={0}>
                <div className="bg-gradient-to-br from-red-50 to-orange-50 p-8 rounded-3xl border-2 border-red-200 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                      <X size={24} className="text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-red-700">{t('pricing.comparison.diy.title')}</h3>
                      <p className="text-sm text-red-500">{t('pricing.comparison.diy.subtitle')}</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6 flex-1">
                    <div className="flex justify-between items-center p-3 bg-white/80 rounded-xl">
                      <span className="text-slate-700">{t('pricing.comparison.diy.waterElec')}</span>
                      <span className="font-bold text-slate-900">2.70€</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/80 rounded-xl">
                      <span className="text-slate-700">{t('pricing.comparison.diy.detergent')}</span>
                      <span className="font-bold text-slate-900">1.80€</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/80 rounded-xl">
                      <span className="text-slate-700">{t('pricing.comparison.diy.machine')}</span>
                      <span className="font-bold text-slate-900">2.30€</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-orange-100 rounded-xl border border-orange-200">
                      <div className="flex items-center gap-2">
                        <Clock size={18} className="text-orange-600" />
                        <span className="text-orange-800 font-medium">{t('pricing.comparison.diy.timeLabel')}</span>
                      </div>
                      <span className="font-bold text-orange-700">30€*</span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-5 rounded-2xl">
                    <div className="flex justify-between items-center mb-2 text-sm opacity-90">
                      <span>{t('pricing.comparison.diy.materialCost')}</span>
                      <span>~7€</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-white/30 text-sm opacity-90">
                      <span>{t('pricing.comparison.diy.timeCost')}</span>
                      <span>~30€</span>
                    </div>
                    <div className="flex justify-between items-center pt-3">
                      <span className="font-bold text-lg">{t('pricing.comparison.diy.totalCost')}</span>
                      <span className="font-black text-4xl">~37€</span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-slate-500 mt-3 text-center">{t('pricing.comparison.diy.note')}</p>
                </div>
              </AnimateOnScroll>

              {/* KILOLAB */}
              <AnimateOnScroll delay={150}>
                <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-8 rounded-3xl border-2 border-teal-400 shadow-xl relative h-full flex flex-col">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-400 text-slate-900 px-5 py-1.5 rounded-full text-sm font-black shadow-lg">
                    {t('pricing.comparison.kilolab.badge')}
                  </div>

                  <div className="flex items-center gap-3 mb-6 mt-4">
                    <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                      <Check size={24} className="text-teal-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-teal-700">{t('pricing.comparison.kilolab.title')}</h3>
                      <p className="text-sm text-teal-500">{t('pricing.comparison.kilolab.subtitle')}</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6 flex-1">
                    <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-teal-100">
                      <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check size={16} className="text-white" />
                      </div>
                      <span className="font-medium text-slate-900">{t('pricing.comparison.kilolab.pickup')}</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-teal-100">
                      <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check size={16} className="text-white" />
                      </div>
                      <span className="font-medium text-slate-900">{t('pricing.comparison.kilolab.washing')}</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-teal-100">
                      <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check size={16} className="text-white" />
                      </div>
                      <span className="font-medium text-slate-900">{t('pricing.comparison.kilolab.delivery')}</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-teal-100 rounded-xl border border-teal-200">
                      <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Clock size={16} className="text-white" />
                      </div>
                      <span className="font-bold text-teal-800">{t('pricing.comparison.kilolab.time')}</span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white p-5 rounded-2xl mb-4">
                    <div className="text-center">
                      <p className="text-sm opacity-90 mb-1">5kg × 3€/kg</p>
                      <p className="font-black text-5xl">15€</p>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border-2 border-teal-300">
                    <div className="text-center">
                      <p className="text-teal-600 font-bold text-sm uppercase tracking-wide mb-2">{t('pricing.comparison.savings.title')}</p>
                      <div className="flex justify-center items-center gap-4">
                        <div className="text-center">
                          <p className="text-3xl font-black text-slate-900">22€</p>
                          <p className="text-xs text-slate-500">{t('pricing.comparison.savings.money')}</p>
                        </div>
                        <div className="text-2xl text-slate-300">+</div>
                        <div className="text-center">
                          <p className="text-3xl font-black text-slate-900">2h30</p>
                          <p className="text-xs text-slate-500">{t('pricing.comparison.savings.time')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>
            </div>

            {/* HIGHLIGHT BOX */}
            <AnimateOnScroll delay={300}>
              <div className="mt-12 text-center">
                <div className="inline-block bg-gradient-to-r from-slate-900 to-slate-800 text-white p-8 rounded-3xl max-w-3xl shadow-2xl">
                  <h3 className="text-2xl md:text-3xl font-black mb-4">
                    {t('pricing.comparison.ctaTitle')}
                  </h3>
                  <p className="text-slate-300 text-lg mb-6">
                    {t('pricing.comparison.ctaDesc')}
                  </p>
                  <Link
                    to="/new-order"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-teal-500 text-white font-bold rounded-full hover:bg-teal-400 transition-all hover:scale-105 active:scale-95 shadow-lg"
                  >
                    {t('pricing.comparison.ctaButton')}
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