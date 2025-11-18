import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

export default function Privacy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-white/60 hover:text-white mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour
        </button>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <div className="flex items-center gap-4 mb-8">
            <Shield className="w-12 h-12 text-green-400" />
            <h1 className="text-4xl font-bold text-white">Politique de Confidentialite</h1>
          </div>

          <div className="space-y-6 text-white/80">
            <section>
              <h2 className="text-2xl font-bold text-white mb-3">1. Donnees collectees</h2>
              <p>Nous collectons : nom, email, telephone, adresse, historique commandes.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">2. Utilisation</h2>
              <p>Vos donnees servent uniquement a gerer vos commandes et vous envoyer des notifications.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">3. Vos droits RGPD</h2>
              <p>Vous disposez des droits d acces, rectification, suppression et portabilite.<br />
              Contact : privacy@kilolab.fr</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">4. Conservation</h2>
              <p>Donnees conservees 3 ans apres derniere commande.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
