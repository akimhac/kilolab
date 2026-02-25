import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  MapPin,
  Sparkles,
  Package,
  Zap,
  Droplet,
  AlertCircle,
  TrendingUp,
  Shield,
  Star,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import HowItWorks from "../components/HowItWorks";

export default function Landing() {
  const [weight, setWeight] = useState(5);
  const [reduceMotion, setReduceMotion] = useState(false);

  // ✅ Vidéo (tu pourras remplacer par une source "premium" plus tard, sans toucher au layout)
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

  const diyMaterialTotal =
    diyWater + diyElectricity + diyDetergent + diySoftener + diyMachineWear + diyDryer;

  const diyTimeHours = 2.5;
  const hourlyRate = 12;
  const diyTimeCost = diyTimeHours * hourlyRate;
  const diyTotalCost = diyMaterialTotal + diyTimeCost;

  // ✅ CORRECTION: 3€/kg comme annoncé
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

        {/* ✅ Perf: preconnect + preload vidéo critique */}
        <link rel="preconnect" href="https://videos.pexels.com" crossOrigin="" />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="" />
        <link rel="preload" as="image" href={HERO_POSTER} />
        <link rel="preload" as="video" href={HERO_VIDEO_MP4} type="video/mp4" />
      </Helmet>

      <div className="min-h-screen bg-white font-sans text-slate-900">
        <Navbar />

        {/* ✅ HERO PREMIUM - VIDÉO OPTIMISÉE */}
        <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 w-full h-full">
            {!reduceMotion ? (
              <video
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                poster={HERO_POSTER}
                className="absolute inset-0 w-full h-full object-cover"
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

            {/* Overlay gradient (lisibilité + premium) */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-slate-900/90" />
          </div>

          <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 text-center pt-20">
            {/* Badge confiance */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/20 backdrop-blur-md text-white rounded-full text-sm font-bold border border-teal-400/30 mb-8">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Disponible partout en France 🇫🇷
            </div>

            {/* H1 SEO + Conversion */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-8 leading-[1.1] tracking-tight drop-shadow-2xl">
              Libérez votre temps.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-cyan-300">
                On prend soin de votre linge.
              </span>
            </h1>

            {/* Value prop */}
            <p className="text-xl md:text-2xl text-white/95 max-w-3xl mx-auto mb-4 leading-relaxed font-light drop-shadow-lg">
              Collecte, lavage et pliage inclus.
              <br />
              Simple, rapide et partout en France.
            </p>

            <p className="text-3xl font-black text-teal-300 mb-12 drop-shadow-lg">Dès 3€/kg</p>

            {/* CTAs (FIX: balise <a> complète) */}
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Link
                to="/new-order"
                className="group inline-flex items-center justify-center gap-3 px-8 py-5 bg-teal-500 text-white rounded-full font-bold text-lg hover:bg-teal-400 transition-all shadow-[0_0_30px_rgba(20,184,166,0.4)] hover:scale-105"
              >
                Confier mon linge
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </Link>

              <a
                href="#comment-ca-marche"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("comment-ca-marche")?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }}
                className="inline-flex items-center justify-center px-8 py-5 bg-white/10 backdrop-blur-md text-white border-2 border-white/20 rounded-full font-bold text-lg hover:bg-white hover:text-slate-900 transition-all cursor-pointer"
              >
                Comment ça marche ?
              </a>
            </div>

            {/* Trust indicators */}
            <div className="mt-8 flex justify-center items-center gap-4 text-white/90 text-sm font-medium flex-wrap">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <Shield size={16} className="text-green-400" />
                <span>Paiement sécurisé</span>
              </div>
            </div>

            {/* Social proof */}
            <div className="mt-6 flex justify-center items-center gap-2 text-white/80 text-sm font-medium">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 border-2 border-white"
                  />
                ))}
              </div>
              <span>+500 clients satisfaits</span>
            </div>
          </div>
        </section>

        {/* Bandeau recrutement */}
        <section className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 py-8 px-4">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-white text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-black mb-2">💰 Vous avez une machine à laver ?</h2>
              <p className="text-lg md:text-xl text-white/90">
                Rejoignez 500+ Washers et gagnez jusqu'à <strong>600€/mois</strong>.
              </p>
            </div>

            <Link
              to="/become-washer"
              className="px-8 py-4 bg-white text-orange-600 rounded-xl font-black text-lg hover:bg-orange-50 transition shadow-2xl flex-shrink-0 hover:scale-105 transform"
            >
              Devenir Washer Partenaire →
            </Link>
          </div>
        </section>

        {/* Confiance */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black mb-2">La plateforme n°1 en France</h2>
              <p className="text-slate-600">Des milliers de clients nous font déjà confiance</p>
            </div>

            <div className="grid md:grid-cols-4 gap-8 mb-12">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center hover:shadow-lg transition">
                <div className="text-4xl font-black text-teal-600 mb-2">🇫🇷</div>
                <p className="text-sm text-slate-600 font-bold">Partout en France</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center hover:shadow-lg transition">
                <div className="text-4xl font-black text-teal-600 mb-2">10k+</div>
                <p className="text-sm text-slate-600 font-bold">Kilos lavés</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center hover:shadow-lg transition">
                <div className="text-4xl font-black text-teal-600 mb-2 flex items-center justify-center gap-1">
                  4.9 <Star size={28} className="text-yellow-500 fill-yellow-500" />
                </div>
                <p className="text-sm text-slate-600 font-bold">Note moyenne</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center hover:shadow-lg transition">
                <div className="text-4xl font-black text-teal-600 mb-2">7j/7</div>
                <p className="text-sm text-slate-600 font-bold">Service disponible</p>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-slate-400 mb-6 uppercase tracking-wider font-bold">Ils parlent de nous</p>
              <div className="flex flex-wrap justify-center items-center gap-8 opacity-40">
                <div className="text-2xl font-bold text-slate-700">TechCrunch</div>
                <div className="text-2xl font-bold text-slate-700">Le Figaro</div>
                <div className="text-2xl font-bold text-slate-700">BFM Business</div>
                <div className="text-2xl font-bold text-slate-700">Les Échos</div>
              </div>
            </div>
          </div>
        </section>

        {/* COMPARATIF */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black mb-6 text-slate-900">Le coût caché de votre lessive 🧐</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Entre l'eau, l'électricité, les produits et votre temps... faire sa lessive coûte plus cher qu'on ne le pense.
              </p>
            </div>

            <div className="bg-slate-50 rounded-3xl p-8 max-w-5xl mx-auto border border-slate-200">
              <div className="mb-12 max-w-lg mx-auto text-center">
                <label className="block text-sm font-bold text-slate-700 mb-4">
                  Simulez avec votre volume :{" "}
                  <span className="text-teal-600 bg-white px-3 py-1 rounded-lg border border-teal-100 shadow-sm">
                    {weight} kg
                  </span>
                </label>

                <input
                  type="range"
                  min="3"
                  max="15"
                  step="1"
                  value={weight}
                  onChange={(e) => setWeight(parseInt(e.target.value, 10))}
                  className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                />

                <div className="flex justify-between text-xs text-slate-500 mt-2">
                  <span>Petit sac</span>
                  <span>Gros volume</span>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-8 items-start">
                {/* DIY */}
                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border-2 border-orange-200">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-orange-100 rounded-xl">
                      <AlertCircle className="text-orange-600" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900">🧺 À la maison</h3>
                      <p className="text-xs text-slate-600">Pour {weight}kg de linge</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg text-sm">
                      <div className="flex items-center gap-2">
                        <Droplet size={16} className="text-blue-600" />
                        <span>Eau (60L)</span>
                      </div>
                      <span className="font-bold">{diyWater.toFixed(2)}€</span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg text-sm">
                      <div className="flex items-center gap-2">
                        <Zap size={16} className="text-yellow-600" />
                        <span>Électricité</span>
                      </div>
                      <span className="font-bold">{diyElectricity.toFixed(2)}€</span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg text-sm">
                      <div className="flex items-center gap-2">
                        <Sparkles size={16} className="text-purple-600" />
                        <span>Lessive</span>
                      </div>
                      <span className="font-bold">{diyDetergent.toFixed(2)}€</span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-pink-50 rounded-lg text-sm">
                      <div className="flex items-center gap-2">
                        <Sparkles size={16} className="text-pink-600" />
                        <span>Adoucissant</span>
                      </div>
                      <span className="font-bold">{diySoftener.toFixed(2)}€</span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg text-sm">
                      <div className="flex items-center gap-2">
                        <TrendingUp size={16} className="text-slate-600" />
                        <span>Usure machine</span>
                      </div>
                      <span className="font-bold">{diyMachineWear.toFixed(2)}€</span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg text-sm">
                      <div className="flex items-center gap-2">
                        <Zap size={16} className="text-orange-600" />
                        <span>Sèche-linge</span>
                      </div>
                      <span className="font-bold">{diyDryer.toFixed(2)}€</span>
                    </div>
                  </div>

                  <div className="bg-white/70 p-4 rounded-xl border border-orange-300 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <Clock className="text-orange-600" size={18} />
                        <span className="font-bold text-sm">Votre temps</span>
                      </div>
                      <span className="text-xl font-black text-orange-600">{diyTimeHours}h</span>
                    </div>
                    <p className="text-xs text-slate-600 mb-2">Tri + Lavage + Séchage + Pliage</p>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-xs text-slate-600">Valorisé à {hourlyRate}€/h</span>
                      <span className="font-bold text-orange-700">{diyTimeCost.toFixed(2)}€</span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-red-500 to-orange-500 p-5 rounded-xl text-white">
                    <div className="flex justify-between items-center mb-2 text-sm opacity-90">
                      <span>Coût matériel</span>
                      <span>{diyMaterialTotal.toFixed(2)}€</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-white/30 text-sm opacity-90">
                      <span>Coût temps</span>
                      <span>{diyTimeCost.toFixed(2)}€</span>
                    </div>
                    <div className="flex justify-between items-center pt-3">
                      <span className="font-bold">TOTAL RÉEL</span>
                      <span className="text-3xl font-black">{diyTotalCost.toFixed(2)}€</span>
                    </div>
                    <p className="text-center text-xs mt-2 bg-white/20 rounded-lg py-1 font-bold">
                      ⚠️ Sans compter le stress
                    </p>
                  </div>
                </div>

                {/* KILOLAB */}
                <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-6 border-2 border-teal-200 relative">
                  <div className="absolute top-4 right-4 bg-yellow-400 text-slate-900 px-3 py-1 rounded-full text-xs font-black rotate-12 shadow-lg">
                    ⭐ RECOMMANDÉ
                  </div>

                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-teal-100 rounded-xl">
                      <Sparkles className="text-teal-600" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900">✨ Avec Kilolab</h3>
                      <p className="text-xs text-slate-600">Tout inclus pour {weight}kg</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {[
                      "Enlèvement gratuit à domicile",
                      "Lavage professionnel (lessive premium)",
                      "Séchage + Pliage impeccable",
                      "Livraison en 48h max",
                    ].map((t, i) => (
                      <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-teal-100">
                        <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center shrink-0">
                          <CheckCircle size={18} className="text-white" />
                        </div>
                        <span className="text-sm font-medium text-slate-900">{t}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white p-5 rounded-xl border-2 border-teal-200 mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-slate-600 font-medium text-sm">Prix tout compris</span>
                      <span className="font-bold text-slate-900">{kilolabPrice.toFixed(2)}€</span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t">
                      <div className="flex items-center gap-2">
                        <Clock size={18} className="text-teal-600" />
                        <span className="font-bold text-sm">Votre temps</span>
                      </div>
                      <span className="text-lg font-black text-teal-600">0h</span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-500 to-teal-500 p-5 rounded-xl text-white mb-6">
                    <p className="text-xs font-bold mb-3 text-center uppercase tracking-wider">🎉 Vous économisez</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center bg-white/20 rounded-xl p-3">
                        <p className="text-2xl font-black mb-1">{timeSaved.toFixed(1)}h</p>
                        <p className="text-xs font-medium">de temps libre</p>
                        <p className="text-xs mt-1 opacity-80">= {diyTimeCost.toFixed(0)}€</p>
                      </div>
                      <div className="text-center bg-white/20 rounded-xl p-3">
                        <p className="text-2xl font-black mb-1">0€</p>
                        <p className="text-xs font-medium">de stress</p>
                        <p className="text-xs mt-1 opacity-80">corvée finie !</p>
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/new-order"
                    className="block w-full py-4 bg-teal-600 text-white text-center font-bold rounded-xl hover:bg-teal-700 transition shadow-lg text-lg"
                  >
                    ✅ Je choisis Kilolab
                  </Link>

                  <p className="text-center text-xs text-slate-500 mt-3">
                    💡 En gros, vous êtes <strong>payé {paidToDoNothing}€</strong> pour ne rien faire
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <div className="inline-block bg-gradient-to-r from-teal-600 to-cyan-600 text-white p-6 rounded-2xl max-w-2xl">
                <h3 className="text-xl font-black mb-2">💎 Le vrai coût, c&apos;est votre temps</h3>
                <p className="text-teal-100">
                  Pour seulement{" "}
                  <strong className="text-white">{(kilolabPrice - diyMaterialTotal).toFixed(2)}€ de plus</strong>, vous récupérez{" "}
                  <strong className="text-white">{timeSaved}h de vie</strong>
                </p>
              </div>
            </div>
          </div>
        </section>

        <HowItWorks />

        {/* NOTRE HISTOIRE */}
        <section className="bg-white py-20 px-4 overflow-hidden border-t border-slate-100">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-16">
            <div className="flex-1 relative w-full max-w-md md:max-w-none">
              <div className="grid grid-cols-2 gap-3 sm:gap-4 relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&auto=format&fit=crop"
                  alt="Bali"
                  className="rounded-2xl shadow-xl transform -rotate-2 hover:rotate-0 transition duration-500"
                  loading="lazy"
                />
                <img
                  src="https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?w=800&auto=format&fit=crop"
                  alt="Linge propre"
                  className="rounded-2xl shadow-xl transform rotate-2 hover:rotate-0 transition duration-500 mt-8"
                  loading="lazy"
                />
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-teal-100/50 rounded-full blur-3xl -z-10" />
            </div>

            <div className="flex-1 text-left">
              <span className="text-teal-600 font-bold uppercase tracking-wider text-xs sm:text-sm inline-block mb-3 sm:mb-4 bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
                Notre Histoire
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 sm:mb-8 leading-tight">
                De la douceur de Bali <br />
                à l&apos;exigence de Paris.
              </h2>
              <p className="text-slate-600 leading-relaxed text-base sm:text-lg mb-5 sm:mb-6">
                Là-bas, le soin du linge au poids est la norme : simple, direct, sans artifices. Nous avons importé ce concept
                pour en finir avec le casse-tête des tarifs à la pièce.
              </p>
              <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm inline-block mb-6 sm:mb-8 w-full md:w-auto">
                <p className="text-slate-600 leading-relaxed text-base sm:text-lg font-medium">
                  &quot;Juste le poids du linge propre. Rien d&apos;autre.&quot;
                </p>
              </div>
              <Link
                to="/become-washer"
                className="inline-flex items-center font-bold text-slate-900 hover:text-teal-600 transition-all gap-2 underline underline-offset-4 decoration-2 hover:decoration-teal-600 group"
              >
                Envie de devenir Washer ? C&apos;est par ici
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="py-20 bg-gradient-to-r from-teal-600 to-cyan-600 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-black mb-4">Prêt à récupérer votre temps libre ?</h2>
            <p className="text-xl mb-8 text-teal-100">Rejoignez les utilisateurs qui ont déjà arrêté la corvée du linge</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/new-order"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-teal-600 rounded-2xl font-bold hover:bg-slate-100 transition shadow-2xl text-lg"
              >
                Commander maintenant <ArrowRight size={20} />
              </Link>
              <Link
                to="/become-washer"
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