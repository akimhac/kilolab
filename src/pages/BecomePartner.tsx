import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, Check, ArrowLeft } from 'lucide-react';

export default function BecomePartner() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const plans = [
    {
      name: 'Découverte',
      price: '0€',
      period: '3 premiers mois',
      commission: '0%',
      features: [
        'Inscription gratuite',
        'Visibilité sur la carte',
        '0% de commission pendant 3 mois',
        'Gestion des commandes',
        'Support email',
      ],
      badge: 'Idéal pour démarrer',
    },
    {
      name: 'Standard',
      price: '10%',
      period: 'par transaction',
      commission: '10%',
      features: [
        'Tout de Découverte',
        '10% de commission uniquement',
        'Dashboard avancé',
        'Statistiques détaillées',
        'Support prioritaire',
        'Badge "Partenaire vérifié"',
      ],
      badge: 'Le plus populaire',
      highlighted: true,
    },
    {
      name: 'Premium',
      price: '15%',
      period: 'par transaction',
      commission: '15%',
      features: [
        'Tout de Standard',
        'Mise en avant sur la carte',
        'Badge "Premium"',
        'Photos professionnelles',
        'Support téléphone 7j/7',
        'Campagnes marketing dédiées',
      ],
      badge: 'Visibilité maximale',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour
          </button>
        </div>
      </div>

      {/* Hero */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Store className="w-16 h-16 text-purple-600 mx-auto mb-6" />
          <h1 className="text-5xl font-black text-slate-900 mb-6">
            Développez votre pressing avec Kilolab
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Rejoignez notre réseau de 2600+ pressings et accédez à de nouveaux clients
          </p>
          <div className="flex flex-wrap gap-8 justify-center text-left">
            <div>
              <div className="text-3xl font-bold text-purple-600">+30%</div>
              <div className="text-slate-600">Chiffre d'affaires moyen</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">2600+</div>
              <div className="text-slate-600">Pressings partenaires</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">0€</div>
              <div className="text-slate-600">Frais d'inscription</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">
            Choisissez votre formule
          </h2>
          <p className="text-xl text-slate-600 text-center mb-12">
            Commencez gratuitement, payez uniquement quand vous gagnez
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, idx) => (
              <div
                key={idx}
                className={`rounded-2xl p-8 ${
                  plan.highlighted
                    ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-2xl scale-105'
                    : 'bg-white border-2 border-slate-200'
                }`}
              >
                <div className="text-sm font-bold mb-4">
                  {plan.badge}
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${plan.highlighted ? '' : 'text-slate-900'}`}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className={`text-5xl font-black ${plan.highlighted ? '' : 'text-slate-900'}`}>
                    {plan.price}
                  </span>
                  <span className={plan.highlighted ? 'text-purple-100' : 'text-slate-500'}>
                    {plan.period}
                  </span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className={`w-5 h-5 flex-shrink-0 ${plan.highlighted ? 'text-yellow-300' : 'text-purple-600'}`} />
                      <span className="text-sm">{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => setStep(2)}
                  className={`w-full py-3 rounded-lg font-bold ${
                    plan.highlighted
                      ? 'bg-white text-purple-600'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  }`}
                >
                  Choisir {plan.name}
                </button>
              </div>
            ))}
          </div>

          <p className="text-center text-slate-500 mt-12">
            💡 Sans engagement • Arrêt à tout moment • Support 7j/7
          </p>
        </div>
      </section>

      {/* Bénéfices */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Pourquoi rejoindre Kilolab ?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'Nouveaux clients automatiques',
                text: 'Apparaissez dans les recherches de milliers d\'utilisateurs chaque mois',
              },
              {
                title: 'Gestion simplifiée',
                text: 'Dashboard intuitif pour suivre vos commandes et vos statistiques',
              },
              {
                title: 'Paiements sécurisés',
                text: 'Encaissement automatique via Stripe, viré sur votre compte sous 48h',
              },
              {
                title: 'Marketing gratuit',
                text: 'Bénéficiez de nos campagnes publicitaires sans frais supplémentaires',
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">
            Prêt à développer votre activité ?
          </h2>
          <p className="text-xl mb-8 text-purple-100">
            Inscription en 5 minutes • Premier mois gratuit • Sans engagement
          </p>
          <button
            onClick={() => setStep(2)}
            className="px-8 py-4 bg-white text-purple-600 rounded-full font-bold text-lg hover:shadow-xl"
          >
            Devenir partenaire maintenant
          </button>
        </div>
      </section>
    </div>
  );
}
