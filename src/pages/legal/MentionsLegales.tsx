import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function MentionsLegales() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-8 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour à l'accueil
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Mentions Légales
          </h1>

          <div className="prose prose-slate max-w-none">
            <h2>Éditeur du site</h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <p className="text-sm font-semibold text-yellow-800">
                ⚠️ À COMPLÉTER avec vos informations légales après création de la SASU
              </p>
            </div>
            <p>
              <strong>Raison sociale :</strong> [VOTRE SASU - À COMPLÉTER]<br />
              <strong>Forme juridique :</strong> SASU<br />
              <strong>Capital social :</strong> [MONTANT] euros<br />
              <strong>Siège social :</strong> [ADRESSE COMPLÈTE]<br />
              <strong>SIRET :</strong> [NUMÉRO SIRET]<br />
              <strong>RCS :</strong> [VILLE]<br />
              <strong>Email :</strong> contact@kilolab.fr<br />
              <strong>Directeur de publication :</strong> [VOTRE NOM]
            </p>

            <h2>Hébergement</h2>
            <p>
              <strong>Vercel Inc.</strong><br />
              340 S Lemon Ave #4133<br />
              Walnut, CA 91789<br />
              États-Unis<br />
              Site : <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-purple-600">vercel.com</a>
            </p>

            <h2>Propriété intellectuelle</h2>
            <p>
              L'ensemble du site Kilolab est la propriété exclusive de [VOTRE SASU] ou de ses partenaires.
            </p>

            <h2>Protection des données</h2>
            <p>
              Consultez notre <a href="/legal/privacy" className="text-purple-600 hover:underline font-semibold">
                Politique de confidentialité
              </a>.
            </p>

            <h2>Contact</h2>
            <p>
              <strong>Email :</strong> contact@kilolab.fr
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
