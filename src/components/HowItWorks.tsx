import { MapPin, Scale, QrCode, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HowItWorks() {
  const steps = [
    {
      number: "1",
      icon: MapPin,
      title: "Localisez & Déposez",
      desc: "Trouvez le pressing partenaire le plus proche sur la carte. Déposez votre linge sale, peu importe le sac.",
      // Image : Une personne dépose un sac de linge à un comptoir
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
    },
    {
      number: "2",
      icon: Scale,
      title: "Pesée & Traitement Pro",
      desc: "Votre artisan pèse le linge devant vous (prix au kg transparent). Il est ensuite lavé, séché et plié avec soin.",
      // Image : Balance professionnelle avec du linge dessus
      image: "https://images.unsplash.com/photo-1604698127954-909062375664?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      number: "3",
      icon: QrCode,
      title: "Notif & Retrait Flash",
      desc: "Recevez un SMS quand c'est prêt. Présentez votre QR code pour récupérer votre linge propre en 30 secondes.",
      // Image : Smartphone avec une notification de fin de tâche
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white relative overflow-hidden">
      {/* Texture de fond subtile */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 border border-teal-100 rounded-full text-teal-600 text-sm font-bold mb-6 shadow-sm">
            <Sparkles size={16} /> C'est magique
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 leading-tight">
            Votre nouveau rituel linge.
          </h2>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">
            Plus simple que de commander une pizza.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Ligne connecteur (Desktop uniquement) */}
          <div className="hidden md:block absolute top-[120px] left-0 w-full h-0.5 bg-gradient-to-r from-teal-100 via-teal-400 to-teal-100 -z-10"></div>

          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center group">
              
              {/* IMAGE RONDE AVEC EFFET */}
              <div className="relative mb-8 w-64 h-64 mx-auto">
                <div className="w-full h-full rounded-full overflow-hidden border-8 border-white shadow-2xl relative z-10 group-hover:scale-105 transition duration-500 bg-white">
                    <img src={step.image} alt={step.title} className="w-full h-full object-cover" />
                </div>
                {/* Badge Numéro */}
                <div className="absolute bottom-0 right-4 w-16 h-16 bg-teal-500 text-white rounded-full flex items-center justify-center font-extrabold text-2xl shadow-lg border-4 border-white z-20">
                  {step.number}
                </div>
              </div>

              {/* CONTENU */}
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 relative mt-4 w-full hover:shadow-xl transition duration-300">
                 <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center mx-auto mb-4 text-teal-500">
                    <step.icon size={24} />
                 </div>
                <h3 className="text-2xl font-extrabold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-20">
          <Link to="/trouver" className="inline-flex items-center px-10 py-5 bg-teal-500 text-slate-900 rounded-full font-bold text-lg hover:bg-teal-400 transition shadow-xl shadow-teal-500/20 hover:scale-105">
            Trouver un pressing <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
