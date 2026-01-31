import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-32">
        <h1 className="text-4xl font-extrabold mb-2 text-slate-900">Politique de Confidentialité</h1>
        <p className="text-slate-500 mb-8">Protection de vos données personnelles (RGPD)</p>
        
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200 space-y-8 text-slate-700 text-sm md:text-base leading-relaxed">
          
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">1. Responsable du traitement</h2>
            <p>
              Les données sont collectées par Kilolab, agissant en qualité de responsable de traitement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">2. Données collectées</h2>
            <p className="font-semibold">Pour les Clients :</p>
            <ul className="list-disc pl-5 mb-4">
              <li>Identité et coordonnées (Nom, Prénom, Email, Téléphone).</li>
              <li>Adresse de collecte et de livraison (Géolocalisation nécessaire au service).</li>
              <li>Données de transaction (Historique, Montants).</li>
            </ul>
            <p className="font-semibold">Pour les Washers :</p>
            <ul className="list-disc pl-5">
              <li>Pièce d'identité (Vérification KYC).</li>
              <li>Coordonnées bancaires (Pour les virements).</li>
              <li>Données de performance (Notes, Avis, Temps de réponse).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">3. Finalité du traitement</h2>
            <p>Vos données sont utilisées exclusivement pour :</p>
            <ul className="list-disc pl-5">
              <li>Assurer la mise en relation et l'exécution de la prestation de lavage.</li>
              <li>Gérer les paiements et la facturation.</li>
              <li>Assurer la sécurité du service et la lutte contre la fraude.</li>
              <li>Vous envoyer des notifications de suivi (SMS/Email).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">4. Partage des données</h2>
            <p>
              Les données strictement nécessaires (Prénom, Adresse, Téléphone) sont transmises au Washer 
              uniquement après validation de la commande pour permettre la collecte. 
              Kilolab ne vend jamais vos données à des tiers publicitaires.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">5. Vos droits</h2>
            <p>
              Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données.
              Pour l'exercer, contactez notre DPO à : <a href="mailto:privacy@kilolab.fr" className="text-teal-600 font-bold underline">privacy@kilolab.fr</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">6. Sécurité</h2>
            <p>
              Toutes les données sensibles (bancaires, identité) sont chiffrées. 
              Nous utilisons le protocole HTTPS et des prestataires certifiés (Stripe, Supabase).
            </p>
          </section>

        </div>
      </div>
      <Footer />
    </div>
  );
}
