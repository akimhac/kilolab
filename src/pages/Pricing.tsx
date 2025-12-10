import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Package, Zap, CheckCircle, Clock, HelpCircle } from 'lucide-react';

export default function Pricing() {
  const navigate = useNavigate();

  // SEULEMENT 2 OFFRES : Standard 3€ et Express 5€
  const plans = [
    {
      name: "Standard",
      price: 3,
      unit: "€/kg",
      description: "Le choix malin pour le quotidien",
      delay: "48-72h",
      icon: Package,
      features: [
        "Lavage professionnel",
        "Séchage inclus",
        "Pliage soigné",
        "Assurance incluse",
        "Notification SMS/Email"
      ],
      popular: false,
      bgClass: "bg-white text-slate-900 border-2 border-slate-200",
      btnClass: "bg-slate-900 text-white hover:bg-slate-800"
    },
    {
      name: "Express",
      price: 5,
      unit: "€/kg",
      description: "Pour les urgences",
      delay: "24h",
      icon: Zap,
      features: [
        "Lavage professionnel",
        "Séchage inclus",
        "Pliage soigné",
        "Assurance incluse",
        "Notification SMS/Email",
        "Priorité de traitement"
      ],
      popular: true,
      bgClass: "bg-teal-500 text-white",
      btnClass: "bg-white text-teal-600 hover:bg-slate-100"
    }
  ];

  const priceComparison = [
    { item: "Chemise", weight: 0.2, traditional: 8 },
    { item: "Pantalon", weight: 0.4, traditional: 10 },
    { item: "Pull", weight: 0.5, traditional: 12 },
    { item: "Veste", weight: 0.8, traditional: 18 },
    { item: "Manteau", weight: 1.5, traditional: 25 },
    { item: "Robe", weight: 0.3, traditional: 15 },
    { item: "T-shirt", weight: 0.15, traditional: 5 },
    { item: "Jean", weight: 0.6, traditional: 12 },
  ];

  const basketExamples = [
    { name: "Panier Semaine", items: "5 chemises, 3 pantalons, 2 pulls", weight: 3.5, traditional: 94 },
    { name: "Panier Famille", items: "10 chemises, 5 pantalons, 4 pulls, 2 vestes", weight: 7, traditional: 182 },
    { name: "Panier Hiver", items: "2 manteaux, 3 pulls, 2 vestes", weight: 6, traditional: 122 }
  ];

  const faqs = [
    { question: "Comment est calculé le prix ?", answer: "Vous payez uniquement au poids. Votre linge est pesé au gramme près au pressing, puis multiplié par le tarif (3€/kg standard ou 5€/kg express)." },
    { question: "Y a-t-il un poids minimum ?", answer: "Non, pas de minimum ! Que vous ayez 500g ou 10kg, vous payez au poids réel." },
    { question: "Le repassage est-il inclus ?", answer: "Le service inclut lavage, séchage et pliage. Le repassage peut être proposé en option par certains pressings partenaires." },
    { question: "Comment je paie ?", answer: "Vous payez directement au pressing lors du retrait de votre linge. Espèces, CB, ou autre selon le pressing." }
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Navigation */}
      <nav className="bg-slate-950/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-400 hover:text-white transition">
            <ArrowLeft className="w-5 h-5" /> Retour
          </button>
          <Link to="/" className="text-2xl font-bold text-teal-500">Kilolab</Link>
          <Link to="/partners-map" className="px-4 py-2 bg-teal-500 text-white rounded-full font-semibold hover:bg-teal-400 transition text-sm">
            Trouver un pressing
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-16 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4">Nos tarifs</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Payez au poids, pas à la pièce. Jusqu'à <span className="text-teal-400 font-bold">90% d'économie</span> par rapport au pressing traditionnel.
          </p>
        </div>
      </section>

      {/* Plans - 2 OFFRES UNIQUEMENT */}
      <section className="pb-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {plans.map((plan, i) => (
              <div key={i} className={`rounded-3xl overflow-hidden relative ${plan.bgClass}`}>
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-yellow-400 text-slate-900 text-sm font-bold px-4 py-1 rounded-full shadow-lg">
                      ⚡ Le plus rapide
                    </span>
                  </div>
                )}
                
                <div className="p-8 pt-10">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className={`w-5 h-5 ${plan.popular ? 'text-white/80' : 'text-slate-500'}`} />
                    <span className={plan.popular ? 'text-white/80' : 'text-slate-500'}>{plan.delay}</span>
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
                  <p className={`text-sm mb-4 ${plan.popular ? 'text-white/70' : 'text-slate-500'}`}>{plan.description}</p>
                  
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-5xl font-extrabold">{plan.price}</span>
                    <span className="text-xl">{plan.unit}</span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-3">
                        <CheckCircle className={`w-5 h-5 flex-shrink-0 ${plan.popular ? 'text-white' : 'text-teal-500'}`} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button onClick={() => navigate('/partners-map')} className={`w-full py-4 rounded-2xl font-bold text-lg transition ${plan.btnClass}`}>
                    Commander
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparateur */}
      <section className="py-16 bg-white text-slate-900">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Comparez et économisez jusqu'à 90%</h2>
            <p className="text-slate-600">Prix moyen constaté en pressing traditionnel vs Kilolab (tarif standard 3€/kg)</p>
          </div>

          <div className="bg-slate-50 rounded-3xl overflow-hidden">
            <div className="grid grid-cols-4 bg-slate-100 p-4 font-bold text-sm">
              <div>Article</div>
              <div className="text-center">Traditionnel</div>
              <div className="text-center text-teal-600">Kilolab</div>
              <div className="text-center">Économie</div>
            </div>

            {priceComparison.map((item, i) => {
              const kilolabPrice = item.weight * 3;
              const saving = Math.round((1 - kilolabPrice / item.traditional) * 100);
              return (
                <div key={i} className={`grid grid-cols-4 p-4 items-center ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                  <div>
                    <span className="font-medium text-slate-900">{item.item}</span>
                    <span className="text-xs text-slate-500 ml-2">~{item.weight}kg</span>
                  </div>
                  <div className="text-center text-slate-400 line-through">{item.traditional.toFixed(2)}€</div>
                  <div className="text-center font-bold text-teal-600">{kilolabPrice.toFixed(2)}€</div>
                  <div className="text-center">
                    <span className="inline-flex items-center gap-1 bg-teal-100 text-teal-700 px-2 py-1 rounded-full text-sm font-bold">-{saving}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Exemples paniers */}
      <section className="py-16 bg-slate-950">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-extrabold text-center text-white mb-12">Exemples de paniers</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {basketExamples.map((basket, i) => {
              const kilolabPrice = basket.weight * 3;
              const saving = Math.round((1 - kilolabPrice / basket.traditional) * 100);
              return (
                <div key={i} className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-2">{basket.name}</h3>
                  <p className="text-sm text-slate-400 mb-4">{basket.items}</p>
                  <div className="bg-white/5 rounded-xl p-4 mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-400">Poids total</span>
                      <span className="font-bold text-white">{basket.weight} kg</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-400">Prix traditionnel</span>
                      <span className="text-slate-500 line-through">{basket.traditional}€</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Prix Kilolab</span>
                      <span className="font-bold text-teal-400">{kilolabPrice.toFixed(2)}€</span>
                    </div>
                  </div>
                  <div className="bg-teal-500/20 rounded-xl p-3 text-center">
                    <span className="text-teal-400 font-bold">Économie: {(basket.traditional - kilolabPrice).toFixed(2)}€ ({saving}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-slate-900">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-extrabold text-center text-white mb-12">Questions fréquentes</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-teal-400" />
                  {faq.question}
                </h3>
                <p className="text-slate-400 pl-7">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-teal-500">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Prêt à économiser sur votre pressing ?</h2>
          <p className="text-xl text-white/90 mb-8">Trouvez un pressing partenaire près de chez vous.</p>
          <button onClick={() => navigate('/partners-map')} className="px-8 py-4 bg-white text-teal-600 rounded-full font-bold text-lg hover:shadow-xl transition">
            Trouver un pressing
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500">© 2025 Kilolab. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}