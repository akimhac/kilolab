import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Zap } from 'lucide-react';

export default function Pricing() {
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Standard',
      price: '3,50',
      duration: '48-72h',
      features: [
        'Lavage professionnel',
        'Séchage soigné',
        'Pliage impeccable',
        'Délai standard',
        'Prix économique'
      ],
      color: 'from-blue-500 to-cyan-500',
      popular: false
    },
    {
      name: 'Express',
      price: '5',
      duration: '24h',
      features: [
        'Lavage professionnel',
        'Séchage soigné',
        'Pliage impeccable',
        'Livraison en 24h',
        'Service prioritaire'
      ],
      color: 'from-orange-500 to-red-500',
      popular: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 transition font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour
        </button>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            Tarifs simples et transparents
          </h1>
          <p className="text-xl text-slate-600">
            Prix au kilo, sans surprise
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-3xl shadow-xl p-8 ${
                plan.popular ? 'ring-4 ring-orange-500' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full font-bold text-sm flex items-center gap-2 shadow-lg">
                    <Zap className="w-4 h-4" />
                    Le plus populaire
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center gap-2 mb-2">
                  <span className={`text-6xl font-black bg-gradient-to-r ${plan.color} bg-clip-text text-transparent`}>
                    {plan.price}€
                  </span>
                  <span className="text-slate-600">/kg</span>
                </div>
                <p className="text-slate-500 font-semibold">{plan.duration}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-slate-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => navigate('/partners-map')}
                className={`w-full py-4 rounded-xl font-bold text-lg text-white bg-gradient-to-r ${plan.color} hover:shadow-2xl transition-all transform hover:scale-105`}
              >
                Choisir {plan.name}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white rounded-3xl shadow-xl p-8 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-slate-900 mb-6">
            Questions fréquentes
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 mb-2">Y a-t-il un poids minimum ?</h3>
              <p className="text-slate-600">Non, mais nous recommandons 2-3kg minimum pour optimiser le service.</p>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-2">Comment est calculé le prix ?</h3>
              <p className="text-slate-600">Votre linge est pesé par le pressing. Prix = poids × tarif/kg.</p>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-2">Quels vêtements acceptez-vous ?</h3>
              <p className="text-slate-600">Tous types de textiles lavables en machine (vêtements, linge de maison, etc.).</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
