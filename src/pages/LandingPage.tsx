import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, MapPin, Clock, Shield, Package, TrendingUp, Users, ChevronRight, Star, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  const benefits = [
    {
      icon: '👨‍👩‍👧‍👦',
      title: 'Familles',
      description: 'Passez du temps avec vos proches, pas avec votre linge',
      image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&h=400&fit=crop'
    },
    {
      icon: '💼',
      title: 'Professionnels',
      description: 'Concentrez-vous sur votre carrière, on s\'occupe du reste',
      image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&h=400&fit=crop'
    },
    {
      icon: '🏢',
      title: 'Entreprises',
      description: '6 heures supplémentaires par mois pour votre business',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop'
    },
    {
      icon: '✨',
      title: 'Vous',
      description: 'Plus de temps pour vous, moins de temps pour la lessive',
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=400&fit=crop'
    }
  ];

  const reviews = [
    {
      name: 'Sophie M.',
      text: 'Service impeccable ! Mon linge revient toujours propre et parfaitement plié. Je gagne un temps fou.',
      rating: 5
    },
    {
      name: 'Thomas L.',
      text: 'Application facile à utiliser, prix raisonnables et chauffeurs toujours ponctuels. Je recommande !',
      rating: 5
    },
    {
      name: 'Marie D.',
      text: 'Parfait pour les familles occupées. Ramassage et livraison à domicile, c\'est génial.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header/Nav */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Kilolab
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#how" className="text-gray-700 hover:text-purple-600 transition">Comment ça marche</a>
            <a href="#pricing" className="text-gray-700 hover:text-purple-600 transition">Tarifs</a>
            <a href="#reviews" className="text-gray-700 hover:text-purple-600 transition">Avis</a>
            <button
              onClick={() => navigate('/partners-map')}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:shadow-lg transition"
            >
              Trouver un pressing
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Service de laverie & pressing en{' '}
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  24h
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Reprenez votre temps. Laissez-nous nous occuper du linge.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/partners-map')}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold text-lg hover:shadow-xl transition flex items-center justify-center gap-2 group"
                >
                  Trouver un pressing
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                </button>
                <button
                  onClick={() => navigate('/become-partner')}
                  className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-900 rounded-full font-semibold text-lg hover:border-purple-600 transition"
                >
                  Devenir partenaire
                </button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative h-96 lg:h-full"
            >
              <img
                src="https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=800&h=600&fit=crop"
                alt="Service pressing"
                className="w-full h-full object-cover rounded-3xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-0 left-0 -z-10 w-96 h-96 bg-pink-200 rounded-full blur-3xl opacity-20" />
      </section>

      {/* Stats */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center text-white">
            <div>
              <div className="text-5xl font-bold mb-2">2600+</div>
              <div className="text-purple-100">Pressings partenaires</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">200k+</div>
              <div className="text-purple-100">Articles nettoyés/semaine</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">24h</div>
              <div className="text-purple-100">Service express</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Comment ça fonctionne
            </h2>
            <p className="text-xl text-gray-600">
              Simple, rapide et sans effort
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Réservez et préparez',
                description: 'Choisissez votre pressing et planifiez un ramassage au moment qui vous convient',
                icon: Package
              },
              {
                step: '2',
                title: 'Nettoyé avec soin',
                description: 'Votre linge est collecté et nettoyé soigneusement par nos partenaires locaux',
                icon: Sparkles
              },
              {
                step: '3',
                title: 'Livraison gratuite',
                description: 'Détendez-vous pendant que nous livrons vos articles frais à votre porte',
                icon: Clock
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6">
                  {item.step}
                </div>
                <item.icon className="w-12 h-12 text-purple-600 mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing CTA */}
      <section id="pricing" className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Une lessive impeccable à un prix que vous adorerez
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Prix compétitifs, qualité garantie. Découvrez nos tarifs transparents.
          </p>
          <button
            onClick={() => navigate('/partners-map')}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold text-lg hover:shadow-xl transition inline-flex items-center gap-2"
          >
            Voir les tarifs
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              200 000 articles nettoyés chaque semaine
            </h2>
            <p className="text-xl text-gray-600">
              Ce que disent nos clients
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">{review.text}</p>
                <p className="font-semibold text-gray-900">{review.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Perfect for section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-16">
            Parfait pour
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
                onClick={() => setActiveTab(index)}
              >
                <div className={`rounded-2xl overflow-hidden shadow-lg transition ${
                  activeTab === index ? 'ring-4 ring-purple-600' : ''
                }`}>
                  <img
                    src={benefit.image}
                    alt={benefit.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition duration-500"
                  />
                  <div className="p-6 bg-white">
                    <div className="text-4xl mb-3">{benefit.icon}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{benefit.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: Shield,
                title: 'Manipulation sûre et sécurisée',
                description: 'Vos objets sont manipulés avec soin selon les normes les plus strictes'
              },
              {
                icon: TrendingUp,
                title: 'Une décennie de confiance',
                description: 'Des milliers de clients satisfaits et une réputation de fiabilité'
              },
              {
                icon: Sparkles,
                title: 'Des soins de première qualité',
                description: 'Chaque article reçoit le traitement dont il a besoin'
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <item.icon className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <Users className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Vous êtes pressing ?
          </h2>
          <p className="text-xl mb-8 text-purple-100">
            Rejoignez notre réseau et développez votre activité
          </p>
          <button
            onClick={() => navigate('/become-partner')}
            className="px-8 py-4 bg-white text-purple-600 rounded-full font-semibold text-lg hover:shadow-xl transition"
          >
            Devenir partenaire gratuitement
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                Kilolab
              </div>
              <p className="text-gray-400 text-sm">
                Le pressing nouvelle génération
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition">Laverie</a></li>
                <li><a href="#" className="hover:text-white transition">Pressing</a></li>
                <li><a href="#" className="hover:text-white transition">Repassage</a></li>
                <li><a href="#" className="hover:text-white transition">Retouches</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Entreprise</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition">À propos</a></li>
                <li><a href="#" className="hover:text-white transition">Devenir partenaire</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition">CGU</a></li>
                <li><a href="#" className="hover:text-white transition">Confidentialité</a></li>
                <li><a href="#" className="hover:text-white transition">Mentions légales</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            © 2025 Kilolab - Tous droits réservés
          </div>
        </div>
      </footer>
    </div>
  );
}
