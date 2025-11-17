#!/bin/bash

echo "🔧 Correction de la landing page..."

cat > src/pages/LandingPage.tsx << 'ENDOFFILE'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, MapPin, Clock, Shield, Package, Users, ChevronRight, Star, Search, Truck, CheckCircle } from 'lucide-react';
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
            <a href="#reviews" className="text-gray-700 hover:text-purple-600 transition">Avis</a>
            <button
              onClick={() => navigate('/login')}
              className="text-gray-700 hover:text-purple-600 transition font-medium"
            >
              Connexion
            </button>
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
                Votre pressing{' '}
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  au kilo
                </span>
                , livré chez vous
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Trouvez le pressing parfait près de chez vous. Simple, rapide, transparent.
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
                  onClick={() => navigate('/signup')}
                  className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-900 rounded-full font-semibold text-lg hover:border-purple-600 transition"
                >
                  Créer un compte
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
          <div className="grid md:grid-cols-2 gap-8 text-center text-white">
            <div>
              <div className="text-5xl font-bold mb-2">2600+</div>
              <div className="text-purple-100">Pressings partenaires</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">24h</div>
              <div className="text-purple-100">Service express disponible</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works - AMÉLIORÉ */}
      <section id="how" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Comment ça fonctionne
            </h2>
            <p className="text-xl text-gray-600">
              4 étapes simples pour un linge impeccable
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '1',
                title: 'Trouvez votre pressing',
                description: 'Parcourez la carte interactive et sélectionnez le pressing le plus proche de chez vous',
                icon: Search,
                color: 'from-blue-500 to-cyan-500'
              },
              {
                step: '2',
                title: 'Réservez en ligne',
                description: 'Choisissez vos services (lavage, repassage, pressing) et planifiez un créneau de ramassage',
                icon: Package,
                color: 'from-purple-500 to-pink-500'
              },
              {
                step: '3',
                title: 'Collecte à domicile',
                description: 'Un coursier passe récupérer votre linge à l\'heure convenue, directement chez vous',
                icon: Truck,
                color: 'from-orange-500 to-red-500'
              },
              {
                step: '4',
                title: 'Livraison express',
                description: 'Recevez votre linge propre et soigné en 24h ou 48h selon l\'option choisie',
                icon: CheckCircle,
                color: 'from-green-500 to-emerald-500'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition h-full border-2 border-gray-100 hover:border-purple-200">
                  <div className={`w-14 h-14 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center text-white text-xl font-bold mb-4 shadow-lg`}>
                    {item.step}
                  </div>
                  <item.icon className="w-10 h-10 text-gray-700 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                </div>
                {index < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ChevronRight className="w-6 h-6 text-purple-400" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => navigate('/partners-map')}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold text-lg hover:shadow-xl transition inline-flex items-center gap-2"
            >
              Commencer maintenant
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Pricing CTA */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Une lessive impeccable à un prix compétitif
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Prix transparents définis par nos partenaires. Comparez et choisissez.
          </p>
          <button
            onClick={() => navigate('/partners-map')}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold text-lg hover:shadow-xl transition inline-flex items-center gap-2"
          >
            Découvrir les pressings
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Capacité de traitement : jusqu'à 200 000 articles/semaine
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
          <div className="grid md:grid-cols-2 gap-12">
            {[
              {
                icon: Shield,
                title: 'Manipulation sûre et sécurisée',
                description: 'Vos objets sont manipulés avec soin selon les normes les plus strictes'
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

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                Kilolab
              </div>
              <p className="text-gray-400 text-sm">
                Votre pressing au kilo, livré chez vous
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
ENDOFFILE

echo "✅ Landing page corrigée !"
echo ""
echo "Changements appliqués:"
echo "✓ Accroche originale restaurée"
echo "✓ Section 'Comment ça marche' en 4 étapes détaillées"
echo "✓ Suppression stats '200k articles/semaine'"
echo "✓ Reformulation en 'Capacité de traitement'"
echo "✓ Suppression 'Une décennie de confiance'"
echo "✓ Bouton 'Voir les tarifs' → 'Découvrir les pressings' (vers carte)"
echo "✓ Ajout bouton Connexion dans nav"
echo "✓ Lien 'Devenir partenaire' dans footer"
echo ""
echo "Committez:"
echo "git add src/pages/LandingPage.tsx"
echo "git commit -m 'fix: improve landing page based on feedback'"
echo "git push"
ENDOFFILE
