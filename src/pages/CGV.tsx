import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';

export default function CGV() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour
        </button>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <div className="flex items-center gap-4 mb-8">
            <FileText className="w-12 h-12 text-blue-400" />
            <div>
              <h1 className="text-4xl font-bold text-white">Conditions Generales de Vente</h1>
              <p className="text-white/60">Derniere mise a jour : 07 novembre 2025</p>
            </div>
          </div>

          <div className="space-y-8 text-white/80 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Objet</h2>
              <p>
                Les presentes CGV regissent les relations entre KiloLab et ses clients
                pour les services de pressing au poids.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Services proposes</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Premium (72-96h) : 5€/kg</li>
                <li>Express (24h) : 10€/kg</li>
                <li>Ultra Express (6h) : 15€/kg</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Paiement</h2>
              <p>
                Le paiement s effectue en ligne par carte bancaire via Stripe
                apres la pesee du linge.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Contact</h2>
              <p>
                Email : contact@kilolab.fr<br />
                Telephone : 01 23 45 67 89
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
