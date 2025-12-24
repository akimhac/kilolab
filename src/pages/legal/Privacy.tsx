import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />
      <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto">
        <h1 className="text-3xl font-black mb-8">Politique de Confidentialité</h1>
        
        <div className="bg-white p-8 rounded-3xl border border-slate-200 space-y-8 text-slate-600">
            <section>
                <h2 className="text-xl font-bold text-slate-900 mb-2">1. Collecte des données</h2>
                <p>Nous collectons les informations suivantes pour le bon traitement de vos commandes : Nom, Prénom, Adresse, Email, Numéro de téléphone. Ces données sont nécessaires à la logistique de collecte et livraison.</p>
            </section>

            <section>
                <h2 className="text-xl font-bold text-slate-900 mb-2">2. Utilisation des données</h2>
                <p>Vos données sont transmises uniquement à nos partenaires pressings dans le cadre strict de l'exécution de la commande. Elles ne sont jamais revendues à des tiers publicitaires.</p>
            </section>

            <section>
                <h2 className="text-xl font-bold text-slate-900 mb-2">3. Vos droits (RGPD)</h2>
                <p>Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles. Pour exercer ce droit, envoyez un email à dpo@kilolab.fr.</p>
            </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
