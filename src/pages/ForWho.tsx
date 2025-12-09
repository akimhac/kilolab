import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Clock, Euro, MapPin, Sparkles } from 'lucide-react';

export default function ForWho() {
  const navigate = useNavigate();

  const steps = [
    {
      number: "01",
      title: "Préparez votre linge",
      description: "Mettez tout votre linge sale dans un sac. Pas besoin de trier par couleur ou matière, nous nous en occupons !",
      icon: "🧺",
      tips: ["Videz les poches", "Fermez les fermetures éclair", "Pas de tri nécessaire"]
    },
    {
      number: "02", 
      title: "Trouvez un pressing",
      description: "Utilisez notre carte pour trouver le pressing partenaire le plus proche de chez vous.",
      icon: "📍",
      tips: ["Plus de 1800 points", "Ouvert 7j/7 souvent", "À côté de chez vous"]
    },
    {
      number: "03",
      title: "Déposez et pesez",
      description: "Déposez votre sac au pressing. Il sera pesé et vous recevrez un ticket avec le poids exact.",
      icon: "⚖️",
      tips: ["Pesée précise", "Ticket de dépôt", "Prix au kilo"]
    },
    {
      number: "04",
      title: "Récupérez propre",
      description: "Votre linge est lavé, séché, plié et prêt en 24h. Récupérez-le avec votre ticket !",
      icon: "✨",
      tips: ["Lavé avec soin", "Plié soigneusement", "Prêt en 24h"]
    }
  ];

  const benefits = [
    { icon: Euro, title: "Économique", desc: "Jusqu'à 85% moins cher qu'un pressing traditionnel" },
    { icon: Clock, title: "Rapide", desc: "Prêt en 24h, express disponible en 4h" },
    { icon: MapPin, title: "Pratique", desc: "Des centaines de points de dépôt près de chez vous" },
    { icon: Sparkles, title: "Qualité pro", desc: "Traité par des pressings professionnels certifiés" }
  ];

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
            <ArrowLeft className="w-5 h-5" /> Retour
          </button>
          <Link to="/" className="text-xl font-bold text-teal-600">Kilolab</Link>
          <div className="w-20"></div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 bg-gradient-to-b from-teal-50 to-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Comment ça marche ?
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Le pressing au kilo, c'est simple comme 1-2-3-4. Découvrez comment économiser sur votre linge.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="space-y-12">
            {steps.map((step, index) => (
              <div key={index} className={`flex flex-col md:flex-row gap-8 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-5xl">{step.icon}</span>
                    <span className="text-6xl font-bold text-teal-100">{step.number}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">{step.title}</h3>
                  <p className="text-slate-600 mb-4">{step.description}</p>
                  <ul className="space-y-2">
                    {step.tips.map((tip, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                        <Check className="w-4 h-4 text-teal-500" /> {tip}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex-1 bg-slate-100 rounded-3xl h-64 flex items-center justify-center">
                  <span className="text-8xl">{step.icon}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Pourquoi choisir Kilolab ?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, i) => (
              <div key={i} className="bg-white/10 rounded-2xl p-6 text-center">
                <div className="w-14 h-14 bg-teal-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-7 h-7 text-teal-400" />
                </div>
                <h3 className="font-bold mb-2">{benefit.title}</h3>
                <p className="text-sm text-slate-300">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Prêt à essayer ?</h2>
          <p className="text-slate-600 mb-8">Trouvez un pressing près de chez vous et économisez dès aujourd'hui.</p>
          <button
            onClick={() => navigate('/partners-map')}
            className="px-8 py-4 bg-teal-600 text-white rounded-full font-bold text-lg hover:bg-teal-700 transition flex items-center gap-2 mx-auto"
          >
            Trouver un pressing <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
}
