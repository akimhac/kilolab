import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function CGU() {
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
          <h1 className="text-4xl font-bold mb-8">Conditions Générales d'Utilisation</h1>
          
          <p className="text-sm text-gray-500 mb-8">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>

          <h2>Article 1 - Objet</h2>
          <p>
            Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation 
            de la plateforme Kilolab, accessible à l'adresse <strong>kilolab.fr</strong> (ci-après "la Plateforme").
          </p>
          <p>
            <strong>Kilolab agit exclusivement en tant qu'intermédiaire technologique</strong> entre les Utilisateurs 
            et les Pressings partenaires. Kilolab ne réalise aucune prestation de nettoyage.
          </p>

          <h2>Article 2 - Définitions</h2>
          <ul>
            <li><strong>Plateforme :</strong> Site web et application Kilolab</li>
            <li><strong>Utilisateur :</strong> Toute personne physique ou morale utilisant la Plateforme</li>
            <li><strong>Partenaire / Pressing :</strong> Établissement de pressing inscrit sur la Plateforme</li>
            <li><strong>Service :</strong> Prestation de nettoyage réalisée par le Pressing</li>
            <li><strong>Commande :</strong> Demande de Service effectuée via la Plateforme</li>
          </ul>

          <h2>Article 3 - Acceptation des CGU</h2>
          <p>
            L'utilisation de la Plateforme implique l'acceptation pleine et entière des présentes CGU. 
            En cas de refus, l'Utilisateur doit s'abstenir d'utiliser la Plateforme.
          </p>

          <h2>Article 4 - Services proposés</h2>
          <h3>4.1 Rôle de Kilolab</h3>
          <p>
            Kilolab met à disposition une plateforme permettant de :
          </p>
          <ul>
            <li>Localiser des pressings partenaires</li>
            <li>Consulter leurs tarifs et services</li>
            <li>Réserver des créneaux de dépôt/retrait</li>
            <li>Effectuer des paiements en ligne (optionnel selon le pressing)</li>
          </ul>

          <h3>4.2 Prestations réalisées par les Pressings</h3>
          <p>
            <strong>Les prestations de nettoyage sont exclusivement réalisées par les Pressings partenaires.</strong>
            Kilolab n'intervient pas dans l'exécution des Services et ne peut être tenu responsable 
            de leur qualité, délai ou résultat.
          </p>

          <h2>Article 5 - Inscription et Compte Utilisateur</h2>
          <h3>5.1 Création de compte</h3>
          <p>
            L'Utilisateur peut créer un compte en fournissant des informations exactes et à jour. 
            Il est responsable de la confidentialité de ses identifiants.
          </p>

          <h3>5.2 Suspension de compte</h3>
          <p>
            Kilolab se réserve le droit de suspendre ou supprimer tout compte en cas de :
          </p>
          <ul>
            <li>Violation des présentes CGU</li>
            <li>Comportement frauduleux ou abusif</li>
            <li>Non-paiement répété</li>
            <li>Fausses informations</li>
          </ul>

          <h2>Article 6 - Commandes et Paiements</h2>
          <h3>6.1 Prix</h3>
          <p>
            Les prix sont fixés librement par chaque Pressing partenaire et affichés sur la Plateforme. 
            <strong>Kilolab ne contrôle pas les tarifs pratiqués.</strong>
          </p>

          <h3>6.2 Paiement</h3>
          <p>
            Selon le Pressing, le paiement peut s'effectuer :
          </p>
          <ul>
            <li>En ligne via Stripe (sécurisé)</li>
            <li>Directement au Pressing (espèces, CB)</li>
          </ul>
          <p>
            En cas de paiement en ligne, <strong>Kilolab perçoit une commission de 5 à 15% 
            sur le montant HT de la transaction</strong> pour le service de mise en relation.
          </p>

          <h3>6.3 Annulation</h3>
          <p>
            Les conditions d'annulation dépendent de chaque Pressing. L'Utilisateur doit consulter 
            les conditions spécifiques avant de valider sa Commande.
          </p>

          <h2>Article 7 - Responsabilités</h2>
          <h3>7.1 Limitation de responsabilité de Kilolab</h3>
          <p>
            <strong>Kilolab décline toute responsabilité concernant :</strong>
          </p>
          <ul>
            <li>La qualité des Services fournis par les Pressings</li>
            <li>Les dommages causés aux vêtements pendant le nettoyage</li>
            <li>Les retards de livraison</li>
            <li>La perte ou le vol d'articles confiés aux Pressings</li>
            <li>Les litiges entre Utilisateurs et Pressings</li>
            <li>L'inexécution du Service par un Pressing</li>
          </ul>
          <p>
            <strong>En cas de litige, l'Utilisateur doit directement contacter le Pressing concerné.</strong>
          </p>

          <h3>7.2 Responsabilité de l'Utilisateur</h3>
          <p>
            L'Utilisateur est seul responsable :
          </p>
          <ul>
            <li>De l'exactitude des informations fournies</li>
            <li>De l'utilisation de son compte</li>
            <li>Du respect des consignes du Pressing</li>
            <li>De la vérification de ses articles avant dépôt</li>
          </ul>

          <h3>7.3 Responsabilité des Pressings</h3>
          <p>
            Les Pressings partenaires sont seuls responsables de :
          </p>
          <ul>
            <li>La qualité de leurs prestations</li>
            <li>Le respect des délais annoncés</li>
            <li>La sécurité et la restitution des articles</li>
            <li>Leur conformité aux normes professionnelles</li>
          </ul>

          <h2>Article 8 - Disponibilité de la Plateforme</h2>
          <p>
            Kilolab s'efforce d'assurer l'accessibilité de la Plateforme 24h/24 et 7j/7, 
            mais ne peut garantir une disponibilité continue. 
          </p>
          <p>
            <strong>Kilolab ne peut être tenu responsable des interruptions de service</strong> 
            pour maintenance, pannes techniques ou cas de force majeure.
          </p>

          <h2>Article 9 - Propriété Intellectuelle</h2>
          <p>
            Tous les éléments de la Plateforme (logo, textes, images, design) sont la propriété 
            exclusive de Kilolab ou de ses partenaires. Toute reproduction est interdite sans autorisation.
          </p>

          <h2>Article 10 - Données Personnelles</h2>
          <p>
            Les données personnelles collectées sont traitées conformément au RGPD. 
            Consultez notre <a href="/legal/privacy" className="text-purple-600 hover:underline">Politique de confidentialité</a>.
          </p>

          <h2>Article 11 - Réclamations</h2>
          <p>
            Pour toute réclamation, contactez-nous à : <strong>contact@kilolab.fr</strong>
          </p>
          <p>
            En cas de litige avec un Pressing, l'Utilisateur doit d'abord tenter une résolution amiable.
          </p>

          <h2>Article 12 - Médiation</h2>
          <p>
            Conformément à l'article L.612-1 du Code de la consommation, l'Utilisateur peut recourir 
            gratuitement à un médiateur de la consommation en cas de litige.
          </p>

          <h2>Article 13 - Loi Applicable</h2>
          <p>
            Les présentes CGU sont soumises au droit français. 
            Tout litige sera de la compétence exclusive des tribunaux français.
          </p>

          <h2>Article 14 - Modification des CGU</h2>
          <p>
            Kilolab se réserve le droit de modifier les présentes CGU à tout moment. 
            Les nouvelles CGU seront applicables dès leur mise en ligne.
          </p>

          <div className="mt-12 p-6 bg-purple-50 rounded-lg">
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
  );
}
