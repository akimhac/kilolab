import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { LiveStats, LiveReviews, TrustBadges } from "../components/SocialProof";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Sparkles,
  Zap,
  Droplet,
  AlertCircle,
  TrendingUp,
  Shield,
  Star,
  Play,
} from "lucide-react";
import { useEffect, useMemo, useState, useRef, ReactNode } from "react";
import HowItWorks from "../components/HowItWorks";

// Simple animation component
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

export default function Landing() {
  const [weight, setWeight] = useState(5);
  const [reduceMotion, setReduceMotion] = useState(false);

  const HERO_VIDEO_MP4 =
    "https://videos.pexels.com/video-files/3205636/3205636-hd_1920_1080_25fps.mp4";
  const HERO_POSTER =
    "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?q=80&w=2400&auto=format&fit=crop";

  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(!!mq?.matches);
    update();
    mq?.addEventListener?.("change", update);
    return () => mq?.removeEventListener?.("change", update);
  }, []);

  // DIY costs
  const diyWater = 1.8;
  const diyElectricity = 0.9;
  const diyDetergent = 1.2;
  const diySoftener = 0.6;
  const diyMachineWear = 0.8;
  const diyDryer = 1.5;
  const diyMaterialTotal = diyWater + diyElectricity + diyDetergent + diySoftener + diyMachineWear + diyDryer;
  const diyTimeHours = 2.5;
  const hourlyRate = 12;
  const diyTimeCost = diyTimeHours * hourlyRate;
  const diyTotalCost = diyMaterialTotal + diyTimeCost;
  const kilolabPrice = weight * 3;
  const timeSaved = diyTimeHours;

  const paidToDoNothing = useMemo(() => {
    return (diyTimeCost - (kilolabPrice - diyMaterialTotal)).toFixed(0);
  }, [diyTimeCost, kilolabPrice, diyMaterialTotal]);

  return (
    <>
      <Helmet>
        <title>Kilolab France - Le 1er Service de Laverie à Domicile</title>
        <meta
          name="description"
          content="Kilolab connecte vos paniers de linge à des machines disponibles partout en France. Collecte, lavage et pliage dès 3€/kg."
        />
        <link rel="canonical" href="https://kilolab.fr" />
        <link rel="preconnect" href="https://videos.pexels.com" crossOrigin="" />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="" />
        <link rel="preload" as="image" href={HERO_POSTER} />
        <link rel="preload" as="video" href={HERO_VIDEO_MP4} type="video/mp4" />
      </Helmet>

      <div className="min-h-screen bg-white font-body text-slate-900">
        <Navbar />

        {/* HERO - UBER/AIRBNB STYLE */}
        <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
          {/* Video Background */}
          <div className="absolute inset-0">
            {!reduceMotion ? (
              <video
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                poster={HERO_POSTER}
                className="absolute inset-0 w-full h-full object-cover scale-105"
              >
                <source src={HERO_VIDEO_MP4} type="video/mp4" />
              </video>
            ) : (
              <img
                src={HERO_POSTER}
                alt="Linge propre et plié"
                className="absolute inset-0 w-full h-full object-cover"
                loading="eager"
              />
            )}
            {/* Premium gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/50 to-slate-900/90" />
          </div>

          {/* Content */}
          <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
            <div className="max-w-4xl mx-auto text-center">
              {/* Trust badge */}
              <div 
                data-testid="trust-badge"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-xl text-white rounded-full text-sm font-medium border border-white/20 mb-10 animate-fade-in"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-400"></span>
                </span>
                Disponible partout en France
              </div>

              {/* Main headline */}
              <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-[0.95] tracking-tight animate-slide-up">
                Libérez votre temps.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-cyan-300 to-teal-300">
                  On prend soin de votre linge.
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mb-6 leading-relaxed font-light animate-slide-up" style={{ animationDelay: '100ms' }}>
                Collecte, lavage et pliage inclus.
                <br className="hidden sm:block" />
                Simple, rapide et partout en France.
              </p>

              {/* Price highlight */}
              <div className="inline-flex items-center gap-3 mb-12 animate-slide-up" style={{ animationDelay: '200ms' }}>
                <span className="text-4xl md:text-5xl font-heading font-bold text-white">Dès 3€</span>
                <span className="text-xl text-white/70">/kg</span>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-slide-up" style={{ animationDelay: '300ms' }}>
                <Link
                  to="/new-order"
                  data-testid="cta-primary"
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-teal-500 hover:bg-teal-400 text-white rounded-full font-semibold text-lg transition-all duration-300 shadow-[0_0_40px_rgba(20,184,166,0.4)] hover:shadow-[0_0_60px_rgba(20,184,166,0.5)] hover:scale-[1.02] active:scale-[0.98]"
                >
                  Confier mon linge
                  <ArrowRight className="group-hover:translate-x-1 transition-transform duration-300" size={20} />
                </Link>

                <a
                  href="#comment-ca-marche"
                  data-testid="cta-secondary"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("comment-ca-marche")?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-xl text-white border border-white/30 rounded-full font-semibold text-lg hover:bg-white hover:text-slate-900 transition-all duration-300 cursor-pointer"
                >
                  <Play size={18} className="fill-current" />
                  Comment ça marche ?
                </a>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap justify-center items-center gap-4 text-white/80 text-sm animate-fade-in" style={{ animationDelay: '400ms' }}>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
                  <Shield size={16} className="text-teal-400" />
                  <span>Paiement sécurisé</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
                  <Clock size={16} className="text-teal-400" />
                  <span>Livraison 48h</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
                  <Star size={16} className="text-yellow-400 fill-yellow-400" />
                  <span>4.9/5 (500+ avis)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
              <div className="w-1.5 h-3 bg-white/50 rounded-full animate-pulse" />
            </div>
          </div>
        </section>

        {/* WASHER RECRUITMENT BANNER - Sleeker */}
        <section className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 py-6">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 relative">
            <div className="flex items-center gap-4 text-white">
              <div className="hidden sm:flex items-center justify-center w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="text-lg font-heading font-semibold">Vous avez une machine à laver ?</p>
                <p className="text-sm text-slate-400">Rejoignez 500+ Washers et gagnez jusqu'à <span className="text-teal-400 font-semibold">600€/mois</span></p>
              </div>
            </div>
            <Link
              to="/become-washer"
              data-testid="washer-cta"
              className="px-6 py-3 bg-white text-slate-900 rounded-full font-semibold text-sm hover:bg-teal-50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
            >
              Devenir Washer Partenaire
              <ArrowRight className="inline ml-2" size={16} />
            </Link>
          </div>
        </section>

        {/* SOCIAL PROOF - Nouvelle section impactante */}
        <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimateOnScroll>
              <div className="text-center mb-16">
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                  La plateforme n°1 en France
                </h2>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                  Des milliers de clients nous font déjà confiance
                </p>
              </div>
            </AnimateOnScroll>

            {/* Stats redesignés - Plus impactant */}
            <AnimateOnScroll delay={100}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                  <div className="relative bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg transition-all text-center">
                    <p className="text-4xl md:text-5xl font-black text-teal-600 mb-1">1850+</p>
                    <p className="text-sm text-slate-600 font-medium">Clients satisfaits</p>
                  </div>
                </div>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                  <div className="relative bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg transition-all text-center">
                    <p className="text-4xl md:text-5xl font-black text-purple-600 mb-1">4.9<span className="text-2xl">/5</span></p>
                    <p className="text-sm text-slate-600 font-medium">Note moyenne</p>
                  </div>
                </div>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                  <div className="relative bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg transition-all text-center">
                    <p className="text-4xl md:text-5xl font-black text-orange-600 mb-1">500+</p>
                    <p className="text-sm text-slate-600 font-medium">Washers actifs</p>
                  </div>
                </div>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                  <div className="relative bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg transition-all text-center">
                    <p className="text-4xl md:text-5xl font-black text-blue-600 mb-1">45+</p>
                    <p className="text-sm text-slate-600 font-medium">Villes couvertes</p>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>

            {/* Garanties - Remplace "Ils parlent de nous" */}
            <AnimateOnScroll delay={200}>
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 md:p-12 text-white mb-16 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
                
                <h3 className="font-heading text-2xl md:text-3xl font-bold text-center mb-8 relative">
                  Nos engagements qualité
                </h3>
                
                <div className="grid md:grid-cols-3 gap-6 relative">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/15 transition-all">
                    <div className="w-14 h-14 bg-teal-500 rounded-2xl flex items-center justify-center mb-4">
                      <Shield size={28} className="text-white" />
                    </div>
                    <h4 className="font-bold text-lg mb-2">Satisfaction garantie</h4>
                    <p className="text-slate-300 text-sm">Pas satisfait ? On relave gratuitement ou on vous rembourse.</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/15 transition-all">
                    <div className="w-14 h-14 bg-purple-500 rounded-2xl flex items-center justify-center mb-4">
                      <CheckCircle size={28} className="text-white" />
                    </div>
                    <h4 className="font-bold text-lg mb-2">Washers vérifiés</h4>
                    <p className="text-slate-300 text-sm">Chaque Washer est vérifié et noté par la communauté.</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/15 transition-all">
                    <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center mb-4">
                      <Clock size={28} className="text-white" />
                    </div>
                    <h4 className="font-bold text-lg mb-2">Délais respectés</h4>
                    <p className="text-slate-300 text-sm">48h Standard, 24h Express. Retard ? -50% sur votre commande.</p>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>

            {/* Trust Badges */}
            <AnimateOnScroll delay={300}>
              <TrustBadges />
            </AnimateOnScroll>
          </div>
        </section>

        {/* COST COMPARISON - Focus sur l'ARGENT */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimateOnScroll>
              <div className="text-center mb-16">
                <span className="inline-block px-4 py-1.5 bg-red-100 text-red-700 rounded-full text-sm font-semibold mb-4">
                  Arrêtez de perdre de l'argent
                </span>
                <h2 className="font-heading text-3xl md:text-5xl font-bold text-slate-900 mb-6">
                  Combien vous coûte vraiment votre lessive ?
                </h2>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                  Eau, électricité, produits, usure machine... <br className="hidden sm:block" />
                  <strong>Le coût réel est bien plus élevé que vous ne le pensez.</strong>
                </p>
              </div>
            </AnimateOnScroll>

            <div className="max-w-5xl mx-auto">
              {/* Weight Slider - Plus visible */}
              <AnimateOnScroll delay={100}>
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 md:p-8 mb-8 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-medium">Votre volume de linge par semaine</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-teal-400">{weight}</span>
                      <span className="text-slate-400">kg</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="15"
                    step="1"
                    value={weight}
                    onChange={(e) => setWeight(parseInt(e.target.value, 10))}
                    data-testid="weight-slider"
                    className="w-full h-3 bg-slate-700 rounded-full appearance-none cursor-pointer accent-teal-500 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-teal-500 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-grab"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-2">
                    <span>3kg (1 personne)</span>
                    <span>15kg (famille)</span>
                  </div>
                </div>
              </AnimateOnScroll>

              {/* Comparaison Visuelle - Focus ARGENT */}
              <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                {/* Faire soi-même */}
                <AnimateOnScroll delay={150}>
                  <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl p-6 md:p-8 border-2 border-red-200 relative overflow-hidden h-full">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-200/50 rounded-full blur-3xl" />
                    
                    <div className="relative">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
                          <AlertCircle className="text-red-600" size={24} />
                        </div>
                        <div>
                          <h3 className="font-heading text-xl font-bold text-slate-900">Faire soi-même</h3>
                          <p className="text-sm text-red-600 font-medium">Le piège du "gratuit"</p>
                        </div>
                      </div>

                      {/* Coûts détaillés */}
                      <div className="space-y-2 mb-6">
                        <div className="flex justify-between items-center p-3 bg-white/80 rounded-xl text-sm">
                          <span className="text-slate-600">💧 Eau (60L/machine)</span>
                          <span className="font-bold text-slate-900">{diyWater.toFixed(2)}€</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white/80 rounded-xl text-sm">
                          <span className="text-slate-600">⚡ Électricité</span>
                          <span className="font-bold text-slate-900">{diyElectricity.toFixed(2)}€</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white/80 rounded-xl text-sm">
                          <span className="text-slate-600">🧴 Lessive + Adoucissant</span>
                          <span className="font-bold text-slate-900">{(diyDetergent + diySoftener).toFixed(2)}€</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white/80 rounded-xl text-sm">
                          <span className="text-slate-600">🔧 Usure machine + Séchage</span>
                          <span className="font-bold text-slate-900">{(diyMachineWear + diyDryer).toFixed(2)}€</span>
                        </div>
                      </div>

                      {/* Temps = Argent */}
                      <div className="bg-orange-100 border border-orange-200 p-4 rounded-xl mb-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-orange-800 font-medium">⏰ Temps perdu : {diyTimeHours}h</p>
                            <p className="text-xs text-orange-600">Tri + Lavage + Séchage + Pliage + Rangement</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-black text-orange-700">{diyTimeCost}€</p>
                            <p className="text-xs text-orange-600">({hourlyRate}€/h)</p>
                          </div>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="bg-gradient-to-r from-red-500 to-orange-500 p-5 rounded-2xl text-white">
                        <div className="flex justify-between items-center mb-2 text-sm opacity-90">
                          <span>Coûts matériels</span>
                          <span>{diyMaterialTotal.toFixed(2)}€</span>
                        </div>
                        <div className="flex justify-between items-center pb-3 border-b border-white/30 text-sm opacity-90">
                          <span>Valeur de votre temps</span>
                          <span>{diyTimeCost.toFixed(2)}€</span>
                        </div>
                        <div className="flex justify-between items-center pt-3">
                          <span className="font-bold">COÛT RÉEL</span>
                          <span className="text-4xl font-black">{diyTotalCost.toFixed(0)}€</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimateOnScroll>

                {/* Avec Kilolab */}
                <AnimateOnScroll delay={200}>
                  <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-3xl p-6 md:p-8 border-2 border-teal-400 relative overflow-hidden h-full">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-teal-200/50 rounded-full blur-3xl" />
                    
                    {/* Badge */}
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-slate-900 px-4 py-1.5 rounded-full text-xs font-black shadow-lg">
                      💰 ÉCONOMISEZ
                    </div>

                    <div className="relative">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-teal-100 rounded-2xl flex items-center justify-center">
                          <Sparkles className="text-teal-600" size={24} />
                        </div>
                        <div>
                          <h3 className="font-heading text-xl font-bold text-slate-900">Avec Kilolab</h3>
                          <p className="text-sm text-teal-600 font-medium">Tout inclus, zéro effort</p>
                        </div>
                      </div>

                      {/* Ce qui est inclus */}
                      <div className="space-y-2 mb-6">
                        {[
                          "Collecte gratuite à domicile",
                          "Lavage professionnel (lessive premium)",
                          "Séchage + Pliage impeccable",
                          "Livraison en 48h max",
                        ].map((feature, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-teal-100">
                            <div className="w-7 h-7 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <CheckCircle size={14} className="text-white" />
                            </div>
                            <span className="text-sm font-medium text-slate-900">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* Temps récupéré */}
                      <div className="bg-teal-100 border border-teal-200 p-4 rounded-xl mb-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-teal-800 font-medium">⏰ Temps passé : 0 minute</p>
                            <p className="text-xs text-teal-600">On s'occupe de tout !</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-black text-teal-700">0€</p>
                          </div>
                        </div>
                      </div>

                      {/* Prix Kilolab */}
                      <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-5 rounded-2xl text-white mb-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium text-sm opacity-90">{weight}kg × 3€/kg</span>
                            <p className="font-bold mt-1">PRIX KILOLAB</p>
                          </div>
                          <span className="text-4xl font-black">{kilolabPrice}€</span>
                        </div>
                      </div>

                      {/* Économies */}
                      <div className="bg-white p-5 rounded-2xl border-2 border-teal-300 shadow-lg">
                        <p className="text-teal-600 font-bold text-sm text-center mb-3">🎉 VOS ÉCONOMIES</p>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center bg-teal-50 rounded-xl p-3">
                            <p className="text-3xl font-black text-teal-600">{(diyTotalCost - kilolabPrice).toFixed(0)}€</p>
                            <p className="text-xs text-slate-600 font-medium">économisés</p>
                          </div>
                          <div className="text-center bg-teal-50 rounded-xl p-3">
                            <p className="text-3xl font-black text-teal-600">{timeSaved}h</p>
                            <p className="text-xs text-slate-600 font-medium">récupérées</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimateOnScroll>
              </div>

              {/* CTA */}
              <AnimateOnScroll delay={300}>
                <div className="mt-12 text-center">
                  <Link
                    to="/new-order"
                    data-testid="choose-kilolab-btn"
                    className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-2xl font-bold text-lg hover:shadow-2xl transition-all hover:scale-105 active:scale-95"
                  >
                    <span>Économiser {(diyTotalCost - kilolabPrice).toFixed(0)}€ maintenant</span>
                    <ArrowRight size={20} />
                  </Link>
                  <p className="text-sm text-slate-500 mt-4">Première commande ? Profitez de -20% avec le code BIENVENUE</p>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        <HowItWorks />

        {/* OUR STORY - Asymmetric Layout */}
        <section className="bg-white py-24 px-4 overflow-hidden border-t border-slate-100">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
              {/* Images */}
              <AnimateOnScroll delay={0}>
                <div className="relative">
                  <div className="grid grid-cols-2 gap-4 relative">
                    <img
                      src="https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&auto=format&fit=crop"
                      alt="Inspiration Bali"
                      className="rounded-2xl shadow-soft transform -rotate-2 hover:rotate-0 transition-transform duration-500"
                      loading="lazy"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?w=800&auto=format&fit=crop"
                      alt="Linge propre"
                      className="rounded-2xl shadow-soft transform rotate-2 hover:rotate-0 transition-transform duration-500 mt-12"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-teal-100/50 to-cyan-100/50 rounded-full blur-3xl" />
                </div>
              </AnimateOnScroll>

              {/* Content */}
              <AnimateOnScroll delay={200}>
                <div>
                  <span className="inline-block px-4 py-1.5 bg-teal-50 text-teal-700 rounded-full text-sm font-semibold mb-6 border border-teal-100">
                    Notre Histoire
                  </span>
                  <h2 className="font-heading text-3xl md:text-5xl font-bold text-slate-900 mb-8 leading-tight">
                    De la douceur de Bali <br />
                    à l'exigence de Paris.
                  </h2>
                  <p className="text-slate-600 text-lg leading-relaxed mb-8">
                    Là-bas, le soin du linge au poids est la norme : simple, direct, sans artifices. Nous avons importé ce concept
                    pour en finir avec le casse-tête des tarifs à la pièce.
                  </p>
                  <blockquote className="bg-slate-50 p-6 rounded-2xl border-l-4 border-teal-500 mb-8">
                    <p className="text-slate-700 font-medium italic">
                    "Juste le poids du linge propre. Rien d'autre."
                  </p>
                </blockquote>
                <Link
                  to="/become-washer"
                  className="inline-flex items-center gap-2 text-slate-900 font-semibold hover:text-teal-600 transition-colors group"
                >
                  Envie de devenir Washer ? C'est par ici
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
            <h2 className="font-heading text-4xl md:text-6xl font-bold mb-6">
              Prêt à récupérer votre temps libre ?
            </h2>
            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
              Rejoignez les milliers d'utilisateurs qui ont déjà arrêté la corvée du linge
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/new-order"
                data-testid="final-cta-order"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-900 rounded-full font-semibold text-lg hover:bg-teal-50 transition-all duration-300 shadow-soft hover:shadow-lg"
              >
                Commander maintenant
                <ArrowRight size={20} />
              </Link>
              <Link
                to="/become-washer"
                data-testid="final-cta-washer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-full font-semibold text-lg hover:bg-white/20 transition-all duration-300 border border-white/20 hover:scale-[1.02] active:scale-[0.98]"
              >
                Devenir Washer
                <TrendingUp size={20} />
              </Link>
            </div>
          </AnimateOnScroll>
        </section>

        <Footer />
      </div>
    </>
  );
}
