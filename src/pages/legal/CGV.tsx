import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function CGV() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-32">
        <h1 className="text-4xl font-extrabold mb-2">Conditions Générales de Vente</h1>
        <p className="text-slate-500 mb-8">Applicables aux prestations de lavage - Version 1.1</p>

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

          {/* --- AJOUT CRITIQUE POUR LA CONFIANCE (STYLE AIRBNB) --- */}
          <section className="bg-orange-50 p-6 rounded-xl border border-orange-100">
            <h2 className="text-xl font-bold text-orange-900 mb-2">4. Responsabilité & Garantie Kilolab</h2>
            <p className="mb-4 text-orange-800">
              Bien que Kilolab agisse en qualité d'intermédiaire, nous avons mis en place une protection pour nos utilisateurs.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-orange-900 font-medium">
              <li>
                <strong>Responsabilité du Washer :</strong> Le Washer est responsable des dommages causés au linge confié (perte, dégradation).
              </li>
              <li>
                <strong>Fonds de Garantie :</strong> En cas de litige avéré et non résolu à l'amiable sous 72h, Kilolab peut indemniser le client à hauteur de <strong>200€ maximum</strong> par commande.
              </li>
              <li>
                <span className="text-xs font-normal text-orange-700 block mt-1">
                  *Sont exclus de la garantie : l'usure normale, les vêtements sans étiquette d'entretien, et les objets oubliés dans les poches.
                </span>
              </li>
            </ul>
          </section>
          {/* ------------------------------------------------------- */}

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
