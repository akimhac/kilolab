import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function CGU() {
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
            Conditions Générales d'Utilisation
          </h1>
          
          <p className="text-sm text-gray-500 mb-8">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>

          <div className="prose prose-slate max-w-none">
            <h2>Article 1 - Objet</h2>
            <p>
              Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation 
              de la plateforme Kilolab, accessible à l'adresse <strong>kilolab.fr</strong>.
            </p>
            <p className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-600">
              <strong>⚠️ Important :</strong> Kilolab agit exclusivement en tant qu'intermédiaire technologique 
              entre les Utilisateurs et les Pressings partenaires. Kilolab ne réalise aucune prestation de nettoyage.
            </p>

            <h2>Article 2 - Définitions</h2>
            <ul>
              <li><strong>Plateforme :</strong> Site web et application Kilolab</li>
              <li><strong>Utilisateur :</strong> Toute personne utilisant la Plateforme</li>
              <li><strong>Partenaire / Pressing :</strong> Établissement inscrit sur la Plateforme</li>
              <li><strong>Service :</strong> Prestation de nettoyage réalisée par le Pressing</li>
              <li><strong>Commande :</strong> Demande de Service via la Plateforme</li>
            </ul>

            <h2>Article 3 - Acceptation des CGU</h2>
            <p>
              L'utilisation de la Plateforme implique l'acceptation pleine et entière des présentes CGU.
            </p>

            <h2>Article 4 - Services proposés</h2>
            <h3>4.1 Rôle de Kilolab</h3>
            <p>Kilolab met à disposition une plateforme permettant de :</p>
            <ul>
              <li>Localiser des pressings partenaires</li>
              <li>Consulter leurs tarifs et services</li>
              <li>Réserver des créneaux de dépôt/retrait</li>
              <li>Effectuer des paiements en ligne sécurisés</li>
            </ul>

            <h3>4.2 Prestations réalisées par les Pressings</h3>
            <p className="font-semibold text-purple-900">
              Les prestations de nettoyage sont exclusivement réalisées par les Pressings partenaires. 
              Kilolab n'intervient pas dans l'exécution des Services.
            </p>

            <h2>Article 5 - Inscription</h2>
            <p>
              L'Utilisateur peut créer un compte en fournissant des informations exactes. 
              Il est responsable de la confidentialité de ses identifiants.
            </p>

            <h2>Article 6 - Paiements</h2>
            <p>
              En cas de paiement en ligne, <strong>Kilolab perçoit une commission de 5 à 15% 
              sur le montant HT de la transaction</strong> pour le service de mise en relation.
            </p>

            <h2>Article 7 - Responsabilités</h2>
            <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-600 my-4">
              <h3 className="text-red-900 font-bold">Limitation de responsabilité de Kilolab</h3>
              <p className="text-red-900">
                Kilolab décline toute responsabilité concernant :
              </p>
              <ul className="text-red-900">
                <li>La qualité des Services fournis par les Pressings</li>
                <li>Les dommages causés aux vêtements</li>
                <li>Les retards de livraison</li>
                <li>La perte ou le vol d'articles</li>
                <li>Les litiges entre Utilisateurs et Pressings</li>
              </ul>
              <p className="font-semibold text-red-900">
                En cas de litige, l'Utilisateur doit directement contacter le Pressing concerné.
              </p>
            </div>

            <h2>Article 8 - Propriété Intellectuelle</h2>
            <p>
              Tous les éléments de la Plateforme sont la propriété exclusive de Kilolab. 
              Toute reproduction est interdite sans autorisation.
            </p>

            <h2>Article 9 - Données Personnelles</h2>
            <p>
              Consultez notre <a href="/legal/privacy" className="text-purple-600 hover:underline font-semibold">
                Politique de confidentialité
              </a>.
            </p>

            <h2>Article 10 - Loi Applicable</h2>
            <p>
              Les présentes CGU sont soumises au droit français.
            </p>

            <div className="mt-12 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
              <h3 className="font-bold text-lg mb-2">Contact</h3>
              <p className="text-sm">
                <strong>Kilolab</strong><br />
                Email : contact@kilolab.fr<br />
                Site : kilolab.fr
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
