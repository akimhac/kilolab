import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { TrustBadges } from "../components/SocialProof";
import {
  ArrowRight, CheckCircle, Clock, Sparkles, AlertCircle, TrendingUp, Shield, Star, Play, Heart, Check,
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
  const [reduceMotion, setReduceMotion] = useState(false);

  const HERO_VIDEO_MP4 = "https://cdn.coverr.co/videos/coverr-clothes-being-washed-in-a-laundry-machine-1674/1080p.mp4";
  const HERO_POSTER = "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?q=80&w=2400&auto=format&fit=crop";

  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(!!mq?.matches);
    update();
    mq?.addEventListener?.("change", update);
    return () => mq?.removeEventListener?.("change", update);
  }, []);

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

        {/* BENEFITS SECTION */}
        <section className="py-24 bg-white">

          {/* ═══ EMBEDDED VIDEO ═══ */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-24">
            <AnimateOnScroll className="text-center mb-10">
              <span className="inline-block px-4 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-4">En 60 secondes</span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-900 mb-4">Découvrez Kilolab en vidéo</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">Comment ça marche, du canapé à la livraison.</p>
            </AnimateOnScroll>
            <AnimateOnScroll delay={150}>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 aspect-video bg-slate-900">
                <video 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  className="absolute inset-0 w-full h-full object-cover"
                  poster="https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?q=80&w=2400&auto=format&fit=crop"
                >
                  <source src="https://videos.pexels.com/video-files/5591209/5591209-hd_1920_1080_30fps.mp4" type="video/mp4" />
                </video>
                {/* Overlay with play indicator */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <Play size={20} className="text-white fill-white ml-1" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">Votre linge, notre priorité</p>
                      <p className="text-white/70 text-xs">Collecte • Lavage • Livraison</p>
                    </div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                    <p className="text-white text-sm font-semibold">Dès 3€/kg</p>
                  </div>
                </div>
              </div>
          </AnimateOnScroll>
          </div>

          {/* ═══ BENEFITS SECTION - MODERN STARTUP STYLE ═══ */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
            <AnimateOnScroll>
              <div className="text-center mb-16">
                <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-700 rounded-full text-sm font-semibold mb-4">
                  Ce que vous gagnez
                </span>
                <h2 className="font-heading text-3xl md:text-5xl font-bold text-slate-900 mb-6">
                  Reprenez le contrôle<br className="hidden sm:block" />
                  <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">de votre temps</span>
                </h2>
              </div>
            </AnimateOnScroll>

            {/* Benefits Cards Grid */}
            <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-16">
              {/* Card 1 - Fini les corvées */}
              <AnimateOnScroll delay={100}>
                <div className="group relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 overflow-hidden hover:scale-[1.02] transition-all duration-300">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/20 rounded-full blur-3xl group-hover:bg-teal-500/30 transition-colors" />
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-teal-500/30">
                      <CheckCircle className="text-white" size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Fini les corvées</h3>
                    <p className="text-slate-400 leading-relaxed">
                      Plus jamais de tri, de machine à lancer, de séchage à surveiller. 
                      On s'occupe de tout, vous profitez du résultat.
                    </p>
                    <div className="mt-6 pt-6 border-t border-white/10">
                      <p className="text-teal-400 font-semibold text-sm flex items-center gap-2">
                        <Sparkles size={16} />
                        2h30 économisées par semaine
                      </p>
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>

              {/* Card 2 - Temps en famille */}
              <AnimateOnScroll delay={200}>
                <div className="group relative bg-gradient-to-br from-purple-600 to-violet-700 rounded-3xl p-8 overflow-hidden hover:scale-[1.02] transition-all duration-300">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors" />
                  <div className="relative">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
                      <Heart className="text-white" size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Plus de temps libre</h3>
                    <p className="text-purple-100 leading-relaxed">
                      Des moments précieux avec votre famille, vos amis, ou simplement pour vous.
                      Le temps que vous méritez.
                    </p>
                    <div className="mt-6 pt-6 border-t border-white/20">
                      <p className="text-white font-semibold text-sm flex items-center gap-2">
                        <Clock size={16} />
                        Livré sous 48h max
                      </p>
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>

              {/* Card 3 - Sérénité */}
              <AnimateOnScroll delay={300}>
                <div className="group relative bg-gradient-to-br from-teal-500 to-cyan-600 rounded-3xl p-8 overflow-hidden hover:scale-[1.02] transition-all duration-300">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors" />
                  <div className="relative">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
                      <Shield className="text-white" size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">L'esprit tranquille</h3>
                    <p className="text-teal-50 leading-relaxed">
                      Lessive professionnelle, pliage soigné, vêtements traités avec soin.
                      Qualité garantie à chaque fois.
                    </p>
                    <div className="mt-6 pt-6 border-t border-white/20">
                      <p className="text-white font-semibold text-sm flex items-center gap-2">
                        <Star size={16} />
                        98% de clients satisfaits
                      </p>
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>
            </div>

            {/* Big Value Proposition */}
            <AnimateOnScroll delay={400}>
              <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-[2rem] p-8 md:p-12 overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
                
                <div className="relative grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                      Idéal pour vous si...
                    </h3>
                    <ul className="space-y-4">
                      {[
                        "Vous travaillez beaucoup et manquez de temps",
                        "Vous avez une famille et des journées chargées", 
                        "Vous préférez profiter de la vie plutôt que des corvées",
                        "Vous aimez avoir du linge frais sans effort"
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check size={14} className="text-white" />
                          </div>
                          <span className="text-slate-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="text-center md:text-right">
                    <div className="inline-block bg-gradient-to-br from-teal-500/20 to-cyan-500/20 backdrop-blur-sm rounded-3xl p-8 border border-teal-500/30">
                      <p className="text-teal-400 font-semibold mb-2">À partir de</p>
                      <div className="flex items-baseline justify-center md:justify-end gap-1">
                        <span className="text-6xl font-black text-white">3€</span>
                        <span className="text-2xl text-slate-400">/kg</span>
                      </div>
                      <p className="text-slate-400 text-sm mt-2">Collecte & livraison incluses</p>
                      <Link 
                        to="/new-order" 
                        data-testid="choose-kilolab-btn"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-bold mt-6 hover:shadow-xl hover:shadow-teal-500/30 transition-all hover:scale-105"
                      >
                        Essayer maintenant
                        <ArrowRight size={18} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
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
