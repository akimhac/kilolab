import { Smartphone, Shirt, PackageCheck } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      number: "1",
      icon: Smartphone,
      title: "Localisez & Déposez",
      desc: "Trouvez le pressing partenaire le plus proche. Déposez votre linge sale, peu importe le sac.",
      image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" // Carte/Navigation (style Uber/Maps)
    },
    {
      number: "2",
      icon: PackageCheck,
      title: "Pesée & Traitement Pro",
      desc: "Votre artisan pèse le linge devant vous pour un prix transparent. Il est ensuite lavé avec soin.",
      image: "https://images.unsplash.com/photo-1606741965326-cb990ae01bb2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" // Balance/Pesée professionnelle
    },
    {
      number: "3",
      icon: Shirt,
      title: "Notif & Retrait Flash",
      desc: "Recevez une alerte quand c'est prêt. Présentez votre QR code pour un retrait instantané.",
      image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" // Smartphone avec notification
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/10 border border-teal-500/30 rounded-full text-teal-400 text-sm font-bold mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>
            C'est magique
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
            Plus simple que de commander une pizza.
          </h2>
        </div>

        <div className="space-y-24">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className={`grid md:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
            >
              {/* Image */}
              <div className={`relative ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                <div className="absolute inset-0 bg-teal-500/20 blur-3xl rounded-full"></div>
                <img
                  src={step.image}
                  alt={step.title}
                  className="relative rounded-3xl shadow-2xl transform hover:scale-[1.02] transition duration-500 border border-white/10"
                />
                {/* Badge numéro */}
                <div className="absolute -top-6 -left-6 w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center text-slate-900 font-extrabold text-2xl shadow-xl border-4 border-slate-950">
                  {step.number}
                </div>
              </div>

              {/* Texte */}
              <div className={index % 2 === 1 ? 'md:order-1' : ''}>
                <div className="bg-teal-500/10 w-fit p-3 rounded-xl mb-6">
                  <step.icon className="w-10 h-10 text-teal-400" />
                </div>
                <h3 className="text-3xl font-extrabold text-white mb-4">{step.title}</h3>
                <p className="text-lg text-slate-300 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
