import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PricingSection() {
  const plans = [
    {
      name: 'Découverte',
      price: '0',
      period: '3 premiers mois',
      description: 'Idéal pour tester la plateforme',
      features: [
        'Inscription gratuite',
        'Visibilité sur la carte',
        '0% de commission pendant 3 mois',
        'Gestion des commandes',
        'Support email',
      ],
      cta: 'Démarrer gratuitement',
      highlighted: false,
      badge: 'Populaire',
    },
    {
      name: 'Standard',
      price: '10',
      period: 'par transaction',
      description: 'Pour les pressings établis',
      features: [
        'Tout de Découverte',
        '10% de commission uniquement',
        'Dashboard avancé',
        'Statistiques détaillées',
        'Support prioritaire',
        'Badge "Partenaire vérifié"',
      ],
      cta: 'Choisir Standard',
      highlighted: true,
      badge: 'Recommandé',
    },
    {
      name: 'Premium',
      price: '15',
      period: 'par transaction',
      description: 'Visibilité maximale',
      features: [
        'Tout de Standard',
        'Mise en avant sur la carte',
        'Badge "Premium"',
        'Photos professionnelles',
        'Support téléphone 7j/7',
        'Campagnes marketing dédiées',
      ],
      cta: 'Passer Premium',
      highlighted: false,
      badge: 'Pro',
    },
  ];

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black text-slate-900 mb-4">
            Tarifs transparents
          </h2>
          <p className="text-xl text-slate-600">
            Choisissez la formule adaptée à votre pressing
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative rounded-3xl p-8 ${
                plan.highlighted
                  ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-2xl scale-105'
                  : 'bg-white border-2 border-slate-200 hover:border-purple-300 transition'
              }`}
            >
              {plan.badge && (
                <div className={`absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-sm font-bold ${
                  plan.highlighted ? 'bg-yellow-400 text-purple-900' : 'bg-purple-100 text-purple-900'
                }`}>
                  {plan.badge}
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className={`text-2xl font-bold mb-2 ${plan.highlighted ? 'text-white' : 'text-slate-900'}`}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center gap-2 mb-2">
                  <span className={`text-5xl font-black ${plan.highlighted ? 'text-white' : 'text-slate-900'}`}>
                    {plan.price}€
                  </span>
                  {plan.price !== '0' && (
                    <span className={plan.highlighted ? 'text-purple-100' : 'text-slate-500'}>
                      / {plan.period}
                    </span>
                  )}
                </div>
                {plan.price === '0' && (
                  <p className={plan.highlighted ? 'text-purple-100' : 'text-slate-500'}>
                    {plan.period}
                  </p>
                )}
                <p className={`mt-3 ${plan.highlighted ? 'text-purple-100' : 'text-slate-600'}`}>
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                      plan.highlighted ? 'text-yellow-300' : 'text-purple-600'
                    }`} />
                    <span className={plan.highlighted ? 'text-white' : 'text-slate-700'}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 ${
                  plan.highlighted
                    ? 'bg-white text-purple-600 hover:shadow-xl'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg'
                }`}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-slate-500 mt-12">
          💡 Aucun frais d'inscription • Aucun engagement • Arrêt à tout moment
        </p>
      </div>
    </section>
  );
}
