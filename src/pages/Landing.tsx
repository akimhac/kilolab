import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { TrustBadges } from "../components/SocialProof";
import {
  ArrowRight, CheckCircle, Clock, Sparkles, AlertCircle, TrendingUp, Shield, Star, Play,
} from "lucide-react";
import { useEffect, useMemo, useState, useRef, ReactNode } from "react";
import HowItWorks from "../components/HowItWorks";

function AnimateOnScroll({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'none' : 'translateY(30px)', transition: `opacity 0.6s ease-out ${delay}ms, transform 0.6s ease-out ${delay}ms` }}>
      {children}
    </div>
  );
}

export default function Landing() {
  const { t } = useTranslation();
  const [weight, setWeight] = useState(5);
  const [reduceMotion, setReduceMotion] = useState(false);

  const HERO_VIDEO_MP4 = "https://videos.pexels.com/video-files/3205636/3205636-hd_1920_1080_25fps.mp4";
  const HERO_POSTER = "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?q=80&w=2400&auto=format&fit=crop";

  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(!!mq?.matches);
    update();
    mq?.addEventListener?.("change", update);
    return () => mq?.removeEventListener?.("change", update);
  }, []);

  const diyWater = 1.8, diyElectricity = 0.9, diyDetergent = 1.2, diySoftener = 0.6, diyMachineWear = 0.8, diyDryer = 1.5;
  const diyMaterialTotal = diyWater + diyElectricity + diyDetergent + diySoftener + diyMachineWear + diyDryer;
  const diyTimeHours = 2.5, hourlyRate = 12;
  const diyTimeCost = diyTimeHours * hourlyRate;
  const diyTotalCost = diyMaterialTotal + diyTimeCost;
  const kilolabPrice = weight * 3;
  const timeSaved = diyTimeHours;
  const savings = (diyTotalCost - kilolabPrice).toFixed(0);

  return (
    <>
      <Helmet>
        <title>Kilolab France - Le 1er Service de Laverie a Domicile</title>
        <meta name="description" content="Kilolab connecte vos paniers de linge a des machines disponibles partout en France. Collecte, lavage et pliage des 3eur/kg." />
        <link rel="canonical" href="https://kilolab.fr" />
        <link rel="preconnect" href="https://videos.pexels.com" crossOrigin="" />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="" />
      </Helmet>

      <div className="min-h-screen bg-white font-body text-slate-900">
        <Navbar />

        {/* HERO */}
        <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            {!reduceMotion ? (
              <video autoPlay loop muted playsInline preload="auto" poster={HERO_POSTER} className="absolute inset-0 w-full h-full object-cover scale-105">
                <source src={HERO_VIDEO_MP4} type="video/mp4" />
              </video>
            ) : (
              <img src={HERO_POSTER} alt="Linge propre et plie" className="absolute inset-0 w-full h-full object-cover" loading="eager" />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/50 to-slate-900/90" />
          </div>

          <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
            <div className="max-w-4xl mx-auto text-center">
              <div data-testid="trust-badge" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-xl text-white rounded-full text-sm font-medium border border-white/20 mb-10 animate-fade-in">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-400"></span>
                </span>
                {t('hero.badge')}
              </div>

              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-white mb-8 leading-[0.95] tracking-tight animate-slide-up">
                {t('hero.title1')}<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-cyan-300 to-teal-300">{t('hero.title2')}</span>
              </h1>

              <p className="text-lg md:text-2xl text-white/90 max-w-2xl mx-auto mb-6 leading-relaxed font-light animate-slide-up" style={{ animationDelay: '100ms' }}>
                {t('hero.subtitle')}<br className="hidden sm:block" />{t('hero.subtitle2')}
              </p>

              <div className="inline-flex items-center gap-3 mb-12 animate-slide-up" style={{ animationDelay: '200ms' }}>
                <span className="text-4xl md:text-5xl font-heading font-bold text-white">{t('hero.price')}</span>
                <span className="text-xl text-white/70">{t('hero.priceUnit')}</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-slide-up" style={{ animationDelay: '300ms' }}>
                <Link to="/new-order" data-testid="cta-primary"
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-teal-500 hover:bg-teal-400 text-white rounded-full font-semibold text-lg transition-all duration-300 shadow-[0_0_40px_rgba(20,184,166,0.4)] hover:shadow-[0_0_60px_rgba(20,184,166,0.5)] hover:scale-[1.02] active:scale-[0.98]">
                  {t('hero.cta')}
                  <ArrowRight className="group-hover:translate-x-1 transition-transform duration-300" size={20} />
                </Link>
                <a href="#comment-ca-marche" data-testid="cta-secondary"
                  onClick={(e) => { e.preventDefault(); document.getElementById("comment-ca-marche")?.scrollIntoView({ behavior: "smooth", block: "start" }); }}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-xl text-white border border-white/30 rounded-full font-semibold text-lg hover:bg-white hover:text-slate-900 transition-all duration-300 cursor-pointer">
                  <Play size={18} className="fill-current" /> {t('hero.ctaSecondary')}
                </a>
              </div>

              <div className="flex flex-wrap justify-center items-center gap-4 text-white/80 text-sm animate-fade-in" style={{ animationDelay: '400ms' }}>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
                  <Shield size={16} className="text-teal-400" /><span>{t('hero.trustSecure')}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
                  <Clock size={16} className="text-teal-400" /><span>{t('hero.trustDelivery')}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
                  <Star size={16} className="text-yellow-400 fill-yellow-400" /><span>{t('hero.trustRating')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
              <div className="w-1.5 h-3 bg-white/50 rounded-full animate-pulse" />
            </div>
          </div>
        </section>

        {/* WASHER RECRUITMENT BANNER */}
        <section className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 py-6">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 relative">
            <div className="flex items-center gap-4 text-white">
              <div className="hidden sm:flex items-center justify-center w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="text-lg font-heading font-semibold">{t('washerBanner.title')}</p>
                <p className="text-sm text-slate-400">{t('washerBanner.subtitle')} <span className="text-teal-400 font-semibold">{t('washerBanner.amount')}</span></p>
              </div>
            </div>
            <Link to="/become-washer" data-testid="washer-cta"
              className="px-6 py-3 bg-white text-slate-900 rounded-full font-semibold text-sm hover:bg-teal-50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap">
              {t('washerBanner.cta')} <ArrowRight className="inline ml-2" size={16} />
            </Link>
          </div>
        </section>

        {/* SOCIAL PROOF */}
        <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimateOnScroll>
              <div className="text-center mb-16">
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-900 mb-4">{t('socialProof.title')}</h2>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">{t('socialProof.subtitle')}</p>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={100}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                {[
                  { value: '1850+', label: t('socialProof.clients'), color: 'text-teal-600', glow: 'from-teal-500 to-cyan-500' },
                  { value: '4.9/5', label: t('socialProof.rating'), color: 'text-purple-600', glow: 'from-purple-500 to-pink-500' },
                  { value: '500+', label: t('socialProof.washers'), color: 'text-orange-600', glow: 'from-orange-500 to-red-500' },
                  { value: '45+', label: t('socialProof.cities'), color: 'text-blue-600', glow: 'from-blue-500 to-indigo-500' },
                ].map((stat, i) => (
                  <div key={i} className="relative group">
                    <div className={`absolute inset-0 bg-gradient-to-r ${stat.glow} rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity`} />
                    <div className="relative bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg transition-all text-center">
                      <p className={`text-4xl md:text-5xl font-black ${stat.color} mb-1`}>{stat.value}</p>
                      <p className="text-sm text-slate-600 font-medium">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={200}>
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 md:p-12 text-white mb-16 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
                <h3 className="font-heading text-2xl md:text-3xl font-bold text-center mb-8 relative">{t('socialProof.guaranteesTitle')}</h3>
                <div className="grid md:grid-cols-3 gap-6 relative">
                  {[
                    { icon: <Shield size={28} />, title: t('socialProof.guarantee1Title'), desc: t('socialProof.guarantee1Desc'), bg: 'bg-teal-500' },
                    { icon: <CheckCircle size={28} />, title: t('socialProof.guarantee2Title'), desc: t('socialProof.guarantee2Desc'), bg: 'bg-purple-500' },
                    { icon: <Clock size={28} />, title: t('socialProof.guarantee3Title'), desc: t('socialProof.guarantee3Desc'), bg: 'bg-orange-500' },
                  ].map((g, i) => (
                    <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/15 transition-all">
                      <div className={`w-14 h-14 ${g.bg} rounded-2xl flex items-center justify-center mb-4 text-white`}>{g.icon}</div>
                      <h4 className="font-bold text-lg mb-2">{g.title}</h4>
                      <p className="text-slate-300 text-sm">{g.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={300}>
              <TrustBadges />
            </AnimateOnScroll>
          </div>
        </section>

        {/* COST COMPARISON */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimateOnScroll>
              <div className="text-center mb-16">
                <span className="inline-block px-4 py-1.5 bg-red-100 text-red-700 rounded-full text-sm font-semibold mb-4">{t('costComparison.badge')}</span>
                <h2 className="font-heading text-3xl md:text-5xl font-bold text-slate-900 mb-6">{t('costComparison.title')}</h2>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                  {t('costComparison.subtitle')}<br className="hidden sm:block" />
                  <strong>{t('costComparison.subtitleBold')}</strong>
                </p>
              </div>
            </AnimateOnScroll>

            <div className="max-w-5xl mx-auto">
              <AnimateOnScroll delay={100}>
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 md:p-8 mb-8 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-medium">{t('costComparison.sliderLabel')}</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-teal-400">{weight}</span>
                      <span className="text-slate-400">kg</span>
                    </div>
                  </div>
                  <input type="range" min="3" max="15" step="1" value={weight} onChange={(e) => setWeight(parseInt(e.target.value, 10))}
                    data-testid="weight-slider"
                    className="w-full h-3 bg-slate-700 rounded-full appearance-none cursor-pointer accent-teal-500 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-teal-500 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-grab" />
                  <div className="flex justify-between text-xs text-slate-500 mt-2">
                    <span>{t('costComparison.sliderMin')}</span>
                    <span>{t('costComparison.sliderMax')}</span>
                  </div>
                </div>
              </AnimateOnScroll>

              <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                {/* DIY */}
                <AnimateOnScroll delay={150}>
                  <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl p-6 md:p-8 border-2 border-red-200 relative overflow-hidden h-full">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-200/50 rounded-full blur-3xl" />
                    <div className="relative">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
                          <AlertCircle className="text-red-600" size={24} />
                        </div>
                        <div>
                          <h3 className="font-heading text-xl font-bold text-slate-900">{t('costComparison.diyTitle')}</h3>
                          <p className="text-sm text-red-600 font-medium">{t('costComparison.diySubtitle')}</p>
                        </div>
                      </div>
                      <div className="space-y-2 mb-6">
                        {[
                          { label: t('costComparison.diyWater'), val: diyWater },
                          { label: t('costComparison.diyElectricity'), val: diyElectricity },
                          { label: t('costComparison.diyDetergent'), val: diyDetergent + diySoftener },
                          { label: t('costComparison.diyMachine'), val: diyMachineWear + diyDryer },
                        ].map((item, i) => (
                          <div key={i} className="flex justify-between items-center p-3 bg-white/80 rounded-xl text-sm">
                            <span className="text-slate-600">{item.label}</span>
                            <span className="font-bold text-slate-900">{item.val.toFixed(2)}&euro;</span>
                          </div>
                        ))}
                      </div>
                      <div className="bg-orange-100 border border-orange-200 p-4 rounded-xl mb-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-orange-800 font-medium">{t('costComparison.diyTimeLabel')} {diyTimeHours}h</p>
                            <p className="text-xs text-orange-600">{t('costComparison.diyTimeDesc')}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-black text-orange-700">{diyTimeCost}&euro;</p>
                            <p className="text-xs text-orange-600">({hourlyRate}&euro;/h)</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-red-500 to-orange-500 p-5 rounded-2xl text-white">
                        <div className="flex justify-between items-center mb-2 text-sm opacity-90">
                          <span>{t('costComparison.diyMaterialCosts')}</span><span>{diyMaterialTotal.toFixed(2)}&euro;</span>
                        </div>
                        <div className="flex justify-between items-center pb-3 border-b border-white/30 text-sm opacity-90">
                          <span>{t('costComparison.diyTimeValue')}</span><span>{diyTimeCost.toFixed(2)}&euro;</span>
                        </div>
                        <div className="flex justify-between items-center pt-3">
                          <span className="font-bold">{t('costComparison.diyRealCost')}</span>
                          <span className="text-4xl font-black">{diyTotalCost.toFixed(0)}&euro;</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimateOnScroll>

                {/* Kilolab */}
                <AnimateOnScroll delay={200}>
                  <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-3xl p-6 md:p-8 border-2 border-teal-400 relative overflow-hidden h-full">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-teal-200/50 rounded-full blur-3xl" />
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-slate-900 px-4 py-1.5 rounded-full text-xs font-black shadow-lg">
                      {t('costComparison.kilolabSave')}
                    </div>
                    <div className="relative">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-teal-100 rounded-2xl flex items-center justify-center">
                          <Sparkles className="text-teal-600" size={24} />
                        </div>
                        <div>
                          <h3 className="font-heading text-xl font-bold text-slate-900">{t('costComparison.kilolabTitle')}</h3>
                          <p className="text-sm text-teal-600 font-medium">{t('costComparison.kilolabSubtitle')}</p>
                        </div>
                      </div>
                      <div className="space-y-2 mb-6">
                        {[t('costComparison.kilolabFeature1'), t('costComparison.kilolabFeature2'), t('costComparison.kilolabFeature3'), t('costComparison.kilolabFeature4')].map((feature, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-teal-100">
                            <div className="w-7 h-7 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <CheckCircle size={14} className="text-white" />
                            </div>
                            <span className="text-sm font-medium text-slate-900">{feature}</span>
                          </div>
                        ))}
                      </div>
                      <div className="bg-teal-100 border border-teal-200 p-4 rounded-xl mb-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-teal-800 font-medium">{t('costComparison.kilolabTimeLabel')}</p>
                            <p className="text-xs text-teal-600">{t('costComparison.kilolabTimeDesc')}</p>
                          </div>
                          <div className="text-right"><p className="text-2xl font-black text-teal-700">0&euro;</p></div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-5 rounded-2xl text-white mb-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium text-sm opacity-90">{weight}kg x 3&euro;/kg</span>
                            <p className="font-bold mt-1">{t('costComparison.kilolabPrice')}</p>
                          </div>
                          <span className="text-4xl font-black">{kilolabPrice}&euro;</span>
                        </div>
                      </div>
                      <div className="bg-white p-5 rounded-2xl border-2 border-teal-300 shadow-lg">
                        <p className="text-teal-600 font-bold text-sm text-center mb-3">{t('costComparison.savingsTitle')}</p>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center bg-teal-50 rounded-xl p-3">
                            <p className="text-3xl font-black text-teal-600">{savings}&euro;</p>
                            <p className="text-xs text-slate-600 font-medium">{t('costComparison.savingsAmount')}</p>
                          </div>
                          <div className="text-center bg-teal-50 rounded-xl p-3">
                            <p className="text-3xl font-black text-teal-600">{timeSaved}h</p>
                            <p className="text-xs text-slate-600 font-medium">{t('costComparison.savingsTime')}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimateOnScroll>
              </div>

              <AnimateOnScroll delay={300}>
                <div className="mt-12 text-center">
                  <Link to="/new-order" data-testid="choose-kilolab-btn"
                    className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-2xl font-bold text-lg hover:shadow-2xl transition-all hover:scale-105 active:scale-95">
                    <span>{t('costComparison.ctaSave', { amount: savings })}</span>
                    <ArrowRight size={20} />
                  </Link>
                  <p className="text-sm text-slate-500 mt-4">{t('costComparison.ctaPromo')}</p>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        <HowItWorks />

        {/* OUR STORY */}
        <section className="bg-white py-24 px-4 overflow-hidden border-t border-slate-100">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
              <AnimateOnScroll>
                <div className="relative">
                  <div className="grid grid-cols-2 gap-4 relative">
                    <img src="https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&auto=format&fit=crop" alt="Inspiration Bali"
                      className="rounded-2xl shadow-soft transform -rotate-2 hover:rotate-0 transition-transform duration-500" loading="lazy" />
                    <img src="https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?w=800&auto=format&fit=crop" alt="Linge propre"
                      className="rounded-2xl shadow-soft transform rotate-2 hover:rotate-0 transition-transform duration-500 mt-12" loading="lazy" />
                  </div>
                  <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-teal-100/50 to-cyan-100/50 rounded-full blur-3xl" />
                </div>
              </AnimateOnScroll>

              <AnimateOnScroll delay={200}>
                <div>
                  <span className="inline-block px-4 py-1.5 bg-teal-50 text-teal-700 rounded-full text-sm font-semibold mb-6 border border-teal-100">{t('story.badge')}</span>
                  <h2 className="font-heading text-3xl md:text-5xl font-bold text-slate-900 mb-8 leading-tight">
                    {t('story.title')}<br />{t('story.title2')}
                  </h2>
                  <p className="text-slate-600 text-lg leading-relaxed mb-8">{t('story.description')}</p>
                  <blockquote className="bg-slate-50 p-6 rounded-2xl border-l-4 border-teal-500 mb-8">
                    <p className="text-slate-700 font-medium italic">"{t('story.quote')}"</p>
                  </blockquote>
                  <Link to="/become-washer" className="inline-flex items-center gap-2 text-slate-900 font-semibold hover:text-teal-600 transition-colors group">
                    {t('story.cta')}
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                  </Link>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
          <AnimateOnScroll className="max-w-4xl mx-auto px-4 text-center relative">
            <h2 className="font-heading text-4xl md:text-6xl font-bold mb-6">{t('finalCta.title')}</h2>
            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">{t('finalCta.subtitle')}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/new-order" data-testid="final-cta-order"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-900 rounded-full font-semibold text-lg hover:bg-teal-50 transition-all duration-300 shadow-soft hover:shadow-lg">
                {t('finalCta.orderCta')} <ArrowRight size={20} />
              </Link>
              <Link to="/become-washer" data-testid="final-cta-washer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-full font-semibold text-lg hover:bg-white/20 transition-all duration-300 border border-white/20 hover:scale-[1.02] active:scale-[0.98]">
                {t('finalCta.washerCta')} <TrendingUp size={20} />
              </Link>
            </div>
          </AnimateOnScroll>
        </section>

        <Footer />
      </div>
    </>
  );
}
