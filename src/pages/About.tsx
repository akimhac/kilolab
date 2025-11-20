import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plane, Lightbulb, Users, Target, Heart, Sparkles, MapPin, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function About() {
  const navigate = useNavigate();

  const values = [
    {
      icon: Heart,
      title: 'Simplicité',
      description: 'Rendre le pressing accessible à tous, sans complexité inutile'
    },
    {
      icon: Users,
      title: 'Transparence',
      description: 'Des prix clairs au kilo, pas de frais cachés, pas de surprise'
    },
    {
      icon: Sparkles,
      title: 'Qualité',
      description: 'Sélectionner uniquement les meilleurs pressings partenaires'
    },
    {
      icon: Target,
      title: 'Proximité',
      description: 'Un réseau de 2600+ points relais pour vous faciliter la vie'
    }
  ];

  const timeline = [
    {
      year: '2022',
      title: 'Le déclic en Asie',
      description: 'Lors d\'un long voyage en Thaïlande et au Vietnam, une observation qui change tout : les services de pressing au kilo sont partout, ultra-efficaces, et accessibles. Le matin on dépose, le soir on récupère. Simple, rapide, transparent. Le contraste avec l\'Europe est frappant.'
    },
    {
      year: '2023',
      title: 'Retour en France et constat',
      description: 'De retour à Paris, le choc : les pressings traditionnels sont opaques, compliqués, et chers. Tarifs à la pièce incompréhensibles, délais longs, qualité variable. L\'idée germe : adapter le modèle asiatique à l\'Europe avec des standards de qualité premium.'
    },
    {
      year: '2024',
      title: 'Naissance de Kilolab',
      description: 'Création de Kilolab : démocratiser le pressing au kilo en France et Belgique. Connecter les particuliers avec un réseau de pressings de qualité, à des tarifs transparents et accessibles. La mission : simplifier radicalement l\'expérience pressing.'
    },
    {
      year: '2025',
      title: 'Aujourd\'hui',
      description: '2600+ pressings partenaires, des milliers de clients satisfaits, et une ambition : devenir la référence du pressing au kilo en Europe. Le pressing nouvelle génération est né.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition"
            >
              <ArrowLeft className="w-5 h-5" />
              Retour
            </button>
            <button
              onClick={() => navigate('/')}
              className="text-3xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"
            >
              Kilolab
            </button>
            <div className="w-20"></div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full font-semibold text-sm mb-6">
              <Plane className="w-4 h-4" />
              Notre histoire
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6">
              D'une observation en Asie à une{' '}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                révolution européenne
              </span>
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              Comment un voyage à l'autre bout du monde a inspiré la création de Kilolab, 
              le service de pressing au kilo qui simplifie la vie de milliers de personnes.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story - Voyage en Asie */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-6">
                <Plane className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl font-black text-slate-900 mb-6">
                Bangkok, 2022 : L'étincelle
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-4">
                C'était un mardi matin à Bangkok. Après des semaines de voyage à travers la Thaïlande, 
                le sac à dos débordait de linge sale. En cherchant une solution, impossible de louper 
                les <strong>dizaines d'échoppes de "Laundry Service"</strong> à chaque coin de rue.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed mb-4">
                Le concept ? <strong>Ultra simple</strong> : vous déposez votre sac de linge le matin, 
                on vous le pèse, vous payez au kilo (environ 1€/kg), et le soir même — parfois même en 3-4h — 
                vous récupérez tout : <strong>lavé, séché, plié, parfumé</strong>.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed mb-4">
                Pas de grille tarifaire complexe. Pas de "5€ pour une chemise, 7€ pour un pantalon". 
                Juste un prix au poids. <strong>Transparent, rapide, efficace</strong>.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                Cette simplicité déconcertante allait être le point de départ de Kilolab.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <img
                src="https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800&q=80"
                alt="Bangkok street"
                className="rounded-3xl shadow-2xl"
              />
            </motion.div>
          </div>

          {/* Hanoï */}
          <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="order-2 md:order-1"
            >
              <img
                src="https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80"
                alt="Hanoi Vietnam"
                className="rounded-3xl shadow-2xl"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="order-1 md:order-2"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6">
                <MapPin className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl font-black text-slate-900 mb-6">
                Hanoï, Vietnam : La confirmation
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-4">
                Quelques semaines plus tard à Hanoï, même constat. Mais cette fois, une observation supplémentaire : 
                <strong> ces services ne sont pas réservés aux touristes</strong>. Les locaux eux-mêmes utilisent 
                massivement ces pressings au kilo.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed mb-4">
                Pourquoi ? Parce que dans une ville dense comme Hanoï, beaucoup vivent en appartement sans machine à laver. 
                Le pressing au kilo devient alors <strong>la solution économique et pratique</strong>.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed mb-4">
                En discutant avec des expats français installés là-bas, le retour était unanime : 
                <em>"C'est tellement plus simple qu'en France. Là-bas c'est compliqué et cher, ici c'est évident."</em>
              </p>
              <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
                <p className="font-bold text-green-900 mb-2">💡 La prise de conscience :</p>
                <p className="text-slate-700">
                  Si ça marche si bien en Asie, <strong>pourquoi pas en Europe</strong> ? 
                  Il suffisait d'adapter le modèle aux standards de qualité européens.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Retour en France */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6">
                <Lightbulb className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl font-black text-slate-900 mb-6">
                Paris, 2023 : Le choc du retour
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-4">
                De retour à Paris, le contraste était <strong>brutal</strong>. 
                Les pressings traditionnels français :
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-red-600 text-sm font-bold">✕</span>
                  </div>
                  <span className="text-slate-600">
                    <strong>Tarifs opaques</strong> : 5€ la chemise, 8€ le pantalon... impossible de prévoir le coût total
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-red-600 text-sm font-bold">✕</span>
                  </div>
                  <span className="text-slate-600">
                    <strong>Délais longs</strong> : 3-5 jours minimum, voire 1 semaine
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-red-600 text-sm font-bold">✕</span>
                  </div>
                  <span className="text-slate-600">
                    <strong>Accès compliqué</strong> : horaires restreints, parkings payants, files d'attente
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-red-600 text-sm font-bold">✕</span>
                  </div>
                  <span className="text-slate-600">
                    <strong>Prix élevés</strong> : 50-80€ pour quelques pièces
                  </span>
                </li>
              </ul>
              <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
                <p className="font-bold text-blue-900 mb-2">🚀 La mission était claire :</p>
                <p className="text-slate-700">
                  Créer <strong>le pressing nouvelle génération</strong> : simple comme en Asie, 
                  avec la qualité européenne.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <img
                src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80"
                alt="Paris"
                className="rounded-3xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-4 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
              L'aventure Kilolab
            </h2>
            <p className="text-xl text-slate-600">
              De l'idée à 2600+ pressings partenaires
            </p>
          </div>

          <div className="space-y-12">
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="flex items-start gap-8">
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-xl">
                      <span className="text-2xl font-black text-white">{item.year}</span>
                    </div>
                  </div>
                  <div className="flex-1 bg-white rounded-2xl p-8 shadow-lg">
                    <h3 className="text-2xl font-black text-slate-900 mb-3">{item.title}</h3>
                    <p className="text-lg text-slate-600 leading-relaxed">{item.description}</p>
                  </div>
                </div>
                {index < timeline.length - 1 && (
                  <div className="absolute left-12 top-24 w-0.5 h-12 bg-gradient-to-b from-blue-300 to-cyan-300"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
              Nos valeurs
            </h2>
            <p className="text-xl text-slate-600">
              Ce qui guide chacune de nos décisions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <value.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{value.title}</h3>
                <p className="text-slate-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-cyan-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Rejoignez l'aventure
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Des milliers de personnes nous font déjà confiance pour simplifier leur quotidien
            </p>
            <button
              onClick={() => navigate('/partners-map')}
              className="px-12 py-5 bg-white text-blue-600 rounded-xl font-bold text-xl hover:shadow-2xl transition-all transform hover:scale-105"
            >
              Trouver un pressing
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
