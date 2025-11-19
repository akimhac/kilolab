import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plane, Lightbulb, Users, Target, Heart, Sparkles } from 'lucide-react';
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
      title: 'L\'inspiration',
      description: 'Lors d\'un voyage en Asie, découverte des services de pressing au kilo ultra-efficaces. En Thaïlande et au Vietnam, déposer son linge le matin et le récupérer propre le soir était la norme, à des prix dérisoires.'
    },
    {
      year: '2023',
      title: 'Le constat',
      description: 'De retour en France, réalisation que cette simplicité n\'existait pas ici. Les pressings traditionnels étaient opaques sur les prix, complexes à utiliser, et souvent trop chers pour un usage régulier.'
    },
    {
      year: '2024',
      title: 'La mission',
      description: 'Créer Kilolab : démocratiser le pressing au kilo en France et Belgique. Connecter les particuliers avec un réseau de pressings de qualité, à des tarifs transparents et accessibles.'
    },
    {
      year: '2025',
      title: 'Aujourd\'hui',
      description: '2600+ pressings partenaires, des milliers de clients satisfaits, et une ambition : devenir la référence du pressing au kilo en Europe.'
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
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold text-sm mb-6">
              <Plane className="w-4 h-4" />
              Notre histoire
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6">
              D'une observation en Asie à une{' '}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                solution européenne
              </span>
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              Comment un voyage à l'autre bout du monde a inspiré la création de Kilolab, 
              le service de pressing au kilo qui simplifie la vie de milliers de personnes.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
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
              <h2 className="text-3xl font-black text-slate-900 mb-6">
                Tout a commencé par un voyage
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-4">
                En 2022, lors d'un long séjour en Asie du Sud-Est, une simple observation a tout changé. 
                À Bangkok, Hanoï, ou Kuala Lumpur, les <strong>services de pressing au kilo</strong> sont omniprésents.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed mb-4">
                Le matin, vous déposez un sac de linge dans une petite échoppe de quartier. 
                Le soir même, ou le lendemain, vous récupérez tout : <strong>lavé, séché, plié</strong>. 
                Le prix ? Calculé au poids réel. Simple, rapide, transparent.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                Cette efficacité redoutable contrastait avec la complexité des pressings traditionnels occidentaux.
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
                alt="Voyage en Asie"
                className="rounded-3xl shadow-2xl"
              />
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="order-2 md:order-1"
            >
              <img
                src="https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=800&q=80"
                alt="Linge impeccable"
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
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6">
                <Lightbulb className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-6">
                Le déclic : pourquoi pas en Europe ?
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-4">
                De retour en France, le contraste était flagrant. Les pressings traditionnels étaient :
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-red-600 text-sm font-bold">✕</span>
                  </div>
                  <span className="text-slate-600">Opaques sur les prix (tarifs à la pièce complexes)</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-red-600 text-sm font-bold">✕</span>
                  </div>
                  <span className="text-slate-600">Lents (plusieurs jours minimum)</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-red-600 text-sm font-bold">✕</span>
                  </div>
                  <span className="text-slate-600">Chers pour un usage régulier</span>
                </li>
              </ul>
              <p className="text-lg text-slate-600 leading-relaxed">
                L'idée était là : <strong>adapter le modèle asiatique à l'Europe</strong>, en gardant ce qui fonctionne 
                (simplicité, prix au kilo, rapidité) tout en respectant les standards de qualité européens.
              </p>
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

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
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
      </footer>
    </div>
  );
}
