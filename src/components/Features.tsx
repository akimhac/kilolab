import { Sparkles, Clock, Leaf, ShieldCheck } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Sparkles,
      title: "Qualité Artisanale",
      desc: "Chaque vêtement est inspecté, détaché et repassé par des artisans pressings locaux qualifiés."
    },
    {
      icon: Clock,
      title: "Gain de Temps",
      desc: "Fini le tri, l'étendage et le pliage. Récupérez 4h de votre semaine pour ce qui compte vraiment."
    },
    {
      icon: Leaf,
      title: "Écologique",
      desc: "Nos partenaires utilisent des procédés de nettoyage respectueux de l'environnement et optimisent les cycles."
    },
    {
      icon: ShieldCheck,
      title: "Sécurité & Traçabilité",
      desc: "Suivez votre commande en temps réel et bénéficiez d'un service client réactif 7j/7."
    }
  ];

  return (
    // FOND BLANC
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          {/* TITRE FONCÉ */}
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Pourquoi choisir Kilolab ?</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">Plus qu'un simple service de blanchisserie, une nouvelle façon de vivre votre quotidien.</p>
        </div>
        <div className="grid md:grid-cols-4 gap-8">
          {features.map((f, i) => (
            // CARTES CLAIRES (GRIS TRÈS PALE)
            <div key={i} className="bg-slate-50 border border-slate-100 p-6 rounded-2xl hover:shadow-lg hover:border-teal-500/30 transition duration-300">
              <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center shadow-sm mb-4">
                <f.icon className="w-7 h-7 text-teal-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
