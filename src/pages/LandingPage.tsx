// src/pages/LandingPage.tsx
// Landing Page principale - Prix corrigés : 3€/kg Standard, 5€/kg Express

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  MapPin, Clock, Euro, Star, ChevronRight, ChevronLeft,
  Shirt, CheckCircle, Users, Shield, Zap, Calculator,
  ArrowRight, Phone, Mail, Menu, X
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Carousel slides
  const slides = [
    {
      title: "Le pressing au kilo",
      subtitle: "Simple, rapide et économique",
      description: "Déposez votre linge, on s'occupe de tout. À partir de 3€/kg seulement.",
      cta: "Trouver un pressing",
      ctaLink: "/partners-map",
      bg: "from-purple-600 to-pink-600"
    },
    {
      title: "Jusqu'à 90% d'économie",
      subtitle: "Comparé au pressing traditionnel",
      description: "Une chemise à 0.45€ au lieu de 8€. Faites le calcul !",
      cta: "Voir les tarifs",
      ctaLink: "/pricing",
      bg: "from-green-500 to-teal-500"
    },
    {
      title: "Service Express 24h",
      subtitle: "Pour les urgences",
      description: "Besoin de votre linge rapidement ? Option express disponible.",
      cta: "Commander maintenant",
      ctaLink: "/partners-map",
      bg: "from-orange-500 to-red-500"
    },
    {
      title: "Vous êtes pressing ?",
      subtitle: "Rejoignez le réseau Kilolab",
      description: "Zéro abonnement, zéro engagement. Rentable dès le 1er client.",
      cta: "Devenir partenaire",
      ctaLink: "/become-partner",
      bg: "from-blue-600 to-purple-600"
    }
  ];

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Stats
  const stats = [
    { value: "1854", label: "Pressings en France & Belgique" },
    { value: "24h", label: "Service express" },
    { value: "3€", label: "À partir de /kg" }
  ];

  // Comparateur de prix - 90% d'économie
  const priceComparison = [
    { item: "Chemise", weight: 0.15, traditional: 8, saving: 90 },
    { item: "Pantalon", weight: 0.4, traditional: 10, saving: 88 },
    { item: "Pull", weight: 0.5, traditional: 12, saving: 88 },
    { item: "Veste", weight: 0.8, traditional: 18, saving: 87 },
    { item: "Manteau", weight: 1.5, traditional: 25, saving: 82 },
    { item: "Robe", weight: 0.3, traditional: 15, saving: 94 },
  ];

  const pricePerKg = 3; // Prix standard

  // Avantages
  const benefits = [
    {
      icon: Euro,
      title: "Jusqu'à 90% d'économie",
      description: "Payez au poids, pas à la pièce. Une chemise revient à 0.45€ au lieu de 8€."
    },
    {
      icon: Clock,
      title: "Rapide et pratique",
      description: "Déposez, on s'occupe de tout. Prêt en 24-48h, ou 4h en express."
    },
    {
      icon: MapPin,
      title: "Près de chez vous",
      description: "Plus de 1850 pressings partenaires dans toute la France et Belgique."
    },
    {
      icon: Shield,
      title: "Qualité garantie",
      description: "Pressings professionnels sélectionnés. Avis clients transparents."
    }
  ];

  // Comment ça marche
  const steps = [
    { step: 1, title: "Trouvez", description: "Sélectionnez un pressing près de chez vous" },
    { step: 2, title: "Déposez", description: "Apportez votre linge, on le pèse" },
    { step: 3, title: "Récupérez", description: "Notification quand c'est prêt, payez sur place" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="text-2xl font-bold text-green-600">
              Kilolab
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-6">
              <Link to="/login" className="text-slate-600 hover:text-slate-900 font-medium">
                Connexion
              </Link>
              <Link 
                to="/partners-map"
                className="px-6 py-2.5 bg-green-500 text-white rounded-full font-semibold hover:bg-green-600 transition"
              >
                Trouver un pressing
              </Link>
            </div>

            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>

          {/* Mobile Nav */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t mt-3">
              <div className="flex flex-col gap-3">
                <Link to="/login" className="py-2 text-slate-600">Connexion</Link>
                <Link to="/partners-map" className="py-2 px-4 bg-green-500 text-white rounded-lg text-center font-semibold">
                  Trouver un pressing
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Carousel */}
      <section className="relative overflow-hidden">
        <div 
          className={`bg-gradient-to-r ${slides[currentSlide].bg} text-white py-16 md:py-24 transition-all duration-500`}
        >
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-white/80 text-lg mb-2">{slides[currentSlide].subtitle}</p>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{slides[currentSlide].title}</h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              {slides[currentSlide].description}
            </p>
            <button
              onClick={() => navigate(slides[currentSlide].ctaLink)}
              className="px-8 py-4 bg-white text-slate-900 rounded-full font-bold text-lg hover:shadow-xl transition inline-flex items-center gap-2"
            >
              {slides[currentSlide].cta}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-3 h-3 rounded-full transition ${
                i === currentSlide ? 'bg-white' : 'bg-white/40'
              }`}
            />
          ))}
        </div>

        {/* Carousel arrows */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </section>

      {/* Stats */}
      <section className="bg-gradient-to-r from-green-500 to-teal-500 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-3 gap-4 text-center text-white">
            {stats.map((stat, i) => (
              <div key={i}>
                <div className="text-3xl md:text-5xl font-bold">{stat.value}</div>
                <div className="text-sm md:text-base text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparateur de prix */}
      <section className="py-16 bg-green-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border-2 border-green-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center">
                <Calculator className="w-7 h-7 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Comparateur de prix</h2>
                <p className="text-slate-600">Pressing traditionnel vs Kilolab (au kilo)</p>
              </div>
            </div>

            <div className="space-y-4">
              {priceComparison.map((item, i) => {
                const kilolabPrice = (item.weight * pricePerKg).toFixed(2);
                return (
                  <div key={i} className="bg-slate-50 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-slate-900">{item.item}</span>
                      <span className="text-sm text-slate-500">~{item.weight}kg</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-xs text-slate-500">Traditionnel</p>
                        <p className="font-bold text-slate-400 line-through">{item.traditional.toFixed(2)}€</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Kilolab</p>
                        <p className="font-bold text-green-600">{kilolabPrice}€</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Économie</p>
                        <p className="font-bold text-green-600 flex items-center justify-center gap-1">
                          <span className="text-lg">↘</span> {item.saving}%
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 p-4 bg-green-100 rounded-2xl text-center">
              <p className="text-green-800 font-medium">
                💡 Avec Kilolab, économisez en moyenne <strong>90%</strong> sur votre pressing !
              </p>
            </div>

            <button
              onClick={() => navigate('/partners-map')}
              className="w-full mt-6 py-4 bg-green-500 text-white rounded-2xl font-bold text-lg hover:bg-green-600 transition"
            >
              Trouver un pressing près de chez moi
            </button>
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-4">
            Comment ça marche ?
          </h2>
          <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
            En 3 étapes simples, votre linge est prêt
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-12">
            Pourquoi choisir Kilolab ?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{benefit.title}</h3>
                <p className="text-slate-600 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Partenaires */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Vous êtes un pressing ?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Rejoignez le réseau Kilolab et recevez de nouveaux clients.
            <br />
            <strong>Zéro abonnement. Zéro engagement. Rentable dès le 1er client.</strong>
          </p>
          <button
            onClick={() => navigate('/become-partner')}
            className="px-8 py-4 bg-white text-purple-600 rounded-full font-bold text-lg hover:shadow-xl transition"
          >
            Devenir partenaire gratuitement
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Kilolab</h3>
              <p className="text-slate-400 text-sm">
                Le pressing au kilo, simple et économique.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Navigation</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link to="/partners-map" className="hover:text-white">Trouver un pressing</Link></li>
                <li><Link to="/pricing" className="hover:text-white">Tarifs</Link></li>
                <li><Link to="/become-partner" className="hover:text-white">Devenir partenaire</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Informations</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link to="/about" className="hover:text-white">À propos</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link to="/blog" className="hover:text-white">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link to="/legal/cgu" className="hover:text-white">CGU</Link></li>
                <li><Link to="/legal/privacy" className="hover:text-white">Confidentialité</Link></li>
                <li><Link to="/legal/mentions-legales" className="hover:text-white">Mentions légales</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-400 text-sm">
            © 2025 Kilolab. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}
