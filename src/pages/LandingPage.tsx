import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Shield, Clock, Euro, Star, Users, MapPin, Sparkles, Award, Leaf, Gift, CheckCircle } from 'lucide-react';
import HowItWorksCarousel from '../components/HowItWorksCarousel';
import PriceComparator from '../components/PriceComparator';
import NewsletterFooter from '../components/NewsletterFooter';
import SchemaOrg from '../components/SchemaOrg';
import PageHead from '../components/PageHead';
import { useEffect, useState } from 'react';
import { promoService } from '../services/promoService';

export default function LandingPage() {
  const navigate = useNavigate();
  const [promoStats, setPromoStats] = useState({ freeMonthCount: 0, remainingSlots: 100 });

  useEffect(() => {
    loadPromoStats();
    const interval = setInterval(loadPromoStats, 60000);
    return () => clearInterval(interval);
  }, []);

  const loadPromoStats = async () => {
    const stats = await promoService.getPromoStats();
    setPromoStats(stats);
  };

  const features = [
    {
      icon: Shield,
      title: 'Pressings certifiés',
      description: 'Tous nos partenaires sont vérifiés'
    },
    {
      icon: Euro,
      title: 'Prix transparents',
      description: '3,50€/kg Standard ou 5€/kg Express'
    },
    {
      icon: Clock,
      title: 'Service rapide',
      description: 'Express 24h ou Standard 48-72h'
    },
    {
      icon: MapPin,
      title: '1854 points relais',
      description: 'Trouvez un pressing près de chez vous'
    },
    {
      icon: Sparkles,
      title: 'Qualité pro',
      description: 'Lavage, séchage et pliage professionnel'
    },
    {
      icon: Users,
      title: 'Support réactif',
      description: 'Notre équipe vous aide rapidement'
    }
  ];

  const whyKilolab = [
    {
      icon: Euro,
      title: 'Prix au kilo',
      description: 'Tarif simple et transparent'
    },
    {
      icon: Award,
      title: 'Partenaires qualité',
      description: 'Meilleurs pressings sélectionnés'
    },
    {
      icon: Zap,
      title: 'Ultra simple',
      description: 'Déposez, on s\'occupe du reste'
    },
    {
      icon: Clock,
      title: 'Ultra rapide',
      description: 'Linge impeccable en 24h'
    },
    {
      icon: Leaf,
      title: 'Éco-responsable',
      description: 'Process optimisés'
    }
  ];

  const testimonials = [
    {
      name: 'Sophie L.',
      role: 'Cliente régulière',
      content: 'Service impeccable ! Je dépose le matin, je récupère le soir.',
      rating: 5
    },
    {
      name: 'Marc D.',
      role: 'Utilisateur Express',
      content: 'Pratique et rapide. Prix clairs dès le départ.',
      rating: 5
    },
    {
      name: 'Julie M.',
      role: 'Maman de 3 enfants',
      content: 'Kilolab a changé ma vie ! Plus de montagne de linge.',
      rating: 5
    }
  ];

  return (
    <>
      <PageHead />
      <SchemaOrg type="Organization" />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-8">
                <button onClick={() => navigate('/')} className="text-2xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Kilolab
                </button>
                <div className="hidden md:flex items-center gap-6">
                  <button onClick={() => navigate('/about')} className="text-slate-600 hover:text-blue-600 font-semibold transition text-sm">
                    Comment ça marche
                  </button>
                  <button onClick={() => navigate('/pricing')} className="text-slate-600 hover:text-blue-600 font-semibold transition text-sm">
                    Tarifs
                  </button>
                  <button onClick={() => navigate('/faq')} className="text-slate-600 hover:text-blue-600 font-semibold transition text-sm">
                    FAQ
                  </button>
                  <button onClick={() => navigate('/about')} className="text-slate-600 hover:text-blue-600 font-semibold transition text-sm">
                    À propos
                  </button>
                  <button onClick={() => navigate('/blog')} className="text-slate-600 hover:text-blue-600 font-semibold transition text-sm">
                    Blog
                  </button>
                  <button onClick={() => navigate('/contact')} className="text-slate-600 hover:text-blue-600 font-semibold transition text-sm">
                    Contact
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => navigate('/login')} className="text-slate-600 hover:text-blue-600 font-semibold transition text-sm">
                  Connexion
                </button>
                <button
                  onClick={() => navigate('/partners-map')}
                  className="px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold hover:shadow-xl transition text-sm"
                >
                  Trouver un pressing
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="pt-24 pb-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold text-xs mb-4">
                  <Zap className="w-3 h-3" />
                  1854 pressings partenaires
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight mb-4">
                  <span className="block text-center lg:text-left">Le pressing</span>
                  <span className="block text-center lg:text-left bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    nouvelle
                  </span>
                  <span className="block text-center lg:text-left bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    génération.
                  </span>
                  <span className="block text-center lg:text-left text-3xl md:text-4xl mt-2">Au kilo. Sans effort.</span>
                </h1>

                <p className="text-lg md:text-xl text-slate-600 mb-4 leading-relaxed text-center lg:text-left">
                  Déposez votre linge en point relais, récupérez-le impeccable en 24h. 
                  <strong className="text-slate-900"> Vous gagnez du temps</strong>.
                </p>

                <div className="bg-blue-50 rounded-xl p-4 mb-6 border-2 border-blue-200">
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm">
                      <Euro className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">Prix au kilo transparents</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">Dépôt près de chez vous</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <Award className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">Qualité premium garantie</span>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                  <button
                    onClick={() => navigate('/partners-map')}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold hover:shadow-xl transition flex items-center justify-center gap-2"
                  >
                    Essayez maintenant
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => navigate('/pricing')}
                    className="px-6 py-3 bg-white border-2 border-slate-300 text-slate-900 rounded-xl font-bold hover:border-blue-600 transition"
                  >
                    Voir les tarifs
                  </button>
                </div>

                <div className="flex flex-wrap gap-4 text-xs justify-center lg:justify-start">
                  <div className="flex items-center gap-1 text-slate-600">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span className="font-semibold">Pressings vérifiés</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-600">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span className="font-semibold">Prix transparents</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="relative h-[400px]"
              >
                <HowItWorksCarousel />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-gradient-to-r from-blue-600 to-cyan-600">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-6 text-center text-white">
              <div>
                <div className="text-4xl font-black mb-1">1854</div>
                <p className="text-blue-100 text-sm">Pressings en France & Belgique</p>
              </div>
              <div>
                <div className="text-4xl font-black mb-1">24h</div>
                <p className="text-blue-100 text-sm">Service express</p>
              </div>
              <div>
                <div className="text-4xl font-black mb-1">3,50€</div>
                <p className="text-blue-100 text-sm">À partir de /kg</p>
              </div>
            </div>
          </div>
        </section>

        {/* Comparateur Prix */}
        <section className="py-12 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <PriceComparator />
          </div>
        </section>

        {/* Section Pourquoi Kilolab */}
        <section className="py-12 px-4 bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">
                Pourquoi Kilolab ?
              </h2>
              <p className="text-lg text-slate-600">
                Le pressing repensé. Simplifié. Accessible.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              {whyKilolab.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl p-4 hover:shadow-lg transition"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center mb-3">
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-600">{item.description}</p>
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={() => navigate('/partners-map')}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold hover:shadow-xl transition"
              >
                Simplifiez-vous la vie !
              </button>
            </div>
          </div>
        </section>

        {/* SECTION PROMO PRESSINGS PARTENAIRES */}
        <section className="py-12 px-4 bg-gradient-to-r from-green-600 to-emerald-600">
          <div className="max-w-5xl mx-auto text-center text-white">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
              <Gift className="w-5 h-5" />
              <span className="font-bold text-sm">OFFRE DE LANCEMENT</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              Pressings : 1er mois GRATUIT !
            </h2>
            
            <p className="text-xl text-green-100 mb-6">
              Offre limitée aux 100 premiers pressings
            </p>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
              <div className="flex items-center justify-center mb-4">
                <div>
                  <p className="text-5xl font-black mb-1 text-yellow-300">{promoStats.remainingSlots}</p>
                  <p className="text-green-100 text-lg">Places restantes</p>
                </div>
              </div>
              
              <div className="w-full bg-white/20 rounded-full h-3 mb-3">
                <div 
                  className="bg-white rounded-full h-3 transition-all duration-500"
                  style={{ width: `${100 - promoStats.remainingSlots}%` }}
                ></div>
              </div>
              
              <p className="text-sm text-green-100">
                ⚡ {promoStats.remainingSlots < 20 ? 'Dernières places !' : 'Offre limitée'}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                <h3 className="font-bold mb-1">0€ / 30 jours</h3>
                <p className="text-green-100 text-sm">Aucune commission</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <Star className="w-8 h-8 mx-auto mb-2" />
                <h3 className="font-bold mb-1">Puis 10% seulement</h3>
                <p className="text-green-100 text-sm">Commission la plus basse</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <Users className="w-8 h-8 mx-auto mb-2" />
                <h3 className="font-bold mb-1">Nouveaux clients</h3>
                <p className="text-green-100 text-sm">Notre base de clients</p>
              </div>
            </div>

            <button
              onClick={() => navigate('/become-partner')}
              className="px-10 py-4 bg-white text-green-600 rounded-xl font-black text-lg hover:shadow-2xl transition transform hover:scale-105"
            >
              Je deviens partenaire GRATUITEMENT
            </button>
          </div>
        </section>

        {/* Features */}
        <section className="py-12 px-4 bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl p-5 hover:shadow-lg transition"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center mb-3">
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-12 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">
                Ils nous font confiance
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5"
                >
                  <div className="flex gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-700 mb-4 italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{testimonial.name}</p>
                    <p className="text-xs text-slate-600">{testimonial.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-12 px-4 bg-gradient-to-r from-blue-600 to-cyan-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Prêt à simplifier votre quotidien ?
            </h2>
            <p className="text-lg text-blue-100 mb-6">
              Trouvez un pressing près de chez vous
            </p>
            <button
              onClick={() => navigate('/partners-map')}
              className="px-10 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:shadow-2xl transition transform hover:scale-105 inline-flex items-center gap-2"
            >
              Trouver un pressing
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </section>

        {/* Newsletter */}
        <NewsletterFooter />

        {/* Footer */}
        <footer className="bg-slate-900 text-white py-10">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <p className="text-2xl font-black mb-3 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Kilolab
                </p>
                <p className="text-slate-400 text-sm">
                  Le pressing nouvelle génération
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-3 text-sm">Services</h3>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><button onClick={() => navigate('/partners-map')} className="hover:text-white transition">Trouver un pressing</button></li>
                  <li><button onClick={() => navigate('/pricing')} className="hover:text-white transition">Tarifs</button></li>
                  <li><button onClick={() => navigate('/faq')} className="hover:text-white transition">FAQ</button></li>
                  <li><button onClick={() => navigate('/become-partner')} className="hover:text-white transition">Devenir partenaire</button></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-3 text-sm">Entreprise</h3>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><button onClick={() => navigate('/about')} className="hover:text-white transition">À propos</button></li>
                  <li><button onClick={() => navigate('/blog')} className="hover:text-white transition">Blog</button></li>
                  <li><button onClick={() => navigate('/contact')} className="hover:text-white transition">Contact</button></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-3 text-sm">Légal</h3>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><button onClick={() => navigate('/legal/cgu')} className="hover:text-white transition">CGU</button></li>
                  <li><button onClick={() => navigate('/legal/privacy')} className="hover:text-white transition">Confidentialité</button></li>
                  <li><button onClick={() => navigate('/legal/mentions-legales')} className="hover:text-white transition">Mentions légales</button></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-slate-800 pt-6 text-center text-slate-500 text-xs">
              <p>© 2025 Kilolab. Tous droits réservés.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
