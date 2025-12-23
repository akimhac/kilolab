import { MapPin, Scale, QrCode, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white font-sans">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4">
            Comment ça marche ?
          </h2>
          <p className="text-slate-500 text-lg">Votre linge propre en 3 étapes simples.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* ÉTAPE 1 */}
          <div className="text-center group">
            <div className="w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-4 border-teal-500 shadow-lg relative">
              <img src="https://images.unsplash.com/photo-1569388330292-79cc1ec67270?w=800&q=80" alt="Localisez" className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
              <div className="absolute inset-0 bg-black/20"></div>
            </div>
            <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl -mt-12 relative z-10 border-4 border-white">
              1
            </div>
            <MapPin className="w-8 h-8 text-teal-500 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">Localisez & Déposez</h3>
            <p className="text-slate-600 px-4">Trouvez le pressing partenaire le plus proche. Déposez votre linge sale, peu importe le sac.</p>
          </div>

          {/* ÉTAPE 2 */}
          <div className="text-center group">
            <div className="w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-4 border-teal-500 shadow-lg relative">
              <img src="https://images.unsplash.com/photo-1545173168-9f1947eebb8f?w=800&q=80" alt="Pesée" className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
               <div className="absolute inset-0 bg-black/20"></div>
            </div>
            <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl -mt-12 relative z-10 border-4 border-white">
              2
            </div>
            <Scale className="w-8 h-8 text-teal-500 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">Pesée & Traitement</h3>
            <p className="text-slate-600 px-4">Votre artisan pèse le linge devant vous (3€/kg). Il est lavé, séché et plié avec soin.</p>
          </div>

          {/* ÉTAPE 3 */}
          <div className="text-center group">
            <div className="w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-4 border-teal-500 shadow-lg relative">
              <img src="https://images.unsplash.com/photo-1595079676339-1534801faf62?w=800&q=80" alt="Retrait" className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
               <div className="absolute inset-0 bg-black/20"></div>
            </div>
            <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl -mt-12 relative z-10 border-4 border-white">
              3
            </div>
            <QrCode className="w-8 h-8 text-teal-500 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">Retrait Flash</h3>
            <p className="text-slate-600 px-4">Recevez une alerte sous 48h. Présentez votre QR code pour récupérer votre linge propre.</p>
          </div>
        </div>

        <div className="text-center mt-16">
          <Link to="/trouver" className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            Trouver un pressing <ArrowRight size={20}/>
          </Link>
        </div>
      </div>
    </section>
  );
}
