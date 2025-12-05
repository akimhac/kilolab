// src/pages/Pricing.tsx
// Page des tarifs - 3€/kg Standard, 5€/kg Express

import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Package, Zap, CheckCircle, Calculator, 
  Euro, Clock, Shirt, Star, HelpCircle
} from 'lucide-react';

export default function Pricing() {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Standard",
      price: 3,
      unit: "€/kg",
      description: "Le choix malin pour le quotidien",
      delay: "24-48h",
      icon: Package,
      color: "green",
      features: [
        "Lavage professionnel",
        "Séchage",
        "Pliage soigné",
        "Retrait sous 24-48h",
        "Notification quand c'est prêt"
      ],
      popular: true
    },
    {
      name: "Express",
      price: 5,
      unit: "€/kg",
      description: "Pour les urgences",
      delay: "4h",
      icon: Zap,
      color: "orange",
      features: [
        "Lavage professionnel",
        "Séchage",
        "Pliage soigné",
        "Retrait sous 4h",
        "Notification quand c'est prêt",
        "Priorité de traitement"
      ],
      popular: false
    }
  ];

  // Comparateur 90% économie
  const priceComparison = [
    { item: "Chemise", weight: 0.15, traditional: 8 },
    { item: "Pantalon", weight: 0.4, traditional: 10 },
    { item: "Pull", weight: 0.5, traditional: 12 },
    { item: "Veste", weight: 0.8, traditional: 18 },
    { item: "Manteau", weight: 1.5, traditional: 25 },
    { item: "Robe", weight: 0.3, traditional: 15 },
    { item: "T-shirt", weight: 0.2, traditional: 5 },
    { item: "Jean", weight: 0.6, traditional: 12 },
  ];

  const standardPrice = 3;

  // Exemples de paniers
  const basketExamples = [
    {
      name: "Panier Semaine",
      items: "5 chemises, 3 pantalons, 2 pulls",
      weight: 3.5,
      traditional: 94,
    },
    {
      name: "Panier Famille",
      items: "10 chemises, 5 pantalons, 4 pulls, 2 vestes",
      weight: 7,
      traditional: 182,
    },
    {
      name: "Panier Hiver",
      items: "2 manteaux, 3 pulls, 2 vestes",
      weight: 6,
      traditional: 122,
    }
  ];

  const faqs = [
    {
      question: "Comment est calculé le prix ?",
      answer: "Vous payez uniquement au poids. Votre linge est pesé au gramme près au pressing, puis multiplié par le tarif (3€/kg standard ou 5€/kg express)."
    },
    {
      question: "Y a-t-il un poids minimum ?",
      answer: "Non, pas de minimum ! Que vous ayez 500g ou 10kg, vous payez au poids réel."
    },
    {
      question: "Le repassage est-il inclus ?",
      answer: "Le service inclut lavage, séchage et pliage. Le repassage peut être proposé en option par certains pressings partenaires."
    },
    {
      question: "Comment je paie ?",
      answer: "Vous payez directement au pressing lors du retrait de votre linge. Espèces, CB, ou autre selon le pressing."
    },
    {
      question: "Et si je ne suis pas satisfait ?",
      answer: "Nos pressings partenaires sont sélectionnés pour leur qualité. En cas de problème, contactez-nous et nous trouverons une solution."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour
          </button>
          <Link to="/" className="text-2xl font-bold text-green-600">Kilolab</Link>
          <Link 
            to="/partners-map"
            className="px-4 py-2 bg-green-500 text-white rounded-full font-semibold hover:bg-green-600 transition text-sm"
          >
            Trouver un pressing
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-r from-green-500 to-teal-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Nos tarifs transparents
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Payez au poids, pas à la pièce. Jusqu'à <strong>90% d'économie</strong> par rapport au pressing traditionnel.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="py-16 -mt-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {plans.map((plan, i) => (
              <div 
                key={i}
                className={`bg-white rounded-3xl shadow-xl overflow-hidden border-2 ${
                  plan.popular ? 'border-green-500' : 'border-slate-200'
                } relative`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-green-500 text-white text-center py-1 text-sm font-bold">
                    ⭐ LE PLUS POPULAIRE
                  </div>
                )}
                
                <div className={`p-8 ${plan.popular ? 'pt-12' : ''}`}>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${
                    plan.color === 'green' ? 'bg-green-100' : 'bg-orange-100'
                  }`}>
                    <plan.icon className={`w-7 h-7 ${
                      plan.color === 'green' ? 'text-green-600' : 'text-orange-600'
                    }`} />
                  </div>
                  
                  <h2 className="text-2xl font-bold text-slate-900 mb-1">{plan.name}</h2>
                  <p className="text-slate-600 mb-4">{plan.description}</p>
                  
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className={`text-5xl font-bold ${
                      plan.color === 'green' ? 'text-green-600' : 'text-orange-600'
                    }`}>{plan.price}</span>
                    <span className="text-xl text-slate-500">{plan.unit}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-6">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600">Prêt en {plan.delay}</span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-3">
                        <CheckCircle className={`w-5 h-5 flex-shrink-0 ${
                          plan.color === 'green' ? 'text-green-500' : 'text-orange-500'
                        }`} />
                        <span className="text-slate-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => navigate('/partners-map')}
                    className={`w-full py-4 rounded-2xl font-bold text-lg transition ${
                      plan.popular
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Choisir {plan.name}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparateur détaillé */}
      <section className="py-16 bg-green-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Comparez et économisez jusqu'à 90%
            </h2>
            <p className="text-slate-600">
              Prix moyen constaté en pressing traditionnel vs Kilolab (tarif standard 3€/kg)
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-4 bg-slate-100 p-4 font-bold text-sm">
              <div>Article</div>
              <div className="text-center">Traditionnel</div>
              <div className="text-center text-green-600">Kilolab</div>
              <div className="text-center">Économie</div>
            </div>

            {/* Rows */}
            {priceComparison.map((item, i) => {
              const kilolabPrice = item.weight * standardPrice;
              const saving = Math.round((1 - kilolabPrice / item.traditional) * 100);
              return (
                <div key={i} className={`grid grid-cols-4 p-4 items-center ${
                  i % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                }`}>
                  <div>
                    <span className="font-medium text-slate-900">{item.item}</span>
                    <span className="text-xs text-slate-500 ml-2">~{item.weight}kg</span>
                  </div>
                  <div className="text-center text-slate-400 line-through">
                    {item.traditional.toFixed(2)}€
                  </div>
                  <div className="text-center font-bold text-green-600">
                    {kilolabPrice.toFixed(2)}€
                  </div>
                  <div className="text-center">
                    <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm font-bold">
                      -{saving}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-center text-sm text-slate-500 mt-4">
            * Prix traditionnels moyens constatés en France. Poids indicatifs.
          </p>
        </div>
      </section>

      {/* Exemples de paniers */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
            Exemples de paniers
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {basketExamples.map((basket, i) => {
              const kilolabPrice = basket.weight * standardPrice;
              const saving = Math.round((1 - kilolabPrice / basket.traditional) * 100);
              return (
                <div key={i} className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{basket.name}</h3>
                  <p className="text-sm text-slate-600 mb-4">{basket.items}</p>
                  
                  <div className="bg-slate-50 rounded-xl p-4 mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-600">Poids total</span>
                      <span className="font-bold">{basket.weight} kg</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-600">Prix traditionnel</span>
                      <span className="text-slate-400 line-through">{basket.traditional}€</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Prix Kilolab</span>
                      <span className="font-bold text-green-600">{kilolabPrice.toFixed(2)}€</span>
                    </div>
                  </div>

                  <div className="bg-green-100 rounded-xl p-3 text-center">
                    <span className="text-green-700 font-bold">
                      Vous économisez {(basket.traditional - kilolabPrice).toFixed(2)}€ ({saving}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
            Questions fréquentes
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-md">
                <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-green-500" />
                  {faq.question}
                </h3>
                <p className="text-slate-600 pl-7">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-green-500 to-teal-500">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Prêt à économiser sur votre pressing ?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Trouvez un pressing partenaire près de chez vous et profitez de nos tarifs avantageux.
          </p>
          <button
            onClick={() => navigate('/partners-map')}
            className="px-8 py-4 bg-white text-green-600 rounded-full font-bold text-lg hover:shadow-xl transition"
          >
            Trouver un pressing
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400">© 2025 Kilolab. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
