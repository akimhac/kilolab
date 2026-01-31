import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function CGV() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-32">
        <h1 className="text-4xl font-extrabold mb-2">Conditions Générales de Vente</h1>
        <p className="text-slate-500 mb-8">Applicables aux prestations de lavage</p>

        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200 space-y-8 text-slate-700 leading-relaxed text-sm md:text-base">

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">1. Commandes et Tarifs</h2>
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
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">2. Paiement</h2>
            <p>
              Le paiement est exigible à la commande ou à la validation de la pesée. 
              Les paiements sont sécurisés par notre prestataire Stripe. Kilolab agit comme tiers de confiance 
              et séquestre les fonds jusqu'à la bonne exécution de la prestation.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">3. Exécution de la prestation</h2>
            <p>
              Le Washer s'engage à traiter le linge avec soin, à utiliser une lessive adaptée (hypoallergénique) 
              et à ne jamais mélanger le linge de différents clients.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">4. Responsabilité et Indemnisation</h2>
            <p className="mb-2">
              En cas de perte ou de détérioration avérée imputable au Washer, l'indemnisation est plafonnée conformément 
              aux barèmes légaux du nettoyage textile (Décret n°67-295), et ne pourra excéder 10 fois le prix du lavage de l'article concerné.
            </p>
            <p>
              Sont exclus de toute indemnisation : l'usure normale, les vêtements sans étiquette de lavage, 
              et les objets laissés dans les poches.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">5. Droit de Rétractation</h2>
            <p>
              Conformément à l’article L.221-28 du Code de la consommation, le droit de rétractation ne peut être exercé 
              pour les contrats de prestation de services pleinement exécutés avant la fin du délai de rétractation. 
              En validant la collecte du linge, le Client renonce expressément à son droit de rétractation pour que le lavage commence immédiatement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">6. Litiges</h2>
            <p>
              Toute réclamation doit être effectuée dans les 24h suivant la livraison du linge via le support client Kilolab.
            </p>
          </section>

        </div>
      </div>

      <Footer />
    </div>
  );
}
