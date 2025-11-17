import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Shield, Zap, Star, Check, ChevronRight, Menu, X, LogIn, Sparkles, TrendingUp, Users, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar fixe */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-xl z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => navigate('/')}
              className="text-3xl font-black cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Kilolab
            </motion.div>

            {/* Menu Desktop */}
            <div className="hidden lg:flex items-center gap-8">
              <a href="#how" className="text-slate-600 hover:text-purple-600 font-medium transition">
                Comment ça marche
              </a>
              <a href="#reviews" className="text-slate-600 hover:text-purple-600 font-medium transition">
                Avis
              </a>
              <a href="#perfect-for" className="text-slate-600 hover:text-purple-600 font-medium transition">
                Pour qui ?
              </a>
              <button
                onClick={() => navigate('/login')}
                className="flex items-center gap-2 text-slate-600 hover:text-purple-600 font-medium transition"
              >
                <LogIn className="w-4 h-4" />
                Connexion
              </button>
              <button
                onClick={() => navigate('/partners-map')}
                className="px-6 py-3 rounded-full font-bold text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
              >
                Trouver un pressing
              </button>
            </div>

            {/* Burger Mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Menu Mobile */}
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:hidden pb-6 space-y-3"
            >
              <a href="#how" className="block px-4 py-3 text-slate-700 hover:bg-purple-50 rounded-lg">
                Comment ça marche
              </a>
              <a href="#reviews" className="block px-4 py-3 text-slate-700 hover:bg-purple-50 rounded-lg">
                Avis
              </a>
              <a href="#perfect-for" className="block px-4 py-3 text-slate-700 hover:bg-purple-50 rounded-lg">
                Pour qui ?
              </a>
              <button
                onClick={() => navigate('/login')}
                className="block w-full text-left px-4 py-3 text-slate-700 hover:bg-purple-50 rounded-lg"
              >
                Connexion
              </button>
              <button
                onClick={() => navigate('/partners-map')}
                className="block w-full px-6 py-3 rounded-full font-bold text-white text-center"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
              >
                Trouver un pressing
              </button>
            </motion.div>
          )}
        </div>
      </nav>

      {/* HERO - Version Ultra Moderne */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden bg-gradient-to-b from-slate-50 to-white">
        {/* Arrière-plan animé */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute top-40 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute bottom-20 left-40 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Texte */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-bold text-purple-900">2600+ pressings partenaires</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 leading-tight">
                Votre pressing<br />
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  au kilo
                </span>
                <br />
                en point relais
              </h1>

              <p className="text-xl md:text-2xl text-slate-600 mb-4 leading-relaxed">
                Trouvez le pressing parfait près de chez vous.
              </p>
              <p className="text-lg text-slate-500 mb-10">
                Simple, rapide, transparent.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <button
                  onClick={() => navigate('/partners-map')}
                  className="group px-8 py-5 rounded-2xl font-bold text-lg text-white shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 flex items-center justify-center gap-3"
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  }}
                >
                  Trouver un pressing
                  <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition" />
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="px-8 py-5 bg-white border-2 border-slate-300 text-slate-900 rounded-2xl font-bold text-lg hover:border-purple-500 hover:bg-slate-50 transition-all"
                >
                  Créer un compte
                </button>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap gap-6">
                {[
                  { icon: Check, text: 'Pressings vérifiés' },
                  { icon: Check, text: 'Prix transparents' },
                  { icon: Check, text: 'Suivi en ligne' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-slate-600">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Image Hero */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/5591663/pexels-photo-5591663.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Pressing professionnel"
                  className="w-full h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/30 to-transparent" />
              </div>

              {/* Badge flottant */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="absolute -bottom-8 -left-8 bg-white rounded-2xl p-6 shadow-2xl"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-600">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-slate-900">Service 24h</div>
                    <div className="text-sm text-slate-500">Express disponible</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bandeau Stats */}
      <section className="py-16 relative overflow-hidden">
        <div 
          className="absolute inset-0 -z-10"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        />
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 text-center text-white">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <div className="text-6xl md:text-7xl font-black mb-3">2600+</div>
              <div className="text-xl text-purple-100">Pressings partenaires en France et Belgique</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="text-6xl md:text-7xl font-black mb-3">24h</div>
              <div className="text-xl text-purple-100">Service express selon disponibilité</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section id="how" className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-4">
              Comment ça marche
            </h2>
            <p className="text-xl text-slate-600">4 étapes simples pour un linge impeccable</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                num: '1',
                icon: MapPin,
                title: 'Trouvez votre pressing',
                desc: 'Saisissez votre adresse et comparez les pressings partenaires autour de vous : prix, délai, proximité.',
                color: 'from-blue-500 to-cyan-500'
              },
              {
                num: '2',
                icon: Clock,
                title: 'Déposez votre linge',
                desc: 'Apportez votre linge dans un point relais partenaire. Nous pesons votre sac et validons en quelques secondes.',
                color: 'from-purple-500 to-pink-500'
              },
              {
                num: '3',
                icon: Sparkles,
                title: 'Nettoyage professionnel',
                desc: 'Votre linge est lavé, séché et plié par des professionnels certifiés selon les normes du secteur.',
                color: 'from-orange-500 to-red-500'
              },
              {
                num: '4',
                icon: Check,
                title: 'Récupérez-le propre',
                desc: 'Récupérez votre linge prêt à ranger, au même point relais, au créneau indiqué.',
                color: 'from-green-500 to-emerald-500'
              }
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative group"
              >
                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all border border-slate-200 hover:border-purple-300 h-full">
                  <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center text-white text-2xl font-black mb-6 shadow-lg group-hover:scale-110 transition`}>
                    {step.num}
                  </div>
                  <step.icon className="w-10 h-10 text-slate-700 mb-4" />
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">{step.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{step.desc}</p>
                </div>
                {i < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 z-10">
                    <ChevronRight className="w-8 h-8 text-purple-300" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-16">
            <button
              onClick={() => navigate('/partners-map')}
              className="px-10 py-5 rounded-2xl font-bold text-xl text-white shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
            >
              Voir la carte des pressings
            </button>
          </div>
        </div>
      </section>

      {/* Avis clients */}
      <section id="reviews" className="py-24 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-4">
              Ils nous font confiance
            </h2>
            <p className="text-xl text-slate-600">
              Des milliers d'utilisateurs simplifient leur quotidien avec Kilolab
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition"
              >
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-lg mb-6 leading-relaxed italic">
                  "Avis client réel à insérer ici."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
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

      {/* Parfait pour */}
      <section id="perfect-for" className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-4">
              Parfait pour
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { emoji: '👨‍👩‍👧‍👦', title: 'Familles', text: 'Déposez votre linge au pressing le plus proche, à prix maîtrisé.' },
              { emoji: '💼', title: 'Professionnels', text: 'Gagnez du temps en déléguant vos lessives à nos points relais pratiques.' },
              { emoji: '🏢', title: 'Entreprises', text: 'Solution fiable pour vos équipes et vos besoins réguliers.' },
              { emoji: '🎓', title: 'Étudiants', text: 'Tarifs accessibles et service rapide pour vous concentrer sur l\'essentiel.' }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group"
              >
                <div className="bg-gradient-to-br from-slate-50 to-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition border border-slate-200 group-hover:border-purple-300 text-center h-full">
                  <div className="text-6xl mb-5">{item.emoji}</div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-600">{item.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="py-24 px-4 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16">
            {[
              {
                icon: Shield,
                title: 'Manipulation sûre et sécurisée',
                desc: 'Vos vêtements sont pris en charge avec soin par des professionnels expérimentés.'
              },
              {
                icon: Award,
                title: 'Qualité professionnelle garantie',
                desc: 'Nos partenaires respectent les standards les plus exigeants de l\'industrie.'
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
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg">
                  <item.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{item.title}</h3>
                <p className="text-slate-600 text-lg leading-relaxed">{item.desc}</p>
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
              <div className="text-3xl font-black mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Kilolab
              </div>
              <p className="text-slate-400">Votre pressing au kilo, en point relais</p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-lg">Services</h4>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#" className="hover:text-white transition">Laverie</a></li>
                <li><a href="#" className="hover:text-white transition">Pressing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-lg">Entreprise</h4>
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
              <h4 className="font-bold mb-4 text-lg">Légal</h4>
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

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
