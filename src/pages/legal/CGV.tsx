import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function CGV() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-32">
        <h1 className="text-4xl font-extrabold mb-8">Conditions Générales de Vente</h1>

        <div className="bg-white p-8 rounded-3xl shadow-sm border space-y-8 text-slate-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold">1. Commandes</h2>
            <p>
              Le client sélectionne un pressing partenaire et dépose son linge. Le prix final est
              confirmé après pesée ou validation du forfait.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold">2. Prix et paiement</h2>
            <p>
              Les prix sont indiqués en euros TTC. Les paiements sont sécurisés via Stripe.
              Kilolab ne conserve aucune donnée bancaire.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold">3. Rétractation</h2>
            <p>
              Conformément à l’article L.221-28 du Code de la consommation,
              le Client renonce expressément à son droit de rétractation dès le début de la prestation.
            </p>
          </section>

        </div>
      </div>

      <Footer />
    </div>
  );
}