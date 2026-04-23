import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function CGV() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-32">
        <h1 className="text-4xl font-extrabold mb-2">Conditions Générales de Vente</h1>
        <p className="text-slate-500 mb-8">Applicables aux prestations de lavage — Version 2.0, Février 2026</p>

        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200 space-y-8 text-slate-700 leading-relaxed text-sm md:text-base">

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">1. Champ d'application</h2>
            <p>
              Les présentes Conditions Générales de Vente (CGV) s'appliquent à toute commande de prestation de lavage 
              passée via la plateforme Kilolab. Elles complètent les Conditions Générales d'Utilisation (CGU).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">2. Commandes et Tarifs</h2>
            <p>
              Les tarifs sont indiqués en euros TTC au kilogramme de linge.
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Formule Standard :</strong> 3€/kg (Délai indicatif 48h-72h).</li>
              <li><strong>Formule Express :</strong> 5€/kg (Délai indicatif 24h).</li>
            </ul>
            <p className="mt-2 text-red-600 font-medium">
              Le poids final facturé est celui constaté par le Washer lors de la collecte via son peson professionnel. 
              Le Client accepte que ce poids puisse différer légèrement de son estimation.
            </p>
            <p className="mt-2">
              Kilolab se réserve le droit de modifier ses tarifs. Les nouveaux tarifs s'appliquent aux commandes passées après leur publication.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">3. Paiement</h2>
            <p>
              Le paiement est exigible à la commande ou à la validation de la pesée. 
              Les paiements sont sécurisés par notre prestataire <strong>Stripe</strong> (certifié PCI DSS Level 1). 
            </p>
            <p className="mt-2">
              Kilolab agit comme tiers de confiance et <strong>séquestre les fonds</strong> jusqu'à la bonne exécution de la prestation.
              Le Washer reçoit sa rémunération via Stripe Connect dans un délai de 7 jours ouvrés après validation.
            </p>
            <p className="mt-2">Moyens de paiement acceptés : carte bancaire (Visa, Mastercard, American Express).</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">4. Exécution de la prestation</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Le Washer s'engage à traiter le linge avec soin, à utiliser une lessive adaptée (hypoallergénique) et à ne jamais mélanger le linge de différents clients.</li>
              <li>Le délai de livraison est indicatif. Un retard raisonnable ne constitue pas un motif de remboursement sauf en Formule Express (au-delà de 36h).</li>
              <li>Le Client doit vérifier l'état du linge à la restitution et signaler tout problème immédiatement.</li>
            </ul>
          </section>

          <section className="bg-orange-50 p-6 rounded-xl border border-orange-100">
            <h2 className="text-xl font-bold text-orange-900 mb-2">5. Responsabilité, Garantie & Arbitrage Kilolab</h2>
            <p className="mb-4 text-orange-800">
              Kilolab agit en qualité d'intermédiaire et d'<strong>arbitre unique</strong> en cas de litige. Aucune indemnisation n'est versée sans décision préalable de Kilolab.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-orange-900 font-medium">
              <li>
                <strong>Responsabilité du Washer :</strong> Le Washer est responsable des dommages causés au linge standard confié. Sa responsabilité est <strong>strictement limitée au montant de la commande concernée</strong>.
              </li>
              <li>
                <strong>Arbitrage obligatoire :</strong> En cas de litige, le Client et le Washer s'engagent à soumettre le différend à <strong>Kilolab qui arbitre</strong>. Le remboursement ou l'indemnisation ne peut excéder le montant de la commande.
              </li>
              <li>
                <strong>Processus de réclamation :</strong> Le Client dispose de <strong>24h après restitution</strong> pour signaler un problème via le chat intégré ou à <a href="mailto:contact@kilolab.fr" className="underline">contact@kilolab.fr</a>.
              </li>
              <li className="text-red-800 font-bold">
                <strong>EXCLUSIONS DE RESPONSABILITE :</strong> Kilolab et le Washer <strong>déclinent toute responsabilité</strong> pour :
                <ul className="list-disc pl-5 mt-2 font-normal space-y-1">
                  <li>Les vêtements délicats ou de valeur non déclarés par le Client (soie, cachemire, cuir, fourrure, lingerie de luxe, vêtements de créateur)</li>
                  <li>Les articles dont la valeur unitaire excède 100€ sans déclaration préalable</li>
                  <li>L'usure normale des vêtements</li>
                  <li>Les vêtements sans étiquette d'entretien</li>
                  <li>Les objets oubliés dans les poches</li>
                  <li>Les dommages résultant d'un défaut de fabrication du vêtement</li>
                </ul>
              </li>
              <li>
                <span className="text-xs font-normal text-orange-700 block mt-1">
                  *Le Client est seul responsable de déclarer ses articles fragiles et de valeur lors de la commande. À défaut, il renonce à toute réclamation les concernant.
                </span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">6. Annulation</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Par le Client avant collecte :</strong> Annulation gratuite et sans frais tant que le Washer n'a pas pris en charge le linge.</li>
              <li><strong>Par le Client après collecte :</strong> Impossible. La commande sera facturée intégralement.</li>
              <li><strong>Par le Washer :</strong> Le Washer peut annuler avant la collecte. Kilolab réattribuera la commande automatiquement. Des annulations répétées peuvent entraîner une suspension du compte Washer.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">7. Droit de Rétractation</h2>
            <p>
              Conformément à l'article L.221-28 du Code de la consommation, le droit de rétractation ne peut être exercé 
              pour les contrats de prestation de services pleinement exécutés avant la fin du délai de rétractation. 
            </p>
            <p className="mt-2">
              En validant la collecte du linge, le Client reconnaît avoir été informé et <strong>renonce expressément</strong> à son droit de rétractation 
              afin que le lavage commence immédiatement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">8. Litiges et Médiation</h2>
            <p>
              Toute réclamation doit être effectuée dans les <strong>24h</strong> suivant la livraison du linge via le support client Kilolab.
            </p>
            <p className="mt-2">
              En cas de litige persistant, le Client peut recourir au médiateur de la consommation ou à la plateforme européenne de règlement en ligne :
              <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-teal-600 underline ml-1">ec.europa.eu/consumers/odr</a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">9. Force Majeure</h2>
            <p>
              Aucune des parties ne pourra être tenue responsable d'un retard ou d'une inexécution causé par un événement de force majeure 
              (article 1218 du Code civil). Dans ce cas, Kilolab fera ses meilleurs efforts pour proposer une solution alternative.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">10. Droit Applicable</h2>
            <p>
              Les présentes CGV sont soumises au droit français. Les tribunaux compétents de <strong>Lille</strong> sont seuls compétents pour tout litige.
            </p>
          </section>

        </div>
      </div>

      <Footer />
    </div>
  );
}
