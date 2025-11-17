import { Check, Clock, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ClientPricing() {
  const plans = [
    {
      name: 'Premium',
      duration: '72-96h',
      price: '5',
      icon: Check,
      color: 'from-blue-500 to-cyan-500',
      features: [
        'Lavage professionnel',
        'Séchage délicat',
        'Repassage soigné',
        'Livraison en 3-4 jours',
        'Idéal pour les grandes quantités',
      ],
      badge: 'Le plus économique',
    },
    {
      name: 'Express',
      duration: '24h',
      price: '10',
      icon: Clock,
      color: 'from-purple-500 to-pink-500',
      features: [
        'Tout de Premium',
        'Service en 24 heures',
        'Priorité de traitement',
        'Parfait pour l\'urgent',
        'Disponible 7j/7',
      ],
      badge: 'Le plus populaire',
      highlighted: true,
    },
    {
      name: 'Ultra Express',
      duration: '6h',
      price: '15',
      icon: Zap,
      color: 'from-orange-500 to-red-500',
      features: [
        'Tout de Express',
        'Service ultra-rapide',
        'Traitement immédiat',
        'Pour les urgences',
        'Maximum 5kg',
      ],
      badge: 'Le plus rapide',
    },
  ];

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-4">
            Tarifs transparents
          </h2>
          <p className="text-xl text-slate-600">
            Choisissez la formule adaptée à vos besoins
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative"
            >
              {plan.badge && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-10">
                  <div className={`px-4 py-2 rounded-full text-sm font-bold text-white shadow-lg ${
                    plan.highlighted ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-slate-800'
                  }`}>
                    {plan.badge}
                  </div>
                </div>
              )}

              <div className={`rounded-3xl p-8 h-full ${
                plan.highlighted
                  ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-2xl scale-105'
                  : 'bg-white border-2 border-slate-200 hover:border-purple-300'
              } transition-all`}>
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                  plan.highlighted ? 'bg-white/20' : `bg-gradient-to-r ${plan.color}`
                }`}>
                  <plan.icon className={`w-8 h-8 ${plan.highlighted ? 'text-white' : 'text-white'}`} />
                </div>

                <h3 className={`text-3xl font-bold mb-2 ${plan.highlighted ? 'text-white' : 'text-slate-900'}`}>
                  {plan.name}
                </h3>
                
                <div className="flex items-baseline gap-2 mb-2">
                  <span className={`text-5xl font-black ${plan.highlighted ? 'text-white' : 'text-slate-900'}`}>
                    {plan.price}€
                  </span>
                  <span className={plan.highlighted ? 'text-purple-100' : 'text-slate-600'}>
                    / kg
                  </span>
                </div>

                <p className={`text-lg font-semibold mb-8 ${plan.highlighted ? 'text-purple-100' : 'text-slate-600'}`}>
                  Délai : {plan.duration}
                </p>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        plan.highlighted ? 'text-yellow-300' : 'text-green-500'
                      }`} />
                      <span className={plan.highlighted ? 'text-white' : 'text-slate-700'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${
                    plan.highlighted
                      ? 'bg-white text-purple-600 hover:shadow-xl'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg'
                  }`}
                >
                  Choisir {plan.name}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-slate-600 mb-4">
            💡 <strong>Exemple :</strong> 5kg de linge en Express = 50€ seulement
          </p>
          <p className="text-sm text-slate-500">
            Prix affichés TTC • Paiement sécurisé • Sans engagement
          </p>
        </div>
      </div>
    </section>
  );
}
