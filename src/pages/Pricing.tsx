import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Zap, Clock, Package, Star } from 'lucide-react';

export default function Pricing() {
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Standard',
      price: '3,50',
      duration: '48-72h',
      icon: Clock,
      color: 'from-blue-500 to-cyan-500',
      borderColor: 'border-blue-600',
      bgColor: 'bg-blue-50',
      features: [
        'Lavage professionnel',
        'Séchage',
        'Pliage soigné',
        'Délai 48-72h',
        'Tarif au poids réel',
        'Suivi de commande'
      ],
      recommended: false
    },
    {
      name: 'Express',
      price: '5',
      duration: '24h',
      icon: Zap,
      color: 'from-orange-500 to-red-500',
      borderColor: 'border-orange-600',
      bgColor: 'bg-orange-50',
      badge: 'URGENT',
      features: [
        'Tout du Standard',
        'Traitement prioritaire',
        'Linge prêt en 24h',
        'Idéal pour urgences',
        'Service premium',
        'Notification SMS'
      ],
      recommended: true
    }
  ];

  const examples = [
    {
      weight: 5,
      items: '3-4 jeans + 5-6 t-shirts',
      standard: 17.50,
      express: 25
    },
    {
      weight: 10,
      items: 'Linge d\'une semaine (1 personne)',
      standard: 35,
      express: 50
    },
    {
      weight: 15,
      items: 'Linge familial (3-4 personnes)',
      standard: 52.50,
      express: 75
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <nav className="bg-white border-b sticky top-0 z-50">
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

      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-4">
            Tarifs simples et transparents
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Payez uniquement au poids réel de votre linge. Pas de frais cachés, pas de surprise.
          </p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-3xl shadow-xl p-8 border-4 ${plan.borderColor} ${
                plan.recommended ? 'transform md:scale-105' : ''
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className={`w-16 h-16 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center mb-6`}>
                <plan.icon className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-3xl font-black text-slate-900 mb-2">
                {plan.name}
              </h3>

              <div className="flex items-baseline mb-2">
                <span className="text-5xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  {plan.price}€
                </span>
                <span className="text-xl text-slate-600 ml-2">/kg</span>
              </div>

              <p className="text-slate-600 mb-6 text-lg">
                Délai : <strong>{plan.duration}</strong>
              </p>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className={`w-6 h-6 ${plan.bgColor} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <Check className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-slate-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => navigate('/partners-map')}
                className={`w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r ${plan.color} hover:shadow-xl transition-all`}
              >
                Choisir {plan.name}
              </button>
            </div>
          ))}
        </div>

        {/* Exemples de prix */}
        <div className="max-w-4xl mx-auto mb-20">
          <h2 className="text-4xl font-black text-center text-slate-900 mb-8">
            Exemples de tarifs
          </h2>
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-bold">Poids</th>
                    <th className="px-6 py-4 text-left font-bold">Équivalent</th>
                    <th className="px-6 py-4 text-right font-bold">Standard</th>
                    <th className="px-6 py-4 text-right font-bold">Express</th>
                  </tr>
                </thead>
                <tbody>
                  {examples.map((example, index) => (
                    <tr key={index} className="border-b border-slate-200 hover:bg-blue-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Package className="w-5 h-5 text-blue-600" />
                          <span className="font-bold text-slate-900">{example.weight} kg</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {example.items}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-xl font-bold text-blue-600">
                          {example.standard.toFixed(2)}€
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-xl font-bold text-orange-600">
                          {example.express.toFixed(2)}€
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-center text-slate-500 mt-4">
            * Prix indicatifs calculés au poids estimé. Le tarif final est basé sur le poids réel pesé au pressing.
          </p>
        </div>

        {/* FAQ Tarifs */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-black text-center text-slate-900 mb-12">
            Questions fréquentes
          </h2>
          <div className="space-y-6">
            {[
              {
                q: 'Comment est calculé le prix ?',
                a: 'Le prix est calculé au poids réel de votre linge, pesé au pressing lors du dépôt. Vous payez uniquement ce que vous déposez, sans frais cachés.'
              },
              {
                q: 'Quelle est la différence entre Standard et Express ?',
                a: 'Standard (3,50€/kg) : délai de 48-72h. Express (5€/kg) : votre linge est prêt en 24h, idéal pour les urgences.'
              },
              {
                q: 'Y a-t-il un poids minimum ?',
                a: 'Non, il n\'y a pas de poids minimum. Vous pouvez déposer 2 kg comme 20 kg, vous payez toujours au poids réel.'
              },
              {
                q: 'Le prix inclut-il le lavage, séchage et pliage ?',
                a: 'Oui ! Le prix au kilo inclut tout : lavage professionnel, séchage, pliage soigné et emballage.'
              },
              {
                q: 'Puis-je changer de formule ?',
                a: 'Oui, vous choisissez la formule qui vous convient à chaque commande. Standard pour l\'économie, Express pour l\'urgence.'
              },
              {
                q: 'Comment payer ?',
                a: 'Le paiement se fait directement au pressing lors du dépôt ou de la récupération, selon les modalités du pressing partenaire.'
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {faq.q}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-4xl font-black mb-6">
            Prêt à essayer ?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Trouvez un pressing près de chez vous et commencez dès aujourd'hui
          </p>
          <button
            onClick={() => navigate('/partners-map')}
            className="px-12 py-5 bg-white text-blue-600 rounded-xl font-bold text-xl hover:shadow-2xl transition-all transform hover:scale-105"
          >
            Trouver un pressing
          </button>
        </div>
      </div>
    </div>
  );
}
