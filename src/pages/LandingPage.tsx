import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, MapPin, Clock, Shield, Package, Users, ChevronRight, Star, Search, Truck, CheckCircle, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  const benefits = [
    {
      icon: '👨‍👩‍👧‍👦',
      title: 'Familles',
      description: 'Déposez votre linge au pressing près de chez vous',
    },
    {
      icon: '💼',
      title: 'Professionnels',
      description: 'Gagnez du temps avec nos points relais pratiques',
    },
    {
      icon: '🏢',
      title: 'Entreprises',
      description: 'Solution professionnelle pour vos équipes',
    },
    {
      icon: '✨',
      title: 'Étudiants',
      description: 'Tarifs accessibles, service de qualité',
    }
  ];

  const reviews = [
    {
      name: 'Sophie M.',
      text: 'Pressing à 5 min de chez moi, super pratique ! Prix au kilo très avantageux.',
      rating: 5
    },
    {
      name: 'Thomas L.',
      text: 'J\'ai trouvé mon pressing habituel sur Kilolab. Interface claire et simple.',
      rating: 5
    },
    {
      name: 'Marie D.',
      text: 'Idéal pour comparer les pressings du quartier. Je recommande !',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header/Nav */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div 
              onClick={() => navigate('/')}
              className="text-3xl font-black cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Kilolab
            </div>
            <div className="flex items-center gap-6">
              <a href="#how" className="hidden md:block text-slate-700 hover:text-purple-600 transition font-medium">
                Comment ça marche
              </a>
              <a href="#reviews" className="hidden md:block text-slate-700 hover:text-purple-600 transition font-medium">
                Avis
              </a>
              <button
                onClick={() => navigate('/login')}
                className="flex items-center gap-2 px-5 py-2.5 text-slate-700 hover:text-purple-600 transition font-medium"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Connexion</span>
              </button>
              <button
                onClick={() => navigate('/partners-map')}
                className="px-6 py-2.5 rounded-full font-semibold text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
              >
                Trouver un pressing
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-6">
                🚀 Réseau de 2600+ pressings partenaires
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 leading-tight">
                Votre pressing{' '}
                <span 
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  au kilo
                </span>
                <br />en point relais
              </h1>
              <p className="text-xl text-slate-600 mb-10 leading-relaxed">
                Trouvez le pressing parfait près de chez vous. <br />
                Simple, rapide, transparent.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/partners-map')}
                  className="group px-8 py-4 rounded-full font-bold text-lg text-white shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 flex items-center justify-center gap-3"
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  }}
                >
                  Trouver un pressing
                  <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition" />
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="px-8 py-4 bg-white border-2 border-slate-300 text-slate-900 rounded-full font-bold text-lg hover:border-purple-500 hover:bg-slate-50 transition"
                >
                  Créer un compte
                </button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/5591666/pexels-photo-5591666.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Pressing moderne"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent" />
              </div>
              {/* Floating card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    }}
                  >
                    ⚡
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Service 24h</div>
                    <div className="text-sm text-slate-600">Express disponible</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-20 right-0 -z-10 w-96 h-96 bg-purple-300 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-20 left-0 -z-10 w-96 h-96 bg-pink-300 rounded-full blur-3xl opacity-20" />
      </section>

      {/* Stats */}
      <section className="py-20" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-6xl font-black mb-3">2600+</div>
              <div className="text-xl text-purple-100">Pressings partenaires en France et Belgique</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="text-6xl font-black mb-3">24h</div>
              <div className="text-xl text-purple-100">Service express disponible</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-6">
              Comment ça marche
            </h2>
            <p className="text-xl text-slate-600">
              4 étapes simples pour un linge impeccable
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: '1',
                title: 'Trouvez votre pressing',
                description: 'Parcourez notre carte interactive et sélectionnez le pressing le plus proche',
                icon: Search,
                gradient: 'from-blue-500 to-cyan-400'
              },
              {
                step: '2',
                title: 'Déposez votre linge',
                description: 'Rendez-vous au pressing avec votre linge. Tarification au kilo, simple et claire',
                icon: Package,
                gradient: 'from-purple-500 to-pink-500'
              },
              {
                step: '3',
                title: 'Nettoyage professionnel',
                description: 'Votre linge est nettoyé avec soin selon vos besoins (lavage, pressing)',
                icon: Sparkles,
                gradient: 'from-orange-500 to-red-500'
              },
              {
                step: '4',
                title: 'Récupérez-le propre',
                description: 'Retirez votre linge propre, plié et prêt à porter au pressing',
                icon: CheckCircle,
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
                <div className="bg-gradient-to-br from-slate-50 to-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all h-full border border-slate-200 group-hover:border-purple-300">
                  <div className={`w-16 h-16 bg-gradient-to-r ${item.gradient} rounded-2xl flex items-center justify-center text-white text-2xl font-black mb-6 shadow-lg group-hover:scale-110 transition`}>
                    {item.step}
                  </div>
                  <item.icon className="w-12 h-12 text-slate-700 mb-5" />
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">{item.description}</p>
                </div>
                {index < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ChevronRight className="w-8 h-8 text-purple-300" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-16">
            <button
              onClick={() => navigate('/partners-map')}
              className="px-10 py-5 rounded-full font-bold text-xl text-white shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
            >
              Voir la carte des pressings
            </button>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="py-24 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-6">
              Ils nous font confiance
            </h2>
            <p className="text-xl text-slate-600">
              Capacité de traitement : jusqu'à 200 000 articles/semaine
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition"
              >
                <div className="flex gap-1 mb-5">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-lg mb-6 leading-relaxed">{review.text}</p>
                <p className="font-bold text-slate-900">{review.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Perfect for section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-black text-slate-900 text-center mb-16">
            Parfait pour
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition border border-slate-200 group-hover:border-purple-300 text-center">
                  <div className="text-6xl mb-5">{benefit.icon}</div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-slate-600">{benefit.description}</p>
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
                description: 'Vos vêtements sont traités avec le plus grand soin par des professionnels expérimentés'
              },
              {
                icon: Sparkles,
                title: 'Qualité professionnelle garantie',
                description: 'Nos partenaires respectent les standards les plus élevés de l\'industrie du pressing'
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  }}
                >
                  <item.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{item.title}</h3>
                <p className="text-slate-600 text-lg leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="text-3xl font-black mb-4"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Kilolab
              </div>
              <p className="text-slate-400">
                Votre pressing au kilo, en point relais
              </p>
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
                  <button 
                    onClick={() => navigate('/become-partner')}
                    className="hover:text-white transition text-left"
                  >
                    Devenir partenaire
                  </button>
                </li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-lg">Légal</h4>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#" className="hover:text-white transition">CGU</a></li>
                <li><a href="#" className="hover:text-white transition">Confidentialité</a></li>
                <li><a href="#" className="hover:text-white transition">Mentions légales</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
            © 2025 Kilolab - Tous droits réservés
          </div>
        </div>
      </footer>
    </div>
  );
}
