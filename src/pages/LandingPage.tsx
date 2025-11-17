import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Shield, Package, Users, ChevronRight, Star, Search, Sparkles, Check, Menu, X, LogIn, Zap, Wind, Shirt } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-xl z-50 border-b border-purple-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div 
              onClick={() => navigate('/')}
              className="text-3xl font-black cursor-pointer bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent"
            >
              Kilolab
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#how" className="text-slate-700 hover:text-purple-600 transition font-semibold">
                Comment ça marche
              </a>
              <a href="#reviews" className="text-slate-700 hover:text-purple-600 transition font-semibold">
                Avis
              </a>
              <a href="#perfect-for" className="text-slate-700 hover:text-purple-600 transition font-semibold">
                Pour qui ?
              </a>
              <button
                onClick={() => navigate('/login')}
                className="flex items-center gap-2 px-5 py-2.5 text-slate-700 hover:text-purple-600 transition font-semibold"
              >
                <LogIn className="w-4 h-4" />
                Connexion
              </button>
              <button
                onClick={() => navigate('/partners-map')}
                className="px-6 py-3 rounded-full font-bold text-white shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600"
              >
                Trouver un pressing
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-700"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden mt-4 pb-4 space-y-3"
            >
              <a href="#how" className="block px-4 py-2 text-slate-700 hover:bg-purple-50 rounded-lg">
                Comment ça marche
              </a>
              <a href="#reviews" className="block px-4 py-2 text-slate-700 hover:bg-purple-50 rounded-lg">
                Avis
              </a>
              <a href="#perfect-for" className="block px-4 py-2 text-slate-700 hover:bg-purple-50 rounded-lg">
                Pour qui ?
              </a>
              <button
                onClick={() => navigate('/login')}
                className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-purple-50 rounded-lg"
              >
                Connexion
              </button>
              <button
                onClick={() => navigate('/partners-map')}
                className="block w-full px-6 py-3 rounded-full font-bold text-white text-center bg-gradient-to-r from-purple-600 to-pink-600"
              >
                Trouver un pressing
              </button>
            </motion.div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-block px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-sm font-bold mb-6 shadow-lg">
                🚀 2600+ pressings partenaires
              </div>
              <h1 className="text-6xl md:text-7xl font-black text-slate-900 mb-6 leading-tight">
                Votre pressing{' '}
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                  au kilo
                </span>
                <br />
                en point relais
              </h1>
              <p className="text-2xl text-slate-700 mb-4 font-semibold">
                Déposez votre linge près de chez vous, récupérez-le impeccable 24h plus tard.
              </p>
              <p className="text-lg text-slate-600 mb-10">
                Kilolab sélectionne pour vous les meilleurs pressings partenaires, au prix le plus juste. Simple, rapide, transparent.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={() => navigate('/partners-map')}
                  className="group px-8 py-5 rounded-2xl font-bold text-xl text-white shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600"
                >
                  Trouver un pressing
                  <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition" />
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="px-8 py-5 bg-white border-3 border-purple-300 text-slate-900 rounded-2xl font-bold text-xl hover:border-purple-500 hover:bg-purple-50 transition-all shadow-xl"
                >
                  Créer un compte
                </button>
              </div>
              <div className="flex flex-wrap gap-6">
                {[
                  { icon: Check, text: 'Pressings vérifiés', color: 'bg-green-500' },
                  { icon: Check, text: 'Prix transparents', color: 'bg-blue-500' },
                  { icon: Check, text: 'Suivi en ligne', color: 'bg-purple-500' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full ${item.color} flex items-center justify-center shadow-lg`}>
                      <item.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold text-slate-700">{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Illustration avec icônes */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 rounded-3xl p-12 shadow-2xl">
                <div className="grid grid-cols-2 gap-8">
                  {[
                    { icon: Shirt, label: 'Lavage', color: 'from-blue-500 to-cyan-500' },
                    { icon: Wind, label: 'Séchage', color: 'from-green-500 to-emerald-500' },
                    { icon: Package, label: 'Pliage', color: 'from-orange-500 to-red-500' },
                    { icon: Sparkles, label: 'Propre', color: 'from-purple-500 to-pink-500' },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className="bg-white rounded-2xl p-6 shadow-xl text-center"
                    >
                      <div className={`w-16 h-16 mx-auto mb-3 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center shadow-lg`}>
                        <item.icon className="w-8 h-8 text-white" />
                      </div>
                      <p className="font-bold text-slate-900">{item.label}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Badge flottant */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-2xl"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-slate-900">Service 24h</div>
                    <div className="text-sm text-slate-600">Express disponible</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="py-16 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 text-center text-white">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <div className="text-7xl font-black mb-3">2600+</div>
              <div className="text-xl">Pressings partenaires en France et Belgique</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="text-7xl font-black mb-3">24h</div>
              <div className="text-xl">Service express selon disponibilité</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-6xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Comment ça marche
            </h2>
            <p className="text-2xl text-slate-600 font-semibold">
              4 étapes simples pour un linge impeccable
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: '1',
                title: 'Trouvez votre pressing',
                description: 'Saisissez votre adresse et comparez les pressings partenaires autour de vous : prix, délai, proximité.',
                icon: Search,
                gradient: 'from-blue-500 to-cyan-400'
              },
              {
                step: '2',
                title: 'Déposez votre linge',
                description: 'Apportez votre linge dans un point relais partenaire. Nous pesons votre sac et validons votre commande.',
                icon: Package,
                gradient: 'from-purple-500 to-pink-500'
              },
              {
                step: '3',
                title: 'Nettoyage professionnel',
                description: 'Votre linge est lavé, séché et plié par des professionnels certifiés selon les normes du secteur.',
                icon: Sparkles,
                gradient: 'from-orange-500 to-red-500'
              },
              {
                step: '4',
                title: 'Récupérez-le propre',
                description: 'Récupérez votre linge prêt à ranger, au même point relais, au créneau indiqué.',
                icon: Check,
                gradient: 'from-green-500 to-emerald-500'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all h-full border-4 border-transparent hover:border-purple-300">
                  <div className={`w-20 h-20 bg-gradient-to-r ${item.gradient} rounded-3xl flex items-center justify-center text-white text-3xl font-black mb-6 shadow-xl group-hover:scale-110 transition`}>
                    {item.step}
                  </div>
                  <item.icon className="w-14 h-14 text-slate-700 mb-5" />
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">{item.description}</p>
                </div>
                {index < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ChevronRight className="w-10 h-10 text-purple-400" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-16">
            <button
              onClick={() => navigate('/partners-map')}
              className="px-12 py-6 rounded-2xl font-bold text-2xl text-white shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600"
            >
              Voir la carte des pressings
            </button>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="py-24 px-4 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-6xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Ils nous font confiance
            </h2>
            <p className="text-2xl text-slate-600 font-semibold">
              Des milliers d'utilisateurs simplifient leur quotidien avec Kilolab
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition border-4 border-purple-200"
              >
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-7 h-7 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-lg mb-6 leading-relaxed italic">
                  "Avis client réel à insérer ici."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
                  <div>
                    <p className="font-bold text-slate-900">Nom du client</p>
                    <p className="text-sm text-slate-500">Ville</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Perfect for */}
      <section id="perfect-for" className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-6xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Parfait pour
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { emoji: '👨‍👩‍👧‍👦', title: 'Familles', text: 'Déposez votre linge au pressing le plus proche, à prix maîtrisé.', color: 'from-blue-500 to-cyan-500' },
              { emoji: '💼', title: 'Professionnels', text: 'Gagnez du temps en déléguant vos lessives à nos points relais pratiques.', color: 'from-purple-500 to-pink-500' },
              { emoji: '🏢', title: 'Entreprises', text: 'Solution fiable pour vos équipes et vos besoins réguliers.', color: 'from-orange-500 to-red-500' },
              { emoji: '🎓', title: 'Étudiants', text: 'Tarifs accessibles et service rapide pour vous concentrer sur l\'essentiel.', color: 'from-green-500 to-emerald-500' }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group"
              >
                <div className={`bg-gradient-to-br ${item.color} rounded-3xl p-8 shadow-xl hover:shadow-2xl transition text-center h-full text-white`}>
                  <div className="text-7xl mb-5">{item.emoji}</div>
                  <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="py-24 px-4 bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16">
            {[
              {
                icon: Shield,
                title: 'Manipulation sûre et sécurisée',
                desc: 'Vos vêtements sont pris en charge avec soin par des professionnels expérimentés.',
                color: 'from-green-500 to-emerald-500'
              },
              {
                icon: Sparkles,
                title: 'Qualité professionnelle garantie',
                desc: 'Nos partenaires respectent les standards les plus exigeants de l\'industrie.',
                color: 'from-purple-500 to-pink-500'
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 bg-gradient-to-r ${item.color} shadow-2xl`}>
                  <item.icon className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-4">{item.title}</h3>
                <p className="text-slate-700 text-xl leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="text-4xl font-black mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Kilolab
              </div>
              <p className="text-slate-400">Votre pressing au kilo, en point relais</p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-xl">Services</h4>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#" className="hover:text-white transition">Laverie</a></li>
                <li><a href="#" className="hover:text-white transition">Pressing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-xl">Entreprise</h4>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#" className="hover:text-white transition">À propos</a></li>
                <li>
                  <button onClick={() => navigate('/become-partner')} className="hover:text-white transition text-left">
                    Devenir partenaire
                  </button>
                </li>
                <li><a href="mailto:contact@kilolab.fr" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-xl">Légal</h4>
              <ul className="space-y-3 text-slate-400">
                <li>
                  <button onClick={() => navigate('/legal/cgu')} className="hover:text-white transition text-left">
                    CGU
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/legal/privacy')} className="hover:text-white transition text-left">
                    Confidentialité
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/legal/mentions-legales')} className="hover:text-white transition text-left">
                    Mentions légales
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
            © 2025 Kilolab – Tous droits réservés
          </div>
        </div>
      </footer>
    </div>
  );
}
