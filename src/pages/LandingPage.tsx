import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Shield, Clock, Euro, Star } from 'lucide-react';
import HowItWorksCarousel from '../components/HowItWorksCarousel';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-12">
              <button onClick={() => navigate('/')} className="text-3xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Kilolab
              </button>
              <div className="hidden md:flex items-center gap-8">
                <button onClick={() => navigate('/partners-map')} className="text-slate-600 hover:text-blue-600 font-semibold transition">
                  Comment ça marche
                </button>
                <button onClick={() => navigate('/pricing')} className="text-slate-600 hover:text-blue-600 font-semibold transition">
                  Avis
                </button>
                <button onClick={() => navigate('/pricing')} className="text-slate-600 hover:text-blue-600 font-semibold transition">
                  Pour qui ?
                </button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/login')} className="text-slate-600 hover:text-blue-600 font-semibold transition">
                <ArrowRight className="w-5 h-5 inline mr-2" />
                Connexion
              </button>
              <button
                onClick={() => navigate('/partners-map')}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold hover:shadow-xl transition"
              >
                Trouver un pressing
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Texte à gauche */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-block mb-6">
                <div className="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold text-sm">
                  <Zap className="w-4 h-4" />
                  2600+ pressings partenaires
                </div>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-tight mb-6">
                Votre pressing
                <span className="block bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  au kilo
                </span>
                <span className="block">en point relais</span>
              </h1>

              <p className="text-xl md:text-2xl text-slate-600 mb-6 leading-relaxed">
                Déposez votre linge près de chez vous, récupérez-le impeccable 24h plus tard.
              </p>

              <p className="text-lg text-slate-500 mb-8 leading-relaxed">
                Kilolab sélectionne pour vous les meilleurs pressings partenaires, au prix le plus juste. Simple, rapide, transparent.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={() => navigate('/partners-map')}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  Trouver un pressing
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="px-8 py-4 bg-white border-2 border-slate-300 text-slate-900 rounded-xl font-bold text-lg hover:border-blue-600 hover:text-blue-600 transition-all"
                >
                  Créer un compte
                </button>
              </div>

              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2 text-slate-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-semibold">Pressings vérifiés</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="font-semibold">Prix transparents</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  <span className="font-semibold">Suivi en ligne</span>
                </div>
              </div>
            </motion.div>

            {/* Carrousel à droite */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative h-[600px]"
            >
              <HowItWorksCarousel />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-600">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center text-white">
            <div>
              <div className="text-5xl font-black mb-2">2600+</div>
              <p className="text-xl text-blue-100">Pressings partenaires en France et Belgique</p>
            </div>
            <div>
              <div className="text-5xl font-black mb-2">24h</div>
              <p className="text-xl text-blue-100">Service express selon disponibilité</p>
            </div>
            <div>
              <div className="text-5xl font-black mb-2">3,50€</div>
              <p className="text-xl text-blue-100">À partir de, lavage + séchage + pliage</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <p className="text-3xl font-black mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Kilolab
            </p>
            <p className="text-slate-400 mb-6">Votre pressing au kilo, simple et transparent</p>
            <div className="flex justify-center gap-6">
              <button onClick={() => navigate('/legal/cgu')} className="text-slate-400 hover:text-white transition">
                CGU
              </button>
              <button onClick={() => navigate('/legal/privacy')} className="text-slate-400 hover:text-white transition">
                Confidentialité
              </button>
              <button onClick={() => navigate('/legal/mentions-legales')} className="text-slate-400 hover:text-white transition">
                Mentions légales
              </button>
            </div>
            <p className="text-slate-500 mt-8 text-sm">© 2025 Kilolab. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
