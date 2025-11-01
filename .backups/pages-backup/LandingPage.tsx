import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, Clock, TrendingUp, MapPin, Star, Check, 
  X, ChevronDown, Facebook, Instagram, Linkedin,
  Zap, Shield, Bell, Gift, Users
} from 'lucide-react';

export function LandingPage() {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showB2BModal, setShowB2BModal] = useState(false);
  const [showPartnerForm, setShowPartnerForm] = useState(false);
  const [showStickyBanner, setShowStickyBanner] = useState(false);
  const [clientsPerWeek, setClientsPerWeek] = useState(20);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [socialProofVisible, setSocialProofVisible] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false);

  // Welcome modal after 5s (only once)
  useEffect(() => {
    const hasShown = localStorage.getItem('kilolab_welcome_shown');
    if (!hasShown) {
      const timer = setTimeout(() => {
        setShowWelcomeModal(true);
        localStorage.setItem('kilolab_welcome_shown', 'true');
        setHasSeenWelcome(true);
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      setHasSeenWelcome(true);
      // Show sticky banner instead after 10s
      setTimeout(() => setShowStickyBanner(true), 10000);
    }
  }, []);

  // B2B modal after 30s (only once)
  useEffect(() => {
    const hasShown = localStorage.getItem('kilolab_b2b_shown');
    if (!hasShown) {
      const timer = setTimeout(() => {
        setShowB2BModal(true);
        localStorage.setItem('kilolab_b2b_shown', 'true');
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Social proof toast every 35s
  useEffect(() => {
    const showProof = () => {
      setSocialProofVisible(true);
      setTimeout(() => setSocialProofVisible(false), 4000);
    };
    const interval = setInterval(showProof, 35000);
    return () => clearInterval(interval);
  }, []);

  // Testimonials carousel
  const testimonials = [
    { name: 'Julie', city: 'Lille', text: "Je n'ai jamais récupéré mes chemises aussi vite !", rating: 5 },
    { name: 'Karim', city: 'Paris', text: 'Parfait pour les pros, je l\'utilise chaque semaine.', rating: 5 },
    { name: 'Sofia', city: 'Lyon', text: 'Service clair, suivi par SMS, nickel.', rating: 5 },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleWelcomeClose = () => {
    setShowWelcomeModal(false);
    // Show sticky banner after closing welcome modal
    setTimeout(() => setShowStickyBanner(true), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header Sticky */}
      <header className="sticky top-0 z-50 border-b border-white/10 backdrop-blur-xl bg-slate-900/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-purple-400" />
              <h1 className="text-2xl font-bold text-white">Kilolab</h1>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <button onClick={() => scrollToSection('formules')} className="text-gray-300 hover:text-white transition">
                Formules
              </button>
              <button onClick={() => scrollToSection('comment')} className="text-gray-300 hover:text-white transition">
                Comment ça marche
              </button>
              <button onClick={() => scrollToSection('avis')} className="text-gray-300 hover:text-white transition">
                Avis
              </button>
              <button onClick={() => scrollToSection('partenaires')} className="text-gray-300 hover:text-white transition">
                Partenaires
              </button>
            </nav>
            <div className="flex gap-3">
              <Link to="/login" className="px-4 py-2 text-white hover:text-purple-300 transition">
                Connexion
              </Link>
              <Link 
                to="/signup"
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition"
              >
                Inscription
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto text-center"
        >
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Le pressing{' '}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              nouvelle génération
            </span>{' '}
            🧺
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-4">
            Simple. Rapide. Proche de vous.
          </p>
          <p className="text-lg text-gray-400 mb-8 max-w-3xl mx-auto">
            Déposez votre linge chez nos partenaires agréés et récupérez-le propre et repassé en 72h, 24h ou 6h. Suivez tout en ligne.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to="/signup"
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg rounded-lg hover:from-blue-600 hover:to-purple-700 transition transform hover:scale-105 shadow-lg shadow-purple-500/50"
            >
              Commencer maintenant
            </Link>
            <button
              onClick={() => scrollToSection('partenaires')}
              className="px-8 py-4 border-2 border-purple-500 text-white text-lg rounded-lg hover:bg-purple-500/10 transition"
            >
              Devenir partenaire pressing
            </button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 text-gray-400">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              <span>Suivi en ligne</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span>Paiement sécurisé</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5" />
              <span>Partenaires vérifiés</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ========== SECTION CLIENTS ========== */}
      <div className="border-t-4 border-purple-500/50 pt-20 pb-20">
        <div className="container mx-auto px-4 mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Package className="w-10 h-10 text-purple-400" />
            <h2 className="text-4xl font-bold text-white">Pour nos clients</h2>
          </div>
          <p className="text-center text-gray-400 text-lg">
            Choisissez la formule qui vous convient
          </p>
        </div>

        {/* Formules */}
        <section id="formules" className="container mx-auto px-4 pb-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-8">
              {/* Standard/Premium - RECOMMANDÉ */}
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="relative bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-sm border-2 border-purple-500 rounded-2xl p-8"
              >
                <div className="absolute -top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-1 rounded-full text-sm font-bold">
                  ⭐ Recommandé
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-10 h-10 text-purple-400" />
                  <h4 className="text-3xl font-bold text-white">Standard</h4>
                </div>
                <p className="text-gray-300 mb-4">72h - 96h</p>
                <div className="text-5xl font-bold text-white mb-4">
                  5€<span className="text-lg text-gray-400">/kg</span>
                </div>
                <p className="text-gray-300 mb-6">Le meilleur rapport qualité/prix pour vos besoins quotidiens.</p>
                <Link
                  to="/signup"
                  className="block w-full px-6 py-3 bg-purple-600 text-white text-center rounded-lg hover:bg-purple-700 transition"
                >
                  Choisir Standard
                </Link>
              </motion.div>

              {/* Express */}
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
              >
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-10 h-10 text-blue-400" />
                  <h4 className="text-3xl font-bold text-white">Express</h4>
                </div>
                <p className="text-gray-300 mb-4">24h</p>
                <div className="text-5xl font-bold text-white mb-4">
                  10€<span className="text-lg text-gray-400">/kg</span>
                </div>
                <p className="text-gray-300 mb-6">Pour ceux qui ont besoin de rapidité.</p>
                <Link
                  to="/signup"
                  className="block w-full px-6 py-3 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition"
                >
                  Choisir Express
                </Link>
              </motion.div>

              {/* Ultra Express */}
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="w-10 h-10 text-red-400" />
                  <h4 className="text-3xl font-bold text-white">Ultra Express</h4>
                </div>
                <p className="text-gray-300 mb-4">6h</p>
                <div className="text-5xl font-bold text-white mb-4">
                  15€<span className="text-lg text-gray-400">/kg</span>
                </div>
                <p className="text-gray-300 mb-6">Pour les situations d'urgence absolue.</p>
                <Link
                  to="/signup"
                  className="block w-full px-6 py-3 bg-red-600 text-white text-center rounded-lg hover:bg-red-700 transition"
                >
                  Choisir Ultra Express
                </Link>
              </motion.div>
            </div>
            <p className="text-center text-sm text-gray-500">
              Tarifs indicatifs, hors pièces spéciales (costumes, robes…).
            </p>
          </motion.div>
        </section>

        {/* Comment ça marche */}
        <section id="comment" className="container mx-auto px-4 pb-20">
          <h3 className="text-4xl font-bold text-white text-center mb-12">Comment ça marche ?</h3>
          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {[
              { icon: MapPin, title: 'Déposez', text: 'Trouvez un point Kilolab proche de chez vous et déposez votre linge.' },
              { icon: Bell, title: 'Suivez', text: 'Recevez des notifications à chaque étape : lavage, repassage, prêt.' },
              { icon: Package, title: 'Récupérez', text: 'Récupérez votre linge propre, repassé et plié.' },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <step.icon className="w-10 h-10 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-white mb-3">{step.title}</h4>
                <p className="text-gray-300">{step.text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Avis clients */}
        <section id="avis" className="container mx-auto px-4 pb-20">
          <h3 className="text-4xl font-bold text-white text-center mb-12">Avis clients</h3>
          <div className="max-w-3xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center"
              >
                <div className="flex justify-center mb-4">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-xl text-white mb-4">"{testimonials[currentTestimonial].text}"</p>
                <p className="text-gray-400">
                  — {testimonials[currentTestimonial].name}, {testimonials[currentTestimonial].city}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* Offre de lancement */}
        <section className="container mx-auto px-4 pb-20">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-center"
          >
            <Gift className="w-16 h-16 text-white mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-white mb-4">
              🎁 –10 % sur votre premier pressing avec le code KILO10
            </h3>
            <p className="text-white/90 mb-6">(temps limité)</p>
            <Link
              to="/signup"
              className="inline-block px-8 py-4 bg-white text-purple-600 font-bold rounded-lg hover:bg-gray-100 transition"
            >
              J'en profite
            </Link>
          </motion.div>
        </section>
      </div>

      {/* ========== SECTION PARTENAIRES ========== */}
      <div className="border-t-4 border-blue-500/50 pt-20 pb-20 bg-slate-900/30">
        <div className="container mx-auto px-4 mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="w-10 h-10 text-blue-400" />
            <h2 className="text-4xl font-bold text-white">Pour nos partenaires</h2>
          </div>
          <p className="text-center text-gray-400 text-lg">
            Rejoignez notre réseau et développez votre activité
          </p>
        </div>

        {/* Section Partenaires B2B */}
        <section id="partenaires" className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-4xl font-bold text-white text-center mb-6">Devenez partenaire Kilolab</h3>
            <p className="text-xl text-gray-300 text-center mb-12">
              Gagnez de nouveaux clients sans effort. Nous apportons la demande, vous traitez le linge.
            </p>

            <div className="grid md:grid-cols-4 gap-6 mb-12">
              {[
                { icon: MapPin, text: 'Clients géolocalisés' },
                { icon: Shield, text: 'Paiement garanti' },
                { icon: TrendingUp, text: 'Interface simple' },
                { icon: Gift, text: 'Zéro frais d\'entrée' },
              ].map((item, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
                  <item.icon className="w-10 h-10 text-blue-400 mx-auto mb-3" />
                  <p className="text-white">{item.text}</p>
                </div>
              ))}
            </div>

            {/* Simulateur revenus */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h4 className="text-2xl font-bold text-white mb-6 text-center">Simulateur de revenus</h4>
              <div className="max-w-md mx-auto">
                <label className="block text-gray-300 mb-3">Clients Kilolab/semaine :</label>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={clientsPerWeek}
                  onChange={(e) => setClientsPerWeek(Number(e.target.value))}
                  className="w-full mb-4"
                />
                <div className="text-center">
                  <div className="text-5xl font-bold text-blue-400 mb-2">
                    {clientsPerWeek * 10 * 4}€
                  </div>
                  <p className="text-gray-400">Revenus estimés/mois</p>
                  <p className="text-sm text-gray-500 mt-2">({clientsPerWeek} clients × 10€ × 4 semaines)</p>
                </div>
              </div>
              <div className="text-center mt-8">
                <button
                  onClick={() => setShowPartnerForm(true)}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition"
                >
                  Rejoindre le réseau
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* FAQ */}
      <section className="container mx-auto px-4 py-20">
        <h3 className="text-4xl font-bold text-white text-center mb-12">Questions fréquentes</h3>
        <div className="max-w-3xl mx-auto space-y-4">
          {[
            { q: 'Où déposer mon linge ?', a: 'Dans le pressing partenaire le plus proche (carte bientôt disponible).' },
            { q: 'Comment suivre ma commande ?', a: 'Par SMS/email à chaque étape + espace client.' },
            { q: 'Y a-t-il des frais cachés ?', a: 'Non. Les pièces spéciales ont un tarif clair à part.' },
            { q: 'Politique de retard ?', a: 'Remboursement si retard > 48h sur la formule choisie.' },
          ].map((item, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
              <button
                onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                className="w-full px-6 py-4 flex items-center justify-between text-left"
              >
                <span className="text-white font-semibold">{item.q}</span>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition ${faqOpen === i ? 'rotate-180' : ''}`} />
              </button>
              {faqOpen === i && (
                <div className="px-6 pb-4 text-gray-300">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Package className="w-8 h-8 text-purple-400" />
                <span className="text-xl font-bold text-white">Kilolab</span>
              </div>
              <p className="text-gray-400">Le pressing nouvelle génération.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Liens</h4>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white transition">CGU</a>
                <a href="#" className="block text-gray-400 hover:text-white transition">Politique de confidentialité</a>
                <a href="#" className="block text-gray-400 hover:text-white transition">Partenaires</a>
                <a href="#" className="block text-gray-400 hover:text-white transition">Carrières</a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <p className="text-gray-400 mb-2">contact@kilolab.fr</p>
              <p className="text-gray-400 mb-4">Lille, France</p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <Facebook className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <Linkedin className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Kilolab — Tous droits réservés</p>
          </div>
        </div>
      </footer>

      {/* Sticky Banner Bottom (instead of repeating popups) */}
      <AnimatePresence>
        {showStickyBanner && hasSeenWelcome && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-purple-600 to-pink-600 border-t-2 border-purple-400 shadow-2xl"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Gift className="w-8 h-8 text-white" />
                  <div>
                    <p className="text-white font-bold">Profitez de -10% sur votre premier pressing !</p>
                    <p className="text-white/80 text-sm">Code : KILO10</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    to="/signup"
                    className="px-6 py-2 bg-white text-purple-600 font-bold rounded-lg hover:bg-gray-100 transition"
                  >
                    J'en profite
                  </Link>
                  <button
                    onClick={() => setShowStickyBanner(false)}
                    className="text-white hover:text-gray-200 transition"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {/* Welcome Modal (only once) */}
        {showWelcomeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleWelcomeClose}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-slate-800 to-purple-900 border border-purple-500 rounded-2xl p-8 max-w-md w-full relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleWelcomeClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="text-center">
                <h3 className="text-3xl font-bold text-white mb-4">Bienvenue chez Kilolab 👋</h3>
                <p className="text-gray-300 mb-6">Profitez de –10 % sur votre première commande avec KILO10.</p>
                <div className="flex gap-4">
                  <Link
                    to="/signup"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition"
                  >
                    J'en profite
                  </Link>
                  <button
                    onClick={handleWelcomeClose}
                    className="flex-1 px-6 py-3 border border-white/20 text-white rounded-lg hover:bg-white/10 transition"
                  >
                    Plus tard
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* B2B Modal */}
        {showB2BModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowB2BModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-slate-800 to-purple-900 border border-purple-500 rounded-2xl p-8 max-w-md w-full relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowB2BModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="text-center">
                <Users className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-4">Vous êtes un pressing ?</h3>
                <p className="text-gray-300 mb-6">Rejoignez notre réseau partenaire et gagnez de nouveaux clients.</p>
                <button
                  onClick={() => {
                    setShowB2BModal(false);
                    setShowPartnerForm(true);
                  }}
                  className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition"
                >
                  Devenir partenaire
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Partner Form Modal */}
        {showPartnerForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPartnerForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-slate-800 to-purple-900 border border-purple-500 rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowPartnerForm(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
              <h3 className="text-2xl font-bold text-white mb-6">Devenir partenaire</h3>
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Formulaire envoyé !'); setShowPartnerForm(false); }}>
                <div>
                  <label className="block text-gray-300 mb-2">Nom de l'établissement *</label>
                  <input type="text" required className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white" />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Ville *</label>
                  <input type="text" required className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white" />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Email *</label>
                  <input type="email" required className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white" />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Téléphone</label>
                  <input type="tel" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white" />
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition"
                >
                  Envoyer ma demande
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Social Proof Toast */}
      <AnimatePresence>
        {socialProofVisible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 right-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-lg shadow-2xl z-50 max-w-sm"
          >
            <p className="font-semibold">Nadia à Lille vient de réserver une formule Standard ✨</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}