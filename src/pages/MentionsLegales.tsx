import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';

export default function MentionsLegales() {
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
            <FileText className="w-12 h-12 text-blue-400" />
            <h1 className="text-4xl font-bold text-white">Mentions Legales</h1>
          </div>

          <div className="space-y-6 text-white/80">
            <section>
              <h2 className="text-2xl font-bold text-white mb-3">1. Editeur</h2>
              <p>KiloLab SAS<br />
              Capital social : 10 000 €<br />
              Siege social : 10 Rue du Pressing, 75001 Paris<br />
              Email : contact@kilolab.fr<br />
              Tel : 01 23 45 67 89</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">2. Hebergement</h2>
              <p>Netlify, Inc.<br />
              512 2nd Street, Suite 200<br />
              San Francisco, CA 94107, USA</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">3. RGPD</h2>
              <p>Pour exercer vos droits RGPD, contactez : privacy@kilolab.fr</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
