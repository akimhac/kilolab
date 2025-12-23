import { MapPin, Scale, QrCode } from 'lucide-react';

export default function HowItWorksCarousel() {
  const steps = [
    {
      icon: MapPin,
      title: "1. Localisez",
      desc: "Trouvez le pressing Kilolab le plus proche de chez vous en un clic."
    },
    {
      icon: Scale,
      title: "2. Pesez",
      desc: "Déposez votre linge. Nous le pesons devant vous. Tarif unique 3.00€/kg."
    },
    {
      icon: QrCode,
      title: "3. Retirez",
      desc: "Recevez une notif, scannez votre QR code et repartez avec votre linge propre."
    }
  ];

  return (
    <div className="py-12 bg-slate-50 rounded-3xl mx-4 my-8 border border-slate-100 shadow-sm">
      <div className="text-center mb-10">
        <h3 className="text-2xl font-extrabold text-slate-900">C'est simple comme bonjour</h3>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8 px-8 max-w-6xl mx-auto">
        {steps.map((step, idx) => (
          <div key={idx} className="flex flex-col items-center text-center group">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-md flex items-center justify-center mb-4 group-hover:scale-110 transition duration-300 border border-slate-100">
              <step.icon className="text-teal-500 w-8 h-8" />
            </div>
            <h4 className="font-bold text-xl text-slate-900 mb-2">{step.title}</h4>
            <p className="text-slate-500 text-sm px-4">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
