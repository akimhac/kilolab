import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Shield, Clock, Euro, Star, Users, MapPin, Sparkles, Award, TrendingUp, Leaf } from 'lucide-react';
import HowItWorksCarousel from '../components/HowItWorksCarousel';

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Shield,
      title: 'Pressings certifiés',
      description: 'Tous nos partenaires sont vérifiés et répondent à nos standards de qualité'
    },
    {
      icon: Euro,
      title: 'Prix transparents',
      description: 'Standard 3,50€/kg ou Express 5€/kg. Ce que vous voyez, c\'est ce que vous payez'
    },
    {
      icon: Clock,
      title: 'Service rapide',
      description: 'Formule Express 24h ou Standard 48-72h selon vos besoins'
    },
    {
      icon: MapPin,
      title: '2600+ points relais',
      description: 'Trouvez facilement un pressing partenaire près de chez vous ou de votre travail'
    },
    {
      icon: Sparkles,
      title: 'Qualité pro',
      description: 'Lavage, séchage et pliage professionnel avec du matériel de dernière génération'
    },
    {
      icon: Users,
      title: 'Support réactif',
      description: 'Une question ? Notre équipe est là pour vous aider rapidement'
    }
  ];

  const whyKilolab = [
    {
      icon: Euro,
      title: 'Prix au kilo',
      description: 'Nous offrons un tarif simple et transparent'
    },
    {
      icon: Award,
      title: 'Partenaires de qualité',
      description: 'Nous sélectionnons les meilleurs pressings pour vous offrir une qualité premium'
    },
    {
      icon: Zap,
      title: 'Simplicité d\'utilisation',
      description: 'Déposez, nous nous chargeons du reste'
    },
    {
      icon: Clock,
      title: 'Service ultra-rapide',
      description: 'Recevez votre linge impeccable en 24h'
    },
    {
      icon: Leaf,
      title: 'Respect de l\'environnement',
      description: 'Des process optimisés et des partenaires responsables'
    }
  ];

  const testimonials = [
    {
      name: 'Sophie L.',
      role: 'Cliente régulière',
      content: 'Service impeccable ! Le pressing près de mon bureau est top, je dépose le matin et récupère le soir. Plus besoin de gérer ma lessive le week-end.',
      rating: 5
    },
    {
      name: 'Marc D.',
      role: 'Utilisateur Express',
      content: 'Pratique et rapide. Les prix sont clairs dès le départ, pas de surprise. La formule Express m\'a sauvé plusieurs fois avant des rendez-vous importants.',
      rating: 5
    },
    {
      name: 'Julie M.',
      role: 'Maman de 3 enfants',
      content: 'Kilolab a changé ma vie ! Avec 3 enfants, la montagne de linge était ingérable. Maintenant je dépose tout au pressing du quartier et je récupère propre et plié.',
      rating: 5
    }
  ];

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
                  Tarifs
                </button>
                <button onClick={() => navigate('/about')} className="text-slate-600 hover:text-blue-600 font-semibold transition">
                  À propos
                </button>
                <button onClick={() => navigate('/for-who')} className="text-slate-600 hover:text-blue-600 font-semibold transition">
                  Pour qui ?
                </button>
                <button onClick={() => navigate('/blog')} className="text-slate-600 hover:text-blue-600 font-semibold transition">
                  Blog
                </button>
                <button onClick={() => navigate('/contact')} className="text-slate-600 hover:text-blue-600 font-semibold transition">
                  Contact
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
                Le pressing
                <span className="block bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  nouvelle génération.
                </span>
                <span className="block">Au kilo. Sans effort.</span>
                <span className="block">Tout près de chez vous.</span>
              </h1>

              <p className="text-xl md:text-2xl text-slate-600 mb-6 leading-relaxed">
                Déposez votre linge en point relais, récupérez-le impeccable en 24h. 
                <strong className="text-slate-900"> Vous gagnez du temps, on s'occupe du reste.</strong>
              </p>

              <div className="bg-blue-50 rounded-2xl p-6 mb-8 border-2 border-blue-200">
                <p className="text-lg text-slate-700 mb-4 font-semibold">
                  Kilolab simplifie totalement le pressing :
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Euro className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-slate-700">Prix au kilo, transparents et sans surprise</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-slate-700">Dépôt près de chez vous, en point relais</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Award className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-slate-700">Qualité premium garantie par nos pressings partenaires</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-slate-700">Service rapide, simple, intelligent</span>
                  </li>
                </ul>
                <p className="text-slate-800 font-semibold mt-4">
                  Votre linge revient propre, soigné, repassé. Vous, vous ne faites rien.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={() => navigate('/partners-map')}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  Essayez Kilolab maintenant
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => navigate('/pricing')}
                  className="px-8 py-4 bg-white border-2 border-slate-300 text-slate-900 rounded-xl font-bold text-lg hover:border-blue-600 hover:text-blue-600 transition-all"
                >
                  Voir les tarifs
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="text-5xl font-black mb-2">2600+</div>
              <p className="text-xl text-blue-100">Pressings partenaires en France et Belgique</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-5xl font-black mb-2">24h</div>
              <p className="text-xl text-blue-100">Service express disponible</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="text-5xl font-black mb-2">3,50€</div>
              <p className="text-xl text-blue-100">À partir de, lavage + séchage + pliage</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* NOUVELLE SECTION : Pourquoi Kilolab ? */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
              Pourquoi Kilolab ?
            </h2>
            <p className="text-2xl text-slate-600 mb-6">
              Le pressing repensé. Simplifié. Accessible.
            </p>
            <p className="text-lg text-slate-600 max-w-4xl mx-auto leading-relaxed">
              Kilolab révolutionne votre expérience de pressing en la rendant simple, rapide et sans effort. 
              Fini les longues attentes et déplacements inutiles : vous déposez votre linge dans un point relais 
              proche de chez vous et le récupérez propre en 24h.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {whyKilolab.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 hover:shadow-xl transition-all"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center mb-4">
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-xl font-bold text-slate-900 mb-6">
              Voici pourquoi Kilolab est le choix idéal pour vous
            </p>
            <button
              onClick={() => navigate('/partners-map')}
              className="px-12 py-5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold text-xl hover:shadow-2xl transition-all transform hover:scale-105"
            >
              Simplifiez-vous la vie maintenant !
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              4 étapes simples pour un linge impeccable
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 hover:shadow-xl transition-all"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
              Ils nous font confiance
            </h2>
            <p className="text-xl text-slate-600">
              Des milliers de clients satisfaits
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 shadow-lg"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-700 leading-relaxed mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-bold text-slate-900">{testimonial.name}</p>
                  <p className="text-sm text-slate-600">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-cyan-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Prêt à simplifier votre quotidien ?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Trouvez un pressing près de chez vous en quelques clics
            </p>
            <button
              onClick={() => navigate('/partners-map')}
              className="px-12 py-5 bg-white text-blue-600 rounded-xl font-bold text-xl hover:shadow-2xl transition-all transform hover:scale-105 inline-flex items-center gap-3"
            >
              Trouver un pressing
              <ArrowRight className="w-6 h-6" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <p className="text-3xl font-black mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Kilolab
              </p>
              <p className="text-slate-400">
                Le pressing nouvelle génération
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Services</h3>
              <ul className="space-y-2 text-slate-400">
                <li><button onClick={() => navigate('/partners-map')} className="hover:text-white transition">Trouver un pressing</button></li>
                <li><button onClick={() => navigate('/pricing')} className="hover:text-white transition">Tarifs</button></li>
                <li><button onClick={() => navigate('/become-partner')} className="hover:text-white transition">Devenir partenaire</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Entreprise</h3>
              <ul className="space-y-2 text-slate-400">
                <li><button onClick={() => navigate('/about')} className="hover:text-white transition">À propos</button></li>
                <li><button onClick={() => navigate('/blog')} className="hover:text-white transition">Blog</button></li>
                <li><button onClick={() => navigate('/contact')} className="hover:text-white transition">Contact</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Légal</h3>
              <ul className="space-y-2 text-slate-400">
                <li><button onClick={() => navigate('/legal/cgu')} className="hover:text-white transition">CGU</button></li>
                <li><button onClick={() => navigate('/legal/privacy')} className="hover:text-white transition">Confidentialité</button></li>
                <li><button onClick={() => navigate('/legal/mentions-legales')} className="hover:text-white transition">Mentions légales</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-500 text-sm">
            <p>© 2025 Kilolab. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
