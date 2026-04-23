import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function CGU() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-32">
        <h1 className="text-4xl font-extrabold mb-2">Conditions Générales d'Utilisation</h1>
        <p className="text-slate-500 mb-8">Dernière mise à jour : Février 2026 — Version 2.0</p>

        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200 space-y-8 text-slate-700 leading-relaxed text-sm md:text-base">

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">1. Objet et Acceptation</h2>
            <p>
              Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation de la plateforme Kilolab (ci-après "la Plateforme"), 
              accessible à l'adresse <strong>kilolab.fr</strong> et via ses applications mobiles,
              mettant en relation des particuliers ou professionnels souhaitant faire laver leur linge ("Clients") 
              et des prestataires indépendants ou professionnels ("Washers" ou "Partenaires").
            </p>
            <p className="mt-2">
              L'utilisation de Kilolab entraîne l'acceptation pleine et entière des présentes CGU. En cas de désaccord, l'utilisateur doit cesser immédiatement toute utilisation de la Plateforme.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">2. Description du Service</h2>
            <p>
              Kilolab est une <strong>plateforme technique de mise en relation</strong>. Kilolab n'est pas une blanchisserie industrielle 
              mais un tiers de confiance garantissant la sécurité des transactions et la qualité du réseau de Washers.
            </p>
            <p className="mt-2">
              Kilolab agit en qualité d'intermédiaire et n'est en aucun cas partie au contrat de prestation de lavage conclu entre le Client et le Washer. 
              La responsabilité de l'exécution de la prestation incombe au Washer.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">3. Accès et Compte</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>L'utilisateur doit être âgé d'au moins 18 ans et disposer de la capacité juridique nécessaire.</li>
              <li>Les informations fournies (identité, adresse, téléphone) doivent être exactes et tenues à jour.</li>
              <li>L'utilisateur est seul responsable de la confidentialité de ses identifiants de connexion.</li>
              <li>Tout usage frauduleux d'un compte sera signalé aux autorités compétentes.</li>
              <li>Un même utilisateur ne peut détenir qu'un seul compte, sauf autorisation expresse de Kilolab.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">4. Obligations des Clients</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Ne pas confier de linge contaminé, dangereux, illicite, ou contenant des objets de valeur.</li>
              <li>Vérifier les poches de tous les vêtements avant remise au Washer.</li>
              <li>Signaler tout vêtement nécessitant un traitement spécial (fragile, couleurs qui déteignent, etc.).</li>
              <li>Respecter les créneaux horaires convenus pour la collecte et la livraison.</li>
              <li>Procéder au paiement intégral de la prestation conformément aux tarifs affichés.</li>
              <li>Formuler toute réclamation dans les <strong>24 heures</strong> suivant la restitution du linge.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">5. Obligations des Washers</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Respecter la <strong>Charte Qualité Kilolab</strong> : machine propre, lessive hypoallergénique, pesée contradictoire, respect des délais.</li>
              <li>Traiter chaque commande individuellement — ne jamais mélanger le linge de clients différents.</li>
              <li>Informer le Client et Kilolab immédiatement en cas d'incident (dommage, retard, impossibilité).</li>
              <li>Disposer du statut d'auto-entrepreneur ou de toute forme juridique adaptée à l'exercice de son activité.</li>
              <li>Déclarer ses revenus conformément à la législation fiscale en vigueur. Kilolab n'est pas l'employeur du Washer.</li>
              <li>Maintenir un taux d'acceptation et une qualité de service conformes aux standards Kilolab sous peine de suspension.</li>
            </ul>
          </section>

          <section className="bg-teal-50 p-6 rounded-xl border border-teal-100">
            <h2 className="text-xl font-bold text-teal-900 mb-2">6. Protection des Washers</h2>
            <ul className="list-disc pl-5 space-y-2 text-teal-900">
              <li><strong>Paiement garanti :</strong> Le Washer est assuré de recevoir son paiement dans un délai maximum de <strong>7 jours ouvrés</strong> après validation de la commande, via Stripe Connect.</li>
              <li><strong>Droit de refus :</strong> Le Washer peut refuser une mission sans pénalité si elle est jugée incompatible (distance excessive, linge inapproprié).</li>
              <li><strong>Protection contre les abus :</strong> Kilolab surveille les comportements clients abusifs (annulations répétées, réclamations frauduleuses) et peut suspendre un client en cas de manquement avéré.</li>
              <li><strong>Transparence :</strong> Le Washer a accès en temps réel à ses revenus, commissions, et statistiques via son tableau de bord.</li>
              <li><strong>Aucune clause d'exclusivité :</strong> Le Washer est libre de travailler avec d'autres plateformes ou en direct.</li>
            </ul>
          </section>

          <section className="bg-blue-50 p-6 rounded-xl border border-blue-100">
            <h2 className="text-xl font-bold text-blue-900 mb-2">7. Protection des Clients</h2>
            <ul className="list-disc pl-5 space-y-2 text-blue-900">
              <li><strong>Fonds de garantie :</strong> En cas de dommage avéré et non résolu à l'amiable sous 72h, Kilolab peut indemniser le Client à hauteur de <strong>200€ maximum</strong> par commande.</li>
              <li><strong>Washers vérifiés :</strong> Chaque Washer fait l'objet d'une vérification d'identité (KYC) et de qualité avant approbation.</li>
              <li><strong>Paiement sécurisé :</strong> Les fonds sont séquestrés par Stripe jusqu'à confirmation de la bonne exécution du service.</li>
              <li><strong>Suivi en temps réel :</strong> Le Client peut suivre l'état de sa commande en direct via la Plateforme.</li>
              <li><strong>Support réactif :</strong> Toute réclamation est traitée dans un délai de <strong>48h</strong> maximum.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">8. Tarification et Commission</h2>
            <p>
              Les tarifs des prestations sont affichés de manière transparente sur la Plateforme. 
              Kilolab perçoit une commission sur chaque transaction, dont le taux est communiqué au Washer lors de son inscription.
            </p>
            <p className="mt-2">
              Le poids facturé est celui constaté par le Washer lors de la collecte. Le Client accepte que ce poids puisse différer de son estimation initiale.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">9. Annulation et Remboursement</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Avant collecte :</strong> Le Client peut annuler sans frais jusqu'à la prise en charge du linge par le Washer.</li>
              <li><strong>Après collecte :</strong> L'annulation n'est plus possible. La prestation sera facturée intégralement.</li>
              <li><strong>Remboursement :</strong> En cas de litige justifié, le remboursement est traité sous 5 à 10 jours ouvrés via le moyen de paiement initial.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">10. Suspension et Résiliation</h2>
            <p>
              En cas de non-respect des présentes CGU, de fraude, ou de comportement nuisible, 
              Kilolab se réserve le droit de <strong>suspendre ou supprimer définitivement</strong> le compte de l'utilisateur sans préavis ni indemnité.
            </p>
            <p className="mt-2">
              L'utilisateur peut à tout moment demander la suppression de son compte via les paramètres de son profil ou en contactant le support.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">11. Propriété Intellectuelle</h2>
            <p>
              Tous les éléments du site (textes, logos, images, algorithmes, code source) sont la propriété exclusive de Kilolab. 
              Toute reproduction, même partielle, est strictement interdite sans autorisation écrite préalable.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">12. Limitation de Responsabilité</h2>
            <p>
              Kilolab ne saurait être tenu responsable des dommages indirects, 
              des pertes de données, ou de l'indisponibilité temporaire de la Plateforme pour maintenance ou cas de force majeure.
            </p>
            <p className="mt-2">
              La responsabilité financière de Kilolab est limitée au montant de la commission perçue sur la transaction litigieuse, 
              sauf application du fonds de garantie prévu à l'article 7.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">13. Force Majeure</h2>
            <p>
              Aucune des parties ne pourra être tenue responsable d'un manquement à ses obligations 
              résultant d'un événement de force majeure au sens de l'article 1218 du Code civil 
              (catastrophe naturelle, pandémie, grève, panne réseau, etc.).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">14. Médiation et Règlement des Litiges</h2>
            <p>
              En cas de litige, les parties s'engagent à rechercher une solution amiable. 
              À défaut, le Client consommateur peut recourir gratuitement au service de médiation suivant :
            </p>
            <p className="mt-2 font-semibold">
              Médiateur de la consommation — Coordonnées disponibles sur demande à : <a href="mailto:contact@kilolab.fr" className="text-teal-600 underline">contact@kilolab.fr</a>
            </p>
            <p className="mt-2">
              Le Client peut également saisir la plateforme européenne de règlement en ligne des litiges : 
              <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-teal-600 underline ml-1">ec.europa.eu/consumers/odr</a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">15. Modification des CGU</h2>
            <p>
              Kilolab se réserve le droit de modifier les présentes CGU à tout moment. 
              Les utilisateurs seront informés par email ou notification en cas de modification substantielle. 
              La poursuite de l'utilisation après modification vaut acceptation des nouvelles CGU.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">16. Droit Applicable et Juridiction</h2>
            <p>
              Les présentes CGU sont soumises au droit français. 
              En cas de litige non résolu par la médiation, les tribunaux compétents de <strong>Lille</strong> seront seuls compétents.
            </p>
          </section>

        </div>
      </div>

      <Footer />
    </div>
  );
}
