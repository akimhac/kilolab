import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function MentionsLegales() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour
        </button>

        <div className="prose prose-slate max-w-none">
          <h1 className="text-4xl font-bold mb-8">Mentions Légales</h1>

          <h2>Éditeur du site</h2>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <p className="text-sm font-semibold text-yellow-800">
              ⚠️ À COMPLÉTER avec vos informations légales après création de la SASU
            </p>
          </div>
          <p>
            <strong>Raison sociale :</strong> [VOTRE SASU - À COMPLÉTER]<br />
            <strong>Forme juridique :</strong> SASU (Société par Actions Simplifiée Unipersonnelle)<br />
            <strong>Capital social :</strong> [MONTANT] euros<br />
            <strong>Siège social :</strong> [ADRESSE COMPLÈTE]<br />
            <strong>SIRET :</strong> [NUMÉRO SIRET]<br />
            <strong>RCS :</strong> [VILLE]<br />
            <strong>Email :</strong> contact@kilolab.fr<br />
            <strong>Directeur de publication :</strong> [VOTRE NOM], Président<br />
            <strong>TVA intracommunautaire :</strong> [NUMÉRO]
          </p>

          <h2>Hébergement</h2>
          <p>
            <strong>Vercel Inc.</strong><br />
            340 S Lemon Ave #4133<br />
            Walnut, CA 91789<br />
            États-Unis<br />
            Site web : <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-purple-600">vercel.com</a>
          </p>

          <h2>Propriété intellectuelle</h2>
          <p>
            L'ensemble du site Kilolab (structure, textes, logos, images, vidéos, graphismes) 
            est la propriété exclusive de [VOTRE SASU] ou de ses partenaires.
          </p>
          <p>
            Toute reproduction, représentation, modification, publication, transmission ou dénaturation, 
            totale ou partielle du site ou de son contenu, par quelque procédé que ce soit, 
            est interdite sans l'autorisation écrite préalable de Kilolab.
          </p>

          <h2>Crédits</h2>
          <p>
            <strong>Photographies :</strong> Pexels.com (Licence libre)<br />
            <strong>Icônes :</strong> Lucide Icons (Licence MIT)<br />
            <strong>Typographie :</strong> Google Fonts
          </p>

          <h2>Protection des données personnelles</h2>
          <p>
            Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi 
            Informatique et Libertés, vous disposez de droits sur vos données.
          </p>
          <p>
            Consultez notre <a href="/legal/privacy" className="text-purple-600 hover:underline">Politique de confidentialité</a> 
            pour plus d'informations.
          </p>

          <h2>Cookies</h2>
          <p>
            Le site utilise des cookies pour améliorer l'expérience utilisateur. 
            Vous pouvez les désactiver dans les paramètres de votre navigateur.
          </p>

          <h2>Contact</h2>
          <p>
            Pour toute question relative aux mentions légales, contactez-nous à :<br />
            <strong>Email :</strong> contact@kilolab.fr
          </p>
        </div>
      </div>
    </div>
  );
}
